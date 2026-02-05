<template>
  <div class="app">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-logo">
          <h2>星程蓝图</h2>
        </div>
        <ul class="nav-menu">
          <li><RouterLink to="/">首页</RouterLink></li>
          <li><RouterLink to="/editor">编辑器</RouterLink></li>
          <li><RouterLink to="/handbook">节点图鉴</RouterLink></li>
        </ul>
        <div class="nav-button">
          <button class="btn-primary" @click="onLoginClick">登录功能敬请期待</button>
        </div>
      </div>
    </nav>

    <!-- 主页头部 -->
    <header class="hero">
      <div class="hero-content">
        <h1>拖拖拽拽，生成代码</h1>
        <p>通过可视化的拖拽界面，轻松构建应用程序，让代码变简单</p>
        <div class="hero-buttons" v-if="false">
          <button class="btn-primary">立即试用</button>
          <button class="btn-secondary">观看演示</button>
        </div>
      </div>
      <div class="hero-image">
        <div class="blueprint-preview">
          <div class="node input-node">编辑蓝图</div>
          <div class="connector">→</div>
          <div class="node process-node">解析逻辑</div>
          <div class="connector">→</div>
          <div class="node output-node">生成代码</div>
        </div>
      </div>
    </header>

    <!-- QQ群加入图片与链接 -->
    <section id="qq-group" class="qq-group">
      <h2>加入QQ群</h2>
      <div class="group-info">
        <img src="/QQGroup.jpg" alt="QQ群二维码" class="group-qrcode" />
        <p>
          点击链接加入群聊：<a href="https://qm.qq.com/q/IsapeVj0s2" target="_blank"
            >https://qm.qq.com/q/IsapeVj0s2</a
          >
        </p>
      </div>
    </section>

    <!-- 特性介绍 -->
    <section id="features" class="features">
      <h2>核心特性(下面是AI生成的，还没完工)</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="icon">📋</div>
          <h3>可视化设计</h3>
          <p>通过拖拽蓝图构建应用逻辑，直观易懂</p>
        </div>
        <div class="feature-card">
          <div class="icon">⚡</div>
          <h3>即时生成</h3>
          <p>随时可以生成可运行的代码，支持多种编程语言</p>
        </div>
        <div class="feature-card">
          <div class="icon">🔄</div>
          <h3>快速调整</h3>
          <p>随时修改蓝图，快速响应需求</p>
        </div>
        <div class="feature-card">
          <div class="icon">🌐</div>
          <h3>跨平台</h3>
          <p>根据目标语言生成代码，支持Python与JS</p>
        </div>
      </div>
    </section>

    <!-- 工作原理 -->
    <section id="how-it-works" class="how-it-works">
      <h2>如何工作</h2>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <h3>拖拽蓝图</h3>
          <p>从蓝图库中选择需要的模块</p>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <h3>连接节点</h3>
          <p>将蓝图中的节点连接起来定义数据流</p>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <h3>配置参数</h3>
          <p>为每个节点设置具体属性</p>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <h3>生成代码</h3>
          <p>一键导出任意类型的代码</p>
        </div>
      </div>
    </section>

    <!-- 演示区域 -->
    <section id="demo" class="demo" v-if="false">
      <h2>在线演示</h2>
      <div class="demo-container">
        <div class="blueprint-editor">
          <div class="editor-header">
            <span>蓝图编辑器</span>
          </div>
          <div class="editor-content">
            <div class="component-palette">
              <h4>组件库</h4>
              <div class="palette-item">输入框</div>
              <div class="palette-item">按钮</div>
              <div class="palette-item">列表</div>
              <div class="palette-item">API调用</div>
            </div>
            <div class="canvas">
              <div class="drop-zone">
                <p>将组件拖拽至此处</p>
                <div class="preview-node">用户登录</div>
                <div class="preview-node">验证逻辑</div>
                <div class="preview-node">返回结果</div>
              </div>
            </div>
          </div>
        </div>
        <div class="code-output">
          <div class="output-header">
            <span>生成的代码</span>
          </div>
          <pre class="code-block"><code>// 自动生成的代码示例
function userLogin(username, password) {
  // 验证逻辑
  if (validateInput(username, password)) {
    return authenticateUser(username, password);
  }
  return { error: "Invalid credentials" };
}</code></pre>
        </div>
      </div>
    </section>

    <!-- 价格计划 -->
    <section id="pricing" class="pricing" v-if="false">
      <h2>价格计划</h2>
      <div class="pricing-cards">
        <div class="pricing-card">
          <h3>免费版</h3>
          <div class="price">$0<span>/月</span></div>
          <ul>
            <li>基础组件库</li>
            <li>最多5个项目</li>
            <li>社区支持</li>
          </ul>
          <button class="btn-secondary">开始使用</button>
        </div>
        <div class="pricing-card featured">
          <div class="popular">最受欢迎</div>
          <h3>专业版</h3>
          <div class="price">$29<span>/月</span></div>
          <ul>
            <li>全部组件库</li>
            <li>无限项目</li>
            <li>高级技术支持</li>
            <li>团队协作</li>
          </ul>
          <button class="btn-primary">升级专业版</button>
        </div>
        <div class="pricing-card">
          <h3>企业版</h3>
          <div class="price">$99<span>/月</span></div>
          <ul>
            <li>所有专业版功能</li>
            <li>私有部署</li>
            <li>定制化开发</li>
            <li>专属客户经理</li>
          </ul>
          <button class="btn-secondary">联系我们</button>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>ZenCoder</h4>
          <p>让编程更简单，让创意更自由</p>
        </div>
        <div class="footer-section">
          <h4>产品</h4>
          <ul>
            <li><a href="#">特性</a></li>
            <li><a href="#">定价</a></li>
            <li><a href="#">API</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>资源</h4>
          <ul>
            <li><a href="#">文档</a></li>
            <li><a href="#">教程</a></li>
            <li><a href="#">博客</a></li>
          </ul>
        </div>
        <div class="footer-section" v-if="false">
          <h4>公司</h4>
          <ul>
            <li><a href="#">关于我们</a></li>
            <li><a href="#">联系</a></li>
            <li><a href="#">招聘</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 ZenCoder version 0.0.0 保留所有权利。</p>
        <a href="https://beian.miit.gov.cn/" target="_blank" style="color: #00f">
          京ICP备2025152579号-1
        </a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import router from '../router';

