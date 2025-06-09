cmake_minimum_required(VERSION 3.10)
project(BloomFilterServerTestsOnly)

set(CMAKE_CXX_STANDARD 17)

# כל הקבצים נמצאים באותה תיקייה (src)
include_directories(${CMAKE_SOURCE_DIR}/src/server)

find_package(GTest REQUIRED)
include_directories(${GTEST_INCLUDE_DIRS})

enable_testing()

# CommandProcessor test
add_executable(command_processor_test
    ../../tests/command_processor_test.cpp
    command_processor.cpp
    storage.cpp
    bloom_filter.cpp
    HashUtils.cpp
    blacklist.cpp
)
target_link_libraries(command_processor_test GTest::GTest GTest::Main pthread)
add_test(NAME CommandProcessorTest COMMAND command_processor_test)

# Server test
add_executable(server_test
    ../../tests/server_test.cpp
    server.cpp
    command_processor.cpp
    storage.cpp
    bloom_filter.cpp
    HashUtils.cpp
    blacklist.cpp
)
target_link_libraries(server_test GTest::GTest GTest::Main pthread)
add_test(NAME ServerTest COMMAND server_test)

# Build main server application
add_executable(server
    main.cpp
    server.cpp
    command_processor.cpp
    storage.cpp
    bloom_filter.cpp
    HashUtils.cpp
    blacklist.cpp
)




