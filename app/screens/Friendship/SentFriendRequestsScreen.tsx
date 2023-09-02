
import {SafeAreaView, FlatList, StyleSheet, Text, View, ActivityIndicator, Alert} from "react-native";
import axios from "axios";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext";
import ListUserItem from "./ListUserItem";
import CancelButtonForSentFriendRequest from "./CancelButtonForSentFriendRequest";
import {useFriendshipRefresh} from "../../context/FriendshipRefreshContext";

const SentFriendRequestsScreen = () => {
    const { sentFriendRequestsLastRefreshedTime } = useFriendshipRefresh();
    const { authState } = useAuth();
    const [loading, setLoading] = useState(true);
    const [sentFriendRequests, setSentFriendRequests] = useState<any>({});

    const loadSentFriendRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.API_URL}/friendship/get-friend-requests?filter=sent`, {
                headers: {
                    Authorization: `Bearer ${authState!.token}`,
                    // "Content-Type": "application/json",
                }
            });
            if (response.data.success && response.data.data) {
                setSentFriendRequests(response.data.data);
            }
            setLoading(false);
        } catch (err) {
            // console.log(err.message);
            setLoading(false);
            Alert.alert('Error', 'Something went wrong!');
        }
    };

    const removeFriendRequest = (friendshipId: number) => {
        setSentFriendRequests(prevState => {
            return prevState.filter((friendship: any) => friendship.id !== friendshipId);
        });
        // trigger: nothing to trigger
    }

    useEffect(() => {
        loadSentFriendRequests();
    }, [
        sentFriendRequestsLastRefreshedTime,
    ]);

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
                data={sentFriendRequests}
                renderItem={({ item }) => {
                    return (<ListUserItem item={item.receiver} actionButtons={
                        <CancelButtonForSentFriendRequest item={item} removeFriendRequest={removeFriendRequest} />
                    }/>);
                }}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => (<View style={styles.item_separator} />)}
                ListEmptyComponent={() => (
                    <View style={styles.no_items}>
                        <Text>No sent friend requests.</Text>
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

export default SentFriendRequestsScreen;
