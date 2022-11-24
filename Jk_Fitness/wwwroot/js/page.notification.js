$(document).ready(function () {
    
    LoadBranchesforSearch();
    var PackageExpirationThisMonthList;
    var PackageExpirationNextMonthList;
    var PackageExpirationLastMonthList;
    var MemberShipExpirationThisMonthList;
    var MemberShipExpirationNextMonthList;
    var MemberShipExpirationLastMonthList;

    var PackageExpirationThisMonth;
    var PackageExpirationNextMonth;
    var PackageExpirationLastMonth;
    var MemberShipExpirationThisMonth;
    var MemberShipExpirationNextMonth;
    var MemberShipExpirationLastMonth;
    
});

function LisNotificationsDetails() {
    
    $.ajax({
        type: 'GET',
        url: $("#GetNotificationDetails").val(),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var Result = myData.data;
                PackageExpirationThisMonthList = Result.packageExpirationThisMonth;
                PackageExpirationNextMonthList = Result.packageExpirationNextMonth;
                PackageExpirationLastMonthList = Result.packageExpirationLastMonth;
                MemberShipExpirationThisMonthList = Result.memberShipExpirationThisMonth;
                MemberShipExpirationNextMonthList = Result.memberShipExpirationNextMonth;
                MemberShipExpirationLastMonthList = Result.memberShipExpirationLastMonth;
                SearchByBranchCode();
            } else {

            }
        },
        error: function (jqXHR, exception) {
        }
    });
}


$("#PackageExpirationLastMonth").click(function () {
    if (PackageExpirationLastMonth.length != 0) {
        var tr = [];
        for (var i = 0; i < PackageExpirationLastMonth.length; i++) {
            tr.push('<tr>');
            tr.push("<td>" + PackageExpirationLastMonth[i].memberId + "</td>");
            tr.push("<td>" + PackageExpirationLastMonth[i].firstName + " " + PackageExpirationLastMonth[i].lastName + "</td>");
            tr.push("<td>" + PackageExpirationLastMonth[i].branch + "</td>");
            tr.push("<td>" + PackageExpirationLastMonth[i].payment + "</td>");
            tr.push("<td>" + getFormattedDate(new Date(PackageExpirationLastMonth[i].packageExpirationDate)) + "</td>");
            tr.push('</tr>');
            $("#tbodyPack").empty();
            $('.tblPackage').append($(tr.join('')));
            $("#noRecordspack").css("display", "none");
            $("#tblPackage").css("display", "table");
        }
    } else {
        $("#noRecordspack").css("display", "block");
        $("#tblPackage").css("display", "none");

        var tr = [];
        $("#tbodyPack").empty();
        $('.tblPackage').append($(tr.join('')));
    }
});

$("#PackageExpirationThisMonth").click(function () {
    if (PackageExpirationThisMonth.length != 0) {
        var tr = [];
        for (var i = 0; i < PackageExpirationThisMonth.length; i++) {
            tr.push('<tr>');
            tr.push("<td>" + PackageExpirationThisMonth[i].memberId + "</td>");
            tr.push("<td>" + PackageExpirationThisMonth[i].firstName + " " + PackageExpirationThisMonth[i].lastName + "</td>");
            tr.push("<td>" + PackageExpirationThisMonth[i].branch + "</td>");
            tr.push("<td>" + PackageExpirationThisMonth[i].payment + "</td>");
            tr.push("<td>" + getFormattedDate(new Date(PackageExpirationThisMonth[i].packageExpirationDate)) + "</td>");
            tr.push('</tr>');
            $("#tbodyPack").empty();
            $('.tblPackage').append($(tr.join('')));
            $("#noRecordspack").css("display", "none");
            $("#tblPackage").css("display", "table");
        }
    } else {
        $("#noRecordspack").css("display", "block");
        $("#tblPackage").css("display", "none");

        var tr = [];
        $("#tbodyPack").empty();
        $('.tblPackage').append($(tr.join('')));
    }
});

$("#PackageExpirationNextMonth").click(function () {
    if (PackageExpirationNextMonth.length != 0) {
        var tr = [];
        for (var i = 0; i < PackageExpirationNextMonth.length; i++) {
            tr.push('<tr>');
            tr.push("<td>" + PackageExpirationNextMonth[i].memberId + "</td>");
            tr.push("<td>" + PackageExpirationNextMonth[i].firstName + " " + PackageExpirationNextMonth[i].lastName + "</td>");
            tr.push("<td>" + PackageExpirationNextMonth[i].branch + "</td>");
            tr.push("<td>" + PackageExpirationNextMonth[i].payment + "</td>");
            tr.push("<td>" + getFormattedDate(new Date(PackageExpirationNextMonth[i].packageExpirationDate)) + "</td>");
            tr.push('</tr>');
            $("#tbodyPack").empty();
            $('.tblPackage').append($(tr.join('')));
            $("#noRecordspack").css("display", "none");
            $("#tblPackage").css("display", "table");
        }
    } else {
        $("#noRecordspack").css("display", "block");
        $("#tblPackage").css("display", "none");

        var tr = [];
        $("#tbodyPack").empty();
        $('.tblPackage').append($(tr.join('')));
    }
});


