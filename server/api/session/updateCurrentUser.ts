import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { User } from '../../models';

export default async function updateCurrentUser(
    request: Request<{ user: User }>,
    response: Response
) {
    const currentUser = (await User.findById(request.user))!;

    const update = request.params.user;

    currentUser.firstName = update.firstName;
    currentUser.lastName = update.lastName;
    currentUser.bio = update.bio;

    await currentUser!.save();
    response.notification(`profile_${currentUser.id}`, 'update', currentUser);
    response.success(currentUser);
}
