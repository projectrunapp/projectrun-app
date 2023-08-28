
import React from "react";
import { SafeAreaView, FlatList, StyleSheet, Text, View, Image } from "react-native";

const items = [
    {
        id: 1,
        name: 'Earnest Green',
        age: 24,
        avatar: 'https://avatars.githubusercontent.com/u/22226570?s=96&v=4',
    },
    {
        id: 2,
        name: 'Winston Orn',
        age: 29,
        avatar: 'https://avatars.githubusercontent.com/u/22226570?s=96&v=4',
    },
    {
        id: 3,
        name: 'Carlton Collins',
        age: 19,
        avatar: 'https://avatars.githubusercontent.com/u/22226570?s=96&v=4',
    },
    {
        id: 4,
        name: 'Malcolm Labadie',
        age: 22,
        avatar: 'https://avatars.githubusercontent.com/u/22226570?s=96&v=4',
    },
    {
        id: 5,
        name: 'Michelle Dare',
        age: 43,
        avatar: 'https://avatars.githubusercontent.com/u/22226570?s=96&v=4',
    },
    {
        id: 6,
        name: 'Carlton Zieme',
        age: 16,
        avatar: 'https://avatars.githubusercontent.com/u/22226570?s=96&v=4',
    },
    {
        id: 7,
        name: 'Jessie Dickinson',
        age: 17,
        avatar: 'https://avatars.githubusercontent.com/u/22226570?s=96&v=4',
    },
    {
        id: 8,
        name: 'Julian Gulgowski',
        age: 21,
        avatar: 'https://avatars.githubusercontent.com/u/22226570?s=96&v=4',
    },
    {
        id: 9,
        name: 'Ellen Veum',
        age: 25,
        avatar: 'https://avatars.githubusercontent.com/u/22226570?s=96&v=4',
    },
    {
        id: 10,
        name: 'Lorena Rice',
        age: 24,
        avatar: 'https://avatars.githubusercontent.com/u/22226570?s=96&v=4',
    },

    {
        id: 11,
        name: 'Carlton Zieme',
        age: 29,
        avatar: 'https://avatars.githubusercontent.com/u/22226570?s=96&v=4',
    },
    {
        id: 12,
        name: 'Jessie Dickinson',
        age: 32,
        avatar: 'https://avatars.githubusercontent.com/u/22226570?s=96&v=4',
    },
    {
        id: 13,
        name: 'Julian Gulgowski',
        age: 30,
        avatar: 'https://avatars.githubusercontent.com/u/22226570?s=96&v=4',
    },
    {
        id: 14,
        name: 'Ellen Veum',
        age: 20,
        avatar: 'https://avatars.githubusercontent.com/u/22226570?s=96&v=4',
    },
    {
        id: 15,
        name: 'Lorena Rice',
        age: 27,
        avatar: 'https://avatars.githubusercontent.com/u/22226570?s=96&v=4',
    },
];

export default function FriendsScreen() {
    const EmptyList = () => {
        return (
            <View style={{alignItems: 'center'}}>
                <Text style={styles.item}>No friends yet :(</Text>
            </View>
        );
    };
    const ListItem = ({ item }) => {
        return (
            <View style={{ flexDirection: "row" }}>
                <Image source={{ uri: item.avatar }}
                    style={{width: 50, height: 50, borderRadius: 25, marginTop: 15}}
                />
                <View style={{justifyContent: "center", marginLeft: 10}}>
                    <Text style={styles.item}>{item.name}</Text>
                    <Text style={styles.item}>{item.age}</Text>
                </View>
            </View>
        );
    };
    const ItemSeparator = () => {
        return <View style={styles.item_separator} />;
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={items}
                renderItem={ListItem}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={ItemSeparator}
                ListEmptyComponent={EmptyList}
                ListHeaderComponent={() => (
                    <Text style={styles.header_text}>
                        15 Friends
                    </Text>
                )}
                ListFooterComponent={() => (
                    <Text style={styles.footer_text}>Average TPR (time per run): 32m, 14s</Text>
                )}
            />
        </SafeAreaView>
    );
}

//styles to see the data more clearly

const styles = StyleSheet.create({
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
    item: {
        padding: 10,
        fontSize: 15,
        marginTop: 5,
    },
    footer_text: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 16
    },
});
