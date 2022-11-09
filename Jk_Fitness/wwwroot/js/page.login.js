$('#SignIn').click(function () {

    var username = $('#UsrName').val();
    var password = $('#Pasword').val();

    if (username.trim() == "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill out UserName Field!',
        });
    }
    else if (password.trim() == "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill out PassWord Field!',
        });
    }
    else {
        $("#wait").css("display", "block");
        $("#SignIn").attr("disabled", true);
        $.ajax({
            type: 'POST',
            url: $("#ValidateLogin").val(),
            dataType: 'json',
            data: '{"Email":" ' + username + ' ","Password":" ' + password + ' "}',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                $("#wait").css("display", "none");
                $("#SignIn").attr("disabled", false);
                var myData = jQuery.parseJSON(JSON.stringify(response));
                if (myData.code == "1") {
                    var Result = myData.data;
                    const Employee = {
                        Name: Result.firstName,
                        Email: Result.email,
                        Image: Result.image,
                    }
                    window.localStorage.setItem('Empl', JSON.stringify(Employee));
                    if (Result.isFirstTime) {
                        $('#ResetPasswordModel').modal('show');
                        $("#EmployeeId").val(Result['employeeId']);
                    }
                    else {
                        window.location.replace($("#HomePath").val());
                    }
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

});

$('#btnPwdUpdate').click(function () {
    var EmpID = $('#EmployeeId').val();
    var CurPwd = $('#CurPassword').val();
    var Pwd = $('#Password').val();
    var ConPwd = $('#ConfirmPasswordTxt').val();

    if (Pwd.trim() == ConPwd.trim()) {
        $("#Modelwait").css("display", "block");
        $("#btnPwdUpdate").attr("disabled", true);
        $.ajax({
            type: 'POST',
            url: $("#ConfirmPassword").val(),
            dataType: 'json',
            data: '{"EmployeeId":" ' + EmpID + ' ","Password":" ' + CurPwd + ' "}',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {

                var myData = jQuery.parseJSON(JSON.stringify(response));
                if (myData.code == "1") {

                    $.ajax({
                        type: 'POST',
                        url: $("#UpdatePassword").val(),
                        dataType: 'json',
                        data: '{"EmployeeId":" ' + EmpID + ' ","Password":" ' + Pwd + ' "}',
                        contentType: 'application/json; charset=utf-8',
                        success: function (response) {
                            var myData = jQuery.parseJSON(JSON.stringify(response));
                            $("#Modelwait").css("display", "none");
                            $("#btnPwdUpdate").attr("disabled", false);
                            if (myData.code == "1") {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Updated!',
                                    text: 'Successfully Password Updated!',
                                });
                                window.location.replace($("#HomePath").val());
                            }
                            else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Update Failed!',
                                });
                            }
                        },
                        error: function (jqXHR, exception) {
                        }
                    });


                } else if (myData.code == "0" && myData.message == "Invalid") {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Invalid Login Credentials!',
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


    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Password Does not Match!',
        });
    }
});

function Cancel() {
    $('#ResetPasswordModel').modal('toggle');
    window.location.replace($("#HomePath").val());
}