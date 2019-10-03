var clock = new Vue({
    el: '#clock',
    data: {
        time: '',
        date: ''
    }
});

var week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
var timerID = setInterval(updateTime, 1000);
updateTime();
function updateTime() {
    var cd = new Date();
    clock.time = zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2) + ':' + zeroPadding(cd.getSeconds(), 2);
    clock.date = zeroPadding(cd.getFullYear(), 4) + '-' + zeroPadding(cd.getMonth()+1, 2) + '-' + zeroPadding(cd.getDate(), 2) + ' ' + week[cd.getDate()];
};

function zeroPadding(num, digit) {
    var zero = '';
    for(var i = 0; i < digit; i++) {
        zero += '0';
    }
    return (zero + num).slice(-digit);
}

// Initializing Firebase
var firebaseConfig = {
    apiKey: "AIzaSyDEvD5fmgtv3dx9dfZIvQUeHlYOTAaksuA",
    authDomain: "trainscheduler-14711.firebaseapp.com",
    databaseURL: "https://trainscheduler-14711.firebaseio.com",
    projectId: "trainscheduler-14711",
    storageBucket: "trainscheduler-14711.appspot.com",
    messagingSenderId: "588322930078",
    appId: "1:588322930078:web:3576bfb815028938e7aa8f"
  };

  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

  var Train = "";
  var Destination = "";
  var firstTime = "";
  var Frequency = "";

  $("#add-train").on("click", function() {

    Train = $("#train-input").val().trim();
    Destination = $("#destination-input").val().trim();
    firstTime = moment($("#time-input").val().trim(), "HH:mm").subtract(10, "years").format("X");
    Frequency = $("#frequency-input").val().trim();

    dataRef.ref().push({

        Train: Train,
        Destination: Destination,
        firstTime: firstTime,
        Frequency: Frequency,
    });

    console.log("train added");

    //clearing the text out of the fields
    $("#train-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");


    // If no refresh
    return false;
  });

  dataRef.ref().on("child_added", function(childSnapshot, prevChildKey) {

    var tTrain = childSnapshot.val().Train;
    var tDestination = childSnapshot.val().Destination;
    var tFrequency = childSnapshot.val().Frequency;
    var tFirstTime = childSnapshot.val().firstTime;

    var differenceInTime = moment().diff(moment.unix(tFirstTime), "minutes");
    var tRemainder = moment().diff(moment.unix(tFirstTime), "minutes") % tFrequency;
    var tMinutes = tFrequency - tRemainder;

    var tArrival = moment().add(tMinutes, "m").format("hh:mm A");

    console.log(tMinutes);

    $("#Schedule > tbody").append("<tr><td>" + tTrain + "</td><td>" + tDestination + "</td><td>" + tFrequency + " min</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
  });