int create_listening_socket(int port);

int accept_client(int server_sock);

void handle_client(int client_sock);

void cleanup(int sock);

int start(int server_port);