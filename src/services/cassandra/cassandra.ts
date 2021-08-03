import { Client,auth } from "cassandra-driver";
import { User } from "models/User";

export interface CassandraConfig {
  uri: string ;
  keyspaceName: string;
  dataCenter?: string;
  userDb?:string;
  passworDb?:string;
  pool_size?: number;
}
export interface StringMap {
  [key: string]: string;
}

export async function  connectToDb(url:string[],keyspaceName:string,dataCenter:string,userDb:string,passworDb)  {
  try{
    const client = new Client({
      contactPoints: url,
      localDataCenter: dataCenter,
      keyspace:keyspaceName,
      authProvider: new auth.DsePlainTextAuthProvider(userDb, passworDb),
    });
    await client.connect();
    console.log("Connect cassandra success");
    return client;
  }catch(err){
    console.log("Database error:",err);
    return err;
  }
}

export async function all<T>(client: Client, table: string) : Promise<T[]> {
  const query = `Select * from ${table}`
  return client.execute(query).then((result) => {
    return result.rows
  }).catch(err =>{
    return err
  })
}

export async function load<T>(client: Client, table: string, id: string,value:string) : Promise<T> {
  const query = `Select * from ${table} where ${id}=?`
  return client.execute(query,[value]).then((result) => {
    return result.rows[0]
  }).catch(err =>{
    return err
  })
}

export async function insert<T>(client: Client, table: string, user:T) : Promise<number> {
  const value:string[] = Object.values(user);
  const query = `INSERT INTO ${table} (id, username, email, phone, dateofbirth) VALUES (?,?,?,?,?) `;
  return client.execute(query, value , { prepare: true }).then(() => {
    return 1
  }).catch(err =>{
    console.log(err);
    return -1
  })
}

export async function update<T>(client:Client, table:string, id:string, user:T) : Promise<number> {
  const query = `UPDATE ${table} SET username = ?, email = ?, phone = ?, dateofbirth = ? WHERE ${id} = ?`;
  const key = user[id];
  delete user[id];
  const userValue:string[] = Object.values(user);
  return client.execute(query, [...userValue,key], { prepare: true }).then(() => {
    return 1
  }).catch(err =>{
    console.log(err);
    return -1
  })
}

export async function patch<T>(client:Client, table:string, keyQuery:string, user :User) {
  const key = user.id;
  delete user[keyQuery];
  let keys = Object.keys(user);
  const values = Object.values(user);
  keys = keys.map(item => `${item} = ?`)
  const query = `UPDATE ${table} SET ${keys.join()} WHERE ${keyQuery} = ?`;
  return client.execute(query, [...values,key], { prepare: true }).then(() => {
    return 1
  }).catch(err =>{
    console.log(err);
    return -1
  })
}

export async function deleteById(client:Client, table:string, key:string, value :string) : Promise<number>{
  const query = `DELETE FROM ${table} WHERE ${key} = ?`
  return client.execute(query,[value], { prepare: true }).then(() => {
    return 1
  }).catch(err =>{
    console.log(err);
    return -1
  })
}

