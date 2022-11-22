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


function EditMemberAttendance(Id) {
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    $('#AttendanceModal').modal('show');

    var AttendanceDetails = $.grep(MembersAttendanceArray, function (v) {
        return v.memberId == Id;
    })
    if (AttendanceDetails.length != 0) {
        var Result = AttendanceDetails[0];
        $("#MemberId").val(Result['memberId']);
        $("#AttendanceId").val(Result['id']);
        if (Result.id != 0) {
            $('#MorningIn').val(Result['morningInTime']);
            $('#MorningOut').val(Result['morningOutTime']);
            $('#EveningIn').val(Result['eveningInTime']);
            $('#EveningOut').val(Result['eveningOutTime']);
        } else {
            $('#MorningIn').val("");
            $('#MorningOut').val("");
            $('#EveningIn').val("");
            $('#EveningOut').val("");
        }
    }
}

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

$("#btnAddMemberAttendance").click(function () {
    var Id = $('#AttendanceId').val();

    var data = new FormData();
    data.append("Id", $('#AttendanceId').val());
    data.append("MembershipId", $('#MemberId').val());
    data.append("MorningInTime", $('#MorningIn').val());
    data.append("MorningOutTime", $('#MorningOut').val());
    data.append("EveningInTime", $('#EveningIn').val());
    data.append("EveningOutTime", $('#EveningOut').val());
    data.append("AttendDate", $('#AttendDate').val());

    $("#waitform").css("display", "block");
    $("#btnAddMemberAttendance").attr("disabled", true);
    $('.modal').addClass('freeze');
    $('.modal-content').addClass('freeze');


    if (Id == "0" || Id == "") {
        $.ajax({
            type: 'POST',
            url: $("#SaveMembersAttendance").val(),
            dataType: 'json',
            data: data,
            processData: false,
            contentType: false,
            success: function (response) {
                var myData = jQuery.parseJSON(JSON.stringify(response));
                $("#waitform").css("display", "none");
                $("#btnAddMemberAttendance").attr("disabled", false);
                if (myData.code == "1") {
                    var res = myData.data;
                    var ObjIndex = MembersAttendanceArray.findIndex((obj => obj.memberId == res.membershipId));
                    if (ObjIndex != -1) {
                        MembersAttendanceArray[ObjIndex].eveningInTime = res.eveningInTime;
                        MembersAttendanceArray[ObjIndex].eveningOutTime = res.eveningOutTime;
                        MembersAttendanceArray[ObjIndex].morningInTime = res.morningInTime;
                        MembersAttendanceArray[ObjIndex].morningOutTime = res.morningOutTime;
                        MembersAttendanceArray[ObjIndex].id = res.id;
                    }

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Your work has been saved',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    LoadMemberAttendance();
                    Cancel();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: myData.message,
                    });
                    Cancel();
                }
            },
            error: function (jqXHR, exception) {
            }
        });

    } else {
        $.ajax({
            type: 'POST',
            url: $("#UpdateMemberAttendance").val(),
            dataType: 'json',
            data: data,
            processData: false,
            contentType: false,
            success: function (response) {
                var myData = jQuery.parseJSON(JSON.stringify(response));
                $("#waitform").css("display", "none");
                $("#btnAddMemberAttendance").attr("disabled", false);
                if (myData.code == "1") {
                    var res = myData.data;
                    var ObjIndex = MembersAttendanceArray.findIndex((obj => obj.memberId == res.membershipId));
                    if (ObjIndex != -1) {
                        MembersAttendanceArray[ObjIndex].eveningInTime = res.eveningInTime;
                        MembersAttendanceArray[ObjIndex].eveningOutTime = res.eveningOutTime;
                        MembersAttendanceArray[ObjIndex].morningInTime = res.morningInTime;
                        MembersAttendanceArray[ObjIndex].morningOutTime = res.morningOutTime;
                    }
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Your work has been saved',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    LoadMemberAttendance();
                    Cancel();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: myData.message,
                    });
                    Cancel();
                }
            },
            error: function (jqXHR, exception) {
            }
        });

    }

});

