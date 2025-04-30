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
            "rank_img" : stats["RankImg"]
                        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    

if __name__ == '__main__':
    app.run(debug=True)