//!===Date:09.10.2017===Copyright ©2017 JavaScript Code by Cătălin Anghel-Ursu @Madness2aMaze - All Rights Reserved=========!

/*MIT License

Copyright (c) 2017 - 2018 Cătălin Anghel-Ursu (https://github.com/Madness2aMaze/Pomodoro-Clock-App)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

$(document).ready(function() {
  var tOutAlarm = $("<audio></audio>"),      
      uiBreakIcon = $(".break-info"),
      uiWorkIcon = $(".work-info"),
      uiBrIcon = $(".break-icon"),
      uiStart = $(".inner-glow"),
      uiBrMinus = $("#br-minus"),
      uiTimer = $("#countdown"),
      uiDisplay = $("#display"),
      uiBrPlus = $("#br-plus"),
      uiResume = $("#resume"),
      uiBreak = $("#br-time"),
      uiPause = $("#pause"),
      uiMinus = $("#minus"),
      uiReset = $("#char"),
      uiPlus = $("#plus"),
      start = Date.now(),
      timeShift = true,
      brMinutes = "5",
      minutes = "25",
      breakTime = 0,
      workTime = 0,
      woTimeoutID,
      brTimeoutID,
      timeoutID,
      reload;

  uiTimer.html(minutes + ":" + "00");
  uiBreak.html(brMinutes);

  // Calling the lettering.js jQuery plug-in***
  uiReset.lettering();
  //----------------------------------------***
  // Start countdown timer on click
  uiDisplay.one("click", function() {
    uiStart.attr("title", "Pause Session");
    uiWorkIcon.css("color", "#7bff51");
    uiWorkIcon.css("text-shadow", "0px 0px 3px #73ce56");

    workTime = minutes * 60000;
    breakTime = brMinutes * 60000;

    var countDown = (function($) {
      var timeOut = 10000, // Length in ms
          timeGap = 1000, // Increment interval in ms
          currentTime = Date.now(),
          endTime = Date.now() + timeOut,
          uiResume = $("#resume").hide(),
          running = true;

      uiPause.click(function() {
        uiStart.attr("title", "Resume Session");
      });
      uiResume.click(function() {
        uiStart.attr("title", "Pause Session");
      });

      function workingTimer() {
        timeShift = true;
        window.clearTimeout(timeoutID);
        uiTimer.css("color", "#7bff51");
        uiTimer.css("text-shadow", "0px 0px 5px #73ce56");
        uiStart.addClass("session");
        uiStart.removeClass("break");
        uiBreakIcon.css("color", "");
        uiBreakIcon.css("text-shadow", "");
        uiWorkIcon.css("color", "#7bff51");
        uiWorkIcon.css("text-shadow", "0px 0px 3px #73ce56");
        uiTimer.html(minutes + ":" + "00");
        workTime = minutes * 60000;
        countDown.start(workTime);
      }

      function breakingTimer() {
        timeShift = false;
        window.clearTimeout(timeoutID);
        uiTimer.css("color", "#ff2323");
        uiTimer.css("text-shadow", "0px 0px 5px #ce5656");
        uiStart.removeClass("session");
        uiStart.addClass("break");
        uiWorkIcon.css("color", "");
        uiWorkIcon.css("text-shadow", "");
        uiBreakIcon.css("color", "#ff2323");
        uiBreakIcon.css("text-shadow", "0px 0px 3px #ce5656");
        uiTimer.html(brMinutes + ":" + "00");
        breakTime = brMinutes * 60000;
        countDown.start(breakTime);
      }

      function updateTimer() {
        // Run till timeout
        if (currentTime + timeGap < endTime) {
          timeoutID = window.setTimeout(updateTimer, timeGap);
        }
        // Countdown if running
        if (running) {
          currentTime += timeGap;
          if (currentTime >= endTime) {
            tOutAlarm.attr({
              src:
              "https://soundbible.com/mp3/Electronic_Chime-KevanGC-495939803.mp3",
              volume: 0.5,
              autoplay: "autoplay"
            });
            if (timeShift) {
              breakingTimer();
            } else {
              workingTimer();
            }
          }
        }

        // Update UI
        var timeOne = new Date();
        timeOne.setTime(endTime + timeGap - currentTime);
        var min = timeOne.getMinutes(),
            sec = timeOne.getSeconds();

        if (min < 1) {
          var timeTwo = new Date();
          timeTwo.setTime(endTime - currentTime);
          var min = timeTwo.getMinutes(),
              sec = timeTwo.getSeconds();
        }
        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;
        uiTimer.html(min + ":" + sec);
      }

      function pause() {
        running = false;
        uiPause.hide();
        uiResume.show();
        //uiTimer.addClass("blink");
        uiDisplay.addClass("blink");
        uiReset.addClass("glow");
        uiReset.removeClass("dimm");
      }

      function reset() {
        if (!running) {
          window.clearTimeout(timeoutID);
          workTime = minutes * 60000;
          breakTime = brMinutes * 60000;
          countDown.start(workTime);
          running = false;
        }
      }

      function resume() {
        running = true;
        uiPause.show();
        uiResume.hide();
        uiDisplay.removeClass("blink");
        uiReset.addClass("dimm");
        uiReset.removeClass("glow");
        if (!running) {
          countDown.start(workTime);
        }
      }

      function start(timeout) {
        running = true;
        timeOut = timeout;
        currentTime = Date.now();
        endTime = Date.now() + timeOut;
        updateTimer();
        if (!running) {
          countDown.start(workTime);
        }
      }

      return {
        pause: pause,
        reset: reset,
        resume: resume,
        start: start
      };
    })(jQuery);

    // Pause timer
    uiPause.click(countDown.pause);
    // Reset timer
    uiReset.click(countDown.reset);
    // Resume timer
    uiResume.click(countDown.resume);
    // Interval in ms
    countDown.start(workTime);
    reload = countDown;
  });

  // Decrease work length
  uiMinus.click(function() {
    if (minutes < 2) {
      uiTimer.addClass("shake-anim");
    } else {
      uiTimer.removeClass("shake-anim");
      window.clearTimeout(timeoutID);
      minutes--;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      uiTimer.html(minutes + ":" + "00");
      workTime = minutes * 60000;
      if (reload !== undefined) {
        reload.start(workTime);
        reload.pause(workTime);
      }
    }
  });

  // Increase work length
  uiPlus.click(function() {
    if (minutes > 49) {
      uiTimer.addClass("shake-anim");
    } else {
      uiTimer.removeClass("shake-anim");
      window.clearTimeout(timeoutID);
      minutes++;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      uiTimer.html(minutes + ":" + "00");
      workTime = minutes * 60000;
      if (reload !== undefined) {
        reload.start(workTime);
        reload.pause(workTime);
      }
    }
  });

  // Decrease break length
  uiBrMinus.click(function() {
    if (brMinutes < 2) {
      uiBreak.addClass("shake-anim");
      uiBrIcon.addClass("woble-anim");
    } else {
      uiBrIcon.removeClass("woble-anim");
      uiBreak.removeClass("shake-anim");
      brMinutes--;
      uiBreak.html(brMinutes);
      breakTime = brMinutes * 60000;
      if (brMinutes > 9) {
      } else {
        uiBreak.css("font-size", "52px");
        uiBreak.css("padding-top", "8px");
        uiBreak.css("padding-left", "34px");
      }
    }
  });

  // Increase break length
  uiBrPlus.click(function() {
    if (brMinutes > 49) {
      uiBreak.addClass("shake-anim");
      uiBrIcon.addClass("woble-anim");
    } else {
      uiBreak.removeClass("shake-anim");
      uiBrIcon.removeClass("woble-anim");
      brMinutes++;
      uiBreak.html(brMinutes);
      breakTime = brMinutes * 60000;
      if (brMinutes > 9) {
        uiBreak.css("font-size", "40px");
        uiBreak.css("padding-top", "18px");
        uiBreak.css("padding-left", "24px");
      }
    }
  });
});
