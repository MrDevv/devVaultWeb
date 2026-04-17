export interface APIResponse<T> {
    status: string;
    message: string;
    data: T
}