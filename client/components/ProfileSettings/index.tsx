import { observer } from 'mobx-react';
import React from 'react';
import b_ from 'b_';
import { action, observable, runInAction } from 'mobx';

import Input from '../Input';
import Button from '../Button';
import Popup from '../Popup';
import Head from './Head';
import Dropzone from '../Dropzone';
import Preloader from '../Preloader';

import uiStore from '../../domain/ui-store';
import UsersStore from '../../domain/users-store';
import { getImageSize, resizeImage, cropToSquare } from '../../utils/image-utils';
import { BASE_URL, MAX_AVATAR_SIZE } from '../../config';
import UploadStore from '../../domain/upload-store';

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
    @observable private isProcessing: boolean = false;
    private uploadStore: UploadStore = new UploadStore();

    constructor(props) {
        super(props);

        this.state = { ...UsersStore.currentUser };
    }

    public onChangeFirstName = event => {
        this.setState({
            firstName: event.target.value
        });
    };

    public onChangeSecondName = event => {
        this.setState({
            lastName: event.target.value
        });
    };

    public saveUser = async () => {
        await UsersStore.updateCurrentUser(this.state);
        this.uploadStore.clear();
        uiStore.closeAllPopups();
    };

    public render() {
        const closeHandler = uiStore.togglePopup('profile');
        const { avatar, username, firstName, lastName } = this.state;
        const isFetching = this.uploadStore.isFetching;

        return (
            <Popup
                zIndex={400}
                className={b()}
                closeHandler={closeHandler}
                headContent={<Head closeHandler={closeHandler} />}
            >
                <Dropzone
                    className={b('dropzone', { disabled: isFetching })}
                    overClassName={b('dropzone', { disabled: true })}
                    onWindowClassName={b('dropzone', { disabled: true })}
                    onDrop={this.onDrop}
                    accept="image/png, image/jpeg"
                    disabled={isFetching || this.isProcessing}
                >
                    <img className={b('avatar')} src={avatar} alt="Аватар" />
                    <div className={b('hover-indicator')} />
                    {(isFetching || this.isProcessing) && (
                        <div className={b('loading-overlay')}>
                            <Preloader size={30} />
                        </div>
                    )}
                </Dropzone>
                <div className={b('username')}>{`@${username}`}</div>
                <div className={b('fields')}>
                    <Input
                        className={b('input')}
                        onChange={this.onChangeFirstName}
                        type="text"
                        value={firstName}
                        placeholder="Имя"
                    />
                    <Input
                        onChange={this.onChangeSecondName}
                        type="text"
                        value={lastName}
                        placeholder="Фамилия"
                    />
                </div>
                <Button className={b('save')} onClick={this.saveUser} disabled={isFetching}>
                    Сохранить
                </Button>
            </Popup>
        );
    }

    @action
    private onDrop = async (accepted: File[]) => {
        if (!accepted[0]) {
            return;
        }

        this.isProcessing = true;

        let image: File = await cropToSquare(accepted[0]);

        const { width, height } = await getImageSize(image);

        if (width > MAX_AVATAR_SIZE || height > MAX_AVATAR_SIZE) {
            image = await resizeImage(image, MAX_AVATAR_SIZE);
        }

        runInAction(() => {
            this.isProcessing = false;
        });

        const response = await this.uploadStore.upload(image);

        if(!response) {
            return;
        }

        this.setState({
            avatar: `${BASE_URL}${response.path}`
        });
    };
}

export default Profile;
