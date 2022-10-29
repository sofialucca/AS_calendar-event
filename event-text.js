// For simplicity this calendar has no backend.logEvent
// An event is displayed as a sentence below the event creation dialogue
// with the details of the event in readable English.

//const dayjs = require("dayjs");

/////////////////////////////////////////////////////////////////////////////
// New Event Creation
/////////////////////////////////////////////////////////////////////////////
let spanString = "<u class = 'info-event font-weight-bold'>";
let errorType = {};
$(function () {
  $("#create-event-button").click(function () {
    if (checkInputs()) {
      writeEventToScreen(getEventText(), "correct-event", "display-error");
      let keyValues = {
        allday: $("#all-day-event-checkbox")[0].checked,
        typeRecurrency: $("#form-recurrent-event-type :checked").val(),
      };
          if ($("#form-recurrent-event-type :checked").val() == "custom") {
              keyValues.frequencyRecurrency = $(
                "#recurrent-event-time-selector"
              ).val();
          }  
      $("#create-event-button").trigger("log", [
        "display-event-created",
        keyValues
      ]);


      correctFinalDateTime = true;
      wasEmpty = true;
      allDayRepeatStatus = new RepeatEvent(false);
      moreDaysRepeatStatus = new RepeatEvent(true);
      $("input[type='text']").val("");
      resetAllRecurrentEventDetails();
      $("#form-recurrent-event-type :checked").prop("checked", false);
      $("#none").prop("checked", true);
      $("#all-day-event-checkbox").prop("checked", false);

      $(".hidden-beginning").hide();
      $("#event-name").focus();
    
    }
  });


});

// End time must come after start time
function isValidEndTime() {

  if (!$("#all-day-event-checkbox").is(":checked")) {
    if (
      $("#event-start-date").datepicker("getDate") >
      $("#event-end-date").datepicker("getDate")
    ) {
      return false;
    } else if (
      $("#event-start-date").datepicker("getDate") <
      $("#event-end-date").datepicker("getDate")
    ) {
      return true;
    } else {
      return (
        $("#event-end-time").timepicker("getTime") >=
        $("#event-start-time").timepicker("getTime")
      );
    }
  }
  return true;
}
function checkInputs() {
  if ($("#event-name").val() == "") {
    writeEventToScreen(
      "<div class = 'display-error'>Need a name for the event</div>",
      "display-error",
      "correct-event"
    );
    return false;
  }
  if (!isValidEndTime()) {
    writeEventToScreen(
      "<div class = 'display-error'>End date must come after start date.</div>",
      "display-error",
      "correct-event"
    );
    return false;
  }

  var frequency = $(
    "#" + $("#recurrent-event-time-selector").val() + "-recurrent-freq"
  ).val();

  if (!$.isNumeric(frequency)) {
    writeEventToScreen(
      "<div class = 'display-error'>Frequency must be a numeric value.</div>",
      "display-error",
      "correct-event"
    );
    return false;
  }

  return true;
}

// Functions for building the event string
function getWeeklyRepeatingDays() {
  var days = [];

  var weekdayIds = [
    "#weekday-sun",
    "#weekday-mon",
    "#weekday-tue",
    "#weekday-wed",
    "#weekday-thu",
    "#weekday-fri",
    "#weekday-sat",
  ];
  var weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  for (i = 0; i < weekdayIds.length; i++) {
    if ($(weekdayIds[i]).is(":checked")) {
      days.push(weekdays[i]);
    }
  }

  return days;
}
function getMonthlyRepeatingDays() {
  var days = [];

  var monthdayIds = [
    "#month-1",
    "#month-2",
    "#month-3",
    "#month-4",
    "#month-5",
    "#month-6",
    "#month-7",
    "#month-8",
    "#month-9",
    "#month-10",
    "#month-11",
    "#month-12",
    "#month-13",
    "#month-14",
    "#month-15",
    "#month-16",
    "#month-17",
    "#month-18",
    "#month-19",
    "#month-20",
    "#month-21",
    "#month-22",
    "#month-23",
    "#month-24",
    "#month-25",
    "#month-26",
    "#month-27",
    "#month-28",
    "#month-29",
    "#month-30",
    "#month-31",
  ];
  for (i = 0; i < monthdayIds.length; i++) {
    if ($(monthdayIds[i]).is(":checked")) {
      days.push(i + 1);
    }
  }

  return days;
}
function getYearlyRepeatingMonths() {
  var months = [];

  var monthIds = [
    "#year-jan",
    "#year-feb",
    "#year-mar",
    "#year-apr",
    "#year-may",
    "#year-jun",
    "#year-jul",
    "#year-aug",
    "#year-sept",
    "#year-oct",
    "#year-nov",
    "#year-dec",
  ];
  var monthsNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  for (i = 0; i < monthIds.length; i++) {
    if ($(monthIds[i]).is(":checked")) {
      months.push(monthsNames[i]);
    }
  }

  return months;
}

