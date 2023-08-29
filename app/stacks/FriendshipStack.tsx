
import FriendshipScreen from "../screens/FriendshipScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const FriendshipStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Friendship" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Friendship" component={FriendshipScreen}
                          options={{ title: 'Friendship Page' }}/>
        </Stack.Navigator>
    );
}

export default FriendshipStack;
