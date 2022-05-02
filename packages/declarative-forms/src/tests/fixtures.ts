export const validatorsFixtures = {
  Presence: {name: 'Presence'},
  Format: {name: 'Format', format: '[A-Z]{2}'},
  Length: {name: 'Length', minimum: 3, maximum: 5},
};

export const expectedValuesWithNewSchema = {
  someGroup: {
    someNumberNested: 3,
    someStringNested: 'abc',
  },
  someBool: true,
  someNumber: 4,
  someString: 'def',
  someVariant: {
    someVariantType: 'asString',
    someVariantString: 'xyz',
  },
};

export const newSchema = {
  someString: {
    value: 'def',
    type: 'string',
    validators: [validatorsFixtures.Presence, validatorsFixtures.Format],
  },
  someNumber: {
    value: 4,
    type: 'integer',
  },
  someBool: {
    value: true,
    type: 'boolean',
  },
  someGroup: {
    attributes: {
      someStringNested: {
        value: 'abc',
        validators: [validatorsFixtures.Length],
        type: 'string',
      },
      someNumberNested: {
        value: 3,
        type: 'integer',
      },
    },
  },
  someVariant: {
    type: {polymorphic: ['list']},
    value: 'asString',
    attributes: {
      asString: {
        attributes: {
          someVariantString: {
            value: 'xyz',
            type: 'string',
          },
        },
      },
      asInt: {
        attributes: {
          someVariantNumber: {
            value: 3,
            type: 'integer',
          },
        },
      },
      asBool: {
        attributes: {
          someVariantBool: {
            type: 'boolean',
          },
        },
      },
      asList: {
        attributes: {
          someVariantList: {
            type: ['list'],
            value: [
              {
                someNameNode: 'John',
                someLastNameNode: 'Smith',
                someAgeNode: 50,
              },
              {
                someNameNode: 'Jane',
                someLastNameNode: 'Smith',
                someAgeNode: 40,
              },
            ],
            attributes: {
              someNameNode: {
                type: 'string',
              },
              someLastNameNode: {
                type: 'string',
              },
              someAgeNode: {
                type: 'integer',
              },
            },
          },
        },
      },
      asOption: {
        attributes: {
          someOptionNode: {
            type: 'string',
            options: ['a', 'b', 'c'],
          },
        },
      },
    },
  },
};

export const defaultSchema = {
  someString: {
    type: 'string',
    validators: [validatorsFixtures.Presence, validatorsFixtures.Format],
  },
  someNumber: {
    type: 'integer',
  },
  someBool: {
    type: 'boolean',
  },
  someGroup: {
    attributes: {
      someStringNested: {
        validators: [validatorsFixtures.Length],
        type: 'string',
      },
      someNumberNested: {
        type: 'integer',
      },
    },
  },
  someVariant: {
    type: {polymorphic: ['list']},
    attributes: {
      asString: {
        attributes: {
          someVariantString: {
            type: 'string',
          },
        },
      },
      asInt: {
        attributes: {
          someVariantNumber: {
            type: 'integer',
          },
        },
      },
      asBool: {
        attributes: {
          someVariantBool: {
            type: 'boolean',
          },
        },
      },
      asList: {
        attributes: {
          someVariantList: {
            type: ['list'],
            attributes: {
              someNameNode: {
                type: 'string',
              },
              someLastNameNode: {
                type: 'string',
              },
              someAgeNode: {
                type: 'integer',
              },
            },
          },
        },
      },
      asOption: {
        attributes: {
          someOptionNode: {
            type: 'string',
            options: ['a', 'b', 'c'],
          },
        },
      },
    },
  },
};

export const expectedValues = {
  someGroup: {
    someNumberNested: 0,
    someStringNested: '',
  },
  someBool: false,
  someNumber: 0,
  someString: '',
  someVariant: {},
};
