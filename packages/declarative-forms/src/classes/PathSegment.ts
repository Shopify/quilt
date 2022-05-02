export class PathSegment {
  constructor(
    public key: string,
    public isList = false,
    public isVariant = false,
  ) {}

  toString() {
    return this.key;
  }
}
