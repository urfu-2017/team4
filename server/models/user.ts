import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { UserContacts } from './user-contacts';

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

    @Column
    public avatar: string;

    @Column
    public bio: string;

    @Column({ defaultValue: true })
    public isUsedBot: boolean;

    @BelongsToMany(() => User, () => UserContacts, 'userId', 'contactId')
    public contacts: User[];
}
