$(document).ready(function () {
    var personalTraining;
    LoadBranches();
    LoadSearchOption();
    var BranchArray;
});


function LoadBranches() {
    $('#Branch').find('option').remove().end();
    Branch = $('#Branch');
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
                BranchArray = myData.data;
                $.each(Result, function () {
                    Branch.append($("<option/>").val(this.branchCode).text(this.branchName));
                });
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
                            LoadYear(myData.data.startYear, myData.data.endYear)
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

function LoadYear(stratYear, endYear) {
    let year_satart = parseInt(stratYear);
    let year_end = parseInt(endYear); // current year
    let year_selected = year_end;

    let option = '';

    for (let i = year_satart; i <= year_end; i++) {
        let selected = (i === year_selected ? ' selected' : '');
        option += '<option value="' + i + '"' + selected + '>' + i + '</option>';
    }

    document.getElementById("Year").innerHTML = option;
    LoadMonths();
}

function LoadMonths() {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var month_selected = (new Date).getMonth(); // current month
    var option = '';

    for (let i = 0; i < months.length; i++) {
        let month_number = (i + 1);

        // value month number with 0. [01 02 03 04..]
        //let month = (month_number <= 9) ? '0' + month_number : month_number;

        // or value month number. [1 2 3 4..]
        let month = month_number;

        // or value month names. [January February]
        // let month = months[i];

        let selected = (i === month_selected ? ' selected' : '');
        option += '<option value="' + month + '"' + selected + '>' + months[i] + '</option>';
    }
    document.getElementById("Month").innerHTML = option;
    LoadPersonalTraining();
}


function LoadSearchOption() {
    $('#SearchOptions').find('option').remove().end();
    searchOptions = $('#SearchOptions');
    var searchOptionsList = [
        { Id: 1, Name: "Employee Id" },
        { Id: 2, Name: "Membership Id" }
    ];
    $.each(searchOptionsList, function () {
        searchOptions.append($("<option/>").val(this.Id).text(this.Name));
    });
}

$("#Branch").change(function () {
    LoadPersonalTraining();
});

$("#Year").change(function () {
    LoadPersonalTraining();
});

$("#Month").change(function () {
    LoadPersonalTraining();
});

function LoadPersonalTraining() {
    var Branch = $('#Branch').val();
    var Year = parseInt($('#Year').val());
    var Month = parseInt($('#Month').val());

    $("#wait").css("display", "block");

    $.ajax({
        type: 'POST',
        url: $("#LoadPersonalTraining").val(),
        dataType: 'json',
        data: { branch: Branch, year: Year, month: Month },
        success: function (response) {

            var myData = jQuery.parseJSON(JSON.stringify(response));
            $("#wait").css("display", "none");
            if (myData.code == "1") {
                var Result = myData.data;
                personalTraining = Result;
                if (personalTraining.length != 0) {
                    bindPersonalTraining(personalTraining);
                    $("#noRecords").css("display", "none");
                    $("#tblstaff").css("display", "table");
                }
                else {
                    $("#noRecords").css("display", "block");
                    $("#tblstaff").css("display", "none");

                    var tr = [];
                    $("#tbodyid").empty();
                    $('.tblstaff').append($(tr.join('')));
                }

            } else if (myData.code == "0") {
                $("#noRecords").css("display", "block");
                $("#tblstaff").css("display", "none");

                var tr = [];
                $("#tbodyid").empty();
                $('.tblstaff').append($(tr.join('')));
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

function bindPersonalTraining(Result) {
    var tr = [];

    $.each(Result, function (key, payment) {
        var branch = $.grep(BranchArray, function (v) {
            return v.branchCode == payment.branch;
        })

        tr.push('<tr>');
        tr.push("<td>" + payment.memberId + "</td>");
        tr.push("<td>" + payment.staffId + "</td>");
        tr.push("<td>" + branch[0].branchName + "</td>");
        tr.push("<td>" + payment.staffName + "</td>");
        tr.push("<td>" + payment.trainingAmount + "</td>");
        tr.push("<td>" + getFormattedDate(new Date(payment.trainingDate)) + "</td>");

        var td = [];
        td.push('<td>');
        if ($('#delete').val() == 1 || $('#delete').val() == 2)
            td.push("<button type=\"button\" onclick=\"DeletePersonalTraining('" + payment.id + "')\" class=\"btn btn-danger\"><i class=\"fa fa-trash\"></i></button>");
        td.push('</td>');

        tr.push(td.join(' '));

        tr.push('</tr>');
    });

    $("#tbodyid").empty();
    $('.tblstaff').append($(tr.join('')));
    $("#noRecords").css("display", "none");
    $("#tblstaff").css("display", "table");
}

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

function DeletePersonalTraining(Id) {

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
                url: $("#DeletePersonalTraining").val(),
                data: { Id: parseInt(Id) },
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem('token'),
                },
                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#wait").css("display", "none");
 
                    LoadPersonalTraining();
                    if (myData.code == "1") {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Your record has been deleted.',
                            icon: 'success',
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
    })
}

$("#ValueforSearch").bind('keyup', function () {

    $("#wait").css("display", "block");

    var Result = [];
   
    Result = personalTraining;


   

    var searchVal = $('#ValueforSearch').val();
    var searchOpt = $('#SearchOptions').val();

    if (searchOpt == "1") {
        Result = $.grep(Result, function (v) {
            return (v.staffId.search(new RegExp(searchVal, "i")) != -1);
        })
    }
    else {
        Result = $.grep(Result, function (v) {
            return v.memberId == searchVal;
        })
    }

    $("#wait").css("display", "none");
    if (Result.length != 0) {
        bindPersonalTraining(Result);
        $("#noRecords").css("display", "none");
        $("#tblstaff").css("display", "table");
    }
    else {
        $("#noRecords").css("display", "block");
        $("#tblstaff").css("display", "none");

        var tr = [];
        $("#tbodyid").empty();
        $('.tblstaff').append($(tr.join('')));
    }


});

$("#SearchOptions").change(function () {
    $('#ValueforSearch').val('');
});