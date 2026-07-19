const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = '/Users/leiwen/WorkBuddy/kepu/images/chapter7';

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
  'q87-gpu-vs-cpu': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">GPU vs CPU：不同的计算范式</text>
<rect x="80" y="80" width="310" height="340" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="150" y="110" font-size="15" fill="#4A6FA5" font-weight="bold">CPU：少而精</text>
<text x="100" y="140" font-size="12" fill="#333">8-32 个大核心</text>
<text x="100" y="160" font-size="12" fill="#333">深流水线 + 分支预测</text>
<text x="100" y="180" font-size="12" fill="#333">大缓存 (L1/L2/L3)</text>
<text x="100" y="200" font-size="12" fill="#333">复杂控制逻辑</text>
<text x="100" y="230" font-size="12" fill="#666">设计目标：低延迟</text>
<text x="100" y="250" font-size="12" fill="#666">擅长：少量复杂任务</text>
<rect x="100" y="270" width="60" height="40" rx="2" fill="#4A6FA5" opacity="0.3"/>
<rect x="170" y="270" width="60" height="40" rx="2" fill="#4A6FA5" opacity="0.3"/>
<rect x="240" y="270" width="60" height="40" rx="2" fill="#4A6FA5" opacity="0.3"/>
<rect x="310" y="270" width="60" height="40" rx="2" fill="#4A6FA5" opacity="0.3"/>
<text x="120" y="295" font-size="10" fill="#4A6FA5">核心1</text>
<text x="190" y="295" font-size="10" fill="#4A6FA5">核心2</text>
<text x="260" y="295" font-size="10" fill="#4A6FA5">核心3</text>
<text x="330" y="295" font-size="10" fill="#4A6FA5">核心4</text>
<text x="100" y="350" font-size="11" fill="#888">= 大学教授</text>
<text x="100" y="370" font-size="11" fill="#888">能做极复杂的事</text>
<text x="100" y="390" font-size="11" fill="#888">但一次只专注几件</text>
<text x="100" y="410" font-size="11" fill="#D88A8A">带宽: ~100 GB/s (DDR5)</text>
<rect x="420" y="80" width="310" height="340" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="490" y="110" font-size="15" fill="#6B8E23" font-weight="bold">GPU：多而简</text>
<text x="440" y="140" font-size="12" fill="#333">16884 个小核心</text>
<text x="440" y="160" font-size="12" fill="#333">SIMT 单指令多线程</text>
<text x="440" y="180" font-size="12" fill="#333">高带宽显存 (HBM)</text>
<text x="440" y="200" font-size="12" fill="#333">海量并行计算</text>
<text x="440" y="230" font-size="12" fill="#666">设计目标：高吞吐</text>
<text x="440" y="250" font-size="12" fill="#666">擅长：海量简单任务</text>
<text x="440" y="270" font-size="10" fill="#6B8E23">(上千个核心并行)</text>
<text x="440" y="290" font-size="10" fill="#6B8E23">= 一千个小学生</text>
<text x="440" y="310" font-size="10" fill="#6B8E23">每人只会简单加减</text>
<text x="440" y="330" font-size="10" fill="#6B8E23">但一千人同时做</text>
<text x="440" y="350" font-size="10" fill="#6B8E23">AI训练 = 矩阵乘法</text>
<text x="440" y="370" font-size="10" fill="#6B8E23">完美匹配SIMT</text>
<text x="440" y="410" font-size="11" fill="#D88A8A">带宽: 3.35 TB/s (H100)</text>
<text x="80" y="450" font-size="12" fill="#D88A8A">CPU 慢3个数量级 = 不是不行, 是不匹配</text>
</svg>`,

  'q88-gradient-descent': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">梯度下降：用局部信息逼近最优解</text>
<path d="M 80 180 Q 200 100, 350 220 Q 500 340, 700 200" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="140" font-size="11" fill="#4A6FA5">损失函数</text>
<circle cx="100" cy="180" r="6" fill="#D88A8A" />
<text x="110" y="200" font-size="11" fill="#D88A8A">起步(随机参数)</text>
<line x1="106" y1="178" x2="140" y2="155" stroke="#D88A8A" stroke-width="1.5" stroke-dasharray="4,3" />
<circle cx="145" cy="150" r="5" fill="#A56F4A" />
<text x="155" y="145" font-size="10" fill="#A56F4A">步1</text>
<line x1="150" y1="150" x2="190" y2="135" stroke="#A56F4A" stroke-width="1.5" stroke-dasharray="4,3" />
<circle cx="195" cy="130" r="5" fill="#A56F4A" />
<text x="205" y="125" font-size="10" fill="#A56F4A">步2</text>
<line x1="200" y1="130" x2="250" y2="145" stroke="#A56F4A" stroke-width="1.5" stroke-dasharray="4,3" />
<circle cx="255" cy="150" r="5" fill="#A56F4A" />
<text x="265" y="165" font-size="10" fill="#A56F4A">步3</text>
<circle cx="340" cy="220" r="8" fill="#6B8E23" />
<text x="280" y="250" font-size="12" fill="#6B8E23" font-weight="bold">谷底(最优解)</text>
<rect x="440" y="80" width="290" height="130" rx="4" fill="none" stroke="#4A6FA5" stroke-width="1.5" />
<text x="455" y="105" font-size="13" fill="#4A6FA5" font-weight="bold">训练循环</text>
<text x="455" y="125" font-size="11" fill="#333">1. 取一批数据 (Batch)</text>
<text x="455" y="145" font-size="11" fill="#333">2. 前向传播 -> 预测值</text>
<text x="455" y="165" font-size="11" fill="#333">3. 计算损失 (Loss)</text>
<text x="455" y="185" font-size="11" fill="#333">4. 反向传播 -> 梯度</text>
<text x="455" y="205" font-size="11" fill="#333">5. 参数 = 参数 - LR * 梯度</text>
<rect x="440" y="230" width="290" height="80" rx="4" fill="none" stroke="#A56F4A" stroke-width="1.5" />
<text x="455" y="255" font-size="13" fill="#A56F4A" font-weight="bold">学习率 (LR)</text>
<text x="455" y="275" font-size="11" fill="#D88A8A">太大 -> 震荡/发散</text>
<text x="455" y="295" font-size="11" fill="#D88A8A">太小 -> 极慢</text>
<text x="80" y="310" font-size="12" fill="#666" font-weight="bold">优化器进化:</text>
<text x="80" y="335" font-size="11" fill="#4A6FA5">SGD: 沿梯度走</text>
<text x="80" y="355" font-size="11" fill="#A56F4A">Momentum: +惯性(滑过小坑)</text>
<text x="80" y="375" font-size="11" fill="#6B8E23">Adam: +自适应学习率(每参数独立)</text>
<text x="80" y="395" font-size="11" fill="#D88A8A">+LR Schedule: 余弦退火</text>
<text x="80" y="440" font-size="12" fill="#D88A8A">本质: 在不知道全貌时, 用局部信息逐步逼近</text>
</svg>`,

  'q89-overfitting': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">过拟合：训练集满分, 测试集不及格</text>
