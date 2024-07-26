const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res, next) => {
    const isAuth = req.isAuthenticated();
    console.log("siginin GET");
    res.render('signin', {
        title: 'Sign in',
        isAuth: isAuth,
    });
});

router.post('/',
    passport.authenticate('local',
        {
            successRedirect: '/',
            failureRedirect: '/signin',
            failureFlash: true,
        }
    )
);

// router.post('/', (req, res, next) => {
//     const username = req.body.username;
//     const password = req.body.password;
//     const userId = req.session.userid;
//     const isAuth = Boolean(userId);

//     knex("users")
//         .where({
//             name: username,
//         })
//         .select("*")
//         .then(async (results) => {
//             if (results.length !== 0 && await bcrypt.compare(password, results[0].password)) {
//                 console.log("サインイン：正常にセッション情報を格納しました。")
//                 req.session.userid = results[0].id;
//                 req.session.username = results[0].name;
//                 res.redirect('/');

//             } else {
//                 res.render("signin", {
//                     title: "Sign In",
//                     isAuth: isAuth,
//                     errorMessage: ["ユーザが見つかりません"],
//                 });

//             }
//         })
//         .catch((err) => {
//             console.error(err);
//             res.render("signin", {
//                 title: "Sign In",
//                 errorMessage: [err.sqlMessage],
//                 isAuth: false,
//             });
//         });
// });

module.exports = router;