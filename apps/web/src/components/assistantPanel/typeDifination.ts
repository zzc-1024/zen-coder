import type { ChatCompletionFunctionTool } from 'openai/resources/chat/completions';

/**
 * 强类型聊天工具接口
 * 强制必须同时定义：OpenAI 工具格式 + 对应的执行函数
 */
export interface  ChatTool {
  /** OpenAI Function Calling 标准工具定义 */
  tool: ChatCompletionFunctionTool;

  /**
   * 工具执行函数（强制实现）
   * @param args 工具调用参数
   * @returns 工具执行结果字符串
   */
  execute: (args: Record<string, unknown>) => Promise<string> | string;
}
