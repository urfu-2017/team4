import React from 'react';
import { observer } from 'mobx-react';

import HeaderLogoWrap from '../Header/HeaderLogoWrap';
import Dialogs from '../Dialogs';

@observer
class Chats extends React.Component {
    render() {
        return (
            <React.Fragment>
                <header className="mobile-app__header header">
                    <HeaderLogoWrap/>
                </header>
                <div className="mobile-app__container">
                    <Dialogs/>
                </div>
            </React.Fragment>
        );
    }
}

export default Chats;

