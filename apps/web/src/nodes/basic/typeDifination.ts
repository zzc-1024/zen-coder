import { parseType, type BaseType, type Variable } from "@/parser/variable";
import type LogicFlow from "@logicflow/core";

type BuiltinBasicTypePrefix = 'builtin:basic';

export type BuiltinBasicFlowType = `${BuiltinBasicTypePrefix}:flow`;
export const BUILTIN_BASIC_FLOW_TYPE: BuiltinBasicFlowType = 'builtin:basic:flow';
export const BUILTIN_BASIC_FLOW_TYPE_DISPLAY = '流程';

export const BasicEditorNodeTypePrefix: BuiltinBasicTypePrefix = 'builtin:basic';

export type DirectType = 'in' | 'out';

export class FlowType {
  toString() {
    return BUILTIN_BASIC_FLOW_TYPE;
  }
  toDisplayString() {
    return BUILTIN_BASIC_FLOW_TYPE_DISPLAY;
  }
}

export type AnchorType = BaseType | FlowType;

export function parseAnchorType(type: string): AnchorType {
  return type === BUILTIN_BASIC_FLOW_TYPE ? new FlowType() : parseType(type);
}

export type FunctionSignature = {
  source: string;
  module: string;
  name: string;
  parameters: Variable[];
  returnValue: BaseType | undefined;
  isPureFunction: boolean;
};

export type SheetData = {
  id: string;
  signature: FunctionSignature;
  variables: Variable[];
  graph: LogicFlow.GraphConfigData;
};