function DeleteMemberAttendance(Id) {

    if (Id != "0") {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                $("#wait").css("display", "block");
                $.ajax({
                    type: 'POST',
                    url: $("#DeleteMemberAttendance").val(),
                    dataType: 'json',
                    data: '{"Id": "' + Id + '"}',
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
                        var myData = jQuery.parseJSON(JSON.stringify(response));
                        $("#wait").css("display", "none");
                        if (myData.code == "1") {

                            var ObjIndex = MembersAttendanceArray.findIndex((obj => obj.id == Id));
                            if (ObjIndex != -1) {
                                MembersAttendanceArray[ObjIndex].eveningInTime = null;
                                MembersAttendanceArray[ObjIndex].eveningOutTime = null;
                                MembersAttendanceArray[ObjIndex].morningInTime = null;
                                MembersAttendanceArray[ObjIndex].morningOutTime = null;
                            }
                            Swal.fire({
                                title: 'Deleted!',
                                text: 'Your record has been deleted.',
                                icon: 'success',
                            });
                            LoadMemberAttendance();
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
        })
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Data Not Found!',
        });
    }


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
        url: $("#LoadMemberShipAttendanceDetails").val(),
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


                    var td = [];
                    td.push('<td>');
                    if ($('#edit').val() == 1 || $('#edit').val() == 2)
                        td.push("<button onclick=\"EditMemberAttendance('" + Result[i].memberId + "')\" class=\"btn btn-primary\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Edit\"><i class=\"fa fa-edit\"></i></button>");

                    if ($('#delete').val() == 1 || $('#delete').val() == 2)
                        td.push("<button onclick=\"DeleteMemberAttendance('" + Result[i].id + "')\" class=\"btn btn-danger\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"><i class=\"fa fa-trash\"></i></button>");
                    td.push('</td>');

                    tr.push(td.join(' '));
                    tr.push('</tr>');
                }

                $("#tbodyid").empty();
                $('.tblMember').append($(tr.join('')));
                $("#noRecords").css("display", "none");
                $("#tblMember").css("display", "table");
            } else if (myData.code == "0") {
                $("#noRecords").css("display", "block");
                $("#tblMember").css("display", "none");

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

//$("#Branch").change(function () {
//    LoadAttendance();
//});

//$("#AttendDate").bind('keyup', function () {
//    LoadAttendance();
//});

//$("#AttendDate").change(function () {
//    LoadAttendance();
//});

$("#btnSearch").click(function () {
    LoadAttendance();
    $('#ValueforSearch').val("");
});

$("#ValueforSearch").bind('keyup', function () {
    SearchMemberAttendance();
});

$("#SearchOptions").change(function () {
    $('#ValueforSearch').val('');
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


            var td = [];
            td.push('<td>');
            if ($('#edit').val() == 1 || $('#edit').val() == 2)
                td.push("<button onclick=\"EditMemberAttendance('" + Result[i].memberId + "')\" class=\"btn btn-primary\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Edit\"><i class=\"fa fa-edit\"></i></button>");

            if ($('#delete').val() == 1 || $('#delete').val() == 2)
                td.push("<button onclick=\"DeleteMemberAttendance('" + Result[i].id + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"><i class=\"fa fa-trash\"></i></button>");
            td.push('</td>');

            tr.push(td.join(' '));

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

function LoadMemberAttendance() {

    if (MembersAttendanceArray.length != 0) {

        var tr = [];
        for (var i = 0; i < MembersAttendanceArray.length; i++) {
            tr.push('<tr>');
            tr.push("<td>" + MembersAttendanceArray[i].memberId + "</td>");;
            tr.push("<td>" + MembersAttendanceArray[i].firstName + " " + MembersAttendanceArray[i].lastName + "</td>");

            if (MembersAttendanceArray[i].morningInTime == null)
                tr.push("<td> - </td>");
            else
                tr.push("<td>" + MembersAttendanceArray[i].morningInTime + " - " + MembersAttendanceArray[i].morningOutTime + "</td>");


            if (MembersAttendanceArray[i].eveningInTime == null)
                tr.push("<td> - </td>");
            else
                tr.push("<td>" + MembersAttendanceArray[i].eveningInTime + " - " + MembersAttendanceArray[i].eveningOutTime + "</td>");

            var td = [];
            td.push('<td>');
            if ($('#edit').val() == 1 || $('#edit').val() == 2)
                td.push("<button onclick=\"EditMemberAttendance('" + MembersAttendanceArray[i].memberId + "')\" class=\"btn btn-primary\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Edit\"><i class=\"fa fa-edit\"></i></button>");

            if ($('#delete').val() == 1 || $('#delete').val() == 2)
                td.push("<button onclick=\"DeleteMemberAttendance('" + MembersAttendanceArray[i].id + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"><i class=\"fa fa-trash\"></i></button>");
            td.push('</td>');

            tr.push(td.join(' '));
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

function Cancel() {
    $('#AttendanceModal').modal('toggle');
    Clear();
}

function Clear() {
    $('#MorningIn').val("");
    $('#MorningOut').val("");
    $('#EveningIn').val("");
    $('#EveningOut').val("");
    $("#MemberId").val("");
    $("#AttendanceId").val("");
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

