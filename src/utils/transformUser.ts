interface UserAttribute {
  Name: string;
  Value: string;
}

interface TransformedUser {
  email: string;
  verified: boolean;
  sub: string;
}

export const transformUserAttributes = (
  attributes: UserAttribute[]
): TransformedUser => {
  const result: Partial<TransformedUser> = {};

  attributes.forEach((attr) => {
    switch (attr.Name) {
      case 'email':
        result.email = attr.Value;
        break;
      case 'email_verified':
        result.verified = attr.Value === 'true';
        break;
      case 'sub':
        result.sub = attr.Value;
        break;
    }
  });

  return result as TransformedUser;
};
