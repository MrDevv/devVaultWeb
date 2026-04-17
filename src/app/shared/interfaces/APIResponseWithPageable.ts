import { Pageable } from "./APIPageable";
import { APIResponse } from "./APIResponse";

export interface APIResponseWithPageable<T> {
    data: APIResponse<T>;
    pageable: Pageable
}