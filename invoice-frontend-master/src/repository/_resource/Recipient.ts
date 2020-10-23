export interface RecipientResource {
    id: number;
    created_at: Date;
    updated_at: Date;
    name: string;
    email: string;
    address_first_line: string;
    address_second_line: string;
    country_iso_code: string;
}

export interface RecipientListItemResource {
    id: number;
    created_at: Date;
    updated_at: Date;
    name: string;
    email: string;
}
