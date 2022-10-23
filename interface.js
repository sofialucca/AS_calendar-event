
let correctFinalDateTime = true;
let wasEmpty = true;
let allDayRepeatStatus = new RepeatEvent(false);
let moreDaysRepeatStatus = new RepeatEvent(true);

$(function () {
  $(function () {
    $("#event-name").focus();
    $(".hidden-beginning").hide();
  });

  $(document).on("input", "#event-name", function (e) {
    if (e.target.value != "" && wasEmpty) {
      wasEmpty = false;
      $("#time-details").show();
      $("#location-div").show();
      $("#end-time-row").hide();
      $("#error-message").hide();
      $("#error-message-end-repeat").hide();

      if ($("#all-day-event-checkbox")[0].checked) {
        showAllDayEventOptions();
      } else {
        hideAllDayEventOptions();

      }
    } else if (e.target.value == "") {
      wasEmpty = true;
      $(".hidden-beginning").hide();
    }
  });

  $("#event-start-date").datepicker({
    changeMonth: true,
    changeYear: true,
    defaultDate: new Date(),
    gotoCurrent: true,
    hideIfNoPrevNext: true,
    minDate: new Date(),
  });
  $("#event-start-date").on("change", function ($input) {
    if ($input.target.value == "") {
      $("#event-start-time").hide();
      $("#end-time-row").hide();
      $("#error-message").hide();
      $("#recurrent-event-row").hide();
      $("#recurrent-event-content").hide();
      hideCreateEventButton();
      $("#recurrent-event-end-date-row").hide();
    } else {
      $("#event-start-time").show();
      let eventEndDate = document.getElementById("event-end-date");

      if (eventEndDate.value) {
        if (
          new Date($input.target.value) >
          $("#event-end-date").datepicker("getDate")
        ) {
          displayError();
          $("#end-time-row").show();
          $("event-end-time").hide();
        } else if (
          new Date($input.target.value) <
          $("#event-end-date").datepicker("getDate")
        ) {
          removeError();
          $("#event-end-time").timepicker("option", "minTime", "12:00 AM");
          if ($("#event-end-time").timepicker("getTime")) {
            $("#recurrent-event-row").show();
            if ($("#recurrent-event-type-selector").val() != "none") {
              $("#recurrent-event-end-date-row").show();
              if (!moreDaysRepeatStatus.correct) {
                displayErrorEndRepeat();
              } else if (
                $("#recurrent-event-end-date").val() &&
                $("#recurrent-event-type-selector").val() == "custom"
              ) {
                showRecurrentEventOptions();
              }
            }
          } else {
            $("#recurrent-event-row").hide();
          }
        } else {
          if ($("#event-end-time").timepicker("getTime")) {
            if (
              $("#event-end-time").timepicker("getTime") <
              $("#event-start-time").timepicker("getTime")
            ) {
              displayError();
              $("#event-end-time").show();
              $("#recurrent-event-row").hide();
              $("#recurrent-event-end-date-row").hide();
              $("#recurrent-event-content").hide();
              hideCreateEventButton();
            } else {
              removeError();
              $("#recurrent-event-row").show();
              if ($("#recurrent-event-type-selector").val() != "none") {
                $("#recurrent-event-end-date-row").show();
                if (!moreDaysRepeatStatus.correct) {
                  displayErrorEndRepeat();
                } else if (
                  $("#recurrent-event-end-date").val() &&
                  $("#recurrent-event-type-selector").val() == "custom"
                ) {
                  showRecurrentEventOptions();
                }
              }
            }
          }
        }
      } else {
        $("#event-end-date").datepicker(
          "option",
          "minDate",
          $input.target.value
        );
      }
    }
  });
  $("#event-start-time")
    .timepicker({
      timeFormat: "h:i A",
      step: 5,
      stopScrollPropagation: true,
    })
    .on("changeTime", function ($input) {
      if ($input.target.value == "") {
        $("#end-time-row").hide();
        $("#error-message").hide();
        $("#recurrent-event-row").hide();
        $("#recurrent-event-content").hide();
        hideCreateEventButton();
        $("#recurrent-event-end-date-row").hide();
      } else {
        $("#end-time-row").show();
        $("#event-end-time").hide();
        if ($("#event-start-date").val() == $("#event-end-date").val()) {
          $("#event-end-time").timepicker(
            "option",
            "minTime",
            $input.target.value
          );
          if ($("#event-end-time").val()) {
            $("#event-end-time").show();
            if (
              $("#event-end-time").timepicker("getTime") <
              $("#event-start-time").timepicker("getTime")
            ) {
              displayError();
              $("#event-end-time").show();
              $("#recurrent-event-row").hide();
              $("#recurrent-event-end-date-row").hide();
              $("#recurrent-event-content").hide();
              hideCreateEventButton();
            } else {
              if (
                $("#event-end-time").timepicker("getTime") >=
                $("#event-start-time").timepicker("getTime")
              ) {
                removeError();
              }
              $("#recurrent-event-row").show();
              if ($("#recurrent-event-type-selector").val() != "none") {
                $("#recurrent-event-end-date-row").show();
                if (!moreDaysRepeatStatus.correct) {
                  displayErrorEndRepeat();
                } else if (
                  $("#recurrent-event-end-date").val() &&
                  $("#recurrent-event-type-selector").val() == "custom"
                ) {
                  showRecurrentEventOptions();
                }
              }
            }
          }
        }
      }
    });

  $("#event-end-date")
    .datepicker({
      changeMonth: true,
      changeYear: true,
      defaultDate: new Date(),
      gotoCurrent: true,
      hideIfNoPrevNext: true,
      minDate: new Date(),
    })
    .on("change", function ($input) {
      if ($input.target.value == "") {
        $("#event-end-time").hide();
        let eventEndDate = document.getElementById("event-end-date");

        $("#event-end-date").datepicker(
          "option",
          "minDate",
          $("#event-start-date").datepicker("getDate")
        );
        $("#error-input-date-end").hide();
        eventEndDate.classList.remove("display-error");
        correctFinalDateTime = true;
        $("#error-message").hide();
        $("#recurrent-event-row").hide();
        $("#recurrent-event-content").hide();
        hideCreateEventButton();
        $("#recurrent-event-end-date-row").hide();
        $("#error-message-end-repeat").hide();
      } else {
        if ($("#event-start-date").val() == $("#event-end-date").val()) {
          $("#event-end-time").timepicker(
            "option",
            "minTime",
            $("#event-start-time").val()
          );
          if (
            $("#event-end-time").timepicker("getTime") &&
            $("#event-end-time").timepicker("getTime") <
              $("#event-start-time").timepicker("getTime")
          ) {
            displayError();
            $("#event-end-time").show();
            $("#recurrent-event-row").hide();
            $("#recurrent-event-end-date-row").hide();
            $("#recurrent-event-content").hide();
            hideCreateEventButton();
          } else {
            removeError();
            if ($("#event-end-time").timepicker("getTime")) {
              $("#recurrent-event-row").show();
              if ($("#recurrent-event-type-selector").val() != "none") {
                $("#recurrent-event-end-date-row").show();
                if (!moreDaysRepeatStatus.correct) {
                  displayErrorEndRepeat();
                } else if (
                  $("#recurrent-event-end-date").val() &&
                  $("#recurrent-event-type-selector").val() == "custom"
                ) {
                  showRecurrentEventOptions();
                }
              }
            } else {
              $("#recurrent-event-row").hide();
            }
          }
        } else if (
          new Date($input.target.value) >
          $("#event-start-date").datepicker("getDate")
        ) {
          removeError();
          $("#event-end-time").timepicker("option", "minTime", "12:00 AM");
          if ($("#event-end-time").timepicker("getTime")) {
            $("#recurrent-event-row").show();
            if ($("#recurrent-event-type-selector").val() != "none") {
              $("#recurrent-event-end-date-row").show();
              if (!moreDaysRepeatStatus.correct) {
                displayErrorEndRepeat();
              } else if (
                $("#recurrent-event-end-date").val() &&
                $("#recurrent-event-type-selector").val() == "custom"
              ) {
                showRecurrentEventOptions();
              }
            }
          } else {
            $("#recurrent-event-row").hide();
          }
        }

        //check end repeat
        let eventEndDate = document.getElementById("recurrent-event-end-date");
        if (moreDaysRepeatStatus.type != "none") {
          if (eventEndDate.value) {
            if (
              new Date($input.target.value) >
              $("#recurrent-event-end-date").datepicker("getDate")
            ) {
              displayErrorEndRepeat();
              moreDaysRepeatStatus.correct = false;
            } else {
              removeErrorEndRepeat($("#event-end-date").datepicker("getDate"));
              moreDaysRepeatStatus.minDateCurrent =
                $("#event-end-date").datepicker("getDate");
              moreDaysRepeatStatus.correct = true;
            }
          } else {
            $("#recurrent-event-end-date").datepicker(
              "option",
              "minDate",
              $input.target.value
            );
            moreDaysRepeatStatus.minDateCurrent = $input.target.value;
            moreDaysRepeatStatus.correct = true;
          }
        }
        if (!eventEndDate.value){
                      $("#recurrent-event-end-date").datepicker(
                        "option",
                        "minDate",
                        $input.target.value
                      );
        } 
      }
    });

  $("#event-end-time")
    .timepicker({
      timeFormat: "h:i A",
      step: 5,
      maxTime: "11:59 PM",
    })
    .on("change", function ($input) {
      if ($input.target.value == "") {
        removeError();
        $("#recurrent-event-row").hide();
        $("#recurrent-event-content").hide();
        $("#recurrent-event-end-date-row").hide();
        hideCreateEventButton();
      } else if (
        $("#event-start-date").val() == $("#event-end-date").val() &&
        $("#event-end-time").timepicker("getTime") <
          $("#event-start-time").timepicker("getTime")
      ) {
        displayError();
        $(this).show();
        $("#recurrent-event-row").hide();
        $("#recurrent-event-end-date-row").hide();
        $("#recurrent-event-content").hide();
        hideCreateEventButton();
      } else {
        if (
          $("#event-start-date").val() == $("#event-end-date").val() &&
          $("#event-end-time").timepicker("getTime") >=
            $("#event-start-time").timepicker("getTime")
        ) {
          removeError();
        }
        if ($("#event-end-time").timepicker("getTime")) {
          $("#recurrent-event-row").show();
          if ($("#recurrent-event-type-selector").val() != "none") {
            $("#recurrent-event-end-date-row").show();
            if (!moreDaysRepeatStatus.correct) {
              displayErrorEndRepeat();
            } else if (
              $("#recurrent-event-end-date").val() &&
              $("#recurrent-event-type-selector").val() == "custom"
            ) {
              showRecurrentEventOptions();
            }
          }else{
            showCreateEventButton();
          }
        } else {
          $("#recurrent-event-row").hide();
        }

      }
    });

  $("#all-day-event-date")
    .datepicker({
      changeMonth: true,
      changeYear: true,
      defaultDate: new Date(),
      gotoCurrent: true,
      hideIfNoPrevNext: true,
      minDate: new Date(),
    })
    .on("change", function ($input) {
      if ($input.target.value == "") {
        $("#recurrent-event-row").hide();
        $("#recurrent-event-end-date-row").hide();
        $("#recurrent-event-content").hide();
        $("#error-message-end-repeat").hide();
        hideCreateEventButton();
      } else {
        $("#recurrent-event-row").show();
        let eventEndDate = document.getElementById("recurrent-event-end-date");
        if ($("#recurrent-event-type-selector").val() != "none") {
          $("#recurrent-event-end-date-row").show();
        }else{
          showCreateEventButton();
        }
        if (eventEndDate.value && allDayRepeatStatus.type != "none") {
          if (
            new Date($input.target.value) >
            $("#recurrent-event-end-date").datepicker("getDate")
          ) {
            displayErrorEndRepeat();
            allDayRepeatStatus.correct = false;
          } else {
            removeErrorEndRepeat(
              $("#all-day-event-date").datepicker("getDate")
            );
            allDayRepeatStatus.minDateCurrent = $(
              "#all-day-event-date"
            ).datepicker("getDate");
            allDayRepeatStatus.correct = true;
          }
        } else {
          $("#recurrent-event-end-date").datepicker(
            "option",
            "minDate",
            $input.target.value
          );
          allDayRepeatStatus.minDateCurrent = $input.target.value;
          allDayRepeatStatus.correct = true;
        }

        
      }
    });

  $("#all-day-event-checkbox").on("change", function () {
    if (this.checked) {
      allDayRepeatStatus.active = true;
      moreDaysRepeatStatus.active = false;
      showAllDayEventOptions();
    } else {
      allDayRepeatStatus.active = false;
      moreDaysRepeatStatus.active = true;
      hideAllDayEventOptions();
    }
  });

  $("#recurrent-event-type-selector").on("change", function () {
    var val = $("#recurrent-event-type-selector option:selected").val();
    if (allDayRepeatStatus.active) {
      allDayRepeatStatus.type = val;
    } else {
      moreDaysRepeatStatus.type = val;
    }
    if (val == "none") {
      hideRecurrentEventEndDetails();
      showCreateEventButton();
    } else {
      hideCreateEventButton();
      showRecurrentEventEndDetails();
      
    }
  });

  $("#recurrent-event-end-date")
    .datepicker({
      changeMonth: true,
      changeYear: true,
      defaultDate: new Date(),
      gotoCurrent: true,
      hideIfNoPrevNext: true,
      minDate: new Date(),
    })
    .on("change", function ($input) {
      let current;
      if (allDayRepeatStatus.active) {
        allDayRepeatStatus.endDate = $input.target.value;
        current = $("#all-day-event-date").datepicker("getDate");
      } else {
        moreDaysRepeatStatus.endDate = $input.target.value;
        current = $("#event-end-date").datepicker("getDate");
      }
      if ($input.target.value == "") {
        hideRecurrentDetails();
      } else {
        if (new Date($input.target.value) < current) {
          displayErrorEndRepeat();
          hideRecurrentDetails();
          if (allDayRepeatStatus.active) {
            allDayRepeatStatus.correct = false;
          } else {
            moreDaysRepeatStatus.correct = false;
          }
        } else {
          removeErrorEndRepeat(current);
          if (allDayRepeatStatus.active) {
            allDayRepeatStatus.correct = true;
            allDayRepeatStatus.minDateCurrent = current;
          } else {
            moreDaysRepeatStatus.correct = true;

            moreDaysRepeatStatus.minDateCurrent = current;
          }
        }
        if ($("#recurrent-event-type-selector").val() == "custom") {
          showRecurrentEventOptions();
        } else {
          showCreateEventButton();
        }
      }
    });

  $("#recurrent-event-time-selector").on("change", function () {
    var val = $("#recurrent-event-time-selector option:selected").val();
    hideRecurrentEventDetails();
    if (allDayRepeatStatus.active) {
      allDayRepeatStatus.setNewFreqType(val);
    } else {
      moreDaysRepeatStatus.setNewFreqType(val);
    }
    if (
      $(
        "#" + $("#recurrent-event-time-selector").val() + "-recurrent-freq"
      ).val()
    ) {
      if ($("#recurrent-event-time-selector").val() == "daily") {
        showCreateEventButton();
      } else {
        if (
          $(
            "#" +
              $("#recurrent-event-time-selector").val() +
              "-recurrent-details [class$='-checkbox']:checked"
          ).length > 0
        ) {
          showCreateEventButton();
        } else {
          hideCreateEventButton();
        }
      }
    } else {
      hideCreateEventButton();
    }
    if (val == "daily") {
      $("#daily-recurrent-details").show();
      if ($("#daily-recurrent-freq").val()) {
        showCreateEventButton();
      } else {
      }
    } else if (val == "weekly") {
      $("#weekly-recurrent-details").show();
    } else if (val == "monthly") {
      $("#monthly-recurrent-details").show();
    } else if (val == "yearly") {
      $("#yearly-recurrent-details").show();
    }
  });

  $('[id$="-recurrent-freq"]').on("change", function ($input) {
    let frequencyRepeat = document.getElementById(
      $("#recurrent-event-time-selector").val() + "-recurrent-freq"
    );
    if ($input.target.value == "") {
      frequencyRepeat.classList.add("display-error");
    }
    $("error-message-frequency").hide();
  });

  $("#daily-recurrent-freq").on("input", function ($input) {
    let val = $input.target.value;
    let newVal = val;

    if (val.length > 0) {
      if (!/^([1-9]|([1-2]?[0-9]{2})|(3(([0-5]\d)|6[0-5])))$/.test(val)) {
        showErrorFrequency($("#daily-freq-error"));
        newVal = "";
      } else {
        hideErrorFrequency($("#daily-freq-error"));
        newVal = val;
      }
    }

    if (allDayRepeatStatus.active) {
      allDayRepeatStatus.frequency = newVal;
    } else {
      moreDaysRepeatStatus.frequency = newVal;
    }
  });

  $("#weekly-recurrent-freq").on("input", function ($input) {
    let val = $input.target.value;
    let newVal = val;

    if (val.length > 0) {
      if (!/^([1-9]|[1-4]\d|5[0-3])$/.test(val)) {
        showErrorFrequency($("#weekly-freq-error"));
        newVal = "";
      } else {
        hideErrorFrequency($("#weekly-freq-error"));
        newVal = val;
      }
    }
    if (allDayRepeatStatus.active) {
      allDayRepeatStatus.frequency = newVal;
    } else {
      moreDaysRepeatStatus.frequency = newVal;
    }
  });

  $("#monthly-recurrent-freq").on("input", function ($input) {
    let val = $input.target.value;
    let newVal = val;

    if (val.length > 0) {
      if (!/^([1-9]|1[0-2])$/.test(val)) {
        showErrorFrequency($("#monthly-freq-error"));
        newVal = "";
      } else {
        hideErrorFrequency($("#monthly-freq-error"));
        newVal = val;
      }
    }
    if (allDayRepeatStatus.active) {
      allDayRepeatStatus.frequency = newVal;
    } else {
      moreDaysRepeatStatus.frequency = newVal;
    }
  });

  $("#yearly-recurrent-freq").on("input", function ($input) {
    let val = $input.target.value;
    let newVal = val;

    if (val.length > 0) {
      if (!/^([1-9]|\d{2})$/.test(val)) {
        showErrorFrequency($("#yearly-freq-error"));
        newVal = "";
      } else {
        hideErrorFrequency($("#yearly-freq-error"));
        newVal = val;
      }
    }
    if (allDayRepeatStatus.active) {
      allDayRepeatStatus.frequency = newVal;
    } else {
      moreDaysRepeatStatus.frequency = newVal;
    }
  });



  $("[class$='-checkbox']").on("click", function () {
    let val = this.id;

    if ($("#" + $("#recurrent-event-time-selector").val() + "-recurrent-freq")[0].className == ""){
      if (
        $(
          "#" +
            $("#recurrent-event-time-selector").val() +
            "-recurrent-details [class$='-checkbox']:checked"
        ).length == 0
      ) {
        hideCreateEventButton();
      } else if (
        $(
          "#" + $("#recurrent-event-time-selector").val() + "-recurrent-freq"
        ).val()
      ) {
        showCreateEventButton();
      }      
    }

    if (this.checked) {
      if (allDayRepeatStatus.active) {
        allDayRepeatStatus.addSelected(val);
      } else {
        moreDaysRepeatStatus.addSelected(val);
      }
    } else {
      if (allDayRepeatStatus.active) {
        allDayRepeatStatus.removeSelected(val);
      } else {
        moreDaysRepeatStatus.removeSelected(val);
      }
    }
  });


  $("#event-name").focus();
});

