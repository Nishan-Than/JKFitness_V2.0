    $(document).ready(function () {
        ListBranchDetails();
        var add = $('#add').val();
        if ($('#add').val() == "1" || $('#add').val() == "2") {
            $("#btnAdd").attr('hidden', false);
        }
        else {
            $("#btnAdd").attr('hidden', true);
        }
    });
var BranchDetailsArray = [];

$('#btnAdd').click(function () {
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    $('#BranchModal').modal('show');
    $("#BranchField").css("display", "none");
    $("#InRangefrom").attr("disabled", false);
    $("#InRangeTo").attr("disabled", false);
});

$('#InRangefrom').bind('keyup', function () {
    var RangeFrom = parseInt($('#InRangefrom').val());
    var RangeTo = parseInt($('#InRangeTo').val());
    if ($.isNumeric(RangeFrom)) {

        var Results = $.grep(BranchDetailsArray, function (v) {
            return (RangeFrom >= v.membershipInitialRangeFrom && RangeFrom <= v.membershipInitialRangeTo);
        })

        if (Results.length == 0) {
            $("#Rfrm").css("display", "none");
            $("#RfrmId").css("display", "none");
            if ($.isNumeric(RangeTo)) {
                if (RangeTo <= RangeFrom) {
                    $(".ovlap").css("display", "none");
                    $("#RfrmDif").css("display", "flex");
                } else {
                    $("#RfrmDif").css("display", "none");
                    var recs = $.grep(BranchDetailsArray, function (v) {
                        return (RangeFrom < v.membershipInitialRangeFrom && RangeTo > v.membershipInitialRangeTo);
                    })

                    if (recs.length > 0)
                        $(".ovlap").css("display", "flex");
                    else {
                        $(".ovlap").css("display", "none");
                        $("#btnAddBranch").attr("disabled", false);
                    }                        
                }
                
            } else {
                $("#RfrmDif").css("display", "none");
                $("#RtoDif").css("display", "none");
                $(".ovlap").css("display", "none");
                $("#btnAddBranch").attr("disabled", false);
            }           
        }else {            
            $("#RfrmId").css("display", "flex");
            $("#Rfrm").css("display", "none");
            $("#RfrmDif").css("display", "none");
            $("#btnAddBranch").attr("disabled", true);
        }       
    }
    else {
        $("#Rfrm").css("display", "flex");
        $("#RfrmId").css("display", "none");
        $("#RtoDif").css("display", "none");
        $("#btnAddBranch").attr("disabled", true);
    }
});

$('#InRangeTo').bind('keyup', function () {
    var RangeFrom = parseInt($('#InRangefrom').val());
    var RangeTo = parseInt($('#InRangeTo').val());
    if ($.isNumeric(RangeTo)) {

        var Results = $.grep(BranchDetailsArray, function (v) {
            return ((RangeTo >= v.membershipInitialRangeFrom && RangeTo <= v.membershipInitialRangeTo));
        })
        if (Results.length == 0) {
            $("#Rto").css("display", "none");
            $("#RtoID").css("display", "none");
            if ($.isNumeric(RangeFrom)) {
                if ((RangeTo <= RangeFrom)) {
                    $(".ovlap").css("display", "none");
                    $("#RtoDif").css("display", "flex");
                } else {
                    $("#RtoDif").css("display", "none");
                    var recs = $.grep(BranchDetailsArray, function (v) {
                        return (RangeFrom < v.membershipInitialRangeFrom && RangeTo > v.membershipInitialRangeTo);
                    });

                    if (recs.length > 0)
                        $(".ovlap").css("display", "flex");
                    else {
                        $(".ovlap").css("display", "none");
                        $("#btnAddBranch").attr("disabled", false);
                    }
                }
               
            } else {               
                $("#RtoDif").css("display", "none");
                $("#RfrmDif").css("display", "none");
                $(".ovlap").css("display", "none");
                $("#btnAddBranch").attr("disabled", false);
            }          
        }
        else {
            $("#RtoID").css("display", "flex");
            $("#Rto").css("display", "none");
            $("#RtoDif").css("display", "none");
            $("#btnAddBranch").attr("disabled", true);
        }
    }
    else {
        $("#Rto").css("display", "flex");
        $("#RtoID").css("display", "none");
        $("#RtoDif").css("display", "none");
        $("#btnAddBranch").attr("disabled", true);
    }
});

$('#MonthRange').bind('keyup', function () {
    var MonthRange = $('#MonthRange').val();
    if ($.isNumeric(MonthRange)) {
        if (MonthRange > 12) {
            $("#ValidRange").css("display", "flex");
            $("#mRange").css("display", "none");
            $("#btnAddBranch").attr("disabled", true);
        }
        else {
            $("#mRange").css("display", "none");
            $("#ValidRange").css("display", "none");
            $("#btnAddBranch").attr("disabled", false);
        }
    }
    else if (!$.isNumeric(MonthRange)) {
        $("#mRange").css("display", "flex");
        $("#ValidRange").css("display", "none");
        $("#btnAddBranch").attr("disabled", true);
    }
});

