
import * as React from 'react';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import FriendsScreen from "./Friendship/FriendsScreen";
import ReceivedFriendRequestsScreen from "./Friendship/ReceivedFriendRequestsScreen";
import SentFriendRequestsScreen from "./Friendship/SentFriendRequestsScreen";
import {appPrimaryColor} from "../utils/app-constants";

const Tab = createMaterialTopTabNavigator();

export default function FriendshipScreen() {
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
            <Tab.Screen name="Friends" component={FriendsScreen} />
            <Tab.Screen name="Received" component={ReceivedFriendRequestsScreen} />
            <Tab.Screen name="Sent" component={SentFriendRequestsScreen} />
        </Tab.Navigator>
    );
}
