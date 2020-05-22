// import dotenv
// require("dotenv").config
// better to use "-r dotenv/config" in package.json right after
// we call nodemon, that will read in all the environment variables
// before index even runs or our apps starts so they're guaranteed to 
// be there by the time it starts

const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
// import exress-session
const session = require("express-session")
// import express-session store
// this require is returning a function, which we call with (session)
const KnexSessionStore = require("connect-session-knex")(session)
const authRouter = require("./auth/auth-router")
const usersRouter = require("./users/users-router")
// import config file (which is already importing our knexfile and creating 
// and instance of knex which is already connected to our sqlite database) 
// to use in our store
dbConfig = require("./database/config")

const server = express()
const port = process.env.PORT || 5000

server.use(cors())
server.use(helmet())
server.use(express.json())
// use express-session middleware, gives us a new object on the request (req.session)
server.use(session({
	name: "token", // overwrites default cookie name, hides our stack better
	resave: false, // avoid recreating sessions that have not changed
	saveUninitialized: false, // GDPR laws against setting cookies automatically
	secret: process.env.COOKIE_SECRET || "secret", // cryptographically sign the cookie
	// NOTE: this cookie object wasn't necessary to implement cookies, it was 
	// implemented approx 1:20:00 into the lecture to add below functionality
	cookie: {
		httpOnly: true, // disallow javascript from reading our cookie contents
		// maxAge: 15 * 1000, // expire the cookie after 15 secs (removes it from req.header)
	},
	// use our express-session store in our middleware
	store: new KnexSessionStore({
		knex: dbConfig, // configured instance of knex
		createtable: true, // if the session table doesn't exist, create it automatically
	})
}))

server.use("/auth", authRouter)
server.use("/users", usersRouter)

server.get("/", (req, res, next) => {
	res.json({
		message: "Welcome to our API",
	})
})

server.use((err, req, res, next) => {
	console.log(err)
	res.status(500).json({
		message: "Something went wrong",
	})
})

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`)
})
