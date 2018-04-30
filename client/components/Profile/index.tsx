import { observer } from 'mobx-react';
import React from 'react';
import b_ from 'b_';

import uiStore from '../../domain/ui-store';
import UsersStore from '../../domain/users-store';
import Button from '../Button';
import Popup from '../Popup';
import Head from './Head';

import './Profile.css';

const b = b_.with('profile');

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
        await UsersStore.updateCurrentUser(this.state);
    }

    public render() {
        const closeHandler = uiStore.togglePopup('profile');

        return (
            <Popup
                zIndex={400}
                className={b()}
                closeHandler={closeHandler}
                headContent={<Head closeHandler={closeHandler} />}
            >
                <img
                    className={b('avatar')}
                    src={this.state.avatar}
                    alt="Аватар"
                />
                <div className={b('username')}>{`@${this.state.username}`}</div>
                <input
                    className={b('input')}
                    onChange={this.onChangeFirstName}
                    type="text"
                    value={this.state.firstName}
                    placeholder="Имя"
                />
                <input
                    className={b('input')}
                    onChange={this.onChangeSecondName}
                    type="text"
                    value={this.state.lastName}
                    placeholder="Фамилия"
                />
                <Button className={b('save')} onClick={this.saveUser}>
                    Сохранить
                </Button>
            </Popup>
        );
    }
}

export default Profile;
