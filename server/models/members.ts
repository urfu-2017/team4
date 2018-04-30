import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Chat } from './chat';
import { User } from './user';

@Table
export class Members extends Model<Members> {
    @ForeignKey(() => User)
    @Column({ primaryKey: true })
    public userId: number;

    @ForeignKey(() => Chat)
    @Column({ primaryKey: true })
    public chatId: number;
}
