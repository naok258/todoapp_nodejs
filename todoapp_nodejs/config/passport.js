const passport = require("passport");
const LocalStrategy = require("passport-local");
const knex = require("../db/knex");
const bcrypt = require("bcrypt");
const User = require("../models/user");
//const cookieSession = require("cookie-session");
const session = require('express-session');
// const csrf = require('csurf');

module.exports = (app) => {
    passport.serializeUser(function (user, done) {
        process.nextTick(function () {
            console.log("serializeUser");
            console.log(user);
            done(null, user.id);
        });
    });

    passport.deserializeUser(function (id, done) {
        console.log("deserializeUser");
        process.nextTick(async function () {
            try {
                const user = await User.findById(id)
                done(null, user)
            } catch (error) {
                done(error, null);
            }
        });
    });

    passport.use(new LocalStrategy({
        usernameField: "username",
        passwordField: "password",
    }, function (username, password, done) {
            knex("users")
                .where({
                    name: username,
                })
                .select("*")
                .then(async function (results) {
                    if (results.length === 0) {
                        return done(null, false, { message: "Invalid User" });
                    } else if (await bcrypt.compare(password, results[0].password)) {
                        console.log("サインイン：正常にログインしました。");
                        console.log(results[0]);
                        return done(null, results[0]);
                    } else {
                        return done(null, false, { message: "invaild User" });
                    }
                })
                .catch((err) => {
                    console.log("認証エラーです。");
                    console.error(err);
                    return done(null, false, { mesage: err.toString() });
                });
        }));

    // app.use(
    //     cookieSession({
    //         name: "session",
    //         keys: [secret],

    //         maxAge: 24 * 60 * 60 * 1000
    //     })
    // );

    app.use(session({
        secret: 'secretCuisine123',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000
            }
    }));
    console.log("app use session");
    // app.use(csrf());
    // app.use(passport.authenticate('session'));
    // app.use(function (req, res, next) {
    //     var msgs = req.session.messages || [];
    //     res.locals.messages = msgs;
    //     res.locals.hasMessages = !!msgs.length;
    //     req.session.messages = [];
    //     next();
    // });
    // app.use(function (req, res, next) {
    //     res.locals.csrfToken = req.csrfToken();
    //     next();
    // });

    app.use(passport.initialize());
    console.log("passport initialize");

    app.use(passport.session());
    console.log("passport session");

}

// module.exports = router;