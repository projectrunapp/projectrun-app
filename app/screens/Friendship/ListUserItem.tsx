
import {Image, StyleSheet, Text, View} from "react-native";

const ListUserItem = ({ item, actionButtons }: any) => {
    // TODO: add avatar to user
    return (
        <View style={styles.list_item}>
            <Image style={styles.user_avatar} alt={`N/A`}
                   source={{uri: `https://picsum.photos/id/${item.id}/50/50`}}/>
            <View style={styles.user_info_container}>
                <Text style={styles.user_info}>{item.name.length > 23 ? item.name.substring(0, 20) + '...' : item.name}</Text>
                <Text style={styles.user_info}>{item.email.length > 23 ? item.email.substring(0, 20) + '...' : item.email}</Text>
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
    user_avatar: {width: 50, height: 50, borderRadius: 25},
    user_info_container: {justifyContent: 'center', marginLeft: 10},
    user_info: {fontSize: 15, marginTop: 5},
    action_buttons_container: {flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end'},
});

export default ListUserItem;
