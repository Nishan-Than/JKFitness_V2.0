$(document).ready(function () {
    LoadBranchesforSearch();
    var GymAccountsArray;
});

function LoadBranchesforSearch() {
    $('#Branch').find('option').remove().end();
    Branch = $('#Branch');
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
                Branch.append($("<option/>").val(null).text("---All Branches---"));
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
    LoadGymAccounts();
}

function LoadGymAccounts() {
    var Branch = $('#Branch').val();
    var Year = parseInt($('#Year').val());

    $("#wait").css("display", "block");

    $.ajax({
        type: 'GET',
        url: $("#GetGymAccounts").val(),
        dataType: 'json',
        data: { branch: Branch, year: Year },
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem('token'),
        },
        contentType: 'application/json; charset=utf-8',
        success: function (response) {

            var myData = jQuery.parseJSON(JSON.stringify(response));
            $("#wait").css("display", "none");
            if (myData.code == "1") {
                var Result = myData.data;
                GymAccountsArray = Result;
                if (GymAccountsArray.length != 0) {
                    BindMembershipPayment(GymAccountsArray);
                }

            } else if (myData.code == "0") {
                $("#noRecords").css("display", "block");
                $("#tblMember").css("display", "none");

                var tr = [];
                $("#tbodyid").empty();
                $('.tblMember').append($(tr.join('')));
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

function BindMembershipPayment(Result) {

    var totalIncome = 0;
    var totalExpense = 0;

    $.each(Result, function (key, account) {

        if (account.isIncome) {
            $("#head" + account.summaryId).text(account.summaryName + " - Income");
        }
        else {
            $("#head" + account.summaryId).text(account.summaryName + " - Expenses");
        }

        if (account.totalIncome != 0 || account.totalExpense != 0) {
            var tr = [];

            tr.push('<tr>');
            tr.push("<th>Branch</th>");
            $.each(account.summarybyBranch[0].summarybyMonth, function (key, months) {
                tr.push("<th>" + months.month + "</th>");
            })

            if (account.isIncome) {
                tr.push("<th><strong style=\"color:green\">Total</strong></th>");
            }
            else {
                tr.push("<th><strong style=\"color:darkred\">Total</strong></th>");
            }

            tr.push('</tr>');

            $.each(account.summarybyBranch, function (key, byBranch) {

                //if (byBranch.totalByBranch != 0) {

                    tr.push('<tr>');
                    tr.push("<td><strong style=\"color:black\">" + byBranch.branch + "</strong></td>");
                    $.each(byBranch.summarybyMonth, function (key, byMonth) {

                        if (byMonth.amount != 0) {
                            tr.push("<td>" + byMonth.amount.toFixed(2) + "</td>");
                        }
                        else {
                            tr.push("<td> - </td>");
                        }

                    });
                    if (account.isIncome) {
                        tr.push("<td><strong style=\"color:green\">" + byBranch.totalByBranch.toFixed(2) + "</strong></td>");
                    }
                    else {
                        tr.push("<td><strong style=\"color:darkred\">" + byBranch.totalByBranch.toFixed(2) + "</strong></td>");
                    }
                    tr.push('</tr>');
                //}

            });

            if (account.isIncome) {
                $("#total" + account.summaryId).text("Total Income From " + account.summaryName + " - " + (account.totalIncome).toFixed(2));

                totalIncome = totalIncome + account.totalIncome;
            }
            else {
                $("#total" + account.summaryId).text("Total Expenses From " + account.summaryName + " - " + (account.totalExpense).toFixed(2));

                totalExpense = totalExpense + account.totalExpense;
            }

            $("#thead" + account.summaryId).empty();
            $("#tbody" + account.summaryId).empty();
            $(".tbl" + account.summaryId).append($(tr.join('')));
            $("#noRecords" + account.summaryId).css("display", "none");
            $("#" + account.summaryId).css("display", "table");
            $("#total" + account.summaryId).css("display", "block");
        }
        else {
            $("#noRecords" + account.summaryId).css("display", "block");
            $("#" + account.summaryId).css("display", "none");
            $("#total" + account.summaryId).css("display", "none");

            var tr = [];
            $("#thead" + account.summaryId).empty();
            $("#tbody" + account.summaryId).empty();
            $(".tbl" + account.summaryId).append($(tr.join('')));
        }

        $("#income").text(totalIncome.toFixed(2));
        $("#expense").text(totalExpense.toFixed(2));

        if ((totalIncome - totalExpense) > 0) {
            document.getElementById("lblprofit").style.color = "green";
            document.getElementById("profitamt").style.color = "green";
        } else {
            document.getElementById("lblprofit").style.color = "darkred";
            document.getElementById("profitamt").style.color = "darkred";
        }
        $("#profitamt").text((totalIncome - totalExpense).toFixed(2));
    })
}

$("#Branch").change(function () {
    LoadGymAccounts();
});

$("#Year").change(function () {
    LoadGymAccounts();
});