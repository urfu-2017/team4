import React from 'react';
import b_ from 'b_';

import Popup from '../Popup';
import FullUserInfo from '../UserInfo/Full';

import uiStore from '../../domain/ui-store';

import './UserProfile.css';
const b = b_.with('user-profile');

class Profile extends React.Component {
    public static closePopup() {
        uiStore.toggleUserInfoPopup(null);
    }

    public render() {
        return (
            <Popup
                zIndex={300}
                closeHandler={Profile.closePopup}
                className={b()}
            >
                <h3 className={b('title') + ' header3'}>Информация о пользователе</h3>
                <FullUserInfo user={uiStore.userInfo}/>
            </Popup>
        );
    }
}

export default Profile;
