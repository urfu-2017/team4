import React from 'react';
import b_ from 'b_';

import contactsStore from '../../domain/contacts-store';

const b = b_.with('contacts');

class Search extends React.Component {
    private search: HTMLInputElement;

    public componentDidMount() {
        this.search.focus();
    }

    public componentWillUnmount() {
        contactsStore.setFilterValue('');
    }

    public render() {
        return (
            <div className={b('search-wrapper')}>
                <input
                    className={b('search')}
                    type="search"
                    placeholder="Поиск..."
                    onInput={this.onInput}
                    ref={input => this.search = input}
                />
            </div>
        );
    }

    private onInput = (event: any) => {
        contactsStore.setFilterValue(event.currentTarget.value);
    };
}

export default Search;
