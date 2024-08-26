import {Router} from 'express';
import{getUser,postUser,getUserProfile} from '../handles/index.js';
import { verifyToken } from "../middleware/verifyToken.js";



export const appRouter=Router()
appRouter.get('/',getUser);
appRouter.post('/auth/login',postUser);
appRouter.get('/user/profile',verifyToken,getUserProfile);
