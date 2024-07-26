const express = require('express');
const router = express.Router();
const knex= require("../db/knex");
const { resolveInclude } = require('ejs');
const bcrypt = require("bcrypt");

router.get('/',(req, res, next)=>{
    const isAuth = req.isAuthenticated();
    res.render('signup',{
        title:'Sign up',
        isAuth: isAuth,
    });
});

router.post('/',(req,res,next)=>{
    const username = req.body.username;
    const password = req.body.password;
    const repassword = req.body.repassword;
    const isAuth = req.isAuthenticated();
    console.log("user:",username,",pass:",password,",repass:",repassword)

    knex("users")
        .where({name:username})
        .select("*")
        .then(async (result)=>{
            if(result.length !== 0){
                res.render("signup",{
                    title:"Sign Up",
                    isAuth: isAuth,
                    errorMessage:["このユーザ名は既に使われています"],
                })
            } else if(password === repassword) {
                const hashedPassword = await bcrypt.hash(password, 10);
                knex("users")
                    .insert({name: username, password: hashedPassword})
                    .then(()=>{
                        console.log("サインアップ：正常にユーザー情報を登録しました")
                        res.redirect("/");
                    })
                    .catch((err)=>{
                        console.error(err);
                        res.render("signup",{
                            title:"Sign Up",
                            isAuth: isAuth,
                            errorMessage:[err.sqlMessage]
                        });
                    });
            } else {
                res.render("signup",{
                    title:"Sign up",
                    isAuth: isAuth,
                    errorMessage:["パスワードが一致しません"]
                });
            }
        })
        .catch((err)=>{
            console.error(err);
            res.render("signup",{
                title:"Sign Up",
                isAuth: isAuth,
                errorMessage:[err.sqlMessage],
            });
        });
})

module.exports = router;