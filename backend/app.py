import os
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from functools import wraps
import jwt
import datetime
import json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://deal-cost-calculator.netlify.app", "http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "expose_headers": ["Content-Type", "Authorization"],
        "supports_credentials": False
    }
})

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')

CONFIG_FILE = os.path.join(os.path.dirname(__file__), 'config.json')
DEFAULT_CONFIG = {
    "sections": [
        {
            "id": "hardware",
            "title": "Hardware",
            "items": [
                {"id": "switchboard", "name": "Switchboard", "cost": 3000, "quantity": 0, "locked": True},
                {"id": "desktop-phone", "name": "Desktop Phone", "cost": 1200, "quantity": 0, "locked": True},
                {"id": "cordless-phone", "name": "Cordless Phone", "cost": 1500, "quantity": 0, "locked": True},
                {"id": "mobile-apps", "name": "Mobile Apps", "cost": 500, "quantity": 0, "locked": True},
                {"id": "additional-hardware", "name": "Additional Hardware", "cost": 2000, "quantity": 0}
            ]
        },
        {
            "id": "connectivity",
            "title": "Connectivity",
            "items": [
                {"id": "vodacom-lte", "name": "Vodacom LTE", "cost": 489, "quantity": 0},
                {"id": "fiber-line", "name": "Fiber Line", "cost": 699, "quantity": 0}
            ]
        },
        {
            "id": "licensing",
            "title": "Licensing",
            "items": [
                {"id": "basic-license", "name": "Basic License", "cost": 49, "quantity": 0},
                {"id": "premium-license", "name": "Premium License", "cost": 89, "quantity": 0}
            ]
        }
    ],
    "factors": {
        "36_months": {
            "0%": {
                "0-20000": 0.03891,
                "20001-50000": 0.03761,
                "50001-100000": 0.03641,
                "100000+": 0.03561
            },
            "10%": {
                "0-20000": 0.04012,
                "20001-50000": 0.03882,
                "50001-100000": 0.03762,
                "100000+": 0.03682
            },
            "15%": {
                "0-20000": 0.04133,
                "20001-50000": 0.04003,
                "50001-100000": 0.03883,
                "100000+": 0.03803
            }
        },
        "48_months": {
            "0%": {
                "0-20000": 0.03133,
                "20001-50000": 0.03003,
                "50001-100000": 0.02883,
                "100000+": 0.02803
            },
            "10%": {
                "0-20000": 0.03254,
                "20001-50000": 0.03124,
                "50001-100000": 0.03004,
                "100000+": 0.02924
            },
            "15%": {
                "0-20000": 0.03375,
                "20001-50000": 0.03245,
                "50001-100000": 0.03125,
                "100000+": 0.03045
            }
        },
        "60_months": {
            "0%": {
                "0-20000": 0.02695,
                "20001-50000": 0.02565,
                "50001-100000": 0.02445,
                "100000+": 0.02365
            },
            "10%": {
                "0-20000": 0.02816,
                "20001-50000": 0.02686,
                "50001-100000": 0.02566,
                "100000+": 0.02486
            },
            "15%": {
                "0-20000": 0.02937,
                "20001-50000": 0.02807,
                "50001-100000": 0.02687,
                "100000+": 0.02607
            }
        }
    },
    "scales": {
        "installation": {
            "0-4": 2500,
            "5-8": 3500,
            "9-16": 4500,
            "17-32": 6000,
            "33+": 7500
        },
        "finance_fee": {
            "0-20000": 750,
            "20001-50000": 1500,
            "50001+": 2500
        },
        "gross_profit": {
            "0-4": 15,
            "5-8": 20,
            "9-16": 25,
            "17-32": 30,
            "33+": 35
        }
    }
}

def load_config():
    try:
        if os.path.exists(CONFIG_FILE):
            with open(CONFIG_FILE, 'r') as f:
                config = json.load(f)
                # Ensure all required sections exist
                if 'factors' not in config:
                    config['factors'] = DEFAULT_CONFIG['factors']
                if 'scales' not in config:
                    config['scales'] = DEFAULT_CONFIG['scales']
                return config
        return DEFAULT_CONFIG
    except Exception as e:
        print(f"Error loading config: {str(e)}")
        return DEFAULT_CONFIG