function getWeeklyRepeatingString(arr) {
  var eventString = "on every&nbsp;";
  for (i = 0; i < arr.length - 1; i++) {
    eventString += spanString + arr[i] + "</u>,&nbsp;";
  }
  if (arr.length > 1) {
    eventString += "and&nbsp;";
  }
  eventString += spanString + arr[arr.length - 1] + "</u>&nbsp;of the week ";
  return eventString;
}
function getMonthlyRepeatingString(arr) {
  var eventString = "on the&nbsp;";
  for (i = 0; i < arr.length - 1; i++) {
    eventString += spanString + arr[i] + "</u>,&nbsp;";
  }
  if (arr.length > 1) {
    eventString += "and&nbsp;";
  }
  eventString += spanString + arr[arr.length - 1] + "</u>&nbsp;of the month ";
  return eventString;
}
function getYearlyRepeatingString(arr) {
  var eventString = "in&nbsp;";
  for (i = 0; i < arr.length - 1; i++) {
    eventString += spanString + arr[i] + "</u>,&nbsp;";
  }
  if (arr.length > 1) {
    eventString += "and&nbsp;";
  }
  eventString +=
    spanString +
    arr[arr.length - 1] +
    "</u>&nbsp;on the corresponding day of the month";
  if (arr.length > 1) {
    eventString += "s";
  }
  eventString += "&nbsp;";
  return eventString;
}

function getEventText() {
  var eventName = $("#event-name").val();
  var eventLocation = $("#event-location").val();
  var id = dayjs();

  var eventString =
    "<div class = 'event-container col-6 d-flex flex-column' id = " +
    id +
    ">" +
    "<div class = 'd-flex flex-row justify-content-end container-header'>" +
    "<u class = 'info-event-header align-self-center'>" +
    eventName +
    "</u>" +
    "<div class = 'row d-flex justify-content-end div-single-event-btns'>" +
    "<button class = 'btn btn-outline-primary btn-block btn-show-single-event' onclick = 'showEvent(" +
    id +
    ")'>" +
    "<i class='bi bi-eye-fill'></i>" +
    "</button> " +
    "<button class = 'btn btn-outline-primary btn-block btn-hide-single-event' onclick= 'hideEvent(" +
    id +
    ")'>" +
    "<i class='bi bi-eye-slash'></i>" +
    " </button>" +
    "<button class='btn btn-outline-danger btn-block btn-delete-single-event'onclick= 'deleteEvent(" +
    id +
    ")'>" +
    "<i class = 'bi bi-trash3'></i></button>" +
    "</div></div>" +
    "<div class = 'row text-center justify-content-center'> Event:&nbsp;" +
    spanString +
    eventName +
    "</u></div>";
  if (eventLocation != "") {
    eventString +=
      "<div class = 'pt-3 row text-center justify-content-center'>Location:&nbsp;" +
      spanString +
      eventLocation +
      "</u></div>";
  }

  var allDayEvent = $("#all-day-event-checkbox").is(":checked");
  if (allDayEvent) {
    var eventDate = 	dayjs($("#all-day-event-date").val()).format("MMMM D, YYYY");
    eventString +=
      "<div class = 'pt-3 row text-center justify-content-center'>An all day event on&nbsp;" +
      spanString +
      eventDate +
      "</u></div>";
  } else {
    var startDate = dayjs($("#event-start-date").val()).format("MMMM D, YYYY");
    var startTime = $("#event-start-time").val();
    var endDate = dayjs($("#event-end-date").val()).format("MMMM D, YYYY");
    var endTime = $("#event-end-time").val();
    var eventDate =
      "Starting on&nbsp;" +
      spanString +
      startDate +
      "</u>&nbsp;at&nbsp;" +
      spanString +
      startTime +
      "</u>&nbsp;and ending";
    if (startDate != endDate) {
      eventDate += " on&nbsp;" + spanString + endDate + "</u>";
    }
    eventDate += "&nbsp;at&nbsp;" + spanString + endTime + "</u></div>";
    eventString +=
      "<div class = 'pt-3 row text-center justify-content-center'>" + eventDate;
  }
  var repetitionString = "";
  var repeatOption = $("#form-recurrent-event-type :checked").val();
  if (repeatOption == "none") {
    return eventString;
  } else if (repeatOption == "day") {
    repetitionString +=
      "Repeating every&nbsp;" + spanString + " day" + "</u>&nbsp;";
  } else if (repeatOption == "week") {
    repetitionString +=
      "Repeating every&nbsp;" + spanString + " week" + "</u>&nbsp;";
  } else if (repeatOption == "month") {
    repetitionString +=
      "Repeating every&nbsp;" + spanString + " month" + "</u>&nbsp;";
  } else if (repeatOption == "year") {
    repetitionString +=
      "Repeating every&nbsp;" + spanString + " year" + "</u>&nbsp;";
  } else {
    // custom
    var frequencyOption = $("#recurrent-event-time-selector").val();
    var frequency = 1;
    var repeatingUnits = [];
    repetitionString += "Repeating every&nbsp;";
    if (frequencyOption == "daily") {
      frequency = $("#daily-recurrent-freq").val();
      
      if (frequency == 1) {
        repetitionString += spanString + "day";
      }else{
        repetitionString += spanString + frequency + " days";
      }
      repetitionString += "</u>&nbsp;";
    } else if (frequencyOption == "weekly") {
      frequency = $("#weekly-recurrent-freq").val();
      repeatingUnits = getWeeklyRepeatingDays();
      
      if (frequency == 1) {
        repetitionString += spanString + "week"
      } else {
        repetitionString += spanString + frequency + " weeks"
      }
      repetitionString +=
        "</u>&nbsp;" + getWeeklyRepeatingString(repeatingUnits);
    } else if (frequencyOption == "monthly") {
      frequency = $("#monthly-recurrent-freq").val();
      repeatingUnits = getMonthlyRepeatingDays();
      
      if (frequency == 1) {
        repetitionString += spanString + " month";
      } else {
        repetitionString +=
          spanString +
          frequency +
          " months"
      }
            repetitionString +=
              "</u>&nbsp;" + getMonthlyRepeatingString(repeatingUnits);
    } else {
      // yearly
      frequency = $("#yearly-recurrent-freq").val();
      repeatingUnits = getYearlyRepeatingMonths();
      
      
      if (frequency == 1) {
        repetitionString += spanString + "year";
      } else {
        repetitionString +=
          spanString +
          frequency +
          " years"
      }
      repetitionString +=
        "</u>&nbsp;" + getYearlyRepeatingString(repeatingUnits);
    }
  }
  if (!$("#never-end-repeat-checkbox")[0].checked){
    var endDate = dayjs($("#recurrent-event-end-date").val()).format(
      "MMMM D, YYYY"
    );
  repetitionString += "until&nbsp;" + spanString + endDate + "</u>"
  }
  repetitionString+=".</div>";
  eventString +=
    "<div class = 'pt-3 row text-center justify-content-center'>" +
    repetitionString+"</div>";
  return eventString;
}

