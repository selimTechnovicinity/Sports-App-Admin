import { jwtDecode } from "jwt-decode";

export const decodedToken = (token: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decoded: any = jwtDecode(token);
  return {
    ...decoded,
    role: decoded?.role?.toLowerCase(),
  };
};
