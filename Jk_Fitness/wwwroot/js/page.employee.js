$(document).ready(function () {
    ListEmployeeDetails();
    LoadBranchesforSearch();
    LoadUserTypesforMain();
    var EmployeeArray;
    var BranchArray;
    var UserTypeArray;
    if ($('#add').val() == "1" || $('#add').val() == "2") {
        $("#btnAdd").attr('hidden', false);
    }
    else {
        $("#btnAdd").attr('hidden', true);
    }
});

//for Time Picker
$(function () {
    //Date picker
    $('#timepicker').datetimepicker({
        format: 'LT'
    })
    $('#timepicker1').datetimepicker({
        format: 'LT'
    })
    $('#timepicker2').datetimepicker({
        format: 'LT'
    })
    $('#timepicker3').datetimepicker({
        format: 'LT'
    })
});

$('#btnAdd').click(function () {
    $('#btnAddEmployee').attr('hidden', false);
    $('#btnCancel').attr('hidden', false);
    $('.modal-body').removeClass('freeze');
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    $('#EmpModal').modal('show');
    LoadBranches();
    LoadUserTypes();
    LoadSalutation();
    $("#Branch").attr("disabled", false);
    $("#Email").attr("disabled", false);
    $('#MorningIn').val('12:00 AM');
    $('#MorningOut').val('11:59 AM');
    $('#EveningIn').val('12:00 PM');
    $('#EveningOut').val('11:59 PM');
    $("#MemFind").css("display", "flex");
});

