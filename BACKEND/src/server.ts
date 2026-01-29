import 'dotenv/config';
import 'dotenv/config';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import user_router from './routers/user.router';
import cors from 'cors'
import event_router from './routers/event.router';
import booking_router from './routers/booking.router';
import issuesRouter from './routers/issues.router';
import auth_router from './routers/auth.router';


const app = express();

app.use(cors()); // Enable all origins for production stability during troubleshooting

app.use(bodyParser.json());
app.use(express.json());
// app.use(cors()) // Removed redundant call

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Plana Backend is running' });
});

app.use('/users', user_router);
app.use('/events', event_router);
app.use('/bookings', booking_router);
app.use('/issues', issuesRouter);
app.use('/api/auth', auth_router);


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    message: err.message
  })
})

const PORT = Number(process.env.PORT) || 5500;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}...`);
});
