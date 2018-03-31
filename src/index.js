import React from 'react';
import ReactDOM from 'react-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import './index.css';
import './hacks.css';
import UsersStore from './domain/users-store';
import LoginPage from './components/LoginPage';
import Header from './components/Header';

@observer
class Application extends React.Component {
    componentDidMount() {
        UsersStore.fetchCurrentUser()
            .then(() => {
                this.isAppLoaded = true;
            });
    }

    @observable isAppLoaded = false;

    render() {
        if (!this.isAppLoaded) {
            return <div/>;
        }

        if (!UsersStore.isAuth) {
            return <LoginPage/>;
        }

        return (
            <React.Fragment>
                <Header/>
                <h1>App</h1>
            </React.Fragment>
        );
    }
}

ReactDOM.render(<Application/>, document.getElementById('root'));
