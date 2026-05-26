/**
 * ===========================================
 * IN-MEMORY DATA STORE - Comments Database
 * ===========================================
 * 
 * Sử dụng Map<string, Comment[]> để lưu trữ comments
 * theo từng postId. Có seed data mẫu để demo.
 */

import type { Comment } from '@/types';

/**
 * Store chính: Map với key = postId, value = mảng Comment[].
 * Mỗi post có một mảng comments riêng biệt.
 */
export const commentsStore: Map<string, Comment[]> = new Map();

/**
 * Auto-increment ID counter.
 * Mỗi lần tạo comment mới, ID tăng lên 1.
 */
let nextId = 100;

/**
 * Lấy ID tiếp theo và tự động tăng counter.
 */
export function getNextId(): number {
  return nextId++;
}

/**
 * Seed data - dữ liệu mẫu để demo hệ thống.
 * Tạo sẵn comments lồng nhau nhiều cấp cho postId "123".
 */
function seedData(): void {
  const sampleComments: Comment[] = [
    {
      id: 1,
      content:
        'Hệ thống nested comments này hoạt động rất tốt! Recursive rendering thật sự ấn tượng 🔥',
      author: 'Minh Tuấn',
      avatar: 'https://i.pravatar.cc/150?img=1',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      likes: 12,
      replies: [
        {
          id: 2,
          content:
            'Đồng ý! Mình thích cách nó handle tree structure. Clean code quá 👏',
          author: 'Thảo Nguyên',
          avatar: 'https://i.pravatar.cc/150?img=5',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          likes: 8,
          replies: [
            {
              id: 3,
              content:
                'Recursive component rendering trong React quả thật rất mạnh mẽ. CommentItem tự gọi lại chính nó!',
              author: 'Đức Anh',
              avatar: 'https://i.pravatar.cc/150?img=3',
              createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
              likes: 5,
              replies: [
                {
                  id: 4,
                  content:
                    'Đúng rồi, pattern này cũng giống cách Reddit render comment threads vậy 🧵',
                  author: 'Hải Yến',
                  avatar: 'https://i.pravatar.cc/150?img=9',
                  createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
                  likes: 3,
                  replies: [],
                },
              ],
            },
          ],
        },
        {
          id: 5,
          content:
            'Mình muốn hỏi: có giới hạn bao nhiêu cấp reply không? 🤔',
          author: 'Phương Linh',
          avatar: 'https://i.pravatar.cc/150?img=10',
          createdAt: new Date(Date.now() - 3600000 * 3.5).toISOString(),
          likes: 2,
          replies: [
            {
              id: 6,
              content:
                'Không có giới hạn! Recursive nên nó render bao nhiêu cấp cũng được. Nhưng thực tế nên cap lại khoảng 5-6 cấp thôi cho đẹp UI.',
              author: 'Minh Tuấn',
              avatar: 'https://i.pravatar.cc/150?img=1',
              createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
              likes: 6,
              replies: [],
            },
          ],
        },
      ],
    },
    {
      id: 7,
      content:
        'TypeScript + Express + React = combo hoàn hảo cho fullstack project. Ai chưa thử nên thử ngay! 💯',
      author: 'Quốc Bảo',
      avatar: 'https://i.pravatar.cc/150?img=7',
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      likes: 15,
      replies: [
        {
          id: 8,
          content:
            'Thêm Bun runtime nữa là chuẩn production luôn. Performance tuyệt vời! ⚡',
          author: 'Kim Chi',
          avatar: 'https://i.pravatar.cc/150?img=20',
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          likes: 9,
          replies: [],
        },
      ],
    },
    {
      id: 9,
      content:
        'UI rất đẹp, giống production app thật sự. Collapse replies feature rất tiện! 🎨',
      author: 'Thanh Hằng',
      avatar: 'https://i.pravatar.cc/150?img=25',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      likes: 7,
      replies: [],
    },
  ];

  commentsStore.set('123', sampleComments);
}

// Khởi tạo seed data khi module được load
seedData();