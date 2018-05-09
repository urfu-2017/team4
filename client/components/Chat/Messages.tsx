import React from 'react';
import { observer } from 'mobx-react';

import Message from '../Message';

interface Props {
    messages: any[];
}

@observer
class Messages extends React.Component<Props> {
    public render(): React.ReactNode {
        return this.props.messages.map(this.renderMessage);
    }

    private renderMessage(message) {
        return <Message key={message.id} isChain={false} message={message} />;
    };
}

export default Messages;