// Functions to reset recurrent event interface
function showErrorFrequency(errorDiv) {
  let frequencyRepeat = document.getElementById(
    $("#recurrent-event-time-selector").val() + "-recurrent-freq"
  );
  frequencyRepeat.classList.add("display-error");
  errorDiv.show();
  hideCreateEventButton();
}
function hideErrorFrequency(errorDiv) {
  let frequencyRepeat = document.getElementById(
    $("#recurrent-event-time-selector").val() + "-recurrent-freq"
  );
  frequencyRepeat.classList.remove("display-error");
  errorDiv.hide();
      if ($("#recurrent-event-time-selector").val() == "daily") {
        showCreateEventButton();
      } else {
        if (
          $(
            "#" +
              $("#recurrent-event-time-selector").val() +
              "-recurrent-details [class$='-checkbox']:checked"
          ).length > 0
        ) {
          showCreateEventButton();
        }
      }
}
function hideRecurrentEventDetails() {
  $("#daily-recurrent-details").hide();
  $("#weekly-recurrent-details").hide();
  $("#monthly-recurrent-details").hide();
  $("#yearly-recurrent-details").hide();
}
function hideRecurrentEventOptions() {
  $("#recurrent-event-details-line").hide();
  $("#recurrent-event-details").hide();
  hideCreateEventButton();
}
function showRecurrentEventOptions() {
  $("#recurrent-event-content").show();
  $("#recurrent-event-details").show();

  $("[id$='-recurrent-details']").hide();
  $(
    "#" + $("#recurrent-event-time-selector").val() + "-recurrent-details"
  ).show();
  if (
    $("#" + $("#recurrent-event-time-selector").val() + "-recurrent-freq").val()
  ) {
    if ($("#recurrent-event-time-selector").val() == "daily") {
      showCreateEventButton();
    } else {
      if (
        $(
          "#" +
            $("#recurrent-event-time-selector").val() +
            "-recurrent-details [class$='-checkbox']:checked"
        ).length > 0
      ) {
        showCreateEventButton();
      }
    }
  }
  $("[id$='-recurrent-freq']").each((e) => {
    if ($("[id$='-recurrent-freq']")[e].value == "") {
      $("[id$='-recurrent-freq']")[e].className = "display-error";
    } else {
      $("[id$='-recurrent-freq']")[e].className = "";
    }
  });

  $("#recurrent-event-details-line").show();
}
function resetAllRecurrentEventDetails() {
  $("#recurrent-event-time-selector").val("daily");
  $(".weekday-checkbox").prop("checked", false);
  $(".day-checkbox").prop("checked", false);
  $(".month-checkbox").prop("checked", false);
  $('[id$="-recurrent-freq"]').val(1);
  $('[id$="-recurrent-freq"]').removeClass("display-error");
  $(".error-message-frequency").hide();
}
function showAllDayEventOptions() {
  resetAllRecurrentEventDetails();
  hideRecurrentDetails();
  removeErrorEndRepeat(allDayRepeatStatus.minDateCurrent);
  $("#start-time-row").hide();
  $("#end-time-row").hide();
  $("#all-day-event-row").show();
  $("#error-message").hide();
  $("#recurrent-event-row").hide();
  $("#recurrent-event-end-date-row").hide();
  $("#recurrent-event-content").hide();
  hideCreateEventButton();
  $('[id$="-recurrent-freq"]').val(1);
  moreDaysRepeatStatus.setNewFreqType(allDayRepeatStatus.frequencyType);
  $("#recurrent-event-end-date").datepicker(
    "option",
    "minDate",
    allDayRepeatStatus.minDateCurrent
  );

  $("#recurrent-event-type-selector").val(allDayRepeatStatus.type);
  $("#recurrent-event-end-date").val(allDayRepeatStatus.endDate);

  $("#recurrent-event-time-selector").val(allDayRepeatStatus.frequencyType);
  $("#" + allDayRepeatStatus.frequencyType + "-recurrent-freq").val(
    allDayRepeatStatus.frequency
  );
  allDayRepeatStatus.selected.forEach((e) => {
    $("#" + e).prop("checked", true);
  });
  allDayRepeatStatus.previousFrequencyType.forEach((e) => {
    $("#" + e.name + "-recurrent-freq").val(e.freq);
  });

  if ($("#all-day-event-date").val()) {
    $("#recurrent-event-row").show();
    if ($("#recurrent-event-type-selector").val() != "none") {
      $("#recurrent-event-end-date-row").show();

      if (
        $("#recurrent-event-end-date").val() &&
        $("#recurrent-event-type-selector").val() == "custom"
      ) {
        showRecurrentEventOptions();
      }
      if (!allDayRepeatStatus.correct) {
        displayErrorEndRepeat();
      }
    }
  }
}
function hideAllDayEventOptions() {
  resetAllRecurrentEventDetails();
  hideRecurrentDetails();
  removeErrorEndRepeat(moreDaysRepeatStatus.minDateCurrent);
    hideCreateEventButton();
  $("#all-day-event-row").hide();
  $("#start-time-row").show();
  $("#recurrent-event-row").hide();
  $("#recurrent-event-end-date-row").hide();
  $("#recurrent-event-content").hide();

  allDayRepeatStatus.setNewFreqType(allDayRepeatStatus.frequencyType);
  $("#recurrent-event-end-date").datepicker(
    "option",
    "minDate",
    moreDaysRepeatStatus.minDateCurrent
  );
  $("#recurrent-event-type-selector").val(moreDaysRepeatStatus.type);
  $("#recurrent-event-end-date").val(moreDaysRepeatStatus.endDate);
  $("#recurrent-event-time-selector").val(moreDaysRepeatStatus.frequencyType);
  $("#" + moreDaysRepeatStatus.frequencyType + "-recurrent-freq").val(
    moreDaysRepeatStatus.frequency
  );
  moreDaysRepeatStatus.selected.forEach((e) =>
    $("#" + e).prop("checked", true)
  );
  moreDaysRepeatStatus.previousFrequencyType.forEach((e) => {
    $("#" + e.name + "-recurrent-freq").val(e.freq);
  });
  if ($("#event-start-date").val()) {
    $("#event-start-time").show();
    if ($("#event-start-time").val()) {
      $("#end-time-row").show();
      $("#event-end-time").hide();
      if (correctFinalDateTime && $("#event-end-date").val()) {
        if ($("#event-end-time").val()) {
          $("#event-end-time").show();
          $("#recurrent-event-row").show();
          if ($("#recurrent-event-type-selector").val() != "none") {
            $("#recurrent-event-end-date-row").show();
            if (!moreDaysRepeatStatus.correct) {
              displayErrorEndRepeat();
            } else if (
              $("#recurrent-event-end-date").val() &&
              $("#recurrent-event-type-selector").val() == "custom"
            ) {
              showRecurrentEventOptions();
            }
          }
        } else {
          $("#recurrent-event-row").hide();
        }
      }

      if (!correctFinalDateTime) {
        $("#error-message").show();
        if (document.getElementById("event-end-time").classList.length < 2)
          $("#event-end-time").show();
      }
    }
  }
}
function showRecurrentEventEndDetails() {
  $("#recurrent-event-end-date-row").show();

  if ($("#recurrent-event-type-selector").val() == "custom") {
    if ($("#recurrent-event-end-date").val()) {
      showRecurrentEventOptions();
    }
  } else {
    $("#recurrent-event-content").hide();
  }
}
function hideRecurrentEventEndDetails() {
  $("#recurrent-event-end-date-row").hide();
  $("#recurrent-event-content").hide();
}

