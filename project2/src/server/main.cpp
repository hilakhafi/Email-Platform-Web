#include <iostream>
#include <vector>
#include <string>
#include "bloom_filter.h"
#include "blacklist.h"
#include "HashUtils.h"
#include "storage.h"
#include "server.h"   
#include <sstream>
#include <functional>
#include "command_processor.h"
#include <memory>
#include <regex>
using namespace std;

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << "Usage: " << argv[0] << " <port>" << endl;
        return 1;
    }

    const int server_port = atoi(argv[1]);
    
    // Make sure data directory exists
    system("mkdir -p ./data");

    // start the server 
    start(server_port);

    return 0;
}