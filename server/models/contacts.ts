import { DataType, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user';

@Table
export class Contacts extends Model<Contacts> {
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, primaryKey: true })
    public userId: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, primaryKey: true })
    public contactId: number;
}