function hideRecurrentDetails() {
  hideRecurrentEventOptions();
  hideRecurrentEventDetails();
  hideCreateEventButton();
}
function displayError() {
  let eventEndDate = document.getElementById("event-end-date");
  let eventEndTime = document.getElementById("event-end-time");
  $("#error-message").show();
  $("#error-input-date-end").show();
  eventEndDate.classList.add("display-error");
  eventEndTime.classList.add("display-error");
  $("#event-end-time").hide();
  $("#recurrent-event-row").hide();
  correctFinalDateTime = false;
  $("#recurrent-event-content").hide();
  $("#recurrent-event-end-date-row").hide();
  $("#error-message-end-repeat").hide();
  hideCreateEventButton();
}

function removeError() {
  let eventEndDate = document.getElementById("event-end-date");
  let eventEndTime = document.getElementById("event-end-time");
  $("#event-end-date").datepicker(
    "option",
    "minDate",
    $("#event-start-date").datepicker("getDate")
  );
  $("#error-input-date-end").hide();
  eventEndTime.classList.remove("display-error");
  eventEndDate.classList.remove("display-error");
  $("#event-end-time").show();
  correctFinalDateTime = true;
}

function displayErrorEndRepeat() {
  let eventEndDate = document.getElementById("recurrent-event-end-date");
  $("#error-message-end-repeat").show();

  eventEndDate.classList.add("display-error");
  $("#recurrent-event-content").hide();
  hideCreateEventButton();
}

