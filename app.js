const courses = [
  { id: 1001, name: 'Java 微服务项目实战', category: '后端开发', subCategory: 'Java', difficulty: '中级', price: 199, tags: ['Spring Cloud', 'Nacos', 'Gateway'], desc: '围绕在线教育微服务业务，讲解服务拆分、远程调用、认证授权和消息解耦。' },
  { id: 1002, name: 'Spring Boot 快速入门', category: '后端开发', subCategory: 'Java', difficulty: '初级', price: 0, tags: ['Spring Boot', 'MVC', 'MyBatis'], desc: '适合 Java 初学者掌握 Web 开发、接口开发和数据库访问。' },
  { id: 1003, name: 'Elasticsearch 课程搜索实战', category: '后端开发', subCategory: '搜索引擎', difficulty: '中级', price: 129, tags: ['ES', 'BoolQuery', '聚合'], desc: '从课程索引构建到多条件检索，学习倒排索引、分页、高亮和聚合。' },
  { id: 1004, name: 'RabbitMQ 订单支付消息实战', category: '后端开发', subCategory: '消息队列', difficulty: '中级', price: 99, tags: ['RabbitMQ', '死信队列', '幂等'], desc: '围绕订单超时关闭、支付结果通知、本地消息表讲解消息可靠性。' },
  { id: 1005, name: 'MinIO 大文件上传与断点续传', category: '后端开发', subCategory: '对象存储', difficulty: '中级', price: 99, tags: ['MinIO', '分片上传', 'MD5'], desc: '演示视频文件分片上传、分片校验、服务端合并和文件完整性校验。' },
  { id: 1006, name: 'Redis 缓存设计与实战', category: '后端开发', subCategory: '缓存', difficulty: '中级', price: 79, tags: ['Redis', '缓存穿透', '缓存击穿'], desc: '讲解读多写少场景下的缓存设计、热点数据缓存和一致性处理。' },
  { id: 1007, name: 'Vue3 在线课程前端开发', category: '前端开发', subCategory: 'Vue', difficulty: '初级', price: 0, tags: ['Vue3', 'Vite', '组件化'], desc: '构建课程列表、课程详情、学习中心和个人中心页面。' },
  { id: 1008, name: 'React 项目展示站开发', category: '前端开发', subCategory: 'React', difficulty: '初级', price: 0, tags: ['React', '作品集', '部署'], desc: '面向求职场景，搭建个人主页和项目展示页面。' },
  { id: 1009, name: 'AI 智能客服 RAG 实战', category: '人工智能', subCategory: '大模型应用', difficulty: '中级', price: 169, tags: ['Spring AI', 'RAG', 'Tool Calling'], desc: '接入大模型、业务知识库和工具调用能力，完成智能客服问答系统。' },
  { id: 1010, name: 'Python 数据分析基础', category: '数据分析', subCategory: 'Python', difficulty: '初级', price: 0, tags: ['Python', 'Pandas', '可视化'], desc: '适合入门数据清洗、统计分析和图表绘制。' },
  { id: 1011, name: 'MySQL 索引与 SQL 优化', category: '数据库', subCategory: 'MySQL', difficulty: '中级', price: 89, tags: ['索引', 'Explain', '事务'], desc: '讲解索引设计、执行计划分析、事务隔离级别和慢 SQL 排查。' },
  { id: 1012, name: 'JVM 内存模型与 GC', category: '后端开发', subCategory: 'Java', difficulty: '高级', price: 149, tags: ['JVM', 'GC', 'OOM'], desc: '系统讲解 JVM 内存区域、类加载、垃圾回收和线上 OOM 排查思路。' },
];

const $ = (id) => document.getElementById(id);
let selectedCourse = null;
let chooseRecord = null;
let orderRecord = null;
let courseTable = [];
let logs = [];
let stopUpload = false;
let currentUpload = null;
const chunkSize = 1024 * 1024; // 1MB demo chunk

