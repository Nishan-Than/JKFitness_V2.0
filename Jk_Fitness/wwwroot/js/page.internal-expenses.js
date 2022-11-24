$(document).ready(function () {
    var InternalExpensesArray = [];
    var ExpensesTypesArray = [];
    var BranchArray = [];
    LoadBranchesforSearch();
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
    LoadExpensesType();
    $('.modal-body').removeClass('freeze');
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
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
                LoadExpensesType();
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
    $.ajax({
        type: 'GET',
        url: $("#GetEmployeeDetails").val(),
        dataType: 'json',
        data: { employeeid: $('#EmployeeId').val() },
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            $("#waitform").css("display", "none");
            if (myData.code == "1") {
                var Result = myData.data;
                $("#Employeename").val(Result['firstName']);

                var branch = $.grep(BranchArray, function (v) {
                    return v.branchCode == Result['branch'];
                })

                $("#EmpBranch").val(branch[0].branchName);
                $("#branchCode").val(branch[0].branchCode)

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

function LoadExpensesType() {
    $('#Expensecode').find('option').remove().end();
    Expensecode = $('#Expensecode');

    $.ajax({
        type: 'GET',
        url: $("#GetExpensesType").val(),
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var Result = myData.data;
                ExpensesTypesArray = Result;
                Expensecode.append($("<option/>").val(0).text("-Select Expense Type-"));
                $.each(Result, function () {
                    Expensecode.append($("<option/>").val(this.expenseCode).text(this.expenseName));
                });
                ExpenseType_Search();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });
            }
            ListInternalExpensesDetails();
        },
        error: function (jqXHR, exception) {
        }
    });
}

function ExpenseType_Search() {
    $('#expenseType').find('option').remove().end();
    expensesType = $('#expenseType');

    expensesType.append($("<option/>").val(0).text("-All Types-"));
    $.each(ExpensesTypesArray, function () {
        expensesType.append($("<option/>").val(this.expenseCode).text(this.expenseName));
    });
}

$('#btnAddInternalExpenses').click(function () {

    var Id = $('#Id').val();
    var Expensecode = $('#Expensecode').val();

    var data = new FormData();
    data.append("Id", $('#Id').val());
    data.append("EmployeeId", $('#EmployeeId').val());
    data.append("ExpenseCode", $('#Expensecode').val());
    data.append("ExpenseAmount", $('#ExpenseAmount').val());
    data.append("PaymentDate", $('#Paymentdate').val());
    data.append("Description", $('#Description').val());
    data.append("Branch", $('#branchCode').val());

    if (!$('#EmployeeId').val()) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Empty Value Can not be Allow!',
        });
    } else if (Expensecode == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please Select a Value!',
        });
    } else {
        $("#waitform").css("display", "block");
        $('.modal').addClass('freeze');
        $('.modal-content').addClass('freeze');
        $("#btnAddInternalExpenses").attr("disabled", true);
        if (Id == "0" || Id == "") {

            $.ajax({
                type: 'POST',
                url: $("#SaveInternalExpenses").val(),
                dataType: 'json',
                data: data,
                processData: false,
                contentType: false,
                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#waitform").css("display", "none");
                    $("#btnAddInternalExpenses").attr("disabled", false);
                    if (myData.code == "1") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        Cancel();
                        ListInternalExpensesDetails();
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
                url: $("#UpdateInternalExpenses").val(),
                dataType: 'json',
                data: data,
                processData: false,
                contentType: false,

                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#waitform").css("display", "none");
                    $("#btnAddInternalExpenses").attr("disabled", false);
                    if (myData.code == "1") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been Updated',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        Cancel();
                        ListInternalExpensesDetails();
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

function Cancel() {
    $('#IntModal').modal('toggle');
    Clear();
}

function Clear() {
    $('#EmployeeId').val('');
    $('#Employeename').val('');
    $('#ExpenseAmount').val('');
    $('#Expensecode').val(0);
    $('#Pdate').val('');
    $('#Description').val('');
    $('#EmpBranch').val('');
}

$("#btnClear").click(function () {
    Clear();
})

$("#Branch").change(function () {
    Search();
});

$("#expenseType").change(function () {
    Search();
});

function Search() {
    var Result = $.grep(InternalExpensesArray, function (v) {
        return v.branch == $('#Branch').val();
    })

    if (Result.length > 0 && $('#expenseType').val() != '0') {
        Result = $.grep(Result, function (v) {
            return v.expenseCode == $('#expenseType').val();
        })
    }

    if (Result.length > 0) {
        var tr = [];
        for (var i = 0; i < Result.length; i++) {
            var expenseType = $.grep(ExpensesTypesArray, function (v) {
                return v.expenseCode == Result[i].expenseCode;
            })

            tr.push('<tr>');
            tr.push("<td>" + Result[i].employeeId + "</td>");
            tr.push("<td>" + expenseType[0].expenseName + "</td>");
            tr.push("<td>" + Result[i].expenseAmount + " </td>");
            tr.push("<td>" + getFormattedDate(new Date(Result[i].paymentDate)) + "</td>");
            if (Result[i].description != null)
                tr.push("<td>" + Result[i].description + "</td>");
            else
                tr.push("<td></td>");




            var td = [];
            td.push('<td>');

            if ($('#edit').val() == 1 || $('#edit').val() == 2)
                td.push("<button onclick=\"EditInternalExpenses('" + Result[i].id + "')\" class=\"btn btn-primary\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Edit\"><i class=\"fa fa-edit\"></i></button>");

            if ($('#delete').val() == 1 || $('#delete').val() == 2)
                td.push("<button onclick=\"DeleteInternalExpenses('" + Result[i].id + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"><i class=\"fa fa-trash\"></i></button>");
            td.push('</td>');

            tr.push(td.join(' '));

            tr.push('</tr>');
        }

        $("#tbodyid").empty();
        $('.tblInternalExpense').append($(tr.join('')));
        $("#noRecords").css("display", "none");
        $("#tblInternalExpense").css("display", "table");
    } else {
        $("#noRecords").css("display", "block");
        $("#tblInternalExpense").css("display", "none");

        var tr = [];
        $("#tbodyid").empty();
        $('.tblInternalExpense').append($(tr.join('')));
    }

};

function ListInternalExpensesDetails() {
    $("#wait").css("display", "block");

    $.ajax({
        type: 'GET',
        url: $("#GetInternalExpenses").val(),
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        contentType: 'application/json; charset=utf-8',

        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            $("#wait").css("display", "none");
            if (myData.code == "1") {
                InternalExpensesArray = myData.data;

                var Result = $.grep(InternalExpensesArray, function (v) {
                    return v.branch == $('#Branch').val();
                })

                if (Result.length > 0 && $('#expenseType').val() != '0') {
                    Result = $.grep(Result, function (v) {
                        return v.expenseCode == $('#expenseType').val();
                    })
                }

                var tr = [];
                for (var i = 0; i < Result.length; i++) {

                    var expenseType = $.grep(ExpensesTypesArray, function (v) {
                        return v.expenseCode == Result[i].expenseCode;
                    })

                    tr.push('<tr>');
                    tr.push("<td>" + Result[i].employeeId + "</td>");
                    tr.push("<td>" + expenseType[0].expenseName + "</td>");
                    tr.push("<td>" + Result[i].expenseAmount + " </td>");
                    tr.push("<td>" + getFormattedDate(new Date(Result[i].paymentDate)) + "</td>");

                    if (Result[i].description != null)
                        tr.push("<td>" + Result[i].description + "</td>");
                    else
                        tr.push("<td></td>");


                    var td = [];
                    td.push('<td>');

                    if ($('#edit').val() == 1 || $('#edit').val() == 2)
                        td.push("<button onclick=\"EditInternalExpenses('" + Result[i].id + "')\" class=\"btn btn-primary\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Edit\"><i class=\"fa fa-edit\"></i></button>");

                    if ($('#delete').val() == 1 || $('#delete').val() == 2)
                        td.push("<button onclick=\"DeleteInternalExpenses('" + Result[i].id + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"><i class=\"fa fa-trash\"></i></button>");
                    td.push('</td>');

                    tr.push(td.join(' '));

                    tr.push('</tr>');
                }

                $("#tbodyid").empty();
                $('.tblInternalExpense').append($(tr.join('')));
                $("#noRecords").css("display", "none");
                $("#tblInternalExpense").css("display", "table");
            } else if (myData.code == "0") {
                $("#noRecords").css("display", "block");
                $("#tblInternalExpense").css("display", "none");

                var tr = [];
                $("#tbodyid").empty();
                $('.tblInternalExpense').append($(tr.join('')));
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


function DeleteInternalExpenses(Id) {

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
                url: $("#DeleteInternalExpense").val(),
                data: { internalExpensesId: parseInt(Id) },
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
                        ListInternalExpensesDetails();
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
function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

function EditInternalExpenses(Id) {
    $('.modal-body').removeClass('freeze');
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    $("#wait").css("display", "block");
    var InternalExpenses = $.grep(InternalExpensesArray, function (v) {
        return v.id == Id;
    })

    if (InternalExpenses.length != 0) {
        var Result = InternalExpenses[0];

        $("#Id").val(Result['id']);
        $("#EmployeeId").val(Result['employeeId']);
        GetEmployeeDetails();
        $("#Expensecode").val(Result['expenseCode']);
        $("#ExpenseAmount").val(Result['expenseAmount']);
        $("#Paymentdate").val(getFormattedDate(new Date(Result.paymentDate)));
        $("#Description").val(Result['description']);

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
