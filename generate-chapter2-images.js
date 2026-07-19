const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = '/Users/leiwen/WorkBuddy/kepu/images/chapter2';

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
  'q16-tcp-handshake': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">TCP 三次握手</text>
<rect x="120" y="70" width="140" height="60" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" stroke-dasharray="4,3" />
<text x="135" y="105" font-size="16" fill="#4A6FA5" font-weight="bold">Client</text>
<rect x="520" y="70" width="140" height="60" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" stroke-dasharray="4,3" />
<text x="535" y="105" font-size="16" fill="#A56F4A" font-weight="bold">Server</text>
<line x1="190" y1="140" x2="590" y2="140" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="300" y="130" font-size="12" fill="#333">① SYN seq=x</text>
<line x1="590" y1="180" x2="190" y2="180" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="300" y="170" font-size="12" fill="#333">② SYN+ACK seq=y, ack=x+1</text>
<line x1="190" y1="220" x2="590" y2="220" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="300" y="210" font-size="12" fill="#333">③ ACK seq=x+1, ack=y+1</text>
<rect x="120" y="250" width="540" height="40" rx="4" fill="none" stroke="#4A6FA5" stroke-width="1.5" />
<text x="135" y="275" font-size="12" fill="#333">三次 = 最小充分条件：双方都确认对方能收能发</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q17-dns-resolution': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">DNS 递归解析链</text>
<rect x="80" y="80" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="90" y="110" font-size="13" fill="#333">浏览器 / OS</text>
<rect x="280" y="80" width="120" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="290" y="110" font-size="13" fill="#333">本地DNS</text>
<rect x="480" y="80" width="100" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="490" y="110" font-size="13" fill="#333">根服务器</text>
<rect x="620" y="80" width="100" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="630" y="110" font-size="13" fill="#333">TLD</text>
<rect x="620" y="200" width="130" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="630" y="230" font-size="13" fill="#333">权威服务器</text>
<line x1="200" y1="105" x2="280" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="400" y1="105" x2="480" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="580" y1="105" x2="620" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="720" y1="130" x2="720" y2="130" />
<line x1="670" y1="130" x2="670" y2="200" stroke="#666" stroke-width="1" marker-end="url(#arrow2)" />
<line x1="670" y1="225" x2="340" y2="225" stroke="#666" stroke-width="1" marker-end="url(#arrow2)" />
<line x1="340" y1="225" x2="340" y2="130" stroke="#666" stroke-width="1" marker-end="url(#arrow2)" />
<line x1="340" y1="130" x2="200" y2="130" stroke="#666" stroke-width="1" marker-end="url(#arrow2)" />
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker><marker id="arrow2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#A56F4A" /></marker></defs>
<text x="80" y="320" font-size="12" fill="#333">客户端只发一次请求 → 本地DNS递归完成所有转发 → 最终返回IP</text>
</svg>`,
  'q18-cdn-architecture': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">CDN 内容分发网络</text>
<rect x="80" y="80" width="130" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="90" y="110" font-size="13" fill="#333">User 北京</text>
<rect x="300" y="80" width="130" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="310" y="110" font-size="13" fill="#333">边缘节点 北京</text>
<rect x="520" y="80" width="130" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="530" y="110" font-size="13" fill="#333">区域中心</text>
<rect x="520" y="200" width="130" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="530" y="230" font-size="13" fill="#333">源站</text>
<line x1="210" y1="105" x2="300" y2="105" stroke="#4A6FA5" stroke-width="2" marker-end="url(#arrow)" />
<text x="215" y="95" font-size="11" fill="#333">请求 video.mp4</text>
<line x1="430" y1="105" x2="520" y2="105" stroke="#666" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<text x="440" y="95" font-size="11" fill="#333">未命中</text>
<line x1="650" y1="105" x2="650" y2="200" stroke="#666" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<line x1="580" y1="225" x2="365" y2="225" stroke="#666" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<line x1="365" y1="225" x2="365" y2="130" stroke="#666" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<line x1="365" y1="130" x2="210" y2="130" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="80" y="320" font-size="12" fill="#333">命中：用户从最近边缘节点直接下载  →  未命中：逐级回源，缓存后服务</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q19-tls-handshake': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">TLS 1.2 握手流程</text>
<rect x="100" y="70" width="140" height="60" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" stroke-dasharray="4,3" />
<text x="115" y="105" font-size="16" fill="#4A6FA5" font-weight="bold">Browser</text>
<rect x="550" y="70" width="140" height="60" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" stroke-dasharray="4,3" />
<text x="565" y="105" font-size="16" fill="#A56F4A" font-weight="bold">Server</text>
<line x1="170" y1="140" x2="620" y2="140" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="300" y="130" font-size="12" fill="#333">ClientHello (TLS版本+随机数+套件)</text>
<line x1="620" y1="175" x2="170" y2="175" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="300" y="165" font-size="12" fill="#333">ServerHello + 证书链</text>
<line x1="170" y1="210" x2="620" y2="210" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="300" y="200" font-size="12" fill="#333">Pre-Master Secret (公钥加密)</text>
<line x1="170" y1="245" x2="620" y2="245" stroke="#666" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<line x1="620" y1="245" x2="170" y2="245" stroke="#666" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<text x="300" y="270" font-size="12" fill="#333">双方推导对称会话密钥</text>
<line x1="170" y1="300" x2="620" y2="300" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="620" y1="300" x2="170" y2="300" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="300" y="325" font-size="12" fill="#333">Finished → 加密数据开始</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q20-websocket-upgrade': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">HTTP 升级 WebSocket</text>
<rect x="100" y="70" width="140" height="60" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" stroke-dasharray="4,3" />
<text x="115" y="105" font-size="16" fill="#4A6FA5" font-weight="bold">Browser</text>
<rect x="550" y="70" width="140" height="60" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" stroke-dasharray="4,3" />
<text x="570" y="105" font-size="16" fill="#A56F4A" font-weight="bold">Server</text>
<line x1="170" y1="140" x2="620" y2="140" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="250" y="130" font-size="12" fill="#333">GET /ws  Upgrade: websocket</text>
<line x1="620" y1="180" x2="170" y2="180" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="250" y="170" font-size="12" fill="#333">101 Switching Protocols</text>
<line x1="170" y1="220" x2="620" y2="220" stroke="#4A6FA5" stroke-width="2" marker-end="url(#arrow)" />
<line x1="620" y1="260" x2="170" y2="260" stroke="#A56F4A" stroke-width="2" marker-end="url(#arrow)" />
<line x1="170" y1="300" x2="620" y2="300" stroke="#4A6FA5" stroke-width="2" marker-end="url(#arrow)" />
<text x="320" y="250" font-size="13" fill="#333" font-weight="bold">全双工 WebSocket 帧</text>
<rect x="150" y="350" width="500" height="40" rx="4" fill="none" stroke="#666" stroke-width="1.5" />
<text x="165" y="375" font-size="12" fill="#333">HTTP 用于握手，WebSocket 帧用于后续双向通信</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q21-nat-translation': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">NAT：多设备共享一个公网IP</text>
<rect x="80" y="80" width="120" height="40" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="90" y="105" font-size="12" fill="#333">192.168.1.105</text>
<rect x="80" y="140" width="120" height="40" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="90" y="165" font-size="12" fill="#333">192.168.1.106</text>
<rect x="80" y="200" width="120" height="40" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="90" y="225" font-size="12" fill="#333">192.168.1.107</text>
<rect x="320" y="130" width="160" height="80" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="340" y="175" font-size="14" fill="#A56F4A" font-weight="bold">NAT 路由器</text>
<rect x="580" y="130" width="140" height="80" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="595" y="175" font-size="14" fill="#6B8E23" font-weight="bold">互联网</text>
<line x1="200" y1="100" x2="320" y2="150" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="200" y1="160" x2="320" y2="170" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="200" y1="220" x2="320" y2="190" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="480" y1="170" x2="580" y2="170" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="330" y="260" font-size="12" fill="#333">映射表：203.0.113.5:12345 ↔ 192.168.1.105:54321</text>
<text x="330" y="285" font-size="12" fill="#333">203.0.113.5:12346 ↔ 192.168.1.106:54322</text>
<text x="80" y="320" font-size="12" fill="#333">内网用私有IP，出口统一换成公网IP + 不同端口号</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q22-p2p-hole-punching': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">P2P 打洞：NAT 后的直连</text>
<rect x="80" y="80" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="95" y="110" font-size="13" fill="#333">A</text>
<rect x="180" y="180" width="120" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="200" y="210" font-size="13" fill="#A56F4A">NAT-A</text>
<rect x="400" y="180" width="120" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="420" y="210" font-size="13" fill="#A56F4A">NAT-B</text>
<rect x="600" y="80" width="120" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="615" y="110" font-size="13" fill="#6B8E23">B</text>
<rect x="340" y="330" width="120" height="50" rx="4" fill="none" stroke="#666" stroke-width="2" />
<text x="350" y="360" font-size="13" fill="#333">STUN/Signaling</text>
<line x1="140" y1="130" x2="240" y2="180" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="520" y1="180" x2="660" y2="130" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="240" y1="205" x2="400" y2="205" stroke="#4A6FA5" stroke-width="2" marker-end="url(#arrow)" />
<line x1="400" y1="225" x2="240" y2="225" stroke="#6B8E23" stroke-width="2" marker-end="url(#arrow)" />
<text x="300" y="250" font-size="12" fill="#333">A 和 B 同时向对方 NAT 发数据 → 两边都打洞成功</text>
<line x1="140" y1="130" x2="340" y2="330" stroke="#666" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<line x1="660" y1="130" x2="460" y2="330" stroke="#666" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<text x="80" y="430" font-size="12" fill="#333">STUN 报告公网地址，信令服务器交换地址，同时发UDP打洞；失败则走TURN中继</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q23-quic-vs-tcp': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">QUIC vs TCP</text>
<rect x="80" y="80" width="300" height="140" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="110" font-size="16" fill="#4A6FA5" font-weight="bold">TCP + TLS 1.2</text>
<line x1="100" y1="130" x2="360" y2="130" stroke="#666" stroke-width="1" />
<line x1="100" y1="130" x2="160" y2="130" stroke="#666" stroke-width="4" />
<line x1="160" y1="130" x2="220" y2="130" stroke="#666" stroke-width="4" />
<line x1="220" y1="130" x2="360" y2="130" stroke="#666" stroke-width="4" />
<text x="100" y="160" font-size="12" fill="#333">TCP握手 1-RTT + TLS握手 2-RTT = 3-RTT</text>
<text x="100" y="180" font-size="12" fill="#333">一个流丢包，全连接阻塞</text>
<text x="100" y="200" font-size="12" fill="#333">IP变了连接就断</text>
<rect x="420" y="80" width="300" height="140" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="440" y="110" font-size="16" fill="#6B8E23" font-weight="bold">QUIC / HTTP3</text>
<line x1="440" y1="130" x2="700" y2="130" stroke="#666" stroke-width="1" />
<line x1="440" y1="130" x2="700" y2="130" stroke="#6B8E23" stroke-width="8" />
<text x="440" y="160" font-size="12" fill="#333">1-RTT（甚至 0-RTT）握手</text>
<text x="440" y="180" font-size="12" fill="#333">多流独立，单流阻塞不影响他流</text>
<text x="440" y="200" font-size="12" fill="#333">连接ID不变，IP变了也能继续</text>
<rect x="80" y="300" width="640" height="40" rx="4" fill="none" stroke="#666" stroke-width="1.5" />
<text x="95" y="325" font-size="12" fill="#333">QUIC 在 UDP 之上重新实现可靠传输，绕过 TCP 中间件僵化问题</text>
</svg>`,
  'q24-tcp-congestion': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">TCP 拥塞控制窗口变化</text>
