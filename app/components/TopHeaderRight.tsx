
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import {splashLogoUrl} from "../utils/app-constants";

export default function TopHeaderRight({avatar}) {
    const navigation = useNavigation();

    const pressSearch = () => {
        // @ts-ignore
        navigation.navigate("Friendship", {screen: "SearchScreen"});
    }

    const pressProfile = () => {
        // @ts-ignore
        navigation.navigate("Home", {screen: "ProfileScreen"});
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pressSearch} style={styles.searchIcon}>
                <MaterialCommunityIcons name="magnify" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={pressProfile} style={styles.profileIcon}>
                <Image source={{uri: avatar || splashLogoUrl}} style={styles.avatar} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
    searchIcon: {
        marginRight: 10,
    },
    profileIcon: {
        marginRight: 10,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
});