function onLoginClick() {
  router.push('/auth');
}
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
}

.app {
  background-color: #f8fafc;
}

/* 导航栏样式 */
.navbar {
  background-color: #1e293b;
  padding: 1rem 0;
  position: sticky; /* 使用sticky替代fixed，使导航栏在页面流中占据空间 */
  width: 100%;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.nav-logo h2 {
  color: #fff;
  font-size: 1.5rem;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-menu a {
  color: #cbd5e1;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-menu a:hover {
  color: #fff;
}

.nav-button button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
}

/* 主页头部样式 */
.hero {
  background: linear-gradient(135deg, #0ea5e9, #6366f1);
  color: white;
  padding: 10rem 2rem 5rem; /* sticky导航栏下保持原有padding */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 600px;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: transparent;
  color: white;
  border: 2px solid white;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.blueprint-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
  flex-wrap: wrap;
}

.node {
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: bold;
  min-width: 120px;
  text-align: center;
}

.input-node {
  background-color: #10b981;
}

.process-node {
  background-color: #f59e0b;
}

.output-node {
  background-color: #ef4444;
}

.connector {
  font-size: 1.5rem;
  font-weight: bold;
}

/* QQ群加入图片与链接样式 */
.qq-group {
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  h2 {
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #1e293b;
  }

  .group-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    p {
      font-size: 1.2rem;
      color: #64748b;
    }
  }

  .group-qrcode {
    width: 400px;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
}

/* 特性区域样式 */
.features {
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.features h2 {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #1e293b;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card .icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1e293b;
}

.feature-card p {
  color: #64748b;
}

/* 工作原理样式 */
.how-it-works {
  padding: 5rem 2rem;
  background-color: #e2e8f0;
  text-align: center;
}

.how-it-works h2 {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #1e293b;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.step {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.step-number {
  width: 40px;
  height: 40px;
  background-color: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-weight: bold;
}

.step h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.step p {
  color: #64748b;
}

/* 演示区域样式 */
.demo {
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.demo h2 {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #1e293b;
}

.demo-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.blueprint-editor,
.code-output {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.editor-header,
.output-header {
  background-color: #1e293b;
  color: white;
  padding: 1rem;
  text-align: left;
}

.editor-content {
  display: flex;
  height: 400px;
}

.component-palette {
  width: 200px;
  background-color: #f1f5f9;
  padding: 1rem;
  border-right: 1px solid #e2e8f0;
}

.palette-item {
  padding: 0.75rem;
  margin: 0.5rem 0;
  background-color: white;
  border-radius: 0.5rem;
  cursor: move;
  text-align: center;
  border: 1px dashed #cbd5e1;
}

.canvas {
  flex: 1;
  padding: 1rem;
  background-color: #f8fafc;
}

.drop-zone {
  height: 100%;
  border: 2px dashed #cbd5e1;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.preview-node {
  padding: 1rem;
  margin: 0.5rem;
  background-color: #dbeafe;
  border: 1px solid #93c5fd;
  border-radius: 0.5rem;
  width: 150px;
  text-align: center;
}

.code-block {
  background-color: #1e293b;
  color: #f8fafc;
  padding: 1.5rem;
  overflow-x: auto;
  text-align: left;
  height: 360px;
}

/* 价格计划样式 */
.pricing {
  padding: 5rem 2rem;
  background-color: #e2e8f0;
  text-align: center;
}

.pricing h2 {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #1e293b;
}

.pricing-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.pricing-card {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: transform 0.3s;
}

.pricing-card:hover {
  transform: translateY(-10px);
}

.pricing-card.featured {
  border: 2px solid #3b82f6;
  transform: scale(1.05);
}

.popular {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f59e0b;
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.pricing-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1e293b;
}

.price {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 1rem 0;
  color: #3b82f6;
}

.price span {
  font-size: 1rem;
  color: #64748b;
}

.pricing-card ul {
  list-style: none;
  margin: 1.5rem 0;
  text-align: left;
}

.pricing-card li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

/* 页脚样式 */
.footer {
  background-color: #1e293b;
  color: #cbd5e1;
  padding: 3rem 2rem 1rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.footer-section h4 {
  color: white;
  margin-bottom: 1rem;
}

.footer-section ul {
  list-style: none;
}

.footer-section li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: white;
}

.footer-bottom {
  max-width: 1200px;
  margin: 2rem auto 0;
  padding-top: 1rem;
  border-top: 1px solid #334155;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-menu {
    gap: 1rem;
  }

  .hero {
    padding: 8rem 1rem 3rem;
  }

  .hero-content h1 {
    font-size: 2rem;
  }

  .demo-container {
    grid-template-columns: 1fr;
  }

  .editor-content {
    flex-direction: column;
  }

  .component-palette {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }
}
</style>
