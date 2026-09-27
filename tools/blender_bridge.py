#!/usr/bin/env python3
"""
Blender Bridge Client for Doodle Strike
Communicates with the live Blender MCP socket on port 9876.
Allows inspecting the active scene, executing Python code, and exporting .glb assets.
"""

import sys
import os
import json
import socket
import argparse

DEFAULT_HOST = 'localhost'
DEFAULT_PORT = 9876

def send_blender_command(cmd_type, params=None, host=DEFAULT_HOST, port=DEFAULT_PORT, timeout=120.0):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(timeout)
    try:
        s.connect((host, port))
    except Exception as e:
        return {'status': 'error', 'message': f'Cannot connect to Blender on {host}:{port}. Is MCP for Blender started? Error: {e}'}

    payload = {
        'type': cmd_type,
        'params': params or {}
    }
    try:
        s.sendall(json.dumps(payload).encode('utf-8'))
        chunks = []
        while True:
            chunk = s.recv(8192)
            if not chunk:
                break
            chunks.append(chunk)
            data = b''.join(chunks)
            try:
                parsed = json.loads(data.decode('utf-8'))
                return parsed
            except json.JSONDecodeError:
                continue
        return {'status': 'error', 'message': 'Connection closed before full response received'}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}
    finally:
        s.close()

def execute_code(code_str):
    return send_blender_command('execute_code', {'code': code_str})

def get_scene_info():
    return send_blender_command('get_scene_info')

def export_glb(dest_path, export_selected=False):
    dest_abs = os.path.abspath(dest_path)
    os.makedirs(os.path.dirname(dest_abs), exist_ok=True)
    # Forward slashes for python in blender
    clean_path = dest_abs.replace('\\', '/')
    code = f"""
import bpy
bpy.ops.export_scene.gltf(
    filepath=r'{clean_path}',
    export_format='GLB',
    use_selection={'True' if export_selected else 'False'}
)
print('Exported GLB successfully to: {clean_path}')
"""
    return execute_code(code)

def clear_meshes():
    code = """
import bpy
bpy.ops.object.select_all(action='DESELECT')
for obj in list(bpy.data.objects):
    if obj.type == 'MESH':
        obj.select_set(True)
bpy.ops.object.delete()
print('Cleared all mesh objects from scene.')
"""
    return execute_code(code)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Blender Bridge for Doodle Strike')
    subparsers = parser.add_subparsers(dest='command')

    info_parser = subparsers.add_parser('info', help='Get Blender active scene info')
    clear_parser = subparsers.add_parser('clear', help='Clear all mesh objects from Blender scene')
    
    exec_parser = subparsers.add_parser('exec', help='Execute python code inside Blender')
    exec_parser.add_argument('code', type=str, help='Python code string')

    export_parser = subparsers.add_parser('export', help='Export scene as GLB')
    export_parser.add_argument('path', type=str, help='Output .glb filepath')
    export_parser.add_argument('--selected', action='store_true', help='Export selected objects only')

    args = parser.parse_args()

    if args.command == 'info':
        res = get_scene_info()
        print(json.dumps(res, indent=2))
    elif args.command == 'clear':
        res = clear_meshes()
        print(res.get('result', {}).get('result', res.get('message', '')))
    elif args.command == 'exec':
        res = execute_code(args.code)
        if res.get('status') == 'success':
            print(res.get('result', {}).get('result', 'Executed successfully'))
        else:
            print('ERROR:', res.get('message', 'Unknown error'))
    elif args.command == 'export':
        res = export_glb(args.path, args.selected)
        if res.get('status') == 'success':
            print(res.get('result', {}).get('result', f'Exported to {args.path}'))
        else:
            print('ERROR:', res.get('message', 'Unknown error'))
    else:
        parser.print_help()
