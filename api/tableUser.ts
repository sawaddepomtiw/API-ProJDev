import express from "express";
import { dbconn } from "../dbconnects";
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
router.post("/postTable-User", (req, res) => {

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