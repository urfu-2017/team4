import React from 'react';
import b_ from 'b_';

import UserModel from '../../domain/user-model';

import './FullUserInfo.css';
const b = b_.with('user-full');

interface Props {
    user: UserModel;
}

class FullUserInfo extends React.Component<Props> {
    public render(): React.ReactNode {
        const { avatar, displayName, username } = this.props.user;

        return (
            <section className={b('data')}>
                <img src={avatar} alt="Аватар" className={b('avatar')} />
                <div className={b('info')}>
                    <span className={b('name')}>{displayName}</span>
                    <span className={b('username')}>{`@${username}`}</span>
                </div>
            </section>
        );
    }
}

export default FullUserInfo;
