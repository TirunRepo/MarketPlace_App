import ApiUtility, { type IApiResponse } from "../../utility/ApiUtility";

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

export interface ICruiseInventory {
  sailDate: string;
  groupId: string;
  nights: string;
  packageName: string;
  destination: string;       // destination id
  departurePort: string;     // departure port id
  cruiseLine: string;        // cruise line id
  shipName: string;          // ship id
  shipCode: string;
  categoryId: string;
  stateroomType: string;
  cabinOccupancy: string;
  cabins: ICabinRow[];
  currency: string;
  pricingType: string;
  commissionPercentage: number | null;
  singlePrice: number;
  doublePrice: number;
  threeFourthPrice: number;
  nccf: number;
  tax: number;
  grats: number;
}

export interface IDestination { destinationCode: string; destinationName: string; }
export interface IPort { departurePortId: string; departurePortName: string; }
export interface ICruiseLine { cruiseLineId: string; cruiseLineName: string; }
export interface IShip { cruiseShipId: string; shipName: string; }

class CruiseService {
  private route = "/api/CruiseInventories";

  getDestinations = () =>
    ApiUtility.get<IDestination[]>(`${this.route}/destinations`);
  getCruiseLine = () =>
    ApiUtility.get<ICruiseLine[]>(`${this.route}/cruiselines`);

  getPorts = (destinationId: string) =>
    ApiUtility.get<IPort[]>(`${this.route}/departures-by-destination/${destinationId}`);

  getCruiseLinesByPort = (departurePortId: string) =>
    ApiUtility.get<ICruiseLine[]>(`${this.route}/cruise-lines-by-port/${departurePortId}`);

  getShips = (cruiseLineId: string) =>
    ApiUtility.get<IShip[]>(`${this.route}/ships-by-cruiseline/${cruiseLineId}`);

  saveCruiseInventory = (data: ICruiseInventory) =>
    ApiUtility.post<IApiResponse<void>>(`${this.route}/add-cabins`, data);
}

export default new CruiseService();
