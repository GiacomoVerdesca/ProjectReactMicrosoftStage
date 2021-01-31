// var instance = null;
// //Recupero MicrosoftGraph per le chiamate API
// var graph = require('@microsoft/microsoft-graph-client');
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

//      authProvider = {
//         getAccessToken: async () => {
//             // Call getToken in auth.js
//             return await getToken();
//         }
//     };
//     graphClient = graph.Client.initWithMiddleware({ authProvider });

//     getUser = async () => {
//         return await graphClient
//             .api('/me')
//             // Only get the fields used by the app
//             .select('id,displayName,mail,userPrincipalName,mailboxSettings')
//             .get();
//     }
// }