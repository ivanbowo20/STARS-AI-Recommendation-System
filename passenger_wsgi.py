import sys
import os

# Add current directory to the python path
sys.path.insert(0, os.path.dirname(__file__))

# Import the Flask application object as 'application' for Passenger WSGI
from api import app as application
