export interface RecipientCreateInput {
    name: string;
}

export interface RecipientUpdateInput {
    name: string | null;
    email: string | null;
    addressFirstLine: string | null;
    addressSecondLine: string | null;
    countryIsoCode: string | null;
}
