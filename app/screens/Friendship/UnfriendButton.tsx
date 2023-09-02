
import axios from "axios";
import {Alert, StyleSheet, TouchableOpacity, View} from "react-native";
import {useAuth} from "../../context/AuthContext";
import {MaterialCommunityIcons} from "@expo/vector-icons";

const UnfriendButton = ({ item, removeFriend }) => {
    const { authState } = useAuth();

    const unfriend = async () => {
        try {
            const friendId = item.sender.id === authState!.id ? item.receiver.id : item.sender.id;
            const response = await axios.delete(`${process.env.API_URL}/friendship/unfriend/${friendId}`, {
                headers: {
                    Authorization: `Bearer ${authState!.token}`,
                    // "Content-Type": "application/json",
                }
            });
            if (response.data.success) {
                // Alert.alert('Success', 'You did unfriend.');
                removeFriend(item.id); // response.data.data
            } else {
                Alert.alert('Error', 'Something went wrong. Please try again!');
            }
        } catch (err) {
            // console.log(err.message);
            Alert.alert('Error', 'Something went wrong!');
        }
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

    return (
        <View style={styles.action_buttons_container}>
            <TouchableOpacity style={styles.unfriend_button} onPress={() => onPressUnfriend()}>
                <MaterialCommunityIcons name="account-remove" size={24} style={{color: 'white'}}/>
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
    unfriend_button: {
        backgroundColor: 'red',
        borderRadius: 5,
        padding: 5,
    },
});

export default UnfriendButton;
