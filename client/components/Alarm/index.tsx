import React from 'react';
import b_ from 'b_';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';

import Button from '../Button';
import ChatsStore from '../../domain/chats-store';

import './Alarm.css';

const b = b_.with('alarm-picker');
const msInMin = 1000 * 60;
const msInHour = msInMin * 60;
const msInDays = msInHour * 24;


interface Props {
    timeToDeath: number;
}

@observer
class Alarm extends React.Component<Props, any> {
    @observable private timer: number;

    // constructor(props) {
    //     super(props);
    // }

    public render() {
        return (
            <div className={b()}>
                <Button className={b('button-state')} onClick={this.createState}>{
                    ChatsStore.timeToDeathState ? 'ON' : 'OFF'
                }</Button>
                <div className={b('timer')}>
                    <div className={b('days')}>
                        <Button className={b('button-up')} onClick={this.addDays}>+</Button>
                        <input type='number' placeholder='days' disabled/>
                        <Button className={b('button-down')} onClick={this.deleteDays}>-</Button>
                    </div>
                    <div className={b('hour')}>
                        <Button className={b('button-up')} onClick={this.addHour}>+</Button>
                        <input type='number' placeholder='hour' disabled/>
                        <Button className={b('button-down')} onClick={this.deleteHour}>-</Button>
                    </div>
                    <div className={b('minutes')}>
                        <Button className={b('button-up')} onClick={this.addMinutes}>+</Button>
                        <input type='number' placeholder='min' disabled/>
                        <Button className={b('button-down')} onClick={this.deleteMinutes}>-</Button>
                    </div>
                </div>
            </div>
        );
    }

    private createState() {
        ChatsStore.timeToDeathState = !ChatsStore.timeToDeathState;
        ChatsStore.timeToDeath = ChatsStore.timeToDeath === 0 ? null : ChatsStore.timeToDeath; 
        console.log(ChatsStore.timeToDeath);        
    }

    private addDays() {
        if (isNaN(ChatsStore.timeToDeath)) {
            ChatsStore.timeToDeath = msInDays;
        } else {
            ChatsStore.timeToDeath += msInDays;
        }
    }

    private deleteDays() {
        if (!isNaN(ChatsStore.timeToDeath)) {
            ChatsStore.timeToDeath += ChatsStore.timeToDeath - msInDays <= 0
                ? -1 * msInDays - (ChatsStore.timeToDeath - msInDays)
                : -1 * msInDays;
        }
    }

    private addHour() {
        if (isNaN(ChatsStore.timeToDeath)) {
            ChatsStore.timeToDeath = msInHour;
        } else {
            ChatsStore.timeToDeath += msInHour;
        }
    }

    private deleteHour() {
        if (!isNaN(ChatsStore.timeToDeath)) {
            ChatsStore.timeToDeath += ChatsStore.timeToDeath - msInHour <= 0
                ? -1 * msInHour - (ChatsStore.timeToDeath - msInHour)
                : -1 * msInHour;
        }
    }

    private addMinutes() {
        if (isNaN(ChatsStore.timeToDeath)) {
            ChatsStore.timeToDeath = msInMin;
        } else {
            ChatsStore.timeToDeath += msInMin;
        }
    }

    private deleteMinutes() {
        if (!isNaN(ChatsStore.timeToDeath)) {
            ChatsStore.timeToDeath += ChatsStore.timeToDeath - msInMin <= 0
                ? -1 * msInMin - (ChatsStore.timeToDeath - msInMin)
                : -1 * msInMin;
        }
    }
}

export default Alarm;
