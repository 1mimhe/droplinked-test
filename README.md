## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** v22+ ([Download](https://nodejs.org/))
- **MongoDB** v8+ ([Download](https://hub.docker.com/_/mongo))

#### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/1mimhe/droplinked-test
cd droplinked-test

# Install dependencies
npm install
```

#### 2. Configure Environment
Create a `.env.development` file in the root directory:

```env
# Application
PORT=3000 # Optional

# MongoDB Connection
MONGODB_URI=mongodb://root:password@localhost:27017/droplineked-test?authSource=admin
```

#### 3. Start MongoDB
```bash
# Using Docker (I prefer)
docker run -d \
  --name my-mongo \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest

# Using MongoDB locally
mongod
```

#### 4. Run the Application
```bash
# Development mode
npm run start:dev
```

#### 5. Access the API Documentation
- **At**: `http://localhost:3000/api/docs`
