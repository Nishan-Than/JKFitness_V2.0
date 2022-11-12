$('#Request').click(function () {
    var UserName = $('#UserName').val();
    $("#wait").css("display", "block");
    $("#Request").attr("disabled", true);
    $.ajax({
        type: 'POST',
        url: $("#RequestPassword").val(),
        dataType: 'json',
        data: '{"Email":" ' + UserName + ' "}',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            $("#wait").css("display", "none");
            $("#Request").attr("disabled", false);
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                window.location.replace($("#LoginPath").val());
            }
            else {
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