(function(){
    var stanjeMagacinaFactory = function($http, mainService){
        var factory = {};

        factory.get_wearehouse_results = function(data){
            return $http.get(mainService.domainURL()+'stanje_repromaterijala_api/get_results_wearehouse', {params: data});
        };

        return factory;
    };
    stanjeMagacinaFactory.$inject = ['$http', 'mainService'];
    angular.module('_raiffisenApp').factory('stanjeMagacinaFactory', stanjeMagacinaFactory);
//-------------------------------------------------------------------------------

}());