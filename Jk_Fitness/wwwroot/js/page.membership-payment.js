$(document).ready(function () {
    var MemberShipPackageArray;
    LoadMemberShipType();
    $("#PartitalFields").attr("hidden", true);
    $("#Advance").attr("hidden", true);
    $("#PaymentDate").val(getFormattedDate(new Date()));
    $("#Pamount").val(0);
    $("#Bamount").val(0);
    $("#PartialPay").attr("disabled", true);
    $("#PastPay").attr("disabled", true);
    $("#btnSavePay").attr("disabled", true);
});

var BalanceAmt = 0;
var isUpdate = false;
var paymentDetails;
var packageExpirationDate;
var MembershipPackageId;
var MembershipPackageAmount;

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}
$(function () {
    //Date picker
    $('#date').datetimepicker({
        format: 'L'
    })
});

$('#Pamount').bind('keyup', function () {
    var value = $('#Pamount').val();
    var bamt = $("#Bamount").val();
    if ($.isNumeric(value) && value != 0) {

        if (!isUpdate) {
            $("#Bamount").val((parseFloat($("#Mamount").val()) - parseFloat($("#Pamount").val())).toFixed(2));
            if ($("#Bamount").val() > 0) {
                $("#btnSavePay").attr("disabled", false);
            } else {
                $("#btnSavePay").attr("disabled", true);
            }
        }
        else {
            $("#Bamount").val(parseFloat(BalanceAmt - parseFloat($("#Pamount").val())).toFixed(2));
            if ($("#Bamount").val() >= 0) {
                $("#btnSavePay").attr("disabled", false);
            } else {
                $("#btnSavePay").attr("disabled", true);
            }
        }

        $("#amtValid").css("display", "none");
        /*$("#btnSavePay").attr("disabled", false);*/
    }
    else {
        $("#amtValid").css("display", "flex");
        $("#btnSavePay").attr("disabled", true);
    }
});

$("#btnClear").click(function () {
    Clear();
})

function Clear() {
    $("#MebershipNo").val("");
    $('#Fname').val("");
    $('#Lname').val("");
    $('#Mamount').val("");
    $('#Branch').val("");
    $("#PartialPay").prop("checked", false); 
    $("#PastPay").prop("checked", false);
    $("#PaymentDate").val(getFormattedDate(new Date()));
    $("#Pamount").val(BalanceAmt);
    $("#Bamount").val(BalanceAmt);
    $('#PackageId').val(0);
    $("#PartitalFields").attr("hidden", true);
    $("#PackageId").attr("disabled", false);
    $("#btnSavePay").attr("disabled", true);
    $("#Partial").attr("hidden", false);
    $("#Past").attr("hidden", false);
    $("#Advance").attr("hidden", true);
    $("#PaymentDate").attr("disabled", false);
}

$("#PartialPay").change(function () {
    var partialPay = $('#PartialPay').prop('checked') ? "true" : "false";
    forPartialPayment(partialPay);
    
});

function forPartialPayment(partialPay) {
    if (partialPay == "true") {
        $("#PackageId").attr("disabled", true);
        $("#PackageId").val(MembershipPackageId);
        $("#Mamount").val(MembershipPackageAmount);
        $("#PartitalFields").attr("hidden", false);
        $("#PartialPayTbl").attr("hidden", true);
        if ($('#Mamount').val() == "")
            $("#Bamount").val(0);
        else
            $("#Bamount").val($('#Mamount').val());

    } else {
        $("#PartitalFields").attr("hidden", true);
        $("#PackageId").attr("disabled", false);
        $('#Bamount').val("");
        $("#Pamount").val(0);
    }
}

$("#PastPay").change(function () {
    var pastPay = $('#PastPay').prop('checked') ? "true" : "false";

    if (pastPay == "true") {
        $("#Partial").attr("hidden", true);
        $("#PartialPay").prop("checked", false);
        forPartialPayment(false);
    } else {
        $("#Partial").attr("hidden", false);
    }
})

