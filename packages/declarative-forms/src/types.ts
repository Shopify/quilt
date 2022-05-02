import {action, computed, makeObservable, observable, autorun} from 'mobx';
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';

import {Path} from './classes/Path';
import {ValidationError} from './classes/ValidationError';
import {PathSegment} from './classes/PathSegment';

// Utils and functions
export type NodeKind = string;
export type NodeValue = any;
export type ReactComponent = any;
export type FormatterFn = (value: any, type: string, node: SchemaNode) => any;
interface ObjectMap<T = any> {
  [key: string]: T;
}
type TranslatorKey =
  | 'default'
  | 'label'
  | 'error'
  | 'helpText'
  | 'placeholder'
  | 'description'
  | string;

export interface TranslatorArgs extends ObjectMap {
  key?: TranslatorKey;
  error?: ValidationError | null;
  // translators and `node.translate` can invokes can use any sort of additional arguments
}

export type TranslatorFn = (node: SchemaNode, args?: TranslatorArgs) => string;

export type ValidatorFn<T extends ObjectMap = any> = (
  val: NodeValue,
  options: SchemaValidator<T>,
  node: SchemaNode,
) => ValidationError | null;

/**
 * used to map errors to their fields py short paths.
 * the generic key is a placeholder for when
 * an error is not matchable to a path
 */
export interface ContextErrors extends ObjectMap<string[]> {
  generic: string[];
}

/**
 * used to bubble up all errors from a given point down in the
 * tree and return the node's isValid value
 */
export interface ValidateAll {
  errors: ValidationError[];
  isValid: boolean;
}

interface BaseSchemaValidator {
  name: string;
  message?: string;
}

export type SchemaValidator<
  T extends ObjectMap = ObjectMap
> = BaseSchemaValidator & T;

export interface SchemaNodeServerDefinition {
  type?: NodeKind | NodeKind[] | {polymorphic: string[]};
  watch?: string;
  value?: any;
  labels?: LabelDictionnary;
  attributes?: ObjectMap<SchemaNodeServerDefinition>;
  validators?: SchemaValidator<ObjectMap>[];
  meta?: ObjectMap;
  options?: string[];
}

type LabelDictionnary = ObjectMap<string | LabelDictionnary>;

/**
 * Internal definition of the schema
 */
export interface SchemaNodeDefinition {
  type: NodeKind;
  watch?: string;
  value?: any;
  labels?: LabelDictionnary;
  attributes?: ObjectMap<SchemaNodeDefinition>;
  validators?: SchemaValidator[];
  meta?: ObjectMap;
  options?: string[];
}

// Components

/**
 * React properties used for declarative-forms custom components
 * You can pass as `T` the return type in {@link SchemaNode.data} of the {@link SchemaNode}
 **/
export interface NodeProps<T extends NodeValue = NodeValue> {
  node: SchemaNode<T>;
  children?: React.ReactNode;
}

/**
 * Contains default values that are used by declarative-forms's internals
 * context.sharedContext can be used by the consumer's code but should
 * be typed extending this interface for better typecheck
 */
export interface SharedContext extends ObjectMap {
  focusedNode?: string;
  debug?: boolean;
  debugNextReaction?: boolean;
  errors?: ContextErrors;
}

// used internaly only
export interface FormContext<T extends SharedContext = SharedContext> {
  features: {
    /** controls if an node of type `option` with no `value` should be initially set to the first option */
    defaultOptionToFirstValue?: boolean;
    /**
     * False by default
     * When enabled, changing a node's value will not trigger a validation instantly.
     * the user will have to manually call validate on the node to compute errors.
     */
    asyncValidation?: boolean;
    /**
     * False by default
     * Format is disabled until core fixes the js regexes sent.
     * We formely had issues in production with ruby patterns such as `\p{Katakana}` and `\p{Hiragana}`
     * which didn't translated into a valid regex.
     */
    enableFormatValidator?: boolean;
    /**
     * Tells the library what to do when a node is being
     * created using a path that was already taken.
     * the path pointer will always point to the last created node unless `throw` is used.
     */
    nodePathCollision?: 'throw' | 'warn' | 'ignore';
  };
  sharedContext: T;
  nodes: Map<string, SchemaNode>;
  validators: ObjectMap<ValidatorFn> & {
    Presence?: ValidatorFn<ObjectMap>;
    Length?: ValidatorFn<ObjectMap>;
    Format?: ValidatorFn<ObjectMap>;
  };
  values: ObjectMap;
  formatters: ObjectMap<FormatterFn> & {
    local?: FormatterFn;
    remote?: FormatterFn;
  };
  translators: ObjectMap<TranslatorFn> & {
    label?: TranslatorFn;
    error?: TranslatorFn;
  };
  decorators: Decorator[];
  where(fn: DecoratorMatcher): Omit<Decorator, 'apply'>;
  updateContext<K extends keyof FormContext<T>['sharedContext']>(
    valueOrKey: K | Partial<FormContext<T>['sharedContext']>,
    value?: FormContext<T>['sharedContext'][K],
  ): void;
  focusField(fieldPath: string): void;
  addInitialValuesAfterNode(
    nodeName: SchemaNode['name'],
    values: FormContext['values'],
  ): void;
}

