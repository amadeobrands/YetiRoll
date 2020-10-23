import React, { useEffect, useState } from 'react'
import { Field, Form } from 'react-final-form'
import {
    Button,
    Classes,
    FormGroup,
    Intent,
    HTMLTable,
    Dialog,
    InputGroup,
    NumericInput,
    Card, NonIdealState
} from '@blueprintjs/core'
import { useHistory, useParams } from 'react-router-dom'
import { Wrapper } from './styled';
import { useStore } from 'effector-react';
import { $single, fetchSingle } from '@app/container/Dashboard/Invoice/Single/store';
import { FormDate, FormInputGroup, FormSelect, FormTextarea, } from '@app/component/Form'
import CountryISOCodes from '@app/data/CountryISOCodes';
import repository from '@app/repository';
import { AppToaster } from '@app/lib/toaster';
import { InvoiceTemplateItemResource } from '@app/repository/_resource/InvoiceTemplateItem';

const Single: React.FC = () => {
    const history = useHistory()
    const {invoice} = useParams<{ invoice: string }>()
    const routeInvoiceId = parseInt(invoice)
    if (!routeInvoiceId) {
        history.replace('/dashboard/invoice')
    }

    // Item updated values
    const [isEditItemFormVisible, setIsEditItemFormVisible] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(0);
    const [selectedItemName, setSelectedItemName] = useState("");
    const [selectedItemQuantity, setSelectedItemQuantity] = useState<number>(0);
    const [selectedItemPricePerUnit, setSelectedItemPricePerUnit] = useState(0.0);

    const isLoading = useStore(fetchSingle.pending)
    useEffect(() => {
        fetchSingle({id: routeInvoiceId})
    }, [])
    const item = useStore($single)

    if (isLoading || !item) return null;

    const handleInvoiceUpdate = (values) => {
        console.log(values)
        console.log(new Date(values.due_date))
        let dueDate = null;
        if (values.due_date) {
            dueDate = new Date(values.due_date)
        }

        AppToaster.show({
            intent: Intent.PRIMARY,
            message: "Saving invoice..."
        })
        return new Promise((resolve, reject) => {
            repository.invoice(routeInvoiceId).update({
                title: values.title,
                localId: values.local_id,
                dueDate: dueDate,
                authorName: values.author_name,
                authorAddressFirstLine: values.author_address_first_line,
                authorAddressSecondLine: values.author_address_second_line,
                authorCountryIsoCode: values.author_country_iso_code,
                recipientName: values.recipient_name,
                recipientAddressFirstLine: values.recipient_address_first_line,
                recipientAddressSecondLine: values.recipient_address_second_line,
                recipientCountryIsoCode: values.recipient_country_iso_code,
                note: values.note,
                terms: values.terms
            }).then(() => {
                AppToaster.show({
                    intent: Intent.SUCCESS,
                    message: "Invoice updated"
                })
                fetchSingle({id: routeInvoiceId})
                resolve();
            })
        })
    }

    const renderActionButtons = (saveFunction, isSubmitting: boolean) => {
        if (item.finalized_at) {
            return null;
        } else {
            return (
                <div>
                    <Button
                        loading={isSubmitting}
                        className={'mr-1'}
                        icon={'lock'}
                        minimal
                        intent={Intent.PRIMARY}
                    >Finalize invoice</Button>
                    <Button
                        onClick={saveFunction}
                        loading={isSubmitting}
                        icon={'tick'}
                        intent={Intent.SUCCESS}
                    >Save changes</Button>
                </div>
            );
        }
    }

    const renderCountrySelectOptions = () => {
        const output = [
            (<option key="country-iso-unknown" value={""}>Select a country</option>)
        ];
        for (const isoCode in CountryISOCodes) {
            if (!CountryISOCodes.hasOwnProperty(isoCode)) continue;
            output.push((<option key={`country-iso-${isoCode}`}
                                 value={isoCode.toLocaleLowerCase()}>{CountryISOCodes[isoCode]}</option>));
        }
        return output;
    }

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
            repository.invoice(routeInvoiceId).items().create({
                name: selectedItemName,
                quantity: selectedItemQuantity,
                pricePerUnit: selectedItemPricePerUnit
            }).then(() => {
                AppToaster.show({intent: Intent.SUCCESS, message: 'Item added'})
                fetchSingle({id: routeInvoiceId})
                handleItemEditFormClose()
            })
        } else {
            // Update existing
            repository.invoice(routeInvoiceId).item(selectedItemId).update({
                name: selectedItemName,
                quantity: selectedItemQuantity,
                pricePerUnit: selectedItemPricePerUnit
            }).then(() => {
                AppToaster.show({intent: Intent.SUCCESS, message: 'Item updated'})
                fetchSingle({id: routeInvoiceId})
                handleItemEditFormClose()
            })
        }
    }

    const handleDeleteItem = (id: number) => {
        AppToaster.show({intent: Intent.PRIMARY, message: 'Removing item'})
        repository.invoice(routeInvoiceId).item(id).delete().then(() => {
            AppToaster.show({intent: Intent.SUCCESS, message: 'Item removed'})
            fetchSingle({id: routeInvoiceId})
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
            <Form
                onSubmit={handleInvoiceUpdate}
                initialValues={item}
                render={({handleSubmit, pristine, form, submitting, values}) => {
                    return (
                        <form onSubmit={handleSubmit}>
                            <div className={'row'}>
                                <div className={'col-xs-12 mb-1'}
                                     style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <h2 className={Classes.HEADING}>#{item.id}: {item.title}</h2>
                                    {renderActionButtons(handleSubmit, submitting)}
                                </div>
                            </div>
                            <div className={'row'}>
                                <div className={'col-xs-12 mb-1'}>
                                    <h3 className={Classes.HEADING}>Main information</h3>
                                    <div className={'row'}>
                                        <div className={'col-xs-6'}>
                                            <FormGroup label={'Title'} labelFor={'title'}>
                                                <Field name={'title'} component={FormInputGroup}/>
                                            </FormGroup>
                                        </div>
                                        <div className={'col-xs-3'}>
                                            <FormGroup label={'Due date'} labelFor={'due_date'}>
                                                <Field className={Classes.INPUT} name={'due_date'} type={'date'}
                                                       component={FormDate}/>
                                            </FormGroup>
                                        </div>
                                        <div className={'col-xs-3'}>
                                            <FormGroup label={'Local ID'} labelFor={'local_id'}>
                                                <Field name={'local_id'} component={FormInputGroup}/>
                                            </FormGroup>
                                        </div>
                                        <div className={'col-xs-6'}>
                                            <FormGroup label={'Note'} labelFor={'note'}>
                                                <Field name={'note'} component={FormTextarea}/>
                                            </FormGroup>
                                        </div>
                                        <div className={'col-xs-6'}>
                                            <FormGroup label={'Terms & Conditions'} labelFor={'terms'}>
                                                <Field name={'terms'} component={FormTextarea}/>
                                            </FormGroup>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={'row'}>
                                <div className={'col-xs-6 mb-1'}>
                                    <h3 className={Classes.HEADING}>Author information</h3>
                                    <div className={'row'}>
                                        <div className={'col-xs-12'}>
                                            <FormGroup label={'Author name'} labelFor={'author_name'}>
                                                <Field name={'author_name'} component={FormInputGroup}/>
                                            </FormGroup>
                                        </div>
                                        <div className={'col-xs-12'}>
                                            <FormGroup label={'Author address (1st line)'}
                                                       labelFor={'author_address_first_line'}>
                                                <Field name={'author_address_first_line'} component={FormInputGroup}/>
                                            </FormGroup>
                                        </div>
                                        <div className={'col-xs-12'}>
                                            <FormGroup label={'Author address (2nd line)'}
                                                       labelFor={'author_address_second_line'}>
                                                <Field name={'author_address_second_line'} component={FormInputGroup}/>
                                            </FormGroup>
                                        </div>
                                        <div className={'col-xs-12'}>
                                            <FormGroup label="Author country" labelFor="author_country_iso_code">
                                                <Field name={'author_country_iso_code'} component={FormSelect}>
                                                    {renderCountrySelectOptions()}
                                                </Field>
                                            </FormGroup>
                                        </div>
                                    </div>
                                </div>
                                <div className={'col-xs-6 mb-1'}>
                                    <h3 className={Classes.HEADING}>Recipient information</h3>
                                    <div className={'row'}>
                                        <div className={'col-xs-12'}>
                                            <FormGroup label={'Recipient name'} labelFor={'recipient_name'}>
                                                <Field name={'recipient_name'} component={FormInputGroup}/>
                                            </FormGroup>
                                        </div>
                                        <div className={'col-xs-12'}>
                                            <FormGroup label={'Recipient address (1st line)'}
                                                       labelFor={'recipient_address_first_line'}>
                                                <Field name={'recipient_address_first_line'}
                                                       component={FormInputGroup}/>
                                            </FormGroup>
                                        </div>
                                        <div className={'col-xs-12'}>
                                            <FormGroup label={'Recipient address (2nd line)'}
                                                       labelFor={'recipient_address_second_line'}>
                                                <Field name={'recipient_address_second_line'}
                                                       component={FormInputGroup}/>
                                            </FormGroup>
                                        </div>
                                        <div className={'col-xs-12'}>
                                            <FormGroup label="Recipient country" labelFor="recipient_country_iso_code">
                                                <Field name={'recipient_country_iso_code'} component={FormSelect}>
                                                    {renderCountrySelectOptions()}
                                                </Field>
                                            </FormGroup>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    );
                }}
            />
            {renderItemEditForm()}
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
