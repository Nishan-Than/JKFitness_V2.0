$(document).ready(function () {
    LoadMonths();
    LoadBranchesforSearch();
    var MembersPaymentsArray;
});

function LoadBranchesforSearch() {
    $('#Branch').find('option').remove().end();
    Branch = $('#Branch');
    BranchArray = [];
    $.ajax({
        type: 'GET',
        url: $("#GetBranchDetails").val(),
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var Result = myData.data;
                BranchArray = Result;

                $.each(Result, function () {
                    Branch.append($("<option/>").val(this.branchCode).text(this.branchName));
                });

                $.ajax({
                    type: 'GET',
                    url: $("#GetStartandEndYear").val(),
                    dataType: 'json',
                    headers: {
                        "Authorization": "Bearer " + sessionStorage.getItem('token'),
                    },
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
                        var myData = jQuery.parseJSON(JSON.stringify(response));
                        if (myData.code == "1") {
                            LoadYear(myData.data.startYear, myData.data.endYear)
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: myData.message,
                            });
                        }
                    },
                    error: function (jqXHR, exception) {
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: myData.message,
                });
            }
        },
        error: function (jqXHR, exception) {
        }
    });
}

function LoadYear(stratYear, endYear) {
    let year_satart = parseInt(stratYear);
    let year_end = parseInt(endYear); // current year
    let year_selected = year_end;

    let option = '';

    for (let i = year_satart; i <= year_end; i++) {
        let selected = (i === year_selected ? ' selected' : '');
        option += '<option value="' + i + '"' + selected + '>' + i + '</option>';
    }

    document.getElementById("Year").innerHTML = option;
    LoadMembershipPayments();
}

function LoadMonths() {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var month_selected = (new Date).getMonth(); // current month
    var option = '';

    for (let i = 0; i < months.length; i++) {
        let month_number = (i + 1);

        // value month number with 0. [01 02 03 04..]
        //let month = (month_number <= 9) ? '0' + month_number : month_number;

        // or value month number. [1 2 3 4..]
        let month = month_number;

        // or value month names. [January February]
        // let month = months[i];

        let selected = (i === month_selected ? ' selected' : '');
        option += '<option value="' + month + '"' + selected + '>' + months[i] + '</option>';
    }
    document.getElementById("Month").innerHTML = option;
}

function LoadMembershipPayments() {
    var Branch = $('#Branch').val();
    var Year = parseInt($('#Year').val());
    var Month = parseInt($('#Month').val());


    $("#wait").css("display", "block");

    $.ajax({
        type: 'GET',
        url: $("#LoadAllMembershipPayments").val(),
        dataType: 'json',
        data: { branch: Branch, year: Year, month: Month },
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        contentType: 'application/json; charset=utf-8',
        success: function (response) {

            var myData = jQuery.parseJSON(JSON.stringify(response));
            $("#wait").css("display", "none");
            if (myData.code == "1") {
                var Result = myData.data;
                MembersPaymentsArray = Result;
                if (MembersPaymentsArray.length != 0) {
                    BindMembershipTable(MembersPaymentsArray);
                    $("#noRecords").css("display", "none");
                    $("#tblMember").css("display", "table");
                }
                else {
                    $("#noRecords").css("display", "block");
                    $("#tblMember").css("display", "none");

                    var tr = [];
                    $("#tbodyid").empty();
                    $('.tblMember').append($(tr.join('')));
                }

            } else if (myData.code == "0") {
                $("#noRecords").css("display", "block");
                $("#tblMember").css("display", "none");

                var tr = [];
                $("#tbodyid").empty();
                $('.tblMember').append($(tr.join('')));
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: myData.message,
                });
            }

        },
        error: function (jqXHR, exception) {

        }
    });
}

