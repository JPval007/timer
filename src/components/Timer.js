import { useContext, useState , useEffect, useRef} from 'react';
import { CircularProgressbar,buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import SettingsContext from '../SettingsContext';

const green = '#34eb77';
const violet = '#9d42e3';

function Timer() {
    const settingsInfo = useContext(SettingsContext);

    const [isPaused, setIsPaused] = useState(true);
    const [mode, setMode] = useState('work'); // work/break/null
    const [secondsLeft, setSecondsLeft] = useState(0);

    // References to all variables to use them without problem
    const secondsLeftRef = useRef(secondsLeft);
    const isPausedRef = useRef(isPaused);
    const modeRef = useRef(mode);

    function tick() {
        secondsLeftRef.current--;
        setSecondsLeft(secondsLeftRef.current);
    }

    useEffect(()=>{

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

        const interval = setInterval(()=>{
            if (isPausedRef.current) {
                return;
            }
            if (secondsLeftRef.current === 0) {
                return switchMode();
            }

            tick();

        },1000);

        return ()=>{clearInterval(interval)};

    },[settingsInfo]);

    const totalSeconds = mode === 'work'
    ? settingsInfo.workMinutes * 60
    : settingsInfo.breakMinutes * 60;
    const percentage = Math.round(secondsLeft / totalSeconds * 100);

    const minutes = Math.floor(secondsLeft / 60);
    let seconds = secondsLeft % 60;
    if (seconds < 10) {seconds = '0' + seconds;}

    return (
        <>
            <CircularProgressbar value={percentage} text={minutes + ":" + seconds} styles={buildStyles({
                textColor: '#fff',
                pathColor: (mode === 'work') ? violet : green,
                trailColor: '#ababab',
            })} />
            <div style={{marginTop: '20px;'}}>
                {isPaused ? <button onClick={() => { setIsPaused(false); isPausedRef.current = false; }} ><i className="fa-solid fa-play"></i></button> : <button onClick={() => { setIsPaused(true); isPausedRef.current = true; }} ><i class="fa-solid fa-pause"></i></button>}
                
            </div>
            <div style={{marginTop: '20px;'}}>
                <button className='settings' onClick={()=>(settingsInfo.setShowSettings(true))}><i className="fa-solid fa-gear settings-icon"></i>Settings</button>
            </div>
        </>
    );
}

export default Timer;