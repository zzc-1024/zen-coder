import { BUILTIN_BASIC_FLOW_TYPE, type AnchorType } from '@/nodes/basic/typeDifination';
import {
  BUILTIN_BASIC_BOOLEAN_TYPE,
  BUILTIN_BASIC_FLOAT_TYPE,
  BUILTIN_BASIC_INTEGER_TYPE,
  BUILTIN_BASIC_STRING_TYPE,
  ListType,
  SetType,
} from '@/parser/variable';

type ThemeVars = {
  /* 节点 */
  '--zencoder-node-width': string;
  /* 边 */
  '--zencoder-edge-flow-color': string;
  '--zencoder-edge-boolean-color': string;
  '--zencoder-edge-integer-color': string;
  '--zencoder-edge-float-color': string;
  '--zencoder-edge-string-color': string;
  '--zencoder-edge-array-color': string;
  '--zencoder-edge-set-color': string;
};

export const setThemeVar = (key: keyof ThemeVars, value: string) => {
  document.documentElement.style.setProperty(key, value);
};

export const getThemeVar = (key: keyof ThemeVars) => {
  // ✅ 正确：通过 getComputedStyle 读取计算后的样式（包含 CSS 定义的变量）
  return getComputedStyle(document.documentElement).getPropertyValue(key).trim();
};

export function getColorByType(type: AnchorType): string {
  if (type.toString() === BUILTIN_BASIC_FLOW_TYPE) {
    return getThemeVar('--zencoder-edge-flow-color');
  } else if (type.toString() === BUILTIN_BASIC_BOOLEAN_TYPE) {
    return getThemeVar('--zencoder-edge-boolean-color');
  } else if (type.toString() === BUILTIN_BASIC_INTEGER_TYPE) {
    return getThemeVar('--zencoder-edge-integer-color');
  } else if (type.toString() === BUILTIN_BASIC_FLOAT_TYPE) {
    return getThemeVar('--zencoder-edge-float-color');
  } else if (type.toString() === BUILTIN_BASIC_STRING_TYPE) {
    return getThemeVar('--zencoder-edge-string-color');
  } else if (type instanceof ListType) {
    return getThemeVar('--zencoder-edge-array-color');
  } else if (type instanceof SetType) {
    return getThemeVar('--zencoder-edge-set-color');
  }
  throw new Error(`Unsupported color type: ${type}`);
}
