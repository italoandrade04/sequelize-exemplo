const Sequelize = require('sequelize');
const op = Sequelize.Op;

const connection = new Sequelize("demo_schema", "root", "123456789", {
    //Host para entrar no banco de dados
    host: 'localhost',
    //Referente ao qual tipo de banco vai usar
    dialect: 'mysql',
    //Quantidade de conecctions que ele irá criar, e vai manipular as requisições com elas.
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
});

const Autor = connection.define('autor', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const Article = connection.define("article",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_autor: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        titulo: {
            type: Sequelize.STRING,
            // Indica se aceita nulo ou não
            allowNull: false,
            // Validade, serve para fazer validações
            validate: {
                // Verifica o tamanho da variavel [10,150] (no caso tem que ser maior 10, )
                len: [10, 150]
            }
        },
        corpo: {
            type: Sequelize.TEXT,
            // Caso precise, aqui você pode setar um valor Default para sua coluna
            // defaultValue: 'Valor default' 
            validate: {
                //É possivel criar uma função para realizar as verificações Modelo baixo
                startsWithUpper: function (bodyVal) {
                    var first = bodyVal.charAt(0);
                    var startsWithUpper = first === first.toUpperCase();
                    if (!startsWithUpper) {
                        throw new Error('Primeira letra deve ser em caixa alta.');
                    } else {
                        // ....
                        console.log('Dados Validos');
                    }
                }
            }
        },
    },
    // Configurações do ORM pra tabelas.
    {
        //Você quer criar as colunas createAt e updateAt? true = sim, false = não
        // // timestamps: false, 
        // Você quer evitar o plurarismo no ORM? true = sim, false = não
        // // freezeTableName: true 
        // Primeira Forma de Criar hook
        hooks: {
            //Antes de executar a validação dos dados
            //Obs: em todas as hooks você consegue manipular os dados antes/depois de cada ação
            // beforeValidate: function (artigo) {
            //     console.log('Antes de Validate');
            // },
            //Depois de executar a validação dos dados
            //Depois da validação, um exemplo é password, para encryptar depois que validou os caracters
            afterValidate: function (artigo) {
                console.log('Depois do validate');
            },
            // Trigger para antes de criar
            beforeCreate: function (artigo) {
                console.log('Antes de criar');
            },
            // Trigger para depois de criar
            afterCreate: function (artigo) {
                console.log('Depois de criar');
            },
            // Trigger para antes de dar update
            beforeUpdate: (artigo) => {
                console.log('Antes do update');
            },
            // Trigger para depois de dar update
            afterUpdate: (artigo) => {
                console.log('Depois do update');
            },
        }
    }
);

// Segunda forma de Criar Hook (trigger) nas models:
Article.hook('beforeValidate', (artigo) => {
    console.log('Antes da validação');
});

// Terceira forma de criar uma Hook (trigger)
Article.beforeValidate((artigo) => {
    console.log('Antes da validação');
});
//Ligação 1 - N Ida
Autor.hasMany(Article, { foreignKey: 'id_autor', sourceKey: 'id' });
//Ligação N- 1 volta
Article.belongsTo(Autor, { foreignKey: 'id_autor', targetKey: 'id' });

connection.sync({
    force: true,
    logging: console.log
}).then(function () {
    return Promise.all([
        Autor.create({ nome: 'Ítalo Andrade' })
    ]).then((results) => {
        console.log(results);
        var id_autor = results[0].dataValues.id
        console.log(id_autor)
        var req = {
            body: {
                titulo: 'Titulo do artigo',
                corpo: 'Aqui tem um bodyasdf',
                issoNemVaiInserir: 'Vou nem inserir isso aqui mesmo',
                id_autor: id_autor
            }
        }

        return Promise.all([
            Article.create(req.body, {
                // Passa os valores de fields que você deseja inserir
                fields: ['titulo', 'corpo', 'id_autor']
            }),
            // Criação em massa de registros, Passa um Json com o formato de dados e ele cria o insert, 
            // com values com varios itens
            Article.bulkCreate(
                [
                    {
                        titulo: 'Teste realizado para criação de registros em massa',
                        corpo: 'Teste para Criação de registro em massa, para verificar disponibilidade da função',
                        id_autor: id_autor
                    },
                    {
                        titulo: 'Teste 2 realizado para criação de registros em massa',
                        corpo: 'Teste 2 para Criação de registro em massa, para verificar disponibilidade da função',
                        id_autor: id_autor
                    }
                ], {
                    //Bulkcreate por padrão não usa validação, para que faça a validação deve usar
                    validate: true,
                    //Fields também funciona no bulkCreate
                    fields: ['titulo', 'corpo', 'id_autor'],
                }
            )
        ]).then(results => {
            Article.findAll(
                //Include é usado para buscar os dados relacionados as tabelas
                {
                    include: Autor,
                    where: {
                        id: {
                            [op.not]: 2
                        }
                    }
                }
            ).then(function (articles) {
                articles.forEach(article => {
                    article.dataValues.autor = article.dataValues.autor.dataValues;
                    console.log('------------------------------------------------------------');
                    console.log('Artigosssss', article.dataValues);
                    console.log('------------------------------------------------------------');
                });
            });
        })
    })

}).catch(function (error) {
    console.log(error);
});

// connection.sync({
//     logging: console.log
// }).then(function () {
//     // Para o create, passa um json com os nomes das colunas da tabela e os valores
//     Article.create(
//         {
//             title: 'Titulo - Artigo',
//             body: 'Corpo do texto'
//         }
//     );
// })

// connection.sync({
//     logging: console.log
// }).then(function () {
//     // Função de Busca por todos
//     Article.findAll({
//         // Busca pelo id
//         // where: {
//         //     id: 1
//         // }
//     }).then(function (articles) {
//         console.log(articles);
//     });
// })