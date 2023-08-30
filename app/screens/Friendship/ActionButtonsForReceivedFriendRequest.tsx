
import axios from "axios";
import {Alert, StyleSheet, TouchableOpacity, View} from "react-native";
import {useAuth} from "../../context/AuthContext";
import {MaterialCommunityIcons} from "@expo/vector-icons";

const ActionButtonsForReceivedFriendRequest = ({ item, removeFriendRequest }) => {
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
                // Alert.alert('Success', 'You have accepted the friend request.');
                removeFriendRequest(item.id); // response.data.data
            } else {
                Alert.alert('Error', 'Something went wrong. Please try again!');
            }
        } catch (err) {
            console.log(err.message);
            Alert.alert('Error', 'Something went wrong. Please try again!');
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
                // Alert.alert('Success', 'You have declined the friend request.');
                removeFriendRequest(item.id); // response.data.data
            } else {
                Alert.alert('Error', 'Something went wrong. Please try again!');
            }
        } catch (err) {
            // console.log(err.message);
            Alert.alert('Error', 'Something went wrong. Please try again!');
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
        width: 100,
    },
    accept_button: {
        backgroundColor: 'green',
        borderRadius: 5,
        padding: 5,
    },
    decline_button: {
        backgroundColor: 'red',
        borderRadius: 5,
        padding: 5,
    },
});

export default ActionButtonsForReceivedFriendRequest;
