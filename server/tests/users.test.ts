import { sequelize } from './sequelize';
import { configureModels, Contacts, User } from '../models';

describe('Управление пользователями', () => {
    beforeAll(async () => await configureModels(sequelize));

    test('Создание нового пользователя', async () => {
        const user = new User({
            id: 1,
            username: 'kilyaa',
            firstName: 'Ilya',
            lastName: 'Kulygin'
        });

        await user.save();
        const createdUser = await User.findById(1);
        expect(createdUser!.toJSON()).toEqual(user.toJSON());
    });

    test('Смена имени и фамилии у существующего пользователя', async () => {
        const createdUser = await User.findById(1);
        createdUser!.firstName = '';
        createdUser!.lastName = '';
        await createdUser!.save();

        const updatedUser = await User.findById(1);
        expect(updatedUser!.toJSON()).toEqual(createdUser!.toJSON());
    });

    test('Удаление пользователя', async () => {
        const createdUser = await User.findById(1);
        await createdUser!.destroy();

        const deletedUser = await User.findById(1);
        expect(deletedUser).toEqual(null);
    });

    test('Создание трёх пользователей и добавление в контакты', async () => {
       let user1: User = await User.create<User>({ id: 1, username: 'user1' });
       let user2: User = await User.create<User>({ id: 2, username: 'user2' });
       let user3: User = await User.create<User>({ id: 3, username: 'user3' });

       const allUsers = await User.findAll();
       expect(allUsers.length).toEqual(3);

       await Contacts.bulkCreate<Contacts>([
           { userId: user1.id, contactId: user2.id },
           { userId: user1.id, contactId: user3.id },
           { userId: user2.id, contactId: user1.id },
           { userId: user2.id, contactId: user3.id },
           { userId: user3.id, contactId: user1.id }
       ]);

       const include = [{
           model: User,
           attributes: ['id'],
           through: { attributes: [] }
       }]

       user1 = (await User.findById(1, { include }))!.toJSON();
       user2 = (await User.findById(2, { include }))!.toJSON();
       user3 = (await User.findById(3, { include }))!.toJSON();

       expect(user1.contacts).toEqual([ { id: 2 }, { id: 3 } ]);
       expect(user2.contacts).toEqual([ { id: 1 }, { id: 3 } ]);
       expect(user3.contacts).toEqual([ { id: 1 } ]);
    });

    test('Удаление из контактов', async () => {
        let contacts = await Contacts.findAll({ where: { userId: 1 } });
        expect(contacts[0].contactId).toEqual(2);
        expect(contacts[1].contactId).toEqual(3);

        await Promise.all(contacts.map(contact => contact.destroy()));
        contacts = await Contacts.findAll({ where: { userId: 1 } });
        expect(contacts).toEqual([]);
    });
});
