import React from 'react';
import ReactDOM from 'react-dom';
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
    closeTimer: () => void;
}

@observer
class Alarm extends React.Component<Props, any> {
    public componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, false);
    }

    public componentWillMount() {
        document.addEventListener('click', this.handleClickOutside, false);
    }

    public render() {
        return (
            <div className={b()}>
                <Button className={b('button-state')} onClick={this.createState}>{
                    ChatsStore.timeToDeathState ? 'OFF' : 'ON'
                }</Button>
                <div className={b('timer')}>
                    <div className={b('days')}>
                        <small>Day</small>
                        <Button className={b('button-up')} onClick={this.addDays}>+</Button>
                        <input type='number' value={ChatsStore.timeToDeathDay} disabled/>
                        <Button className={b('button-down')} onClick={this.deleteDays}>-</Button>
                    </div>
                    <div className={b('hour')}>
                        <small>Hour</small>
                        <Button className={b('button-up')} onClick={this.addHour}>+</Button>
                        <input type='number' value={ChatsStore.timeToDeathHour} disabled/>
                        <Button className={b('button-down')} onClick={this.deleteHour}>-</Button>
                    </div>
                    <div className={b('minutes')}>
                        <small>Min</small>                    
                        <Button className={b('button-up')} onClick={this.addMinutes}>+</Button>
                        <input type='number' value={ChatsStore.timeToDeathMin} disabled/>
                        <Button className={b('button-down')} onClick={this.deleteMinutes}>-</Button>
                    </div>
                </div>
            </div>
        );
    }

    @action
    private createState() {
        ChatsStore.timeToDeathState = !ChatsStore.timeToDeathState;
        ChatsStore.saveCookies();
    }

    @action
    private addDays() {
        if (isNaN(ChatsStore.timeToDeath)) {
            ChatsStore.timeToDeath = msInDays;
        } else {
            ChatsStore.timeToDeath += msInDays;
        }
        ChatsStore.parsTimer();
    }

    @action
    private deleteDays() {
        if (!isNaN(ChatsStore.timeToDeath)) {
            ChatsStore.timeToDeath += ChatsStore.timeToDeath - msInDays <= 0
                ? 0
                : -1 * msInDays;
        }
        ChatsStore.parsTimer();
    }

    @action
    private addHour() {
        if (isNaN(ChatsStore.timeToDeath)) {
            ChatsStore.timeToDeath = msInHour;
        } else {
            ChatsStore.timeToDeath += msInHour;
        }
        ChatsStore.parsTimer();
    }

    @action
    private deleteHour() {
        if (!isNaN(ChatsStore.timeToDeath)) {
            ChatsStore.timeToDeath += ChatsStore.timeToDeath - msInHour <= 0
                ? 0
                : -1 * msInHour;
        }
        ChatsStore.parsTimer();
    }

    @action
    private addMinutes() {
        if (isNaN(ChatsStore.timeToDeath)) {
            ChatsStore.timeToDeath = msInMin;
        } else {
            ChatsStore.timeToDeath += msInMin;
        }
        ChatsStore.parsTimer();
    }

    @action
    private deleteMinutes() {
        if (!isNaN(ChatsStore.timeToDeath)) {
            ChatsStore.timeToDeath += ChatsStore.timeToDeath - msInMin <= 0
                ? 0
                : -1 * msInMin;
        }
        ChatsStore.parsTimer();
    }

    @action
    private handleClickOutside = event => {
        const domNode = ReactDOM.findDOMNode(this);

        if (!domNode || !domNode.contains(event.target)) {
            this.props.closeTimer();
        }
    };
}

export default Alarm;
