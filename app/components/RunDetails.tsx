
import {StyleSheet, Text, View} from "react-native";
import {dateStringFormat, humanizedAvgSpeed, humanizedDistance, humanizedDuration} from "../utils/helper";

export default function({ run }: {
    run: {
        title: string,
        started: number,
        completed: number,
        distance: number,
        duration: number,
        avg_speed: number,
    }
}) {
    return (
        <View style={styles.details_list}>
            <Text style={styles.run_title}>
                {run.title}
            </Text>
            <RunDetailsRow label="Started at:" value={dateStringFormat(run.started)} />
            <RunDetailsRow label="Ended at:" value={dateStringFormat(run.completed)} />
            <RunDetailsRow label="Distance:" value={humanizedDistance(run.distance)} />
            <RunDetailsRow label="Duration:" value={humanizedDuration(run.duration)} />
            <RunDetailsRow label="Average Speed:" value={humanizedAvgSpeed(run.avg_speed)} />
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
    run_title: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
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
