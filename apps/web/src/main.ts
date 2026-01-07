import './assets/main.css';
import '@logicflow/core/lib/style/index.css';
import '@logicflow/extension/lib/style/index.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import LogicFlow from '@logicflow/core';
import { DndPanel, MiniMap } from '@logicflow/extension';

const app = createApp(App);

app.use(router);

app.mount('#app');

LogicFlow.use(MiniMap);
LogicFlow.use(DndPanel);
