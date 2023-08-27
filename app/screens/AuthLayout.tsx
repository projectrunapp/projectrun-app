
import {useAuth} from "../context/AuthContext";
import {NavigationContainer} from "@react-navigation/native";
import HomeScreen from "./HomeScreen";
import {Button} from "react-native";
import SingleRunScreen from "./SingleRunScreen";
import AuthScreen from "./AuthScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import FriendsScreen from "./FriendsScreen";
import ProfileScreen from "./ProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
    const { onLogout } = useAuth();

    return (
        <Stack.Navigator initialRouteName="Home" screenOptions={{
            headerStyle: { backgroundColor: '#42f44b' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
        }}>
            <Stack.Screen name="Home" component={HomeScreen}
                          options={{headerRight: () => <Button onPress={onLogout} title="Log out"/>}}></Stack.Screen>
            <Stack.Screen name="SingleRunScreen" component={SingleRunScreen}
                          options={({ route }) => ({ title: `${route.params.title}` })}></Stack.Screen>
        </Stack.Navigator>
    );
}
function FriendsStack() {
    return (
        <Stack.Navigator initialRouteName="Friends" screenOptions={{
            headerStyle: { backgroundColor: '#42f44b' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
        }}>
            <Stack.Screen name="Friends" component={FriendsScreen} options={{ title: 'Friends Page' }}/>
        </Stack.Navigator>
    );
}
function ProfileStack() {
    return (
        <Stack.Navigator initialRouteName="Profile" screenOptions={{
            headerStyle: { backgroundColor: '#42f44b' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
        }}>
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile Page' }}/>
        </Stack.Navigator>
    );
}

const AuthLayout = () => {
    const { authState, onLogout } = useAuth();

    return (
        <NavigationContainer>
            {authState?.authenticated ? (
                <Tab.Navigator initialRouteName="Home" screenOptions={({ route }) => ({
                    tabBarActiveTintColor: '#42f44b',
                    // tabBarInactiveTintColor: 'gray',
                    // tabBarStyle: { backgroundColor: '#42f44b' },
                    // tabBarLabelStyle: { fontSize: 16 },
                    // tabBarIconStyle: { fontSize: 24 },
                    // tabBarShowLabel: false,
                    // headerShown: false,
                })}>
                    <Tab.Screen name="HomeStack" component={HomeStack} options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account-group" color={color} size={size}/>
                        ),
                    }}/>
                    <Tab.Screen name="FriendsStack" component={FriendsStack} options={{
                        tabBarLabel: 'Friends',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="run-fast" color={color} size={size}/>
                        ),
                    }}/>
                    <Tab.Screen name="ProfileStack" component={ProfileStack} options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account-cog" color={color} size={size}/>
                        ),
                    }}/>
                </Tab.Navigator>
            ) : (
                <Stack.Navigator>
                    <Stack.Screen name="Authentication" component={AuthScreen}></Stack.Screen>
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
};

export default AuthLayout;
