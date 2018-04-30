import { observer } from 'mobx-react';
import React from 'react';
import b_ from 'b_';

import Preloader from '../../Preloader';

import './Contact.css';
const b = b_.with('contact');

interface Props {
    id: string;
    username: string;
    avatar?: string;
    firstName?: string;
    lastName?: string;
    className?: string;

    selectable?: boolean;
    selected?: boolean;
    isFetching?: boolean;
    onClick?: (id: string) => void;
}

@observer
class Contact extends React.Component<Props> {
    public render() {
        const { avatar, firstName, lastName, username, isFetching, selected, selectable } = this.props;

        return (
            <div
                className={`${b({ selected, selectable })} ${this.props.className}`}
                onClick={this.onClick}
            >
                <img
                    src={avatar || ''}
                    alt="Аватар"
                    className={b('avatar')}
                />
                <div className={b('info')}>
                    <span className={b('name')}>{firstName} {lastName}</span>
                    <span className={b('login')}>{`@${username}`}</span>
                </div>
                {isFetching && <Preloader size={24} className={b('preloader')}/>}
            </div>
        );
    }

    private onClick = (event) => {
        event.preventDefault();

        if (this.props.onClick) {
            this.props.onClick(this.props.id);
        }
    }
}

export default Contact;
