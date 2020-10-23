import React, { useEffect, useState } from 'react'
import { Field, Form } from 'react-final-form'
import { Button, Classes, Dialog, FormGroup, HTMLSelect, InputGroup, Intent } from '@blueprintjs/core'
import { useHistory, useParams } from 'react-router-dom'
import { Wrapper } from './styled';
import { useStore } from 'effector-react';
import { $single, fetchSingle } from './store';
import { FormInputGroup, FormSelect, } from '@app/component/Form'
import CountryISOCodes from '@app/data/CountryISOCodes';
import repository from '@app/repository';
import { AppToaster } from '@app/lib/toaster';
import { $currencyList } from '@app/container/Dashboard/store';

const Single: React.FC = () => {
    const history = useHistory()
    const currencies = useStore($currencyList)
    const {recipient} = useParams<{ recipient: string }>()
    const routeRecipientId = parseInt(recipient)
    const [isNewTemplateFormShowing, setIsNewTemplateFormShowing] = useState(false)
    const [isNewTemplateCreating, setIsNewTemplateCreating] = useState(false)
    const [newTemplateName, setNewTemplateName] = useState("")
    const [newTemplateCurrencyId, setNewTemplateCurrencyId] = useState(0)
    if (!routeRecipientId) {
        history.replace('/dashboard/recipient')
    }

    const isLoading = useStore(fetchSingle.pending)
    useEffect(() => {
        fetchSingle({id: routeRecipientId})
    }, [])
    const item = useStore($single)

    if (isLoading || !item) return null;

    const handleRecipientUpdate = (values) => {
        AppToaster.show({
            intent: Intent.PRIMARY,
            message: "Saving recipient..."
        })
        return new Promise((resolve, reject) => {
            repository.recipient(routeRecipientId).update({
                name: values.name,
                email: values.email,
                addressFirstLine: values.address_first_line,
                addressSecondLine: values.address_second_line,
                countryIsoCode: values.country_iso_code
            }).then(() => {
                AppToaster.show({
                    intent: Intent.SUCCESS,
                    message: "Recipient data updated"
                })
                fetchSingle({id: routeRecipientId})
                resolve();
            })
        })
    }

    const handleNewTemplateFormOpen = () => {
        setIsNewTemplateFormShowing(true)
    }

    const handleNewTemplateFormClose = () => {
        setIsNewTemplateFormShowing(false)
        setNewTemplateName("")
        setNewTemplateCurrencyId(0)
    }

    const renderActionButtons = (saveFunction, isSubmitting: boolean) => {
        return (
            <div>
                <Button
                    onClick={handleNewTemplateFormOpen}
                    loading={isSubmitting}
                    intent={Intent.PRIMARY}
                    className={'mr-1'}
                >Create new template</Button>

                <Button
                    onClick={saveFunction}
                    loading={isNewTemplateCreating}
                    icon={'tick'}
                    intent={Intent.SUCCESS}
                >Save changes</Button>
            </div>
        );
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



    const handleNewTemplateCreate = () => {
        setIsNewTemplateCreating(true)
        AppToaster.show({ intent: Intent.PRIMARY, message: 'Creating new template' })
        repository.invoiceTemplates().create({
            title: newTemplateName,
            currencyId: newTemplateCurrencyId,
            recipientId: routeRecipientId
        }).then((template) => {
            AppToaster.show({ intent: Intent.SUCCESS, message: 'New template created' })
            history.push('/dashboard/invoice-template/' + template.id)
        })
    }

    const renderNewTemplateForm = () => {
        return (
            <Dialog
                className={Classes.DARK}
                isOpen={isNewTemplateFormShowing}
            >
                <div className={Classes.DIALOG_BODY}>
                    <h4 className={Classes.HEADING}>New template</h4>
                    <div>
                        <FormGroup
                            helperText="You can change this later"
                            label="Title"
                            labelFor="title"
                            labelInfo="(required)"
                        >
                            <InputGroup
                                id="title"
                                placeholder="New template title"
                                value={newTemplateName}
                                onChange={(e) => setNewTemplateName(e.target.value)}
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
                                value={newTemplateCurrencyId}
                                onChange={(e) => setNewTemplateCurrencyId(parseInt(e.target.value))}
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
                                disabled={!setNewTemplateName || !newTemplateCurrencyId}
                                intent={Intent.SUCCESS}
                                loading={isNewTemplateCreating}
                                onClick={handleNewTemplateCreate}
                            >Create new template</Button>
                            <Button
                                minimal
                                loading={isNewTemplateCreating}
                                onClick={handleNewTemplateFormClose}
                            >Close</Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }

    return (
        <Wrapper>
            {renderNewTemplateForm()}
            <Form
                onSubmit={handleRecipientUpdate}
                initialValues={item}
                render={({handleSubmit, pristine, form, submitting, values}) => {
                    return (
                        <form onSubmit={handleSubmit}>
                            <div className={'row'}>
                                <div className={'col-xs-12 mb-1'}
                                     style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <h2 className={Classes.HEADING}>#{item.id}: {item.name}</h2>
                                    {renderActionButtons(handleSubmit, submitting)}
                                </div>
                            </div>
                            <div className={'row'}>
                                <div className={'col-xs-12 mb-1'}>
                                    <h3 className={Classes.HEADING}>Main information</h3>
                                    <div className={'row'}>
                                        <div className={'col-xs-6'}>
                                            <FormGroup label={'Name'} labelFor={'name'}>
                                                <Field name={'name'} component={FormInputGroup}/>
                                            </FormGroup>
                                        </div>
                                        <div className={'col-xs-6'}>
                                            <FormGroup label={'Email'} labelFor={'email'}>
                                                <Field name={'email'} component={FormInputGroup}/>
                                            </FormGroup>
                                        </div>
                                        <div className={'col-xs-12'}>
                                            <FormGroup label="Country" labelFor="country_iso_code">
                                                <Field name={'country_iso_code'} component={FormSelect}>
                                                    {renderCountrySelectOptions()}
                                                </Field>
                                            </FormGroup>
                                        </div>
                                        <div className={'col-xs-12'}>
                                            <FormGroup label={'Address (1st line)'}
                                                       labelFor={'address_first_line'}>
                                                <Field name={'address_first_line'} component={FormInputGroup}/>
                                            </FormGroup>
                                        </div>
                                        <div className={'col-xs-12'}>
                                            <FormGroup label={'Address (2nd line)'}
                                                       labelFor={'address_second_line'}>
                                                <Field name={'address_second_line'} component={FormInputGroup}/>
                                            </FormGroup>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    );
                }}
            />
        </Wrapper>
    );
}

export default Single;
