# node-csv-image-parser

## Overview

This Node.js application interacts with a MongoDB database and provides a set of APIs for handling CSV file uploads. The CSV files contain links to product images along with other product details. Upon uploading, the application saves the product data to the database and compresses the image quality by 50% and returns the compressed output image URLs in a separate API.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Technologies Used](#technologies-used)
- [Postman Collection](#postman-collection)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.x or later) installed on your machine.
- npm (v6.x or later) or yarn installed.
- A running instance of MongoDB. You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB server.
- [Git](https://git-scm.com/) installed (optional, but recommended).

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/paragbnsal/node-csv-image-parser.git
   cd node-csv-image-parser
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

## Environment Setup

**Create a .env file**:
In the root directory of the project, create a `.env` file to store your environment variables. At a minimum, you need to specify your MongoDB connection string and PORT. Sample .env file is added below

API_PORT=5001<br/>
MONGO_URI=mongodb://your-username:your-password@your-mongodb-host:your-mongodb-port/your-database-name

## Running the Application

To start the application, run the following command in the root directory:

```bash
npm start
```

This command will start the Node.js server and connect to the MongoDB instance using the connection string provided in the .env file.

## Technologies Used

- Node.js: JavaScript runtime environment.
- Express.js: Web framework for Node.js.
- MongoDB: NoSQL database for storing application data.
- Mongoose: ODM (Object Data Modeling) library for MongoDB and Node.js.

## Postman Collection

[Publicly accessible link](https://documenter.getpostman.com/view/16494406/2sAXjM3BP1) of a Postman Collection for testing the APIs.