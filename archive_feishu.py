#!/usr/bin/env python3
"""归档飞书 Wiki 上每个章节的旧文档。"""

import subprocess, json, os, sys, time

SPACE_ID = "7664033649636936668"
CHAPTERS = {
    "chapter1": "Jop2wrh9sigqMwktc29cFisHnOg",
    "chapter2": "Vievw4i7gifhAekQcx1cHKo2nwb",
    "chapter3": "DJmYw76ALiLufakJ3dvc63jNnpe",
    "chapter4": "GFhhwFjFYiBS2BkHnO4ckM1lnyg",
    "chapter6": "W8xtwYKA8ibD7ekoJ66cgKdCnTc",
    "chapter7": "LrElwyuisidGjfkkmQncWzTunue",
}

ENV = os.environ.copy()
ENV["LARKSUITE_CLI_NO_UPDATE_NOTIFIER"] = "1"
ENV["LARKSUITE_CLI_NO_SKILLS_NOTIFIER"] = "1"
ENV["LARK_CLI_NO_PROXY_WARN"] = "1"


def run_lark(args):
    result = subprocess.run(["lark-cli"] + args + ["--format", "json", "--as", "user"],
                          capture_output=True, text=True, timeout=60, env=ENV)
    # Find JSON block in output (may span multiple lines)
    output = result.stdout.strip()
    # Try parsing entire output first
    if output.startswith("{"):
        try: return json.loads(output)
        except: pass
    # Find the JSON block by locating matching braces
    start = output.find("\n{")
    if start == -1:
        start = output.find("{")
    else:
        start += 1
    if start >= 0:
        # Find matching closing brace
        depth = 0
        end = start
        for i in range(start, len(output)):
            if output[i] == "{":
                depth += 1
            elif output[i] == "}":
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break
        json_str = output[start:end]
        try: return json.loads(json_str)
        except: pass
    return {"ok": False}


def list_nodes(parent_token):
    """List child nodes under a parent token."""
    result = run_lark(["wiki", "+node-list", "--space-id", SPACE_ID,
                       "--parent-node-token", parent_token])
    if result.get("ok"):
        return result.get("data", {}).get("nodes", [])
    return []


def create_archive(parent_token):
    """Create '归档' node under parent."""
    result = run_lark(["wiki", "+node-create", "--space-id", SPACE_ID,
                       "--parent-node-token", parent_token, "--title", "归档"])
    if result.get("ok"):
        return result.get("data", {}).get("node_token", "")
    # If already exists, find it
    nodes = list_nodes(parent_token)
    for n in nodes:
        if n.get("title") == "归档":
            return n.get("node_token", "")
    return ""


def move_node(node_token, target_parent):
    """Move a wiki node to a new parent."""
    result = run_lark(["wiki", "+move", "--node-token", node_token,
                       "--target-parent-token", target_parent])
    return result.get("ok", False)


for ch_name, ch_token in CHAPTERS.items():
    print(f"\n=== {ch_name} ===")
    
    # Create archive
    archive_token = create_archive(ch_token)
    if not archive_token:
        print(f"  FAIL: Could not create/find archive node")
        continue
    print(f"  Archive node: {archive_token}")
    
    # List old docs
    old_nodes = list_nodes(ch_token)
    to_move = [n for n in old_nodes if n.get("title") != "归档"]
    print(f"  Old docs to archive: {len(to_move)}")
    
    for node in to_move:
        title = node.get("title", "?")
        ntoken = node.get("node_token", "")
        print(f"  Moving: {title}...", end=" ")
        ok = move_node(ntoken, archive_token)
        print("OK" if ok else "FAIL")
        time.sleep(1)

print("\n=== Archive complete! ===")
