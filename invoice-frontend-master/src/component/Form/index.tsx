import React from 'react'

import { Classes, HTMLSelect, InputGroup, TextArea } from '@blueprintjs/core';

export const FormDate: React.FC = (props: any) => {
    console.log(props)
    console.log(props.input.value ? props.input.value.slice(0,10) : '')
    return (
        <input
            {...props.input}
            value={props.input.value ? props.input.value.slice(0,10) : ''}
            className={`${props.className} ${Classes.FILL}`}
        />
    );
}

export const FormInputGroup: React.FC = (props: any) => <InputGroup
    {...props.input}
    readOnly={props.readOnly}
    disabled={props.disabled}
/>

export const FormTextarea: React.FC = (props: any) => <TextArea
    {...props.input}
    readOnly={props.readOnly}
    disabled={props.disabled}
    placeholder={props.placeholder}
    fill
    growVertically
/>

export const FormSelect = (props: any) => (
    <HTMLSelect
        {...props.input}
        disabled={props.disabled}
        fill
    >
        {props.children}
    </HTMLSelect>
);
