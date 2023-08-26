
import {StyleSheet, Text, View} from "react-native";

const RunDetails = ({ run }: any) => {

    // example: convert "2023-08-25T07:07:26.240Z" to "Aug 25, 2023; 7:07 AM"
    const dateStringFormat = (dateString: string): string => {
        const date = new Date(dateString);

        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        const year = date.getFullYear();
        const time = date.toLocaleString('default', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        })

        return `${month} ${day}, ${year}; ${time}`;
    }

    return (
        <View style={styles.details_list}>
            <RunDetailsRow label="Title:" value={run.title} />
            <RunDetailsRow label="Calories Burned:" value={run.calories_burned} />
            <RunDetailsRow label="Started at:" value={dateStringFormat(run.datetime_start)} />
            <RunDetailsRow label="Ended at:" value={dateStringFormat(run.datetime_end)} />
            <RunDetailsRow label="Distance:" value={run.distance} />
            <RunDetailsRow label="Duration:" value={run.duration} />
            <RunDetailsRow label="Elevation Gain:" value={run.elevation_gain} />
            <RunDetailsRow label="Average Heart Rate:" value={run.heart_rate_avg} />
            <RunDetailsRow label="Started from:" value={run.location_start} />
            <RunDetailsRow label="Finished on:" value={run.location_end} />
            <RunDetailsRow label="Average Pace:" value={run.pace_avg} />
            <RunDetailsRow label="Temperature:" value={run.temperature} />
            <RunDetailsRow label="Terrain:" value={run.terrain} />
            <RunDetailsRow label="Weather:" value={run.weather} />
            <RunDetailsRow label="Notes:" value={run.notes} />
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
