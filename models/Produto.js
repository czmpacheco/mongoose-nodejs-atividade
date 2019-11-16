var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var produtoSchema = new Schema({
    customerID: { type: Number, Required: 'O customerId não pode ficar em branco' },
    fabricante: { type: String, Required: 'O nome do fabricante não pode ficar em branco.' },
    ano: { type: String, Required: 'O ano do  não pode ficar em branco.' },
    preco: { type: String, Required: 'O preço do  não pode ficar em branco' },
    cor: { type: String },
    condicao: { type: String },
    milhagem: { type: String },
    modelo: { type: String },
    submodelo: { type: String },
    tipo: { type: String },
    localizacao: { type: String },
    vendedor: { type: String }
});
module.exports = mongoose.model('Produto', produtoSchema);