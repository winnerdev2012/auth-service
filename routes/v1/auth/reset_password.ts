/* eslint-disable @typescript-eslint/no-explicit-any */
import { put as blockusPut } from '../../../services/blockus';

export default async (req: any, res: any) => {
  const { email, newCredential, accessToken } = req.body;
  if (!newCredential) {
    res.code(400).send({
      message: '`newCredential` field is missing',
    });
    return;
  }
  const { status } = await blockusPut('players/resetPassword', { email, newCredential }, true, accessToken);
  res.code(status).send();
};
