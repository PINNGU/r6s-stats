from service import Service
from flask import Flask,jsonify,request,send_from_directory
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman

app = Flask(__name__, static_folder='../FRONT', template_folder='../FRONT')
limiter = Limiter(get_remote_address,app=app)
csp = {
    'default-src': [
        '\'self\''
    ],
    'style-src': [ 
        '\'self\'',
        '\'unsafe-inline\'',
        'https://fonts.googleapis.com',
        'https://cdn.jsdelivr.net'  
    ],
    'font-src': [
        '\'self\'',
        'https://fonts.gstatic.com'
    ],
    'img-src': [
        '\'self\'',
        'data:',
        'https://your-image-cdn.com'
    ],
    'script-src': [
        '\'self\'',
        '\'unsafe-inline\'',
        'https://cdn.jsdelivr.net'
    ]
}

Talisman(app, content_security_policy=csp)

service = Service()

@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({
        "error":"Rate limit exceeded. Please try again later."
    }),429


@app.route('/')
def serve_index():
    return send_from_directory('../FRONT', 'index.html')

@app.route('/<path:path>')
def serve_static_files(path):
    return send_from_directory('../FRONT', path)

@app.route('/api/matches',methods=['GET'])
@limiter.limit("5 per minute")
def get_matches():
    name = request.args.get('name')
    if not name:
        return jsonify({"error": "Player name is required"}), 400
    else:
        try:
            matches,matches_mmr,check = service.get_matches(name)
            print(matches,matches_mmr)

            return jsonify(
                {
                    "matches":matches,
                    "matches_mmr":matches_mmr,
                    "check" : check
                }
            )
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@app.route('/api/vids',methods=['GET'])
@limiter.limit("5 per minute")
def get_vids():
    try:
        vids = service.get_all_vids()
    
        return jsonify(
            {
                "vids":vids
            }
        )
                          
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/stats', methods=['GET'])
@limiter.limit("5 per minute")
def get_player():
    name = request.args.get('name')
    if not name:
        return jsonify({"error": "Player name is required"}), 400

    try:
        stats = service.get_stats(name)

        return jsonify({
            "rank": stats["Rank"],
            "kd": stats["KDA"],
            "rankcolor" : stats["RankColor"],
            "rank_img" : stats["RankImg"],
            "win" : stats["Win"],
            "kills":stats["Kills/Game"],
            "matches":stats["Matches"],
            "mmr":stats["MMR"],
            "playtime":stats["Playtime"],
            "check":stats["Check"]
                        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/ops',methods=['GET'])
@limiter.limit("5 per minute")
def get_ops():
    name = request.args.get('name')
    if not name:
        return jsonify({"error": "Player name is required"}), 400
    
    try:
        stats = service.get_ops(name)
        print(stats)
        return jsonify({
            "atk1" : stats["Atk"][0],
            "atk2": stats["Atk"][1],
            "atk3":stats["Atk"][2],
            "def1" : stats["Def"][0],
            "def2":stats["Def"][1],
            "def3":stats["Def"][2],
            "atkimg":stats["AtkImg"],
            "defimg" : stats["DefImg"],
            "check" :stats["Check"],
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/mates',methods=['GET'])
@limiter.limit("5 per minute")
def get_mates():
    name = request.args.get('name')
    if not name:
        return jsonify({"error": "Player name is required"}), 400

    try:
        MATES = service.get_teammates(name)

        return jsonify({
                "mate1":MATES[0],
                "mate2":MATES[1],
                "mate3":MATES[2],
                "mate4":MATES[3],
                        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    

if __name__ == '__main__':
    app.run(debug=True)