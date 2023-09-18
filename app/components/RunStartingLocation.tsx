
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import React, {useEffect} from "react";
import {ActivityIndicator, Button, StyleSheet, Text, View} from "react-native";
import {appPrimaryColor} from "../utils/app-constants";
import {useIsFocused} from "@react-navigation/native";

export default function RunStartingLocation({
                                                retrievingMapLocation,
                                                permissionAllowed,
                                                currentMapLocation,
                                                startForegroundTracking,
                                                stopForegroundTracking,
}) {
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused && permissionAllowed) { // the component mounts or the screen gains focus
            startForegroundTracking();
        } else { // the screen loses focus
            stopForegroundTracking();
        }
    }, [isFocused, permissionAllowed]);

    useEffect(() => {
        if (isFocused) {
            startForegroundTracking();
        }
    }, []);

    return retrievingMapLocation ? (
        <View style={styles.loading_container}>
            <ActivityIndicator size="large" />
        </View>
    ) : (permissionAllowed ? (
        currentMapLocation ? (
            <MapView provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={{
                latitude: currentMapLocation.lat,
                longitude: currentMapLocation.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }}>
                <Marker description="Starting location" pinColor={appPrimaryColor} coordinate={{
                    latitude: currentMapLocation.lat,
                    longitude: currentMapLocation.lng,
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
            <Button title="Allow access" onPress={() => startForegroundTracking()}/>
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
