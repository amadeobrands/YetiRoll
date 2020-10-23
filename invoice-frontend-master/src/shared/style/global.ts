import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    *, *:before, *:after {
        box-sizing: border-box
    }
    
    body {
        padding-top: 2rem;
        background-color: ${({theme}) => theme.colors.background};
    }
    
    table.bp3-html-table tbody tr td.fit-content {
        width: 1%;
        white-space: nowrap;
    }
    
    table.bp3-html-table tbody tr td {
        vertical-align: middle;
    }
    
    .mb-1 {
        margin-bottom: 1rem;
    }
    
    .mb-2 {
        margin-bottom: 2rem;
    }
     
    .mb-3 {
        margin-bottom: 3rem;
    }
    
    .mr-1 {
        margin-right: 1rem;
    }

`