function BindMembershipTable(Result) {
    var tr = [];

    $.each(Result, function (key, payment) {
        tr.push('<tr>');

        if (payment.paymentDetails.memberId.toString().length == 1)
            tr.push("<td>" + "000" + payment.paymentDetails.memberId.toString() + "</td>");
        else if (payment.paymentDetails.memberId.toString().length == 2)
            tr.push("<td>" + "00" + payment.paymentDetails.memberId.toString() + "</td>");
        else if (payment.paymentDetails.memberId.toString().length == 3)
            tr.push("<td>" + "0" + payment.paymentDetails.memberId.toString() + "</td>");
        else
            tr.push("<td>" + payment.paymentDetails.memberId + "</td>");

        tr.push("<td>" + payment.firstName + " " + payment.lastName + "</td>");
        tr.push("<td>" + payment.packageType + "</td>");
        tr.push("<td>" + payment.packageAmount + "</td>");
        tr.push("<td>" + getFormattedDate(new Date(payment.paymentDetails.paymentDate)) + "</td>");

        if (payment.isPartialPayment == true) {
            tr.push("<td><strong style=\"color:orange\">Partialy Paid</strong></td>");
            var td = [];
            td.push('<td>');
            td.push("<button type=\"button\" onclick=\"ViewPartialPay('" + payment.paymentDetails.id + "')\" class=\"btn btn-primary\"><i class=\"fa fa-eye\"></i></button>");
            if ($('#delete').val() == 1 || $('#delete').val() == 2)
                td.push("<button type=\"button\" onclick=\"DeleteMemberPayment('" + payment.paymentDetails.id + "')\" class=\"btn btn-danger\"><i class=\"fa fa-trash\"></i></button>");
            td.push('</td>');

            tr.push(td.join(' '));
        }
        else {
            if (payment.isAdvancePayment == true)
                tr.push("<td><strong style=\"color:indigo\">Advance Paid</strong></td>");
            else
                tr.push("<td><strong style=\"color:green\">Paid</strong></td>");
            if ($('#delete').val() == 1 || $('#delete').val() == 2) {
                tr.push("<td><button type=\"button\" onclick=\"DeleteMemberPayment('" + payment.paymentDetails.id + "')\" class=\"btn btn-danger\"><i class=\"fa fa-trash\"></i></button></td>");
            } else {
                tr.push("<td></td>");
            }

        }
        tr.push('</tr>');
    });

    $("#tbodyid").empty();
    $('.tblMember').append($(tr.join('')));
    $("#noRecords").css("display", "none");
    $("#tblMember").css("display", "table");
}

$("#Branch").change(function () {
    LoadMembershipPayments();
});

$("#Year").change(function () {
    LoadMembershipPayments();
});

$("#Month").change(function () {
    LoadMembershipPayments();
});

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

function ViewPartialPay(Id) {
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    $('#PartialPaymentModal').modal('show');

    var paymentDetails = $.grep(MembersPaymentsArray, function (v) {
        return v.paymentDetails.id == parseInt(Id);
    })
    var tr = [];
    for (var i = 0; i < paymentDetails[0].partialPayments.length; i++) {
        tr.push('<tr>');
        tr.push("<td>" + getFormattedDate(new Date(paymentDetails[0].partialPayments[i].paymentDate)) + "</td>");
        tr.push("<td>" + paymentDetails[0].partialPayments[i].paidAmount.toFixed(2) + "</td>");
        if ($('#delete').val() == 1 || $('#delete').val() == 2) {
            tr.push("<td><button type=\"button\" onclick=\"DeletePartialPayment('" + paymentDetails[0].partialPayments[i].id + "', '" + paymentDetails[0].paymentDetails.id + "')\" class=\"btn btn-danger\"><i class=\"fa fa-trash\"></i></button></td>");
            $("#ViewAction").attr('hidden', false);
        }
        else {
            $("#ViewAction").attr('hidden', true);
        }
        tr.push('</tr>');
    }

    $("#tbodyPartial").empty();
    $('.tblPartial').append($(tr.join('')));
    $("#tblPayments").css("display", "table");
}

