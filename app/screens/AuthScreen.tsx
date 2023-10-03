
import {
    Image, ActivityIndicator, Platform, StyleSheet, View,
    Text, TextInput, TouchableOpacity, Pressable
} from "react-native";
import {Picker} from '@react-native-picker/picker';
import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext";
import {
    activeBtnTextColor, appPrimaryColor, appSecondaryColor,
    genderDefault, genders, inactiveBtnTextColor, splashLogoUrl
} from "../utils/app-constants";
import Constants from 'expo-constants';
import RNDateTimePicker from "@react-native-community/datetimepicker"; // DateTimePicker
import PopupMessage from "../components/PopupMessage";
import {dateFormat} from "../utils/helper";
import {GoogleSigninButton} from "@react-native-google-signin/google-signin";

export default function AuthScreen() {
    const [loading, setLoading] = useState<boolean>(false);
    const [isLoginBtnActive, setIsLoginBtnActive] = useState<boolean>(false);
    const [isRegisterBtnActive, setIsRegisterBtnActive] = useState<boolean>(false);

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

    const [loginEmail, setLoginEmail] = useState<string>(process.env.DEV_USER_EMAIL || '');
    const [loginPassword, setLoginPassword] = useState<string>(process.env.DEV_USER_PASSWORD || '');
    const [registerEmail, setRegisterEmail] = useState<string>('');
    const [registerPassword, setRegisterPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [selectedGender, setSelectedGender] = useState<string>(genderDefault);

    const [birthDate, setBirthDate] = useState<string>('');
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [date, setDate] = useState(new Date(Date.now()));
    const changeDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
        setBirthDate(dateFormat(currentDate));
    }

    const [showLogin, setShowLogin] = useState<boolean>(true);

    const {onLogin, onRegister, googleSignIn} = useAuth();

    const pressLogin = async () => {
        if (!isLoginBtnActive) {
            return;
        }
        setLoading(true);
        const result = await onLogin!(loginEmail, loginPassword);
        setLoading(false);
        if (!result.success) {
            alert(result.message);
        }
    }

    const pressRegister = async () => {
        if (!isRegisterBtnActive) {
            return;
        }
        setLoading(true);
        const result = await onRegister!(registerEmail, registerPassword , username, name, birthDate, selectedGender);
        setLoading(false);
        if (result.success) {
            setShowLogin(true);
            setRegisterEmail('');
            setRegisterPassword('');
            setUsername('');
            setName('');
            setBirthDate('');
            setSelectedGender(genderDefault);
        }
        showPopup(result.success, result.message);
    }

    const pressGoogleSignIn = async () => {
        setLoading(true);
        const result = await googleSignIn!();
        setLoading(false);
        if (!result.success) {
            alert(result.message);
        }
    }

    useEffect(() => {
        setIsLoginBtnActive(!!(loginEmail && loginPassword));
    }, [loginEmail, loginPassword]);

    useEffect(() => {
        setIsRegisterBtnActive(!!(registerEmail && registerPassword && username && name && birthDate));
    }, [registerEmail, registerPassword, username, name, birthDate]);

    if (loading) {
        return (
            <View style={[styles.loading_container, styles.loading_horizontal]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <PopupMessage isVisible={isPopupVisible}
                          message={popupMessage}
                          success={popupSuccess}
                          onClose={closePopup}
            />
            <Image source={{uri: splashLogoUrl}} style={styles.image} alt="Logo"/>
            {showLogin ? (
                <View style={styles.form}>
                    <TextInput style={styles.input} placeholder="Email"
                               onChangeText={(currentText: string) => setLoginEmail(currentText)}
                               value={loginEmail}/>
                    <TextInput style={styles.input} placeholder="Password" secureTextEntry={true}
                               onChangeText={(currentText: string) => setLoginPassword(currentText)}
                               value={loginPassword}/>

                    <Pressable style={[styles.submit_btn, {
                        backgroundColor: isLoginBtnActive ? appPrimaryColor : '#ccc',
                    }]} onPress={pressLogin}>
                        <Text style={[styles.submit_btn_text, {
                            color: isLoginBtnActive ? activeBtnTextColor : inactiveBtnTextColor,
                        }]}>Login</Text>
                    </Pressable>

                    <Text style={styles.navigate_text}>
                        Don't have an account? <Text style={styles.navigate_link} onPress={() => setShowLogin(false)}>Register</Text>
                    </Text>
                </View>
            ) : (
                <View style={styles.form}>
                    <TextInput style={styles.input} placeholder="Email"
                               onChangeText={(currentText: string) => setRegisterEmail(currentText)}
                               value={registerEmail}/>
                    <TextInput style={styles.input} placeholder="Password" secureTextEntry={true}
                               onChangeText={(currentText: string) => setRegisterPassword(currentText)}
                               value={registerPassword}/>
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

                    <Pressable style={[styles.submit_btn, {
                        backgroundColor: isRegisterBtnActive ? appPrimaryColor : '#ccc',
                    }]} onPress={pressRegister}>
                        <Text style={[styles.submit_btn_text, {
                            color: isRegisterBtnActive ? activeBtnTextColor : inactiveBtnTextColor,
                        }]}>Register</Text>
                    </Pressable>

                    <Text style={styles.navigate_text}>
                        Already have an account? <Text style={styles.navigate_link} onPress={() => setShowLogin(true)}>Login</Text>
                    </Text>
                </View>
            )}
            <GoogleSigninButton
                style={styles.google_sign_in_btn}
                size={GoogleSigninButton.Size.Standard}
                color={GoogleSigninButton.Color.Dark}
                onPress={() => pressGoogleSignIn()}
            />
        </View>
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
    image: {
        width: 100,
        height: 100,
        margin: 10,
        borderRadius: 50,
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
    picker_container: {
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 1,
        paddingVertical: 0,
    },
    container: {
        marginTop: Constants.statusBarHeight + 10,
        alignItems: 'center',
        width: '100%',
    },
    navigate_text: {
        marginTop: 20,
    },
    navigate_link: {
        color: appSecondaryColor,
    },
    submit_btn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
    },
    submit_btn_text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
    },
    google_sign_in_btn: {
        width: 192,
        height: 48,
        marginTop: 40,
    },
});
