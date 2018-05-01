import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import b_ from 'b_';

import Contact from '../Contacts/Contact';
import Popup from '../Popup';
import Head from './Head';

import './CreateRoom.css';
const b = b_.with('createRoom');

import UiStore from '../../domain/ui-store';
import ContactsStore from '../../domain/contacts-store';
import Button from '../Button';
import ContactsList from '../Contacts/List';

@observer
class CreateRoom extends React.Component {

    private static closePopup() {
        UiStore.togglePopup('createRoom')();
    }

    @observable
    private step: number = 1;

    @observable
    private name: string = '';

    @observable
    private members: string[] = [];

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <Popup
                    className={b()}
                    zIndex={100}
                    headContent={<Head closeHandler={CreateRoom.closePopup}/>}
                    closeHandler={CreateRoom.closePopup}
                >
                    <div className={b('inner')}>
                        {this.step === 1 && this.renderStepOne()}
                        {this.step === 2 && this.renderStepTwo()}
                    </div>
                </Popup>
            </React.Fragment>
        );
    }

    private renderStepOne() {
        return (
            <React.Fragment>
                <label className={b('field')}>
                    <span className={b('field-label')}>Название группы:</span>
                    <input
                        onChange={this.changeName}
                        className={b('field-input')}
                        type={'text'}
                        placeholder={'Введите название группы'}
                    />
                </label>
                <Button
                    onClick={this.goToSecondStep}
                    disabled={this.name.length === 0}
                >
                    Далее
                </Button>
            </React.Fragment>
        )
    }

    private renderStepTwo() {
        return (
            <React.Fragment>
                <div className={b('field')}>
                    <span className={b('field-label')}>Участники:</span>
                    <ContactsList/>
                </div>
                <Button disabled={this.members.length === 0}>Создать группу</Button>
            </React.Fragment>
        );
    }

    private changeName = (event) => {
        event.preventDefault();
        this.name = event.currentTarget.value;
    }

    private goToSecondStep = (event) => {
        event.preventDefault();

        if (this.name.length !== 0) {
            this.step = 2;
        }
    }
}

export default CreateRoom;
