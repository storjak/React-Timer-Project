import './App.css';
import React from "react";
import upArrow from './up-arrow.svg';
import downArrown from "./down-arrow.svg";
import playPauseArrow from "./play-and-pause-button.svg";
import resetArrow from "./redo-arrow-symbol.svg";
import beepSound from "./beep.mp3";

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakSetting: 5,
      breakSeconds: 0,
      sessionSetting: 25,
      sessionSeconds: 0,
      currentTime: "25:00",
      isOnBreak: false,
      isPaused: true,
      switched: false
    };

    this.reset = this.reset.bind(this);
    this.playPause = this.playPause.bind(this);
    this.time = this.time.bind(this);
    this.timerControl = this.timerControl.bind(this);
    this.zeroCheck = this.zeroCheck.bind(this);
    this.sessionControl = this.sessionControl.bind(this);
    this.breakControl = this.breakControl.bind(this);
    this.timerLabel = this.timerLabel.bind(this);
    this.numUpdater = this.numUpdater.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.sbSwitch = this.sbSwitch.bind(this);
    this.playSound = this.playSound.bind(this);
  };

  reset() {
    clearInterval(this.timerID);
    clearTimeout(this.timeoutID);
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
    this.setState({
      breakSetting: 5,
      breakSeconds: 0,
      sessionSetting: 25,
      sessionSeconds: 0,
      currentTime: "25:00",
      isOnBreak: false,
      isPaused: true,
    });
  }

  playPause() {
    if (this.state.isPaused) {
      this.setState({
        isPaused: false
      }, () => {
        this.timerControl();
        this.timerID = setInterval(this.timerControl, 1000);
      });
    } else if (!this.state.isPaused) {
      this.setState({
        isPaused: true
      }, () => clearInterval(this.timerID));
    }
  }

  time(realSeconds) {
    let timeString = new Date((realSeconds) * 1000).toISOString().substring(12, 19);
    if (timeString === "1:00:00") {
      this.setState({
        currentTime: "60:00"
      });
    } else {
      this.setState({
        currentTime: timeString.substring(2, 7)
      });
    }
  }

  zeroCheck(seconds) {
    if (seconds <= 0) {
      clearInterval(this.timerID);
      this.setState({
        currentTime: "00:00",
        breakSeconds: 0,
        sessionSeconds: 0
      }, () => this.sbSwitch());
    } else {
      return;
    }
  }

  sbSwitch() {
    this.playSound();
    if (this.state.isOnBreak) {
      this.setState({
        isPaused: true,
        isOnBreak: false,
      }, () => {
        setTimeout(() => {
          this.playPause();
        }, 1500);
      });
    } else if (!this.state.isOnBreak) {
      this.setState({
        isPaused: true,
        isOnBreak: true,
      }, () => {
        setTimeout(() => {
          this.playPause();
        }, 1500);
      });
    }
  }

  timerControl() {
    if (this.state.isOnBreak) {
      this.breakControl();
      return;
    } else if (!this.state.isOnBreak) {
      this.sessionControl();
      return;
    }
  }

  sessionControl() {
    if (this.state.sessionSeconds === 0) {
      this.setState({
        sessionSeconds: this.state.sessionSetting * 60
      }, () => {
        this.time(this.state.sessionSeconds)
        this.setState({
          sessionSeconds: this.state.sessionSeconds - 1
        });
      });
    } else if (this.state.sessionSeconds > 0 && this.state.sessionSeconds < 2) {
      this.time(this.state.sessionSeconds);
      this.setState({
        sessionSeconds: this.state.sessionSeconds - 1
      }, () => this.zeroCheck(this.state.sessionSeconds));
    } else if (this.state.sessionSeconds > 0) {
      this.time(this.state.sessionSeconds);
      this.setState({
        sessionSeconds: this.state.sessionSeconds - 1
      });
    }
  }

  breakControl() {
    if (this.state.breakSeconds === 0) {
      this.setState({
        breakSeconds: this.state.breakSetting * 60
      }, () => {
        this.time(this.state.breakSeconds);
        this.setState({
          breakSeconds: this.state.breakSeconds - 1
        });
      });
    } else if (this.state.breakSeconds > 0 && this.state.breakSeconds < 2) {
      this.time(this.state.breakSeconds);
      this.setState({
        breakSeconds: this.state.breakSeconds - 1
      }, () => this.zeroCheck(this.state.breakSeconds));
    } else if (this.state.breakSeconds > 0) {
      this.time(this.state.breakSeconds);
      this.setState({
        breakSeconds: this.state.breakSeconds - 1
      });
    }
  }

  timerLabel() {
    if (this.state.isOnBreak) {
      return "Break";
    } else if (!this.state.isOnBreak) {
      return "Session";
    }
  }

  numUpdater(input) {
    if (input === "b" && this.state.isOnBreak) {
      this.time(this.state.breakSetting * 60);
    } else if (input === "s" && !this.state.isOnBreak) {
      this.time(this.state.sessionSetting * 60);
    }
  }

  add(input) {
    if (this.state.isPaused) {
      if (input === "b") {
        if (this.state.breakSetting >= 60) {
          return;
        } else {
          this.setState({
            breakSetting: this.state.breakSetting + 1
          }, () => this.numUpdater(input));
        }
      } else if (input === "s") {
        if (this.state.sessionSetting >= 60) {
          return;
        } else {
          this.setState({
            sessionSetting: this.state.sessionSetting + 1
          }, () => this.numUpdater(input));
        }
      }
    } else {
      return;
    }
  }

  remove(input) {
    if (this.state.isPaused) {
      if (input === "b") {
        if (this.state.breakSetting <= 1) {
          return;
        } else {
          this.setState({
            breakSetting: this.state.breakSetting - 1
          }, () => this.numUpdater(input));
        }
      } else if (input === "s") {
        if (this.state.sessionSetting <= 1) {
          return;
        } else {
          this.setState({
            sessionSetting: this.state.sessionSetting - 1
          }, () => this.numUpdater(input));
        }
      }
    } else {
      return;
    }
  }

  playSound() {
    document.getElementById("beep").play();
    document.getElementById("beep").currentTimeSession = 0;
  }

  render() {
    return ( // remove the length-adj-wrapper div when using old grid css
      <div id="clock">
        <audio id="beep" src={beepSound} />
        <div id="main-body">

          <div id="title">
            <h1>25 + 5 Timer</h1>
            <h2>A Quick and Easy Break Reminder</h2>
          </div>

          <div id="length-adj-wrapper">
            <div id="break-label">
              <div>Break Length</div>
              <div><button id="break-increment" onClick={() => this.add("b")}><img src={upArrow} alt="Up" /></button> <span id="break-length">{this.state.breakSetting}</span> <button id="break-decrement" onClick={() => this.remove("b")}><img src={downArrown} alt="Down" /></button></div>
            </div>
            <div id="session-label"><div>Session Length</div>
              <div><button id="session-increment" onClick={() => this.add("s")}><img src={upArrow} alt="Up" /></button> <span id="session-length">{this.state.sessionSetting}</span> <button id="session-decrement" onClick={() => this.remove("s")}><img src={downArrown} alt="Down" /></button></div>
            </div>
          </div>

          <div id="timer-body">
            <div id="timer-label">{this.timerLabel()}</div>
            <div id="time-left">{this.state.currentTime}</div>
          </div>

          <div id="buttons">
            <button id="start_stop" onClick={this.playPause}><img src={playPauseArrow} alt="Play/Pause" /></button>
            <button id="reset" onClick={this.reset}><img src={resetArrow} alt="Reset/Stop" /></button>
          </div>

        </div>
      </div>
    );
  }
}

export default Clock;
