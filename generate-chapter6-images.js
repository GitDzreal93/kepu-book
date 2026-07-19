const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = '/Users/leiwen/WorkBuddy/kepu/images/chapter6';

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

const marker = `<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>`;

const svgs = {
  'q78-cap-theorem': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">CAP 定理：分区时 C 和 A 二选一</text>
<circle cx="400" cy="200" r="140" fill="none" stroke="#333" stroke-width="1.5" />
<text x="375" y="80" font-size="14" fill="#4A6FA5" font-weight="bold">C 一致性</text>
<text x="375" y="95" font-size="11" fill="#4A6FA5">所有节点数据相同</text>
<text x="220" y="300" font-size="14" fill="#6B8E23" font-weight="bold">A 可用性</text>
<text x="210" y="315" font-size="11" fill="#6B8E23">持续提供服务</text>
<text x="530" y="300" font-size="14" fill="#A56F4A" font-weight="bold">P 分区容错</text>
<text x="520" y="315" font-size="11" fill="#A56F4A">网络可分区</text>
<text x="370" y="200" font-size="12" fill="#D88A8A" font-weight="bold">P必选</text>
<text x="350" y="220" font-size="11" fill="#D88A8A">C vs A 二选一</text>
<rect x="80" y="350" width="300" height="70" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="375" font-size="13" fill="#4A6FA5" font-weight="bold">CP：银行核心交易</text>
<text x="100" y="395" font-size="11" fill="#333">宁可拒绝服务，不能数据不一致</text>
<text x="100" y="410" font-size="11" fill="#666">ZooKeeper / etcd / HBase</text>
<rect x="420" y="350" width="300" height="70" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="440" y="375" font-size="13" fill="#6B8E23" font-weight="bold">AP：朋友圈/微博</text>
<text x="440" y="395" font-size="11" fill="#333">宁可短暂不一致，不能加载失败</text>
<text x="440" y="410" font-size="11" fill="#666">Cassandra / Redis / Eureka</text>
<text x="80" y="450" font-size="12" fill="#D88A8A">现代系统做细粒度取舍：核心交易CP，非核心展示AP</text>
${marker}
</svg>`,

  'q79-distributed-lock': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">分布式锁：Redis vs ZooKeeper</text>
<rect x="80" y="80" width="310" height="200" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="120" y="110" font-size="14" fill="#A56F4A" font-weight="bold">Redis SETNX</text>
<rect x="100" y="125" width="270" height="30" fill="none" stroke="#333" stroke-width="1" />
<text x="110" y="145" font-size="10" fill="#333">SETNX key request_id NX PX 30000</text>
<text x="100" y="175" font-size="11" fill="#333">获得锁：SETNX返回成功</text>
<text x="100" y="195" font-size="11" fill="#333">释放锁：Lua脚本验证ID后删除</text>
<text x="100" y="220" font-size="11" fill="#6B8E23">优点：快(内存) | 简单</text>
<text x="100" y="240" font-size="11" fill="#D88A8A">缺点：主从切换可能丢锁</text>
<text x="100" y="260" font-size="11" fill="#D88A8A">需看门狗续期 | 非公平</text>
<text x="100" y="275" font-size="11" fill="#666">适合：秒杀/缓存更新</text>
<rect x="420" y="80" width="310" height="200" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="460" y="110" font-size="14" fill="#4A6FA5" font-weight="bold">ZooKeeper 临时顺序节点</text>
<rect x="440" y="125" width="270" height="30" fill="none" stroke="#333" stroke-width="1" />
<text x="450" y="145" font-size="10" fill="#333">/locks/lock-00000001 (临时顺序节点)</text>
<text x="440" y="175" font-size="11" fill="#333">获得锁：创建节点+序号最小者得锁</text>
<text x="440" y="195" font-size="11" fill="#333">释放锁：删除节点(或断开自动删除)</text>
<text x="440" y="220" font-size="11" fill="#6B8E23">优点：CP强一致 | 公平排队</text>
<text x="440" y="240" font-size="11" fill="#6B8E23">崩溃自动释放 | 不需过期时间</text>
<text x="440" y="260" font-size="11" fill="#D88A8A">缺点：性能低于Redis | 较复杂</text>
<text x="440" y="275" font-size="11" fill="#666">适合：金融转账/定时任务</text>
<text x="80" y="310" font-size="13" fill="#333" font-weight="bold">选择标准：你能容忍多大程度的锁偶尔失效？</text>
<text x="80" y="340" font-size="12" fill="#333">Redis快但可能丢锁 | ZK慢但绝对可靠</text>
<text x="80" y="370" font-size="12" fill="#666">秒杀扣库存→Redis | 金融转账→ZK | 定时任务→ZK</text>
${marker}
</svg>`,

  'q80-raft-consensus': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">Raft 共识：Leader选举+日志复制</text>
<rect x="350" y="80" width="100" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2.5" />
<text x="365" y="110" font-size="13" fill="#A56F4A" font-weight="bold">Leader</text>
<rect x="80" y="180" width="100" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="95" y="210" font-size="13" fill="#4A6FA5">Follower1</text>
<rect x="350" y="180" width="100" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="365" y="210" font-size="13" fill="#4A6FA5">Follower2</text>
<rect x="620" y="180" width="100" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="635" y="210" font-size="13" fill="#4A6FA5">Follower3</text>
<line x1="390" y1="130" x2="130" y2="180" stroke="#A56F4A" stroke-width="1.5" marker-end="url(#arrow)" />
<line x1="400" y1="130" x2="400" y2="180" stroke="#A56F4A" stroke-width="1.5" marker-end="url(#arrow)" />
<line x1="410" y1="130" x2="670" y2="180" stroke="#A56F4A" stroke-width="1.5" marker-end="url(#arrow)" />
<text x="200" y="160" font-size="11" fill="#A56F4A">AppendEntries</text>
<text x="530" y="160" font-size="11" fill="#A56F4A">复制日志</text>
<rect x="80" y="270" width="640" height="70" rx="4" fill="none" stroke="#333" stroke-width="1.5" />
<text x="100" y="295" font-size="12" fill="#333" font-weight="bold">Safety保证：已提交的日志永不丢失</text>
<text x="100" y="315" font-size="11" fill="#333">已提交=复制到多数节点 | 新Leader获多数票 | 两个多数派必有交集</text>
<text x="100" y="332" font-size="11" fill="#6B8E23">→ 新Leader一定持有所有已提交日志</text>
<rect x="80" y="360" width="300" height="60" rx="4" fill="none" stroke="#4A6FA5" stroke-width="1.5" />
<text x="100" y="385" font-size="12" fill="#4A6FA5" font-weight="bold">日志格式</text>
<text x="100" y="405" font-size="11" fill="#333">[Term=3, Index=5, Command="SET x=1"]</text>
<rect x="420" y="360" width="300" height="60" rx="4" fill="none" stroke="#6B8E23" stroke-width="1.5" />
<text x="440" y="385" font-size="12" fill="#6B8E23" font-weight="bold">选举约束</text>
<text x="440" y="405" font-size="11" fill="#333">Candidate日志至少和多数节点一样新</text>
<text x="80" y="445" font-size="12" fill="#666">etcd / Consul / TiKV 都基于Raft</text>
${marker}
</svg>`,

  'q81-container-vs-vm': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">容器 vs 虚拟机</text>
<rect x="80" y="80" width="300" height="240" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="120" y="110" font-size="14" fill="#4A6FA5" font-weight="bold">虚拟机 VM</text>
<rect x="100" y="125" width="260" height="25" fill="none" stroke="#4A6FA5" stroke-width="1" />
<text x="120" y="143" font-size="11" fill="#4A6FA5">App | App | App</text>
<rect x="100" y="155" width="260" height="25" fill="none" stroke="#A56F4A" stroke-width="1" />
<text x="115" y="173" font-size="11" fill="#A56F4A">Guest OS (各自独立内核)</text>
<rect x="100" y="185" width="260" height="25" fill="none" stroke="#6B8E23" stroke-width="1" />
<text x="130" y="203" font-size="11" fill="#6B8E23">Hypervisor</text>
<rect x="100" y="215" width="260" height="25" fill="none" stroke="#333" stroke-width="1" />
<text x="150" y="233" font-size="11" fill="#333">Host OS 内核</text>
<rect x="100" y="245" width="260" height="25" fill="none" stroke="#333" stroke-width="1" />
<text x="180" y="263" font-size="11" fill="#333">物理硬件</text>
<text x="100" y="295" font-size="11" fill="#D88A8A">重：每VM一个Guest OS(1-2GB)</text>
<text x="100" y="310" font-size="11" fill="#6B8E23">强隔离：硬件级</text>
<rect x="420" y="80" width="300" height="240" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="460" y="110" font-size="14" fill="#A56F4A" font-weight="bold">容器 Container</text>
<rect x="440" y="125" width="260" height="25" fill="none" stroke="#A56F4A" stroke-width="1" />
<text x="460" y="143" font-size="11" fill="#A56F4A">App|Lib App|Lib App|Lib</text>
<rect x="440" y="155" width="260" height="25" fill="none" stroke="#6B8E23" stroke-width="1" />
<text x="465" y="173" font-size="11" fill="#6B8E23">容器运行时(Docker/containerd)</text>
<rect x="440" y="185" width="260" height="25" fill="none" stroke="#333" stroke-width="1" />
<text x="500" y="203" font-size="11" fill="#333">Host OS 内核(共享)</text>
<rect x="440" y="215" width="260" height="25" fill="none" stroke="#333" stroke-width="1" />
<text x="520" y="233" font-size="11" fill="#333">物理硬件</text>
<text x="440" y="265" font-size="11" fill="#D88A8A">无Guest OS层</text>
<text x="440" y="285" font-size="11" fill="#6B8E23">轻：只含App+依赖库(50-200MB)</text>
<text x="440" y="300" font-size="11" fill="#D88A8A">弱隔离：共享内核</text>
<text x="440" y="315" font-size="11" fill="#6B8E23">快：秒级启动</text>
<text x="80" y="360" font-size="13" fill="#333" font-weight="bold">隔离层级不同：VM=硬件级 | 容器=进程级</text>
<text x="80" y="385" font-size="12" fill="#333">Namespace隔离"能看到什么" | Cgroups限制"能用多少资源"</text>
<text x="80" y="410" font-size="12" fill="#666">实际架构：物理机→VM(租户隔离)→容器(应用隔离)</text>
<text x="80" y="435" font-size="12" fill="#D88A8A">容器不是"更轻的VM"——是完全不同的隔离机制</text>
${marker}
</svg>`,

  'q82-distributed-mq': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">Kafka：分区并行 + 副本可靠</text>
<rect x="80" y="80" width="100" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="90" y="110" font-size="13" fill="#4A6FA5">Producer</text>
<rect x="250" y="70" width="130" height="220" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="270" y="100" font-size="13" fill="#A56F4A" font-weight="bold">Topic</text>
<rect x="265" y="115" width="100" height="45" fill="none" stroke="#A56F4A" stroke-width="1" />
<text x="280" y="135" font-size="11" fill="#333">P0</text>
<text x="280" y="150" font-size="10" fill="#666">msg1,msg4,msg7</text>
<rect x="265" y="170" width="100" height="45" fill="none" stroke="#A56F4A" stroke-width="1" />
<text x="280" y="190" font-size="11" fill="#333">P1</text>
<text x="280" y="205" font-size="10" fill="#666">msg2,msg5,msg8</text>
<rect x="265" y="225" width="100" height="45" fill="none" stroke="#A56F4A" stroke-width="1" />
<text x="280" y="245" font-size="11" fill="#333">P2</text>
<text x="280" y="260" font-size="10" fill="#666">msg3,msg6,msg9</text>
<rect x="500" y="80" width="100" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="510" y="110" font-size="13" fill="#6B8E23">Consumer0</text>
<rect x="500" y="160" width="100" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="510" y="190" font-size="13" fill="#6B8E23">Consumer1</text>
<rect x="500" y="240" width="100" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="510" y="270" font-size="13" fill="#6B8E23">Consumer2</text>
<line x1="180" y1="105" x2="250" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="365" y1="137" x2="500" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="365" y1="192" x2="500" y2="185" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="365" y1="247" x2="500" y2="265" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="620" y="105" font-size="11" fill="#333">← P0</text>
<text x="620" y="185" font-size="11" fill="#333">← P1</text>
<text x="620" y="265" font-size="11" fill="#333">← P2</text>
<rect x="80" y="310" width="640" height="80" rx="4" fill="none" stroke="#333" stroke-width="1.5" />
<text x="100" y="335" font-size="12" fill="#333" font-weight="bold">不丢消息三段保证：</text>
<text x="100" y="355" font-size="11" fill="#333">Producer: acks=all + 重试 | Broker: ISR副本同步 | Consumer: 手动提交offset</text>
<text x="100" y="375" font-size="11" fill="#6B8E23">顺序保证：同一key→同一Partition→按写入顺序消费</text>
<text x="80" y="420" font-size="12" fill="#666">百万QPS：批量写入(16KB/批) + 顺序磁盘写 + 零拷贝(sendfile)</text>
${marker}
</svg>`,

  'q83-elasticsearch': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">Elasticsearch：倒排索引 vs B+树</text>
<rect x="80" y="80" width="320" height="200" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="120" y="110" font-size="14" fill="#4A6FA5" font-weight="bold">MySQL B+ 树索引</text>
<text x="100" y="140" font-size="11" fill="#333">正向：从行找内容</text>
<text x="100" y="160" font-size="11" fill="#333">SELECT * WHERE id=123</text>
<text x="100" y="180" font-size="11" fill="#333">→ B+树定位→读取行数据</text>
<text x="100" y="210" font-size="11" fill="#D88A8A">LIKE '%keyword%' → 全表扫描</text>
<text x="100" y="230" font-size="11" fill="#D88A8A">50GB数据 → 10分钟</text>
<text x="100" y="260" font-size="11" fill="#6B8E23">擅长：精确查找/事务/Join</text>
<rect x="420" y="80" width="320" height="200" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="460" y="110" font-size="14" fill="#6B8E23" font-weight="bold">ES 倒排索引</text>
<text x="440" y="140" font-size="11" fill="#333">反向：从内容找文档</text>
<text x="440" y="160" font-size="11" fill="#333">NullPointerException → [doc1,doc5,doc12]</text>
<text x="440" y="180" font-size="11" fill="#333">→ 直接拿到匹配文档列表</text>
<text x="440" y="210" font-size="11" fill="#6B8E23">全文搜索 → O(1)查倒排索引</text>
<text x="440" y="230" font-size="11" fill="#6B8E23">50GB数据 → 1秒</text>
<text x="440" y="260" font-size="11" fill="#D88A8A">不擅长：事务/wildcard/Join</text>
<rect x="80" y="300" width="640" height="80" rx="4" fill="none" stroke="#A56F4A" stroke-width="1.5" />
<text x="100" y="325" font-size="12" fill="#A56F4A" font-weight="bold">ES 分布式架构</text>
<text x="100" y="345" font-size="11" fill="#333">Index → 多Shard(分片)分布多节点 | 每Shard有Replica(副本)</text>
<text x="100" y="365" font-size="11" fill="#333">搜索：协调节点→并行查所有Shard→合并结果→返回</text>
<text x="80" y="410" font-size="12" fill="#333">分词器：Standard(空格分) | IK(中文分词) | Keyword(不分)</text>
<text x="80" y="435" font-size="12" fill="#666">ES不是"更好的MySQL"——互补：MySQL做事务，ES做搜索分析</text>
${marker}
</svg>`,

  'q84-circuit-breaker': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">熔断器：阻止故障蔓延</text>
<rect x="200" y="80" width="120" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2.5" />
<text x="215" y="110" font-size="13" fill="#6B8E23" font-weight="bold">Closed(正常)</text>
<rect x="480" y="80" width="120" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="2.5" />
<text x="500" y="110" font-size="13" fill="#D88A8A" font-weight="bold">Open(熔断)</text>
<rect x="340" y="200" width="120" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2.5" />
<text x="350" y="225" font-size="13" fill="#A56F4A" font-weight="bold">Half-Open</text>
<text x="350" y="242" font-size="11" fill="#A56F4A">试探恢复</text>
<line x1="320" y1="105" x2="480" y2="105" stroke="#D88A8A" stroke-width="1.5" marker-end="url(#arrow)" />
<text x="350" y="95" font-size="11" fill="#D88A8A">失败率>阈值</text>
<line x1="540" y1="130" x2="460" y2="200" stroke="#A56F4A" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrow)" />
<text x="555" y="170" font-size="11" fill="#A56F4A">冷却时间后</text>
<line x1="340" y1="225" x2="260" y2="130" stroke="#6B8E23" stroke-width="1.5" marker-end="url(#arrow)" />
<text x="250" y="180" font-size="11" fill="#6B8E23">试探成功</text>
<line x1="400" y1="225" x2="500" y2="130" stroke="#D88A8A" stroke-width="1.5" marker-end="url(#arrow)" />
<text x="420" y="180" font-size="11" fill="#D88A8A">试探失败</text>
<rect x="80" y="280" width="640" height="60" rx="4" fill="none" stroke="#333" stroke-width="1.5" />
<text x="100" y="305" font-size="12" fill="#333" font-weight="bold">熔断后：降级响应（不直接报错）</text>
<text x="100" y="325" font-size="11" fill="#333">返回缓存 / 返回默认值 / 返回简化结果</text>
<rect x="80" y="350" width="640" height="70" rx="4" fill="none" stroke="#A56F4A" stroke-width="1.5" />
<text x="100" y="375" font-size="12" fill="#A56F4A" font-weight="bold">三个保护机制对比</text>
<text x="100" y="395" font-size="11" fill="#333">熔断=下游故障时停止调用 | 限流=自身超限拒绝请求 | 重试=偶发失败重发</text>
<text x="100" y="415" font-size="11" fill="#D88A8A">熔断已打开时不能重试——会放大流量加重下游负担</text>
<text x="80" y="450" font-size="12" fill="#666">核心：断臂求生——宁可损失一个功能，不要整个系统崩溃</text>
${marker}
</svg>`,

  'q85-realtime-counter': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">高并发计数器：批量上报架构</text>
<rect x="80" y="80" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="90" y="110" font-size="13" fill="#4A6FA5">用户浏览</text>
<rect x="280" y="80" width="160" height="80" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="300" y="110" font-size="13" fill="#A56F4A" font-weight="bold">本地计数器</text>
<text x="300" y="130" font-size="11" fill="#333">内存+1(纳秒级)</text>
<text x="300" y="150" font-size="11" fill="#333">每5秒批量上报</text>
<rect x="540" y="80" width="160" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="560" y="110" font-size="13" fill="#6B8E23">Redis INCRBY</text>
<line x1="200" y1="105" x2="280" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="210" y="95" font-size="11" fill="#333">阅读+1</text>
<line x1="440" y1="105" x2="540" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="450" y="95" font-size="11" fill="#333">批量+1234</text>
<rect x="540" y="160" width="160" height="50" rx="4" fill="none" stroke="#333" stroke-width="2" />
<text x="560" y="190" font-size="13" fill="#333">MySQL</text>
<text x="560" y="205" font-size="11" fill="#666">每分钟持久化</text>
<line x1="620" y1="130" x2="620" y2="160" stroke="#666" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<rect x="80" y="200" width="640" height="70" rx="4" fill="none" stroke="#333" stroke-width="1.5" />
<text x="100" y="225" font-size="12" fill="#333" font-weight="bold">效果：Redis写QPS = 总QPS / 批量大小</text>
<text x="100" y="245" font-size="11" fill="#333">百万QPS / 每批1000 = Redis只需1000 QPS → 轻松扛住</text>
<text x="100" y="262" font-size="11" fill="#6B8E23">精度损失：数字慢5秒——用户完全可接受</text>
<rect x="80" y="290" width="310" height="100" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="100" y="315" font-size="13" fill="#A56F4A" font-weight="bold">HyperLogLog：近似去重计数</text>
<text x="100" y="340" font-size="11" fill="#333">统计不重复用户数</text>
<text x="100" y="360" font-size="11" fill="#333">12KB内存 → 5亿用户</text>
<text x="100" y="380" font-size="11" fill="#6B8E23">误差约0.81% → 99.19%精度</text>
<rect x="420" y="290" width="300" height="100" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="440" y="315" font-size="13" fill="#6B8E23" font-weight="bold">Count-Min Sketch：频率估计</text>
<text x="440" y="340" font-size="11" fill="#333">统计每个关键词出现次数</text>
<text x="440" y="360" font-size="11" fill="#333">多哈希+二维数组</text>
<text x="440" y="380" font-size="11" fill="#6B8E23">适合"Top N热搜"场景</text>
<text x="80" y="430" font-size="12" fill="#666">核心：在精度和性能间找平衡——用户要"大致数字"不是精确到个位</text>
${marker}
</svg>`,

  'q86-k8s-self-healing': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">K8s 自愈：声明式 + 控制器循环</text>
