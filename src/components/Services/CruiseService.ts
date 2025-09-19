import ApiUtility, { type IApiResponse } from "../../utility/ApiUtility";

// ----------------------------
// Frontend models
// ----------------------------
export interface ICabinDetails {
  cabinNo: string;
  cabinType: "GTY" | "Manual";
  cabinOccupancy: "Available" | "Occupied";
  singleRate?: number | null;
  doubleRate?: number | null;
  tripleRate?: number | null;
  nccf?: number | null;
  tax?: number | null;
  grats?: number | null;
}

export interface ICruiseInventory {
  id?: number | null;
  sailDate: string;
  groupId: string;
  nights: string;
  packageName: string;
  destinationId: string;       // ✅ consistent: destinationId
  departurePortId: string;     // ✅ consistent: departurePortId
  cruiseLineId: number;
  shipId: number;
  shipCode: string;
  categoryId: string;
  stateroom: string;
  cabinOccupancy: string;
  pricingType: "Net" | "Commissionable" | "";
  commissionPercentage: number | null;
  singleRate: number | null;
  doubleRate: number | null;
  tripleRate: number | null;
  nccf: number | null;
  tax: number | null;
  grats: number | null;
  enableAgent: boolean;
  enableAdmin: boolean;
  cruiseShip?: ICruiseShip | null;
  cabins: ICabinDetails[];
  currency:string
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

// ----------------------------
// API DTO types
// ----------------------------
export interface IDestination { destinationCode: string; destinationName: string; }
export interface IPort { departurePortId: string; departurePortName: string; }
export interface IShip { cruiseShipId: string; shipName: string; }
export interface ICruiseLineApi { cruiseLineId: string; cruiseLineName: string; }

// ----------------------------
// Service
// ----------------------------
class CruiseService {
  private route = "CruiseInventories";

  getDestinations = () => ApiUtility.get<IDestination[]>(`${this.route}/destinations`);
  getCruiseLines = () => ApiUtility.get<ICruiseLineApi[]>(`${this.route}/cruiselines`);
  getPorts = (destinationCode: string) => ApiUtility.get<IPort[]>(`${this.route}/departures-by-destination/${destinationCode}`);
  getShips = (cruiseLineId: string | number) => ApiUtility.get<IShip[]>(`${this.route}/ships-by-cruiseline/${cruiseLineId}`);

  saveCruiseInventory = (data: ICruiseInventory) => {
    const payload: any = {
      CruiseInventoryDto: {
        CruiseInventoryId: data.id ? Number(data.id) : undefined,
        SailDate: data.sailDate,
        GroupId: data.groupId,
        PackageDescription: data.packageName,
        Nights: Number(data.nights || 0),
        CategoryId: data.categoryId,
        CruiseShip: data.cruiseShip
          ? {
              CruiseShipId: Number(data.cruiseShip.cruiseShipId || 0),
              ShipName: data.cruiseShip.shipName || "",
              ShipCode: data.cruiseShip.shipCode || "",
              CruiseLine: {
                CruiseLineId: Number(data.cruiseShip.cruiseLine?.cruiseLineId || 0),
                CruiseLineName: data.cruiseShip.cruiseLine?.cruiseLineName ?? "",
                CruiseLineCode: data.cruiseShip.cruiseLine?.cruiseLineCode ?? "",
              },
            }
          : null,
        Destination: { DestinationCode: data.destinationId },
        DeparturePort: { DeparturePortId: Number(data.departurePortId || 0) },
      },
      CruisePricingInventoryDto: {
        CabinOccupancy: data.cabinOccupancy,
        CabinNoType: data.stateroom,
        PricingType: data.pricingType,
        CommissionPercentage: data.commissionPercentage,
        SinglePrice: data.singleRate,
        DoublePrice: data.doubleRate,
        ThreeFourthPrice: data.tripleRate,
        NCCF: data.nccf,
        Tax: data.tax,
        Grats: data.grats,
        PriceValidFrom: new Date().toISOString(),
        PriceValidTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        EnableAgent: data.enableAgent,
        EnableAdmin: data.enableAdmin,
      },
      Cabins: (data.cabins || []).map((c) => ({
        CabinNo: c.cabinNo,
        CabinOccupancy: c.cabinOccupancy,
        Type: c.cabinType,
        SinglePrice: c.singleRate,
        DoublePrice: c.doubleRate,
        ThreeFourthPrice: c.tripleRate,
        NCCF: c.nccf,
        Tax: c.tax,
        Grats: c.grats,
      })),
    };

    return ApiUtility.post<IApiResponse<void>>(`${this.route}`, payload);
  };
}

export default new CruiseService();
