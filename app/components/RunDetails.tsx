
import {StyleSheet, Text, View} from "react-native";
import {dateStringFormat} from "../utils/helper";

const RunDetails = ({ run }: {
    run: {
        title: string,
        started: number,
        completed: number,
        distance: number,
        duration: number,
        avg_speed: number,
    }
}) => {
    return (
        <View style={styles.details_list}>
            <RunDetailsRow label="Title:" value={run.title} />
            <RunDetailsRow label="Started at:" value={dateStringFormat(run.started)} />
            <RunDetailsRow label="Ended at:" value={dateStringFormat(run.completed)} />
            <RunDetailsRow label="Distance:" value={run.distance} />
            <RunDetailsRow label="Duration:" value={run.duration} />
            <RunDetailsRow label="Average Speed:" value={run.avg_speed} />
        </View>
    );
};

const RunDetailsRow = ({ label, value }: any) => {
    return (
        <View style={styles.details_container}>
            <Text style={styles.details_label}>{label}</Text>
            <Text style={styles.details_value}>{value}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    details_list: {
        marginTop: 16,
    },
    details_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    details_label: {
        textAlign: 'left',
        marginRight: 8,
        flex: 1,
    },
    details_value: {
        textAlign: 'right',
        flex: 1,
        fontWeight: 'bold',
    },
});

export default RunDetails;
