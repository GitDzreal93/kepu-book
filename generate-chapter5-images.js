const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = '/Users/leiwen/WorkBuddy/kepu/images/chapter5';

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
  'q66-cicd-pipeline': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">CI/CD 流水线全流程</text>
<rect x="80" y="70" width="100" height="40" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="90" y="95" font-size="11" fill="#4A6FA5">代码 Push</text>
<rect x="210" y="70" width="100" height="40" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="220" y="95" font-size="11" fill="#4A6FA5">静态分析</text>
<rect x="340" y="70" width="100" height="40" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="355" y="95" font-size="11" fill="#4A6FA5">编译构建</text>
<rect x="470" y="70" width="100" height="40" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="485" y="95" font-size="11" fill="#4A6FA5">单元测试</text>
<rect x="600" y="70" width="100" height="40" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="615" y="95" font-size="11" fill="#4A6FA5">集成测试</text>
<line x1="180" y1="90" x2="210" y2="90" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="310" y1="90" x2="340" y2="90" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="440" y1="90" x2="470" y2="90" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="570" y1="90" x2="600" y2="90" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="280" y="130" font-size="11" fill="#4A6FA5" font-weight="bold">CI 阶段：持续集成</text>
<rect x="80" y="160" width="100" height="40" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="90" y="185" font-size="11" fill="#6B8E23">构建镜像</text>
<rect x="210" y="160" width="100" height="40" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="215" y="185" font-size="11" fill="#6B8E23">部署测试环境</text>
<rect x="340" y="160" width="100" height="40" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="350" y="185" font-size="11" fill="#6B8E23">E2E测试</text>
<rect x="470" y="160" width="100" height="40" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="475" y="185" font-size="11" fill="#6B8E23">部署预发布</text>
<rect x="600" y="160" width="100" height="40" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="610" y="185" font-size="11" fill="#6B8E23">人工审批</text>
<line x1="180" y1="180" x2="210" y2="180" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="310" y1="180" x2="340" y2="180" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="440" y1="180" x2="470" y2="180" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="570" y1="180" x2="600" y2="180" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="280" y="220" font-size="11" fill="#6B8E23" font-weight="bold">CD 阶段：持续部署</text>
<rect x="200" y="250" width="100" height="40" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="210" y="275" font-size="11" fill="#A56F4A">灰度1%</text>
<rect x="350" y="250" width="100" height="40" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="360" y="275" font-size="11" fill="#A56F4A">灰度5-25%</text>
<rect x="500" y="250" width="100" height="40" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="510" y="275" font-size="11" fill="#A56F4A">全量上线</text>
<line x1="300" y1="270" x2="350" y2="270" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="450" y1="270" x2="500" y2="270" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="180" y="275" font-size="11" fill="#A56F4A">灰度发布</text>
<rect x="200" y="320" width="400" height="40" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" stroke-dasharray="5,3" />
<text x="250" y="345" font-size="12" fill="#D88A8A">任一环节失败 → 自动回滚到上一稳定版本</text>
<text x="80" y="410" font-size="12" fill="#333">Fail Fast：问题前置发现 | 环境一致：Docker镜像保证</text>
<text x="80" y="435" font-size="12" fill="#666">Pipeline as Code：流水线配置随代码版本管理</text>
${marker}
</svg>`,

  'q67-test-pyramid': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">测试金字塔 vs 反金字塔</text>
<polygon points="400,80 250,380 550,380" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="370" y="200" font-size="14" fill="#6B8E23" font-weight="bold">E2E 5%</text>
<text x="360" y="220" font-size="11" fill="#6B8E23">分钟级/脆弱</text>
<text x="350" y="280" font-size="14" fill="#4A6FA5" font-weight="bold">集成 15%</text>
<text x="345" y="300" font-size="11" fill="#4A6FA5">秒级</text>
<text x="340" y="360" font-size="14" fill="#333" font-weight="bold">单元 80%</text>
<text x="330" y="375" font-size="11" fill="#333">毫秒级/精准</text>
<text x="200" y="400" font-size="12" fill="#6B8E23" font-weight="bold">正确：金字塔（底大顶小）</text>
<polygon points="650,80 500,100 500,130 650,110" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="540" y="100" font-size="11" fill="#D88A8A">E2E</text>
<polygon points="650,120 500,140 500,340 650,320" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="540" y="240" font-size="11" fill="#D88A8A">大量</text>
<polygon points="650,330 500,350 500,380 650,360" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="530" y="375" font-size="11" fill="#D88A8A">单元少</text>
<text x="500" y="410" font-size="12" fill="#D88A8A" font-weight="bold">错误：冰淇淋模型（倒金字塔）</text>
<text x="80" y="440" font-size="12" fill="#666">反金字塔 → CI跑2小时 → 跳过测试 → 线上事故</text>
${marker}
</svg>`,

  'q68-rebase-vs-merge': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">Merge vs Rebase 提交历史</text>