<line x1="80" y1="420" x2="720" y2="420" stroke="#333" stroke-width="1.5" />
<line x1="80" y1="420" x2="80" y2="80" stroke="#333" stroke-width="1.5" />
<text x="730" y="425" font-size="12" fill="#333">RTT</text>
<text x="60" y="80" font-size="12" fill="#333">cwnd</text>
<path d="M80,400 L120,380 L160,340 L200,260 L240,220 L280,200 L320,190 L360,185 L400,185 L440,185 L480,185 L520,185 L560,185 L600,185" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="130" y="310" font-size="12" fill="#4A6FA5">慢启动</text>
<text x="320" y="170" font-size="12" fill="#A56F4A">拥塞避免</text>
<path d="M640,185 L680,140 L720,180" fill="none" stroke="#D88A8A" stroke-width="2" stroke-dasharray="3,3" />
<text x="650" y="130" font-size="12" fill="#D88A8A">丢包/超时</text>
<line x1="600" y1="185" x2="720" y2="185" stroke="#666" stroke-width="1" stroke-dasharray="3,3" />
<text x="620" y="205" font-size="11" fill="#333">ssthresh</text>
<rect x="80" y="450" width="640" height="40" rx="4" fill="none" stroke="#666" stroke-width="1.5" />
<text x="95" y="475" font-size="12" fill="#333">慢启动指数增长 → 拥塞避免线性增长 → 丢包后半窗恢复</text>
</svg>`,
  'q25-http-cache': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">HTTP 缓存决策流程</text>
<rect x="100" y="80" width="160" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="110" y="110" font-size="13" fill="#333">请求资源</text>
<rect x="300" y="80" width="160" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="310" y="110" font-size="13" fill="#333">本地强缓存有效？</text>
<rect x="500" y="80" width="200" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="510" y="110" font-size="13" fill="#333">直接使用本地缓存</text>
<rect x="300" y="200" width="160" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="310" y="230" font-size="13" fill="#333">协商缓存：304？</text>
<rect x="500" y="200" width="200" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="510" y="230" font-size="13" fill="#333">200 返回新内容</text>
<line x1="260" y1="105" x2="300" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="460" y1="105" x2="500" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="380" y1="130" x2="380" y2="200" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="390" y="165" font-size="11" fill="#333">过期</text>
<line x1="460" y1="225" x2="500" y2="225" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="380" y1="225" x2="380" y2="280" stroke="#666" stroke-width="1" stroke-dasharray="3,3" />
<text x="390" y="265" font-size="11" fill="#333">返回304</text>
<rect x="100" y="350" width="600" height="40" rx="4" fill="none" stroke="#666" stroke-width="1.5" />
<text x="115" y="375" font-size="12" fill="#333">强缓存看 Cache-Control/Expires；协商缓存看 ETag/Last-Modified</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q26-load-balancer': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">负载均衡：把请求分到多台机器</text>
<rect x="80" y="200" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="95" y="230" font-size="13" fill="#333">用户请求</text>
<rect x="280" y="180" width="140" height="90" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="300" y="225" font-size="14" fill="#A56F4A" font-weight="bold">LB</text>
<rect x="500" y="80" width="120" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="510" y="110" font-size="13" fill="#6B8E23">Server 1</text>
<rect x="500" y="180" width="120" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="510" y="210" font-size="13" fill="#6B8E23">Server 2</text>
<rect x="500" y="280" width="120" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="510" y="310" font-size="13" fill="#6B8E23">Server 3</text>
<line x1="200" y1="225" x2="280" y2="225" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="420" y1="210" x2="500" y2="110" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="420" y1="225" x2="500" y2="205" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="420" y1="240" x2="500" y2="305" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="300" y="350" font-size="12" fill="#333">算法：轮询 / 加权轮询 / 最小连接 / 源地址哈希 / 一致性哈希</text>
<rect x="100" y="400" width="600" height="40" rx="4" fill="none" stroke="#666" stroke-width="1.5" />
<text x="115" y="425" font-size="12" fill="#333">四层LB转发IP+端口，七层LB解析HTTP内容做更智能路由</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q27-dns-hijacking': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">DNS 劫持 vs DNS 污染</text>
<rect x="80" y="80" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="90" y="110" font-size="13" fill="#333">用户</text>
<rect x="280" y="80" width="120" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="290" y="110" font-size="13" fill="#A56F4A">DNS 服务器</text>
<rect x="480" y="80" width="120" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="490" y="110" font-size="13" fill="#6B8E23">银行官网</text>
<rect x="280" y="200" width="120" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="290" y="230" font-size="13" fill="#D88A8A">钓鱼网站</text>
<line x1="200" y1="105" x2="280" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="400" y1="105" x2="480" y2="105" stroke="#666" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<line x1="340" y1="130" x2="340" y2="200" stroke="#D88A8A" stroke-width="2" marker-end="url(#arrow)" />
<line x1="340" y1="225" x2="480" y2="130" stroke="#D88A8A" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<text x="80" y="320" font-size="12" fill="#333">劫持：DNS服务器/路由器/hosts被篡改，返回恶意IP</text>
<text x="80" y="350" font-size="12" fill="#333">污染：DNS缓存被注入伪造记录，影响一批用户</text>
<text x="80" y="380" font-size="12" fill="#333">防御：DNSSEC / DoH / DoT / HTTPS证书校验</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q28-keepalive': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">HTTP 长连接复用</text>
<rect x="80" y="80" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="110" font-size="13" fill="#333">Client</text>
<rect x="600" y="80" width="120" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="620" y="110" font-size="13" fill="#A56F4A">Server</text>
<line x1="200" y1="105" x2="600" y2="105" stroke="#4A6FA5" stroke-width="2" marker-end="url(#arrow)" />
<text x="350" y="95" font-size="12" fill="#333">TCP 握手 + 请求1</text>
<line x1="600" y1="140" x2="200" y2="140" stroke="#A56F4A" stroke-width="2" marker-end="url(#arrow)" />
<text x="350" y="130" font-size="12" fill="#333">响应1</text>
<line x1="200" y1="175" x2="600" y2="175" stroke="#4A6FA5" stroke-width="2" marker-end="url(#arrow)" />
<text x="350" y="165" font-size="12" fill="#333">请求2（复用连接）</text>
<line x1="600" y1="210" x2="200" y2="210" stroke="#A56F4A" stroke-width="2" marker-end="url(#arrow)" />
<text x="350" y="200" font-size="12" fill="#333">响应2</text>
<line x1="200" y1="245" x2="600" y2="245" stroke="#4A6FA5" stroke-width="2" marker-end="url(#arrow)" />
<text x="350" y="235" font-size="12" fill="#333">请求3</text>
<line x1="600" y1="280" x2="200" y2="280" stroke="#A56F4A" stroke-width="2" marker-end="url(#arrow)" />
<text x="350" y="270" font-size="12" fill="#333">响应3</text>
<rect x="80" y="340" width="640" height="40" rx="4" fill="none" stroke="#666" stroke-width="1.5" />
<text x="95" y="365" font-size="12" fill="#333">一个 TCP 连接传多个 HTTP 请求，省掉多次握手开销；但要控制连接数和超时</text>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#666" /></marker></defs>
</svg>`,
  'q29-network-partition': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">网络分区与脑裂</text>
