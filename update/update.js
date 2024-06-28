const express = require('express')
let mongodb = require('mongodb')

const url = require('../url')

let mcl = mongodb.MongoClient

let router = express.Router()

let dbName = 'todo'

router.post("/updateTask",(req,res)=>{
    let taskid = req.body.taskid
    let username = req.body.username
    let obj = {
        "task":req.body.task,
        "status":req.body.status,
        "deadline":req.body.deadline
    }
    mcl.connect(url,(err,conn)=>{
        if(err)
            console.log('Error in connection:- ',err)
        else{
            let db = conn.db(dbName)
            db.collection('tasks').updateOne({taskid,username},{$set:obj},
                (err,result)=>{
                    if(err)
                        res.json({'taskUpdate':'Error'+err})
                    else{
                        if(result.matchedCount!=0){
                            console.log(`task data for ${username} updated`)
                            res.json({'taskUpdate':'success'})
                        }
                        else{
                            console.log('Record not updated')
                            res.json({'taskUpdate':'Record Not Found'})
                        }
                        conn.close()
                    }
                }
            )
        }
    })
})

module.exports = router