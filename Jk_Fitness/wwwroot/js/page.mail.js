$(function () {
    //Add text editor
    $('#compose-textarea').summernote({
        height: 300
    });
})

LoadBranches();
var EmailArray;
$('#Manual').prop('checked', true);
$('#Manual').trigger('change');

$("#Manual").change(function () {

    var manualval = $('#Manual').prop('checked') ? true : false;
    if (manualval) {
        $("#ToOpt").css("display", "flex");
        $("#FilterOpt").css("display", "none");
        $("#MailCount").css("display", "none");
    }
    else {
        $("#ToOpt").css("display", "none");
        $("#FilterOpt").css("display", "flex");
        $("#MailCount").css("display", "flex");
    }

});

$('#attachment').change(function (event) {
    var files = event.target.files;
    if (files.length > 0) {
       // $('#targetImg').attr('src', window.URL.createObjectURL(files[0]));
        $(this).next('.custom-file-label').html(files[0].name);
    }
});

$('#save').click(function () {
    SendmailToMember();
});

function SendmailToMember() {

    var files = $('#attachment').prop("files");
     var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        data.append("File", files[i]);
    }

    var manualval = $('#Manual').prop('checked') ? true : false;
    if (manualval) {
        data.append("ToEmail", $('#To').val());
    }
    else {
        var firstHundredmail = EmailArray.slice(0, 100);
        EmailArray = EmailArray.slice(100);
        data.append("ToEmail", firstHundredmail);
    }
    
    data.append("Subject", $('#Subject').val());
    data.append("Body", $('#compose-textarea').val());
    $("#waitform").css("display", "block");
    $.ajax({
        type: 'POST',
        url: $("#SentMailPath").val(),
        dataType: 'json',
        data: data,
        processData: false,
        contentType: false,
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData) {
                var manualval = $('#Manual').prop('checked') ? true : false;
                if (manualval) {
                    Clear();
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Email has been Successfully Sent',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    $("#waitform").css("display", "none");
                } else {
                    if (EmailArray.length > 0) {
                        document.getElementById("MailCount").innerHTML = "Remaining Email Address Count " + EmailArray.length;
                        SendmailToMember();
                    } else {
                        document.getElementById("MailCount").innerHTML = "Remaining Email Address Count 0";
                        Clear();
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Email has been Successfully Sent',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        $("#waitform").css("display", "none");
                    }

                }
            }
           
            
        },
        error: function (jqXHR, exception) {
        }
    });
}


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
            LoadStatus();
        },
        error: function (jqXHR, exception) {
        }
    });
}

function LoadStatus() {
    $('#Status').find('option').remove().end();
    Status = $('#Status');
    var StatusList = [
        { Id: true, Name: "Active" },
        { Id: false, Name: "Deactive" }
    ];
    $.each(StatusList, function () {
        Status.append($("<option/>").val(this.Id).text(this.Name));
    });
    LoadGender();
}

function LoadGender() {
    $('#Gender').find('option').remove().end();
    Gender = $('#Gender');
    var GenderList = [
        { Id: "Male", Name: "Male" },
        { Id: "Female", Name: "Female" }
    ];
    $.each(GenderList, function () {
        Gender.append($("<option/>").val(this.Id).text(this.Name));
    });
    ListMemberDetails();
}

$("#Branch").change(function () {
    ListMemberDetails();
});

$("#Status").change(function () {
    ListMemberDetails();
});

$("#Gender").change(function () {
    ListMemberDetails();
});

function ListMemberDetails() {
    $("#waitform").css("display", "block");
    var data = new FormData();
    data.append("Branch", $('#Branch').val());
    data.append("Active", $('#Status').val());
    data.append("Gender", $('#Gender').val());
    $.ajax({
        type: 'POST',
        url: $("#GetMemberDetails").val(),
        dataType: 'json',
        data: data,
        processData: false,
        contentType: false,
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            $("#waitform").css("display", "none");
            if (myData.code == "1") {
                var Result = myData.data;
                EmailArray = Result;
                document.getElementById("MailCount").innerHTML = "Total Email Address Count " + Result.length;
            } else {
                document.getElementById("MailCount").innerHTML = "Total Email Address Count 0";
            }
           
        },
        error: function (jqXHR, exception) {
        }
    });
}

function Clear() {
    $('#To').val('');
    $('#Subject').val('');
    $('#compose-textarea').summernote('reset');
    //$('#attachment').val('');
    document.getElementById("attachment").value = "";
    document.getElementById('fileLabelName').innerHTML = 'Choose Attachment File....';
    
}

$('#Discard').click(function () {
    Clear();
});