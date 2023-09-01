
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";

export default function TopHeaderLeft() {
    const navigation = useNavigation();

    const pressLogo = () => {
        navigation.navigate("HomeScreen");
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pressLogo} style={styles.logoIcon}>
                <MaterialCommunityIcons name="run-fast" size={30} color="black" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
    logoIcon: {
        marginLeft: 10,
    }
});
