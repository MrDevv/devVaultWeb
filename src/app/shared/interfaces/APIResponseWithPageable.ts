import { Pageable } from "./APIPageable";

export interface APIResponseWithPageable<T> {
    content: T[];
    pageableData: Pageable
}