// Decorators
const slotNames = ['Before', 'After', 'Wrap', 'Pack', 'Replace'] as const;
export type DecoratorKeys = typeof slotNames[number];

interface DecoratorSlot {
  Node?: ReactComponent;
  props?: object | Function;
}

/**
 * Using a subset of {@link SchemaNode} since decoration happens only at the construction of the schema and dynamic values don't retrigger decorators for performance and dependency reasons.
 */
export type SchemaNodeDecoratorSafeAttributes = Pick<
  SchemaNode,
  | 'type'
  | 'name'
  | 'depth'
  | 'isList'
  | 'isVariant'
  | 'schema'
  | 'path'
  | 'pathShort'
  | 'pathVariant'
  | 'attributes'
  | 'required'
  // less prefered selectors as they might change dynamically
  | 'parentNode'
  | 'getNodeByPath'
  | 'decorator'
  | 'context'
  | 'isValid'
>;

type DecoratorMatcher = (node: SchemaNodeDecoratorSafeAttributes) => boolean;

// decorator props to components
type Noop = (props: any) => React.ReactNode;

// All props of a function (or React component)
type GetProps<T extends Noop> = T extends (args: infer P) => any ? P : never;

/**
 * Usual excluded props in custom components,
 */

export type GenericExcludedComponentProps = 'onChange' | 'value';

/**
 * Used to defines properties of a function without the usual schema node props
 * This is usefull to know what properties are expected from a library consumer point of view
 */
export type SpecialProps<
  T extends Noop,
  E extends
    | GenericExcludedComponentProps
    | string = GenericExcludedComponentProps
> = Omit<GetProps<T>, keyof NodeProps | E>;

/**
 * Used to defines Props (or a function returning Props) for a function without
 * the usual schema node props and it's children. That way we can only focus on
 * the special Props without knowing about the library's internals
 */
export type DecoratorPropsGetter<T extends Noop> =
  | SpecialProps<T>
  | ((node: SchemaNode) => SpecialProps<T>);

interface RegisteredDecorations {
  Before?: DecoratorSlot;
  After?: DecoratorSlot;
  Wrap?: DecoratorSlot;
  Pack?: DecoratorSlot;
  Replace?: DecoratorSlot;
}

/**
 * This is an class that holds the information about decoration registered for each {@link SchemaNode}
 */
export class Decorator {
  private Before?: DecoratorSlot;
  private After?: DecoratorSlot;
  private Wrap?: DecoratorSlot;
  private Pack?: DecoratorSlot;
  private Replace?: DecoratorSlot;

  constructor(private match: DecoratorMatcher) {}

  /**
   * Used internaly, this is being called by all {@link SchemaNode} in order to know
   * if they are concerned with that decorator
   */
  public apply(node: SchemaNode) {
    if (this.match(node)) {
      slotNames.forEach((key) => {
        if (this[key]) node.decorator[key] = this[key];
      });
    }
  }

  /**
   * the passed custom component will replace the node's current component
   */
  public replaceWith<T extends Noop>(fc: T, props?: DecoratorPropsGetter<T>) {
    return this.store('Replace', fc, props);
  }

  /**
   * the passed custom component will be placed before the node's current component
   */
  public prependWith<T extends Noop>(fc: T, props?: DecoratorPropsGetter<T>) {
    return this.store('Before', fc, props);
  }

