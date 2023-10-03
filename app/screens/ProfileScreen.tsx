
import {
    Platform, Pressable, StyleSheet, Text, TextInput,
    View, TouchableOpacity, ActivityIndicator, Alert, ScrollView
} from "react-native";
import {Picker} from '@react-native-picker/picker';
import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext";
import {
    activeBtnTextColor, appPrimaryColor, genderDefault, genders, inactiveBtnTextColor,
} from "../utils/app-constants";
import RNDateTimePicker from "@react-native-community/datetimepicker"; // DateTimePicker
import PopupMessage from "../components/PopupMessage";
import axios from "axios";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {dateFormat} from "../utils/helper";
import ProfileImage from "../components/ProfileImage";
import VoiceNotificationSettings from "../components/VoiceNotificationSettings";

export default function ProfileScreen() {
    const { authState, getStorageUser, setStorageUser } = useAuth();
    const { onLogout } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [isUpdateBtnActive, setIsUpdateBtnActive] = useState<boolean>(false);

    const [isPopupVisible, setPopupVisible] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState<string>("");
    const [popupSuccess, setPopupSuccess] = useState<boolean>(true);
    const showPopup = (success: boolean, message: string) => {
        setPopupMessage(message);
        setPopupSuccess(success);
        setPopupVisible(true);
    }
    const closePopup = () => {
        setPopupVisible(false); // setPopupMessage(""); setPopupSuccess(true);
    }

    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [selectedGender, setSelectedGender] = useState<string>(genderDefault);
    const [avatar, setAvatar] = useState<string>('');

    const [birthDate, setBirthDate] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [date, setDate] = useState(new Date(Date.now()));
    const changeDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
        setBirthDate(dateFormat(currentDate));
    }

    const getMe = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/users/me`, {
                headers: {
                    Authorization: `Bearer ${authState!.token}`,
                    // "Content-Type": "application/json",
                }
            });

            await setStorageUser!({
                id: response.data.id,
                name: response.data.name,
                email: response.data.email,
                username: response.data.username,
                birth_date: response.data.birth_date,
                bio: response.data.bio,
                gender: response.data.gender,
                avatar: response.data.avatar,
            });

            return response.data;
        } catch (err) {
            // console.error(err.message);
            return {success: false, message: "Something went wrong!"};
        }
    }
    const updateProfile = async () => {
        try {
            const response = await axios.put(`${process.env.API_URL}/users/profile`, {
                username: username,
                name: name,
                birth_date: birthDate,
                gender: selectedGender,
                bio: bio,
            }, {
                headers: {
                    Authorization: `Bearer ${authState!.token}`,
                    // "Content-Type": "application/json",
                }
            });

            await setStorageUser!({
                username: username,
                name: name,
                birth_date: birthDate,
                bio: bio,
                gender: selectedGender,
            });

            return response.data;
        } catch (err) {
            // console.error(err.message);
            return {success: false, message: "Something went wrong!"};
        }
    }
    const pressUpdate = async () => {
        if (!isUpdateBtnActive) {
            return;
        }
        setLoading(true);
        const result = await updateProfile();
        setLoading(false);
        showPopup(result.success, result.message);
    }
    const getProfile = async () => {
        // it got from storage before (commit: b2c9f6e)
        const response = await getMe(); // storageUser will be updated in getMe()
        if (!response.success) {
            return;
        }

        setEmail(response.data.email);
        setUsername(response.data.username);
        setName(response.data.name);
        setBirthDate(response.data.birth_date);
        setBio(response.data.bio);
        setSelectedGender(response.data.gender);
        setAvatar(response.data.avatar);

        setDate(new Date(response.data.birth_date || Date.now()));
    }

    useEffect(() => {
        setIsUpdateBtnActive(!!(username && name && birthDate));
    }, [username, name, birthDate]);

    useEffect(() => {
        getProfile();
    }, []);

    const logoutPrompt = () => {
        Alert.alert(
            "Log out",
            "Are you sure you want to log out?",
            [
                {
                    text: 'No',
                    onPress: () => {},
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        if (onLogout) {
                            setLoading(true);
                            await onLogout();
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    }

    if (loading) {
        return (
            <View style={[styles.loading_container, styles.loading_horizontal]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <PopupMessage isVisible={isPopupVisible}
                              message={popupMessage}
                              success={popupSuccess}
                              onClose={closePopup}
                />

                <ProfileImage avatar={avatar} setAvatar={setAvatar} showPopup={showPopup} />

                <View style={styles.form}>
                    <TextInput style={[styles.input, styles.input_disabled]} placeholder="Email"
                               editable={false}
                               value={email}/>
                    <TextInput style={styles.input} placeholder="Username"
                               onChangeText={(text: string) => setUsername(text)}
                               value={username}/>
                    <TextInput style={styles.input} placeholder="Name"
                               onChangeText={(text: string) => setName(text)}
                               value={name}/>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <TextInput style={styles.input} placeholder="Birth Date" editable={false} value={birthDate}/>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <RNDateTimePicker value={date}
                                          maximumDate={new Date(Date.now())}
                                          onChange={changeDate}/>
                    )}
                    <View style={styles.picker_container}>
                        <Picker onValueChange={(itemValue, itemIndex) => setSelectedGender(itemValue)}
                                style={styles.input_picker}
                                selectedValue={selectedGender}>{
                            Object.keys(genders).map((key, index) => {
                                return (
                                    <Picker.Item key={index}
                                                 style={key === genderDefault ? {color: '#9e9e9e', fontSize: 14} : {}}
                                                 label={genders[key]} value={key}
                                    />
                                )
                            })
                        }</Picker>
                    </View>
                    <TextInput style={styles.text_input}
                               placeholder="Bio"
                               multiline={true}
                               onChangeText={(text: string) => setBio(text)}
                               value={bio}/>

                    <Pressable style={[styles.submit_btn, {
                        backgroundColor: isUpdateBtnActive ? appPrimaryColor : '#ccc',
                    }]} onPress={pressUpdate}>
                        <Text style={[styles.submit_btn_text, {
                            color: isUpdateBtnActive ? activeBtnTextColor : inactiveBtnTextColor,
                        }]}>Update</Text>
                    </Pressable>

                </View>

                <VoiceNotificationSettings showPopup={showPopup} />

                <View style={styles.logout_btn_container}>
                    <Pressable onPress={logoutPrompt} style={styles.logout_btn}>
                        <Text style={styles.logout_btn_text}>Log out</Text>
                        <MaterialCommunityIcons name="logout" size={24} color="#fff" />
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    loading_container: {
        flex: 1,
        justifyContent: 'center',
    },
    loading_horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    form: {
        gap: 10,
        width: '60%',
    },
    input: {
        height: 44,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        color: '#000',
        backgroundColor: '#fff'
    },
    input_disabled: {
        backgroundColor: '#ccc',
    },
    picker_container: {
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 1,
        paddingVertical: 0,
    },
    input_picker: {
        height: 44,
    },
    text_input: {
        height: 100,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        color: '#000',
        backgroundColor: '#fff',
        textAlignVertical: 'top',
        flexWrap: 'wrap',
    },
    container: {
        marginTop: 10,
        alignItems: 'center',
        width: '100%',
    },
    submit_btn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        marginTop: 10,
    },
    submit_btn_text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
    },
    logout_btn_container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        margin: 20,
    },
    logout_btn: {
        backgroundColor: '#c10',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: 100,
        flexDirection: 'row',
        justifyContent: 'space-around',
        elevation: 3,
    },
    logout_btn_text: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
