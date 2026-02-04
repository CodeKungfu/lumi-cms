<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>Lumi CMS</h2>
        <p>
          Lumi CMS是一款基于Node.js技术栈的现代化后台管理系统，采用NestJS + Vue3 + TypeScript + Prisma等前沿技术构建。系统设计简洁高效，易于上手，同时具备强大的扩展性，可用于各类Web应用场景，如网站管理后台、会员中心、CMS、CRM、OA等。系统支持响应式设计，确保在PC端和移动端均有良好的用户体验。
        </p>
        <p>
          <b>当前版本:</b> <span>v{{ version }}</span>
        </p>
        <p>
          <el-tag type="danger">&yen;免费开源</el-tag>
        </p>
        <p>
          <el-button
            type="primary"
            icon="Cloudy"
            plain
            @click="goTarget('https://github.com/CodeKungfu/lumi-cms')"
            >访问GitHub</el-button
          >
        </p>
      </el-col>

      <el-col :sm="24" :lg="12" style="padding-left: 50px">
        <el-row>
          <el-col :span="12">
            <h2>技术选型</h2>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <h4>后端技术</h4>
            <ul>
              <li>NestJS</li>
              <li>TypeScript</li>
              <li>JWT</li>
              <li>Prisma ORM</li>
              <li>MySQL</li>
              <li>Redis</li>
              <li>Swagger</li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>前端技术</h4>
            <ul>
              <li>Vue 3</li>
              <li>Pinia</li>
              <li>Element Plus</li>
              <li>TypeScript</li>
              <li>Vite</li>
              <li>Axios</li>
              <li>Sass</li>
            </ul>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>联系信息</span>
            </div>
          </template>
          <div class="body">
            <p>
              <i class="el-icon-s-promotion"></i> 官网：<el-link
                href="http://www.ruoyi.vip"
                target="_blank"
                >http://www.ruoyi.vip</el-link
              >
            </p>
            <p>
              <i class="el-icon-chat-dot-round"></i> 微信：<a
                href="javascript:;"
                >/ *Lumi</a
              >
            </p>
            <p>
              <i class="el-icon-money"></i> 支付宝：<a
                href="javascript:;"
                class="支付宝信息"
                >/ *Lumi</a
              >
            </p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>更新日志</span>
            </div>
          </template>
          <el-collapse accordion>
            <el-collapse-item title="最新版本">
              <ol>
                <li>全栈重构：基于 NestJS + Vue3 的现代化架构</li>
                <li>Monorepo 管理：采用 pnpm workspace 统一管理前后端</li>
                <li>高性能后端：使用 Fastify 替代 Express，性能大幅提升</li>
                <li>ORM 升级：使用 Prisma 替代 MyBatis，支持类型安全</li>
                <li>零依赖启动：默认支持 SQLite + MockRedis，开箱即用</li>
                <li>前端升级：Vue3 + Vite + Element Plus + Pinia</li>
                <li>类型安全：全链路 TypeScript 支持</li>
                <li>代码规范：统一 ESLint + Prettier 配置</li>
                <li>容器化：支持 Docker & Docker Compose 部署</li>
                <li>兼容性：保留 RuoYi 核心功能设计，降低上手成本</li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="v1.0.0 - 2026-01-01">
              <ol>
                <li>Lumi前后端分离系统正式发布</li>
              </ol>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>捐赠支持</span>
            </div>
          </template>
          <div class="body">
            <img
              src="@/assets/images/pay.jpg"
              alt="donate"
              style="width:100%"
            />
            <span style="display: inline-block; height: 30px; line-height: 30px"
              >你可以请作者喝杯咖啡表示鼓励</span
            >
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Index">
const version = ref('3.8.6')

function goTarget(url) {
  window.open(url, '__blank')
}
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

