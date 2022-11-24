$(document).ready(function () {
    var BranchArray;
    LoadMonths()
    LoadBranches();
    //var CurDate = new Date();
    //$("#SoldDate").val(getFormattedDate(CurDate));

});


var TblSoldProduct = $("#tblSoldProduct").DataTable(
    {
        dom: 'Bfrtip',
        buttons: [{
            extend: 'pdfHtml5',
            orientation: 'portrait',
            pageSize: 'LEGAL',
            filename: function () {
                return "Sold Products Report"
            },
            title: function () {
                return "Sold Products Report"
            },
            customize: function (doc) {
                //doc.content[1].margin = [100, 0, 100, 0] //left, top, right, bottom
            }
        },
        {
            extend: 'excelHtml5',
            filename: function () {
                return "Sold Products Report"
            },
            title: function () {
                return "Sold Products Report"
            }
        },
        {
            extend: 'print',
            filename: function () {
                return "Sold Products Report"
            },
            title: function () {
                return "Sold Products Report"
            }
        }
        ],
        pageLength: 1000,
        "aaSorting": []
    });

$(function () {
    //Date picker
    $('#date').datetimepicker({
        format: 'L'
    })
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
    ListSoldProductDetails();
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
}

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

function ListSoldProductDetails() {

    var Branch = $('#Branch').val();
    var Year = parseInt($('#Year').val());
    var Month = parseInt($('#Month').val());

    $("#wait").css("display", "block");
    $.ajax({
        type: 'POST',
        url: $("#GetSoldProducts").val(),
        dataType: 'json',
        data: { branch: Branch, year: Year, month: Month },
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var ProdList = myData.data;
                TblSoldProduct.clear()
                    .draw();
                var tr = [];
                for (var i = 0; i < ProdList.length; i++) {

                    var branch = $.grep(BranchArray, function (v) {
                        return v.branchCode == ProdList[i].branch;
                    })

                    TblSoldProduct.row.add(['<label> ' + ProdList[i].productId + ' </label>',
                    '<label> ' + ProdList[i].productName + ' </label>',
                    '<label> ' + branch[0].branchName + ' </label>',
                    '<label> ' + ProdList[i].pricePerProduct.toFixed(2) + ' </label>',
                    '<label> ' + ProdList[i].soldPricePerProduct.toFixed(2) + ' </label>',
                    '<label> ' + ProdList[i].quantity + ' </label>',
                    '<label> ' + ProdList[i].totalSoldPrice.toFixed(2) + ' </label>',
                    '<label> ' + getFormattedDate(new Date(ProdList[i].soldDate)) + ' </label>'
                    ]).draw(false);

                }
                $("#wait").css("display", "none");
                $("#tbodyid").empty();
                $('.tblSoldProduct').append($(tr.join('')));
                $("#noRecords").css("display", "none");
                $("#tblSoldProduct").css("display", "table");
            } else if (myData.code == "0") {
                $("#wait").css("display", "none");
                $("#noRecords").css("display", "block");
                $("#tblSoldProduct").css("display", "none");

                var tr = [];
                $("#tbodyid").empty();
                $('.tblSoldProduct').append($(tr.join('')));
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

$("#btnSearch").click(function () {
    ListSoldProductDetails();
});

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

$("#Branch").change(function () {
    ListSoldProductDetails();
});

$("#Year").change(function () {
    ListSoldProductDetails();
});

$("#Month").change(function () {
    ListSoldProductDetails();
});