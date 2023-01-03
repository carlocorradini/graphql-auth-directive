/*
 * MIT License
 *
 * Copyright (c) 2022-2023 Carlo Corradini
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type { User } from './User';
import type { Post } from './Post';
import { UserPermissions } from './UserPermissions';
import { UserRoles } from './UserRoles';

export const SUPER_USER: User = {
  id: 0,
  secret: true,
  roles: [UserRoles.ADMIN],
  permissions: [UserPermissions.DELETE_POST]
};

export const users: User[] = [
  SUPER_USER,
  {
    id: 1,
    secret: false,
    roles: [],
    permissions: []
  }
];

export const posts: Post[] = [{ id: 0, content: 'Hello World!', creatorId: 1 }];

export function addPost(content: string, creatorId: number): Post {
  const newPost: Post = {
    id: posts.length > 0 ? posts[posts.length - 1].id + 1 : 0,
    content,
    creatorId
  };
  posts.push(newPost);
  return newPost;
}

export function removePost(id: number): Post | null {
  const postIndex = posts.findIndex((p) => p.id === id);
  let postDeleted: Post | null = null;

  if (postIndex !== -1) {
    postDeleted = posts[postIndex];
    posts.splice(postIndex, 1);
  }

  return postDeleted;
}
