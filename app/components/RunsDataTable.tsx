
import React, { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import {API_URL} from "@env"
import axios from "axios";
import {useAuth} from "../context/AuthContext";
import {paginationPerPages} from "../utils/constants";
import {useNavigation} from "@react-navigation/native";

const RunsDataTable = () => {
    const navigation = useNavigation();
    const { authState } = useAuth();

    const [page, setPage] = useState(0);
    const [runs, setRuns] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [perPage, setPerPage] = useState(paginationPerPages[0]); // 10

    const navigateToSingleRun = (runId: number, title: string) => {
        navigation.navigate('SingleRunScreen', { runId, title });
    };

    const loadRuns = async () => {
        setLoading(true);
        const response = await axios.get(`${API_URL}/run/my-runs?page=${page + 1}&per_page=${perPage}`, {
            headers: {
                Authorization: `Bearer ${authState!.token}`,
            }
        });
        if (response.data.success && response.data.data.runs) {
            setRuns(response.data.data.runs);
            setTotal(response.data.data.total);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadRuns();
    }, [page, perPage]);

    return (
        <DataTable>
            <DataTable.Header>
                <DataTable.Title>ID</DataTable.Title>
                <DataTable.Title>Title</DataTable.Title>
            </DataTable.Header>
            {
                loading ? (
                    <DataTable.Row>
                        <DataTable.Cell>Loading...</DataTable.Cell>
                    </DataTable.Row>
                ) : (
                    runs.map((run, index) => (
                        <DataTable.Row key={index} onPress={() => navigateToSingleRun(run.id, run.title)}>
                            <DataTable.Cell>{run.id}</DataTable.Cell>
                            <DataTable.Cell>{run.title}</DataTable.Cell>
                        </DataTable.Row>
                    ))
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
    );
};

export default RunsDataTable;