<text x="80" y="75" font-size="13" fill="#6B8E23" font-weight="bold">Merge（保留真相）：</text>
<circle cx="100" cy="110" r="12" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="95" y="115" font-size="10" fill="#4A6FA5">A</text>
<circle cx="180" cy="110" r="12" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="175" y="115" font-size="10" fill="#4A6FA5">B</text>
<circle cx="260" cy="110" r="12" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="255" y="115" font-size="10" fill="#4A6FA5">C</text>
<circle cx="180" cy="180" r="12" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="175" y="185" font-size="10" fill="#A56F4A">D</text>
<circle cx="260" cy="180" r="12" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="255" y="185" font-size="10" fill="#A56F4A">E</text>
<circle cx="340" cy="145" r="14" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="333" y="150" font-size="10" fill="#6B8E23">M</text>
<line x1="112" y1="110" x2="168" y2="110" stroke="#4A6FA5" stroke-width="1.5" marker-end="url(#arrow)" />
<line x1="192" y1="110" x2="248" y2="110" stroke="#4A6FA5" stroke-width="1.5" marker-end="url(#arrow)" />
<line x1="190" y1="122" x2="268" y2="168" stroke="#A56F4A" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<line x1="272" y1="180" x2="338" y2="155" stroke="#6B8E23" stroke-width="1" marker-end="url(#arrow)" />
<line x1="272" y1="110" x2="326" y2="140" stroke="#6B8E23" stroke-width="1" marker-end="url(#arrow)" />
<text x="360" y="145" font-size="11" fill="#333">Merge Commit</text>
<text x="360" y="160" font-size="11" fill="#666">保留并行开发真相</text>
<text x="80" y="240" font-size="13" fill="#A56F4A" font-weight="bold">Rebase（重写为直线）：</text>
<circle cx="100" cy="275" r="12" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="95" y="280" font-size="10" fill="#4A6FA5">A</text>
<circle cx="180" cy="275" r="12" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="175" y="280" font-size="10" fill="#4A6FA5">B</text>
<circle cx="260" cy="275" r="12" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="255" y="280" font-size="10" fill="#4A6FA5">C</text>
<circle cx="340" cy="275" r="12" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="333" y="280" font-size="10" fill="#A56F4A">D'</text>
<circle cx="420" cy="275" r="12" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="413" y="280" font-size="10" fill="#A56F4A">E'</text>
<line x1="112" y1="275" x2="168" y2="275" stroke="#4A6FA5" stroke-width="1.5" marker-end="url(#arrow)" />
<line x1="192" y1="275" x2="248" y2="275" stroke="#4A6FA5" stroke-width="1.5" marker-end="url(#arrow)" />
<line x1="272" y1="275" x2="328" y2="275" stroke="#A56F4A" stroke-width="1.5" marker-end="url(#arrow)" />
<line x1="352" y1="275" x2="408" y2="275" stroke="#A56F4A" stroke-width="1.5" marker-end="url(#arrow)" />
<text x="440" y="275" font-size="11" fill="#333">D'和E'是新commit</text>
<text x="440" y="290" font-size="11" fill="#A56F4A">SHA变了，历史被改写</text>
<text x="80" y="370" font-size="13" fill="#D88A8A" font-weight="bold">铁律：不rebase已push的公共分支</text>
<text x="80" y="395" font-size="12" fill="#333">个人feature分支 → rebase保持整洁</text>
<text x="80" y="415" font-size="12" fill="#333">公共main分支 → merge保留真相</text>
<text x="80" y="440" font-size="12" fill="#666">SHA：Secure Hash Algorithm，Git用40位哈希唯一标识每个提交</text>
${marker}
</svg>`,

  'q69-deployment-strategies': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">三种部署策略对比</text>
<rect x="80" y="80" width="200" height="180" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="110" y="110" font-size="13" fill="#4A6FA5" font-weight="bold">蓝绿部署</text>
<rect x="100" y="125" width="75" height="50" fill="none" stroke="#4A6FA5" stroke-width="1.5" />
<text x="115" y="155" font-size="12" fill="#4A6FA5">Blue(当前)</text>
<rect x="185" y="125" width="75" height="50" fill="none" stroke="#6B8E23" stroke-width="1.5" />
<text x="200" y="155" font-size="12" fill="#6B8E23">Green(新)</text>
<text x="100" y="200" font-size="11" fill="#333">秒级回滚</text>
<text x="100" y="220" font-size="11" fill="#D88A8A">双倍基础设施</text>
<text x="100" y="245" font-size="11" fill="#333">核心支付系统</text>
<rect x="300" y="80" width="200" height="180" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="330" y="110" font-size="13" fill="#6B8E23" font-weight="bold">金丝雀发布</text>
<rect x="320" y="125" width="160" height="30" fill="none" stroke="#4A6FA5" stroke-width="1.5" />
<text x="340" y="145" font-size="11" fill="#4A6FA5">旧版本 99%</text>
<rect x="320" y="165" width="160" height="30" fill="none" stroke="#D88A8A" stroke-width="1.5" />
<text x="330" y="185" font-size="11" fill="#D88A8A">新版本 1% → 5% → 25%</text>
<text x="320" y="220" font-size="11" fill="#333">暴露面小</text>
<text x="320" y="240" font-size="11" fill="#333">自动回滚阈值</text>
<text x="320" y="255" font-size="11" fill="#333">社交/电商</text>
<rect x="520" y="80" width="200" height="180" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="550" y="110" font-size="13" fill="#A56F4A" font-weight="bold">灰度(Feature Flag)</text>
<rect x="540" y="125" width="160" height="30" fill="none" stroke="#6B8E23" stroke-width="1.5" />
<text x="555" y="145" font-size="11" fill="#6B8E23">新代码已部署到所有机器</text>
<text x="540" y="175" font-size="11" fill="#333">开关关闭=功能不可见</text>
<text x="540" y="195" font-size="11" fill="#333">开关打开=功能可见</text>
<text x="540" y="220" font-size="11" fill="#333">按维度控制</text>
<text x="540" y="240" font-size="11" fill="#333">(地域/VIP/设备)</text>
<text x="540" y="255" font-size="11" fill="#333">回滚=关开关</text>
<text x="80" y="300" font-size="12" fill="#333">可以组合：蓝绿切换环境 + 金丝雀逐步放量 + Feature Flag控制功能</text>
<text x="80" y="340" font-size="12" fill="#D88A8A" font-weight="bold">核心原则：回滚速度 > 上线速度</text>
<text x="80" y="365" font-size="12" fill="#666">蓝绿=秒级回滚 | 金丝雀=1%暴露 | FeatureFlag=功能级开关</text>
${marker}
</svg>`,

  'q70-tech-debt': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">技术债：值得借 vs 绝对不能借</text>
