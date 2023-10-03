
import {useAuth} from "../context/AuthContext";
import {NavigationContainer} from "@react-navigation/native";
import AuthScreen from "./AuthScreen";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import HomeStack from "../stacks/HomeStack";
import FriendshipStack from "../stacks/FriendshipStack";
import RunStack from "../stacks/RunStack";
import {appPrimaryColor} from "../utils/app-constants";
import TopHeaderRight from "../components/TopHeaderRight";
import TopHeaderLeft from "../components/TopHeaderLeft";

const Tab = createBottomTabNavigator();

export default function AppLayout() {
    const { authState } = useAuth();

    return (
        <NavigationContainer>
            {authState?.authenticated ? (
                <Tab.Navigator initialRouteName="Home" screenOptions={({ route }) => ({
                    // headerShown: true,
                    tabBarActiveTintColor: appPrimaryColor,
                    headerLeft: () => (<TopHeaderLeft />),
                    headerRight: () => (<TopHeaderRight avatar={authState?.avatar} />)
                })}>
                    <Tab.Screen name="Home" component={HomeStack} options={{
                        // headerShown: true,
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={size}/>
                        ),
                    }}/>
                    <Tab.Screen name="Run" component={RunStack} options={{
                        // headerShown: true,
                        tabBarLabel: 'Run',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="run-fast" color={color} size={size}/>
                        ),
                    }}/>
                    <Tab.Screen name="Friendship" component={FriendshipStack} options={{
                        // headerShown: true,
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
