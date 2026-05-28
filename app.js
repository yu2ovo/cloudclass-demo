const courses = [
  { id: 1001, title: 'Java 微服务项目实战', category: '后端开发', level: '进阶', price: 0, students: 1842, lessons: 36, duration: '18小时', teacher: '云课堂教研组', summary: '围绕 Spring Cloud Alibaba 构建在线教育平台，覆盖服务治理、网关鉴权、消息通知、文件存储与课程检索。', tags: ['Spring Cloud', 'RabbitMQ', 'Elasticsearch'], progress: 68 },
  { id: 1002, title: 'Spring Boot 企业级接口开发', category: '后端开发', level: '基础', price: 99, students: 2310, lessons: 28, duration: '12小时', teacher: '后端研发中心', summary: '从接口设计、参数校验、异常处理、事务控制到 MyBatis-Plus 数据访问，完成企业级接口开发训练。', tags: ['Spring Boot', 'MyBatis-Plus', 'RESTful'], progress: 36 },
  { id: 1003, title: 'Redis 缓存与高并发场景', category: '后端开发', level: '进阶', price: 129, students: 1260, lessons: 22, duration: '9小时', teacher: '架构实践组', summary: '讲解缓存穿透、缓存击穿、缓存一致性、ZSet 排行榜与分布式锁等常见应用场景。', tags: ['Redis', '缓存一致性', '排行榜'], progress: 12 },
  { id: 1004, title: 'Elasticsearch 课程搜索系统', category: '搜索技术', level: '进阶', price: 0, students: 980, lessons: 18, duration: '7小时', teacher: '搜索平台组', summary: '围绕课程搜索场景，实践索引设计、字段权重、BoolQuery、多条件筛选、聚合统计与分页优化。', tags: ['Elasticsearch', 'BoolQuery', '聚合'], progress: 82 },
  { id: 1005, title: '对象存储与大文件上传', category: '云原生', level: '进阶', price: 119, students: 766, lessons: 20, duration: '8小时', teacher: '媒资平台组', summary: '基于 MinIO 实现图片、视频等媒资存储，支持 MD5 秒传、分片校验、断点续传与服务端合并。', tags: ['MinIO', '分片上传', '断点续传'], progress: 44 },
  { id: 1006, title: 'RabbitMQ 消息队列实战', category: '消息中间件', level: '进阶', price: 89, students: 1456, lessons: 24, duration: '10小时', teacher: '后端中间件组', summary: '结合订单支付通知与超时订单关闭场景，实践 TTL、死信队列、Publisher Confirm、手动 ACK 与幂等处理。', tags: ['RabbitMQ', '死信队列', '消息可靠性'], progress: 0 },
]

const navs = [
  { path: '/', label: '首页' },
  { path: '/courses', label: '课程中心' },
  { path: '/learning', label: '学习中心' },
  { path: '/teacher', label: '教学后台' },
  { path: '/media', label: '媒资管理' },
  { path: '/orders', label: '订单中心' },
  { path: '/auth', label: '认证授权' },
  { path: '/architecture', label: '系统架构' },
]

let state = {
  keyword: '',
  category: '全部',
  level: '全部',
  price: '全部',
  selectedCourseId: 1001,
  uploading: false,
  uploadProgress: 0,
  uploadLogs: [],
  orderStep: 0,
}

function icon(name) {
  const icons = {
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.5 19H8a6 6 0 1 1 1.2-11.88A7 7 0 0 1 22 12.5 4.5 4.5 0 0 1 17.5 19Z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3v8Z"/><path d="m9 12 2 2 4-4"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/></svg>',
    message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>',
    server: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01M6 17h.01"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 16V9"/><path d="M12 16V5"/><path d="M17 16v-3"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
  }
  return icons[name] || icons.book
}

