import { BelongsToMany, Column, Model, Table, DataType } from 'sequelize-typescript';

import { Contacts } from './contacts';
import { Chat } from './chat';
import { Members } from './members';

@Table({ timestamps: true, tableName: 'user' })
export class User extends Model<User> {
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    public username: string;

    @Column({ type: DataType.STRING })
    public firstName: string;

    @Column({ type: DataType.STRING })
    public lastName: string;

    @Column({ type: DataType.STRING, defaultValue: null })
    public avatar: string;

    @Column({ type: DataType.STRING, defaultValue: null })
    public bio: string;

    @Column({ type: DataType.STRING, defaultValue: null })
    public profileUrl: string;

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    public isUsedBot: boolean;

    @BelongsToMany(() => User, () => Contacts, 'userId', 'contactId')
    public contacts: User[];

    @BelongsToMany(() => Chat, () => Members, 'userId', 'chatId')
    public chats: Chat[];
}
