import React from 'react';
import b_ from 'b_';
import { observer } from 'mobx-react';

import Button from '../Button';
import deathtimerStore from '../../domain/deathtimer-store';

import './Alarm.css';

const b = b_.with('alarm-picker');

const Alarm = () => (
    <div className={b()}>
        <Button className={b('button-state')} onClick={deathtimerStore.toggleActive}>
            {deathtimerStore.isActive ? 'OFF' : 'ON'}
        </Button>
        <div className={b('timer')}>
            <div className={b('days')}>
                <small>Часы</small>
                <Button className={b('button-up')} onClick={deathtimerStore.changeTime('hours')}>
                    +
                </Button>
                <input type="number" value={deathtimerStore.hours} disabled={true} />
                <Button
                    className={b('button-down')}
                    onClick={deathtimerStore.changeTime('hours', false)}
                >
                    -
                </Button>
            </div>
            <div className={b('hour')}>
                <small>Минуты</small>
                <Button className={b('button-up')} onClick={deathtimerStore.changeTime('minutes')}>
                    +
                </Button>
                <input type="number" value={deathtimerStore.minutes} disabled={true} />
                <Button
                    className={b('button-down')}
                    onClick={deathtimerStore.changeTime('minutes', false)}
                >
                    -
                </Button>
            </div>
            <div className={b('minutes')}>
                <small>Секунды</small>
                <Button className={b('button-up')} onClick={deathtimerStore.changeTime('seconds')}>
                    +
                </Button>
                <input type="number" value={deathtimerStore.seconds} disabled={true} />
                <Button
                    className={b('button-down')}
                    onClick={deathtimerStore.changeTime('seconds', false)}
                >
                    -
                </Button>
            </div>
        </div>
    </div>
);

export default observer(Alarm);
