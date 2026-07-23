#!/usr/bin/env python3
"""Batch generate illustrations for Chapter 1 (Q1-Q15) using APIMart + zhenshu character."""

import subprocess
import os
import sys
import time

SKILL_DIR = "/Users/dz/.workbuddy/skills/unclezhen-illustration-skills"
PYTHON = "/Users/dz/.workbuddy/binaries/python/envs/default/bin/python3"
OUTPUT_DIR = "/Volumes/dz/code/kepu-book/images-new/chapter1"
PROXY = "http://127.0.0.1:7897"

# Standard style template
STYLE = """Match character to reference image: same round glasses, round slightly chubby face, short black hair, polo shirt with 臻叔 text on chest, holding smartphone, blue jeans, crocs-style shoes with holes. Keep exact colors and proportions from the character reference; only outlines become sketchy.

A slightly chubby male character with a round face, round glasses, short black hair. Wears a polo shirt with 臻叔 text on the chest, blue jeans, and crocs-style shoes with holes. Holds a smartphone in one hand. Body proportions are slightly chibi (head-to-body ratio approximately 1:3). Friendly, approachable veteran tech community vibe.

quirky hand-drawn illustration, wobbly ink lines, expressive rough sketch, naive art style, black hand-drawn line structure for scene objects, soft blue as main scene accent color, soft orange on at most 2 small highlight touches (not object fills), blue local accent fills on at most 1-4 key scene objects; recognizable concrete objects connected by clear story flow arrows or path; multiple named objects allowed (typically 4-8) — hierarchy via size and line weight, not more color fills; changes shown with line marks not red-green color fills; white background, editorial doodle feeling, no photorealistic, no smooth vector, no 3D render, no PPT infographic, no gradient, no cute cartoon, no colored label backgrounds, no large color-filled shapes

subject occupies 50-75% of frame, at least 25% white space, preferably one continuous empty block, not filled edge to edge; whitespace does not mean fewer objects — allow 4-8 named objects when the message needs it; use size, line weight, and depth layering instead of color blocks to create hierarchy

IMPORTANT style adaptation for character: Keep ALL identity anchors (clothing, accessories, colors, proportions) exactly as defined in the IP file and reference images. Only change outline quality to wobbly sketch; do NOT change colors, proportions, or outfit items. Scene soft-blue and soft-orange accents apply to OBJECTS ONLY — must NOT tint, replace, or bleed into character clothing or accessories.

aspect ratio 16:9, horizontal composition, landscape orientation, wide frame, NOT portrait, NOT square

sparse handwritten Chinese labels only, 2-5 labels total; black text and black arrows only; no colored sticky notes, no label background fills, no colorful underlines; character keeps full reference colors; scene objects stay mostly black line art; soft blue as the main scene accent; soft orange for at most 2 small highlights only; blue fills on at most 1-4 key scene objects maximum; no English except product names

avoid equal-weight process diagrams unless the core idea is truly a process; avoid formal workflow chart or dense tutorial page; no colored sticky notes, no label background fills, no red-green diff color blocks; soft blue main scene accent; soft orange at most 2 small highlights only; no orange object fills or label backgrounds; NOT sunglasses instead of round glasses; NOT missing 臻叔 text on polo shirt; NOT dress pants instead of jeans; NOT sneakers instead of crocs; scene accent colors must NOT tint character clothing"""

