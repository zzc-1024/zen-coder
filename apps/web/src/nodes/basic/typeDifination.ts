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
    console.log('type', this.type);
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
    const [keyType, valueType] = trimType.slice(5, -1).split(',');
    if (!keyType || !valueType) throw new Error(`Invalid dict type: ${type}`);
    return new DictType(parseType(keyType.trim()), parseType(valueType.trim()));
  }
  return new BasicType(trimType as BasicTypeName);
}
