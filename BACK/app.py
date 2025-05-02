from service import Service
from flask import Flask,jsonify,request,send_from_directory

app = Flask(__name__, static_folder='../FRONT', template_folder='../FRONT')

service = Service()

@app.route('/')
def serve_index():
    return send_from_directory('../FRONT', 'index.html')

@app.route('/<path:path>')
def serve_static_files(path):
    return send_from_directory('../FRONT', path)

@app.route('/api/stats', methods=['GET'])
def get_player():
    name = request.args.get('name')
    if not name:
        return jsonify({"error": "Player name is required"}), 400

    try:
        stats = service.get_stats(name)

        return jsonify({
            "rank": stats["Rank"],
            "kd": stats["KDA"],
            "rank_img" : stats["RankImg"],
            "win" : stats["Win"],
            "atk1" : stats["Atk"][0],
            "def" : stats["Def"],
            "atkimg":stats["AtkImg"],
            "defimg" : stats["DefImg"]
                        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/mates',methods=['GET'])
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