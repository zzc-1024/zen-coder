import {
  GetVariableNodeType,
  type GetVariableNodeProperties,
} from '@/nodes/basic/getVariableNode/getVariableNodeModel';
import {
  SetVariableNodeType,
  type SetVariableNodeProperties,
} from '@/nodes/basic/setVariableNode/setVariableNodeModel';
import type { BaseType } from '@/parser/variable';
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
        type: variableType.toString(),
        variable: variableName,
      } satisfies GetVariableNodeProperties,
    });
  } else if (dragType === 'set') {
    lf.dnd.startDrag({
      type: SetVariableNodeType,
      properties: {
        type: variableType.toString(),
        variable: variableName,
        defaultValues: {},
      } satisfies SetVariableNodeProperties,
    });
  }
}
