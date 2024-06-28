const express = require('express')
let mongodb = require('mongodb')

const url = require('../url')

let mcl = mongodb.MongoClient
let router = express.Router()

let dbName = 'todo'

router.post("/createUser",(req,res)=>{
    let obj = {
        "username": req.body.username,
        "upwd": req.body.upwd,
        "u_email":req.body.u_email
    }
    mcl.connect(url,(err,conn)=>{
        if(err)
            console.log("Error in connection:- ",err)
        else{
            let db = conn.db(dbName)
            db.collection('users').insertOne(obj,(err)=>{
                if(err)
                    res.json({'userInsert':'Error'+err})
                else{
                    console.log("User Inserted")
                    res.json({'UserInsert':'success'})
                    conn.close()
                }
            })
        }
    })
})

router.post("/taskInsert", (req, res) => {
    // Check if task is null or empty
    if (!req.body.task || req.body.task.trim() === "") {
        return res.json({ 'taskInsert': 'Error - Task cannot be empty' });
    }

    let deadlineDate = new Date(req.body.deadline); // Convert deadline string to Date object
    let obj = {
        "username": req.body.username,
        "taskid": req.body.taskid,
        "task": req.body.task,
        "status": req.body.status,
        "deadline": deadlineDate // Use the Date object here
    };

    mcl.connect(url, (err, conn) => {
        if (err) {
            console.log('Error in connection:- ', err);
        } else {
            let db = conn.db(dbName);
            db.collection('tasks').insertOne(obj, (err) => {
                if (err) {
                    res.json({ 'taskInsert': 'Error ' + err });
                } else {
                    console.log("Task inserted");
                    res.json({ 'taskInsert': 'success' });
                    conn.close();
                }
            });
        }
    });
});
module.exports = router