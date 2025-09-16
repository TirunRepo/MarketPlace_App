// ShipService.ts
import type { IPagedData } from "../../../common/IPagedData";
import ApiUtility, { type IApiResponse } from "../../../utility/ApiUtility";

export interface CruiseLineDto {
  cruiseLineId?: string;
  cruiseLineCode: string;
  cruiseLineName: string;
}

export interface ShipDto {
  cruiseShipId?: number;
  shipCode: string;
  shipName: string;
  cruiseLineId?: string;
  cruiseLine?: CruiseLineDto;
}



class CruiseShipsService {
  private route = "/api/CruiseShips";

  getShips = (page: number, pageSize: number) =>
    ApiUtility.get<IPagedData<ShipDto>>(`${this.route}?page=${page}&pageSize=${pageSize}`);

  getCruiseLines = () =>
    ApiUtility.get<CruiseLineDto[]>(`${this.route}/CruiseLine`);

  addShip = (data: ShipDto) =>
    ApiUtility.post<IApiResponse<ShipDto>>(this.route, data);

  updateShip = (data: ShipDto) =>
    ApiUtility.post<IApiResponse<ShipDto>>(`${this.route}/update`, data);

  deleteShip = (id: number) =>
    ApiUtility.delete<IApiResponse<void>>(`${this.route}/${id}`);
}

export default new CruiseShipsService();
