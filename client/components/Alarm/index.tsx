import React from 'react';
import ReactDOM from 'react-dom';
import b_ from 'b_';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';

import Button from '../Button';
import uiStore from '../../domain/ui-store';

import './Alarm.css';

const b = b_.with('alarm-picker');
const msInMin = 1000 * 60;
const msInHour = msInMin * 60;
const msInDays = msInHour * 24;

interface Props {
    timeToDeath: any;
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
                    uiStore.timeToDeath.state ? 'OFF' : 'ON'
                }</Button>
                <div className={b('timer')}>
                    <div className={b('days')}>
                        <small>Day</small>
                        <Button className={b('button-up')} onClick={this.addDays}>+</Button>
                        <input type='number' value={uiStore.timeToDeath.day} disabled/>
                        <Button className={b('button-down')} onClick={this.deleteDays}>-</Button>
                    </div>
                    <div className={b('hour')}>
                        <small>Hour</small>
                        <Button className={b('button-up')} onClick={this.addHour}>+</Button>
                        <input type='number' value={uiStore.timeToDeath.hour} disabled/>
                        <Button className={b('button-down')} onClick={this.deleteHour}>-</Button>
                    </div>
                    <div className={b('minutes')}>
                        <small>Min</small>                    
                        <Button className={b('button-up')} onClick={this.addMinutes}>+</Button>
                        <input type='number' value={uiStore.timeToDeath.min} disabled/>
                        <Button className={b('button-down')} onClick={this.deleteMinutes}>-</Button>
                    </div>
                </div>
            </div>
        );
    }

    @action
    private createState() {
        uiStore.timeToDeath.state = !uiStore.timeToDeath.state;
        uiStore.saveCookies();
    }

    @action
    private addDays() {
        if (isNaN(uiStore.timeToDeath.ms)) {
            uiStore.timeToDeath.ms = msInDays;
        } else {
            uiStore.timeToDeath.ms += msInDays;
        }
        uiStore.parsTimer();
    }

    @action
    private deleteDays() {
        if (!isNaN(uiStore.timeToDeath.ms)) {
            uiStore.timeToDeath.ms += uiStore.timeToDeath.ms - msInDays <= 0
                ? 0
                : -1 * msInDays;
        }
        uiStore.parsTimer();
    }

    @action
    private addHour() {
        if (isNaN(uiStore.timeToDeath.ms)) {
            uiStore.timeToDeath.ms = msInHour;
        } else {
            uiStore.timeToDeath.ms += msInHour;
        }
        uiStore.parsTimer();
    }

    @action
    private deleteHour() {
        if (!isNaN(uiStore.timeToDeath.ms)) {
            uiStore.timeToDeath.ms += uiStore.timeToDeath.ms - msInHour <= 0
                ? 0
                : -1 * msInHour;
        }
        uiStore.parsTimer();
    }

    @action
    private addMinutes() {
        if (isNaN(uiStore.timeToDeath.ms)) {
            uiStore.timeToDeath.ms = msInMin;
        } else {
            uiStore.timeToDeath.ms += msInMin;
        }
        uiStore.parsTimer();
    }

    @action
    private deleteMinutes() {
        if (!isNaN(uiStore.timeToDeath.ms)) {
            uiStore.timeToDeath.ms += uiStore.timeToDeath.ms - msInMin <= 0
                ? 0
                : -1 * msInMin;
        }
        uiStore.parsTimer();
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
