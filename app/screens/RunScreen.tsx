
import {SafeAreaView} from 'react-native';
import {useState} from "react";
import PopupMessage from "../components/PopupMessage";
import RunControls from "../components/RunControls";
import RunStartingLocation from "../components/RunStartingLocation";
import RunProcessingPopup from "../components/RunProcessingPopup";
import {runStates, startRunBtnPressSeconds, trackingTask, updateLocationTimeoutSeconds} from "../utils/app-constants";
import {useRunData} from "../context/RunDataContext";
import {useNavigation} from "@react-navigation/native";
import * as Location from "expo-location";
import {collectVoices} from "../utils/helper";
import {useTaskManager} from "../hooks/TaskManager";
import {useSoundPlayer} from "../hooks/SoundPlayer";

let foregroundSubscription = null;
let foregroundResultingSubscription = null;
let foregroundResultingSubscriptionInterval = null;

export default function RunScreen() {

    const { startTask } = useTaskManager();
    const { playSequentialSounds } = useSoundPlayer();
    const {storageCreateRun, storageGetRun, storageStopRun, sendAllRunsDataToServer} = useRunData();
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

    const [retrievingMapLocation, setRetrievingMapLocation] = useState<boolean>(true);
    const [currentMapLocation, setCurrentMapLocation] = useState<any>(null);

    const [stopRunLoading, setStopRunLoading] = useState<boolean>(false);
    const [runState, setRunState] = useState<number>(runStates.NOT_STARTED);
    const [runStartedAt, setRunStartedAt] = useState<number>(0);
    const [startCountdownSeconds, setStartCountdownSeconds] = useState(startRunBtnPressSeconds);
    const [isStartBtnPressed, setIsStartBtnPressed] = useState(false);

    const [isRunProcessingPopupVisible, setRunProcessingPopupVisible] = useState<boolean>(false);

    const [permissionAllowed, setPermissionAllowed] = useState<boolean>(false);

    const [runTitle, setRunTitle] = useState<string>("Run!");

    const defaultRunningResults = {distance: 0, duration: 0, avg_speed: 0};
    const [runningResults, setRunningResults] = useState<{
        distance: number,
        duration: number,
        avg_speed: number
    }>(defaultRunningResults);

    const startRunProcessing = async () => {
        setRunState(runStates.RUNNING);
        // setRunStartedAt(Date.now()); // TODO: set runStartedAt to the time when the user start pressing the start button
        setRunningResults(defaultRunningResults);
        setRunProcessingPopupVisible(true);

        // storageRunState will be set to runStates.RUNNING in storageCreateRun()
        const startedRunResults = await storageCreateRun();
        if (startedRunResults.success) {
            setRunTitle(startedRunResults.data.title);

            startBackgroundTracking();

            playSequentialSounds([
                "start",
            ]);
        } else {
            showPopup(false, startedRunResults.message);
        }
    }
    const stopRunProcessing = async () => {
        setRunState(runStates.NOT_STARTED);
        setRunStartedAt(0);
        setRunningResults(defaultRunningResults);
        setStartCountdownSeconds(startRunBtnPressSeconds);
        setIsStartBtnPressed(false);

        await stopForegroundResulting();
        await stopBackgroundTracking();

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
        navigation.navigate("Run", {
            screen: "SingleRunScreen",
            params: {
                runId: null,
                title: "Morning Run!",
                popup: {
                    success: true,
                    message: "Run stopped successfully.",
                },
            }
        });
    }

    const startForegroundTracking = async () => {
        setRetrievingMapLocation(false);

        // Check if foreground permission is granted
        const foregroundPermissions = await Location.requestForegroundPermissionsAsync();
        if (foregroundPermissions.status === 'granted') {
            setPermissionAllowed(true);

            // Make sure that foreground location tracking is not running
            await stopForegroundTracking();

            // Start watching position in real-time
            foregroundSubscription = await Location.watchPositionAsync({
                timeInterval: updateLocationTimeoutSeconds * 1000,
                accuracy: Location.Accuracy.BestForNavigation,
            }, location => { // Location in foreground
                setCurrentMapLocation({
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                });

                const currentTime = new Date().toLocaleTimeString("en-US", {hour12: false});
                console.info(`FOREGROUND: ${currentTime} >>> ${location.coords.latitude}, ${location.coords.longitude}`);
            });
        } else { // Foreground location tracking denied!
            setPermissionAllowed(false);
            showPopup(false, "Access denied to track location in foreground!");
        }
    }
    const startForegroundResulting = async () => {
        // foreground permissions here are already granted

        // make sure that foreground resulting is not running
        await stopForegroundResulting();

        foregroundResultingSubscriptionInterval = setInterval(async () => {
            const storageRun = await storageGetRun();
            if (storageRun) {
                setRunningResults(storageRun);
            }
        }, updateLocationTimeoutSeconds * 1000);
    }
    const stopForegroundTracking = async () => {
        if (foregroundSubscription) {
            await foregroundSubscription.remove();
        }
    }
    const stopForegroundResulting = async () => {
        if (foregroundResultingSubscription) {
            await foregroundResultingSubscription.remove();
        }
        if (foregroundResultingSubscriptionInterval) {
            clearInterval(foregroundResultingSubscriptionInterval);
            foregroundResultingSubscriptionInterval = null;
        }
    }
    const tryStartRunProcessing = async () => {
        const foregroundPermissions = await Location.requestForegroundPermissionsAsync();
        if (foregroundPermissions.status !== 'granted') {showPopup(false, "Foreground location tracking denied!"); return;}

        // Don't track position if permission is not granted
        const backgroundPermissions = await Location.requestBackgroundPermissionsAsync();
        if (backgroundPermissions.status !== 'granted') {showPopup(false, "Background location tracking denied!"); return;}

        await stopForegroundTracking();
        await startForegroundResulting();

        setRunStartedAt(Date.now());

        // Start run processing
        startRunProcessing();
    }
    const startBackgroundTracking = async () => {
        // Here background location tracking is allowed

        await startTask();

        showPopup(true, "Location tracking started!");
    }
    const stopBackgroundTracking = async (): Promise<{success: boolean, message: string}> => {
        const hasStarted = await Location.hasStartedLocationUpdatesAsync(trackingTask.name);
        if (hasStarted) {
            await Location.stopLocationUpdatesAsync(trackingTask.name);
            return {success: true, message: "Background location tracking stopped!"};
        } else {
            return {success: false, message: "Background location tracking is not running!"};
        }
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
            <RunStartingLocation retrievingMapLocation={retrievingMapLocation}
                                 permissionAllowed={permissionAllowed}
                                 currentMapLocation={currentMapLocation}
                                 startForegroundTracking={startForegroundTracking}
                                 stopForegroundTracking={stopForegroundTracking}
            />
            <RunControls permissionAllowed={permissionAllowed}
                         tryStartRunProcessing={tryStartRunProcessing}
                         runState={runState}
                         startCountdownSeconds={startCountdownSeconds}
                         setStartCountdownSeconds={setStartCountdownSeconds}
                         isStartBtnPressed={isStartBtnPressed}
                         setIsStartBtnPressed={setIsStartBtnPressed}
            />
        </SafeAreaView>
    );
};
