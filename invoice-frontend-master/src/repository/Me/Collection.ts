import { AxiosInstance } from 'axios'
import { UserResource } from '../_resource/User';

class Collection {

    private BASE = '/api/me';

    private http: AxiosInstance;

    constructor(http: AxiosInstance) {
        this.http = http
    }

    get = async (): Promise<UserResource> => {
        const {data} = await this.http.get(this.BASE);
        return data;
    }
}

export default Collection
