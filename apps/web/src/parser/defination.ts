import type { Variable } from '@/parser/variable';

export abstract class Expression {
  // abstract toString(): string
  // abstract toJSON(): string
}
export abstract class Statement {
  // abstract toString(): string
  // abstract toJSON(): string
}

export abstract class CompilerBackend {
  abstract generateCode(variables: Variable[], functionName: string, statements: Statement[]): string;
}
