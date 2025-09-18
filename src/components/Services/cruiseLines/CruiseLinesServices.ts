// CruiseLineService.ts
import type { IPagedData } from "../../../common/IPagedData";
import ApiUtility, { type IApiResponse } from "../../../utility/ApiUtility";

export interface CruiseLine {
  id?: string | null;
  code: string;
  name: string;
}

class CruiseLineService {
  private route = "/api/CruiseLines";

  getCruiseLines = (page: number, pageSize: number) =>
    ApiUtility.get<IPagedData<CruiseLine>>(`${this.route}?page=${page}&pageSize=${pageSize}`);

  addCruiseLine = (data: CruiseLine) =>
    ApiUtility.post<IApiResponse<CruiseLine>>(this.route, data);

  updateCruiseLine = (data: CruiseLine) =>
    ApiUtility.post<IApiResponse<CruiseLine>>(`${this.route}/update`, data);

  deleteCruiseLine = (id: string) =>
    ApiUtility.delete<IApiResponse<void>>(`${this.route}/${id}`);
}

export default new CruiseLineService();
