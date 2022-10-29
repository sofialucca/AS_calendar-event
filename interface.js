let correctFinalDateTime = true;
let wasEmpty = true;
let allDayRepeatStatus = new RepeatEvent(false);
let moreDaysRepeatStatus = new RepeatEvent(true);

$(function () {
  $(function () {
    $("#event-name").focus();
    $(".hidden-beginning").hide();
    $("#new-event-text").hide();
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
      $(this).focus();
    }
  });

  $("#event-start-date").datepicker({
    changeMonth: true,
    changeYear: true,
    defaultDate: new Date(),
    gotoCurrent: true,
    hideIfNoPrevNext: true,
    minDate: new Date(),
    value: new Date(),
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
      $(this).focus();
    } else {
      $("#event-start-time").show();

      let eventEndDate = document.getElementById("event-end-date");

      if (eventEndDate.value) {
        $("#end-time-row").show();
        if (
          new Date($input.target.value) >
          $("#event-end-date").datepicker("getDate")
        ) {
          displayError("#event-start-date", "#event-end-date");
          $("#end-time-row").show();
          $("#event-end-time").hide();
        } else if (
          new Date($input.target.value) <
          $("#event-end-date").datepicker("getDate")
        ) {
          removeError("#event-start-date");
          $("#event-end-time").timepicker("option", "minTime", "12:00 AM");
          if ($("#event-end-time").timepicker("getTime")) {
            $("#recurrent-event-row").show();

            if ($("#form-recurrent-event-type :checked").val() != "none") {
              $("#recurrent-event-end-date-row").show();
              if (moreDaysRepeatStatus.neverEvendRepeat) {
                $(".recurrent-event-end-date-container").hide();
                if (
                  $("#form-recurrent-event-type :checked").val() == "custom"
                ) {
                  showRecurrentEventOptions();
                } else {
                  showCreateEventButton();
                }
              } else {
                $(".recurrent-event-end-date-container").show();
                if (!moreDaysRepeatStatus.correct) {
                  displayErrorEndRepeat();
                } else if ($("#recurrent-event-end-date").val()) {
                  if (
                    $("#form-recurrent-event-type :checked").val() == "custom"
                  ) {
                    showRecurrentEventOptions();
                  } else {
                    showCreateEventButton();
                  }
                }
              }
            } else {
              showCreateEventButton();
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
              displayError("#event-start-date", "event-end-time");
              $("#event-end-time").show();
              $("#recurrent-event-row").hide();
              $("#recurrent-event-end-date-row").hide();
              $("#recurrent-event-content").hide();
              hideCreateEventButton();
            } else {
              removeError("#event-start-date");
              $("#recurrent-event-row").show();
              if ($("#form-recurrent-event-type :checked").val() != "none") {
                if ($("#never-end-repeat-checkbox")[0].checked) {
                  $(".recurrent-event-end-date-container").hide();
                  if (
                    $("#form-recurrent-event-type :checked").val() == "custom"
                  ) {
                    showRecurrentEventOptions();
                  } else {
                    showCreateEventButton();
                  }
                } else {
                  $(".recurrent-event-end-date-container").show();
                  if (!moreDaysRepeatStatus.correct) {
                    displayErrorEndRepeat();
                  } else if ($("#recurrent-event-end-date").val()) {
                    if (
                      $("#form-recurrent-event-type :checked").val() == "custom"
                    ) {
                      showRecurrentEventOptions();
                    } else {
                      showCreateEventButton();
                    }
                  }
                }
              } else {
                showCreateEventButton();
              }
            }
          } else {
            removeError("#event-start-date");
            $("#event-end-time").timepicker("option", "minTime", "12:00 AM");
            $("#event-end-time").show();
            $("#recurrent-event-row").hide();
          }
        }
      } else {
        if ($("#event-start-time").val()) {
          $("#end-time-row").show();

          $("#event-end-time").hide();
          $("#event-end-date").show();
        }
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
        $(this).focus();
      } else {
        $("#end-time-row").show();

        if (!$("#event-end-date").val()) {
          $("#event-end-time").hide();
        } else if ($("#event-start-date").val() == $("#event-end-date").val()) {
          $("#event-end-time").timepicker(
            "option",
            "minTime",
            $input.target.value
          );
          $("#event-end-time").show();
          if ($("#event-end-time").val()) {
            $("#event-end-time").show();
            if (
              $("#event-end-time").timepicker("getTime") <
              $("#event-start-time").timepicker("getTime")
            ) {
              displayError("#event-start-time", "event-end-time");
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
                removeError("#event-start-time");
              }
              $("#recurrent-event-row").show();
              if ($("#form-recurrent-event-type :checked").val() != "none") {
                $("#recurrent-event-end-date-row").show();
                if (moreDaysRepeatStatus.neverEvendRepeat) {
                  $(".recurrent-event-end-date-container").hide();
                  if (
                    $("#form-recurrent-event-type :checked").val() == "custom"
                  ) {
                    showRecurrentEventOptions();
                  } else {
                    showCreateEventButton();
                  }
                } else {
                  $(".recurrent-event-end-date-container").show();
                  if (!moreDaysRepeatStatus.correct) {
                    displayErrorEndRepeat();
                  } else if (
                    $("#recurrent-event-end-date").val() &&
                    $("#form-recurrent-event-type :checked").val() == "custom"
                  ) {
                    showRecurrentEventOptions();
                  } else if ($("#recurrent-event-end-date").val()) {
                    showCreateEventButton();
                  }
                }
              } else {
                showCreateEventButton();
              }
            }
          } else {
            $("#event-end-time").show();
          }
        } else if ($("#event-start-date").val() < $("#event-end-date").val()) {
          $("#event-end-time").show();
          if ($("#event-end-time").val()) {
            $("#recurrent-event-row").show();
            if ($("#form-recurrent-event-type :checked").val() != "none") {
              $("#recurrent-event-end-date-row").show();
              if (moreDaysRepeatStatus.neverEvendRepeat) {
                $(".recurrent-event-end-date-container").hide();
                if (
                  $("#form-recurrent-event-type :checked").val() == "custom"
                ) {
                  showRecurrentEventOptions();
                } else {
                  showCreateEventButton();
                }
              } else {
                $(".recurrent-event-end-date-container").show();
                if (!moreDaysRepeatStatus.correct) {
                  displayErrorEndRepeat();
                } else if (
                  $("#recurrent-event-end-date").val() &&
                  $("#form-recurrent-event-type :checked").val() == "custom"
                ) {
                  showRecurrentEventOptions();
                } else if ($("#recurrent-event-end-date").val()) {
                  showCreateEventButton();
                }
              }
            } else {
              showCreateEventButton();
            }
          } else {
            $("#event-end-time").show();
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
        $(this).focus();
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
            displayError("#event-end-date", "event-end-time");
            $("#event-end-time").show();
            $("#recurrent-event-row").hide();
            $("#recurrent-event-end-date-row").hide();
            $("#recurrent-event-content").hide();
            hideCreateEventButton();
          } else {
            removeError("#event-end-date");
            if ($("#event-end-time").timepicker("getTime")) {
              $("#recurrent-event-row").show();
              if ($("#form-recurrent-event-type :checked").val() != "none") {
                $("#recurrent-event-end-date-row").show();
                if (moreDaysRepeatStatus.neverEvendRepeat) {
                  $(".recurrent-event-end-date-container").hide();
                  if (
                    $("#form-recurrent-event-type :checked").val() == "custom"
                  ) {
                    showRecurrentEventOptions();
                  } else {
                    showCreateEventButton();
                  }
                } else {
                  $(".recurrent-event-end-date-container").show();
                  if (!moreDaysRepeatStatus.correct) {
                    displayErrorEndRepeat();
                  } else if (
                    $("#recurrent-event-end-date").val() &&
                    $("#form-recurrent-event-type :checked").val() == "custom"
                  ) {
                    showRecurrentEventOptions();
                  } else if ($("#recurrent-event-end-date").val()) {
                    showCreateEventButton();
                  }
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
          removeError("#event-end-date");
          $("#event-end-time").timepicker("option", "minTime", "12:00 AM");
          if ($("#event-end-time").timepicker("getTime")) {
            $("#recurrent-event-row").show();
            if ($("#form-recurrent-event-type :checked").val() != "none") {
              $("#recurrent-event-end-date-row").show();
              if (!moreDaysRepeatStatus.correct) {
                displayErrorEndRepeat();
              } else if (
                $("#recurrent-event-end-date").val() &&
                $("#form-recurrent-event-type :checked").val() == "custom"
              ) {
                showRecurrentEventOptions();
              } else if ($("#recurrent-event-end-date").val()) {
                showCreateEventButton();
              }
            }
          } else {
            $("#recurrent-event-row").hide();
          }
        }
          let eventEndDate = document.getElementById(
            "recurrent-event-end-date"
          )
        //check end repeat
        if (!moreDaysRepeatStatus.neverEvendRepeat) {
;
          if (moreDaysRepeatStatus.type != "none") {
            if (eventEndDate.value) {
              if (
                new Date($input.target.value) >
                $("#recurrent-event-end-date").datepicker("getDate")
              ) {
                displayErrorEndRepeat("#event-end-date");
                moreDaysRepeatStatus.correct = false;
              } else {
                removeErrorEndRepeat(
                  $("#event-end-date").datepicker("getDate"),
                  "#event-end-date"
                );
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
        }
        if (!eventEndDate.value) {
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
        removeError("#event-start-time");
        $("#recurrent-event-row").hide();
        $("#recurrent-event-content").hide();
        $("#recurrent-event-end-date-row").hide();
        hideCreateEventButton();
        $(this).focus();
      } else if (
        $("#event-start-date").val() == $("#event-end-date").val() &&
        $("#event-end-time").timepicker("getTime") <
          $("#event-start-time").timepicker("getTime")
      ) {
        
        displayError("#event-end-time","event-start-time");
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
          removeError("#event-start-time");
        }
        if ($("#event-end-time").timepicker("getTime")) {
          $("#recurrent-event-row").show();
          if ($("#form-recurrent-event-type :checked").val() != "none") {
            $("#recurrent-event-end-date-row").show();
            if ($("#never-end-repeat")[0].checked) {
              $(".recurrent-event-end-date-container").hide();
              if ($("#form-recurrent-event-type :checked").val() == "custom") {
                showRecurrentEventOptions();
              } else {
                showCreateEventButton();
              }
            } else {
              $(".recurrent-event-end-date-container").show();
              if (eventEndDate.value && allDayRepeatStatus.type != "none") {
                if (
                  new Date($input.target.value) >
                  $("#recurrent-event-end-date").datepicker("getDate")
                ) {
                  displayErrorEndRepeat("#all-day-event-date");
                  allDayRepeatStatus.correct = false;
                } else {
                  removeErrorEndRepeat(
                    $("#all-day-event-date").datepicker("getDate"),
                    "#all-day-event-date"
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
                if (eventEndDate) {
                  if (allDayRepeatStatus.type == "custom") {
                    showRecurrentEventOptions();
                  } else {
                    showCreateEventButton();
                  }
                }
              }
            }
          } else {
            $("#recurrent-event-end-date-row").hide();
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
        if ($("#form-recurrent-event-type :checked").val() != "none") {
          $("#recurrent-event-end-date-row").show();
        } else {
          $("#recurrent-event-end-date-row").hide();
          showCreateEventButton();
        }

        if (eventEndDate.value && allDayRepeatStatus.type != "none") {
          if (
            new Date($input.target.value) >
            $("#recurrent-event-end-date").datepicker("getDate")
          ) {
            displayErrorEndRepeat("#all-day-event-date");
            allDayRepeatStatus.correct = false;
          } else {
            removeErrorEndRepeat(
              $("#all-day-event-date").datepicker("getDate"),
              "#all-day-event-date"
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
      showAllDayEventOptions(true);
    } else {
      allDayRepeatStatus.active = false;
      moreDaysRepeatStatus.active = true;
      hideAllDayEventOptions(true);
    }
  });
  $("#never-end-repeat-checkbox").on("change", function () {
    if (this.checked) {
      let correct;
      if (allDayRepeatStatus.active) {
        allDayRepeatStatus.neverEvendRepeat = true;
        correct = allDayRepeatStatus.correct;
      } else {
        moreDaysRepeatStatus.neverEvendRepeat = true;
        correct = moreDaysRepeatStatus.correct;
      }
      $(".recurrent-event-end-date-container").hide();
      if (!correct) {
        $("#error-message-end-repeat").hide();
      }
      if ($("#form-recurrent-event-type :checked").val() != "custom") {
        showCreateEventButton();
      } else {
        showRecurrentEventOptions();
      }
    } else {
      hideCreateEventButton();
      hideRecurrentEventOptions();
      hideRecurrentDetails();
      let correct;
      if (allDayRepeatStatus.active) {
        allDayRepeatStatus.neverEvendRepeat = false;
        correct = allDayRepeatStatus.correct;
      } else {
        moreDaysRepeatStatus.neverEvendRepeat = false;
        correct = moreDaysRepeatStatus.correct;
      }
      $(".recurrent-event-end-date-container").show();
      if (!correct) {
        $("#error-message-end-repeat").show();
      } else {
        if ($("#recurrent-event-end-date").val()) {
          if ($("#form-recurrent-event-type :checked").val() != "custom") {
            showCreateEventButton();
          } else {
            showRecurrentEventOptions();
          }
        }
      }
    }
  });
  $("#form-recurrent-event-type").on("change", function () {
    var val = $("#form-recurrent-event-type :checked").val();
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
        /*if (new Date($input.target.value) < current) {
          //displayErrorEndRepeat("#recurrent-event-end-date",nameCurrent);
          hideRecurrentDetails();
          if (allDayRepeatStatus.active) {
            allDayRepeatStatus.correct = false;
          } else {
            moreDaysRepeatStatus.correct = false;
          }
        } else {*/

        if (new Date($input.target.value) >= current) {
          removeErrorEndRepeat(current, "#recurrent-event-end-date");
          if (allDayRepeatStatus.active) {
            allDayRepeatStatus.correct = true;
            allDayRepeatStatus.minDateCurrent = current;
          } else {
            moreDaysRepeatStatus.correct = true;

            moreDaysRepeatStatus.minDateCurrent = current;
          }
          if ($("#form-recurrent-event-type :checked").val() == "custom") {
            showRecurrentEventOptions();
          } else {
            showCreateEventButton();
          }
        }
      }
    });

  $("#recurrent-event-time-selector").on("change", function () {
    let val = $("#recurrent-event-time-selector").val();
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
      $(
        "#" + $("#recurrent-event-time-selector").val() + "-recurrent-freq"
      ).trigger("log", [
        "error-display",
        {
          typeError: "frequency-value",
          typeValue: "",
        },
      ]);
    }
    $("error-message-frequency").hide();
  });

  $("#daily-recurrent-freq").on("input", function ($input) {
    let val = $input.target.value;
    let newVal = val;

    if (val.length > 0) {
      if (!/^([1-9]|([1-2]?[0-9]{2})|(3(([0-5]\d)|6[0-5])))$/.test(val)) {
        displayErrorFrequency($("#daily-freq-error"));
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
        displayErrorFrequency($("#weekly-freq-error"));
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
        displayErrorFrequency($("#monthly-freq-error"));
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
        displayErrorFrequency($("#yearly-freq-error"));
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

    if (
      $("#" + $("#recurrent-event-time-selector").val() + "-recurrent-freq")[0]
        .className == ""
    ) {
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
function displayErrorFrequency(errorDiv) {
  let frequencyRepeat = document.getElementById(
    $("#recurrent-event-time-selector").val() + "-recurrent-freq"
  );
  frequencyRepeat.classList.add("display-error");
  errorDiv.show();
  hideCreateEventButton();
  $(
    "#" + $("#recurrent-event-time-selector").val() + "-recurrent-freq"
  ).trigger("log", [
    "error-display",
    {
      typeError: "frequency-value",
      typeValue: frequencyRepeat.textContent,
    },
  ]);
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
  $(
    "#" + $("#recurrent-event-time-selector").val() + "-recurrent-freq"
  ).trigger("log", [
    "error-removal",
    {
      typeError: "frequency-value",
    },
  ]);
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
  $("#form-recurrent-event-type :checked").prop("checked", false);
  $("#never-end-repeat-checkbox").prop(
    "checked",
    allDayRepeatStatus.neverEvendRepeat
  );
  $("#" + allDayRepeatStatus.type).prop("checked", true);

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
    if ($("#form-recurrent-event-type :checked").val() != "none") {
      $("#recurrent-event-end-date-row").show();
      if (allDayRepeatStatus.neverEvendRepeat) {
        $(".recurrent-event-end-date-container").hide();
        if ($("#form-recurrent-event-type :checked").val() == "custom") {
          showRecurrentEventOptions();
        } else {
          showCreateEventButton();
        }
      } else {
        $(".recurrent-event-end-date-container").show();
        if (!allDayRepeatStatus.correct) {
          displayErrorEndRepeat();
        } else if ($("#recurrent-event-end-date").val()) {
          if ($("#form-recurrent-event-type :checked").val() == "custom") {
            showRecurrentEventOptions();
          } else {
            showCreateEventButton();
          }
        }
      }
    } else {
      showCreateEventButton();
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
  $("#form-recurrent-event-type :checked").prop("checked", false);
  $("#never-end-repeat-checkbox").prop(
    "checked"
    //moreDaysRepeatStatus.neverEvendRepeat
  );
  $("#" + moreDaysRepeatStatus.type).prop("checked", true);
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
          if ($("#form-recurrent-event-type :checked").val() != "none") {
            if (moreDaysRepeatStatus.neverEvendRepeat) {
              $(".recurrent-event-end-date-container").hide();
              if ($("#form-recurrent-event-type :checked").val() == "custom") {
                showRecurrentEventOptions();
              } else {
                showCreateEventButton();
              }
            } else {
              $(".recurrent-event-end-date-container").show();
              if (!moreDaysRepeatStatus.correct) {
                displayErrorEndRepeat();
              } else if ($("#recurrent-event-end-date").val()) {
                if (
                  $("#form-recurrent-event-type :checked").val() == "custom"
                ) {
                  showRecurrentEventOptions();
                } else {
                  showCreateEventButton();
                }
              }
            }
          } else {
            showCreateEventButton();
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
  let currentState = allDayRepeatStatus.active
    ? allDayRepeatStatus
    : moreDaysRepeatStatus;
  if (currentState.neverEvendRepeat) {
    $(".recurrent-event-end-date-container").hide();
    if ($("#form-recurrent-event-type :checked").val() == "custom") {
      showRecurrentEventOptions();
    } else {
      showCreateEventButton();
    }
  } else {
    $(".recurrent-event-end-date-container").show();
/*      if ($("#recurrent-event-end-date").val() && currentState.correct) {
        if ($("#form-recurrent-event-type :checked").val() == "custom") {
          showRecurrentEventOptions();
        } else {
          showCreateEventButton();
        }
      }*/
    if (!currentState.correct) {
      displayErrorEndRepeat();
    } else if ($("#recurrent-event-end-date").val()) {
      if ($("#form-recurrent-event-type :checked").val() == "custom") {
        showRecurrentEventOptions();
      } else {
        showCreateEventButton();
      }
    }
  }

  if ($("#form-recurrent-event-type :checked").val() != "custom") {
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
function displayError(trigger, problemTrigger) {
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
  $(trigger).trigger("log", [
    "error-display",
    {
      problem: problemTrigger,
      typeError: "end-date-time",
    },
  ]);
}

function removeError(trigger) {
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
  $(trigger).trigger("log", [
    "error-removal",
    {
      typeError: "end-date-time",
    },
  ]);
}

function displayErrorEndRepeat(trigger) {
  let eventEndDate = document.getElementById("recurrent-event-end-date");
  $("#error-message-end-repeat").show();

  eventEndDate.classList.add("display-error");
  $("#recurrent-event-content").hide();
  hideCreateEventButton();
  if (trigger) {
    $(trigger).trigger("log", [
      "error-display",
      {
        problem: "recurrent-event-end-date",
        typeError: "end-recurrent-date",
      },
    ]);
  }
}

function removeErrorEndRepeat(newMin, trigger) {
  let eventEndDate = document.getElementById("recurrent-event-end-date");
  $("#recurrent-event-end-date").datepicker("option", "minDate", newMin);
  $("#error-message-end-repeat").hide();
  eventEndDate.classList.remove("display-error");
  $("#event-end-time").show();
  if ($("#form-recurrent-event-type :checked").val() == "custom") {
    showRecurrentEventOptions();
  } else {
    showCreateEventButton();
  }
  if (trigger) {
    $(trigger).trigger("log", [
      "error-removal",
      {
        typeError: "end-recurrent-date",
      },
    ]);
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
  this.neverEvendRepeat = false;

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
