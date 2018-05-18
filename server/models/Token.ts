import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user';

@Table({ timestamps: false })
export class Token extends Model<Token> {

    @Column({ type: DataType.INTEGER })
    @ForeignKey(() => User)
    public userId: number;

    @Column({ type: DataType.TEXT })
    public token: string;
}
