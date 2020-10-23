import React from 'react'

import { Button, ButtonGroup, Intent } from '@blueprintjs/core'

interface Props {
    current: number;
    numOnPage: number;
    total: number;
    disabled: boolean;
    onPageChange: (number) => void
}

const Paginator: React.FC<Props> = ({current, numOnPage, total, disabled, onPageChange}) => {
    const renderPageButton = (page: number) => {
        return (
            <Button
                key={`page-${page}`}
                intent={current === page ? Intent.PRIMARY : Intent.NONE}
                disabled={disabled}
                onClick={() => onPageChange(page)}
            >{page}</Button>
        );
    }

    const lastPage = Math.ceil(total / numOnPage);

    let startPage, endPage;
    if (lastPage <= 8) {
        startPage = 1;
        endPage = lastPage;
    } else {
        if (current <= 4) {
            startPage = 1;
            endPage = 10;
        } else if (current + 2 >= lastPage) {
            startPage = lastPage - 7;
            endPage = lastPage;
        } else {
            startPage = current - 3;
            endPage = current + 3;
        }
    }

    const pages = [];
    const pageButtonsAmount = endPage + 1 - startPage;
    for (let i = 0; i < pageButtonsAmount; i++) {
        pages.push(startPage + i)
    }

    return (
        <ButtonGroup>
            <Button
                icon={'double-chevron-left'}
                disabled={current === 1 || disabled}
                onClick={() => this.props.onPageChange(1)}
            >First</Button>
            <Button
                icon={'chevron-left'}
                disabled={current === 1 || disabled}
                onClick={() => this.props.onPageChange(current - 1)}
            >Prev</Button>
            {pages.map((page) => renderPageButton(page))}
            <Button
                rightIcon={'chevron-right'}
                disabled={current === lastPage || disabled}
                onClick={() => this.props.onPageChange(current + 1)}
            >Next</Button>
            <Button
                rightIcon={'double-chevron-right'}
                disabled={current === lastPage || disabled}
                onClick={() => this.props.onPageChange(lastPage)}
            >Last</Button>
        </ButtonGroup>

    );
}

export default Paginator;
