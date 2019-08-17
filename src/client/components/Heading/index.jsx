import React from "react";
import { number, string} from "prop-types";
import { Heading } from "grommet";

const H = ({ level, size, text }) => (
    <Heading level={level} size={size}>{text}</Heading>
);

H.propTypes = {
    level: number.isRequired,
    size: string.isRequired
};

export default H;