<rect x="80" y="80" width="340" height="180" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="105" font-size="14" fill="#4A6FA5" font-weight="bold">欠拟合 (High Bias)</text>
<text x="100" y="130" font-size="12" fill="#333">模型太简单 -> 学不到规律</text>
<text x="100" y="150" font-size="12" fill="#333">训练损失: 高</text>
<text x="100" y="170" font-size="12" fill="#333">验证损失: 高</text>
<circle cx="130" cy="220" r="4" fill="#4A6FA5" />
<circle cx="160" cy="230" r="4" fill="#4A6FA5" />
<circle cx="190" cy="215" r="4" fill="#4A6FA5" />
<circle cx="220" cy="240" r="4" fill="#4A6FA5" />
<circle cx="250" cy="220" r="4" fill="#4A6FA5" />
<circle cx="280" cy="235" r="4" fill="#4A6FA5" />
<line x1="110" y1="225" x2="330" y2="225" stroke="#4A6FA5" stroke-width="2" stroke-dasharray="5,4" />
<text x="280" y="250" font-size="10" fill="#4A6FA5">一条直线拟合曲线数据</text>
<rect x="450" y="80" width="290" height="180" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="470" y="105" font-size="14" fill="#D88A8A" font-weight="bold">过拟合 (High Variance)</text>
<text x="470" y="130" font-size="12" fill="#333">模型太复杂 -> 记住噪声</text>
<text x="470" y="150" font-size="12" fill="#333">训练损失: 极低</text>
<text x="470" y="170" font-size="12" fill="#333">验证损失: 先降后升</text>
<circle cx="480" cy="225" r="4" fill="#D88A8A" />
<circle cx="510" cy="210" r="4" fill="#D88A8A" />
<circle cx="540" cy="235" r="4" fill="#D88A8A" />
<circle cx="570" cy="200" r="4" fill="#D88A8A" />
<circle cx="600" cy="240" r="4" fill="#D88A8A" />
<circle cx="630" cy="205" r="4" fill="#D88A8A" />
<path d="M 470 230 Q 485 200, 500 225 Q 515 195, 530 230 Q 545 195, 560 200 Q 575 235, 590 205 Q 605 235, 620 205 Q 635 240, 650 210" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="470" y="250" font-size="10" fill="#D88A8A">曲线经过每个点 = 背题</text>
<rect x="80" y="290" width="660" height="80" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="100" y="315" font-size="14" fill="#6B8E23" font-weight="bold">对抗过拟合的方法</text>
<text x="100" y="340" font-size="11" fill="#333">正则化(L1/L2) | Dropout | Early Stop | 数据增强 | 更多数据</text>
<text x="100" y="360" font-size="11" fill="#666">本质: 不要用超出问题复杂度的工具解决简单问题</text>
<text x="80" y="410" font-size="12" fill="#4A6FA5" font-weight="bold">偏差-方差权衡</text>
<text x="80" y="435" font-size="11" fill="#4A6FA5">简单模型 -> 高偏差低方差</text>
<text x="300" y="435" font-size="11" fill="#D88A8A">复杂模型 -> 低偏差高方差</text>
<text x="550" y="435" font-size="11" fill="#6B8E23">最优 -> 两者平衡</text>
</svg>`,

  'q90-emergence': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">涌现能力：模型规模的相变</text>
<line x1="80" y1="430" x2="720" y2="430" stroke="#666" stroke-width="2" />
<line x1="80" y1="80" x2="80" y2="430" stroke="#666" stroke-width="2" />
<text x="60" y="90" font-size="11" fill="#666" transform="rotate(-90 60 90)">准确率</text>
<text x="730" y="440" font-size="11" fill="#666">模型规模 -></text>
<path d="M 80 420 L 150 420 L 220 418 L 290 415 L 340 412 L 370 405 L 390 300 L 410 200 L 440 160 L 480 140 L 540 130 L 620 125 L 700 122" fill="none" stroke="#4A6FA5" stroke-width="2.5" />
<text x="100" y="410" font-size="10" fill="#666">1M参数</text>
<text x="250" y="410" font-size="10" fill="#666">1B</text>
<text x="350" y="410" font-size="10" fill="#666">10B</text>
<text x="460" y="410" font-size="10" fill="#666">100B</text>
<text x="600" y="410" font-size="10" fill="#666">1T</text>
<line x1="390" y1="80" x2="390" y2="430" stroke="#D88A8A" stroke-width="1.5" stroke-dasharray="5,4" />
<text x="340" y="100" font-size="12" fill="#D88A8A" font-weight="bold">涌现阈值</text>
<text x="340" y="120" font-size="11" fill="#D88A8A">能力突然出现</text>
<text x="100" y="200" font-size="11" fill="#888">约等于随机猜</text>
<text x="100" y="220" font-size="11" fill="#888">0% 能力</text>
<text x="430" y="200" font-size="11" fill="#6B8E23">能力急剧上升</text>
<text x="430" y="220" font-size="11" fill="#6B8E23">60%+ 突跳</text>
<rect x="100" y="280" width="290" height="60" rx="4" fill="none" stroke="#4A6FA5" stroke-width="1.5" />
<text x="115" y="300" font-size="11" fill="#4A6FA5">缩放定律: Loss 随参数</text>
<text x="115" y="315" font-size="11" fill="#4A6FA5">按幂律下降 (可预测)</text>
<text x="115" y="330" font-size="11" fill="#4A6FA5">但 Loss != 能力出现</text>
<rect x="430" y="280" width="290" height="60" rx="4" fill="none" stroke="#D88A8A" stroke-width="1.5" />
<text x="445" y="300" font-size="11" fill="#D88A8A">涌现不可预测</text>
<text x="445" y="315" font-size="11" fill="#D88A8A">开发者不知道某规模</text>
<text x="445" y="330" font-size="11" fill="#D88A8A">会出现什么新能力</text>
<text x="100" y="460" font-size="12" fill="#D88A8A">暗面: 欺骗/漏洞利用/社会工程 也可能涌现</text>
</svg>`,

  'q91-self-attention': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">Self-Attention：打破序列依赖</text>
