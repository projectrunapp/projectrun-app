
import {SafeAreaView} from 'react-native';
import {useState} from "react";
import PopupMessage from "../components/PopupMessage";
import RunControls from "../components/RunControls";
import RunStartingLocation from "../components/RunStartingLocation";
import RunProcessingPopup from "../components/RunProcessingPopup";
import {runStates, startRunBtnPressSeconds} from "../utils/app-constants";
import {useNavigation} from "@react-navigation/native";

export default function RunScreen() {
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

    const [runState, setRunState] = useState<number>(runStates.NOT_STARTED);
    const [runStartedAt, setRunStartedAt] = useState<number>(0);
    const [startCountdownSeconds, setStartCountdownSeconds] = useState(startRunBtnPressSeconds);
    const [isStartBtnPressed, setIsStartBtnPressed] = useState(false);

    const [isRunProcessingPopupVisible, setRunProcessingPopupVisible] = useState<boolean>(false);

    const [permissionAllowed, setPermissionAllowed] = useState<boolean>(false);

    const startRunProcessing = () => {
        setRunProcessingPopupVisible(true);
    }

    // const closeRunProcessingPopup = () => {
    //     setRunProcessingPopupVisible(false);
    // }
    const stopRunProcessing = () => {
        setRunProcessingPopupVisible(false);
        setRunState(runStates.NOT_STARTED);
        setRunStartedAt(0);
        setStartCountdownSeconds(startRunBtnPressSeconds);
        setIsStartBtnPressed(false);

        // TODO: send the message ("Run stopped successfully.") details to the next screen
        //  and open popup modal (run "showPopup") there
        navigation.navigate("Run", { screen: "SingleRunScreen", params: {runId: 1, title: "Morning Run!"}});
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
            />
            <RunStartingLocation showPopup={showPopup}
                                 permissionAllowed={permissionAllowed}
                                 setPermissionAllowed={setPermissionAllowed}
            />
            <RunControls showPopup={showPopup}
                         permissionAllowed={permissionAllowed}
                         startRunProcessing={startRunProcessing}
                         runState={runState}
                         setRunState={setRunState}
                         setRunStartedAt={setRunStartedAt}
                         startCountdownSeconds={startCountdownSeconds}
                         setStartCountdownSeconds={setStartCountdownSeconds}
                         isStartBtnPressed={isStartBtnPressed}
                         setIsStartBtnPressed={setIsStartBtnPressed}
            />
        </SafeAreaView>
    );
};
