import sys
import os
import importlib.util

# Add parent directory to sys.path so we can import root api.py safely
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

# Safely import api.py from the root directory to avoid module naming conflicts with 'api' folder
spec = importlib.util.spec_from_file_location("root_api", os.path.join(parent_dir, "api.py"))
root_api = importlib.util.module_from_spec(spec)
spec.loader.exec_module(root_api)

# Expose the Flask 'app' object for Vercel
app = root_api.app