<rect x="80" y="70" width="310" height="180" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="150" y="95" font-size="14" fill="#A56F4A" font-weight="bold">RNN：串行处理</text>
<text x="100" y="125" font-size="12" fill="#333">Token1 -> h1 -> Token2 -> h2</text>
<text x="100" y="145" font-size="12" fill="#333">-> Token3 -> h3 -> ...</text>
<text x="100" y="175" font-size="11" fill="#D88A8A">无法并行 (99% GPU闲置)</text>
<text x="100" y="195" font-size="11" fill="#D88A8A">长距离依赖衰减</text>
<text x="100" y="215" font-size="11" fill="#D88A8A">第50词看不到第1词</text>
<text x="100" y="240" font-size="11" fill="#666">逐字读, 不能跳</text>
<rect x="420" y="70" width="310" height="180" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="480" y="95" font-size="14" fill="#6B8E23" font-weight="bold">Self-Attention：全并行</text>
<text x="440" y="125" font-size="12" fill="#333">每个Token直接看所有Token</text>
<text x="440" y="145" font-size="12" fill="#333">Q * K -> Attention Score</text>
<text x="440" y="165" font-size="12" fill="#333">-> 加权求和 Value</text>
<text x="440" y="195" font-size="11" fill="#6B8E23">O(1) 路径长度</text>
<text x="440" y="215" font-size="11" fill="#6B8E23">GPU 全并行利用</text>
<text x="440" y="240" font-size="11" fill="#6B8E23">任意位置直接连接</text>
<text x="440" y="260" font-size="11" fill="#666">= 神奇荧光笔</text>
<rect x="80" y="280" width="650" height="80" rx="4" fill="none" stroke="#4A6FA5" stroke-width="1.5" />
<text x="100" y="305" font-size="13" fill="#4A6FA5" font-weight="bold">Multi-Head Attention (多头)</text>
<text x="100" y="325" font-size="11" fill="#333">Head1: 语法关系 | Head2: 指代关系 | Head3: 语义关系</text>
<text x="100" y="345" font-size="11" fill="#666">多组并行 Self-Attention -> 多视角综合理解</text>
<rect x="80" y="380" width="650" height="80" rx="4" fill="none" stroke="#D88A8A" stroke-width="1.5" />
<text x="100" y="405" font-size="13" fill="#D88A8A" font-weight="bold">代价：O(n^2) 计算复杂度</text>
<text x="100" y="425" font-size="11" fill="#333">序列翻倍 -> 计算量4倍 (n x n 注意力矩阵)</text>
<text x="100" y="445" font-size="11" fill="#666">缓解: FlashAttention | Sparse | Sliding Window | Ring Attention</text>
</svg>`,

  'q92-cold-start': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">推荐系统冷启动：从零到一</text>
<rect x="80" y="80" width="210" height="130" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="120" y="105" font-size="13" fill="#D88A8A" font-weight="bold">阶段1：0行为</text>
<text x="95" y="130" font-size="11" fill="#333">热门兜底</text>
<text x="95" y="150" font-size="11" fill="#333">基于内容推荐</text>
<text x="95" y="170" font-size="11" fill="#333">引导式交互</text>
<text x="95" y="195" font-size="10" fill="#888">推荐畅销/问兴趣标签</text>
<rect x="300" y="80" width="210" height="130" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="340" y="105" font-size="13" fill="#A56F4A" font-weight="bold">阶段2：100行为</text>
<text x="315" y="130" font-size="11" fill="#333">混合策略</text>
<text x="315" y="150" font-size="11" fill="#333">协同过滤权重增大</text>
<text x="315" y="170" font-size="11" fill="#333">探索-利用平衡</text>
<text x="315" y="195" font-size="10" fill="#888">Bandit算法试探</text>
<rect x="520" y="80" width="210" height="130" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="560" y="105" font-size="13" fill="#6B8E23" font-weight="bold">阶段3：1000+行为</text>
<text x="535" y="130" font-size="11" fill="#333">深度学习推荐</text>
<text x="535" y="150" font-size="11" fill="#333">DIN / DeepFM</text>
<text x="535" y="170" font-size="11" fill="#333">个性化精排</text>
<text x="535" y="195" font-size="10" fill="#888">基于用户行为序列</text>
<line x1="290" y1="145" x2="300" y2="145" stroke="#666" stroke-width="2" />
<line x1="510" y1="145" x2="520" y2="145" stroke="#666" stroke-width="2" />
<rect x="80" y="240" width="650" height="80" rx="4" fill="none" stroke="#4A6FA5" stroke-width="1.5" />
<text x="100" y="265" font-size="13" fill="#4A6FA5" font-weight="bold">两大流派</text>
<text x="100" y="285" font-size="11" fill="#4A6FA5">基于内容(Content): 看物品属性</text>
<text x="400" y="285" font-size="11" fill="#A56F4A">协同过滤(CF): 看用户行为</text>
<text x="100" y="310" font-size="11" fill="#666">不需要数据, 但同质化</text>
<text x="400" y="310" font-size="11" fill="#666">需要数据, 但惊喜度高</text>
<rect x="80" y="340" width="650" height="100" rx="4" fill="none" stroke="#D88A8A" stroke-width="1.5" />
<text x="100" y="365" font-size="13" fill="#D88A8A" font-weight="bold">死结与破解</text>
<text x="100" y="385" font-size="11" fill="#D88A8A">没数据 -> 没法推 -> 没用户 -> 更没数据</text>
<text x="100" y="410" font-size="11" fill="#6B8E23">破解: 先用不需要数据的方法起步 -> 积累数据 -> 切换到高级方法</text>
<text x="100" y="430" font-size="11" fill="#666">通用方法论: 条件是行动出来的, 不是等出来的</text>
</svg>`,

  'q93-learning-paradigms': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">三大学习范式：反馈信号决定方法</text>
