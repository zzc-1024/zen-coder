type BuiltinBasicTypePrefix = 'builtin:basic';

export type BuiltinBasicIntegerType = `${BuiltinBasicTypePrefix}:integer`;
export type BuiltinBasicFloatType = `${BuiltinBasicTypePrefix}:float`;
export type BuiltinBasicStringType = `${BuiltinBasicTypePrefix}:string`;
export type BuiltinBasicBooleanType = `${BuiltinBasicTypePrefix}:boolean`;
export type BuiltinBasicFlowType = `${BuiltinBasicTypePrefix}:flow`;
export const BUILTIN_BASIC_FLOW_TYPE: BuiltinBasicFlowType = 'builtin:basic:flow';

export type BasicTypeName =
  | BuiltinBasicIntegerType
  | BuiltinBasicFloatType
  | BuiltinBasicStringType
  | BuiltinBasicBooleanType;

export type DerectType = 'in' | 'out';

export type DataStructureType = 'basic' | 'list' | 'dict';

export abstract class BaseType {
  abstract dataStructureType: DataStructureType;
  abstract toString(): string;
}

export type AnchorType = BaseType | BuiltinBasicFlowType;

export class BasicType extends BaseType {
  dataStructureType: DataStructureType = 'basic';
  constructor(public type: BasicTypeName) {
    super();
  }
  toString() {
    return this.type;
  }
}

export class ListType extends BaseType {
  dataStructureType: DataStructureType = 'list';
  constructor(public itemType: BaseType) {
    super();
  }
  toString() {
    return `list<${this.itemType.toString()}>`;
  }
}

export class DictType extends BaseType {
  dataStructureType: DataStructureType = 'dict';
  constructor(
    public keyType: BaseType,
    public valueType: BaseType,
  ) {
    super();
  }
  toString() {
    return `dict<${this.keyType.toString()}, ${this.valueType.toString()}>`;
  }
}

export function parseType(type: string): BaseType {
  const trimType = type.trim();
  if (trimType.startsWith('list<')) {
    const itemType = trimType.slice(5, -1);
    return new ListType(parseType(itemType));
  } else if (trimType.startsWith('dict<')) {
    const inner = trimType.slice(5, -1);
    // ✅ 正确分割顶层逗号
    let depth = 0;
    let commaIndex = -1;
    for (let i = 0; i < inner.length; i++) {
      if (inner[i] === '<') depth++;
      else if (inner[i] === '>') depth--;
      else if (inner[i] === ',' && depth === 0) {
        commaIndex = i;
        break;
      }
    }
    if (commaIndex === -1) {
      throw new Error(`Invalid dict type: ${type}`);
    }
    const keyType = inner.slice(0, commaIndex);
    const valueType = inner.slice(commaIndex + 1);
    return new DictType(parseType(keyType), parseType(valueType));
  }
  return new BasicType(trimType as BasicTypeName);
}
