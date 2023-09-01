
import RunScreen from "../screens/RunScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const RunStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="RunScreen" screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="RunScreen" component={RunScreen} options={{
                // headerShown: true,
                title: 'Run Page',
            }}/>
        </Stack.Navigator>
    );
}

export default RunStack;
