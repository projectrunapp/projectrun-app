
import HomeScreen from "../screens/HomeScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import ProfileScreen from "../screens/ProfileScreen";

export default function HomeStack() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{
                // headerShown: true,
                title: 'Home Page',
            }}></Stack.Screen>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{
                // headerShown: true,
                title: 'Profile Page',
            }}/>
        </Stack.Navigator>
    );
}
