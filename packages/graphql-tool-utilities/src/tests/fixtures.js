export const possibleTypes = {
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
