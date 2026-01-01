type ThemeVars = {
  '--zencoder-node-width': string;
};

export const setThemeVar = (key: keyof ThemeVars, value: string) => {
  document.documentElement.style.setProperty(key, value);
};

export const getThemeVar = (key: keyof ThemeVars) => {
  // ✅ 正确：通过 getComputedStyle 读取计算后的样式（包含 CSS 定义的变量）
  return getComputedStyle(document.documentElement).getPropertyValue(key).trim();
};
