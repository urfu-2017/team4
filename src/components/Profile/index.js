import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import Button from '../Button';
import UsersStore from '../../domain/users-store';
import uiStore from '../../domain/ui-store';
import Overlay from '../Overlay';
import './Profile.css';

const Head = ({ closeHandler }) => (
    <header className="profile__head">
        <h2 className="profile__heading header3">Настройки</h2>
        <div className="profile__header-buttons">
            <Button className="profile__close" onClick={closeHandler} type="heading">
                Закрыть
            </Button>
        </div>
    </header>
);

Head.propTypes = {
    closeHandler: PropTypes.func.isRequired
};

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
        return (
            <React.Fragment>
                <section className="profile">
                    <Head closeHandler={uiStore.toggleProfile}/>
                    <img className="profile__avatar" src={`data:image/png;base64,${this.state.avatar}`} alt="Аватар"/>
                    <div className="profile__username">{`@${this.state.username}`}</div>
                    <input className="profile__input" onChange={this.onChangeFirstName} type="text" value={this.state.firstName}/>
                    <input className="profile__input" onChange={this.onChangeSecondName} type="text" value={this.state.lastName}/>
                    <textarea className="profile__input" onChange={this.onChangeBio} value={this.state.bio}/>
                    <Button className="profile__save" onClick={this.saveUser}>
                        Сохранить
                    </Button>
                </section>
                <Overlay
                    closeHandler={this.props.closeProfile}
                    className="profile__overlay"
                />
            </React.Fragment>
        );
    }
}

Profile.propTypes = {
    closeProfile: PropTypes.func.isRequired
};

export default Profile;
