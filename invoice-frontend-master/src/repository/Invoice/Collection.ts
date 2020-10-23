import { AxiosInstance } from 'axios'
import { parseISO } from 'date-fns'
import { PagedResponse } from '@app/repository/_resource/Pagination';
import { InvoiceListItemResource, InvoiceResource } from '@app/repository/_resource/Invoice';
import { InvoiceCreateInput } from './input';

class Collection {

    private BASE = '/api/invoice';

    private http: AxiosInstance;

    constructor(http: AxiosInstance) {
        this.http = http
    }

    get = async (page: number = 1, numOnPage: number = 15): Promise<PagedResponse<InvoiceListItemResource>> => {
        const {data} = await this.http.get(this.BASE + `?page=${page}&num_on_page=${numOnPage}`);

        return {
            records: data.records.map(item => ({
                ...item,
                created_at: parseISO(item.created_at),
                updated_at: parseISO(item.updated_at),
                finalized_at: item.finalized_at !== null ? parseISO(item.finalized_at) : null
            })),
            pagination: {
                ...data.pagination
            }
        };
    }

    createFromTemplate = async (input: number): Promise<InvoiceResource> => {
        const { data } = await this.http.post(this.BASE + '/from-template/' + input);
        return {
            ...data,
            created_at: parseISO(data.created_at),
            updated_at: parseISO(data.updated_at),
            deleted_at: data.deleted_at ? parseISO(data.deleted_at) : null,
            finalized_at: data.finalized_at ? parseISO(data.finalized_at) : null,
        };
    }

    create = async (input: InvoiceCreateInput): Promise<InvoiceResource> => {
        try {
            const {data} = await this.http.post(this.BASE, {
                title: input.title,
                currency_id: input.currencyId
            })

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

}

export default Collection
