import { observable, computed, action } from 'mobx';

import integerDivision from '../utils/integer-division';
import getCookie from '../utils/get-cookie';

import uiStore from '../domain/ui-store';

import { MS_IN_HOUR, MS_IN_MINUTE, MS_IN_SECOND } from '../config';

const milliseconds = {
    hours: MS_IN_HOUR,
    minutes: MS_IN_MINUTE,
    seconds: MS_IN_SECOND
};

class DeathtimerStore {
    @observable public isActive: boolean = false;
    @observable public timeToDeath: number = 0;

    @computed
    get seconds(): number {
        return (
            integerDivision(this.timeToDeath, MS_IN_SECOND) - this.hours * 3600 - this.minutes * 60
        );
    }

    @computed
    get minutes(): number {
        return integerDivision(this.timeToDeath, MS_IN_MINUTE) - this.hours * 60;
    }

    @computed
    get hours(): number {
        return integerDivision(this.timeToDeath, MS_IN_HOUR);
    }

    public changeTime = (unit: string, isInc: boolean = true): (() => void) => {
        return action(() => {
            const amount = milliseconds[unit];

            this.timeToDeath += isInc ? amount : -amount;

            console.log(this.timeToDeath);

            // Если время опустили до нуля, отключаем таймер
            if (!this.timeToDeath) {
                this.isActive = false;
            }

            this.saveState();
        });
    };

    @action
    public toggleActive = () => {
        if (!this.timeToDeath) {
            uiStore.setToast('Укажите время жизни сообщения.');

            return;
        }

        this.isActive = !this.isActive;

        this.saveState();
    };

    @action
    public getState() {
        if (getCookie('timeToDeath') !== undefined) {
            this.timeToDeath = Number(getCookie('timeToDeath'));
        }
        if (getCookie('timeToDeath') !== undefined) {
            this.isActive = getCookie('isTimerActive') === 'true';
        }
    }

    @action
    public saveState() {
        const dateForCookie = new Date();
        dateForCookie.setDate(dateForCookie.getDate() + 2);
        document.cookie = `isTimerActive=${this.isActive}; expires=${dateForCookie.toUTCString()}`;
        document.cookie = `timeToDeath=${this.timeToDeath}; expires=${dateForCookie.toUTCString()}`;
    }
}

export default new DeathtimerStore();
