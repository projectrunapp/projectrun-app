
import {Button, Image, Platform, Pressable, StyleSheet, Text, TextInput, View, Keyboard} from "react-native";
import {Picker} from '@react-native-picker/picker';
import {useState} from "react";
import {useAuth} from "../context/AuthContext";
import DateTimePicker from '@react-native-community/datetimepicker';
import { genders } from "../utils/enums";
import { splashLogoUrl } from "../utils/constants";

const AuthScreen = () => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
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
        const result = await onLogin!(email, password);
        if (result && result.error) {
            alert(result.message);
        }
    }

    const pressRegister = async () => {
        const result = await onRegister!(email, password , username, name, birthDate, selectedGender);
        if (result && result.error) {
            alert(result.message);
        }
    }

    return (
        <View style={styles.container}>
            <Image source={{uri: splashLogoUrl}}
                   style={styles.image} alt="Logo" />
            {showLogin ? (
                <View style={styles.form}>
                    <TextInput style={styles.input} placeholder="Email" onChangeText={(text: string) => setEmail(text)} value={email} />
                    <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} onChangeText={(password: string) => setPassword(password)} value={password} />

                    <Pressable style={styles.submit_btn} onPress={pressLogin}>
                        <Text style={styles.submit_btn_text}>Login</Text>
                    </Pressable>
                    <Text style={styles.btn_top_text}>Don't have an account?</Text>
                    <Button styles={styles.navigate_btn} title="Register" className="btn" onPress={(e) => setShowLogin(false)} />
                </View>
            ) : (
                <View style={styles.form}>

                    <TextInput style={styles.input}
                               placeholder="Email"
                               onChangeText={(text: string) => setEmail(text)}
                               value={email}
                    />

                    <TextInput style={styles.input}
                               placeholder="Password"
                               secureTextEntry={true}
                               onChangeText={(password: string) => setPassword(password)}
                               value={password}
                    />

                    <TextInput style={styles.input}
                               placeholder="Username"
                               onChangeText={(text: string) => setUsername(text)}
                               value={username}
                    />

                    <TextInput style={styles.input}
                               placeholder="Name"
                               onChangeText={(text: string) => setName(text)}
                               value={name}
                    />

                    <TextInput style={styles.input}
                               placeholder="Birth Date"
                               value={birthDate}
                               onFocus={() => setShowDatePicker(true)}
                    />
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            // mode={'date'}
                            // display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            // is24Hour={true}
                            onChange={changeDate}
                            style={styles.date_picker}
                        />
                    )}

                    <Picker onValueChange={(itemValue, itemIndex) => setSelectedGender(itemValue)}
                            style={styles.input}
                            selectedValue={selectedGender}>
                        {genders.map(option => (
                            <Picker.Item key={option.value} label={option.label} value={option.value} />
                        ))}
                    </Picker>

                    <Pressable style={styles.submit_btn} onPress={pressRegister}>
                        <Text style={styles.submit_btn_text}>Register</Text>
                    </Pressable>

                    <Text style={styles.btn_top_text}>Already have an account?</Text>
                    <Button styles={styles.navigate_btn}
                            title="Login"
                            className="btn"
                            onPress={(e) => setShowLogin(true)}
                    />

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
    container: {
        alignItems: 'center',
        width: '100%',
    },
    navigate_btn: {
        backgroundColor: '#098',
        color: '#fff',
    },
    submit_btn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#F5F411',
    },
    submit_btn_text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: '#fff',
    },
    btn_top_text: {
        marginTop: 10,
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
