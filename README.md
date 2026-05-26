# 云学堂在线教育平台 Demo（轻量静态版）

这是一个用于简历展示的轻量 Demo，基于学成在线/云学堂项目的业务流程抽取而来，主要展示：

- 课程搜索与筛选聚合：模拟 Elasticsearch BoolQuery、过滤、聚合。
- 选课、下单、支付、开通学习资格：模拟学习服务、订单服务、RabbitMQ 消息通知。
- 视频大文件断点续传：模拟 checkfile、checkchunk、uploadchunk、mergechunks。

## 为什么做静态版

完整微服务项目依赖 Nacos、Gateway、MySQL、Redis、RabbitMQ、Elasticsearch、MinIO、XXL-JOB 等多个组件，免费平台不适合全量稳定部署。

这个 Demo 是纯 HTML/CSS/JavaScript，不需要后端和数据库，适合部署到 Vercel 或 GitHub Pages，用于简历和面试展示。

## 本地预览

直接双击 `index.html` 即可打开。

## 免费部署方式一：Vercel

1. 新建 GitHub 仓库，比如 `xuecheng-lite-demo`。
2. 将本目录下的所有文件上传到仓库根目录。
3. 登录 Vercel。
4. Import GitHub Repository。
5. 选择该仓库。
6. Framework 选择 Other / Static。
7. Build Command 留空。
8. Output Directory 留空或填 `.`。
9. Deploy。

## 免费部署方式二：GitHub Pages

1. 将本目录下的文件上传到 GitHub 仓库根目录。
2. 进入仓库 Settings。
3. 点击 Pages。
4. Source 选择 Deploy from a branch。
5. Branch 选择 `main`，文件夹选择 `/root`。
6. 保存后等待 GitHub 生成访问地址。

## 放到项目展示站

部署成功后，把得到的地址填入项目展示站的 `src/App.jsx`：

```js
{
  id: 'cloud-course',
  name: '云学堂在线教育平台',
  github: 'https://github.com/Yu2ovo/java-project',
  demo: 'https://你的-demo地址',
  icon: Server,
}
```

## 简历描述建议

可以写：

> 基于在线教育项目补充实现轻量项目演示页，展示课程搜索、选课支付、RabbitMQ 支付通知、视频断点续传等核心流程，便于项目在线访问和面试复盘。

注意：不要把这个静态 Demo 描述成真实生产环境上线系统。
