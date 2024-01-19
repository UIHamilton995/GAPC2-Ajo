import express from 'express';
import dotenv from 'dotenv';
import { loggerMiddleware } from './config/logger';
import { db } from './config';
import UserRouter from './routes/users';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(loggerMiddleware);
app.use('/users',UserRouter)

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const startServer = async () => {
    try {
        await db.authenticate(); // Use authenticate instead of sync
        console.log('Database is connected');

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
};

startServer();
