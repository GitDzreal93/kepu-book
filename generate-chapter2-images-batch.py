#!/usr/bin/env python3
"""Batch generate illustrations for Chapter 2 (Q16-Q29) using APIMart + zhenshu character."""

import subprocess
import os
import sys
import time
import shutil

SKILL_DIR = "/Users/dz/.workbuddy/skills/unclezhen-illustration-skills"
PYTHON = "/Users/dz/.workbuddy/binaries/python/envs/default/bin/python3"
OUTPUT_DIR = "/Volumes/dz/code/kepu-book/images-new/chapter2"
PROXY = "http://127.0.0.1:7897"

STYLE = """Match character to reference image: same round glasses, round slightly chubby face, short black hair, polo shirt with 臻叔 text on chest, holding smartphone, blue jeans, crocs-style shoes with holes. Keep exact colors and proportions from the character reference; only outlines become sketchy.

A slightly chubby male character with a round face, round glasses, short black hair. Wears a polo shirt with 臻叔 text on the chest, blue jeans, and crocs-style shoes with holes. Holds a smartphone in one hand. Body proportions are slightly chibi (head-to-body ratio approximately 1:3). Friendly, approachable veteran tech community vibe.

quirky hand-drawn illustration, wobbly ink lines, expressive rough sketch, naive art style, black hand-drawn line structure for scene objects, soft blue as main scene accent color, soft orange on at most 2 small highlight touches (not object fills), blue local accent fills on at most 1-4 key scene objects; recognizable concrete objects connected by clear story flow arrows or path; multiple named objects allowed (typically 4-8) — hierarchy via size and line weight, not more color fills; changes shown with line marks not red-green color fills; white background, editorial doodle feeling, no photorealistic, no smooth vector, no 3D render, no PPT infographic, no gradient, no cute cartoon, no colored label backgrounds, no large color-filled shapes

subject occupies 50-75% of frame, at least 25% white space, preferably one continuous empty block, not filled edge to edge; whitespace does not mean fewer objects — allow 4-8 named objects when the message needs it; use size, line weight, and depth layering instead of color blocks to create hierarchy

IMPORTANT style adaptation for character: Keep ALL identity anchors (clothing, accessories, colors, proportions) exactly as defined in the IP file and reference images. Only change outline quality to wobbly sketch; do NOT change colors, proportions, or outfit items. Scene soft-blue and soft-orange accents apply to OBJECTS ONLY — must NOT tint, replace, or bleed into character clothing or accessories.

aspect ratio 16:9, horizontal composition, landscape orientation, wide frame, NOT portrait, NOT square

sparse handwritten Chinese labels only, 2-5 labels total; black text and black arrows only; no colored sticky notes, no label background fills, no colorful underlines; character keeps full reference colors; scene objects stay mostly black line art; soft blue as the main scene accent; soft orange for at most 2 small highlights only; blue fills on at most 1-4 key scene objects maximum; no English except product names

avoid equal-weight process diagrams unless the core idea is truly a process; avoid formal workflow chart or dense tutorial page; no colored sticky notes, no label background fills, no red-green diff color blocks; soft blue main scene accent; soft orange at most 2 small highlights only; no orange object fills or label backgrounds; NOT sunglasses instead of round glasses; NOT missing 臻叔 text on polo shirt; NOT dress pants instead of jeans; NOT sneakers instead of crocs; scene accent colors must NOT tint character clothing"""

