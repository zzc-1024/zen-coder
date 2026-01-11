import type LogicFlow from '@logicflow/core';
import BasicNodeModel, {
  type BasicNodePropertiesWithDefaultValues,
  type FieldType,
} from '../basicNodeModel';
import { BasicEditorNodeTypePrefix, type AnchorType, type DirectType } from '../typeDifination';
import type { Expression, Statement } from '@/parser/defination';
import {
  BasicType,
  BUILTIN_BASIC_BOOLEAN_TYPE,
  BUILTIN_BASIC_FLOAT_TYPE,
  BUILTIN_BASIC_INTEGER_TYPE,
  BUILTIN_BASIC_STRING_TYPE,
  parseType,
} from '@/parser/variable';
import { TypeCastExpression } from '@/parser/expressions';

export const TypeCastNodeType = `${BasicEditorNodeTypePrefix}:typeCast`;
export type TypeCastNodeProperties = BasicNodePropertiesWithDefaultValues & {
  inputType: string;
  outputType: string;
};

export const TypeCastNodeAnchorIds = {
  FLOW_OUT: 'flow-out',
  TYPE_IN: 'type-in',
  TYPE_OUT: 'type-out',
};

class TypeCastNodeModel extends BasicNodeModel {
  getFields(): FieldType[] {
    const properties = this.properties as TypeCastNodeProperties;
    return [
      {
        name: '输入类型',
        type: parseType(properties.inputType),
        inputId: TypeCastNodeAnchorIds.TYPE_IN,
        outputId: null,
      },
      {
        name: '输出类型',
        type: parseType(properties.outputType),
        inputId: null,
        outputId: TypeCastNodeAnchorIds.TYPE_OUT,
      },
    ];
  }
  parseFlowIn(anchorId: string): Statement[] {
    throw new Error(`TypeCastNodeModel parseFlowIn anchorId ${anchorId} not supported`);
  }
  parseDataOut(anchorId: string): Expression {
    // 先获取输出锚点的内部 id
    const dataOutId = anchorId.split(':')[1];
    if (dataOutId !== TypeCastNodeAnchorIds.TYPE_OUT) {
      throw new Error(`TypeCastNodeModel parseDataOut anchorId ${anchorId} not supported`);
    }
    // 获取属性
    const properties = this.properties as TypeCastNodeProperties;
    // 获取输入表达式
    let inputExpression = this.getDataInExpression(`${this.id}:${TypeCastNodeAnchorIds.TYPE_IN}`);
    if (!inputExpression) {
      const defaultValue = properties.defaultValues[TypeCastNodeAnchorIds.TYPE_IN];
      inputExpression = this.parseTypeStringToDefaultExpression(properties.inputType, defaultValue);
    }
    if (!inputExpression) {
      throw new Error(
        `TypeCastNodeModel parseDataOut anchorId ${anchorId} inputExpression is null`,
      );
    }
    return new TypeCastExpression(inputExpression, properties.outputType);
  }
}

export function typeCastNodeGenerateAnchorRecommendation(
  anchorType: AnchorType,
  direction: DirectType,
): LogicFlow.OnDragNodeConfig[] {
  if (!(anchorType instanceof BasicType)) {
    return [];
  }
  if (anchorType.basicTypeName === BUILTIN_BASIC_BOOLEAN_TYPE) {
    return [];
  }
  const supportedTypes = [
    BUILTIN_BASIC_FLOAT_TYPE,
    BUILTIN_BASIC_INTEGER_TYPE,
    BUILTIN_BASIC_STRING_TYPE,
  ];
  const recommendations: LogicFlow.OnDragNodeConfig[] = [];
  for (const type of supportedTypes) {
    if (type === anchorType.basicTypeName) {
      continue;
    }
    if (direction === 'out') {
      recommendations.push({
        type: TypeCastNodeType,
        label: `转换为${parseType(type).toDisplayString()}`,
        properties: {
          inputType: anchorType.basicTypeName,
          outputType: type,
          defaultValues: {
            [TypeCastNodeAnchorIds.TYPE_IN]:
              anchorType.basicTypeName === BUILTIN_BASIC_STRING_TYPE ? '0' : 0,
          },
        } satisfies TypeCastNodeProperties,
      });
    } else if (direction === 'in') {
      recommendations.push({
        type: TypeCastNodeType,
        label: `从${parseType(type).toDisplayString()}转换`,
        properties: {
          inputType: type,
          outputType: anchorType.basicTypeName,
          defaultValues: {
            [TypeCastNodeAnchorIds.TYPE_IN]: type === BUILTIN_BASIC_STRING_TYPE ? '0' : 0,
          },
        } satisfies TypeCastNodeProperties,
      });
    }
  }
  return recommendations;
}

export default TypeCastNodeModel;
