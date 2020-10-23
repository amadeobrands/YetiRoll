import { AxiosInstance } from 'axios'
import { InvoiceItemCreateItem } from './input';
import { InvoiceItemResource } from '@app/repository/_resource/InvoiceItem';

class Collection {
    private BASE = '/api/invoice/0/item';
    private http: AxiosInstance;
    private invoiceTemplateId: number;

    constructor(http: AxiosInstance, invoiceId: number) {
        this.http = http
        this.invoiceTemplateId = invoiceId
        this.BASE = '/api/invoice/' + invoiceId + '/item'
    }

    create = async (input: InvoiceItemCreateItem): Promise<InvoiceItemResource> => {
        const {data} = await this.http.post(this.BASE, {
            name: input.name,
            quantity: input.quantity,
            price_per_unit: input.pricePerUnit
        })
        return data
    }
}

export default Collection;