<rect x="80" y="80" width="210" height="280" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="130" y="105" font-size="14" fill="#4A6FA5" font-weight="bold">监督学习</text>
<text x="95" y="130" font-size="12" fill="#4A6FA5">Supervised</text>
<text x="95" y="155" font-size="11" fill="#333">有标准答案(标签)</text>
<text x="95" y="180" font-size="11" fill="#333">输入 -> 标签映射</text>
<text x="95" y="210" font-size="11" fill="#666">分类: 猫/狗/鸟</text>
<text x="95" y="230" font-size="11" fill="#666">回归: 房价预测</text>
<text x="95" y="265" font-size="11" fill="#6B8E23">优点: 目标明确</text>
<text x="95" y="285" font-size="11" fill="#D88A8A">缺点: 标注成本高</text>
<text x="95" y="325" font-size="10" fill="#888">= 有答案的考试</text>
<rect x="300" y="80" width="210" height="280" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="340" y="105" font-size="14" fill="#A56F4A" font-weight="bold">无监督学习</text>
<text x="315" y="130" font-size="12" fill="#A56F4A">Unsupervised</text>
<text x="315" y="155" font-size="11" fill="#333">没有标签</text>
<text x="315" y="180" font-size="11" fill="#333">自己发现结构</text>
<text x="315" y="210" font-size="11" fill="#666">聚类: 用户分群</text>
<text x="315" y="230" font-size="11" fill="#666">降维: PCA/t-SNE</text>
<text x="315" y="265" font-size="11" fill="#6B8E23">优点: 不需标注</text>
<text x="315" y="285" font-size="11" fill="#D88A8A">缺点: 效果难评估</text>
<text x="315" y="325" font-size="10" fill="#888">= 自己整理书架</text>
<rect x="520" y="80" width="210" height="280" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="570" y="105" font-size="14" fill="#6B8E23" font-weight="bold">强化学习</text>
<text x="535" y="130" font-size="12" fill="#6B8E23">Reinforcement</text>
<text x="535" y="155" font-size="11" fill="#333">延迟奖励</text>
<text x="535" y="180" font-size="11" fill="#333">Agent交互环境</text>
<text x="535" y="210" font-size="11" fill="#666">AlphaGo: 赢/输</text>
<text x="535" y="230" font-size="11" fill="#666">机器人: 抓取成功</text>
<text x="535" y="265" font-size="11" fill="#6B8E23">优点: 自动探索</text>
<text x="535" y="285" font-size="11" fill="#D88A8A">缺点: 奖励稀疏</text>
<text x="535" y="325" font-size="10" fill="#888">= 打游戏摸索</text>
<rect x="80" y="380" width="650" height="70" rx="4" fill="none" stroke="#D88A8A" stroke-width="1.5" />
<text x="100" y="405" font-size="13" fill="#D88A8A" font-weight="bold">大模型训练三阶段 = 三范式接力</text>
<text x="100" y="425" font-size="11" fill="#4A6FA5">无监督预训练</text>
<text x="280" y="425" font-size="11" fill="#A56F4A">-> 监督微调</text>
<text x="440" y="425" font-size="11" fill="#6B8E23">-> RLHF对齐</text>
<text x="100" y="442" font-size="11" fill="#666">先学语言规律 -> 学听指令 -> 对齐人类偏好</text>
</svg>`,

  'q94-llm-hallucination': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">大模型幻觉：概率模型没有"我不知道"</text>
<rect x="80" y="80" width="340" height="150" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="105" font-size="14" fill="#4A6FA5" font-weight="bold">LLM 数学本质</text>
<text x="100" y="130" font-size="13" fill="#333">P(next_token | context)</text>
<text x="100" y="155" font-size="11" fill="#666">预测下一个Token的概率</text>
<text x="100" y="175" font-size="11" fill="#666">不是"什么是真的" 是"什么最可能出现"</text>
<text x="100" y="200" font-size="11" fill="#D88A8A">学的是Token共现统计, 不是事实</text>
<rect x="440" y="80" width="290" height="150" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="460" y="105" font-size="14" fill="#A56F4A" font-weight="bold">幻觉三种类型</text>
<text x="460" y="130" font-size="11" fill="#333">1. 事实性: 编造不存在的事实</text>
<text x="460" y="150" font-size="11" fill="#333">2. 一致性: 同问题矛盾答案</text>
<text x="460" y="170" font-size="11" fill="#333">3. 忠实性: 总结加入原文没有的信息</text>
<text x="460" y="200" font-size="11" fill="#D88A8A">不能根除 = 范式局限</text>
<rect x="80" y="250" width="650" height="100" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="100" y="275" font-size="14" fill="#6B8E23" font-weight="bold">对抗幻觉的方法 (缓解, 非根除)</text>
<text x="100" y="300" font-size="11" fill="#6B8E23">RAG: 生成前检索外部知识库 -> 基于文档生成</text>
<text x="100" y="320" font-size="11" fill="#A56F4A">RLHF: 教模型"不确定时说我不确定"</text>
<text x="100" y="340" font-size="11" fill="#4A6FA5">事实核查 + Chain-of-Thought + 降低Temperature</text>
<text x="80" y="375" font-size="12" fill="#D88A8A" font-weight="bold">为什么不能根除?</text>
<text x="80" y="395" font-size="11" fill="#D88A8A">- 概率模型没有"元认知"(不知道自己不知道)</text>
<text x="80" y="415" font-size="11" fill="#D88A8A">- 训练数据混合事实和虚构</text>
<text x="80" y="435" font-size="11" fill="#D88A8A">- 知识的参数化压缩必然有损</text>
<text x="400" y="375" font-size="12" fill="#6B8E23" font-weight="bold">工程师的防御策略</text>
<text x="400" y="395" font-size="11" fill="#6B8E23">- 不当知识库, 当概率推理引擎</text>
<text x="400" y="415" font-size="11" fill="#6B8E23">- 关键场景加校验层</text>
<text x="400" y="435" font-size="11" fill="#6B8E23">- 信任但验证(像对待聪明实习生)</text>
</svg>`,

  'q95-face-recognition': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">图像分类 vs 人脸识别：分类 vs 度量学习</text>