<rect x="80" y="80" width="300" height="70" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="100" y="105" font-size="13" fill="#6B8E23" font-weight="bold">值得借</text>
<text x="100" y="125" font-size="11" fill="#333">验证MVP的临时方案</text>
<text x="100" y="142" font-size="11" fill="#333">非核心业务 + 明确会重构</text>
<rect x="420" y="80" width="300" height="70" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="440" y="105" font-size="13" fill="#D88A8A" font-weight="bold">绝对不能借</text>
<text x="440" y="125" font-size="11" fill="#333">支付核心逻辑</text>
<text x="440" y="142" font-size="11" fill="#333">安全相关 + 数据库Schema</text>
<rect x="80" y="180" width="640" height="120" rx="4" fill="none" stroke="#A56F4A" stroke-width="1.5" />
<text x="100" y="205" font-size="13" fill="#A56F4A" font-weight="bold">技术债的四种类型</text>
<text x="100" y="230" font-size="11" fill="#333">1.有意为之：知道是简化方案，有还债计划（良性）</text>
<text x="100" y="250" font-size="11" fill="#333">2.无意产生：经验不足导致的设计问题</text>
<text x="100" y="270" font-size="11" fill="#333">3.不可避免：业务发展使原设计过时</text>
<text x="100" y="290" font-size="11" fill="#333">4.技术演进：框架/语言升级后的迁移债</text>
<rect x="80" y="320" width="640" height="80" rx="4" fill="none" stroke="#333" stroke-width="1.5" />
<text x="100" y="345" font-size="13" fill="#333" font-weight="bold">管理技术债</text>
<text x="100" y="365" font-size="11" fill="#333">可视化：SonarQube度量复杂度/重复率/债务规模</text>
<text x="100" y="385" font-size="11" fill="#333">分配资源：每Sprint固定20%时间还债 | 维护技术债登记簿</text>
<text x="80" y="430" font-size="12" fill="#D88A8A">技术债 vs 烂代码：技术债=有意识+有计划；烂代码=不知道有问题</text>
${marker}
</svg>`,

  'q71-monitoring-alert': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">监控告警：防告警风暴</text>
<rect x="80" y="70" width="120" height="40" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="95" font-size="11" fill="#4A6FA5">交换机故障</text>
<rect x="250" y="70" width="100" height="30" rx="4" fill="none" stroke="#D88A8A" stroke-width="1.5" />
<text x="260" y="90" font-size="10" fill="#D88A8A">告警:Server1</text>
<rect x="250" y="105" width="100" height="30" rx="4" fill="none" stroke="#D88A8A" stroke-width="1.5" />
<text x="260" y="125" font-size="10" fill="#D88A8A">告警:Server2</text>
<rect x="250" y="140" width="100" height="30" rx="4" fill="none" stroke="#D88A8A" stroke-width="1.5" />
<text x="260" y="160" font-size="10" fill="#D88A8A">告警:Server3</text>
<rect x="250" y="175" width="100" height="30" rx="4" fill="none" stroke="#D88A8A" stroke-width="1.5" />
<text x="265" y="195" font-size="10" fill="#D88A8A">...N条告警</text>
<line x1="200" y1="90" x2="250" y2="85" stroke="#D88A8A" stroke-width="1" marker-end="url(#arrow)" />
<line x1="200" y1="90" x2="250" y2="120" stroke="#D88A8A" stroke-width="1" marker-end="url(#arrow)" />
<line x1="200" y1="90" x2="250" y2="155" stroke="#D88A8A" stroke-width="1" marker-end="url(#arrow)" />
<line x1="200" y1="90" x2="250" y2="190" stroke="#D88A8A" stroke-width="1" marker-end="url(#arrow)" />
<text x="80" y="225" font-size="12" fill="#D88A8A" font-weight="bold">告警风暴：20000条短信淹没真正有价值的告警</text>
<rect x="80" y="250" width="640" height="100" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="100" y="275" font-size="13" fill="#6B8E23" font-weight="bold">防告警风暴策略</text>
<text x="100" y="295" font-size="11" fill="#333">1.告警聚合：相同根因合并为一条（1000台不可达→1条）</text>
<text x="100" y="315" font-size="11" fill="#333">2.告警抑制：交换机down → 抑制所有"服务器不可达"</text>
<text x="100" y="335" font-size="11" fill="#333">3.延迟告警：等2-3分钟，过滤短暂抖动</text>
<text x="100" y="355" font-size="11" fill="#333">4.分级告警：P0电话/P1短信/P2即时消息/P3邮件</text>
<text x="80" y="395" font-size="12" fill="#333">质量指标：信噪比>30% | MTTR | 告警确认率</text>
<text x="80" y="420" font-size="12" fill="#666">好的告警系统：每个告警都是actionable——你知道该干什么</text>
${marker}
</svg>`,

  'q72-build-vs-buy': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">造轮子 vs 用开源：经济决策</text>