  /**
   * the passed custom component will be placed after the node's current component
   */
  public appendWith<T extends Noop>(fc: T, props?: DecoratorPropsGetter<T>) {
    return this.store('After', fc, props);
  }

  /**
   * the passed custom component will wrap arround the node's current component
   * the props `children` will represents the node's current rendered component inside the custom component
   */
  public wrapWith<T extends Noop>(fc: T, props?: DecoratorPropsGetter<T>) {
    return this.store('Wrap', fc, props);
  }

  /**
   * similar to `wrapWith` but the passed custom component will wrap
   * around the node's components including other attached decorators
   * such as the ones added from prependWith, appendWith and wrapWith decoration verbs
   */
  public packWith<T extends Noop>(fc: T, props?: DecoratorPropsGetter<T>) {
    return this.store('Pack', fc, props);
  }

  private store<T extends Noop>(
    slotName: DecoratorKeys,
    fc: T,
    props?: DecoratorPropsGetter<T>,
  ): Omit<Decorator, 'apply'> {
    this[slotName] = {Node: fc, props};
    return this;
  }
}

export type NodeChildrenMap = ObjectMap<SchemaNode>;

const NO_VALUE = Symbol('');

type NodeSource = 'child' | 'parent' | 'self';

export const CLONED_SYMBOL = '__cloned__';

/**
 * this represent a highly interactable node of a form schema that is
 * observable with {@link useNode} in order to notify React that attributes have been mutated.
 */
export class SchemaNode<T extends NodeValue = NodeValue> {
  public errors: ValidationError[] = [];

  /**
   * List of nodes with their names as a key
   */
  public children: NodeChildrenMap = {};

  /**
   * Converted schema received from the backend
   */
  public schema: SchemaNodeDefinition = {type: 'not_set'};
  public isList = false;

  /**
   * True if the node is a polymorphic node
   * Polymorphic nodes select their variant(s) to display
   * The selection name is held in the value attribue
   */
  public isVariant = false;

  /**
   * Cached list of all the children key names
   */
  public attributes: string[] = [];
  public depth: number;
  public name: string;
  public type = '';
  public dirty = false;
  public invalidChildren: Map<string, true> = new Map();
  public decorator: RegisteredDecorations = {};

  /**
   * Indicates if this node's value is mandatory'
   */
  public required = false;

  /**
   * valid can be false without errors registered when it fails validation
   * before the user change it's value. It is usefull to prevent submitting
   * a form that was prefilled with wrong values.
   * It is privately used in isValid() public method for that reason.
   */
  private valid = false;

  constructor(
    public context: FormContext,
    schema: SchemaNodeServerDefinition,
    public path: Path = new Path(),
    public value: NodeValue = NO_VALUE,
    private updateParent: SchemaNode['onChildrenChange'] = () => {},
  ) {
    this.depth = path.segments.length;
    this.name = path.tail.toString();

    // the following line needs to come before the call to this.resteNodeValues();
    // This allows the list specific behavior for getInitialValue to function properly
    // by traversing the tree back up to get an ancestors value.
    this.registerNode(this.path.toString());
    this.resetNodeValue(value, schema);
    this.saveDecorators();
    makeObservable(this, {
      value: observable,
      errors: observable,
      uid: computed,
      onChange: action,
      validate: action,
      validateAll: action,
      setErrors: action,
      resetNodeValue: action,
      isValid: action,
      addListItem: action,
      removeListItem: action,
      dirty: observable,
    });
  }

