import axios from "axios";
import {EstimatedAmountProps, MinimalAmountProps} from "../models/servicesModels";

const instance = axios.create({
    baseURL: 'https://api.changenow.io/v1/',
    headers: {
        "Content-Type": 'application/json'
    }
})

const getAvailableCurrencies = async () => {
    return await instance.get('currencies?active=true&fixedRate=true');
}
const getMinimalAmount = (data: MinimalAmountProps) => {
    return instance.get(`exchange-range/${data.fromCurrency}_${data.toCurrency}`);
}
const getEstimatedAmount = (data: EstimatedAmountProps) => {
    return instance.get(`exchange-amount/${data.amount}/${data.fromCurrency}_${data.toCurrency}?api_key=c9155859d90d239f909d2906233816b26cd8cf5ede44702d422667672b58b0cd`);
}



export {getAvailableCurrencies, getMinimalAmount, getEstimatedAmount}

