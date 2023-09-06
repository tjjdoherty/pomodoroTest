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

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds : seconds)
    );
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

  return (
    <div className="center-align">
      <h1>Pomodoro Session Clock</h1>
      <div className="dual-container">
        <div id="break-label">
          <h3>Break Time</h3>
          <Length
            title="Break Length"
            placeholder="5"
            changeTime={changeTime}
            type="break"
            time={breakTime}
            formatTime={formatTime}
          />
        </div>
        <div id="session-label">
          <h3>Session Time</h3>
          <Length
            title="Session Length"
            placeholder="5"
            changeTime={changeTime}
            type="session"
            time={sessionTime}
            formatTime={formatTime}
          />
        </div>
      </div>
      <h1 id="time-left">{formatTime(displayTime)}</h1>
      <h2 id="timer-label">{onBreak ? 'Break Time!' : 'In Session'}</h2>
      <button id="start_stop" className="btn-large indigo darken-3" onClick={controlTime}>
        {timerOn ? <i className="material-icons">pause</i> : <i className="material-icons">play_arrow</i>}
      </button>
      <button id="reset" className="btn-large indigo darken-3" onClick={resetTime}>
        <i className="material-icons">autorenew</i>
      </button>
      <audio
        id="beep"
        preload="auto"
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        ref={audioRef}
      />
    </div>
  );
}

function Length({ title, changeTime, type, time, formatTime }) {
  return (
    <div>
      <h3>{title}</h3>
      <div className="time-sets">
        <button
          id={`${type}-decrement`}
          className="btn-small indigo darken-3"
          onClick={() => changeTime(-1, type)}
        >
          <i className="material-icons">arrow_drop_down</i>
        </button>
        <h3 id={`${type}-length`}>{time}</h3>
        <button
          id={`${type}-increment`}
          className="btn-small indigo darken-3"
          onClick={() => changeTime(1, type)}
        >
          <i className="material-icons"> arrow_drop_up</i>
        </button>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('pomodoro'));