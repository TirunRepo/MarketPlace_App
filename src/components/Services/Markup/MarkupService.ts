import ApiUtility, { type IApiResponse } from "../../../utility/ApiUtility";

// DTO types
export interface IMarkupRequest {
  minMarkup?: number;
  maxMarkup?: number;
  minBaseFare?: number;
  maxBaseFare?: number;
  markupPercentage: number;
  supplierId?: number;
  sailingId?: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdBy?: string;
  createdOn?: string;
  updatedBy?: string;
  updatedOn?: string;
}

export interface IMarkupResponse {
  markupId: number;
  minMarkup?: number;
  maxMarkup?: number;
  minBaseFare?: number;
  maxBaseFare?: number;
  markupPercentage: number;
  supplierId?: number;
  sailingId?: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

class MarkupService {
  private route = "Markup";

  createMarkup = (data: IMarkupRequest) =>
    ApiUtility.post<IApiResponse<IMarkupResponse>>(`${this.route}`, data);

  updateMarkup = (data: IMarkupRequest) =>
    ApiUtility.put<IApiResponse<IMarkupResponse>>(`${this.route}`, data);

  getMarkup = (id: number) =>
    ApiUtility.get<IApiResponse<IMarkupResponse>>(`${this.route}/${id}`);

  getAllMarkups = () =>
    ApiUtility.get<IApiResponse<IMarkupResponse[]>>(`${this.route}`);

  deleteMarkup = (id: number) =>
    ApiUtility.delete<IApiResponse<string>>(`${this.route}/${id}`);

  calculateMarkup = (data: IMarkupRequest) =>
    ApiUtility.post<IApiResponse<number>>(`${this.route}/calculate-markup`, data);
}

export default new MarkupService();
