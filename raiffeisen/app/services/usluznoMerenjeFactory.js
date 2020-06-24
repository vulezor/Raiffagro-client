(function(){
	var usluznoMerenjeFactory = function($http, mainService){
		var factory = {};
		
		factory.first_measurement = function(data){
			return $http.post(mainService.domainURL()+'usluzno_merenje_api/first_measurement/', data);
		};
		factory.second_measurement = function(data){
			return $http.post(mainService.domainURL()+'usluzno_merenje_api/second_measurement/', data);
		};
		factory.selectLastInput = function(data){
			return $http.post(mainService.domainURL()+'usluzno_merenje_api/select_last_input/', data);
		};
		return factory;
	};
	usluznoMerenjeFactory.$inject = ['$http', 'mainService'];
	angular.module('_raiffisenApp').factory('usluznoMerenjeFactory', usluznoMerenjeFactory);
}());