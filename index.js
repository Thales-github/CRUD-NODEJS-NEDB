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
        res.status(200).json(dados);
    });
});

servidor.post("/produtos", (req, res) => {
    // res.json(req.body);

    db.insert(req.body, (erro, novoProduto) => {
        if (erro) {
            console.error(erro);
        } else {

            res.setHeader("Content-Type", "application/json");
            res.status(200).json(novoProduto);
        }
    });
});

// req.body recupera os dados enviados da requisição
// req.params recupera os dados enviados da URL da requisição
servidor.put("/produtos/:codigoProduto", (req, res) => {
    // res.status(200).send(req.params.codigoProduto);
    // res.status(200).send(req.body);

    db.update({
        _id: req.params.codigoProduto
    }, req.body, (erro) => {
        if (erro) {
            console.error(erro);
        } else {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json({
                mensagem: `Produto atualizado: ${req.params.codigoProduto}`,
            });
        }
    });
});

/* definindo a porta que a aplicação vai utilizar nas chamadas http e em seguida passando 
uma função que será executada ao iniciarmos o serviço*/
servidor.listen(4000, () => {
    console.log("servidor iniciado");
});