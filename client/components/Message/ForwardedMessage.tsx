import React from 'react';
import { observer } from 'mobx-react';
import b_ from 'b_';

import usersStore from '../../domain/users-store';
import uiStore from '../../domain/ui-store';

import markdown from '../../utils/markdown';
import { initContainer } from '../../utils/weather';

import './ForwardedMessage.css';
const b = b_.with('fwd');

interface Props {
    message: {
        senderId: number;
        text: string;
        attachment: string;
        isReply: boolean;
        createdAt: string;
    }
}

@observer
class ForwardedMessage extends React.Component<Props> {

    private messageArea: HTMLDivElement;

    public componentDidMount() {
        if (this.props.message.text) {
            initContainer(this.messageArea);
        }
    }

    public render(): React.ReactNode {
        const { attachment, text, isReply } = this.props.message;
        const dark = uiStore.isDark;

        return (
            <div className={b({ reply: isReply, dark })}>
                {this.renderHeader()}
                {text && (
                    <div
                        ref={el => this.messageArea = el!}
                        className={b('text')}
                        dangerouslySetInnerHTML={{ __html: markdown(text) }}
                    />
                )}
                {attachment && <img className={b('attachment')} src={attachment}/>}
            </div>
        );
    }

    private renderHeader(): React.ReactNode {
        const { senderId, isReply } = this.props.message;
        const user = usersStore.users.get(senderId);

        return (
            <div className={b('header')}>
                {isReply && <span>{user.displayName}</span>}
                {!isReply && <span className={b('sender')}>Переслано от {user.displayName}</span>}
            </div>
        )
    }
}

export default ForwardedMessage;
