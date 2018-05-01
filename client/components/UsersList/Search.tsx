import React from 'react';
import b_ from 'b_';

import Input from '../Input';

const b = b_.with('users');

interface Props {
    query: string;
    onChangeQuery: (query: string) => void;
    searchType: 'box' | 'plain';
}

class Search extends React.PureComponent<Props> {
    private search: HTMLInputElement;

    public componentDidMount() {
        this.search.focus();
    }

    public render() {
        return (
            <Input
                className={b('search', { type: this.props.searchType })}
                type="text"
                placeholder="Поиск..."
                onChange={this.onInput}
                value={this.props.query}
                innerRef={input => this.search = input /* tslint:disable-line */}
            />
        );
    }

    private onInput = (event: React.FormEvent<HTMLInputElement>) => {
        this.props.onChangeQuery(
            event.currentTarget.value
        );
    };
}

export default Search;
