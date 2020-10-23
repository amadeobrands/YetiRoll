export interface InvoiceItemCreateItem {
    name: string;
    quantity: number;
    pricePerUnit: number;
}

export interface InvoiceItemUpdateInput {
    name: string;
    quantity: number;
    pricePerUnit: number;
}
