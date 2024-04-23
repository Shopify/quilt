import currency from 'currency.js';

export const formatPrice = ({
  price,
  format = '{{ amount }}',
}: {
  price: number;
  format: string;
}) => {
  let value = '';
  switch (format) {
    case '{{ amount }}':
      value = currency(price, {precision: 2}).divide(100).format({symbol: ''});
      break;
    case '{{ amount_no_decimals }}':
      // round to 0 decimal places
      value = currency(price, {precision: 0}).divide(100).format({symbol: ''});
      break;
    case '{{ amount_no_decimals_with_comma_separator }}':
      value = currency(price, {precision: 0, separator: '.'})
        .divide(100)
        .format({symbol: '', decimal: '.'});
      break;
    case '{{ amount_with_comma_separator }}':
      value = currency(price, {precision: 2, separator: '.'})
        .divide(100)
        .format({symbol: '', decimal: ','});
      break;
    case '{{ amount_no_decimals_with_space_separator }}':
      value = currency(price, {precision: 0, separator: ' '})
        .divide(100)
        .format({symbol: ''});
      break;
    case '{{ amount_with_period_and_space_separator }}':
      value = currency(price, {precision: 2, separator: ' '})
        .divide(100)
        .format({symbol: '', decimal: '.'});
      break;
    case '{{ amount_with_space_separator }}':
      value = currency(price, {precision: 2, separator: ' '})
        .divide(100)
        .format({symbol: '', decimal: ','});
      break;
    case '{{ amount_with_apostrophe_separator }}':
      value = currency(price, {precision: 2, separator: "'"})
        .divide(100)
        .format({symbol: ''});
      break;
    default:
      throw new Error(
        "Invalid format. Use one of '{{ amount }}', '{{ amount_no_decimals }}', '{{ amount_no_decimals_with_comma_separator }}', '{{ amount_with_comma_separator }}', '{{ amount_no_decimals_with_space_separator }}', '{{ amount_with_period_and_space_separator }}', '{{ amount_with_space_separator }}', '{{ amount_with_apostrophe_separator }}'",
      );
  }
  return value;
};
