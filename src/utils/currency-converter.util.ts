import { Currency } from '../enums/currency.enum';

/**
 * @class
 * @name
 * @description Converts the amount from the fromCurrency to the toCurrency
 * @todo Connect to a prices feed, to get convertion rates
 */
export class CurrencyConverterUtil {
    public convert(fromCurrency: Currency, toCurrency: Currency, amount: number): number {
        return amount;
    }
}