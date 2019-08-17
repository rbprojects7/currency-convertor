import React, { useState } from 'react';
import styled from 'styled-components';
import {Box, Button, Grid, Grommet, Paragraph} from "grommet";
import Helmet from 'react-helmet';
import Heading from '../../components/Heading';
import HideShow from '../../components/Container/HideShow';
import Container from '../../components/Container';
import myTheme from "../App/myTheme";
import LineChart from "../../components/LineChart";
import { getCurrencyRealTime } from '../../../helpers';
import CurrencySelect from '../../components/CurrencySelect';
import CurrencyInput from '../../components/CurrencyInput';
import Reversible from '../../components/Reversible';
import ButtonComponent from '../../components/ConvertCurrencyButton';

const { HideMobile } = HideShow;

const ChartContainer = styled.div`
  margin-top: 1.5em;
  width: 100%;
`;

const Home = () => {
  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');
  const [showBothInputs, setBothInputsShow] = useState(false);
  const [currencyA, setCurrencyA] = useState('EUR');
  const [currencyB, setCurrencyB] = useState('GBP');
  const [exchangeValueA, setExchangeValueA] = useState('1');
  const [exchangeValueB, setExchangeValueB] = useState('1');
  const [netExchangeValue, setNetExchangeValue] = useState('1');
  const setExchangeValueCallbackA = (value) => {
    setExchangeValueA(value);
    const newExchangeValue = getCurrencyRealTime(Number(value), Number(exchangeValueB));
    if (newExchangeValue) {
      if (showBothInputs) setInputB(Number(newExchangeValue * Number(inputA)).toFixed(4));
      setNetExchangeValue(newExchangeValue);
    }
  };
  const setExchangeValueCallbackB = (value) => {
    setExchangeValueB(value);
    const newExchangeValue = getCurrencyRealTime(Number(exchangeValueA), Number(value));
    if (newExchangeValue) {
      if (showBothInputs) setInputB(Number(newExchangeValue * Number(inputA)).toFixed(4));
      setNetExchangeValue(newExchangeValue);
    }
  };
  const inputOnChangeA = (e) => {
    setInputA(e.target.value);
    if(!isNaN(e.target.value)) {
      setInputB(Number(netExchangeValue * Number(e.target.value)).toFixed(4));
    }  else {
      setInputB('0');
    }
  };
  const inputOnChangeB = (e) => {
    setInputB(e.target.value);
    if(!isNaN(e.target.value)) {
      setInputA(Number(Number(e.target.value)/netExchangeValue).toFixed(4));
    } else {
      setInputA('0');
    }
  };
  const convertCurrencyAction = () => {
    const newExchangeValue = getCurrencyRealTime(Number(exchangeValueA), Number(exchangeValueB));
    setNetExchangeValue(newExchangeValue);
    setBothInputsShow(true);
  };
  return (
    <Grommet theme={myTheme} full>
      <Grid
        fill
        rows={["auto", "flex"]}
        columns={["auto", "flex"]}
        areas={[
          { name: "header", start: [0, 0], end: [1, 0] },
          { name: "main", start: [0, 1], end: [1, 1] },
        ]}
      >
        <Box
          gridArea="header"
          direction="row"
          align="center"
          justify="between"
          pad={{ horizontal: "xlarge", vertical: "medium" }}
          background={"page-background"}
        >
          <Heading level={2} size="small" text="Currency Calculator" />
          <HideMobile>
            <Button primary label="Dashboard" href="https://www.currency-convertor.com/dashboard/" />
          </HideMobile>
        </Box>
        <Box gridArea="main" full="horizontal" background={"page-background"}>
          <Container>
            <Helmet title="Exchange Rate Calculator" />
            <div style={{ background: `#FFF url(https://firebasestorage.googleapis.com/v0/b/test-23cfc.appspot.com/o/background.svg?alt=media&token=d8230381-6c88-4257-8761-317edfaa2cbc) no-repeat 50%` }}>
              <Box pad={{ horizontal: "xlarge", vertical: "medium" }}>
                <Heading level={1} size="small" text="Exchange Rate Calculator" />
                <Paragraph size="medium">Exchange rate calculator brings you live information so you can keep track of the REAL exchange rate.</Paragraph>
              </Box>
            </div>
            <Box align={"center"} pad={{ horizontal: "xlarge", vertical: "medium" }}>
              <Heading level={4} size="large" text="Show me the exchange rate for" />
              <Box>
                <Box align={"center"} justify={"center"} direction={"row"}>
                  <Box direction={"column"} align={"center"} justify={"center"}>
                    <CurrencySelect exchangeValueCallback={setExchangeValueCallbackA} setOptionParent={currency => setCurrencyA(currency)} value={"EUR"} />
                    {showBothInputs && (<CurrencyInput placeholder={`In ${currencyA}`} label={`Amount in ${currencyA}`} value={inputA} onChange={inputOnChangeA} />)}
                  </Box>
                  <Reversible />
                  <Box direction={"column"} align={"center"} justify={"center"}>
                    <CurrencySelect exchangeValueCallback={setExchangeValueCallbackB} setOptionParent={currency => setCurrencyB(currency)} value={"GBP"} />
                    {showBothInputs && (<CurrencyInput placeholder={`In ${currencyB}`} label={`Amount in ${currencyB}`} value={inputB} onChange={inputOnChangeB} />)}
                  </Box>
                </Box>
                {!showBothInputs && (<CurrencyInput placeholder={`In ${currencyA}`} label={`Amount in ${currencyA}`} value={inputA} onChange={inputOnChangeA} />)}
              </Box>
              {(!isNaN(inputA) && !showBothInputs && (inputA !== '')) && (<ButtonComponent currencyConvertHOC={convertCurrencyAction} />)}
              <ChartContainer>
                <LineChart currencyA={currencyA} currencyB={currencyB} />
              </ChartContainer>
            </Box>
          </Container>
        </Box>
      </Grid>
    </Grommet>);
};

export default Home;
