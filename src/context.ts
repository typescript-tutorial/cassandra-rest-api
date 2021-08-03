import { HealthController } from 'controllers/HealthController';
import {UserController} from './controllers/UserController';

export interface ApplicationContext {
  healthController:HealthController;
  userController: UserController;
}
