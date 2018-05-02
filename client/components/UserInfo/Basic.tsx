import { observer } from 'mobx-react';
import React from 'react';
import b_ from 'b_';

import UserModel from '../../domain/user-model';

import './BasicUserInfo.css';
const b = b_.with('user');

interface Props {
    user: UserModel;

    className?: string;
    selectable?: boolean;
    selected?: boolean;
    onClick?: (id: number) => void;
}

@observer
class UserItem extends React.Component<Props> {
    public render() {
        const { user, selected, selectable } = this.props;
        const { avatar, displayName, username } = user;

        return (
            <div
                className={`${b({ selected, selectable })} ${this.props.className}`}
                onClick={this.onClick}
            >
                <img src={avatar || ''} alt="Аватар" className={b('avatar')} />
                <div className={b('info')}>
                    <span className={b('name')}>{displayName}</span>
                    <span className={b('login')}>{`@${username}`}</span>
                </div>
            </div>
        );
    }

    private onClick = event => {
        event.preventDefault();

        if (this.props.onClick) {
            this.props.onClick(this.props.user.id);
        }
    };
}

export default UserItem;
