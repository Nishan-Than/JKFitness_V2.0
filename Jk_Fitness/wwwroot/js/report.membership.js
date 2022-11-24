$(document).ready(function () {
    LoadMemberShipType();
    LoadStatus();
    var BranchArray;
    var MemberShipPackageArray;
    var MembersDetailsArray = [];
    if ($('#add').val() == "1" || $('#add').val() == "2") {
        $("#btnAdd").attr('hidden', false);
    }
    else {
        $("#btnAdd").attr('hidden', true);
    }
});

var TblMember = $("#tblMember").DataTable(
    {
        dom: 'Bfrtip',
        buttons: [{
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'LEGAL',
            filename: function () {
                return "Membership Report"
            },
            title: function () {
                return "Membership Report"
            },
            customize: function (doc) {
                //doc.content[1].margin = [100, 0, 100, 0] //left, top, right, bottom
            }
        },
        {
            extend: 'excelHtml5',
            filename: function () {
                return "Membership Report"
            },
            title: function () {
                return "Membership Report"
            }
        },
        {
            extend: 'print',
            filename: function () {
                return "Membership Report"
            },
            title: function () {
                return "Membership Report"
            }
        }
        ],
        pageLength: 1000,
        "aaSorting": []
    });

function LoadMemberShipType() {

    MemberShipPackage = [];
    $.ajax({
        type: 'GET',
        url: $("#GetMembershipTypeDetails").val(),
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                MemberShipPackageArray = myData.data;
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

function LoadStatus() {
    $('#StatusforSearch').find('option').remove().end();
    StatusforSearch = $('#StatusforSearch');
    var StatusList = [
        { Id: true, Name: "Active" },
        { Id: false, Name: "Deactive" },
        { Id: "All", Name: "All" }
    ];
    $.each(StatusList, function () {
        StatusforSearch.append($("<option/>").val(this.Id).text(this.Name));
    });
    LoadGenderOptions();
    LoadBranchesforSearch();
    LoadSearchOption();
}

function LoadGenderOptions() {
    $('#GenderSearch').find('option').remove().end();
    genderOptions = $('#GenderSearch');
    var genderOptionsList = [
        { Id: "", Name: "--All--" },
        { Id: "Male", Name: "Male" },
        { Id: "Female", Name: "Female" }
    ];
    $.each(genderOptionsList, function () {
        genderOptions.append($("<option/>").val(this.Id).text(this.Name));
    });
}

function LoadBranchesforSearch() {
    $('#BranchforSearch').find('option').remove().end();
    BranchforSearch = $('#BranchforSearch');
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
                    BranchforSearch.append($("<option/>").val(this.branchCode).text(this.branchName));
                });
                ListMemberDetails();
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

function LoadMemberShipType() {

    $.ajax({
        type: 'GET',
        url: $("#GetMembershipTypeDetails").val(),
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                MemberShipPackageArray = myData.data;
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

function LoadSearchOption() {
    $('#SearchOptions').find('option').remove().end();
    searchOptions = $('#SearchOptions');
    var searchOptionsList = [
        { Id: 1, Name: "Name" },
        { Id: 2, Name: "NIC" },
        { Id: 3, Name: "Phone Number" },
        { Id: 4, Name: "Membership Id" }
    ];
    $.each(searchOptionsList, function () {
        searchOptions.append($("<option/>").val(this.Id).text(this.Name));
    });
}

function ListMemberDetails() {
    $("#wait").css("display", "block");
    var data = new FormData();
    data.append("Branch", $('#BranchforSearch').val());

    $.ajax({
        type: 'POST',
        url: $("#GetMemberDetails").val(),
        dataType: 'json',
        data: data,
        processData: false,
        contentType: false,
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            var gender = $('#GenderSearch').val();
            $("#wait").css("display", "none");
            if (myData.code == "1") {
                var Result;

                MembersDetailsArray = myData.data;
                if ($('#StatusforSearch').val() != "All") {
                    var status = $('#StatusforSearch').val() == "true" ? true : false;
                    Result = $.grep(myData.data, function (v) {
                        return v.active == status;
                    })
                }
                else
                    Result = MembersDetailsArray;

                if (gender != "") {
                    Result = $.grep(Result, function (v) {
                        return v.gender == gender;
                    })
                }

                TblMember.clear().draw();

                var tr = [];
                for (var i = 0; i < Result.length; i++) {

                    var package;
                    var packageAmount;
                    var activeStatus;
                    if (Result[i].isFreeMembership) {
                        package = "Free Member";
                        packageAmount = " - "
                    }
                    else {
                        package = $.grep(MemberShipPackageArray, function (v) { return v.id == Result[i].memberPackage; })[0].membershipName;
                        packageAmount = Result[i].payment;
                    }

                    var memberID;

                    if (Result[i].memberId.toString().length == 1)
                        memberid = "000" + Result[i].memberId.toString();
                    else if (Result[i].memberId.toString().length == 2)
                        memberid = "00" + Result[i].memberId.toString();
                    else if (Result[i].memberId.toString().length == 3)
                        memberid = "0" + Result[i].memberId.toString();
                    else
                        memberid = Result[i].memberId;

                    TblMember.row.add([
                        '<label> ' + memberid + ' </label>',
                        '<label> ' + Result[i].firstName + " " + Result[i].lastName + ' </label>',
                        '<label> ' + Result[i].nic + ' </label>',
                        '<label> ' + Result[i].contactNo + ' </label>',
                        '<label> ' + package + ' </label>',
                        '<label> ' + packageAmount + ' </label>',
                        '<label> ' + getFormattedDate(new Date(Result[i].joinDate)) + ' </label>',
                        '<label> ' + getFormattedDate(new Date(Result[i].packageExpirationDate)) + ' </label>',
                        '<label> ' + getFormattedDate(new Date(Result[i].membershipExpirationDate)) + ' </label>'
                    ]).draw(false);
                }

                $("#tbodyid").empty();
                $('.tblMember').append($(tr.join('')));
                $("#noRecords").css("display", "none");
                $("#tblMember").css("display", "table");
            } else if (myData.code == "0") {
                $("#noRecords").css("display", "block");
                $("#tblMember").css("display", "none");
                MembersDetailsArray = [];
                var tr = [];
                $("#tbodyid").empty();
                $('.tblMember').append($(tr.join('')));
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

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

$("#ValueforSearch").bind('keyup', function () {
    SearchMembership();
});

$("#GenderSearch").change(function () {
    $("#wait").css("display", "block");

    var Result = [];
    var gender = $('#GenderSearch').val();

    if ($('#StatusforSearch').val() != "All") {
        var status = $('#StatusforSearch').val() == "true" ? true : false;
        Result = $.grep(MembersDetailsArray, function (v) {
            return v.active == status;
        })
    }
    else
        Result = MembersDetailsArray;

    if (gender != "") {
        Result = $.grep(Result, function (v) {
            return v.gender == gender;
        })
    }

    if (Result.length != 0) {

        TblMember.clear()
            .draw();

        var tr = [];      

        for (var i = 0; i < Result.length; i++) {

            var memberid;

            if (Result[i].memberId.toString().length == 1)
                memberid = "000" + Result[i].memberId.toString();
            else if (Result[i].memberId.toString().length == 2)
                memberid = "00" + Result[i].memberId.toString();
            else if (Result[i].memberId.toString().length == 3)
                memberid = "0" + Result[i].memberId.toString();
            else
                memberid = Result[i].memberId;

            TblMember.row.add([
                '<label> ' + memberid + ' </label>',
                '<label> ' + Result[i].firstName + " " + Result[i].lastName + ' </label>',
                '<label> ' + Result[i].nic + ' </label>',
                '<label> ' + Result[i].contactNo + ' </label>',
                '<label> ' + Result[i].payment + ' </label>',
                '<label> ' + Result[i].payment + ' </label>',
                '<label> ' + getFormattedDate(new Date(Result[i].joinDate)) + ' </label>',
                '<label> ' + getFormattedDate(new Date(Result[i].packageExpirationDate)) + ' </label>',
                '<label> ' + getFormattedDate(new Date(Result[i].membershipExpirationDate)) + ' </label>'
            ]).draw(false);
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
    $("#wait").css("display", "none");
});

$("#SearchOptions").change(function () {
    $('#ValueforSearch').val('');
    SearchMembership();
});

$("#StatusforSearch").change(function () {
    $("#wait").css("display", "block");
    var Result = [];

    if ($('#StatusforSearch').val() != "All") {
        var status = $('#StatusforSearch').val() == "true" ? true : false;
        Result = $.grep(MembersDetailsArray, function (v) {
            return v.active == status;
        })
    }
    else
        Result = MembersDetailsArray;

    var gender = $('#GenderSearch').val();
    if (gender != "") {
        Result = $.grep(Result, function (v) {
            return v.gender == gender;
        })
    }

    if (Result.length != 0) {
        TblMember.clear()
            .draw();
        var tr = [];       

        for (var i = 0; i < Result.length; i++) {

            var memberid;

            if (Result[i].memberId.toString().length == 1)
                memberid = "000" + Result[i].memberId.toString();
            else if (Result[i].memberId.toString().length == 2)
                memberid = "00" + Result[i].memberId.toString();
            else if (Result[i].memberId.toString().length == 3)
                memberid = "0" + Result[i].memberId.toString();
            else
                memberid = Result[i].memberId;

            TblMember.row.add([
                '<label> ' + memberid + ' </label>',
                '<label> ' + Result[i].firstName + " " + Result[i].lastName + ' </label>',
                '<label> ' + Result[i].nic + ' </label>',
                '<label> ' + Result[i].contactNo + ' </label>',
                '<label> ' + Result[i].payment + ' </label>',
                '<label> ' + Result[i].payment + ' </label>',
                '<label> ' + getFormattedDate(new Date(Result[i].joinDate)) + ' </label>',
                '<label> ' + getFormattedDate(new Date(Result[i].packageExpirationDate)) + ' </label>',
                '<label> ' + getFormattedDate(new Date(Result[i].membershipExpirationDate)) + ' </label>'
            ]).draw(false);
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
    $("#wait").css("display", "none");
});

$("#BranchforSearch").change(function () {
    ListMemberDetails();
});

function SearchMembership() {
    $("#wait").css("display", "block");

    var Result = [];
    var gender = $('#GenderSearch').val();

    if ($('#StatusforSearch').val() != "All") {
        var status = $('#StatusforSearch').val() == "true" ? true : false;
        Result = $.grep(MembersDetailsArray, function (v) {
            return v.active == status;
        })
    }
    else
        Result = MembersDetailsArray;

    if (gender != "") {
        Result = $.grep(Result, function (v) {
            return v.gender == gender;
        })
    }

    var searchVal = $('#ValueforSearch').val();
    var searchOpt = $('#SearchOptions').val();

    if (searchOpt == "1") {
        Result = $.grep(Result, function (v) {
            return ((v.firstName.search(new RegExp(searchVal, "i")) != -1) || (v.lastName.search(new RegExp(searchVal, "i")) != -1));
        })
    }
    else if (searchOpt == "2") {
        Result = $.grep(Result, function (v) {
            return (v.nic.search(new RegExp(searchVal, "i")) != -1);
        })
    }
    else if (searchOpt == "3") {
        Result = $.grep(Result, function (v) {
            return (v.contactNo.search(new RegExp(searchVal, "i")) != -1);
        })
    }
    else {
        Result = $.grep(Result, function (v) {
            return (v.memberId === parseInt(searchVal));
        })
    }

    $("#wait").css("display", "none");
    if (Result.length != 0) {
        TblMember.clear().draw();
        var tr = [];

        for (var i = 0; i < Result.length; i++) {

            var memberid;
            if (Result[i].memberId.toString().length == 1)
                memberid = "000" + Result[i].memberId.toString();
            else if (Result[i].memberId.toString().length == 2)
                memberid = "00" + Result[i].memberId.toString();
            else if (Result[i].memberId.toString().length == 3)
                memberid = "0" + Result[i].memberId.toString();
            else
                memberid = Result[i].memberId;

            TblMember.row.add([
                '<label> ' + memberid + ' </label>',
                '<label> ' + Result[i].firstName + " " + Result[i].lastName + ' </label>',
                '<label> ' + Result[i].nic + ' </label>',
                '<label> ' + Result[i].contactNo + ' </label>',
                '<label> ' + Result[i].payment + ' </label>',
                '<label> ' + Result[i].payment + ' </label>',
                '<label> ' + getFormattedDate(new Date(Result[i].joinDate)) + ' </label>',
                '<label> ' + getFormattedDate(new Date(Result[i].packageExpirationDate)) + ' </label>',
                '<label> ' + getFormattedDate(new Date(Result[i].membershipExpirationDate)) + ' </label>'
            ]).draw(false);
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