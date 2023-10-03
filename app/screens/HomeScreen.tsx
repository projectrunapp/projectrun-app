
import {ScrollView} from "react-native";
import {Graphics} from "../components/Graphics";
import RunsDataTable from "../components/RunsDataTable";

export default function HomeScreen() {
    return (
        <ScrollView>
            <Graphics />
            <RunsDataTable />
        </ScrollView>
    );
};
