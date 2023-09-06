import React, { useEffect, useRef } from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0';

function App() {
  const [displayTime, setDisplayTime] = React.useState(25 * 60);
  const [breakTime, setBreakTime] = React.useState(5);
  const [sessionTime, setSessionTime] = React.useState(25);
  const [timerOn, setTimerOn] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);
  const audioRef = useRef(null);

  const playBreakAlarm = () => {
    let audio = audioRef.current;
    audio.currentTime = 0;
    audio.play();
  };

  const formatTime = time => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' + (
      seconds < 10 ? '0' + seconds : seconds));

  };

  const changeTime = (amount, type) => {
    if (type === 'break') {
      if (breakTime <= 1 && amount < 0) {
        return;
      } else if (breakTime >= 60 && amount > 0) {
        return;
      }
      setBreakTime(prev => prev + amount);
    } else {
      if (type === 'session') {
        if (sessionTime <= 1 && amount < 0) {
          return;
        } else if (sessionTime >= 60 && amount > 0) {
          return;
        }
        setSessionTime(prev => prev + amount);
        if (!timerOn) {
          setDisplayTime((sessionTime + amount) * 60);
        }
      }
    }
  };

  // useEffect will run every time the code is re-rendered, array at end is its dependencies

  useEffect(() => {
    let onBreakVariable = onBreak;
    let interval;

    if (timerOn) {
      interval = setInterval(() => {
        setDisplayTime(prev => {
          if (prev <= 0 && !onBreakVariable) {
            playBreakAlarm();
            onBreakVariable = true;
            setOnBreak(true);
            return breakTime * 60;
          } else if (prev <= 0 && onBreakVariable) {
            playBreakAlarm();
            onBreakVariable = false;
            setOnBreak(false);
            return sessionTime * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerOn, onBreak, breakTime, sessionTime]);

  const controlTime = () => {
    setTimerOn(!timerOn);
  };

  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5);
    setSessionTime(25);
    setTimerOn(false);
    setOnBreak(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  return /*#__PURE__*/(
    React.createElement("div", { className: "center-align" }, /*#__PURE__*/
    React.createElement("h1", null, "Pomodoro Session Clock"), /*#__PURE__*/
    React.createElement("div", { className: "dual-container" }, /*#__PURE__*/
    React.createElement("div", { id: "break-label" }, /*#__PURE__*/
    React.createElement("h3", null, "Break Time"), /*#__PURE__*/
    React.createElement(Length, {
      title: "Break Length",
      placeholder: "5",
      changeTime: changeTime,
      type: "break",
      time: breakTime,
      formatTime: formatTime })), /*#__PURE__*/


    React.createElement("div", { id: "session-label" }, /*#__PURE__*/
    React.createElement("h3", null, "Session Time"), /*#__PURE__*/
    React.createElement(Length, {
      title: "Session Length",
      placeholder: "5",
      changeTime: changeTime,
      type: "session",
      time: sessionTime,
      formatTime: formatTime }))), /*#__PURE__*/



    React.createElement("h1", { id: "time-left" }, formatTime(displayTime)), /*#__PURE__*/
    React.createElement("h2", { id: "timer-label" }, onBreak ? 'Break Time!' : 'In Session'), /*#__PURE__*/
    React.createElement("button", { id: "start_stop", className: "btn-large indigo darken-3", onClick: controlTime },
    timerOn ? /*#__PURE__*/React.createElement("i", { className: "material-icons" }, "pause") : /*#__PURE__*/React.createElement("i", { className: "material-icons" }, "play_arrow")), /*#__PURE__*/

    React.createElement("button", { id: "reset", className: "btn-large indigo darken-3", onClick: resetTime }, /*#__PURE__*/
    React.createElement("i", { className: "material-icons" }, "autorenew")), /*#__PURE__*/

    React.createElement("audio", {
      id: "beep",
      preload: "auto",
      src: "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav",
      ref: audioRef })));



}

function Length({ title, changeTime, type, time, formatTime }) {
  return /*#__PURE__*/(
    React.createElement("div", null, /*#__PURE__*/
    React.createElement("h3", null, title), /*#__PURE__*/
    React.createElement("div", { className: "time-sets" }, /*#__PURE__*/
    React.createElement("button", {
      id: `${type}-decrement`,
      className: "btn-small indigo darken-3",
      onClick: () => changeTime(-1, type) }, /*#__PURE__*/

    React.createElement("i", { className: "material-icons" }, "arrow_drop_down")), /*#__PURE__*/

    React.createElement("h3", { id: `${type}-length` }, time), /*#__PURE__*/
    React.createElement("button", {
      id: `${type}-increment`,
      className: "btn-small indigo darken-3",
      onClick: () => changeTime(1, type) }, /*#__PURE__*/

    React.createElement("i", { className: "material-icons" }, " arrow_drop_up")))));




}

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('pomodoro'));