function formatPrice(price) { return price === 0 ? '免费' : `￥${price}`; }
function log(message) {
  const time = new Date().toLocaleTimeString();
  logs.unshift(`[${time}] ${message}`);
  $('flowLog').textContent = logs.join('\n');
}
function unique(arr) { return [...new Set(arr)]; }
function countBy(list, field) {
  return list.reduce((acc, item) => { acc[item[field]] = (acc[item[field]] || 0) + 1; return acc; }, {});
}

function initFilters() {
  $('statCourse').textContent = courses.length;
  const categories = unique(courses.map(c => c.category));
  const difficulties = unique(courses.map(c => c.difficulty));
  $('categorySelect').innerHTML = '<option value="">全部分类</option>' + categories.map(v => `<option value="${v}">${v}</option>`).join('');
  $('difficultySelect').innerHTML = '<option value="">全部难度</option>' + difficulties.map(v => `<option value="${v}">${v}</option>`).join('');
}

function getFilteredCourses() {
  const keyword = $('keywordInput').value.trim().toLowerCase();
  const category = $('categorySelect').value;
  const difficulty = $('difficultySelect').value;
  const priceType = $('priceSelect').value;
  return courses.filter(c => {
    const keywordHit = !keyword || [c.name, c.desc, c.category, c.subCategory, ...c.tags].join(' ').toLowerCase().includes(keyword);
    const categoryHit = !category || c.category === category;
    const difficultyHit = !difficulty || c.difficulty === difficulty;
    const priceHit = !priceType || (priceType === 'free' ? c.price === 0 : c.price > 0);
    return keywordHit && categoryHit && difficultyHit && priceHit;
  });
}

function renderSearch() {
  const list = getFilteredCourses();
  $('resultCount').textContent = list.length;
  $('courseList').innerHTML = list.map(c => `
    <article class="course-card">
      <div class="course-top">
        <h3>${highlight(c.name)}</h3>
        <span class="price">${formatPrice(c.price)}</span>
      </div>
      <p>${c.desc}</p>
      <div class="tags">
        <span class="tag">${c.category}</span><span class="tag">${c.subCategory}</span><span class="tag">${c.difficulty}</span>
        ${c.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      <button class="btn secondary small" onclick="chooseCourse(${c.id})">选择课程</button>
    </article>
  `).join('') || '<div class="empty">没有匹配课程，换个关键词试试。</div>';
  renderAgg(list);
  renderDsl();
}
function highlight(text) {
  const keyword = $('keywordInput').value.trim();
  if (!keyword) return text;
  const reg = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(reg, '<mark>$1</mark>');
}
function renderAgg(list) {
  const catCount = countBy(list, 'category');
  const diffCount = countBy(list, 'difficulty');
  $('categoryAgg').innerHTML = '<b>分类聚合</b>' + Object.entries(catCount).map(([k,v]) => `<div class="agg-item"><span>${k}</span><strong>${v}</strong></div>`).join('');
  $('difficultyAgg').innerHTML = '<b>难度聚合</b>' + Object.entries(diffCount).map(([k,v]) => `<div class="agg-item"><span>${k}</span><strong>${v}</strong></div>`).join('');
}
function renderDsl() {
  const dsl = {
    index: 'course-publish',
    query: {
      bool: {
        must: $('keywordInput').value.trim() ? [{ multi_match: { query: $('keywordInput').value.trim(), fields: ['name^10', 'description'], minimum_should_match: '70%' } }] : [],
        filter: [
          $('categorySelect').value && { term: { mtName: $('categorySelect').value } },
          $('difficultySelect').value && { term: { grade: $('difficultySelect').value } },
          $('priceSelect').value && { term: { charge: $('priceSelect').value } },
        ].filter(Boolean)
      }
    },
    aggs: { mtAgg: { terms: { field: 'mtName' } }, stAgg: { terms: { field: 'stName' } } }
  };
  $('dslPreview').textContent = JSON.stringify(dsl, null, 2);
}

