
import {ScrollView} from "react-native";
import {Graphics} from "../components/Graphics";
import RunsDataTable from "../components/RunsDataTable";

const HomeScreen = () => {
    return (
        <ScrollView>
            <Graphics />
            <RunsDataTable />
        </ScrollView>
    );
};

export default HomeScreen;
