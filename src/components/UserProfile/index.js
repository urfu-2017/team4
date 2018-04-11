import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import { withRouter } from 'react-router-dom';
import UIStore from '../../domain/ui-store';

import Preloader from '../Preloader';
import Popup from '../Popup';
import Button from '../Button';
import Head from './Head';
import './UserProfile.css';

import ChatsStore from '../../domain/chats-store';

@withRouter
@observer
class Profile extends React.Component {
    static closePopup() {
        UIStore.toggleUserProfilePopup(null);
    }

    goToChat = async (event) => {
        event.preventDefault();

        const { username } = UIStore.showProfile;
        let chat = ChatsStore.findDialog(username);

        if (!chat) {
            this.isCreating = true;
            chat = await ChatsStore.createChat('dialog', [username]);
            this.isCreating = false;
        }

        // eslint-disable-next-line react/prop-types
        this.props.history.push(`/chats/${chat.id}`);
        Profile.closePopup();
    }

    @observable isCreating = false;

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
                <div className="user-profile__buttons">
                    {this.isCreating && <Preloader className="user-profile__preloader" size={26}/>}
                    <Button disabled={this.isCreating} onClick={this.goToChat} className="user-profile__chat-link">
                        {this.isCreating ? 'Устанавливаем канал связи' : 'Открыть диалог'}
                    </Button>
                </div>
            </Popup>
        );
    }
}

export default Profile;
