import { createDomain } from 'effector';
import { InvoiceListItemResource } from '@app/repository/_resource/Invoice';
import { PagedResponse } from '@app/repository/_resource/Pagination';
import repository from '@app/repository';

const domain = createDomain('invoice-list')

if (process.env.NODE_ENV === 'development') {
    import('effector-logger/attach').then((module) => module.attachLogger(domain));
}

export const $list = domain.createStore<PagedResponse<InvoiceListItemResource>>({
    records: [],
    pagination: {
        total: 0,
        num_on_page: 1,
        page: 1
    }
});

export const fetchList = domain.createEffect<{ page: number }, PagedResponse<InvoiceListItemResource>>({
    async handler({page}) {
        return await repository.invoices().get(page);
    }
})
$list.on(fetchList.doneData, (_, data) => data)
