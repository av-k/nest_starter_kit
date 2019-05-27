import * as dotenv from 'dotenv';

interface EnvVariables {
  NODE_ENV: string;
  HOST: string;
  PORT: number|string;
}

const defaultEnvVariables: EnvVariables = {
  NODE_ENV: 'development',
  HOST: '0.0.0.0',
  PORT: 3050,
};

const env = dotenv.config().parsed;

export const getEnvVariables: EnvVariables|any = () => {
  const receivedEnv = Object.keys(env).reduce((accumulator, envName) => {
    if (Object.keys(defaultEnvVariables).includes(envName)) {
      accumulator[envName] = env[envName];
    }
    return accumulator;
  }, {});
  if (Object.keys(receivedEnv).length < Object.keys(defaultEnvVariables).length) {
    return defaultEnvVariables;
  } else {
    return receivedEnv;
  }
};
