(function(){
    var prijemMerkantilaFactory = function($http, mainService){
        var factory = {};

        
        factory.getGoodsType = function(){
            return $http.get(mainService.domainURL()+'prijem_merkantila_api/get_goods_type/');
        };
		
		factory.getGoodsName = function(goods_type_id){
            return $http.get(mainService.domainURL()+'prijem_merkantila_api/get_goods_name/'+goods_type_id);
        };
		
		factory.insertMerkantila = function(merkantila){
			return $http.post(mainService.domainURL()+'prijem_merkantila_api/prijem_merkantila', merkantila);
		}
		
		factory.testSession = function(merkantila){
			return $http.post(mainService.domainURL()+'sessionController/check_session/'+merkantila.session_id, merkantila);
		}
		
		factory.getfirstMeasurement = function(login){
			return $http.post(mainService.domainURL()+'prijem_merkantila_api/prvo_merenje_merkantila/', login);
		}
		factory.getSecondMeasurement = function(login){
			return $http.post(mainService.domainURL()+'prijem_merkantila_api/drugo_merenje_merkantila/', login);
		}
		
		factory.selectLastInput = function(data){
			return $http.post(mainService.domainURL()+'prijem_merkantila_api/select_last_input', data);
		}
		
		factory.enableDays = function(session_id){
			return $http.post(mainService.domainURL()+'prijem_merkantila_api/enable_days', session_id);
		}
		
		factory.getSearchType = function(data){
			return $http.post(mainService.domainURL()+'prijem_merkantila_api/get_search_type', data);
		}
		
		factory.getSearchMerkantilaName = function(data){
			return $http.post(mainService.domainURL()+'prijem_merkantila_api/get_search_good_name', data);
		}
		factory.getSearchPrijemnica = function(data){
			return $http.post(mainService.domainURL()+'prijem_merkantila_api/get_search_prijemnica', data);
		}
		
		factory.selectOdabraniPrijem = function(data){
			return $http.post(mainService.domainURL()+'prijem_merkantila_api/select_odabrani_prijem', data);
		}

        return factory;
    };
    prijemMerkantilaFactory.$inject = ['$http', 'mainService'];
    angular.module('_raiffisenApp').factory('prijemMerkantilaFactory', prijemMerkantilaFactory);
}());