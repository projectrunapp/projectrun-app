
import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View} from "react-native";
import axios from "axios";
import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext";
import RunDetails from "../components/RunDetails";
import RunMap from "../components/RunMap";
import PopupMessage from "../components/PopupMessage";
import {useRunData} from "../context/RunDataContext";

export default function SingleRunScreen({ route }: any) {
    const {storageGetRun, storageGetRunCoordinates} = useRunData();

    const { runId, title, popup } = route.params;
    const { authState } = useAuth();
    const [loading, setLoading] = useState(true);
    const [run, setRun] = useState<{
        title: string,
        started: number,
        completed: number,
        distance: number,
        duration: number,
        avg_speed: number,
    }>(null);
    const [coordinates, setCoordinates] = useState([]);

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

    const loadRunFromServer = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.API_URL}/run/my-runs/${id}`, {
                headers: {
                    Authorization: `Bearer ${authState!.token}`,
                    // "Content-Type": "application/json",
                }
            });
            if (response.data.success && response.data.data) {
                setRun({
                    title: response.data.data.title,
                    started: new Date(response.data.data.started_at).getTime(),
                    completed: new Date(response.data.data.completed_at).getTime(),
                    distance: response.data.data.distance,
                    duration: response.data.data.duration,
                    avg_speed: response.data.data.avg_speed,
                });
                const coordinatesParsed = JSON.parse(response.data.data.coordinates);
                const runCoordinates = coordinatesParsed.map((c: any) => {
                    return {
                        latitude: parseFloat(c.lat),
                        longitude: parseFloat(c.lng),
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    };
                });
                setCoordinates(runCoordinates);
            } else {
                // console.error(response.data.message);
                Alert.alert('Error', "Something went wrong. Please try again later!");
            }
            setLoading(false);
        } catch (err) {
            // console.error(err.message);
            setLoading(false);
            Alert.alert('Error', "Something went wrong!");
        }
    };
    const loadRunFromStorage = async () => {
        setLoading(true);
        try {
            const storageRun = await storageGetRun();
            if (storageRun) {
                setRun({
                    title: storageRun.title,
                    started: storageRun.timestamp_started * 1000,
                    completed: storageRun.timestamp_last_updated * 1000,
                    distance: storageRun.distance,
                    duration: storageRun.duration,
                    avg_speed: storageRun.avg_speed,
                });
                const storageRunCoordinates = await storageGetRunCoordinates();
                if (storageRunCoordinates) {
                    const runCoordinates = storageRunCoordinates.map((c: any) => {
                        return {
                            latitude: c.lat,
                            longitude: c.lng,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        };
                    });
                    setCoordinates(runCoordinates);
                }
            } else {
                Alert.alert('Error', "There is no local run data!");
            }
            setLoading(false);
        } catch (err) {
            // console.error(err.message);
            setLoading(false);
            Alert.alert('Error', "Something went wrong!");
        }
    };

    useEffect(() => {
        if (runId) {
            loadRunFromServer(runId);
        } else {
            loadRunFromStorage();
        }

        if (popup && popup.message) {
            showPopup(popup.success, popup.message);
        }
    }, []);

    if (loading) {
        return (
            <View style={[styles.loading_container, styles.loading_horizontal]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView>
            <PopupMessage isVisible={isPopupVisible}
                          message={popupMessage}
                          success={popupSuccess}
                          onClose={closePopup}
            />
            {coordinates.length > 0 && (
                <RunMap style={styles.map_container}
                    // firstCoordinate={coordinates[0]}
                    // lastCoordinate={coordinates[coordinates.length - 1]}
                    // firstCoordinate={run.first_coordinate}
                    // lastCoordinate={run.last_coordinate}
                        coordinates={coordinates} />
            )}
            <RunDetails run={run} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    loading_container: {
        flex: 1,
        justifyContent: 'center',
    },
    loading_horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    map_container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
