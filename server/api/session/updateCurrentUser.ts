import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { User } from '../../models/user';

export default async function updateCurrentUser(request: Request<{ user: User }>, response: Response) {
    const currentUser = await User.findById(request.user);

    const update = request.params.user;

    const fields = ['firstName', 'lastName', 'bio'];
    for (const field of fields){
        if (field in update){
            currentUser[field] = update[field];
        }
    }

    await currentUser.save();
    response.notification(`profile_${currentUser.id}`, 'update', currentUser);
    response.success(currentUser);
}
