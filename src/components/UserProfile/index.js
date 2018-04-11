import React from 'react';

import { withRouter } from 'react-router-dom';
import UIStore from '../../domain/ui-store';

import Popup from '../Popup';
import Head from './Head';
import './UserProfile.css';


@withRouter
class Profile extends React.Component {
    static closePopup() {
        UIStore.toggleUserProfilePopup(null);
    }

    render() {
        const { displayName, avatar, username } = UIStore.showProfile;
        const photo = avatar ? `data:image/png;base64,${avatar}` :
            'https://api.adorable.io/avatars/128/abott@adorable.png';

        return (
            <Popup
                zIndex={300}
                closeHandler={Profile.closePopup}
                className="user-profile"
                headContent={<Head closeHandler={Profile.closePopup}/>}
            >
                <section className="user-profile__data">
                    <img src={photo} alt="Аватар" className="user-profile__avatar"/>
                    <div className="user-profile__info">
                        <span className="user-profile__name">{displayName}</span>
                        <span className="user-profile__username">{`@${username}`}</span>
                    </div>
                </section>
            </Popup>
        );
    }
}

export default Profile;
