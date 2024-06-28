const express = require('express')
let mongodb = require('mongodb')

const url = require('../url')

let mcl = mongodb.MongoClient

let router = express.Router()

let dbName = 'todo'

router.post('/deletetask',(req,res)=>{
    let obj = {
        "username":req.body.username,
        "taskid":req.body.taskid
    }
    mcl.connect(url,(err,conn)=>{
        if(err)
            console.log('Error in connection:- ',err)
        else{
            let db = conn.db(dbName)
            db.collection('tasks').deleteOne(obj,(err,result)=>{
                if(err)
                    res.json({'taskDelete':'Error'+err})
                else{
                    if(result.deletedCount != 0){
                        console.log(`Task data from ${obj.username} deleted`)
                        res.json({'taskDelete':'success'})
                    }
                    else{
                        console.log('Task Data not deleted')
                        res.json({'taskDelete':'Record Not Found'})
                    }
                    conn.close()
                }
            })
        }
    })
})

module.exports = router