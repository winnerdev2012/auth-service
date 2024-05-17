/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AccessToken,
  AccessTokenType,
  EmailUser,
  EmailUserType,
  LoginUser,
  LoginUserType,
  LinkData,
  LinkDataType,
  ChallengeType,
  Challenge,
  ChallengeInputType,
  ChallengeInput,
} from '../../../types/auth';
import { FastifyInstance } from 'fastify';
import login from './login';
import me from './me';
import challenge from './challenge';
import link from './link';
import resetPassword from './reset_password';

const auth = (fastify: FastifyInstance, _: any, done: any) => {
  fastify.post<{ Body: EmailUserType; Reply: AccessTokenType }>(
    '/login',
    {
      schema: {
        body: EmailUser,
        response: {
          200: AccessToken,
        },
      },
    },
    login,
  );
  fastify.post<{ Body: EmailUserType & AccessTokenType }>(
    '/reset-password',
    {
      schema: {
        body: { ...EmailUser, ...AccessToken },
      },
    },
    resetPassword,
  );
  fastify.post<{ Body: AccessTokenType; Reply: LoginUserType }>(
    '/me',
    {
      schema: {
        body: AccessToken,
        response: {
          200: LoginUser,
        },
      },
    },
    me,
  );
  fastify.post<{ Body: ChallengeInputType; Reply: ChallengeType }>(
    '/challenge',
    {
      schema: {
        body: ChallengeInput,
        response: {
          200: Challenge,
        },
      },
    },
    challenge,
  );
  fastify.post<{ Body: LinkDataType & AccessTokenType }>(
    '/link',
    {
      schema: {
        body: { ...LinkData, ...AccessToken },
      },
    },
    link,
  );
  done();
};

export default auth;
