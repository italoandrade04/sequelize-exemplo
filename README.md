# sequelize-exemplo

# Utilizando funções basicas do ORM Sequelize

Todas as funções utilizados estão comentadas, foram utilizadas as funções:
- Criação de tabelas 'article' e 'autor'

- Campos com as especificações de:
   
   -- type : Tipo da coluna

    -- primaryKey: indicando se é chave primária

    -- autoIncrement: indicando se é auto incremento

    -- allowNull: indicando se aceita null

    -- unique: indicando se o campo é unique

    -- validate: cria as validações na coluna (exemplo usado de tamanho minimo e máximo do campo)

- hooks (trigger):

    -- afterValidate: Executa a função antes da validação.

    -- beforeValidate: Executa a função depois da validação.

    -- afterCreate: Executa a função antes da criação.

    -- beforeCreate: Executa a função depois da criação.

    -- afterUpdate: Executa a função antes da modificação.

    -- beforeUpdate: Executa a função depois da modificação.

- Associations (ligações entre tabelas)

    -- Utilizado ligação 1-N entre Autor e artigos

- Querys
    -- create: criação de dados na tabela
    
    -- bulkCreate: criação de dados na tabela em massa (incluir varios dados de uma vez)
    
     --- OBS: bulkCreate ele não usa as validações, usa o parametro validate para que ele use validações indicadas na coluna da tabela quando criada
     
    -- findAll: busca todos os campos da tabela indicada
    
