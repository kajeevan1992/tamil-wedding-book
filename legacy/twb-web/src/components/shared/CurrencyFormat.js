import { NumericFormat } from 'react-number-format';

export default function CurrencyFormat(props) {
    return (
        <NumericFormat
            value={props.value}
            displayType="text"
            thousandSeparator={true}
            decimalSeparator="."
            prefix="£ "
            fixedDecimalScale={2}
            {...props}
        />
    );
}