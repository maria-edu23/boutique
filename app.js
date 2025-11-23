const express = require("express");
const path = require("path");
const database = require("./config/database");
const methodOverride = require('method-override');

// Carrega rotas
const pecaRoutes = require("./routes/pecaRoutes");
const colecaoRoutes = require("./routes/colecaoRoutes");
const vendaRoutes = require("./routes/vendaRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

//Inicialização do Banco de Dados
database.sync({ alter: true }) 
    .then(() => {
        console.log("Banco de dados da Boutique sincronizado.");
        app.listen(PORT, () => console.log(`Servidor da Boutique rodando na porta ${PORT}`));
    })
    .catch(error => {
        console.error("ERRO ao sincronizar o banco de dados:", error);
    });

//Configurações e Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride('_method')); 

//Arquivos Estáticos
app.use(express.static(path.join(__dirname, "public"))); 
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

//Carregamento dos Models (para associações)
require("./models"); 

//Rotas
app.use("/", pecaRoutes);
app.use("/colecao", colecaoRoutes);
app.use("/venda", vendaRoutes); 

app.use((req, res, next) => {
    res.status(404).send("Página da Boutique não encontrada! 🤷‍♀️");
});