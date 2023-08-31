
import axios from "axios";
import {Alert, StyleSheet, TouchableOpacity, View} from "react-native";
import {useAuth} from "../../context/AuthContext";
import {MaterialCommunityIcons} from "@expo/vector-icons";

const CancelButtonForSentFriendRequest = ({ item, removeFriendRequest }) => {
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
                // Alert.alert('Success', 'You canceled the friend request.');
                removeFriendRequest(item.id); // response.data.data
            } else {
                Alert.alert('Error', 'Something went wrong. Please try again!');
            }
        } catch (err) {
            // console.log(err.message);
            Alert.alert('Error', 'Something went wrong. Please try again!');
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
