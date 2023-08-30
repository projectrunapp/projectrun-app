
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";

const RunMap = ({ runId }: any) => {
    return (
        <MapView provider={PROVIDER_GOOGLE}
            style={{
                flex: 1,
                minHeight: 300,
            }}
            initialRegion={{
                latitude: 34.0111248,
                longitude: -118.4999983,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }}
        />
    );
}

export default RunMap;
