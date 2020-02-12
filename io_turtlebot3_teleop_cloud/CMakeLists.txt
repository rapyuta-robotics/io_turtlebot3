cmake_minimum_required(VERSION 2.8.3)
project(turtlebot3_teleop_cloud)

##################
## Dependencies ##
##################

find_package(catkin REQUIRED)

add_custom_target( ui ALL
    COMMAND ./scripts/build.sh
    WORKING_DIRECTORY  ${CMAKE_CURRENT_SOURCE_DIR}
)

############
## catkin ##
############

catkin_package()

#############
## Install ##
#############

install(DIRECTORY launch
        DESTINATION ${CATKIN_PACKAGE_SHARE_DESTINATION}
)

install(PROGRAMS scripts/start.sh
    DESTINATION ${CATKIN_PACKAGE_SHARE_DESTINATION}/scripts
)