<rect x="80" y="80" width="260" height="160" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="110" font-size="14" fill="#4A6FA5" font-weight="bold">分区 A</text>
<circle cx="140" cy="150" r="20" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="132" y="155" font-size="12" fill="#333">N1</text>
<circle cx="210" cy="150" r="20" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="202" y="155" font-size="12" fill="#333">N2</text>
<rect x="460" y="80" width="260" height="160" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="480" y="110" font-size="14" fill="#6B8E23" font-weight="bold">分区 B</text>
<circle cx="520" cy="150" r="20" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="512" y="155" font-size="12" fill="#333">N3</text>
<circle cx="590" cy="150" r="20" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="582" y="155" font-size="12" fill="#333">N4</text>
<circle cx="660" cy="150" r="20" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="652" y="155" font-size="12" fill="#333">N5</text>
<line x1="340" y1="150" x2="460" y2="150" stroke="#D88A8A" stroke-width="3" stroke-dasharray="5,5" />
<text x="360" y="140" font-size="12" fill="#D88A8A">网络中断</text>
<rect x="80" y="300" width="640" height="40" rx="4" fill="none" stroke="#666" stroke-width="1.5" />
<text x="95" y="325" font-size="12" fill="#333">A 区只有 2 人，不够多数派 → 必须停止服务；B 区 3 人，可以继续</text>
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
