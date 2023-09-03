
import * as React from 'react';
import {TouchableOpacity, StyleSheet, View, Text, SafeAreaView} from 'react-native';
import {
    runStateTitles,
    runStates,
    stopRunBtnPressSeconds,
    startRunBtnPressSeconds, guaranteeSecondsAfterStartBtnPress
} from "../utils/app-constants";
import {useState} from "react";
import PopupMessage from "../components/PopupMessage";

const RunScreen = ({ route, navigation }) => {
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

    const [runState, setRunState] = React.useState<number>(runStates.NOT_STARTED);
    const [runStartedAt, setRunStartedAt] = React.useState<number>(0);
    const runAction = () => {
        // check that the "Pause" ("Resume") button hasn't pressed automatically after holding the "Start" button
        if (runStartedAt !== 0 && Date.now() - runStartedAt >= guaranteeSecondsAfterStartBtnPress * 1000) {
            if (runState === runStates.RUNNING) {
                showPopup(true, "Run paused.");
                setRunState(runStates.PAUSED);
            } else { // runState === runStates.PAUSED
                showPopup(true, "Run resumed.");
                setRunState(runStates.RUNNING);
            }
        }
    };

    const [stopCountdownSeconds, setStopCountdownSeconds] = React.useState(stopRunBtnPressSeconds); // 3
    const [isStopBtnPressed, setIsStopBtnPressed] = React.useState(false);
    const handleStopBtnPressIn = () => {
        setIsStopBtnPressed(true);
        this.stopBtnPressedInTime = Date.now();

        this.intervalForStop = setInterval(() => {
            if (Math.floor((Date.now() - this.stopBtnPressedInTime) / 1000) >= stopRunBtnPressSeconds) {
                showPopup(true, "Run stopped.");
                setStopCountdownSeconds(stopRunBtnPressSeconds);

                clearInterval(this.intervalForStop);
                this.stopBtnPressedInTime = 0;
                setIsStopBtnPressed(false);

                setRunState(runStates.FINISHED);
                // ...
            } else {
                // console.log("Stop button pressed time: ", Math.floor((Date.now() - this.stopBtnPressedInTime) / 1000));
                setStopCountdownSeconds(prevState => prevState - 1);
            }
        }, 1000);
    };
    const handleStopBtnPressOut = () => {
        showPopup(false, "Run wasn't stopped!");
        setStopCountdownSeconds(stopRunBtnPressSeconds);

        clearInterval(this.intervalForStop);
        this.stopBtnPressedInTime = 0;
        setIsStopBtnPressed(false);
    };

    const [startCountdownSeconds, setStartCountdownSeconds] = React.useState(startRunBtnPressSeconds);
    const [isStartBtnPressed, setIsStartBtnPressed] = React.useState(false);
    const handleStartBtnPressIn = () => {
        setIsStartBtnPressed(true);
        this.startBtnPressedInTime = Date.now();

        this.intervalForStart = setInterval(() => {
            if (Math.floor((Date.now() - this.startBtnPressedInTime) / 1000) >= startRunBtnPressSeconds) {
                showPopup(true, "Run started.");
                setStartCountdownSeconds(startRunBtnPressSeconds);

                clearInterval(this.intervalForStart);
                this.startBtnPressedInTime = 0;
                setIsStartBtnPressed(false);

                setRunState(runStates.RUNNING);
                setRunStartedAt(Date.now());
                // ...
            } else {
                // console.log("Start button pressed time: ", Math.floor((Date.now() - this.startBtnPressedInTime) / 1000));
                setStartCountdownSeconds(prevState => prevState - 1);
            }
        }, 1000);
    };
    const handleStartBtnPressOut = () => {
        showPopup(false, "Run wasn't started!");
        setStartCountdownSeconds(startRunBtnPressSeconds);

        clearInterval(this.intervalForStart);
        this.startBtnPressedInTime = 0;
        setIsStartBtnPressed(false);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <PopupMessage isVisible={isPopupVisible} message={popupMessage} success={popupSuccess} onClose={closePopup}/>
            <View style={{ flex: 1, padding: 16 }}>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>

                    <Text style={{fontSize: 18, marginBottom: 16}}>
                        {isStopBtnPressed ? (
                            <>Run will be stopped in <Text style={{fontWeight: 'bold'}}>{stopCountdownSeconds}</Text> seconds...</>
                        ) : (
                            isStartBtnPressed ? (
                                <>Run will be started in <Text style={{fontWeight: 'bold'}}>{startCountdownSeconds}</Text> seconds...</>
                            ) : (
                                <>State: <Text style={{fontWeight: 'bold'}}>{runStateTitles[runState]}</Text></>
                            )
                        )}
                    </Text>

                    {runState !== runStates.FINISHED && (
                        runState === runStates.NOT_STARTED ? (
                            <TouchableOpacity onPressIn={() => handleStartBtnPressIn()}
                                              onPressOut={() => handleStartBtnPressOut()}
                                              style={[styles.button, {backgroundColor: '#00FF00'}]}>
                                {isStartBtnPressed ? <Text>Starting...</Text> : <Text>Start</Text>}
                            </TouchableOpacity>
                        ) : ( // runState === runStates.RUNNING || runState === runStates.PAUSED
                            <>
                                <TouchableOpacity onPress={() => runAction()}
                                                  style={[styles.button, {
                                                      backgroundColor: runState === runStates.RUNNING ? '#FFFF00' : '#00AAFF',
                                                  }]}>
                                    {runState === runStates.RUNNING ? <Text>Pause</Text> : <Text>Resume</Text>}
                                </TouchableOpacity>

                                <TouchableOpacity onPressIn={() => handleStopBtnPressIn()}
                                                  onPressOut={() => handleStopBtnPressOut()}
                                                  style={[styles.button, {backgroundColor: '#FF0000'}]}>
                                    {isStopBtnPressed ? <Text>Stopping...</Text> : <Text>Stop</Text>}
                                </TouchableOpacity>
                            </>
                        )
                    )}

                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        padding: 10,
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 5,
        width: 100,
    },
});

export default RunScreen;
