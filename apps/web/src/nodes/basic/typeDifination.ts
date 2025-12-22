type BUILTIN_BASIC_FIELD_PREFIX = 'builtin:basic';

export type BuiltinBasicIntegerType = `${BUILTIN_BASIC_FIELD_PREFIX}:integer`;
export type BuiltinBasicFloatType = `${BUILTIN_BASIC_FIELD_PREFIX}:float`;
export type BuiltinBasicStringType = `${BUILTIN_BASIC_FIELD_PREFIX}:string`;
export type BuiltinBasicBooleanType = `${BUILTIN_BASIC_FIELD_PREFIX}:boolean`;
export type BuiltinBasicFlowType = `${BUILTIN_BASIC_FIELD_PREFIX}:flow`;

export type BasicTypeName =
  | BuiltinBasicIntegerType
  | BuiltinBasicFloatType
  | BuiltinBasicStringType
  | BuiltinBasicBooleanType;

export type DerectType = 'in' | 'out';

export type DatasourceType = 'basic' | 'list' | 'dict';

export abstract class BaseType {
  abstract dataStructureType: DatasourceType;
  abstract toString(): string;
}

export type AnchorType = BaseType | BuiltinBasicFlowType;

export class BasicType extends BaseType {
  dataStructureType: DatasourceType = 'basic';
  constructor(public type: BasicTypeName) {
    super();
  }
  toString() {
    return this.type;
  }
}

export class ListType extends BaseType {
  dataStructureType: DatasourceType = 'list';
  constructor(public itemType: BaseType) {
    super();
  }
  toString() {
    return `list<${this.itemType.toString()}>`;
  }
}

export class DictType extends BaseType {
  dataStructureType: DatasourceType = 'dict';
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
