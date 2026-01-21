import {
  GetVariableNodeType,
  type GetVariableNodeProperties,
} from '@/nodes/basic/getVariableNode/getVariableNodeModel';
import {
  SetVariableNodeType,
  type SetVariableNodeProperties,
} from '@/nodes/basic/setVariableNode/setVariableNodeModel';
import type { BaseType, BasicTypeName, VariableScopeType } from '@/parser/variable';
import type LogicFlow from '@logicflow/core';

export function dragVariable(
  lf: LogicFlow,
  dragType: string,
  variableScopeType: VariableScopeType,
  variableName: string,
  variableType: BaseType,
  indexs: BasicTypeName[],
) {
  if (dragType === 'get') {
    lf.dnd.startDrag({
      type: GetVariableNodeType,
      properties: {
        variableScopeType,
        type: variableType.toString(),
        variable: variableName,
      } satisfies GetVariableNodeProperties,
    });
  } else if (dragType === 'set') {
    lf.dnd.startDrag({
      type: SetVariableNodeType,
      properties: {
        variableScopeType,
        type: variableType.toString(),
        variable: variableName,
        indexs,
        defaultValues: {},
      } satisfies SetVariableNodeProperties,
    });
  }
}
