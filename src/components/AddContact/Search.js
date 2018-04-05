import React from 'react';

import userSearchStore from '../../domain/user-search-store';

class Search extends React.Component {
    componentDidMount() {
        this.usernameInput.focus();
    }

    onInput = () => {
        userSearchStore.setQuery(this.usernameInput.value);
    };

    render() {
        return (
            <input
                className="add-contact__input"
                placeholder="Имя пользователя..."
                ref={(input) => { this.usernameInput = input; }}
                onInput={this.onInput}
            />
        );
    }
}

export default Search;
