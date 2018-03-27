var express = require('express')
var pug = require('pug')
var app = express()
var bodyparse = require('body-parser')

app.set('views', './views')
app.set('view engine', 'pug')

app.use(bodyparse.urlencoded({extended: true}))
app.use(express.static('public'))

require('dotenv').config()

console.log(process.env.user)

const { Client } = require('pg')
const client = new Client({
	database: 'bulletinboard',
	host: process.env.host,
	user: process.env.user,
	password: process.env.password
})

client.connect()

app.get('/', (req, res)=>{
	res.render('index')
})

app.get('/viewmessages', (req, res)=>{
	client.query('SELECT * FROM messages;', function(error, result) {
	console.log(error ? error.stack : result.rows)
	res.render('displaym', {messages: result.rows})
	})
})

app.post('/addmessage', (req, res)=>{
	var titleM = req.body.title
	var bodyM = req.body.body
	var queryHm = {
		text: `insert into messages (title, body) values ('${titleM}', '${bodyM}');`
	}
	client.query(queryHm, (error, result) => {
		console.log(error ? error.stack : 'this works')
		res.render('index')
	})

})

app.listen(3000, ()=> {
	console.log('listening')
})