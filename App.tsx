
import {AuthProvider} from "./app/context/AuthContext";
import {Provider as PaperProvider} from "react-native-paper";
import AppLayout from "./app/screens/AppLayout";

export default function App() {
    return (
        <AuthProvider>
            <PaperProvider>
                <AppLayout />
            </PaperProvider>
        </AuthProvider>
    );
}
