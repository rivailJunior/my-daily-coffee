import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  GlobalSignOutCommand,
  InitiateAuthCommand,
  ResendConfirmationCodeCommand,
  SignUpCommand,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { AWS_COGNITO_CONFIG } from './credentials';
import { getErrorMessage } from '@/utils/get-error-messages';
import { generateSecretHash } from '@/lib/generateSecretHash';

class CognitoClient {
  clientId = AWS_COGNITO_CONFIG.userPoolClientId;
  clientSecret = AWS_COGNITO_CONFIG.clientSecret;
  region = AWS_COGNITO_CONFIG.region;
  cognitoClient: CognitoIdentityProviderClient;
  constructor() {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.region,
    });
  }

  signUp = async (name: string, email: string, password: string) => {
    const username = email;
    const params = {
      ClientId: this.clientId,
      Username: username,
      Password: password,
      SecretHash: generateSecretHash(
        username,
        this.clientId,
        this.clientSecret
      ),
      UserAttributes: [
        { Name: 'email', Value: username },
        { Name: 'name', Value: name },
      ],
    };
    try {
      const command = new SignUpCommand(params);
      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error) {
      getErrorMessage(error, 'SERVER_SIGNUP', true);
      throw error;
    }
  };

  confirmSignUp = async (username: string, confirmationCode: string) => {
    const params = {
      ClientId: this.clientId,
      Username: username,
      ConfirmationCode: confirmationCode,
      SecretHash: generateSecretHash(
        username,
        this.clientId,
        this.clientSecret
      ),
    };

    try {
      const command = new ConfirmSignUpCommand(params);
      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error) {
      getErrorMessage(error, 'SERVER_CONFIRM_SIGNUP', true);
      throw error;
    }
  };

  resendSignUpCode = async (username: string) => {
    const params = {
      ClientId: this.clientId,
      Username: username,
      SecretHash: generateSecretHash(
        username,
        this.clientId,
        this.clientSecret
      ),
    };

    try {
      const command = new ResendConfirmationCodeCommand(params);
      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error) {
      getErrorMessage(error, 'SERVER_RESEND_CODE', true);
      throw error;
    }
  };

  signIn = async (username: string, password: string) => {
    console.log(username, password);
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: generateSecretHash(
          username,
          this.clientId,
          this.clientSecret
        ),
      },
    };

    try {
      // @ts-ignore
      const command = new InitiateAuthCommand(params);
      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error) {
      getErrorMessage(error, 'SERVER_SIGNIN', true);
      throw error;
    }
  };

  getUser = async (accessToken: string) => {
    const params = {
      AccessToken: accessToken,
    };

    try {
      const command = new GetUserCommand(params);
      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error) {
      getErrorMessage(error, 'SERVER_GET_USER', true);
      throw error;
    }
  };

  signOut = async (accessToken: string) => {
    const params = {
      AccessToken: accessToken,
    };

    try {
      const command = new GlobalSignOutCommand(params);
      await this.cognitoClient.send(command);
    } catch (error) {
      getErrorMessage(error, 'SERVER_SIGNOUT', true);
      throw error;
    }
  };
}

export const cognitoClient = new CognitoClient();
