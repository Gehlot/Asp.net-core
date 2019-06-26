const express = require('express')
const bodyParser = require('body-parser')
var mssql = require('mssql');
var jwt = require('jsonwebtoken');
const { User, Blog, Tag ,sequelize} = require('./sequelize')
var config = require('./config'); // get our config file

const app = express()
app.use(bodyParser.json())
const passport = require('passport');
const passportJWT = require('passport-jwt');
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
value="";

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'wowwow';

// lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  let user = getUser({ id: jwt_payload.id});

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

// use the strategy
passport.use(strategy);

const getUser = async obj => {
    return await User.findOne({
      where: obj,
    });
  };

// create a user
app.post('/api/users', (req, res) => {
    console.log(req.body)
    User.create(req.body)
        .then(user => res.json(user))
})

// get all users
app.get('/api/users',async (req, res) => {
    // User.findAll().then(users => res.json(users))
  var data =  await sequelize.query('exec getdata :param', {replacements: {param:[req.body.name,'Indore']},type:sequelize.QueryTypes.SELECT});
  console.log(data.length);
  res.json(data);
});

 // PATCH single User
 app.post('/api/users/:id',passport.authenticate('jwt', { session: false }), (req, res,next) => {
    const id = req.params.id;
    const updates = req.body.updates;
    console.log("Priyanshi Jain.............................");
    User.find({
      where: { id: id }
    })
      .then(User => {
        console.log("Priyanshi Jain 222222222222.............................");
        return User.updateAttributes(updates)
      })
      .then(updatedUser => {
        console.log("Priyanshi Jain 333333333.............................");
        res.json(updatedUser);
      });
  });

  // DELETE single User
  app.delete('/api/users/:id',passport.authenticate('jwt', { session: false }), (req, res,next) => {
    const id = req.params.id;
    console.log("delete hojaaa...")
    User.destroy({
      where: { id: id }
    })
      .then(deletedUser => {
        res.json(deletedUser);
      });
  });

// create a blog post
app.post('/api/blogs', (req, res) => {
    const body = req.body
    const tags = body.tags.map(tag => Tag.findOrCreate({ where: { name: tag.name }, defaults: { name: tag.name }})
                                         .spread((tag, created) => tag))
    User.findById(body.userId)
        .then(() => Blog.create(body))
        .then(blog => Promise.all(tags).then(storedTags => blog.addTags(storedTags)).then(() => blog))
        .then(blog => Blog.findOne({ where: {id: blog.id}, include: [User, Tag]}))
        .then(blogWithAssociations => res.json(blogWithAssociations))
        .catch(err => res.status(400).json({ err: `User with id = [${body.userId}] doesn\'t exist.`}))
})

// find blogs belonging to one user or all blogs
app.get('/api/blogs/:userId?', (req, res) => {
    let query;
    if(req.params.userId) {
        query = Blog.findAll({ include: [
            { model: User, where: { id: req.params.userId } },
            { model: Tag }
        ]})
    } else {
        query = Blog.findAll({ include: [Tag, User]})
    }
    return query.then(blogs => res.json(blogs))
})

// find blogs by tag
app.get('/api/blogs/:tag/tag', (req, res) => {
    Blog.findAll({
        include: [
            { model: Tag, where: { name: req.params.tag } }
        ]
    })
    .then(blogs => res.json(blogs))
})



var apiRoutes = express.Router();

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function (req, res) {
  console.log("token");
  // find the user
 
  var token = jwt.sign(
    { name: req.body.name, password: req.body.password },
    config.secret,{ expiresIn: 60 * 60 }
  );
  console.log("token...................");

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) {
      console.log("error");
    }
    else
    {
      console.log("verified");
    }
  });

  // return the information including token as JSON
  res.json({
    success: true,
    message: 'Enjoy your token!',
    token: token
  });

});

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
  
    // decode token
    if (token) {
  
      // verifies secret and checks exp
      jwt.verify(token, config.secret, function(err, decoded) {       if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });       } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;         next();
        }
      });
  
    } else {
  
      // if there is no token
      // return an error
      return res.status(403).send({ 
          success: false, 
          message: 'No token provided.' 
      });
    }
  });

// protected route
app.get('/protected', passport.authenticate('jwt', { session: false }), function(req, res) {
    res.json({ msg: 'Congrats! You are seeing this because you are authorized'});
});

app.post('/UserReg',passport.authenticate('jwt',{session:false}),
(req,res)=>{
    console.log("gjhfjghjhvvbc")
    User.create(req.body)
        .then(user => res.json(user))
})

app.use('/api', apiRoutes);

const port = 3000
app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`)
})