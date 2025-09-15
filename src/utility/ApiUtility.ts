import axios, { type AxiosResponse } from "axios";

export interface IApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface IApiListResult<T = any> {
  totalCount: number;
  items: T[];
}

class ApiUtility {
  private client = axios.create({
    baseURL: "https://localhost:5000",
    withCredentials: true, // ensures cookies sent for auth
  });

  // Raw GET (returns full Axios response)
  get = async <T>(url: string, params?: any): Promise<AxiosResponse<IApiResponse<T>>> => {
    return this.client.get(url, { params });
  };

  // GET and unwrap payload
  getResult = async <T>(url: string, params?: any): Promise<T> => {
    const res = await this.client.get<IApiResponse<T>>(url, { params });
    return res.data.data; // unwraps to data directly
  };

  // POST
  post = async <T>(url: string, body?: any): Promise<IApiResponse<T>> => {
    const res = await this.client.post<IApiResponse<T>>(url, body);
    return res.data;
  };

  // POST with form data
  postForm = async <T>(url: string, body: Record<string, any>): Promise<IApiResponse<T>> => {
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, value as any);
    });
    const res = await this.client.post<IApiResponse<T>>(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  };

  // File download
  downloadFile = async (url: string, params?: any) => {
    const res = await this.client.get(url, {
      params,
      responseType: "blob",
    });
    return res.data;
  };
}

export default new ApiUtility();
