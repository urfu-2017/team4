import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Chat } from './chat';
import { User } from './user';

@Table({
    timestamps: true,
    indexes: [{
        fields: ['chatId']
    }]
})
export class Message extends Model<Message> {
    @Column({ type: DataType.UUIDV4, primaryKey: true })
    public id: string;

    @ForeignKey(() => User)
    @Column({ allowNull: false })
    public senderId: number;

    @ForeignKey(() => Chat)
    @Column({ allowNull: false })
    public chatId: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    public message: string;

    @Column({ type: DataType.JSONB })
    public meta: any;

    // TODO: Добавить реакции
}
