#!/usr/bin/env python3
"""Batch generate chapter4+Q29 illustration images using unclezhen-illustration-skills."""
import subprocess, os, time, glob, shutil

SKILL_DIR = "/Users/dz/.workbuddy/skills/unclezhen-illustration-skills"
PYTHON = "/Users/dz/.workbuddy/binaries/python/envs/default/bin/python3"
PROXY = "http://127.0.0.1:7897"
OUT_DIR = "/Volumes/dz/code/kepu-book/images-new/chapter4"
Q29_OUT_DIR = "/Volumes/dz/code/kepu-book/images-new/chapter2"

os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(Q29_OUT_DIR, exist_ok=True)

STYLE = """Match character to reference image: same round glasses, round slightly chubby face, short black hair, polo shirt with 臻叔 text on chest, holding smartphone, blue jeans, crocs-style shoes with holes. Keep exact colors and proportions from the character reference; only outlines become sketchy.

A slightly chubby male character with a round face, round glasses, short black hair. Wears a polo shirt with 臻叔 text on the chest, blue jeans, and crocs-style shoes with holes. Holds a smartphone in one hand. Body proportions are slightly chibi (head-to-body ratio approximately 1:3). Friendly, approachable veteran tech community vibe.

quirky hand-drawn illustration, wobbly ink lines, expressive rough sketch, naive art style, black hand-drawn line structure for scene objects, soft blue as main scene accent color, soft orange on at most 2 small highlight touches (not object fills), blue local accent fills on at most 1-4 key scene objects; recognizable concrete objects connected by clear story flow arrows or path; multiple named objects allowed (typically 4-8) — hierarchy via size and line weight, not more color fills; changes shown with line marks not red-green color fills; white background, editorial doodle feeling, no photorealistic, no smooth vector, no 3D render, no PPT infographic, no gradient, no cute cartoon, no colored label backgrounds, no large color-filled shapes

subject occupies 50-75% of frame, at least 25% white space, preferably one continuous empty block, not filled edge to edge; whitespace does not mean fewer objects — allow 4-8 named objects when the message needs it; use size, line weight, and depth layering instead of color blocks to create hierarchy

aspect ratio 16:9, horizontal composition, landscape orientation, wide frame, NOT portrait, NOT square

sparse handwritten Chinese labels only, 2-5 labels total; black text and black arrows only; no colored sticky notes, no label background fills, no colorful underlines; character keeps full reference colors; scene objects stay mostly black line art; soft blue as the main scene accent; soft orange for at most 2 small highlights only; blue fills on at most 1-4 key scene objects maximum; no English except product names"""

