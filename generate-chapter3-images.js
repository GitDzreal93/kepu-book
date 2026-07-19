const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = '/Users/leiwen/WorkBuddy/kepu/images/chapter3';

const baseStyle = `
<defs>
  <filter id="pencil">
    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" />
  </filter>
</defs>
<rect width="800" height="500" fill="#F9F7F0" />
<g stroke="#DDD6C0" stroke-width="1">
  <line x1="0" y1="60" x2="800" y2="60" />
  <line x1="0" y1="100" x2="800" y2="100" />
  <line x1="0" y1="140" x2="800" y2="140" />
  <line x1="0" y1="180" x2="800" y2="180" />
  <line x1="0" y1="220" x2="800" y2="220" />
  <line x1="0" y1="260" x2="800" y2="260" />
  <line x1="0" y1="300" x2="800" y2="300" />
  <line x1="0" y1="340" x2="800" y2="340" />
  <line x1="0" y1="380" x2="800" y2="380" />
  <line x1="0" y1="420" x2="800" y2="420" />
  <line x1="0" y1="460" x2="800" y2="460" />
</g>
<line x1="60" y1="0" x2="60" y2="500" stroke="#D88A8A" stroke-width="2" />
`;

const svgs = {
  'q30-short-url': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">短链接系统架构</text>
<rect x="80" y="80" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="90" y="110" font-size="13" fill="#333">Client</text>
<rect x="280" y="80" width="130" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="290" y="110" font-size="13" fill="#A56F4A">生成短码</text>
<rect x="480" y="80" width="130" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="490" y="110" font-size="13" fill="#6B8E23">去重检查</text>
<rect x="280" y="200" width="130" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="290" y="230" font-size="13" fill="#A56F4A">MySQL</text>
<rect x="480" y="200" width="130" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="490" y="230" font-size="13" fill="#6B8E23">Redis</text>
<rect x="280" y="320" width="130" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="290" y="350" font-size="13" fill="#A56F4A">302重定向</text>
<line x1="200" y1="105" x2="280" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="410" y1="105" x2="480" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="610" y1="105" x2="610" y2="105" />
<line x1="345" y1="130" x2="345" y2="200" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="545" y1="130" x2="545" y2="200" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="345" y1="250" x2="345" y2="320" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="480" y1="345" x2="410" y2="345" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="410" y1="345" x2="410" y2="130" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="410" y1="130" x2="200" y2="130" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q31-login-system': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">登录系统：Session vs JWT vs SSO</text>
<rect x="80" y="80" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="110" font-size="13" fill="#333">Browser</text>
<rect x="280" y="80" width="130" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="290" y="110" font-size="13" fill="#A56F4A">Auth Server</text>
<rect x="280" y="200" width="130" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="290" y="230" font-size="13" fill="#6B8E23">Redis Session</text>
<rect x="480" y="80" width="130" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="490" y="110" font-size="13" fill="#A56F4A">App A</text>
<rect x="480" y="200" width="130" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="490" y="230" font-size="13" fill="#A56F4A">App B</text>
<line x1="200" y1="105" x2="280" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="410" y1="105" x2="480" y2="105" stroke="#666" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<line x1="410" y1="225" x2="480" y2="225" stroke="#666" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<line x1="345" y1="130" x2="345" y2="200" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="120" y="300" font-size="12" fill="#333">Session：状态存在服务端Redis，Cookie只带Session ID</text>
<text x="120" y="330" font-size="12" fill="#333">JWT：Token自包含用户信息，服务端无状态但难撤销</text>
<text x="120" y="360" font-size="12" fill="#333">SSO：Auth Server统一登录，多个App互信</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q32-ota-upgrade': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">OTA A/B 分区升级</text>
<rect x="80" y="80" width="120" height="200" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="120" font-size="14" fill="#4A6FA5" font-weight="bold">A区</text>
<text x="90" y="160" font-size="12" fill="#333">当前运行</text>
<text x="90" y="190" font-size="12" fill="#333">旧系统</text>
<rect x="300" y="80" width="120" height="200" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="320" y="120" font-size="14" fill="#6B8E23" font-weight="bold">B区</text>
<text x="310" y="160" font-size="12" fill="#333">下载新系统</text>
<text x="310" y="190" font-size="12" fill="#333">写入校验</text>
<line x1="200" y1="180" x2="300" y2="180" stroke="#666" stroke-width="1" stroke-dasharray="5,5" marker-end="url(#arrow)" />
<text x="220" y="170" font-size="12" fill="#333">新系统写入</text>
<rect x="500" y="80" width="120" height="200" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="520" y="120" font-size="14" fill="#A56F4A" font-weight="bold">重启</text>
<text x="510" y="160" font-size="12" fill="#333">切换到B区</text>
<text x="510" y="190" font-size="12" fill="#333">失败则回A区</text>
<line x1="420" y1="180" x2="500" y2="180" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="80" y="340" font-size="12" fill="#333">A/B 分区：旧系统保持可用，新系统写入后切换，失败可回滚</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q33-device-shadow': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">设备影子：云端状态副本</text>
<rect x="80" y="80" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="110" font-size="13" fill="#333">App</text>
<rect x="340" y="80" width="120" height="80" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="350" y="110" font-size="13" fill="#A56F4A">Device Shadow</text>
<text x="350" y="135" font-size="11" fill="#333">reported</text>
<text x="410" y="135" font-size="11" fill="#333">desired</text>
<rect x="600" y="80" width="120" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="610" y="110" font-size="13" fill="#6B8E23">IoT Device</text>
<line x1="200" y1="105" x2="340" y2="105" stroke="#4A6FA5" stroke-width="2" marker-end="url(#arrow)" />
<text x="230" y="95" font-size="11" fill="#333">读取/设置desired</text>
<line x1="460" y1="105" x2="600" y2="105" stroke="#6B8E23" stroke-width="2" marker-end="url(#arrow)" stroke-dasharray="3,3" />
<text x="480" y="95" font-size="11" fill="#333">设备在线时同步</text>
<line x1="660" y1="130" x2="660" y2="220" stroke="#6B8E23" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<line x1="660" y1="220" x2="400" y2="220" stroke="#6B8E23" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<line x1="400" y1="220" x2="400" y2="160" stroke="#6B8E23" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<text x="480" y="240" font-size="11" fill="#333">设备上报reported</text>
<text x="80" y="320" font-size="12" fill="#333">App 不直接操作设备，而是改 desired；设备上线后拉 desired 并同步 reported</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q34-seckill': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">秒杀系统：四层过滤</text>
<rect x="80" y="80" width="130" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="90" y="110" font-size="13" fill="#333">前端</text>
<rect x="250" y="80" width="130" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="260" y="110" font-size="13" fill="#A56F4A">网关</text>
<rect x="420" y="80" width="130" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="430" y="110" font-size="13" fill="#6B8E23">服务</text>
<rect x="590" y="80" width="130" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="600" y="110" font-size="13" fill="#A56F4A">数据库</text>
<line x1="210" y1="105" x2="250" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="380" y1="105" x2="420" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="550" y1="105" x2="590" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="80" y="170" font-size="12" fill="#333">前端：验证码、按钮置灰、CDN、URL动态化</text>
<text x="80" y="200" font-size="12" fill="#333">网关：限流、黑名单、去重、缓存预热</text>
<text x="80" y="230" font-size="12" fill="#333">服务：Redis预扣库存、MQ异步下单</text>
<text x="80" y="260" font-size="12" fill="#333">数据库：乐观锁/唯一索引防止超卖</text>
<rect x="80" y="300" width="640" height="40" rx="4" fill="none" stroke="#666" stroke-width="1.5" />
<text x="95" y="325" font-size="12" fill="#333">核心：让大部分请求在入口失败，只放少量请求进入核心业务链路</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q35-kafka': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">Kafka Partition 与 Consumer Group</text>
<rect x="80" y="80" width="100" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="90" y="110" font-size="13" fill="#333">Producer</text>
<rect x="250" y="80" width="120" height="150" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="260" y="110" font-size="13" fill="#A56F4A">Topic</text>
<rect x="260" y="130" width="100" height="30" fill="none" stroke="#A56F4A" stroke-width="1" />
<text x="270" y="150" font-size="11" fill="#333">P0</text>
<rect x="260" y="170" width="100" height="30" fill="none" stroke="#A56F4A" stroke-width="1" />
<text x="270" y="190" font-size="11" fill="#333">P1</text>
<rect x="260" y="210" width="100" height="30" fill="none" stroke="#A56F4A" stroke-width="1" />
<text x="270" y="230" font-size="11" fill="#333">P2</text>
<rect x="450" y="80" width="100" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="460" y="110" font-size="13" fill="#6B8E23">Consumer1</text>
<rect x="450" y="160" width="100" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="460" y="190" font-size="13" fill="#6B8E23">Consumer2</text>
<rect x="450" y="240" width="100" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="460" y="270" font-size="13" fill="#6B8E23">Consumer3</text>
<line x1="180" y1="105" x2="250" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="370" y1="145" x2="450" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="370" y1="185" x2="450" y2="185" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="370" y1="225" x2="450" y2="265" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="80" y="340" font-size="12" fill="#333">Topic分多个Partition，Producer可并发写，Consumer Group内每个Partition只被一个Consumer消费</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q36-cache': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">Cache Aside 读写流程</text>
<rect x="80" y="80" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="110" font-size="13" fill="#333">App</text>
<rect x="300" y="80" width="120" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="310" y="110" font-size="13" fill="#A56F4A">Redis</text>
<rect x="550" y="80" width="120" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="560" y="110" font-size="13" fill="#6B8E23">MySQL</text>
<line x1="200" y1="105" x2="300" y2="105" stroke="#4A6FA5" stroke-width="2" marker-end="url(#arrow)" />
<text x="220" y="95" font-size="11" fill="#333">1.读请求</text>
<line x1="420" y1="105" x2="550" y2="105" stroke="#A56F4A" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<text x="440" y="95" font-size="11" fill="#333">2.缓存未命中</text>
<line x1="610" y1="130" x2="610" y2="180" stroke="#6B8E23" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<line x1="610" y1="180" x2="360" y2="180" stroke="#6B8E23" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<line x1="360" y1="180" x2="360" y2="130" stroke="#6B8E23" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<text x="450" y="170" font-size="11" fill="#333">3.写回缓存</text>
<line x1="360" y1="130" x2="200" y2="130" stroke="#6B8E23" stroke-width="1" marker-end="url(#arrow)" />
<text x="240" y="150" font-size="11" fill="#333">4.返回结果</text>
<line x1="140" y1="130" x2="140" y2="250" stroke="#4A6FA5" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<line x1="140" y1="250" x2="360" y2="250" stroke="#4A6FA5" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<text x="160" y="270" font-size="11" fill="#333">写：先更新DB，再删缓存</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q37-redis-single-thread': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">Redis 单线程 + IO多路复用</text>
<rect x="80" y="80" width="120" height="300" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="90" y="120" font-size="14" fill="#4A6FA5" font-weight="bold">Redis</text>
<text x="90" y="160" font-size="12" fill="#333">单个主线程</text>
<rect x="100" y="180" width="80" height="80" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="105" y="225" font-size="12" fill="#6B8E23">epoll</text>
<rect x="300" y="100" width="80" height="40" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="310" y="125" font-size="12" fill="#A56F4A">Client1</text>
<rect x="300" y="180" width="80" height="40" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="310" y="205" font-size="12" fill="#A56F4A">Client2</text>
<rect x="300" y="260" width="80" height="40" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="310" y="285" font-size="12" fill="#A56F4A">Client3</text>
<line x1="300" y1="120" x2="180" y2="200" stroke="#666" stroke-width="1" stroke-dasharray="3,3" />
<line x1="300" y1="200" x2="180" y2="220" stroke="#666" stroke-width="1" stroke-dasharray="3,3" />
<line x1="300" y1="280" x2="180" y2="240" stroke="#666" stroke-width="1" stroke-dasharray="3,3" />
<text x="450" y="150" font-size="12" fill="#333">epoll 同时监听多个连接</text>
<text x="450" y="180" font-size="12" fill="#333">只有有数据的连接才触发处理</text>
<text x="450" y="210" font-size="12" fill="#333">命令执行仍是单线程，无锁竞争</text>
<text x="450" y="240" font-size="12" fill="#333">Redis 6.0+ 多线程只处理IO读写</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q38-sharding': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">水平分库分表</text>
<rect x="80" y="80" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="110" font-size="13" fill="#333">App</text>
<rect x="250" y="80" width="130" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="260" y="110" font-size="13" fill="#A56F4A">分片路由</text>
<rect x="450" y="80" width="100" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="460" y="110" font-size="13" fill="#6B8E23">DB0</text>
<rect x="450" y="160" width="100" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="460" y="190" font-size="13" fill="#6B8E23">DB1</text>
<rect x="450" y="240" width="100" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="460" y="270" font-size="13" fill="#6B8E23">DB2</text>
<line x1="200" y1="105" x2="250" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="380" y1="105" x2="450" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="380" y1="105" x2="450" y2="185" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="380" y1="105" x2="450" y2="265" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="80" y="350" font-size="12" fill="#333">user_id % 3 = 0 → DB0, 1 → DB1, 2 → DB2</text>
<text x="80" y="380" font-size="12" fill="#333">按分片键路由，跨分片查询需要聚合或全分片扫描</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q39-id-generation': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">Snowflake 64位ID结构</text>
<rect x="80" y="100" width="640" height="60" rx="4" fill="none" stroke="#333" stroke-width="2" />
<line x1="80" y1="100" x2="80" y2="160" stroke="#333" stroke-width="1.5" />
<line x1="100" y1="100" x2="100" y2="160" stroke="#333" stroke-width="1.5" />
<line x1="380" y1="100" x2="380" y2="160" stroke="#333" stroke-width="1.5" />
<line x1="620" y1="100" x2="620" y2="160" stroke="#333" stroke-width="1.5" />
<line x1="720" y1="100" x2="720" y2="160" stroke="#333" stroke-width="1.5" />
<text x="85" y="85" font-size="12" fill="#333">1bit</text>
<text x="200" y="85" font-size="12" fill="#333">41bits</text>
<text x="480" y="85" font-size="12" fill="#333">10bits</text>
<text x="660" y="85" font-size="12" fill="#333">12bits</text>
<text x="85" y="180" font-size="11" fill="#333">符号</text>
<text x="200" y="180" font-size="11" fill="#333">时间戳</text>
<text x="480" y="180" font-size="11" fill="#333">机器ID</text>
<text x="660" y="180" font-size="11" fill="#333">序列号</text>
<text x="80" y="250" font-size="12" fill="#333">每秒每机器可生成 4096 * 1000 ≈ 400万个ID</text>
<text x="80" y="280" font-size="12" fill="#333">ID 趋势递增，适合数据库主键</text>
<text x="80" y="310" font-size="12" fill="#333">依赖时钟，需处理时钟回拨问题</text>
</svg>`,
  'q40-microservices': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">单体 vs 微服务</text>
<rect x="80" y="80" width="200" height="200" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="110" font-size="14" fill="#4A6FA5" font-weight="bold">Monolith</text>
<text x="100" y="150" font-size="12" fill="#333">用户</text>
<text x="100" y="180" font-size="12" fill="#333">订单</text>
<text x="100" y="210" font-size="12" fill="#333">库存</text>
<text x="100" y="240" font-size="12" fill="#333">支付</text>
<rect x="400" y="80" width="80" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="410" y="110" font-size="12" fill="#6B8E23">User svc</text>
<rect x="520" y="80" width="80" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="530" y="110" font-size="12" fill="#6B8E23">Order svc</text>
<rect x="640" y="80" width="80" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="650" y="110" font-size="12" fill="#6B8E23">Stock svc</text>
<rect x="400" y="180" width="80" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="410" y="210" font-size="12" fill="#6B8E23">Pay svc</text>
<line x1="480" y1="105" x2="520" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="600" y1="105" x2="640" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="680" y1="130" x2="680" y2="180" stroke="#666" stroke-width="1" stroke-dasharray="3,3" />
<line x1="680" y1="205" x2="440" y2="205" stroke="#666" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<text x="400" y="300" font-size="12" fill="#333">单体：一个仓库，一个进程，部署简单</text>
<text x="400" y="330" font-size="12" fill="#333">微服务：独立部署，独立扩展，但分布式复杂性高</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q41-idempotent-payment': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">支付幂等：Idempotency Key</text>
<rect x="80" y="80" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="110" font-size="13" fill="#333">Client</text>
<rect x="300" y="80" width="130" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="310" y="110" font-size="13" fill="#A56F4A">Idempotency</text>
<rect x="550" y="80" width="120" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="560" y="110" font-size="13" fill="#6B8E23">Payment</text>
<line x1="200" y1="105" x2="300" y2="105" stroke="#4A6FA5" stroke-width="2" marker-end="url(#arrow)" />
<text x="220" y="95" font-size="11" fill="#333">请求1: key=abc</text>
<line x1="430" y1="105" x2="550" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="200" y1="150" x2="300" y2="150" stroke="#4A6FA5" stroke-width="2" marker-end="url(#arrow)" />
<text x="220" y="140" font-size="11" fill="#333">请求2: key=abc</text>
<line x1="300" y1="165" x2="300" y2="230" stroke="#A56F4A" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<rect x="300" y="230" width="130" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="310" y="260" font-size="13" fill="#A56F4A">幂等表</text>
<text x="310" y="295" font-size="11" fill="#333">key=abc → 已处理</text>
<line x1="300" y1="255" x2="200" y2="255" stroke="#A56F4A" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<text x="80" y="360" font-size="12" fill="#333">同一个 Idempotency Key 只执行一次，重复请求返回第一次结果</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q42-config-center': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">配置中心动态推送</text>
<rect x="300" y="80" width="150" height="80" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="310" y="110" font-size="14" fill="#A56F4A" font-weight="bold">Config Center</text>
<text x="310" y="140" font-size="12" fill="#333">pageSize=10</text>
<rect x="80" y="200" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="90" y="230" font-size="13" fill="#333">App1</text>
<rect x="340" y="200" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="350" y="230" font-size="13" fill="#4A6FA5">App2</text>
<rect x="600" y="200" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="610" y="230" font-size="13" fill="#4A6FA5">App3</text>
<line x1="375" y1="160" x2="375" y2="200" stroke="#A56F4A" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<line x1="375" y1="180" x2="140" y2="220" stroke="#A56F4A" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<line x1="375" y1="180" x2="660" y2="220" stroke="#A56F4A" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<text x="80" y="320" font-size="12" fill="#333">一处修改配置，所有客户端实时或准实时接收变更</text>
<text x="80" y="350" font-size="12" fill="#333">配置与代码分离，支持版本、回滚、灰度</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q43-distributed-transaction': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">Saga 分布式事务：正向+补偿</text>
<rect x="80" y="80" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="90" y="110" font-size="13" fill="#333">A扣款</text>
<rect x="250" y="80" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="260" y="110" font-size="13" fill="#333">B加款</text>
<rect x="420" y="80" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="430" y="110" font-size="13" fill="#333">通知</text>
<line x1="200" y1="105" x2="250" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="370" y1="105" x2="420" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="470" y="170" font-size="12" fill="#D88A8A">通知失败</text>
<line x1="470" y1="130" x2="470" y2="180" stroke="#D88A8A" stroke-width="1" marker-end="url(#arrow)" />
<rect x="250" y="200" width="120" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="260" y="230" font-size="13" fill="#D88A8A">B退款</text>
<rect x="80" y="200" width="120" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="90" y="230" font-size="13" fill="#D88A8A">A退款</text>
<line x1="370" y1="225" x2="250" y2="225" stroke="#D88A8A" stroke-width="1" marker-end="url(#arrow)" />
<line x1="200" y1="225" x2="80" y2="225" stroke="#D88A8A" stroke-width="1" marker-end="url(#arrow)" />
<text x="80" y="320" font-size="12" fill="#333">Saga：每个本地事务有对应补偿操作，失败时按相反顺序回滚</text>
<text x="80" y="350" font-size="12" fill="#333">最终一致性，适合流程长、可补偿的业务</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q44-api-gateway': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">API 网关：统一入口</text>
<rect x="80" y="200" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="230" font-size="13" fill="#333">Client</text>
<rect x="280" y="150" width="130" height="150" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="290" y="180" font-size="14" fill="#A56F4A" font-weight="bold">API Gateway</text>
<text x="290" y="210" font-size="11" fill="#333">认证</text>
<text x="290" y="235" font-size="11" fill="#333">限流</text>
<text x="290" y="260" font-size="11" fill="#333">路由</text>
<rect x="500" y="80" width="100" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="510" y="110" font-size="13" fill="#6B8E23">User svc</text>
<rect x="500" y="160" width="100" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="510" y="190" font-size="13" fill="#6B8E23">Order svc</text>
<rect x="500" y="240" width="100" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="510" y="270" font-size="13" fill="#6B8E23">Pay svc</text>
<line x1="200" y1="225" x2="280" y2="225" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="410" y1="200" x2="500" y2="110" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="410" y1="225" x2="500" y2="185" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="410" y1="250" x2="500" y2="265" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="80" y="360" font-size="12" fill="#333">统一入口聚合横切能力，后端服务专注业务逻辑</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q45-hot-update': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">热更新：资源替换</text>
<rect x="80" y="80" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="110" font-size="13" fill="#333">App</text>
<rect x="280" y="80" width="130" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="290" y="110" font-size="13" fill="#A56F4A">版本检查</text>
<rect x="480" y="80" width="130" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="490" y="110" font-size="13" fill="#6B8E23">差分包下载</text>
<rect x="280" y="200" width="130" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="290" y="230" font-size="13" fill="#A56F4A">签名校验</text>
<rect x="280" y="320" width="130" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="290" y="350" font-size="13" fill="#A56F4A">替换资源</text>
<line x1="200" y1="105" x2="280" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="410" y1="105" x2="480" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="545" y1="130" x2="545" y2="180" stroke="#666" stroke-width="1" stroke-dasharray="3,3" />
<line x1="545" y1="225" x2="345" y2="225" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="345" y1="250" x2="345" y2="320" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="80" y="420" font-size="12" fill="#333">只更新资源/脚本，不重新安装；必须校验签名防篡改</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`
};

async function main() {
  for (const [name, svg] of Object.entries(svgs)) {
    const svgPath = path.join(outDir, `${name}.svg`);
    fs.writeFileSync(svgPath, svg);
    const pngPath = path.join(outDir, `${name}.png`);
    await sharp(Buffer.from(svg))
      .resize(1600, 1000, { fit: 'contain' })
      .png({ quality: 100, compressionLevel: 6 })
      .toFile(pngPath);
    console.log(`Generated: ${name}.png`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
