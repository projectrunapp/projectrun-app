
import FriendshipScreen from "../screens/FriendshipScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import SearchScreen from "../screens/SearchScreen";
import ProfileForGuestScreen from "../screens/ProfileForGuestScreen";

export default function FriendshipStack() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="FriendshipScreen" screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="FriendshipScreen" component={FriendshipScreen} options={{
                // headerShown: true,
                title: 'Friendship Page',
            }}/>
            <Stack.Screen name="SearchScreen" component={SearchScreen} options={{
                // headerShown: true,
                title: 'Search Page',
            }}/>
            <Stack.Screen name="ProfileForGuestScreen" component={ProfileForGuestScreen} options={{
                // headerShown: true,
                title: 'Profile For Guest Page',
            }}/>
        </Stack.Navigator>
    );
}
