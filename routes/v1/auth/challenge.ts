/* eslint-disable @typescript-eslint/no-explicit-any */
import { post as blockusPost } from '../../../services/blockus';
import { ChallengeType } from '../../../types/auth';

export default async (req: any, res: any) => {
  const { type, address, email } = req.body;
  let body = {};
  switch (type) {
    case 'email':
      if (!email) {
        res.code(400).send({
          message: 'email field is missing',
        });
        return;
      }
      body = { email };
      break;
    case 'web3':
      if (!address) {
        res.code(400).send({
          message: 'address field is missing',
        });
        return;
      }
      body = { address };
      break;
  }
  const { status, data } = await blockusPost<ChallengeType>(`auth/challenge?type=${type}`, body, false);
  res.code(status).send(data);
};
