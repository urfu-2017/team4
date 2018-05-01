import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { Contacts, User } from '../../models';

export default async function addContact(
    request: Request<{ contactId: number }>,
    response: Response
) {
    const newContact = await User.findById(request.params.contactId);

    if (!newContact) {
        return response.error(404, 'User not found');
    }

    const [, created] = await Contacts.findOrCreate({
        where: {
            userId: request.user,
            contactId: newContact.id
        }
    });

    if (!created) {
        return response.error(409, 'Contact already exists');
    }

    response.success(newContact);
}
