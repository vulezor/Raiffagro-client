(function(){
    var otpremaMerkantilaFactory = function($http, mainService){
        var factory = {};

        
        factory.getGoodsType = function(){
            return $http.get(mainService.domainURL()+'otprema_merkantila_api/get_goods_type/');
        };
		
		factory.getGoodsName = function(goods_type_id){
            return $http.get(mainService.domainURL()+'otprema_merkantila_api/get_goods_name/'+goods_type_id);
        };
		
		factory.outputMerkantila = function(merkantila){
			return $http.post(mainService.domainURL()+'otprema_merkantila_api/otprema_merkantila', merkantila);
		}
		
		factory.testSession = function(merkantila){
			return $http.post(mainService.domainURL()+'sessionController/check_session/'+merkantila.session_id, merkantila);
		}
		
		factory.getfirstMeasurement = function(login){
			return $http.post(mainService.domainURL()+'otprema_merkantila_api/prvo_merenje_merkantila/', login);
		}
		factory.getSecondMeasurement = function(data){
			return $http.post(mainService.domainURL()+'otprema_merkantila_api/drugo_merenje_merkantila/', data);
		}
		
		factory.selectLastInput = function(data){
			return $http.post(mainService.domainURL()+'otprema_merkantila_api/select_last_input', data);
		}
		
		factory.enableDays = function(session_id){
			return $http.post(mainService.domainURL()+'otprema_merkantila_api/enable_days', session_id);
		}
		
		factory.getSearchType = function(data){
			return $http.post(mainService.domainURL()+'otprema_merkantila_api/get_search_type', data);
		}
		
		factory.getSearchMerkantilaName = function(data){
			return $http.post(mainService.domainURL()+'otprema_merkantila_api/get_search_good_name', data);
		}
		factory.getSearchOtpremnica = function(data){
			return $http.post(mainService.domainURL()+'otprema_merkantila_api/get_search_prijemnica', data);
		}
		
		factory.selectOdabraniPrijem = function(data){
			return $http.post(mainService.domainURL()+'otprema_merkantila_api/select_odabrani_prijem', data);
		}
		
		

        return factory;
    };
    otpremaMerkantilaFactory.$inject = ['$http', 'mainService'];
    angular.module('_raiffisenApp').factory('otpremaMerkantilaFactory', otpremaMerkantilaFactory);
}());