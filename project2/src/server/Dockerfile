FROM gcc:latest

RUN apt-get update && apt-get install -y \
    build-essential \
    g++ \
    cmake \
    libgtest-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Build Google Test manually
RUN cd /usr/src/gtest && cmake . && make && \
    cp lib/*.a /usr/lib

COPY . /usr/src

WORKDIR /usr/src

RUN g++ -std=c++17 -o server main.cpp server.cpp storage.cpp command_processor.cpp blacklist.cpp bloom_filter.cpp HashUtils.cpp -pthread

# יצירת תיקיית מידע אם צריך
RUN mkdir -p /app/data

# הגדרת תיקיית העבודה להפעלה
WORKDIR /usr/src

# הפעלת הבינארי
CMD ["./server", "8080"]


