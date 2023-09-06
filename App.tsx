
import {AuthProvider} from "./app/context/AuthContext";
import {Provider as PaperProvider} from "react-native-paper";
import AppLayout from "./app/screens/AppLayout";
import {FriendshipRefreshProvider} from "./app/context/FriendshipRefreshContext";
import {RunDataProvider} from "./app/context/RunDataContext";

export default function App() {
    // TODO: remove this block
    // try {
    //     AsyncStorage.clear()
    //     console.log("AsyncStorage cleared");
    // } catch(err) {
    //     // clear error
    //     console.log("AsyncStorage clear error: ", err.message);
    // }

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
