/* eslint-disable @typescript-eslint/no-explicit-any */
import { get as blockusGet } from '../services/blockus';
import { LoginUserType } from '../types/auth';

export const syncUser = async (curUser: any, accessToken: string) => {
  blockusGet<LoginUserType>('players', accessToken).then(async ({ data: blockusUser }) => {
    curUser.id = blockusUser.id;
    curUser.wallets = [...blockusUser.wallets];
    await curUser.save();
  });
};
