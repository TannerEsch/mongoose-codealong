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

//load all comments
app.get('/comments', (req, res) => {
    Comment.find({})
    .then(comments => {
        console.log('All comments', comments);
        res.json({ comments: comments });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

//load comments with a given id
app.get('/posts/:id/comments', (req, res) => {
    console.log('find comments by', req.params.id)
    Comment.findById(req.params.id)
    .then(Comment => {
        console.log('Here is the comment', Comment);
        res.json({ Comment: Comment });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

//post a comment
app.post('/posts/:id/comments', (req, res) => {
    Post.findById(req.params.id)
    .then(post => {
        console.log('Heyyy, this is the post', post);
        // create and pust comment inside of post
        Comment.create({
            header: req.body.header,
            content: req.body.content
        })
        .then(createdComment => {
            post.comments.push(createdComment);
            // save the post
            post.save();
            res.redirect(`/posts/${req.params.id}`);
        })
        .catch(error => { 
            console.log('error', error);
            res.json({ message: "Error ocurred, please try again 1" });
        });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again 2" });
    });
});

//update a comment
app.put('/comments/:id', (req, res) => {
    console.log('route is being on PUT')
    Comment.findById({ id: req.params.id })
    .then(foundComment => {
        console.log('Comment found', foundComment);
        Comment.findByIdAndUpdate({ id: req.params.id }, 
        { 
            header: req.body.header ? req.body.header : foundComment.header,
            content: req.body.content ? req.body.content : foundComment.content,
        })
        .then(Comment => {
            console.log('Comment was updated', Comment);
            res.redirect( `/comments/${req.params.id}` )
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

//delete a comment
app.delete('/Comment/:id', (req, res) => {
    Comment.findByIdAndRemove(req.params.id)
    .then(response => {
        console.log('This was delete', response);
        res.json({ message: `${req.params.email} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});
// //----------------------------- END POSTMAN STUFF FOR COMMENTS--------------------------------------

// //-----------------------------POSTMAN STUFF FOR POSTS --------------------------------------

 
// //load all posts
app.get('/posts', (req, res) => {
    Post.find({})
    .then(posts => {
        console.log('All posts', posts);
        res.json({ posts: posts });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

//load posts with a given title
// app.get('/posts/:title', (req, res) => {
//     console.log('find Post by', req.params.title)
//     Post.findOne({
//         title: req.params.title
//     })
//     .then(Post => {
//         console.log('Here is the Post', Post);
//         res.json({ Post: Post });
//     })
//     .catch(error => { 
//         console.log('error', error);
//         res.json({ message: "Error ocurred, please try again" });
//     });
// });

//can only have one of these routes above/below

//load posts with a given id
app.get('/posts/:id', (req,res) => {
    Post.findById(req.params.id)
    .then(post => {
        console.log('This post', post);
        res.json({ post: post });
    })
    .catch(error => { 
        console.log('error >>>>>>', error) 
    });
});

//post a post
app.post('/posts', (req, res) => {
    Post.create({
        title: req.body.title,
        body: req.body.body,
    })
    .then(Post => {
        console.log('New Post =>>', Post);
        res.json({ Post: Post });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});

//update a post
app.put('/posts/:id', (req, res) => {
    console.log('route is being on PUT')
    Post.findOne({ id: req.params.id })
    .then(foundPost => {
        console.log('Post found', foundPost);
        Post.findOneAndUpdate({ id: req.params.id }, 
        { 
            title: req.body.title ? req.body.title : foundPost.title,
            body: req.body.body ? req.body.body : foundPost.body,
        })
        .then(Post => {
            console.log('Post was updated', Post);
            res.redirect( `/posts/${req.params.id}` )
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

//delete a post
app.delete('/posts/:id', (req, res) => {
    Post.findOneAndRemove(req.params.id)
    .then(response => {
        console.log('This was delete', response);
        res.json({ message: `${req.params.id} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});
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

app.listen(8000, () => {
    console.log('Running port 8000')
});