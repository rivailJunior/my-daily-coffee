import { getErrorMessage } from '@/utils/get-error-messages';

import { cognitoClient } from '@/lib/aws/client-cognito';
import { api } from './api';

async function handleSendEmailVerificationCode(
  prevState: { message: string; errorMessage: string },
  formData: FormData
) {
  let currentState;
  try {
    await cognitoClient.resendSignUpCode(String(formData.get('email')));
    currentState = {
      ...prevState,
      message: 'Código enviado com sucesso',
    };
    console.log('Código enviado com sucesso');
  } catch (error) {
    currentState = {
      ...prevState,
      errorMessage: getErrorMessage(error),
    };
  }

  return currentState;
}

async function handleConfirmSignUp(formData: FormData) {
  try {
    const response = await api.post(
      '/auth/',
      JSON.stringify({
        email: String(formData.get('email')),
        code: String(formData.get('code')),
        action: 'confirm-signup',
      })
    );
    return response;
  } catch (error) {
    getErrorMessage(error, 'CONFIRM_SIGNUP', true);
    throw error;
  }
}

async function handleSignIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const response = await api.post(
      '/auth/',
      JSON.stringify({
        email,
        password,
        action: 'login',
      })
    );
    if (response.status === 401) {
      throw new Error('Usuário ou senha inválidos');
    }
    return response;
  } catch (error) {
    getErrorMessage(error, 'SIGNIN', true);
    throw error;
  }
}

interface SignUpParams {
  email: string;
  password: string;
  name: string;
}

async function handleSignUp({ email, password, name }: SignUpParams) {
  try {
    const response = await api.post('/auth', {
      email,
      password,
      name,
      action: 'signup',
    });
    
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    
    throw new Error('Registration failed');
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'SIGNUP', true);
    throw new Error(errorMessage || 'Failed to sign up');
  }
}

async function handleSignOut(accessToken: string) {
  try {
    const response = await api.post(
      '/auth/',
      JSON.stringify({ action: 'logout', token: accessToken })
    );
    return response;
  } catch (error) {
    getErrorMessage(error, 'SIGNOUT', true);
    throw error;
  }
}

export {
  handleSignUp,
  handleSendEmailVerificationCode,
  handleSignIn,
  handleSignOut,
  handleConfirmSignUp,
};