SCENES = {
    "Q16-reliable-transport": {
        "reader_takeaway": "Reliable transport needs sequence numbers, ACKs, timeouts, and retransmission — building from UDP to TCP",
        "objects": "1. Two envelope icons labeled sender and receiver with a dotted line between them. 2. A numbered sequence strip showing 1,2,3,4,5 flying from sender to receiver. 3. Some packets marked with a dashed outline showing they got lost in the network cloud. 4. ACK arrows flying back from receiver to sender with checkmarks. 5. A timer clock icon near the sender showing retransmission timeout. 6. A retry arrow looping back for the lost packet. Character stands at center pointing at the lost packet and retry mechanism.",
        "labels": "序列号, 确认ACK, 超时重传"
    },
    "Q17-enter-url-to-render": {
        "reader_takeaway": "From typing URL to seeing the page involves DNS, TCP handshake, TLS, HTTP request, and browser rendering pipeline",
        "objects": "1. A browser address bar at top showing 'example.com'. 2. A DNS lookup chain below: browser cache → OS cache → LDNS → root → TLD → authoritative. 3. A TCP 3-way handshake icon (SYN, SYN-ACK, ACK). 4. A TLS handshake lock icon. 5. An HTTP GET arrow. 6. A server box responding. 7. A rendering pipeline at bottom: HTML parser → DOM tree → CSSOM → layout → paint. Character stands at left side tracing the flow with his finger.",
        "labels": "DNS解析, TCP握手, TLS加密, 页面渲染"
    },
    "Q18-tcp-vs-udp": {
        "reader_takeaway": "TCP is connection-oriented with reliability and congestion control; UDP is connectionless and best-effort, better for real-time",
        "objects": "1. Two delivery trucks side by side. Left truck labeled TCP is heavy, has a tracking device, checkpoint gates along its route, and a traffic light (congestion control). Right truck labeled UDP is light, has no tracking, flies straight through with no checkpoints. 2. A highway between sender and receiver. 3. Some UDP packets shown as small fast envelopes skipping over the road. Character stands between the two trucks comparing them with open hands.",
        "labels": "TCP可靠, UDP快速, 连接导向"
    },
    "Q19-dns-distributed": {
        "reader_takeaway": "DNS is a hierarchical distributed tree: root knows TLDs, TLDs know authoritative servers, no single server knows everything",
        "objects": "1. A tree structure with a root node at top labeled root DNS. 2. Branches going down to TLD nodes: .com, .cn, .org. 3. Each TLD branching to authoritative nodes: baidu.com, google.com. 4. Small leaf nodes showing IP addresses. 5. A magnifying glass icon tracing a query path from leaf back to root. Character stands at bottom-left watching the query climb the tree.",
        "labels": "根域名, 顶级域, 权威DNS"
    },
    "Q20-http-evolution": {
        "reader_takeaway": "HTTP/1.1 serial per connection, HTTP/2 multiplexes streams over one connection, HTTP/3 replaces TCP with QUIC over UDP",
        "objects": "1. Three pipeline illustrations stacked vertically. Top: HTTP/1.1 showing requests in a single-file queue, one after another, with head-of-line blocking. Middle: HTTP/2 showing multiple colored streams interleaved in one connection. Bottom: HTTP/3 showing UDP packets with encrypted QUIC headers, bypassing TCP entirely. 2. A speedometer showing latency improvement from top to bottom. Character stands at right pointing at the HTTP/3 improvement.",
        "labels": "HTTP/1.1串行, HTTP/2多路复用, HTTP/3 QUIC"
    },
    "Q21-https-certificate-chain": {
        "reader_takeaway": "HTTPS trust chain: browser trusts root CA, root CA signs intermediate CA, intermediate CA signs website certificate",
        "objects": "1. A vertical chain of three trust badges from top to bottom: root CA badge (in browser trust store), intermediate CA badge, website certificate badge. 2. Signature arrows going down connecting each level. 3. A browser window at bottom with a green lock icon verifying the chain. 4. A broken chain link icon on the side showing what happens when verification fails. Character stands at bottom holding the browser window.",
        "labels": "根CA, 中间CA, 网站证书"
    },
    "Q22-realtime-push": {
        "reader_takeaway": "Short polling wastes connections, long polling holds connections, WebSocket is full-duplex persistent, SSE is server-push one-way",
        "objects": "1. Four small diagram panels side by side. Panel 1 short polling: client repeatedly asking server with question marks. Panel 2 long polling: client holding one connection waiting. Panel 3 WebSocket: a bidirectional tunnel with arrows flowing both ways. Panel 4 SSE: a one-way arrow from server to client. 2. A battery/efficiency meter under each panel. Character stands below comparing the four approaches.",
        "labels": "短轮询, WebSocket, SSE推送"
    },
    "Q23-nat-translation": {
        "reader_takeaway": "NAT rewrites private IP:port to public IP:port, maintaining a mapping table so return traffic can find its way back",
        "objects": "1. A house icon on the left labeled private network with devices inside (phone, laptop, tablet) each with private IPs. 2. A NAT router box in the middle with a translation table inside showing mappings like 192.168.1.100:54321 → 203.0.113.5:12345. 3. An internet cloud on the right with a server icon. 4. Arrows showing outbound packets being rewritten and inbound packets being reverse-mapped. Character stands at the router box operating the translation table.",
        "labels": "私网地址, NAT映射表, 公网地址"
    },
    "Q24-cdn-design": {
        "reader_takeaway": "CDN caches content at edge nodes near users, reduces latency and origin load; uses DNS redirection and cache hierarchy",
        "objects": "1. A world map with small cache server icons scattered across continents (edge nodes). 2. A user icon in Asia requesting content, arrow going to the nearest edge node. 3. The edge node checking its cache: hit (fast return) or miss (arrow going up to parent node or origin). 4. An origin server icon on the far side. 5. A DNS globe icon redirecting requests to the closest edge. Character stands at the user location pointing at the nearby edge node.",
        "labels": "边缘节点, 源站, 缓存命中"
    },
    "Q25-load-balancing-algorithms": {
        "reader_takeaway": "Round-robin is simple but ignores load; least-connections balances active load; consistent hashing minimizes cache invalidation on node changes",
        "objects": "1. Three scale/balance icons side by side. Left: round-robin scale with requests evenly distributed but one side heavier (ignoring actual load). Middle: least-connections scale with connection count labels on each server. Right: consistent hash ring with server nodes placed on a circle and request keys mapped to the nearest server. 2. A server farm icon behind each scale. Character stands below comparing the three algorithms.",
        "labels": "轮询, 最小连接, 一致性哈希"
    },
    "Q26-network-latency": {
        "reader_takeaway": "Network latency accumulates at every hop: Wi-Fi, last-mile, backbone, inter-datacenter, each adding 5-50ms",
        "objects": "1. A left-to-right path showing network hops: phone → Wi-Fi router → ISP access → city backbone → inter-province → inter-country → server datacenter. 2. Each hop has a small latency label: 5ms, 10ms, 15ms, 30ms, 50ms, 80ms. 3. The total adds up at the far right. 4. A speedometer icon showing the cumulative delay. 5. A fiber cable icon for backbone and a satellite dish for inter-country. Character stands at the phone end watching the journey.",
        "labels": "Wi-Fi, 城域网, 骨干网, 跨洋"
    },
    "Q27-ipv4-vs-ipv6": {
        "reader_takeaway": "IPv4 address exhaustion drives IPv6 adoption, but dual-stack and NAT64 translation are needed during the transition",
        "objects": "1. Two address formats side by side: left shows a short IPv4 address 203.0.113.5, right shows a long IPv6 address 2001:db8::1. 2. A transition bridge icon in the middle showing dual-stack devices speaking both protocols. 3. A NAT64 gateway box translating between the two. 4. An exhaustion gauge showing IPv4 nearly empty and IPv6 nearly full. Character stands on the bridge looking at both sides.",
        "labels": "IPv4枯竭, 双栈过渡, IPv6充足"
    },
    "Q28-wifi-connected-no-internet": {
        "reader_takeaway": "Wi-Fi signal strength only measures radio link; internet access also requires DHCP IP assignment, gateway reachability, and DNS resolution",
        "objects": "1. A phone showing full Wi-Fi signal bars but a sad face icon. 2. A Wi-Fi router icon next to it with a green connection line. 3. A broken chain beyond the router: DHCP missing (no IP), gateway unreachable (red X), DNS failure (question mark). 4. A diagnostic checklist icon showing the four stages: radio link (check), IP assignment (X), gateway (X), DNS (X). Character stands holding the phone looking puzzled.",
        "labels": "信号满格, 无IP, 网关不通, DNS失败"
    },
    "Q29-p2p-file-distribution": {
        "reader_takeaway": "P2P splits files into chunks, peers download from multiple sources simultaneously, and DHT replaces central trackers for peer discovery",
        "objects": "1. A central file icon split into colored chunks (A, B, C, D). 2. Multiple peer icons around it, each holding some chunks and exchanging with neighbors. 3. Arrows showing chunk exchange between peers. 4. A DHT ring icon in the background for decentralized discovery. 5. A central tracker icon crossed out. Character stands in the middle coordinating the chunk exchange.",
        "labels": "文件分块, 多点下载, DHT去中心"
    },
}

