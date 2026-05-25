import { Router, type Request, type Response } from 'express';
import { commentsStore, getNextId, findCommentAndParent } from '@/data/data';
import type { Comment } from '@/types/type';

const router = Router({ mergeParams: true });

// GET /api/posts/:postId/comments
router.get('/', (req: Request, res: Response) => {
    const postId = req.params.postId as string;
    const comments = commentsStore.get(postId) || [];
    res.json(comments);
});

// POST /api/posts/:postId/comments
router.post('/', (req: Request, res: Response) => {
    const postId = req.params.postId as string;
    const { content, author } = req.body;
    if (!content || !author) {
        return res.status(400).json({ error: 'Missing content or author' });
    }

    const newComment: Comment = {
        id: getNextId(),
        content,
        author,
        createdAt: new Date().toISOString(),
        replies: [],
    };

    if (!commentsStore.has(postId)) {
        commentsStore.set(postId, []);
    }
    commentsStore.get(postId)!.push(newComment);
    res.status(201).json(newComment);
});

// POST /api/posts/:postId/comments/:commentId/replies
router.post('/:commentId/replies', (req: Request, res: Response) => {
    const postId = req.params.postId as string;
    const commentId = parseInt(req.params.commentId as string);
    const { content, author } = req.body;
    if (!content || !author) {
        return res.status(400).json({ error: 'Missing content or author' });
    }

    const comments = commentsStore.get(postId);
    if (!comments) return res.status(404).json({ error: 'No comments for this post' });

    const { comment, parentList } = findCommentAndParent(comments, commentId);
    if (!comment || !parentList) {
        return res.status(404).json({ error: 'Comment not found' });
    }

    const reply: Comment = {
        id: getNextId(),
        content,
        author,
        createdAt: new Date().toISOString(),
        replies: [],
    };
    comment.replies.push(reply);
    res.status(201).json(reply);
});

// DELETE /api/posts/:postId/comments/:commentId
router.delete('/:commentId', (req: Request, res: Response) => {
    const postId = req.params.postId as string;
    const commentId = parseInt(req.params.commentId as string);

    const comments = commentsStore.get(postId);
    if (!comments) return res.status(404).json({ error: 'No comments for this post' });

    const { parentList, comment } = findCommentAndParent(comments, commentId);
    if (!parentList || !comment) {
        return res.status(404).json({ error: 'Comment not found' });
    }

    const index = parentList.findIndex(c => c.id === commentId);
    if (index !== -1) {
        parentList.splice(index, 1);
        return res.status(200).json({ message: 'Deleted' });
    }
    return res.status(404).json({ error: 'Comment not found' });
});

export default router;