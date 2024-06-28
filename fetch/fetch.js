const express = require('express')
let mongodb = require('mongodb')

const url = require('../url')

let mcl = mongodb.MongoClient
let router = express.Router()
let dbName = 'todo'

router.post("/", (req, res) => {
    mcl.connect(url, (err, conn) => {
        if (err)
            console.log('Error in connection:- ', err);
        else {
            let db = conn.db(dbName);
            // Adjusted to only select the username field
            db.collection('users').find({}, { projection: { _id: 0, username: 1 } }).toArray((err, users) => {
                if (err)
                    console.log(err);
                else {
                    if (users.length > 0)
                        // Adjusted to send an array of usernames
                        res.json({ 'users': users});
                    console.log('Auth response sent');
                    conn.close();
                }
            });
        }
    });
})

router.post("/auth",(req,res)=>{
    let username = req.body.username
    let upwd = req.body.upwd
    let obj = {username,upwd}

    mcl.connect(url, (err,conn)=>{
        if(err)
            console.log('Error in connection:- ',err)
        else{
            let db = conn.db(dbName)
            db.collection('users').find(obj).toArray((err,array) => {
                if(err)
                    console.log(err)
                else{
                    if(array.length > 0)
                        res.json({'auth':'success', 'user':username})
                    else
                        res.json({'auth':'failed'})
                    console.log('Auth response sent')
                    conn.close()
                }
            })
        }
    })
})

router.post("/fetch",(req,res)=>{
    let username = req.body.username
    let obj = {username}

    mcl.connect(url,(err,conn)=>{
        if(err)
            console.log('Error in connection')
        else{
            let db = conn.db(dbName)
            db.collection('tasks').find(obj).toArray((err,array)=>{
                if(err)
                    console.log(err)
                else{
                    res.json(array)
                    console.log(`tasks response for ${obj.username} sent`)
                    conn.close()
                }
            })
        }
    })
})
module.exports = router