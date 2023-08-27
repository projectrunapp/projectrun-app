
import {useAuth} from "../context/AuthContext";
import {NavigationContainer} from "@react-navigation/native";
import HomeScreen from "./HomeScreen";
import {Button} from "react-native";
import SingleRunScreen from "./SingleRunScreen";
import AuthScreen from "./AuthScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const AuthLayout = () => {
    const { authState, onLogout } = useAuth();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {authState?.authenticated ? (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} options={{
                            headerRight: () => <Button onPress={onLogout} title="Log out" />
                        }}></Stack.Screen>
                        <Stack.Screen name="SingleRunScreen"
                                      component={SingleRunScreen}
                                      options={({ route }) => ({ title: `${route.params.title}` })}
                        ></Stack.Screen>
                    </>
                ) : (
                    <Stack.Screen name="Authentication" component={AuthScreen}></Stack.Screen>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AuthLayout;