<rect x="80" y="80" width="310" height="200" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="150" y="105" font-size="14" fill="#4A6FA5" font-weight="bold">图像分类 (Classification)</text>
<text x="100" y="130" font-size="12" fill="#333">类别有限且固定</text>
<text x="100" y="150" font-size="12" fill="#333">输出: 属于哪个类别</text>
<text x="100" y="175" font-size="11" fill="#666">猫/狗/鸟/飞机...</text>
<text x="100" y="195" font-size="11" fill="#666">ImageNet: 1000类</text>
<text x="100" y="225" font-size="11" fill="#D88A8A">加新类别 -> 改输出层+重训</text>
<text x="100" y="250" font-size="11" fill="#D88A8A">80亿人分类? 不现实</text>
<text x="100" y="270" font-size="11" fill="#666">= 扫条形码识别商品</text>
<rect x="420" y="80" width="310" height="200" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="470" y="105" font-size="14" fill="#6B8E23" font-weight="bold">人脸识别 (Metric Learning)</text>
<text x="440" y="130" font-size="12" fill="#333">类别无限且动态增加</text>
<text x="440" y="150" font-size="12" fill="#333">输出: 和谁最像</text>
<text x="440" y="175" font-size="11" fill="#666">照片 -> 128维嵌入向量</text>
<text x="440" y="195" font-size="11" fill="#666">同人近, 异人远</text>
<text x="440" y="225" font-size="11" fill="#6B8E23">加新人 -> 算嵌入存库, 不需重训</text>
<text x="440" y="250" font-size="11" fill="#6B8E23">80亿人也能比</text>
<text x="440" y="270" font-size="11" fill="#666">= 比数字指纹相似度</text>
<rect x="80" y="300" width="650" height="80" rx="4" fill="none" stroke="#A56F4A" stroke-width="1.5" />
<text x="100" y="325" font-size="13" fill="#A56F4A" font-weight="bold">人脸识别两种模式</text>
<text x="100" y="345" font-size="11" fill="#333">1:1 验证: 这两张脸是不是同一人? (手机解锁)</text>
<text x="100" y="365" font-size="11" fill="#333">1:N 识别: 这张脸是谁? 在人脸库中找最相似 (门禁)</text>
<rect x="80" y="395" width="650" height="60" rx="4" fill="none" stroke="#D88A8A" stroke-width="1.5" />
<text x="100" y="420" font-size="12" fill="#D88A8A" font-weight="bold">核心启示</text>
<text x="100" y="440" font-size="11" fill="#D88A8A">选方法看问题结构: 类别有限用分类, 类别无限用度量学习</text>
</svg>`,

  'q96-mapreduce': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">MapReduce：分而治之 + 数据本地化 + 容错</text>
<text x="80" y="75" font-size="12" fill="#4A6FA5">输入数据 (分片存储在多台机器)</text>
<rect x="80" y="85" width="120" height="35" rx="3" fill="#4A6FA5" opacity="0.2" stroke="#4A6FA5"/>
<text x="110" y="108" font-size="11" fill="#4A6FA5">Split 1</text>
<rect x="210" y="85" width="120" height="35" rx="3" fill="#4A6FA5" opacity="0.2" stroke="#4A6FA5"/>
<text x="240" y="108" font-size="11" fill="#4A6FA5">Split 2</text>
<rect x="340" y="85" width="120" height="35" rx="3" fill="#4A6FA5" opacity="0.2" stroke="#4A6FA5"/>
<text x="370" y="108" font-size="11" fill="#4A6FA5">Split 3</text>
<rect x="470" y="85" width="120" height="35" rx="3" fill="#4A6FA5" opacity="0.2" stroke="#4A6FA5"/>
<text x="500" y="108" font-size="11" fill="#4A6FA5">Split 4</text>
<text x="620" y="108" font-size="11" fill="#888">...</text>
<line x1="140" y1="120" x2="140" y2="155" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
<line x1="270" y1="120" x2="270" y2="155" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
<line x1="400" y1="120" x2="400" y2="155" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
<line x1="530" y1="120" x2="530" y2="155" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
<text x="80" y="150" font-size="12" fill="#6B8E23">Map 阶段 (数据本地化: 计算搬到数据所在机器)</text>
<rect x="80" y="160" width="120" height="50" rx="3" fill="#6B8E23" opacity="0.15" stroke="#6B8E23"/>
<text x="95" y="180" font-size="10" fill="#6B8E23">Mapper 1</text>
<text x="95" y="198" font-size="10" fill="#666">(word, 1)</text>
<rect x="210" y="160" width="120" height="50" rx="3" fill="#6B8E23" opacity="0.15" stroke="#6B8E23"/>
<text x="225" y="180" font-size="10" fill="#6B8E23">Mapper 2</text>
<text x="225" y="198" font-size="10" fill="#666">(word, 1)</text>
<rect x="340" y="160" width="120" height="50" rx="3" fill="#6B8E23" opacity="0.15" stroke="#6B8E23"/>
<text x="355" y="180" font-size="10" fill="#6B8E23">Mapper 3</text>
<text x="355" y="198" font-size="10" fill="#666">(word, 1)</text>
<rect x="470" y="160" width="120" height="50" rx="3" fill="#6B8E23" opacity="0.15" stroke="#6B8E23"/>
<text x="485" y="180" font-size="10" fill="#6B8E23">Mapper 4</text>
<text x="485" y="198" font-size="10" fill="#666">(word, 1)</text>
<text x="80" y="235" font-size="12" fill="#A56F4A">Shuffle 阶段 (按Key重新分区)</text>
<rect x="200" y="245" width="120" height="35" rx="3" fill="#A56F4A" opacity="0.15" stroke="#A56F4A"/>
<text x="215" y="268" font-size="10" fill="#A56F4A">hello: [1,1,1]</text>
<rect x="340" y="245" width="120" height="35" rx="3" fill="#A56F4A" opacity="0.15" stroke="#A56F4A"/>
<text x="355" y="268" font-size="10" fill="#A56F4A">world: [1,1,1]</text>
<rect x="480" y="245" width="120" height="35" rx="3" fill="#A56F4A" opacity="0.15" stroke="#A56F4A"/>
<text x="495" y="268" font-size="10" fill="#A56F4A">foo: [1,1]</text>
<text x="80" y="305" font-size="12" fill="#4A6FA5">Reduce 阶段 (汇总)</text>
<rect x="200" y="315" width="120" height="35" rx="3" fill="#4A6FA5" opacity="0.15" stroke="#4A6FA5"/>
<text x="215" y="338" font-size="10" fill="#4A6FA5">hello: 3</text>
<rect x="340" y="315" width="120" height="35" rx="3" fill="#4A6FA5" opacity="0.15" stroke="#4A6FA5"/>
<text x="355" y="338" font-size="10" fill="#4A6FA5">world: 3</text>
<rect x="480" y="315" width="120" height="35" rx="3" fill="#4A6FA5" opacity="0.15" stroke="#4A6FA5"/>
<text x="495" y="338" font-size="10" fill="#4A6FA5">foo: 2</text>
<text x="80" y="385" font-size="12" fill="#6B8E23" font-weight="bold">关键设计:</text>
<text x="80" y="405" font-size="11" fill="#6B8E23">数据本地化: 计算搬到数据, 不传数据</text>
<text x="80" y="425" font-size="11" fill="#A56F4A">容错: Worker挂了重跑(幂等性保证正确)</text>
<text x="80" y="445" font-size="11" fill="#4A6FA5">可扩展: 100人->1万人, 方法不变</text>
<text x="420" y="385" font-size="12" fill="#D88A8A">Spark进化:</text>
<text x="420" y="405" font-size="11" fill="#D88A8A">中间结果放内存(RDD)</text>
<text x="420" y="425" font-size="11" fill="#D88A8A">比MapReduce快10-100倍</text>
<text x="420" y="445" font-size="11" fill="#666">更丰富算子: join/groupBy/filter...</text>
</svg>`,

  'q97-bloom-filter': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">布隆过滤器：一定不存在 vs 可能存在</text>
