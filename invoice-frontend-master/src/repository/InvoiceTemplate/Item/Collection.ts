import { AxiosInstance } from 'axios'
import { InvoiceTemplateItemCreateInput } from '@app/repository/InvoiceTemplate/Item/input';
import { InvoiceTemplateItemResource } from '@app/repository/_resource/InvoiceTemplateItem';

class Collection {
    private BASE = '/api/invoice-template/0/item';
    private http: AxiosInstance;
    private invoiceTemplateId: number;

    constructor(http: AxiosInstance, invoiceTemplateId: number) {
        this.http = http
        this.invoiceTemplateId = invoiceTemplateId
        this.BASE = '/api/invoice-template/' + invoiceTemplateId + '/item'
    }

    create = async (input: InvoiceTemplateItemCreateInput): Promise<InvoiceTemplateItemResource> => {
        const {data} = await this.http.post(this.BASE, {
            name: input.name,
            quantity: input.quantity,
            price_per_unit: input.pricePerUnit
        })
        return data
    }
}

export default Collection;
