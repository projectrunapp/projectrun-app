
import {useAuth} from "../context/AuthContext";
import HomeScreen from "../screens/HomeScreen";
import {Button} from "react-native";
import SingleRunScreen from "../screens/SingleRunScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const HomeStack = () => {
    const Stack = createNativeStackNavigator();
    const { onLogout } = useAuth();

    return (
        <Stack.Navigator initialRouteName="Home" screenOptions={{
            // headerShown: false,
            // headerStyle: { backgroundColor: '#42f44b' },
            // headerTintColor: '#fff',
            // headerTitleStyle: { fontWeight: 'bold' },
        }}>
            <Stack.Screen name="Home" component={HomeScreen} options={{
                // headerShown: true,
                title: 'Home Page',
                headerRight: () => (<Button onPress={onLogout} title="Log out"/>)
            }}></Stack.Screen>
            <Stack.Screen name="SingleRunScreen" component={SingleRunScreen}
                          options={({ route }) => ({ title: route.params.title })}></Stack.Screen>
        </Stack.Navigator>
    );
}

export default HomeStack;
