export interface Pageable {
    numberPage: number;
    lastPage: boolean;
    firstPage: boolean;
    totalPage: number;
    totalElements: number;
    offset: number
}