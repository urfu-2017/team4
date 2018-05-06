import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table
} from 'sequelize-typescript';
import { Chat } from './chat';
import { User } from './user';
import { Reaction } from './reaction';

@Table({
    timestamps: true,
    indexes: [
        {
            fields: ['chatId']
        }
    ]
})
export class Message extends Model<Message> {
    @Column({ type: DataType.UUID, primaryKey: true, allowNull: false })
    public id: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    public senderId: number;

    @ForeignKey(() => Chat)
    @Column({ type: DataType.UUID, allowNull: false })
    public chatId: string;

    @BelongsTo(() => Chat)
    public chat: Chat;

    @Column({ type: DataType.TEXT })
    public text: string;

    @Column({ type: DataType.JSONB })
    public meta: any;

    @Column({ type: DataType.TEXT })
    public attachment: string;

    @HasMany(() => Reaction, 'messageId')
    public reactions: Reaction;
}
