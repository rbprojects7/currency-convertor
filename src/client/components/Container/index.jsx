import React from 'react';
import { node } from 'prop-types';
import styled from 'styled-components';

const ContainerDiv = styled.div`
    background: #FFFFFF;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    border: none;
    box-shadow: none;
    @media screen and (min-width: 992px) {
        height: auto;
        border: 1px solid #e1e3e6;
        max-width: 1120px;
        box-shadow: 0 1px 2px 0 hsla(0,0%,50%,.3);
    }
`;

const Container = ({ children }) => (<ContainerDiv>{children}</ContainerDiv>);

Container.propTypes = {
    children: node.isRequired,
};

export default Container;
