import React from 'react';
import ReactDOM from 'react-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import LoginPage from './components/LoginPage';

import UsersStore from './domain/users-store';
import './index.css';

@observer
class Application extends React.Component {

    @observable isAppLoaded = false;

    componentDidMount() {
        UsersStore.fetchCurrentUser()
            .then(() => {
                this.isAppLoaded = true;
            });
    }

    render() {
        if (!this.isAppLoaded) {
            return <div/>;
        }

        if (!UsersStore.isAuth) {
            return <LoginPage/>;
        }

        return (<h1>App</h1>);
    }
}

ReactDOM.render(<Application/>, document.getElementById('root'));
