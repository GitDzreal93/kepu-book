#!/usr/bin/env python3
"""Generate extra structural diagrams for Q48 (HTTPS cert chain)."""
import subprocess, os, glob, time, shutil

SKILL_DIR = "/Users/dz/.workbuddy/skills/unclezhen-illustration-skills"
PYTHON = "/Users/dz/.workbuddy/binaries/python/envs/default/bin/python3"
PROXY = "http://127.0.0.1:7897"
OUT_DIR = "/Volumes/dz/code/kepu-book/images-new/chapter4"
os.makedirs(OUT_DIR, exist_ok=True)

STYLE = """Match character to reference image: same round glasses, round slightly chubby face, short black hair, polo shirt with 臻叔 text on chest, holding smartphone, blue jeans, crocs-style shoes with holes. Keep exact colors and proportions from the character reference; only outlines become sketchy.

A slightly chubby male character with a round face, round glasses, short black hair. Wears a polo shirt with 臻叔 text on the chest, blue jeans, and crocs-style shoes with holes. Holds a smartphone in one hand. Body proportions are slightly chibi (head-to-body ratio approximately 1:3). Friendly, approachable veteran tech community vibe.

quirky hand-drawn illustration, wobbly ink lines, expressive rough sketch, naive art style, black hand-drawn line structure for scene objects, soft blue as main scene accent color, soft orange on at most 2 small highlight touches (not object fills), blue local accent fills on at most 1-4 key scene objects; recognizable concrete objects connected by clear story flow arrows or path; multiple named objects allowed (typically 4-8) — hierarchy via size and line weight, not more color fills; changes shown with line marks not red-green color fills; white background, editorial doodle feeling, no photorealistic, no smooth vector, no 3D render, no PPT infographic, no gradient, no cute cartoon, no colored label backgrounds, no large color-filled shapes

subject occupies 50-75% of frame, at least 25% white space, preferably one continuous empty block, not filled edge to edge; whitespace does not mean fewer objects — allow 4-8 named objects when the message needs it; use size, line weight, and depth layering instead of color blocks to create hierarchy

aspect ratio 16:9, horizontal composition, landscape orientation, wide frame, NOT portrait, NOT square

sparse handwritten Chinese labels only, 2-5 labels total; black text and black arrows only; no colored sticky notes, no label background fills, no colorful underlines; character keeps full reference colors; scene objects stay mostly black line art; soft blue as the main scene accent; soft orange for at most 2 small highlights only; blue fills on at most 1-4 key scene objects maximum; no English except product names"""

EXTRA_SCENES = {
    "Q48-cert-structure": {
        "prompt_extra": """Reader takeaway: 证书链的三层结构：网站证书→中间CA→根CA

Draw these specific named objects: Three vertical certificate cards arranged left to right. Left card (largest, at bottom): "网站证书" with fields: 域名, 公钥, 有效期, 签发者(Intermediate CA), 签名(被中间CA私钥签). Middle card (medium): "中间CA证书" with fields: 名称, 公钥, 签发者(Root CA), 签名(被根CA私钥签). Right card (smallest, at top): "根CA证书" with fields: 名称, 公钥, 签发者(自签名), 签名(自己签自己). Arrows show signing direction: Root CA -> Intermediate CA -> Website cert. Character points at the three cards from the left.

sparse handwritten Chinese labels only, 2-5 labels total: 网站证书, 中间CA, 根CA, 签发链; black text and black arrows only; soft blue as the main scene accent; soft orange for at most 2 small highlights only""",
        "labels": "证书链三栏结构图"
    },
    "Q48-verify-flow": {
        "prompt_extra": """Reader takeaway: 浏览器验证证书的5步流程

Draw these specific named objects: A horizontal 5-step flow from left to right with big numbered circles (1-5). Step 1: Server sends cert chain. Step 2: Browser verifies website cert signature with Intermediate CA public key (checkmark). Step 3: Browser verifies Intermediate CA cert with Root CA public key (checkmark). Step 4: Browser checks Root CA in local trust store (green shield). Step 5: Extra checks (domain match, validity, revocation, purpose). Arrows connect each step. Character walks along the path holding a magnifying glass.

sparse handwritten Chinese labels only, 2-5 labels total: TLS握手, 验签, 信任检查, 额外校验; black text and black arrows only; soft blue as the main scene accent; soft orange for at most 2 small highlights only""",
        "labels": "浏览器验证5步流程图"
    },
    "Q48-ca-hierarchy": {
        "prompt_extra": """Reader takeaway: 根CA离线极少使用，中间CA在线日常签发，网站证书最下层

Draw these specific named objects: A tree/hierarchy diagram. At the top: a golden Root CA certificate in an offline safe/vault (labeled HSM, 极少使用). Below it, 3 Intermediate CA certificates branching out (labeled 在线, 日常签发). Each Intermediate CA has multiple Website certificates hanging below it (like leaves on a tree). Character points at the Root CA safe saying '最高机密'.

sparse handwritten Chinese labels only, 2-5 labels total: 根CA(离线), 中间CA(在线), 网站证书; black text and black arrows only; soft blue as the main scene accent; soft orange for at most 2 small highlights only""",
        "labels": "CA层级结构图"
    },
}

def generate(name, prompt_extra):
    out_path = os.path.join(OUT_DIR, f"{name}.png")
    if os.path.exists(out_path):
        print(f"⏭️  Skip (exists): {name}")
        return True

    print(f"\n{'='*60}")
    print(f"Generating: {name}")
    print(f"{'='*60}")

    prompt = f"""{STYLE}

{prompt_extra}"""

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
    for name, scene in EXTRA_SCENES.items():
        if generate(name, scene["prompt_extra"]):
            success += 1
        else:
            failed.append(name)
        time.sleep(1)
    print(f"\nDONE: {success} success, {len(failed)} failed")
    if failed:
        print(f"Failed: {failed}")
