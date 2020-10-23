import React, { useEffect, useState } from 'react'
import { Button, Classes, Dialog, FormGroup, HTMLTable, InputGroup, Intent, NumericInput, Card, NonIdealState } from '@blueprintjs/core'
import { useHistory, useParams } from 'react-router-dom'
import { Wrapper } from './styled';
import { useStore } from 'effector-react';
import { $single, fetchSingle } from './store';
import { InvoiceTemplateItemResource } from '@app/repository/_resource/InvoiceTemplateItem'
import { AppToaster } from '@app/lib/toaster';
import repository from '@app/repository';

const Single: React.FC = () => {
    const history = useHistory()
    const {invoiceTemplate} = useParams<{ invoiceTemplate: string }>()
    const [isEditItemFormVisible, setIsEditItemFormVisible] = useState(false);

    // Item updated values
    const [selectedItemId, setSelectedItemId] = useState(0);
    const [selectedItemName, setSelectedItemName] = useState("");
    const [selectedItemQuantity, setSelectedItemQuantity] = useState<number>(0);
    const [selectedItemPricePerUnit, setSelectedItemPricePerUnit] = useState(0.0);

    const [selectedItem, setSelectedItem] = useState<InvoiceTemplateItemResource>(null);
    const routeInvoiceTemplateId = parseInt(invoiceTemplate)
    if (!routeInvoiceTemplateId) {
        history.replace('/dashboard/invoice-template')
    }

    const isLoading = useStore(fetchSingle.pending)
    useEffect(() => {
        fetchSingle({id: routeInvoiceTemplateId})
    }, [])
    const item = useStore($single)

    if (isLoading || !item) return null;

    const handleItemEditFormOpen = (item: InvoiceTemplateItemResource) => {
        setSelectedItemId(item.id)
        setSelectedItemName(item.name)
        setSelectedItemQuantity(item.quantity)
        setSelectedItemPricePerUnit(item.price_per_unit)
        setIsEditItemFormVisible(true)
    }

    const handleItemEditFormClose = () => {
        setIsEditItemFormVisible(false);
    }

    const handleItemPersist = () => {
        AppToaster.show({intent: Intent.PRIMARY, message: 'Saving item'})
        if (selectedItemId === 0) {
            // Create new
            repository.invoiceTemplate(routeInvoiceTemplateId).items().create({
                name: selectedItemName,
                quantity: selectedItemQuantity,
                pricePerUnit: selectedItemPricePerUnit
            }).then(() => {
                AppToaster.show({intent: Intent.SUCCESS, message: 'Item added'})
                fetchSingle({id: routeInvoiceTemplateId})
                handleItemEditFormClose()
            })
        } else {
            // Update existing
            repository.invoiceTemplate(routeInvoiceTemplateId).item(selectedItemId).update({
                name: selectedItemName,
                quantity: selectedItemQuantity,
                pricePerUnit: selectedItemPricePerUnit
            }).then(() => {
                AppToaster.show({intent: Intent.SUCCESS, message: 'Item updated'})
                fetchSingle({id: routeInvoiceTemplateId})
                handleItemEditFormClose()
            })
        }
    }

    const handleDeleteItem = (id: number) => {
        AppToaster.show({intent: Intent.PRIMARY, message: 'Removing item'})
        repository.invoiceTemplate(routeInvoiceTemplateId).item(id).delete().then(() => {
            AppToaster.show({intent: Intent.SUCCESS, message: 'Item removed'})
            fetchSingle({id: routeInvoiceTemplateId})
        });
    }

    const renderItemEditForm = () => {
        return (
            <Dialog
                className={Classes.DARK}
                isOpen={isEditItemFormVisible}
            >
                <div className={Classes.DIALOG_BODY}>
                    <h4 className={Classes.HEADING}>New item in template</h4>
                    <div>
                        <FormGroup
                            label="Item name"
                            labelFor="name"
                        >
                            <InputGroup
                                id="name"
                                value={selectedItemName}
                                onChange={(e) => {
                                    setSelectedItemName(e.target.value)
                                }}
                                placeholder="Item name, product description"
                            />
                        </FormGroup>
                        <FormGroup
                            label="Quantity"
                            labelFor="quantity"
                        >
                            <NumericInput
                                fill
                                min={0}
                                value={selectedItemQuantity}
                                onValueChange={(quantity) => {
                                    setSelectedItemQuantity(quantity)
                                }}
                                id="quantity"
                                placeholder="Amount of items"
                            />
                        </FormGroup>
                        <FormGroup
                            label={`Price per item (${item.currency.name})`}
                            labelFor="price_per_unit"
                        >
                            <NumericInput
                                fill
                                value={selectedItemPricePerUnit}
                                onValueChange={(price) => {
                                    setSelectedItemPricePerUnit(price)
                                }}
                                id="price_per_unit"
                                placeholder=""
                            />
                        </FormGroup>
                        <div>
                            <Button
                                className={'mr-1'}
                                intent={Intent.SUCCESS}
                                onClick={handleItemPersist}
                            >Save item</Button>
                            <Button
                                onClick={handleItemEditFormClose}
                                minimal
                            >Close</Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }

    const handleCreateInstanceFromTemplate = () => {
        AppToaster.show({ intent: Intent.PRIMARY, message: "Creating invoice instance" })
        repository.invoices().createFromTemplate(routeInvoiceTemplateId).then((invoice) => {
            AppToaster.show({ intent: Intent.SUCCESS, message: "Instance created" })
            history.push('/dashboard/invoice/' + invoice.id)
        })
    }


    const renderItemList = (items: InvoiceTemplateItemResource[]) => {

        if (items.length === 0) {
            return (
                <NonIdealState
                    title={'No Items'}
                />
            );
        }

        const sum = items.reduce((acc, curr) => {
            return acc + (curr.quantity * curr.price_per_unit);
        }, 0);
        return (
            <>
                <HTMLTable
                    style={{width: '100%', opacity: isLoading ? '0.5' : '1', transition: 'opacity 0.25s'}}
                    className={`${Classes.HTML_TABLE_STRIPED} mb-1`}
                >
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Price per unit</th>
                        <th>Total</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((listItem) => (
                        <tr key={`item-${listItem.id}`}>
                            <td className={'fit-content'}>{listItem.id}</td>
                            <td>{listItem.name}</td>
                            <td>{listItem.quantity}</td>
                            <td>{listItem.price_per_unit.toFixed(item.currency.unit_precision)} {item.currency.symbol}</td>
                            <td>{(listItem.price_per_unit * listItem.quantity).toFixed(item.currency.unit_precision)} {item.currency.symbol}</td>
                            <td className={'fit-content'}>
                                <Button
                                    onClick={() => handleItemEditFormOpen(listItem)}
                                    icon={'highlight'}
                                >Edit</Button>
                                <Button
                                    minimal
                                    intent={Intent.DANGER}
                                    onClick={() => handleDeleteItem(listItem.id)}
                                >Remove</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </HTMLTable>
                <div>
                    <h4 className={Classes.HEADING}>Total: {sum} {item.currency.name} ({item.currency.symbol})</h4>
                </div>

            </>
        );
    }

    return (
        <Wrapper>
            {renderItemEditForm()}
            <div className={'row'}>
                <div className={'col-xs-12 mb-1'} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 className={Classes.HEADING}>Template #{item.id}: {item.title}</h3>
                    <Button
                        onClick={handleCreateInstanceFromTemplate}
                        intent={Intent.SUCCESS}
                    >Create invoice from template</Button>
                </div>
            </div>
            <div className={'row'}>
                <div className={'col-xs-6 mb-2'}>
                    <Card>
                        <p className={Classes.TEXT_MUTED}>Currency</p>
                        <h4 className={Classes.HEADING}>{item.currency.name}</h4>
                    </Card>
                </div>
                <div className={'col-xs-6 mb-2'}>
                    <Card>
                        <p className={Classes.TEXT_MUTED}>Recipient</p>
                        <h4 className={Classes.HEADING}>{item.recipient.name}</h4>
                    </Card>
                </div>
            </div>
            <div className={'row'}>
                <div className={'col-xs-12'} style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h3 className={Classes.HEADING}>Items</h3>
                    <Button
                        intent={Intent.SUCCESS}
                        onClick={() => handleItemEditFormOpen({id: 0, name: "", price_per_unit: 0.0, quantity: 0})}
                    >Add new item</Button>
                </div>
            </div>
            <div className={'row'}>
                <div className={'col-xs-12'}>
                    {renderItemList(item.items)}
                </div>
            </div>
        </Wrapper>
    );
}

export default Single;
