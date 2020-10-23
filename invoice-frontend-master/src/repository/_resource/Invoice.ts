import { UserResource } from './User';
import { CurrencyResource } from '@app/repository/_resource/Currency';
import { InvoiceItemResource } from '@app/repository/_resource/InvoiceItem';

export interface InvoiceResource {
    id: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date|null;
    finalized_at: Date|null;
    user: UserResource;
    title: string;
    currency: CurrencyResource;
    local_id: string;
    due_date: Date|null;
    author_name: string;
    author_address_first_line: string;
    author_address_second_line: string;
    author_country_iso_code: string;
    recipient_name: string;
    recipient_address_first_line: string;
    recipient_address_second_line: string;
    recipient_country_iso_code: string;
    note: string;
    terms: string;
    items: InvoiceItemResource[];
}

export interface InvoiceListItemResource {
    id: number;
    created_at: Date;
    updated_at: Date;
    finalized_at: Date|null;
    title: string;
    currency: CurrencyResource;
    local_id: string;
}
