import { jwtVerify, createRemoteJWKSet } from 'jose';

const region = process.env.COGNITO_REGION!;
const userPoolId = process.env.COGNITO_USER_POOL_ID!;

const JWKS = createRemoteJWKSet(
  new URL(
    `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`
  )
);

export async function verifyCognitoToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
      // You can also validate audience if needed:
      // audience: process.env.COGNITO_CLIENT_ID,
    });
    return payload;
  } catch (error) {
    console.error('Invalid Cognito token:', error);
    return null;
  }
}
