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

import type { ToArrayStringArgs } from '~/types';

/**
 * Transform input value as a string array.
 *
 * @param args - Arguments.
 * @returns Array string.
 */
export function toArrayString<T>(args: ToArrayStringArgs<T>): string {
  // eslint-disable-next-line no-nested-ternary
  const array = !args.value
    ? [] // 'undefined' or 'null'
    : Array.isArray(args.value)
    ? args.value // Array
    : [args.value]; // Value
  const isEnum = args.isEnum ?? true;

  return `[${array
    .map((value) => `${isEnum ? '' : '"'}${value}${isEnum ? '' : '"'}`)
    .join(',')}]`;
}
