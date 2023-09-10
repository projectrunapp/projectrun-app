
import {Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {splashLogoUrl} from "../utils/app-constants";
import React, {useEffect, useState} from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useAuth} from "../context/AuthContext";
import axios from "axios";

export default function ProfileImage({avatar, setAvatar, showPopup}) {
    const { authState, setStorageUser } = useAuth();
    const imageDir = `${FileSystem.documentDirectory}images/`;
    const ensureDireExists = async () => {
        const dirInfo = await FileSystem.getInfoAsync(imageDir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(imageDir, {intermediates: true});
        }
    };

    const [isChangeImagePopupVisible, setIsChangeImagePopupVisible] = useState<boolean>(false);
    const [selectedImagePath, setSelectedImagePath] = useState<string | null>(null);
    const [loadingImage, setLoadingImage] = useState<boolean>(false);
    const selectImage = async (useLibrary: boolean = true) => {
        let result: ImagePicker.ImagePickerResult;
        const options: ImagePicker.ImagePickerOptions = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [1,1],
            allowsEditing: true,
            quality: 0.75,
            // base64: true,
            // exif: false,
        };

        if (useLibrary) {
            const libraryPermissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (libraryPermissions.granted) {
                result = await ImagePicker.launchImageLibraryAsync(options);
            } else {
                showPopup(false, "No access to media library!");
            }
        } else {
            const cameraPermissions = await ImagePicker.requestCameraPermissionsAsync();
            if (cameraPermissions.granted) {
                result = await ImagePicker.launchCameraAsync(options);
            } else {
                showPopup(false, "No access to camera!");
            }
        }

        if (result && result.assets) {
            const savedImagePath = await saveImage(result.assets[0].uri);
            setSelectedImagePath(savedImagePath);
        } else {
            setSelectedImagePath(null);
        }
    };
    const saveImage = async (uri: string) => {
        await ensureDireExists();
        const fileName = `${new Date().getTime()}.jpg`; // uri.split('/').pop() || '';
        const newPath = `${imageDir}${fileName}`;
        await FileSystem.copyAsync({
            from: uri,
            to: newPath,
        });
        setSelectedImagePath(newPath);

        return newPath;
    };
    // const loadImage = async () => {
    //     await ensureDireExists();
    //     const files = await FileSystem.readDirectoryAsync(imageDir);
    //     if (files.length > 0) {
    //         setSelectedImagePath(`${imageDir}${files[0]}`);
    //     }
    // };
    const deleteImageAndResetSelectedImageState = async () => {
        if (selectedImagePath) {
            await FileSystem.deleteAsync(selectedImagePath);
        }
        setSelectedImagePath(null);
    };
    const uploadImage = async () => {
        setLoadingImage(true);
        try {
            const formData = new FormData();
            formData.append('avatar', {uri: selectedImagePath, name: 'avatar.jpg', type: 'image/jpeg'});

            const response = await axios.put(`${process.env.API_URL}/users/avatar`, formData, {
                headers: {
                    Authorization: `Bearer ${authState!.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                await setStorageUser!({avatar: response.data.avatar});
                setAvatar(response.data.avatar);
            }
            await closeChangeImagePopupAndClear();
            showPopup(response.data.success, response.data.message);

            setLoadingImage(false);
        } catch (err) {
            // console.error(err);
            setLoadingImage(false);
            showPopup(false, "Something went wrong!");
        }
    };
    const closeChangeImagePopupAndClear = async () => {
        setIsChangeImagePopupVisible(false);
        if (selectedImagePath) {
            await deleteImageAndResetSelectedImageState();
        }
    };

    useEffect(() => {
        // loadImage();
    }, [avatar]);

    return (
        <>
            <View style={styles.image_container}>
                <Image source={{uri: avatar ? avatar : splashLogoUrl}} style={styles.image} alt="Image"/>
                <Pressable onPress={() => setIsChangeImagePopupVisible(true)} style={styles.change_image_popup_btn}>
                    <Text>Change Image</Text>
                </Pressable>
            </View>

            <Modal visible={isChangeImagePopupVisible} animationType="slide" transparent={true}>
                <View style={styles.popup_ci}>
                    <View style={styles.popup_ci_container}>
                        {selectedImagePath ? (
                            <>
                                <Text style={styles.popup_ci_title}>Do you want to upload this image?</Text>
                                <View style={styles.popup_ci_image_container}>
                                    <Image source={{uri: selectedImagePath}} style={styles.popup_ci_image} alt="Image"/>
                                </View>
                                <View style={[styles.popup_ci_buttons_container, {
                                    display: loadingImage ? 'none' : 'flex'
                                }]}>
                                    <Pressable onPress={deleteImageAndResetSelectedImageState} style={[styles.popup_ci_btn, styles.popup_ci_btn_delete]}>
                                        <Text>Delete </Text>
                                        <MaterialCommunityIcons name="delete" size={24} color={'black'} />
                                    </Pressable>
                                    <Pressable onPress={uploadImage} style={[styles.popup_ci_btn, styles.popup_ci_btn_upload]}>
                                        <Text>Upload </Text>
                                        <MaterialCommunityIcons name="upload" size={24} color={'black'} />
                                    </Pressable>
                                </View>
                            </>
                        ) : (
                            <>
                                <Text style={styles.popup_ci_title}>Select an existing image or just take a picture.</Text>
                                <View style={[styles.popup_ci_buttons_container, {
                                    display: loadingImage ? 'none' : 'flex'
                                }]}>
                                    <Pressable onPress={() => selectImage(false)} style={[styles.popup_ci_btn, styles.popup_ci_btn_picture]}>
                                        <Text>Picture </Text>
                                        <MaterialCommunityIcons name="camera" size={24} color={'black'} />
                                    </Pressable>
                                    <Pressable onPress={() => selectImage(true)} style={[styles.popup_ci_btn, styles.popup_ci_btn_select]}>
                                        <Text>Select </Text>
                                        <MaterialCommunityIcons name="folder-image" size={24} color={'black'} />
                                    </Pressable>
                                </View>
                            </>
                        )}
                        <TouchableOpacity onPress={closeChangeImagePopupAndClear} style={styles.popup_ci_close_btn}>
                            <MaterialCommunityIcons name="close" size={24} color={'black'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    image_container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: 10,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    change_image_popup_btn: {
        margin: 10,
        padding: 5,
        borderRadius: 5,
        backgroundColor: '#ccc',
    },

    popup_ci: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,.5)',
    },
    popup_ci_container: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    popup_ci_title: {
        fontSize: 16,
        fontWeight: 'bold',
        margin: 20,
    },
    popup_ci_buttons_container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    popup_ci_close_btn: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    popup_ci_btn: {
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    popup_ci_image_container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    popup_ci_image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 20,
    },
    popup_ci_btn_select: {
        backgroundColor: '#D0D000',
    },
    popup_ci_btn_picture: {
        backgroundColor: '#00A0A0',
    },
    popup_ci_btn_upload: {
        backgroundColor: '#00D000',
    },
    popup_ci_btn_delete: {
        backgroundColor: '#D00000',
    },
});
