/* eslint-disable @typescript-eslint/no-explicit-any */
import { GameUser } from '../../../models/user';
import { post as blockusPost } from '../../../services/blockus';
import { syncUser } from '../../../services/user';

export default async (req: any, res: any) => {
  const { type, address, signature, chain, id, accessToken } = req.body;
  if (!accessToken || !signature || !chain || !id) {
    res.code(400).send({
      message: 'not enough payload',
    });
    return;
  }

  // find user
  const curUser = await GameUser.findOne({ id, service: 'blockus' });
  if (!curUser) {
    res.code(409).send({
      message: 'user does not exist',
    });
    return;
  }

  // link wallet
  const { status, data } = await blockusPost<any>(
    `auth/link?type=${type}`,
    { address, signature, id, chain },
    true,
    accessToken,
  );

  // update user wallets
  await syncUser(curUser, accessToken);

  res.code(status).send(data);
};
