import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user';

@Table
export class Contacts extends Model<Contacts> {
    @ForeignKey(() => User)
    @Column({ primaryKey: true })
    public userId: number;

    @ForeignKey(() => User)
    @Column({ primaryKey: true })
    public contactId: number;
}
