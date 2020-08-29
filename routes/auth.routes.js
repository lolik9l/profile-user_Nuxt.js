const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const { users } = require('../db.json');
const router = Router();



// /api/auth/
router.post(
	'/',
	check('token').exists({ checkFalsy: true }),
	async (req, res) => {
		try {
			const unAuth = () => res.status(200).json({ success: 0 });	

			if(!validationResult(req).isEmpty()) return unAuth();

				const { token } = req.body;
				const { userId } = jwt.verify(token, config.get('jwtSecret'));
				const user = users.find(item => item.id == userId);
				
				if(!user) return unAuth(); //здесь должна быть ещё проверка токена что в базе записан он же типа token == user.token 

				res.status(200).json({ 
					success: 1, 
					res: { user: user.data }  
				});
		} catch(err) {
			let message;
			let status;
			switch(err.name) {
				case "TokenExpiredError": status = 401; message = "Время сессии истекло. Авторизируйтесь снова.";
					break;
				case "jwt expired": status = 401; message = "Время сессии истекло. Авторизируйтесь снова.";
					break;
				default: status = 500; message = err.message;
			}
			res.status(status).json({ success: 0, message });
		}
	}
);

// /api/auth/login
router.post(
	'/login',
	[
		check('login','Введите корректный логин').exists(),
		check('password', 'Введите пароль').exists(),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					success: 0,
					errors: errors.array(),
					message: "Некорректные данные при авторизации",
				})
			}
			const error = () => res.status(401).json({ success: 0, message: "Неверный логин или пароль." });
		
			const {login, password} = req.body;
			const user = users.find(item => item.login == login); 
			if(!user) return error();
			const isMatch = await bcrypt.compare(password, user.password);
			if(!isMatch) return error();
			
			const token =  jwt.sign(
				{ 
					userId: user.id
				},
				config.get('jwtSecret'),
				{ expiresIn: '12h' }
			);

			res.status(200).json({ 
				success: 1, 
				res: {
					token,
					user: user.data
				} 
			});
		} catch(err) {
			console.log(err);
			res.status(500).json({ success: 0, message: "Что то пошло не так...", errors:[err.message] });
		}
	}
);

module.exports = router;