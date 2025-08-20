import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyCognitoToken } from '@/lib/verifyCognitoToken';
import { cognitoClient } from '@/lib/aws/client-cognito';

import {
  GetUserCommandOutput,
  InitiateAuthCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

type setCookieProps = {
  cookieStore: ReadonlyRequestCookies;
  loginData: InitiateAuthCommandOutput;
  user: GetUserCommandOutput;
};
const setCognitoCookie = ({ cookieStore, loginData, user }: setCookieProps) => {
  cookieStore.set({
    name: 'cognito_token',
    value: loginData?.AuthenticationResult?.AccessToken ?? '',
    maxAge: loginData?.AuthenticationResult?.ExpiresIn,
  });
  cookieStore.set({
    name: 'cognito_user',
    value: JSON.stringify(user.UserAttributes),
  });
};

const unsetCognitoCookie = (cookieStore: ReadonlyRequestCookies) => {
  cookieStore.set('cognito_token', '', {
    path: '/',
    maxAge: 0,
  });
};

export async function POST(req: Request) {
  const data = await req.json();
  const cookieStore = cookies();

  if (!data.action) {
    return NextResponse.json(
      { error: 'Missing action parameter' },
      { status: 400 }
    );
  }

  try {
    if (data.action === 'login') {
      const loginData = await cognitoClient.signIn(data.email, data.password);

      if (!loginData?.AuthenticationResult?.AccessToken) {
        return NextResponse.json({ message: 'Login failed' }, { status: 401 });
      }
      const user = await cognitoClient.getUser(
        loginData?.AuthenticationResult?.AccessToken
      );

      setCognitoCookie({ cookieStore, loginData, user });
      return NextResponse.json({ message: 'Login successful' });
    }
    if (data.action === 'signup') {
      const registerData = await cognitoClient.signUp(
        data.name,
        data.email,
        data.password
      );
      if (registerData?.$metadata?.httpStatusCode !== 200) {
        return NextResponse.json(
          { message: 'Registration failed' },
          { status: 401 }
        );
      }
      return NextResponse.json({ message: 'Registration successful' });
    }
    if (data.action === 'confirm-signup') {
      const registerData = await cognitoClient.confirmSignUp(
        data.email,
        data.code
      );
      if (registerData?.$metadata?.httpStatusCode !== 200) {
        return NextResponse.json(
          { message: 'Registration failed' },
          { status: 401 }
        );
      }
      return NextResponse.json({ message: 'Registration successful' });
    }

    if (data.action === 'logout') {
      unsetCognitoCookie(cookieStore);
      return NextResponse.json({ message: 'Logout successful' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: error.statusCode || 500 }
    );
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
