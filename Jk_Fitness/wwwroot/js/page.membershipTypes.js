$(document).ready(function () {
    ListMembershipDetails();
    if ($('#add').val() == "1" || $('#add').val() == "2") {
        $("#btnAdd").attr('hidden', false);
    }
    else {
        $("#btnAdd").attr('hidden', true);
    }
});
var MembershipDetailsArray = [];

function LoadMonths() {
    $('#Months').find('option').remove().end();
    Salutation = $('#Months');
    var SalutationList = [
        { Id: 1, Name: "1" },
        { Id: 2, Name: "2" },
        { Id: 3, Name: "3" },
        { Id: 4, Name: "4" },
        { Id: 5, Name: "5" },
        { Id: 6, Name: "6" },
        { Id: 7, Name: "7" },
        { Id: 8, Name: "8" },
        { Id: 9, Name: "9" },
        { Id: 10, Name: "10" },
        { Id: 11, Name: "11" },
        { Id: 12, Name: "12" }
    ];
    Salutation.append($("<option/>").val(0).text("-Select Months-"))
    $.each(SalutationList, function () {
        Salutation.append($("<option/>").val(this.Id).text(this.Name));
    });
}

$('#MemAmount').bind('keyup', function () {
    var RangeFrom = $('#MemAmount').val();
    if ($.isNumeric(RangeFrom)) {
        $("#Rfrm").css("display", "none");
        $("#btnAddMembership").attr("disabled", false);
    }
    else {
        $("#Rfrm").css("display", "flex");
        $("#btnAddMembership").attr("disabled", true);
    }
});

$('#btnAdd').click(function () {
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    $('#MembershipTypeModal').modal('show');
    $("#MembershipField").css("display", "none");
    LoadMonths();
});

$('#btnAddMembership').click(function () {
    var Id = $('#MembershipId').val();
    var MembershipName = $('#Mname').val();
    var Months = $('#Months').val();
    var MemAmount = $('#MemAmount').val();
    var IsEnable = $('#Enabled').prop('checked') ? "true" : "false";

   
    var data = '{"Id": ' + Id +
        ' ,"MembershipName":"' + MembershipName + 
        ' ","IsEnable": ' + IsEnable +
        ' ,"MembershipAmount": ' + MemAmount + ' ,"MonthsPerPackage": ' + Months +'}';

    if (!$('#Mname').val() || !$('#MemAmount').val() || Months == 0 ) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Empty Value Can not be Allow!',
        });
    }
    else {
        $("#wait").css("display", "block");
        $('.modal').addClass('freeze');
        $('.modal-content').addClass('freeze');
        $("#btnAddMembership").attr("disabled", true);
        if (Id == "" || Id == "0") {

            $.ajax({
                type: 'POST',
                url: $("#SaveMembershipType").val(),
                dataType: 'json',
                data: data,
                contentType: 'application/json; charset=utf-8',
                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#wait").css("display", "none");
                    $("#btnAddMembership").attr("disabled", false);
                    if (myData.code == "1") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        $('#MembershipTypeModal').modal('toggle');
                        ListMembershipDetails();
                        Clear();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                        });
                        Clear();
                    }
                },
                error: function (jqXHR, exception) {
                }
            });

        } else {

            $.ajax({
                type: 'POST',
                url: $("#UpdateMembershipType").val(),
                dataType: 'json',
                data: data,
                contentType: 'application/json; charset=utf-8',
                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#wait").css("display", "none");
                    $("#btnAddMembership").attr("disabled", false);
                    if (myData.code == "1") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been Updated',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        $('#MembershipTypeModal').modal('toggle');
                        ListMembershipDetails();
                        Clear();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                        });
                        Clear();
                    }
                },
                error: function (jqXHR, exception) {
                }
            });
        }
    }
});

