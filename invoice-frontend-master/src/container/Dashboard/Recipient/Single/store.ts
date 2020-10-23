import { createDomain } from 'effector';
import repository from '@app/repository';
import { RecipientResource } from '@app/repository/_resource/Recipient';

const domain = createDomain('recipient-single')

if (process.env.NODE_ENV === 'development') {
    import('effector-logger/attach').then((module) => module.attachLogger(domain));
}

export const $single = domain.createStore<RecipientResource>(null)
export const fetchSingle = domain.createEffect<{ id: number }, RecipientResource>({
    async handler({id}) {
        return await repository.recipient(id).get()
    }
})
$single.on(fetchSingle.doneData, (_, data) => data)
