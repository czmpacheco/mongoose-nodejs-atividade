var express = require('express');
var csv = require("fast-csv");
var csv_express = require('csv-express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var Produto = mongoose.model('Produto');
var csvfile = __dirname + "/../public/files/produto.csv";
var stream = fs.createReadStream(csvfile);
var app = require('express')();
var delay = require('express-delay');

async function generateId() {
  let retorno
  let customerIDlist = await Produto.distinct('customerID', (err, docs) => {
    return docs
  })
  if (customerIDlist.length === 0) {
    retorno = 1001
  } else {
    let max = await customerIDlist.reduce((a, b) => {
      return Math.max(a, b)
    })
    retorno = max + 1
  }
  return retorno
}

router
  .get('/', (req, res, next) => {
    Produto.find({}, (err, docs) => {
      if (!err) {
        res.render('index', {
          title: 'Importando e Exportando arquivo CSV usando NodeJS e MongoDB',
          content: docs
        })
      } else {
        throw err
      }
    })
  })

  .get('/create', (req, res, next) => {
    res.render('create', { title: 'Cadastro' });
  }).post('/create', (req, res) => {
    let obj = req.body
    generateId().then(customerID => {
      obj.customerID = customerID
      console.log(obj)
      Produto.create(obj)
    })
    res.redirect('/')
  })

  .get('/import', function (req, res, next) {
    var produto = []
    var csvStream = csv()
      .on("data", function (data) {
        var item = new Produto({
          fabricante: data[0],
          ano: data[1],
          preco: data[2],
          cor: data[3],
          condicao: data[4],
          milhagem: data[5],
          modelo: data[6],
          submodelo: data[7],
          tipo: data[8],
          localizacao: data[9],
          vendedor: data[10]
        })
        item.save(function (error) {
          console.log(item);
          if (error) {
            throw error;
          }
        })
      }).on("end", function () {
        console.log(" Fim do arquivo de importação.");
      })
    stream.pipe(csvStream);
    res.json({ success: "As informações estão sendo importadas", status: 200 });
    res.redirect('/')
  })
  
  /*.get('/fetchdata', function (req, res, next) {

    Produto.find({}, function (err, docs) {
      if (!err) {
        res.json({ success: "Atualização efetuada com sucesso", status: 200, data: docs });
      } else {
        throw err;
      }
    })
  })*/

  .get('/reload', (req, res) => {
    res.redirect('/')
  })
  .get('/export', function (req, res, next) {
    var filename = "motos_exportado.csv";
    var dataArray;
    Produto.find().lean().exec({}, function (err, ) {
      if (err) res.send(err);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader("Content-Disposition", 'attachment; filename=' + filename);
      res.csv(produto, true);
    });
  })

  .get('/update/:id', (req, res, next) => {
    Produto.findById(req.params.id)
      .then(doc => res.render('update', {
        produtoId: req.params.id,
        fabricante: doc.fabricante,
        ano: doc.ano,
        preco: doc.preco,
        cor: doc.cor,
        condicao: doc.condicao,
        milhagem: doc.milhagem,
        modelo: doc.modelo,
        submodelo: doc.submodelo,
        tipo: doc.tipo,
        localizacao: doc.localizacao,
        vendedor: doc.vendedor,
      })).catch((err) => {
        console.log(err)
      })
  }).post('/update/:id', (req, res) => {
    Produto.update({ _id: req.params.id }, req.body, (err, raw) => {
      if (err) {
        console.log(err)
        res.send(err)
      }
      console.log('Cadastro atualizado')
    })
    res.redirect('/')
  })

  .get('/delete/:id', (req, res) => {
    Produto.deleteOne({ _id: req.params.id }, (err, result) => {
      if (err) return res.send(500, err);
      console.log("Dado excluído com sucesso.");
    })
    res.redirect('/')
  })

  .get('/deleteall', (req, res) => {
    Produto.remove({}, (err, result) => {
      if (err) return res.send(500, err);
      console.log("Dados excluídos com sucesso.");
    })
    res.redirect('/')
  })



module.exports = router;