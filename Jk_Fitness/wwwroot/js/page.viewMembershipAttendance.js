$(document).ready(function () {
    LoadBranchesforSearch();
    LoadSearchOption();
    var CurDate = new Date();
    $("#AttendDate").val(getFormattedDate(CurDate));
    var MembersAttendanceArray;
});


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
    $('#date').datetimepicker({
        format: 'L'
    })
});

function LoadBranchesforSearch() {
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
                LoadAttendance();
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

function LoadAttendance() {
    var Branch = $('#Branch').val();
    var AttendDate = $('#AttendDate').val();

    var data = new FormData();
    data.append("Branch", $('#Branch').val());
    data.append("AttendanceDate", $('#AttendDate').val());

    $("#wait").css("display", "block");

    $.ajax({
        type: 'POST',
        url: $("#ViewMemberShipAttendanceDetails").val(),
        dataType: 'json',
        data: data,
        processData: false,
        contentType: false,
        success: function (response) {

            var myData = jQuery.parseJSON(JSON.stringify(response));
            $("#wait").css("display", "none");
            if (myData.code == "1") {
                var Result = myData.data;
                MembersAttendanceArray = Result;
                var tr = [];

                if (Result.length > 0) {
                    $("#membersCount").css("display", "flex");
                    document.getElementById("membersCount").innerHTML = "Total attended members " + Result.length;
                }
                else
                    $("#membersCount").css("display", "none");
                for (var i = 0; i < Result.length; i++) {
                    tr.push('<tr>');

                    if (Result[i].memberId.toString().length == 1)
                        tr.push("<td>" + "000" + Result[i].memberId.toString() + "</td>");
                    else if (Result[i].memberId.toString().length == 2)
                        tr.push("<td>" + "00" + Result[i].memberId.toString() + "</td>");
                    else if (Result[i].memberId.toString().length == 3)
                        tr.push("<td>" + "0" + Result[i].memberId.toString() + "</td>");
                    else
                        tr.push("<td>" + Result[i].memberId + "</td>");

                    tr.push("<td>" + Result[i].firstName + " " + Result[i].lastName + "</td>");

                    if (Result[i].active == true)
                        tr.push("<td><strong style=\"color:green\">Active</strong></td>");
                    else
                        tr.push("<td><strong style=\"color:red\">Deactive</strong></td>");

                    if (Result[i].morningInTime == null)
                        tr.push("<td> - </td>");
                    else
                        tr.push("<td>" + Result[i].morningInTime + " - " + Result[i].morningOutTime + "</td>");


                    if (Result[i].eveningInTime == null)
                        tr.push("<td> - </td>");
                    else
                        tr.push("<td>" + Result[i].eveningInTime + " - " + Result[i].eveningOutTime + "</td>");

                    tr.push('</tr>');
                }

                $("#tbodyid").empty();
                $('.tblMember').append($(tr.join('')));
                $("#noRecords").css("display", "none");
                $("#tblMember").css("display", "table");
            } else if (myData.code == "0") {
                $("#noRecords").css("display", "block");
                $("#tblMember").css("display", "none");
                $("#membersCount").css("display", "none");

                var tr = [];
                $("#tbodyid").empty();
                $('.tblMember').append($(tr.join('')));
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


function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

$("#btnSearch").click(function () {
    LoadAttendance();
    $('#ValueforSearch').val("");
});

$("#ValueforSearch").bind('keyup', function () {
    SearchMemberAttendance();
});

function SearchMemberAttendance() {
    $("#wait").css("display", "block");
    var Result = [];

    var searchOpt = $('#SearchOptions').val();
    var searchVal = $('#ValueforSearch').val();

    if (searchVal == "") {
        Result = MembersAttendanceArray;
    } else {
        if (searchOpt == "1") {
            Result = $.grep(MembersAttendanceArray, function (v) {
                return ((v.firstName.search(new RegExp(searchVal, "i")) != -1) || (v.lastName.search(new RegExp(searchVal, "i")) != -1));
            })
        }
        else {
            Result = $.grep(MembersAttendanceArray, function (v) {
                return (v.memberId === parseInt(searchVal));
            })
        }
    }
    $("#wait").css("display", "none");
    if (Result.length != 0) {

        var tr = [];
        for (var i = 0; i < Result.length; i++) {
            tr.push('<tr>');
            if (Result[i].memberId.toString().length == 1)
                tr.push("<td>" + "000" + Result[i].memberId.toString() + "</td>");
            else if (Result[i].memberId.toString().length == 2)
                tr.push("<td>" + "00" + Result[i].memberId.toString() + "</td>");
            else if (Result[i].memberId.toString().length == 3)
                tr.push("<td>" + "0" + Result[i].memberId.toString() + "</td>");
            else
                tr.push("<td>" + Result[i].memberId + "</td>");

            tr.push("<td>" + Result[i].firstName + " " + Result[i].lastName + "</td>");

            if (Result[i].active == true)
                tr.push("<td><strong style=\"color:green\">Active</strong></td>");
            else
                tr.push("<td><strong style=\"color:red\">Deactive</strong></td>");

            if (Result[i].morningInTime == null)
                tr.push("<td> - </td>");
            else
                tr.push("<td>" + Result[i].morningInTime + " - " + Result[i].morningOutTime + "</td>");


            if (Result[i].eveningInTime == null)
                tr.push("<td> - </td>");
            else
                tr.push("<td>" + Result[i].eveningInTime + " - " + Result[i].eveningOutTime + "</td>");

            tr.push('</tr>');
        }

        $("#tbodyid").empty();
        $('.tblMember').append($(tr.join('')));
        $("#noRecords").css("display", "none");
        $("#tblMember").css("display", "table");
    } else {
        $("#noRecords").css("display", "block");
        $("#tblMember").css("display", "none");

        var tr = [];
        $("#tbodyid").empty();
        $('.tblMember').append($(tr.join('')));
    }

}

function LoadSearchOption() {
    $('#SearchOptions').find('option').remove().end();
    searchOptions = $('#SearchOptions');
    var searchOptionsList = [
        { Id: 1, Name: "Name" },
        { Id: 2, Name: "Membership Id" }
    ];
    $.each(searchOptionsList, function () {
        searchOptions.append($("<option/>").val(this.Id).text(this.Name));
    });
}

