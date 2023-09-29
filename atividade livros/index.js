const express = require('express'); 
const port = 8000;
const exphbs = require('express-handlebars')
const app = express();
const mysql = require('mysql');
const jogos = require('./livros') 
const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "bancodedados",
    database: "biblioteca"
})

conn.connect((err) => {
    if (err) {
        console.log("deu ruim");
        console.log(err);
    }
    else {
        console.log("Conectando ao Banco de dados");
    }
})

//BODY
app.use(
    express.urlencoded({
        extended: true,
    }),
)
// importar JSON
app.use(express.json());



const hbs = exphbs.create({
    partialsDir: ['views/partials'] // --> Uso do Partials 
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.use("/livros", livros);


app.get('/', (req, res) => {
    const sql = 'select * from jogo';
    conn.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const jogos = data;
            res.render('home', { jogos })
        }
    })
})

app.get('/jogos/:id', (req, res) => {
    const id = req.params.id
    const sql = `select * from jogo where id_jogo = ${id}`;

    conn.query(sql, (err,data)=>{
        if(err){
            console.log(err);
        }
        else{
            const choicedGame = data[0];
            res.render ("jogo", {choicedGame});
        }
    })

})


app.use((req, res) => {
    res.status(404).render("404");
})


app.listen(port, () => {
    console.log("Projeto funcionando, acesse localhost:" + port);
})