function removeErrorEndRepeat(newMin) {
  let eventEndDate = document.getElementById("recurrent-event-end-date");
  $("#recurrent-event-end-date").datepicker("option", "minDate", newMin);
  $("#error-message-end-repeat").hide();
  eventEndDate.classList.remove("display-error");
  $("#event-end-time").show();
  if ($("#recurrent-event-type-selector").val() == "custom") {
    showRecurrentEventOptions();
  }
}

function hideEmptyStart() {
  $("#event-start-date").hide();
  $("#end-time-row").hide();
  $("#error-message").hide();
  $("#recurrent-event-row").hide();
}
// hacky way to get the button to accommodate size of hidden divs in Safari
function hideCreateEventButton() {
  $("#create-event-button").hide();
}
function showCreateEventButton() {
  $("#create-event-button").show();
}

function RepeatEvent(active) {
  this.type = "none";
  this.active = active;
  this.endDate = "";
  this.frequencyType = "daily";
  this.frequency = 1;
  this.previousFrequencyType = [{ name: "daily", freq: 1 }];
  this.selected = [];
  this.minDateCurrent = new Date();
  this.correct = true;

  this.removeSelected = function (itemToRemove) {
    this.selected = this.selected.filter((e) => e !== itemToRemove);
    this.selected.sort();
  };

  this.addSelected = function (itemNew) {
    this.selected.push(itemNew);
    this.selected.sort();
  };


  this.setNewFreqType = function (newType) {
    let done = false;

    this.previousFrequencyType.forEach((e) => {
      if (e.name == this.frequencyType) {
        e.freq = this.frequency;
        done = true;
      }
    });
    if (!done) {
      this.previousFrequencyType.push({
        name: this.frequencyType,
        freq: this.frequency,
      });
    }

    this.previousFrequencyType.forEach((e) => {
      if (e.name == newType) {
        this.frequency = e.freq;
        done = true;
      }
    });
    if (!done) {
      this.frequency = 1;
    }
    this.frequencyType = newType;

  };
}
