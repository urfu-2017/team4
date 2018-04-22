import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';

import { Contacts } from './contacts';
import { Chat } from './chat';
import { Members } from './members';

@Table({ timestamps: true, tableName: 'users' })
export class User extends Model<User> {
    @Column({ primaryKey: true })
    public id: number;

    @Column({ unique: true })
    public username: string;

    @Column
    public firstName: string;

    @Column
    public lastName: string;

    @Column({ defaultValue: null })
    public avatar: string;

    @Column({ defaultValue: null })
    public bio: string;

    @Column({ defaultValue: true })
    public isUsedBot: boolean;

    @BelongsToMany(() => User, () => Contacts, 'userId', 'contactId')
    public contacts: User[];

    @BelongsToMany(() => Chat, () => Members, 'userId', 'chatId')
    public chats: Chat[];
}
