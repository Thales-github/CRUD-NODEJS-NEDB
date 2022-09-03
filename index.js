const express = require("express"); // procurando o express na pasta node_modules através do método require()
const servidor = express(); // criando o servidor através do método express()
const NeDB = require("nedb"); //chamando biblioteca do banco de dados nedb para nossa aplicação
const db = new NeDB({
    filename: "produtos.db",// configurando o arquivo onde serão armazenados os dados do banco de dados
    autoload: true // informando que queremos que ele inicie automaticamente
}); // instanciando a classe nedb

/* servidor.use() cria um middleware(código que será executado antes da rota ser chamada,
neste caso queremos que o express leia todo dado enviado como JSON)*/
servidor.use(express.json());
servidor.use(express.urlencoded({ extended: true }));

servidor.get("/produtos", (req, res) => {
    db.find({}).exec((erro, dados) => {

        if (erro) {
            console.error(erro);
            return;
        }
        res.json(dados);
    });
});

servidor.post("/produtos", (req, res) => {
    res.json(req.body);

    db.insert(req.body, (erro, novoProduto) => {
        if (erro) {
            console.error(erro);
        } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(novoProduto);
        }
    });
});

/* definindo a porta que a aplicação vai utilizar nas chamadas http e em seguida passando 
uma função que será executada ao iniciarmos o serviço*/
servidor.listen(4000, () => {
    console.log("servidor iniciado");
});