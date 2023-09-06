
import MapView, {PROVIDER_GOOGLE, Polyline} from "react-native-maps";
import {appSecondaryColor} from "../utils/app-constants";

export default function RunMap({ coordinates }) {
    return (
        <MapView provider={PROVIDER_GOOGLE} style={{
            flex: 1,
            minHeight: 300,
        }} initialRegion={coordinates[0]}>
            <Polyline coordinates={coordinates}
                      strokeColor={appSecondaryColor}
                      strokeWidth={8}
                      lineDashPattern={[1]}
            />
        </MapView>
    );
}
