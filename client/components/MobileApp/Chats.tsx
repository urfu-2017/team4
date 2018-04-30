import { observer } from 'mobx-react';
import React from 'react';

import Chats from '../Chats';
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
                    <Chats />
                </div>
            </React.Fragment>
        );
    }
}

export default Chats;
