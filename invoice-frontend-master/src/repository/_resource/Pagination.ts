export interface PagedMeta {
    page: number;
    num_on_page: number;
    total: number;
}

export interface PagedResponse<T> {
    records: T[];
    pagination: PagedMeta
}
