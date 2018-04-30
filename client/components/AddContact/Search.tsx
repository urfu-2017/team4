import { observer } from 'mobx-react';
import React from 'react';
import b from 'b_';

import userSearchStore from '../../domain/user-search-store';

interface Props {
    className: string
}

@observer
class Search extends React.Component<Props> {
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
                className={b(this.props.className, {error: userSearchStore.hasError})}
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
