
import {AuthProvider} from "./app/context/AuthContext";
import {Provider as PaperProvider} from "react-native-paper";
import AppLayout from "./app/screens/AppLayout";
import {FriendshipRefreshProvider} from "./app/context/FriendshipRefreshContext";
import {RunDataProvider} from "./app/context/RunDataContext";
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export default function App() {
    // TODO: remove this block
    // try {
    //     AsyncStorage.clear()
    //     console.info("AsyncStorage cleared.");
    // } catch(err) {
    //     // clear error
    //     console.error("AsyncStorage clear error: ", err.message);
    // }

    GoogleSignin.configure({
        webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
        offlineAccess: false,
    });

    return (
        <AuthProvider>
            <RunDataProvider>
                <FriendshipRefreshProvider>
                    <PaperProvider>
                        <AppLayout />
                    </PaperProvider>
                </FriendshipRefreshProvider>
            </RunDataProvider>
        </AuthProvider>
    );
}
