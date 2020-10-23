import { AxiosInstance } from 'axios'
import { parseISO } from 'date-fns'
import { PagedResponse } from '@app/repository/_resource/Pagination';
import { RecipientListItemResource, RecipientResource } from '@app/repository/_resource/Recipient';
import { RecipientCreateInput } from '@app/repository/Recipient/input';

class Collection {
    private BASE = '/api/recipient';

    private http: AxiosInstance;

    constructor(http: AxiosInstance) {
        this.http = http
    }

    get = async (page: number = 1, numOnPage = 15): Promise<PagedResponse<RecipientListItemResource>> => {
        const {data} = await this.http.get(this.BASE + `?page=${page}&num_on_page=${numOnPage}`);

        return {
            records: data.records.map(item => ({
                ...item,
                created_at: parseISO(item.created_at),
                updated_at: parseISO(item.updated_at)
            })),
            pagination: {
                ...data.pagination
            }
        };
    }

    create = async (input: RecipientCreateInput): Promise<RecipientResource> => {
        const {data} = await this.http.post(this.BASE, {
            name: input.name
        })

        return {
            ...data,
            created_at: parseISO(data.created_at),
            updated_at: parseISO(data.updated_at)
        }
    }
}

export default Collection;
