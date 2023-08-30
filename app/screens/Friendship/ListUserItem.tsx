
import {Image, StyleSheet, Text, View} from "react-native";
import {userDefaultAvatarUrl} from "../../utils/app-constants";

const ListUserItem = ({ item, actionButtons }: any) => {
    return (
        <View style={styles.list_item}>
            <Image style={styles.user_avatar} source={{uri: userDefaultAvatarUrl}} />
            <View style={styles.user_info_container}>
                <Text style={styles.user_info}>{item.name}</Text>
                <Text style={styles.user_info}>{item.email}</Text>
            </View>
            {actionButtons && (
                <View style={styles.action_buttons_container}>
                    {actionButtons}
                </View>
            )}
        </View>
    );
};

// TODO: standardize styles like this
const styles = StyleSheet.create({
    list_item: {flexDirection: 'row', padding: 10},
    user_avatar: {width: 50, height: 50, borderRadius: 25}, // TODO: add avatar to user
    user_info_container: {justifyContent: 'center', marginLeft: 10},
    user_info: {fontSize: 15, marginTop: 5},
    // action_buttons_container: {flex: 1, flexDirection: 'row', justifyContent: 'flex-end'},
    action_buttons_container: {flex: 1, alignItems: 'flex-end', justifyContent: 'center'},
});

export default ListUserItem;
