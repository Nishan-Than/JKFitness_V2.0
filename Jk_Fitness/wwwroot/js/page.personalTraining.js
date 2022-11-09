$(document).ready(function () {
    var EmployeeArray;
    LoadBranches();
    $("#PaymentDate").val(getFormattedDate(new Date()));
    $('#StaffId').find('option').remove().end();
    StaffId = $('#StaffId');
    StaffId.append($("<option/>").val(0).text("-Select Staff Id-"));
});

$(function () {
    //Date picker
    $('#date').datetimepicker({
        format: 'L'
    })
});

function LoadBranches() {
    $('#Branch').find('option').remove().end();
    Branch = $('#Branch');

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
                Branch.append($("<option/>").val(0).text("-Select Branch-"));
                $.each(Result, function () {
                    Branch.append($("<option/>").val(this.branchCode).text(this.branchName));
                });
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

$("#btnSearch").click(function () {
    $("#wait").css("display", "block");
    $("#btnSavePay").attr("disabled", false);
    $.ajax({
        type: 'GET',
        url: $("#GetDetailsforPersonalTraining").val(),
        dataType: 'json',
        data: { memberId: parseInt($('#MebershipNo').val()) },
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            $("#wait").css("display", "none");
            if (myData.code == "1") {
                var Result = myData.data;

                $("#Branch").val(Result['branch']);
                EmployeeArray = Result.employee;

                $('#StaffId').find('option').remove().end();
                StaffId = $('#StaffId');

                $.each(EmployeeArray, function () {
                    StaffId.append($("<option/>").val(this.employeeId).text(this.employeeId));
                });

                $("#name").val(EmployeeArray[0].firstName + " " + EmployeeArray[0].lastName);
                $("#btnSave").attr("disabled", false);
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
});

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

$("#StaffId").change(function () {
    var Emp = $(this).val();
    var EmpList = $.grep(EmployeeArray, function (v) {
        return (v.employeeId.search(new RegExp(Emp, "i")) != -1);
    })
    $("#name").val(EmpList[0].firstName + " " + EmpList[0].lastName);
});

$('#btnSave').click(function () {

    var data = new FormData();
    data.append("MemberId", $('#MebershipNo').val());
    data.append("StaffId", $('#StaffId').val());
    data.append("StaffName", $('#name').val());
    data.append("Branch", $('#Branch').val());
    data.append("TrainingDate", $('#PaymentDate').val());
    data.append("TrainingAmount", $('#Tamount').val());


    if (!$('#MebershipNo').val() || !$('#name').val() || !$('#PaymentDate').val() || !$('#Tamount').val()) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Empty Value Can not be Allow!',
        });
    } else if ($('#StaffId').val() == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please Select a Value!',
        });
    } else {
        $("#wait").css("display", "block");
        $('.card-body').addClass('freeze');
        $("#btnSave").attr("disabled", true);

        $.ajax({
            type: 'POST',
            url: $("#SavePersonalTraining").val(),
            dataType: 'json',
            data: data,
            processData: false,
            contentType: false,
            success: function (response) {
                var myData = jQuery.parseJSON(JSON.stringify(response));
                $("#wait").css("display", "none");
                $('.card-body').removeClass('freeze');
                $("#btnSave").attr("disabled", false);
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
                        text: 'Something went wrong!',
                    });

                }
                Clear();
            },
            error: function (jqXHR, exception) {
            }
        });

    }
});

$("#btnClear").click(function () {
    Clear();
})

function Clear() {
    $("#MebershipNo").val("");
    $('#Branch').val(0);
    $('#StaffId').val(0);
    $('#name').val("");
    $('#Tamount').val("");
    $("#PaymentDate").val(getFormattedDate(new Date()));
 
    $("#btnSave").attr("disabled", true);
    $('.card-body').removeClass('freeze');

    $('#StaffId').find('option').remove().end();
    StaffId = $('#StaffId');
    StaffId.append($("<option/>").val(0).text("-Select Staff Id-"));
}