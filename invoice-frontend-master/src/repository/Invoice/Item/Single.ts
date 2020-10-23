import { AxiosInstance } from 'axios'
import { InvoiceItemUpdateInput } from './input';
import { InvoiceItemResource } from '@app/repository/_resource/InvoiceItem';
import ItemCollection from '@app/repository/InvoiceTemplate/Item/Collection';
import ItemSingle from '@app/repository/InvoiceTemplate/Item/Single';

class Single {
    private readonly BASE: string = '/api/invoice/0/item/0'
    private http: AxiosInstance;
    private readonly invoiceId;
    private readonly invoiceItemId;

    constructor(
        http: AxiosInstance,
        invoiceTemplateId: number,
        invoiceTemplateItemId: number
    ) {
        this.http = http
        this.invoiceId = invoiceTemplateId
        this.invoiceItemId = invoiceTemplateItemId
        this.BASE = '/api/invoice/' + invoiceTemplateId + '/item/' + invoiceTemplateItemId
    }

    update = async (input: InvoiceItemUpdateInput): Promise<InvoiceItemResource> => {
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

    items(): ItemCollection {
        return new ItemCollection(this.http, this.invoiceId)
    }

    item(id: number): ItemSingle {
        return new ItemSingle(this.http, this.invoiceId, id)
    }
}

export default Single;
