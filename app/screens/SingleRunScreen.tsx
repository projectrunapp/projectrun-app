
import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View} from "react-native";
import axios from "axios";
import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext";
import RunDetails from "../components/RunDetails";
import RunMap from "../components/RunMap";
import PopupMessage from "../components/PopupMessage";

const SingleRunScreen = ({ route }: any) => {
    const { runId, title, popup } = route.params;
    const { authState } = useAuth();
    const [loading, setLoading] = useState(true);
    const [run, setRun] = useState<any>({});

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

    const loadRun = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.API_URL}/run/my-runs/${id}`, {
                headers: {
                    Authorization: `Bearer ${authState!.token}`,
                    // "Content-Type": "application/json",
                }
            });
            if (response.data.success && response.data.data) {
                setRun(response.data.data);
            }
            setLoading(false);
        } catch (err) {
            // console.log(err.message);
            setLoading(false);
            Alert.alert('Error', 'Something went wrong!');
        }
    };

    useEffect(() => {
        loadRun(runId);
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
    if (Object.keys(run).length === 0) {
        return (
            <View style={styles.loading_container}>
                <Text>Run not found!</Text>
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
            <RunMap style={styles.map_container} runId={runId} />
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

export default SingleRunScreen;
