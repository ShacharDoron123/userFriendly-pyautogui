from flask import Flask, request, jsonify
from flask_cors import CORS
import pyautogui

app = Flask(__name__)
CORS(app)
cord = []
@app.route('/send', methods=['POST'])
def receive_coordinates():
    data = request.get_json()
    x = data.get('x')
    y = data.get('y')
    task = data.get('task')

    print(f"Got coordinates: X={x}, Y={y}")

    if(pyautogui.onScreen(x, y)):
         cord.append({'x': x, 'y': y, 'task': task})
    else:
        print("e")
    
    return jsonify({"status": "ok", "x": x, "y": y})

@app.route('/execute', methods=['POST'])
def execute_tasks():
    for item in cord:
        task = item['task']
        x = item['x']
        y = item['y']
        if task == "moveTo":
            pyautogui.moveTo(x, y, duration=3)
    print("Executed all tasks!")
    cord.clear()  
    return jsonify({"status": "done"})  
if __name__ == '__main__':
    app.run(debug=True, port=5000)

