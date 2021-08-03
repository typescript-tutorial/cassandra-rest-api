import {Client} from 'cassandra-driver';
import { HealthController } from './controllers/HealthController';
import { CassandraChecker } from './services/cassandra/cassandraChecker';
import {ApplicationContext} from './context';
import {UserController} from './controllers/UserController';
import {CassandraUserService} from './services/cassandra/CassandraUserService';

export function createContext(db: Client): ApplicationContext {
  const cassandraChecker = new CassandraChecker(db);
  const healthController = new HealthController([cassandraChecker]);
    const userService = new CassandraUserService(db);
    const userController = new UserController(userService);
    const ctx: ApplicationContext = {healthController,userController};
    return ctx;
}
