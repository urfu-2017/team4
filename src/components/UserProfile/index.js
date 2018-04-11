import React from 'react';
import PropTypes from 'prop-types';

import Popup from '../Popup';
import Button from '../Button';
import Head from './Head';
import './UserProfile.css';

class Profile extends React.Component {
    render() {
        const { avatar, firstName, lastName, username } = this.props;
        return (
            <Popup
                zIndex={300}
                closeHandler={this.props.closeHandler}
                className="user-profile"
                headContent={<Head closeHandler={this.props.closeHandler}/>}
            >
                <section className="user-profile__data">
                    <img src={avatar} alt="Аватар" className="user-profile__avatar"/>
                    <div className="user-profile__info">
                        <span className="user-profile__name">{firstName} {lastName}</span>
                        <span className="user-profile__username">{`@${username}`}</span>
                    </div>
                </section>
                <div className="user-profile__buttons">
                    <Button className="user-profile__add-btn">Добавить</Button>
                    <a href={`/chat/${username}`} className="user-profile__chat-link">
                        Открыть диалог
                    </a>
                </div>
            </Popup>
        );
    }
}

Profile.propTypes = {
    username: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    avatar: PropTypes.string.isRequired,
    closeHandler: PropTypes.func.isRequired
};

Profile.defaultProps = {
    firstName: '',
    lastName: ''
};

export default Profile;
