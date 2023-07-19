import React, { useEffect, useState } from "react";

import styles from "../../styles/Exchange/Exchange.module.scss";
import Dropdown from "./Dropdown";
import { CurrentExchange, ExchangeInputState } from "../../models/exchangeModels";
import { getAvailableCurrencies, getEstimatedAmount, getMinimalAmount } from "../../services/exchangeService";
import { ExchangeIconSvg } from "./ExchangeIcons";
import { Button, Input } from "antd";

const Exchange: React.FC = () => {
  useEffect(() => {
    getAvailableCurrencies().then(response => {
      setAvailableCurrencies(response.data);
      getMinimalAmount({ fromCurrency: response.data[0].ticker, toCurrency: response.data[1].ticker }).then(minimalAmount  => {
        updateInputValue('fromValue', minimalAmount.data.minAmount);
      }).catch(err => setError(err.response.data.message));
      setFromCurrency(response.data[0]);
      setToCurrency(response.data[1]);
    }).catch(err => setError(err.response.data.message));
  }, []);

  const [error, setError] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<CurrentExchange | null>(null);
  const [toCurrency, setToCurrency] = useState<CurrentExchange |null>(null);
  const [inputValue, setInputValue] = useState<ExchangeInputState>({fromValue: '', toValue: '' });
  const [availableCurrencies, setAvailableCurrencies] = useState<CurrentExchange[] | []>([])

  const calculateEstimatedAmount = (value: number) => {
    setError('');
    getEstimatedAmount({fromCurrency: fromCurrency!.ticker, toCurrency: toCurrency!.ticker, amount: value}).then(estimatedAmount => {
      updateInputValue('toValue', estimatedAmount.data.estimatedAmount);
    }).catch(err => setError(err.response.data.message));
  }

  useEffect(() => {
    if (inputValue.fromValue) {
      if (error === 'Out of min amount') updateInputValue('toValue', '-');
      else {
        calculateEstimatedAmount(Number(inputValue.fromValue));
      }
    }
  }, [inputValue.fromValue])

  const updateMinimalAmount = (currencyType: string, item: CurrentExchange) => {
    if (currencyType === 'fromValue') {
      setFromCurrency(item);
      getMinimalAmount({ fromCurrency: item.ticker, toCurrency: toCurrency!.ticker }).then(minimalAmount  => {
        updateInputValue('fromValue', minimalAmount.data.minAmount);
      }).catch(err => setError(err.response.data.message))
    } else {
      setToCurrency(item);
      calculateEstimatedAmount(Number(inputValue.fromValue));
    }
  }
  // useEffect(() => {
  //   if (fromCurrency && toCurrency) {
  //     getMinimalAmount({ fromCurrency: fromCurrency.ticker, toCurrency: toCurrency.ticker }).then(minimalAmount  => {
  //       updateInputValue('fromValue', minimalAmount.data.minAmount);
  //     }).catch(err => setError(err.response.data.message))
  //   }
  // }, [fromCurrency, toCurrency]);

  const changeCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    updateInputValue('fromValue', inputValue.toValue);
  }

  const onChangeValue = (value: string, objKey: string) => {
    updateInputValue(objKey, value);
  }


  const updateInputValue = (key: string, value: string) => {
    setInputValue(prevState => ({ ...prevState, [key]: value }));
  };
    return (
      <>
        <div className={styles.Exchange}>
          <h1>Crypto Exchange</h1>
          <h2>Exchange fast and easy</h2>
          <div className={styles.dropdownBlock}>
            <Dropdown updateCurrentExchange={updateMinimalAmount} objKey={'fromValue'} currentExchange={fromCurrency} exchanges={availableCurrencies} onChangeValue={onChangeValue} value={inputValue.fromValue}/>
            <button onClick={changeCurrencies}>
              <ExchangeIconSvg/>
            </button>
            <Dropdown updateCurrentExchange={updateMinimalAmount} objKey={'toValue'} currentExchange={toCurrency} exchanges={availableCurrencies} onChangeValue={onChangeValue} value={inputValue.toValue} />
          </div>
          <h3>Your Ethereum address</h3>
          <div className={styles.etheriumBlock}>
            <Input/>
            <Button type="primary">Exchange</Button>
            {error && <h3 className={styles.error}>{error}</h3>}
          </div>
        </div>
      </>
    );
};

export default Exchange;