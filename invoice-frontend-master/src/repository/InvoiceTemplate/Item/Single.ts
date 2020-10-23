import { AxiosInstance } from 'axios'
import { InvoiceTemplateItemUpdateInput } from '@app/repository/InvoiceTemplate/Item/input';
import { InvoiceTemplateItemResource } from '@app/repository/_resource/InvoiceTemplateItem';

class Single {
    private readonly BASE: string = '/api/invoice-template/0/item/0'
    private http: AxiosInstance;
    private readonly invoiceTemplateId;
    private readonly invoiceTemplateItemId;

    constructor(
        http: AxiosInstance,
        invoiceTemplateId: number,
        invoiceTemplateItemId: number
    ) {
        this.http = http
        this.invoiceTemplateId = invoiceTemplateId
        this.invoiceTemplateItemId = invoiceTemplateItemId
        this.BASE = '/api/invoice-template/' + invoiceTemplateId + '/item/' + invoiceTemplateItemId
    }

    update = async (input: InvoiceTemplateItemUpdateInput): Promise<InvoiceTemplateItemResource> => {
        const {data} = await this.http.put(this.BASE, {
            name: input.name,
            quantity: input.quantity,
            price_per_unit: input.pricePerUnit
        })
        return data;
    }

    delete = async (): Promise<void> => {
        await this.http.delete(this.BASE)
    }
}

export default Single;
