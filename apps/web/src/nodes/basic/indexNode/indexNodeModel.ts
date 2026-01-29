import type LogicFlow from '@logicflow/core';
import BasicNodeModel, {
  type BasicNodePropertiesWithDefaultValues,
  type FieldType,
} from '../basicNodeModel';
import { BasicEditorNodeTypePrefix, type AnchorType, type DirectType } from '../typeDifination';
import type { Expression, Statement } from '@/parser/defination';
import {
  BasicType,
  BUILTIN_BASIC_STRING_TYPE,
  DictType,
  ListType,
  parseType,
} from '@/parser/variable';
import { IndexExpression } from '@/parser/expressions';

export const IndexNodeType = `${BasicEditorNodeTypePrefix}:index`;
export type IndexNodeProperties = BasicNodePropertiesWithDefaultValues & {
  inputType: string;
  outputType: string;
  indexs: string[];
};

export const IndexNodeAnchorIds = {
  DATA_IN: 'data-in',
  DATA_OUT: 'data-out',
};

class IndexNodeModel extends BasicNodeModel {
  getFields(): FieldType[] {
    const properties = this.properties as IndexNodeProperties;
    const fields: FieldType[] = [
      {
        name: '输入类型',
        type: parseType(properties.inputType),
        inputId: IndexNodeAnchorIds.DATA_IN,
        outputId: null,
      },
      {
        name: '输出类型',
        type: parseType(properties.outputType),
        inputId: null,
        outputId: IndexNodeAnchorIds.DATA_OUT,
      },
    ];

    for (const [i, index] of properties.indexs.entries()) {
      fields.push({
        name: `${i}号索引`,
        type: parseType(index),
        inputId: `${IndexNodeAnchorIds.DATA_IN}:${i}`,
        outputId: null,
      });
    }

    return fields;
  }
  parseFlowIn(anchorId: string): Statement[] {
    throw new Error(`IndexNodeModel parseFlowIn anchorId ${anchorId} not supported`);
  }
  parseDataOut(anchorId: string): Expression {
    // 先获取输出锚点的内部 id
    const dataOutId = anchorId.split(':')[1];
    if (dataOutId !== IndexNodeAnchorIds.DATA_OUT) {
      throw new Error(`IndexNodeModel parseDataOut anchorId ${anchorId} not supported`);
    }
    // 获取属性
    const properties = this.properties as IndexNodeProperties;
    // 获取输入表达式
    let inputExpression = this.getDataInExpression(`${this.id}:${IndexNodeAnchorIds.DATA_IN}`);
    if (!inputExpression) {
      const defaultValue = properties.defaultValues[IndexNodeAnchorIds.DATA_IN];
      inputExpression = this.parseTypeStringToDefaultExpression(properties.inputType, defaultValue);
    }
    if (!inputExpression) {
      throw new Error(`IndexNodeModel parseDataOut anchorId ${anchorId} inputExpression is null`);
    }

    for (const [i, index] of properties.indexs.entries()) {
      let indexExpression = this.getDataInExpression(
        `${this.id}:${IndexNodeAnchorIds.DATA_IN}:${i}`,
      );
      if (!indexExpression) {
        const defaultValue = properties.defaultValues[`${IndexNodeAnchorIds.DATA_IN}:${i}`];
        indexExpression = this.parseTypeStringToDefaultExpression(index, defaultValue);
      }
      if (!indexExpression)
        throw new Error(
          `SetVariableNodeModel parseTypeStringToDefaultExpression index ${i} type ${index} not supported`,
        );
      inputExpression = new IndexExpression(inputExpression, indexExpression);
    }

    return inputExpression;
  }
}

export function indexNodeGenerateAnchorRecommendation(
  anchorType: AnchorType,
  direction: DirectType,
): LogicFlow.OnDragNodeConfig[] {
  if (direction === 'in') {
    return [];
  }
  
  const recommendations: LogicFlow.OnDragNodeConfig[] = [];
  if (anchorType instanceof BasicType && anchorType.basicTypeName === BUILTIN_BASIC_STRING_TYPE) {
    recommendations.push({
      type: IndexNodeType,
      label: `字符串索引`,
      properties: {
        inputType: anchorType.toString(),
        outputType: new BasicType('builtin:basic:string').toString(),
        defaultValues: {},
        indexs: ['builtin:basic:integer'],
      } satisfies IndexNodeProperties,
    });
    return recommendations;
  } else if (anchorType instanceof ListType) {
    recommendations.push({
      type: IndexNodeType,
      label: `列表索引`,
      properties: {
        inputType: anchorType.toString(),
        outputType: anchorType.itemType.toString(),
        defaultValues: {},
        indexs: ['builtin:basic:integer'],
      } satisfies IndexNodeProperties,
    });
    return recommendations;
  } else if (anchorType instanceof DictType) {
    recommendations.push({
      type: IndexNodeType,
      label: `字典索引`,
      properties: {
        inputType: anchorType.toString(),
        outputType: anchorType.valueType.toString(),
        defaultValues: {},
        indexs: [anchorType.keyType.toString()],
      } satisfies IndexNodeProperties,
    });
    return recommendations;
  }
  return [];
}

export default IndexNodeModel;
