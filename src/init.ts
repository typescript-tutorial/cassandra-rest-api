import {Client} from 'cassandra-driver';
import {ApplicationContext} from './context';
import {UserController} from './controllers/UserController';
import {CassandraUserService} from './services/cassandra/CassandraUserService';

export function createContext(db: Client): ApplicationContext {
    const userService = new CassandraUserService(db);
    const userController = new UserController(userService);
    const ctx: ApplicationContext = {userController};
    return ctx;
}
