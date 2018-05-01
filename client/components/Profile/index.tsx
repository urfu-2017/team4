import { observer } from 'mobx-react';
import React from 'react';
import b_ from 'b_';
import { observable, runInAction, action } from 'mobx';

import Input from '../Input';
import Button from '../Button';
import Popup from '../Popup';
import Head from './Head';

import uiStore from '../../domain/ui-store';
import UsersStore from '../../domain/users-store';

import './Profile.css';
import Dropzone from 'react-dropzone';

const b = b_.with('profile');

interface State {
    avatar: string;
    firstName: string;
    lastName: string;
    username: string;
}

@observer
class Profile extends React.Component<{}, State> {
    @observable private isDragOnWindow: boolean = false;
    @observable private isDragOnZone: boolean = false;

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

    @action public onDragEnter = () => {
        this.isDragOnZone = true;
    };

    @action public onDragLeave = () => {
        this.isDragOnZone = false;
    };

    public componentDidMount() {
        let childrenDepth: number = 0;

        window.addEventListener('dragenter',(event) => {
            event.preventDefault();
            childrenDepth++;
            runInAction(() => {
                this.isDragOnWindow = true;
            })
        });
        window.addEventListener('dragleave', (event) => {
            event.preventDefault();
            childrenDepth--;

            if (childrenDepth === 0) {
                runInAction(() => {
                    this.isDragOnWindow = false;
                })
            }
        });
        window.addEventListener('drop', (event) => {
            event.preventDefault();
            this.isDragOnWindow = false;
            childrenDepth = 0;
        })
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
                {/* TODO запилить обработчики на перехват файлов */}
                <Dropzone
                    className={b('dropzone', { active: this.isDragOnWindow, over: this.isDragOnZone })}
                    onDragEnter={this.onDragEnter}
                    onDragLeave={this.onDragLeave}
                >
                    <img
                        className={b('avatar')}
                        src={this.state.avatar}
                        alt="Аватар"
                    />
                    <div className={b('hover-indicator')}/>
                </Dropzone>
                <div className={b('username')}>{`@${this.state.username}`}</div>
                <div className={b('fields')}>
                    <Input
                        className={b('input')}
                        onChange={this.onChangeFirstName}
                        type="text"
                        value={this.state.firstName}
                        placeholder="Имя"
                    />
                    <Input
                        onChange={this.onChangeSecondName}
                        type="text"
                        value={this.state.lastName}
                        placeholder="Фамилия"
                    />
                </div>
                <Button className={b('save')} onClick={this.saveUser}>
                    Сохранить
                </Button>
            </Popup>
        );
    }
}

export default Profile;
