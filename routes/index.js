var express = require('express');
const res = require('express/lib/response');
const { threadId } = require('../lib/db');
// const { response } = require('../app');
const conn = require('../lib/db');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
            res.render('index',
            {
                title: "BMI CALCULATOR"
            });
        
});

router.post('/user', (req,res)=>{
    let data = {
                  frst_nm : req.body.f_nm,
                  last_nm : req.body.l_nm,
                  weight : req.body.wt,
                  height : req.body.ht
               }

    let sql = "INSERT INTO person SET ?"

    conn.query(sql, data, (err, rows)=>{
        if(err) throw err
        res.redirect('/')
    })
})

router.get('/persons', (req, res)=>{
    let sql ="SELECT * FROM person"

    conn.query(sql, (err, rows)=>{
        if(err) throw err
        res.render("bmiCalc",{
            data:rows
        })
    })
})

router.get('/bmi/:id', (req, res)=>{
    let sql = `SELECT * FROM person WHERE id = ${req.params.id}`

    conn.query(sql, (err, rows)=>{
        if(err) throw err
        res.render('calc',{
            data: rows[0]
        })
    })
})

router.post("/addbmi", (req,res)=>{
    let height = req.body.ht
    let weight = req.body.wt
    let BMI = (weight/height).toFixed(2);
    let catVal = 0;
    
    if( BMI <= 20.89){
        catVal = 1//under weight
    }else if( BMI >= 20.90 && BMI <= 26.59 ){
        catVal = 2//normal
    }else if(BMI >= 26.60 && BMI <= 50.19){
        catVal = 3//over weight
    }else if (BMI > 50.19){
        catVal = 4//obese
    }
    
    let sql = `INSERT INTO weightapp6.bmi (person_id, category_id, bmi) VALUES (${req.body.id}, ${catVal}, ${BMI})`
    conn.query(sql, (err, rows)=>{
        console.log(sql);
        if(err) throw err
        res.redirect('/')
    })
})

router.get('/allbmi', (req, res)=>{
    let sql="SELECT p.frst_nm AS Firstname, p.last_nm AS Lastname,c.category AS Category, b.bmi AS BMI FROM weightapp6.bmi AS b JOIN weightapp6.person AS p ON b.person_id = p.id JOIN weightapp6.category AS c ON b.category_id = c.id"

    conn.query(sql, (err, rows)=>{
        if(err) throw err
        res.render('allBMI',{
            data: rows
        })
    })
})

router.get('/aggregates', (req, res)=>{
    let sql="SELECT sum(bmi) AS Sum,max(bmi) AS Max, round(avg(bmi) ,2) AS Average, min(bmi) AS Min,count(bmi) AS Total FROM weightapp6.bmi"
    conn.query(sql, (err, rows)=>{
        if(err) throw err
        res.render('aggregate',{
            data: rows
        });
    });
});

module.exports = router