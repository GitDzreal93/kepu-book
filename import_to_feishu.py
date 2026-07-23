#!/usr/bin/env python3
"""批量将 kepu-book 文章导入飞书 Wiki 知识库。

工作流程：
1. 导入本地 .md 文件到飞书云盘（转为 docx）
2. 将 docx 移入对应章节的 Wiki 节点
"""

import subprocess
import json
import time
import sys
import os

SPACE_ID = "7664033649636936668"

# Wiki 章节节点映射
CHAPTER_TOKENS = {
    "chapter1": "Jop2wrh9sigqMwktc29cFisHnOg",  # 第一章 系统基石
    "chapter2": "Vievw4i7gifhAekQcx1cHKo2nwb",  # 第二章 网络协议
    "chapter3": "DJmYw76ALiLufakJ3dvc63jNnpe",  # 第三章 架构设计
    "chapter4": "GFhhwFjFYiBS2BkHnO4ckM1lnyg",  # 第四章 安全攻防
    "chapter5": "QAU2wr3Gaih0UgkU86xcWJSsnng",  # 第五章 工程实践
    "chapter6": "W8xtwYKA8ibD7ekoJ66cgKdCnTc",  # 第六章 分布式系统
    "chapter7": "LrElwyuisidGjfkkmQncWzTunue",  # 第七章 算法与智能
}

ARTICLES_DIR = "/Volumes/dz/code/kepu-book/articles"
ENV = os.environ.copy()
ENV["LARKSUITE_CLI_NO_UPDATE_NOTIFIER"] = "1"
ENV["LARKSUITE_CLI_NO_SKILLS_NOTIFIER"] = "1"
ENV["LARK_CLI_NO_PROXY_WARN"] = "1"


def run_lark(args, timeout=120):
    """Run lark-cli command and return parsed JSON."""
    cmd = ["lark-cli"] + args + ["--format", "json", "--as", "user"]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, env=ENV)
    output = result.stdout.strip() if result.stdout else ""
    if output:
        try:
            return json.loads(output)
        except json.JSONDecodeError:
            pass
    # Try finding JSON in stderr
    err_output = result.stderr.strip() if result.stderr else ""
    if err_output.startswith("{"):
        try:
            return json.loads(err_output)
        except json.JSONDecodeError:
            pass
    return {"ok": False, "error": {"message": f"no json output. stdout={len(result.stdout)} bytes, stderr={len(result.stderr)} bytes"}}


def import_to_drive(md_path, article_name):
    """Import a .md file to Feishu Drive as docx."""
    print(f"  Importing: {article_name}...", end=" ", flush=True)
    result = run_lark([
        "drive", "+import",
        "--type", "docx",
        "--file", md_path,
        "--name", article_name,
    ])
    if result.get("ok"):
        token = result.get("data", {}).get("token", "")
        print(f"OK (token={token[:20]}...)")
        return token
    else:
        err = result.get("error", {})
        print(f"FAIL: {err.get('message', '?')}")
        return None


def move_to_wiki(doc_token, chapter, article_name):
    """Move a Drive docx to a wiki chapter node."""
    parent_token = CHAPTER_TOKENS.get(chapter)
    if not parent_token:
        print(f"  Unknown chapter: {chapter}")
        return False
    
    result = run_lark([
        "wiki", "+move",
        "--obj-token", doc_token,
        "--obj-type", "docx",
        "--target-space-id", SPACE_ID,
        "--target-parent-token", parent_token,
    ])
    if result.get("ok"):
        node_token = result.get("data", {}).get("node_token", "")
        print(f"    → Wiki OK ({article_name})")
        return True
    else:
        err = result.get("error", {})
        print(f"    → Wiki FAIL: {err.get('message', '?')}")
        return False


def process_article(md_path, chapter, article_name):
    """Process one article: import + move to wiki."""
    doc_token = import_to_drive(md_path, article_name)
    if not doc_token:
        return False
    time.sleep(1)  # rate limit buffer
    return move_to_wiki(doc_token, chapter, article_name)


def main():
    if len(sys.argv) > 1:
        # Process specific chapters
        chapters = sys.argv[1:]
    else:
        chapters = sorted(CHAPTER_TOKENS.keys())
    
    stats = {"success": 0, "fail": 0, "skip": 0}
    
    for chapter in chapters:
        chapter_dir = os.path.join(ARTICLES_DIR, chapter)
        if not os.path.isdir(chapter_dir):
            print(f"SKIP: {chapter_dir} not found")
            continue
        
        files = sorted([f for f in os.listdir(chapter_dir) if f.endswith(".md")])
        print(f"\n{'='*60}")
        print(f"Chapter: {chapter} ({len(files)} articles)")
        print(f"{'='*60}")
        
        for f in files:
            md_path = os.path.join(chapter_dir, f)
            article_name = f[:-3]  # remove .md
            
            # Sanitize name - remove problematic chars for Feishu
            article_name = article_name.strip()
            
            print(f"[{stats['success']+stats['fail']+1}/{len(files)}] ", end="")
            if process_article(md_path, chapter, article_name):
                stats["success"] += 1
            else:
                stats["fail"] += 1
            time.sleep(2)  # rate limit between articles
    
    print(f"\n{'='*60}")
    print(f"Done! Success: {stats['success']}, Fail: {stats['fail']}, Skip: {stats['skip']}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
