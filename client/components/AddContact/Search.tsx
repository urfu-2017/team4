import { observer } from 'mobx-react';
import React from 'react';

import userSearchStore from '../../domain/user-search-store';

@observer
class Search extends React.Component {
    private usernameInput: HTMLInputElement;

    public componentDidMount() {
        this.usernameInput.focus();
    }

    public onInput = () => {
        if (userSearchStore.hasError) {
            userSearchStore.clear();
        }

        userSearchStore.setQuery(this.usernameInput.value);
    };

    public onEnterPress = event => {
        if (event.key === 'Enter') {
            userSearchStore.searchUser();
        }
    };

    public render() {
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
