import { NextResponse } from 'next/server';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { generateSecretHash } from '@/lib/generateSecretHash';
import { cookies } from 'next/headers';
import { verifyCognitoToken } from '@/lib/verifyCognitoToken';

const client = new CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION,
});

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Missing credentials' },
        { status: 400 }
      );
    }

    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID!, // App Client ID from User Pool
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: generateSecretHash(
          username,
          process.env.COGNITO_CLIENT_ID!,
          process.env.COGNITO_CLIENT_SECRET!
        ),
      },
    });

    const response = await client.send(command);

    const cookieStore = cookies();
    cookieStore.set('idToken', response.AuthenticationResult?.IdToken!);
    cookieStore.set('accessToken', response.AuthenticationResult?.AccessToken!);
    cookieStore.set(
      'refreshToken',
      response.AuthenticationResult?.RefreshToken!
    );

    return NextResponse.json({
      accessToken: response.AuthenticationResult?.AccessToken,
      idToken: response.AuthenticationResult?.IdToken,
      refreshToken: response.AuthenticationResult?.RefreshToken,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = cookies();
  const idToken = cookieStore.get('idToken');
  const accessToken = cookieStore.get('accessToken');
  const refreshToken = cookieStore.get('refreshToken');

  if (!idToken || !accessToken || !refreshToken) {
    return NextResponse.json(
      { error: 'Missing authentication tokens' },
      { status: 401 }
    );
  }

  const user = await verifyCognitoToken(idToken.value);

  return NextResponse.json({
    idToken: idToken.value,
    accessToken: accessToken.value,
    refreshToken: refreshToken.value,
    user: {
      email: user?.email,
      verified: user?.email_verified,
      authTime: user?.auth_time,
      name: user?.name,
    },
  });
}
