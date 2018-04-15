import { observer } from 'mobx-react';
import React from 'react';

import uiStore from '../../domain/ui-store';
import UsersStore from '../../domain/users-store';
import Button from '../Button';
import Popup from '../Popup';
import Head from './Head';
import './Profile.css';

interface State {
    avatar: string;
    firstName: string;
    lastName: string;
    username: string;
}

@observer
class Profile extends React.Component<{}, State> {
    constructor(props) {
        super(props);

        this.state = { ...UsersStore.currentUser };
        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeSecondName = this.onChangeSecondName.bind(this);
        this.saveUser = this.saveUser.bind(this);
    }

    public onChangeFirstName(event) {
        this.setState({
            firstName: event.target.value
        });
    }

    public onChangeSecondName(event) {
        this.setState({
            lastName: event.target.value
        });
    }

    public async saveUser() {
        await UsersStore.saveCurrentUser(this.state);
    }

    public render() {
        const closeHandler = uiStore.togglePopup('profile');

        return (
            <Popup
                zIndex={400}
                className="profile"
                closeHandler={closeHandler}
                headContent={<Head closeHandler={closeHandler} />}
            >
                <img
                    className="profile__avatar"
                    src={`data:image/png;base64,${this.state.avatar}`}
                    alt="Аватар"
                />
                <div className="profile__username">{`@${this.state.username}`}</div>
                <input
                    className="profile__input"
                    onChange={this.onChangeFirstName}
                    type="text"
                    value={this.state.firstName}
                    placeholder="Имя"
                />
                <input
                    className="profile__input"
                    onChange={this.onChangeSecondName}
                    type="text"
                    value={this.state.lastName}
                    placeholder="Фамилия"
                />
                <Button className="profile__save" onClick={this.saveUser}>
                    Сохранить
                </Button>
            </Popup>
        );
    }
}

export default Profile;
