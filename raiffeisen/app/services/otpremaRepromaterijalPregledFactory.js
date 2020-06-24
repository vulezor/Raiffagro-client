(function(){
    var otpremaRepromaterijalPregledFactory = function($http, mainService){
        var factory = {};
		
		 factory.get_search_type = function(data){
            return $http.get(mainService.domainURL()+'pregled_otpreme_repromaterijal_api/get_search_type/', { params: data});
        };
		
		factory.get_search_good_type = function(data){
            return $http.get(mainService.domainURL()+'pregled_otpreme_repromaterijal_api/get_search_good_type/', { params: data });
        };
		
		factory.get_search_good_name = function(data){
            return $http.get(mainService.domainURL()+'pregled_otpreme_repromaterijal_api/get_search_good_name/', { params: data });
        };
		
		factory.get_search_good_client = function(data){
            return $http.get(mainService.domainURL()+'pregled_otpreme_repromaterijal_api/get_search_good_client/', { params: data });
        };
        factory.get_search_prijem_total = function(data){
            return $http.get(mainService.domainURL()+'pregled_otpreme_repromaterijal_api/get_search_prijem_total/', { params: data });
        };
        factory.storniraj_dokument = function(data){
            return $http.put(mainService.domainURL()+'pregled_otpreme_repromaterijal_api/storniraj_dokument/'+data.input_id);
        };
		factory.getOtpremnica = function(input_id){
			console.log(input_id);
            return $http.get(mainService.domainURL()+'pregled_otpreme_repromaterijal_api/getOtpremnica/', { params: input_id });
        };

        return factory;
    }
    otpremaRepromaterijalPregledFactory.$inject = ['$http', 'mainService'];
    angular.module('_raiffisenApp').factory('otpremaRepromaterijalPregledFactory', otpremaRepromaterijalPregledFactory);
}());