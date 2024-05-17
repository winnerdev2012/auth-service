import { Static, Type } from '@sinclair/typebox';

export const EmailUser = Type.Object({
  email: Type.String({ format: 'email' }),
  credential: Type.Optional(Type.String()),
  newCredential: Type.Optional(Type.String()),
  epicId: Type.Optional(Type.String()),
  deploymentId: Type.Optional(Type.String()),
});

export type EmailUserType = Static<typeof EmailUser>;

export const AccessToken = Type.Object({
  accessToken: Type.String(),
});

export type AccessTokenType = Static<typeof AccessToken>;

export const BlockusWallet = Type.Object({
  id: Type.String(),
  type: Type.String(),
  address: Type.String(),
  nonCustodial: Type.Boolean(),
  createdAt: Type.String(),
});

export type BlockusWalletType = Static<typeof BlockusWallet>;

export const LoginUser = Type.Object({
  id: Type.String(),
  email: Type.String(),
  loginType: Type.Optional(Type.String()),
  wallets: Type.Array(BlockusWallet),
});

export type LoginUserType = Static<typeof LoginUser>;

export const LinkData = Type.Object({
  type: Type.String(),
  address: Type.String(),
  signature: Type.Optional(Type.String()),
  chain: Type.Optional(Type.String()),
  id: Type.Optional(Type.String()),
});

export type LinkDataType = Static<typeof LinkData>;

export const ChallengeInput = Type.Object({
  type: Type.String(),
  address: Type.Optional(Type.String()),
  email: Type.Optional(Type.String()),
  signature: Type.Optional(Type.String()),
  chain: Type.Optional(Type.String()),
  id: Type.Optional(Type.String()),
});

export type ChallengeInputType = Static<typeof ChallengeInput>;

export const Challenge = Type.Object({
  code: Type.Optional(Type.String()),
  address: Type.Optional(Type.String()),
  expiresAt: Type.Optional(Type.String()),
  message: Type.Optional(Type.String()),
  success: Type.Optional(Type.Boolean()),
});

export type ChallengeType = Static<typeof Challenge>;
