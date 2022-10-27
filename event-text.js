// For simplicity this calendar has no backend.logEvent
// An event is displayed as a sentence below the event creation dialogue
// with the details of the event in readable English.

/////////////////////////////////////////////////////////////////////////////
// New Event Creation
/////////////////////////////////////////////////////////////////////////////
//const dayjs = require("dayjs");
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
      $("input").val("");
      resetAllRecurrentEventDetails();
      $("#form-recurrent-event-type :checked").val("none");
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
      "Need a name for the event",
      "display-error",
      "correct-event"
    );
    return false;
  }
  if (!isValidEndTime()) {
    writeEventToScreen(
      "End date must come after start date.",
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
      "Frequency must be a numeric value.",
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


  var eventString =
    "<div class = 'row text-center justify-content-center'>Event created:&nbsp;" +
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

  var endDate = dayjs($("#recurrent-event-end-date").val()).format(
    "MMMM D, YYYY"
  );
  repetitionString += "until&nbsp;" + spanString + endDate + "</u>.</div>";
  eventString +=
    "<div class = 'pt-3 row text-center justify-content-center'>" +
    repetitionString;
  return eventString;
}

function writeEventToScreen(eventString, newClass, toRemove) {
  $("#new-event-text").html(eventString);
  document.getElementById("new-event-text").classList.remove(toRemove);
  document.getElementById("new-event-text").classList.add(newClass);
}
