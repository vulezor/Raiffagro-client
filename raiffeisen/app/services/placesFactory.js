(function(){
    var placesFactory = function($http, mainService){
        var factory = {};

        factory.getPlaces = function(){
            return $http.get(mainService.domainURL()+'place_api/get_places/');
		}
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


        return factory;
    };
    placesFactory.$inject = ['$http', 'mainService'];
    angular.module('_raiffisenApp').factory('placesFactory', placesFactory);
}());