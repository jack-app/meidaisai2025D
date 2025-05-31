import hljs from "highlight.js";

export enum Scope {
  PLANE = "plane", //独自スコープ
  string = "string",
  keyword = "keyword",
  type = "type",
  symbol = "symbol",
  variable = "variable",
  classTitle = "classTitle",
  functionTitle = "functionTitle",
  params = "params",
  comment = "comment",
}

// (highlight.jsのscope) string -> 独自scope (enum)
function scopeAsEnum(scope: string): Scope {
// 参考: 
// https://highlightjs.readthedocs.io/en/latest/css-classes-reference.html
   switch (scope) {
  // 通常のソース
  case "string": return Scope.string;
  case "keyword": return Scope.keyword;
  case "built_in": return Scope.functionTitle;
  case "type": return Scope.type;
  case "literal": return Scope.PLANE;
  case "number": return Scope.PLANE;
  case "operator": return Scope.PLANE;
  case "punctuation": return Scope.PLANE;
  case "property": return Scope.PLANE;
  case "regexp": return Scope.string;
  case "symbol": return Scope.symbol;
  case "char.escape": return Scope.string;
  case "subst": return Scope.string;
  case "variable": return Scope.variable;
  case "variable.language": return Scope.variable;
  case "variable.constant": return Scope.variable;
  case "title": return Scope.functionTitle;
  case "title.class": return Scope.classTitle;
  case "title.class.inherited": return Scope.classTitle;
  case "title.function": return Scope.functionTitle;
  case "title.function.invoke": return Scope.functionTitle;
  case "params": return Scope.params;
  case "comment": return Scope.comment;
  case "doctag": return Scope.comment;
  // XML
  case "language:xml": return Scope.PLANE;
  case "tag": return Scope.PLANE;
  case "name": return Scope.classTitle;
  case "attr": return Scope.variable;
  default: 
    console.warn(`unhandled scope: ${scope}`);
    return Scope.PLANE; // デフォルトはPLANE
  }
}

export class Token {
  constructor(
    public content: string,
    public scope: Scope
  ) {}
  length(): number {
    return this.content.length;
  }
  toString(): string {
    return this.content;
  }
}

// highlight.jsの字句解析情報を利用するためのhack
type SerialToken = {
    children: SerialToken[];
    scope: string;
} | string;
type TokenTreeEmitter = {rootNode: {children: SerialToken[]}};


// 問題データの型定義
export class SourceCode {
  public tokens: Token[];
  
  constructor(public id: string, public content: string, public language: string) {
    // ちょっとhackyすぎ？
    const tokenTree = hljs.highlight(content, { language })._emitter as unknown as TokenTreeEmitter;
    this.tokens = [];
    for (const token of tokenTree.rootNode.children) {
      this.pushToken(token);
    }
  }

  // flattenのため再帰関数を使用
  private pushToken(token: SerialToken, superScope?: Scope) {
    // highlight.jsのscope -> 独自のScope(上で定めたもの)へ
    if (typeof token === "string") {
      this.tokens.push(new Token(token, superScope || Scope.PLANE));
      return;
    }

    for (const child of token.children) {
      this.pushToken(child, scopeAsEnum(token.scope));
    }
  }

  generateProblem(): Problem {
    return new Problem(this);
  }
}
export class Problem {
  private tokenIndex: number = 0;
  private charIndex: number = 0;
  public completed: boolean = false;
  constructor(
    public source: SourceCode,
  ) {
    // 初期状態でスキップするべき文字・トークンを飛ばす
    this.skip();
  }

  private proceedOneToken() {
    if (this.completed) return;
    this.tokenIndex++;
    this.charIndex = 0;
    // トークンが無くなったらcompletedを立てる．
    if (this.tokenIndex >= this.source.tokens.length) {
      this.completed = true;
      this.tokenIndex = this.source.tokens.length - 1; // 最後のトークンに留まる
      this.charIndex = this.source.tokens[this.tokenIndex].length() - 1; // 最後の文字に留まる
    }
  }

  get currentToken(): Token {
    return this.source.tokens[this.tokenIndex];
  }

  private proceedOneChar() {
    if (this.completed) return;
    this.charIndex++;
    // charIndexがトークンをオーバーしたら次のトークンへ
    if (this.charIndex >= this.source.tokens[this.tokenIndex].length()) {
      this.proceedOneToken();
    }
  }

  get currentChar(): string {
    if (this.completed) return "";
    return this.source.tokens[this.tokenIndex].content[this.charIndex];
  }

  private get currentCharShouldBeSkipped() {
    return [
      " ", "\t", "\n", undefined // undefinedは空のトークンに入ったときに対応
    ].includes(this.currentChar)
  }
  private get currentTokenShouldBeSkipped() {
    return [Scope.comment].includes(this.currentToken.scope);
  }

  private skip() {
    // スキップ条件が満たされている限り進め続ける
    while (
      this.currentCharShouldBeSkipped
      || this.currentTokenShouldBeSkipped
    ) {
      // 空白・タブ文字・改行は飛ばす
      while (this.currentCharShouldBeSkipped) {
        this.proceedOneChar();
      }
      // コメントトークンは飛ばす
      while (this.currentTokenShouldBeSkipped) {
        this.proceedOneToken();
      }
    }
  }

  proceed(): void {
    if (this.completed) return;
    this.proceedOneChar(); // とりあえず一文字進める

    this.skip(); // スキップするべき文字・トークンを飛ばす
  }

  charAtCursor(): string {
    return this.currentChar;
  }
  tokensBeforeCursor(): Token[] {
    return [
      ...this.source.tokens.slice(0, this.tokenIndex), 
      new Token(
        this.currentToken.content.slice(0, this.charIndex),
        this.currentToken.scope,
      ) // 最後のトークンが入力中のトークン
    ]
  }
  tokensAfterCursor() {
    return [
      new Token( // 最初のトークンが入力中のトークン
        this.currentToken.content.slice(this.charIndex+1),
        this.currentToken.scope
      ),
      ...this.source.tokens.slice(this.tokenIndex + 1)
    ]
  }
}
