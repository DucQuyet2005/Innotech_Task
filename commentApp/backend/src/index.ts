import express from 'express';
import commentRoutes from './routes/commentRoutes';

const app = express();
app.use(express.json());

app.use('/api/posts/:postId/comments', commentRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});