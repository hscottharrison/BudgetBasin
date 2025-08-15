/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/auth_controller')
const ViewsController = () => import('#controllers/views_controller')

// Views
router.get('/', [ViewsController, 'home'])
router.get('/register', [ViewsController, 'register'])
router.get('/login', [ViewsController, 'login'])
router.get('/user-home', [ViewsController, 'userHome']).use(middleware.auth())

// AUTH
router.post('/api/register', [AuthController, 'register'])
router.post('/api/login', [AuthController, 'login'])
router.post('/api/logout', [AuthController, 'logout'])
