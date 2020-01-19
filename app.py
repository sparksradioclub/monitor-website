#!/usr/bin/env python3
import eventlet
import os
from flask import Flask, render_template
from flask_mqtt import Mqtt
from flask_socketio import SocketIO

eventlet.monkey_patch()

app = Flask(__name__)
app.config['MQTT_BROKER_URL'] = os.environ["MQTT_BROKER_URL"]
app.config['MQTT_BROKER_PORT'] = int(os.environ["MQTT_BROKER_PORT"])
app.config['MQTT_REFRESH_TIME'] = 1.0
app.config['MQTT_USERNAME'] = os.environ["MQTT_USERNAME"]
app.config['MQTT_PASSWORD'] = os.environ["MQTT_PASSWORD"]

mqtt = Mqtt(app)
socketio = SocketIO(app)

@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    print(os.environ["MQTT_BROKER_URL"])
    mqtt.subscribe('#')

@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
    data = dict(
        topic=message.topic,
        payload=message.payload.decode()
    )
    # emit a mqtt_message event to the socket containing the message data
    socketio.emit('mqtt_all', data=data)

@app.route('/')
def index():
    return render_template('index.html')

@mqtt.on_log()
def handle_logging(client, userdata, level, buf):
    print(level, buf)



if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, use_reloader=False, debug=True)