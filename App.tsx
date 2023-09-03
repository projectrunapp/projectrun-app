
import {AuthProvider} from "./app/context/AuthContext";
import {Provider as PaperProvider} from "react-native-paper";
import AppLayout from "./app/screens/AppLayout";
import {FriendshipRefreshProvider} from "./app/context/FriendshipRefreshContext";

export default function App() {
    return (
        <AuthProvider>
            <FriendshipRefreshProvider>
                <PaperProvider>
                    <AppLayout />
                </PaperProvider>
            </FriendshipRefreshProvider>
        </AuthProvider>
    );
}
