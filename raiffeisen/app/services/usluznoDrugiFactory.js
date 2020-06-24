(function(){
    var usluznoDrugiFactory = function($http, mainService){
        var factory = {};
		
		factory.getUsluznoList = function(data){
            return $http.get(mainService.domainURL()+'usluzno_merenje_api/get_usluzno/'+data+'/');
        };
		
		factory.getGoodsType = function(){
            return $http.get(mainService.domainURL()+'usluzno_merenje_api/get_prijemnice/');
        };
		
		//mainService.domainURL()+'usluzno_merenje_api/get_prijemnice/'+vm.result+'/'
	
        return factory;
    }
    usluznoDrugiFactory.$inject = ['$http', 'mainService'];
    angular.module('_raiffisenApp').factory('usluznoDrugiFactory', usluznoDrugiFactory);
}());