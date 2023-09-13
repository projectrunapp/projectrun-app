
import { Audio } from 'expo-av';
import {SafeAreaView} from 'react-native';
import {useEffect, useState} from "react";
import PopupMessage from "../components/PopupMessage";
import RunControls from "../components/RunControls";
import RunStartingLocation from "../components/RunStartingLocation";
import RunProcessingPopup from "../components/RunProcessingPopup";
import {runStates, startRunBtnPressSeconds} from "../utils/app-constants";
import {useRunData} from "../context/RunDataContext";
import {useNavigation} from "@react-navigation/native";
import {humanizedDistancePartials, humanizedDurationPartials} from "../utils/helper";
import audioFiles from "../utils/AudioFiles";

export default function RunScreen() {
    const {
        storageCreateRun,
        storageStopRun,
        sendAllRunsDataToServer,
        storageGetRunState,
        storageAddRunCoordinate,
        storageVoiceNotificationInfo,
    } = useRunData();
    const navigation = useNavigation();

    const [isPopupVisible, setPopupVisible] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState<string>("");
    const [popupSuccess, setPopupSuccess] = useState<boolean>(true);
    const showPopup = (success: boolean, message: string) => {
        setPopupMessage(message);
        setPopupSuccess(success);
        setPopupVisible(true);
    }
    const closePopup = () => {
        setPopupVisible(false); // setPopupMessage(""); setPopupSuccess(true);
    }

    const [stopRunLoading, setStopRunLoading] = useState<boolean>(false);
    const [runState, setRunState] = useState<number>(runStates.NOT_STARTED);
    const [runStartedAt, setRunStartedAt] = useState<number>(0);
    const [startCountdownSeconds, setStartCountdownSeconds] = useState(startRunBtnPressSeconds);
    const [isStartBtnPressed, setIsStartBtnPressed] = useState(false);

    const [isRunProcessingPopupVisible, setRunProcessingPopupVisible] = useState<boolean>(false);

    const [permissionAllowed, setPermissionAllowed] = useState<boolean>(false);

    const [runTitle, setRunTitle] = useState<string>("Run!");

    const [runningResults, setRunningResults] = useState<{ distance: number, duration: number, avg_speed: number, }>({
        distance: 0,
        duration: 0,
        avg_speed: 0,
    });
    const [sound, setSound] = useState();
    const playSound = async (fileName: string) => {
        const requireAudioFile = audioFiles[fileName].file;
        const { sound: currentSound } = await Audio.Sound.createAsync(requireAudioFile);
        setSound!(currentSound);

        await currentSound.playAsync();
    }
    const sleep = async (ms) => {
        return new Promise((r) => setTimeout(r, ms));
    }
    const playSequentialSounds = async (fileNames: string[]) => {
        for (let i = 0; i < fileNames.length; i++) {
            await playSound(fileNames[i]);
            await sleep(audioFiles[fileNames[i]].duration * 1000);
        }
    }
    useEffect(() => {
        if (sound) {
            return () => {
                sound.unloadAsync();
            };
        }
    }, [sound]);

    const collectVoices = (
        result: { distance: number, duration: number, avg_speed: number},
        voices: string[] = []
    ): string[] => {
        const silenceAudio = "silence-2";
        voices.push(silenceAudio);

        // distance
        const distancePartials = humanizedDistancePartials(result.distance);
        voices.push("distance");
        if (distancePartials.km === 0 && distancePartials.m === 0) {
            voices.push("0");
            voices.push('meters');
        }
        if (distancePartials.km > 0) {
            voices.push(distancePartials.km.toString());
            if (distancePartials.km === 1) {
                voices.push('kilometer');
            } else {
                voices.push('kilometers');
            }
        }
        if (distancePartials.m > 0) {
            voices.push(distancePartials.m.toString());
            voices.push('meters');
        }

        if (voices[voices.length - 1] !== silenceAudio) {voices.push(silenceAudio);}

        // duration
        const durationPartials = humanizedDurationPartials(result.duration);
        voices.push("time");
        if (durationPartials.h === 0 && durationPartials.m === 0 && durationPartials.s === 0) {
            voices.push("0");
            voices.push('seconds');
        }
        if (durationPartials.h > 0) {
            voices.push(durationPartials.h.toString());
            if (durationPartials.h === 1) {
                voices.push('hour');
            } else {
                voices.push('hours');
            }
        }
        if (durationPartials.m > 0) {
            voices.push(durationPartials.m.toString());
            if (durationPartials.m === 1) {
                voices.push('minute');
            } else {
                voices.push('minutes');
            }
        }
        if (durationPartials.s > 0) {
            voices.push(durationPartials.s.toString());
            if (durationPartials.s === 1) {
                voices.push('second');
            } else {
                voices.push('seconds');
            }
        }

        if (voices[voices.length - 1] !== silenceAudio) {voices.push(silenceAudio);}

        // avg_speed
        if (result.avg_speed > 0) {
            voices.push("average-speed");
            if (result.avg_speed % 1 !== 0) { // if result.avg_speed is float
                const avgSpeedPartials = result.avg_speed.toString().split('.');

                const avgSpeedPartialsBeforeDot = avgSpeedPartials[0];
                voices.push(avgSpeedPartialsBeforeDot.toString());

                voices.push("point");

                const avgSpeedPartialsAfterDot = Math.floor(parseInt(avgSpeedPartials[1]) / 10);
                voices.push(avgSpeedPartialsAfterDot.toString()); // make sure it's one digit after the dot
            } else {
                voices.push(result.avg_speed.toString());
            }
            voices.push("kilometers-per-hour");
        }

        if (voices[voices.length - 1] !== silenceAudio) {voices.push(silenceAudio);}

        return voices;
    };

    const startRunProcessing = async () => {
        setRunState(runStates.RUNNING);
        setRunProcessingPopupVisible(true);

        // storageRunState will be set to runStates.RUNNING in storageCreateRun()
        const startedRunResults = await storageCreateRun();
        if (startedRunResults.success) {
            setRunTitle(startedRunResults.data.title);
        }

        playSequentialSounds([
            "start",
        ]);
    }

    const addRunCoordinate = async (lat: number, lng: number) => {
        const storageRunState = await storageGetRunState();
        if (storageRunState === runStates.RUNNING || storageRunState === runStates.PAUSED) {
            const result = await storageAddRunCoordinate(lat, lng, storageRunState);
            if (result) {
                setRunningResults({
                    distance: result.distance, // meters
                    duration: result.duration, // seconds
                    avg_speed: result.avg_speed, // meters per second
                });
            }

            const needToNotify = await storageVoiceNotificationInfo(result.distance, result.duration);
            if (needToNotify) {
                const voices = collectVoices(result, []);
                playSequentialSounds(voices);
            }
        }
    }

    // const closeRunProcessingPopup = () => {
    //     setRunProcessingPopupVisible(false);
    // }
    const stopRunProcessing = async () => {
        setRunState(runStates.NOT_STARTED);
        setRunStartedAt(0);
        setStartCountdownSeconds(startRunBtnPressSeconds);
        setIsStartBtnPressed(false);

        setStopRunLoading(true);
        // storageRunState will be set to runStates.NOT_STARTED in storageStopRun()
        // voice_notification_info will be cleared in storageStopRun()
        const stopResults = await storageStopRun();
        await sendAllRunsDataToServer();
        setStopRunLoading(false);

        if (stopResults.success) {
            const voices = collectVoices(stopResults.data, [
                "stop",
            ]);
            // TODO: fix current voice notification playing conflict with the next one
            playSequentialSounds(voices);
        }

        setRunProcessingPopupVisible(false);

        // @ts-ignore
        navigation.navigate("Run", { screen: "SingleRunScreen", params: {
            runId: null,
            title: "Morning Run!",
            popup: {
                success: true,
                message: "Run stopped successfully.",
            },
        }});
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <PopupMessage isVisible={isPopupVisible}
                          message={popupMessage}
                          success={popupSuccess}
                          onClose={closePopup}
            />
            <RunProcessingPopup isVisible={isRunProcessingPopupVisible}
                                // onClose={closeRunProcessingPopup}
                                showPopup={showPopup}
                                runState={runState}
                                setRunState={setRunState}
                                runStartedAt={runStartedAt}
                                stopRunProcessing={stopRunProcessing}
                                stopRunLoading={stopRunLoading}
                                runningResults={runningResults}
                                runTitle={runTitle}
            />
            <RunStartingLocation showPopup={showPopup}
                                 permissionAllowed={permissionAllowed}
                                 setPermissionAllowed={setPermissionAllowed}
                                 addRunCoordinate={addRunCoordinate}
            />
            <RunControls showPopup={showPopup}
                         permissionAllowed={permissionAllowed}
                         startRunProcessing={startRunProcessing}
                         runState={runState}
                         setRunStartedAt={setRunStartedAt}
                         startCountdownSeconds={startCountdownSeconds}
                         setStartCountdownSeconds={setStartCountdownSeconds}
                         isStartBtnPressed={isStartBtnPressed}
                         setIsStartBtnPressed={setIsStartBtnPressed}
            />
        </SafeAreaView>
    );
};
