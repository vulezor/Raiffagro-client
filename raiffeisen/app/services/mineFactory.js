(function(){
    var mineFactory = function($http, mainService){
        var factory = {};
		
		factory.loginUser = function(login){
			return $http.post(mainService.domainURL()+'login/login_ajax/', login);
		}
		
		factory.logoutUser = function(){
			return $http.post(mainService.domainURL()+'login/logout_ajax/');
		}
		
		factory.testSession = function(login){
			return $http.post(mainService.domainURL()+'sessionController/check_session', login);
		}
		
        factory.getPlaces = function(){
            return $http.get(mainService.domainURL()+'place_api/get_places/');
        };

        factory.getPlace = function(id){
            return $http.get(mainService.domainURL()+'place_api/get_places/' + id);
        };

        factory.insertPlace = function(place){
            return $http.post(mainService.domainURL()+'place_api/insert_places', place);
        };

        factory.updatePlace = function(place){
            return $http.put(mainService.domainURL()+'place_api/update_places/' + place.place_id, place);
        };

        factory.deletePlace = function (id) {
            return $http.delete(mainService.domainURL()+'api/delete_place/' + id);
        };
		
		factory.getDisposition = function (data) {
            return $http.get(mainService.domainURL()+'dispozicije_api/get_disposition/', {params:data});
        };
		factory.viuwDisposition = function (data) {
            return $http.get(mainService.domainURL()+'dispozicije_api/view_disposition/', {params:data});
        };
		
		factory.changeKolicinu = function (data) {
            return $http.post(mainService.domainURL()+'dispozicije_api/change_kolicinu/', data);
        };
		factory.changeVozilo = function (data) {
            return $http.post(mainService.domainURL()+'dispozicije_api/change_vozilo/', data);
        };
		
		factory.realizacijaStavkeDispozicije = function (data) {
            return $http.post(mainService.domainURL()+'dispozicije_api/realizacija_stavke_dispozicije/', data);
        };
		
		

        return factory;
    };
    mineFactory.$inject = ['$http', 'mainService'];
    angular.module('_raiffisenApp')
        .factory('mineFactory', mineFactory);
}());