
import RunScreen from "../screens/RunScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const RunStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Run" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Run" component={RunScreen}
                          options={{ title: 'Run Page' }}/>
        </Stack.Navigator>
    );
}

export default RunStack;
