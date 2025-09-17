// CruiseLineService.ts
import ApiUtility, { type IApiResponse } from "../../../utility/ApiUtility";

export interface CruiseLineDto {
  cruiseLineId?: string | null;
  cruiseLineCode: string;
  cruiseLineName: string;
}

export interface IPagedData<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

class CruiseLineService {
  private route = "/api/CruiseLines";

  getCruiseLines = (page: number, pageSize: number) =>
    ApiUtility.get<IPagedData<CruiseLineDto>>(`${this.route}?page=${page}&pageSize=${pageSize}`);

  addCruiseLine = (data: CruiseLineDto) =>
    ApiUtility.post<IApiResponse<CruiseLineDto>>(this.route, data);

  updateCruiseLine = (data: CruiseLineDto) =>
    ApiUtility.post<IApiResponse<CruiseLineDto>>(`${this.route}/update`, data);

  deleteCruiseLine = (id: string) =>
    ApiUtility.delete<IApiResponse<void>>(`${this.route}/${id}`);
}

export default new CruiseLineService();
