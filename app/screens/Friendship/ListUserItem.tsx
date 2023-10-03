
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {splashLogoUrl} from "../../utils/app-constants";

const ListUserItem = ({ item, actionButtons }: any) => {
    const navigation = useNavigation();

    const navigateToProfile = (userId: number) => {
        // @ts-ignore
        navigation.navigate("Friendship", {
            screen: "ProfileForGuestScreen",
            params: {
                userId,
            }
        });
    };

    return (
        <TouchableOpacity onPress={() => navigateToProfile(item.id)}>
            <View style={styles.list_item}>
                <Image source={{uri: item.avatar ? item.avatar : splashLogoUrl}} style={styles.user_avatar}/>
                <View style={styles.user_info_container}>
                    <Text style={[styles.user_info, styles.user_info_name]}>{item.name.length > 23 ? item.name.substring(0, 20) + '...' : item.name}</Text>
                    <Text style={[styles.user_info, styles.user_info_username]}>@{item.username}</Text>
                </View>
                {actionButtons && (
                    <View style={styles.action_buttons_container}>
                        {actionButtons}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

// TODO: standardize styles
const styles = StyleSheet.create({
    list_item: {
        flexDirection: 'row',
        padding: 10,
    },
    user_avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    user_info_container: {
        justifyContent: 'center',
        marginLeft: 10,
    },
    user_info: {
        fontSize: 15,
        marginTop: 5,
    },
    user_info_name: {
        fontWeight: 'bold',
    },
    user_info_username: {
        color: '#777',
    },
    action_buttons_container: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
});

export default ListUserItem;
