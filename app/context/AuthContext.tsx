
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
        birth_date: string | null,
        gender: string,
    },
    getStorageUser?: () => Promise<{
        id: number | null,
        name: string | null,
        email: string | null,
        username: string | null,
        birth_date: string | null,
        gender: string,
    }>,
    setStorageUser?: (userData: {
        id?: number,
        name?: string,
        email?: string,
        username?: string,
        birth_date?: string,
        gender?: string,
    }) => Promise<void>,
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
        birth_date: string | null,
        gender: string,
    }>({
        authenticated: false,
        token: null,
        id: null,
        name: null,
        email: null,
        username: null,
        birth_date: null,
        gender: 'unknown',
    });

    const getStorageUser = async () => {
        const id = await AsyncStorage.getItem('user_id');
        const name = await AsyncStorage.getItem('user_name');
        const email = await AsyncStorage.getItem('user_email');
        const username = await AsyncStorage.getItem('user_username');
        const birth_date = await AsyncStorage.getItem('user_birth_date');
        const gender = await AsyncStorage.getItem('user_gender');

        return {
            id: id ? parseInt(id) : null,
            name: name,
            email: email,
            username: username,
            birth_date: birth_date,
            gender: gender
        }
    }
    const setStorageUser = async (userData: {
        id?: number,
        name?: string,
        email?: string,
        username?: string,
        birth_date?: string,
        gender?: string,
    }) => {
        if (userData.id) {
            await AsyncStorage.setItem('user_id', userData.id.toString());
        }
        if (userData.name) {
            await AsyncStorage.setItem('user_name', userData.name);
        }
        if (userData.email) {
            await AsyncStorage.setItem('user_email', userData.email);
        }
        if (userData.username) {
            await AsyncStorage.setItem('user_username', userData.username);
        }
        if (userData.birth_date) {
            await AsyncStorage.setItem('user_birth_date', userData.birth_date);
        }
        if (userData.gender) {
            await AsyncStorage.setItem('user_gender', userData.gender);
        }
    };
    const clearStorageUser = async () => {
        await AsyncStorage.setItem('user_id', '');
        await AsyncStorage.setItem('user_name', '');
        await AsyncStorage.setItem('user_email', '');
        await AsyncStorage.setItem('user_username', '');
        await AsyncStorage.setItem('user_birth_date', '');
        await AsyncStorage.setItem('user_gender', '');
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
                birth_date: userData.birth_date,
                gender: userData.gender,
            });

            setAuthState({
                authenticated: true,
                token: userData.access_token,
                id: userData.id,
                name: userData.name,
                email: userData.email,
                username: userData.username,
                birth_date: userData.birth_date,
                gender: userData.gender,
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
            birth_date: null,
            gender: 'unknown',
        });
    }

    const loadAuthUserData = async () => {
        const token = await SecureStore.getItemAsync(process.env.JWT_KEY);
        // TODO: load user data (id, email) by extracting JWT token
        if (token) {
            const {id, name, email, username, birth_date, gender} = await getStorageUser();

            setAuthState({
                authenticated: true,
                token: token,
                id,
                name,
                email,
                username,
                birth_date,
                gender: gender || 'unknown',
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
            setStorageUser,
            onRegister: register,
            onLogin: login,
            onLogout: logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}
