
import {AuthProvider, useAuth} from "./app/context/AuthContext";
import {ActivityIndicator, StyleSheet, View} from "react-native";
import {Provider as PaperProvider} from "react-native-paper";
import AppLayout from "./app/screens/AppLayout";

const App = () => {
    const { authLoading } = useAuth();

    return (
        <AuthProvider>
            <PaperProvider>
                {
                    authLoading ? (
                        <View style={[styles.container, styles.horizontal]}>
                            <ActivityIndicator size="large" />
                        </View>
                    ) : (
                        <AppLayout />
                    )
                }
            </PaperProvider>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
});

export default App;