# Scene descriptions for each article
SCENES = {
    "Q01-boot-process": {
        "reader_takeaway": "Boot is a 4-stage relay: BIOS POST → Bootloader loads kernel → Kernel initializes → systemd starts services",
        "objects": "1. A power button icon on the far left. 2. A magnifying glass inspecting a small chip labeled BIOS/UEFI (representing POST hardware check). 3. A boot device (hard drive) with an arrow to a small loader box labeled Bootloader. 4. A gear-shaped kernel box in the center with smaller gears inside (representing subsystems: memory, scheduler, VFS). 5. A service manager box on the right with multiple small service icons branching out. 6. A desktop monitor icon at the far right. Clear left-to-right flow with arrows. Character stands at bottom-left pointing at the flow.",
        "labels": "BIOS自检, 加载内核, 内核初始化, 启动服务"
    },
    "Q02-jvm-startup": {
        "reader_takeaway": "JVM startup is a 6-step pipeline: create process → init JVM → class loading → bytecode verify → execute main → println to screen",
        "objects": "1. A terminal window icon on the left showing 'java HelloWorld'. 2. A JVM box with a coffee cup logo. 3. A stack of .class file boxes labeled ClassLoader with arrows pulling from rt.jar. 4. A checkmark shield icon labeled bytecode verifier. 5. A code execution box with a flame icon (representing JIT hotspot). 6. A terminal output box on the right showing 'hello world'. Left-to-right pipeline flow. Character stands at bottom pointing at the JIT step.",
        "labels": "类加载, 字节码验证, JIT编译, 输出"
    },
    "Q03-process-thread-coroutine": {
        "reader_takeaway": "Process is heaviest (isolated), thread is medium (shared memory), coroutine is lightest (user-space scheduling)",
        "objects": "1. Three containers side by side from large to small: a big house (process, with fence), a medium apartment (thread, shared walls), a tiny capsule (coroutine, lightweight). 2. Inside the house: one person working alone. 3. Inside the apartment: multiple people sharing a table with lock icons. 4. Inside the capsule: many tiny figures with a scheduler antenna. Character stands below comparing the three with hand gestures.",
        "labels": "进程, 线程, 协程"
    },
    "Q04-syscall-zerocopy": {
        "reader_takeaway": "A read() syscall crosses user-kernel boundary twice; zero-copy (sendfile) skips the user space entirely",
        "objects": "1. A horizontal line dividing the frame: top half labeled user space, bottom half labeled kernel space. 2. A data packet traveling from disk (left) through kernel space, up to user space, back down to kernel, out to network (right) — traditional path with curved arrows. 3. A straight shortcut arrow from disk directly to network staying in kernel space — zero copy path. 4. A customs checkpoint icon at the boundary (representing context switch). Character stands at the boundary pointing at the shortcut.",
        "labels": "用户态, 内核态, 零拷贝"
    },
    "Q05-virtual-memory": {
        "reader_takeaway": "Virtual address is translated to physical address via page table; TLB caches translations; page fault triggers disk load",
        "objects": "1. A virtual address bar on the left split into colored segments (PGD/PUD/PMD/PTE/Offset). 2. Four lookup boxes in a chain representing 4-level page table walk. 3. A small fast cache box labeled TLB with a checkmark (hit) and X (miss). 4. A physical memory grid on the right. 5. A disk icon at bottom with a dashed arrow going up (page fault loading). Character stands at bottom-left holding the virtual address bar.",
        "labels": "虚拟地址, 页表, TLB, 物理内存"
    },
    "Q06-array-bounds": {
        "reader_takeaway": "Java checks bounds with metadata, Go inserts compile-time checks, C has no check at all",
        "objects": "1. Three array boxes side by side: left has a length tag and a checkmark shield (Java). Middle has a compiler inserting check instructions (Go). Right has just raw memory cells with no protection (C). 2. An arrow pointing past the array boundary into unknown memory (C version). 3. A bug icon near the C array. Character stands below comparing the three approaches.",
        "labels": "Java检查, Go检查, C无检查"
    },
    "Q07-float-precision": {
        "reader_takeaway": "0.1+0.2 does not equal 0.3 in IEEE 754; financial systems use integer cents or BigDecimal",
        "objects": "1. A calculator display showing '0.1 + 0.2 = 0.30000000000000004'. 2. A binary representation bar showing 0.0001100110011... (repeating). 3. A split path: left path shows BigDecimal (precise, slow), right path shows integer cents (fast, exact). 4. A coin/money icon near the integer path. Character stands at the split pointing at the integer path.",
        "labels": "浮点误差, BigDecimal, 整数分"
    },
    "Q08-cpu-vs-redis-cache": {
        "reader_takeaway": "CPU cache is hardware-transparent and not programmable; Redis cache is software-controlled and explicit",
        "objects": "1. Two layers stacked: top layer is a CPU chip with L1/L2/L3 cache boxes inside (labeled transparent, hardware). Bottom layer is a Redis box with TTL knobs and eviction strategy switches (labeled controllable, software). 2. A lock icon on the CPU cache (cannot modify). 3. A gear/wrench icon on the Redis cache (can configure). Character stands between the two layers comparing them.",
        "labels": "CPU缓存(透明), Redis缓存(可控)"
    },
    "Q09-ssd-write-amplification": {
        "reader_takeaway": "SSD cannot overwrite in place; GC moves valid data and erases blocks, causing write amplification",
        "objects": "1. A grid of memory cells (blocks and pages). 2. Some cells marked as stale (X). 3. A recycling/GC machine picking up valid cells from a block and moving them to a new block. 4. An eraser icon wiping the old block clean. 5. A multiplier label showing 1GB written = 3GB physical. Character stands at bottom watching the GC process.",
        "labels": "写入放大, GC回收, 擦除块"
    },
    "Q10-race-condition": {
        "reader_takeaway": "counter++ is read-add-write, not atomic; CAS retries on conflict; LOCK XADDQ is single atomic instruction",
        "objects": "1. A counter box showing value 5. 2. Two thread figures (A and B) both reading 5 from the box. 3. Both computing 6. 4. Thread A writing 6, then thread B also writing 6 (overwriting). Result shows 6 instead of 7. 5. A CAS shield icon checking values before write. 6. A LOCK padlock icon on a single instruction. Character stands at bottom pointing at the lost update.",
        "labels": "丢失更新, CAS重试, LOCK原子指令"
    },
    "Q11-64bit-memory-limit": {
        "reader_takeaway": "64-bit theoretical max is 16EB but actual limit is set by the smallest link: address bus, DIMM slots, memory density",
        "objects": "1. A large funnel on the left labeled 16EB (theoretical). 2. The funnel narrows through several stages: CPU address bus, memory controller, DIMM slots, memory chip density. 3. A small output at the bottom showing 192GB (actual). 4. Each narrowing stage has a label. Character stands at the bottom holding the small result.",
        "labels": "理论16EB, 地址总线, 插槽数, 实际192GB"
    },
    "Q12-gc-evolution": {
        "reader_takeaway": "GC evolved: mark-sweep (fragmented) → copying (wastes 50%) → G1 (region-based) → ZGC (concurrent, sub-ms pause)",
        "objects": "1. Four boxes in a left-to-right evolution chain. 2. First box: scattered memory cells with gaps (mark-sweep, fragmented). 3. Second box: two halves, one full one empty (copying). 4. Third box: grid of regions, some highlighted (G1). 5. Fourth box: memory with colored pointers and a stopwatch showing 0.1ms (ZGC). Arrows between boxes showing evolution. Character stands at the right end pointing at ZGC.",
        "labels": "标记清除, 标记复制, G1分区, ZGC并发"
    },
    "Q13-keyboard-chain": {
        "reader_takeaway": "A keypress travels through 6 stages: mechanical → USB → interrupt → kernel driver → application → graphics rendering",
        "objects": "1. A keyboard key icon on the far left. 2. A USB cable symbol. 3. A lightning bolt (interrupt). 4. A gear (kernel driver). 5. An application window icon. 6. A monitor showing the letter 'a' on the far right. Clear left-to-right signal flow with arrows. Character stands at bottom-left pressing the key.",
        "labels": "机械触发, USB传输, 硬件中断, 内核驱动, 应用处理, 图形渲染"
    },
    "Q14-endianness": {
        "reader_takeaway": "Big endian stores most significant byte first (network order); little endian stores least significant byte first (x86)",
        "objects": "1. Two rows of 4 memory cells each, showing the number 0x12345678. 2. Top row labeled Big Endian: cells show 12, 34, 56, 78 (left to right). 3. Bottom row labeled Little Endian: cells show 78, 56, 34, 12 (left to right). 4. A network cable icon near big endian, a CPU chip icon near little endian. Character stands between the two rows comparing them.",
        "labels": "大端(网络序), 小端(x86)"
    },
    "Q15-gpio-memory-map": {
        "reader_takeaway": "GPIO registers are memory-mapped to physical addresses; mmap() maps them to user space; writing to the address controls hardware",
        "objects": "1. A physical address space bar on the left with a highlighted section labeled GPIO registers at 0x3F200000. 2. An mmap arrow connecting physical address to user space virtual address. 3. A Python code snippet box showing GPIO.output(17, HIGH). 4. An LED bulb icon on the right that lights up. 5. A dashed boundary line between user space and kernel space. Character stands at bottom writing Python code.",
        "labels": "物理地址, mmap映射, GPIO寄存器, LED"
    },
}

