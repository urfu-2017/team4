import React from 'react';
import b_ from 'b_';
import { observer } from 'mobx-react';

import Button from '../Button';

import deathtimerStore from '../../domain/deathtimer-store';
import uiStore from '../../domain/ui-store';

import './Alarm.css';

const b = b_.with('alarm-picker');

const Alarm = () => {
    const dark = uiStore.isDark;

    return (
        <div className={b({ dark })}>
            <div className={b('buttons')}>
                <Button
                    className={b('button')}
                    onClick={deathtimerStore.toggleActive}
                    type={dark ? 'dark' : 'main'}
                >
                    {deathtimerStore.isActive ? 'Выкл' : 'Вкл'}
                </Button>
                <Button
                    className={b('button')}
                    onClick={deathtimerStore.clear}
                    type={dark ? 'dark' : 'main'}
                >
                    Сбросить
                </Button>
            </div>
            <div className={b('timer')}>
                <div className={b('days')}>
                    <small>Часы</small>
                    <Button
                        className={b('button-up')}
                        onClick={deathtimerStore.changeTime('hours')}
                        type={dark ? 'dark' : 'main'}
                    >
                        +
                    </Button>
                    <input type="text" value={deathtimerStore.hours} disabled={true} />
                    <Button
                        className={b('button-down')}
                        onClick={deathtimerStore.changeTime('hours', false)}
                        type={dark ? 'dark' : 'main'}
                    >
                        -
                    </Button>
                </div>
                <div className={b('hour')}>
                    <small>Минуты</small>
                    <Button
                        className={b('button-up')}
                        onClick={deathtimerStore.changeTime('minutes')}
                        type={dark ? 'dark' : 'main'}
                    >
                        +
                    </Button>
                    <input type="text" value={deathtimerStore.minutes} disabled={true} />
                    <Button
                        className={b('button-down')}
                        onClick={deathtimerStore.changeTime('minutes', false)}
                        type={dark ? 'dark' : 'main'}
                    >
                        -
                    </Button>
                </div>
                <div className={b('minutes')}>
                    <small>Секунды</small>
                    <Button
                        className={b('button-up')}
                        onClick={deathtimerStore.changeTime('seconds')}
                        type={dark ? 'dark' : 'main'}
                    >
                        +
                    </Button>
                    <input type="text" value={deathtimerStore.seconds} disabled={true} />
                    <Button
                        className={b('button-down')}
                        onClick={deathtimerStore.changeTime('seconds', false)}
                        type={dark ? 'dark' : 'main'}
                    >
                        -
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default observer(Alarm);
