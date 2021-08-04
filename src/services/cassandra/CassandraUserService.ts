import {User} from '../../models/User';
import {Client} from 'cassandra-driver';


export class CassandraUserService {
  private readonly client: Client;
  constructor(db: Client) {
    this.client = db;
  }

  all(): Promise<User[]> {
    const query = `Select * from users`
    return this.client.execute(query,undefined, {prepare:true}).then(res=> res.rows).catch(err => err)
  }
  load(id: string): Promise<User> {
    const query = `Select * from users where id=?`
    return this.client.execute(query, [id], {prepare:true}).then(res => res.rows[0]).catch(err => err)
  }
  insert(user: User): Promise<number> {
    const query = `INSERT INTO users (id, username, email, phone, dateofbirth) VALUES (?,?,?,?,?) `
    const params = [user.id,user.username,user.email,user.phone,user.dateOfBirth]
    return this.client.execute(query, params, {prepare:true}).then(res => 1).catch(err => err)
  }
  update(user: User): Promise<number> {
    const query = `UPDATE users SET username = ?, email = ?, phone = ?, dateofbirth = ? WHERE id = ?`;
    const params = [user.username,user.email,user.phone,user.dateOfBirth,user.id]
    return this.client.execute(query, params, {prepare:true}).then(res => 1).catch(err => err)
  }
  delete(id: string): Promise<number> {
    const query = `DELETE FROM users WHERE id = ?`
    return this.client.execute(query, [id], {prepare:true}).then(res => 1).catch(err => err)
  }
}