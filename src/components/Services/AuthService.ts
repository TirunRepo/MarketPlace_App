import ApiUtility, { type IApiResponse } from "../../utility/ApiUtility";

export interface IAuthUser {
  id: string;
  email: string;
  fullname: string;
  role: string;
}

export interface IRegisterUser {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
  companyName: string;
  country: string;
  state: string;
  city: string;
}

class AuthService {
  private route = "/auth";

  login = (data: { userName: string; password: string }) =>
    ApiUtility.post<IApiResponse<any>>(`${this.route}/login`, data);

  logout = () =>
    ApiUtility.post<IApiResponse<any>>(`${this.route}/logout`, {});

  check = () =>
    ApiUtility.getResult<IAuthUser>(`${this.route}/check`);

 register = (data: any) => ApiUtility.post<IApiResponse<any>>(`${this.route}/register`, data);
}

export default new AuthService();