  public resetNodeValue(
    value: any = NO_VALUE,
    schema: SchemaNodeServerDefinition = this.schema,
  ) {
    let initialValue = this.getInitialValue(schema);

    // When using `addInitialValuesAfterNode(afterNode: string, initialValues: Record<string, any>)`
    // in the decoration process, it adds an entry that looks like `${afterNode}.${this.name}`
    for (const segment of this.path.segments) {
      const segmentValue = this.context.values[segment.key];
      if (typeof segmentValue === 'object' && segmentValue !== null) {
        initialValue = this.context.values[segment.key][this.name];
        break;
      }
    }

    // Normally, just the name of the the field is enough
    // but there's a possibility of collision on nested structures
    // so the server can also send the shortPath instead.
    const matchingValueByShortPath = this.path.segments
      .filter((seg) => !seg.isList && !seg.isVariant)
      .reduce(
        (acc: any, seg: PathSegment) => (acc ? acc[seg.key] : undefined),
        this.context.values,
      );

    if (
      matchingValueByShortPath &&
      // Because a node that is not a leaf might also find a match,
      // we exclude that possibility by filtering out values that are objects.
      typeof matchingValueByShortPath !== 'object'
    ) {
      initialValue = matchingValueByShortPath;
    }

    this.value = value === NO_VALUE ? initialValue : value;

    // the invocation of schemaCompatibilityLayer must be after value hydratation
    // since it redefines the value but it must be before building
    // the children because it sets the type of node as well
    this.schema = this.schemaCompatibilityLayer(schema);

    if (this.isList && Array.isArray(this.schema.value)) {
      this.onChange(this.schema.value as NodeValue, 'self', true);
      return;
    }

    // makes sure the value matches the client's expected format / type
    const formatter = this.context.formatters.local;
    if (formatter) {
      this.value = formatter(this.value, this.type, this);
    }

    // If we have a node with options but the selections is invalid (or missing),
    // it tries to preselect the first option
    if (
      this.context.features.defaultOptionToFirstValue &&
      schema.options &&
      !schema.options.includes(this.value)
    ) {
      this.value = schema.options[0] || null;
    }

    this.buildChildren();
    this.onChange(this.value, 'self', true);
  }

  /**
   * @returns a copy of the node that will not mutate the original one
   * prefix is used to namespace the path used to store the node
   * note: the node still shared the same context so they can refer to
   * each other though {@link SchemaNode.getNodeByPath}
   */
  public clone(namespace = CLONED_SYMBOL) {
    return new SchemaNode<T>(
      this.context,
      cloneDeep(this.schema),
      this.path.unshift(namespace),
      cloneDeep(this.value),
    );
  }

  /**
   * Tells if the current node is a node that was created using the
   * {@link SchemaNode.clone} method.
   */
  public isClone(namespace = CLONED_SYMBOL) {
    return Boolean(this.path.segments.find(({key}) => key === namespace));
  }

  /**
   * Returns the node that was used to create this one through the
   * {@link SchemaNode.clone} method.
   * In order to make it possible, the cloned node have
   * to be cloned with the `keepContext` set to `true` otherwise
   * the sharedContext will not be the same.
   */
  public getOriginalNode(namespace = CLONED_SYMBOL) {
    if (!this.isClone(namespace)) throw new Error('This node is not a clone');
    const path = new Path(
      '',
      this.path.segments.filter(({key}) => key !== namespace),
    );
    return this.getNodeByPath(path.toString());
  }

  /**
   * Usefull to compare when a node that was cloned is modified
   * some example where that could be usefull is when a cloned node
   * manages a temporary value that is not stored in the server.
   *
   * Gotcha:
   * In order to make it possible, the cloned node have
   * to be cloned with the `keepContext` set to `true` otherwise
   * the sharedContext will not be the same.
   */
  public isSameValueAsCloned(namespace = CLONED_SYMBOL) {
    if (!this.isClone(namespace)) throw new Error('This node is not a clone');
    return this.getOriginalNode(namespace)?.value === this.value;
  }

  /**
   * Unregister the node from the context
   * this is usefull when adding programmatically a node
   * that is not part of the schema.
   * A good example is the {@link SchemaNode.clone} method:
   * It's a good practice to clean the cloned node when it's not used anymore
   */
  public remove(namespace = CLONED_SYMBOL) {
    if (!this.isClone(namespace)) {
      // eslint-disable-next-line no-console
      console.warn(`Removing a node that is not a clone and likely part of the server schema.
      This might be a code smell.
      SchemaNode path is "${this.path}"
      `);
    }
    return this.context.nodes.delete(this.path.toString());
  }

  public isValid(skipChildrenValidation = false): boolean {
    if (!this.valid || this.errors.length) return false;
    if (skipChildrenValidation) return true;
    // For variants, we do not care about other nodes than the one selected
    if (this.isVariant) return !this.invalidChildren.get(this.value);
    return this.invalidChildren.size === 0;
  }

  public get pathShort() {
    return this.path.toStringShort();
  }

  public get pathVariant() {
    return this.path.toStringShort(true);
  }

