import React from 'react';
import b_ from 'b_';

import { withRouter } from 'react-router-dom';
import UIStore from '../../domain/ui-store';

import Popup from '../Popup';
import Head from './Head';

import './UserProfile.css';

const b = b_.with('user-profile');

class Profile extends React.Component {
    public static closePopup() {
        UIStore.toggleUserProfilePopup(null);
    }

    public render() {
        const { displayName, avatar, username } = UIStore.showProfile;
        const photo = avatar
            ? `data:image/png;base64,${avatar}`
            : 'https://server.adorable.io/avatars/128/abott@adorable.png';

        return (
            <Popup
                zIndex={300}
                closeHandler={Profile.closePopup}
                className={b()}
                headContent={<Head closeHandler={Profile.closePopup} />}
            >
                <section className={b('data')}>
                    <img src={photo} alt="Аватар" className={b('avatar')} />
                    <div className={b('info')}>
                        <span className={b('name')}>{displayName}</span>
                        <span className={b('username')}>{`@${username}`}</span>
                    </div>
                </section>
            </Popup>
        );
    }
}

export default withRouter(Profile as any);