<text x="80" y="75" font-size="12" fill="#4A6FA5">位数组 m=12 (实际 m>>n)</text>
<rect x="80" y="85" width="30" height="30" fill="#4A6FA5" opacity="0.3" stroke="#666"/>
<rect x="110" y="85" width="30" height="30" fill="#FFF" stroke="#666"/>
<rect x="140" y="85" width="30" height="30" fill="#4A6FA5" opacity="0.3" stroke="#666"/>
<rect x="170" y="85" width="30" height="30" fill="#FFF" stroke="#666"/>
<rect x="200" y="85" width="30" height="30" fill="#4A6FA5" opacity="0.3" stroke="#666"/>
<rect x="230" y="85" width="30" height="30" fill="#FFF" stroke="#666"/>
<rect x="260" y="85" width="30" height="30" fill="#FFF" stroke="#666"/>
<rect x="290" y="85" width="30" height="30" fill="#4A6FA5" opacity="0.3" stroke="#666"/>
<rect x="320" y="85" width="30" height="30" fill="#FFF" stroke="#666"/>
<rect x="350" y="85" width="30" height="30" fill="#FFF" stroke="#666"/>
<rect x="380" y="85" width="30" height="30" fill="#4A6FA5" opacity="0.3" stroke="#666"/>
<rect x="410" y="85" width="30" height="30" fill="#FFF" stroke="#666"/>
<text x="90" y="105" font-size="9" fill="#4A6FA5">1</text>
<text x="150" y="105" font-size="9" fill="#4A6FA5">1</text>
<text x="210" y="105" font-size="9" fill="#4A6FA5">1</text>
<text x="300" y="105" font-size="9" fill="#4A6FA5">1</text>
<text x="390" y="105" font-size="9" fill="#4A6FA5">1</text>
<text x="80" y="140" font-size="12" fill="#6B8E23">插入 "hello": h1=0, h2=2, h3=4</text>
<text x="80" y="160" font-size="12" fill="#A56F4A">插入 "world": h1=2, h2=7, h3=10</text>
<text x="80" y="180" font-size="11" fill="#888">(位置2被两个元素共享 = 哈希冲突)</text>
<rect x="80" y="210" width="340" height="100" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="100" y="235" font-size="13" fill="#6B8E23" font-weight="bold">查询 "hello"</text>
<text x="100" y="258" font-size="11" fill="#333">h1=0(1) h2=2(1) h3=4(1) -> 全为1</text>
<text x="100" y="278" font-size="11" fill="#6B8E23">结果: 可能存在 (也可能是冲突导致的)</text>
<text x="100" y="298" font-size="10" fill="#888">需要精确查证确认</text>
<rect x="440" y="210" width="290" height="100" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="460" y="235" font-size="13" fill="#D88A8A" font-weight="bold">查询 "foo"</text>
<text x="460" y="258" font-size="11" fill="#333">h1=1(0) -> 有一位为0</text>
<text x="460" y="278" font-size="11" fill="#D88A8A">结果: 一定不存在 (无假阴性)</text>
<text x="460" y="298" font-size="10" fill="#888">直接返回, 不查数据库</text>
<rect x="80" y="330" width="650" height="70" rx="4" fill="none" stroke="#4A6FA5" stroke-width="1.5" />
<text x="100" y="355" font-size="13" fill="#4A6FA5" font-weight="bold">应用场景</text>
<text x="100" y="375" font-size="11" fill="#333">缓存穿透保护 | Chrome安全浏览 | 爬虫URL去重 | HBase读优化</text>
<text x="100" y="395" font-size="11" fill="#666">1亿URL + 1%误报 = 仅需114MB (HashSet需GB级)</text>
<text x="80" y="425" font-size="12" fill="#D88A8A" font-weight="bold">哲学: 宁可错报有, 绝不错说无</text>
<text x="80" y="445" font-size="11" fill="#D88A8A">分层过滤: 布隆(极低成本) -> 精确查询(高成本)</text>
</svg>`,

  'q98-sorting-algorithms': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">排序算法对比：没有最好, 只有最适合</text>
<text x="80" y="70" font-size="12" fill="#666">算法       平均        最坏        空间     稳定  常数</text>
<rect x="80" y="78" width="650" height="28" fill="#4A6FA5" opacity="0.08" />
<text x="80" y="97" font-size="12" fill="#4A6FA5">快排       O(nlogn)    O(n^2)      O(logn)  不稳定  极小</text>
<rect x="80" y="106" width="650" height="28" fill="#A56F4A" opacity="0.08" />
<text x="80" y="125" font-size="12" fill="#A56F4A">堆排       O(nlogn)    O(nlogn)    O(1)     不稳定  大</text>
<rect x="80" y="134" width="650" height="28" fill="#6B8E23" opacity="0.08" />
<text x="80" y="153" font-size="12" fill="#6B8E23">归并       O(nlogn)    O(nlogn)    O(n)     稳定    中等</text>
<rect x="80" y="162" width="650" height="28" fill="#D88A8A" opacity="0.08" />
<text x="80" y="181" font-size="12" fill="#D88A8A">Timsort    O(nlogn)    O(nlogn)    O(n)     稳定    利用有序</text>
<rect x="80" y="210" width="310" height="100" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="235" font-size="13" fill="#4A6FA5" font-weight="bold">快排优势</text>
<text x="100" y="258" font-size="11" fill="#333">常数极小, Cache友好</text>
<text x="100" y="278" font-size="11" fill="#333">实际中最快的通用排序</text>
<text x="100" y="298" font-size="11" fill="#D88A8A">弱点: 最坏O(n^2)</text>
<rect x="410" y="210" width="310" height="100" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="430" y="235" font-size="13" fill="#6B8E23" font-weight="bold">Introsort (C++ std::sort)</text>
<text x="430" y="258" font-size="11" fill="#333">快排为主(快)</text>
<text x="430" y="278" font-size="11" fill="#333">递归太深切堆排(保底)</text>
<text x="430" y="298" font-size="11" fill="#333">小区间切插入排序(省事)</text>
<rect x="80" y="330" width="310" height="100" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="100" y="355" font-size="13" fill="#A56F4A" font-weight="bold">堆排优势</text>
<text x="100" y="378" font-size="11" fill="#333">最坏O(nlogn)有保证</text>
<text x="100" y="398" font-size="11" fill="#333">原地排序 O(1)空间</text>
<text x="100" y="418" font-size="11" fill="#D88A8A">弱点: Cache不友好, 常数大</text>
<rect x="410" y="330" width="310" height="100" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="430" y="355" font-size="13" fill="#D88A8A" font-weight="bold">Timsort (Python/Java)</text>
<text x="430" y="378" font-size="11" fill="#333">利用已有有序子序列(Run)</text>
<text x="430" y="398" font-size="11" fill="#333">二分插入+归并, 稳定</text>
<text x="430" y="418" font-size="11" fill="#333">真实数据上极快</text>
<text x="80" y="455" font-size="12" fill="#D88A8A">四维取舍: 平均性能 vs 最坏保证 vs 稳定性 vs 空间开销</text>
</svg>`,

  'q99-hash-vs-btree': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">哈希表 vs B+树：访问模式决定数据结构</text>
