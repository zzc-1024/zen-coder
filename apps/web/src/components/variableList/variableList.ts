import {
  GetVariableNodeType,
  type GetVariableNodeProperties,
} from '@/nodes/basic/getVariableNode/getVariableNodeModel';
import {
  SetVariableNodeType,
  type SetVariableNodeProperties,
} from '@/nodes/basic/setVariableNode/setVariableNodeModel';
import type { BaseType } from '@/nodes/basic/typeDifination';
import type LogicFlow from '@logicflow/core';

export function dragVariable(
  lf: LogicFlow,
  dragType: string,
  variableName: string,
  variableType: BaseType,
) {
  if (dragType === 'get') {
    lf.dnd.startDrag({
      type: GetVariableNodeType,
      properties: {
        title: `获取${variableName}`,
        type: variableType.toString(),
        variable: variableName,
      } satisfies GetVariableNodeProperties,
    });
  } else if (dragType === 'set') {
    lf.dnd.startDrag({
      type: SetVariableNodeType,
      properties: {
        title: `修改${variableName}`,
        type: variableType.toString(),
        variable: variableName,
        defaultValues: {},
      } satisfies SetVariableNodeProperties,
    });
  }
}