window.chooseCourse = function(courseId) {
  selectedCourse = courses.find(c => c.id === courseId);
  chooseRecord = null; orderRecord = null; logs = [];
  $('selectedCourse').innerHTML = `
    <h3>${selectedCourse.name}</h3>
    <p>${selectedCourse.desc}</p>
    <p><b>价格：</b>${formatPrice(selectedCourse.price)}　<b>难度：</b>${selectedCourse.difficulty}</p>
    <button class="btn primary small" onclick="startChooseFlow()">开始选课流程</button>
  `;
  renderBusinessState();
  location.hash = '#learning';
};

window.startChooseFlow = function() {
  if (!selectedCourse) return;
  const id = 'CC' + Date.now();
  if (selectedCourse.price === 0) {
    chooseRecord = { id, courseId: selectedCourse.id, status: '701001 选课成功', orderType: '700001 免费课' };
    courseTable.push({ courseId: selectedCourse.id, courseName: selectedCourse.name, valid: true });
    log(`学习服务：免费课 ${selectedCourse.name} 直接生成选课成功记录，并加入课程表。`);
  } else {
    chooseRecord = { id, courseId: selectedCourse.id, status: '701002 待支付', orderType: '700002 收费课' };
    log(`学习服务：收费课 ${selectedCourse.name} 生成待支付选课记录，chooseCourseId=${id}。`);
  }
  renderBusinessState();
};

window.createOrder = function() {
  if (!chooseRecord) return;
  orderRecord = { id: 'OD' + Date.now(), payNo: 'PAY' + Math.floor(Math.random() * 1000000), status: '600001 未支付', amount: selectedCourse.price, businessId: chooseRecord.id };
  log(`订单服务：根据选课记录 ${chooseRecord.id} 创建订单 ${orderRecord.id} 和支付记录 ${orderRecord.payNo}。`);
  renderBusinessState();
};

window.paySuccess = function() {
  if (!orderRecord) return;
  orderRecord.status = '600002 交易成功';
  log(`订单服务：支付记录 ${orderRecord.payNo} 支付成功，更新订单状态。`);
  log(`RabbitMQ：发送 payresult_notify 消息，businessKey1=${chooseRecord.id}。`);
  chooseRecord.status = '701001 选课成功';
  courseTable.push({ courseId: selectedCourse.id, courseName: selectedCourse.name, valid: true });
  log(`学习服务：消费支付结果消息，将选课记录改为成功，并加入课程表。`);
  renderBusinessState();
};

function renderBusinessState() {
  const items = [];
  if (selectedCourse) items.push(['已选择课程', `${selectedCourse.name}（${formatPrice(selectedCourse.price)}）`, true]);
  if (chooseRecord) items.push(['选课记录', `${chooseRecord.id} / ${chooseRecord.orderType} / ${chooseRecord.status}`, true]);
  if (chooseRecord && selectedCourse.price > 0 && !orderRecord) items.push(['订单记录', `<button class="btn secondary small" onclick="createOrder()">生成订单和支付记录</button>`, false]);
  if (orderRecord) items.push(['订单记录', `${orderRecord.id} / ${orderRecord.status} / payNo=${orderRecord.payNo}`, true]);
  if (orderRecord && orderRecord.status.includes('未支付')) items.push(['模拟支付', `<button class="btn primary small" onclick="paySuccess()">模拟支付成功并发送 MQ</button>`, false]);
  if (courseTable.some(c => c.courseId === selectedCourse?.id)) items.push(['学习资格', '已加入课程表，可正常学习', true]);
  $('businessState').innerHTML = items.map(([title, text, done]) => `<div class="timeline-item ${done ? 'done' : ''}"><b>${title}</b><br>${text}</div>`).join('') || '<div class="empty">等待操作。</div>';
}

