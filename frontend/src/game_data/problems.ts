// 問題データの型定義
export interface Problem {
  id: string;
  content: string;
  language: string;
}

export const ProblemInstances: Problem[] = [
    {
      id: "sample_1",
      content: 
`const greeting = "Hello, World!";

aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaa
a
aa

a
a
aa

a

aaaaaaa
`,
      language: "typescript"
    }
]