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

/**
 * Adapted from TypeGraphQL (https://github.com/MichalLytek/type-graphql/blob/master/src/utils/container.ts)
 */

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ContainerType, ContainerGetter, ResolverData } from '~/types';

type SupportedType<T> = { new (...args: any[]): T } | Function;

class DefaultContainer {
  private readonly instances: { type: Function; object: any }[] = [];

  public get<T>(someClass: SupportedType<T>): T {
    let instance = this.instances.find((i) => i.type === someClass);
    if (!instance) {
      instance = { type: someClass, object: new (someClass as any)() };
      this.instances.push(instance);
    }

    return instance.object;
  }
}

/**
 * IOC Container.
 */
export class IOCContainer {
  private readonly container: ContainerType | undefined;

  private readonly containerGetter: ContainerGetter<any> | undefined;

  private readonly defaultContainer = new DefaultContainer();

  public constructor(
    iocContainerOrContainerGetter?: ContainerType | ContainerGetter<any>
  ) {
    if (
      iocContainerOrContainerGetter &&
      'get' in iocContainerOrContainerGetter &&
      typeof iocContainerOrContainerGetter.get === 'function'
    ) {
      this.container = iocContainerOrContainerGetter;
    } else if (typeof iocContainerOrContainerGetter === 'function') {
      this.containerGetter = iocContainerOrContainerGetter;
    }
  }

  public getInstance<T = any>(
    someClass: SupportedType<T>,
    resolverData: ResolverData<any>
  ): T | Promise<T> {
    const container = this.containerGetter
      ? this.containerGetter(resolverData)
      : this.container;
    if (!container) {
      return this.defaultContainer.get<T>(someClass);
    }
    return container.get(someClass, resolverData);
  }
}
