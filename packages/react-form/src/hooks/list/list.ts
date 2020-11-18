import {FieldDictionary} from '../../types';

import {useBaseList, FieldListConfig} from './baselist';

/**
 * A custom hook for utilizing useBaseList. useList uses useBaseList. This hook is responsible for returning just the field objects useBaseList provides.
 * In it's simplest form `useList` can be called with a single parameter with the list to derive default values and structure from.
 *
 * ```typescript
 * const list = useList([{title: '', description: ''}, {title: '', description: ''}]);
 * ```
 *
 * You can also pass a more complex configuration object specifying a validation dictionary.
 *
 * ```tsx
 *const list = useList({
 *  list: [{title: '', description: ''}, {title: '', description: ''}],
 *  validates: {
 *    title:(title) => {
 *      if (title.length > 3) {
 *        return 'Title must be longer than three characters';
 *      }
 *    },
 *   description: (description) => {
 *     if (description === '') {
 *       return 'Description is required!';
 *     }
 *   }
 *  }
 *});
 * ```
 *
 * Generally, you will want to use the list returned from useList by looping over it in your JSX.
 * ```tsx
 *function MyComponent() {
 *  const variants = useList([{title: '', description: ''}, {title: '', description: ''}]);
 *
 *  return (
 *    <ul>
 *     {variants.map((fields, index) => (
 *       <li key={index}>
 *         <label htmlFor={`title-${index}`}>
 *           title{' '}
 *           <input
 *             id={`title-${index}`}
 *             name={`title-${index}`}
 *             value={fields.title.value}
 *             onChange={fields.title.onChange}
 *             onBlur={fields.title.onBlur}
 *           />
 *         </label>
 *         {field.title.error && <p>{field.title.error}</p>}
 *         <label htmlFor={`description-${index}`}>
 *           description{' '}
 *           <input
 *             id={`description-${index}`}
 *             name={`description-${index}`}
 *             value={fields.description.value}
 *             onChange={fields.description.onChange}
 *             onBlur={fields.description.onBlur}
 *           />
 *         </label>
 *         {field.description.error && <p>{field.description.error}</p>}
 *       </li>
 *      ))}
 *    </ul>
 *  );
 *}
 *```
 *
 * If using `@shopify/polaris` or other custom components that support `onChange`, `onBlur`, `value`, and `error` props then
 * you can accomplish the above more tersely by using the ES6 `spread` (...) operator.
 *
 * ```tsx
 * function MyComponent() {
 *  const variants = useList([{title: '', description: ''}, {title: '', description: ''}]);
 *
 *  return (
 *    <ul>
 *     {variants.map((fields, index) => (
 *       <li key={index}>
 *         <TextField label="title" name={`title${index}`} {...fields.title} />
 *         <TextField
 *            label="description"
 *            id={`description${index}`}
 *            {...fields.description}
 *         />
 *       </li>
 *      ))}
 *    </ul>
 *   );
 * }
 * ```
 *
 * @param listOrConfig - A configuration object specifying both the value and validation config.
 * @param validationDependencies - An array of dependencies to use to decide when to regenerate validators.
 * @returns A list of dictionaries of `Field` objects representing the state of your input. It also includes functions to manipulate that state. Generally, you will want to pass these callbacks down to the component or components representing your input.
 *
 */
export function useList<Item extends object>(
  listOrConfig: FieldListConfig<Item> | Item[],
  validationDependencies: unknown[] = [],
): FieldDictionary<Item>[] {
  const {fields} = useBaseList(listOrConfig, validationDependencies);

  return fields;
}
