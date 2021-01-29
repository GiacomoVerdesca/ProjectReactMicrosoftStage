// var graph = require('@microsoft/microsoft-graph-client');
// var instance = null;
// let authProvider = {
//     getAccessToken: async () => {
//         // Call getToken in auth.js
//         return await getToken();
//     }
// };
// let graphClient = graph.Client.initWithMiddleware({ authProvider });
// //Recupero MicrosoftGraph per le chiamate API

// export class GraphService {

//     static getInstance() {
//         if (instance === null) {
//             instance = new GraphService();
//         }
//         return instance;
//     }

//     static setInstance(_instance) {
//         instance = _instance;
//     }

//     getUser = async () => {
//         return await graphClient
//             .api('/me')
//             // Only get the fields used by the app
//             .select('id,displayName,mail,userPrincipalName,mailboxSettings')
//             .get();
//     }
// }