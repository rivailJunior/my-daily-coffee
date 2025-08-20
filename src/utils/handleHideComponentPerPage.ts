export const handleHideComponentPerPage = (pathname: string) => {
  if (
    pathname.includes('/login') ||
    pathname.includes('/signup') ||
    pathname.includes('/confirm-signup')
  ) {
    return true;
  }
  return false;
};
