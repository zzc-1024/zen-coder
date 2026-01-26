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
};

export const setThemeVar = (key: keyof ThemeVars, value: string) => {
  document.documentElement.style.setProperty(key, value);
};

export const getThemeVar = (key: keyof ThemeVars) => {
  // ✅ 正确：通过 getComputedStyle 读取计算后的样式（包含 CSS 定义的变量）
  return getComputedStyle(document.documentElement).getPropertyValue(key).trim();
};
