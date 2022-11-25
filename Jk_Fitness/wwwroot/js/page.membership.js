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
    LoadProvinces();
});
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

$('#btnAdd').click(function () {
    $('#btnAddMember').attr('hidden', false);
    $('#btnCancel').attr('hidden', false);
    $('.modal-body').removeClass('freeze');
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    $('#MemberModal').modal('show');
    $('#NoNic').prop('checked', true);
    $("#Nic").attr("disabled", true);
    LoadBranches();
    LoadMemberShipPackage();
    var CurDate = new Date();
    $("#DOB").val(getFormattedDate(CurDate));
    $("#JoinDate").val(getFormattedDate(CurDate));
    $('#Status').prop('checked', false);
    $("#Branch").attr("disabled", false);
    $("#Package").attr("disabled", false);
    $("#FreeMembership").attr("disabled", false);
    $("#JoinDate").attr("disabled", false);
    LoadGender();
    LoadProvinces();
});

$(function () {
    //Date picker
    $('#fromdate').datetimepicker({
        format: 'L'
    })
    $('#Jdate').datetimepicker({
        format: 'L'
    })
});

function LoadBranches() {
    $('#Branch').find('option').remove().end();
    Branch = $('#Branch');
    $.each(BranchArray, function () {
        Branch.append($("<option/>").val(this.branchCode).text(this.branchName));
    });
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

function LoadMemberShipAmount() {
    var Id = $('#Package').val();
    var PackageAmount = $.grep(MemberShipPackageArray, function (v) {
        return v.id == Id;
    })

    $("#Payment").val(PackageAmount[0].membershipAmount.toFixed(2));
}

function LoadMemberShipPackage() {
    $('#Package').find('option').remove().end();
    Package = $('#Package');

    Package.append($("<option/>").val(0).text("-Select Season Type-"))
    $.each(MemberShipPackageArray, function () {
        Package.append($("<option/>").val(this.id).text(this.membershipName));
    });
}

$("#FreeMembership").change(function () {
    var FreeMembership = $('#FreeMembership').prop('checked') ? "true" : "false";
    if (FreeMembership == "true") {
        $("#Package").attr("disabled", true);
        $("#Payment").val(0.00);
        $('#Package').val(0);
    } else {
        $("#Package").attr("disabled", false);
        $("#Payment").val('');
    }
});

$('#btnAddMember').click(function () {

    var Memberid = $('#MembershipId').val();
    var Branch = $('#Branch').val();

    var data = new FormData();
    data.append("MemberId", $('#MembershipId').val());
    data.append("FirstName", $('#Fname').val());
    data.append("LastName", $('#Lname').val());
    data.append("Gender", $('#Gender').val());
    data.append("NIC", $('#Nic').val());
    data.append("HouseNo", $('#HouseNo').val());
    data.append("Street", $('#Street').val());
    data.append("District", $('#District').val());
    data.append("Province", $('#Province').val());
    data.append("ContactNo", $('#ContactNo').val());
    data.append("DateofBirth", $('#DOB').val());
    data.append("Email", $('#Email').val());
    data.append("Branch", $('#Branch').val());
    data.append("Age", $('#Age').val());
    data.append("Height", $('#Height').val());
    data.append("Weight", $('#Weight').val());
    data.append("BMI", $('#BMI').val());
    data.append("MemberPackage", $('#Package').val());
    data.append("Payment", $('#Payment').val());
    data.append("EmergencyContactNo", $('#EmergencyTP').val());
    data.append("RelationShip", $('#Relation').val());
    data.append("IntroducedBy", $('#Introduce').val());
    data.append("Active", $('#Status').prop('checked') ? "true" : "false");
    data.append("JoinDate", $('#JoinDate').val());
    data.append("Smoking", $('#Smoking').prop('checked') ? "true" : "false");
    data.append("Discomfort", $('#Discomfort').prop('checked') ? "true" : "false");
    data.append("Cholesterol", $('#Cholesterol').prop('checked') ? "true" : "false");
    data.append("Herina", $('#Herina').prop('checked') ? "true" : "false");
    data.append("Diabets", $('#Diabets').prop('checked') ? "true" : "false");
    data.append("Pain", $('#Pain').prop('checked') ? "true" : "false");
    data.append("Complaint", $('#Complaint').prop('checked') ? "true" : "false");
    data.append("Incorrigible", $('#Incorrigible').prop('checked') ? "true" : "false");
    data.append("Doctors", $('#Doctors').prop('checked') ? "true" : "false");
    data.append("Aliments", $('#Aliments').prop('checked') ? "true" : "false");
    data.append("Surgery", $('#Surgery').prop('checked') ? "true" : "false");
    data.append("Pressure", $('#Pressure').prop('checked') ? "true" : "false");
    data.append("Trace", $('#Trace').prop('checked') ? "true" : "false");
    data.append("Pregnant", $('#Pregnant').prop('checked') ? "true" : "false");
    data.append("Musele", $('#Musele').prop('checked') ? "true" : "false");
    data.append("Fat", $('#Fat').prop('checked') ? "true" : "false");
    data.append("Body", $('#Body').prop('checked') ? "true" : "false");
    data.append("Fitness", $('#Fitness').prop('checked') ? "true" : "false");
    data.append("Athletics", $('#Athletics').prop('checked') ? "true" : "false");
    data.append("IsFreeMembership", $('#FreeMembership').prop('checked') ? "true" : "false");
    data.append("NoNic", $('#FreeMembership').prop('checked') ? "true" : "false");


    if (!$('#Fname').val() || !$('#Lname').val() || !$('#Email').val() || !$('#ContactNo').val() || !$('#Height').val() || !$('#Weight').val() || !$('#Payment').val()) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Empty Value Can not be Allow!',
        });
    } else if (Branch == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please Select a Value!',
        });
    } else {
        $("#waitform").css("display", "block");
        $('.modal').addClass('freeze');
        $('.modal-content').addClass('freeze');
        $("#btnAddMember").attr("disabled", true);
        if (Memberid == "0" || Memberid == "") {

            $.ajax({
                type: 'POST',
                url: $("#SaveMembers").val(),
                dataType: 'json',
                data: data,
                processData: false,
                contentType: false,
                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#waitform").css("display", "none");
                    $("#btnAddMember").attr("disabled", false);
                    if (myData.code == "1") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        Cancel();
                        ListMemberDetails();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                        });
                        Cancel();
                    }
                },
                error: function (jqXHR, exception) {
                }
            });

        }
        else {

            $.ajax({
                type: 'POST',
                url: $("#UpdateMemberShip").val(),
                dataType: 'json',
                data: data,
                processData: false,
                contentType: false,
                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#waitform").css("display", "none");
                    $("#btnAddMember").attr("disabled", false);
                    if (myData.code == "1") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been Updated',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        Cancel();
                        ListMemberDetails();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                        });
                        Cancel();
                    }
                },
                error: function (jqXHR, exception) {
                }
            });

        }

    }
});

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

                    if (Result[i].nic == null)
                        tr.push("<td> - </td>");
                    else
                        tr.push("<td>" + Result[i].nic + "</td>");;

                    tr.push("<td>" + getFormattedDate(new Date(Result[i].packageExpirationDate)) + "</td>");;
                    tr.push("<td>" + getFormattedDate(new Date(Result[i].membershipExpirationDate)) + "</td>");;
                    if (Result[i].active == true)
                        tr.push("<td><strong style=\"color:green\">Active</strong></td>");
                    else
                        tr.push("<td><strong style=\"color:red\">Deactive</strong></td>");

                    var td = [];
                    td.push('<td>');
                    if ($('#view').val() == 1 || $('#view').val() == 2)
                        td.push("<button onclick=\"ViewMember('" + Result[i].memberId + "')\" class=\"btn btn-secondary\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"View\"><i class=\"fa fa-eye\"></i></button>");

                    if ($('#edit').val() == 1 || $('#edit').val() == 2)
                        td.push("<button onclick=\"EditMember('" + Result[i].memberId + "')\" class=\"btn btn-primary\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Edit\"><i class=\"fa fa-edit\"></i></button>");

                    if ($('#delete').val() == 1 || $('#delete').val() == 2)
                        td.push("<button onclick=\"DeleteMember('" + Result[i].memberId + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"><i class=\"fa fa-trash\"></i></button>");
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

