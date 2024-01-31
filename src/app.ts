import express from 'express';
import dotenv from 'dotenv';
import { loggerMiddleware } from './config/logger';
import { db } from './config';
import { signup, login } from './controller/authController';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Use bodyParser middleware to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
app.use(loggerMiddleware);

// Route and Url confirmation example
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Call the route
app.post('/auth/signup', signup);
app.post('/auth/login', login);

const startServer = async () => {
    try {
        await db.authenticate(); // Use authenticate instead of sync
        console.log('Database is connected');
        //await db.sync({ force: true });
        await db.sync(); 

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
};

startServer();
