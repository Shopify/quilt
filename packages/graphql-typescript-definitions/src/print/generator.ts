export type Block = () => void;

export default class CodeGenerator {
  private indentWidth = 2;
  private indentLevel = 0;
  
  output = '';

  print(maybeString?: string | null | false) {
    if (maybeString) {
      this.output += maybeString;
    }
  }

  printEmptyLine() {
    if (/\n\n$/.test(this.output)) {
      return;
    } else if (/\n$/.test(this.output)) {
      this.print('\n');
    } else {
      this.print('\n\n');
    }
  }

  printNewline() {
    if (this.output) {
      this.print('\n');
    }
  }

  printOnNewline(maybeString?: string | null) {
    if (maybeString) {
      if (!/\n$/.test(this.output)) {
        this.printNewline();
      }

      this.printIndent();
      this.print(maybeString);
    }
  }

  printAndForceInline(content: string) {
    this.print(content);
  }

  printIndent() {
    const indentation = ' '.repeat(this.indentLevel * this.indentWidth);
    this.output += indentation;
  }

  withIndent(closure: Block) {
    this.indentLevel += 1;
    closure();
    this.indentLevel -= 1;
  }

  withinBlock(closure: Block) {
    this.print('{');
    this.withIndent(closure);
    this.output = this.output.replace(/\s*$/, '');
    this.printOnNewline('}');
  }
}
