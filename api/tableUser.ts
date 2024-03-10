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
router.post("/post-TableUser", (req, res) => {

    if (req.query){
                
        const user: User = req.body;
        let sql = "INSERT INTO `user`(`email`, `password`, `name`, `role`) VALUES (?,?,?,?)";
        sql = mysql.format(sql, [
            user.email,
            user.password,
            user.name,
            user.role = 'user'
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