async function sha256(file) {
  const buf = await file.arrayBuffer();
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}
function uploadKey(fingerprint) { return `cloudcourse-upload-${fingerprint}`; }
function addUploadLog(message) {
  const old = $('uploadLog').textContent;
  $('uploadLog').textContent = `[${new Date().toLocaleTimeString()}] ${message}\n${old}`;
}
async function prepareUpload() {
  const file = $('fileInput').files[0];
  if (!file) { addUploadLog('请先选择文件。'); return null; }
  if (currentUpload && currentUpload.file === file) return currentUpload;
  addUploadLog('正在计算文件指纹，请稍候...');
  const fingerprint = await sha256(file);
  const chunks = Math.ceil(file.size / chunkSize);
  const saved = JSON.parse(localStorage.getItem(uploadKey(fingerprint)) || 'null');
  currentUpload = { file, fingerprint, chunks, uploaded: saved?.uploaded || Array(chunks).fill(false), merged: saved?.merged || false };
  renderUploadInfo();
  return currentUpload;
}
function saveUploadState() {
  if (!currentUpload) return;
  localStorage.setItem(uploadKey(currentUpload.fingerprint), JSON.stringify({ uploaded: currentUpload.uploaded, merged: currentUpload.merged }));
}
function renderUploadInfo() {
  if (!currentUpload) return;
  const done = currentUpload.uploaded.filter(Boolean).length;
  $('fileInfo').innerHTML = `<b>文件：</b>${currentUpload.file.name}<br><b>大小：</b>${(currentUpload.file.size / 1024 / 1024).toFixed(2)} MB　<b>分片：</b>${done}/${currentUpload.chunks}<br><b>指纹：</b>${currentUpload.fingerprint.slice(0, 24)}...`;
  $('chunkList').innerHTML = currentUpload.uploaded.map((ok, i) => `<div class="chunk ${ok ? 'done' : 'pending'}">chunk ${i}<br>${ok ? '已上传' : '待上传'}</div>`).join('');
}

$('checkFileBtn').onclick = async () => {
  const up = await prepareUpload(); if (!up) return;
  if (up.merged) addUploadLog('checkfile：完整文件已存在，可直接秒传。');
  else addUploadLog('checkfile：完整文件不存在，进入分片上传流程。');
};
$('uploadBtn').onclick = async () => {
  const up = await prepareUpload(); if (!up) return;
  stopUpload = false;
  for (let i = 0; i < up.chunks; i++) {
    if (stopUpload) { addUploadLog('上传中断，已上传分片状态保存在 localStorage。'); break; }
    if (up.uploaded[i]) { addUploadLog(`checkchunk：chunk ${i} 已存在，跳过。`); continue; }
    await new Promise(r => setTimeout(r, 220));
    up.uploaded[i] = true;
    saveUploadState();
    renderUploadInfo();
    addUploadLog(`uploadchunk：chunk ${i} 上传成功。`);
  }
};
$('breakBtn').onclick = () => { stopUpload = true; };
$('mergeBtn').onclick = async () => {
  const up = await prepareUpload(); if (!up) return;
  if (up.uploaded.every(Boolean)) {
    up.merged = true; saveUploadState(); renderUploadInfo();
    addUploadLog('mergechunks：所有分片已上传，服务端合并成功，文件指纹校验通过。');
  } else addUploadLog('mergechunks：仍有分片未上传，不能合并。');
};
$('clearUploadBtn').onclick = async () => {
  const up = await prepareUpload(); if (!up) return;
  localStorage.removeItem(uploadKey(up.fingerprint));
  currentUpload = null; $('chunkList').innerHTML = ''; $('fileInfo').textContent = '本地上传状态已清空，请重新检查文件。'; addUploadLog('已清空当前文件的本地上传状态。');
};

['keywordInput','categorySelect','difficultySelect','priceSelect'].forEach(id => $(id).addEventListener('input', renderSearch));
$('resetSearch').onclick = () => { $('keywordInput').value=''; $('categorySelect').value=''; $('difficultySelect').value=''; $('priceSelect').value=''; renderSearch(); };
initFilters();
renderSearch();
renderBusinessState();
