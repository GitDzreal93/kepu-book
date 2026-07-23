#!/usr/bin/env python3
"""Batch generate illustrations for Chapter 3 (Q31-Q45) using APIMart + zhenshu character."""

import subprocess
import os
import sys
import time
import shutil

SKILL_DIR = "/Users/dz/.workbuddy/skills/unclezhen-illustration-skills"
PYTHON = "/Users/dz/.workbuddy/binaries/python/envs/default/bin/python3"
OUTPUT_DIR = "/Volumes/dz/code/kepu-book/images-new/chapter3"
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
    "Q31-login-system": {
        "reader_takeaway": "Large-scale login uses centralized session storage (Redis), SSO with OAuth2/OIDC, and multi-factor authentication",
        "objects": "1. A user icon on the left entering username and password. 2. A load balancer icon distributing to multiple service instances (A, B, C). 3. A Redis cluster icon in the center storing session tokens. 4. An SSO gateway icon with OAuth2 arrows. 5. A phone icon showing SMS/OTP code for 2FA. 6. A token badge showing JWT structure. Character stands at bottom-left guiding the login flow.",
        "labels": "用户登录, Redis会话, SSO单点, 双因素认证"
    },
    "Q32-ota-upgrade": {
        "reader_takeaway": "OTA upgrade uses A/B partition scheme, delta updates, signature verification, and rollback on failure",
        "objects": "1. A smartphone icon showing current system A. 2. A download arrow pulling a new firmware package from a cloud server. 3. Two partition boxes: system A (current, active) and system B (downloading, standby). 4. A signature verification shield with checkmark. 5. A rollback arrow pointing back to system A. 6. A progress bar showing download and installation stages. Character stands holding the phone watching the upgrade.",
        "labels": "A/B分区, 差分升级, 签名验证, 回滚机制"
    },
    "Q33-device-shadow": {
        "reader_takeaway": "Device shadow maintains desired and reported states, decoupling device connectivity from application control",
        "objects": "1. A smart home hub icon in the center labeled device shadow. 2. Two state boxes on the hub: desired state (what app wants) and reported state (what device reports). 3. A smart lightbulb icon on the left syncing its state to the hub. 4. A mobile app icon on the right reading and writing desired state. 5. A sync arrow between desired and reported when they match. 6. An offline cloud icon showing the device can reconnect and sync later. Character stands between the app and device coordinating the shadow.",
        "labels": "期望状态, 上报状态, 设备离线, 影子同步"
    },
    "Q34-seckill-defense": {
        "reader_takeaway": "Seckill system uses four defense layers: static CDN, dynamic rate limiting, Redis stock pre-deduction, and async order processing via MQ",
        "objects": "1. Four defensive wall layers stacked from top to bottom. Layer 1: CDN cache wall. Layer 2: token bucket rate limiter with traffic meter. Layer 3: Redis counter with DECR operation showing stock deduction. Layer 4: Kafka message queue with async processing. 2. User requests flowing from top, most blocked at early layers, few reaching the database at bottom. 3. A sold-out sign at the end. Character stands at top watching requests being filtered.",
        "labels": "CDN缓存, 限流令牌桶, Redis预扣, MQ异步"
    },
    "Q35-kafka-design": {
        "reader_takeaway": "Kafka uses partition-based log storage, zero-copy producer, consumer groups for parallel consumption, and replication for fault tolerance",
        "objects": "1. A topic labeled user-events splitting into three partition lanes. 2. Each partition as a log file with messages ordered by offset. 3. A producer icon on the left appending to partitions. 4. Multiple consumer icons on the right in a consumer group, each reading from different partitions. 5. A replication chain showing leader and follower brokers. 6. A zero-copy shortcut arrow bypassing user space. Character stands at the producer side sending messages into the pipeline.",
        "labels": "Topic分区, 消费者组, Leader副本, 零拷贝"
    },
    "Q36-cache-problems": {
        "reader_takeaway": "Cache penetration hits non-existent keys, cache breakdown hits expired hot keys, cache avalanche hits many keys expiring together",
        "objects": "1. Three attack scenarios side by side. Left cache penetration: a battering ram hitting a cache with a hole (non-existent key), arrow passing through to the database. Middle cache breakdown: a single hot key with fire icon expiring, flood of requests hitting the database. Right cache avalanche: many keys with timer icons expiring simultaneously, tsunami wave hitting the database. 2. Defense shields: bloom filter for penetration, mutex lock for breakdown, random TTL for avalanche. Character stands behind the defenses protecting the database.",
        "labels": "缓存穿透, 缓存击穿, 缓存雪崩"
    },
    "Q37-redis-fast": {
        "reader_takeaway": "Redis is fast because it runs in memory, uses single-threaded event loop avoiding context switches, and has optimized data structures",
        "objects": "1. A memory chip icon labeled RAM at center, blazing fast with speed lines. 2. A single worker icon labeled single-threaded event loop processing requests in order. 3. A crossed-out context switch icon showing what is avoided. 4. Optimized data structure icons: a skip list, a hash table, a zip list. 5. An epoll/network icon showing efficient I/O multiplexing. Character stands next to the memory chip giving a thumbs up.",
        "labels": "内存操作, 单线程, 高效数据结构"
    },
    "Q38-sharding": {
        "reader_takeaway": "Database sharding splits by range or hash; cross-shard queries need aggregation; global ordering and pagination become complex",
        "objects": "1. A large database cylinder on the left labeled before. 2. Arrows splitting it into multiple smaller database cylinders on the right labeled shard 1, shard 2, shard 3. 3. A routing table icon showing which shard holds which data range. 4. A JOIN puzzle with broken pieces showing cross-shard query difficulty. 5. A pagination icon with question mark showing ordering challenges. Character stands between the big and small databases with a splitting tool.",
        "labels": "垂直拆分, 水平分片, 路由表, 跨片查询"
    },
    "Q39-id-generator": {
        "reader_takeaway": "Distributed ID generators use Snowflake (timestamp + machine ID + sequence), database segment allocation, or UUID; each trades uniqueness for performance",
        "objects": "1. A 64-bit bar at top showing Snowflake segments: 41-bit timestamp, 10-bit machine ID, 12-bit sequence. 2. A clock icon for timestamp. 3. A server rack icon for machine ID. 4. A counter icon for sequence number. 5. Three ID cards below comparing approaches: Snowflake (ordered, fast), UUID (random, no coordination), DB segment (batch allocation). Character stands pointing at the Snowflake structure.",
        "labels": "时间戳, 机器ID, 序列号, Snowflake"
    },
    "Q40-microservice-vs-monolith": {
        "reader_takeaway": "Monolith is simpler for small teams; microservices enable independent deployment but add network latency, distributed transactions, and operational complexity",
        "objects": "1. A single large building on the left labeled monolith: compact, one door, internal modules connected. 2. A cluster of small buildings on the right labeled microservices: many doors, external connections between them, some with warning signs (latency, timeout, circuit breaker). 3. A team size gauge: small team arrow pointing to monolith, large team arrow pointing to microservices. 4. A complexity curve showing microservices complexity grows faster with scale. Character stands between the two architectures comparing them.",
        "labels": "单体架构, 微服务, 复杂度曲线"
    },
    "Q41-payment-idempotency": {
        "reader_takeaway": "Payment idempotency uses unique keys and idempotency tables; reconciliation matches system records with bank statements daily",
        "objects": "1. A payment button being pressed twice by a user. 2. An idempotency table icon checking if the key exists: first press processes, second press returns cached result. 3. A daily reconciliation clock showing two ledgers being compared: system ledger and bank ledger. 4. Mismatch icons showing unreconciled transactions being flagged. 5. A money transfer arrow with a retry loop. Character stands at the payment terminal ensuring no double charge.",
        "labels": "幂等键, 防重表, 日终对账"
    },
    "Q42-config-center": {
        "reader_takeaway": "Configuration center pushes changes to clients in real-time; FeatureFlags enable gradual rollouts and A/B testing without deployment",
        "objects": "1. A central config server icon with a gear. 2. Multiple client app icons connected by push notification arrows. 3. A feature flag switch panel showing toggles: new_feature=ON for 10% users. 4. An A/B test split showing two user groups getting different experiences. 5. A rollback arrow showing instant reversion. Character stands at the config panel flipping switches.",
        "labels": "配置中心, 实时推送, FeatureFlag, 灰度发布"
    },
    "Q43-distributed-transaction": {
        "reader_takeaway": "2PC blocks and is not fault-tolerant; Saga uses compensating transactions; TCC provides better consistency with try-confirm-cancel phases",
        "objects": "1. Three transaction pattern diagrams side by side. Left 2PC: a coordinator asking all participants to prepare, then commit, with blocking wait. Middle Saga: a step chain with forward arrows and backward compensation arrows when a step fails. Right TCC: three-phase boxes (Try, Confirm, Cancel) with reservation semantics. 2. A consistency-availability scale below each. Character stands below comparing the three approaches.",
        "labels": "2PC两阶段, Saga补偿, TCC三阶段"
    },
    "Q44-api-gateway": {
        "reader_takeaway": "API gateway handles authentication, rate limiting, routing, protocol translation, and logging as a unified entry point",
        "objects": "1. A gateway arch icon in the center labeled API Gateway. 2. Filter chain icons passing through the gateway: auth filter, rate limit filter, routing filter, logging filter. 3. Backend service icons behind the gateway: user service, order service, payment service. 4. An external client icon on the left sending requests. 5. A circuit breaker icon showing fallback when backend fails. Character stands at the gateway controlling traffic flow.",
        "labels": "认证, 限流, 路由, 熔断降级"
    },
    "Q45-hot-update": {
        "reader_takeaway": "Hot update replaces runtime scripts/assets without app store review; requires signature verification, version diff, and rollback on failure",
        "objects": "1. A mobile app icon with two layers: native layer (frozen, cannot change) and script layer (hot-swappable). 2. An update server icon pushing a script patch. 3. A signature verification shield. 4. A diff/patch icon showing only changed files being downloaded. 5. A version rollback arrow. 6. An app store icon with a red X showing bypassing review. Character stands updating the script layer while the native layer stays intact.",
        "labels": "原生层, 脚本层, 差量更新, 签名验证"
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