<rect x="80" y="80" width="310" height="280" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="150" y="105" font-size="14" fill="#4A6FA5" font-weight="bold">哈希表 (Hash Table)</text>
<text x="100" y="130" font-size="12" fill="#333">查询复杂度: O(1)</text>
<text x="100" y="155" font-size="12" fill="#6B8E23">单点查询极快</text>
<text x="100" y="180" font-size="12" fill="#D88A8A">不支持范围查询</text>
<text x="100" y="200" font-size="12" fill="#D88A8A">不支持排序</text>
<text x="100" y="220" font-size="12" fill="#D88A8A">不支持前缀匹配</text>
<text x="100" y="255" font-size="11" fill="#666">应用: Redis (内存KV)</text>
<text x="100" y="275" font-size="11" fill="#666">缓存/Session/计数器</text>
<text x="100" y="310" font-size="11" fill="#888">= 电话本: 知道名字</text>
<text x="100" y="330" font-size="11" fill="#888">直接翻到号码, O(1)</text>
<text x="100" y="350" font-size="11" fill="#888">但找"所有姓张的人"</text>
<text x="100" y="370" font-size="11" fill="#888">做不到, 必须全翻</text>
<rect x="420" y="80" width="310" height="280" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="480" y="105" font-size="14" fill="#6B8E23" font-weight="bold">B+树 (B+ Tree)</text>
<text x="440" y="130" font-size="12" fill="#333">查询复杂度: O(log n)</text>
<text x="440" y="155" font-size="12" fill="#6B8E23">范围查询极快</text>
<text x="440" y="175" font-size="12" fill="#6B8E23">排序天然支持</text>
<text x="440" y="195" font-size="12" fill="#6B8E23">前缀查询支持</text>
<text x="440" y="215" font-size="12" fill="#6B8E23">叶子链表顺序扫描</text>
<text x="440" y="240" font-size="11" fill="#666">高扇出: 3-4层索引数十亿行</text>
<text x="440" y="260" font-size="11" fill="#666">磁盘预读友好(4-16KB/页)</text>
<text x="440" y="290" font-size="11" fill="#888">应用: MySQL/PostgreSQL</text>
<text x="440" y="310" font-size="11" fill="#888">Oracle/数据库索引</text>
<text x="440" y="330" font-size="11" fill="#888">= 图书馆书架字母索引</text>
<text x="440" y="350" font-size="11" fill="#888">找"年龄20-30所有人"</text>
<text x="440" y="370" font-size="11" fill="#888">顺链表扫, 极快</text>
<rect x="80" y="380" width="650" height="80" rx="4" fill="none" stroke="#D88A8A" stroke-width="1.5" />
<text x="100" y="405" font-size="13" fill="#D88A8A" font-weight="bold">核心: 选择看访问模式</text>
<text x="100" y="425" font-size="11" fill="#4A6FA5">全是单点查 -> 哈希表 O(1)</text>
<text x="300" y="425" font-size="11" fill="#6B8E23">需要范围/排序 -> B+树</text>
<text x="500" y="425" font-size="11" fill="#A56F4A">写入极多 -> LSM树</text>
<text x="100" y="450" font-size="11" fill="#666">设计数据结构 = 设计"数据将以什么方式被问到"</text>
</svg>`,

  'q100-turing-to-llm': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">从图灵机到大模型：计算范式的深刻变迁</text>
<rect x="80" y="70" width="310" height="230" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="150" y="95" font-size="14" fill="#4A6FA5" font-weight="bold">经典范式 (图灵-冯诺依曼)</text>
<text x="100" y="120" font-size="12" fill="#333">人写算法 -> 编译 -> CPU执行</text>
<text x="100" y="145" font-size="11" fill="#6B8E23">确定性: 同输入同输出</text>
<text x="100" y="165" font-size="11" fill="#6B8E23">可验证: 形式化证明</text>
<text x="100" y="185" font-size="11" fill="#6B8E23">可解释: 看代码知行为</text>
<text x="100" y="205" font-size="11" fill="#6B8E23">精确性: 每步可追溯</text>
<text x="100" y="235" font-size="11" fill="#666">程序员 = 翻译官</text>
<text x="100" y="255" font-size="11" fill="#666">把意图翻译成精确指令</text>
<text x="100" y="275" font-size="11" fill="#666">软件 = 算法 + 数据结构</text>
<text x="100" y="295" font-size="11" fill="#666">正确性 = 可证明</text>
<rect x="440" y="70" width="290" height="230" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="480" y="95" font-size="14" fill="#6B8E23" font-weight="bold">AI新范式 (数据驱动)</text>
<text x="460" y="120" font-size="12" fill="#333">定义架构+目标 -> 数据训练</text>
<text x="460" y="145" font-size="11" fill="#D88A8A">概率性: 同输入可能不同输出</text>
<text x="460" y="165" font-size="11" fill="#D88A8A">不可形式验证</text>
<text x="460" y="185" font-size="11" fill="#D88A8A">不完全可解释</text>
<text x="460" y="205" font-size="11" fill="#D88A8A">近似, 不可保证正确</text>
<text x="460" y="235" font-size="11" fill="#666">程序员 = 设计师</text>
<text x="460" y="255" font-size="11" fill="#666">设计架构/管理数据/评估</text>
<text x="460" y="275" font-size="11" fill="#666">软件 = 架构 + 数据 + 目标</text>
<text x="460" y="295" font-size="11" fill="#666">正确性 = 实验验证</text>
<rect x="80" y="320" width="650" height="70" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="100" y="345" font-size="13" fill="#A56F4A" font-weight="bold">不是替代, 是融合</text>
<text x="100" y="365" font-size="11" fill="#4A6FA5">[经典代码] 前处理(验证/权限)</text>
<text x="330" y="365" font-size="11" fill="#6B8E23">-> [AI模型] 推理(理解/生成)</text>
<text x="560" y="365" font-size="11" fill="#4A6FA5">-> [经典代码] 后处理(核查/日志)</text>
<text x="100" y="385" font-size="11" fill="#666">经典代码处理确定性, AI处理模糊性, 互补</text>
<text x="80" y="410" font-size="12" fill="#D88A8A" font-weight="bold">测试含义被重写: 覆盖率 -> 对抗性评估</text>
<text x="80" y="435" font-size="12" fill="#6B8E23" font-weight="bold">工程师角色: 写代码 -> 设计AI+代码混合系统</text>
<text x="80" y="460" font-size="11" fill="#666">理解"为什么这样设计" > "会用什么工具"</text>
</svg>`,
};

// Ensure output directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Generate SVG and PNG for each entry
async function generateAll() {
  for (const [name, svgContent] of Object.entries(svgs)) {
    const svgPath = path.join(outDir, `${name}.svg`);
    const pngPath = path.join(outDir, `${name}.png`);

    fs.writeFileSync(svgPath, svgContent);

    await sharp(Buffer.from(svgContent))
      .resize(1600, 1000, { fit: 'fill' })
      .png()
      .toFile(pngPath);

    console.log(`Generated: ${name}.png`);
  }
  console.log('All Chapter 7 images generated successfully!');
}

generateAll().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
