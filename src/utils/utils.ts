export const isDevEnv = (): boolean => (
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
);

export const randomStr = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';

  for (let i = 0; i < length; i++) {
    str += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return str;
};
