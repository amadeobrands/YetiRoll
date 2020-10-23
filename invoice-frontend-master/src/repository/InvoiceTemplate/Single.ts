import { AxiosInstance } from 'axios'
import { InvoiceTemplateResource } from '@app/repository/_resource/InvoiceTemplate';
import { parseISO } from "date-fns";

import ItemCollection from './Item/Collection'
import ItemSingle from './Item/Single'

class Single {
    private readonly BASE: string = '/api/invoice-template/0'
    private http: AxiosInstance;
    private readonly invoiceTemplateId: number;

    constructor(http: AxiosInstance, invoiceTemplateId: number) {
        this.http = http;
        this.invoiceTemplateId = invoiceTemplateId;
        this.BASE = '/api/invoice-template/' + invoiceTemplateId
    }

    get = async (): Promise<InvoiceTemplateResource> => {
        const {data} = await this.http.get(this.BASE);

        return {
            ...data,
            created_at: parseISO(data.created_at),
            updated_at: parseISO(data.updated_at),
        };
    }

    items(): ItemCollection {
        return new ItemCollection(this.http, this.invoiceTemplateId)
    }

    item(id: number): ItemSingle {
        return new ItemSingle(this.http, this.invoiceTemplateId, id)
    }

}

export default Single;
