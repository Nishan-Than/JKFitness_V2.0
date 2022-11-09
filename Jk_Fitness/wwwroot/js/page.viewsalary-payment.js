$(document).ready(function () {
    var StaffPaymentsArray;
    LoadMonths();
    LoadStaffPayments();

});

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


function LoadStaffPayments() {
    var Month = parseInt($('#Month').val());


    $("#wait").css("display", "block");

    $.ajax({
        type: 'GET',
        url: $("#LoadAllStaffPayments").val(),
        dataType: 'json',
        data: { month: Month },
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        contentType: 'application/json; charset=utf-8',
        success: function (response) {

            var myData = jQuery.parseJSON(JSON.stringify(response));
            $("#wait").css("display", "none");
            if (myData.code == "1") {
                var Result = myData.data;
                StaffPaymentsArray = Result;
                if (StaffPaymentsArray.length != 0) {
                    BindStaffTable(StaffPaymentsArray);
                    $("#noRecords").css("display", "none");
                    $("#tblstaff").css("display", "table");
                }
                else {
                    $("#noRecords").css("display", "block");
                    $("#tblstaff").css("display", "none");

                    var tr = [];
                    $("#tbodyid").empty();
                    $('.tblstaff').append($(tr.join('')));
                }

            } else if (myData.code == "0") {
                $("#noRecords").css("display", "block");
                $("#tblstaff").css("display", "none");

                var tr = [];
                $("#tbodyid").empty();
                $('.tblstaff').append($(tr.join('')));
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


function BindStaffTable(Result) {
    var tr = [];

    $.each(Result, function (key, payment) {
        tr.push('<tr>');
        tr.push("<td>" + payment.employeeId + "</td>");
        tr.push("<td>" + payment.firstName + "</td>");
        tr.push("<td>" + payment.branch + "</td>");
        tr.push("<td>" + payment.fixedSalary.toFixed(2) + "</td>");
        tr.push("<td>" + (payment.salaryPaymentStaffs[0].commishanAmount + payment.salaryPaymentStaffs[0].ptAmount + payment.salaryPaymentStaffs[0].supplimentCommission).toFixed(2) + "</td>");
        tr.push("<td>" + payment.salaryPaymentStaffs[0].advancePayment.toFixed(2) + "</td>");
        tr.push("<td>" + payment.salaryPaymentStaffs[0].totalAmount.toFixed(2) + "</td>");
        tr.push("<td>" + getFormattedDate(new Date(payment.salaryDate)) + "</td>");

        if (payment.advancePaymentStaffs.length > 0) {
            var td = [];
            td.push('<td>');
            td.push("<button type=\"button\" onclick=\"ViewAdvancePay('" + payment.employeeId + "')\" class=\"btn btn-primary\"><i class=\"fa fa-eye\"></i></button>");
            if ($('#delete').val() == 1 || $('#delete').val() == 2)
                td.push("<button type=\"button\" onclick=\"DeleteSalaryPayment('" + payment.salaryPaymentStaffs[0].id + "')\" class=\"btn btn-danger\"><i class=\"fa fa-trash\"></i></button>");
            td.push('</td>');

            tr.push(td.join(' '));
        }
        else {
            if ($('#delete').val() == 1 || $('#delete').val() == 2) {
                tr.push("<td><button type=\"button\" onclick=\"DeleteSalaryPayment('" + payment.salaryPaymentStaffs[0].id + "')\" class=\"btn btn-danger\"><i class=\"fa fa-trash\"></i></button></td>");
            } else {
                tr.push("<td></td>");
            }

        }
        tr.push('</tr>');
    });

    $("#tbodyid").empty();
    $('.tblstaff').append($(tr.join('')));
    $("#noRecords").css("display", "none");
    $("#tblstaff").css("display", "table");
}


function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

function ViewAdvancePay(Id) {
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    $('#AdvancePaymentModal').modal('show');

    var result = $.grep(StaffPaymentsArray, function (v) {
        return (v.employeeId.search(new RegExp(Id, "i")) != -1);
    })

    var AdvanceSalary = result[0].advancePaymentStaffs;
    var tr = [];
    for (var i = 0; i < AdvanceSalary.length; i++) {
        tr.push('<tr>');
        tr.push("<td>" + getFormattedDate(new Date(AdvanceSalary[i].paymentDate)) + "</td>");
        tr.push("<td>" + AdvanceSalary[i].advancePayment.toFixed(2) + "</td>");
        if ($('#delete').val() == 1 || $('#delete').val() == 2) {
            tr.push("<td><button type=\"button\" onclick=\"DeleteAdvancePayment('" + AdvanceSalary[i].id + "')\" class=\"btn btn-danger\"><i class=\"fa fa-trash\"></i></button></td>");
            $("#ViewAction").attr('hidden', false);
        }
        else {
            $("#ViewAction").attr('hidden', true);
        }
        tr.push('</tr>');
    }

    $("#tbodyAdvance").empty();
    $('.tblAdvance').append($(tr.join('')));
    $("#tblPayments").css("display", "table");
}

$("#Month").change(function () {
    $('#EmployeeId').val("");
    LoadStaffPayments();
});


function DeleteAdvancePayment(Id) {

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
                url: $("#DeleteAdvanceSalaryPayment").val(),
                data: { Id: parseInt(Id) },
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem('token'),
                },
                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#wait").css("display", "none");
                    $('#AdvancePaymentModal').modal('toggle');
                    LoadStaffPayments();
                    if (myData.code == "1") {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Your record has been deleted.',
                            icon: 'success',
                        });
                        ListProductDetails();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                        });
                    }

                },
                error: function (jqXHR, exception) {

                }
            });
        }
    })
}

function DeleteSalaryPayment(Id) {

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
                url: $("#DeleteSalaryPayment").val(),
                data: { Id: parseInt(Id) },
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem('token'),
                },
                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#wait").css("display", "none");
                    
                    LoadStaffPayments();
                    if (myData.code == "1") {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Your record has been deleted.',
                            icon: 'success',
                        });
                        ListProductDetails();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                        });
                    }

                },
                error: function (jqXHR, exception) {

                }
            });
        }
    })
}

$("#EmployeeId").bind('keyup', function () {
    SearchSalaryPaymentbyEmployeeId();
});


function SearchSalaryPaymentbyEmployeeId() {
    $("#wait").css("display", "block");

    var EmpId = $('#EmployeeId').val();
    var Result = $.grep(StaffPaymentsArray, function (v) {
        return (v.employeeId.search(new RegExp(EmpId, "i")) != -1);
    })

    $("#wait").css("display", "none");
    BindStaffTable(Result);

}
