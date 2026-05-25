import type { Comment } from "@/types/type";

//store comments keyed by postid 

export const commentsStore: Map<string, Comment[]> = new Map()

let nextId = 1;

export function getNextId(): number {
    return nextId++;
}

//Helper de tim comment theo id(ke ca nestedId)

export function findCommentAndParent(
    comments: Comment[],
    targetId: number,
    parent: Comment[] | null = null,
    parentObj: Comment | null = null
): { comment: Comment | null, parentList: Comment[] | null, parentComment: Comment | null } {
    for (const comment of comments) {
        if (comment.id === targetId) {
            return { comment, parentList: parent, parentComment: parentObj };
        }

        if (comment.replies?.length > 0) {
            const result = findCommentAndParent(
                comment.replies,
                targetId,
                comment.replies,
                comment
            );
            if (result.comment)
                return result;
        }
    }
    return { comment: null, parentList: null, parentComment: null };
}