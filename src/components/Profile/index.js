import React from 'react';
import { observer } from 'mobx-react';

import Button from '../Button';
import UsersStore from '../../domain/users-store';
import uiStore from '../../domain/ui-store';
import Popup from '../Popup';
import Head from './Head';
import './Profile.css';

@observer
class Profile extends React.Component {
    constructor() {
        super();
        this.state = { ...UsersStore.currentUser };
        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeSecondName = this.onChangeSecondName.bind(this);
        this.onChangeBio = this.onChangeBio.bind(this);
        this.saveUser = this.saveUser.bind(this);
    }

    onChangeFirstName(event) {
        this.setState({
            firstName: event.target.value
        });
    }

    onChangeSecondName(event) {
        this.setState({
            lastName: event.target.value
        });
    }

    onChangeBio(event) {
        this.setState({
            bio: event.target.value
        });
    }

    async saveUser() {
        await UsersStore.saveCurrentUser(this.state);
    }

    render() {
        const closeHandler = uiStore.togglePopup('profile');

        return (
            <Popup zIndex={400} className="profile" closeHandler={closeHandler}>
                <Head closeHandler={closeHandler}/>
                <img className="profile__avatar" src={`data:image/png;base64,${this.state.avatar}`} alt="Аватар"/>
                <div className="profile__username">{`@${this.state.username}`}</div>
                <input className="profile__input" onChange={this.onChangeFirstName} type="text" value={this.state.firstName}/>
                <input className="profile__input" onChange={this.onChangeSecondName} type="text" value={this.state.lastName}/>
                <textarea className="profile__input" onChange={this.onChangeBio} value={this.state.bio}/>
                <Button className="profile__save" onClick={this.saveUser}>
                    Сохранить
                </Button>
            </Popup>
        );
    }
}

export default Profile;
