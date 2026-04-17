
export interface ErrorAPIResponse {
    status: string,
    code: number,
    url: string,
    method: string,
    message: string,
    backend_message: string,
    timestamp: string
}