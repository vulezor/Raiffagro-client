(function(){
    var usluznoMerenjePregledFactory = function($http, mainService){
        var factory = {};
		
		factory.getGoodsType = function(){
            return $http.get(mainService.domainURL()+'usluzno_merenje_api/get_prijemnice/');
        };
	
        return factory;
    }
    usluznoMerenjePregledFactory.$inject = ['$http', 'mainService'];
    angular.module('_raiffisenApp').factory('usluznoMerenjePregledFactory', usluznoMerenjePregledFactory);
}());