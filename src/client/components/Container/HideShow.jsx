import React from 'react';
import styled from "styled-components";

const HideMobile = styled.div`
    display: none;
    @media screen and (min-width: 768px) {
        display: block;
    }
`;

const ShowMobile = styled.div`
    display: block;
    width: 100%;
    @media screen and (min-width: 768px) {
        display: none;
    }
`;

const EmptyDiv = styled.div`
    height: 3em;
    width: 100%;
`;

export default { HideMobile, ShowMobile, EmptyDiv };
