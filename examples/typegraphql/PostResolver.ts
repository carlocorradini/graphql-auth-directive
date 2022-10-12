/*
 * MIT License
 *
 * Copyright (c) 2022-2022 Carlo Corradini
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

import { GraphQLInt } from 'graphql';
import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { Post } from './Post';
import { posts } from './data';
import { Auth } from './Auth';
import { Context } from './Context';
import { UserRoles } from './UserRoles';
import { UserPermissions } from './UserPermissions';

@Resolver(Post)
export class PostResolver {
  @Query(() => [Post])
  posts() {
    return posts;
  }

  @Mutation(() => Post)
  @Auth()
  createPost(@Arg('content') content: string, @Ctx() context: Context) {
    const newPost: Post = {
      id: posts.length > 0 ? posts[posts.length - 1].id + 1 : 0,
      content,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      creatorId: context.user!.id
    };
    posts.push(newPost);
    return newPost;
  }

  @Mutation(() => Post, { nullable: true })
  @Auth({
    roles: [UserRoles.ADMIN],
    permissions: [UserPermissions.DELETE_POST]
  })
  deletePost(@Arg('id', () => GraphQLInt) id: number) {
    const postIndex = posts.findIndex((p) => p.id === id);
    let postDeleted: Post | null = null;

    if (postIndex !== -1) {
      postDeleted = posts[postIndex];
      posts.splice(postIndex, 1);
    }

    return postDeleted;
  }
}
