import { AxiosInstance } from 'axios'
import { RecipientResource } from '@app/repository/_resource/Recipient';
import { parseISO } from 'date-fns'
import { RecipientUpdateInput } from '@app/repository/Recipient/input';

class Single {
    private readonly BASE: string = 'api/participant/0'
    private http: AxiosInstance
    private readonly recipientId: number;

    constructor(http: AxiosInstance, recipientId: number) {
        this.http = http
        this.recipientId = recipientId

        this.BASE = '/api/recipient/' + recipientId
    }

    get = async (): Promise<RecipientResource> => {
        const {data} = await this.http.get(this.BASE)

        return {
            ...data,
            created_at: parseISO(data.created_at),
            updated_at: parseISO(data.updated_at)
        };
    }

    update = async (input: RecipientUpdateInput): Promise<RecipientResource> => {
        const {data} = await this.http.put(this.BASE, {
            name: input.name,
            email: input.email,
            address_first_line: input.addressFirstLine,
            address_second_line: input.addressSecondLine,
            country_iso_code: input.countryIsoCode
        });

        return {
            ...data,
            created_at: parseISO(data.created_at),
            updated_at: parseISO(data.updated_at)
        };
    }
}

export default Single;
