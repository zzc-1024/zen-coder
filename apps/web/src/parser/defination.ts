import type { Variable } from "@/nodes/basic/typeDifination";

export abstract class Expression {
  // abstract toString(): string
  // abstract toJSON(): string
}
export abstract class Statement {
  // abstract toString(): string
  // abstract toJSON(): string
}

export abstract class CompilerBackend {
  variables: Variable[] = [];
  abstract generateCode(statements: Statement[]): string;
}
