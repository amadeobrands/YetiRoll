import { AxiosInstance } from 'axios'
import { SessionCreateInput, SessionRefreshInput } from './input';
import { parseISO } from 'date-fns'
import { SessionResource } from '@app/repository/_resource/Session';

class Collection {

    private BASE = '/api/session';

    private http: AxiosInstance;

    constructor(http: AxiosInstance) {
        this.http = http
    }

    create = async (input: SessionCreateInput): Promise<SessionResource> => {
        const {data} = await this.http.post(this.BASE, {
            email: input.email,
            password: input.password
        })
        return {
            ...data,
            generated_at: parseISO(data.generated_at)
        }
    }

    refresh = async (input: SessionRefreshInput): Promise<SessionResource> => {
        const {data} = await this.http.post(this.BASE + '/refresh', {
            refresh_token: input.refreshToken
        })
        return data
    }
}

export default Collection