def generate_image(name, scene):
    """Generate one illustration."""
    prompt = f"""{STYLE}

Reader takeaway: {scene['reader_takeaway']}

Draw these specific named objects from the source text: {scene['objects']}

sparse handwritten Chinese labels only, 2-5 labels total: {scene['labels']}; black text and black arrows only; no colored sticky notes, no label background fills, no colorful underlines; character keeps full reference colors; scene objects stay mostly black line art; soft blue as the main scene accent; soft orange for at most 2 small highlights only; blue fills on at most 1-4 key scene objects maximum; no English except product names

avoid equal-weight process diagrams unless the core idea is truly a process; avoid formal workflow chart or dense tutorial page; no colored sticky notes, no label background fills, no red-green diff color blocks; soft blue main scene accent; soft orange at most 2 small highlights only; no orange object fills or label backgrounds; NOT sunglasses instead of round glasses; NOT missing 臻叔 text on polo shirt; NOT dress pants instead of jeans; NOT sneakers instead of crocs; scene accent colors must NOT tint character clothing"""

    cmd = (
        f"cd {SKILL_DIR} && "
        f"http_proxy={PROXY} https_proxy={PROXY} "
        f"{PYTHON} scripts/generate_illustration.py image "
        f"--prompt \"{prompt}\" "
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
        # Find the output image
        output_lines = result.stdout.strip().split('\n')
        for line in output_lines:
            if 'outputs/images/' in line and '.png' in line:
                src_path = line.strip().split()[-1]
                if os.path.exists(src_path):
                    dst_path = os.path.join(OUTPUT_DIR, f"{name}.png")
                    import shutil
                    shutil.copy2(src_path, dst_path)
                    print(f"✅ Saved: {dst_path}")
                    return True
        # Try to find the latest image
        images_dir = os.path.join(SKILL_DIR, "outputs", "images")
        if os.path.exists(images_dir):
            files = [f for f in os.listdir(images_dir) if f.endswith('.png')]
            if files:
                files.sort(key=lambda x: os.path.getmtime(os.path.join(images_dir, x)))
                latest = files[-1]
                src_path = os.path.join(images_dir, latest)
                dst_path = os.path.join(OUTPUT_DIR, f"{name}.png")
                import shutil
                shutil.copy2(src_path, dst_path)
                print(f"✅ Saved (latest): {dst_path}")
                return True
        print(f"⚠️ Image generated but couldn't find output file")
        print(f"stdout: {result.stdout[-500:]}")
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
        # Skip if already exists
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

        # Small delay between requests
        time.sleep(2)

    print(f"\n{'='*60}")
    print(f"DONE: {success} success, {failed} failed")
    if failed_list:
        print(f"Failed: {failed_list}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