function EditMember(Id) {
    $('#btnAddMember').attr('hidden', false);
    $('#btnCancel').attr('hidden', false);
    $('.modal-body').removeClass('freeze');
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    $("#wait").css("display", "block");
    $("#Branch").attr("disabled", true);
    LoadGender();
    LoadBranches();
    LoadMemberShipPackage();
    

    var MemberDetail = $.grep(MembersDetailsArray, function (v) {
        return v.memberId == Id;
    })

    if (MemberDetail.length != 0) {
        var Result = MemberDetail[0];
        var date = getFormattedDate(new Date(Result.joinDate));
        if (Result.isFreeMembership) {
            $("#Package").attr("disabled", true);
        } else {
            $("#Package").attr("disabled", false);
        }

        if (Result.noNic) {
            $("#Nic").attr("disabled", true);
            $("#Gender").attr("disabled", false);
            $("#DOB").attr("disabled", false);
            $("#Age").attr("disabled", false);
        } else {
            $("#Nic").attr("disabled", false);
            $("#Gender").attr("disabled", true);
            $("#DOB").attr("disabled", true);
            $("#Age").attr("disabled", true);
        }
        //else {
        //    var today = getFormattedDate(new Date());
        //    var Expire = getFormattedDate(new Date(Result.packageExpirationDate));
        //    if (getFormattedDate(new Date()) < getFormattedDate(new Date(Result.packageExpirationDate))) {
        //        $("#Package").attr("disabled", true);
        //    } else {
        //        $("#Package").attr("disabled", false);
        //    }

        //}
        if (Result.gender == "Female") {
            $("#Frule").css("display", "flex");
        }
        else {
            $("#Frule").css("display", "none");
        }

        $("#MembershipId").val(Result['memberId']);
        $("#Fname").val(Result['firstName']);
        $("#Lname").val(Result['lastName']);
        $("#Gender").val(Result['gender']);
        $("#Nic").val(Result['nic']);
        $("#Branch").val(Result['branch']);
        $("#ContactNo").val(Result['contactNo']);
        $("#Email").val(Result['email']);
        $("#Age").val(Result['age']);
        $("#Height").val(Result['height']);
        $("#Weight").val(Result['weight']);
        $("#BMI").val(Result['bmi']);
        $("#HouseNo").val(Result['houseNo']);
        $("#Street").val(Result['street']);
        
        $("#Province").val(Result['province']);
        $("#Payment").val(Result['payment']);
        $("#Package").val(Result['memberPackage']);
        $("#Introduce").val(Result['introducedBy']);
        $("#EmergencyTP").val(Result['emergencyContactNo']);
        $("#Relation").val(Result['relationShip']);
        $("#Smoking").prop("checked", Result.smoking)
        $("#Discomfort").prop("checked", Result.discomfort)
        $("#Herina").prop("checked", Result.herina)
        $("#Diabets").prop("checked", Result.diabets)
        $("#Pain").prop("checked", Result.pain)
        $("#Complaint").prop("checked", Result.complaint)
        $("#Trace").prop("checked", Result.trace)
        $("#Doctors").prop("checked", Result.doctors)
        $("#Cholesterol").prop("checked", Result.cholesterol)
        $("#Pregnant").prop("checked", Result.pregnant)
        $("#Aliments").prop("checked", Result.aliments)
        $("#Surgery").prop("checked", Result.surgery)
        $("#Pressure").prop("checked", Result.pressure)
        $("#Incorrigible").prop("checked", Result.incorrigible)
        $("#Musele").prop("checked", Result.musele)
        $("#Fat").prop("checked", Result.fat)
        $("#Body").prop("checked", Result.body)
        $("#Fitness").prop("checked", Result.fitness)
        $("#Athletics").prop("checked", Result.athletics)
        $("#Status").prop("checked", Result.active)
        $("#FreeMembership").prop("checked", Result.isFreeMembership)
        $("#DOB").val(getFormattedDate(new Date(Result.dateofBirth)));
        $("#JoinDate").val(getFormattedDate(new Date(Result.joinDate)));
        $("#NoNic").prop("checked", Result.noNic)
        ShowIdealweight();

        $('#District').find('option').remove().end();
        District = $('#District');

        $.ajax({
            type: 'POST',
            url: $("#ListDistricts").val(),
            dataType: 'json',
            data: '{"ProvinceId": "' + $("#Province").val() + '"}',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                var myData = jQuery.parseJSON(JSON.stringify(response));
                if (myData.code == "1") {
                    var Result1 = myData.data;

                    $.each(Result1, function () {
                        District.append($("<option/>").val(this.id).text(this.name));
                    });
                    $("#District").val(Result['district']);
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

        $("#wait").css("display", "none");
        $('#MemberModal').modal('show');
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        });
    }
}

function DeleteMember(Id) {

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
                url: $("#DeleteMemberShip").val(),
                dataType: 'json',
                data: '{"MemberId": "' + Id + '"}',
                contentType: 'application/json; charset=utf-8',
                success: function (response) {
                    $("#wait").css("display", "none");
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    if (myData.code == "1") {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Your record has been deleted.',
                            icon: 'success',
                        });
                        ListMemberDetails();
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
                tr.push("<td>" + Result[i].memberId + "</td>");;
            tr.push("<td>" + Result[i].firstName + " " + Result[i].lastName + "</td>");

            if (Result[i].nic == null)
                tr.push("<td> - </td>");
            else
                tr.push("<td>" + Result[i].nic + "</td>");

            tr.push("<td>" + getFormattedDate(new Date(Result[i].packageExpirationDate)) + "</td>");
            tr.push("<td>" + getFormattedDate(new Date(Result[i].membershipExpirationDate)) + "</td>");
            if (Result[i].active == true)
                tr.push("<td><strong style=\"color:green\">Active</strong></td>");
            else
                tr.push("<td><strong style=\"color:red\">Deactive</strong></td>");

            var td = [];
            td.push('<td>');
            if ($('#view').val() == 1 || $('#view').val() == 2)
                td.push("<button onclick=\"ViewMember('" + Result[i].memberId + "')\" class=\"btn btn-secondary\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"View\"><i class=\"fa fa-eye\"></i></button>");

            if ($('#edit').val() == 1 || $('#edit').val() == 2)
                td.push("<button onclick=\"EditMember('" + Result[i].memberId + "')\" class=\"btn btn-primary\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Edit\"><i class=\"fa fa-edit\"></i></button>");

            if ($('#delete').val() == 1 || $('#delete').val() == 2)
                td.push("<button onclick=\"DeleteMember('" + Result[i].memberId + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"><i class=\"fa fa-trash\"></i></button>");
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

$("#BranchforSearch").change(function () {
    ListMemberDetails();
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
                tr.push("<td>" + Result[i].memberId + "</td>");;
            tr.push("<td>" + Result[i].firstName + " " + Result[i].lastName + "</td>");

            if (Result[i].nic == null)
                tr.push("<td> - </td>");
            else
                tr.push("<td>" + Result[i].nic + "</td>");;

            tr.push("<td>" + getFormattedDate(new Date(Result[i].packageExpirationDate)) + "</td>");;
            tr.push("<td>" + getFormattedDate(new Date(Result[i].membershipExpirationDate)) + "</td>");;
            if (Result[i].active == true)
                tr.push("<td><strong style=\"color:green\">Active</strong></td>");
            else
                tr.push("<td><strong style=\"color:red\">Deactive</strong></td>");

            var td = [];
            td.push('<td>');
            if ($('#view').val() == 1 || $('#view').val() == 2)
                td.push("<button onclick=\"ViewMember('" + Result[i].memberId + "')\" class=\"btn btn-secondary\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"View\"><i class=\"fa fa-eye\"></i></button>");

            if ($('#edit').val() == 1 || $('#edit').val() == 2)
                td.push("<button onclick=\"EditMember('" + Result[i].memberId + "')\" class=\"btn btn-primary\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Edit\"><i class=\"fa fa-edit\"></i></button>");

            if ($('#delete').val() == 1 || $('#delete').val() == 2)
                td.push("<button onclick=\"DeleteMember('" + Result[i].memberId + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"><i class=\"fa fa-trash\"></i></button>");
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
    $("#wait").css("display", "none");
});

$("#SearchOptions").change(function () {
    $('#ValueforSearch').val('');
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
                tr.push("<td>" + Result[i].memberId + "</td>");;
            tr.push("<td>" + Result[i].firstName + " " + Result[i].lastName + "</td>");

            if (Result[i].nic == null)
                tr.push("<td> - </td>");
            else
                tr.push("<td>" + Result[i].nic + "</td>");;

            tr.push("<td>" + getFormattedDate(new Date(Result[i].packageExpirationDate)) + "</td>");;
            tr.push("<td>" + getFormattedDate(new Date(Result[i].membershipExpirationDate)) + "</td>");;
            if (Result[i].active == true)
                tr.push("<td><strong style=\"color:green\">Active</strong></td>");
            else
                tr.push("<td><strong style=\"color:red\">Deactive</strong></td>");

            var td = [];
            td.push('<td>');
            if ($('#view').val() == 1 || $('#view').val() == 2)
                td.push("<button onclick=\"ViewMember('" + Result[i].memberId + "')\" class=\"btn btn-secondary\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"View\"><i class=\"fa fa-eye\"></i></button>");

            if ($('#edit').val() == 1 || $('#edit').val() == 2)
                td.push("<button onclick=\"EditMember('" + Result[i].memberId + "')\" class=\"btn btn-primary\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Edit\"><i class=\"fa fa-edit\"></i></button>");

            if ($('#delete').val() == 1 || $('#delete').val() == 2)
                td.push("<button onclick=\"DeleteMember('" + Result[i].memberId + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"><i class=\"fa fa-trash\"></i></button>");
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
    $("#wait").css("display", "none");
});

function Clear() {
    $('#ValueforSearch').val('');
    $('#MembershipId').val(0);
    $('#Fname').val('');
    $('#Lname').val('');
    $('#Gender').val('');
    $('#Nic').val('');
    $('#Branch').val('');
    $('#ContactNo').val('');
    $('#DOB').val('');
    $('#Email').val('');
    $('#Age').val('');
    $('#Height').val('');
    $('#Weight').val('');
    $("#BMI").val('');
    $("#ExWeight").val('');
    $("#HouseNo").val('');
    $("#Street").val('');
    $("#District").val('');
    $("#Province").val('');
    $('#Package').val('');
    $('#Introduce').val('');
    $('#EmergencyTP').val('');
    $('#Relation').val('');
    $("#Payment").val('');
    $('#Status').prop('checked', false);
    $("#Smoking").prop("checked", false)
    $("#Discomfort").prop("checked", false)
    $("#Herina").prop("checked", false)
    $("#Diabets").prop("checked", false)
    $("#Pain").prop("checked", false)
    $("#Complaint").prop("checked", false)
    $("#Trace").prop("checked", false)
    $("#Doctors").prop("checked", false)
    $("#Cholesterol").prop("checked", false)
    $("#Pregnant").prop("checked", false)
    $("#Aliments").prop("checked", false)
    $("#Surgery").prop("checked", false)
    $("#Pressure").prop("checked", false)
    $("#Incorrigible").prop("checked", false)
    $("#Musele").prop("checked", false)
    $("#Fat").prop("checked", false)
    $("#Body").prop("checked", false)
    $("#Fitness").prop("checked", false)
    $("#Athletics").prop("checked", false)
    $("#FreeMembership").prop("checked", false)
    $("#Under").css("display", "none");
    $("#Normal").css("display", "none");
    $("#Over").css("display", "none");
    $("#Obese").css("display", "none");
}

function Cancel() {
    $('#MemberModal').modal('toggle');
    Clear();
    SearchMembership();
}

function ShowIdealweight() {
    var Height = $('#Height').val();
    var Weight = $('#Weight').val();
    var Bmi = Weight / Math.pow((Height / 100), 2);
    if (Bmi < 18.5) {
        $("#Under").css("display", "flex");
        $("#Normal").css("display", "none");
        $("#Over").css("display", "none");
        $("#Obese").css("display", "none");
    }
    else if (Bmi >= 18.5 && Bmi <= 25) {
        $("#Under").css("display", "none");
        $("#Normal").css("display", "flex");
        $("#Over").css("display", "none");
        $("#Obese").css("display", "none");
    }
    else if (Bmi >= 26 && Bmi <= 30) {
        $("#Under").css("display", "none");
        $("#Normal").css("display", "none");
        $("#Over").css("display", "flex");
        $("#Obese").css("display", "none");
    }
    else {
        $("#Under").css("display", "none");
        $("#Normal").css("display", "none");
        $("#Over").css("display", "none");
        $("#Obese").css("display", "flex");
    }

    var exWeight = (Math.pow((Height / 100), 2) * 18.5).toFixed(2) + " Kg" + " - " + (Math.pow((Height / 100), 2) * 25).toFixed(2) + " Kg";
    $('#ExWeight').val(exWeight);
}

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

function ViewMember(Id) {

    $('#btnAddMember').attr('hidden', true);
    $('#btnCancel').attr('hidden', true);
    $('.modal-body').addClass('freeze');
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    $("#wait").css("display", "block");
    $("#Branch").attr("disabled", true);

    LoadGender();
    LoadBranches();
    LoadMemberShipPackage();

    var MemberDetail = $.grep(MembersDetailsArray, function (v) {
        return v.memberId == Id;
    })

    if (MemberDetail.length != 0) {
        var Result = MemberDetail[0];
        var date = getFormattedDate(new Date(Result.joinDate));
        if (Result.isFreeMembership) {
            $("#Package").attr("disabled", true);
        } else {
            $("#Package").attr("disabled", false);
        }

        if (Result.noNic) {
            $("#Nic").attr("disabled", true);
            $("#Gender").attr("disabled", false);
            $("#DOB").attr("disabled", false);
            $("#Age").attr("disabled", false);
        } else {
            $("#Nic").attr("disabled", false);
            $("#Gender").attr("disabled", true);
            $("#DOB").attr("disabled", true);
            $("#Age").attr("disabled", true);
        }

        if (Result.gender == "Female") {
            $("#Frule").css("display", "flex");
        }
        else {
            $("#Frule").css("display", "none");
        }

        $("#MembershipId").val(Result['memberId']);
        $("#Fname").val(Result['firstName']);
        $("#Lname").val(Result['lastName']);
        $("#Gender").val(Result['gender']);
        $("#Nic").val(Result['nic']);
        $("#Branch").val(Result['branch']);
        $("#ContactNo").val(Result['contactNo']);
        $("#Email").val(Result['email']);
        $("#Age").val(Result['age']);
        $("#Height").val(Result['height']);
        $("#Weight").val(Result['weight']);
        $("#BMI").val(Result['bmi']);
        $("#HouseNo").val(Result['houseNo']);
        $("#Street").val(Result['street']);
       
        $("#Province").val(Result['province']);
        $("#Payment").val(Result['payment']);
        $("#Package").val(Result['memberPackage']);
        $("#Introduce").val(Result['introducedBy']);
        $("#EmergencyTP").val(Result['emergencyContactNo']);
        $("#Relation").val(Result['relationShip']);
        $("#Smoking").prop("checked", Result.smoking)
        $("#Discomfort").prop("checked", Result.discomfort)
        $("#Herina").prop("checked", Result.herina)
        $("#Diabets").prop("checked", Result.diabets)
        $("#Pain").prop("checked", Result.pain)
        $("#Complaint").prop("checked", Result.complaint)
        $("#Trace").prop("checked", Result.trace)
        $("#Doctors").prop("checked", Result.doctors)
        $("#Cholesterol").prop("checked", Result.cholesterol)
        $("#Pregnant").prop("checked", Result.pregnant)
        $("#Aliments").prop("checked", Result.aliments)
        $("#Surgery").prop("checked", Result.surgery)
        $("#Pressure").prop("checked", Result.pressure)
        $("#Incorrigible").prop("checked", Result.incorrigible)
        $("#Musele").prop("checked", Result.musele)
        $("#Fat").prop("checked", Result.fat)
        $("#Body").prop("checked", Result.body)
        $("#Fitness").prop("checked", Result.fitness)
        $("#Athletics").prop("checked", Result.athletics)
        $("#Status").prop("checked", Result.active)
        $("#FreeMembership").prop("checked", Result.isFreeMembership)
        $("#DOB").val(getFormattedDate(new Date(Result.dateofBirth)));
        $("#JoinDate").val(getFormattedDate(new Date(Result.joinDate)));
        $("#NoNic").prop("checked", Result.noNic)
        ShowIdealweight();

        $('#District').find('option').remove().end();
        District = $('#District');

        $.ajax({
            type: 'POST',
            url: $("#ListDistricts").val(),
            dataType: 'json',
            data: '{"ProvinceId": "' + $("#Province").val() + '"}',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                var myData = jQuery.parseJSON(JSON.stringify(response));
                if (myData.code == "1") {
                    var Result1 = myData.data;

                    $.each(Result1, function () {
                        District.append($("<option/>").val(this.id).text(this.name));
                    });
                    $("#District").val(Result['district']);
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

        $("#wait").css("display", "none");
        $('#MemberModal').modal('show');
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        });
    }
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

$("#ValueforSearch").bind('keyup', function () {
    SearchMembership();
});

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

function LoadGender() {
    $('#Gender').find('option').remove().end();
    Gender = $('#Gender');
    var GenderList = [
        { Id: 1, Name: "Male" },
        { Id: 2, Name: "Female" }
    ];
    Gender.append($("<option/>").val(0).text("-Select Gender-"))
    $.each(GenderList, function () {
        Gender.append($("<option/>").val(this.Name).text(this.Name));
    });
}

$("#NoNic").change(function () {
    var NoNic = $('#NoNic').prop('checked') ? true : false;
    if (NoNic) {
        $("#Nic").attr("disabled", true);
        $("#Gender").attr("disabled", false);
        $("#DOB").attr("disabled", false);
        $("#Age").attr("disabled", false);
    } else {
        $("#Nic").attr("disabled", false);
        $("#Gender").attr("disabled", true);
        $("#DOB").attr("disabled", true);
        $("#Age").attr("disabled", true);
    }
    $("#Nic").val('');
    $("#Gender").val(0);
    $("#Age").val('');
    $("#DOB").val(getFormattedDate(new Date()));
});

$("#Province").change(function () {
    ListDistricts(this.value);
});
function LoadProvinces() {
    $('#Province').find('option').remove().end();
    Province = $('#Province');
  
    $.ajax({
        type: 'GET',
        url: $("#ListProvinces").val(),
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var Result = myData.data;
               
                $.each(Result, function () {
                    Province.append($("<option/>").val(this.id).text(this.name));
                });
                ListDistricts($("#Province").val());
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

function ListDistricts(Id) {

    $('#District').find('option').remove().end();
    District = $('#District');

    $.ajax({
        type: 'POST',
        url: $("#ListDistricts").val(),
        dataType: 'json',
        data: '{"ProvinceId": "' + Id + '"}',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var Result = myData.data;

                $.each(Result, function () {
                    District.append($("<option/>").val(this.id).text(this.name));
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
