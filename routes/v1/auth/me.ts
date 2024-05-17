/* eslint-disable @typescript-eslint/no-explicit-any */
import { GameUser } from '../../../models/user';
import { get as blockusGet } from '../../../services/blockus';
import { LoginUserType } from '../../../types/auth';

export default async (req: any, res: any) => {
  // get user information
  const { accessToken } = req.body;
  const { status, data } = await blockusGet<LoginUserType>('players', accessToken as string);

  // sync user
  await GameUser.findOneAndUpdate(
    { id: data.id, service: 'blockus' },
    {
      email: data.email,
      loginType: data.loginType,
      wallets: data.wallets,
    },
    {
      new: true,
      upsert: true,
    },
  );
  res.code(status).send(data);
};