<rect x="80" y="80" width="300" height="180" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="120" y="110" font-size="14" fill="#6B8E23" font-weight="bold">用开源（默认选择）</text>
<text x="100" y="140" font-size="12" fill="#333">非核心业务 → 不是竞争力</text>
<text x="100" y="165" font-size="12" fill="#333">规模未到瓶颈 → 通用方案够用</text>
<text x="100" y="190" font-size="12" fill="#333">成熟方案满足需求</text>
<text x="100" y="220" font-size="12" fill="#6B8E23">维护成本=0（社区维护）</text>
<text x="100" y="245" font-size="12" fill="#6B8E23">学习成本=低（文档/教程多）</text>
<rect x="420" y="80" width="300" height="180" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="460" y="110" font-size="14" fill="#D88A8A" font-weight="bold">自研（需满足条件）</text>
<text x="440" y="140" font-size="12" fill="#333">差异化核心业务 → 控制权</text>
<text x="440" y="165" font-size="12" fill="#333">规模超现有方案极限</text>
<text x="440" y="190" font-size="12" fill="#333">合规要求（数据不出机房）</text>
<text x="440" y="220" font-size="12" fill="#D88A8A">维护成本=高（全自己来）</text>
<text x="440" y="245" font-size="12" fill="#D88A8A">学习成本=高（只有内部文档）</text>
<rect x="80" y="290" width="640" height="70" rx="4" fill="none" stroke="#A56F4A" stroke-width="1.5" />
<text x="100" y="315" font-size="12" fill="#A56F4A" font-weight="bold">大厂开源自己的轮子——另一个逻辑：</text>
<text x="100" y="335" font-size="11" fill="#333">降低维护成本（外部贡献者）+ 建立生态标准 + 吸引人才</text>
<text x="100" y="352" font-size="11" fill="#333">K8s(Google) / React(Facebook) / RocketMQ(阿里)</text>
<text x="80" y="400" font-size="12" fill="#333">判断标准：定制化收益 > 维护成本 → 自研；否则用开源</text>
<text x="80" y="425" font-size="12" fill="#666">先问自己：这个轮子是核心竞争力，还是重新发明已有的轮子？</text>
${marker}
</svg>`,

  'q73-monolith-vs-microservice': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">单体 vs 微服务 vs 模块化单体</text>
<rect x="80" y="80" width="200" height="160" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="120" y="110" font-size="14" fill="#4A6FA5" font-weight="bold">单体</text>
<text x="100" y="140" font-size="11" fill="#333">用户/订单/库存/支付</text>
<text x="100" y="160" font-size="11" fill="#333">一个进程/一个仓库</text>
<text x="100" y="185" font-size="11" fill="#6B8E23">+函数调用纳秒级</text>
<text x="100" y="205" font-size="11" fill="#6B8E23">+部署简单</text>
<text x="100" y="225" font-size="11" fill="#D88A8A">-无法独立扩容</text>
<text x="100" y="240" font-size="11" fill="#D88A8A">-代码膨胀编译慢</text>
<rect x="300" y="80" width="200" height="160" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="320" y="110" font-size="14" fill="#A56F4A" font-weight="bold">微服务</text>
<rect x="320" y="125" width="35" height="25" fill="none" stroke="#A56F4A" stroke-width="1" />
<text x="325" y="142" font-size="9" fill="#A56F4A">用户</text>
<rect x="365" y="125" width="35" height="25" fill="none" stroke="#A56F4A" stroke-width="1" />
<text x="370" y="142" font-size="9" fill="#A56F4A">订单</text>
<rect x="410" y="125" width="35" height="25" fill="none" stroke="#A56F4A" stroke-width="1" />
<text x="415" y="142" font-size="9" fill="#A56F4A">库存</text>
<rect x="455" y="125" width="35" height="25" fill="none" stroke="#A56F4A" stroke-width="1" />
<text x="460" y="142" font-size="9" fill="#A56F4A">支付</text>
<text x="320" y="175" font-size="11" fill="#6B8E23">+独立部署/扩容</text>
<text x="320" y="195" font-size="11" fill="#6B8E23">+故障隔离</text>
<text x="320" y="215" font-size="11" fill="#D88A8A">-网络通信开销</text>
<text x="320" y="235" font-size="11" fill="#D88A8A">-运维复杂度爆炸</text>
<rect x="520" y="80" width="200" height="160" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="540" y="110" font-size="14" fill="#6B8E23" font-weight="bold">模块化单体</text>
<text x="540" y="140" font-size="11" fill="#333">一栋大楼内的</text>
<text x="540" y="160" font-size="11" fill="#333">独立房间（模块）</text>
<text x="540" y="185" font-size="11" fill="#6B8E23">+函数调用快</text>
<text x="540" y="205" font-size="11" fill="#6B8E23">+边界清晰可拆</text>
<text x="540" y="225" font-size="11" fill="#6B8E23">+运维简单</text>
<text x="540" y="240" font-size="11" fill="#333">先住好再拆</text>
<rect x="80" y="280" width="640" height="80" rx="4" fill="none" stroke="#333" stroke-width="1.5" />
<text x="100" y="305" font-size="12" fill="#333" font-weight="bold">判断标准：拆的收益 > 拆的代价 → 拆</text>
<text x="100" y="325" font-size="11" fill="#333">10人团队 → 模块化单体（20个微服务=找罪受）</text>
<text x="100" y="345" font-size="11" fill="#333">50+人团队 → 微服务（多个团队并行开发冲突）</text>
<text x="80" y="400" font-size="12" fill="#A56F4A" font-weight="bold">康威定律：系统设计必然反映组织沟通结构</text>
<text x="80" y="425" font-size="12" fill="#666">微服务把代码复杂度转移成运维复杂度——省的加倍还回来</text>
${marker}
</svg>`,

  'q74-restful-api': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">RESTful API 设计原则</text>
