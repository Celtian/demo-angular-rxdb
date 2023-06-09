import { Injectable } from '@angular/core';
import { combineLatest, from, map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { PostDto } from '../dto/post.dto';
import { RxdbProvider } from './db.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService<T> {
  constructor(private rxdbProvider: RxdbProvider) {}

  private get collection() {
    return this.rxdbProvider.getDatabaseCollection('posts');
  }

  public create(body: Partial<T>) {
    return from(
      this.collection.insert({
        id: uuidv4(),
        ...body,
      })
    ).pipe(map((doc) => doc._data));
  }

  public patch(id: string, body: Partial<T>) {
    return from(this.collection.findOne({ selector: { id } }).update({ id, ...body })).pipe(
      map((doc) => ({ ...doc._data, ...body }))
    );
  }

  public put(id: string, body: T) {
    return from(this.collection.upsert({ id, ...body })).pipe(map((doc) => ({ ...doc._data, ...body })));
  }

  public detail(id: string) {
    return from(this.collection.findOne({ selector: { id } }).exec()).pipe(map((doc) => doc._data));
  }

  public delete(id: string) {
    return from(this.collection.findOne({ selector: { id } }).remove()).pipe(map((doc) => doc._data));
  }

  public list(page = 1, limit = 5, sort: keyof PostDto = 'id', order: 'asc' | 'desc' = 'asc', query = '') {
    const selector = query ? { title: { $regex: new RegExp(query, 'i') } } : undefined;
    return from(
      this.collection
        .find({
          skip: page - 1,
          limit,
          selector,
          sort: [
            {
              [sort]: order,
            },
          ],
        })
        .exec()
    ).pipe(map((docs) => docs.map((doc) => doc._data)));
  }

  public count() {
    return from(this.collection.count().exec());
  }

  public listAndCount(page = 1, limit = 5, sort: keyof PostDto = 'id', order: 'asc' | 'desc' = 'asc', query = '') {
    return combineLatest([this.list(page, limit, sort, order, query), this.count()]).pipe(
      map(([items, totalCount]) => ({
        items,
        totalCount,
      }))
    );
  }
}
