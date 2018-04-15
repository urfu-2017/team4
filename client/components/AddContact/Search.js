import React from 'react';
import { observer } from 'mobx-react';

import userSearchStore from '../../domain/user-search-store';

@observer
class Search extends React.Component {
    componentDidMount() {
        this.usernameInput.focus();
    }

    onInput = () => {
        if (userSearchStore.hasError) {
            userSearchStore.clear();
        }

        userSearchStore.setQuery(this.usernameInput.value);
    };

    onEnterPress = event => {
        if (event.key === 'Enter') {
            userSearchStore.searchUser();
        }
    };

    render() {
        return (
            <input
                className={`add-contact__input${userSearchStore.hasError ? ' error' : ''}`}
                placeholder="Имя пользователя..."
                ref={input => {
                    this.usernameInput = input;
                }}
                onInput={this.onInput}
                onKeyPress={this.onEnterPress}
            />
        );
    }
}

export default Search;
