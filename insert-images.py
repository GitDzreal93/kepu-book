# 配图映射表：每篇文章对应的图片文件名
image_map = {
    # 第一章
    "Q1 ·": "q01-boot-process.png",
    "Q2 ·": "q02-jvm-startup.png",
    "Q3 ·": "q03-process-thread-coroutine.png",
    "Q4 ·": "q04-syscall-zerocopy.png",
    "Q5 ·": "q05-virtual-memory.png",
    "Q6 ·": "q06-array-bounds.png",
    "Q7 ·": "q07-float-precision.png",
    "Q8 ·": "q08-cpu-vs-redis-cache.png",
    "Q9 ·": "q09-ssd-write-amplification.png",
    "Q10 ·": "q10-race-condition.png",
    "Q11 ·": "q11-64bit-memory-limit.png",
    "Q12 ·": "q12-gc-evolution.png",
    "Q13 ·": "q13-keyboard-chain.png",
    "Q14 ·": "q14-endianness.png",
    "Q15 ·": "q15-gpio-memory-map.png",
    # 第二章
    "Q16 ·": "q16-tcp-handshake.png",
    "Q17 ·": "q17-dns-resolution.png",
    "Q18 ·": "q18-cdn-architecture.png",
    "Q19 ·": "q19-tls-handshake.png",
    "Q20 ·": "q20-websocket-upgrade.png",
    "Q21 ·": "q21-nat-translation.png",
    "Q22 ·": "q22-p2p-hole-punching.png",
    "Q23 ·": "q23-quic-vs-tcp.png",
    "Q24 ·": "q24-tcp-congestion.png",
    "Q25 ·": "q25-http-cache.png",
    "Q26 ·": "q26-load-balancer.png",
    "Q27 ·": "q27-dns-hijacking.png",
    "Q28 ·": "q28-keepalive.png",
    "Q29 ·": "q29-network-partition.png",
    # 第三章
    "Q30 ·": "q30-short-url.png",
    "Q31 ·": "q31-login-system.png",
    "Q32 ·": "q32-ota-upgrade.png",
    "Q33 ·": "q33-device-shadow.png",
    "Q34 ·": "q34-seckill.png",
    "Q35 ·": "q35-kafka.png",
    "Q36 ·": "q36-cache.png",
    "Q37 ·": "q37-redis-single-thread.png",
    "Q38 ·": "q38-sharding.png",
    "Q39 ·": "q39-id-generation.png",
    "Q40 ·": "q40-microservices.png",
    "Q41 ·": "q41-idempotent-payment.png",
    "Q42 ·": "q42-config-center.png",
    "Q43 ·": "q43-distributed-transaction.png",
    "Q44 ·": "q44-api-gateway.png",
    "Q45 ·": "q45-hot-update.png",
}

import os
base = "/Users/leiwen/WorkBuddy/kepu"
files = [
    "第1章_系统基石-01.md", "第1章_系统基石-02.md", "第1章_系统基石-03.md", "第1章_系统基石-04.md",
    "第2章_网络协议-01.md", "第2章_网络协议-02.md",
    "第3章_架构设计-01.md", "第3章_架构设计-02.md", "第3章_架构设计-03.md",
]
for fname in files:
    fpath = os.path.join(base, fname)
    with open(fpath, 'r') as f:
        lines = f.readlines()

    # 确定章节目录
    if "第1章" in fname:
        chapter_dir = "images/chapter1"
    elif "第2章" in fname:
        chapter_dir = "images/chapter2"
    elif "第3章" in fname:
        chapter_dir = "images/chapter3"
    else:
        chapter_dir = "images"

    # 先移除已有的配图引用行，避免重复插入
    filtered_lines = [line for line in lines if not line.startswith("![配图](images/chapter")]

    new_lines = []
    for i, line in enumerate(filtered_lines):
        new_lines.append(line)
        if line.startswith("## Q") and " · " in line:
            for key, img in image_map.items():
                if line.startswith(f"## {key}"):
                    new_lines.append(f"\n![配图]({chapter_dir}/{img})\n\n")
                    break

    with open(fpath, 'w') as f:
        f.writelines(new_lines)
    print(f"OK: {fname}")

print("All done!")
