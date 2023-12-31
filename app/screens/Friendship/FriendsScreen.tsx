
import {SafeAreaView, FlatList, StyleSheet, Text, View, ActivityIndicator, Alert} from "react-native";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext";
import ListUserItem from "./ListUserItem";
import UnfriendButton from "./UnfriendButton";
import {useFriendshipRefresh} from "../../context/FriendshipRefreshContext";
import PopupMessage from "../../components/PopupMessage";

const FriendsScreen = () => {
    const { friendsLastRefreshedTime } = useFriendshipRefresh();
    const { authState, getStorageUser } = useAuth();
    const [authUserId, setAuthUserId] = useState<number | null>(null);

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

    const [loading, setLoading] = useState(true);
    // TODO: fade in/out animation when adding/removing friends
    const [friends, setFriends] = useState<any>({});

    const getUserId = async () => {
        if (getStorageUser) {
            const {storageUserId} = await getStorageUser();
            setAuthUserId(storageUserId);
        }
    };

    const loadFriends = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.API_URL}/friendship/get-friends`, {
                headers: {
                    Authorization: `Bearer ${authState!.token}`,
                    // "Content-Type": "application/json",
                }
            });
            if (response.data.success && response.data.data) {
                setFriends(response.data.data);
            }
            setLoading(false);
        } catch (err) {
            // console.error(err.message);
            setLoading(false);
            Alert.alert('Error', "Something went wrong!");
        }
    };

    const removeFriend = (friendshipId: number) => {
        setFriends(prevState => {
            return prevState.filter((friendship: any) => friendship.id !== friendshipId);
        });
    }

    useEffect(() => {
        getUserId().then(() => {
            loadFriends();
        });
    }, [
        friendsLastRefreshedTime,
        // friends.length, // we won't need this because after unfriending it will be appropriate
    ]);

    // authUserId already set before loadFriends() is called
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
                data={friends}
                renderItem={({ item }) => {
                    const friendUser = (item.receiver.id === authUserId) ? item.sender : item.receiver;
                    return (<ListUserItem item={friendUser} actionButtons={
                        <UnfriendButton item={item} removeFriend={removeFriend} showPopup={showPopup} />
                    }/>);
                }}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => (<View style={styles.item_separator} />)}
                ListEmptyComponent={() => (
                    <View style={styles.no_items}>
                        <Text>No friends :(</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // TODO: change loading spinner color
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

export default FriendsScreen;
