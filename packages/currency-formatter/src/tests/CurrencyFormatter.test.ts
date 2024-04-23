import {formatPrice} from '../CurrencyFormatter';

describe('currency-formatter', () => {
  const price = 113465;

  it('format price with {{ amount }}', () => {
    expect(formatPrice({price, format: '{{ amount }}'})).toBe('1,134.65');
  });

  it('format price with {{ amount_no_decimals }}', () => {
    expect(formatPrice({price, format: '{{ amount_no_decimals }}'})).toBe(
      '1,135',
    );
  });

  it('format price with {{ amount_with_comma_separator }}', () => {
    expect(
      formatPrice({price, format: '{{ amount_with_comma_separator }}'}),
    ).toBe('1.134,65');
  });

  it('format price with {{ amount_no_decimals_with_comma_separator }}', () => {
    expect(
      formatPrice({
        price,
        format: '{{ amount_no_decimals_with_comma_separator }}',
      }),
    ).toBe('1.135');
  });

  it('format price with {{ amount_no_decimals_with_space_separator }}', () => {
    expect(
      formatPrice({
        price,
        format: '{{ amount_no_decimals_with_space_separator }}',
      }),
    ).toBe('1 135');
  });

  it('format price with {{ amount_with_space_separator }}', () => {
    expect(
      formatPrice({
        price,
        format: '{{ amount_with_space_separator }}',
      }),
    ).toBe('1 134,65');
  });

  it('format price with {{ amount_with_period_and_space_separator }}', () => {
    expect(
      formatPrice({
        price,
        format: '{{ amount_with_period_and_space_separator }}',
      }),
    ).toBe('1 134.65');
  });
});

// Path: packages/currency-formatter/src/tests/CurrencyFormatter.test.ts
