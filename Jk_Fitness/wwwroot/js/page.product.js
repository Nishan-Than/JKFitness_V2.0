$(document).ready(function () {
    LoadBranchforSearch();
    LoadBranch();
    var ProductArray;
    var BranchArray;
});

$('#btnAdd').click(function () {
    $('#ProModal').modal('show');
    $('#formUser').trigger("reset");
    $('#imageBrowes').next('.custom-file-label').html("Choose File....");
    $('#ProductId').val("0");
    $('#targetImg').attr("src", "dist/img/default.jpg");
});

function LoadBranch() {
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

function Cancel() {
    $('#ProModal').modal('toggle');  
}

$('#imageBrowes').change(function (event) {
    var files = event.target.files;
    if (files.length > 0) {
        $('#targetImg').attr('src', window.URL.createObjectURL(files[0]));
        $(this).next('.custom-file-label').html(files[0].name);
    }
});

$('#btnSave').click(function () {

    var files = $('#imageBrowes').prop("files");
    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
    }

    var Emp = {
        ProductId: $('#ProductId').val(),
        ProductName: $('#Productname').val(),
        Description: $('#ProductDescription').val(),
        Branch: $('#Branch').val(),
        AvailableStock: $('#Stock').val(),
        PricePerProduct: $('#Price').val()
    };
    formData.append("Product", JSON.stringify(Emp));


    if (!$('#Productname').val() || !$('#Stock').val() || !$('#Price').val() ) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Empty Value Can not be Allow!',
        });
    } else if ( Branch == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please Select a Branch!',
        });
    } else {
        $("#waitform").css("display", "block");
        $('.modal').addClass('freeze');
        $('.modal-content').addClass('freeze');
        $("#btnSave").attr("disabled", true);
        if ($('#ProductId').val() == "0" || $('#ProductId').val() == "") {

            $.ajax({
                type: 'POST',
                url: $("#SaveProducts").val(),
                dataType: 'json',
                data: formData,
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
                        ListProductDetails();

                    } else if (myData.code == "0") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Email Duplicated!',
                        });
                        Cancel();
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
                url: $("#UpdateProduct").val(),
                dataType: 'json',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    $("#waitform").css("display", "none");
                    $("#btnAddEmployee").attr("disabled", false);
                    if (myData.code == "1") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been Updated',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        Cancel();
                        ListProductDetails();
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

function ListProductDetails() {
    var val = $('#BranchforSearch').val();
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
            $("#wait").css("display", "none");
            if (myData.code == "1") {
                var ProdList = myData.data;
                ProductArray = ProdList;
                BindProductTable(ProdList);
            } else if (myData.code == "0") {
                $("#noRecords").css("display", "block");
                $("#tblProduct").css("display", "none");

                var tr = [];
                $("#tbodyid").empty();
                $('.tblProduct').append($(tr.join('')));
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

function BindProductTable(ProdList) {
    var tr = [];
    for (var i = 0; i < ProdList.length; i++) {

        var branch = $.grep(BranchArray, function (v) {
            return v.branchCode == ProdList[i].branch;
        })

        tr.push('<tr>');
        tr.push("<td>" + ProdList[i].productName + "</td>");
        tr.push("<td>" + branch[0].branchName + "</td>");;
        tr.push("<td>" + ProdList[i].availableStock + "</td>");;
        tr.push("<td>" + ProdList[i].pricePerProduct.toFixed(2) + "</td>");;


        var td = [];
        td.push('<td>');
        td.push("<button onclick=\"EditProduct('" + ProdList[i].productId + "')\" class=\"btn btn-primary\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Edit\"><i class=\"fa fa-edit\"></i></button>");
        td.push("<button onclick=\"DeleteProduct('" + ProdList[i].productId + "')\" class=\"btn btn-danger\"data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Delete\"><i class=\"fa fa-trash\"></i></button>");

        td.push('</td>');

        tr.push(td.join(' '));

        tr.push('</tr>');
    }

    $("#tbodyid").empty();
    $('.tblProduct').append($(tr.join('')));
    $("#noRecords").css("display", "none");
    $("#tblProduct").css("display", "table");
}



function EditProduct(Id) {

    $('#btnAddEmployee').attr('hidden', false);
    $('#btnCancel').attr('hidden', false);
    $('.modal-body').removeClass('freeze');
    $('.modal').removeClass('freeze');
    $('.modal-content').removeClass('freeze');
    $("#wait").css("display", "block");
    $("#MemFind").css("display", "none");

    var ProductDetails = $.grep(ProductArray, function (v) {
        return v.productId == Id;
    })

    if (ProductDetails.length != 0) {
        var Result = ProductDetails[0];
        $("#Productname").val(Result['productName']);
        $("#ProductDescription").val(Result['description']);
        $("#Branch").val(Result['branch']);
        $("#Stock").val(Result['availableStock']);
        $("#Price").val(Result['pricePerProduct']);
        
        $("#ProductId").val(Result['productId']);
        if (Result.productImage != null) {
            $('#targetImg').attr("src", "data:image/jgp;base64," + Result.productImage + "");
        }
        else {
            $('#targetImg').attr("src", "dist/img/default.jpg");
        }
        $("#wait").css("display", "none");
        $('#ProModal').modal('show');
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        });
    }
}

function DeleteProduct(Id) {

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
            $("#waitform").css("display", "block");
            $.ajax({
                type: 'POST',
                url: $("#DeleteProduct").val(),
                dataType: 'json',
                data: '{"ProductId": "' + Id + '"}',
                contentType: 'application/json; charset=utf-8',
                success: function (response) {
                    $("#waitform").css("display", "none");
                    var myData = jQuery.parseJSON(JSON.stringify(response));
                    if (myData.code == "1") {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Your record has been deleted.',
                            icon: 'success',
                        });
                        ListProductDetails();
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

function LoadBranchforSearch() {
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
            if (myData.code == "1") {
                var Result = myData.data;

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


$("#BranchforSearch").change(function () {
    $('#PnameforSearch').val("");
    ListProductDetails();
});

$("#PnameforSearch").bind('keyup', function () {
    $("#wait").css("display", "block");

    var ProductName = $('#PnameforSearch').val();
    var Result = $.grep(ProductArray, function (v) {
        return (v.productName.search(new RegExp(ProductName, "i")) != -1);
    })

    $("#wait").css("display", "none");
    BindProductTable(Result);
});