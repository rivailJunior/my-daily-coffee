export const AWS_COGNITO_CONFIG = {
  userPoolId: process.env.COGNITO_USER_POOL_ID ?? '',
  userPoolClientId: process.env.COGNITO_CLIENT_ID ?? '',
  clientSecret: process.env.COGNITO_CLIENT_SECRET ?? '',
  region: process.env.COGNITO_REGION ?? 'us-east-1',
};
