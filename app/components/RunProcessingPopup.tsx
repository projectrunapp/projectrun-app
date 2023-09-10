
import {View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {
    appPrimaryColor,
    guaranteeSecondsAfterStartBtnPress,
    runStates,
    stopRunBtnPressSeconds
} from "../utils/app-constants";
import {useState} from "react";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useRunData} from "../context/RunDataContext";

export default function RunProcessingPopup({
                                               isVisible,
                                               // onClose,
                                               showPopup,
                                               runState,
                                               setRunState,
                                               runStartedAt,
                                               stopRunProcessing,
                                               stopRunLoading
                                           }) {
    const { storageSetRunState } = useRunData();

    const pauseOrResume = () => {
        // check that the "Pause" ("Resume") button hasn't pressed automatically after holding the "Start" button
        if (runStartedAt !== 0 && Date.now() - runStartedAt >= guaranteeSecondsAfterStartBtnPress * 1000) {
            if (runState === runStates.RUNNING) {
                showPopup(true, "Run paused.");
                setRunState(runStates.PAUSED);

                // call the async method without await
                storageSetRunState(runStates.PAUSED);
            }
            if (runState === runStates.PAUSED) {
                showPopup(true, "Run resumed.");
                setRunState(runStates.RUNNING);

                // call the async method without await
                storageSetRunState(runStates.RUNNING);
            }
        }
    };

    const [stopCountdownSeconds, setStopCountdownSeconds] = useState(stopRunBtnPressSeconds);
    const [isStopBtnPressed, setIsStopBtnPressed] = useState(false);
    const handleStopBtnPressIn = () => {
        setIsStopBtnPressed(true);
        this.stopBtnPressedInTime = Date.now();

        this.intervalForStop = setInterval(() => {
            if (Math.floor((Date.now() - this.stopBtnPressedInTime) / 1000) >= stopRunBtnPressSeconds) {
                // showPopup(true, "Run stopped.");
                setStopCountdownSeconds(stopRunBtnPressSeconds);

                clearInterval(this.intervalForStop);
                this.stopBtnPressedInTime = 0;
                setIsStopBtnPressed(false);

                setRunState(runStates.FINISHED);

                stopRunProcessing();
            } else {
                // console.info("Stop button pressed time: ", Math.floor((Date.now() - this.stopBtnPressedInTime) / 1000));
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

    return (
        <Modal visible={isVisible}
               // onRequestClose={onClose}
               animationType="slide"
               transparent={false}>
            <View style={styles.full_screen_container}>
                <View style={styles.popup}>
                    <Text style={styles.text}>
                        Morning Run!
                    </Text>
                    <Text style={{fontSize: 18, marginBottom: 16}}>
                        {isStopBtnPressed ? (
                            (stopCountdownSeconds === 0) ?
                                <>Preparing to stop...</> :
                                <>Run will stop after <Text style={{fontWeight: 'bold'}}>{stopCountdownSeconds}</Text> seconds...</>
                        ) : (
                            <Text>Run Processing...</Text>
                        )}
                    </Text>
                    {(runState === runStates.RUNNING || runState === runStates.PAUSED) && (
                        <View style={styles.buttons_container}>
                            {runState === runStates.RUNNING ? (
                                <TouchableOpacity onPress={() => pauseOrResume()} style={[styles.round_button, {
                                    backgroundColor: '#FFFF00',
                                }]}>
                                    <MaterialCommunityIcons name="pause" size={32} color={'black'} />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={() => pauseOrResume()} style={[styles.round_button, {
                                    backgroundColor: '#00AAFF',
                                }]}>
                                    <MaterialCommunityIcons name="play" size={32} color={'black'} />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity onPressIn={() => handleStopBtnPressIn()}
                                              onPressOut={() => handleStopBtnPressOut()}
                                              style={[styles.round_button, {
                                                  backgroundColor: isStopBtnPressed ? '#FF7B7B' : '#FF0000',
                                              }]}>
                                <MaterialCommunityIcons name={isStopBtnPressed ? "stop-circle-outline" : "stop"} size={32} color={'black'} />
                            </TouchableOpacity>
                        </View>
                    )}
                    {stopRunLoading && (
                        <View style={styles.loading_container}>
                            <Text style={styles.loading_text}>
                                Preparing to stop...
                            </Text>
                            <View style={styles.loading_spinner}>
                                <ActivityIndicator size="large" />
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    full_screen_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popup: {
        backgroundColor: appPrimaryColor,
        width: '100%',
        height: '100%',
        padding: 20,
    },
    text: {
        fontSize: 14,
    },
    buttons_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    round_button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 50,
        width: 100,
        height: 100,
    },
    loading_container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loading_text: {
        fontSize: 18,
        marginBottom: 16,
    },
    loading_spinner: {
        marginTop: 16,
    },
    close_btn: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
});
