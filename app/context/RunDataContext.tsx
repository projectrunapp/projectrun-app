
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import { createContext, useContext } from 'react';
import {calculateDistanceInMeters, generateRunTitle} from "../utils/helper";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {runStates, voiceNotification} from "../utils/app-constants";

const RunDataContext = createContext({});

export const useRunData = () => {
    return useContext(RunDataContext);
};

export const RunDataProvider = ({ children }: any) => {
    // TODO: remove unnecessary methods
    /*
    LOCAL STORAGE KEYS:
    `runs` - array of runs
    `runs_count` - number of runs
    `run_state` - see runStates in app-constants.ts
    `run_coordinates_{runNumber}` - array of coordinates of a run
    `voice_notification_settings` - voice notifications default settings
    `voice_notification_info` - info about voice notification

    RUNS SCHEMA EXAMPLE:
    [
      {
        "run_number": 1,
        "timestamp_started": 1692000000,
        "timestamp_last_updated": 1692000020,
        "coordinates_count": 3,
        "first_coordinate": {
          "lat": 34.1374000,
          "lng": -118.2225000
        },
        "last_coordinate": {
          "lat": 34.1375000,
          "lng": -118.2226000,
          "is_active": true
        },
        "title": "title",
        "pauses_count": 2,
        "distance": 2000,
        "distance_pauses_included": 2500,
        "duration": 5000,
        "duration_pauses_included": 6000,
        "avg_speed": 8.5,
        "avg_speed_pauses_included": 7.5
      },
      ...
    ]

    RUNS_COUNT SCHEMA EXAMPLE:
    1

    RUN_STATE SCHEMA EXAMPLE:
    1

    RUN_COORDINATES_<runNumber> SCHEMA EXAMPLE:
    [
      {
        "lat": 34.1374000,
        "lng": -118.2225000,
        "timestamp": 1693000000,
        "is_active": true,
        "pauses_count": 0,
        "distance_piece": 0,
        "distance_total": 0,
        "distance_total_pauses_included": 0,
        "duration_piece": 0,
        "duration_total": 0,
        "duration_total_pauses_included": 0,
        "avg_speed_piece": 0,
        "avg_speed_total": 0,
        "avg_speed_total_pauses_included": 0
      },
      ...
      {
        "lat": 34.1375000,
        "lng": -118.2226000,
        "timestamp": 1693001000,
        "is_active": false,
        "pauses_count": 0,
        "distance_piece": 20,
        "distance_total": 2000,
        "distance_total_pauses_included": 2500,
        "duration_piece": 10,
        "duration_total": 5000,
        "duration_total_pauses_included": 6000,
        "avg_speed_piece": 7.9,
        "avg_speed_total": 8.5,
        "avg_speed_total_pauses_included": 7.5
      }
    ]

    VOICE_NOTIFICATION_SETTINGS SCHEMA EXAMPLE:
    {
        "enabled": true,
        "by": "distance",
        "each_distance": 1000,
        "each_time": 600
    }

    VOICE_NOTIFICATION_INFO SCHEMA EXAMPLE:
    {
        "notified": false,
        "enabled": true,
        "by": "distance",
        "next_distance": 1000,
        "next_time": 600
    }
    */

    const storageGetRunState = async (): Promise<number> => {
        const runState = await AsyncStorage.getItem('run_state');
        if (runState) {
            return parseInt(runState);
        } else {
            await storageSetRunState(runStates.NOT_STARTED);
            return runStates.NOT_STARTED;
        }
    }

    const storageSetRunState = async (runState: number) => {
        await AsyncStorage.setItem('run_state', runState.toString());
    }

    const storageCreateRun = async (): Promise<{
        success: boolean,
        message: string,
        data?: {
            title: string,
        },
    }> => {
        const storageRunState = await storageGetRunState();
        if (storageRunState === runStates.RUNNING || storageRunState === runStates.PAUSED) {
            // console.info("Storage run state is already running or paused!");
            return;
        } else {
            await storageSetRunState(runStates.RUNNING);
        }

        const runsCount = await storageGetRunsCount();
        const date = new Date();
        const unixTimeInSecond = Math.round(date.getTime() / 1000);

        const runsJson = await AsyncStorage.getItem('runs');
        let runs = [];
        if (runsJson) {
            runs = JSON.parse(runsJson);
        }

        const runTitle = generateRunTitle(date.getHours());

        await AsyncStorage.setItem('runs', JSON.stringify([...runs, {
            run_number: runsCount + 1,
            timestamp_started: unixTimeInSecond,
            timestamp_last_updated: unixTimeInSecond,
            coordinates_count: 0, // coordinatesCount
            first_coordinate: null,
            last_coordinate: null,
            title: runTitle,
            pauses_count: 0, // pausesCount
            distance: 0, // distance
            distance_pauses_included: 0, // distancePausesIncluded
            duration: 0, // duration
            duration_pauses_included: 0, // durationPausesIncluded
            avg_speed: 0, // avgSpeed
            avg_speed_pauses_included: 0, // avgSpeedPausesIncluded
        }]));

        // increment runs_count
        await AsyncStorage.setItem('runs_count', (runsCount + 1).toString());

        // set run state to running
        await storageSetRunState(runStates.RUNNING);

        return {
            success: true,
            message: "Run created.",
            data: {
                title: runTitle,
            },
        };
    }

    // add coordinate to "run_coordinates_{runNumber}"
    const storageAddRunCoordinate = async (lat: number, lng: number, isActive: boolean): Promise<{
        success: boolean,
        message: string,
        data?: {
            distance: number,
            duration: number,
            avg_speed: number,
        },
    }> => {
        const storageRunState = await storageGetRunState();
        if (storageRunState !== runStates.RUNNING && storageRunState !== runStates.PAUSED) {
            return {
                success: false,
                message: "Storage run state is not running or paused!",
            };
        }

        const date = new Date();
        const unixTimeInSecond = Math.round(date.getTime() / 1000);

        let runs = [],
            pausesCount = 0,
            runCoordinates = [],
            distance = 0, distancePausesIncluded = 0, distancePiece = 0,
            duration = 0, durationPausesIncluded = 0, durationPiece = 0,
            avgSpeed = 0, avgSpeedPausesIncluded = 0, avgSpeedPiece = 0,
            resultDistance = 0, resultDuration = 0, resultAvgSpeed = 0;

        const runsCount = await storageGetRunsCount();

        const runsJson = await AsyncStorage.getItem('runs');
        if (runsJson) {
            runs = JSON.parse(runsJson);
        }



        const runIndex = runsCount - 1;
        // runs[runIndex].run_number is the same as runsCount;

        // coordinates_count
        const coordinatesCount = parseInt(runs[runIndex].coordinates_count);
        runs[runIndex].coordinates_count = coordinatesCount + 1;

        // first coordinate
        const firstCoordinate = runs[runIndex].first_coordinate;
        if (!firstCoordinate) { // coordinatesCount === 0
            runs[runIndex].first_coordinate = {
                lat,
                lng,
            };
        }

        // last_coordinate & pauses_count
        const lastCoordinate = runs[runIndex].last_coordinate;
        if ((lastCoordinate && lastCoordinate.is_active && !isActive) || (!lastCoordinate && !isActive)) {
            pausesCount = parseInt(runs[runIndex].pauses_count) + 1;
            runs[runIndex].pauses_count = pausesCount;
        }
        runs[runIndex].last_coordinate = {
            lat,
            lng,
            is_active: isActive,
        };

        if (coordinatesCount > 0) {
            // distance_piece & distance & distance_pauses_included
            const distancePieceWithDecimals = calculateDistanceInMeters(
                parseFloat(lastCoordinate.lat),
                parseFloat(lastCoordinate.lng),
                lat,
                lng,
            );
            distancePiece = Math.round(distancePieceWithDecimals);
            if (isActive) {
                distance = parseInt(runs[runIndex].distance) + distancePiece;
                runs[runIndex].distance = distance;
                resultDistance = distance;
            } else {
                resultDistance = parseInt(runs[runIndex].distance);
            }
            distancePausesIncluded = parseInt(runs[runIndex].distance_pauses_included) + distancePiece;
            runs[runIndex].distance_pauses_included = distancePausesIncluded;

            // duration_piece & duration & duration_pauses_included
            const durationPiece = unixTimeInSecond - parseInt(runs[runIndex].timestamp_last_updated);
            if (isActive) {
                duration = parseInt(runs[runIndex].duration) + durationPiece;
                runs[runIndex].duration = duration;
                resultDuration = duration;
            } else {
                resultDuration = parseInt(runs[runIndex].duration);
            }
            durationPausesIncluded = parseInt(runs[runIndex].duration_pauses_included) + durationPiece;
            runs[runIndex].duration_pauses_included = durationPausesIncluded;

            // updateAt
            runs[runIndex].timestamp_last_updated = unixTimeInSecond;

            // avg_speed_piece & avg_speed & avg_speed_pauses_included
            // TODO: calculate in km/h
            avgSpeedPiece = Math.round((distancePiece / durationPiece) * 100) / 100;
            if (isActive) {
                avgSpeed = Math.round(parseInt(runs[runIndex].distance) / parseInt(runs[runIndex].duration) * 100) / 100;
                runs[runIndex].avg_speed = avgSpeed;
                resultAvgSpeed = avgSpeed;
            } else {
                resultAvgSpeed = Math.round(parseInt(runs[runIndex].distance) / parseInt(runs[runIndex].duration) * 100) / 100;
            }
            avgSpeedPausesIncluded = Math.round(parseInt(runs[runIndex].duration_pauses_included) / parseInt(runs[runIndex].distance_pauses_included) * 100) / 100;
            runs[runIndex].avg_speed_pauses_included = avgSpeedPausesIncluded;
        }

        // update run
        await AsyncStorage.setItem('runs', JSON.stringify(runs));



        const runCoordinatesJson = await AsyncStorage.getItem(`run_coordinates_${runsCount}`);
        if (runCoordinatesJson) {
            runCoordinates = JSON.parse(runCoordinatesJson);
        }
        runCoordinates.push({
            lat,
            lng,
            timestamp: unixTimeInSecond,

            is_active: isActive,
            pauses_count: pausesCount,

            distance_piece: distancePiece,
            distance: distance,
            distance_pauses_included: distancePausesIncluded,

            duration_piece: durationPiece,
            duration: duration,
            duration_pauses_included: durationPausesIncluded,

            avg_speed_piece: avgSpeedPiece,
            avg_speed: avgSpeed,
            avg_speed_pauses_included: avgSpeedPausesIncluded,
        });
        await AsyncStorage.setItem(`run_coordinates_${runsCount}`, JSON.stringify(runCoordinates));

        return {
            success: true,
            message: "Run coordinate added.",
            data: {
                distance: resultDistance,
                duration: resultDuration, // TODO: fix for runs with pauses
                avg_speed: resultAvgSpeed,
            },
        };
    }

    // stop run by making run state to NOT_STARTED
    const storageStopRun = async (): Promise<{
        success: boolean,
        message: string,
        data?: {
            distance: number,
            duration: number,
            avg_speed: number,
        }
    }> => {
        // get the last received distance, duration, avg_speed by the last coordinate
        const storageRunState = await storageGetRunState();
        if (storageRunState !== runStates.RUNNING && storageRunState !== runStates.PAUSED) {
            return {
                success: false,
                message: "Storage run state is not running or paused!",
            };
        }

        const runsCount = await storageGetRunsCount();
        const runCoordinatesJson = await AsyncStorage.getItem(`run_coordinates_${runsCount}`);
        if (!runCoordinatesJson) {
            return {
                success: false,
                message: "No run coordinates in storage!",
            }
        }

        const runCoordinates = JSON.parse(runCoordinatesJson);
        const lastCoordinate = runCoordinates[runCoordinates.length - 1];
        const distance = lastCoordinate.distance;
        const duration = lastCoordinate.duration;
        const avgSpeed = lastCoordinate.avg_speed;

        await storageSetRunState(runStates.NOT_STARTED);

        // clear voice_notification_info
        await AsyncStorage.removeItem('voice_notification_info');

        return {
            success: true,
            message: "Run stopped.",
            data: {
                distance,
                duration,
                avg_speed: avgSpeed,
            }
        };
    }

    // get runs from "runs"
    const storageGetRuns = async () => {
        const runsJson = await AsyncStorage.getItem('runs');
        if (runsJson) {
            return JSON.parse(runsJson);
        }
        return [];
    }

    // get run from "runs" (get last run if runNumber is not provided)
    const storageGetRun = async (runNumber?: number) => {
        const runsJson = await AsyncStorage.getItem('runs');
        if (runsJson) {
            const runs = JSON.parse(runsJson);
            if (runNumber) {
                return runs.find((run) => parseInt(run.run_number) === runNumber);
            } else {
                return runs[runs.length - 1];
            }
        }

        return null;
    }

    // get run coordinates from "run_coordinates_{runNumber}" (get last run coordinates if runNumber is not provided)
    const storageGetRunCoordinates = async (runNumber?: number) => {
        let runCoordinates = [], runCoordinatesJson = null, coordinates = [];
        if (runNumber) {
            runCoordinatesJson = await AsyncStorage.getItem(`run_coordinates_${runNumber}`);
        } else {
            const runsCount = await storageGetRunsCount();
            runCoordinatesJson = await AsyncStorage.getItem(`run_coordinates_${runsCount}`);
        }

        if (runCoordinatesJson) {
            runCoordinates = JSON.parse(runCoordinatesJson);
        }

        return runCoordinates;
    };

    // update run title in "runs"
    const storageUpdateRun = async (runNumber: number, title: string) => {
        const runsJson = await AsyncStorage.getItem('runs');
        if (runsJson) {
            const runs = JSON.parse(runsJson);
            const run = runs.find((run) => parseInt(run.run_number) === runNumber);
            run.title = title;
            await AsyncStorage.setItem('runs', JSON.stringify(runs));
        }
    }

    // delete run from "runs" and its coordinates "run_coordinates_{runNumber}"
    const storageDeleteRun = async (runNumber: number) => {
        const runsJson = await AsyncStorage.getItem('runs');
        if (runsJson) {
            const runs = JSON.parse(runsJson);
            const newRuns = runs.filter((run) => parseInt(run.run_number) !== runNumber);
            await AsyncStorage.setItem('runs', JSON.stringify(newRuns));
        }
        await AsyncStorage.removeItem(`run_coordinates_${runNumber}`);

        // decrement runs_count
        const runsCount = await storageGetRunsCount();
        await AsyncStorage.setItem('runs_count', (runsCount - 1).toString());
    }

    // get all the runs and its coordinates
    const storageGetAllRunsData = async () => {
        const runsJson = await AsyncStorage.getItem('runs');
        if (runsJson) {
            const runs = JSON.parse(runsJson);
            const runsCount = runs.length;
            const allRuns = [];
            for (let i = 1; i <= runsCount; i++) {
                const runCoordinatesJson = await AsyncStorage.getItem(`run_coordinates_${i}`);
                if (runCoordinatesJson) {
                    const runCoordinates = JSON.parse(runCoordinatesJson);
                    allRuns.push({
                        ...runs[i - 1],
                        coordinates: runCoordinates,
                    });
                }
            }
            return allRuns;
        }
        return [];
    }

    // clear all runs and its coordinates
    const storageFlushAllRunsData = async () => {
        const runsJson = await AsyncStorage.getItem('runs');
        if (runsJson) {
            const runsCount = JSON.parse(runsJson).length;
            for (let i = 1; i <= runsCount; i++) {
                await AsyncStorage.removeItem(`run_coordinates_${i}`);
            }
            await AsyncStorage.removeItem('runs');
        }

        await AsyncStorage.setItem('runs_count', '0');
        await storageSetRunState(runStates.NOT_STARTED);
    }

    const storageVoiceNotificationInfo = async (distance: number, duration: number): Promise<boolean> => {
        let existingInfo;
        const voiceNotificationInfoJson = await AsyncStorage.getItem('voice_notification_info');
        if (voiceNotificationInfoJson) {
            existingInfo = JSON.parse(voiceNotificationInfoJson);
            if (!existingInfo.enabled) {
                return false;
            }

            const voiceNotificationSettingsJson = await AsyncStorage.getItem('voice_notification_settings');
            const voiceNotificationSettings = JSON.parse!(voiceNotificationSettingsJson);

            let needToNotify = false;
            if (distance >= parseInt(existingInfo.next_distance)) {
                if (voiceNotificationSettings.by === 'distance' && !existingInfo.notified) {
                    needToNotify = true;
                }
                existingInfo.next_distance = parseInt(existingInfo.next_distance) + parseInt(voiceNotificationSettings.each_distance);
            }
            if (duration >= parseInt(existingInfo.next_time)) {
                if (voiceNotificationSettings.by === 'time' && !existingInfo.notified) {
                    needToNotify = true;
                }
                existingInfo.next_time = parseInt(existingInfo.next_time) + parseInt(voiceNotificationSettings.each_time);
            }

            existingInfo.notified = needToNotify;

            await AsyncStorage.setItem('voice_notification_info', JSON.stringify(existingInfo));

            return needToNotify;
        } else {
            // get voice notification settings
            let voiceNotificationSettings;
            const voiceNotificationSettingsJson = await AsyncStorage.getItem('voice_notification_settings');
            if (voiceNotificationSettingsJson) {
                voiceNotificationSettings = JSON.parse(voiceNotificationSettingsJson);
            } else {
                voiceNotificationSettings = {
                    enabled: voiceNotification.enabled,
                    by: voiceNotification.by,
                    each_distance: voiceNotification.each_distance,
                    each_time: voiceNotification.each_time,
                };
                await AsyncStorage.setItem('voice_notification_settings', JSON.stringify(voiceNotification));
            }

            existingInfo = {
                notified: false,
                enabled: voiceNotificationSettings.enabled,
                by: voiceNotificationSettings.by,
                next_distance: voiceNotificationSettings.each_distance,
                next_time: voiceNotificationSettings.each_time,
            };
            await AsyncStorage.setItem('voice_notification_info', JSON.stringify(existingInfo));

            return false;
        }
    }

    const storageGetVoiceNotificationSettings = async (): Promise<{
        enabled: boolean,
        by: string,
        each_distance: number,
        each_time: number,
    }> => {
        let voiceNotificationSettings;
        const voiceNotificationSettingsJson = await AsyncStorage.getItem('voice_notification_settings');
        if (voiceNotificationSettingsJson) {
            voiceNotificationSettings = JSON.parse(voiceNotificationSettingsJson);
        } else {
            voiceNotificationSettings = {
                enabled: voiceNotification.enabled,
                by: voiceNotification.by,
                each_distance: voiceNotification.each_distance,
                each_time: voiceNotification.each_time,
            };
            await AsyncStorage.setItem('voice_notification_settings', JSON.stringify(voiceNotificationSettings));
        }

        return voiceNotificationSettings;
    }

    const storageSetVoiceNotificationSettings = async (settings: {
        enabled: boolean,
        by: string,
        each_distance: number,
        each_time: number,
    }) => {
        let voiceNotificationSettings;
        const voiceNotificationSettingsJson = await AsyncStorage.getItem('voice_notification_settings');
        if (voiceNotificationSettingsJson) {
            voiceNotificationSettings = JSON.parse(voiceNotificationSettingsJson);
        } else {
            voiceNotificationSettings = {
                enabled: voiceNotification.enabled,
                by: voiceNotification.by,
                each_distance: voiceNotification.each_distance,
                each_time: voiceNotification.each_time,
            };
        }

        voiceNotificationSettings.enabled = settings.enabled;
        voiceNotificationSettings.by = settings.by;
        voiceNotificationSettings.each_distance = settings.each_distance;
        voiceNotificationSettings.each_time = settings.each_time;

        await AsyncStorage.setItem('voice_notification_settings', JSON.stringify(voiceNotificationSettings));
    }



    // Check if there is an internet connection.
    // If yes, send all runs and its coordinates to server flush them from local storage
    const sendAllRunsDataToServer = async () => {
        NetInfo.fetch().then(async (state) => {
            if (!state.isConnected) {
                // console.info("No internet connection!");
                return;
            }

            // get all the storage runs and its coordinates
            const allRunsData = await storageGetAllRunsData();
            if (allRunsData.length === 0) {
                // console.error("No runs data in storage!");
                return;
            }

            // get auth token
            const token = await SecureStore.getItemAsync(process.env.JWT_KEY);
            if (!token) {
                // console.error("No auth token!");
                return;
            }

            // sync storage runs and its coordinates with server
            const isSynced = await syncWithServer(token, allRunsData);
            if (!isSynced) {
                // console.error("Runs data wasn't synced!");
                return;
            }

            await storageFlushAllRunsData();
        });
    }



    // INTERNAL METHODS
    // get runs_count from "runs_count"
    const storageGetRunsCount = async (): Promise<number> => {
        const runsCountString = await AsyncStorage.getItem('runs_count');
        if (runsCountString) {
            return parseInt(runsCountString);
        } else {
            await AsyncStorage.setItem('runs_count', '0');
            return 0;
        }
    }
    // sync storage runs and its coordinates with server
    const syncWithServer = async (token: string, data: any): Promise<boolean> => {
        try {
            const response = await axios.put(`${process.env.API_URL}/run/sync`, {
                runs_data: data,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    // "Content-Type": "application/json",
                },
            });

            return response.data.success;
        } catch (err) {
            // console.error(err.message);
            return false;
        }
    }



    return (
        <RunDataContext.Provider value={{
            storageGetRunState,
            storageSetRunState,
            storageCreateRun,
            storageAddRunCoordinate,
            storageStopRun,
            storageGetRuns,
            storageGetRun,
            storageGetRunCoordinates,
            storageUpdateRun,
            storageDeleteRun,
            storageGetAllRunsData,
            storageVoiceNotificationInfo,
            storageGetVoiceNotificationSettings,
            storageSetVoiceNotificationSettings,
            sendAllRunsDataToServer,
        }}>
            {children}
        </RunDataContext.Provider>
    );
};
