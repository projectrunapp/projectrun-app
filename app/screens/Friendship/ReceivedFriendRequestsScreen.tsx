
import {SafeAreaView, FlatList, StyleSheet, Text, View, ActivityIndicator} from "react-native";
import axios from "axios";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext";
import ListUserItem from "./ListUserItem";
import ActionButtonsForReceivedFriendRequest from "./ActionButtonsForReceivedFriendRequest";

const ReceivedFriendRequestsScreen = ({setLastRefreshedTime}) => {
    const { authState } = useAuth();
    const [loading, setLoading] = useState(true);
    const [receivedFriendRequests, setReceivedFriendRequests] = useState<any>({});

    const loadReceivedFriendRequests = async () => {
        setLoading(true);
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
    };

    const removeFriendRequest = (friendshipId: number) => {
        setReceivedFriendRequests(prevState => {
            return prevState.filter((friendship: any) => friendship.id !== friendshipId);
        });
        setLastRefreshedTime((new Date()).getTime()); // trigger useEffect in FriendsScreen.tsx
    }

    useEffect(() => {
        loadReceivedFriendRequests();
    }, []);

    if (loading) {
        return (
            <View style={[styles.loading_container, styles.loading_horizontal]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={receivedFriendRequests}
                renderItem={({ item }) => {
                    return (<ListUserItem item={item.sender} actionButtons={
                        <ActionButtonsForReceivedFriendRequest item={item} removeFriendRequest={removeFriendRequest} />
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