  /**
   * Usefull for react key since it aims to be unique
   * right now there is an issue with list items where removing an item from a list
   * would result with the next element taking over the removed item's id and causing
   * React's key to be the same.
   */
  public get uid() {
    return this.path.toString();
  }

  // Generic onchange called by the useNode hook or upon construction
  // we can turn up bubbling the even up or validating in some cases
  public onChange(value: T, from: NodeSource = 'self', isInitialValue = false) {
    if (this.isList) {
      this.setListValues(value as NodeValue);
    } else {
      this.value = value;
    }
    const errors = this.context.features?.asyncValidation
      ? []
      : this.validate(true);
    this.dirty = !isInitialValue && from !== 'parent';
    this.valid = errors.length === 0;
    // We don't want to have errors on creation, just when dirty
    if (!isInitialValue) this.errors = errors;

    if (from !== 'child' && !isInitialValue) {
      this.updateChildren();
    }

    if (from !== 'parent') {
      this.updateParent(
        this.name,
        this.isVariant || this.isList ? this.data() : this.value,
        this.isValid(),
        'child',
        isInitialValue,
      );
    }

    return this.errors;
  }

  /**
   * this is the main method used to update the list of errors for a given node.
   * They get "cleanned" when the fields becomes dirty again as default behavior.
   * there are a few preset of functions that automaticaly calls this method
   * when configured in {@link DeclarativeFormContext.validators}
   */
  public setErrors(errors: ValidationError[]) {
    this.errors = errors || [];
  }

  public getErrorMessage(): string {
    return this.errors.length
      ? this.translate('error', {error: this.errors[0]})
      : '';
  }

  /**
   *
   * This method allows bubbling up the values of the children
   * when they change, for some type of nodes, we want to skip
   * to the next parent because the node is an abstraction
   * ei: the polymorphic and list nodes have values that represent
   * their list of selected variants instead of the value of their children
   * so they will just pass up the value to the next node above them.
   * even though the method is public, it's an internal function.
   */
  public onChildrenChange(
    childrenName: string,
    childrenValue: any,
    isValid = false,
    from: NodeSource = 'self',
    isInitialValue = false,
  ) {
    if (from === 'child') {
      this.updateChildrenValidity(childrenName, isValid);
    }
    // Let's skip nodes with null as
    // it might be intentionnaly set for opt-out nodes
    if (isInitialValue && this.value === null && from !== 'parent') {
      this.updateParent(
        this.name,
        childrenValue,
        this.isValid(),
        'child',
        isInitialValue,
      );
      return;
    }
    // for intermediary nodes, values are objects representing children
    const isLeaf = this.attributes.length === 0;
    if (!isLeaf && !this.value) {
      this.value = {};
    }
    // polymorphic nodes values are the polymorphic selection
    // we skip that level but we register the selection on the parent's level
    if (this.isVariant) {
      this.updateParent(
        this.name,
        {
          ...childrenValue,
          [`${this.name}Type`]: childrenName,
        },
        this.isValid(),
        'child',
        isInitialValue,
      );
      return;
    }
    // same for lists
    if (this.isList) {
      this.updateParent(
        this.name,
        this.value.map((item: SchemaNode) => item.data()),
        this.isValid(),
        'child',
        isInitialValue,
      );
      return;
    }
    // other types of nodes just get updated
    this.onChange(
      {
        ...this.value,
        [childrenName]: childrenValue,
      },
      from,
      isInitialValue,
    );
  }

  public validate(asDryRun = false, updateParent = false): ValidationError[] {
    if (!this.schema.validators) return [];

    const errors = this.schema.validators
      .map((config) => {
        const fn = this.context.validators[config.name];
        return fn?.(this.value, config, this);
      })
      .filter(Boolean) as ValidationError[];

    if (updateParent) {
      this.updateParent(
        this.name,
        this.isVariant || this.isList ? this.validateAll() : this.value,
        errors.length === 0,
        'child',
        false,
      );
    }

    if (!asDryRun) this.setErrors(errors);

    return errors;
  }

  public translate(mode: TranslatorKey, args?: TranslatorArgs): string {
    const {translators} = this.context;
    const translator = translators[mode as keyof typeof translators];
    if (!translator) {
      return translators.default
        ? translators.default(this, {...args, key: mode})
        : '';
    }
    return translator(this, args) || '';
  }

