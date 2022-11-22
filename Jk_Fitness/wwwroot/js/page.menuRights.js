$(document).ready(function () {
    ListMenuRights();
});

function ListMenuRights() {

    $("#wait").css("display", "block");
    $.ajax({
        type: 'GET',
        url: $("#GetMenuRights").val(),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code == "1") {
                var Menu = myData.data;
                var tr = [];
                for (var i = 0; i < Menu.length; i++) {
                    tr.push('<tr>');
                    if (Menu[i].parentId == "0")
                        tr.push("<td><b><font size='3'>" + Menu[i].menuName + "</font></b></td>");
                    else
                        tr.push("<td>&nbsp;&nbsp;--" + Menu[i].menuName + "</td>");

                    tr.push("<td><input type=\"checkbox\" " + Menu[i].admin + " onclick=\"updateRoles(this,'admin'," + Menu[i].id + ");\"></td>");
                    tr.push("<td><input type=\"checkbox\" " + Menu[i].staff + " onclick=\"updateRoles(this,'Staff'," + Menu[i].id + ");\"></td>");
                    tr.push("<td><input type=\"checkbox\" " + Menu[i].temporaryStaff + " onclick=\"updateRoles(this,'TemporaryStaff'," + Menu[i].id + ");\"></td>");
                    tr.push('</tr>');
                }
                $("#wait").css("display", "none");
                $("#tbodyid").empty();
                $('.tblMenu').append($(tr.join('')));
                $("#noRecords").css("display", "none");
                $("#tblMenu").css("display", "table");
            } else if (myData.code == "0") {
                $("#noRecords").css("display", "block");
                $("#tblMenu").css("display", "none");

                var tr = [];
                $("#tbodyid").empty();
                $('.tblMenu').append($(tr.join('')));
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

function updateRoles(Control, Name, Id) {
    var id = Control.checked ? 1 : 0;

    var data = '{"Id":"' + Id + '", "' + Name + '":"' + id + '"}';

    $.ajax({
        type: 'POST',
        url: $("#UpdateMenuRights").val(),
        dataType: 'json',
        data: data,
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var myData = jQuery.parseJSON(JSON.stringify(response));
            if (myData.code != "1") {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: myData.message,
                });
            }
        },
        error: function (error) {
            alert(error);
        }
    });

}
