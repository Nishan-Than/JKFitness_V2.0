$(document).ready(function () {
    LoadMonths();
    LoadBranchesforSearch();
    var MembersPaymentsArray;
});

var TblMember = $("#tblMember").DataTable(
    {
        dom: 'Bfrtip',
        buttons: [{
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'LEGAL',
            filename: function () {
                return "Membersip Payment Report"
            },
            title: function () {
                return "Membersip Payment Report"
            },
            customize: function (doc) {
                //doc.content[1].margin = [100, 0, 100, 0] //left, top, right, bottom
            }
        },
        {
            extend: 'excelHtml5',
            filename: function () {
                return "Membersip Payment Report"
            },
            title: function () {
                return "Membersip Payment Report"
            }
        },
        {
            extend: 'print',
            filename: function () {
                return "Membersip Payment Report"
            },
            title: function () {
                return "Membersip Payment Report"
            }
        }
        ],
        pageLength: 1000,
        "aaSorting": []
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
    TblMember.clear()
        .draw();
    $.each(Result, function (key, payment) {

        var memberid;
        if (payment.paymentDetails.memberId.toString().length == 1)
            memberid = "000" + payment.paymentDetails.memberId.toString();
        else if (payment.paymentDetails.memberId.toString().length == 2)
            memberid = "00" + payment.paymentDetails.memberId.toString();
        else if (payment.paymentDetails.memberId.toString().length == 3)
            memberid = "0" + payment.paymentDetails.memberId.toString();
        else
            memberid = payment.paymentDetails.memberId;

        TblMember.row.add([
            '<label> ' + memberid + ' </label>',
            '<label> ' + payment.firstName + " " + payment.lastName + ' </label>',
            '<label> ' + payment.packageType + ' </label>',
            '<label> ' + payment.packageAmount + ' </label>',
            '<label> ' + getFormattedDate(new Date(payment.paymentDetails.paymentDate)) + ' </label>',
            '<label> Paid </label>'
        ]).draw(false);


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