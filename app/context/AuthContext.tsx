
import {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';

interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null },
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
        token: string | null,
        authenticated: boolean | null,
    }>({
        token: null,
        authenticated: null,
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

            const token = response.data.data.access_token;
            setAuthState({
                token,
                authenticated: true,
            });
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await SecureStore.setItemAsync(process.env.JWT_KEY, token);
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

        setAuthState({
            token: null,
            authenticated: false,
        });
    }

    const loadToken = async () => {
        setAuthLoading(true);
        const token = await SecureStore.getItemAsync(process.env.JWT_KEY);
        if (token) {
            setAuthState({
                token: token,
                authenticated: true,
            });
        }
        setAuthLoading(false);
    };

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState,
        authLoading,
    };

    useEffect(() => {
        loadToken();
    }, [])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