function ListEmployeeDetails() {
    var CurEmail = JSON.parse(window.localStorage.getItem('Empl')).Email;
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
                    tr.push("<td>" + EmpList[i].firstName + "</td>");;
                    tr.push("<td>" + EmpList[i].lastName + "</td>");;
                    tr.push("<td>" + EmpList[i].branch + "</td>");;
                    tr.push("<td>" + EmpList[i].userType + "</td>");;
                    if (EmpList[i].active == true)
                        tr.push("<td><strong style=\"color:green\">Active</strong></td>");
                    else
                        tr.push("<td><strong style=\"color:red\">Deactive</strong></td>");


                    //if (CurEmail == EmpList[i].email)
                    //    tr.push("<td><button onclick=\"ViewEmployee('" + EmpList[i].employeeId + "')\" class=\"btn btn-secondary\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"View\"><i class=\"fa fa-eye\"></i></button> <button onclick=\"EditEmployee('" + EmpList[i].employeeId + "')\" class=\"btn btn-primary\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Edit\"><i class=\"fa fa-edit\"></i></button> <button onclick=\"DeleteEmployee('" + EmpList[i].employeeId + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"disabled><i class=\"fa fa-trash\"></i></button></td>");
                    //else
                    //    tr.push("<td><button onclick=\"ViewEmployee('" + EmpList[i].employeeId + "')\" class=\"btn btn-secondary\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"View\"><i class=\"fa fa-eye\"></i></button> <button onclick=\"EditEmployee('" + EmpList[i].employeeId + "')\" class=\"btn btn-primary\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Edit\"><i class=\"fa fa-edit\"></i></button> <button onclick=\"DeleteEmployee('" + EmpList[i].employeeId + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"><i class=\"fa fa-trash\"></i></button></td>");


                    var td = [];
                    td.push('<td>');
                    if ($('#view').val() == 1 || $('#view').val() == 2)
                        td.push("<button onclick=\"ViewEmployee('" + EmpList[i].employeeId + "')\" class=\"btn btn-secondary\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"View\"><i class=\"fa fa-eye\"></i></button>");

                    if ($('#edit').val() == 1 || $('#edit').val() == 2)
                        td.push("<button onclick=\"EditEmployee('" + EmpList[i].employeeId + "')\" class=\"btn btn-primary\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Edit\"><i class=\"fa fa-edit\"></i></button>");

                    if ($('#delete').val() == 1 || $('#delete').val() == 2) {
                        if (CurEmail == EmpList[i].email)
                            td.push("<button onclick=\"DeleteEmployee('" + EmpList[i].employeeId + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"disabled><i class=\"fa fa-trash\"></i></button>");
                        else
                            td.push("<button onclick=\"DeleteEmployee('" + EmpList[i].employeeId + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"><i class=\"fa fa-trash\"></i></button>");
                    }
                    td.push('</td>');

                    tr.push(td.join(' '));

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

function LoadBranches() {
    $('#Branch').find('option').remove().end();
    Branch = $('#Branch');
    Branch.append($("<option/>").val(0).text("-Select Branch-"));
    $.each(BranchArray, function () {
        Branch.append($("<option/>").val(this.branchCode).text(this.branchName));
    });
}

function LoadUserTypes() {
    $('#UserType').find('option').remove().end();
    UserType = $('#UserType');
    UserType.append($("<option/>").val(0).text("-Select UserType-"));
    $.each(UserTypeArray, function () {
        UserType.append($("<option/>").val(this.role).text(this.role));
    });
}

function LoadUserTypesforMain() {
    $('#UserType').find('option').remove().end();
    UserType = $('#UserType');

    $.ajax({
        type: 'GET',
        url: $("#GetUserTypeDetails").val(),
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var Result = myData.data;
                UserTypeArray = Result;
                UserType.append($("<option/>").val(0).text("-Select UserType-"));
                $.each(Result, function () {
                    UserType.append($("<option/>").val(this.role).text(this.role));
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

function LoadSalutation() {
    $('#Salutation').find('option').remove().end();
    Salutation = $('#Salutation');
    var SalutationList = [
        { Id: 1, Name: "Mr" },
        { Id: 2, Name: "Mrs" },
        { Id: 3, Name: "Ms" },
        { Id: 4, Name: "Miss" },
        { Id: 5, Name: "Dr" },
        { Id: 6, Name: "Professor" }
    ];
    Salutation.append($("<option/>").val(0).text("-Select Salutation-"))
    $.each(SalutationList, function () {
        Salutation.append($("<option/>").val(this.Name).text(this.Name));
    });
}


$('#btnAddEmployee').click(function () {

    var files = $('#imageBrowes').prop("files");
    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
    }

    var Emp = {
        EmployeeId: $('#EmployeeId').val(),
        Salutation: $('#Salutation').val(),
        FirstName: $('#Fname').val(),
        LastName: $('#Lname').val(),
        HouseNo: $('#HouseNo').val(),
        Street: $('#Street').val(),
        District: $('#District').val(),
        Province: $('#Province').val(),
        Email: $('#Email').val(),
        PhoneNo: $('#ContactNo').val(),
        Branch: $('#Branch').val(),
        UserType: $('#UserType').val(),
        MorningInTime: $('#MorningIn').val(),
        MorningOutTime: $('#MorningOut').val(),
        EveningInTime: $('#EveningIn').val(),
        EveningOutTime: $('#EveningOut').val(),
        Active: $('#Status').prop('checked') ? "true" : "false"
    };
    formData.append("Employee", JSON.stringify(Emp));


    if (!$('#Fname').val() || !$('#Lname').val() || !$('#Email').val() || !$('#MorningIn').val() || !$('#MorningOut').val() || !$('#EveningIn').val() || !$('#EveningOut').val()) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Empty Value Can not be Allow!',
        });
    } else if (Salutation == 0 || Branch == 0 || UserType == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please Select a Value!',
        });
    } else {
        $("#waitform").css("display", "block");
        $('.modal').addClass('freeze');
        $('.modal-content').addClass('freeze');
        $("#btnAddEmployee").attr("disabled", true);
        if ($('#EmployeeId').val() == "0" || $('#EmployeeId').val() == "") {

            $.ajax({
                type: 'POST',
                url: $("#SaveEmployees").val(),
                dataType: 'json',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#waitform").css("display", "none");
                    $("#btnAddEmployee").attr("disabled", false);
                    if (myData.code == "1") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        Cancel();
                        ListEmployeeDetails();

                    } else if (myData.code == "0") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Email Duplicated!',
                        });
                        Cancel();
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
                url: $("#UpdateEmployees").val(),
                dataType: 'json',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#waitform").css("display", "none");
                    $("#btnAddEmployee").attr("disabled", false);
                    if (myData.code == "1") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been Updated',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        Cancel();
                        ListEmployeeDetails();
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

function ViewEmployee(Id) {

    $('#btnAddEmployee').attr('hidden', true);
    $('#btnCancel').attr('hidden', true);
    $('.modal-body').addClass('freeze');
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    $("#wait").css("display", "block");
    $("#MemFind").css("display", "none");

    LoadBranches();
    LoadUserTypes();
    LoadSalutation();

    $("#Branch").attr("disabled", true);
    $("#Email").attr("disabled", true);

    var EmployeeDetail = $.grep(EmployeeArray, function (v) {
        return v.employeeId == Id;
    })

    if (EmployeeDetail.length != 0) {
        var Result = EmployeeDetail[0];

        $("#Salutation").val(Result['salutation']);
        $("#Fname").val(Result['firstName']);
        $("#Lname").val(Result['lastName']);
        $("#HouseNo").val(Result['houseNo']);
        $("#Street").val(Result['street']);
        $("#District").val(Result['district']);
        $("#Province").val(Result['province']);
        $("#Email").val(Result['email']);
        $("#ContactNo").val(Result['phoneNo']);
        $("#Branch").val(Result['branch']);
        $("#UserType").val(Result['userType']);
        $("#MorningIn").val(Result['morningInTime']);
        $("#MorningOut").val(Result['morningOutTime']);
        $("#EveningIn").val(Result['eveningInTime']);
        $("#EveningOut").val(Result['eveningOutTime']);
        $("#Status").prop("checked", Result.active)
        $("#EmployeeId").val(Result['employeeId']);
        if (Result.image != null) {
            $('#targetImg').attr("src", "data:image/jgp;base64," + Result.image + "");
        }
        else {
            $('#targetImg').attr("src", "dist/img/default.jpg");
        }
        $("#wait").css("display", "none");
        $('#EmpModal').modal('show');
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        });
    }
}


function EditEmployee(Id) {
    $('#btnAddEmployee').attr('hidden', false);
    $('#btnCancel').attr('hidden', false);
    $('.modal-body').removeClass('freeze');
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    $("#wait").css("display", "block");
    $("#MemFind").css("display", "none");

    LoadBranches();
    LoadUserTypes();
    LoadSalutation();

    $("#Branch").attr("disabled", true);
    $("#Email").attr("disabled", true);

    var EmployeeDetail = $.grep(EmployeeArray, function (v) {
        return v.employeeId == Id;
    })

    if (EmployeeDetail.length != 0) {
        var Result = EmployeeDetail[0];

        $("#Salutation").val(Result['salutation']);
        $("#Fname").val(Result['firstName']);
        $("#Lname").val(Result['lastName']);
        $("#HouseNo").val(Result['houseNo']);
        $("#Street").val(Result['street']);
        $("#District").val(Result['district']);
        $("#Province").val(Result['province']);
        $("#Email").val(Result['email']);
        $("#ContactNo").val(Result['phoneNo']);
        $("#Branch").val(Result['branch']);
        $("#UserType").val(Result['userType']);
        $("#MorningIn").val(Result['morningInTime']);
        $("#MorningOut").val(Result['morningOutTime']);
        $("#EveningIn").val(Result['eveningInTime']);
        $("#EveningOut").val(Result['eveningOutTime']);
        $("#Status").prop("checked", Result.active)
        $("#EmployeeId").val(Result['employeeId']);
        if (Result.image != null) {
            $('#targetImg').attr("src", "data:image/jgp;base64," + Result.image + "");
        }
        else {
            $('#targetImg').attr("src", "dist/img/default.jpg");
        }
        $("#wait").css("display", "none");
        $('#EmpModal').modal('show');
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        });
    }
}

