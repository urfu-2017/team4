import { observer } from 'mobx-react';
import React from 'react';

import Dialogs from '../Dialogs';
import HeaderLogoWrap from '../Header/HeaderLogoWrap';

@observer
class Chats extends React.Component {
    public render() {
        return (
            <React.Fragment>
                <header className="mobile-app__header header">
                    <HeaderLogoWrap />
                </header>
                <div className="mobile-app__container">
                    <Dialogs />
                </div>
            </React.Fragment>
        );
    }
}

export default Chats;
