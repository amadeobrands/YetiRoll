import { createDomain } from 'effector';
import repository from '@app/repository';
import { InvoiceTemplateResource } from '@app/repository/_resource/InvoiceTemplate';

const domain = createDomain('invoice-template-single')

if (process.env.NODE_ENV === 'development') {
    import('effector-logger/attach').then((module) => module.attachLogger(domain));
}

export const $single = domain.createStore<InvoiceTemplateResource>(null)
export const fetchSingle = domain.createEffect<{ id: number }, InvoiceTemplateResource>({
    async handler({id}) {
        return await repository.invoiceTemplate(id).get()
    }
})
$single.on(fetchSingle.doneData, (_, data) => data)
