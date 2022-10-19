const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Post = require('./models/post');
const User = require('./models/user');
const Comment = require('./models/comment');

const mongoDb = 'mongodb://127.0.0.1/mongoose-test';
mongoose.connect(mongoDb, {useNewUrlParser: true});
const db = mongoose.connection;

db.once('open', () => {
    console.log(`Connected to mongoDb at ${db.host}:${db.port}`);
});

db.on('error', (error) => {
    console.log(`Database Error: ${error}`);
})

app.use(express.urlencoded({ extended: false}));

//----------------------------- POSTMAN STUFF FOR USER --------------------------------------
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to our API'
    })
})
 
//load all users
app.get('/users', (req, res) => {
    User.find({})
    .then(users => {
        console.log('All users', users);
        res.json({ users: users });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

//load users with a given email
app.get('/users/:email', (req, res) => {
    console.log('find user by', req.params.email)
    User.findOne({
        email: req.params.email
    })
    .then(User => {
        console.log('Here is the user', User.name);
        res.json({ User: User });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

//post a user
app.post('/users', (req, res) => {
    User.create({
        name: req.body.name,
        email: req.body.email,
        meta: {
            age: req.body.age,
            website: req.body.website
        }
    })
    .then(user => {
        console.log('New user =>>', user);
        res.json({ user: user });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});

//update a user
app.put('/users/:email', (req, res) => {
    console.log('route is being on PUT')
    User.findOne({ email: req.params.email })
    .then(foundUser => {
        console.log('User found', foundUser);
        User.findOneAndUpdate({ email: req.params.email }, 
        { 
            name: req.body.name ? req.body.name : foundUser.name,
            email: req.body.email ? req.body.email : foundUser.email,
            meta: {
                age: req.body.age ? req.body.age : foundUser.age,
                website: req.body.website ? req.body.website : foundUser.website
            }
        })
        .then(User => {
            console.log('User was updated', User);
            res.json({ User: User })
        })
        .catch(error => {
            console.log('error', error) 
            res.json({ message: "Error ocurred, please try again" })
        })
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    })
});

//delete a user
app.delete('/users/:email', (req, res) => {
    User.findOneAndRemove({ email: req.params.email })
    .then(response => {
        console.log('This was delete', response);
        res.json({ message: `${req.params.email} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});
//----------------------------- END POSTMAN STUFF FOR USER--------------------------------------

//-----------------------------POSTMAN STUFF FOR COMMENTS --------------------------------------

// //load all comments
// app.get('/comments', (req, res) => {
//     Comment.find({})
//     .then(comments => {
//         console.log('All comments', comments);
//         res.json({ comments: comments });
//     })
//     .catch(error => { 
//         console.log('error', error);
//         res.json({ message: "Error ocurred, please try again" });
//     });
// });

// //load comments with a given email
// app.get('/comments/:email', (req, res) => {
//     console.log('find comments by', req.params.email)
//     Comment.findOne({
//         email: req.params.email
//     })
//     .then(Comment => {
//         console.log('Here is the comment', Comment.name);
//         res.json({ Comment: Comment });
//     })
//     .catch(error => { 
//         console.log('error', error);
//         res.json({ message: "Error ocurred, please try again" });
//     });
// });

// //post a comment
// app.post('/comments', (req, res) => {
//     Comment.create({
//         name: req.body.name,
//         email: req.body.email,
//         meta: {
//             age: req.body.age,
//             website: req.body.website
//         }
//     })
//     .then(Comment => {
//         console.log('New Comment =>>', Comment);
//         res.json({ Comment: Comment });
//     })
//     .catch(error => { 
//         console.log('error', error) 
//         res.json({ message: "Error ocurred, please try again" })
//     });
// });

// //update a user
// app.put('/comments/:email', (req, res) => {
//     console.log('route is being on PUT')
//     Comment.findOne({ email: req.params.email })
//     .then(foundComment => {
//         console.log('Comment found', foundComment);
//         Comment.findOneAndUpdate({ email: req.params.email }, 
//         { 
//             name: req.body.name ? req.body.name : foundComment.name,
//             email: req.body.email ? req.body.email : foundComment.email,
//             meta: {
//                 age: req.body.age ? req.body.age : foundComment.age,
//                 website: req.body.website ? req.body.website : foundComment.website
//             }
//         })
//         .then(Comment => {
//             console.log('Comment was updated', Comment);
//             res.json({ Comment: Comment })
//         })
//         .catch(error => {
//             console.log('error', error) 
//             res.json({ message: "Error ocurred, please try again" })
//         })
//     })
//     .catch(error => {
//         console.log('error', error) 
//         res.json({ message: "Error ocurred, please try again" })
//     })
// });

// //delete a user
// app.delete('/Comment/:email', (req, res) => {
//     Comment.findOneAndRemove({ email: req.params.email })
//     .then(response => {
//         console.log('This was delete', response);
//         res.json({ message: `${req.params.email} was deleted`});
//     })
//     .catch(error => {
//         console.log('error', error) 
//         res.json({ message: "Error ocurred, please try again" });
//     })
// });
// //----------------------------- END POSTMAN STUFF FOR COMMENTS--------------------------------------

// //-----------------------------POSTMAN STUFF FOR POSTS --------------------------------------

 
// //load all posts
// app.get('/posts', (req, res) => {
//     Post.find({})
//     .then(posts => {
//         console.log('All posts', posts);
//         res.json({ posts: posts });
//     })
//     .catch(error => { 
//         console.log('error', error);
//         res.json({ message: "Error ocurred, please try again" });
//     });
// });

// //load users with a given email
// app.get('/posts/:email', (req, res) => {
//     console.log('find Post by', req.params.email)
//     Post.findOne({
//         email: req.params.email
//     })
//     .then(Post => {
//         console.log('Here is the Post', Post.name);
//         res.json({ user: Post });
//     })
//     .catch(error => { 
//         console.log('error', error);
//         res.json({ message: "Error ocurred, please try again" });
//     });
// });

// //post a user
// app.post('/posts', (req, res) => {
//     User.create({
//         name: req.body.name,
//         email: req.body.email,
//         meta: {
//             age: req.body.age,
//             website: req.body.website
//         }
//     })
//     .then(Post => {
//         console.log('New Post =>>', Post);
//         res.json({ Post: Post });
//     })
//     .catch(error => { 
//         console.log('error', error) 
//         res.json({ message: "Error ocurred, please try again" })
//     });
// });

// //update a user
// app.put('/posts/:email', (req, res) => {
//     console.log('route is being on PUT')
//     Post.findOne({ email: req.params.email })
//     .then(foundPost => {
//         console.log('Post found', foundPost);
//         Post.findOneAndUpdate({ email: req.params.email }, 
//         { 
//             name: req.body.name ? req.body.name : foundPost.name,
//             email: req.body.email ? req.body.email : foundPost.email,
//             meta: {
//                 age: req.body.age ? req.body.age : foundPost.age,
//                 website: req.body.website ? req.body.website : foundPost.website
//             }
//         })
//         .then(Post => {
//             console.log('Post was updated', Post);
//             res.json({ Post: uPostser })
//         })
//         .catch(error => {
//             console.log('error', error) 
//             res.json({ message: "Error ocurred, please try again" })
//         })
//     })
//     .catch(error => {
//         console.log('error', error) 
//         res.json({ message: "Error ocurred, please try again" })
//     })
// });

// //delete a user
// app.delete('/posts/:email', (req, res) => {
//     Post.findOneAndRemove({ email: req.params.email })
//     .then(response => {
//         console.log('This was delete', response);
//         res.json({ message: `${req.params.email} was deleted`});
//     })
//     .catch(error => {
//         console.log('error', error) 
//         res.json({ message: "Error ocurred, please try again" });
//     })
// });
//----------------------------- END POSTMAN STUFF FOR POSTS--------------------------------------

// mongoose fetch statements
// app.get('/' , (req, res) => {
//     const bobby = new User({
//         name: 'Robert',
//         email: 'Bobby@test.com',
//         meta: {
//             age: 30, 
//             website: 'https://chris.me'
//         }
//     });
    
//     bobby.save((err) => {
//         if (err) return console.log(err);
//         console.log('User Created!');
//     });

//     res.send(bobby.sayHello());
// })

// app.get('/findAll', (req,res) => {
//     User.find({}, (err, users) => {
//         if (err) res.send(`Failed to find record, mongodb error ${err}`);
//         res.send(users);
//     })
// })

// app.get('/findById/:id', (req,res) => {
//     User.findById(req.params.id, (err, users) => {
//         if (err) res.send(`Failed to find record by Id, mongodb error ${err}`);
//         res.send(users);
//     })

    //find by Id without the findByID command, not ideal
    // User.find({_id: mongoose.Types.ObjectId(req.params.id)}, (err, users) => {
    //     if (err) res.send(`Failed to find record by Id, mongodb error ${err}`);
    //     res.send(users);
    // })
// })

// app.get('/findByEmail/:email', (req,res) => {
//     User.findOne({email: req.params.email}, (err, users) => {
//         if (err) res.send(`Failed to find record by email, mongodb error ${err}`);
//         res.send(users);
//     })
// })

//Mongoose create statements
// creating users directly form model using model.save() and creating user using mode.Create
// User.create({
//     name: 'created using Create()',
//     email: 'Tester2@gmail.com'
// })

// const newUser = new User({
//     name: 'created using new USer and Save()',
//     email: 'Tester3@gmail.com'
// });

// newUser.save((err) => {
//     if (err) return console.log(err);
//     console.log('created new user');
// })

// Creating a simple post document in the post collection
// Post.create({
//     content: 'This ia pst content...'
// });

// Mongoose update statements

// User.updateOne({name: 'Robert'}, {
//     meta: {
//         age: 56
//     }
// }, (err, updateOutcome) => {
//     if(err) return console.log(err);
//     console.log(`updated user: ${updateOutcome.matchedCount} : ${updateOutcome.modifiedCount}`)
// });

// Returns full object prior to update
// User.findOneAndUpdate({name: 'Robert'},
// {
//     meta: {
//         age: 61,
//         website: 'somethingNew.com'
//     }
// }, (err, user) => {
//     if(err) return console.log(err);
//     console.log(user);
// })

// mongoose delete statements(deletes all that match)
// User.remove({name: 'Robert'}, (err) => {
//     if (err) return console.log(err)
//     console.log('user record deleted');
// })
// finds first instance of chris and deletes it
// User.findOneAndRemove({name: 'Chris'}, (err, user) => {
//     if(err) return console.log(err);
//     console.log(user);
// })

// Post schema with association to comments

// const newPost = new Post({
//     title: " our first post",
//     body: 'Some body text for our post',
// })

// newPost.comments.push({
//     header: "our first comment",
//     content: 'this is my comment text',
// })

// newPost.save(function(err) {
//     if (err) return console.log(err)
//     console.log(`Created post`);
// })

// creating post with reference to a comment

// const refPost = new Post({
//     title: 'testing post 1004',
//     body: 'Body for ref by comments', 
// });

// const refComment = new Comment({
//     header: "Our ref comment tester",
//     content: 'this is my ref comment text',
// });
// refComment.save();

// refPost.refComments.push(refComment);
// refPost.save();

// // find all comments on a post by ref
// // populate should be done via the field name on the parent document, in this case post, so because our refComments are on post.refComments we'll pass 'refComments' into our populate method
// Post.findOne({title: 'testing post 1003'}).populate('refComments').exec((err, post) => {
//     console.log(post);
// });

// app.listen(8000, () => {
//     console.log('Running port 8000')
// });