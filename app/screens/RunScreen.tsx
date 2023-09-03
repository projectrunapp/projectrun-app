
import {SafeAreaView} from 'react-native';
import {useState} from "react";
import PopupMessage from "../components/PopupMessage";
import RunControls from "../components/RunControls";
import RunStartingLocation from "../components/RunStartingLocation";

export default function RunScreen() {
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

    const [permissionAllowed, setPermissionAllowed] = useState<boolean>(false);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <PopupMessage isVisible={isPopupVisible}
                          message={popupMessage}
                          success={popupSuccess}
                          onClose={closePopup}
            />
            <RunStartingLocation showPopup={showPopup}
                                 permissionAllowed={permissionAllowed}
                                 setPermissionAllowed={setPermissionAllowed}
            />
            <RunControls showPopup={showPopup} permissionAllowed={permissionAllowed}/>
        </SafeAreaView>
    );
};
