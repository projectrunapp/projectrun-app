
import FriendshipScreen from "../screens/FriendshipScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import SearchScreen from "../screens/SearchScreen";

const FriendshipStack = () => {
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
        </Stack.Navigator>
    );
}

export default FriendshipStack;
