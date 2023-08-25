
import {AuthProvider, useAuth} from "./app/context/AuthContext";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HomeScreen from "./app/screens/HomeScreen";
import AuthScreen from "./app/screens/AuthScreen";
import {ActivityIndicator, Button, StyleSheet, View} from "react-native";
import {Provider as PaperProvider} from "react-native-paper";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <AuthProvider>
          <PaperProvider>
              <Layout></Layout>
          </PaperProvider>
      </AuthProvider>
  );
}

export const Layout = () => {
  const { authState, onLogout, authLoading } = useAuth();

  return (
      authLoading ? (
          <View style={[styles.container, styles.horizontal]}>
              <ActivityIndicator size="large" />
          </View>
      ) : (
          <NavigationContainer>
              <Stack.Navigator>
                  {authState?.authenticated ? (
                      <Stack.Screen name="Home" component={HomeScreen} options={{
                          headerRight: () => <Button onPress={onLogout} title="Log out" />
                      }}></Stack.Screen>
                  ) : (
                      <Stack.Screen name="Authentication" component={AuthScreen}></Stack.Screen>
                  )}
              </Stack.Navigator>
          </NavigationContainer>
      )
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
});
