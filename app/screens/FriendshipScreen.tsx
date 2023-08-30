
import * as React from 'react';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import FriendsScreen from "./Friendship/FriendsScreen";
import ReceivedFriendRequestsScreen from "./Friendship/ReceivedFriendRequestsScreen";
import SentFriendRequestsScreen from "./Friendship/SentFriendRequestsScreen";
import {appPrimaryColor} from "../utils/app-constants";

const Tab = createMaterialTopTabNavigator();

export default function FriendshipScreen() {
    const [lastRefreshedTime, setLastRefreshedTime] = React.useState((new Date()).getTime());

    return (
        <Tab.Navigator screenOptions={{
            // tabBarShowIcon: false,
            // tabBarShowLabel: false,
            // tabBarActiveTintColor: 'red',
            // tabBarInactiveTintColor: 'green',
            // tabBarStyle: { backgroundColor: 'blue' },
            // tabBarItemStyle: { width: 100 },
            // tabBarLabelStyle: { fontSize: 12 },
            tabBarIndicatorStyle: {
                backgroundColor: appPrimaryColor,
                height: 4,
            },
        }}>
            <Tab.Screen name="Friends" children={() => (
                <FriendsScreen lastRefreshedTime={lastRefreshedTime}/>
            )}/>
            <Tab.Screen name="Received" children={() => (
                <ReceivedFriendRequestsScreen setLastRefreshedTime={setLastRefreshedTime}/>
            )}/>
            <Tab.Screen name="Sent" component={SentFriendRequestsScreen}
                        // initialParams={{lastRefreshedTime, setLastRefreshedTime}}
            />
        </Tab.Navigator>
    );
}
