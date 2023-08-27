
import FriendsScreen from "../screens/FriendsScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const FriendsStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Friends" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Friends" component={FriendsScreen}
                          options={{ title: 'Friends Page' }}/>
        </Stack.Navigator>
    );
}

export default FriendsStack;
