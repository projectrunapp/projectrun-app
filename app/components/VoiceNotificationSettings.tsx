
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { RadioButton, Provider as PaperProvider } from 'react-native-paper';
import {useRunData} from "../context/RunDataContext";
import {voiceNotification} from "../utils/app-constants";

export default function VoiceNotificationSettings({showPopup}) {
    const {
        storageGetVoiceNotificationSettings,
        storageSetVoiceNotificationSettings,
    } = useRunData();

    const [isEnabled, setIsEnabled] = useState<boolean>(voiceNotification.enabled);
    const [selection, setSelection] = useState<string>(voiceNotification.by);
    const [distanceSelection, setDistanceSelection] = useState<string>(voiceNotification.each_distance.toString());
    const [timeSelection, setTimeSelection] = useState<string>(voiceNotification.each_time.toString());

    const handleChange = async (settings: {
        enabled: boolean,
        by?: string,
        each_distance?: string,
        each_time?: string
    }, onLoad: boolean) => {
        const {enabled, by, each_distance, each_time} = settings;
        if (enabled) {
            setIsEnabled(true);
            if (by) {
                setSelection(by);
                if (by === 'distance' && each_distance) {
                    setDistanceSelection(each_distance.toString());
                }
                if (by === 'time' && each_time) {
                    setTimeSelection(each_time.toString());
                }
            }
        } else {
            setIsEnabled(false);
        }

        if (!onLoad) {
            await storageSetVoiceNotificationSettings(settings);
            showPopup(true, "Settings updated successfully.");
        }
    };

    const getSettings = async () => {
        const settings = await storageGetVoiceNotificationSettings();
        if (settings) {
            await handleChange(settings, true);
        }
    };

    useEffect(() => {
        getSettings();
    }, []);

    return (
        <PaperProvider>
            <Text style={styles.vi_settings_title}>
                Voice Notification Settings
            </Text>
            <View style={styles.vi_settings_container}>
                <View style={styles.vi_settings_enable_disable}>
                    <Text style={styles.vi_settings_label}>On/Off:</Text>
                    <RadioButton.Group onValueChange={() => handleChange({enabled: !isEnabled}, false)}
                                       value={isEnabled ? 'enabled' : 'disabled'}>
                        <RadioButton.Item label="Enabled" value="enabled" />
                        <RadioButton.Item label="Disabled" value="disabled" />
                    </RadioButton.Group>
                </View>

                <View style={styles.vi_settings_separator_line}></View>

                <View style={styles.vi_settings_by}>
                    <Text style={styles.vi_settings_label}>By:</Text>
                    <RadioButton.Group onValueChange={(value) => handleChange({enabled: true, by: value}, false)}
                                       value={selection}>
                        <RadioButton.Item label="Distance" value="distance" disabled={!isEnabled} />
                        <RadioButton.Item label="Time" value="time" disabled={!isEnabled} />
                    </RadioButton.Group>
                </View>

                <View style={styles.vi_settings_separator_line}></View>

                {selection === 'distance' && (
                    <View style={styles.vi_settings_by_distance}>
                        <Text style={styles.vi_settings_label}>Distance:</Text>
                        <RadioButton.Group onValueChange={(value) => handleChange({enabled: true, by: 'distance', each_distance: value}, false)}
                                           value={distanceSelection}>
                            {voiceNotification.distance_options.map((option, index) => (
                                <RadioButton.Item key={index}
                                                  label={option.label}
                                                  value={option.value.toString()}
                                                  disabled={!isEnabled} />
                            ))}
                        </RadioButton.Group>
                    </View>
                )}

                {selection === 'time' && (
                    <View style={styles.vi_settings_by_time}>
                        <Text style={styles.vi_settings_label}>Time:</Text>
                        <RadioButton.Group onValueChange={(value) => handleChange({enabled: true, by: 'time', each_time: value}, false)}
                                           value={timeSelection}>
                            {voiceNotification.time_options.map((option, index) => (
                                <RadioButton.Item key={index}
                                                  label={option.label}
                                                  value={option.value.toString()}
                                                  disabled={!isEnabled} />
                            ))}
                        </RadioButton.Group>
                    </View>
                )}

                <View style={styles.vi_settings_separator_line}></View>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    vi_settings_title: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 40,
    },
    vi_settings_container: {
        marginVertical: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    vi_settings_enable_disable: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    vi_settings_by: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    vi_settings_separator_line: {
        width: '100%',
        height: 1,
        backgroundColor: '#ccc',
        marginBottom: 10,
    },
    vi_settings_by_distance: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    vi_settings_by_time: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    vi_settings_label: {
        fontWeight: 'bold',
    },
});
