import type { IPagedData } from "../../../common/IPagedData";
import ApiUtility, { type IApiResponse } from "../../../utility/ApiUtility";

export interface DeparturePortDto {
    departurePortId?: string;
    departurePortCode: string;
    departurePortName: string;
    destinationCode: string;
    createdAt?: string;
    createdBy?: string;
    lastModifiedOn?: string;
    lastModifiedBy?: string;
}

export interface DestinationDto {
    destinationCode: string;
    destinationName: string;
}

class DeparturePortService {
    private route = "/api/CruiseDeparturePorts";

    // Get all departure ports (optionally with paging)
    getAll = (page?: number, pageSize?: number) =>
        ApiUtility.get<IPagedData<DeparturePortDto>>(
            page && pageSize ? `${this.route}?page=${page}&pageSize=${pageSize}` : this.route
        );


    // Add a new departure port
    add = (data: DeparturePortDto) =>
        ApiUtility.post<IApiResponse<DeparturePortDto>>(this.route, data);

    // Update an existing departure port
    update = (data: DeparturePortDto) =>
        ApiUtility.post<IApiResponse<DeparturePortDto>>(`${this.route}/update`, data);

    // Delete a departure port
    delete = (id: string) =>
        ApiUtility.delete<IApiResponse<void>>(`${this.route}/${id}`);

    // Get all destinations
    getAllDestinations = () =>
        ApiUtility.get<DestinationDto[]>(`${this.route}/destination`);
}

export default new DeparturePortService();
