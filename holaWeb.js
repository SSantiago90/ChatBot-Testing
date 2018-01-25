var restify = require('restify');
var builder = require('botbuilder');

// Levantar restify
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// No te preocupes por estas credenciales por ahora, luego las usaremos para conectar los canales.
var connector = new builder.ChatConnector({
    appId: '',
    appPassword: ''
});

// Ahora utilizamos un UniversalBot
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Dialogos
bot.dialog('/', [
    function (session, results, next) {
        if (!session.userData.nombre) {
            builder.Prompts.text(session, '¿Cómo te llamas?');
        }
        else {
            next();
        }       
    },
    function (session, results) {
        if (results.response) {
            let msj = results.response;
            session.userData.nombre = msj;
        }
        session.send(`Hola ${session.userData.nombre}!`);
        session.beginDialog('/preguntarEdad');
    },
    function (session) {
        if (session.conversationData.edad) {
            session.send(`Así que tenés ${session.conversationData.edad}`);
        }
        else {
            session.send('Mmm, parece que no recuerdo tu edad...');
            session.beginDialog('/preguntarEdad');
        }
    }
]);

bot.dialog('/preguntarEdad',[
        (session,res,next) =>{
           builder.Prompts.text(session,'¿Que edad tenés?');
        },
        (session,res)=>{
             session.conversationData.edad = res.response;
             session.endDialog(`${session.conversationData.edad}? Que grande!`);
            }           
]);