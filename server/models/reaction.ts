import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user';
import { Message } from './message';

@Table({
    indexes: [{
        fields: ['userId', 'messageId', 'reaction'],
        unique: true
    }]
})
export class Reaction extends Model<Reaction> {

    @Column({ primaryKey: true, autoIncrement: true })
    public id: number;

    @ForeignKey(() => User)
    @Column({ allowNull: false })
    public userId: number;

    @ForeignKey(() => Message)
    @Column({ allowNull: false })
    public messageId: string;

    @BelongsTo(() => Message)
    public message: Message;

    @Column
    public reaction: string;
}
