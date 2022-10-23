// For simplicity this calendar has no backend.
// An event is displayed as a sentence below the event creation dialogue
// with the details of the event in readable English.

/////////////////////////////////////////////////////////////////////////////
// New Event Creation
/////////////////////////////////////////////////////////////////////////////

$(function () {
  $("#create-event-button").click(function () {
    if (checkInputs()) {
      writeEventToScreen(getEventText(), "correct-event", "display-error");
      correctFinalDateTime = true;
      wasEmpty = true;
      allDayRepeatStatus = new RepeatEvent(false);
      moreDaysRepeatStatus = new RepeatEvent(true);
      $("input").val("");
      resetAllRecurrentEventDetails();
      $("#recurrent-event-type-selector").val("none");
      $("#all-day-event-checkbox").prop("checked", false);

      $(".hidden-beginning").hide();
      $("#event-name").focus();
    }
  });
});

// End time must come after start time
function isValidEndTime() {
  //console.log($("#all-day-event-checkbox").is(":checked"));
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
  if (document.querySelector("#event-name").textContent == "") {
    writeEventToScreen(
      "Need a name for the event",
      "display-error",
      "correct-event"
    );
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
  var eventString = "on every ";
  for (i = 0; i < arr.length - 1; i++) {
    eventString += arr[i] + ", ";
  }
  if (arr.length > 1) {
    eventString += "and ";
  }
  eventString += arr[arr.length - 1] + " of the week ";
  return eventString;
}
function getMonthlyRepeatingString(arr) {
  var eventString = "on the ";
  for (i = 0; i < arr.length - 1; i++) {
    eventString += arr[i] + ", ";
  }
  if (arr.length > 1) {
    eventString += "and ";
  }
  eventString += arr[arr.length - 1] + " of the month ";
  return eventString;
}
function getYearlyRepeatingString(arr) {
  var eventString = "in ";
  for (i = 0; i < arr.length - 1; i++) {
    eventString += arr[i] + ", ";
  }
  if (arr.length > 1) {
    eventString += "and ";
  }
  eventString += arr[arr.length - 1] + " on the corresponding day of the month";
  if (arr.length > 1) {
    eventString += "s";
  }
  eventString += " ";
  return eventString;
}

function getEventText() {
  var eventName = $("#event-name").val();
  var eventLocation = $("#event-location").val();
  console.log($("#event-location").val());

  var eventString = "Event created: " + eventName;
  if (eventLocation != "") {
    eventString += "<br/>Location: " + eventLocation;
  }

  var allDayEvent = $("#all-day-event-checkbox").is(":checked");
  if (allDayEvent) {
    var eventDate = $("#all-day-event-date").val();
    eventString += "<br/>An all day event on " + eventDate;
  } else {
    var startDate = $("#event-start-date").val();
    var startTime = $("#event-start-time").val();
    var endDate = $("#event-end-date").val();
    var endTime = $("#event-end-time").val();
    var eventDate =
      "Starting on " + startDate + " at " + startTime + " and ending";
    if (startDate != endDate) {
      eventDate += " on " + endDate;
    }
    eventDate += " at " + endTime;
    eventString += "<br/>" + eventDate;
  }
  var repetitionString = "";
  var repeatOption = $("#recurrent-event-type-selector").val();
  if (repeatOption == "none") {
    return eventString;
  } else if (repeatOption == "day") {
    repetitionString += "Repeating every day ";
  } else if (repeatOption == "week") {
    repetitionString += "Repeating every week ";
  } else if (repeatOption == "month") {
    repetitionString += "Repeating every month ";
  } else if (repeatOption == "year") {
    repetitionString += "Repeating every year ";
  } else {
    // custom
    var frequencyOption = $("#recurrent-event-time-selector").val();
    var frequency = 1;
    var repeatingUnits = [];
    if (frequencyOption == "daily") {
      frequency = $("#daily-recurrent-freq").val();
      repetitionString += "Repeating every " + frequency + " day";
      if (frequency > 1) {
        repetitionString += "s";
      }
      repetitionString += " ";
    } else if (frequencyOption == "weekly") {
      frequency = $("#weekly-recurrent-freq").val();
      repeatingUnits = getWeeklyRepeatingDays();
      repetitionString += "Repeating every " + frequency + " week";
      if (frequency > 1) {
        repetitionString += "s";
      }
      repetitionString += " " + getWeeklyRepeatingString(repeatingUnits);
    } else if (frequencyOption == "monthly") {
      frequency = $("#monthly-recurrent-freq").val();
      repeatingUnits = getMonthlyRepeatingDays();
      repetitionString += "Repeating every " + frequency + " month";
      if (frequency > 1) {
        repetitionString += "s";
      }
      repetitionString += " " + getMonthlyRepeatingString(repeatingUnits);
    } else {
      // yearly
      frequency = $("#yearly-recurrent-freq").val();
      repeatingUnits = getYearlyRepeatingMonths();
      repetitionString += "Repeating every " + frequency + " year";
      if (frequency > 1) {
        repetitionString += "s";
      }
      repetitionString += " " + getYearlyRepeatingString(repeatingUnits);
    }
  }

  var endDate = $("#recurrent-event-end-date").val();
  repetitionString += "until " + endDate + ".";
  eventString += "<br/>" + repetitionString;
  return eventString;
}

function writeEventToScreen(eventString, newClass, toRemove) {
  $("#new-event-text").html(eventString);
  document.getElementById("new-event-text").classList.remove(toRemove);
  document.getElementById("new-event-text").classList.add(newClass);
}
