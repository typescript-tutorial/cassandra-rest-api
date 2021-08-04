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