  /**
   *
   * @returns Function Returned function unsuscribes the listener
   */
  public subscribe(callback: (node: SchemaNode) => void): () => void {
    return autorun(() => callback(this));
  }

  public getNodeByPath(fullPath: string) {
    return this.context.nodes.get(fullPath);
  }

  public parentNode(): SchemaNode | undefined {
    const {segments} = this.path;
    const parentKey = segments.slice(0, -1).join('.');
    return this.getNodeByPath(parentKey);
  }

  // for both addListItem and setListValues, we call buildChildren in the case that
  // a node that is not the last one gets deleted and all indexes gets shifted, then we
  // would risk to be stuck with an index like [1, 2, 3, 3] instead of [1, 2, 3, 4]
  public setListValues(items: any[]) {
    this.value = items.map((item: object, index: number) => {
      const itemNode = new SchemaNode(
        this.context,
        this.schema,
        this.path.add(index.toString(), true),
        undefined,
        (value, path) => this.onChildrenChange(value, path),
      );
      itemNode.onChange(item, 'self');
      return itemNode;
    });
    this.buildChildren();
  }

  // methods specific to list type
  public addListItem(value?: any) {
    if (!this.isList) {
      throw new Error('node is not a list');
    }
    const node = new SchemaNode(
      this.context,
      this.schema,
      this.path.add(this.value.length.toString(), true),
      value,
      (value, path) => this.onChildrenChange(value, path),
    );

    if (value) node.onChange(value);

    this.value = [...this.value, node];
    this.buildChildren();
    return node;
  }

  public removeListItem(index: number) {
    if (!this.isList) {
      throw new Error('node is not a list');
    }
    this.value = this.value.filter(
      (_: SchemaNode, idx: number) => idx !== index,
    );
    this.buildChildren();
  }

  // This method validates the entire schema tree, bubbling up
  // all child errors into one flat array for consumption
  public validateAll(
    validationResults: ValidateAll = {errors: [], isValid: true},
  ): ValidateAll {
    if (this.isVariant) {
      return (
        this.children[this.value]?.validateAll(validationResults) ??
        validationResults
      );
    } else {
      validationResults.errors.push(...this.validate(false, true));
      validationResults.isValid = validationResults.errors.length === 0;
    }

    if (this.isList) {
      this.value.map((item: SchemaNode) => item.validateAll(validationResults));
    } else if (this.attributes.length && this.value !== null) {
      this.attributes.reduce((acc, key) => {
        acc[key] = this.children[key].validateAll(validationResults);
        return acc;
      }, {} as any);
    }

    return validationResults;
  }

  // This method calculate the node's value
  // descending all it's children
  // it also calls the formater to convert client's values
  // to server values
  public data(validate = false): T extends never ? object : T {
    if (this.isVariant) {
      return this.attributes.reduce((acc, key) => {
        if (key === this.value) {
          Object.assign(acc, this.children[key].data(validate));
          acc[`${this.name}Type`] = this.value;
        }
        return acc;
      }, {} as any);
    }
    if (this.isList) {
      return this.value.map((item: SchemaNode) => item.data(validate));
    } else if (this.attributes.length && this.value !== null) {
      const value = this.attributes.reduce((acc, key) => {
        acc[key] = this.children[key].data(validate);
        return acc;
      }, {} as any);
      return value;
    }

    if (validate) this.validate(false);

    const formatter = this.context.formatters.remote;
    return formatter
      ? formatter(this.value, this.schema.type, this)
      : this.value;
  }

  private getInitialValue(schema: SchemaNodeServerDefinition = this.schema) {
    const initialValue = schema.value || this.context.values[this.name];
    if (initialValue !== undefined) return initialValue;

    const pathParts = this.path.toString().split('.');

    // This is naive and only checks the first possible list node, but we could make this more robust by checking all
    // potential list nodes. This might be solved through recursion, or a while loop. First collecting the indexes of all
    // possible list nodes in one pass, and then working through to find which is the top most that is an actual list type.
    // We don't want to assume that any node with a number as it's path name is definitely a list, so we perform a second
    // check below to verify that yes, in fact, the ancestral node we found is in fact a list.
    const possibleListNodeIndex = pathParts.findIndex(
      (part) => !isNaN(Number(part)),
    );

    if (
      possibleListNodeIndex === -1 ||
      possibleListNodeIndex === pathParts.length - 1
    ) {
      return initialValue;
    }
    const possibleListNode = this.getNodeByPath(
      pathParts.slice(0, possibleListNodeIndex).join('.'),
    );
    if (!possibleListNode?.isList) return initialValue;

    const parentValue = possibleListNode?.schema?.value;
    const childPath = pathParts.slice(possibleListNodeIndex);
    return get(parentValue, childPath);
  }

