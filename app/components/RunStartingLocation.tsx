
import * as Location from "expo-location";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import React, {useEffect, useState} from "react";
import {ActivityIndicator, Button, StyleSheet, Text, View} from "react-native";
import {appPrimaryColor, updateLocationTimeoutSeconds} from "../utils/app-constants";
import {useIsFocused} from "@react-navigation/native";

export default function RunStartingLocation({
                                                showPopup,
                                                permissionAllowed,
                                                setPermissionAllowed,
                                                addRunCoordinate,
}) {
    const isFocused = useIsFocused();
    const [retrievingLocation, setRetrievingLocation] = useState<boolean>(true);
    const [currentLocation, setCurrentLocation] = useState<any>(null);

    const updateLocation = async () => {
        const permissionRequest = await Location.requestForegroundPermissionsAsync();
        // {"android": {"accuracy": "fine", "scoped": "fine"}, "canAskAgain": true, "expires": "never", "granted": true, "status": "granted"}
        if (permissionRequest.status === "granted") {
            setPermissionAllowed(true);
            const location = await Location.getCurrentPositionAsync({});

            setRetrievingLocation(false);
            setCurrentLocation({
                lat: location.coords.latitude,
                lng: location.coords.longitude,
            });

            // calling the async method without await
            addRunCoordinate(location.coords.latitude, location.coords.longitude);

            const currentTime = new Date().toLocaleTimeString("en-US", {hour12: false});
            console.log(`LOCATION: ${currentTime} >>> ${location.coords.latitude}, ${location.coords.longitude}`);
        } else {
            setRetrievingLocation(false);
            setPermissionAllowed(false);
            showPopup(false, "Access denied!");
        }
    };

    useEffect(() => {
        let intervalId = null;

        if (isFocused && permissionAllowed) { // the component mounts or the screen gains focus
            intervalId = setInterval(() => {
                updateLocation();
            }, updateLocationTimeoutSeconds * 1000);
        } else { // the screen loses focus
            clearInterval(intervalId);
        }

        return () => clearInterval(intervalId); // the component unmounts or the screen loses focus
    }, [isFocused, permissionAllowed]);

    useEffect(() => {
        if (isFocused) {
            updateLocation();
        }
    }, []);

    return retrievingLocation ? (
        <View style={styles.loading_container}>
            <ActivityIndicator size="large" />
        </View>
    ) : (permissionAllowed ? (
        currentLocation ? (
            <MapView provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={{
                latitude: currentLocation.lat,
                longitude: currentLocation.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }}>
                <Marker description="Starting location" pinColor={appPrimaryColor} coordinate={{
                    latitude: currentLocation.lat,
                    longitude: currentLocation.lng,
                }}/>
            </MapView>
        ) : (
            <View style={styles.loading_container}>
                <Text style={styles.loading_text}>
                    Loading...
                </Text>
            </View>
        )
    ) : (
        <View style={styles.allow_access_container}>
            <Button title="Allow access" onPress={() => updateLocation()}/>
        </View>
    ))
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
        minHeight: 300,
    },
    allow_access_container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loading_container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loading_text: {
        fontSize: 18,
        marginBottom: 16,
    },
});
