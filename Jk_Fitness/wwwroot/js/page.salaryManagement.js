$(document).ready(function () {
    ListEmployeeDetails();
    LoadBranchesforSearch();
    var EmployeeArray;
    var BranchArray;
    var UserTypeArray;
});

function ListEmployeeDetails() {
    
    $("#wait").css("display", "block");
    $.ajax({
        type: 'GET',
        url: $("#GetEmployeeDetailsPath").val(),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var EmpList = myData.data;
                EmployeeArray = EmpList;
                var tr = [];
                for (var i = 0; i < EmpList.length; i++) {
                    tr.push('<tr>');
                    tr.push("<td>" + EmpList[i].employeeId + "</td>");
                    tr.push("<td>" + EmpList[i].firstName + " " + EmpList[i].lastName + "</td>");;
                    tr.push("<td>" + EmpList[i].branch + "</td>");;
                    tr.push("<td>" + EmpList[i].userType + "</td>");;
                    if (EmpList[i].active == true)
                        tr.push("<td><strong style=\"color:green\">Active</strong></td>");
                    else
                        tr.push("<td><strong style=\"color:red\">Deactive</strong></td>");

                    tr.push("<td>" + EmpList[i].salary.toFixed(2) + "</td>");;
                    if ($('#edit').val() == 1 || $('#edit').val() == 2) {
                        tr.push("<td><button onclick=\"EditEmployee('" + EmpList[i].employeeId + "')\" class=\"btn btn-primary\"><i class=\"fa fa-edit\"></i> Edit </button></td>");
                        $("#Action").attr('hidden', false);
                    } else {
                        $("#Action").attr('hidden', true);
                    }

                    
                    
                    tr.push('</tr>');
                }
                $("#wait").css("display", "none");
                $("#tbodyid").empty();
                $('.tblEmployee').append($(tr.join('')));
                $("#noRecords").css("display", "none");
                $("#tblEmployee").css("display", "table");
            } else if (myData.code == "0") {
                $("#noRecords").css("display", "block");
                $("#tblEmployee").css("display", "none");

                var tr = [];
                $("#tbodyid").empty();
                $('.tblEmployee').append($(tr.join('')));
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

function EditEmployee(Id) {
   /* $('.modal-body').addClass('freeze');*/
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    $('#EmpModal').modal('show');
    $("#EmployeeId").val(Id);
    $("#btnUpdateSalary").attr("disabled", false);
    $("#SaAlert").css("display", "none");

    var EmployeeDetail = $.grep(EmployeeArray, function (v) {
        return v.employeeId == Id;
    })

    if (EmployeeDetail.length != 0) {
        var Result = EmployeeDetail[0];

        $("#EmployeeId").val(Result['employeeId']);
        $("#Salary").val(Result.salary.toFixed(2));
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        });
    }
}

function LoadBranchesforSearch() {
    $('#BranchforSearch').find('option').remove().end();
    BranchforSearch = $('#BranchforSearch');

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
                BranchforSearch.append($("<option/>").val(0).text("-Select All Branch-"));
                $.each(Result, function () {
                    BranchforSearch.append($("<option/>").val(this.branchCode).text(this.branchName));
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

$("#btnUpdateSalary").click(function () {
    $("#waitform").css("display", "block");
    $('.modal').addClass('freeze');
    $('.modal-content').addClass('freeze');
    $("#btnUpdateSalary").attr("disabled", true);
    var Salary = $("#Salary").val();
    var Id = $("#EmployeeId").val();

    var data = '{"EmployeeId":" ' + Id + '" ,"Salary":' + Salary + ' }';

    $.ajax({
        type: 'POST',
        url: $("#UpdateSalary").val(),
        dataType: 'json',
        data: data,
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            $("#waitform").css("display", "none");
            $("#btnUpdateSalary").attr("disabled", false);
            if (myData.code == "1") {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Your work has been saved',
                    showConfirmButton: false,
                    timer: 1500
                });
                ListEmployeeDetails();
                
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });
               
            }
            Cancel();
        },
        error: function (jqXHR, exception) {
        }
    });

});

function Cancel() {
    $('#EmpModal').modal('toggle');
}

$("#BranchforSearch").change(function () {
    SearchEmployee();
});

$("#NameforSearch").bind('keyup', function () {
    SearchEmployee();
});

function SearchEmployee() {
    
    $("#wait").css("display", "block");
    var Branch = $('#BranchforSearch').val();
    var FName = $('#NameforSearch').val();

    if (Branch == "0" && FName == "") {
        var EmpList = EmployeeArray;
    } else if (Branch == "0" && FName != "") {
        var EmpList = $.grep(EmployeeArray, function (v) {
            return (v.firstName.search(new RegExp(FName, "i")) != -1);
        })
    } else {
        var EmpList = $.grep(EmployeeArray, function (v) {
            return (v.branch == Branch && v.firstName.search(new RegExp(FName, "i")) != -1);
        })
    }

    if (EmpList.length != 0) {

        var tr = [];
        for (var i = 0; i < EmpList.length; i++) {
            tr.push('<tr>');
            tr.push("<td>" + EmpList[i].employeeId + "</td>");
            tr.push("<td>" + EmpList[i].firstName + " " + EmpList[i].lastName + "</td>");;
            tr.push("<td>" + EmpList[i].branch + "</td>");;
            tr.push("<td>" + EmpList[i].userType + "</td>");;
            if (EmpList[i].active == true)
                tr.push("<td><strong style=\"color:green\">Active</strong></td>");
            else
                tr.push("<td><strong style=\"color:red\">Deactive</strong></td>");

            tr.push("<td>" + EmpList[i].salary.toFixed(2) + "</td>");;
            tr.push("<td><button onclick=\"EditEmployee('" + EmpList[i].employeeId + "')\" class=\"btn btn-primary\"><i class=\"fa fa-edit\"></i> Edit </button></td>");

            tr.push('</tr>');
        }
        $("#wait").css("display", "none");
        $("#tbodyid").empty();
        $('.tblEmployee').append($(tr.join('')));
        $("#noRecords").css("display", "none");
        $("#tblEmployee").css("display", "table");
    } else {
        $("#wait").css("display", "none");
        $("#noRecords").css("display", "block");
        $("#tblEmployee").css("display", "none");

        var tr = [];
        $("#tbodyid").empty();
        $('.tblEmployee').append($(tr.join('')));
    }
}

$("#Salary").bind('keyup', function () {
    var Salary = $('#Salary').val();
    if ($.isNumeric(Salary)) {
        $("#SaAlert").css("display", "none");
        $("#btnUpdateSalary").attr("disabled", false);
    }
    else {
        $("#SaAlert").css("display", "flex");
        $("#btnUpdateSalary").attr("disabled", true);
    }
});