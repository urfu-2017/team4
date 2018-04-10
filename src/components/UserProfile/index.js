import React from 'react';
import PropTypes from 'prop-types';

import Popup from '../Popup';
import PopupHead from '../PopupHead';
import PopupBody from '../PopupBody';
import Button from '../Button';
import './UserProfile.css';

import uiStore from '../../domain/ui-store';

class Profile extends React.Component {
    render() {
        const { avatar, firstName, lastName, username } = this.props;
        return (
            <Popup
                zIndex={300}
                closeHandler={uiStore.togglePopup('profile')}
                className="profile"
            >
                <PopupHead className="profile__head">
                    <h2 className="profile__heading header3">
                        Профиль
                    </h2>
                    <Button type="heading" onClick={uiStore.togglePopup('profile')}>
                        Закрыть
                    </Button>
                </PopupHead>
                <PopupBody className="profile__main">
                    <section className="profile__data">
                        <img src={avatar} alt="Аватар" className="profile__avatar"/>
                        <div className="profile__info">
                            <span className="profile__name">{firstName} {lastName}</span>
                            <span className="profile__username">{`@${username}`}</span>
                        </div>
                    </section>
                    <div className="profile__buttons">
                        <Button className="profile__add-btn">Добавить</Button>
                        <a href={`/chat/${username}`} className="profile__chat-link">
                            Открыть диалог
                        </a>
                    </div>
                </PopupBody>
            </Popup>
        );
    }
}

Profile.propTypes = {
    username: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    avatar: PropTypes.string.isRequired
};

Profile.defaultProps = {
    firstName: '',
    lastName: ''
};

export default Profile;
