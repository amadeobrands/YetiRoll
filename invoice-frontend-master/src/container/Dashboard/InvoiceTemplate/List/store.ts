import { createDomain } from 'effector';
import { PagedResponse } from '@app/repository/_resource/Pagination';
import repository from '@app/repository';
import { InvoiceTemplateListItemResource } from '@app/repository/_resource/InvoiceTemplate';

const domain = createDomain('invoice-template-list')

if (process.env.NODE_ENV === 'development') {
    import('effector-logger/attach').then((module) => module.attachLogger(domain));
}

export const $list = domain.createStore<PagedResponse<InvoiceTemplateListItemResource>>({
    records: [],
    pagination: {
        total: 0,
        num_on_page: 1,
        page: 1
    }
});

export const fetchList = domain.createEffect<{ page: number }, PagedResponse<InvoiceTemplateListItemResource>>({
    async handler({page}) {
        return await repository.invoiceTemplates().get(page);
    }
})
$list.on(fetchList.doneData, (_, data) => data)
