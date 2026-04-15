<template>
  <div class="assistant-panel">
    <!-- 配置区域 -->
    <div class="config-section">
      <h3>配置</h3>
      <div class="config-form">
        <div class="form-group">
          <label for="apiKey">API Key</label>
          <input
            type="password"
            id="apiKey"
            v-model="config.apiKey"
            placeholder="Enter OpenAI API Key"
          />
        </div>
        <div class="form-group">
          <label for="apiBase">API Base</label>
          <input
            type="text"
            id="apiBase"
            v-model="config.apiBase"
            placeholder="Enter API Base URL"
          />
        </div>
        <div class="form-group">
          <label for="model">Model</label>
          <input type="text" id="model" v-model="config.model" placeholder="Enter Model Name" />
        </div>
        <button class="save-config-btn" @click="saveConfig">保存配置</button>
      </div>
    </div>

    <!-- 日志台 -->
    <div class="log-section">
      <h3>对话记录</h3>
      <div class="log-container" ref="logContainer">
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
          <div class="message-header">
            <span class="role">{{ message.role === 'user' ? '用户' : 'AI' }}</span>
            <span class="time">{{ message.timestamp }}</span>
          </div>
          <div class="message-content">
            <p>{{ message.content }}</p>
            <div v-if="message.role === 'assistant' && message.thought" class="thought">
              <strong>思考过程：</strong>
              <p>{{ message.thought }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-section">
      <textarea
        v-model="inputMessage"
        placeholder="输入你的问题..."
        @keyup.enter.exact="sendMessage()"
        class="input-textarea"
      ></textarea>
      <button @click="sendMessage()" class="send-btn">发送</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import OpenAI from 'openai';

// 配置类型
interface Config {
  apiKey: string;
  apiBase: string;
  model: string;
}

type Role = 'user' | 'assistant' | 'system' | 'tool';

// 消息类型
interface Message {
  role: Role;
  content: string;
  thought?: string;
  timestamp: string;
  tool_call_id?: string;
  tool_calls?: OpenAI.Chat.ChatCompletionTool[];
}

// 响应式变量
const config = ref<Config>({
  apiKey: '',
  apiBase: 'https://ark.cn-beijing.volces.com/api/v3',
  model: 'doubao-1.5-pro',
});

const messages = ref<Message[]>([]);
const inputMessage = ref('');
const logContainer = ref<HTMLElement | null>(null);
let openai: OpenAI | null = null;

// 工具定义（Function Calling 标准格式）
const tools: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: '查询指定城市的天气',
      parameters: {
        type: 'object',
        properties: {
          location: { type: 'string', description: '城市名称' },
        },
        required: ['location'],
      },
    },
  },
];

// 工具执行函数
async function executeTool(name: string, params: Record<string, unknown>) {
  if (name === 'get_weather') {
    return `${params.location} 天气晴朗，温度 26℃`;
  }
  return '未知工具';
}

// 保存配置
const saveConfig = () => {
  localStorage.setItem('assistantConfig', JSON.stringify(config.value));
  initOpenAI();
  addMessage('assistant', '✅ 配置已保存');
};

// 初始化OpenAI
const initOpenAI = () => {
  if (config.value.apiKey) {
    openai = new OpenAI({
      apiKey: config.value.apiKey,
      baseURL: config.value.apiBase,
      dangerouslyAllowBrowser: true,
    });
  }
};

// 添加消息
const addMessage = (role: Role, content: string, thought?: string, tool_call_id?: string) => {
  messages.value.push({
    role,
    content,
    thought,
    timestamp: new Date().toLocaleString(),
    tool_call_id,
  });

  setTimeout(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight;
    }
  }, 100);
};

// 构建上下文（自动包含 user / assistant / tool）
const buildMessages = () => {
  return messages.value.map((msg) => {
    const obj: Message = {
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
    };
    if (msg.tool_call_id) {
      obj.tool_call_id = msg.tool_call_id;
    }
    if (msg.tool_calls) {
      obj.tool_calls = msg.tool_calls;
    }
    return obj;
  });
};

