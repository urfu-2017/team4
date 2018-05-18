import { Column, ForeignKey, Model, Table, DataType } from 'sequelize-typescript';

import { Chat } from './chat';
import { User } from './user';

@Table
export class Members extends Model<Members> {
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, primaryKey: true })
    public userId: number;

    @ForeignKey(() => Chat)
    @Column({ type: DataType.UUID, primaryKey: true })
    public chatId: string;

    @Column({ type: DataType.BOOLEAN })
    public mute: boolean;
}