function ListMembershipDetails() {
    $("#wait").css("display", "block");
    $.ajax({
        type: 'GET',
        url: $("#GetMembershipTypeDetails").val(),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            $("#wait").css("display", "none");
            if (myData.code == "1") {
                var ResList = myData.data;
                MembershipDetailsArray = ResList;
                var tr = [];
                for (var i = 0; i < ResList.length; i++) {
                    tr.push('<tr>');
                    tr.push("<td>" + ResList[i].membershipCode + "</td>");
                    tr.push("<td>" + ResList[i].membershipName + "</td>");
                    tr.push("<td>" + ResList[i].monthsPerPackage + "</td>");
                    tr.push("<td>" + ResList[i].membershipAmount.toFixed(2) + "</td>");
                    if (ResList[i].isEnable == true)
                        tr.push("<td><strong style=\"color:green\">Enabled</strong></td>");
                    else
                        tr.push("<td><strong style=\"color:red\">Disabled</strong></td>");

                    var td = [];
                    td.push('<td>');
                    if ($('#edit').val() == 1 || $('#edit').val() == 2)
                        td.push("<button onclick=\"EditMembershipType('" + ResList[i].id + "')\" class=\"btn btn-primary\"><i class=\"fa fa-edit\"></i> </button>");

                    if ($('#delete').val() == 1 || $('#delete').val() == 2) {
                        if (ResList[i].isDeleteble == true)
                            td.push("<button onclick=\"DeleteBranch('" + ResList[i].id + "')\" class=\"btn btn-danger\"><i class=\"fa fa-trash\"></i> </button>");
                        else
                            td.push("<button onclick=\"DeleteBranch('" + ResList[i].id + "')\" class=\"btn btn-danger\" disabled><i class=\"fa fa-trash\"></i> </button>");
                    }
                    td.push('</td>');

                    tr.push(td.join(' '));
                    tr.push('</tr>');
                }

                $("#tbodyid").empty();
                $('.tblMembershipTypes').append($(tr.join('')));
                $("#noRecords").css("display", "none");
                $("#tblMembershipTypes").css("display", "table");
            } else if (myData.code == "0") {
                $("#noRecords").css("display", "block");
                $("#tblMembershipTypes").css("display", "none");
                var tr = [];
                $("#tbodyid").empty();
                $('.tblMembershipTypes').append($(tr.join('')));
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

function EditMembershipType(Id) {
    $("#wait").css("display", "block");
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    $("#MembershipField").css("display", "flex");
    LoadMonths();

    var MembershipDetails = $.grep(MembershipDetailsArray, function (v) {
        return v.id == Id;
    })

    if (MembershipDetails.length != 0) {
        var Result = MembershipDetails[0];
        $("#MembershipId").val(Result['id']);
        $("#Mcode").val(Result['membershipCode']);
        $("#Mname").val(Result['membershipName']);
        $("#Months").val(Result['monthsPerPackage']);
        $("#MemAmount").val(Result['membershipAmount'].toFixed(2));
        $("#Enabled").prop("checked", Result.isEnable)
        $("#wait").css("display", "none");
        $('#MembershipTypeModal').modal('show');
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        });
    }
}

function DeleteBranch(Id) {

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
                url: $("#DeleteMembershipType").val(),
                dataType: 'json',
                data: '{"Id": "' + Id + '"}',
                contentType: 'application/json; charset=utf-8',
                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#wait").css("display", "none");
                    if (myData.code == "1") {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Your record has been deleted.',
                            icon: 'success',
                        });
                        ListMembershipDetails();
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
    })
}


function Clear() {
    $('#MembershipId').val('0');
    $('#Mcode').val('');
    $('#Mname').val('');
    $('#Months').val('');
    $('#MemAmount').val('');
    $('#Status').prop('checked', true);
    $("#Rfrm").css("display", "none");
    $("#btnAddMembership").attr("disabled", false);
}

function Cancel() {
    $('#MembershipTypeModal').modal('toggle');
    Clear();
}

$('#btnSearch').click(function () {
    $("#wait").css("display", "block");
    var MemName = $('#MembershipName').val();
    var MemCode = $('#MembershipCode').val();

    var ResList = $.grep(MembershipDetailsArray, function (v) {
        return (v.membershipName.search(new RegExp(MemName, "i")) != -1 && v.membershipCode.search(new RegExp(MemCode, "i") != -1));
    })
    $("#wait").css("display", "none");

    if (ResList.length != 0) {
        var tr = [];
        for (var i = 0; i < ResList.length; i++) {
            tr.push('<tr>');
            tr.push("<td>" + ResList[i].membershipCode + "</td>");
            tr.push("<td>" + ResList[i].membershipName + "</td>");
            tr.push("<td>" + ResList[i].monthsPerPackage + "</td>");
            tr.push("<td>" + ResList[i].membershipAmount.toFixed(2) + "</td>");
            if (ResList[i].isEnable == true)
                tr.push("<td><strong style=\"color:green\">Enabled</strong></td>");
            else
                tr.push("<td><strong style=\"color:red\">Disabled</strong></td>");
            var td = [];
            td.push('<td>');
            if ($('#edit').val() == 1 || $('#edit').val() == 2)
                td.push("<button onclick=\"EditMembershipType('" + ResList[i].id + "')\" class=\"btn btn-primary\"><i class=\"fa fa-edit\"></i> </button>");

            if ($('#delete').val() == 1 || $('#delete').val() == 2) {
                if (ResList[i].isDeleteble == true)
                    td.push("<button onclick=\"DeleteBranch('" + ResList[i].id + "')\" class=\"btn btn-danger\"><i class=\"fa fa-trash\"></i> </button>");
                else
                    td.push("<button onclick=\"DeleteBranch('" + ResList[i].id + "')\" class=\"btn btn-danger\" disabled><i class=\"fa fa-trash\"></i> </button>");
            }
            td.push('</td>');

            tr.push(td.join(' '));
            tr.push('</tr>');
        }

        $("#tbodyid").empty();
        $('.tblMembershipTypes').append($(tr.join('')));
        $("#noRecords").css("display", "none");
        $("#tblMembershipTypes").css("display", "table");
    }
    else {
        $("#noRecords").css("display", "block");
        $("#tblMembershipTypes").css("display", "none");
        var tr = [];
        $("#tbodyid").empty();
        $('.tblMembershipTypes').append($(tr.join('')));
    }
});
