﻿$(document).ready(function () {
    var CurDate = new Date();
    $("#ReqDate").val(getFormattedDate(CurDate));
    LoadMonths();
});
$(function () {
    //Date picker
    $('#Rdate').datetimepicker({
        format: 'L'
    });
});

function LoadMonths() {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var month_selected = (new Date).getMonth(); // current month
    var option = '';

    for (let i = 0; i < months.length; i++) {
        let month_number = (i + 1);

        // value month number with 0. [01 02 03 04..]
        //let month = (month_number <= 9) ? '0' + month_number : month_number;

        // or value month number. [1 2 3 4..]
        let month = month_number;

        // or value month names. [January February]
        // let month = months[i];

        let selected = (i === month_selected ? ' selected' : '');
        option += '<option value="' + month + '"' + selected + '>' + months[i] + '</option>';
    }
    document.getElementById("Month").innerHTML = option;
    ListTrainerHistory($('#Month').val());
}

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

function ListNewRequest() {
  
    date = $('#ReqDate').val();

    var data = new FormData();
    data.append("Date", $('#ReqDate').val());

    $.ajax({
        type: 'POST',
        url: $("#NewTrainingRequest").val(),
        dataType: 'json',
        data: data,
        processData: false,
        contentType: false,
        success: function (response) {
            $("#waitform").css("display", "none");
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var Result = myData.data;
                var tr = [];
                for (var i = 0; i < Result.length; i++) {
                    tr.push('<tr>');
                    tr.push("<td>" + Result[i].timeSlot + "</td>");
                    if (Result[i].memberId != 0)
                        tr.push("<td>" + Result[i].memberId + "</td>");
                    else
                        tr.push("<td>" + "-" + "</td>");

                    if (Result[i].memberName != null)
                        tr.push("<td>" + Result[i].memberName + "</td>");
                    else
                        tr.push("<td>" + "-" + "</td>");                  

                    if (Result[i].status == "Pending")
                        tr.push("<td><button onclick=\"AcceptTrainingRequest('" + Result[i].id + "')\" class=\"btn btn-primary\"> Accept </button> <button onclick=\"RejectTrainingRequest('" + Result[i].id + "')\" class=\"btn btn-danger\"> Reject </button></td>");
                    else if (Result[i].status == "Accepted")
                        tr.push("<td><strong style=\"color:green\">Accepted</strong></td>");
                    else if (Result[i].status == "Declined")
                        tr.push("<td><strong style=\"color:red\">Declined</strong></td>");
                    else
                        tr.push("<td>" + Result[i].status + "</td>");
                    tr.push('</tr>');
                }

                $("#tbodyPack").empty();
                $('.tblNewRequest').append($(tr.join('')));
                $("#noRecordspack").css("display", "none");
                $("#tblNewRequest").css("display", "table");

            } else {
                $("#noRecordspack").css("display", "block");
                $("#tblNewRequest").css("display", "none");

                var tr = [];
                $("#tbodyPack").empty();
                $('.tblNewRequest').append($(tr.join('')));
            }

        },
        error: function (jqXHR, exception) {

        }
    });
};

$('#btnSearch').click(function () {
    ListNewRequest();
});

function ListTrainerHistory(month) {

    date = $('#Month').val();

    var data = new FormData();
    data.append("Month", month);

    $.ajax({
        type: 'POST',
        url: $("#TrainingRequestHistroy").val(),
        dataType: 'json',
        data: data,
        processData: false,
        contentType: false,
        success: function (response) {
            $("#waitform").css("display", "none");
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var Result = myData.data;
                var tr = [];
                for (var i = 0; i < Result.length; i++) {
                    tr.push('<tr>');
                    tr.push("<td>" + getFormattedDate(new Date(Result[i].date)) + "</td>");
                    tr.push("<td>" + Result[i].timeSlot + "</td>");
                    tr.push("<td>" + Result[i].memberId + "</td>");
                    tr.push("<td>" + Result[i].memberName + "</td>");
                   
                    if (Result[i].status == "Accepted")
                        tr.push("<td><strong style=\"color:green\">Accepted</strong></td>");
                    else if (Result[i].status == "Declined")
                        tr.push("<td><strong style=\"color:red\">Declined</strong></td>");
                    else if (Result[i].status == "Pending")
                        tr.push("<td><strong style=\"color:orange\">Pending</strong></td>");
                    else
                        tr.push("<td>" + Result[i].status + "</td>");

                    tr.push('</tr>');
                }

                $("#tbodyidMem").empty();
                $('.tblRequestHistroy').append($(tr.join('')));
                $("#noRecordsmem").css("display", "none");
                $("#tblRequestHistroy").css("display", "table");

            } else {
                $("#noRecordsmem").css("display", "block");
                $("#tblRequestHistroy").css("display", "none");

                var tr = [];
                $("#tbodyidMem").empty();
                $('.tblRequestHistroy').append($(tr.join('')));
            }

        },
        error: function (jqXHR, exception) {

        }
    });
};

$("#Month").change(function () {
    ListTrainerHistory($('#Month').val());
});

function AcceptTrainingRequest(id) {

    var data = new FormData();
    data.append("Id", id);
    data.append("Status", "Accepted");

    $.ajax({
        type: 'POST',
        url: $("#UpdateRequestTrainerStatus").val(),
        dataType: 'json',
        data: data,
        processData: false,
        contentType: false,
        success: function (response) {
            $("#waitform").css("display", "none");
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var Result = myData.data;
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Your work has been saved',
                    showConfirmButton: false,
                    timer: 1500
                });
                ListNewRequest();
                ListTrainerHistory($('#Month').val());
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

function RejectTrainingRequest(id) {

    var data = new FormData();
    data.append("Id", id);
    data.append("Status", "Declined");

    $.ajax({
        type: 'POST',
        url: $("#UpdateRequestTrainerStatus").val(),
        dataType: 'json',
        data: data,
        processData: false,
        contentType: false,
        success: function (response) {
            $("#waitform").css("display", "none");
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var Result = myData.data;
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Your work has been saved',
                    showConfirmButton: false,
                    timer: 1500
                });
                ListNewRequest();
                ListTrainerHistory($('#Month').val());
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