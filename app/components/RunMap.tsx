
import {Image} from "react-native";
import {defaultMapImageUrl} from "../utils/constants";

const RunMap = ({ runId }: any) => {
    return (
        <Image source={{uri: defaultMapImageUrl}} style={{
            width: "100%",
            height: 300,
        }} alt="Run Map" />
    );
};

export default RunMap;
