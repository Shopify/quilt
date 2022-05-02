import {PathSegment} from './PathSegment';

/**
 * A representation of a {@link SchemaNode}'s path with some utilities
 * to lazy evaluate some attributes
 */
export class Path {
  public head: string = '';
  public tail: string = '';

  constructor(
    name = '',
    public segments: PathSegment[] = [],
    {isVariant = false, isList = false} = {},
  ) {
    if (name) {
      this.segments = [
        ...this.segments,
        new PathSegment(name, isList, isVariant),
      ];
    }
    this.compile();
  }

  /**
   * Append a new path segment to a path
   */
  public add(name: string, isList = false, isVariant = false): Path {
    return new Path(name, this.segments, {isList, isVariant});
  }

  /**
   * Prepend a new path segment to a path
   */
  public unshift(name: string, isList = false, isVariant = false): Path {
    const newPath = new Path(name, this.segments, {isList, isVariant});
    const prefix = newPath.segments.pop()!;
    newPath.segments.unshift(prefix);
    return new Path(name, this.segments, {isList, isVariant});
  }

  /**
   * full path including variant selections and array indexes
   */
  public toString(): string {
    return this.segments.join('.');
  }

  /**
   * full path separated by dots without variant selections or indexes.
   * Variants and indexes can still be included with a bracket syntax by passing setting
   * withVariant or withList arguments
   * @param withVariant show variant selections next to their polymorphic node ei: "foo.node[selectedVariant].bar"
   * @param withList show indexes next to their list node ei: "foo.node[0].bar"
   */
  public toStringShort(withVariant = false, withList = false): string {
    return this.segments.reduce((acc: string, seg: PathSegment) => {
      if (seg.isList) return withList ? `${acc}[${seg}]` : acc;
      if (seg.isVariant) return withVariant ? `${acc}[${seg}]` : acc;
      return acc ? `${acc}.${seg}` : seg.toString();
    }, '');
  }

  /**
   * This can be usefull to retrieve the path relative to server errors
   * or any selection / matching without bothering with the selected variants
   */
  public toFullWithoutVariants() {
    return this.segments.filter((seg) => !seg.isVariant).join('.');
  }

  private compile() {
    this.head = this.segments[0]?.toString() || '';
    this.tail = this.segments[this.segments.length - 1]?.toString() || '';
  }
}
