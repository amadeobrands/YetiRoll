export interface InvoiceCreateInput {
    title: string;
    currencyId: number;
}

export interface InvoiceUpdateInput {
    title: string|null;
    localId: string|null;
    dueDate: Date|null;
    authorName: string|null;
    authorAddressFirstLine: string|null;
    authorAddressSecondLine: string|null;
    authorCountryIsoCode: string|null;
    recipientName: string|null;
    recipientAddressFirstLine: string|null;
    recipientAddressSecondLine: string|null;
    recipientCountryIsoCode: string|null;
    note: string|null;
    terms: string|null;
}
