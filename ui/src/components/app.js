import React from 'react';
import ROSLIB from 'roslib';
import Zethus from 'zethus'
import _ from 'lodash';
import mousetrap from 'mousetrap';

import { ZETHUS_CONFIG, WEBSOCKET_ENDPOINT } from "../config";
import UpArrow from '../imgs/up.svg';
import DownArrow from '../imgs/down.svg';
import LeftArrow from '../imgs/left.svg';
import RightArrow from '../imgs/right.svg';

const MOUSE_KEYS = {
  UP: 'up',
  LEFT: 'left',
  DOWN: 'down',
  RIGHT: 'right',
};

const NULL_POSE = {
  linear : {
    x : 0.0,
    y : 0.0,
    z : 0.0
  },
  angular : {
    x : 0.0,
    y : 0.0,
    z : 0.0
  }
};

const getLinearX = (pressedKeys) => {
  if(_.includes(pressedKeys, MOUSE_KEYS.UP)) {
    return 1.0;
  }
  if(_.includes(pressedKeys, MOUSE_KEYS.DOWN)) {
    return -1.0;
  }
  return 0;
};

const getAngularZ = (pressedKeys) => {
  if(_.includes(pressedKeys, MOUSE_KEYS.LEFT)) {
    return 1.0;
  }
  if(_.includes(pressedKeys, MOUSE_KEYS.RIGHT)) {
    return -1.0;
  }
  return 0;
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.ros = new ROSLIB.Ros();
    this.cmdVel = new ROSLIB.Topic({
      ros : this.ros,
      name : '/cmd_vel',
      messageType : 'geometry_msgs/Twist'
    });

    this.publishEvent = null;
    this.pressedKeys = [];
    this.gamepads = {};

    this.publishTwistKeys = this.publishTwistKeys.bind(this);
    this.pressKey = this.pressKey.bind(this);
    this.leaveKey = this.leaveKey.bind(this);
    this.stop = this.stop.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
    this.publishJoystick = this.publishJoystick.bind(this);
  }

  componentDidMount() {
    this.ros.connect(WEBSOCKET_ENDPOINT);
    mousetrap.bind('up', () => this.pressKey(MOUSE_KEYS.UP), 'keydown');
    mousetrap.bind('down', () => this.pressKey(MOUSE_KEYS.DOWN), 'keydown');
    mousetrap.bind('left', () => this.pressKey(MOUSE_KEYS.LEFT), 'keydown');
    mousetrap.bind('right', () => this.pressKey(MOUSE_KEYS.RIGHT), 'keydown');
    mousetrap.bind('up', () => this.leaveKey(MOUSE_KEYS.UP), 'keyup');
    mousetrap.bind('down', () => this.leaveKey(MOUSE_KEYS.DOWN), 'keyup');
    mousetrap.bind('left', () => this.leaveKey(MOUSE_KEYS.LEFT), 'keyup');
    mousetrap.bind('right', () => this.leaveKey(MOUSE_KEYS.RIGHT), 'keyup');

    window.addEventListener("gamepadconnected", (e) => { this.gamepadHandler(e, true); }, false);
    window.addEventListener("gamepaddisconnected", (e) => { this.gamepadHandler(e, false); }, false);
  }

  pressKey(key) {
    this.pressedKeys = _.union(this.pressedKeys, [key]);
    this.publishTwistKeys();
  }

  leaveKey(key) {
    this.pressedKeys = _.filter(this.pressedKeys, k => k !== key);
  }

  gamepadHandler(event, connecting) {
    const gamepad = event.gamepad;

    if (connecting) {
      this.gamepads[gamepad.index] = gamepad;
      this.gameLoop();
    } else {
      delete this.gamepads[gamepad.index];
    }
  }

  gameLoop() {
    let gp;
    if(navigator.webkitGetGamepads) {
      gp = navigator.webkitGetGamepads()[0];
    } else {
      gp = navigator.getGamepads()[0];
    }
    if(_.some(gp.axes, v => Math.abs(v) > 0.01)) {
      const [right, bottom] = gp.axes;
      this.publishJoystick(-bottom, right)
    } else {
      this.publishJoystick(0, 0);
    }
    requestAnimationFrame(this.gameLoop);
  }

  publishTwistKeys() {
    if(_.size(this.pressedKeys) > 0) {
      this.cmdVel.publish(new ROSLIB.Message({
        linear : {
          x : getLinearX(this.pressedKeys),
          y : 0.0,
          z : 0.0
        },
        angular : {
          x : 0.0,
          y : 0.0,
          z : getAngularZ(this.pressedKeys)
        }
      }));
      setTimeout(this.publishTwistKeys, 10);
    } else {
      this.cmdVel.publish(new ROSLIB.Message(NULL_POSE));
    }
  }

  publishJoystick(x, z) {
    this.cmdVel.publish(new ROSLIB.Message({
      linear : {
        x : x,
        y : 0.0,
        z : 0.0
      },
      angular : {
        x : 0.0,
        y : 0.0,
        z : z
      }
    }));
  }

  stop() {
    this.cmdVel.publish(new ROSLIB.Message(NULL_POSE));
  }

  render() {
    return (
      <div id="appWrapper" className="flex">
        <div id="leftbar">
          <h3>Turtlebot Teleop</h3>
          <button onClick={this.stop} id="emergencyStop">Emergency Stop</button>
          <div className="arrowRow">
            <button className="arrowButton" onMouseDown={() => this.pressKey(MOUSE_KEYS.UP)} onMouseUp={() => this.leaveKey(MOUSE_KEYS.UP)}>
              <img src={UpArrow} alt="" />
            </button>
          </div>
          <div className="arrowRow">
            <button className="arrowButton" onMouseDown={() => this.pressKey(MOUSE_KEYS.LEFT)} onMouseUp={() => this.leaveKey(MOUSE_KEYS.LEFT)}>
              <img src={LeftArrow} alt="" />
            </button>
            <button className="arrowButton" onMouseDown={() => this.pressKey(MOUSE_KEYS.DOWN)} onMouseUp={() => this.leaveKey(MOUSE_KEYS.DOWN)}>
              <img src={DownArrow} alt="" />
            </button>
            <button className="arrowButton" onMouseDown={() => this.pressKey(MOUSE_KEYS.RIGHT)} onMouseUp={() => this.leaveKey(MOUSE_KEYS.RIGHT)}>
              <img src={RightArrow} alt="" />
            </button>
          </div>
        </div>
        <Zethus configuration={ZETHUS_CONFIG} />
      </div>
    );
  }
}

export default App;
