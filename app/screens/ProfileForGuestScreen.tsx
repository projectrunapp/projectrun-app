
import React, {useEffect, useState} from 'react'
import {StyleSheet, Text, View, Image, ScrollView} from 'react-native'
import axios from "axios";
import {appSecondaryColor, genderDefault, splashLogoUrl} from "../utils/app-constants";
import {useAuth} from "../context/AuthContext";
import ActionButtonsForSearchedUser from "./Friendship/ActionButtonsForSearchedUser";
import PopupMessage from "../components/PopupMessage";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {getAgeFromBirthDate} from "../utils/helper";
import {Graphics} from "../components/Graphics";

export default function ProfileForGuestScreen({ route }: any) {
    const { userId } = route.params;
    const { authState } = useAuth();

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [friendsCount, setFriendsCount] = useState(0);

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

    const loadProfile = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.API_URL}/users/profile/${userId}`, {
                headers: {
                    Authorization: `Bearer ${authState!.token}`,
                    // "Content-Type": "application/json",
                }
            });
            if (response.data.success) {
                setFriendsCount(response.data.data.friends_count);
                setProfile(response.data.data);
            }
            setLoading(false);
        } catch (err) {
            // console.error(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    return (
        <ScrollView>
            <PopupMessage isVisible={isPopupVisible} message={popupMessage} success={popupSuccess} onClose={closePopup}/>
            <View style={styles.header}>
                <View style={styles.header_content}>
                    <Image source={{uri: loading || !profile.avatar ? splashLogoUrl : profile.avatar}} style={styles.avatar}/>
                    <Text style={styles.name}>{loading ? '...' : profile.name}</Text>
                    <Text style={styles.username}>{loading ? '' : `@${profile.username}`}</Text>
                </View>
            </View>
            {profile && (<>
                <View style={styles.profile_detail}>
                    <View style={styles.detail_content}>
                        <Text style={styles.detail_key}>Friends</Text>
                        <Text style={styles.detail_value}>{friendsCount}</Text>
                    </View>
                    <View style={styles.detail_content}>
                        <Text style={styles.detail_key}>Runs</Text>
                        <Text style={styles.detail_value}>{profile.runs_count}</Text>
                    </View>
                    <View style={styles.detail_content}>
                        <Text style={styles.detail_key}>Distance</Text>
                        <Text style={styles.detail_value}>{profile.runs_distance}</Text>
                    </View>
                </View>
                <View style={styles.action_buttons_container}>
                    <ActionButtonsForSearchedUser item={profile}
                                                  showPopup={showPopup}
                                                  titles={true}
                                                  setFriendsCount={setFriendsCount}/>
                </View>
                <View style={styles.content}>
                    <Text style={styles.content_title}>About:</Text>
                    <Text>
                        Gender: {profile.gender !== genderDefault && (<>
                            {
                                profile.gender === 'male' && (
                                    <MaterialCommunityIcons name="gender-male" size={18} style={styles.content_gender_sign}/>
                                )
                            }
                            {
                                profile.gender === 'female' && (
                                    <MaterialCommunityIcons name="gender-female" size={18} style={styles.content_gender_sign}/>
                                )
                            }
                            {
                                profile.gender === 'other' && (
                                    <MaterialCommunityIcons name="help" size={18} style={styles.content_gender_sign}/>
                                )
                            }
                        </>)}
                    </Text>
                    {styles.content_birth_date && (
                        <Text style={styles.content_birth_date}>{getAgeFromBirthDate(profile.birth_date)} y/o</Text>
                    )}
                    <Text style={styles.content_bio}>{
                        profile.bio ? profile.bio : "No bio yet :("
                    }</Text>
                </View>
                <Graphics userId={profile.id} />
            </>)}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: appSecondaryColor,
    },
    header_content: {
        padding: 30,
        alignItems: 'center',
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: 'white',
        marginBottom: 10,
    },
    name: {
        fontSize: 22,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    username: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    profile_detail: {
        alignSelf: 'center',
        marginTop: 230,
        alignItems: 'center',
        flexDirection: 'row',
        position: 'absolute',
        backgroundColor: '#ffffff',
    },
    detail_content: {
        margin: 10,
        alignItems: 'center',
    },
    detail_key: {
        fontSize: 20,
        color: '#00CED1',
    },
    detail_value: {
        fontSize: 18,
    },
    action_buttons_container: {
        marginTop: 60,
    },
    content: { // center
        marginTop: 20,
        padding: 10,
        alignItems: 'center',
    },
    content_title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content_gender_sign: {
        marginTop: 10,
    },
    content_birth_date: {
        marginTop: 10,
    },
    content_bio: {
        marginTop: 10,
    },
})
