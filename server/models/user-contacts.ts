import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user';

@Table
export class UserContacts extends Model<UserContacts> {
    @ForeignKey(() => User)
    @Column({ unique: false })
    public userId: number;

    @ForeignKey(() => User)
    @Column({ unique: false })
    public contactId: number;
}
