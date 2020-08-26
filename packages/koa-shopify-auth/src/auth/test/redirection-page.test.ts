import redirectionScript from '../redirection-page';

const origin = 'https://shopify.com/?x=шеллы';
const redirectTo = 'shop1.myshopify.io';
const apiKey = 'fakekey';

describe('redirectionScript', () => {
  it('returns a script tag with formatted data', () => {
    const script = redirectionScript({origin, redirectTo, apiKey});

    expect(script).toContain(
      'shopOrigin: "https://shopify.com/?x=%D1%88%D0%B5%D0%BB%D0%BB%D1%8B"',
    );
  });
});
