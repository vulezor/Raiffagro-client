(function(){
    var clientsFactory = function($http, mainService){
        var factory = {};

        factory.getClients = function(){
            return $http.get(mainService.domainURL()+'client_api/get_clients');
        };

        factory.getClient = function(id){
            return $http.get(mainService.domainURL()+'client_api/get_clients/' + id);
        };

        factory.insertClient = function(client){
            return $http.post(mainService.domainURL()+'client_api/insert_client', client);
        };

        factory.updateClient = function(client){
            return $http.put(mainService.domainURL()+'client_api/update_client/' + client.client_id, client);
        };

        factory.deleteClient = function (client) {
            return $http.delete(mainService.domainURL()+'client_api/delete_client/' + client);
        };

        return factory;
    };
    clientsFactory.$inject = ['$http', 'mainService'];
    angular.module('_raiffisenApp')
        .factory('clientsFactory', clientsFactory);
//-------------------------------------------------------------------------------

}());