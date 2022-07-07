import { CircularProgressbar, buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PlayButton from "./PlayButton";
import PauseButton from "./PauseButton";
import SettingsButton from "./SettingsButton";
import {useContext, useState, useEffect, useRef} from "react";
import SettingsContext from "./SettingsContext";
import RadialSeparators from './RadialSeparators';

const red = '#f54e4e';
const green = '#4aec8c';

function Timer() {
  const settingsInfo = useContext(SettingsContext);

  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState('work'); // work/break/null
  const [secondsLeft, setSecondsLeft] = useState(0);

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);

  function tick() {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
  }

  useEffect(() => {

    function switchMode() {
      const nextMode = modeRef.current === 'work' ? 'break' : 'work';
      const nextSeconds = (nextMode === 'work' ? settingsInfo.workMinutes : settingsInfo.breakMinutes) * 60;

      setMode(nextMode);
      modeRef.current = nextMode;

      setSecondsLeft(nextSeconds);
      secondsLeftRef.current = nextSeconds;
    }

    secondsLeftRef.current = settingsInfo.workMinutes * 60;
    setSecondsLeft(secondsLeftRef.current);

    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }
      if (secondsLeftRef.current === 0) {
        return switchMode();
      }

      tick();
    },1000);

    return () => clearInterval(interval);
  }, [settingsInfo]);

  const totalSeconds = mode === 'work'
    ? settingsInfo.workMinutes * 60
    : settingsInfo.breakMinutes * 60;
  const percentage = Math.round(secondsLeft / totalSeconds * 100);

  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if(seconds < 10) seconds = '0'+seconds;

  return (
    <div>
      <CircularProgressbarWithChildren
        value={percentage}
        text={minutes + ':' + seconds}
        //text={`${percentage}%`}
        background
        backgroundImage
        backgroundPadding={6}
        strokeWidth={9}
        styles={buildStyles({
        backgroundColor: "transparent",
        strokeLinecap: "butt",
        textColor:'#fff',
        //pathColor:mode === 'work' ? red : green,
        pathColor:mode === 'work' ? red : green,
        tailColor:'rgba(255,255,255,.2)',
      })}>
        <RadialSeparators
          count={10}
          style={{
            background: "#fff",
            width: "2px",
            // This needs to be equal to props.strokeWidth
            height: `${10}%`
          }}
        />
        {/*{ mode ===  red ? console.log('bravo') : console.log('manso') }*/}
        {/*<img style={{ width: 200, marginTop: 150 }} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE0050xr-cI7bJf059KU3tRquBw0bupwFv6w&usqp=CAU" alt="doge" />*/}
      </CircularProgressbarWithChildren>
      <div style={{marginTop:'20px'}}>
        {isPaused
          ? <PlayButton onClick={() => { setIsPaused(false); isPausedRef.current = false; }} />
          : <PauseButton onClick={() => { setIsPaused(true); isPausedRef.current = true; }} />}
      </div>
      <div style={{marginTop:'20px'}}>
        <SettingsButton onClick={() => settingsInfo.setShowSettings(true)} />
      </div>
    </div>
  );
}

export default Timer;