function writeEventToScreen(eventString, newClass, toRemove) {
  //document.getElementById("btns-all-events").insertAdjacentHTML("afterend",eventString)
    document
      .getElementById("all-events-header")
      .insertAdjacentHTML("afterend", eventString);

  if(newClass == "display-error"){
    $("#btns-all-events").hide();
  }else{
    document.getElementById("new-event-text").classList.add(newClass);
  }
  document.getElementById("new-event-text").classList.remove(toRemove);
  
  $("#new-event-text").show();
  $(".info-event-header").first().hide();
  showAllEvents();
}
function hideAllEvents(){
      
       $("#btn-hide-all-events").hide();
       $("#btn-show-all-events").show();
       $(".event-container").removeClass("d-flex");
       $(".event-container").hide(); 
$(".line-shrink").show()
       $("#title-my-events").show();
}
function showAllEvents(){
      $("#btn-hide-all-events").show();
      $("#btn-show-all-events").hide();
      $(".event-container").addClass("d-flex");
      $(".event-container").show();
      $("#title-my-events").hide();
      $(".line-shrink").hide();
}

function deleteAllEvents(){
      $(".event-container").remove();
      $("#new-event-text").hide();
      $("#event-name").focus();
}

function hideEvent(id){
  $("#"+id + " .info-event-header").show();
  $("#"+id+" div.justify-content-center").hide();
  $("#" + id + " button.btn-show-single-event").removeClass("d-none");
  $("#" + id + " button.btn-show-single-event").show()
    $("#" + id + " button.btn-hide-single-event").hide();
    $("#"+id+" .container-header").removeClass("justify-content-end");
    $("#" + id + " .container-header").addClass("justify-content-between");
     $("#"+id+" .info-event-header").show();
  document.getElementById(id).style.paddingBottom = 0;
}

function showEvent(id){
  $("#"+id+" div.justify-content-center").show();
    $("#" + id + " .container-header").addClass("justify-content-end");
    $("#" + id + " .container-header").removeClass("justify-content-between");
  $("#" + id + " button.btn-show-single-event").hide()
    $("#" + id + " button.btn-hide-single-event").show();
     $("#"+id+" .info-event-header").hide();
  document.getElementById(id).style.paddingBottom = "2rem";
}
function deleteEvent(id) {
  $("#" + id ).remove();
  if($(".event-container").length == 0){
    $("#new-event-text").hide();
  }
}
