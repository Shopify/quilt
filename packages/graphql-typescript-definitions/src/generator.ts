type Block = () => void;

export default class CodeGenerator {
  private indentWidth = 2;
  private indentLevel = 0;
  private startOfIndentLevel = true;
  
  output = '';

  print(maybeString?: string | null | false) {
    if (maybeString) {
      this.output += maybeString;
    }
  }

  printNewline() {
    if (this.output) {
      this.print('\n');
      this.startOfIndentLevel = false;
    }
  }

  printNewlineIfNeeded() {
    if (!this.startOfIndentLevel) {
      this.printNewline();
    }
  }

  printOnNewline(maybeString?: string | null) {
    if (maybeString) {
      this.printNewline();
      this.printIndent();
      this.print(maybeString);
    }
  }

  printIndent() {
    const indentation = ' '.repeat(this.indentLevel * this.indentWidth);
    this.output += indentation;
  }

  withIndent(closure: Block) {
    this.indentLevel += 1;
    this.startOfIndentLevel = true;
    closure();
    this.indentLevel -= 1;
  }

  withinBlock(closure: Block) {
    this.print('{');
    this.withIndent(closure);
    this.printOnNewline('}');
  }
}
