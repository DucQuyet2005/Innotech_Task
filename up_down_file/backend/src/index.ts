import express from 'express';
import cors from 'cors';
import uploadRouter from './routes/upload';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', uploadRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
