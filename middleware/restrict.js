const bcrypt = require("bcryptjs")
const Users = require("../users/users-model")

function restrict() {
	const authError = {
		message: "Invalid credentials",
	}
	
	return async (req, res, next) => {
		// console.log(req.headers)
		try {
			// this implementation doesn't use any session/cookies //
// 			const { username, password } = req.headers
// 			if (!username || !password) {
// 				return res.status(401).json(authError)
// 			}
// 
// 			const user = await Users.findBy({ username }).first()
// 			if (!user) {
// 				return res.status(401).json(authError)
// 			}
// 
// 			const passwordValid = await bcrypt.compare(password, user.password)
// 			if (!passwordValid) {
// 				return res.status(401).json(authError)
			// }

			// OPTION1: using a manual session[authToken] variable in auth-router.js
			// and passing "authorization" header manually in GET request
			// const { authorization } = req.headers
			// if (!sessions[authorization]) {
			// 	return res.status(401).json(authError)
			// }

			// OPTION2: manually using "Set-Cookie" in res.setHeader in auth-router.js,
			// and manually looking cookie header, pulling no. out, looking it up on 
			// sessions object, etc.
			// const { cookie } = req.headers
			// if (!cookie) {
			// 	return res.status(401).json(authError)
			// }
			// const authToken = cookie.replace("token=", "")
			// if (!sessions[authToken]) {
			// 	return res.status(401).json(authError)
			// }

			// OPTION3: express-session handles all the above for us

			if (!req.session || !req.session.user) {
				return res.status(401).json(authError)
			}

			next()
		} catch(err) {
			next(err)
		}
	}
}

module.exports = restrict