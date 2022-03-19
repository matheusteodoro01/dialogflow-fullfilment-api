'use strict';

const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));


    function listarPedido(agent) {
        var pedido_id = agent.parameters.pedido_id;
        var url = 'https://vrumexpress.herokuapp.com/pedido/dialogflow/' + pedido_id[0];
        return getPedido(url).then(response => {
            var bot_response = response.data.message;
            agent.add(bot_response);
        }).catch(error => {
            console.log("Erro na requisição");
            console.log(error);
        });
    }

    function getPedido(url) {
        const axios = require('axios');
        return axios.get(url);
    }


    function cadastrarPedido(agent) {
        const empresa_id = agent.parameters.empresa_id;
        const nome = agent.parameters.nome;
        const celular = agent.parameters.celular;
        const rua = agent.parameters.rua;
        const numero = agent.parameters.numero;
        const bairro = agent.parameters.bairro;
        const referencia = agent.parameters.referencia;
        const pagamento = agent.parameters.pagamento;
        const conteudo = agent.parameters.conteudo;
     	const tipo = agent.parameters.tipo;
        const total = agent.parameters.total;


        const data = {
            empresa_id: empresa_id[0],
            entregador_id: 5,
            clienteNome: nome[0],
            celular: celular[0],
            rua: rua[0],
            numero: numero[0],
            bairro: bairro[0],
            referencia: referencia[0],
            formaPagamento: pagamento[0],
            conteudo: conteudo[0],
          	tipo: tipo[0],
            total: total[0]


        };

        var url = 'https://vrumexpress.herokuapp.com/pedido';
        return postPedido(url, data).then(response => {
            var bot_response = response.data.message;
            agent.add(bot_response);
        }).catch(error => {
            console.log("Erro na requisição");
            console.log(error);
        });
    }

    function postPedido(url, data) {
        const axios = require('axios');
        return axios.post(url, data);
    }


    let intentMap = new Map();
    intentMap.set('01 Solicitar Entregador', cadastrarPedido);
    intentMap.set('02 Verificar Status', listarPedido);
    agent.handleRequest(intentMap);
});