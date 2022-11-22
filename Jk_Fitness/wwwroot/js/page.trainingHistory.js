$(document).ready(function () {
    LoadBranchesforSearch();
});

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

function LoadBranchesforSearch() {
    $("#wait").css("display", "block");
    $('#Branch').find('option').remove().end();
    Branch = $('#Branch');
    BranchArray = [];
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

                $.each(Result, function () {
                    Branch.append($("<option/>").val(this.branchCode).text(this.branchName));
                });
                LoadYear();

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: myData.message,
                });
            }
            $("#wait").css("display", "none");
        },
        error: function (jqXHR, exception) {
        }
    });
}

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
    ListTrainerHistory($('#Branch').val(), $('#Year').val(), $('#Month').val());
}

function ListTrainerHistory(branch, year, month) {

    date = $('#Month').val();

    var data = new FormData();

    data.append("Branch", branch);
    data.append("Year", year);
    data.append("Month", month);

    $("#wait").css("display", "block");
    $.ajax({
        type: 'POST',
        url: $("#TrainingRequestHistroy").val(),
        dataType: 'json',
        data: data,
        processData: false,
        contentType: false,
        success: function (response) {
            $("#wait").css("display", "none");
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var Result = myData.data;
                var tr = [];
                for (var i = 0; i < Result.length; i++) {
                    tr.push('<tr>');
                    tr.push("<td>" + getFormattedDate(new Date(Result[i].date)) + "</td>");
                    tr.push("<td>" + Result[i].timeSlot + "</td>");
                    tr.push("<td>" + Result[i].employeeName + "</td>");
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

$("#Branch").change(function () {
    ListTrainerHistory($('#Branch').val(), $('#Year').val(), $('#Month').val());
});

$("#Year").change(function () {
    ListTrainerHistory($('#Branch').val(), $('#Year').val(), $('#Month').val());
});

$("#Month").change(function () {
    ListTrainerHistory($('#Branch').val(), $('#Year').val(), $('#Month').val());
});

