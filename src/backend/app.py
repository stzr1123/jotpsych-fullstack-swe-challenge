from cryptography.fernet import Fernet
from flask import Flask, request, jsonify, session, g
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from packaging import version

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

encryption_key = Fernet.generate_key()
cipher = Fernet(encryption_key)


def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
    app.config['SECRET_KEY'] = 'secret123'
    app.config['JWT_SECRET_KEY'] = 'secret1234'

    CORS(
        app,
        resources={r"/*": {"origins": ["http://localhost:5173"]}},
        supports_credentials=True
    )

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    @app.before_request
    def check_app_version():
        client_version = request.headers.get('app-version')
        if client_version and version.parse(client_version) < version.parse("1.2.0"):
            return jsonify({'message': 'Please update your client application'}), 426

    with app.app_context():
        db.create_all()

    @app.route('/')
    def index():
        return jsonify({'status': 200})

    @app.route('/register', methods=['POST'])
    def register():
        data = request.get_json()
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        encrypted_motto = cipher.encrypt(data.get('motto', '').encode()).decode()
        new_user = User(
            username=data['username'],
            password=hashed_password,
            motto=encrypted_motto,
            profile_picture=data.get('profile_picture', '')
        )
        db.session.add(new_user)
        db.session.commit()
        access_token = create_access_token(identity={'username': new_user.username})
        session['token'] = access_token
        return jsonify({'message': 'User registered successfully', 'token': access_token}), 201

    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if user and bcrypt.check_password_hash(user.password, data['password']):
            access_token = create_access_token(identity={'username': user.username})
            session['token'] = access_token
            return jsonify({'token': access_token}), 200
        return jsonify({'message': 'Invalid credentials'}), 401

    @app.route('/user', methods=['GET'])
    @jwt_required()
    def user():
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user['username']).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        decrypted_motto = cipher.decrypt(user.motto.encode()).decode() if user.motto else ''
        return jsonify({
            'id': user.id,
            'username': user.username,
            'motto': decrypted_motto,
            'profile_picture': user.profile_picture
        }), 200

    @app.route('/token', methods=['GET'])
    def get_token():
        token = session.get('token')
        if not token:
            return jsonify({'message': 'No token found'}), 404
        return jsonify({'token': token}), 200

    return app


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    motto = db.Column(db.String(250), nullable=True)
    profile_picture = db.Column(db.String(250), nullable=True)


if __name__ == '__main__':
    app = create_app()
    app.run(port=3002, debug=True)
