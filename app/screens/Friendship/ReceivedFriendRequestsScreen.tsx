
import {SafeAreaView, FlatList, StyleSheet, Text, View, ActivityIndicator, Alert} from "react-native";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext";
import ListUserItem from "./ListUserItem";
import ActionButtonsForReceivedFriendRequest from "./ActionButtonsForReceivedFriendRequest";
import {useFriendshipRefresh} from "../../context/FriendshipRefreshContext";
import PopupMessage from "../../components/PopupMessage";

const ReceivedFriendRequestsScreen = () => {
    const { receivedFriendRequestsLastRefreshedTime, updateFriendsLastRefreshedTime } = useFriendshipRefresh();
    const { authState } = useAuth();
    const [loading, setLoading] = useState(true);
    const [receivedFriendRequests, setReceivedFriendRequests] = useState<any>({});

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

    const loadReceivedFriendRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.API_URL}/friendship/get-friend-requests?filter=received`, {
                headers: {
                    Authorization: `Bearer ${authState!.token}`,
                    // "Content-Type": "application/json",
                }
            });
            if (response.data.success && response.data.data) {
                setReceivedFriendRequests(response.data.data);
            }
            setLoading(false);
        } catch (err) {
            // console.log(err.message);
            setLoading(false);
            Alert.alert('Error', 'Something went wrong!');
        }
    };

    const removeFriendRequest = (friendshipId: number, isFriendRequestAccepted: boolean) => {
        setReceivedFriendRequests(prevState => {
            return prevState.filter((friendship: any) => friendship.id !== friendshipId);
        });
        if (isFriendRequestAccepted) {
            updateFriendsLastRefreshedTime(); // trigger useEffect in FriendsScreen.tsx
        }
    }

    useEffect(() => {
        loadReceivedFriendRequests();
    }, [
        receivedFriendRequestsLastRefreshedTime,
    ]);

    if (loading) {
        return (
            <View style={[styles.loading_container, styles.loading_horizontal]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <PopupMessage isVisible={isPopupVisible} message={popupMessage} success={popupSuccess} onClose={closePopup}/>
            <FlatList
                data={receivedFriendRequests}
                renderItem={({ item }) => {
                    return (<ListUserItem item={item.sender} actionButtons={
                        <ActionButtonsForReceivedFriendRequest item={item} removeFriendRequest={removeFriendRequest} showPopup={showPopup} />
                    }/>);
                }}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => (<View style={styles.item_separator} />)}
                ListEmptyComponent={() => (
                    <View style={styles.no_items}>
                        <Text>No received friend requests.</Text>
                    </View>
                )}
            />
        </SafeAreaView>
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
    item_separator: {
        height: 1,
        backgroundColor: 'whitesmoke',
        marginHorizontal: 10,
    },
    container: {
        padding: 10,
        flex: 1,
    },
    header_text: {
        fontSize: 30,
        textAlign: 'center',
        marginTop: 20,
        fontWeight: 'bold',
    },
    footer_text: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 16,
    },
    no_items: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ReceivedFriendRequestsScreen;
