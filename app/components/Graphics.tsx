
import {ActivityIndicator, Alert, StyleSheet, Text, View} from "react-native";
import {VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryTheme} from "victory-native";
import axios from "axios";
import {useAuth} from "../context/AuthContext";
import React, {useEffect, useState} from "react";
import MultiSwitch from "./MultiSwitch";
import {humanizedDistance} from "../utils/helper";
import {appPrimaryColor, months, weekDays} from "../utils/app-constants";

export const Graphics = ({ userId }: {
    userId?: number,
}) => {
    const { authState } = useAuth();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [timeFrame, setTimeFrame] = useState("MONTH");

    const loadRunsByTime = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.API_URL}/run/runs-by-time/${userId ? userId : authState!.id}?interval=${timeFrame}`, {
                headers: {
                    Authorization: `Bearer ${authState!.token}`,
                    // "Content-Type": "application/json",
                }
            });

            if (response.data.success) {
                const result = [];
                for (const timing in response.data.data) {
                    if (response.data.data.hasOwnProperty(timing)) {
                        const timingParts = timing.split("-");
                        let timingFrame = "";

                        switch (timeFrame) {
                            case "WEEK": case "MONTH":
                                timingFrame = timingParts[2];
                                break;
                            case "YEAR":
                                timingFrame = timingParts[1];
                                break;
                            default: // "ALL"
                                timingFrame = timingParts[0];
                        }

                        // TODO: decide weather to implement this logic on mobile or on backend
                        result.push({
                            timing: timingFrame,
                            distance: response.data.data[timing].distance,
                        });
                    }
                }
                setData(result);
            }
            setLoading(false);
        } catch (err) {
            // console.error(err.message);
            setLoading(false);
            Alert.alert('Error', "Something went wrong!");
        }
    };

    const xAxisLabel = (): string => {
        const thisMonth = new Date().getMonth();
        return timeFrame === "WEEK" || timeFrame === "MONTH"
            ? months[thisMonth]
            : (timeFrame === "YEAR" ? "months" : "years")
    };
    const xAxisTickFormat = (x: string): string => {
        const index = (Number(x) - 1).toString();

        return timeFrame === "YEAR"
            ? months[index]
            : (timeFrame === "WEEK" ? weekDays[index] : Number(x))
    };

    useEffect(() => {
        loadRunsByTime();
    }, [timeFrame]);

    return (
        <View style={styles.container}>
            <View style={styles.graphics_header}>
                <Text style={styles.graphics_header_text}>Activity</Text>
            </View>
            <View style={styles.time_frame_switcher_container}>
                <MultiSwitch items={["WEEK", "MONTH", "YEAR", "ALL"]}
                             value={timeFrame}
                             onChange={(val) => setTimeFrame(val)}
                />
            </View>
            {loading ? (
                <View style={styles.loading_container}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <VictoryChart theme={VictoryTheme.material}
                    // padding={{ left: 50, right: 50, top: 20, bottom: 50 }}
                    domainPadding={{ x: 15, y: 15 }}
                    width={350} height={300}
                    style={{
                        // parent: {marginLeft: 50, paddingLeft: 50},
                        background: {fill: "#f5fcff"},
                    }}
                    animate={{
                        duration: 1000,
                        onLoad: { duration: 250 }
                    }}
                >
                    {data.length > 0 && (<VictoryAxis
                        style={{
                            axisLabel: {fontSize: 12, fontWeight: "bold"},
                        }}
                        label={data[0].distance > 1000 ? "km" : "m"}
                        dependentAxis={true}
                        tickFormat={y => humanizedDistance(y, 0, false)}
                        axisLabelComponent={<VictoryLabel dx={110} />}
                        // tickLabelComponent={<VictoryLabel angle={-45} />}
                    />)}
                    {data.length > 0 && (<VictoryAxis
                        style={timeFrame === "MONTH" ? {
                            tickLabels: {fontSize: 7, fontWeight: "bold"},
                            axisLabel: {fontSize: 12, fontWeight: "bold"},
                        } : {
                            axisLabel: {fontSize: 12, fontWeight: "bold"},
                        }}
                        label={xAxisLabel()}
                        dependentAxis={false}
                        tickFormat={x => xAxisTickFormat(x)}
                        axisLabelComponent={<VictoryLabel dx={120} dy={20} />}
                    />)}
                    <VictoryBar data={data}
                                style={{
                                    data: {
                                        fill: appPrimaryColor,
                                        // width: 10,
                                    }
                                }}
                                x="timing"
                                y="distance"
                    />
                </VictoryChart>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5fcff",
    },
    graphics_header: {
        margin: 10,
    },
    graphics_header_text: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    time_frame_switcher_container: {
        margin: 10,
    },
    loading_container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: 300,
    },
});
