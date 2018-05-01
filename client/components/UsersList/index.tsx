import React from 'react';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import b_ from 'b_';
import UserItem from './Item';
import Search from './Search';

import UserModel from '../../domain/user-model';


import './UsersList.css';

const b = b_.with('users');

interface Props {
    users: UserModel[];

    searchType?: 'plain' | 'box';
    disableSearch?: boolean;
    selected?: string[];
    onClick?: (id: string) => void;
}

@observer
class ContactsList extends React.Component<Props> {

    @observable
    private query: string = '';

    @computed
    private get filteredUsers(): UserModel[] {
        if (!this.query) {
            return this.props.users;
        }

        return this.props.users.filter(({ username, firstName, lastName }) =>
            [username, firstName, lastName].some(
                word => word && word.toLowerCase().includes(this.query.toLocaleLowerCase())
            )
        );
    }

    public render(): React.ReactNode {
        const { selected = [], onClick, users, disableSearch, searchType = 'box'} = this.props;

        return (
            <div className={b()}>
                {(users.length !== 0 && !disableSearch) && (
                    <Search
                        searchType={searchType}
                        query={this.query}
                        onChangeQuery={this.onQueryChange}
                    />
                )}
                <ul className={b('list')}>
                    {this.filteredUsers.map(user => (
                        <UserItem
                            key={user.id}
                            user={user}
                            className={b('contact')}
                            onClick={onClick}
                            selected={selected.includes(user.id)}
                            selectable={true}
                        />
                    ))}
                </ul>
            </div>
        );
    }

    private onQueryChange = (query: string) => {
        this.query = query;
    }
}

export default ContactsList;
