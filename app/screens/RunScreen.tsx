
import * as React from 'react';
import {TouchableOpacity, StyleSheet, View, Text, SafeAreaView} from 'react-native';
import {runStateTitles, runStates, stopRunBtnPressSeconds} from "../utils/app-constants";

const RunScreen = ({ route, navigation }) => {
    const [runState, setRunState] = React.useState<number>(runStates.NOT_STARTED);
    const runAction = () => {
        if (runState === runStates.NOT_STARTED) {
            setRunState(runStates.RUNNING);
        } else if (runState === runStates.RUNNING) {
            setRunState(runStates.PAUSED);
        } if (runState === runStates.PAUSED) {
            setRunState(runStates.RUNNING);
        }
    };

    const [stopCountdownSeconds, setStopCountdownSeconds] = React.useState(stopRunBtnPressSeconds); // 3
    const [isPressed, setIsPressed] = React.useState(false);
    const handlePressIn = () => {
        setIsPressed(true);
        this.pressedInTime = Date.now();

        this.interval = setInterval(() => {
            if (Math.floor((Date.now() - this.pressedInTime) / 1000) >= stopRunBtnPressSeconds) {
                console.log("Run stopped.");
                setStopCountdownSeconds(stopRunBtnPressSeconds);

                clearInterval(this.interval);
                this.pressedInTime = 0;
                setIsPressed(false);

                setRunState(runStates.FINISHED);
                // ...
            } else {
                console.log("Pressed time: ", Math.floor((Date.now() - this.pressedInTime) / 1000));
                setStopCountdownSeconds(prevState => prevState - 1);
            }
        }, 1000);
    };
    const handlePressOut = () => {
        console.log("Run resumed.");
        setStopCountdownSeconds(stopRunBtnPressSeconds);

        clearInterval(this.interval);
        this.pressedInTime = 0;
        setIsPressed(false);
    };

    // create a fixed rectangle at the top of the screen with 300px of height for the map
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, padding: 16 }}>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>

                    {isPressed ? (
                        <Text style={{fontSize: 18, marginBottom: 16}}>
                            Run will be stopped in <Text style={{fontWeight: 'bold'}}>{stopCountdownSeconds}</Text> seconds...
                        </Text>
                    ) : (
                        <Text style={{fontSize: 18, marginBottom: 16}}>
                            State: <Text style={{fontWeight: 'bold'}}>{runStateTitles[runState]}</Text>
                        </Text>
                    )}

                    {runState !== runStates.FINISHED && (
                        <TouchableOpacity style={[styles.button, {
                            backgroundColor: runState === runStates.NOT_STARTED ? '#00FF00' : (
                                runState === runStates.RUNNING ? '#FFFF00' : '#00AAFF'
                            ),
                        }]} onPress={() => runAction()}>{
                            runState === runStates.NOT_STARTED ? <Text>Start</Text> : (
                                runState === runStates.RUNNING ? <Text>Pause</Text> : <Text>Resume</Text>
                            )
                        }</TouchableOpacity>
                    )}

                    {(runState === runStates.RUNNING || runState === runStates.PAUSED) && (
                        <TouchableOpacity style={[styles.button, {
                            backgroundColor: '#FF0000',
                        }]} onPressIn={() => handlePressIn()}
                        onPressOut={() => handlePressOut()}>
                            {isPressed ? <Text>Stopping...</Text> : <Text>Stop</Text>}
                        </TouchableOpacity>
                    )}

                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 5,
        width: 100,
    },
});

export default RunScreen;
