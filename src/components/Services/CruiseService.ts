import ApiUtility, { type IApiResponse } from "../../utility/ApiUtility";

// Frontend models
export interface ICruiseInventory {
  cruiseInventoryId?: number | string | undefined;
  sailDate: string;
  groupId: string;
  nights: string | number;
  packageName: string;
  destination: string;   // destination code
  departurePort: string; // departure port id
  cruiseShip?: ICruiseShip | undefined;
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
  enableAgent: boolean;
  enableAdmin: boolean;
}

export interface ICruiseShip {
  cruiseShipId: string;
  shipName: string;
  shipCode: string;
  cruiseLine: ICruiseLine;
}

export interface ICruiseLine {
  cruiseLineId: string;
  cruiseLineCode?: string;
  cruiseLineName: string;
}

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

// API DTO types
export interface IDestination { destinationCode: string; destinationName: string; }
export interface IPort { departurePortId: string; departurePortName: string; }
export interface IShip { cruiseShipId: string; shipName: string; }
export interface ICruiseLineApi { cruiseLineId: string; cruiseLineName: string; }

class CruiseService {
  private route = "/api/CruiseInventories";

  getDestinations = () => ApiUtility.get<IDestination[]>(`${this.route}/destinations`);
  getCruiseLines = () => ApiUtility.get<ICruiseLineApi[]>(`${this.route}/cruiselines`);
  getPorts = (destinationCode: string) => ApiUtility.get<IPort[]>(`${this.route}/departures-by-destination/${destinationCode}`);
  getShips = (cruiseLineId: string | number) => ApiUtility.get<IShip[]>(`${this.route}/ships-by-cruiseline/${cruiseLineId}`);

  saveCruiseInventory = (data: ICruiseInventory) => {
    const payload: any = {
      CruiseInventoryDto: {
        SailDate: data.sailDate,
        GroupId: data.groupId,
        PackageDescription: data.packageName,
        Nights: Number(data.nights || 0),
        CategoryId: data.categoryId,
        CruiseShip: data.cruiseShip ? {
          CruiseShipId: Number(data.cruiseShip.cruiseShipId || 0),
          ShipName: data.cruiseShip.shipName || "",
          ShipCode: data.cruiseShip.shipCode || "",
          CruiseLine: {
            CruiseLineId: Number(data.cruiseShip.cruiseLine?.cruiseLineId || 0),
            CruiseLineName: data.cruiseShip.cruiseLine?.cruiseLineName ?? "",
            CruiseLineCode: data.cruiseShip.cruiseLine?.cruiseLineCode ?? ""
          }
        } : null,
        Destination: { DestinationCode: data.destination },
        DeparturePort: { DeparturePortId: Number(data.departurePort || 0) }
      },
      CruisePricingInventoryDto: {
        CabinOccupancy: data.cabinOccupancy,
        CabinNoType: data.stateroomType
      },
      SinglePrice: data.singlePrice,
      DoublePrice: data.doublePrice,
      ThreeFourthPrice: data.threeFourthPrice,
      NCCF: data.nccf,
      Tax: data.tax,
      Grats: data.grats,
      CabinCategory: data.stateroomType,
      Category: data.categoryId,
      PriceValidFrom: new Date().toISOString(),
      PriceValidTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      EnableAgent: data.enableAgent,
      EnableAdmin: data.enableAdmin,
      Cabins: (data.cabins || []).map(c => ({
        CabinNo: c.cabinNo,
        Status: c.status,
        Type: c.cabinType,
        SinglePrice: c.singlePrice,
        DoublePrice: c.doublePrice,
        ThreeFourthPrice: c.threeFourthPrice,
        NCCF: c.nccf,
        Tax: c.tax,
        Grats: c.grats
      }))
    };

    // if editing existing inventory, include id where backend expects it
    if (data.cruiseInventoryId) {
      payload.CruiseInventoryDto.CruiseInventoryId = Number(data.cruiseInventoryId);
    }

    return ApiUtility.post<IApiResponse<void>>(`${this.route}`, payload);
  };
}

export default new CruiseService();
