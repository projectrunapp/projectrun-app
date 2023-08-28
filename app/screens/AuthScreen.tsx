
import {Image, Platform, Pressable, StyleSheet, Text, TextInput, View, Keyboard} from "react-native";
import {Picker} from '@react-native-picker/picker';
import {useState} from "react";
import {useAuth} from "../context/AuthContext";
import { genders } from "../utils/enums";
import {appPrimaryColor, appSecondaryColor, splashLogoUrl} from "../utils/app-constants";
import Constants from 'expo-constants';
import RNDateTimePicker from "@react-native-community/datetimepicker"; // DateTimePicker

const AuthScreen = () => {

    const [loginEmail, setLoginEmail] = useState<string>(process.env.DEV_USER_EMAIL || '');
    const [loginPassword, setLoginPassword] = useState<string>(process.env.DEV_USER_PASSWORD || '');
    const [registerEmail, setRegisterEmail] = useState<string>('');
    const [registerPassword, setRegisterPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [selectedGender, setSelectedGender] = useState<string>(genders[0].value);

    const dateFormat = (date: Date): string => {
        return `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`;
    }
    const [birthDate, setBirthDate] = useState<string>('');
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [date, setDate] = useState(new Date(Date.now()));
    const changeDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
        setBirthDate(dateFormat(currentDate));
        Keyboard.dismiss();
    }

    const [showLogin, setShowLogin] = useState<boolean>(true);

    const {onLogin, onRegister} = useAuth();

    const pressLogin = async () => {
        const result = await onLogin!(loginEmail, loginPassword);
        if (result && result.error) {
            alert(result.message);
        }
    }

    const pressRegister = async () => {
        const result = await onRegister!(registerEmail, registerPassword , username, name, birthDate, selectedGender);
        if (result && result.error) {
            alert(result.message);
        }
    }

    return (
        <View style={styles.container}>
            <Image source={{uri: splashLogoUrl}} style={styles.image} alt="Logo"/>
            {showLogin ? (
                <View style={styles.form}>
                    <TextInput style={styles.input} placeholder="Email"
                               onChangeText={(currentText: string) => setLoginEmail(currentText)}
                               value={loginEmail}/>
                    <TextInput style={styles.input} placeholder="Password" secureTextEntry={true}
                               onChangeText={(currentText: string) => setLoginPassword(currentText)}
                               value={loginPassword}/>

                    <Pressable style={styles.submit_btn} onPress={pressLogin}>
                        <Text style={styles.submit_btn_text}>Login</Text>
                    </Pressable>

                    <Text style={styles.navigate_text}>
                        Don't have an account? <Text style={styles.navigate_link} onPress={(e) => setShowLogin(false)}>Register</Text>
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
                    <TextInput style={styles.input} placeholder="Birth Date"
                               onFocus={() => setShowDatePicker(true)}
                               value={birthDate}/>
                    {showDatePicker && (
                        <RNDateTimePicker value={date} onChange={changeDate}/>
                    )}
                    <View style={styles.picker_container}>
                        <Picker onValueChange={(itemValue, itemIndex) => setSelectedGender(itemValue)}
                                selectedValue={selectedGender}>
                            {genders.map((option, index) => (
                                <Picker.Item style={index === 0 ? {
                                    color: '#9e9e9e',
                                    fontSize: 14,
                                } : {}} key={index} label={option.label} value={option.value}/>
                            ))}
                        </Picker>
                    </View>

                    <Pressable style={styles.submit_btn} onPress={pressRegister}>
                        <Text style={styles.submit_btn_text}>Register</Text>
                    </Pressable>

                    <Text style={styles.navigate_text}>
                        Already have an account? <Text style={styles.navigate_link} onPress={(e) => setShowLogin(true)}>Login</Text>
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 100,
        margin: 10,
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
        backgroundColor: appPrimaryColor,
    },
    submit_btn_text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: '#fff',
    },
    date_picker: {
        width: 320,
        height: 260,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
});

export default AuthScreen;
