import { BelongsTo, BelongsToMany, Column, DataType, HasMany, IsIn, Model, Table } from 'sequelize-typescript';
import { User } from './user';
import { Members } from './members';
import { Message } from './message';

@Table({ timestamps: true })
export class Chat extends Model<Chat> {
    @Column({ type: DataType.UUIDV4, primaryKey: true })
    public id: string;

    @IsIn([['room', 'dialog']])
    @Column({ allowNull: false })
    public type: string;

    @Column({ allowNull: false })
    public name: string;

    @BelongsTo(() => User, 'owner_id')
    public owner: User;

    @BelongsToMany(() => User, () => Members, 'chatId', 'userId')
    public members: User[];

    @HasMany(() => Message, 'chatId')
    public messages: Message[];
}
