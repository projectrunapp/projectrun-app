
import axios from "axios";
import {Alert, StyleSheet, TouchableOpacity, View} from "react-native";
import {useAuth} from "../../context/AuthContext";
import {MaterialCommunityIcons} from "@expo/vector-icons";

const ActionButtonsForReceivedFriendRequest = ({ item, showPopup, removeFriendRequest }) => {
    const { authState } = useAuth();

    const acceptFriendRequest = async () => {
        try {
            const response = await axios.put(`${process.env.API_URL}/friendship/accept-friend-request/${item.sender.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${authState!.token}`,
                    // "Content-Type": "application/json",
                }
            });
            if (response.data.success) {
                showPopup(true, "You have accepted the friend request.");
                removeFriendRequest(item.id, true); // response.data.data
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
            const response = await axios.delete(`${process.env.API_URL}/friendship/decline-friend-request/${item.sender.id}`, {
                headers: {
                    Authorization: `Bearer ${authState!.token}`,
                    // "Content-Type": "application/json",
                }
            });
            if (response.data.success) {
                showPopup(true, "You have declined the friend request.");
                removeFriendRequest(item.id, false); // response.data.data
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

    return (
        <View style={styles.action_buttons_container}>
            <TouchableOpacity style={styles.accept_button} onPress={() => onPressAccept()}>
                <MaterialCommunityIcons name="check" size={24} style={{color: 'white'}}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.decline_button} onPress={() => onPressDecline()}>
                <MaterialCommunityIcons name="close" size={24} style={{color: 'white'}}/>
            </TouchableOpacity>
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
});

export default ActionButtonsForReceivedFriendRequest;
