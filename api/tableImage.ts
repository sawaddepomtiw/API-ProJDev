import { ImageModel } from './../MODEL/getpostputdelete';
import mysql from 'mysql';
import { dbconn, queryAsync, queryPromise } from "../dbconnects";
import express from "express";
export const router = express.Router();
const Chart = require('chart.js');


router.get("/select-all", (req, res) => {
    if (req.query) {

        dbconn.query('SELECT * FROM image', (err, result) => {
            res.status(201).json(result);
        });
    } else {
        res.status(201).send("error!");
    }
});

router.get("/select/:id", (req, res) => {
    let id = req.params.id;
    dbconn.query("SELECT * FROM image WHERE imid = ?", [id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});
router.put("update/:id", (req, res) => {
    let id = +req.params.id;
    let image: ImageModel = req.body;
    let sql = "UPDATE `image` set (`score`, `voteTOTAL` ) WHERE `imid` VALUES (?,?,?)";
    sql = mysql.format(sql, [
        image.score,
        image.voteTOTAL,
        id
    ]);
    dbconn.query(sql, (err, result) => {
        if (err) throw err;
        res
            .status(201)
            .json({ affected_row: result.affectedRows });
    });
});

router.put("/:id", async (req, res) => {
    //1 
    const id = req.params.id; //ตัวแปรโง่    
    let image: ImageModel = req.body; //อีกตัว

    //Query original data by id
    let imageModel: ImageModel | undefined;
    let sql = mysql.format("select * from image where imid = ?", [id]);
    let result = await queryPromise(sql);
    const jsonStr = JSON.stringify(result);
    const jsonObj = JSON.parse(jsonStr);
    const rawData = jsonObj;
    imageModel = rawData[0];

    //merge recive
    const updateTrip = { ...imageModel, ...image };
    sql = "update `image` set `score`= ?, `voteTOTAL`= ? where `imid`= ?";

    //update
    sql = mysql.format(sql, [
        updateTrip.score, updateTrip.voteTOTAL, id
    ]);
    dbconn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(200).json({
            affected_row: result.affectedRows
        });
    })
});

router.get("/selectemail", (req, res) => {
    dbconn.query(
        "SELECT * FROM user WHERE email = ?",
        [req.query.email],
        (err, result) => {
            if (err) throw err;
            res.json(result);
        }
    );
});

