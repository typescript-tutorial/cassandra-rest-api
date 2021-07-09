import {User} from '../../models/User';
import {Client} from 'cassandra-driver';
import { all,insert,load, update, deleteById, patch } from './cassandra';


export class CassandraUserService {
  private readonly client: Client;
  private readonly table = 'users';
  private readonly id = 'id';
  constructor(db: Client) {
    this.client = db;
  }

  all(): Promise<User[]> {
    return all<User>(this.client, this.table);
  }
  load(id: string): Promise<User> {
    return load<User>(this.client, this.table, this.id,id);
  }
  insert(user: User): Promise<number> {
    return insert(this.client, this.table, user);
  }
  update(user: User): Promise<number> {
    return update(this.client, this.table, this.id, user);
  }
  patch(user: User): Promise<number> {
    return patch(this.client, this.table,  this.id, user);
  }
  delete(id: string): Promise<number> {
    return deleteById(this.client, this.table, this.id, id);
  }
}