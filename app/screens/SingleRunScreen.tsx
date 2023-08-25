
import {ScrollView, Text} from "react-native";

const SingleRunScreen = ({ route }: any) => {
    return (
        <ScrollView>
            <Text>RUN ID: {route.params.runId}</Text>
            <Text>RUN Title: {route.params.title}</Text>
        </ScrollView>
    );
};

export default SingleRunScreen;
