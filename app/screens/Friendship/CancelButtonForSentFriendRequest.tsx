
import axios from "axios";
import {Alert, StyleSheet, TouchableOpacity, View} from "react-native";
import {useAuth} from "../../context/AuthContext";
import {MaterialCommunityIcons} from "@expo/vector-icons";

const CancelButtonForSentFriendRequest = ({ item, showPopup, removeFriendRequest }) => {
    const { authState } = useAuth();

    const cancelFriendRequest = async () => {
        try {
            const response = await axios.delete(`${process.env.API_URL}/friendship/cancel-friend-request/${item.receiver.id}`, {
                headers: {
                    Authorization: `Bearer ${authState!.token}`,
                    // "Content-Type": "application/json",
                }
            });
            if (response.data.success) {
                showPopup(true, "You canceled the friend request.");
                removeFriendRequest(item.id); // response.data.data
            } else {
                showPopup(false, "Something went wrong. Please try again!");
            }
        } catch (err) {
            // console.log(err.message);
            showPopup(false, "Something went wrong!");
        }
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

    return (
        <View style={styles.action_buttons_container}>
            <TouchableOpacity style={styles.cancel_button} onPress={() => onPressCancel()}>
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
    cancel_button: {
        backgroundColor: 'red',
        borderRadius: 5,
        padding: 5,
    },
});

export default CancelButtonForSentFriendRequest;
