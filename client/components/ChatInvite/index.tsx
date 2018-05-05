import { observer } from 'mobx-react';
import React from 'react';
import {  RouteComponentProps } from 'react-router-dom';

import ChatsStore from '../../domain/chats-store';
import UsersStore from '../../domain/users-store';

interface Props extends RouteComponentProps<{ invite: string }> {
}

@observer
class ChatInvite extends React.Component<Props> {
    public async componentDidMount() {
        let chatId = null;

        const invite = this.props.match.params.invite;

        if (invite.startsWith('@')) {
            const username = invite.slice(1);
            const user = await UsersStore.fetchUserByUsername(username);
            if (!user) {
                return;
            }
            const dialog = ChatsStore.findDialog(user.id) ||
                await ChatsStore.createChat('dialog', [user.id]);
            chatId = dialog.id;
        } else {
            if (await ChatsStore.fetchChat(invite)) {
                chatId = invite;
            }
        }

        const redirect = chatId ? `/chats/${chatId}` : '/';
        this.props.history.replace(redirect);
    }

    public render() {
        return (<div />);
    }
}

export default ChatInvite;