def generate_image(name, scene):
    prompt = f"""{STYLE}

Reader takeaway: {scene['reader_takeaway']}

Draw these specific named objects from the source text: {scene['objects']}

sparse handwritten Chinese labels only, 2-5 labels total: {scene['labels']}; black text and black arrows only; no colored sticky notes, no label background fills, no colorful underlines; character keeps full reference colors; scene objects stay mostly black line art; soft blue as the main scene accent; soft orange for at most 2 small highlights only; blue fills on at most 1-4 key scene objects maximum; no English except product names

avoid equal-weight process diagrams unless the core idea is truly a process; avoid formal workflow chart or dense tutorial page; no colored sticky notes, no label background fills, no red-green diff color blocks; soft blue main scene accent; soft orange at most 2 small highlights only; no orange object fills or label backgrounds; NOT sunglasses instead of round glasses; NOT missing 臻叔 text on polo shirt; NOT dress pants instead of jeans; NOT sneakers instead of crocs; scene accent colors must NOT tint character clothing"""

    cmd = (
        f"cd {SKILL_DIR} && "
        f"http_proxy={PROXY} https_proxy={PROXY} "
        f"{PYTHON} scripts/generate_illustration.py image "
        f'--prompt "{prompt}" '
        f"--image-file assets/reference-character.png "
        f"--model gpt-image-2 "
        f"--size 16:9 "
        f"--resolution 2K"
    )

    print(f"\n{'='*60}")
    print(f"Generating: {name}")
    print(f"{'='*60}")

    result = subprocess.run(
        cmd, shell=True, capture_output=True, text=True, timeout=300
    )

    if result.returncode == 0:
        output_lines = result.stdout.strip().split('\n')
        for line in output_lines:
            if 'outputs/images/' in line and '.png' in line:
                src_path = line.strip().split()[-1]
                if os.path.exists(src_path):
                    dst_path = os.path.join(OUTPUT_DIR, f"{name}.png")
                    shutil.copy2(src_path, dst_path)
                    print(f"✅ Saved: {dst_path}")
                    return True
        images_dir = os.path.join(SKILL_DIR, "outputs", "images")
        if os.path.exists(images_dir):
            files = [f for f in os.listdir(images_dir) if f.endswith('.png')]
            if files:
                files.sort(key=lambda x: os.path.getmtime(os.path.join(images_dir, x)))
                latest = files[-1]
                src_path = os.path.join(images_dir, latest)
                dst_path = os.path.join(OUTPUT_DIR, f"{name}.png")
                shutil.copy2(src_path, dst_path)
                print(f"✅ Saved (latest): {dst_path}")
                return True
        print(f"⚠️ Image generated but couldn't find output file")
        return False
    else:
        print(f"❌ Failed: {name}")
        print(f"stderr: {result.stderr[-500:]}")
        return False

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    success = 0
    failed = 0
    failed_list = []

    for name, scene in SCENES.items():
        dst_path = os.path.join(OUTPUT_DIR, f"{name}.png")
        if os.path.exists(dst_path):
            print(f"⏭️ Skip (exists): {name}")
            success += 1
            continue

        ok = generate_image(name, scene)
        if ok:
            success += 1
        else:
            failed += 1
            failed_list.append(name)

        time.sleep(2)

    print(f"\n{'='*60}")
    print(f"DONE: {success} success, {failed} failed")
    if failed_list:
        print(f"Failed: {failed_list}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