function DeleteEmployee(Id) {

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
            $("#waitform").css("display", "block");
            $.ajax({
                type: 'POST',
                url: $("#DeleteEmployees").val(),
                dataType: 'json',
                data: '{"EmployeeId": "' + Id + '"}',
                contentType: 'application/json; charset=utf-8',
                success: function (response) {
                    $("#waitform").css("display", "none");
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    if (myData.code == "1") {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Your record has been deleted.',
                            icon: 'success',
                        });
                        ListEmployeeDetails();
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

$("#BranchforSearch").change(function () {
    SearchEmployee();
});

$("#NameforSearch").bind('keyup', function () {
    SearchEmployee();
});

function SearchEmployee() {
    var CurEmail = JSON.parse(window.localStorage.getItem('Empl')).Email;
    $("#waitform").css("display", "block");
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
            tr.push("<td>" + EmpList[i].firstName + "</td>");
            tr.push("<td>" + EmpList[i].lastName + "</td>");
            tr.push("<td>" + EmpList[i].branch + "</td>");
            tr.push("<td>" + EmpList[i].userType + "</td>");
            if (EmpList[i].active == true)
                tr.push("<td><strong style=\"color:green\">Active</strong></td>");
            else
                tr.push("<td><strong style=\"color:red\">Deactive</strong></td>");
           
            var td = [];
            td.push('<td>');
            if ($('#view').val() == 1 || $('#view').val() == 2)
                td.push("<button onclick=\"ViewEmployee('" + EmpList[i].employeeId + "')\" class=\"btn btn-secondary\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"View\"><i class=\"fa fa-eye\"></i></button>");

            if ($('#edit').val() == 1 || $('#edit').val() == 2)
                td.push("<button onclick=\"EditEmployee('" + EmpList[i].employeeId + "')\" class=\"btn btn-primary\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Edit\"><i class=\"fa fa-edit\"></i></button>");

            if ($('#delete').val() == 1 || $('#delete').val() == 2) {
                if (CurEmail == EmpList[i].email)
                    td.push("<button onclick=\"DeleteEmployee('" + EmpList[i].employeeId + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"disabled><i class=\"fa fa-trash\"></i></button>");
                else
                    td.push("<button onclick=\"DeleteEmployee('" + EmpList[i].employeeId + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"><i class=\"fa fa-trash\"></i></button>");
            }
            td.push('</td>');

            tr.push(td.join(' '));
            tr.push('</tr>');
        }
        $("#waitform").css("display", "none");
        $("#tbodyid").empty();
        $('.tblEmployee').append($(tr.join('')));
        $("#noRecords").css("display", "none");
        $("#tblEmployee").css("display", "table");
    } else {
        $("#noRecords").css("display", "block");
        $("#tblEmployee").css("display", "none");

        var tr = [];
        $("#tbodyid").empty();
        $('.tblEmployee').append($(tr.join('')));
    }
}

function Clear() {
    $('#EmployeeId').val('');
    $('#Salutation').val(0);
    $('#Fname').val('');
    $('#Lname').val('');
    $('#HouseNo').val('');
    $('#Street').val('');
    $('#District').val('');
    $('#Province').val('');
    $('#Email').val('');
    $('#ContactNo').val('');
    $('#Branch').val(0);
    $('#UserType').val(0);
    $('#MorningIn').val('12:00 AM');
    $('#MorningOut').val('11:59 AM');
    $('#EveningIn').val('12:00 PM');
    $('#EveningOut').val('11:59 PM');
    $('#Status').prop('checked', true);
    $('#targetImg').attr("src", "dist/img/default.jpg");
    $('#MebershipNo').val('')
}

function Cancel() {
    $('#EmpModal').modal('toggle');
    /* Clear();*/
    $('#formUser').trigger("reset");
    $('#imageBrowes').next('.custom-file-label').html("Choose File....");
    $('#Status').prop('checked', true);
    $('#targetImg').attr("src", "dist/img/default.jpg");
    $('#EmployeeId').val('');
    $("#ContactAlert").css("display", "none");
    $("#EmailAlert").css("display", "none");
    $("#EmailUniqueAlert").css("display", "none");
    $("#btnAddEmployee").attr("disabled", false);
}

$('#imageBrowes').change(function (event) {
    var files = event.target.files;
    if (files.length > 0) {
        $('#targetImg').attr('src', window.URL.createObjectURL(files[0]));
        $(this).next('.custom-file-label').html(files[0].name);
    }
});

$('#ContactNo').bind('keyup', function () {

    var Valid = PhoneNumberValidate($('#ContactNo').val());
    if (Valid) {
        $("#ContactAlert").css("display", "none");
        $("#btnAddEmployee").attr("disabled", false);
    }
    else {
        $("#ContactAlert").css("display", "flex");
        $("#btnAddEmployee").attr("disabled", true);
    }
});

$('#Email').bind('keyup', function () {

    var Valid = validateEmail($('#Email').val());
    if (Valid) {
        $("#EmailAlert").css("display", "none");
        var EmpList = $.grep(EmployeeArray, function (v) {
            return (v.email.search(new RegExp($('#Email').val(), "i")) != -1);
        })
        if (EmpList.length != 0) {
            $("#EmailUniqueAlert").css("display", "flex");
            $("#btnAddEmployee").attr("disabled", true);
        }
        else {
            $("#EmailUniqueAlert").css("display", "none");
            $("#btnAddEmployee").attr("disabled", false);
        }

    }
    else {
        $("#EmailAlert").css("display", "flex");
        $("#btnAddEmployee").attr("disabled", true);
    }
});

function PhoneNumberValidate(Num) {
    var filter = /^(?:0|94|\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6}$/;
    return filter.test(Num.trim());
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

$("#btnSearch").click(function () {
    $("#waitform").css("display", "block");
    $.ajax({
        type: 'GET',
        url: $("#GetMemberDetails").val(),
        dataType: 'json',
        data: { memberId: parseInt($('#MebershipNo').val()) },
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
                $("#HouseNo").val(Result['houseNo']);
                $("#Street").val(Result['street']);
                $("#District").val(Result['district']);
                $("#Province").val(Result['province']);
                $("#Email").val(Result['email']);
                $("#ContactNo").val(Result['contactNo']);
                $("#Branch").val(Result['branch']);

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

$("#btnClear").click(function () {
    Clear();
})
