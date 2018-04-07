import React from 'react';

import contactsStore from '../../domain/contacts-store';

class Search extends React.Component {
    componentDidMount() {
        this.search.focus();
    }

    render() {
        return (
            <div className="contacts__search-wrapper">
                <input
                    className="contacts__search"
                    type="search"
                    placeholder="Поиск..."
                    onInput={event => contactsStore.setFilterValue(event.target.value)}
                    ref={(input) => { this.search = input; }}
                />
            </div>
        );
    }
}

export default Search;
