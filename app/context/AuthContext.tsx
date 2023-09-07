
import {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthProps {
    authState?: {
        authenticated: boolean,
        token: string | null,
        id: number | null,
        name: string | null,
        email: string | null,
        username: string | null,
    },
    getStorageUser?: () => Promise<{
        storageUserId: number | null,
        storageUserName: string | null,
        storageUserEmail: string | null,
        storageUserUsername: string | null,
    }>,
    onRegister?: (email: string,
                  password: string,
                  username: string,
                  name: string,
                  birth_date: string,
                  gender: string) => Promise<any>,
    onLogin?: (email: string, password: string) => Promise<any>,
    onLogout?: () => Promise<any>,
}

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({children}: any) => {
    const [authState, setAuthState] = useState<{
        authenticated: boolean,
        token: string | null,
        id: number | null,
        name: string | null,
        email: string | null,
        username: string | null,
    }>({
        authenticated: false,
        token: null,
        id: null,
        name: null,
        email: null,
        username: null,
    });

    const getStorageUser = async () => {
        const id = await AsyncStorage.getItem('user_id');
        const name = await AsyncStorage.getItem('user_name');
        const email = await AsyncStorage.getItem('user_email');
        const username = await AsyncStorage.getItem('user_username');

        return {
            storageUserId: id ? parseInt(id) : null,
            storageUserName: name,
            storageUserEmail: email,
            storageUserUsername: username,
        }
    }
    const setStorageUser = async (userData) => {
        await AsyncStorage.setItem('user_id', userData.id.toString());
        await AsyncStorage.setItem('user_name', userData.name);
        await AsyncStorage.setItem('user_email', userData.email);
        await AsyncStorage.setItem('user_username', userData.username);
    };
    const clearStorageUser = async () => {
        await AsyncStorage.setItem('user_id', '');
        await AsyncStorage.setItem('user_name', '');
        await AsyncStorage.setItem('user_email', '');
        await AsyncStorage.setItem('user_username', '');
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${process.env.API_URL}/auth/login`, {email, password});
            if (!response.data.success) {
                return response.data;
            }

            const userData = response.data.data;

            await setStorageUser({
                id: userData.id,
                name: userData.name,
                email: userData.email,
                username: userData.username,
            });

            setAuthState({
                authenticated: true,
                token: userData.access_token,
                id: userData.id,
                name: userData.name,
                email: userData.email,
                username: userData.username,
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.access_token}`;
            // axios.defaults.headers.common['Content-Type'] = 'application/json';

            await SecureStore.setItemAsync(process.env.JWT_KEY, userData.access_token);

            return response.data;
        } catch (err) {
            // console.error(err.message);
            return {success: false, message: "Something went wrong!"};
        }
    }

    const register = async (email: string,
                            password: string,
                            username: string,
                            name: string,
                            birth_date: string,
                            gender: string) => {
        try {
            const response = await axios.post(`${process.env.API_URL}/auth/register`, {
                email,
                password,
                username,
                name,
                birth_date,
                gender
            });

            return response.data;
        } catch (err) {
            // console.error(err.message);
            return {success: false, message: "Something went wrong!"};
        }
    }

    const logout = async () => {
        await SecureStore.deleteItemAsync(process.env.JWT_KEY);

        axios.defaults.headers.common['Authorization'] = '';
        // axios.defaults.headers.common['Content-Type'] = 'application/json';

        await clearStorageUser();

        setAuthState({
            authenticated: false,
            token: null,
            id: null,
            name: null,
            email: null,
            username: null,
        });
    }

    const loadAuthUserData = async () => {
        const token = await SecureStore.getItemAsync(process.env.JWT_KEY);
        // TODO: load user data (id, email) by extracting JWT token
        if (token) {
            const {
                storageUserId,
                storageUserName,
                storageUserEmail,
                storageUserUsername,
            } = await getStorageUser();

            setAuthState({
                authenticated: true,
                token: token,
                id: storageUserId,
                name: storageUserName,
                email: storageUserEmail,
                username: storageUserUsername,
            });
        }
    };

    useEffect(() => {
        loadAuthUserData();
    }, [])

    return (
        <AuthContext.Provider value={{
            authState,
            getStorageUser,
            onRegister: register,
            onLogin: login,
            onLogout: logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}
