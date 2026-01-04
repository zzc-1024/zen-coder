import { CompilerBackend, Statement } from '../defination';

export class PythonBackend extends CompilerBackend {
  generateCode(statements: Statement[]): string {
    throw new Error(`PythonBackend generateCode not implemented statements ${statements}`);
  }
}


