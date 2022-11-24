$(document).ready(function () {
    var BranchArray;
    var provisionalMembersDetailsArray;
    LoadBranchesforSearch();
    if ($('#add').val() == "1" || $('#add').val() == "2") {
        $("#btnAdd").attr('hidden', false);
    }
    else {
        $("#btnAdd").attr('hidden', true);
    }
    LoadProvinces();
});

$(function () {
    //Date picker
    $('#fromdate').datetimepicker({
        format: 'L'
    })
    $('#paymentdate').datetimepicker({
        format: 'L'
    })
});

$('#btnAdd').click(function () {
    var CurDate = new Date();
    $("#DOB").val(getFormattedDate(CurDate));
    $("#Pdate").val(getFormattedDate(CurDate));
    LoadBranches();
    LoadGender();
    $('.modal-body').removeClass('freeze');
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    $("#Branch").attr("disabled", false);
    $('#MemModal').modal('show');
});

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
                LoadGenderOptions();
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
    ListprovisionalMemberDetails();
    LoadSearchOption();
}

function LoadSearchOption() {
    $('#SearchOptions').find('option').remove().end();
    searchOptions = $('#SearchOptions');
    var searchOptionsList = [
        { Id: 1, Name: "FullName" },
        { Id: 2, Name: "NIC/PassportNo" },
        { Id: 3, Name: "Phone Number" }
    ];
    $.each(searchOptionsList, function () {
        searchOptions.append($("<option/>").val(this.Id).text(this.Name));
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

function LoadBranches() {
    $('#Branch').find('option').remove().end();
    Branch = $('#Branch');
    $.each(BranchArray, function () {
        Branch.append($("<option/>").val(this.branchCode).text(this.branchName));
    });
}

function LoadGender() {
    $('#Gender').find('option').remove().end();
    Gender = $('#Gender');
    var genderOptionsList = [
        { Id: "", Name: "--All--" },
        { Id: "Male", Name: "Male" },
        { Id: "Female", Name: "Female" }
    ];
    $.each(genderOptionsList, function () {
        Gender.append($("<option/>").val(this.Id).text(this.Name));
    });
}

$('#btnSave').click(function () {

    var data = new FormData();
    data.append("Id", $('#Id').val());
    data.append("NIC_PassportNo", $('#NICPaasportNo').val());
    data.append("FullName", $('#fullName').val());
    data.append("DOB", $('#DOB').val());
    data.append("Gender", $('#Gender').val());
    data.append("Age", $('#Age').val());
    data.append("Branch", $('#Branch').val());
    data.append("ContactNo", $('#ContactNo').val());
    data.append("Email", $('#Email').val());
    data.append("HouseNo", $('#HouseNo').val());
    data.append("Street", $('#Street').val());
    data.append("District", $('#District').val());
    data.append("Province", $('#Province').val());
    data.append("Payment", $('#Payment').val());
    data.append("AttendDate", $('#Pdate').val());
    data.append("CreatedBy", $('#CreatedBy').val());
    data.append("CreatedDate", $('#CreatedDate').val());


    if (!$('#fullName').val() || !$('#ContactNo').val() || !$('#Email').val() || !$('#Payment').val() || !$('#Pdate').val()) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Empty Value Can not be Allow!',
        });
    } else if ($('#Branch').val() == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please Select a Value!',
        });
    } else {
        $("#waitform").css("display", "block");
        $('.modal').addClass('freeze');
        $('.modal-content').addClass('freeze');
        $("#btnSave").attr("disabled", true);
        if ($('#Id').val() == "0" || $('#Id').val() == "") {

            $.ajax({
                type: 'POST',
                url: $("#SaveProvisionalMember").val(),
                dataType: 'json',
                data: data,
                processData: false,
                contentType: false,
                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#waitform").css("display", "none");
                    $("#btnSave").attr("disabled", false);
                    if (myData.code == "1") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        Cancel();
                        ListprovisionalMemberDetails();
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
                url: $("#UpdateProvisionalMember").val(),
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
                        ListprovisionalMemberDetails();
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

function ListprovisionalMemberDetails() {
    $("#wait").css("display", "block");
    var data = new FormData();
    data.append("Branch", $('#BranchforSearch').val());

    $.ajax({
        type: 'POST',
        url: $("#GetProvisionalMemberDetails").val(),
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

                provisionalMembersDetailsArray = myData.data;
           
                if (gender != "") {
                    Result = $.grep(myData.data, function (v) {
                        return v.gender == gender;
                    })
                }
                else
                    Result = provisionalMembersDetailsArray;

                var tr = [];
                for (var i = 0; i < Result.length; i++) {
                    tr.push('<tr>');
                    tr.push("<td>" + Result[i].niC_PassportNo + "</td>");;
                    tr.push("<td>" + Result[i].fullName + "</td>");
                    tr.push("<td>" + Result[i].gender + "</td>");
                    tr.push("<td>" + Result[i].payment + "</td>");;
                    tr.push("<td>" + getFormattedDate(new Date(Result[i].attendDate)) + "</td>");;
                    
                    var td = [];
                    td.push('<td>');
                    if ($('#edit').val() == 1 || $('#edit').val() == 2)
                        td.push("<button onclick=\"EditProvisionalMember('" + Result[i].id + "')\" class=\"btn btn-primary\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Edit\"><i class=\"fa fa-edit\"></i></button>");

                    if ($('#delete').val() == 1 || $('#delete').val() == 2)
                        td.push("<button onclick=\"DeleteProvisionalMember('" + Result[i].id + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"><i class=\"fa fa-trash\"></i></button>");
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

function EditProvisionalMember(Id) {
    $('.modal-body').removeClass('freeze');
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    $("#wait").css("display", "block");
    $("#Branch").attr("disabled", true);
    LoadBranches();
    LoadGender();

    var provisionalMemberDetail = $.grep(provisionalMembersDetailsArray, function (v) {
        return v.id == Id;
    })

    if (provisionalMemberDetail.length != 0) {
        var Result = provisionalMemberDetail[0];
       
        $("#Id").val(Result['id']);
        $("#NICPaasportNo").val(Result['niC_PassportNo']);
        $("#fullName").val(Result['fullName']);
        $("#DOB").val(getFormattedDate(new Date(Result.dob)));
        $("#Gender").val(Result['gender']);
        $("#Age").val(Result['age']);
        $("#Branch").val(Result['branch']);
        $("#ContactNo").val(Result['contactNo']);
        $("#Email").val(Result['email']);
        $("#HouseNo").val(Result['houseNo']);
        $("#Street").val(Result['street']);
       
        $("#Province").val(Result['province']);
        $("#Payment").val(Result['houseNo']);
        $("#Street").val(Result['street']);
        $("#District").val(Result['district']);
        $("#Province").val(Result['province']);
        $("#Payment").val(Result['payment']);
        $("#Pdate").val(getFormattedDate(new Date(Result.attendDate)));
        $("#CreatedBy").val(Result['createdBy']);
        $("#CreatedDate").val(Result['createdDate']);

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
        $('#MemModal').modal('show');
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        });
    }
}

function Cancel() {
    $('#MemModal').modal('toggle');
    $("#Id").val(0);
    $("#NICPaasportNo").val('');
    $("#fullName").val('');
    $("#Age").val('');
    $("#ContactNo").val('');
    $("#Email").val('');
    $("#HouseNo").val('');
    $("#Street").val('');
    $("#District").val('');
    $("#Province").val('');
    $("#Payment").val('');
    $("#Street").val('');
    $("#District").val('');
    $("#Province").val('');
    $("#Payment").val('');
    $("#CreatedBy").val('');
    $("#CreatedDate").val('');
    var CurDate = new Date();
    $("#DOB").val(getFormattedDate(CurDate));
    $("#Pdate").val(getFormattedDate(CurDate));
    LoadBranches();
    LoadGender();
    $("#EmailAlert").css("display", "none");
    $("#ContactAlert").css("display", "none");
    $("#btnSave").attr("disabled", false);
    $("#btnSave").attr("disabled", false);
}

function DeleteProvisionalMember(Id) {

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
                url: $("#DeleteProvisionalMember").val(),
                dataType: 'json',
                data: '{"Id": "' + Id + '"}',
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
                        ListprovisionalMemberDetails();
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

$("#BranchforSearch").change(function () {
    ListprovisionalMemberDetails();
});

$("#GenderSearch").change(function () {
    $("#wait").css("display", "block");

    var Result = [];
    var gender = $('#GenderSearch').val();

    if (gender != "") {
        Result = $.grep(provisionalMembersDetailsArray, function (v) {
            return v.gender == gender;
        })
    }
    else
        Result = provisionalMembersDetailsArray;

    if (Result.length != 0) {

        var tr = [];
        for (var i = 0; i < Result.length; i++) {
            tr.push('<tr>');
            tr.push("<td>" + Result[i].niC_PassportNo + "</td>");;
            tr.push("<td>" + Result[i].fullName + "</td>");
            tr.push("<td>" + Result[i].gender + "</td>");
            tr.push("<td>" + Result[i].payment + "</td>");;
            tr.push("<td>" + getFormattedDate(new Date(Result[i].attendDate)) + "</td>");;

            var td = [];
            td.push('<td>');
            if ($('#edit').val() == 1 || $('#edit').val() == 2)
                td.push("<button onclick=\"EditProvisionalMember('" + Result[i].id + "')\" class=\"btn btn-primary\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Edit\"><i class=\"fa fa-edit\"></i></button>");

            if ($('#delete').val() == 1 || $('#delete').val() == 2)
                td.push("<button onclick=\"DeleteProvisionalMember('" + Result[i].id + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"><i class=\"fa fa-trash\"></i></button>");
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

function SearchMembership() {
    $("#wait").css("display", "block");

    var Result = [];
    var gender = $('#GenderSearch').val();

    Result = provisionalMembersDetailsArray;
       

    if (gender != "") {
        Result = $.grep(Result, function (v) {
            return v.gender == gender;
        })
    }

    var searchVal = $('#ValueforSearch').val();
    var searchOpt = $('#SearchOptions').val();

    if (searchOpt == "1") {
        Result = $.grep(Result, function (v) {
            return (v.fullName.search(new RegExp(searchVal, "i")) != -1);
        })
    }
    else if (searchOpt == "2") {
        Result = $.grep(Result, function (v) {
            return (v.niC_PassportNo.search(new RegExp(searchVal, "i")) != -1);
        })
    }
    else {
        Result = $.grep(Result, function (v) {
            return (v.contactNo.search(new RegExp(searchVal, "i")) != -1);
        })
    }

    $("#wait").css("display", "none");
    if (Result.length != 0) {

        var tr = [];
        for (var i = 0; i < Result.length; i++) {
            tr.push('<tr>');
            tr.push("<td>" + Result[i].niC_PassportNo + "</td>");;
            tr.push("<td>" + Result[i].fullName + "</td>");
            tr.push("<td>" + Result[i].gender + "</td>");
            tr.push("<td>" + Result[i].payment + "</td>");;
            tr.push("<td>" + getFormattedDate(new Date(Result[i].attendDate)) + "</td>");;

            var td = [];
            td.push('<td>');
            if ($('#edit').val() == 1 || $('#edit').val() == 2)
                td.push("<button onclick=\"EditProvisionalMember('" + Result[i].id + "')\" class=\"btn btn-primary\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Edit\"><i class=\"fa fa-edit\"></i></button>");

            if ($('#delete').val() == 1 || $('#delete').val() == 2)
                td.push("<button onclick=\"DeleteProvisionalMember('" + Result[i].id + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"><i class=\"fa fa-trash\"></i></button>");
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

$("#ValueforSearch").bind('keyup', function () {
    SearchMembership();
});

$('#btnSearch').click(function () {
    var NicPassport = $('#NICPaasportNo').val();
        $("#waitform").css("display", "block");
        $.ajax({
            type: 'POST',
            url: $("#SearchProvisionalMember").val(),
            dataType: 'json',
            data: '{"NIC_PassportNo": "' + NicPassport + '"}',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                $("#waitform").css("display", "none");
                var myData = jQuery.parseJSON(JSON.stringify(response));
                if (myData.code == "1") {
                    var Result = myData.data[0];
                    $("#Id").val(Result['id']);
                    $("#NICPaasportNo").val(Result['niC_PassportNo']);
                    $("#fullName").val(Result['fullName']);
                    $("#DOB").val(getFormattedDate(new Date(Result.dob)));
                    $("#Gender").val(Result['gender']);
                    $("#Age").val(Result['age']);
                    $("#Branch").val(Result['branch']);
                    $("#ContactNo").val(Result['contactNo']);
                    $("#Email").val(Result['email']);
                    $("#HouseNo").val(Result['houseNo']);
                    $("#Street").val(Result['street']);
                    $("#District").val(Result['district']);
                    $("#Province").val(Result['province']);
                    $("#Payment").val(Result['houseNo']);
                    $("#Street").val(Result['street']);
                    $("#District").val(Result['district']);
                    $("#Province").val(Result['province']);
                    $("#Payment").val(Result['payment']);
                    $("#Pdate").val(getFormattedDate(new Date(Result.attendDate)));
                    $("#CreatedBy").val(Result['createdBy']);
                    $("#CreatedDate").val(Result['createdDate']);

                } else {
                    Clear();
                }

            },
            error: function (jqXHR, exception) {

            }
        });
     
    
});

$("#Nic").change(function () {
    var Nic = $('#Nic').prop('checked') ? true : false;
    if (Nic) {
        $("#Gender").attr("disabled", true);
        $("#DOB").attr("disabled", true);
        $("#Age").attr("disabled", true);
    } else {
        $("#Gender").attr("disabled", false);
        $("#DOB").attr("disabled", false);
        $("#Age").attr("disabled", false);
    }
    $("#Gender").val("");
    $("#Age").val('');
    $("#DOB").val(getFormattedDate(new Date()));
});

$('#btnClear').click(function () {
    Clear();
});

function Clear() {
    $("#Id").val(0);
    //$("#NICPaasportNo").val('');
    $("#fullName").val('');
   
    //$("#Age").val('');
   
    $("#ContactNo").val('');
    $("#Email").val('');
    $("#HouseNo").val('');
    $("#Street").val('');
    $("#District").val('');
    $("#Province").val('');
    $("#Payment").val('');
    $("#Street").val('');
    $("#District").val('');
    $("#Province").val('');
    $("#Payment").val('');
    $("#CreatedBy").val('');
    $("#CreatedDate").val('');
    var CurDate = new Date();
   // $("#DOB").val(getFormattedDate(CurDate));
    $("#Pdate").val(getFormattedDate(CurDate));
    LoadBranches();
    //LoadGender();
}

$('#NICPaasportNo').bind('keyup', function () {
    var NicVal = $('#NICPaasportNo').val();
    var Nic = $('#Nic').prop('checked') ? true : false;
    if (Nic) {
        if (ValidateNic(NicVal)) {
            var extracttedData = extractData(NicVal);
            var days = extracttedData.dayList;
            var findedData = findDayANDGender(days, d_array);
            var month = findedData.month;
            var year = extracttedData.year;
            var day = findedData.day;
            var gender = findedData.gender;
            var bday = day + '-' + month + '-' + year;
            var birthday = new Date(bday.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
            var age = findAge(birthday)
            var birthday = getFormattedDate(birthday);
            $("#DOB").val(birthday);
            $('#Age').val(age);
            $('#Gender').val(gender);
            $("#ValidNic").css("display", "none");
            $("#btnSearch").attr("disabled", false);
            $("#btnSave").attr("disabled", false);
        }
        else {
            $("#ValidNic").css("display", "flex");
            $("#btnSearch").attr("disabled", true);
            $("#btnSave").attr("disabled", true);
        }
    }
});

function ValidateNic(nicNumber) {
    var result = false;
    if (nicNumber.length === 10 && !isNaN(nicNumber.substr(0, 9)) && isNaN(nicNumber.substr(9, 1).toLowerCase()) && ['x', 'v'].includes(nicNumber.substr(9, 1).toLowerCase())) {
        result = true;
    } else if (nicNumber.length === 12 && !isNaN(nicNumber)) {
        result = true;
    } else {
        result = false;
    }
    return result;
}

function extractData(nicNumber) {
    var nicNumber = nicNumber;
    var result = { year: '', dayList: '', character: '' };

    if (nicNumber.length === 10) {
        result.year = nicNumber.substr(0, 2);
        result.dayList = nicNumber.substr(2, 3);
        result.character = nicNumber.substr(9, 10);
    } else if (nicNumber.length === 12) {
        result.year = nicNumber.substr(0, 4);
        result.dayList = nicNumber.substr(4, 3);
        result.character = 'no';
    }
    return result;
}

function findDayANDGender(days, d_array) {
    var dayList = days;
    var month = '';
    var result = { day: '', month: '', gender: '' };


    if (dayList < 500) {
        result.gender = 'Male';
    } else {
        result.gender = 'Female';
        dayList = dayList - 500;
    }

    for (var i = 0; i < d_array.length; i++) {
        if (d_array[i]['days'] < dayList) {
            dayList = dayList - d_array[i]['days'];
        } else {
            month = d_array[i]['month'];
            break;
        }
    }
    result.day = dayList;
    result.month = month;
    return result;
}

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

function findAge(date) {
    var year = date.getFullYear();
    var curYear = new Date().getFullYear();
    return curYear - year;
}

var d_array = [
    { month: 'January', days: 31 },
    { month: 'February', days: 29 },
    { month: 'March', days: 31 },
    { month: 'April', days: 30 },
    { month: 'May', days: 31 },
    { month: 'June', days: 30 },
    { month: 'July', days: 31 },
    { month: 'August', days: 31 },
    { month: 'Septhember', days: 30 },
    { month: 'October', days: 31 },
    { month: 'November', days: 30 },
    { month: 'December', days: 31 },
];

$('#ContactNo').bind('keyup', function () {

    var Valid = PhoneNumberValidate($('#ContactNo').val());
    if (Valid) {
        $("#ContactAlert").css("display", "none");
        $("#btnSave").attr("disabled", false);
    }
    else {
        $("#ContactAlert").css("display", "flex");
        $("#btnSave").attr("disabled", true);
    }
});

$('#Email').bind('keyup', function () {

    var Valid = validateEmail($('#Email').val());
    if (Valid) {
        $("#EmailAlert").css("display", "none");
        $("#btnSave").attr("disabled", false);
    }
    else {
        $("#EmailAlert").css("display", "flex");
        $("#btnSave").attr("disabled", true);
    }
});

function PhoneNumberValidate(Num) {
    var filter = /^(?:0|94|\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6}$/;
    return filter.test(Num.trim());
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

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
