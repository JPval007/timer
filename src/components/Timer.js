import { useContext, useState , useEffect, useRef} from 'react';
import { CircularProgressbar,buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import SettingsContext from '../SettingsContext';

const green = '#34eb77';
// const violet = '#9d42e3';

function Timer() {
    const settingsInfo = useContext(SettingsContext);

    const [isPaused, setIsPaused] = useState(false);
    const [mode, setMode] = useState('work'); //work break pause
    const [secondsLeft, setSecondsLeft] = useState(0);

    // References for all the varriables to use them without any problem
    const secondsLeftRef = useRef(secondsLeft);
    const isPausedRef = useRef(isPaused);
    const modeRef = useRef(mode);

    function tick() {
        secondsLeftRef.current--;
        setSecondsLeft(secondsLeftRef.current);
    }

    function initTimer() {
        setSecondsLeft(settingsInfo.workMinutes * 60);
    }

    function switchMode() {
        const nextMode = modeRef.current === 'work' ? 'break' : 'work';
        const nextSeconds = (nextMode === 'work' ? settingsInfo.workMinutes * 60 : settingsInfo.breakMiutes * 60)*60;
        setMode(nextMode);
        modeRef.current = nextMode;

        setSecondsLeft(nextSeconds);
        secondsLeftRef.current = nextSeconds;
    }

    useEffect(()=>{
        // Start timer when play is presed
        initTimer();

        const interval = setInterval(()=>{
            if (isPausedRef.current) {
                return;
            }
            if (secondsLeftRef.current === 0) {
                return switchMode();
            }

            tick();

        },1000);

        return clearInterval(interval);

    },[settingsInfo]);

    const totalSeconds = mode === 'work' ? settingsInfo.workMinutes*60 : settingsInfo.breakMiutes*60;
    const percentage = Math.round(secondsLeft / totalSeconds);

    return (
        <>
            <CircularProgressbar value={percentage} text='60' styles={buildStyles({
                textColor: '#fff',
                pathColor: green,
                trailColor: '#ababab',
            })} />
            <div style={{marginTop: '20px;'}}>
                {isPaused ? <button><i className="fa-solid fa-play"></i></button> : <button><i class="fa-solid fa-pause"></i></button>}
                
            </div>
            <div style={{marginTop: '20px;'}}>
                <button className='settings' onClick={()=>(settingsInfo.setShowSettings(true))}><i className="fa-solid fa-gear settings-icon"></i>Settings</button>
            </div>
        </>
    );
}

export default Timer;