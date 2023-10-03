
import React, { useState } from 'react';
import {ActivityIndicator, Alert, FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import axios from 'axios';
import {useAuth} from "../context/AuthContext";
import {Searchbar} from "react-native-paper";
import ListUserItem from "./Friendship/ListUserItem";
import ActionButtonsForSearchedUser from "./Friendship/ActionButtonsForSearchedUser";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import PopupMessage from "../components/PopupMessage";

export default function SearchScreen() {
    const { authState } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');

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

    const searchUsers = async (query) => {
        setQuery(query);
        if (!query || query.length < 3) {
            setUsers([]);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`${process.env.API_URL}/friendship/search?term=${query}`, {
                headers: {
                    Authorization: `Bearer ${authState!.token}`,
                    // "Content-Type": "application/json",
                }
            });
            if (response.data.success && response.data.data) {
                setUsers(response.data.data);
            } else {
                Alert.alert('Error', "Something went wrong. Please try again!");
            }
        } catch (err) {
            // console.error(err.message);
            Alert.alert('Error', "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <PopupMessage isVisible={isPopupVisible} message={popupMessage} success={popupSuccess} onClose={closePopup}/>
            <Searchbar
                placeholder="Search users..."
                onChangeText={searchUsers}
                value={query}
            />
            {loading ? (
                <View style={[styles.loading_container, styles.loading_horizontal]}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={users}
                    renderItem={({ item }) => {
                        return (<ListUserItem item={item} actionButtons={
                            <ActionButtonsForSearchedUser item={item} showPopup={showPopup}/>
                        }/>);
                    }}
                    keyExtractor={(user) => user.id}
                    ItemSeparatorComponent={() => (<View style={styles.item_separator} />)}
                    ListEmptyComponent={() => (
                        (query && query.length >= 3 && !loading) ? (
                            <View style={styles.no_items}>
                                <Text>No results!</Text>
                            </View>
                        ) : (
                            <View style={styles.initial_container}>
                                <Text style={styles.initial_text_top}>Make friends</Text>
                                <MaterialCommunityIcons name={'account-multiple-plus'} size={24} color={'gray'} />
                                <Text style={styles.initial_text_bottom}>Run together!</Text>
                            </View>
                        )
                    )}
                />
            )}
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
    initial_container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
    },
    initial_text_top: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    initial_text_bottom: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});
