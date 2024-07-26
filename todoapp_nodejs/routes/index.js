const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
// const mysql = require('mysql2');



// const coneection = mysql.createConnection({
//   host: 'localhost',
//   user:'root',
//   password:'pass',
//   database:'todo_app'
// });

router.get('/', (req, res, next) => {
  // const userId= req.session.userid;
  // const isAuth = Boolean(userId);
  const isAuth = req.isAuthenticated();
  console.log(`isAuth:"${isAuth}"`)

  if (isAuth) {
    const userId = req.user.id;
    knex("tasks")
      .select("*")
      .where({ user_id: userId })
      .then((results) => {
        console.log(results);
        res.render('index', {
          title: 'ToDo App',
          todos: results,
          isAuth: isAuth,
        });
      })
      .catch((err) => {
        console.error(err);
        res.render('index', {
          title: 'ToDo App',
          isAuth: isAuth,
        });
      });
  } else {
    res.render('index', {
      title: 'TodDo App',
      isAuth: isAuth,
    })
  }
});

router.post('/', (req, res, next) => {
    // coneection.connect((err) => {
    //   if (err) {
    //     console.log('error connecting:' + err.stack);
    //     return;
    //   }
    //   console.log('success');
    // });
    const todo = req.body.add;
    const userId = req.user.id;
    // coneection.query(
    //   `insert into tasks(user_id,content) values (1, '${todo}');`,
    //   (error, results) => {
    //     console.log(error);
    //     res.redirect(`/`);
    //   }
    // );

    const isAuth = req.isAuthenticated();

    knex("tasks")
        .insert({user_id:userId,content:todo})
        .then(() =>{
          res.redirect('/')
        })
        .catch((err)=>{
          console.error(err);
          res.render('index',{
            title:'ToDo App',
            isAuth:isAuth,
          });
        });
  });


router.use('/signup',require('./signup'));
router.use('/signin',require('./signin'));
router.use('/logout',require('./logout'));

module.exports = router;