$("#MembershipExpirationLastMonth").click(function () {
    if (MemberShipExpirationLastMonth.length != 0) {
        var tr = [];
        for (var i = 0; i < MemberShipExpirationLastMonth.length; i++) {
            tr.push('<tr>');
            tr.push("<td>" + MemberShipExpirationLastMonth[i].memberId + "</td>");
            tr.push("<td>" + MemberShipExpirationLastMonth[i].firstName + " " + MemberShipExpirationLastMonth[i].lastName + "</td>");
            tr.push("<td>" + MemberShipExpirationLastMonth[i].branch + "</td>");
            tr.push("<td>" + MemberShipExpirationLastMonth[i].payment + "</td>");
            tr.push("<td>" + getFormattedDate(new Date(MemberShipExpirationLastMonth[i].membershipExpirationDate)) + "</td>");
            tr.push('</tr>');
            $("#tbodyidMem").empty();
            $('.tblMember').append($(tr.join('')));
            $("#noRecordsmem").css("display", "none");
            $("#tblMember").css("display", "table");
        }
    } else {
        $("#noRecordsmem").css("display", "block");
        $("#tblMember").css("display", "none");

        var tr = [];
        $("#tbodyidMem").empty();
        $('.tblMember').append($(tr.join('')));
    }
});

$("#MembershipExpirationThisMonth").click(function () {
    if (MemberShipExpirationThisMonth.length != 0) {
        var tr = [];
        for (var i = 0; i < MemberShipExpirationThisMonth.length; i++) {
            tr.push('<tr>');
            tr.push("<td>" + MemberShipExpirationThisMonth[i].memberId + "</td>");
            tr.push("<td>" + MemberShipExpirationThisMonth[i].firstName + " " + MemberShipExpirationThisMonth[i].lastName + "</td>");
            tr.push("<td>" + MemberShipExpirationThisMonth[i].branch + "</td>");
            tr.push("<td>" + MemberShipExpirationThisMonth[i].payment + "</td>");
            tr.push("<td>" + getFormattedDate(new Date(MemberShipExpirationThisMonth[i].membershipExpirationDate)) + "</td>");
            tr.push('</tr>');
            $("#tbodyidMem").empty();
            $('.tblMember').append($(tr.join('')));
            $("#noRecordsmem").css("display", "none");
            $("#tblMember").css("display", "table");
        }
    } else {
        $("#noRecordsmem").css("display", "block");
        $("#tblMember").css("display", "none");

        var tr = [];
        $("#tbodyidMem").empty();
        $('.tblMember').append($(tr.join('')));
    }
});

$("#MembershipExpirationNextMonth").click(function () {
    if (MemberShipExpirationNextMonth.length != 0) {
        var tr = [];
        for (var i = 0; i < MemberShipExpirationNextMonth.length; i++) {
            tr.push('<tr>');
            tr.push("<td>" + MemberShipExpirationNextMonth[i].memberId + "</td>");
            tr.push("<td>" + MemberShipExpirationNextMonth[i].firstName + " " + MemberShipExpirationNextMonth[i].lastName + "</td>");
            tr.push("<td>" + MemberShipExpirationNextMonth[i].branch + "</td>");
            tr.push("<td>" + MemberShipExpirationNextMonth[i].payment + "</td>");
            tr.push("<td>" + getFormattedDate(new Date(MemberShipExpirationNextMonth[i].membershipExpirationDate)) + "</td>");
            tr.push('</tr>');
            $("#tbodyidMem").empty();
            $('.tblMember').append($(tr.join('')));
            $("#noRecordsmem").css("display", "none");
            $("#tblMember").css("display", "table");
        }
    } else {
        $("#noRecordsmem").css("display", "block");
        $("#tblMember").css("display", "none");

        var tr = [];
        $("#tbodyidMem").empty();
        $('.tblMember').append($(tr.join('')));
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
                LisNotificationsDetails();
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

$("#BranchforSearch").change(function () {
    SearchByBranchCode(); 
});

function SearchByBranchCode() {
    var val = $("#BranchforSearch").val();
    PackageExpirationThisMonth = $.grep(PackageExpirationThisMonthList, function (v) {
        return (v.branch == val);
    })
    PackageExpirationNextMonth = $.grep(PackageExpirationNextMonthList, function (v) {
        return (v.branch == val);
    })
    PackageExpirationLastMonth = $.grep(PackageExpirationLastMonthList, function (v) {
        return (v.branch == val);
    })
    MemberShipExpirationThisMonth = $.grep(MemberShipExpirationThisMonthList, function (v) {
        return (v.branch == val);
    })
    MemberShipExpirationNextMonth = $.grep(MemberShipExpirationNextMonthList, function (v) {
        return (v.branch == val);
    })
    MemberShipExpirationLastMonth = $.grep(MemberShipExpirationLastMonthList, function (v) {
        return (v.branch == val);
    })
    document.getElementById('PackageExpirationLastMonth').click();
}