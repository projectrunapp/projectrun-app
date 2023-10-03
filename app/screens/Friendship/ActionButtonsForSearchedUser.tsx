
import axios from "axios";
import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useAuth} from "../../context/AuthContext";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useState} from "react";
import {useFriendshipRefresh} from "../../context/FriendshipRefreshContext";

export default function ActionButtonsForSearchedUser({
                                          item,
                                          showPopup,
                                          titles, // optional (defined for profile screen)
                                          setFriendsCount, // optional (defined for profile screen)
}) {
    const {
        updateFriendsLastRefreshedTime,
        updateReceivedFriendRequestsLastRefreshedTime,
        updateSentFriendRequestsLastRefreshedTime
    } = useFriendshipRefresh();

    const { authState } = useAuth();

    const [friendship, setFriendship] = useState('default'); // 'default', 'friends', 'friend_request_sent', 'friend_request_received', 'none'

    const acceptFriendRequest = async () => {
        try {
            const response = await axios.put(`${process.env.API_URL}/friendship/accept-friend-request/${item.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${authState!.token}`,
                    // "Content-Type": "application/json",
                }
            });
            if (response.data.success) {
                setFriendship('friends');
                if (setFriendsCount) {
                    setFriendsCount(prevState => prevState + 1);
                }
                updateFriendsLastRefreshedTime(); // trigger useEffect in FriendsScreen.tsx
                showPopup(true, "Friend request accepted.");
            } else {
                showPopup(false, "Something went wrong. Please try again!");
            }
        } catch (err) {
            // console.error(err.message);
            showPopup(false, "Something went wrong!");
        }
    };
    const declineFriendRequest = async () => {
        try {
            const response = await axios.delete(`${process.env.API_URL}/friendship/decline-friend-request/${item.id}`, {
                headers: {
                    Authorization: `Bearer ${authState!.token}`,
                    // "Content-Type": "application/json",
                }
            });
            if (response.data.success) {
                setFriendship('none');
                updateReceivedFriendRequestsLastRefreshedTime(); // trigger useEffect in ReceivedFriendRequestsScreen.tsx
                showPopup(true, "Friend request declined.");
            } else {
                showPopup(false, "Something went wrong. Please try again!");
            }
        } catch (err) {
            // console.error(err.message);
            showPopup(false, "Something went wrong!");
        }
    };
    const cancelFriendRequest = async () => {
        try {
            const response = await axios.delete(`${process.env.API_URL}/friendship/cancel-friend-request/${item.id}`, {
                headers: {
                    Authorization: `Bearer ${authState!.token}`,
                    // "Content-Type": "application/json",
                }
            });
            if (response.data.success) {
                setFriendship('none');
                updateSentFriendRequestsLastRefreshedTime(); // trigger useEffect in SentFriendRequestsScreen.tsx
                showPopup(true, "Friend request cancelled.");
            } else {
                showPopup(false, "Something went wrong. Please try again!");
            }
        } catch (err) {
            // console.error(err.message);
            showPopup(false, "Something went wrong!");
        }
    };
    const unfriend = async () => {
        try {
            const response = await axios.delete(`${process.env.API_URL}/friendship/unfriend/${item.id}`, {
                headers: {
                    Authorization: `Bearer ${authState!.token}`,
                    // "Content-Type": "application/json",
                }
            });
            if (response.data.success) {
                setFriendship('none');
                if (setFriendsCount) {
                    setFriendsCount(prevState => prevState - 1);
                }
                updateFriendsLastRefreshedTime(); // trigger useEffect in FriendsScreen.tsx
                showPopup(true, "Unfriended.");
            } else {
                showPopup(false, "Something went wrong. Please try again!");
            }
        } catch (err) {
            // console.error(err.message);
            showPopup(false, "Something went wrong!");
        }
    };
    const sendFriendRequest = async () => {
        try {
            const response = await axios.post(`${process.env.API_URL}/friendship/send-friend-request/${item.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${authState!.token}`,
                    // "Content-Type": "application/json",
                }
            });
            if (response.data.success) {
                setFriendship('friend_request_sent');
                updateSentFriendRequestsLastRefreshedTime(); // trigger useEffect in SentFriendRequestsScreen.tsx
                showPopup(true, "Friend request sent.");
            } else {
                showPopup(false, "Something went wrong. Please try again!");
            }
        } catch (err) {
            // console.error(err.message);
            showPopup(false, "Something went wrong!");
        }
    };

    const onPressAccept = () => {
        Alert.alert(
            "Accept Friend Request",
            "Are you sure you want to accept this friend request?",
            [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: acceptFriendRequest
                }
            ]
        );
    };
    const onPressDecline = () => {
        Alert.alert(
            "Decline Friend Request",
            "Are you sure you want to decline this friend request?",
            [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: declineFriendRequest
                }
            ]
        );
    };
    const onPressCancel = () => {
        Alert.alert(
            "Cancel Friend Request",
            "Are you sure you want to cancel this friend request?",
            [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: cancelFriendRequest
                }
            ]
        );
    };
    const onPressUnfriend = () => {
        Alert.alert(
            "Unfriend",
            "Are you sure you want to unfriend with this friend?",
            [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: unfriend
                }
            ]
        );
    };
    const onPressSendFriendRequest = () => {
        Alert.alert(
            "Send Friend Request",
            "Are you sure you want to send friend request to this user?",
            [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: sendFriendRequest
                }
            ]
        );
    };

    return (
        <View style={styles.action_buttons_container}>

            {(
                ((friendship === 'default') && (item.sent.length > 0 && item.sent[0].status === 'PENDING')) ||
                (friendship === 'friend_request_received')
            ) && (
                <>
                    <TouchableOpacity style={[styles.button_action, {
                        backgroundColor: 'green',
                    }]} onPress={() => onPressAccept()}>
                        {titles ? (
                            <Text style={styles.action_button_title}>Accept Request</Text>
                        ) : (
                            <MaterialCommunityIcons name="check" size={24} style={{color: 'white'}}/>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button_action, {
                        backgroundColor: 'red',
                    }]} onPress={() => onPressDecline()}>
                        {titles ? (
                            <Text style={styles.action_button_title}>Decline Request</Text>
                        ) : (
                            <MaterialCommunityIcons name="close" size={24} style={{color: 'white'}}/>
                        )}
                    </TouchableOpacity>
                </>
            )}

            {(
                ((friendship === 'default') && (item.received.length > 0 && item.received[0].status === 'PENDING')) ||
                (friendship === 'friend_request_sent')
            ) && (
                <TouchableOpacity style={[styles.button_action, {
                    backgroundColor: 'red',
                }]} onPress={() => onPressCancel()}>
                    {titles ? (
                        <Text style={styles.action_button_title}>Cancel Request</Text>
                    ) : (
                        <MaterialCommunityIcons name="close" size={24} style={{color: 'white'}}/>
                    )}
                </TouchableOpacity>
            )}

            {(
                ((friendship === 'default') && ((item.sent.length > 0 && item.sent[0].status === 'ACCEPTED') || (item.received.length > 0 && item.received[0].status === 'ACCEPTED'))) ||
                (friendship === 'friends')
            ) && (
                <TouchableOpacity style={[styles.button_action, {
                    backgroundColor: 'red',
                }]} onPress={() => onPressUnfriend()}>
                    {titles ? (
                        <Text style={styles.action_button_title}>Unfriend</Text>
                    ) : (
                        <MaterialCommunityIcons name="account-remove" size={24} style={{color: 'white'}}/>
                    )}
                </TouchableOpacity>
            )}

            {(
                ((friendship === 'default') && (item.sent.length === 0 && item.received.length === 0)) ||
                (friendship === 'none')
            ) && (
                <TouchableOpacity style={[styles.button_action, {
                    backgroundColor: 'green',
                }]} onPress={() => onPressSendFriendRequest()}>
                    {titles ? (
                        <Text style={styles.action_button_title}>Add Friend</Text>
                    ) : (
                        <MaterialCommunityIcons name="account-plus" size={24} style={{color: 'white'}}/>
                    )}
                </TouchableOpacity>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    action_buttons_container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    button_action: {
        borderRadius: 5,
        padding: 5,
        marginLeft: 5,
    },
    action_button_title: {
        color: 'white',
        padding: 5,
    },
});
