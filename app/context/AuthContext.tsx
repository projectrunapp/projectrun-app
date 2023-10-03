
import {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {GoogleSignin, NativeModuleError, statusCodes} from "@react-native-google-signin/google-signin";

interface AuthProps {
    authState?: {
        authenticated: boolean, token: string | null,
        id: number | null, name: string | null, email: string | null, username: string | null,
        birth_date: string | null, gender: string, avatar: string | null, bio: string | null,
    },
    getStorageUser?: () => Promise<{
        id: number | null, name: string | null, email: string | null, username: string | null,
        birth_date: string | null, gender: string, avatar: string | null, bio: string | null,
    }>,
    setStorageUser?: (userData: {
        id?: number, name?: string, email?: string, username?: string,
        birth_date?: string, gender?: string, avatar?: string, bio: string | null,
    }) => Promise<void>,
    onRegister?: (email: string, password: string, username: string, name: string,
                  birth_date: string, gender: string) => Promise<any>,
    onLogin?: (email: string, password: string) => Promise<any>,
    onLogout?: () => Promise<any>,
    googleSignIn?: () => Promise<any>,
}

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({children}: any) => {
    const [authState, setAuthState] = useState<{
        authenticated: boolean, token: string | null,
        id: number | null, name: string | null, email: string | null, username: string | null,
        birth_date: string | null, gender: string, avatar: string | null, bio: string | null,
    }>({
        authenticated: false, token: null,
        id: null, name: null, email: null, username: null,
        birth_date: null, gender: 'unknown', avatar: null, bio: null,
    });

    const getStorageUser = async () => {
        const id = await AsyncStorage.getItem('user_id');
        const name = await AsyncStorage.getItem('user_name');
        const email = await AsyncStorage.getItem('user_email');
        const username = await AsyncStorage.getItem('user_username');
        const birth_date = await AsyncStorage.getItem('user_birth_date');
        const bio = await AsyncStorage.getItem('user_bio');
        const gender = await AsyncStorage.getItem('user_gender');
        const avatar = await AsyncStorage.getItem('user_avatar');

        return {
            id: id ? parseInt(id) : null, name: name, email: email, username: username,
            birth_date: birth_date, gender: gender, avatar: avatar, bio: bio,
        }
    }
    const setStorageUser = async (userData: {
        id?: number, name?: string, email?: string, username?: string,
        birth_date?: string, gender?: string, avatar?: string, bio?: string,
    }) =>
    {
        if (userData.id) { await AsyncStorage.setItem('user_id', userData.id.toString()); }
        if (userData.name) { await AsyncStorage.setItem('user_name', userData.name); }
        if (userData.email) { await AsyncStorage.setItem('user_email', userData.email); }
        if (userData.username) { await AsyncStorage.setItem('user_username', userData.username); }
        if (userData.birth_date) { await AsyncStorage.setItem('user_birth_date', userData.birth_date); }
        if (userData.bio) { await AsyncStorage.setItem('user_bio', userData.bio); }
        if (userData.gender) { await AsyncStorage.setItem('user_gender', userData.gender); }
        if (userData.avatar) { await AsyncStorage.setItem('user_avatar', userData.avatar); }
    };
    const clearStorageUser = async () => {
        await AsyncStorage.setItem('user_id', '');
        await AsyncStorage.setItem('user_name', '');
        await AsyncStorage.setItem('user_email', '');
        await AsyncStorage.setItem('user_username', '');
        await AsyncStorage.setItem('user_birth_date', '');
        await AsyncStorage.setItem('user_bio', '');
        await AsyncStorage.setItem('user_gender', '');
        await AsyncStorage.setItem('user_avatar', '');
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${process.env.API_URL}/auth/login`, {email, password});
            if (!response.data.success) {
                return response.data;
            }

            const userData = response.data.data;

            await setStorageUser({
                id: userData.id, name: userData.name, email: userData.email, username: userData.username,
                birth_date: userData.birth_date, gender: userData.gender, avatar: userData.avatar, bio: userData.bio,
            });

            setAuthState({
                authenticated: true, token: userData.access_token,
                id: userData.id, name: userData.name, email: userData.email, username: userData.username,
                birth_date: userData.birth_date, gender: userData.gender, avatar: userData.avatar, bio: userData.bio,
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

    const register = async (email: string, password: string, username: string, name: string,
                            birth_date: string, gender: string) =>
    {
        try {
            const response = await axios.post(`${process.env.API_URL}/auth/register`, {
                email, password, username, name,
                birth_date, gender,
            });

            return response.data;
        } catch (err) {
            // console.error(err.message);
            return {success: false, message: "Something went wrong!"};
        }
    }

    const logout = async () => {
        await SecureStore.deleteItemAsync(process.env.JWT_KEY);

        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();

        axios.defaults.headers.common['Authorization'] = '';
        // axios.defaults.headers.common['Content-Type'] = 'application/json';

        await clearStorageUser();

        setAuthState({
            authenticated: false, token: null,
            id: null, name: null, email: null, username: null,
            birth_date: null, gender: 'unknown', avatar: null, bio: null,
        });
    }

    const loadAuthUserData = async () => {
        const token = await SecureStore.getItemAsync(process.env.JWT_KEY);
        // TODO: load user data (id, email) by extracting JWT token
        if (token) {
            const {id, name, email, username, birth_date, gender, avatar, bio} = await getStorageUser();

            setAuthState({
                authenticated: true, token: token,
                id, name, email, username,
                birth_date, gender: gender || 'unknown', avatar, bio,
            });
        }
    };

    const googleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const googleUserInfo = await GoogleSignin.signIn();

            const response = await axios.post(`${process.env.API_URL}/auth/google`, {
                idToken: googleUserInfo.idToken,
                ...googleUserInfo.user,
            }, {
                // headers: {
                //     "Content-Type": "application/json",
                // }
            });

            if (!response.data.success) {
                return response.data;
            }

            const userData = response.data.data;

            await setStorageUser({
                id: userData.id, name: userData.name, email: userData.email, username: userData.username,
                gender: userData.gender, birth_date: userData.birth_date, avatar: userData.avatar, bio: userData.bio,
            });

            setAuthState({
                authenticated: true, token: userData.access_token,
                id: userData.id, name: userData.name, email: userData.email, username: userData.username,
                gender: userData.gender, birth_date: userData.birth_date, avatar: userData.avatar, bio: userData.bio,
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.access_token}`;
            // axios.defaults.headers.common['Content-Type'] = 'application/json';

            await SecureStore.setItemAsync(process.env.JWT_KEY, userData.access_token);

            return response.data;
        } catch (err) {
            let message = "";
            const typedError = err as NativeModuleError;
            switch (typedError.code) {
                case statusCodes.SIGN_IN_CANCELLED:
                    message = "Sign in was cancelled!";
                    break;
                case statusCodes.IN_PROGRESS:
                    // operation (e.g., sign in) already in progress
                    message = "Operation already in progress!"
                    break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    message = "Play services not available or outdated!";
                    break;
                default:
                    message = typedError.message || "Something went wrong!";
            }

            console.error(message); // err.message

            return {success: false, message: message};
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
            googleSignIn,
        }}>
            {children}
        </AuthContext.Provider>
    );
}
