
import {useAuth} from "../context/AuthContext";
import {NavigationContainer} from "@react-navigation/native";
import AuthScreen from "./AuthScreen";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import HomeStack from "../stacks/HomeStack";
import FriendshipStack from "../stacks/FriendshipStack";
import RunStack from "../stacks/RunStack";
import {appPrimaryColor} from "../utils/app-constants";

const Tab = createBottomTabNavigator();

const AppLayout = () => {
    const { authState } = useAuth();

    return (
        <NavigationContainer>
            {authState?.authenticated ? (
                <Tab.Navigator initialRouteName="Home" screenOptions={({ route }) => ({
                    // headerShown: false,
                    tabBarActiveTintColor: appPrimaryColor,
                })}>
                    <Tab.Screen name="HomeStack" component={HomeStack} options={{
                        headerShown: false,
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={size}/>
                        ),
                    }}/>
                    <Tab.Screen name="RunStack" component={RunStack} options={{
                        // headerShown: false,
                        tabBarLabel: 'Run',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="run-fast" color={color} size={size}/>
                        ),
                    }}/>
                    <Tab.Screen name="FriendshipStack" component={FriendshipStack} options={{
                        // headerShown: false,
                        tabBarLabel: 'Friendship',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account-group" color={color} size={size}/>
                        ),
                    }}/>
                </Tab.Navigator>
            ) : (
                <AuthScreen />
            )}
        </NavigationContainer>
    );
};

export default AppLayout;