  // utilities
  private updateChildren() {
    if (this.isList || this.isVariant) return;
    this.attributes.forEach((key) => {
      const child: SchemaNode = this.children[key];
      if (!child || child.isList || child.isVariant) return;
      const childValue = this.value ? this.value[key] : null;
      child.onChange(childValue, 'parent');
      this.updateChildrenValidity(child.name, child.isValid());
    });
  }

  private updateChildrenValidity(childrenName: string, isValid: boolean) {
    if (isValid) {
      this.invalidChildren.delete(childrenName);
    } else {
      this.invalidChildren.set(childrenName, true);
    }
  }

  private buildChildren() {
    const children: SchemaNode['children'] = {};
    if (this.isList) {
      this.value.forEach((child: SchemaNode, newIndex: number) => {
        child.path = this.path.add(newIndex.toString(), true);
        child.name = child.path.tail;
        child.buildChildren();
      });
      return;
    }

    if (!this.schema.attributes) return {};

    this.attributes = Object.keys(this.schema.attributes);
    this.attributes.forEach((key) => {
      const attributes = this.schema.attributes!;
      const schema = attributes[key] as SchemaNodeDefinition;

      children[key] = new SchemaNode(
        this.context,
        schema,
        this.path.add(key, this.isList, this.isVariant),
        // In the case of grandchildren or deeper of lists, this children can be an empty {}.
        // Falling back to checking the parents value[key] allows us to handle this edge case.
        this.children[key]?.value ?? get(this.value, key),
        (name, value, isValid, _source, isInitialValue) => {
          this.onChildrenChange(name, value, isValid, 'child', isInitialValue);
        },
      );
    });
    this.children = children;
  }

  private saveDecorators() {
    this.context.decorators.forEach((decorator: Decorator) => {
      decorator.apply(this);
    });
  }

  private registerNode(namespace: string) {
    if (this.context.nodes.get(namespace)) {
      const {nodePathCollision} = this.context.features;
      const message = `node created at ${namespace} already exists`;
      if (nodePathCollision === 'throw') throw new Error(message);
      // eslint-disable-next-line no-console
      if (nodePathCollision === 'warn') console.warn(message);
    }
    this.context.nodes.set(namespace, this);
  }

  private schemaCompatibilityLayer(
    schema: SchemaNodeServerDefinition,
  ): SchemaNodeDefinition {
    let type = schema.type || 'group';

    if (typeof type !== 'string') {
      // Define if node should be a list node
      if (isMobxArray(type)) {
        // We remap from the Legacy Schema syntax
        [type] = type;
        this.isList = true;
        schema.value = this.value;
        this.value = [];
      } else if (isMobxArray(type.polymorphic)) {
        // we don't need to read the polymorphic attributes
        // as they are just a list of the keys in attributes
        // instead we change the type for a plain string
        type = 'polymorphic';
      }
    }

    if (type === 'polymorphic') this.isVariant = true;

    // At this point type can only be a string, no polymorphic or list shape
    this.type = type as NodeKind;
    this.required = Boolean(
      schema.validators?.find(({name}) => name === 'Presence'),
    );

    return {
      ...schema,
      attributes: schema.attributes as SchemaNodeDefinition['attributes'],
      type: this.type,
    };
  }
}

/**
 * when an array is proxied, it's not and instance of an Array anymore but the one of a Proxy
 * therefore Array.isArray returns false on arrays wrapped by mobx (Proxied)
 * Array.isArray is still safer semanticaly to future changes so it remains as the first condition
 * For more information, you can check https://doc.ebichu.cc/mobx/refguide/array.html
 */
function isMobxArray(array: any): array is any[] {
  return Array.isArray(array) || typeof array?.slice === 'function';
}