$("#btnSearch").click(function () {

    $("#wait").css("display", "block");
    $("#PackageId").attr("disabled", false);
    $("#PartitalFields").attr("hidden", true);
    $("#btnSavePay").attr("disabled", false);
    $.ajax({
        type: 'GET',
        url: $("#GetMemberDetails").val(),
        dataType: 'json',
        data: { memberId: parseInt($('#MebershipNo').val()) },
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            $("#wait").css("display", "none");
            if (myData.code == "1") {
                var Result = myData.data;
                $("#Fname").val(Result['firstName']);
                $("#Lname").val(Result['lastName']);
                /* $("#Mtype").val(Result['packageType']);*/
                $("#Mamount").val(Result['packageAmount']);
                $("#PartialPay").prop("checked", Result['isPartialPayment']);
                $("#Branch").val(Result['branch']);
                $("#PackageId").val(Result['packageId']);
                $("#PartialPay").attr("disabled", false);
                $("#PastPay").attr("disabled", false);
                $("#AdvancePay").prop("checked", Result['isAdvancePayment']);
                $("#PaymentDate").val(getFormattedDate(new Date()));
                if (Result['isAdvancePayment']) {

                    $("#Partial").attr("hidden", true);
                    $("#Past").attr("hidden", true);
                    $("#Advance").attr("hidden", false);


                } else {
                    $("#Partial").attr("hidden", false);
                    $("#Past").attr("hidden", false);
                    $("#Advance").attr("hidden", true);


                }

                MembershipPackageId = Result.packageId;
                MembershipPackageAmount = Result.packageAmount.toFixed(2);

                packageExpirationDate = getFormattedDate(new Date(Result.packageExpirationDate));

                if (Result['isPartialPayment'] == true) {
                    $('#Bamount').val(0);
                    BalanceAmt = Result.paymentDetails.balanceAmount.toFixed(2);
                    $("#Pamount").val(BalanceAmt);
                    paymentDetails = Result.paymentDetails;
                    var tr = [];
                    for (var i = 0; i < Result.partialPayments.length; i++) {
                        tr.push('<tr>');
                        tr.push("<td>" + getFormattedDate(new Date(Result.partialPayments[i].paymentDate)) + "</td>");;
                        tr.push("<td>" + Result.partialPayments[i].paidAmount.toFixed(2) + "</td>");
                        tr.push('</tr>');
                    }

                    $("#tbodyid").empty();
                    $('.tblMember').append($(tr.join('')));
                    $("#tblPayments").css("display", "table");

                    $("#PartialPay").attr("disabled", true);
                    $("#Past").attr("hidden", true);
                    $("#PartitalFields").attr("hidden", false);
                    isUpdate = true;
                    $("#PartialPayTbl").attr("hidden", false);
                }
            } else {
                Clear();
                Swal.fire({
                    icon: 'warning',
                    title: 'Sorry...',
                    text: myData.message,
                });
            }
        },
        error: function (jqXHR, exception) {
        }
    });
});

