
import React, { createContext, useContext, useState } from 'react';

const FriendshipRefreshContext = createContext({});

export const useFriendshipRefresh = () => {
    return useContext(FriendshipRefreshContext);
};

export const FriendshipRefreshProvider = ({ children }: any) => {
    const [
        friendsLastRefreshedTime,
        setFriendsLastRefreshedTime
    ] = useState<number>((new Date()).getTime());
    const [
        receivedFriendRequestsLastRefreshedTime,
        setReceivedFriendRequestsLastRefreshedTime
    ] = useState<number>((new Date()).getTime());
    const [
        sentFriendRequestsLastRefreshedTime,
        setSentFriendRequestsLastRefreshedTime
    ] = useState<number>((new Date()).getTime());

    const updateFriendsLastRefreshedTime = () => {
        setFriendsLastRefreshedTime((new Date()).getTime());
    }
    const updateReceivedFriendRequestsLastRefreshedTime = () => {
        setReceivedFriendRequestsLastRefreshedTime((new Date()).getTime());
    }
    const updateSentFriendRequestsLastRefreshedTime = () => {
        setSentFriendRequestsLastRefreshedTime((new Date()).getTime());
    }

    return (
        <FriendshipRefreshContext.Provider value={{
            friendsLastRefreshedTime, updateFriendsLastRefreshedTime,
            receivedFriendRequestsLastRefreshedTime, updateReceivedFriendRequestsLastRefreshedTime,
            sentFriendRequestsLastRefreshedTime, updateSentFriendRequestsLastRefreshedTime,
        }}>
            {children}
        </FriendshipRefreshContext.Provider>
    );
};
