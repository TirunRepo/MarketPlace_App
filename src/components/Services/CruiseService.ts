import ApiUtility, { type IApiResponse } from "../../utility/ApiUtility";
// CruiseTypes.ts

// Cabin row structure used in the form
export interface ICabinRow {
  cabinType: string;
  cabinNo: string;
  status: string;
  singlePrice: number;
  doublePrice: number;
  threeFourthPrice: number;
  nccf: number;
  tax: number;
  grats: number;
}

// Cruise Inventory structure
export interface ICruiseInventory {
  sailDate: string;
  groupId: string;
  nights: string;
  packageName: string;
  destination: string;
  cruiseLine: string;
  departurePort: string;
  shipName: string;
  shipCode: string;
  categoryId: string;
  stateroomType: string;
  cabinOccupancy: string;
  cabins: ICabinRow[];
  currency: string;
}

// Dropdown Types
export interface IDestination {
  id: string;
  name: string;
}

export interface IPort {
  id: string;
  name: string;
  destinationId: string;
}

export interface ICruiseLine {
  id: string;
  name: string;
}

export interface IShip {
  id: string;
  name: string;
  cruiseLineId: string;
}

// Search + Generic Cruise
export interface ICruise {
  id: string;
  destination: string;
  departurePort: string;
  fromDate: string;
  toDate: string;
  cruiseLine: string;
  ship: string;
  duration: number;
  price: number;
}

export interface ICruiseSearchParams {
  destination?: string;
  departurePort?: string;
  from?: string;
  to?: string;
  cruiseLine?: string;
  ship?: string;
  duration?: number;
}

class CruiseService {
  private route = "/cruise";

  search = (params: ICruiseSearchParams) =>
    ApiUtility.getResult<ICruise[]>(`${this.route}/search`, params);

  getById = (id: string) =>
    ApiUtility.getResult<ICruise>(`${this.route}/${id}`);

  create = (data: ICruise) =>
    ApiUtility.post<IApiResponse<ICruise>>(`${this.route}`, data);

  update = (id: string, data: Partial<ICruise>) =>
    ApiUtility.post<IApiResponse<ICruise>>(`${this.route}/${id}`, data);

  delete = (id: string) =>
    ApiUtility.post<IApiResponse<void>>(`${this.route}/${id}/delete`, {});

  // Inventory Management
  getDestinations = () =>
    ApiUtility.getResult<IDestination[]>(`${this.route}/destinations`);

  getPorts = (destinationId: string) =>
    ApiUtility.getResult<IPort[]>(`${this.route}/ports`, { destinationId });

  getCruiseLines = () =>
    ApiUtility.getResult<ICruiseLine[]>(`${this.route}/cruise-lines`);

  getShips = (cruiseLineId: string) =>
    ApiUtility.getResult<IShip[]>(`${this.route}/ships`, { cruiseLineId });

  saveCruiseInventory = (data: ICruiseInventory) =>
    ApiUtility.post<IApiResponse<void>>(`${this.route}/inventory`, data);
}

export default new CruiseService();
