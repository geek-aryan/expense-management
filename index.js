const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

mongoose.connect(`mongodb+srv://${process.env.mongoUser}:${process.env.mongoPassword}@cluster0.d5u8cux.mongodb.net/expenseDB`)
const recordSchema = {
    category : String,
    name : String,
    date : { type: Date, default: Date.now },
    price : Number,
    status : { type: Boolean, default: true },
}
const Record = mongoose.model('Record',recordSchema)


app.get('/', (req, res) => {
  res.redirect('/expense')
})
app.get('/login', (req, res) => {
  res.render('Login',{title:'Login Expense'})
})
app.get('/register', (req, res) => {
  res.render('Register',{title:'Register Expense'})
})
app.get('/expense', (req, res) => {
  res.render('Expense',{title:'Expense'})
})
app.get('/records', (req, res) => {
    Record.find({},(err,rec)=>{
        if(err)
            res.send('Some error <a href="/expense">Click Here<a> To go back')
        else{
            res.render('Records',{title:'All Expenses Records', allRecords : rec})
        }
    })
  
})

app.post('/expense', (req, res) => {
    const name = req.body.name
    const cat = req.body.category
    const date = req.body.date
    const price = req.body.price
    console.log(cat,date,price)
    const record = new Record(
        {
            category : cat,
            name : name,
            date : date,
            price : price,
        }
    )
    record.save().then(afterRecord=>{
        if(afterRecord===record){
            res.redirect('/records')
            // res.send('Successfully saved <a href="/expense">Click Here<a> To go back')
        }
    })
})


app.patch('/record/:recordId',(req,res)=>{
    Record.updateOne({_id:req.params.recordId}, {$set : {status : false}},(err,foundRecord)=>{
        if (!err){
            // console.log(foundRecord)
            res.send(JSON.stringify(foundRecord))
        }
           
        else
            res.send('No found')  
    })
})

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}`)
})