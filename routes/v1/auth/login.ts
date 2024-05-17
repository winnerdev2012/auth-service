/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GameUser } from '../../../models/user';
import { post as blockusPost } from '../../../services/blockus';
import { syncUser } from '../../../services/user';
import { AccessTokenType } from '../../../types/auth';

export default async (req: any, res: any) => {
  const { email, credential, epicId, deploymentId } = req.body;

  // login via blockus api
  let status = 200;
  let data: AccessTokenType = {
    accessToken: '',
  };

  if (!!credential) {
    ({ status, data } = await blockusPost<AccessTokenType>('players/login?type=email', { email, code: credential }));
  } else {
    if (!epicId || !deploymentId) {
      res.code(400).send({
        message: 'epicId or deploymentId field is missing',
      });
      return;
    }
    ({ status, data } = await blockusPost<AccessTokenType>('players/loginWithEpic', { email, epicId, deploymentId }));
  }

  // update user model
  const filter = { email, service: 'blockus' };
  const update = { loginType: epicId ? 'epic' : 'email', epicId, deploymentId };
  const curUser = await GameUser.findOneAndUpdate(filter, update, {
    new: true,
    upsert: true,
  });

  // sync user data with blockus
  await syncUser(curUser, data.accessToken);

  // send response
  res.code(status).send(data);
};