router.post("/insertImg", (req, res) => {

    if (req.query) {

        const Img: ImageModel = req.body;
        let sql = `INSERT INTO image (uid, name, score, voteTOTAL, url)
                    SELECT ?, ?, ?, ?, ?
                    FROM DUAL
                    WHERE NOT EXISTS (
                        SELECT 1
                        FROM image
                        WHERE uid = ?
                        HAVING COUNT(*) >= 5)`;
        sql = mysql.format(sql, [
            Img.uid,
            Img.name,
            Img.score,
            Img.voteTOTAL,
            Img.url,
            Img.uid,
        ]);
        dbconn.query(sql, (err, result) => {
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

// let asql = "SELECT * FROM image ORDER BY score DESC;";


router.get("/count/:uid", (req, res) => {
    let uid = req.params.uid;
    dbconn.query("SELECT COUNT(*) AS count FROM image WHERE uid = ?", [uid], (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
});

// router.get("/order", (req, res) => {
//     dbconn.query("SELECT image.imid, \
//     IFNULL(MAX(vote.timestamp), '') AS latest_timestamp, \
//     image.score AS new_score, \
//     IFNULL((SELECT vote.score FROM vote WHERE vote.imid = image.imid ORDER BY vote.timestamp DESC LIMIT 1), '') AS latest_vote_score \
//     FROM image \
//     LEFT JOIN vote ON image.imid = vote.imid AND DATE(vote.timestamp) = CURDATE() - INTERVAL 2 DAY \
//     GROUP BY image.imid \
//     ORDER BY image.score DESC;"
//     , (err, result) => {
//         if (err) throw err;
//         let orderedArray = [];
//         for (let i = 0; i < result.length; i++) {
//             result[i].order = i + 1;
//             orderedArray.push(result[i]);
//         }
//         res.json(orderedArray);
//     });
// });


router.delete("/delete-tableImage/:id", (req, res) => {
    let id = +req.params.id;
    dbconn.query("DELETE image, vote \
    FROM image \
    LEFT JOIN vote ON image.imid = vote.imid \
    WHERE image.imid = ? AND (vote.imid = ? OR vote.imid IS NULL)", [id, id], (err, result) => {
        if (err) {
            console.error("Error deleting data:", err);
            res.status(500).json({ error: "An error occurred while deleting data" });
            return;
        }
        res.status(200).json({ affected_row: result.affectedRows });
    });
});



router.put("/put-tableImage/dynamic/:id", async (req, res) => {
    let id = +req.params.id;
    let image: ImageModel = req.body;
    let imageOriginal: ImageModel | undefined;

    let sql = mysql.format("SELECT * FROM image WHERE imid = ?", [id]);

    let result = await queryAsync(sql);
    const rawData = JSON.parse(JSON.stringify(result));
    imageOriginal = rawData[0] as ImageModel;

    let updateImage = { ...imageOriginal, ...image };

    sql = "UPDATE `image` SET `uid` = ?, `name` = ?, `score` = ?, `voteTOTAL` = ?, `url` = ? WHERE `imid` = ?";

    sql = mysql.format(sql, [
        updateImage.uid,
        updateImage.name,
        updateImage.score,
        updateImage.voteTOTAL,
        updateImage.url,
        id
    ]);

    dbconn.query(sql, (err, result) => {
        if (err) throw err;
        if (result) {
            sql = "DELETE FROM vote WHERE `imid` = ?";
            sql = mysql.format(sql, [id]);
            dbconn.query(sql, (err, resultdel) => {
                if (err) throw err;
                res.status(201).json({
                    update_affected_rows: result.affectedRows,
                    delete_affected_rows: resultdel.affectedRows
                });
            });
        }

    });
});

router.get("/order", (req, res) => {
    dbconn.query(`
            SELECT 
            image.imid, 
            IFNULL(MAX(vote.timestamp), '') AS latest_timestamp, 
            image.score AS new_score, 
            IFNULL((SELECT vote.score 
                    FROM vote 
                    WHERE vote.imid = image.imid 
                    AND DATE(vote.timestamp) = CURDATE() - INTERVAL 1 DAY 
                    ORDER BY vote.timestamp DESC LIMIT 1), '') AS latest_vote_score, 
            image.url,
            image.name,
            uploader.profile
        FROM 
            image 
        LEFT JOIN 
            user AS uploader ON image.uid = uploader.uid
        LEFT JOIN 
            vote ON image.imid = vote.imid AND DATE(vote.timestamp) = CURDATE() - INTERVAL 1 DAY 
        GROUP BY 
            image.imid 
        ORDER BY 
            image.score DESC`,
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error retrieving data from database");
                return;
            }
            // Send the result back to the client
            res.json(result);
            // Extract new_score and last_vote_score from the result
            const new_score = result[0].new_score;
            const last_vote_score = result[0].latest_vote_score;
        }
    );
});

router.get("/order/graph/:id", (req, res) => {
    dbconn.query(`
            SELECT 
            user.uid,
            image.imid, 
            image.score AS new_score, 
            IFNULL((SELECT vote.score 
                    FROM vote 
                    WHERE vote.imid = image.imid 
                    AND DATE(vote.timestamp) = CURDATE() - INTERVAL 1 DAY 
                    ORDER BY vote.timestamp DESC LIMIT 1), '') AS latest_vote_score_day_1,
            IFNULL((SELECT vote.score 
                    FROM vote 
                    WHERE vote.imid = image.imid 
                    AND DATE(vote.timestamp) = CURDATE() - INTERVAL 2 DAY 
                    ORDER BY vote.timestamp DESC LIMIT 1), '') AS latest_vote_score_day_2,
            IFNULL((SELECT vote.score 
                    FROM vote 
                    WHERE vote.imid = image.imid 
                    AND DATE(vote.timestamp) = CURDATE() - INTERVAL 3 DAY 
                    ORDER BY vote.timestamp DESC LIMIT 1), '') AS latest_vote_score_day_3,
            IFNULL((SELECT vote.score 
                    FROM vote 
                    WHERE vote.imid = image.imid 
                    AND DATE(vote.timestamp) = CURDATE() - INTERVAL 4 DAY 
                    ORDER BY vote.timestamp DESC LIMIT 1), '') AS latest_vote_score_day_4,
            IFNULL((SELECT vote.score 
                    FROM vote 
                    WHERE vote.imid = image.imid 
                    AND DATE(vote.timestamp) = CURDATE() - INTERVAL 5 DAY 
                    ORDER BY vote.timestamp DESC LIMIT 1), '') AS latest_vote_score_day_5,
            IFNULL((SELECT vote.score 
                    FROM vote 
                    WHERE vote.imid = image.imid 
                    AND DATE(vote.timestamp) = CURDATE() - INTERVAL 6 DAY 
                    ORDER BY vote.timestamp DESC LIMIT 1), '') AS latest_vote_score_day_6,
            IFNULL((SELECT vote.score 
                    FROM vote 
                    WHERE vote.imid = image.imid 
                    AND DATE(vote.timestamp) = CURDATE() - INTERVAL 7 DAY 
                    ORDER BY vote.timestamp DESC LIMIT 1), '') AS latest_vote_score_day_7,
            image.url,
            image.name
        FROM 
            image 
        LEFT JOIN 
            vote ON image.imid = vote.imid
        LEFT JOIN 
            user ON image.uid = user.uid
        WHERE
            user.uid = ?
        GROUP BY 
            image.imid 
        ORDER BY 
            new_score DESC`, [req.params.id], // ใช้ req.params.id เพื่อรับค่า id จาก URL
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error retrieving data from database");
                return;
            }
            // ส่งผลลัพธ์กลับไปยังไคลเอนต์
            res.json(result);
        }
    );
});