<rect x="280" y="80" width="240" height="60" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="310" y="105" font-size="13" fill="#A56F4A" font-weight="bold">etcd：期望状态</text>
<text x="310" y="125" font-size="11" fill="#333">Deployment: replicas=3</text>
<rect x="280" y="180" width="240" height="60" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="310" y="205" font-size="13" fill="#4A6FA5" font-weight="bold">实际状态</text>
<text x="310" y="225" font-size="11" fill="#333">当前集群有2个Ready Pod</text>
<line x1="400" y1="140" x2="400" y2="180" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
<text x="410" y="165" font-size="11" fill="#666">对比</text>
<rect x="280" y="280" width="240" height="60" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="300" y="305" font-size="13" fill="#D88A8A" font-weight="bold">期望(3) != 实际(2)</text>
<text x="300" y="325" font-size="11" fill="#333">→ 创建1个新Pod</text>
<line x1="400" y1="240" x2="400" y2="280" stroke="#D88A8A" stroke-width="1.5" marker-end="url(#arrow)" />
<rect x="560" y="180" width="120" height="60" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="580" y="205" font-size="12" fill="#6B8E23">Controller</text>
<text x="580" y="225" font-size="11" fill="#333">持续循环</text>
<line x1="560" y1="210" x2="520" y2="210" stroke="#6B8E23" stroke-width="1.5" marker-end="url(#arrow)" />
<line x1="560" y1="230" x2="520" y2="310" stroke="#6B8E23" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<text x="80" y="380" font-size="12" fill="#333" font-weight="bold">Reconciliation Loop：</text>
<text x="80" y="400" font-size="11" fill="#333">while True: 读取期望 → 观察实际 → 不等就修复</text>
<text x="80" y="420" font-size="11" fill="#6B8E23">每隔几秒巡检一次 → Pod挂了几秒内自动修复</text>
<text x="80" y="445" font-size="12" fill="#666">健康检查：Liveness(重启) + Readiness(摘除流量) | 自愈不是AI——是死循环对比</text>
${marker}
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
