import { base_url } from "src/app/constant";

const jwtServiceConfig = {
  signIn: base_url + '/auth/sign-in',
  signUp: 'api/auth/sign-up',
  accessToken: base_url + '/auth/access-token',
  updateUser: 'api/auth/user/update',
};

export default jwtServiceConfig;
