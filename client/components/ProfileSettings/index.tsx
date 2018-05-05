import { observer } from 'mobx-react';
import React from 'react';
import b_ from 'b_';

import Input from '../Input';
import Button from '../Button';
import Popup from '../Popup';
import Head from './Head';
import Dropzone from '../Dropzone';
import Preloader from '../Preloader';

import uiStore from '../../domain/ui-store';
import UsersStore from '../../domain/users-store';
import { getImageSize, resizeImage } from '../../utils/image-utils';
import { BASE_URL } from '../../config';
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
                    overClassName={b('dropzone', { over: true })}
                    onWindowClassName={b('dropzone', { active: true })}
                    onDrop={this.onDrop}
                    accept="image/png"
                    disabled={isFetching}
                >
                    <img className={b('avatar')} src={avatar} alt="Аватар" />
                    <div className={b('hover-indicator')} />
                    {isFetching && (
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

    private onDrop = async (accepted: File[]) => {
        let image: File = accepted[0];

        const { width, height } = await getImageSize(image);

        // Аватар должен быть квадратным
        if (width !== height) {
            return;
        }

        if (width > 256) {
            image = await resizeImage(image, 256);
        }

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
