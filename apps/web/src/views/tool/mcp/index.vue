<template>
  <div class="container-box">
    <el-card class="search-card">
      <template #header>
        <div class="card-header">
          <h2 class="title">Brave Search</h2>
          <div class="connection-status">
            <el-tag :type="client ? 'success' : 'danger'" size="small" effect="dark">
              {{ client ? "已连接到 MCP" : "正在连接 MCP..." }}
            </el-tag>
            <el-button 
              type="primary" 
              link 
              @click="showTools = !showTools"
              size="small"
            >
              {{ showTools ? "隐藏工具" : "显示工具" }}
            </el-button>
          </div>
        </div>
      </template>

      <el-collapse-transition>
        <div v-if="showTools" class="tools-container">
          <h3 class="tools-title">可用工具</h3>
          <el-row :gutter="20">
            <el-col :span="12" v-for="(tool, index) in tools" :key="index">
              <el-card shadow="hover" class="tool-card">
                <h4>{{ tool.name }}</h4>
                <p class="tool-description">{{ tool.description }}</p>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-collapse-transition>

      <el-form @submit.prevent="handleSearch" class="search-form">
        <el-input
          v-model="query"
          placeholder="搜索网络..."
          clearable
          :disabled="loading"
          class="search-input"
        >
          <template #append>
            <el-button
              type="primary"
              :icon="Search"
              :loading="loading"
              :disabled="!client"
              @click="handleSearch"
            />
          </template>
        </el-input>
      </el-form>

      <el-alert
        v-if="error"
        :title="error"
        type="error"
        show-icon
        :closable="false"
        class="error-alert"
      />

      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="3" animated />
      </div>

      <div v-if="results.length > 0" class="results-container">
        <el-timeline>
          <el-timeline-item
            v-for="(result, index) in results"
            :key="index"
            :timestamp="new URL(result.url).hostname"
            placement="top"
            type="primary"
          >
            <el-card shadow="hover" class="result-card">
              <h3 class="result-title">
                <el-link
                  :href="result.url"
                  target="_blank"
                  type="primary"
                  :underline="false"
                >
                  {{ result.title }}
                </el-link>
              </h3>
              <p class="result-url">{{ result.url }}</p>
              <p class="result-description">{{ result.description }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>

      <el-empty
        v-if="!loading && !results.length && !error"
        description="输入关键词开始搜索"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { ElMessage } from 'element-plus';

// 状态定义
const query = ref('');
const results = ref([]);
const loading = ref(false);
const error = ref(null);
const client = ref(null);
const transport = ref(null);
const tools = ref([]);
const showTools = ref(false);

// 初始化客户端
onMounted(async () => {
  await setupClient();
});

// 组件卸载时关闭连接
onUnmounted(() => {
  if (transport.value) {
    transport.value.close();
  }
});

// 设置客户端连接
const setupClient = async () => {
  const newClient = new Client(
    { name: "Brave Search Client", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  const newTransport = new SSEClientTransport(
    // new URL("/sse", window.location.origin),
    // new URL("/mcp/sse", "http://localhost:7071"),
    new URL("/sse", "http://localhost:3001"),
    {
      requestInit: {
        headers: {
            Accept: "text/event-stream",
        },
      },
    }
  );

  try {
    await newClient.connect(newTransport);
    client.value = newClient;
    transport.value = newTransport;
    console.log("Connected to MCP server");
    ElMessage.success('成功连接到 MCP 服务器');

    // 获取服务器提供的工具
    const capabilities = await newClient.listTools();
    console.log("capabilities==========>", capabilities);
    const availableTools = capabilities.tools.map((tool) => ({
      name: tool.name,
      description: tool.description || "暂无描述",
    }));
    tools.value = availableTools;
  } catch (err) {
    error.value = `连接 MCP 服务器失败: ${err.message}`;
    ElMessage.error(`连接 MCP 服务器失败: ${err.message}`);
    console.error("Connection error:", err);
  }
};

// 处理搜索
const handleSearch = async () => {
  if (!query.value.trim()) {
    ElMessage.warning('请输入搜索关键词');
    return;
  }
  
  if (!client.value) {
    error.value = "客户端未连接";
    ElMessage.error('客户端未连接');
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const response = await client.value.callTool({
      name: "search",
      arguments: {
        query: query.value,
        count: 5,
      },
    });

    if (response.content?.[0]?.text) {
      const searchResults = JSON.parse(response.content[0].text);
      results.value = searchResults;
      if (searchResults.length === 0) {
        ElMessage.info('没有找到相关结果');
      }
    } else {
      throw new Error("无效的响应格式");
    }
  } catch (err) {
    error.value = `搜索失败: ${err.message}`;
    ElMessage.error(`搜索失败: ${err.message}`);
    console.error("Search error:", err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.container-box {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 20px;
}

.search-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  margin: 0;
  font-size: 1.5rem;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tools-container {
  margin-bottom: 20px;
}

.tools-title {
  margin-bottom: 15px;
  font-size: 1.2rem;
  font-weight: 500;
}

.tool-card {
  margin-bottom: 15px;
  height: 100%;
}

.tool-description {
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
  margin-top: 8px;
}

.search-form {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
}

.error-alert {
  margin-bottom: 20px;
}

.loading-container {
  margin: 20px 0;
}

.results-container {
  margin-top: 20px;
}

.result-card {
  margin-bottom: 10px;
}

.result-title {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.result-url {
  color: var(--el-text-color-secondary);
  font-size: 0.8rem;
  margin-bottom: 10px;
  word-break: break-all;
}

.result-description {
  color: var(--el-text-color-regular);
  line-height: 1.5;
}
</style>