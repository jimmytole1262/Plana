import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import user_router from './routers/user.router';
import cors from 'cors'
import event_router from './routers/event.router';
import booking_router from './routers/booking.router';
import issuesRouter from './routers/issues.router';
import auth_router from './routers/auth.router';


const app = express();

app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(express.json());
// app.use(cors()) // Removed redundant call

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

const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
