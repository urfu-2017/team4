import React from 'react';
import b_ from 'b_';
import { observer } from 'mobx-react';

import CloseIcon from './CloseIcon';
import ForwardedIcon from '../Message/ReplyIcon';
import usersStore from '../../domain/users-store';
import uiStore from '../../domain/ui-store';

import './Container.css';
const b = b_.with('forwarded-message-container');

@observer
class Container extends React.Component<{ message: any }> {
    public render(): React.ReactNode {
        const { senderId, attachment, text = '' } = this.props.message;
        const user = usersStore.users.get(senderId);
        const content = `${attachment ? 'Фотография.' : ''} ${text}`.trim();

        return (
          <div className={b()}>
              <ForwardedIcon className={b('icon')}/>
              {attachment && <img src={attachment} className={b('attachment')}/>}
              <div className={b('body')}>
                  <div className={b('sender')}>{user.displayName}</div>
                  <div className={b('content')}>{content}</div>
              </div>
              <span className={b('close')} onClick={this.clearMessage}>
                  <CloseIcon/>
              </span>
          </div>
        );
    }

    private clearMessage = () => {
        uiStore.setForwardMessage(null);
    }
}

export default Container;
