$(document).ready(function () {
    var url = window.location.href;
    var arr = url.split('/', 3).join().replace(",,","//");
    LoadProfile();
});


function LoadProfile() {
    $('.card').addClass('freeze');
    $("#wait").css("display", "block");
    $.ajax({
        type: 'GET',
        url: $("#GetProfileDetails").val(),
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            $("#wait").css("display", "none");
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var Result = myData.data;
                var url = window.location.href.split('/', 3).join().replace(",,", "//") + "/dist/img/default.jpg";
                
                if (Result.image != null) {
                    $('#targetImg').attr("src", "data:image/jgp;base64," + Result.image + "");
                }
                else {
                    $('#targetImg').attr("src", url);
                }
                
                $("#Fname").val(Result.firstName);
                $("#Lname").val(Result['lastName']);
                $("#HouseNo").val(Result['houseNo']);
                $("#Street").val(Result['street']);
                $("#District").val(Result['district']);
                $("#Province").val(Result['province']);
                $("#Email").val(Result['email']);
                $("#ContactNo").val(Result['phoneNo']);
                $("#MorningIn").val(Result['morningInTime']);
                $("#MorningOut").val(Result['morningOutTime']);
                $("#EveningIn").val(Result['eveningInTime']);
                $("#EveningOut").val(Result['eveningOutTime']);
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
