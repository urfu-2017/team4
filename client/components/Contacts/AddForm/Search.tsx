import { observer } from 'mobx-react';
import React from 'react';

import Input from '../../Input';
import userSearchStore from '../../../domain/user-search-store';

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
            <Input
                type={'text'}
                placeholder="Имя пользователя..."
                innerRef={input => { // tslint:disable-line
                    this.usernameInput = input;
                }}
                onInput={this.onInput}
                onKeyPress={this.onEnterPress}
                hasError={userSearchStore.hasError}
            />
        );
    }
}

export default Search;
