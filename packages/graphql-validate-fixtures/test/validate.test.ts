import {buildSchema, parse, concatAST} from 'graphql';
import {compile} from 'graphql-tool-utilities';
import validate from '../validate';

describe('validate()', () => {
  it('validates strings', () => {
    const document = createDocument(`
      type Query { name: String! }
      schema { query: Query }
    `, 'query NameQuery { name }');

    expect(validate({name: 42}, document.operations.NameQuery, document)).toMatchSnapshot();
    expect(validate({}, document.operations.NameQuery, document)).toMatchSnapshot();
    expect(validate({name: null}, document.operations.NameQuery, document)).toMatchSnapshot();
    expect(validate({name: 'Chris'}, document.operations.NameQuery, document)).toMatchSnapshot();

    const document = createDocument(`
      type Query { address: String }
      schema { query: Query }
    `, 'query AddressQuery { address }');

    expect(validate({address: 42}, document.operations.AddressQuery, document)).toMatchSnapshot();
    expect(validate({}, document.operations.AddressQuery, document)).toMatchSnapshot();
    expect(validate({address: null}, document.operations.AddressQuery, document)).toMatchSnapshot();
    expect(validate({address: 'Chris'}, document.operations.AddressQuery, document)).toMatchSnapshot();
  });

  it('validates numbers', () => {
    const document = createDocument(`
      type Query { age: Int! }
      schema { query: Query }
    `, 'query AgeQuery { age }');

    expect(validate({age: '42'}, document.operations.AgeQuery, document)).toMatchSnapshot();
    expect(validate({}, document.operations.AgeQuery, document)).toMatchSnapshot();
    expect(validate({age: null}, document.operations.AgeQuery, document)).toMatchSnapshot();
    expect(validate({age: 42}, document.operations.AgeQuery, document)).toMatchSnapshot();
    expect(validate({age: 42.5}, document.operations.AgeQuery, document)).toMatchSnapshot();

    const document = createDocument(`
      type Query { height: Float }
      schema { query: Query }
    `, 'query HeightQuery { height }');

    expect(validate({height: '42.3'}, document.operations.HeightQuery, document)).toMatchSnapshot();
    expect(validate({}, document.operations.HeightQuery, document)).toMatchSnapshot();
    expect(validate({height: null}, document.operations.HeightQuery, document)).toMatchSnapshot();
    expect(validate({height: 42.3}, document.operations.HeightQuery, document)).toMatchSnapshot();
    expect(validate({height: 42}, document.operations.HeightQuery, document)).toMatchSnapshot();
  });

  it('validates booleans', () => {
    const document = createDocument(`
      type Query { married: Boolean! }
      schema { query: Query }
    `, 'query MarriedQuery { married }');

    expect(validate({married: 'true'}, document.operations.MarriedQuery, document)).toMatchSnapshot();
    expect(validate({}, document.operations.MarriedQuery, document)).toMatchSnapshot();
    expect(validate({married: null}, document.operations.MarriedQuery, document)).toMatchSnapshot();
    expect(validate({married: true}, document.operations.MarriedQuery, document)).toMatchSnapshot();
    expect(validate({married: false}, document.operations.MarriedQuery, document)).toMatchSnapshot();

    const document = createDocument(`
      type Query { responded: Boolean }
      schema { query: Query }
    `, 'query RespondedQuery { responded }');

    expect(validate({responded: 'true'}, document.operations.RespondedQuery, document)).toMatchSnapshot();
    expect(validate({}, document.operations.RespondedQuery, document)).toMatchSnapshot();
    expect(validate({responded: null}, document.operations.RespondedQuery, document)).toMatchSnapshot();
    expect(validate({responded: true}, document.operations.RespondedQuery, document)).toMatchSnapshot();
    expect(validate({responded: false}, document.operations.RespondedQuery, document)).toMatchSnapshot();
  });

  describe('lists', () => {
    it('validates the types of lists', () => {
      const document = createDocument(`
        type Query { favoriteNumbers: [Int!]! }
        schema { query: Query }
      `, 'query FavoriteNumbersQuery { favoriteNumbers }');

      expect(validate({}, document.operations.FavoriteNumbersQuery, document)).toMatchSnapshot();
      expect(validate({favoriteNumbers: null}, document.operations.FavoriteNumbersQuery, document)).toMatchSnapshot();
      expect(validate({favoriteNumbers: []}, document.operations.FavoriteNumbersQuery, document)).toMatchSnapshot();
      expect(validate({favoriteNumbers: {}}, document.operations.FavoriteNumbersQuery, document)).toMatchSnapshot();
      expect(validate({favoriteNumbers: [1, 2.5, null, true, 5]}, document.operations.FavoriteNumbersQuery, document)).toMatchSnapshot();
    });

    it('validates nested arrays', () => {
      const document = createDocument(`
        type Query { sets: [[Int!]!] }
        schema { query: Query }
      `, 'query SetsQuery { sets }');

      expect(validate({}, document.operations.SetsQuery, document)).toMatchSnapshot();
      expect(validate({sets: null}, document.operations.SetsQuery, document)).toMatchSnapshot();
      expect(validate({sets: []}, document.operations.SetsQuery, document)).toMatchSnapshot();
      expect(validate({sets: [1, 2, 3]}, document.operations.SetsQuery, document)).toMatchSnapshot();
      expect(validate({sets: [[1, 2, null], [true, {}, 3]]}, document.operations.SetsQuery, document)).toMatchSnapshot();
      expect(validate({sets: [null, [1, 2], true]}, document.operations.SetsQuery, document)).toMatchSnapshot();
    });

    it('validates objects nested in arrays', () => {
      const document = createDocument(`
        type Person {
          name: String!
          age: Int!
        }
        type Query { people: [Person!]! }
        schema { query: Query }
      `, 'query PeopleQuery { people { name } }');

      expect(validate({}, document.operations.PeopleQuery, document)).toMatchSnapshot();
      expect(validate({people: null}, document.operations.PeopleQuery, document)).toMatchSnapshot();
      expect(validate({people: []}, document.operations.PeopleQuery, document)).toMatchSnapshot();
      expect(validate({people: [1]}, document.operations.PeopleQuery, document)).toMatchSnapshot();
      expect(validate({people: [{}]}, document.operations.PeopleQuery, document)).toMatchSnapshot();
      expect(validate({people: [{name: true}]}, document.operations.PeopleQuery, document)).toMatchSnapshot();
      expect(validate({people: [{name: 'Chris'}]}, document.operations.PeopleQuery, document)).toMatchSnapshot();
      expect(validate({people: [{name: 'Chris', age: 42}]}, document.operations.PeopleQuery, document)).toMatchSnapshot();
    });
  });

  describe('objects', () => {
    it('validates that the value is actually an object', () => {
      const document = createDocument(`
        type Person { name: String! }
        type Query { person: Person! }
        schema { query: Query }
      `, 'query PersonQuery { person { name } }');

      expect(validate({}, document.operations.PersonQuery, document)).toMatchSnapshot();
      expect(validate({person: null}, document.operations.PersonQuery, document)).toMatchSnapshot();
      expect(validate({person: {}}, document.operations.PersonQuery, document)).toMatchSnapshot();
      expect(validate({person: {name: true}}, document.operations.PersonQuery, document)).toMatchSnapshot();
      expect(validate({person: {name: 'Chris'}}, document.operations.PersonQuery, document)).toMatchSnapshot();
    });

    it('creates errors for keys not present in the query', () => {
      const document = createDocument(`
        type Person {
          name: String!
          age: Int
        }
        type Query { person: Person! }
        schema { query: Query }
      `, 'query PersonQuery { person { name } }');

      expect(validate({person: {name: 'Chris', age: 42}}, document.operations.PersonQuery, document)).toMatchSnapshot();
      expect(validate({person: {name: 'Chris', foo: true}}, document.operations.PersonQuery, document)).toMatchSnapshot();
    });

    it('validates nested objects', () => {
      const document = createDocument(`
        type Address { number: Int }
        type Person { address: Address! }
        type Query { person: Person! }
        schema { query: Query }
      `, 'query AddressQuery { person { address { number } } }');

      expect(validate({}, document.operations.AddressQuery, document)).toMatchSnapshot();
      expect(validate({person: null}, document.operations.AddressQuery, document)).toMatchSnapshot();
      expect(validate({person: {}}, document.operations.AddressQuery, document)).toMatchSnapshot();
      expect(validate({person: {address: {}}}, document.operations.AddressQuery, document)).toMatchSnapshot();
      expect(validate({person: {address: {number: '63'}}}, document.operations.AddressQuery, document)).toMatchSnapshot();
      expect(validate({person: {address: {number: 15.4}}}, document.operations.AddressQuery, document)).toMatchSnapshot();
      expect(validate({person: {address: {number: 63}}}, document.operations.AddressQuery, document)).toMatchSnapshot();
      expect(validate({person: {address: {street: 'Main st'}}}, document.operations.AddressQuery, document)).toMatchSnapshot();
    });
  });

  describe('fragments', () => {
    it('includes fields from inline fragments', () => {
      const document = createDocument(`
        type Person { name: String! }
        type Query { person: Person! }
        schema { query: Query }
      `, 'query PersonQuery { person { ... on Person { name } } }');

      expect(validate({}, document.operations.PersonQuery, document)).toMatchSnapshot();
      expect(validate({person: null}, document.operations.PersonQuery, document)).toMatchSnapshot();
      expect(validate({person: {}}, document.operations.PersonQuery, document)).toMatchSnapshot();
      expect(validate({person: {name: true}}, document.operations.PersonQuery, document)).toMatchSnapshot();
      expect(validate({person: {name: 'Chris'}}, document.operations.PersonQuery, document)).toMatchSnapshot();
      expect(validate({person: {name: 'Chris', age: 42}}, document.operations.PersonQuery, document)).toMatchSnapshot();
    });

    it('includes fields from separate fragments', () => {
      const document = createDocument(`
        type Person { name: String! }
        type Query { person: Person! }
        schema { query: Query }
      `, 'query PersonQuery { person { ...PersonFragment } }', 'fragment PersonFragment on Person { name }');

      expect(validate({}, document.operations.PersonQuery, document)).toMatchSnapshot();
      expect(validate({person: null}, document.operations.PersonQuery, document)).toMatchSnapshot();
      expect(validate({person: {}}, document.operations.PersonQuery, document)).toMatchSnapshot();
      expect(validate({person: {name: true}}, document.operations.PersonQuery, document)).toMatchSnapshot();
      expect(validate({person: {name: 'Chris'}}, document.operations.PersonQuery, document)).toMatchSnapshot();
      expect(validate({person: {name: 'Chris', age: 42}}, document.operations.PersonQuery, document)).toMatchSnapshot();
    });

    it('treats fields on interface type spreads to be nullable', () => {
      const document = createDocument(`
        interface Animal { name: String! }
        type Cat implements Animal {
          name: String!
          purrs: Boolean!
        }
        type Dog implements Animal {
          name: String!
          barks: Boolean!
        }
        type Query { animals: [Animal!]! }
        schema { query: Query }
      `, 'query DogQuery { animals { name, ...DogFragment } }', 'fragment DogFragment on Dog { barks }');

      expect(validate({}, document.operations.DogQuery, document)).toMatchSnapshot();
      expect(validate({animals: null}, document.operations.DogQuery, document)).toMatchSnapshot();
      expect(validate({animals: []}, document.operations.DogQuery, document)).toMatchSnapshot();
      expect(validate({animals: [{}]}, document.operations.DogQuery, document)).toMatchSnapshot();
      expect(validate({animals: [{name: 'Winston'}]}, document.operations.DogQuery, document)).toMatchSnapshot();
      expect(validate({animals: [{name: 'Winston', barks: 40}]}, document.operations.DogQuery, document)).toMatchSnapshot();
      expect(validate({animals: [{name: 'Winston', barks: true}]}, document.operations.DogQuery, document)).toMatchSnapshot();
    });
  });

  // TODO: multiple top-level items
  // TODO: aliases
});

function createDocument(schemaString: string, ...queryStrings: string[]) {
  const schema = buildSchema(schemaString);
  const ast = concatAST(queryStrings.map((queryString) => parse(queryString)));
  return compile(schema, ast);
}
