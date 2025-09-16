import type { IPagedData } from "../../../common/IPagedData";
import ApiUtility, { type IApiResponse } from "../../../utility/ApiUtility";

export interface DestinationDto {
    destinationCode: string;
    destinationName: string;
}

class CruiseDestinationService {
    private route = "/api/CruiseDestinations";

    getAll = (page: number, pageSize: number) => 
        ApiUtility.get<IPagedData<DestinationDto>>(`${this.route}?page=${page}&pageSize=${pageSize}`);
    add = (data: DestinationDto) => ApiUtility.post<IApiResponse<DestinationDto>>(this.route, data);
    update = (data: DestinationDto) => ApiUtility.post<IApiResponse<DestinationDto>>(`${this.route}/update`, data);
    delete = (code: string) => ApiUtility.delete<IApiResponse<void>>(`${this.route}/${code}`);
}

export default new CruiseDestinationService();
