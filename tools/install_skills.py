#!/usr/bin/env python3
"""
Installer for skills from sickn33/agentic-awesome-skills into .agents/skills/
"""

import os
import sys
import json
import urllib.request

REPO_API_BASE = 'https://api.github.com/repos/sickn33/agentic-awesome-skills/contents'
RAW_BASE = 'https://raw.githubusercontent.com/sickn33/agentic-awesome-skills/main'
SKILLS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '.agents', 'skills'))

# SANCTUARY PROTECTION
PROTECTED_SKILLS = {'doodle-strike-architect'}

def fetch_json(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def download_file(raw_url, dest_path):
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    req = urllib.request.Request(raw_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        content = resp.read()
    with open(dest_path, 'wb') as f:
        f.write(content)

def install_skill_recursive(repo_path, target_dir):
    items = fetch_json(f'{REPO_API_BASE}/{repo_path}')
    for item in items:
        item_name = item['name']
        if item['type'] == 'file':
            dest_file = os.path.join(target_dir, item_name)
            raw_url = f'{RAW_BASE}/{repo_path}/{item_name}'
            print(f'   -> Downloading: {item_name}')
            download_file(raw_url, dest_file)
        elif item['type'] == 'dir':
            sub_repo_path = f'{repo_path}/{item_name}'
            sub_target_dir = os.path.join(target_dir, item_name)
            install_skill_recursive(sub_repo_path, sub_target_dir)

def install_skill(skill_id, repo_path):
    if skill_id in PROTECTED_SKILLS:
        raise ValueError(f'CRITICAL: {skill_id} is protected under SANCTUARY immutability.')

    target_dir = os.path.join(SKILLS_DIR, skill_id)
    print(f'\n📦 Installing [{skill_id}] from {repo_path} to {target_dir}...')
    os.makedirs(target_dir, exist_ok=True)
    install_skill_recursive(repo_path, target_dir)
    print(f'✅ Successfully installed [{skill_id}]!')

SKILLS_TO_INSTALL = [
    ('game-art', 'skills/game-development/game-art'),
    ('3d-games', 'skills/game-development/3d-games'),
    ('game-design', 'skills/game-development/game-design'),
    ('design-spatial', 'skills/design-spatial'),
    ('lookdev', 'skills/lookdev'),
    ('threejs-loaders', 'skills/threejs-loaders'),
    ('threejs-geometry', 'skills/threejs-geometry'),
    ('threejs-lighting', 'skills/threejs-lighting'),
    ('threejs-shaders', 'skills/threejs-shaders'),
    ('shader-programming-glsl', 'skills/shader-programming-glsl'),
    ('design-philosophy', 'skills/design-philosophy'),
]

if __name__ == '__main__':
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')

    print(f'Starting skill installation from sickn33/agentic-awesome-skills...')
    print(f'Target directory: {SKILLS_DIR}')
    print(f'Total skills to install: {len(SKILLS_TO_INSTALL)}')

    for skill_id, repo_path in SKILLS_TO_INSTALL:
        try:
            install_skill(skill_id, repo_path)
        except Exception as e:
            print(f'❌ Error installing {skill_id}: {e}')

    print('\n🎉 All selected skills installed successfully!')