<rect x="80" y="80" width="640" height="100" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="105" font-size="13" fill="#4A6FA5" font-weight="bold">资源建模：URL用名词，HTTP方法表达操作</text>
<text x="100" y="130" font-size="12" fill="#6B8E23">GET /users/123/orders → 获取用户123的订单</text>
<text x="100" y="150" font-size="12" fill="#6B8E23">POST /users → 创建用户</text>
<text x="100" y="170" font-size="12" fill="#6B8E23">PATCH /users/123 → 部分修改 | DELETE /users/123 → 删除</text>
<rect x="80" y="200" width="300" height="120" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="100" y="225" font-size="13" fill="#A56F4A" font-weight="bold">分页：两种模式</text>
<text x="100" y="250" font-size="11" fill="#333">Offset: ?page=3 and size=20</text>
<text x="100" y="265" font-size="11" fill="#D88A8A">→ 数据插入时重复/遗漏</text>
<text x="100" y="290" font-size="11" fill="#333">Cursor: ?cursor=abc and size=20</text>
<text x="100" y="305" font-size="11" fill="#6B8E23">→ 基于位置，不受插入影响</text>
<rect x="420" y="200" width="300" height="120" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="440" y="225" font-size="13" fill="#6B8E23" font-weight="bold">幂等：Idempotency Key</text>
<text x="440" y="250" font-size="11" fill="#333">POST请求头带唯一Key</text>
<text x="440" y="270" font-size="11" fill="#333">第一次：处理并存结果</text>
<text x="440" y="290" font-size="11" fill="#333">第二次（相同Key）：</text>
<text x="440" y="305" font-size="11" fill="#6B8E23">→ 返回第一次结果，不重复执行</text>
<rect x="80" y="340" width="640" height="60" rx="4" fill="none" stroke="#333" stroke-width="1.5" />
<text x="100" y="365" font-size="12" fill="#333">HTTP状态码：200成功/201创建/400参数错/401未认证/404不存在/429限流/500内部错误</text>
<text x="100" y="385" font-size="12" fill="#333">版本管理：/v1/users → /v2/users（旧版维护6-12个月给迁移时间）</text>
<text x="80" y="430" font-size="12" fill="#666">核心：让调用方不需要读文档就能猜出怎么用。一致性 > 灵活性</text>
${marker}
</svg>`,

  'q75-benchmark': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">基准测试的三个陷阱</text>
<rect x="80" y="80" width="640" height="80" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="105" font-size="13" fill="#4A6FA5" font-weight="bold">陷阱1：JIT预热</text>
<text x="100" y="125" font-size="11" fill="#333">前几次执行=解释器逐行执行（慢）→ 执行N次后JIT编译为机器码（快）</text>
<text x="100" y="145" font-size="11" fill="#D88A8A">只跑10次测的是"解释执行"速度，不是真实性能</text>
<rect x="80" y="180" width="640" height="80" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="100" y="205" font-size="13" fill="#A56F4A" font-weight="bold">陷阱2：GC暂停</text>
<text x="100" y="225" font-size="11" fill="#333">测试过程中触发GC → Stop-The-World暂停50ms → 测试结果包含GC时间</text>
<text x="100" y="245" font-size="11" fill="#D88A8A">函数本身0.1ms，但测出50ms——49.9ms是GC暂停</text>
<rect x="80" y="280" width="640" height="80" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="100" y="305" font-size="13" fill="#D88A8A" font-weight="bold">陷阱3：死代码消除</text>
<text x="100" y="325" font-size="11" fill="#333">JIT发现计算结果未被使用 → 直接删除整段计算 → 测出0纳秒</text>
<text x="100" y="345" font-size="11" fill="#D88A8A">你以为测了函数性能，其实什么都没做</text>
<rect x="80" y="380" width="640" height="60" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="100" y="405" font-size="13" fill="#6B8E23" font-weight="bold">正确做法：用JMH</text>
<text x="100" y="425" font-size="11" fill="#333">预热轮次（让JIT编译）| 多轮取统计 | Blackhole消费结果 | 控制GC</text>
${marker}
</svg>`,

  'q76-requirements': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">需求文档为什么写不清楚？</text>
