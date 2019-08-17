import React from 'react';
import styled from 'styled-components';

const SvgContainer = styled.div`
    margin: 0.5em;
    @media screen and (min-width: 768px) {
        margin: 0.5em 2em;
    }
`;

const Reversible = () => (
<SvgContainer>
    <svg fill="#000000" height={24} viewBox="0 0 24 24" width={24} xmlns="http://www.w3.org/2000/svg">
        <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" />
        <path d="M0 0h24v24H0z" fill="none" />
    </svg>
</SvgContainer>
);

export default Reversible;