SCENES = {
    "Q46-hash-vs-encrypt-vs-sign": {
        "reader_takeaway": "哈希是变短（不可逆），加密是可逆，签名是用私钥证明身份",
        "objects": "Three boxes side by side: 1. a Hash box with a funnel going in a big message and coming out a short digest, label 'irreversible'. 2. an Encrypt box with a keyhole and a lock, showing plaintext in and ciphertext out, label 'reversible with key'. 3. a Sign box with a pen writing a signature on a document, and a public key lock verifying it, label 'identity proof'. Character stands at center pointing to the three boxes.",
        "labels": "哈希(不可逆), 加密(可逆), 签名(身份证明)"
    },
    "Q47-password-storage": {
        "reader_takeaway": "好的密码存储是 盐值(salt) + 慢哈希 + pepper",
        "objects": "A vault/safe with a password box on top. The password goes through a mixing machine: salt granules + a pepper shaker go into a slow-hash grinder (labeled bcrypt/Argon2). Out comes a hash that goes into the vault. On the right, a rainbow table attack is blocked by a STOP sign. Character holds a shield labeled 'salt+slow hash'.",
        "labels": "盐值, 慢哈希, 彩虹表阻断"
    },
    "Q48-cert-chain": {
        "reader_takeaway": "浏览器验证证书链：根CA预装信任 → 中间CA签发 → 网站证书",
        "objects": "Three vertical certificates stacked and chained: top is a small golden Root CA certificate, middle is an Intermediate CA certificate with a chain link, bottom is a Website certificate. Arrows show Root signs Intermediate, Intermediate signs Website. At the bottom, a browser window with a green lock icon. Character points at the chain saying 'trust flows down'.",
        "labels": "根CA信任, 中间CA签发, 网站证书"
    },
    "Q49-sql-injection": {
        "reader_takeaway": "SQL注入是把恶意代码注入查询语句",
        "objects": "A user input box labeled 'username'. An attacker hand puts a string with quotes and SQL commands into the box. The string goes into a database query pipe and comes out with a skull/destructive symbol at the end. On the right, a parameterized query with a shield blocks the attack. Character holds a shield labeled 'parameterized query'.",
        "labels": "恶意输入, SQL注入, 参数化查询"
    },
    "Q50-xss": {
        "reader_takeaway": "XSS是注入恶意脚本让浏览器执行",
        "objects": "An input form on a website. A malicious script tag <script> goes into the input, gets stored in a database, then served to other users' browsers. The browsers execute the script showing a popup alert. On the right, CSP headers act as a firewall. Character holds a CSP shield.",
        "labels": "恶意脚本, XSS攻击, CSP防护"
    },
    "Q51-csrf": {
        "reader_takeaway": "CSRF是诱导用户在已登录状态下执行非自愿操作",
        "objects": "A victim user is logged into a bank website (cookie shown). A malicious attacker website sends a hidden form that submits a transfer request to the bank. The bank sees the valid cookie and processes the transfer. On the right, a CSRF token acts as a gatekeeper. Character holds a token.",
        "labels": "钓鱼网站, 伪造请求, CSRF Token"
    },
    "Q52-ddos": {
        "reader_takeaway": "DDoS用海量请求压垮目标服务器",
        "objects": "A swarm of small bot computers (zombie army) all shooting request arrows at a single server. The server is being crushed under the pile of requests, with a red warning light. Above, a scrubbing center/WAF filters out bad traffic. Character holds a magnifying glass over the traffic.",
        "labels": "僵尸网络, 海量请求, 清洗中心"
    },
    "Q53-risk-control": {
        "reader_takeaway": "风控是实时计算风险分数，高于阈值则拦截",
        "objects": "A pipeline: User action (login/payment) goes into a risk engine with dials and gauges. The engine outputs a risk score (0-100). A gate opens if score is low, blocks if score is high. Historical data and rule engine feed into the risk engine. Character monitors the dials.",
        "labels": "风险引擎, 实时评分, 阈值拦截"
    },
    "Q54-oauth2": {
        "reader_takeaway": "OAuth2让第三方应用安全获取用户授权，不暴露密码",
        "objects": "Three characters: User holds a key, Application holds a lock, Authorization Server holds a token factory. Arrows show: User -> App 'I want to login', App -> Auth Server 'please authorize', Auth Server -> User 'do you approve?', User -> Auth Server 'yes', Auth Server -> App 'here is access token'. Character stands between them as a mediator.",
        "labels": "用户授权, AccessToken, 不暴露密码"
    },
    "Q55-sso": {
        "reader_takeaway": "SSO：登录一次，访问多个系统",
        "objects": "A central login portal (labeled SSO) with a single key. Multiple application doors (OA, Email, CRM, HR) all connect to the portal. Once the user logs into the portal, all doors unlock automatically. A Token passes from portal to each app. Character holds the master key.",
        "labels": "单点登录, 中心认证, Token传递"
    },
    "Q56-captcha": {
        "reader_takeaway": "验证码是人机验证的军备竞赛：从文本到滑动到无感",
        "objects": "A timeline from left to right: 1. distorted text CAPTCHA, 2. image-select CAPTCHA ('click all traffic lights'), 3. slider puzzle CAPTCHA, 4. invisible risk-based CAPTCHA (no user interaction). On top, AI bots evolving from simple to advanced, with an arms-race arrow. Character watches the timeline.",
        "labels": "文本验证码, 滑动验证, 无感验证"
    },
    "Q57-side-channel": {
        "reader_takeaway": "侧信道攻击通过时间、功耗、电磁等物理信息窃取密钥",
        "objects": "A CPU chip with multiple sensors around it: a clock/timer measuring execution time, a power meter measuring electricity consumption, an antenna picking up electromagnetic waves. The sensors leak information to an attacker. Character holds a Faraday cage and a constant-time code shield.",
        "labels": "时间攻击, 功耗分析, 电磁泄漏"
    },
    "Q58-rate-limit": {
        "reader_takeaway": "接口防刷用限流令牌桶+滑动窗口+行为分析三层防护",
        "objects": "Three layers of defense: 1. A token bucket with tokens dropping in at a fixed rate. 2. A sliding window counter tracking requests per second. 3. A behavior analyzer detecting abnormal patterns (same IP, same device). Requests pass through all three gates. Character holds a stopwatch.",
        "labels": "令牌桶, 滑动窗口, 行为分析"
    },
    "Q59-remember-password": {
        "reader_takeaway": "记住密码=加密存储Token+安全Cookie，不是存明文密码",
        "objects": "Two paths side by side: Left path 'Bad': a browser stores plaintext password in a cookie jar, attacked by a thief. Right path 'Good': browser stores an encrypted refresh token with HttpOnly and Secure flags. Character stands on the right path with a thumbs up.",
        "labels": "加密Token, HttpOnly, Secure"
    },
    "Q60-sim-swap": {
        "reader_takeaway": "SIM Swap是社工攻击：骗子冒充机主骗运营商换SIM卡",
        "objects": "A phone user on the left. A scammer in the middle calls the carrier pretending to be the user. The carrier issues a new SIM card to the scammer. The scammer now receives all SMS (including 2FA codes) and takes over accounts. Character warns the user.",
        "labels": "社工攻击, SIM换卡, 2FA绕过"
    },
    "Q61-credential-stuffing": {
        "reader_takeaway": "撞库=用泄露的账号密码批量尝试登录其他网站",
        "objects": "A database labeled 'leaked passwords' with millions of username:password pairs. A bot takes these pairs and tries them against multiple websites (Facebook, Twitter, Bank). Some doors open. On the right, rate limiting blocks repeated attempts. Character holds a list of leaked accounts.",
        "labels": "泄露库, 批量尝试, 登录保护"
    },
    "Q62-zero-trust": {
        "reader_takeaway": "零信任=永不信任，始终验证；边界防御=城墙思维",
        "objects": "Two architectures side by side: Left 'Perimeter': a castle wall with a moat. Inside is safe, outside is dangerous. Right 'Zero Trust': no wall, every resource has its own guard checking every request, even internal ones. Character walks freely through the right side but is checked at every door.",
        "labels": "边界防御, 零信任, 始终验证"
    },
    "Q63-brute-force": {
        "reader_takeaway": "防暴力破解=验证码+账号锁定+IP限流+蜜罐多层防护",
        "objects": "An attacker with a brute-force tool trying millions of passwords. Four defense layers block the attack: 1. CAPTCHA gate, 2. Account lock after 5 failures, 3. IP rate limit (throttle), 4. Honeypot trap (fake login that alerts admin). Character monitors the defense system.",
        "labels": "验证码, 账号锁定, IP限流, 蜜罐"
    },
    "Q64-symmetric-vs-asymmetric": {
        "reader_takeaway": "对称加密快但密钥分发难；非对称加密慢但解决了密钥分发",
        "objects": "Two locks side by side: Left 'Symmetric' (AES): one key opens and locks, very fast, but the key must be shared secretly. Right 'Asymmetric' (RSA): public key locks, private key unlocks, slow but no secret sharing needed. Arrows show speed comparison. Character holds both keys.",
        "labels": "对称加密(快), 非对称加密(慢), 密钥分发"
    },
    "Q65-data-breach": {
        "reader_takeaway": "被拖库后即使密码加密，也可能通过彩虹表/暴力破解恢复",
        "objects": "A database server being dragged away by a thief. Inside the database are password hashes. An offline cracking farm with GPUs tries billions of passwords per second against the hashes. Some hashes crack open revealing plaintext passwords. Character looks at the cracked hashes with a worried face.",
        "labels": "拖库, 彩虹表, 离线破解"
    },
}

