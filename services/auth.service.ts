import { decodedToken } from "@/utils/jwt";


export const getUserInfo = (accessToken: string) => {

  const userInfo = accessToken ? decodedToken(accessToken) : null;
  return userInfo;
};

// export const isLoggedIn = () => {
//   const authToken = getLocalStorage(authKey);
//   if (authToken) {
//     return !!authToken;
//   } else return false;
// };
