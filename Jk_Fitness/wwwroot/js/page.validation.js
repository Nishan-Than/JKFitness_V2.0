
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

$('#Nic').bind('keyup', function () {
    var NicVal = $('#Nic').val();
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
        if (gender == "Female") {
            $("#Frule").css("display", "flex");
        }
        else {
            $("#Frule").css("display", "none");
        }
        $("#ValidNic").css("display", "none");
        $("#btnAddMember").attr("disabled", false);
    }
    else {
        $("#ValidNic").css("display", "flex");
        $("#btnAddMember").attr("disabled", true);
    }
});

$('#EmergencyTP').bind('keyup', function () {
   
    var Valid = PhoneNumberValidate($('#EmergencyTP').val());
    if (Valid) {
        $("#EContactAlert").css("display", "none");
        $("#btnAddMember").attr("disabled", false);
    }
    else {
        $("#EContactAlert").css("display", "flex");
        $("#btnAddMember").attr("disabled", true);
    }
});

$('#ContactNo').bind('keyup', function () {
    
    var Valid = PhoneNumberValidate($('#ContactNo').val());
    if (Valid) {
        $("#ContactAlert").css("display", "none");
        $("#btnAddMember").attr("disabled", false);
    }
    else {
        $("#ContactAlert").css("display", "flex");
        $("#btnAddMember").attr("disabled", true);
    }
});

$('#Email').bind('keyup', function () {

    var Valid = validateEmail($('#Email').val());
    if (Valid) {
        $("#EmailAlert").css("display", "none");
        $("#btnAddMember").attr("disabled", false);
    }
    else {
        $("#EmailAlert").css("display", "flex");
        $("#btnAddMember").attr("disabled", true);
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

function PhoneNumberValidate(Num) {
    var filter = /^(?:0|94|\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6}$/;
    return filter.test(Num.trim());
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

$('#Height').bind('keyup', function () {
    var Height = $('#Height').val();
    var Weight = $('#Weight').val();

    if ($.isNumeric(Height)) {
        if (Weight != "") {
            var Bmi = Weight / Math.pow((Height / 100), 2);
            $('#BMI').val(Bmi.toFixed(2));
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
        }
        $("#HAlert").css("display", "none");
        $("#btnAddMember").attr("disabled", false);
    }
    else {
        $("#HAlert").css("display", "flex");
        $("#btnAddMember").attr("disabled", true);
    }
});

$('#Weight').bind('keyup', function () {
    var Height = $('#Height').val();
    var Weight = $('#Weight').val();

    if ($.isNumeric(Weight)) {
        if (Height != "") {
            var Bmi = Weight / Math.pow((Height / 100), 2);
            $('#BMI').val(Bmi.toFixed(2));
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
        $("#WAlert").css("display", "none");
        $("#btnAddMember").attr("disabled", false);
    }
    else {
        $("#WAlert").css("display", "flex");
        $("#btnAddMember").attr("disabled", true);
    }
});

