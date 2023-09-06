
import {SafeAreaView} from 'react-native';
import {useState} from "react";
import PopupMessage from "../components/PopupMessage";
import RunControls from "../components/RunControls";
import RunStartingLocation from "../components/RunStartingLocation";
import RunProcessingPopup from "../components/RunProcessingPopup";
import {runStates, startRunBtnPressSeconds} from "../utils/app-constants";
import {useRunData} from "../context/RunDataContext";
import {useNavigation} from "@react-navigation/native";

export default function RunScreen() {
    const {
        storageCreateRun,
        storageStopRun,
        sendAllRunsDataToServer,
        storageGetRunState,
        storageAddRunCoordinate
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

    const startRunProcessing = async () => {
        setRunState(runStates.RUNNING);
        setRunProcessingPopupVisible(true);

        await storageCreateRun(); // storageRunState will be set to runStates.RUNNING in storageCreateRun()
    }

    const addRunCoordinate = async (lat: number, lng: number) => {
        const storageRunState = await storageGetRunState();
        if (storageRunState === runStates.RUNNING || storageRunState === runStates.PAUSED) {
            // save to local storage, calling the async method without await
            storageAddRunCoordinate(lat, lng, storageRunState);
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
        await storageStopRun(); // storageRunState will be set to runStates.NOT_STARTED in storageStopRun()
        await sendAllRunsDataToServer();
        setStopRunLoading(false);

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