$('#btnAddBranch').click(function () {
    var Id = $('#BranchId').val();
    var BranchName = $('#Bname').val();
    var RangeFrom = $('#InRangefrom').val();
    var RangeTo = $('#InRangeTo').val();
    var MonthRange = $('#MonthRange').val();
    var BranchCode = $("#Bcode").val();

   
    var data = '{"Id": ' + Id +
        ' ,"BranchName":" ' + BranchName +
        ' " ,"MembershipInitialRangeFrom": ' + RangeFrom +
        ',"BranchCode":"' + BranchCode +
        ' " ,"MembershipInitialRangeTo": ' + RangeTo +
        ' ,"MembershipActiveMonthRange": ' + MonthRange + '}';

    if (!$('#Bname').val() || !$('#InRangefrom').val() || !$('#InRangeTo').val() || !$('#MonthRange').val()) {
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
        $("#btnAddBranch").attr("disabled", true);
        if (Id == "" || Id == "0") {

            $.ajax({
                type: 'POST',
                url: $("#SaveBranch").val(),
                dataType: 'json',
                data: data,
                contentType: 'application/json; charset=utf-8',
                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#wait").css("display", "none");
                    $("#btnAddBranch").attr("disabled", false);
                    if (myData.code == "1") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        $('#BranchModal').modal('toggle');
                        ListBranchDetails();
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
                url: $("#Updatebranch").val(),
                dataType: 'json',
                data: data,
                contentType: 'application/json; charset=utf-8',
                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#wait").css("display", "none");
                    $("#btnAddBranch").attr("disabled", false);
                    if (myData.code == "1") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been Updated',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        $('#BranchModal').modal('toggle');
                        ListBranchDetails();
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

function onlyUnique(uniqueRecords, duplicateRecords, ResList) {

    jQuery.each(ResList, function (index, item) {

        if (uniqueRecords.length == 0)
            uniqueRecords.push(item);
        else {
            var recs = $.grep(uniqueRecords, function (v) {
                return (v.branchCode == item.branchCode);
            });

            if (recs.length == 0)
                uniqueRecords.push(item);
            else
                duplicateRecords.push(item);
        }
    });
}


function ListBranchDetails() {
    $("#wait").css("display", "block");
    $.ajax({
        type: 'GET',
        url: $("#GetBranchDetails").val(),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            $("#wait").css("display", "none");
            if (myData.code == "1") {
                var ResList = myData.data;
                BranchDetailsArray = ResList;
                var uniqueRecords = [];
                var duplicateRecords = [];
                onlyUnique(uniqueRecords, duplicateRecords, ResList)                

                var tr = [];
                for (var i = 0; i < uniqueRecords.length; i++) {

                    var additionalRecs = $.grep(duplicateRecords, function (v) {
                        return (v.branchCode == uniqueRecords[i].branchCode);
                    });

                    tr.push('<tr>');
                    tr.push("<td>" + uniqueRecords[i].branchCode + "</td>");
                    tr.push("<td>" + uniqueRecords[i].branchName + "</td>");
                    if (additionalRecs.length == 0)
                        tr.push("<td>" + uniqueRecords[i].membershipInitialRangeFrom + " - " + uniqueRecords[i].membershipInitialRangeTo + "</td>");
                    else {
                        var td = [];
                        td.push("<td>" + uniqueRecords[i].membershipInitialRangeFrom + " - " + uniqueRecords[i].membershipInitialRangeTo);
                        jQuery.each(additionalRecs, function (index, item) {
                            td.push("<br />" + item.membershipInitialRangeFrom + " - " + item.membershipInitialRangeTo);
                        });
                        td.push("</td>");
                        tr.push(td);
                    }
                   /* for feature Use*/
                /* tr.push("<td>" + uniqueRecords[i].membershipActiveMonthRange + "</td>");*/

                    var td1 = [];
                    td1.push('<td>');
                    if ($('#edit').val() == 1 || $('#edit').val() == 2)
                        td1.push("<button onclick=\"EditBranch('" + uniqueRecords[i].id + "')\" class=\"btn btn-primary\"><i class=\"fa fa-edit\"></i></button>");

                    if ($('#delete').val() == 1 || $('#delete').val() == 2) {
                        if (uniqueRecords[i].isDeleteble == true)
                            td1.push("<button onclick=\"DeleteBranch('" + uniqueRecords[i].id + "')\" class=\"btn btn-danger\"><i class=\"fa fa-trash\"></i></button>");
                        else
                            td1.push("<button onclick=\"DeleteBranch('" + uniqueRecords[i].id + "')\" class=\"btn btn-danger\"disabled><i class=\"fa fa-trash\"></i>  </button>");
                    }
                    td1.push('</td>');

                    tr.push(td1.join(' '));

                    tr.push('</tr>');
                }

                $("#tbodyid").empty();
                $('.tblBranch').append($(tr.join('')));
                $("#noRecords").css("display", "none");
                $("#tblBranch").css("display", "table");
            } else if (myData.code == "0") {
                $("#noRecords").css("display", "block");
                $("#tblBranch").css("display", "none");
                var tr = [];
                $("#tbodyid").empty();
                $('.tblBranch').append($(tr.join('')));                
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

function EditBranch(Id) {
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    $("#wait").css("display", "block");   
    $("#BranchField").css("display", "flex");
    $("#InRangefrom").attr("disabled", true);
    $("#InRangeTo").attr("disabled", true);

    var BranchDetails = $.grep(BranchDetailsArray, function (v) {
        return v.id == Id;
    })

    if (BranchDetails.length != 0) {
        var Result = BranchDetails[0];
        $("#BranchId").val(Result['id']);
        $("#Bcode").val(Result['branchCode']);
        $("#Bname").val(Result['branchName']);
        $("#InRangefrom").val(Result['membershipInitialRangeFrom']);
        $("#InRangeTo").val(Result['membershipInitialRangeTo']);
        $("#MonthRange").val(Result['membershipActiveMonthRange']);

        $("#wait").css("display", "none");
        $('#BranchModal').modal('show');
    }
    else {
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
                url: $("#DeleteBranch").val(),
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
                        ListBranchDetails();
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
    $('#BranchId').val('0');
    $('#Bcode').val('');
    $('#Bname').val('');
    $('#InRangefrom').val('');
    $('#InRangeTo').val('');
    $('#MonthRange').val('');
    $("#RfrmDif").css("display", "none");
    $("#RtoDif").css("display", "none");
    $(".ovlap").css("display", "none");
    $("#Rto").css("display", "none");
    $("#Rfrm").css("display", "none");
    $("#RfrmId").css("display", "none");
    $("#RtoID").css("display", "none");
    $("#mRange").css("display", "none");
    $("#ValidRange").css("display", "none");
    $("#btnAddBranch").attr("disabled", false);
}

function Cancel() {
    $('#BranchModal').modal('toggle');
    Clear();
}

$('#btnSearch').click(function () {
    $("#wait").css("display", "block");
    var BrName = $('#BranchName').val();
    var BrCode = $('#BranchCode').val();

    var ResList = $.grep(BranchDetailsArray, function (v) {
        return (v.branchName.search(new RegExp(BrName, "i")) != -1 && v.branchCode.search(new RegExp(BrCode, "i") != -1));
    })

    $("#wait").css("display", "none");
    var uniqueRecords = [];
    var duplicateRecords = [];
    onlyUnique(uniqueRecords, duplicateRecords, ResList)     
    if (uniqueRecords.length != 0) {

        var tr = [];
        for (var i = 0; i < uniqueRecords.length; i++) {

            var additionalRecs = $.grep(duplicateRecords, function (v) {
                return (v.branchCode == uniqueRecords[i].branchCode);
            });

            tr.push('<tr>');
            tr.push("<td>" + uniqueRecords[i].branchCode + "</td>");
            tr.push("<td>" + uniqueRecords[i].branchName + "</td>");;
            if (additionalRecs.length == 0)
                tr.push("<td>" + uniqueRecords[i].membershipInitialRangeFrom + " - " + uniqueRecords[i].membershipInitialRangeTo + "</td>");
            else {
                var td = [];
                td.push("<td>" + uniqueRecords[i].membershipInitialRangeFrom + " - " + uniqueRecords[i].membershipInitialRangeTo);
                jQuery.each(additionalRecs, function (index, item) {
                    td.push("<br />" + item.membershipInitialRangeFrom + " - " + item.membershipInitialRangeTo);
                });
                td.push("</td>");
                tr.push(td);
            }
           /* tr.push("<td>" + uniqueRecords[i].membershipActiveMonthRange + "</td>");;*/
            var td1 = [];
            td1.push('<td>');
            if ($('#edit').val() == 1 || $('#edit').val() == 2)
                td1.push("<button onclick=\"EditBranch('" + uniqueRecords[i].id + "')\" class=\"btn btn-primary\"><i class=\"fa fa-edit\"></i></button>");

            if ($('#delete').val() == 1 || $('#delete').val() == 2) {
                if (uniqueRecords[i].isDeleteble == true)
                    td1.push("<button onclick=\"DeleteBranch('" + uniqueRecords[i].id + "')\" class=\"btn btn-danger\"><i class=\"fa fa-trash\"></i></button>");
                else
                    td1.push("<button onclick=\"DeleteBranch('" + uniqueRecords[i].id + "')\" class=\"btn btn-danger\"disabled><i class=\"fa fa-trash\"></i>  </button>");
            }
            td1.push('</td>');

            tr.push(td1.join(' '));

            tr.push('</tr>');
        }

        $("#tbodyid").empty();
        $('.tblBranch').append($(tr.join('')));
        $("#noRecords").css("display", "none");
        $("#tblBranch").css("display", "table");
    } else{
        $("#noRecords").css("display", "block");
        $("#tblBranch").css("display", "none");
        var tr = [];
        $("#tbodyid").empty();
        $('.tblBranch').append($(tr.join('')));
    }
});
