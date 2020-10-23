import { AxiosInstance } from 'axios'
import { parseISO } from 'date-fns'
import { InvoiceResource } from '@app/repository/_resource/Invoice';
import { InvoiceUpdateInput } from '@app/repository/Invoice/input';

import ItemCollection from './Item/Collection'
import ItemSingle from './Item/Single'

class Single {

    private readonly BASE: string = '/api/invoice/0';

    private http: AxiosInstance;

    private readonly invoiceId: number;

    constructor(http: AxiosInstance, invoiceId: number) {
        this.http = http
        this.invoiceId = invoiceId

        this.BASE = '/api/invoice/' + invoiceId
    }

    get = async (): Promise<InvoiceResource> => {
        try {
            const {data} = await this.http.get(this.BASE);

            return {
                ...data,
                created_at: parseISO(data.created_at),
                updated_at: parseISO(data.updated_at),
                deleted_at: data.deleted_at ? parseISO(data.deleted_at) : null,
                finalized_at: data.finalized_at ? parseISO(data.finalized_at) : null,
            };
        } catch (e) {
            console.log(e)
        }
    }

    update = async (input: InvoiceUpdateInput): Promise<InvoiceResource> => {
        const {data} = await this.http.put(this.BASE, {
            title: input.title || null,
            local_id: input.localId || null,
            due_date: input.dueDate ? input.dueDate.toISOString() : null,
            author_name: input.authorName || null,
            author_address_first_line: input.authorAddressFirstLine || null,
            author_address_second_line: input.authorAddressSecondLine || null,
            author_country_iso_code: input.authorCountryIsoCode || null,
            recipient_name: input.recipientName || null,
            recipient_address_first_line: input.recipientAddressFirstLine || null,
            recipient_address_second_line: input.recipientAddressSecondLine || null,
            recipient_country_iso_code: input.recipientCountryIsoCode || null,
            note: input.note || null,
            terms: input.terms || null,
        })

        return {
            ...data,
            created_at: parseISO(data.created_at),
            updated_at: parseISO(data.updated_at),
            deleted_at: data.deleted_at ? parseISO(data.deleted_at) : null,
            finalized_at: data.finalized_at ? parseISO(data.finalized_at) : null,
        };
    }

    items(): ItemCollection {
        return new ItemCollection(this.http, this.invoiceId)
    }

    item(id: number): ItemSingle {
        return new ItemSingle(this.http, this.invoiceId, id)
    }

}

export default Single
