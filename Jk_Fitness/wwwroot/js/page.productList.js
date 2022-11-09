$(document).ready(function () {
    LoadBranch();
    var ProductArray;
    $("#soldDate").val(getFormattedDate(new Date()));
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

function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

function LoadBranch() {
    $("#wait").css("display", "block");
    $('#BranchforSearch').find('option').remove().end();
    BranchforSearch = $('#BranchforSearch');

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
            $("#wait").css("display", "none");
            if (myData.code == "1") {
                var Result = myData.data;
                BranchArray = myData.data;
                $.each(Result, function () {
                    BranchforSearch.append($("<option/>").val(this.branchCode).text(this.branchName));
                });

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: myData.message,
                });
            }
            ListProductDetails();
        },
        error: function (jqXHR, exception) {
        }
    });
}


function ListProductDetails() {
    $("#wait").css("display", "block");
    $.ajax({
        type: 'GET',
        url: $("#GetProductDetails").val(),
        data: { BranchId: $('#BranchforSearch').val() },
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));

            if (myData.code == "1") {
                var ProdList = myData.data;
                ProductArray = myData.data;
                BindProductList(ProdList);

            } else {
                const Product = document.querySelector(".productHolder");
                Product.innerHTML = "";
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: myData.message,
                });
            }
            $("#wait").css("display", "none");
        },
        error: function (jqXHR, exception) {
        }
    });
}


function increase(id, AvailableStock) {
    document.getElementById("Decr" + id).disabled = false;
    var textBox = document.getElementById("text" + id);
    textBox.value++;
    if (parseInt(textBox.value) > parseInt(AvailableStock)) {
        document.getElementById("Incr" + id).disabled = true;
        textBox.value--;
    } else {
        document.getElementById("Incr" + id).disabled = false;
    }

}

function decrease(id) {
    document.getElementById("Incr" + id).disabled = false;
    var textBox = document.getElementById("text" + id);
    textBox.value--;
    if (parseInt(textBox.value) == 0) {
        document.getElementById("Decr" + id).disabled = true;
    }
}

$("#BranchforSearch").change(function () {
    $('#PnameforSearch').val("");
    ListProductDetails();
});

function Sold(id) {

    if (document.getElementById("text" + id).value != "0" && document.getElementById("text" + id).value != "") {
        var qty = parseInt(document.getElementById("text" + id).value);
        var soldPrice = parseFloat(document.getElementById("soldPrice" + id).value);
        var totalPrice = soldPrice * qty;


        $("#wait").css("display", "block");
        $.ajax({
            type: 'GET',
            url: $("#UpdateProductQuantity").val(),
            data: { ProductId: parseInt(id), Quantity: qty, SoldPricePerProduct: soldPrice, TotalSoldPrice: totalPrice, SoldDate: $('#soldDate').val() },
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token'),
            },
            success: function (response) {
                var myData = jQuery.parseJSON(JSON.stringify(response));
                $("#wait").css("display", "none");
                if (myData.code == "1") {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Your work has been Updated',
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                    });
                }
                ListProductDetails();
            },
            error: function (jqXHR, exception) {
            }
        });
    }
}

function BindProductList(ProdList) {
    const Product = document.querySelector(".productHolder");
    Product.innerHTML = "";
    let code;
    for (var i = 0; i < ProdList.length; i++) {

        code = '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">' +
            '<div class="cui-ecommerce--catalog--item">' +
            '<div class="cui-ecommerce--catalog--item--img">' +
            '<div class="cui-ecommerce--catalog--item--like cui-ecommerce--catalog--item--like__selected">' +
            '<i class="icmn-heart3 cui-ecommerce--catalog--item--like--liked"> </i>' +
            '<i class="icmn-heart4 cui-ecommerce--catalog--item--like--unliked"> </i>' +
            '</div>' +
            '<a href="javascript: void(0);">' +
            '<img src="data:image/jgp;base64,' + ProdList[i].productImage + ' " />' +
            ' </a>' +
            ' </div>' +
            '<div class="cui-ecommerce--catalog--item--title">' +
            ' <a href="#">' + ProdList[i].productName + '</a>' +
            '  </div>' +
            '<div class="cui-ecommerce--catalog--item--description">' +
            ' <a href="javascript: void(0);" style="color: black;">' + ProdList[i].description + '</a>' +
            ' <div class="cui-ecommerce--catalog--item--price">  Rs. ' + parseFloat(ProdList[i].pricePerProduct).toFixed(2) + ' ' +
            '</div>' +
            '  </div>' +
            '<div class="cui-ecommerce--catalog--item--description">' +
            '<div class="cui-ecommerce--catalog--item--price">  Sold Price: <input type="text" id="soldPrice' + ProdList[i].productId + '" value="' + parseFloat(ProdList[i].pricePerProduct).toFixed(2) + '" style="width: 110px;">' +
            '</div>' +
            '</div>' +
            '<br /> <div class="cui-ecommerce--catalog--item--descr">' +
            '<label style="padding-right: 5px;color: black;">Quantity </label>' +
            '<button type="button" id="Decr' + ProdList[i].productId + '" onclick="decrease(' + ProdList[i].productId + ')" class="btn-primary" disabled>-</button>' +
            '<input type="text" id="text' + ProdList[i].productId + '" value="0" style="width: 30px;">' +
            '<button type="button" id="Incr' + ProdList[i].productId + '" onclick="increase(' + ProdList[i].productId + ',' + ProdList[i].availableStock + ')" class="btn-primary">+</button>' +
            '<label style="font-size: small;font-style: normal;padding-left: 5px;">Only <span style="color: black; font-size: medium;">' + ProdList[i].availableStock + '</span> items left </label>' +
            ' </div>' +
            '<div class="cui-ecommerce--catalog--item--descr"> <button type="button" onclick="Sold(' + ProdList[i].productId + ')" class="btn btn-danger"style="width: -webkit-fill-available;">Sold</button>  </div>' +
            ' </div>' +
            '</div>';


        Product.innerHTML += code;

    }

}

$("#PnameforSearch").bind('keyup', function () {
    $("#wait").css("display", "block");

    var ProductName = $('#PnameforSearch').val();
    var Result = $.grep(ProductArray, function (v) {
        return (v.productName.search(new RegExp(ProductName, "i")) != -1);
    })

    $("#wait").css("display", "none");
    BindProductList(Result);
});