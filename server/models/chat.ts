import {
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    IsIn,
    Model,
    Table
} from 'sequelize-typescript';
import { User } from './user';
import { Members } from './members';
import { Message } from './message';

@Table({ timestamps: true })
export class Chat extends Model<Chat> {
    @Column({ type: DataType.UUID, primaryKey: true, allowNull: false })
    public id: string;

    @IsIn([['room', 'dialog']])
    @Column({ type: DataType.ENUM('room', 'dialog'), allowNull: false })
    public type: string;

    @Column({ type: DataType.STRING, allowNull: false })
    public name: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    public ownerId: number;

    @BelongsToMany(() => User, () => Members, 'chatId', 'userId')
    public members: User[];

    @HasMany(() => Message, 'chatId')
    public messages: Message[];

    public hasMember(userId: number) {
        return this.members.some(user => user.id === userId);
    }
}