def save_config(config):
    try:
        # Create backup
        if os.path.exists(CONFIG_FILE):
            backup_file = CONFIG_FILE + '.backup'
            try:
                with open(CONFIG_FILE, 'r') as src, open(backup_file, 'w') as dst:
                    dst.write(src.read())
            except Exception as e:
                print(f"Warning: Could not create backup: {str(e)}")

        # Ensure the directory exists
        os.makedirs(os.path.dirname(CONFIG_FILE), exist_ok=True)
        
        # Save with proper permissions
        with open(CONFIG_FILE, 'w') as f:
            json.dump(config, f, indent=2)
            f.flush()
            os.fsync(f.fileno())
        
        # Set file permissions to be writable
        os.chmod(CONFIG_FILE, 0o666)
        
        print(f"Config saved successfully to {CONFIG_FILE}")
        return True
    except Exception as e:
        print(f"Error saving config: {str(e)}")
        raise

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(*args, **kwargs)
    return decorated

@app.route('/api/admin/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400
            
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'message': 'Username and password are required'}), 400
        
        if username == 'Camryn' and password == 'Elliot':
            token = jwt.encode({
                'user': username,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, app.config['SECRET_KEY'], algorithm='HS256')
            
            if isinstance(token, bytes):
                token = token.decode('utf-8')
                
            return jsonify({'token': token})
        
        return jsonify({'message': 'Invalid credentials'}), 401
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'message': 'Server error occurred'}), 500

@app.route('/api/admin/items', methods=['GET'])
@require_auth
def get_items():
    try:
        config = load_config()
        return jsonify(config['sections'])
    except Exception as e:
        print(f"Error getting items: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/items', methods=['POST'])
@require_auth
def update_items():
    try:
        data = request.json
        if not data or 'sections' not in data:
            return jsonify({'error': 'Invalid data format'}), 400
            
        config = load_config()
        config['sections'] = data['sections']
        
        if save_config(config):
            print("Items updated and saved successfully")
            return jsonify({'message': 'Items updated successfully'})
        else:
            return jsonify({'error': 'Failed to save configuration'}), 500
    except Exception as e:
        print(f"Error updating items: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/factors', methods=['GET'])
@require_auth
def get_factors():
    try:
        config = load_config()
        return jsonify(config['factors'])
    except Exception as e:
        print(f"Error getting factors: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/factors', methods=['POST'])
@require_auth
def update_factors():
    try:
        data = request.json
        if not data or not isinstance(data, dict):
            return jsonify({'error': 'Invalid data format'}), 400
            
        config = load_config()
        config['factors'] = data
        
        if save_config(config):
            print("Factors updated and saved successfully")
            return jsonify({'message': 'Factors updated successfully'})
        else:
            return jsonify({'error': 'Failed to save configuration'}), 500
    except Exception as e:
        print(f"Error updating factors: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/scales', methods=['GET'])
@require_auth
def get_scales():
    try:
        config = load_config()
        return jsonify(config['scales'])
    except Exception as e:
        print(f"Error getting scales: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/scales', methods=['POST'])
@require_auth
def update_scales():
    try:
        data = request.json
        if not data or not isinstance(data, dict):
            return jsonify({'error': 'Invalid data format'}), 400
            
        config = load_config()
        config['scales'] = data
        
        if save_config(config):
            print("Scales updated and saved successfully")
            return jsonify({'message': 'Scales updated successfully'})
        else:
            return jsonify({'error': 'Failed to save configuration'}), 500
    except Exception as e:
        print(f"Error updating scales: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    allowed_origins = ["https://deal-cost-calculator.netlify.app", "http://localhost:5173"]
    
    if origin in allowed_origins:
        response.headers.add('Access-Control-Allow-Origin', origin)
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'false')
    return response

if __name__ == '__main__':
    # Load config at startup to ensure it exists
    config = load_config()
    print("Config loaded successfully")
    app.run(debug=True)
