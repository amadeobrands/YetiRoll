import React, { useEffect, useState } from 'react'
import { Wrapper } from './styled';
import { $list, fetchList } from './store';
import { Button, Classes, Dialog, FormGroup, HTMLSelect, HTMLTable, InputGroup, Intent } from '@blueprintjs/core'
import { useStore } from 'effector-react';
import { InvoiceListItemResource } from '@app/repository/_resource/Invoice';
import { format } from 'date-fns'
import { useHistory } from 'react-router-dom'
import Paginator from '@app/component/Paginator';
import { $currencyList } from '@app/container/Dashboard/store';
import repository from '@app/repository';

const List: React.FC = () => {

    const currencies = useStore($currencyList)
    const [isNewInvoiceCreating, setIsNewInvoiceCreating] = useState(false);
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);
    const [newInvoiceTitle, setNewInvoiceTitle] = useState("");
    const [selectedCurrencyId, setSelectedCurrencyId] = useState(0);
    const list = useStore($list);
    const isLoading = useStore(fetchList.pending);
    const history = useHistory();

    useEffect(() => {
        fetchList({page: 1})
    }, [])

    const handleCreateNewInvoiceFormOpen = () => {
        setIsAddFormVisible(true)
    }

    const handleCreateNewInvoiceFormClose = () => {
        setIsAddFormVisible(false)
        setSelectedCurrencyId(0)
        setNewInvoiceTitle("")
    }

    const handleCreateNewInvoice = () => {
        setIsNewInvoiceCreating(true)
        repository.invoices().create({
            title: newInvoiceTitle,
            currencyId: selectedCurrencyId
        }).then((invoice) => {
            history.push(`/dashboard/invoice/${invoice.id}`)
        })
    }

    const renderNewInvoiceForm = () => {
        return (
            <Dialog
                className={Classes.DARK}
                isOpen={isAddFormVisible}
            >
                <div className={Classes.DIALOG_BODY}>
                    <h4 className={Classes.HEADING}>New invoice</h4>
                    <div>
                        <FormGroup
                            helperText="You can change this later"
                            label="Title"
                            labelFor="title"
                            labelInfo="(required)"
                        >
                            <InputGroup
                                id="title"
                                placeholder="New invoice title"
                                value={newInvoiceTitle}
                                onChange={(e) => setNewInvoiceTitle(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup
                            helperText="You CANNOT change this later"
                            label="Currency"
                            labelFor="currency"
                            labelInfo="(required)"
                        >
                            <HTMLSelect
                                fill
                                id={'currency'}
                                value={selectedCurrencyId}
                                onChange={(e) => setSelectedCurrencyId(parseInt(e.target.value))}
                            >
                                <option value="0">Pick a currency...</option>
                                {currencies.map(item => (
                                    <option value={item.id}
                                            key={`currency-${item.id}`}>{item.name} ({item.symbol})</option>
                                ))}
                            </HTMLSelect>
                        </FormGroup>
                        <div>
                            <Button
                                disabled={!newInvoiceTitle || !selectedCurrencyId}
                                intent={Intent.SUCCESS}
                                loading={isNewInvoiceCreating}
                                onClick={handleCreateNewInvoice}
                            >Create new invoice</Button>
                            <Button
                                minimal
                                loading={isNewInvoiceCreating}
                                onClick={handleCreateNewInvoiceFormClose}
                            >Close</Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }

    const renderList = (list: InvoiceListItemResource[]) => {
        return (
            <div className={"row mb-1"}>
                <div className={"col-xs-12"}>
                    <HTMLTable
                        style={{width: '100%', opacity: isLoading ? '0.5' : '1', transition: 'opacity 0.25s'}}
                        className={Classes.HTML_TABLE_STRIPED}
                    >
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Local ID</th>
                            <th>Last updated</th>
                            <th>Finalized at</th>
                            <th>Currency</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {list.map((item) => (
                            <tr key={`invoice-${item.id}`}>
                                <td className={'fit-content'}>{item.id}</td>
                                <td>{item.title}</td>
                                <td>{item.local_id}</td>
                                <td>{format(item.updated_at, "dd.MM.yyyy")}</td>
                                <td>{item.finalized_at ? format(item.updated_at, "dd.MM.yyyy") : 'Still pending'}</td>
                                <td>{item.currency.name} ({item.currency.symbol})</td>
                                <td className={'fit-content'}>
                                    <Button onClick={() => history.push(`/dashboard/invoice/${item.id}`)}
                                            icon={item.finalized_at ? 'eye-open' : 'style'}>
                                        {item.finalized_at ? 'Details' : 'Edit'}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </HTMLTable>
                </div>
            </div>
        );
    }

    return (
        <Wrapper>
            <div>
                {renderNewInvoiceForm()}
                <div className={'row'}>
                    <div className={'col-xs-12'} style={{display: 'flex', justifyContent: 'space-between'}}>
                        <h3 className={`${Classes.HEADING}`}>Invoice list</h3>
                        <Button
                            icon={'add'}
                            intent={Intent.SUCCESS}
                            onClick={() => handleCreateNewInvoiceFormOpen()}
                        >Create new invoice</Button>
                    </div>
                </div>
                {renderList(list.records)}
                <div className={'row'}>
                    <div className={'col-xs-12'}>
                        <Paginator
                            disabled={isLoading}
                            current={list.pagination.page}
                            numOnPage={list.pagination.num_on_page}
                            total={list.pagination.total}
                            onPageChange={(page) => fetchList({page})}
                        />
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}

export default List;
