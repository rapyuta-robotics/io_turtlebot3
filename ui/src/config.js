export const WEBSOCKET_ENDPOINT = 'ws://10.91.1.118:9090';

export const ZETHUS_CONFIG = {
  "panels": {
    "sidebar": {
      "display": false
    }
  },
  "ros": {
    "endpoint": WEBSOCKET_ENDPOINT,
  },
  "visualizations": [
    {
      "vizType": "LaserScan",
      "topicName": "/scan",
      "messageType": "sensor_msgs/LaserScan",
      "name": "LaserScan",
      "visible": true,
      "key": "T3Y_rk7U"
    },
    {
      "vizType": "RobotModel",
      "topicName": "robot_description",
      "messageType": "",
      "name": "RobotModel",
      "packages": {
        "turtlebot3_description": "https://raw.githubusercontent.com/ROBOTIS-GIT/turtlebot3/master/turtlebot3_description"
      },
      "key": "_Bq0oQkA"
    },
    {
      "vizType": "Tf",
      "topicName": "/tf",
      "messageType": "tf2_msgs/TFMessage",
      "name": "Tf",
      "visible": true,
      "key": "VpC6DqBx"
    },
    {
      "vizType": "Odometry",
      "topicName": "/odom",
      "messageType": "nav_msgs/Odometry",
      "name": "Odometry",
      "keep": 10,
      "visible": true,
      "key": "4C0rmhGY"
    }
  ],
  "globalOptions": {
    "display": true,
    "backgroundColor": {
      "display": true,
      "value": "#000000"
    },
    "fixedFrame": {
      "display": true,
      "value": "odom"
    },
    "grid": {
      "display": true,
      "size": 30,
      "divisions": 30,
      "color": "#222222",
      "centerlineColor": "#333333"
    }
  },
  "tools": {
    "mode": "controls",
    "controls": {
      "display": false,
      "enabled": true
    },
    "measure": {
      "display": false
    },
    "custom": [
      {
        "name": "Nav goal",
        "type": "publishPose",
        "topic": "/navgoal"
      },
      {
        "name": "Nav goal",
        "type": "publishPoseWithCovariance",
        "topic": "initialpose"
      }
    ]
  }
};