function route() {
  return location.hash.replace(/^#/, '') || '/'
}

function setRoute(path) {
  location.hash = path
}

function appShell(content) {
  const current = route()
  return `
    <div class="shell">
      <header class="topbar">
        <nav class="nav">
          <a class="brand" href="#/">
            <span class="logo">${icon('book')}</span>
            <span>云课堂在线教育平台</span>
          </a>
          <div class="nav-links">
            ${navs.map(n => `<a class="nav-link ${current === n.path || (current.startsWith('/course/') && n.path === '/courses') ? 'active' : ''}" href="#${n.path}">${n.label}</a>`).join('')}
          </div>
          <div class="nav-actions">
            <a class="btn btn-soft" href="#/teacher">机构入口</a>
          </div>
        </nav>
      </header>
      ${content}
      <div class="footer">© 云课堂在线教育平台 · 在线学习与课程管理系统</div>
      <div id="toast" class="toast"></div>
    </div>
  `
}

function money(course) { return course.price === 0 ? '<span class="price free">免费</span>' : `<span class="price">¥${course.price}</span>` }
function badge(text, type = 'gray') { return `<span class="badge badge-${type}">${text}</span>` }

function homePage() {
  return appShell(`
    <main class="container page">
      <section class="hero">
        <div>
          ${badge('Spring Cloud 微服务 · 在线教育业务场景', 'blue')}
          <h1>一站式在线课程学习与教学管理平台</h1>
          <p>平台围绕课程发布、媒资管理、课程搜索、在线学习、订单支付和认证授权等核心业务流程构建，面向学员、教学机构和平台管理方提供完整的课程服务能力。</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#/courses">浏览课程</a>
            <a class="btn btn-ghost" href="#/architecture">查看系统能力</a>
          </div>
        </div>
        <div class="card hero-panel">
          <div class="dashboard-card">
            <h3>平台运行概览</h3>
            <p style="color:rgba(255,255,255,.78);line-height:1.7">课程、媒资、搜索、订单与学习数据统一管理，关键流程可在线体验。</p>
            <div class="stats">
              <div class="stat"><strong>6</strong><span>核心业务模块</span></div>
              <div class="stat"><strong>12+</strong><span>后端技术组件</span></div>
              <div class="stat"><strong>10ms</strong><span>热门词本地返回</span></div>
              <div class="stat"><strong>TopN</strong><span>搜索词频统计</span></div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="section-head">
          <div><h2>核心业务能力</h2><p>以在线教育业务为主线，覆盖课程从创建、发布、搜索、购买到学习的完整链路。</p></div>
        </div>
        <div class="grid grid-4">
          ${feature('search','课程搜索','基于课程名称、分类、难度、价格等条件进行组合检索，支持搜索建议与聚合筛选。')}
          ${feature('upload','媒资管理','支持图片与视频文件管理，展示大文件分片上传、断点续传和服务端合并流程。')}
          ${feature('message','选课支付','根据课程收费类型生成不同选课流程，支付完成后开通学习资格。')}
          ${feature('shield','认证授权','统一登录认证与方法级权限控制，区分学员、教师和管理员访问范围。')}
        </div>
      </section>

      <section>
        <div class="section-head"><div><h2>推荐课程</h2><p>课程数据覆盖后端开发、搜索技术、消息中间件和云原生媒资管理。</p></div><a class="btn btn-ghost" href="#/courses">查看更多</a></div>
        <div class="course-grid">${courses.slice(0,3).map(courseCard).join('')}</div>
      </section>
    </main>
  `)
}

function feature(iconName, title, text) {
  return `<div class="card feature"><div class="feature-icon">${icon(iconName)}</div><h3>${title}</h3><p>${text}</p></div>`
}

function getFilteredCourses() {
  return courses.filter(c => {
    const q = state.keyword.trim().toLowerCase()
    const matchKeyword = !q || [c.title, c.category, c.level, c.summary, ...c.tags].join(' ').toLowerCase().includes(q)
    const matchCategory = state.category === '全部' || c.category === state.category
    const matchLevel = state.level === '全部' || c.level === state.level
    const matchPrice = state.price === '全部' || (state.price === '免费' ? c.price === 0 : c.price > 0)
    return matchKeyword && matchCategory && matchLevel && matchPrice
  })
}

function courseCard(c) {
  return `<article class="card course-card">
    <div class="cover"><span class="tag">${badge(c.category, 'blue')}</span><div class="cover-title">${c.title.split(' ')[0]}</div></div>
    <div class="course-body">
      <h3>${c.title}</h3>
      <p class="card-desc">${c.summary}</p>
      <div class="meta"><span>${c.level}</span><span>${c.lessons} 课时</span><span>${c.students} 人学习</span></div>
      <div class="badge-list">${c.tags.map(t => badge(t)).join('')}</div>
      <div class="course-actions">${money(c)}<a class="btn btn-primary" href="#/course/${c.id}">查看详情</a></div>
    </div>
  </article>`
}

function coursesPage() {
  const filtered = getFilteredCourses()
  const hotWords = ['Java微服务', 'SpringBoot', 'Redis缓存', 'RabbitMQ', 'Elasticsearch', 'MinIO']
  return appShell(`
    <main class="container page">
      <div class="section-head">
        <div><h2>课程中心</h2><p>支持关键词检索、分类筛选、难度筛选和价格筛选，展示课程搜索与筛选体验。</p></div>
      </div>
      <div class="card toolbar">
        <div class="search-wrap">
          <input id="keyword" class="input" placeholder="搜索课程，例如 Java、Redis、RabbitMQ" value="${state.keyword}" />
          ${state.keyword ? `<div class="suggestions">${hotWords.filter(w=>w.toLowerCase().includes(state.keyword.toLowerCase()) || state.keyword.length>0).slice(0,4).map((w,i)=>`<div class="suggestion" onclick="setKeyword('${w}')"><span>${w}</span><span>热度 ${98-i*13}</span></div>`).join('')}</div>` : ''}
        </div>
        ${select('category', ['全部', ...new Set(courses.map(c=>c.category))], state.category)}
        ${select('level', ['全部', '基础', '进阶'], state.level)}
        ${select('price', ['全部', '免费', '收费'], state.price)}
      </div>

      <div class="section-head">
        <div><h2>搜索结果</h2><p>共找到 ${filtered.length} 门课程，当前筛选条件已同步到搜索参数。</p></div>
        <div>${badge('热门词 Top10', 'orange')} ${badge('聚合筛选', 'green')}</div>
      </div>
      <div class="course-grid">${filtered.map(courseCard).join('') || empty('没有找到符合条件的课程')}</div>

      <div class="grid grid-2" style="margin-top:20px">
        <div class="card card-inner">
          <h3 class="card-title">搜索参数</h3>
          <div class="kv"><label>关键词</label><div>${state.keyword || '全部'}</div></div>
          <div class="kv"><label>分类</label><div>${state.category}</div></div>
          <div class="kv"><label>难度</label><div>${state.level}</div></div>
          <div class="kv"><label>价格</label><div>${state.price}</div></div>
          <div class="kv"><label>分页限制</label><div>每页 12 条，避免一次性返回过多课程数据</div></div>
        </div>
        <div class="card card-inner">
          <h3 class="card-title">检索能力</h3>
          <p class="card-desc">搜索侧支持字段权重、关键词补全、聚合筛选和热门词统计。课程名称、分类等核心字段优先匹配；用户搜索词可通过 Redis ZSet 统计热度并展示 TopN。</p>
        </div>
      </div>
    </main>
  `)
}

function select(id, options, value) {
  return `<select id="${id}" class="select">${options.map(o => `<option value="${o}" ${o===value?'selected':''}>${o}</option>`).join('')}</select>`
}

function empty(text) { return `<div class="card card-inner" style="grid-column:1/-1;text-align:center;color:var(--muted)">${text}</div>` }

function courseDetailPage(id) {
  const course = courses.find(c => c.id == id) || courses[0]
  const chapters = ['课程介绍与项目结构', '服务注册与网关路由', '课程发布与索引同步', '媒资上传与文件合并', '订单支付与消息通知']
  return appShell(`
    <main class="container page">
      <div class="detail-layout">
        <section>
          <div class="video-box"><div><h2>${course.title}</h2><p>${course.teacher} · ${course.duration} · ${course.lessons} 课时</p><div style="margin-top:18px"><a class="btn btn-primary" href="#/learning">${icon('play')} 进入学习</a></div></div></div>
          <div class="card card-inner" style="margin-top:20px"><h3 class="card-title">课程简介</h3><p class="card-desc">${course.summary}</p></div>
          <div class="card card-inner" style="margin-top:20px"><h3 class="card-title">课程目录</h3>${chapters.map((ch,i)=>`<div class="chapter"><div><strong>第 ${i+1} 章：${ch}</strong><br><small>${i===0?'试看':'完整学习'} · ${35+i*8} 分钟</small></div><span class="status ${i===0?'ok':'info'}">${i===0?'已开放':'课程内容'}</span></div>`).join('')}</div>
        </section>
        <aside class="card card-inner">
          <h3 class="card-title">课程信息</h3>
          <div class="kv"><label>课程分类</label><div>${course.category}</div></div>
          <div class="kv"><label>课程难度</label><div>${course.level}</div></div>
          <div class="kv"><label>学习人数</label><div>${course.students} 人</div></div>
          <div class="kv"><label>课程价格</label><div>${course.price === 0 ? '免费课程' : `¥${course.price}`}</div></div>
          <div style="margin-top:18px;display:grid;gap:10px">
            <button class="btn btn-primary" onclick="joinCourse(${course.id})">${course.price === 0 ? '加入学习' : '立即选课'}</button>
            <a class="btn btn-ghost" href="#/courses">返回课程中心</a>
          </div>
        </aside>
      </div>
    </main>
  `)
}

function learningPage() {
  const learning = courses.slice(0,4)
  return appShell(`
    <main class="container page">
      <div class="section-head"><div><h2>学习中心</h2><p>展示用户已加入课程、学习进度和最近学习记录。</p></div></div>
      <div class="grid grid-4">
        ${statCard('已选课程','4 门','持续学习中')}
        ${statCard('学习进度','58%','平均完成度')}
        ${statCard('本周学习','6.5 小时','较上周 +18%')}
        ${statCard('学习记录','32 条','章节维度记录')}
      </div>
      <div class="card card-inner" style="margin-top:20px">
        <h3 class="card-title">我的课程</h3>
        <table class="table"><thead><tr><th>课程名称</th><th>分类</th><th>进度</th><th>状态</th><th>操作</th></tr></thead><tbody>
          ${learning.map(c=>`<tr><td>${c.title}</td><td>${c.category}</td><td><div class="progress"><i style="width:${c.progress}%"></i></div>${c.progress}%</td><td><span class="status ${c.progress>70?'ok':'info'}">${c.progress>70?'接近完成':'学习中'}</span></td><td><a class="btn btn-soft" href="#/course/${c.id}">继续学习</a></td></tr>`).join('')}
        </tbody></table>
      </div>
    </main>
  `)
}

function statCard(title, value, desc) {
  return `<div class="card card-inner"><p class="card-desc">${title}</p><h2 style="margin:8px 0 6px">${value}</h2><p class="card-desc">${desc}</p></div>`
}

function teacherPage() {
  return appShell(`
    <main class="container page">
      <div class="section-head"><div><h2>教学机构后台</h2><p>面向教学机构和课程运营人员，管理课程草稿、审核发布、课程计划与上下架状态。</p></div><button class="btn btn-primary" onclick="toast('已创建课程草稿')">新建课程</button></div>
      <div class="card card-inner">
        <table class="table"><thead><tr><th>课程名称</th><th>状态</th><th>课程计划</th><th>最近更新</th><th>操作</th></tr></thead><tbody>
          <tr><td>Java 微服务项目实战</td><td><span class="status ok">已发布</span></td><td>36 课时</td><td>2025-12-02</td><td><button class="btn btn-soft" onclick="toast('课程已重新发布，前台缓存将在更新后失效')">重新发布</button></td></tr>
          <tr><td>Redis 缓存与高并发场景</td><td><span class="status wait">待审核</span></td><td>22 课时</td><td>2025-11-28</td><td><button class="btn btn-soft" onclick="toast('已提交课程审核')">提交审核</button></td></tr>
          <tr><td>对象存储与大文件上传</td><td><span class="status gray">草稿</span></td><td>20 课时</td><td>2025-11-20</td><td><button class="btn btn-soft" onclick="toast('进入课程编辑流程')">编辑</button></td></tr>
        </tbody></table>
      </div>
      <div class="grid grid-3" style="margin-top:20px">
        ${feature('book','课程草稿','编辑阶段数据与发布数据分离，保证前台展示数据稳定。')}
        ${feature('shield','审核发布','课程经过审核、发布、上架后进入前台检索和学习流程。')}
        ${feature('cloud','缓存更新','课程重新发布后刷新发布数据，并更新搜索索引与前台缓存。')}
      </div>
    </main>
  `)
}

function mediaPage() {
  return appShell(`
    <main class="container page">
      <div class="section-head"><div><h2>媒资管理中心</h2><p>统一管理图片、视频等课程资源，支持大文件上传、断点续传和合并校验流程。</p></div></div>
      <div class="grid grid-2">
        <div class="card card-inner">
          <h3 class="card-title">视频上传</h3>
          <div class="upload-zone">
            ${icon('upload')}
            <h3>选择课程视频文件</h3>
            <p class="card-desc">上传流程包含 MD5 校验、分片检测、分片上传、服务端合并与文件完整性校验。</p>
            <div style="margin-top:16px"><button class="btn btn-primary" onclick="startUpload()">开始上传</button><button class="btn btn-ghost" onclick="pauseUpload()" style="margin-left:8px">中断上传</button></div>
          </div>
          <div class="progress"><i id="uploadBar" style="width:${state.uploadProgress}%"></i></div>
          <p class="card-desc">当前进度：${state.uploadProgress}%</p>
        </div>
        <div class="card card-inner"><h3 class="card-title">上传日志</h3><div class="log-panel" id="uploadLogs">${state.uploadLogs.map(l=>`<div>${l}</div>`).join('') || '<div>等待上传任务开始...</div>'}</div></div>
      </div>
      <div class="card card-inner" style="margin-top:20px"><h3 class="card-title">媒资库</h3><table class="table"><thead><tr><th>文件名称</th><th>类型</th><th>存储位置</th><th>状态</th></tr></thead><tbody><tr><td>java-microservice-intro.mp4</td><td>视频</td><td>mediafiles/course/1001</td><td><span class="status ok">已入库</span></td></tr><tr><td>course-cover.png</td><td>图片</td><td>mediafiles/image/cover</td><td><span class="status ok">已入库</span></td></tr></tbody></table></div>
    </main>
  `)
}

function ordersPage() {
  const steps = ['创建选课记录', '生成订单和支付记录', '等待支付结果', '发送支付结果消息', '学习服务开通课程']
  return appShell(`
    <main class="container page">
      <div class="section-head"><div><h2>订单中心</h2><p>展示免费课程和收费课程的选课路径，以及支付完成后的消息通知流程。</p></div><button class="btn btn-primary" onclick="nextOrderStep()">推进流程</button></div>
      <div class="grid grid-2">
        <div class="card card-inner"><h3 class="card-title">选课支付流程</h3><div class="timeline">${steps.map((s,i)=>`<div class="step"><h4>${s}</h4><p>${i <= state.orderStep ? '已完成' : '等待处理'}${i===3?'：订单服务发送支付结果消息，学习服务消费后更新学习资格。':''}</p></div>`).join('')}</div></div>
        <div class="card card-inner"><h3 class="card-title">订单可靠性处理</h3><div class="kv"><label>超时关闭</label><div>订单创建后发送延迟消息，超时后由死信队列消费者二次校验订单状态。</div></div><div class="kv"><label>消息确认</label><div>生产端关注 Publisher Confirm，消费端处理成功后再确认消息。</div></div><div class="kv"><label>幂等控制</label><div>只有未支付订单允许关闭，已支付或已关闭状态直接忽略。</div></div></div>
      </div>
    </main>
  `)
}

function authPage() {
  return appShell(`
    <main class="container page">
      <div class="section-head"><div><h2>认证授权中心</h2><p>统一处理用户登录认证、Token 校验和业务接口权限控制。</p></div></div>
      <div class="grid grid-3">
        ${feature('user','登录认证','用户登录后生成访问令牌，前端后续请求携带 Token 访问网关。')}
        ${feature('lock','Token 校验','网关和资源服务解析 Token，校验签名、过期时间与用户身份。')}
        ${feature('shield','权限控制','接口根据用户权限标识进行访问控制，限制越权访问。')}
      </div>
      <div class="card card-inner" style="margin-top:20px"><h3 class="card-title">权限示例</h3><table class="table"><thead><tr><th>角色</th><th>可访问模块</th><th>权限说明</th></tr></thead><tbody><tr><td>学员</td><td>课程中心、学习中心、订单中心</td><td>购买课程、学习课程、查看订单</td></tr><tr><td>教师</td><td>教学后台、媒资管理</td><td>维护课程、上传媒资、发布课程</td></tr><tr><td>管理员</td><td>系统管理、认证授权</td><td>用户管理、角色权限配置</td></tr></tbody></table></div>
    </main>
  `)
}

function architecturePage() {
  const services = [
    ['Gateway', '统一入口、路由转发、鉴权过滤'],
    ['Auth', '登录认证、Token 生成与校验'],
    ['Content', '课程信息、课程计划、发布流程'],
    ['Media', '文件上传、媒资管理、对象存储'],
    ['Search', '课程索引、搜索筛选、聚合统计'],
    ['Orders', '选课下单、支付记录、超时关闭'],
    ['Learning', '学习资格、课程表、学习记录'],
    ['System', '用户、角色、权限基础数据'],
  ]
  const middleware = [
    ['MySQL', '业务数据持久化'], ['Redis', '缓存、热门词统计'], ['RabbitMQ', '异步消息、超时订单'], ['Elasticsearch', '课程全文检索'], ['MinIO', '对象存储'], ['XXL-JOB', '任务调度'], ['Nacos', '注册中心与配置管理'], ['Nginx', '前端部署与反向代理']
  ]
  return appShell(`
    <main class="container page">
      <div class="section-head"><div><h2>系统架构</h2><p>平台采用微服务拆分方式，将不同业务能力独立成服务，并通过统一网关对外提供访问入口。</p></div></div>
      <div class="card card-inner"><h3 class="card-title">业务服务</h3><div class="arch-grid">${services.map(([n,d])=>`<div class="service"><strong>${n}</strong><span>${d}</span></div>`).join('')}</div></div>
      <div class="card card-inner" style="margin-top:20px"><h3 class="card-title">基础组件</h3><div class="arch-grid">${middleware.map(([n,d])=>`<div class="service"><strong>${n}</strong><span>${d}</span></div>`).join('')}</div></div>
    </main>
  `)
}

function render() {
  const path = route()
  let html
  if (path === '/') html = homePage()
  else if (path === '/courses') html = coursesPage()
  else if (path.startsWith('/course/')) html = courseDetailPage(path.split('/').pop())
  else if (path === '/learning') html = learningPage()
  else if (path === '/teacher') html = teacherPage()
  else if (path === '/media') html = mediaPage()
  else if (path === '/orders') html = ordersPage()
  else if (path === '/auth') html = authPage()
  else if (path === '/architecture') html = architecturePage()
  else html = homePage()
  document.getElementById('app').innerHTML = html
  bindEvents()
}

function bindEvents() {
  const keyword = document.getElementById('keyword')
  if (keyword) keyword.addEventListener('input', e => { state.keyword = e.target.value; render() })
  ;['category','level','price'].forEach(id => {
    const el = document.getElementById(id)
    if (el) el.addEventListener('change', e => { state[id] = e.target.value; render() })
  })
}

function setKeyword(word) { state.keyword = word; render() }
function toast(text) {
  const el = document.getElementById('toast')
  if (!el) return
  el.textContent = text
  el.classList.add('show')
  setTimeout(() => el.classList.remove('show'), 2300)
}
function joinCourse(id) {
  const course = courses.find(c=>c.id===id)
  if (!course) return
  if (course.price === 0) toast('免费课程已加入学习中心')
  else { state.orderStep = 1; setRoute('/orders'); setTimeout(()=>toast('已生成待支付订单'), 80) }
}
function startUpload() {
  if (state.uploading) return
  state.uploading = true
  state.uploadProgress = Math.max(state.uploadProgress, 0)
  const logs = ['计算文件 MD5...', '调用 checkfile 检查完整文件是否存在', '完整文件不存在，开始检查已上传分片']
  logs.forEach((l,i)=>setTimeout(()=>{ state.uploadLogs.push(l); render() }, i*280))
  const timer = setInterval(() => {
    if (!state.uploading) { clearInterval(timer); return }
    state.uploadProgress = Math.min(100, state.uploadProgress + 8)
    if (state.uploadProgress < 100) state.uploadLogs.push(`上传分片 ${Math.ceil(state.uploadProgress/8)} / 13`)
    else {
      state.uploadLogs.push('所有分片上传完成，服务端开始合并')
      state.uploadLogs.push('合并后文件 MD5 校验通过，媒资入库成功')
      state.uploading = false
      clearInterval(timer)
      toast('媒资上传完成')
    }
    render()
  }, 520)
}
function pauseUpload() {
  if (!state.uploading) { toast('当前没有正在上传的任务'); return }
  state.uploading = false
  state.uploadLogs.push('上传已中断，下次继续时仅上传缺失分片')
  render()
}
function nextOrderStep() {
  state.orderStep = Math.min(4, state.orderStep + 1)
  render()
  const tips = ['已创建选课记录', '已生成订单和支付记录', '支付结果等待中', '支付结果消息已发送', '学习服务已开通课程']
  toast(tips[state.orderStep])
}

window.addEventListener('hashchange', render)
window.setKeyword = setKeyword
window.joinCourse = joinCourse
window.startUpload = startUpload
window.pauseUpload = pauseUpload
window.nextOrderStep = nextOrderStep
window.toast = toast
render()
