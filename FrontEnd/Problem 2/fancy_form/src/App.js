import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Input, Grid, GridColumn, Button, Dropdown, GridRow, Segment } from 'semantic-ui-react';
import { ErrorMessage, Formik, Form } from "formik";
import * as Yup from "yup";
const initCurrentCurrency = {
  key: "",
  text: "",
  value: "",
  price: 0
}

const initCurrencyResult = {
  currency: '',
  price: 0,
  amount: 0,
  result: 0,

}
const CurrencySwapForm = () => {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [currencyResult, setCurrencyResult] = useState(initCurrencyResult);
  const [currentCurrency, setCurrentCurrency] = useState(initCurrentCurrency);

  const fetchPrices = async () => {
    try {
      const response = await axios.get('https://interview.switcheo.com/prices.json');
      const currencies = response.data.sort(function (a, b) {
        return b.currency - a.currency || b.data - a.date || b.price - a.price;
      });


      var filterCurrencies = currencies.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.currency === value.currency),
      );

      const mappingCurrencies = filterCurrencies.map((e) => {
        return {
          key: e.currency,
          text: e.currency,
          value: e.currency,
          price: e.price,
          image: { avatar: true, src: `./tokens/${e.currency}.svg` },
        }
      })

      setCurrencyOptions(mappingCurrencies);


    } catch (error) {
      console.error('Error fetching prices', error);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [])

  const validationSearch = Yup.object().shape({
    amount: Yup.number()
      .typeError('Amount must be a number')
      .required('Please enter a valid amount')
      .min(0)
      .typeError('Amount must be greater than or equal to 0'),
  });

  const handleSubmit = (values) => {
    //setPriceResult(values.amount*currentCurrency.price);
    const initCurrencyResult = {
      currency: values.currency,
      price: currentCurrency.price,
      amount: values.amount,
      result: values.amount * currentCurrency.price,

    }
    setCurrencyResult(initCurrencyResult)
  }

  return (
    <>
      <div className='container'>
        <Formik
          initialValues={{ amount: "", currency: "" }}
          validationSchema={validationSearch}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({
            values,
            handleBlur,
            handleChange,
            setFieldValue
          }) => (
            <>
              <Form className='currency-form'>
                <div className='amount-send'>
                  <label className='title'>Amount to send</label>
                  <Input type="text"
                    name="amount"
                    id="amount"
                    placeholder="Input amount"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                    value={values.amount} />
                  <div>
                    <ErrorMessage name="amount" className='error' component="p" />
                  </div>
                </div>
                <div className='amount-receive'>
                  <label className='title'>Amount to receive</label>
                  <Dropdown
                    id="currency"
                    name="currency"
                    selection
                    value={values.currency}
                    options={currencyOptions}
                    onChange={(e, data) => {
                      setFieldValue("currency", data.value);
                      const currency = currencyOptions.find((e) => e.value === data.value);
                      setCurrentCurrency(currency);
                    }}
                  />
                </div>
                <div className='submit-btn'>

                  <Button type="submit">Submit</Button>
                </div>
              </Form>
            </>
          )}
        </Formik>

        <div className='result-container'>
          {currencyResult.result !== 0 &&
            <>
              <div className='result'>{currencyResult.amount} {currencyResult.currency} = {currencyResult.result} USD</div>
              <div className='from-currency'>1 {currencyResult.currency} =</div>
              <div className='to-currency'>{currentCurrency.price} {currentCurrency.value} USD</div>
            </>
          }
        </div>

      </div>
    </>
  );
};

export default CurrencySwapForm;
