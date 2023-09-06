
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import { createContext, useContext } from 'react';
import {calculateDistanceInMeters, generateRunTitle} from "../utils/helper";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {runStates} from "../utils/app-constants";

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

    const storageCreateRun = async () => {
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

        await AsyncStorage.setItem('runs', JSON.stringify([...runs, {
            run_number: runsCount + 1,
            timestamp_started: unixTimeInSecond,
            timestamp_last_updated: unixTimeInSecond,
            coordinates_count: 0, // coordinatesCount
            first_coordinate: null,
            last_coordinate: null,
            title: generateRunTitle(date.getHours()),
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
    }

    // add coordinate to "run_coordinates_{runNumber}"
    const storageAddRunCoordinate = async (lat: number, lng: number, isActive: boolean) => {
        const storageRunState = await storageGetRunState();
        if (storageRunState !== runStates.RUNNING && storageRunState !== runStates.PAUSED) {
            // console.info("Storage run state is not running or paused!");
            return;
        }

        const date = new Date();
        const unixTimeInSecond = Math.round(date.getTime() / 1000);

        let runs = [],
            pausesCount = 0,
            runCoordinates = [],
            distance = 0, distancePausesIncluded = 0, distancePiece = 0,
            duration = 0, durationPausesIncluded = 0, durationPiece = 0,
            avgSpeed = 0, avgSpeedPausesIncluded = 0, avgSpeedPiece = 0;

        const runsCount = await storageGetRunsCount();

        const runsJson = await AsyncStorage.getItem('runs');
        if (runsJson) {
            runs = JSON.parse(runsJson);
        }



        const runIndex = runsCount - 1;
        // runs[runIndex].run_number is the same as runsCount;

        // updateAt
        runs[runIndex].timestamp_last_updated = unixTimeInSecond;

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
            distancePiece = calculateDistanceInMeters(
                parseFloat(lastCoordinate.lat),
                parseFloat(lastCoordinate.lng),
                lat,
                lng,
            );
            if (isActive) {
                distance = parseInt(runs[runIndex].distance) + distancePiece;
                runs[runIndex].distance = distance;
            }
            distancePausesIncluded = parseInt(runs[runIndex].distance_pauses_included) + distancePiece;
            runs[runIndex].distance_pauses_included = distancePausesIncluded;

            // duration_piece & duration & duration_pauses_included
            const durationPiece = unixTimeInSecond - parseInt(runs[runIndex].timestamp_last_updated);
            if (isActive) {
                duration = parseInt(runs[runIndex].duration) + durationPiece;
                runs[runIndex].duration = duration;
            }
            durationPausesIncluded = parseInt(runs[runIndex].duration_pauses_included) + durationPiece;
            runs[runIndex].duration_pauses_included = durationPausesIncluded;

            // avg_speed_piece & avg_speed & avg_speed_pauses_included
            avgSpeedPiece = Math.round((distancePiece / durationPiece) * 1000) / 1000;
            if (isActive) {
                avgSpeed = Math.round((runs[runIndex].duration / runs[runIndex].distance) * 1000) / 1000;
                runs[runIndex].avg_speed = avgSpeed;
            }
            avgSpeedPausesIncluded = Math.round((runs[runIndex].duration_pauses_included / runs[runIndex].distance_pauses_included) * 1000) / 1000;
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
    }

    // stop run by making run state to NOT_STARTED
    const storageStopRun = async () => {
        await storageSetRunState(runStates.NOT_STARTED);
    }

    // get runs from "runs"
    const storageGetRuns = async () => {
        const runsJson = await AsyncStorage.getItem('runs');
        if (runsJson) {
            return JSON.parse(runsJson);
        }
        return [];
    }

    // get run from "runs"
    const storageGetRun = async (runNumber: number) => {
        const runsJson = await AsyncStorage.getItem('runs');
        if (runsJson) {
            const runs = JSON.parse(runsJson);
            return runs.find((run) => parseInt(run.run_number) === runNumber);
        }
        return null;
    }

    // get run coordinates from "run_coordinates_{runNumber}"
    const storageGetRunCoordinates = async (runNumber: number) => {
        const runCoordinatesJson = await AsyncStorage.getItem(`run_coordinates_${runNumber}`);
        if (runCoordinatesJson) {
            return JSON.parse(runCoordinatesJson);
        }
        return [];
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



    // check if there is internet connection, if yes, send all runs and its coordinates to server flush them from local storage
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

            // if synced, clear all runs and its coordinates
            if (isSynced) {
                await storageFlushAllRunsData();
            }
        });
    }



    // INTERNAL METHODS
    const storageGetRunsCount = async (): Promise<number> => {
        const runsCountString = await AsyncStorage.getItem('runs_count');
        if (runsCountString) {
            return parseInt(runsCountString);
        } else {
            await AsyncStorage.setItem('runs_count', '0');
            return 0;
        }
    }
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
            sendAllRunsDataToServer,
        }}>
            {children}
        </RunDataContext.Provider>
    );
};
