const express = require("express")
const bcrypt = require("bcryptjs")
const Users = require("../users/users-model")
const restrict = require("../middleware/restrict")

const router = express.Router()

router.post("/register", async (req, res, next) => {
	try {
		const { username } = req.body
		const user = await Users.findBy({ username }).first()

		if (user) {
			return res.status(409).json({
				message: "Username is already taken",
			})
		}

		res.status(201).json(await Users.add(req.body))
	} catch(err) {
		next(err)
	}
})

router.post("/login", async (req, res, next) => {
	try {
		const { username, password } = req.body
		const user = await Users.findBy({ username }).first()
		const passwordValid = await bcrypt.compare(password, user.password)

		if (!user || !passwordValid) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}

//		// manual number generation for token
// 		const authToken = Math.random()
// 		sessions[authToken] = user.Invalid

// 		// // Option1: when sending "Authorization" header in GET request
// 		// res.setHeader("Authorization", authToken)

		// Option2: Using "Set-Cookie" implementation
// 		res.setHeader("Set-Cookie", `token=${authToken}; Path=/` )

		// Option3: use express-session middleware, gives us req.session object
		// to which we can attach 'user' object to and access later when user authorised.
		// this does same as above but more automated, express-session is going to
		// return a header with 'set-cookie' and set the token to a special encrypted 
		// session id i.e. takes care of everything re sending/receiving cookies
		req.session.user = user

		// response
		res.json({
			message: `Welcome ${user.username}!`,
		})
	} catch(err) {
		next(err)
	}
})

router.get("/logout", restrict(), (req, res, next) => {
	// destroy the session on the server, does not destroy the cookie in the client
	// but the info inside the cookie is now useless/invalid

	// normally we'd have a logout endpoint on react-router that calls a logout
	// endpoint on the backend
	req.session.destroy((err) => {
		// takes a callback, not promise
		if (err) {
			next(err)
		} else {
			res.json({
				message: "Seccessfully logged out",
			})
		}
	})
	// res.end()	
})

module.exports = router