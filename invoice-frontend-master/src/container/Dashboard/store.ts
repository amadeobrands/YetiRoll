import {createDomain} from 'effector';
import repository from '@app/repository';
import { CurrencyResource } from '@app/repository/_resource/Currency';

const currencies = createDomain('currencies')

if (process.env.NODE_ENV === 'development') {
    import('effector-logger/attach').then((module) => module.attachLogger(currencies));
}

export const $currencyList = currencies.createStore<CurrencyResource[]>([]);

export const fetchCurrencyList = currencies.createEffect<void, CurrencyResource[]>({
    async handler() {
        return await repository.currency().get();
    }
})
$currencyList.on(fetchCurrencyList.doneData, (_, data) => data)
