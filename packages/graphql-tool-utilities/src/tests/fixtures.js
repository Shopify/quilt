export const possibleTypes = {
    ConfigField: [
        'ArrayConfigField',
        'BooleanConfigField',
        'CollectionsConfigField',
        'CommerceObjectConfigField',
        'DurationConfigField',
        'FloatConfigField',
        'IntegerConfigField',
        'MapConfigField',
        'MarketingActivityConfigField',
        'RecurrenceConfigField',
        'SelectConfigField',
        'ShippingCarrierServicesConfigField',
        'ShippingPackageConfigField',
        'TextConfigField',
        'WeightConfigField'
    ],
    EnvironmentTypeDefinition: [
        'EnvironmentEnumDefinition',
        'EnvironmentInterfaceDefinition',
        'EnvironmentObjectDefinition',
        'EnvironmentScalarDefinition',
        'EnvironmentUnionDefinition'
    ],
    Operation: [
        'ArrayExpression',
        'Comparison',
        'EnvironmentValue',
        'LiteralValue',
        'LogicalExpression'
    ],
    TemplateConfigField: ['ArrayConfigField', 'MapConfigField', 'TextConfigField'],
    ValidationError: ['StepValidationError', 'WorkflowValidationError']
};
