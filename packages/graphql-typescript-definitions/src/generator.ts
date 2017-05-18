type Block = () => void;

export default class CodeGenerator {
  private indentWidth = 2;
  private indentLevel = 0;
  private startOfIndentLevel = true;
  private forceInline = false;
  
  output = '';

  print(maybeString?: string | null | false) {
    this.forceInline = false;

    if (maybeString) {
      this.output += maybeString;
    }
  }

  printNewline() {
    if (this.forceInline) {
      this.print('');
    }

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
      if (!this.forceInline) {
        this.printNewline();
        this.printIndent();
      }
      this.print(maybeString);
    }
  }

  printAndForceInline(content: string) {
    this.print(content);
    this.forceInline = true;
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
