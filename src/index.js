import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';

import LoginPage from './components/LoginPage';

import UsersStore from './domain/users-store';
import './index.css';

@observer
class Application extends React.Component {
    componentDidMount() {
        UsersStore.fetchCurrentUser();
    }

    render() {
        if (!UsersStore.isAuth) {
            return <LoginPage />;
        }

        return (<h1>App</h1>);
    }
}

ReactDOM.render(<Application />, document.getElementById('root'));