def generate(name, scene, out_dir):
    out_path = os.path.join(out_dir, f"{name}.png")
    if os.path.exists(out_path):
        print(f"⏭️  Skip (exists): {name}")
        return True

    print(f"\n{'='*60}")
    print(f"Generating: {name}")
    print(f"{'='*60}")

    prompt = f"""{STYLE}

Reader takeaway: {scene['reader_takeaway']}

Draw these specific named objects: {scene['objects']} Character is positioned naturally within the scene, interacting with the illustrated objects. Character's proportions and colors exactly match the reference image.

sparse handwritten Chinese labels only, 2-5 labels total: {scene['labels']}; black text and black arrows only; no colored sticky notes, no label background fills, no colorful underlines; character keeps full reference colors; scene objects stay mostly black line art; soft blue as the main scene accent; soft orange for at most 2 small highlights only; blue fills on at most 1-4 key scene objects maximum; no English except product names"""

    cmd = [
        PYTHON, "scripts/generate_illustration.py", "image",
        "--prompt", prompt,
        "--image-file", "assets/reference-character.png",
        "--model", "gpt-image-2",
        "--size", "16:9",
        "--resolution", "2K"
    ]
    env = os.environ.copy()
    env["http_proxy"] = PROXY
    env["https_proxy"] = PROXY

    try:
        result = subprocess.run(cmd, cwd=SKILL_DIR, env=env, capture_output=True, text=True, timeout=300)
        if result.returncode == 0:
            # Find and move the generated image
            files = glob.glob(os.path.join(SKILL_DIR, "outputs/images/unclezhen_*.png"))
            if files:
                latest = max(files, key=os.path.getmtime)
                shutil.move(latest, out_path)
                print(f"✅ Saved: {out_path}")
                return True
            else:
                print(f"⚠️  No output file found for {name}")
                return False
        else:
            print(f"❌ Failed: {name}\nstderr: {result.stderr[:500]}")
            return False
    except Exception as e:
        print(f"❌ Exception: {name} - {e}")
        return False

if __name__ == "__main__":
    success, failed = 0, []
    
    # Chapter 4
    for name, scene in SCENES.items():
        if generate(name, scene, OUT_DIR):
            success += 1
        else:
            failed.append(name)
        time.sleep(1)
    
    # Q29 - P2P
    q29_scene = {
        "reader_takeaway": "P2P下载：下载的人越多，上传源越多，速度越快",
        "objects": "A swarm of peer computers connected in a mesh network. In the center, a large file is split into many small pieces (colored blocks). Each peer has some pieces and shares them with neighbors. Arrows show pieces flowing between peers. On the left, a traditional server is overloaded with too many download requests (red warning). On the right, the P2P network shows efficient distribution. Character points to the mesh saying 'more peers = faster'.",
        "labels": "文件分片, P2P网络, 越多越快"
    }
    if generate("Q29-p2p-file-distribution", q29_scene, Q29_OUT_DIR):
        success += 1
    else:
        failed.append("Q29-p2p-file-distribution")

    print(f"\n{'='*60}")
    print(f"DONE: {success} success, {len(failed)} failed")
    if failed:
        print(f"Failed: {failed}")
    print(f"{'='*60}")
