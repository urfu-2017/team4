import React from 'react';
import { observer } from 'mobx-react';
import b_ from 'b_';

import Popup from '../Popup';
import UsersList from '../UsersList';

import contactsStore from '../../domain/contacts-store';
import ChatModel from '../../domain/chat-model';

import './AddMember.css';
import Button from '../Button';

const b = b_.with('add-member');

interface Props {
    chat: ChatModel;
    closeHandler: () => void;
}

@observer
class AddMember extends React.Component<Props> {
    public render(): React.ReactNode {
        const { chat, closeHandler } = this.props;
        const available = contactsStore.list.filter(
            contact => !chat.members.find(member => member.id === contact.id)
        );

        return (
            <Popup zIndex={500} className={b()} closeHandler={closeHandler}>
                <h3 className={b('title') + ' header3'}>Добавление участника</h3>
                <UsersList
                    users={available}
                    searchType={'plain'}
                    onClick={this.addMember}
                    emptyMessage="Похоже, нет доступных для добавления в чат пользователей"
                />
                <div className={b('actions')}>
                    <Button className={b('cancel')} onClick={this.onCancel}>
                        Отмена
                    </Button>
                </div>
            </Popup>
        );
    }

    private addMember = async () => {
        this.props.closeHandler();
    };

    private onCancel = () => {
        this.props.closeHandler();
    };
}

export default AddMember;