function DeletePartialPayment(partialPaymentId, paymentId) {

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {
            $("#wait").css("display", "block");

            $.ajax({
                type: 'POST',
                url: $("#DeletePartialPaymentById").val(),
                data: { partialPayid: parseInt(partialPaymentId) },
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem('token'),
                },
                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#wait").css("display", "none");
                    if (myData.code == "1") {
                        $.each(MembersPaymentsArray, function (key, payment) {
                            if (payment.paymentDetails.id == parseInt(paymentId)) {

                                var index = payment.partialPayments.findIndex(function (o) {
                                    return o.id === parseInt(partialPaymentId);
                                });

                                if (index !== -1) {
                                    payment.partialPayments.splice(index, 1);
                                    ViewPartialPay(parseInt(paymentId));
                                }

                            }
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: myData.message,
                        });
                    }

                },
                error: function (jqXHR, exception) {

                }
            });
        }
    })
}

function DeleteMemberPayment(paymentId) {

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {
            $("#wait").css("display", "block");
            $.ajax({
                type: 'POST',
                url: $("#DeleteMembershipPaymentById").val(),
                data: { paymentid: parseInt(paymentId) },
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem('token'),
                },
                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#wait").css("display", "none");

                    if (myData.code == "1") {
                        var index = MembersPaymentsArray.findIndex(function (o) {
                            return o.paymentDetails.id === parseInt(paymentId);
                        });

                        if (index !== -1) {
                            MembersPaymentsArray.splice(index, 1);
                        }
                        BindMembershipTable(MembersPaymentsArray);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: myData.message,
                        });
                    }

                },
                error: function (jqXHR, exception) {

                }
            });
        }
    })
}

function Cancel() {
    $('#PartialPaymentModal').modal('toggle');
}

$("#MName").bind('keyup', function () {
    SearchMemberAttendance();
});

function SearchMemberAttendance() {
    $("#wait").css("display", "block");

    var Name = $('#MName').val();
    var Result = $.grep(MembersPaymentsArray, function (v) {
        return (v.firstName.search(new RegExp(Name, "i")) != -1 || v.lastName.search(new RegExp(Name, "i")) != -1);
    })
    $("#wait").css("display", "none");
    if (Result.length != 0) {

        var tr = [];

        $.each(Result, function (key, payment) {
            tr.push('<tr>');
            if (payment.paymentDetails.memberId.toString().length == 1)
                tr.push("<td>" + "000" + payment.paymentDetails.memberId.toString() + "</td>");
            else if (payment.paymentDetails.memberId.toString().length == 2)
                tr.push("<td>" + "00" + payment.paymentDetails.memberId.toString() + "</td>");
            else if (payment.paymentDetails.memberId.toString().length == 3)
                tr.push("<td>" + "0" + payment.paymentDetails.memberId.toString() + "</td>");
            else
                tr.push("<td>" + payment.paymentDetails.memberId + "</td>");

            tr.push("<td>" + payment.firstName + " " + payment.lastName + "</td>");
            tr.push("<td>" + payment.packageType + "</td>");
            tr.push("<td>" + payment.packageAmount + "</td>");
            tr.push("<td>" + getFormattedDate(new Date(payment.paymentDetails.paymentDate)) + "</td>");

            if (payment.isPartialPayment == true) {
                tr.push("<td><strong style=\"color:orange\">Partialy Paid</strong></td>");
                tr.push("<td><button type=\"button\" onclick=\"ViewPartialPay('" + payment.paymentDetails.id + "')\" class=\"btn btn-primary\"><i class=\"fa fa-eye\"></i></button>  <button type=\"button\" onclick=\"DeleteMemberPayment('" + payment.paymentDetails.id + "')\" class=\"btn btn-danger\"><i class=\"fa fa-trash\"></i></button></td>");
            }
            else {
                tr.push("<td><strong style=\"color:green\">Paid</strong></td>");
                tr.push("<td><button type=\"button\" onclick=\"DeleteMemberPayment('" + payment.paymentDetails.id + "')\" class=\"btn btn-danger\"><i class=\"fa fa-trash\"></i></button></td>");
            }
            tr.push('</tr>');
        });

        $("#tbodyid").empty();
        $('.tblMember').append($(tr.join('')));
        $("#noRecords").css("display", "none");
        $("#tblMember").css("display", "table");
    } else {
        $("#noRecords").css("display", "block");
        $("#tblMember").css("display", "none");

        var tr = [];
        $("#tbodyid").empty();
        $('.tblMember').append($(tr.join('')));
    }

}

