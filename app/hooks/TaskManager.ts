
import { useEffect } from "react";
import * as TaskManager from "expo-task-manager";
import {runStates, trackingTask, updateLocationTimeoutSeconds} from "../utils/app-constants";
import { collectVoices } from "../utils/helper";
import * as Location from "expo-location";
import { useRunData } from "../context/RunDataContext";
import TrackPlayer, {Event, useTrackPlayerEvents} from "react-native-track-player";
import audioFiles from "../utils/AudioFiles";

export const useTaskManager = () => {
    const { storageGetRunState, storageAddRunCoordinate, storageVoiceNotificationInfo } = useRunData();

    const initPlayer = async () => {
        try {
            await TrackPlayer.setupPlayer();
            // await TrackPlayer.updateOptions({
            //     capabilities: [Capability.Play, Capability.SkipToNext],
            // });
        } catch (error) {
            console.error(error);
        }
    };
    const getTrackData = async () => {
        const trackIndex = await TrackPlayer.getCurrentTrack();
        const track = await TrackPlayer.getTrack!(trackIndex);
    };
    const playSequentialSounds = async (voices: string[]) => {
        const tracks = voices.map(voice => {
            return {
                url: audioFiles[voice].file,
                title: voice,
                artist: voice,
                artwork: "https://avatars.githubusercontent.com/u/22226570",
            };
        });

        try {
            await TrackPlayer.add(tracks);
            await getTrackData();
            await TrackPlayer.play();
        } catch (error) {
            console.error(error);
        }
    };
    useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackQueueEnded], async event => {
        if (event.type === Event.PlaybackQueueEnded && event.nextTrack == undefined) {
            await TrackPlayer.reset();
        }
        if (event.type === Event.PlaybackTrackChanged && event.nextTrack != undefined) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
        }
    });

    useEffect(() => {
        initPlayer();
    }, []);

    const registerTask = async () => {
        TaskManager.defineTask(trackingTask.name, async ({ data, error }) => {
            if (error) {
                console.error(error);
                return;
            }
            if (data) {
                const { locations } = data;
                const location = locations[0];
                if (location) {
                    const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false });
                    console.info(`BACKGROUND: ${currentTime} >>> ${location.coords.latitude}, ${location.coords.longitude}`);

                    const storageRunState = await storageGetRunState();
                    if (storageRunState === runStates.RUNNING || storageRunState === runStates.PAUSED) {
                        const result = await storageAddRunCoordinate(location.coords.latitude, location.coords.longitude, storageRunState);
                        if (result.success) {
                            const needToNotify = await storageVoiceNotificationInfo(result.data.distance, result.data.duration);
                            if (needToNotify) {
                                const voices = collectVoices(result.data, []);
                                playSequentialSounds(voices); // TODO: play audio in background
                            }
                        }
                    }
                }
            }
        });

        return () => {
            // Unregister the task when the component unmounts.
            TaskManager.unregisterTaskAsync(trackingTask.name);
        };
    };

    // Register the task with TaskManager.
    useEffect(() => {
        registerTask();
    }, []);

    const startTask = async () => {
        await Location.startLocationUpdatesAsync(trackingTask.name, {
            showsBackgroundLocationIndicator: true,
            timeInterval: updateLocationTimeoutSeconds * 1000,
            accuracy: Location.Accuracy.BestForNavigation,
            foregroundService: {
                notificationTitle: trackingTask.title,
                notificationBody: trackingTask.body,
                notificationColor: trackingTask.color,
            },
        });
    };

    return { startTask };
};
