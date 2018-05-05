import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { User } from '../../models';
import { Events } from '../../../shared/events';

export default async function updateCurrentUser(
    request: Request<{ user: User }>,
    response: Response
) {
    const currentUser = (await User.findById(request.user))!;

    const update = request.params.user;

    currentUser.firstName = update.firstName;
    currentUser.lastName = update.lastName;
    currentUser.avatar = update.avatar;
    currentUser.bio = update.bio;

    await currentUser!.save();
    response.notification(`profile_${currentUser.id}`, Events.UPDATE_PROFILE, currentUser);
    response.success(currentUser);
}
