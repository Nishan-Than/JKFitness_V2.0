$(document).ready(function () {
    LoadMonths();
    $("#AdvanceSalary").attr("hidden", true);
    $('#btnSalaryPay').attr('disabled', 'disabled');
    $("#PaymentDate").val(getFormattedDate(new Date()));
});

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}
$(function () {

    $('#Pdate').datetimepicker({
        format: 'L'
    })
});

$('#btnSearch').click(function () {
    $("#wait").css("display", "block");

    var selectedmonth = parseInt($('#Months').val());

    if (selectedmonth == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Please slect the Salary Month",
        });
        $("#wait").css("display", "none");
    } else {
        $.ajax({
            type: 'GET',
            url: $("#GetEmployeeDetails").val(),
            dataType: 'json',
            data: { employeeid: $('#EmployeeId').val(), Month: selectedmonth },
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token'),
            },
            success: function (response) {
                var myData = jQuery.parseJSON(JSON.stringify(response));
                $("#wait").css("display", "none");
                if (myData.code == "1") {
                    $("#AdvanceSalary").attr("hidden", true);
                    var Result = myData.data;
                    $("#Fname").val(Result['firstName']);
                    $("#Lname").val(Result['lastName']);
                    $("#Branch").val(Result['branch']);
                    $("#BranchCode").val(Result['branchCode']);
                    $("#Fsalary").val(Result['fixedSalary']);
                    $("#Adamount").val(Result['totalAdvanceAmount']);
                    $("#Commission").val(Result['commishanAmount']);
                    $("#PTAmount").val(Result['ptAmount']);
                    $("#SupplimentCommission").val(Result['supplimentCommission']);
                    $("#Tamount").val(Result['totalAmount']);

                    if (Result.advancePaymentStaffs.length > 0) {

                        var tr = [];
                        for (var i = 0; i < Result.advancePaymentStaffs.length; i++) {
                            tr.push('<tr>');
                            tr.push("<td>" + getFormattedDate(new Date(Result.advancePaymentStaffs[i].paymentDate)) + "</td>");;
                            tr.push("<td>" + Result.advancePaymentStaffs[i].advancePayment.toFixed(2) + "</td>");
                            tr.push('</tr>');
                        }

                        $("#tbodyid").empty();
                        $('.tblAdvSalary').append($(tr.join('')));
                        $("#tblAdvSalary").css("display", "table");

                        $("#AdvanceSalary").attr("hidden", false);
                    }
                    $('#btnSalaryPay').removeAttr('disabled');

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: myData.message,
                    });
                    ClearForSearch();
                }
            },
            error: function (jqXHR, exception) {
            }
        });
    }
});

function LoadMonths() {
    $('#Months').find('option').remove().end();
    Salutation = $('#Months');
    var SalutationList = [
        { Id: 1, Name: "January" },
        { Id: 2, Name: "February" },
        { Id: 3, Name: "March" },
        { Id: 4, Name: "April" },
        { Id: 5, Name: "May" },
        { Id: 6, Name: "June" },
        { Id: 7, Name: "July" },
        { Id: 8, Name: "August" },
        { Id: 9, Name: "September" },
        { Id: 10, Name: "October" },
        { Id: 11, Name: "November" },
        { Id: 12, Name: "December" }
    ];
    Salutation.append($("<option/>").val(0).text("-Select Months-"))
    $.each(SalutationList, function () {
        Salutation.append($("<option/>").val(this.Id).text(this.Name));
    });
}

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

$("#btnSalaryPay").click(function () {
    $("#wait").css("display", "block");
    $("#btnSalaryPay").attr("disabled", true);
    $('.card-body').addClass('freeze');

    var fixedSalary = $('#Fsalary').val();

    if (fixedSalary == "0") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Please configure the fixed salary amount for this staff",
        });
        $("#wait").css("display", "none");
    }
    else {

        var data = new FormData();
        data.append("EmployeeId", $('#EmployeeId').val());
        data.append("SalaryDate", $('#PaymentDate').val());
        data.append("FixedSalary", $('#Fsalary').val());
        data.append("AdvancePayment", $('#Adamount').val());
        data.append("CommishanAmount", $('#Commission').val());
        data.append("PTAmount", $('#PTAmount').val());
        data.append("SupplimentCommission", $('#SupplimentCommission').val());
        data.append("TotalAmount", $('#Tamount').val());
        data.append("EmployeeName", $("#Fname").val() + ' ' + $("#Lname").val());
        data.append("Branch", $("#BranchCode").val());

        $.ajax({
            type: 'POST',
            url: $("#SaveStaffSalaryPayment").val(),
            dataType: 'json',
            data: data,
            processData: false,
            contentType: false,
            success: function (response) {
                var myData = jQuery.parseJSON(JSON.stringify(response));

                $("#wait").css("display", "none");
                $("#btnSalaryPay").attr("disabled", false);
                $('.card-body').removeClass('freeze');

                if (myData.code == "1") {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Your work has been saved',
                        showConfirmButton: false,
                        timer: 1500
                    });

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: myData.message,
                    });
                }
                Clear();
            }
        });
    }
})

$('#Commission').bind('keyup', function () {
    var value = $('#Commission').val();

    if ($.isNumeric(value)) {
        $("#Tamount").val(((parseFloat($("#Fsalary").val()) - parseFloat($("#Adamount").val())) + (parseFloat($("#Commission").val()) + (parseFloat($("#PTAmount").val()) + (parseFloat($("#SupplimentCommission").val()))))).toFixed(2));
    }
});

$('#PTAmount').bind('keyup', function () {
    var value = $('#PTAmount').val();

    if ($.isNumeric(value)) {
        $("#Tamount").val(((parseFloat($("#Fsalary").val()) - parseFloat($("#Adamount").val())) + (parseFloat($("#Commission").val()) + (parseFloat($("#PTAmount").val()) + (parseFloat($("#SupplimentCommission").val()))))).toFixed(2));
    }
});

$('#SupplimentCommission').bind('keyup', function () {
    var value = $('#SupplimentCommission').val();

    if ($.isNumeric(value)) {
        $("#Tamount").val(((parseFloat($("#Fsalary").val()) - parseFloat($("#Adamount").val())) + (parseFloat($("#Commission").val()) + (parseFloat($("#PTAmount").val()) + (parseFloat($("#SupplimentCommission").val()))))).toFixed(2));
    }
});

function Clear() {
    $('#Months').val(0);
    $("#EmployeeId").val("");
    $('#Fname').val("");
    $('#Lname').val("");
    $('#Branch').val("");
    $('#Fsalary').val("");
    $("#Commission").val("");
    $("#PTAmount").val("");
    $("#SupplimentCommission").val("");
    $("#Adamount").val("");
    $("#Tamount").val("");
    $("#PaymentDate").val(getFormattedDate(new Date()));
    $("#AdvanceSalary").attr("hidden", true);
}

function ClearForSearch() {
    $('#Fname').val("");
    $('#Lname').val("");
    $('#Branch').val("");
    $('#Fsalary').val("");
    $("#Commission").val("");
    $("#PTAmount").val("");
    $("#SupplimentCommission").val("");
    $("#Adamount").val("");
    $("#Tamount").val("");
    $("#PaymentDate").val(getFormattedDate(new Date()));
    $("#AdvanceSalary").attr("hidden", true);
}

$("#btnClear").click(function () {
    Clear();    
})

$("#Months").change(function () {
    $('#btnSalaryPay').attr('disabled', 'disabled');
});