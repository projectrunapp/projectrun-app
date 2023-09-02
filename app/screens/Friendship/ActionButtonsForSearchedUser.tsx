
import axios from "axios";
import {Alert, StyleSheet, TouchableOpacity, View} from "react-native";
import {useAuth} from "../../context/AuthContext";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useState} from "react";
import {useFriendshipRefresh} from "../../context/FriendshipRefreshContext";

const ActionButtonsForSearchedUser = ({item}) => {
    const {
        updateFriendsLastRefreshedTime,
        updateReceivedFriendRequestsLastRefreshedTime,
        updateSentFriendRequestsLastRefreshedTime
    } = useFriendshipRefresh();
    const { authState } = useAuth();
    // 'default', 'friends', 'friend_request_sent', 'friend_request_received', 'none'
    const [friendship, setFriendship] = useState('default');

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
                updateFriendsLastRefreshedTime(); // trigger useEffect in FriendsScreen.tsx
            } else {
                Alert.alert('Error', 'Something went wrong. Please try again!');
            }
        } catch (err) {
            // console.log(err.message);
            Alert.alert('Error', 'Something went wrong!');
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
            } else {
                Alert.alert('Error', 'Something went wrong. Please try again!');
            }
        } catch (err) {
            // console.log(err.message);
            Alert.alert('Error', 'Something went wrong!');
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
            } else {
                Alert.alert('Error', 'Something went wrong. Please try again!');
            }
        } catch (err) {
            // console.log(err.message);
            Alert.alert('Error', 'Something went wrong. Please try again!');
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
                updateFriendsLastRefreshedTime(); // trigger useEffect in FriendsScreen.tsx
            } else {
                Alert.alert('Error', 'Something went wrong. Please try again!');
            }
        } catch (err) {
            // console.log(err.message);
            Alert.alert('Error', 'Something went wrong!');
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
            } else {
                Alert.alert('Error', 'Something went wrong. Please try again!');
            }
        } catch (err) {
            // console.log(err.message);
            Alert.alert('Error', 'Something went wrong!');
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
                    <TouchableOpacity style={styles.accept_button} onPress={() => onPressAccept()}>
                        <MaterialCommunityIcons name="check" size={24} style={{color: 'white'}}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.decline_button} onPress={() => onPressDecline()}>
                        <MaterialCommunityIcons name="close" size={24} style={{color: 'white'}}/>
                    </TouchableOpacity>
                </>
            )}

            {(
                ((friendship === 'default') && (item.received.length > 0 && item.received[0].status === 'PENDING')) ||
                (friendship === 'friend_request_sent')
            ) && (
                <TouchableOpacity style={styles.cancel_button} onPress={() => onPressCancel()}>
                    <MaterialCommunityIcons name="close" size={24} style={{color: 'white'}}/>
                </TouchableOpacity>
            )}

            {(
                ((friendship === 'default') && ((item.sent.length > 0 && item.sent[0].status === 'ACCEPTED') || (item.received.length > 0 && item.received[0].status === 'ACCEPTED'))) ||
                (friendship === 'friends')
            ) && (
                <TouchableOpacity style={styles.unfriend_button} onPress={() => onPressUnfriend()}>
                    <MaterialCommunityIcons name="account-remove" size={24} style={{color: 'white'}}/>
                </TouchableOpacity>
            )}

            {(
                ((friendship === 'default') && (item.sent.length === 0 && item.received.length === 0)) ||
                (friendship === 'none')
            ) && (
                <TouchableOpacity style={styles.send_friend_request_button} onPress={() => onPressSendFriendRequest()}>
                    <MaterialCommunityIcons name="account-plus" size={24} style={{color: 'white'}}/>
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
    accept_button: {
        backgroundColor: 'green',
        borderRadius: 5,
        padding: 5,
        marginRight: 5,
    },
    decline_button: {
        backgroundColor: 'red',
        borderRadius: 5,
        padding: 5,
    },
    cancel_button: {
        backgroundColor: 'red',
        borderRadius: 5,
        padding: 5,
    },
    unfriend_button: {
        backgroundColor: 'red',
        borderRadius: 5,
        padding: 5,
    },
    send_friend_request_button: {
        backgroundColor: 'green',
        borderRadius: 5,
        padding: 5,
    },
});

export default ActionButtonsForSearchedUser;
