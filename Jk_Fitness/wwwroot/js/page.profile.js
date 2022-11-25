$(document).ready(function () {
    var url = window.location.href;
    var arr = url.split('/', 3).join().replace(",,", "//");
    LoadProvinces();
   
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
               
                $("#Province").val(Result['province']);
                $("#Email").val(Result['email']);
                $("#ContactNo").val(Result['phoneNo']);
                $("#MorningIn").val(Result['morningInTime']);
                $("#MorningOut").val(Result['morningOutTime']);
                $("#EveningIn").val(Result['eveningInTime']);
                $("#EveningOut").val(Result['eveningOutTime']);

                $('#District').find('option').remove().end();
                District = $('#District');

                $.ajax({
                    type: 'POST',
                    url: $("#ListDistricts").val(),
                    dataType: 'json',
                    data: '{"ProvinceId": "' + $("#Province").val() + '"}',
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
                        var myData = jQuery.parseJSON(JSON.stringify(response));
                        if (myData.code == "1") {
                            var Result1 = myData.data;

                            $.each(Result1, function () {
                                District.append($("<option/>").val(this.id).text(this.name));
                            });
                            $("#District").val(Result['district']);
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
                    text: myData.message,
                });
            }
        },
        error: function (jqXHR, exception) {
        }
    });
}

$("#Province").change(function () {
    ListDistricts(this.value);
});
function LoadProvinces() {
    $('#Province').find('option').remove().end();
    Province = $('#Province');

    $.ajax({
        type: 'GET',
        url: $("#ListProvinces").val(),
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var Result = myData.data;

                $.each(Result, function () {
                    Province.append($("<option/>").val(this.id).text(this.name));
                });
                ListDistricts($("#Province").val());
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

function ListDistricts(Id) {

    $('#District').find('option').remove().end();
    District = $('#District');

    $.ajax({
        type: 'POST',
        url: $("#ListDistricts").val(),
        dataType: 'json',
        data: '{"ProvinceId": "' + Id + '"}',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var Result = myData.data;

                $.each(Result, function () {
                    District.append($("<option/>").val(this.id).text(this.name));
                });
                LoadProfile();
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
