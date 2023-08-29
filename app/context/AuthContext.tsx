
import {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';

interface AuthProps {
    authState?: {
        authenticated: boolean,
        token: string | null,
        id: number | null,
        name: string | null,
        email: string | null,
    },
    onRegister?: (email: string,
                  password: string,
                  username: string,
                  name: string,
                  birth_date: string,
                  gender: string) => Promise<any>,
    onLogin?: (email: string, password: string) => Promise<any>,
    onLogout?: () => Promise<any>,
    authLoading?: boolean,
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
    }>({
        authenticated: false,
        token: null,
        id: null,
        name: null,
        email: null,
    });
    const [authLoading, setAuthLoading] = useState(true);

    const login = async (email: string, password: string) => {
        try {
            setAuthLoading(true);
            const response = await axios.post(`${process.env.API_URL}/auth/login`, {email, password});
            if (!response.data.success) {
                setAuthLoading(false);
                return {
                    error: true,
                    message: response.data.message,
                }
            }

            const userData = response.data.data;
            setAuthState({
                authenticated: true,
                token: userData.token,
                id: userData.id,
                name: userData.name,
                email: userData.email,
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.access_token}`;
            axios.defaults.headers.common['Content-Type'] = 'application/json';

            await SecureStore.setItemAsync(process.env.JWT_KEY, userData.access_token);
            setAuthLoading(false);

            return response.data;
        } catch (e) {
            setAuthLoading(false);
            return {
                error: true,
                message: (e as any).response.data.message,
            }
        }
    }

    const register = async (email: string,
                            password: string,
                            username: string,
                            name: string,
                            birth_date: string,
                            gender: string) => {
        try {
            setAuthLoading(true);
            const response = await axios.post(`${process.env.API_URL}/auth/register`, {
                email,
                password,
                username,
                name,
                birth_date,
                gender
            });
            setAuthLoading(false);
            
            if (!response.data.success) {
                return {
                    error: true,
                    message: response.data.message,
                }
            }

            return response.data;
        } catch (e) {
            return {
                error: true,
                message: (e as any).response.data.message,
            }
        }
    }

    const logout = async () => {
        await SecureStore.deleteItemAsync(process.env.JWT_KEY);

        axios.defaults.headers.common['Authorization'] = '';
        // axios.defaults.headers.common['Content-Type'] = 'application/json';

        setAuthState({
            authenticated: false,
            token: null,
            id: null,
            name: null,
            email: null,
        });
    }

    const loadToken = async () => {
        setAuthLoading(true);
        const token = await SecureStore.getItemAsync(process.env.JWT_KEY);
        if (token) {
            setAuthState({
                authenticated: true,
                token: token,
                id: null,
                name: null,
                email: null,
            });
        }
        setAuthLoading(false);
    };

    useEffect(() => {
        loadToken();
    }, [])

    return (
        <AuthContext.Provider value={{
            authState,
            onRegister: register,
            onLogin: login,
            onLogout: logout,
            authLoading,
        }}>
            {children}
        </AuthContext.Provider>
    );
}
