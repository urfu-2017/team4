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
    @Column({ type: DataType.UUIDV4, primaryKey: true, allowNull: false })
    public id: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    public senderId: number;

    @ForeignKey(() => Chat)
    @Column({ type: DataType.UUIDV4, allowNull: false })
    public chatId: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    public text: string;

    @Column({ type: DataType.JSONB })
    public meta: any;

    // TODO: Добавить реакции
}
