import React, { Dispatch, SetStateAction } from "react";

interface CurrentExchange {
  ticker: string,
  name: string,
  image: string,
  hasExternalId: boolean,
  isFiat: boolean,
  featured: boolean,
  isStable: boolean,
  supportsFixedRate: boolean
}

interface ExchangeDropdownProps {
  updateCurrentExchange: (currencyType: string, item: CurrentExchange) => void;
  value: string;
  objKey: string;
  onChangeValue: (value: string, key: string) => void;
  exchanges: CurrentExchange[];
  currentExchange: CurrentExchange | null;
}

interface ExchangeInputState {
  fromValue: string;
  toValue: string
}

export type {CurrentExchange, ExchangeDropdownProps, ExchangeInputState}