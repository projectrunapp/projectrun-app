
import {useEffect} from 'react';
import {Audio, InterruptionModeAndroid, InterruptionModeIOS} from 'expo-av';
import {sleep} from "../utils/helper";
import audioFiles from "../utils/AudioFiles";

export const useSoundPlayer = () => {
    const playSound = async (fileName: string) => {
        const { sound } = await Audio.Sound.createAsync(audioFiles[fileName].file);

        try {
            await sound.playAsync(); // Play the sound
            await sound.setOnPlaybackStatusUpdate(async (status) => {
                // Wait for the sound to finish playing
                if (status.didJustFinish) {
                    await sound.unloadAsync(); // Unload the sound when playback is complete
                }
            });
        } catch (error) {
            console.error(error.message);
        }
    };

    const playSequentialSounds = async (fileNames: string[]) => {
        for (let i = 0; i < fileNames.length; i++) {
            const fileName = fileNames[i];
            if (audioFiles[fileName]) {
                await playSound(fileName);
                await sleep(audioFiles[fileName].duration * 1000 + 50);
            }
        }
    };

    const initAudioMode = async () => {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            interruptionModeIOS: InterruptionModeIOS.DuckOthers,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
            playThroughEarpieceAndroid: false,
        });
    };

    useEffect(() => {
        initAudioMode();
    }, []);

    return { playSequentialSounds };
};
