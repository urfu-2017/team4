import React from 'react';
import b_ from 'b_';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';

import Button from '../Button';

import uiStore from '../../domain/ui-store';

const b = b_.with('message-input');

interface Props {
    onChange: (text: string) => void;
}

@observer
class Recognition extends React.Component<Props> {

    @observable private isActive: boolean = false;

    private recognizer: SpeechRecognition;

    public constructor(props: Props) {
        super(props);

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognizer = new SpeechRecognition();
            this.recognizer.lang = 'ru-RU';

            this.recognizer.onstart = () => this.setStatus(true);
            this.recognizer.onend = () => this.setStatus(false);
            this.recognizer.onresult = this.onResult;
        }
    }

    public render(): React.ReactNode {
        // Если данная функция не поддерживается браузером
        if (!this.recognizer) {
            return null;
        }

        const dark = uiStore.isDark;

        return (
            <Button onClick={this.toggleRecognition} className={b('button', { active: this.isActive, dark })}>
                <svg className={b('icon')} viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 16c2.206 0 4-1.795 4-4V6c0-2.206-1.794-4-4-4S8 3.794 8 6v6c0 2.205 1.794 4 4 4z"/>
                    <path fill="currentColor" d="M19 12v-2a1 1 0 1 0-2 0v2c0 2.757-2.243 5-5 5s-5-2.243-5-5v-2a1 1 0 1 0-2 0v2c0 3.52 2.613 6.432 6 6.92V20H8a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-3v-1.08c3.387-.488 6-3.4 6-6.92z"/>
                </svg>
            </Button>
        );
    }

    private toggleRecognition = (evt: React.MouseEvent<HTMLButtonElement>) => {
        evt.preventDefault();

        if (this.isActive) {
            this.recognizer.stop();
            return;
        }

        this.recognizer.start();
    }

    private onResult = (evt: SpeechRecognitionEvent) => {
        this.props.onChange(evt.results[0][0].transcript);
    }

    @action
    private setStatus(status: boolean) {
        this.isActive = status;
    }
}

export default Recognition;
