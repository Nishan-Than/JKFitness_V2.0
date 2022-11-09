document.getElementById("Name").innerHTML = JSON.parse(window.localStorage.getItem('Empl')).Name;

var image = JSON.parse(window.localStorage.getItem('Empl')).Image;
var url = window.location.href.split('/', 3).join().replace(",,", "//") + "/dist/img/default.jpg";
if (image != null) {
    $('#UserImg').attr("src", "data:image/jgp;base64," + image + "");
}
else {
    $('#UserImg').attr("src", url);
}
UserRights();
NotificationValues();
$(function () {
    $('a').each(function () {
        if ($(this).prop('href') == window.location.href) {
            $(this).addClass('active');
            $(this).parents('li').addClass('menu-open');
        } else {
            //$(this).removeClass('active');
        }
    });
});

function SignOut() {
    $.ajax({
        type: 'GET',
        url: $("#SignOutLogin").val(),
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                window.localStorage.clear();
                window.location.replace($("#LoginHome").val());
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

function UserRights() {
    $.ajax({
        type: 'GET',
        url: $("#GetUserRights").val(),
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var Result = myData.data;
                if (Result[2].role == 1 || Result[2].role == 2)
                    $("#MenuHome").attr('hidden', false);
                else
                    $("#MenuHome").attr('hidden', true);

                if (Result[3].role == 1 || Result[3].role == 2)
                    $("#MenuEmployee").attr('hidden', false);
                else
                    $("#MenuEmployee").attr('hidden', true);

                if (Result[8].role == 1 || Result[8].role == 2)
                    $("#MenuMemebership").attr('hidden', false);
                else
                    $("#MenuMemebership").attr('hidden', true);

                if (Result[13].role == 1 || Result[13].role == 2)
                    $("#AddAttendance").attr('hidden', false);
                else
                    $("#AddAttendance").attr('hidden', true);

                if (Result[16].role == 1 || Result[16].role == 2)
                    $("#MenuBranch").attr('hidden', false);
                else
                    $("#MenuBranch").attr('hidden', true);

                if (Result[20].role == 1 || Result[20].role == 2)
                    $("#MenuExpensesType").attr('hidden', false);
                else
                    $("#MenuExpensesType").attr('hidden', true);

                if (Result[24].role == 1 || Result[24].role == 2)
                    $("#MenuMembershipPackage").attr('hidden', false);
                else
                    $("#MenuMembershipPackage").attr('hidden', true);

                if (Result[28].role == 1 || Result[28].role == 2)
                    $("#MenuSalary").attr('hidden', false);
                else
                    $("#MenuSalary").attr('hidden', true);

                if (Result[31].role == 1 || Result[31].role == 2)
                    $("#MenuRights").attr('hidden', false);
                else
                    $("#MenuRights").attr('hidden', true);

                if (Result[32].role == 1 || Result[32].role == 2)
                    $("#NewPayment").attr('hidden', false);
                else
                    $("#NewPayment").attr('hidden', true);

                if (Result[33].role == 1 || Result[33].role == 2)
                    $("#ViewPayment").attr('hidden', false);
                else
                    $("#ViewPayment").attr('hidden', true);

                if (Result[35].role == 1 || Result[35].role == 2)
                    $("#MenuMemebersService").attr('hidden', false);
                else
                    $("#MenuMemebersService").attr('hidden', true);

                if (Result[36].role == 1 || Result[36].role == 2)
                    $("#ViewAttendance").attr('hidden', false);
                else
                    $("#ViewAttendance").attr('hidden', true);

                if (Result[42].role == 1 || Result[42].role == 2)
                    $("#AdvanceSalaryPayment").attr('hidden', false);
                else
                    $("#AdvanceSalaryPayment").attr('hidden', true);

                if (Result[46].role == 1 || Result[46].role == 2)
                    $("#SalaryPayment").attr('hidden', false);
                else
                    $("#SalaryPayment").attr('hidden', true);

                if (Result[47].role == 1 || Result[47].role == 2)
                    $("#ViewSalaryPayment").attr('hidden', false);
                else
                    $("#ViewSalaryPayment").attr('hidden', true);

                if (Result[49].role == 1 || Result[49].role == 2)
                    $("#MenuInternalExpenses").attr('hidden', false);
                else
                    $("#MenuInternalExpenses").attr('hidden', true);

                if (Result[53].role == 1 || Result[53].role == 2)
                    $("#MailBox").attr('hidden', false);
                else
                    $("#MailBox").attr('hidden', true);

                if (Result[54].role == 1 || Result[54].role == 2)
                    $("#ProvisionalMember").attr('hidden', false);
                else
                    $("#ProvisionalMember").attr('hidden', true);

                if (Result[58].role == 1 || Result[58].role == 2)
                    $("#SellProduct").attr('hidden', false);
                else
                    $("#SellProduct").attr('hidden', true);

                if (Result[59].role == 1 || Result[59].role == 2)
                    $("#ViewSoldProduct").attr('hidden', false);
                else
                    $("#ViewSoldProduct").attr('hidden', true);

                if (Result[61].role == 1 || Result[61].role == 2)
                    $("#PersonalTraining").attr('hidden', false);
                else
                    $("#PersonalTraining").attr('hidden', true);

                if (Result[62].role == 1 || Result[62].role == 2)
                    $("#ViewPersonalTraining").attr('hidden', false);
                else
                    $("#ViewPersonalTraining").attr('hidden', true);

                if (Result[64].role == 1 || Result[64].role == 2)
                    $("#GymAccounts").attr('hidden', false);
                else
                    $("#GymAccounts").attr('hidden', true);

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

function NotificationValues() {

    $.ajax({
        type: 'GET',
        url: $("#GetNotificationDetails").val(),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var Result = myData.data;
                //memberShipExpirationToday = Result.memberShipExpirationToday;
                //memberShipExpirationTomorrow = Result.memberShipExpirationTomorrow;
                //packageExpirationToday = Result.packageExpirationToday;
                //packageExpirationTomorrow = Result.packageExpirationTomorrow;
                document.getElementById("packLastMonth").innerHTML = Result.packageExpirationLastMonth.length;
                document.getElementById("packThisMonth").innerHTML = Result.packageExpirationThisMonth.length;
                document.getElementById("packNextMonth").innerHTML = Result.packageExpirationNextMonth.length;
                document.getElementById("memLastMonth").innerHTML = Result.memberShipExpirationLastMonth.length;
                document.getElementById("memThisMonth").innerHTML = Result.memberShipExpirationThisMonth.length;
                document.getElementById("memNextMonth").innerHTML = Result.memberShipExpirationNextMonth.length;
                document.getElementById("totalCount").innerHTML = (Result.packageExpirationLastMonth.length + Result.packageExpirationThisMonth.length + Result.packageExpirationNextMonth.length + Result.memberShipExpirationLastMonth.length + Result.memberShipExpirationThisMonth.length + Result.memberShipExpirationNextMonth.length);

            } else {

            }
        },
        error: function (jqXHR, exception) {
        }
    });
}