// 发送消息（支持工具调用闭环）
const sendMessage = async (isToolCall = false) => {
  const content = inputMessage.value.trim();
  if (!isToolCall && !content) return;
  if (!openai) {
    addMessage('assistant', '⚠️ 请先配置API Key');
    return;
  }

  if (!isToolCall) {
    addMessage('user', content);
    inputMessage.value = '';
  }

  try {
    const allMessages = [
      { role: 'system', content: '你是一个智能助手，需要调用工具获取信息并回答用户。' },
      ...buildMessages(),
    ];

    const response = await openai.chat.completions.create({
      model: config.value.model,
      messages: allMessages as OpenAI.Chat.ChatCompletionMessageParam[],
      tools: tools,
      temperature: 0.7,
    });

    if (!response?.choices?.[0]?.message) {
      addMessage('assistant', '❌ 模型返回为空');
      return;
    }

    const assistantMsg = response.choices[0].message;

    // 情况1：模型需要调用工具
    if (assistantMsg.tool_calls && assistantMsg.tool_calls.length > 0) {
      addMessage(
        'assistant',
        '🛠 正在调用天气工具...',
        JSON.stringify(assistantMsg.tool_calls, null, 2),
      );

      // 把 assistant 的 tool_calls 加入历史
      messages.value.push({
        role: 'assistant',
        content: assistantMsg.content || '',
        timestamp: new Date().toLocaleString(),
        tool_calls: assistantMsg.tool_calls,
      } as Message);

      // 执行工具
      for (const tc of assistantMsg.tool_calls) {
        if (tc.type !== 'function') {
          continue;
        }

        const args = JSON.parse(tc.function.arguments);
        const toolResult = await executeTool(tc.function.name, args);

        // 把 tool 结果加入上下文（三角色核心：tool 角色）
        addMessage('tool', toolResult, undefined, tc.id);
      }

      // 再次请求，让模型根据工具结果回答
      sendMessage(true);
    }
    // 情况2：直接回复
    else {
      addMessage('assistant', assistantMsg.content || '无返回内容');
    }
  } catch (error) {
    console.error(error);
    addMessage('assistant', `❌ 错误：${error instanceof Error ? error.message : '未知错误'}`);
  }
};

// 自动滚动
watch(
  messages,
  () => {
    setTimeout(() => {
      if (logContainer.value) {
        logContainer.value.scrollTop = logContainer.value.scrollHeight;
      }
    }, 100);
  },
  { deep: true },
);

// 加载配置
onMounted(() => {
  const saved = localStorage.getItem('assistantConfig');
  if (saved) {
    config.value = JSON.parse(saved);
    initOpenAI();
  }
});
</script>

<style lang="scss" scss>
.assistant-panel {
  width: 300px;
  min-width: 250px;
  height: 100%;
  background-color: #2a2a2a;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid #444;

  .config-section {
    padding: 15px;
    background-color: #1a1a1a;
    border-bottom: 1px solid #444;

    h3 {
      margin: 0 0 15px 0;
      color: #b0b0b0;
      font-size: 14px;
      font-weight: 600;
    }

    .config-form {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 5px;

        label {
          font-size: 12px;
          color: #ddd;
        }

        input {
          padding: 8px 10px;
          border: 1px solid #444;
          border-radius: 3px;
          font-size: 13px;
          color: #ddd;
          background-color: #333;

          &:focus {
            outline: none;
            border-color: #00b4d8;
          }
        }
      }

      .save-config-btn {
        padding: 8px 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 12px;

        &:hover {
          background-color: #0069d9;
        }
      }
    }
  }

  .log-section {
    flex: 1;
    padding: 15px;
    overflow: hidden;

    h3 {
      margin: 0 0 15px 0;
      color: #b0b0b0;
      font-size: 14px;
    }

    .log-container {
      height: calc(100% - 30px);
      overflow-y: auto;
      background-color: #333;
      border: 1px solid #444;
      border-radius: 4px;
      padding: 15px;

      .message {
        margin-bottom: 15px;
        padding: 10px;
        border-radius: 8px;

        &.user {
          background-color: #1e3a5f;
        }

        &.assistant {
          background-color: #3a1e3a;
        }

        &.tool {
          background-color: #2a2a2a;
          border-left: 3px solid #28a745;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 11px;

          .role {
            font-weight: bold;
            color: #b0b0b0;
          }

          .time {
            color: #888;
          }
        }

        .message-content {
          p {
            margin: 0;
            color: #ddd;
          }

          .thought {
            margin-top: 10px;
            padding: 10px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            font-size: 12px;

            strong {
              display: block;
              margin-bottom: 5px;
              color: #b0b0b0;
            }
          }
        }
      }
    }
  }

  .input-section {
    padding: 15px;
    background-color: #2a2a2a;
    border-top: 0px solid #444;
    display: flex;
    gap: 10px;

    .input-textarea {
      flex: 1;
      padding: 10px;
      border: 1px solid #444;
      border-radius: 3px;
      resize: none;
      min-height: 60px;
      font-size: 13px;
      color: #ddd;
      background-color: #333;

      &:focus {
        outline: none;
        border-color: #00b4d8;
      }
    }

    .send-btn {
      padding: 0 20px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;

      &:hover {
        background-color: #218838;
      }
    }
  }
}
</style>
