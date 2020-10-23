import axios, { AxiosInstance } from 'axios'
// Me
import MeCollection from './Me/Collection'
// Session
import SessionCollection from './Session/Collection'
// Invoice
import InvoiceCollection from './Invoice/Collection'
import InvoiceSingle from './Invoice/Single'
// Currency
import CurrencyCollection from './Currency/Collection'
// Recipient
import RecipientCollection from './Recipient/Collection'
import RecipientSingle from './Recipient/Single'
// Invoice
import InvoiceTemplateCollection from './InvoiceTemplate/Collection'
import InvoiceTemplateSingle from './InvoiceTemplate/Single'

class Repository {

    private readonly http: AxiosInstance;

    constructor() {
        this.http = axios.create({
            baseURL: process.env.API_BASE_URL || 'http://localhost:8080',
            timeout: 15000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
    }

    setAuthAccessToken(token: string, type: string = 'Bearer') {
        this.http.defaults.headers['Authorization'] = `${type} ${token}`
    }

    me(): MeCollection {
        return new MeCollection(this.http);
    }

    session(): SessionCollection {
        return new SessionCollection(this.http);
    }

    invoices(): InvoiceCollection {
        return new InvoiceCollection(this.http)
    }

    invoice(id: number): InvoiceSingle {
        return new InvoiceSingle(this.http, id);
    }

    currency(): CurrencyCollection {
        return new CurrencyCollection(this.http);
    }

    recipients(): RecipientCollection {
        return new RecipientCollection(this.http);
    }

    recipient(id: number): RecipientSingle {
        return new RecipientSingle(this.http, id)
    }

    invoiceTemplates(): InvoiceTemplateCollection {
        return new InvoiceTemplateCollection(this.http)
    }

    invoiceTemplate(id: number): InvoiceTemplateSingle {
        return new InvoiceTemplateSingle(this.http, id)
    }

}

const repository = new Repository();

export default repository;
