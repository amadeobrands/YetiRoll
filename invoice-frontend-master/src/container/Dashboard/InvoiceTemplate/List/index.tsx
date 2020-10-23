import React, { useEffect } from 'react'
import { Wrapper } from './styled';
import { $list, fetchList } from './store';
import { Button, Classes, HTMLTable } from '@blueprintjs/core'
import { useStore } from 'effector-react';
import { useHistory } from 'react-router-dom'
import Paginator from '@app/component/Paginator';
import { InvoiceTemplateListItemResource } from '@app/repository/_resource/InvoiceTemplate';

const List: React.FC = () => {

    const list = useStore($list);
    const isLoading = useStore(fetchList.pending);
    const history = useHistory();

    useEffect(() => {
        fetchList({page: 1})
    }, [])

    const renderList = (list: InvoiceTemplateListItemResource[]) => {
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
                            <th>Recipient</th>
                            <th>Currency</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {list.map((item) => (
                            <tr key={`invoice-${item.id}`}>
                                <td className={'fit-content'}>{item.id}</td>
                                <td>{item.title}</td>
                                <td>{item.recipient.name}</td>
                                <td>{item.currency.name} ({item.currency.symbol})</td>
                                <td className={'fit-content'}>
                                    <Button onClick={() => history.push(`/dashboard/invoice-template/${item.id}`)}>
                                        View
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
                <div className={'row'}>
                    <div className={'col-xs-12'} style={{display: 'flex', justifyContent: 'space-between'}}>
                        <h3 className={`${Classes.HEADING}`}>Invoice templates</h3>
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
