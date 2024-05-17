/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
const v1 = (fastify: any, opts: any, done: any) => {
  fastify.register(require('./auth'), { prefix: '/auth' });
  done();
};

export default v1;
