import express from "express";
import { dbconn, queryPromise } from "../dbconnects";
import { User } from "../MODEL/getpostputdelete";
import mysql from "mysql";

export const router = express.Router();

// get tableuser
router.get("/get-TableUser", (req, res) => {
    
    if (req.query){
                
        const sql = "select * from user";
        dbconn.query(sql, (err, result) => {
            res.status(201).json(result);   
        });
    } else {
        res.status(201).send("error!");
    }
});
// post user
router.post("/post-TableUser", (req, res) => {

    if (req.query){
                
        const user: User = req.body;
        let sql = "INSERT INTO `user`(`email`, `password`, `name`, `profile`, `role`) VALUES (?,?,?,?,?)";
        sql = mysql.format(sql, [
            user.email,
            user.password,
            user.name,
            user.profile = 'https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png',
            user.role = 'user',
        ]);
        dbconn.query(sql, (err, result) =>{
            if (err) throw err;
            res.status(201).json({
                affected_rows: result.affectedRows,
                last_idx: result.insertId
            });
        });
    } else {
        res.status(201).send("error!");
    }
});

router.put("/put-TableUser/all/:id", (req, res) => {
    let id = +req.params.id;
    let image: User = req.body;
    let sql = "UPDATE `user` set (`profile` ) WHERE `uid` VALUES (?,?)";
    sql = mysql.format(sql, [
        image.profile,
        id
    ]);
    dbconn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows });
    });
  });

router.put("/put-TableUser/:id",async(req, res)=>{
    //1 
    const id = req.params.id; //ตัวแปรโง่
    let user : User = req.body; //อีกตัว

    //Query original data by id
    let UserModel : User | undefined;
    let sql = mysql.format("select * from user where uid = ?",[id]);
    let result = await queryPromise(sql);
    const jsonStr = JSON.stringify(result);
    const jsonObj = JSON.parse(jsonStr);
    const rawData = jsonObj;
    UserModel = rawData[0];

    //merge recive
    const updateUser = {...UserModel, ...user};
    sql ="update `user` set `profile`= ? where `uid`= ?";

    //update
    sql = mysql.format(sql, [
        updateUser.profile, id
    ]);
    dbconn.query(sql, (err, result)=>{
        if (err) throw err;
        res.status(200).json({
            affected_row: result.affectedRows
        });
    })
    console.log(result);
});
router.put("/put-TableUser/Name/:id",async(req, res)=>{
    //1 
    const id = req.params.id; //ตัวแปรโง่
    let user : User = req.body; //อีกตัว

    //Query original data by id
    let UserModel : User | undefined;
    let sql = mysql.format("select * from user where uid = ?",[id]);
    let result = await queryPromise(sql);
    const jsonStr = JSON.stringify(result);
    const jsonObj = JSON.parse(jsonStr);
    const rawData = jsonObj;
    UserModel = rawData[0];

    //merge recive
    const updateUser = {...UserModel, ...user};
    sql ="update `user` set `name`= ? where `uid`= ?";

    //update
    sql = mysql.format(sql, [
        updateUser.name, id
    ]);
    dbconn.query(sql, (err, result)=>{
        if (err) throw err;
        res.status(200).json({
            affected_row: result.affectedRows
        });
    })
    console.log(result);
});
router.put("/put-TableUser/Pass/:id",async(req, res)=>{
    //1 
    const id = req.params.id; //ตัวแปรโง่
    let user : User = req.body; //อีกตัว

    //Query original data by id
    let UserModel : User | undefined;
    let sql = mysql.format("select * from user where uid = ?",[id]);
    let result = await queryPromise(sql);
    const jsonStr = JSON.stringify(result);
    const jsonObj = JSON.parse(jsonStr);
    const rawData = jsonObj;
    UserModel = rawData[0];

    //merge recive
    const updateUser = {...UserModel, ...user};
    sql ="update `user` set `password`= ? where `uid`= ?";

    //update
    sql = mysql.format(sql, [
        updateUser.password, id
    ]);
    dbconn.query(sql, (err, result)=>{
        if (err) throw err;
        res.status(200).json({
            affected_row: result.affectedRows
        });
    })
    console.log(result);
});
