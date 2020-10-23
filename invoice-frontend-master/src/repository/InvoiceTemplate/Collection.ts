import { AxiosInstance } from 'axios';
import { parseISO } from 'date-fns'
import { PagedResponse } from '@app/repository/_resource/Pagination';
import { InvoiceTemplateListItemResource, InvoiceTemplateResource } from '@app/repository/_resource/InvoiceTemplate';
import { InvoiceTemplateCreateInput } from '@app/repository/InvoiceTemplate/input';

class Collection {
    private BASE = '/api/invoice-template';
    private http: AxiosInstance;

    constructor(http: AxiosInstance) {
        this.http = http;
    }

    get = async (page: number = 1, numOnPage: number = 15): Promise<PagedResponse<InvoiceTemplateListItemResource>> => {
        const {data} = await this.http.get(this.BASE + `?page=${page}&num_on_page=${numOnPage}`)

        return {
            records: data.records.map(item => ({
                ...item,
                created_at: parseISO(item.created_at),
                updated_at: parseISO(item.updated_at),
            })),
            pagination: {
                ...data.pagination
            }
        };
    }

    create = async (input: InvoiceTemplateCreateInput): Promise<InvoiceTemplateResource> => {
        const {data} = await this.http.post(this.BASE, {
            recipient_id: input.recipientId,
            currency_id: input.currencyId,
            title: input.title
        })

        return {
            ...data,
            created_at: parseISO(data.created_at),
            updated_at: parseISO(data.updated_at),
        };
    }
}

export default Collection;
