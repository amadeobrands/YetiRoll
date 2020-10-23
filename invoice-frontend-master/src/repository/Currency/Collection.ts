import { AxiosInstance } from 'axios'
import { CurrencyResource } from '@app/repository/_resource/Currency';

class Collection {

    private BASE = '/api/currency';

    private http: AxiosInstance;

    constructor(http: AxiosInstance) {
        this.http = http
    }

    get = async (): Promise<CurrencyResource[]> => {
        const {data} = await this.http.get(this.BASE);
        return data;
    }
}

export default Collection
