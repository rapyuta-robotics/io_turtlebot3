FROM ros:melodic

ENV ROS_PYTHON_VERSION=3

RUN apt-get update && apt-get install -y python-catkin-tools python-pip

COPY . /catkin/src

WORKDIR /catkin

RUN catkin init &&\
	rosdep update &&\
	find -L src -type f -name "*.rosinstall" -exec wstool merge -t src {} \; &&\
	wstool up -t src --continue-on-error --abort-changed-uris &&\
	rosdep install --reinstall --from-paths src --ignore-src -y &&\
	pip install git+git://github.com/rapyuta-robotics/autobahn-python@py2_backport future

RUN bash -c "source /opt/ros/melodic/setup.bash && catkin build"