<rect x="80" y="80" width="640" height="60" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="105" font-size="13" fill="#4A6FA5" font-weight="bold">根本原因：隐性知识（Tacit Knowledge）</text>
<text x="100" y="125" font-size="12" fill="#333">"我们知道的远比我们能说出来的多"——领域专家脑中有大量"不言自明"的假设</text>
<rect x="80" y="160" width="300" height="120" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="100" y="185" font-size="13" fill="#D88A8A" font-weight="bold">产品经理理解的"搜索商品"</text>
<text x="100" y="210" font-size="11" fill="#333">1.输入关键词</text>
<text x="100" y="230" font-size="11" fill="#333">2.按相关度排序</text>
<text x="100" y="250" font-size="11" fill="#333">3.支持筛选（价格/销量）</text>
<text x="100" y="270" font-size="11" fill="#333">4.自动纠错</text>
<rect x="420" y="160" width="300" height="120" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="440" y="185" font-size="13" fill="#A56F4A" font-weight="bold">开发者理解的"搜索商品"</text>
<text x="440" y="210" font-size="11" fill="#333">1.输入关键词</text>
<text x="440" y="230" font-size="11" fill="#333">2.返回匹配结果</text>
<text x="440" y="255" font-size="11" fill="#D88A8A">（到这里就完了）</text>
<rect x="80" y="300" width="640" height="70" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="100" y="325" font-size="13" fill="#6B8E23" font-weight="bold">敏捷的答案：用频繁交付暴露假设</text>
<text x="100" y="345" font-size="11" fill="#333">MVP → 上线 → 看真实行为 → 发现缺失 → 迭代 → 再看</text>
<text x="100" y="362" font-size="11" fill="#333">比一次性文档穷举所有场景成本更低</text>
<rect x="80" y="390" width="640" height="50" rx="4" fill="none" stroke="#333" stroke-width="1.5" />
<text x="100" y="415" font-size="11" fill="#333" font-weight="bold">但必须记录：接口契约 | 设计决策 | 状态机（这些不可通过迭代发现）</text>
${marker}
</svg>`,

  'q77-observability': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">可观测性三支柱</text>
<rect x="80" y="80" width="180" height="150" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="115" y="110" font-size="14" fill="#4A6FA5" font-weight="bold">Metrics 指标</text>
<text x="95" y="140" font-size="11" fill="#333">回答：有没有问题？</text>
<text x="95" y="165" font-size="11" fill="#333">QPS/P99延迟/CPU</text>
<text x="95" y="190" font-size="11" fill="#333">聚合数值/低成本</text>
<text x="95" y="215" font-size="11" fill="#4A6FA5">趋势分析+阈值告警</text>
<rect x="310" y="80" width="180" height="150" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="340" y="110" font-size="14" fill="#6B8E23" font-weight="bold">Tracing 追踪</text>
<text x="325" y="140" font-size="11" fill="#333">回答：问题在哪步？</text>
<text x="325" y="165" font-size="11" fill="#333">TraceID贯穿全链路</text>
<text x="325" y="190" font-size="11" fill="#333">Span=操作单元</text>
<text x="325" y="215" font-size="11" fill="#6B8E23">调用树定位瓶颈</text>
<rect x="540" y="80" width="180" height="150" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="570" y="110" font-size="14" fill="#A56F4A" font-weight="bold">Logging 日志</text>
<text x="555" y="140" font-size="11" fill="#333">回答：具体什么？</text>
<text x="555" y="165" font-size="11" fill="#333">离散事件记录</text>
<text x="555" y="190" font-size="11" fill="#333">结构化JSON</text>
<text x="555" y="215" font-size="11" fill="#A56F4A">事后排查+审计</text>
<line x1="260" y1="155" x2="310" y2="155" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="490" y1="155" x2="540" y2="155" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="270" y="145" font-size="10" fill="#666">定位</text>
<text x="500" y="145" font-size="10" fill="#666">详情</text>
<rect x="80" y="260" width="640" height="80" rx="4" fill="none" stroke="#333" stroke-width="1.5" />
<text x="100" y="285" font-size="13" fill="#333" font-weight="bold">三者通过 TraceID 关联</text>
<text x="100" y="310" font-size="11" fill="#333">Metrics(P99=5s) → Tracing(DB查询占90%) → Logging(慢SQL是SELECT...)</text>
<text x="100" y="330" font-size="11" fill="#6B8E23">日志没有TraceID=查不了链路 | Metrics没有标签=不能下钻</text>
<rect x="80" y="360" width="300" height="60" rx="4" fill="none" stroke="#4A6FA5" stroke-width="1.5" />
<text x="100" y="385" font-size="12" fill="#4A6FA5" font-weight="bold">监控</text>
<text x="100" y="405" font-size="11" fill="#333">回答"已知的已知"</text>
<rect x="420" y="360" width="300" height="60" rx="4" fill="none" stroke="#6B8E23" stroke-width="1.5" />
<text x="440" y="385" font-size="12" fill="#6B8E23" font-weight="bold">可观测性</text>
<text x="440" y="405" font-size="11" fill="#333">回答"未知的未知"</text>
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