$("#btnSavePay").click(function () {

    var PaidAmount = $('#Pamount').val();
    var PaymentDate = $('#PaymentDate').val();


    $("#wait").css("display", "block");
    $("#btnSavePay").attr("disabled", true);
    $('.card-body').addClass('freeze');

    if (!isUpdate) {

        var data = new FormData();
        data.append("MemberId", $('#MebershipNo').val());
        data.append("PackageType", $('#PackageId').val());
        data.append("PackageAmount", $('#Mamount').val());
        data.append("IsPartialPay", $('#PartialPay').prop('checked') ? "true" : "false");
        data.append("BalanceAmount", $('#Bamount').val());
        data.append("PaymentDate", $('#PaymentDate').val());
        data.append("IsAdvancePay", $('#AdvancePay').prop('checked') ? "true" : "false");
        data.append("IsPastPay", $('#PastPay').prop('checked') ? "true" : "false");

        $.ajax({
            type: 'POST',
            url: $("#SaveMembershipPayment").val(),
            dataType: 'json',
            data: data,
            processData: false,
            contentType: false,
            success: function (response) {
                var myData = jQuery.parseJSON(JSON.stringify(response));

                if (myData.data['isPartialPay'] == true) {
                    var data = new FormData();
                    data.append("PaymentId", myData.data['id']);
                    data.append("PaymentDate", PaymentDate);
                    data.append("PaidAmount", PaidAmount);

                    $.ajax({
                        type: 'POST',
                        url: $("#SaveMembershipPartialPayment").val(),
                        dataType: 'json',
                        data: data,
                        processData: false,
                        contentType: false,
                        success: function (response) {
                            var myData = jQuery.parseJSON(JSON.stringify(response));

                            if (myData.code == "1") {
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'Your work has been saved',
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                                successLoad();
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: myData.message,
                                });
                            }
                        }
                    });
                } else {
                    if (myData.code == "1") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        successLoad();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: myData.message,
                        });
                    }
                }
            }
        });
    }
    else {
        paymentDetails.balanceAmount = $('#Bamount').val();
        paymentDetails.paymentDate = $('#PaymentDate').val();

        $.ajax({
            type: 'POST',
            url: $("#UpdateMembershipPayment").val(),
            data: paymentDetails,
            success: function (response) {
                var myData = jQuery.parseJSON(JSON.stringify(response));

                if (myData.data['isPartialPay'] == true && parseFloat(myData.data['balanceAmount']) != 0) {
                    var data = new FormData();
                    data.append("PaymentId", myData.data['id']);
                    data.append("PaymentDate", PaymentDate);
                    data.append("PaidAmount", PaidAmount);

                    $.ajax({
                        type: 'POST',
                        url: $("#SaveMembershipPartialPayment").val(),
                        dataType: 'json',
                        data: data,
                        processData: false,
                        contentType: false,
                        success: function (response) {
                            var myData = jQuery.parseJSON(JSON.stringify(response));

                            if (myData.code == "1") {
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'Your work has been saved',
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                                successLoad();

                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: myData.message,
                                });
                            }
                        }
                    });
                } else if (myData.data['isPartialPay'] == true && parseFloat(myData.data['balanceAmount']) == 0) {

                    $.ajax({
                        type: 'POST',
                        url: $("#DeleteMembershipPartialPayment").val(),
                        data: myData.data,
                        success: function (response) {
                            var myData = jQuery.parseJSON(JSON.stringify(response));

                            if (myData.code == "1") {
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'Your work has been saved',
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                                successLoad();
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: myData.message,
                                });
                            }
                        }
                    });
                }
                else {
                    if (myData.code == "1") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        successLoad();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: myData.message,
                        });
                    }
                }
            }
        });
    }

})

function successLoad() {
    Clear();
    $("#wait").css("display", "none");
    $("#btnSavePay").attr("disabled", false);
    $('.card-body').removeClass('freeze');
    BalanceAmt = 0;
    PaymentId = 0;
}

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
                LoadMemberShipPackage();
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

function LoadMemberShipPackage() {
    $('#PackageId').find('option').remove().end();
    PackageId = $('#PackageId');

    PackageId.append($("<option/>").val(0).text("-Select Season Type-"))
    $.each(MemberShipPackageArray, function () {
        PackageId.append($("<option/>").val(this.id).text(this.membershipName));
    });
}

function LoadMemberShipAmount() {
    var Id = $('#PackageId').val();
    MembershipPackageId = parseInt(Id);
    var PackageAmount = $.grep(MemberShipPackageArray, function (v) {
        return v.id == Id;
    })
    MembershipPackageAmount = PackageAmount[0].membershipAmount.toFixed(2);
    $("#Mamount").val(PackageAmount[0].membershipAmount.toFixed(2));
}