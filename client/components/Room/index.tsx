import React from 'react';
import { observer } from 'mobx-react';
import { action, computed, observable } from 'mobx';
import { RouteComponentProps, withRouter } from 'react-router';
import b_ from 'b_';

import Input from '../Input/index';
import Button from '../Button';
import UsersList from '../UsersList';
import Popup from '../Popup';

import UiStore from '../../domain/ui-store';
import contactsStore from '../../domain/contacts-store';
import chatsStore from '../../domain/chats-store';
import usersStore from '../../domain/users-store';

import './CreateRoom.css';

const b = b_.with('createRoom');

@observer
class CreateRoom extends React.Component<RouteComponentProps<{}>> {
    private static closePopup() {
        UiStore.togglePopup('createRoom')();
    }

    @observable private name: string = '';

    @observable private members: number[] = [];

    @computed
    private get disabled(): boolean {
        return this.name.trim().length === 0 || this.members.length === 0;
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <Popup className={b()} zIndex={100} closeHandler={CreateRoom.closePopup}>
                    <h1 className={b('title') + ' header3'}>Создание группы</h1>
                    {this.renderStepOne()}
                    {this.renderStepTwo()}
                    <div className={b('actions')}>
                        <Button disabled={this.disabled} onClick={this.createGroup}>
                            Создать группу
                        </Button>
                    </div>
                </Popup>
            </React.Fragment>
        );
    }

    private renderStepOne() {
        return (
            <label className={b('field')}>
                <span className={b('field-label')}>Название группы:</span>
                <Input
                    onChange={this.changeName}
                    type={'text'}
                    placeholder={'Введите тему группы'}
                />
            </label>
        );
    }

    private renderStepTwo() {
        const availableMembers = contactsStore.list.filter(
            contact => contact.id !== usersStore.currentUser.id
        );

        return (
            <React.Fragment>
                <span className={b('field-label')}>Участники:</span>
                <UsersList
                    searchType={'plain'}
                    users={availableMembers}
                    onClick={this.toggleMember}
                    selected={this.members}
                    emptyMessage="Похоже, ваш список контактов пуст"
                />
            </React.Fragment>
        );
    }

    @action
    private changeName = event => {
        event.preventDefault();
        this.name = event.currentTarget.value;
    };

    @action
    private toggleMember = (id: number) => {
        if (this.members.includes(id)) {
            this.members = this.members.filter(idx => idx !== id);
            return;
        }

        this.members.push(id);
    };

    private createGroup = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (this.disabled) {
            return;
        }

        const chat = await chatsStore.createChat('room', this.members, this.name.trim());

        this.props.history.push(`/chats/${chat.id}`);
        CreateRoom.closePopup();
    };
}

export default withRouter(CreateRoom);
