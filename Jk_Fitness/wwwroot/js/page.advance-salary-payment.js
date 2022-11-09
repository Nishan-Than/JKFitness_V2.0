$(document).ready(function () {
    var SalaryPaymentArray = [];
    var BranchArray = [];
    LoadBranchesforSearch();
    ListAdvanceSalaryDetails();
    if ($('#add').val() == "1" || $('#add').val() == "2") {
        $("#btnAdd").attr('hidden', false);
    }
    else {
        $("#btnAdd").attr('hidden', true);
    }
});

$(function () {

    $('#Pdate').datetimepicker({
        format: 'L'
    })
});

$('#btnAdd').click(function () {
    $('.modal-body').removeClass('freeze');
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    Clear();
    $("#Paymentdate").val(getFormattedDate(new Date()));
    $('#IntModal').modal('show');

});

$('#btnSearch').click(function () {
    $("#waitform").css("display", "block");

    GetEmployeeDetails();
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

function GetEmployeeDetails() {
    var month = (1 + new Date($('#Paymentdate').val()).getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    $.ajax({
        type: 'GET',
        url: $("#GetEmployeeDetails").val(),
        dataType: 'json',
        data: { employeeid: $('#EmployeeId').val(), Month: parseInt(month) },
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            $("#waitform").css("display", "none");
            if (myData.code == "1") {
                var Result = myData.data;
                $("#Fname").val(Result['firstName']);
                $("#Lname").val(Result['lastName']);
                var branch = $.grep(BranchArray, function (v) {
                    return v.branchName == Result['branch'];
                })

                $("#EmpBranch").val(branch[0].branchName);
                $("#branchCode").val(branch[0].branchCode)
                $("#Fsalary").val(Result['fixedSalary']);
                $("#Balance").val(Result['totalAmount']);

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

function Cancel() {
    $('#IntModal').modal('toggle');
    Clear();
}

function Clear() {
    $('#EmployeeId').val('');
    $('#Fname').val('');
    $('#Lname').val('');
    $('#Amount').val('');
    $('#Paymentdate').val('');
    $('#Description').val('');
    $('#EmpBranch').val('');
    $('#Fsalary').val('');
    $('#Balance').val('');
}

$("#btnClear").click(function () {
    Clear();
})

$('#btnSaveAdvanceSalary').click(function () {

    var Id = $('#Id').val();
    

    var data = new FormData();
    data.append("Id", $('#Id').val());
    data.append("EmployeeId", $('#EmployeeId').val());
    data.append("AdvancePayment", $('#Amount').val());
    data.append("PaymentDate", $('#Paymentdate').val());
    data.append("Comment", $('#Description').val());
    data.append("CreatedBy", $('#CreatedBy').val());
    data.append("CreatedDate", $('#CreatedDate').val());

    if (!$('#EmployeeId').val()) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Empty Value Can not be Allow!',
        });
    } else {
        $("#waitform").css("display", "block");
        $('.modal').addClass('freeze');
        $('.modal-content').addClass('freeze');
        $("#btnSaveAdvanceSalary").attr("disabled", true);
        if (Id == "0" || Id == "") {

            $.ajax({
                type: 'POST',
                url: $("#SaveAdvanceSalaryPayment").val(),
                dataType: 'json',
                data: data,
                processData: false,
                contentType: false,
                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#waitform").css("display", "none");
                    $("#btnSaveAdvanceSalary").attr("disabled", false);
                    $('.card-body').removeClass('freeze');
                    if (myData.code == "1") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        Cancel();
                        ListAdvanceSalaryDetails();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                        });
                        Cancel();
                    }
                },
                error: function (jqXHR, exception) {
                }
            });

        }
        else {

            $.ajax({
                type: 'POST',
                url: $("#UpdateAdvanceSalaryPayment").val(),
                dataType: 'json',
                data: data,
                processData: false,
                contentType: false,

                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#waitform").css("display", "none");
                    $("#btnSaveAdvanceSalary").attr("disabled", false);
                    if (myData.code == "1") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been Updated',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        Cancel();
                        ListAdvanceSalaryDetails();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                        });
                        Cancel();
                    }
                },
                error: function (jqXHR, exception) {
                }
            });

        }
    }
});


function ListAdvanceSalaryDetails() {
    $("#wait").css("display", "block");

    $.ajax({
        type: 'GET',
        url: $("#LoadAdvanceSalaryPayment").val(),
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        contentType: 'application/json; charset=utf-8',

        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            $("#wait").css("display", "none");
            if (myData.code == "1") {
                SalaryPaymentArray = myData.data;
                var Result = myData.data;
                //var Result = $.grep(SalaryPaymentArray, function (v) {
                //    return v.branch == $('#Branch').val();
                //})

                var tr = [];
                for (var i = 0; i < Result.length; i++) {

                    tr.push('<tr>');
                    tr.push("<td>" + Result[i].employeeId + "</td>");
                    tr.push("<td>" + Result[i].advancePayment + "</td>");
                    tr.push("<td>" + getFormattedDate(new Date(Result[i].paymentDate)) + "</td>");
                    tr.push("<td>" + Result[i].comment + "</td>");


                    var td = [];
                    td.push('<td>');

                    if ($('#edit').val() == 1 || $('#edit').val() == 2)
                        td.push("<button onclick=\"EditAdvanceSalary('" + Result[i].id + "')\" class=\"btn btn-primary\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Edit\"><i class=\"fa fa-edit\"></i></button>");

                    if ($('#delete').val() == 1 || $('#delete').val() == 2)
                        td.push("<button onclick=\"DeleteAdvanceSalary('" + Result[i].id + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"><i class=\"fa fa-trash\"></i></button>");
                    td.push('</td>');

                    tr.push(td.join(' '));

                    tr.push('</tr>');
                }

                $("#tbodyid").empty();
                $('.tblAdvanceSalary').append($(tr.join('')));
                $("#noRecords").css("display", "none");
                $("#tblAdvanceSalary").css("display", "table");
            } else if (myData.code == "0") {
                $("#noRecords").css("display", "block");
                $("#tblAdvanceSalary").css("display", "none");

                var tr = [];
                $("#tbodyid").empty();
                $('.tblAdvanceSalary').append($(tr.join('')));
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

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

function EditAdvanceSalary(Id) {
    $('.modal-body').removeClass('freeze');
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    $("#wait").css("display", "block");
    var AdvanceSalaryPaymentArray = $.grep(SalaryPaymentArray, function (v) {
        return v.id == Id;
    })

    if (AdvanceSalaryPaymentArray.length != 0) {
        var Result = AdvanceSalaryPaymentArray[0];

        $("#Id").val(Result['id']);
        $("#EmployeeId").val(Result['employeeId']);
       
       
        $("#Amount").val(Result['advancePayment']);
        $("#Paymentdate").val(getFormattedDate(new Date(Result.paymentDate)));
        $("#Description").val(Result['comment']);
        $("#CreatedBy").val(Result['createdBy']);
        $("#CreatedDate").val(Result['createdDate']);

        GetEmployeeDetails();
        $("#wait").css("display", "none");
        $('#IntModal').modal('show');
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        });
    }
}

function DeleteAdvanceSalary(Id) {

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
                    if (myData.code == "1") {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Your record has been deleted.',
                            icon: 'success',
                        });
                        ListAdvanceSalaryDetails();
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
