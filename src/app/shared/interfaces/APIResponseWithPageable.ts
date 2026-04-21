import { Pageable } from "./APIPageable";

export interface APIResponseWithPageable<T> {
    content: T[];
    pageable: Pageable
}