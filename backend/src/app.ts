import express from 'express';
import cors from 'cors';
import tasksRoutes from './routes/tasks';
const app=express();
app.use(cors({
  origin:'http://localhost:3000',
  credentials:true,
}));
app.use(express.json());
app.use('/tasks',tasksRoutes);
export default app;
