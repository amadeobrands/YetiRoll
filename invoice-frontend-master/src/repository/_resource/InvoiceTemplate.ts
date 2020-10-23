import { RecipientListItemResource } from '@app/repository/_resource/Recipient';
import { CurrencyResource } from '@app/repository/_resource/Currency';

export interface InvoiceTemplateListItemResource {
    id: number;
    created_at: Date;
    updated_at: Date;
    title: string;
    recipient: RecipientListItemResource;
    currency: CurrencyResource;
}

export interface InvoiceTemplateResource {
    id: number;
    created_at: Date;
    updated_at: Date;
    title: string;
    recipient: RecipientListItemResource;
    currency: CurrencyResource;
    items: InvoiceTemplateItemResource[]
}
