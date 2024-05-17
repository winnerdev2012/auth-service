export const logConfig = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
        destination: `${__dirname}/log`,
      },
    },
  },
  production: true,
  test: false,
};
