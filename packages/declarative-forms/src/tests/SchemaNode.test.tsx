/* eslint-disable jest/prefer-strict-equal */
import {SchemaNode, SchemaValidator, ValidatorFn} from '../types';
import {
  DeclarativeFormContext,
  DecorateFunction,
} from '../DeclarativeFormContext';
import {ValidationError} from '../classes/ValidationError';
import {
  defaultSchema,
  expectedValues,
  expectedValuesWithNewSchema,
  newSchema,
} from './fixtures';

import {
  presenceValidator,
  formatValidator,
  lengthValidator,
  rangeValidator,
} from '../utilities/validators';

interface SetupProps extends DeclarativeFormContext {
  decorate: DecorateFunction;
  schema: any;
}

function setup({
  values,
  decorate = (() => {}) as DecorateFunction,
  schema = defaultSchema,
  features = {},
  validators = {},
}: Partial<SetupProps> = {}) {
  const context = new DeclarativeFormContext({
    values,
    decorate,
    features,
    validators,
  });
  const root = new SchemaNode(context, {type: '', attributes: schema});
  return {root};
}

describe('SchemaNode', () => {
  it('creates a root node all fields having a value', () => {
    const {root} = setup();

    expect(root.value).toStrictEqual(expectedValues);
  });

  it('parses the new schema with default values relative to each nodes', () => {
    const {root} = setup({schema: newSchema, values: {}});
    expect(root.data()).toStrictEqual(expectedValuesWithNewSchema);
  });

  it('adds variant flag on detected polymorphic nodes', () => {
    const {root} = setup({
      schema: {
        node1: {
          type: {polymorphic: ['a', 'b']},
          attributes: {a: {}, b: {}},
        },
        node2: {
          type: 'polymorphic',
          attributes: {c: {}, d: {}},
        },
      },
      values: {},
    });
    const {node1, node2} = root.children;
    expect(node1.isVariant).toBe(true);
    expect(node2.isVariant).toBe(true);
    expect(node1.attributes).toStrictEqual(['a', 'b']);
    expect(node2.attributes).toStrictEqual(['c', 'd']);
  });

  it('parses the new schema with default values relative to each nodes', () => {
    const expectedData = [
      {
        someNameNode: 'John',
        someAgeNode: 50,
      },
      {
        someNameNode: 'Jane',
        someAgeNode: 40,
      },
    ];

    const {root} = setup({
      schema: {
        someForm: {
          attributes: {
            someList: {
              type: ['list'],
              value: expectedData,
              attributes: {
                someNameNode: {type: 'string'},
                someAgeNode: {type: 'integer'},
              },
            },
          },
        },
      },
    });

    const nodeValue = root.children.someForm.children.someList.data();
    const rootValue = root.data();

    expect(nodeValue).toHaveLength(2);

    // checks the value on the list node
    expect(nodeValue).toStrictEqual(expectedData);

    // checks that the value is bubbled up to the root
    expect(rootValue).toStrictEqual({
      someForm: {
        someList: expectedData,
      },
    });
  });

  it('parses the new schema with values relative to root', () => {
    const expectedData = [
      {
        someNameNode: 'John',
        someAgeNode: 50,
      },
      {
        someNameNode: 'Jane',
        someAgeNode: 40,
      },
    ];

    const {root} = setup({
      schema: {
        someForm: {
          attributes: {
            someList: {
              type: ['list'],
              attributes: {
                someNameNode: {type: 'string'},
                someAgeNode: {type: 'integer'},
              },
            },
          },
        },
      },
      values: {
        someForm: {
          someList: expectedData,
        },
      },
    });

    const nodeValue = root.children.someForm.children.someList.data();
    const rootValue = root.data();

    expect(nodeValue).toHaveLength(2);

    // checks the value on the list node
    expect(nodeValue).toStrictEqual(expectedData);

    // checks that the value is bubbled up to the root
    expect(rootValue).toStrictEqual({
      someForm: {
        someList: expectedData,
      },
    });
  });

  it('node.subscribe listen to changes and can be unsuscribed from', () => {
    const {root} = setup({schema: newSchema, values: {}});
    const callback = jest.fn();
    const {someNumber} = root.children;
    const unsubscribe = someNumber.subscribe(({value}) => callback(value));

    someNumber.onChange(7);
    expect(callback).toHaveBeenCalledWith(7);

    // try again
    someNumber.onChange(9);
    expect(callback).toHaveBeenCalledWith(9);

    // stop listening
    unsubscribe();
    someNumber.onChange(3);
    expect(callback).not.toHaveBeenCalledWith(3);
  });

  it('names fields based of their path tail value', () => {
    const {root} = setup();

    expect(root.name).toBe('');

    const {someGroup, someNumber, someString, someBool, someVariant} =
      root.children;

    expect(someGroup.name).toBe('someGroup');
    expect(someNumber.name).toBe('someNumber');
    expect(someString.name).toBe('someString');
    expect(someBool.name).toBe('someBool');
    expect(someVariant.name).toBe('someVariant');

    const {someNumberNested, someStringNested} = someGroup.children;

    expect(someNumberNested.name).toBe('someNumberNested');
    expect(someStringNested.name).toBe('someStringNested');
  });

  it('defines path for list using the index as a name', () => {
    const expectedData = [
      {someString: 'abc', someNumber: 1},
      {someString: 'def', someNumber: 2},
    ];
    const {root} = setup({
      schema: {
        someList: {
          value: expectedData,
          type: ['list'],
          attributes: {
            someString: {type: 'string'},
            someNumber: {type: 'integer'},
          },
        },
      },
    });
    expect(root.children.someList.value[0].path.toString()).toBe('someList.0');
    expect(root.children.someList.value[1].path.toString()).toBe('someList.1');
  });

  it('hydrates node by their field name', () => {
    const values = {
      someText: 'abc',
      someNumber: 123,
    };
    const schema = {
      level1: {
        attributes: {
          level2: {
            attributes: {
              someText: {type: 'string'},
              someNumber: {type: 'integer'},
            },
          },
        },
      },
    };
    const {root} = setup({
      schema,
      values,
    });

    const expected = {
      level1: {
        level2: {
          someText: 'abc',
          someNumber: 123,
        },
      },
    };

    expect(root.data()).toStrictEqual(expected);
  });

  it('hydrates node by their shortPath in priority', () => {
    const values = {
      level1: {
        level2: {someText: 'good'},
        someText: 'bad 1',
      },
      someText: 'bad 2',
      level2: {someText: 'bad 3'},
      'level1.level2.someText': 'bad 4',
      'level2.someText': 'bad 5',
    };
    const schema = {
      level1: {
        attributes: {
          level2: {
            attributes: {
              someText: {
                type: 'string',
              },
            },
          },
        },
      },
    };
    const {root} = setup({
      schema,
      values,
    });

    const expected = {
      level1: {
        level2: {
          someText: 'good',
        },
      },
    };

    expect(root.data()).toStrictEqual(expected);
  });

  it('converts node values according to their types', () => {
    const values = {
      someNumberNested: '14',
      someStringNested: 14,
      someNumber: '42',
      someString: 42,
      someBool: 1,
      someVariant: 'asString',
      someVariantString: 13,
    };
    const {root} = setup({values});

    const expected = {
      ...expectedValues,
      someGroup: {
        someNumberNested: 14,
        someStringNested: '14',
      },
      someNumber: 42,
      someString: '42',
      someBool: true,
      someVariant: {
        someVariantType: 'asString',
        someVariantString: '13',
      },
    };

    expect(root.value).toStrictEqual(expected);

    // Try with delinquent components changes
    root.children.someString.onChange(42);
    root.children.someNumber.onChange('42');
    root.children.someBool.onChange(1);

    expect(root.data()).toStrictEqual(expected);
  });

  describe('calling `onChange` propagates in both direction', () => {
    it('changes the value of parents until it reaches the root', () => {
      const {root} = setup();

      const {someNumberNested} = root.children.someGroup.children;
      const {someVariant} = root.children;
      const {someVariantNumber} = someVariant.children.asInt.children;

      someNumberNested.onChange(42);
      someVariant.onChange('asInt');
      someVariantNumber.onChange(10);

      const expected = {
        ...expectedValues,
        someGroup: {
          ...expectedValues.someGroup,
          someNumberNested: 42,
        },
        someVariant: {
          someVariantType: 'asInt',
          someVariantNumber: 10,
        },
      };

      expect(root.value).toStrictEqual(expected);
    });

    it('changes the value of children', () => {
      const values = {someNumberNested: 0, someStringNested: ''};
      const {root} = setup({values});
      const {someGroup} = root.children;
      const {someNumberNested, someStringNested} = someGroup.children;

      expect(someGroup.value).toStrictEqual(values);
      expect(someNumberNested.value).toStrictEqual(0);
      expect(someStringNested.value).toStrictEqual('');

      someGroup.onChange({
        someNumberNested: 123,
        someStringNested: 'abc',
      });

      const expected = {
        ...expectedValues,
        someGroup: {
          ...expectedValues.someGroup,
          someNumberNested: 123,
          someStringNested: 'abc',
        },
      };

      expect(root.value).toStrictEqual(expected);
      expect(someGroup.value).toStrictEqual(expected.someGroup);
      expect(someNumberNested.value).toStrictEqual(123);
      expect(someStringNested.value).toStrictEqual('abc');
    });
  });

  it('shows full path', () => {
    const {root} = setup();

    expect(root.path.toString()).toBe('');

    const {someGroup, someVariant} = root.children;

    expect(someGroup.path.toString()).toBe('someGroup');
    expect(someVariant.path.toString()).toBe('someVariant');

    const {someNumberNested} = someGroup.children;

    expect(someNumberNested.path.toString()).toBe('someGroup.someNumberNested');

    someVariant.onChange('asList');
    const {asList} = someVariant.children;

    expect(asList.path.toString()).toBe('someVariant.asList');

    const {someVariantList} = asList.children;

    expect(someVariantList.path.toString()).toBe(
      'someVariant.asList.someVariantList',
    );

    someVariantList.addListItem();
    const [index0] = someVariantList.value;

    expect(index0.path.toString()).toBe('someVariant.asList.someVariantList.0');

    const {someNameNode} = index0.children;

    expect(someNameNode.path.toString()).toBe(
      'someVariant.asList.someVariantList.0.someNameNode',
    );
  });

  it('shows truncated paths', () => {
    const {root} = setup();

    expect(root.path.toStringShort()).toBe('');

    const {someVariant} = root.children;

    expect(someVariant.path.toStringShort()).toBe('someVariant');

    someVariant.onChange('asList');
    const {asList} = someVariant.children;

    expect(asList.path.toStringShort()).toBe('someVariant');
    expect(asList.path.toStringShort(true)).toBe('someVariant[asList]');

    const {someVariantList} = asList.children;

    expect(someVariantList.path.toStringShort()).toBe(
      'someVariant.someVariantList',
    );
    expect(someVariantList.path.toStringShort(true)).toBe(
      'someVariant[asList].someVariantList',
    );

    someVariantList.addListItem();
    const {someNameNode} = someVariantList.value[0].children;

    expect(someNameNode.path.toStringShort()).toBe(
      'someVariant.someVariantList.someNameNode',
    );
    // show lists
    expect(someNameNode.path.toStringShort(false, true)).toBe(
      'someVariant.someVariantList[0].someNameNode',
    );
    // show variants
    expect(someNameNode.path.toStringShort(true, false)).toBe(
      'someVariant[asList].someVariantList.someNameNode',
    );
    // show variants and lists
    expect(someNameNode.path.toStringShort(true, true)).toBe(
      'someVariant[asList].someVariantList[0].someNameNode',
    );
  });

  it('does not convert to type if the initial value is null', () => {
    const values = {
      someNumber: null,
      someString: null,
      someBool: null,
      someGroup: null,
    };
    const {root} = setup({values});

    const expected = {
      ...expectedValues,
      someNumber: null,
      someString: null,
      someBool: null,
      someGroup: null,
    };

    expect(root.value).toStrictEqual(expected);
  });

  it('keeps track of the dirty state', () => {
    const values = {someNumber: 50};
    const {root} = setup({values});

    const {someNumber} = root.children;

    expect(someNumber.dirty).toBe(false);

    someNumber.onChange(25);

    expect(someNumber.dirty).toBe(true);

    someNumber.resetNodeValue();

    expect(someNumber.dirty).toBe(false);
  });

  it('[legacy feature] preselects the first option when the value is not valid', () => {
    const values = {someOptionNode: 'not_found'};
    const {root} = setup({values, features: {defaultOptionToFirstValue: true}});
    const {someVariant} = root.children;

    someVariant.onChange('asOption');

    expect(root.value.someVariant.someOptionNode).toBe('a');
  });

  it('does not preselects the first option when the value is not valid', () => {
    const values = {someOptionNode: 'not_found'};
    const {root} = setup({
      values,
      features: {defaultOptionToFirstValue: false},
    });
    const {someVariant} = root.children;

    someVariant.onChange('asOption');

    expect(root.value.someVariant.someOptionNode).toBe('not_found');
  });

  describe('fields validation', () => {
    it('does not report validation errors for Format', () => {
      const {root} = setup({
        values: {
          stringNode: 'AAA',
        },
        schema: {
          stringNode: {
            type: 'string',
            validators: [{name: 'Format', format: '0x[a-f0-8]{6}'}],
          },
        },
      });

      expect(root.children.stringNode.validate()).toHaveLength(0);
    });

    it('reports validation errors for Format if the feature is enabled', () => {
      const {root} = setup({
        features: {enableFormatValidator: true},
        values: {
          stringNode: 'AAA',
        },
        schema: {
          stringNode: {
            type: 'string',
            validators: [{name: 'Format', format: '0x[a-f0-8]{6}'}],
          },
        },
      });

      expect(root.children.stringNode.validate()).toStrictEqual([
        expect.objectContaining({
          type: 'Format',
        }),
      ]);

      root.children.stringNode.onChange('0xaef234');

      expect(root.children.stringNode.validate()).toHaveLength(0);
    });

    it('marks valid when created with the right values', () => {
      const {root} = setup({
        values: {
          someStringNested: '',
          someString: 'AZ',
        },
      });

      const {someString, someGroup} = root.children;
      const {someStringNested} = someGroup.children;

      expect(someString.isValid()).toBe(true);
      expect(someStringNested.isValid()).toBe(true);
      expect(root.isValid()).toBe(true);
    });

    it('defers error validation when asyncValidation is true', () => {
      const {root} = setup({
        values: {
          someStringNested: '',
          someString: 'AZ',
        },
        features: {
          asyncValidation: true,
        },
      });

      const {someString, someGroup} = root.children;
      const {someStringNested} = someGroup.children;
      someString.onChange('a');
      someStringNested.onChange('a');

      expect(someString.isValid()).toBe(true);
      expect(someStringNested.isValid()).toBe(true);
      expect(root.isValid()).toBe(true);
    });

    it('validates errors asynchronously when asyncValidation is true', () => {
      const expected = {
        errors: [
          {
            type: 'MinimumLength',
            data: {
              message: undefined,
              minimum: 3,
            },
          },
        ],
        isValid: false,
      };

      const {root} = setup({
        values: {
          someStringNested: '',
          someString: 'AZ',
        },
        features: {
          asyncValidation: true,
        },
      });

      const {someString, someGroup} = root.children;
      const {someStringNested} = someGroup.children;
      someString.onChange('a');
      someStringNested.onChange('a');

      expect(someString.isValid()).toBe(true);
      expect(someStringNested.isValid()).toBe(true);
      expect(root.isValid()).toBe(true);

      const isValid = root.validateAll();

      expect(someString.isValid()).toBe(true);
      expect(someStringNested.isValid()).toBe(false);
      expect(root.isValid()).toBe(false);
      expect(isValid).toEqual(expected);

      someStringNested.onChange('aaa');

      expect(someString.isValid()).toBe(true);
      expect(someStringNested.isValid()).toBe(true);
      expect(root.isValid()).toBe(true);
    });

    it('marks invalid when created with the wrong values', () => {
      const {root} = setup({
        values: {
          someStringNested: 'z',
          someString: '',
        },
      });

      const {someString, someGroup} = root.children;
      const {someStringNested} = someGroup.children;

      expect(someString.isValid()).toBe(false);
      expect(someStringNested.isValid()).toBe(false);
      expect(root.isValid()).toBe(false);
    });

    it('marks valid when changed with the right values', () => {
      const {root} = setup({
        values: {
          someStringNested: 'z',
          someString: 'w',
        },
      });

      const {someString, someGroup} = root.children;
      const {someStringNested} = someGroup.children;
      someString.onChange('AZ');
      someStringNested.onChange('');

      expect(someString.isValid()).toBe(true);
      expect(someStringNested.isValid()).toBe(true);
      expect(root.isValid()).toBe(true);
      expect(someString.validate()).toStrictEqual([]);
      expect(someStringNested.validate()).toStrictEqual([]);
    });

    it('marks invalid when changed with the wrong values', () => {
      const {root} = setup({
        values: {
          someStringNested: '',
          someString: 'AZ',
        },
      });

      const {someString, someGroup} = root.children;
      const {someStringNested} = someGroup.children;
      someString.onChange('a');
      someStringNested.onChange('a');

      expect(someString.isValid()).toBe(true);
      expect(someStringNested.isValid()).toBe(false);
      expect(root.isValid()).toBe(false);
    });

    describe('when changed from a non leaf node', () => {
      it('marks invalid when changed with the wrong values', () => {
        const {root} = setup({
          values: {
            someStringNested: '',
            someString: 'AZ',
          },
        });

        const {someString, someGroup} = root.children;
        const {someStringNested} = someGroup.children;
        someGroup.onChange({
          someNumberNested: 'a',
          someStringNested: 'a',
        });

        expect(someString.isValid()).toBe(true);
        expect(someStringNested.isValid()).toBe(false);
        expect(root.isValid()).toBe(false);
      });

      it('marks valid when changed with the right values', () => {
        const {root} = setup({
          values: {
            someStringNested: 'a',
            someString: 'a',
          },
        });

        const {someString, someGroup} = root.children;
        const {someStringNested} = someGroup.children;
        someGroup.onChange({
          someNumberNested: 3,
          someStringNested: 'AZF',
        });

        expect(someString.isValid()).toBe(true);
        expect(someStringNested.isValid()).toBe(true);
        expect(root.isValid()).toBe(true);
      });
    });
  });

  describe('isClone()', () => {
    it('returns true if node was created through cloning', () => {
      const {clonedNode, originalNode} = setupClones();
      expect(clonedNode.isClone()).toBe(true);
      expect(originalNode.isClone()).toBe(false);
    });
  });

  describe('getOriginalNode()', () => {
    it('returns the original node from which this one was cloned', () => {
      const {clonedNode, originalNode} = setupClones();
      expect(clonedNode.getOriginalNode()).toBe(originalNode);
    });
  });

  describe('isSameValueAsCloned()', () => {
    it('returns true if the cloned node has the same value as the original one', () => {
      const {clonedNode} = setupClones();
      expect(clonedNode.isSameValueAsCloned()).toBe(true);
    });

    it("returns false if the cloned node's value differ from the original one", () => {
      const {clonedNode, originalNode} = setupClones();
      clonedNode.onChange('a');

      expect(clonedNode.isSameValueAsCloned()).toBe(false);
      clonedNode.onChange(originalNode.value);
      expect(clonedNode.isSameValueAsCloned()).toBe(true);
      originalNode.onChange('a');
      expect(clonedNode.isSameValueAsCloned()).toBe(false);
    });
  });

  describe(`methods restricted to cloned nodes`, () => {
    ['isClone', 'getOriginalNode', 'isSameValueAsCloned'].forEach((method) => {
      it(`throws for SchemaNode.${method}()`, () => {
        const {clonedNode, originalNode} = setupClones();
        expect(() => originalNode.isSameValueAsCloned()).toThrow(Error);
        expect(() => clonedNode.isSameValueAsCloned()).not.toThrow(Error);
      });
    });
  });

  describe('.clone()', () => {
    it('creates a new node', () => {
      const {clonedNode, originalNode} = setupClones();
      expect(clonedNode).not.toBe(originalNode);
    });

    it('does not have effect on the origin node', () => {
      const {clonedNode, originalNode} = setupClones();
      const spy = jest.fn((node) => node.value);
      originalNode.subscribe(spy);
      spy.mockReset();
      expect(spy).not.toHaveBeenCalled();
      clonedNode.onChange('changed_value');
      expect(spy).not.toHaveBeenCalled();
      originalNode.onChange('changed_value');
      expect(spy).toHaveBeenCalled();
    });

    it('sharedContext is shared between clones and originals', () => {
      const {clonedNode, originalNode} = setupClones();

      originalNode.context.updateContext('a', 1);
      expect(originalNode.context.sharedContext.a).toBe(1);
      expect(clonedNode.context.sharedContext.a).toBe(1);

      clonedNode.context.updateContext({a: 3});
      expect(clonedNode.context.sharedContext.a).toBe(3);
      expect(originalNode.context.sharedContext.a).toBe(3);
    });
  });

  describe('data manipulation for `isList`', () => {
    const values = {
      someNameNode: 'Jerry',
      someLastNameNode: 'Smith',
      someAgeNode: null,
    };

    it('hydrates list items with default intial values', () => {
      const {root} = setup({values});
      const {someVariant} = root.children;
      someVariant.onChange('asList');
      const {someVariantList} = someVariant.children.asList.children;
      someVariantList.addListItem();
      const [item0] = someVariantList.value;
      const {someNameNode, someLastNameNode, someAgeNode} = item0.children;

      const expectedItem = {
        someNameNode: 'Jerry',
        someLastNameNode: 'Smith',
        someAgeNode: null,
      };

      expect(someNameNode.value).toBe(expectedItem.someNameNode);
      expect(someNameNode.value).toBe(expectedItem.someNameNode);
      expect(someLastNameNode.value).toBe(expectedItem.someLastNameNode);
      expect(someAgeNode.value).toBe(expectedItem.someAgeNode);
      expect(item0.value).toStrictEqual(expectedItem);
      expect(item0.data()).toStrictEqual(expectedItem);

      const expected = {
        ...expectedValues,
        someVariant: {
          someVariantType: 'asList',
          someVariantList: [expectedItem],
        },
      };

      expect(root.value).toStrictEqual(expected);
    });

    it('hydrates list items with specific node intial values, excluding global values', () => {
      function decorate(context: DeclarativeFormContext) {
        context.addInitialValuesAfterNode('someVariantList', {
          someNameNode: 'Tom',
          someAgeNode: 0,
        });
      }

      const {root} = setup({values, decorate});
      const {someVariant} = root.children;
      someVariant.onChange('asList');
      const {someVariantList} = someVariant.children.asList.children;
      someVariantList.addListItem();
      const [item0] = someVariantList.value;
      const {someNameNode, someLastNameNode, someAgeNode} = item0.children;

      const expectedItem = {
        someNameNode: 'Tom',
        someLastNameNode: '',
        someAgeNode: 0,
      };

      expect(someNameNode.value).toBe(expectedItem.someNameNode);
      expect(someLastNameNode.value).toBe(expectedItem.someLastNameNode);
      expect(someAgeNode.value).toBe(expectedItem.someAgeNode);
      expect(item0.value).toStrictEqual(expectedItem);
      expect(item0.data()).toStrictEqual(expectedItem);

      const expected = {
        ...expectedValues,
        someVariant: {
          someVariantType: 'asList',
          someVariantList: [expectedItem],
        },
      };

      expect(root.value).toStrictEqual(expected);
    });
  });

  describe('isList', () => {
    describe('nested value initialization', () => {
      it('initializes nested values from list value array', () => {
        const value = [
          {
            name: {
              first: 'Matt',
              last: 'Hagner',
            },
            address: {
              address1: '1 Fake St',
              address2: '#23',
              city: 'Minneapolis',
              province: 'MN',
              country: 'US',
              zip: '55555',
            },
          },
        ];
        const {root} = setup({
          schema: {
            list: {
              type: ['person'],
              value,
              attributes: {
                name: {
                  attributes: {
                    first: {
                      type: 'string',
                    },
                    last: {
                      type: 'string',
                    },
                  },
                },
                address: {
                  attributes: {
                    address1: {
                      type: 'string',
                    },
                    address2: {
                      type: 'string',
                    },
                    city: {
                      type: 'string',
                    },
                    zip: {
                      type: 'string',
                    },
                    province: {
                      type: 'string',
                    },
                    country: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        });

        expect(root.children.list.data()).toStrictEqual(value);
      });
    });
  });
});

describe('validateAll()', () => {
  describe('when variant', () => {
    it('only validates the currently selected tree', () => {
      const {root} = setup({
        schema: {
          form: {
            attributes: {
              polymorphic: {
                type: 'polymorphic',
                value: 'one',
                attributes: {
                  one: {
                    type: 'string',
                    validators: [
                      {name: 'Presence', message: 'One is required'},
                    ],
                  },
                  two: {
                    type: 'string',
                    validators: [
                      {name: 'Presence', message: 'Two is required'},
                    ],
                  },
                },
              },
            },
          },
        },
      });

      const form = root.children.form;

      const {isValid, errors} = form.validateAll();

      expect(isValid).toStrictEqual(false);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toStrictEqual('Presence');
      expect(errors[0].data?.message).toStrictEqual('One is required');
    });

    it('still validates all non-descendants', () => {
      const {root} = setup({
        schema: {
          form: {
            attributes: {
              siblingA: {
                type: 'string',
                validators: [
                  {name: 'Presence', message: 'siblingA is required'},
                ],
              },
              siblingB: {
                type: 'address',
                attributes: {
                  street: {
                    type: 'string',
                    validators: [
                      {name: 'Presence', message: 'street is required'},
                    ],
                  },
                },
              },
              polymorphic: {
                type: 'polymorphic',
                value: 'one',
                attributes: {
                  one: {
                    type: 'string',
                    validators: [
                      {name: 'Presence', message: 'One is required'},
                    ],
                  },
                  two: {
                    type: 'string',
                    validators: [
                      {name: 'Presence', message: 'Two is required'},
                    ],
                  },
                },
              },
            },
          },
        },
      });

      const form = root.children.form;
      const {isValid, errors} = form.validateAll();
      expect(isValid).toStrictEqual(false);
      expect(errors).toHaveLength(3);

      const messages = errors.map((error) => error.data?.message ?? '');

      expect(messages).toContain('siblingA is required');
      expect(messages).toContain('street is required');
      expect(messages).toContain('One is required');
    });
  });

  describe('validators', () => {
    it('accepts all the default validators and custom ones [TS]', () => {
      interface CustomValidatorOptions {
        even: boolean;
        validZero?: boolean;
      }

      // this test is mostly a sanity check for TS Types usage

      const customValidator: ValidatorFn = (
        value: number,
        {even, validZero = true}: SchemaValidator<CustomValidatorOptions>,
        _node: SchemaNode,
      ): ValidationError | null => {
        if (!validZero && value === 0) {
          return new ValidationError('Custom', {message: 'Must not be zero'});
        }
        if (even && value % 2 !== 0)
          return new ValidationError('Custom', {message: 'Must be even'});

        if (!even && value % 2 === 0)
          return new ValidationError('Custom', {message: 'Must be odd'});

        return null;
      };

      const {root} = setup({
        validators: {
          Presence: presenceValidator,
          Format: formatValidator,
          Length: lengthValidator,
          Range: rangeValidator,
          EvenNumber: customValidator,
        },
      });

      expect(root.context.validators.EvenNumber).toBe(customValidator);
    });
  });
});

function setupClones() {
  const {root} = setup();
  const originalNode = root.children.someString;
  const clonedNode = originalNode.clone();
  return {originalNode, clonedNode};
}
