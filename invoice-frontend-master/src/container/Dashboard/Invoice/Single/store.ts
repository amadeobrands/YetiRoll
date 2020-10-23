import { createDomain } from 'effector';
import { InvoiceResource } from '@app/repository/_resource/Invoice';
import repository from '@app/repository';

const domain = createDomain('invoice-single')

if (process.env.NODE_ENV === 'development') {
    import('effector-logger/attach').then((module) => module.attachLogger(domain));
}

export const $single = domain.createStore<InvoiceResource>(null)
export const fetchSingle = domain.createEffect<{ id: number }, InvoiceResource>({
    async handler({id}) {
        return await repository.invoice(id).get()
    }
})
$single.on(fetchSingle.doneData, (_, data) => data)
