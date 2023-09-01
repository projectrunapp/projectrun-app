
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {useNavigation} from "@react-navigation/native";

export default function TopHeaderLeft() {
    const navigation = useNavigation();

    const pressLogo = () => {
        navigation.navigate("HomeScreen");
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pressLogo} style={styles.logoIcon}>
                <Image source={require("../../assets/logo-64x64.png")} style={styles.logo} />
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
    },
    logo: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
});
