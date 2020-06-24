(function(){
    var prijemRepromaterijalFactory = function($http, mainService){
        var factory = {};
		
		factory.getGoodsType = function(){
            return $http.get(mainService.domainURL()+'prijem_repromaterijal_api/get_goods_type/');
        };
		
		factory.getGoodsName = function(goods_type_id){
            return $http.get(mainService.domainURL()+'prijem_repromaterijal_api/get_goods_name/'+goods_type_id);
        };
		
		factory.insertRepromaterijal = function(merkantila){
			return $http.post(mainService.domainURL()+'prijem_repromaterijal_api/prijem_repromaterijal', merkantila);
		}
		
		factory.testSession = function(merkantila){
			return $http.post(mainService.domainURL()+'sessionController/check_session/'+merkantila.session_id, merkantila);
		}
		
		factory.getfirstMeasurement = function(login){
			return $http.post(mainService.domainURL()+'prijem_repromaterijal_api/prvo_merenje_merkantila/', login);
		}
		factory.getSecondMeasurement = function(login){
			return $http.post(mainService.domainURL()+'prijem_repromaterijal_api/drugo_merenje_repromaterijal/', login);
		}
		
		factory.selectLastInput = function(data){
			return $http.post(mainService.domainURL()+'prijem_repromaterijal_api/select_last_input', data);
		}
		
		factory.enableDays = function(session_id){
			return $http.post(mainService.domainURL()+'prijem_repromaterijal_api/enable_days', session_id);
		}
		
		factory.getSearchType = function(data){
			return $http.post(mainService.domainURL()+'prijem_repromaterijal_api/get_search_type', data);
		}
		
		factory.getSearchMerkantilaName = function(data){
			return $http.post(mainService.domainURL()+'prijem_repromaterijal_api/get_search_good_name', data);
		}
		factory.getSearchPrijemnica = function(data){
			return $http.post(mainService.domainURL()+'prijem_repromaterijal_api/get_search_prijemnica', data);
		}
		
		factory.selectOdabraniPrijem = function(data){
			return $http.post(mainService.domainURL()+'prijem_repromaterijal_api/select_odabrani_prijem', data);
		}

		factory.get_all_goods = function(data){
			return $http.post(mainService.domainURL()+'prijem_repromaterijal_api/get_all_goods', data);
		}
		factory.get_lotovi = function(){
            return $http.post(mainService.domainURL()+'pregled_prijema_repromaterijal_api/get_lotovi');
        };
        return factory;
    }
    prijemRepromaterijalFactory.$inject = ['$http', 'mainService'];
    angular.module('_raiffisenApp').factory('prijemRepromaterijalFactory', prijemRepromaterijalFactory);
}());