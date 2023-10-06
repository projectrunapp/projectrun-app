
import React, { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import axios from "axios";
import {useAuth} from "../context/AuthContext";
import {paginationPerPages} from "../utils/app-constants";
import {useNavigation} from "@react-navigation/native";
import {Alert, StyleSheet, Text, View} from "react-native";
import {dateStringFormatV2, humanizedAvgSpeed, humanizedDistance, humanizedDuration} from "../utils/helper";

export default function RunsDataTable() {
    const navigation = useNavigation();
    const { authState } = useAuth();

    const [page, setPage] = useState(0);
    const [runs, setRuns] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [perPage, setPerPage] = useState(paginationPerPages[0]); // 10

    const navigateToSingleRun = (runId: number, title: string) => {
        // @ts-ignore
        navigation.navigate("Run", {
            screen: "SingleRunScreen",
            params: {
                runId,
                title,
            }
        });
    };

    const loadRuns = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.API_URL}/run/my-runs?page=${page + 1}&per_page=${perPage}`, {
                headers: {
                    Authorization: `Bearer ${authState!.token}`,
                    // "Content-Type": "application/json",
                }
            });
            if (response.data.success && response.data.data.runs) {
                setRuns(response.data.data.runs);
                setTotal(response.data.data.total);
            }
            setLoading(false);
        } catch (err) {
            // console.error(err.message);
            setLoading(false);
            Alert.alert('Error', "Something went wrong!");
        }
    };

    useEffect(() => {
        loadRuns();
    }, [page, perPage]);

    return (
        <>
            <View style={styles.datatable_header}>
                <Text style={styles.datatable_header_text}>Recent Runs</Text>
            </View>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Title</DataTable.Title>
                    <DataTable.Title>Distance</DataTable.Title>
                    <DataTable.Title>Time</DataTable.Title>
                    <DataTable.Title>~ meters/min</DataTable.Title>
                </DataTable.Header>
                {
                    loading ? (
                        <DataTable.Row>
                            <DataTable.Cell>Loading...</DataTable.Cell>
                        </DataTable.Row>
                    ) : (
                        total === 0 ? (
                            <DataTable.Row>
                                <DataTable.Cell>No runs yet :(</DataTable.Cell>
                            </DataTable.Row>
                        ) : (
                            runs.map((run, index) => (
                                <DataTable.Row key={index} onPress={() => navigateToSingleRun(run.id, run.title)}>
                                    <DataTable.Cell>{dateStringFormatV2(run.started_at)}</DataTable.Cell>
                                    <DataTable.Cell>{humanizedDistance(run.distance)}</DataTable.Cell>
                                    <DataTable.Cell>{humanizedDuration(run.duration)}</DataTable.Cell>
                                    <DataTable.Cell>{humanizedAvgSpeed(run.avg_speed, false)}</DataTable.Cell>
                                </DataTable.Row>
                            ))
                        )
                    )
                }
                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(total / perPage)}
                    onPageChange={page => setPage(page)}
                    label={`${perPage} runs per page`}
                    showFastPaginationControls
                    numberOfItemsPerPageList={paginationPerPages}
                    numberOfItemsPerPage={perPage}
                    onItemsPerPageChange={value => setPerPage(value)}
                    selectPageDropdownLabel={'Rows per page'}
                />
            </DataTable>
        </>
    );
};

const styles = StyleSheet.create({
    datatable_header: {
        marginTop: 16,
    },
    datatable_header_text: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
});
