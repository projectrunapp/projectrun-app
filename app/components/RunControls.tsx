
import {TouchableOpacity, StyleSheet, View, Text} from 'react-native';
import {runStateTitles, runStates, startRunBtnPressSeconds} from "../utils/app-constants";
import React, {useState} from "react";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export default function RunControls({
                                        showPopup,
                                        permissionAllowed,
                                        startRunProcessing,
                                        runState,
                                        setRunState,
                                        setRunStartedAt,
                                        startCountdownSeconds,
                                        setStartCountdownSeconds,
                                        isStartBtnPressed,
                                        setIsStartBtnPressed
}) {
    const handleStartBtnPressIn = () => {
        setIsStartBtnPressed(true);
        this.startBtnPressedInTime = Date.now();

        this.intervalForStart = setInterval(() => {
            if (Math.floor((Date.now() - this.startBtnPressedInTime) / 1000) >= startRunBtnPressSeconds) {
                // showPopup(true, "Run started.");
                setStartCountdownSeconds(startRunBtnPressSeconds);

                clearInterval(this.intervalForStart);
                this.startBtnPressedInTime = 0;
                setIsStartBtnPressed(false);

                setRunState(runStates.RUNNING);
                setRunStartedAt(Date.now());

                startRunProcessing();
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

    if (!permissionAllowed) {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text style={{fontSize: 18, marginBottom: 16}}>
                    Please allow location access to start a run.
                </Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>

                <Text style={{fontSize: 18, marginBottom: 16}}>
                    {isStartBtnPressed ? (
                        (startCountdownSeconds === 0) ?
                            <>Preparing to start...</> :
                            <>Run will start in <Text style={{fontWeight: 'bold'}}>{startCountdownSeconds}</Text> seconds...</>
                    ) : (
                        <>State: <Text style={{fontWeight: 'bold'}}>{runStateTitles[runState]}</Text></>
                    )}
                </Text>

                {
                    runState === runStates.NOT_STARTED && (
                        <TouchableOpacity onPressIn={() => handleStartBtnPressIn()}
                                          onPressOut={() => handleStartBtnPressOut()}
                                          style={[styles.round_button, {backgroundColor: '#00FF00'}]}>
                            <MaterialCommunityIcons name="play" size={32} color={'black'} />
                        </TouchableOpacity>
                    )
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    round_button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 50,
        // width: 100,
        // height: 100,
    },
});
