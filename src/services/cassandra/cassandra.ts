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
  const query = `Select * from ${table} where ${id}='${value}'`
  return client.execute(query).then((result) => {
    console.log(result);
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
  const query = `UPDATE ${table} SET username = ?, email = ?, phone = ?, dateofbirth = ? WHERE ${id} = '${user[id]}'`;
  delete user[id];
  const userValue:string[] = Object.values(user);
  return client.execute(query, userValue, { prepare: true }).then(() => {
    return 1
  }).catch(err =>{
    console.log(err);
    return -1
  })
}

export async function patch<T>(client:Client, table:string, keyQuery:string, user :User) {
  const where = `WHERE ${keyQuery} = '${user.id}'`;
  delete user[keyQuery];
  const keys = Object.keys(user);
  const values = Object.values(user);
  let keyString = "";
  keys.forEach((item,index) => {
    keyString += `${item.toLowerCase()} = ? `;
    if(index != keys.length -1){
      keyString += ","
    } 
  })
  const query = `UPDATE ${table} SET ${keyString} ${where}`;
  return client.execute(query, values, { prepare: true }).then(() => {
    return 1
  }).catch(err =>{
    console.log(err);
    return -1
  })
}

export async function deleteById(client:Client, table:string, key:string, value :string) : Promise<number>{
  const query = `DELETE FROM ${table} WHERE ${key} = '${value}'`
  return client.execute(query).then(() => {
    return 1
  }).catch(err =>{
    console.log(err);
    return -1
  })
}


// export async function findWithMap<T>(client: Client, query: string ,valueQuery: D): Promise<T[]> {
//   return client.execute(query,)
  // const objects = await find<T>(collection, query, sort, limit, skip, project);
  // for (const obj of objects) {
  //   if (idName && idName !== '') {
  //     (obj as any)[idName] = (obj as any)['_id'];
  //   }
  //   delete (obj as any)['_id'];
  // }
  // if (!m) {
  //   return objects;
  // } else {
  //   return await mapArray(objects, m);
  // }
// }

