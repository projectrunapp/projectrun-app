
import RunScreen from "../screens/RunScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import SingleRunScreen from "../screens/SingleRunScreen";

export default function RunStack() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="RunScreen" screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="RunScreen" component={RunScreen} options={{
                // headerShown: true,
                title: 'Run Page',
            }}/>
            <Stack.Screen name="SingleRunScreen" component={SingleRunScreen} options={
                ({ route }) => ({ title: route.params.title })
            }></Stack.Screen>
        </Stack.Navigator>
    );
}
