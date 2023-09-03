
import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useAuth} from "../context/AuthContext";
import {useEffect, useState} from "react";

export default function ProfileScreen() {
    const { getStorageUser } = useAuth();
    const { onLogout } = useAuth();

    const [storageUserId, setStorageUserId] = useState<number | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    const getUserData = async () => {
        if (getStorageUser) {
            const storageUser = await getStorageUser();
            setStorageUserId(storageUser.storageUserId);
            setName(storageUser.storageUserName);
            setEmail(storageUser.storageUserEmail);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    const logoutPrompt = () => {
        Alert.alert(
            "Log out",
            "Are you sure you want to log out?",
            [
                {
                    text: 'No',
                    onPress: () => {},
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        if (onLogout) {
                            onLogout();
                        }
                    }
                }
            ]
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.user_info_container}>
                <Text style={styles.user_info_text}>Profile Details</Text>

                <View style={styles.info_container}>
                    <View style={styles.info_keys}>
                        <Text>Name:</Text>
                        <Text>Email:</Text>
                    </View>
                    <View style={styles.info_values}>
                        <Text>{name}</Text>
                        <Text>{email}</Text>
                    </View>
                </View>

            </View>
            <View style={styles.action_buttons_container}>
                <TouchableOpacity onPress={logoutPrompt} style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Log out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    user_info_container: {
        marginBottom: 20,
    },
    user_info_text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    info_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    info_keys: {
        flex: 1,
    },
    info_values: {
        flex: 2,
    },
    action_buttons_container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    logoutButton: {
        backgroundColor: '#c10',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: 100,
    },
    logoutButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
