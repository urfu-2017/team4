import React from 'react';

import contactsStore from '../../domain/contacts-store';

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
            <div className="contacts__search-wrapper">
                <input
                    className="contacts__search"
                    type="search"
                    placeholder="Поиск..."
                    onInput={this.onInput}
                    ref={input => {
                        this.search = input;
                    }}
                />
            </div>
        );
    }

    private onInput = (event: any) => {
        contactsStore.setFilterValue(event.currentTarget.value);
    };
}

export default Search;
