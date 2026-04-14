// 定义导出的蓝图结构，包括元数据和文件路径
export interface BlueprintWithPath {
  id: number;
  name: string;
  description: string;
  authorName: string;
  type: 'classic';
  updatedAt: Date;
  filePath: string;
}

export const builtinBluePrintsWithPath: BlueprintWithPath[] = [{
  id: 1,
  name: 'Markov',
  description: '基于马尔可夫算法的文本替换',
  authorName: '内置',
  type: 'classic',
  updatedAt: new Date(2026, 4, 14),
  filePath: './builtinBluePrints/markkov.json',
}];
