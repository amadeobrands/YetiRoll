import React, { useEffect, useState } from 'react'
import { Wrapper } from './styled';
import { $list, fetchList } from './store';
import { Button, Classes, Dialog, FormGroup, HTMLTable, InputGroup, Intent } from '@blueprintjs/core'
import { useStore } from 'effector-react';
import { format } from 'date-fns'
import { useHistory } from 'react-router-dom'
import Paginator from '@app/component/Paginator';
import repository from '@app/repository';
import { RecipientListItemResource } from '@app/repository/_resource/Recipient';

const List: React.FC = () => {
    const [isNewRecipientCreating, setIsNewRecipientCreating] = useState(false);
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);
    const [newRecipientName, setNewRecipientName] = useState("");
    const list = useStore($list);
    const isLoading = useStore(fetchList.pending);
    const history = useHistory();

    useEffect(() => {
        fetchList({page: 1})
    }, [])

    const handleCreateNewRecipientFormOpen = () => {
        setIsAddFormVisible(true)
    }

    const handleCreateNewRecipientFormClose = () => {
        setIsAddFormVisible(false)
        setNewRecipientName("")
    }

    const handleCreateNewRecipient = () => {
        setIsNewRecipientCreating(true)
        repository.recipients().create({
            name: newRecipientName,
        }).then((invoice) => {
            history.push(`/dashboard/recipient/${invoice.id}`)
        })
    }

    const renderNewRecipientForm = () => {
        return (
            <Dialog
                className={Classes.DARK}
                isOpen={isAddFormVisible}
            >
                <div className={Classes.DIALOG_BODY}>
                    <h4 className={Classes.HEADING}>Add recipient</h4>
                    <div>
                        <FormGroup
                            helperText="You can change this later"
                            label="Name"
                            labelFor="name"
                            labelInfo="(required)"
                        >
                            <InputGroup
                                id="name"
                                placeholder="i.e. John Smith"
                                value={newRecipientName}
                                onChange={(e) => setNewRecipientName(e.target.value)}
                            />
                        </FormGroup>
                        <div>
                            <Button
                                disabled={!newRecipientName}
                                intent={Intent.SUCCESS}
                                loading={isNewRecipientCreating}
                                onClick={handleCreateNewRecipient}
                            >Create new recipient</Button>
                            <Button
                                minimal
                                loading={isNewRecipientCreating}
                                onClick={handleCreateNewRecipientFormClose}
                            >Close</Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }

    const renderList = (list: RecipientListItemResource[]) => {
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
                            <th>Name</th>
                            <th>Email</th>
                            <th>Last updated</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {list.map((item) => (
                            <tr key={`recipient-${item.id}`}>
                                <td className={'fit-content'}>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.email || "Not set"}</td>
                                <td>{format(item.updated_at, "dd.MM.yyyy")}</td>
                                <td className={'fit-content'}>
                                    <Button onClick={() => history.push(`/dashboard/recipient/${item.id}`)}>
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
                {renderNewRecipientForm()}
                <div className={'row'}>
                    <div className={'col-xs-12'} style={{display: 'flex', justifyContent: 'space-between'}}>
                        <h3 className={`${Classes.HEADING}`}>Recipient list</h3>
                        <Button
                            icon={'add'}
                            intent={Intent.SUCCESS}
                            onClick={() => handleCreateNewRecipientFormOpen()}
                        >Add new recipient</Button>
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
