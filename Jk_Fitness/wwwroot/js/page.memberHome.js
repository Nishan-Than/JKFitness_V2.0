document.getElementById("memberName").innerHTML = JSON.parse(window.localStorage.getItem('Mem')).Name;

$(document).ready(function () {
    LoadTrainers();
    var CurDate = new Date();
    $("#Date").val(getFormattedDate(CurDate));
    LoadYear();
});

$(function () {
    //Date picker
    $('#Tdate').datetimepicker({
        format: 'L'
    });
    $('#Hdate').datetimepicker({
        format: 'L'
    });
});

function LoadTrainers() {
    $('#Trainer').find('option').remove().end();
    Trainer = $('#Trainer');

    $.ajax({
        type: 'GET',
        url: $("#GetTrainers").val(),
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var Result = myData.data;
               
                Trainer.append($("<option/>").val(0).text("-Select Trainer-"));
                $.each(Result, function () {
                    Trainer.append($("<option/>").val(this.employeeId).text(this.firstName + " " + this.lastName));
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

function LoadTrainerTimeSlot() {
    var memId = JSON.parse(window.localStorage.getItem('Mem')).Id;
    empId = $('#Trainer').val();
    date = $('#Date').val();
    EmployeeId = $('#Trainer').val();

    var data = new FormData();
    data.append("EmployeeId", $('#Trainer').val());
    data.append("Date", $('#Date').val());
    data.append("MemberId", memId);

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
                    if (Result[i].status == "Available")
                        tr.push("<td><button onclick=\"NewTrainingRequest('" + Result[i].timeSlot + "')\" class=\"btn btn-primary\"> Request </button></td>");
                    else {
                        if (Result[i].status == "Pending")
                            tr.push("<td><strong style=\"color:orange\">Pending</strong></td>");
                        else if (Result[i].status == "Accepted")
                            tr.push("<td><strong style=\"color:green\">Accepted</strong></td>");
                        else if (Result[i].status == "Declined")
                            tr.push("<td><strong style=\"color:red\">Declined</strong></td>");
                        else
                            tr.push("<td>" + Result[i].status + "</td>");
                    }
                   
                    tr.push('</tr>');
                }

                $("#tbodyid1").empty();
                $('.tblNewTraining').append($(tr.join('')));
                $("#noRecords1").css("display", "none");
                $("#tblNewTraining").css("display", "table");

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

$('#btnSearch').click(function () {
    var EmployeeId = $('#Trainer').val();
    if (EmployeeId != "0") {
        LoadTrainerTimeSlot();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please Select the Trainer!',
        });
    }
   
});

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

function NewTrainingRequest(TimeSlot) {
    var memId = JSON.parse(window.localStorage.getItem('Mem')).Id;
    var date = $('#Date').val();
    var EmpId = EmployeeId;

    var data = new FormData();
    data.append("EmployeeId", EmpId);
    data.append("MemberId", memId);
    data.append("TrainingDate", date);
    data.append("TrainingTimeSlot", TimeSlot);
    $("#wait").css("display", "block");
    $.ajax({
        type: 'POST',
        url: $("#SaveNewTrainingRequest").val(),
        dataType: 'json',
        data: data,
        processData: false,
        contentType: false,
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            $("#wait").css("display", "none");
            if (myData.code == "1") {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Your work has been saved',
                    showConfirmButton: false,
                    timer: 1500
                });
                LoadTrainerTimeSlot();
                LoadTrainingHistroy($('#Month').val());
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

};

function LoadYear() {

    $.ajax({
        type: 'GET',
        url: $("#GetStartandEndYear").val(),
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {

                let year_satart = parseInt(myData.data.startYear);
                let year_end = parseInt(myData.data.endYear); // current year
                let year_selected = year_end;

                let option = '';

                for (let i = year_satart; i <= year_end; i++) {
                    let selected = (i === year_selected ? ' selected' : '');
                    option += '<option value="' + i + '"' + selected + '>' + i + '</option>';
                }

                document.getElementById("Year").innerHTML = option;
                LoadMonths();

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

function LoadMonths() {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var month_selected = (new Date).getMonth(); // current month
    var option = '';

    for (let i = 0; i < months.length; i++) {
        let month_number = (i + 1);
        let month = month_number;
        let selected = (i === month_selected ? ' selected' : '');
        option += '<option value="' + month + '"' + selected + '>' + months[i] + '</option>';
    }
    document.getElementById("Month").innerHTML = option;
    LoadTrainingHistroy($('#Year').val(), $('#Month').val());
}

function LoadTrainingHistroy(year, month) {
    var memId = JSON.parse(window.localStorage.getItem('Mem')).Id;

    var data = new FormData();
    data.append("Year", year);
    data.append("Month", month);
    data.append("MemberId", memId);

    $.ajax({
        type: 'POST',
        url: $("#TrainingHistroy").val(),
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
                    tr.push("<td>" + Result[i].trainer + "</td>");
                    if (Result[i].status == "Pending")
                        tr.push("<td><strong style=\"color:orange\">Pending</strong></td>");
                    else if (Result[i].status == "Accepted")
                        tr.push("<td><strong style=\"color:green\">Accepted</strong></td>");
                    else if (Result[i].status == "Declined")
                        tr.push("<td><strong style=\"color:red\">Declined</strong></td>");
                    else
                        tr.push("<td>" + Result[i].status + "</td>");

                   
                    tr.push('</tr>');
                }

                $("#tbodyid").empty();
                $('.tblTrainingHistroy').append($(tr.join('')));
                $("#noRecords2").css("display", "none");
                $("#tblTrainingHistroy").css("display", "table");

            } else {
                $("#noRecords2").css("display", "block");
                $("#tblTrainingHistroy").css("display", "none");

                var tr = [];
                $("#tbodyid").empty();
                $('.tblTrainingHistroy').append($(tr.join('')));
            }

        },
        error: function (jqXHR, exception) {

        }
    });
}

$("#Month").change(function () {
    LoadTrainingHistroy($('#Year').val(), $('#Month').val());
});

$("#Year").change(function () {
    LoadTrainingHistroy($('#Year').val(), $('#Month').val());
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