
import React, {useEffect} from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {popupOptions} from "../utils/app-constants";

export default function PopupMessage({ isVisible, message, success, onClose }) {
    useEffect(() => {
        if (isVisible) {
            const timeoutId = setTimeout(() => {
                onClose();
            }, popupOptions.close_timeout_seconds * 1000);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [onClose]);

    return (
        <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.container}>
                <View style={[styles.popup, {backgroundColor: success ? popupOptions.success_color : popupOptions.error_color}]}>
                    <Text style={styles.message}>
                        {message}
                    </Text>
                    <TouchableOpacity onPress={onClose} style={styles.close_btn}>
                        <MaterialCommunityIcons name="close" size={24} color={'black'} />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: {
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        bottom: 60,
        width: '80%',
    },
    message: {
        fontSize: 14,
    },
    close_btn: {
        marginLeft: 20,
    }
});
