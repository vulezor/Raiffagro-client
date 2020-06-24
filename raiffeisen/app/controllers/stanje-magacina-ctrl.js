(function(){
	
	var stanjeMagacinaCtrl = function($scope, mineFactory, stanjeMagacinaFactory){

        $scope.session_id;
        $scope.send_data = [];
        $scope.repromaterijal = [
            {id:6, naziv:'Hemija'},
            {id:7, naziv:'Seme'},
            {id:9, naziv:'Djubrivo'},
            {id:15, naziv:'Razna Roba'}
        ];
        $scope.results = [];
        $scope.napomena = '';


        chrome.storage.local.get('session_id', function (items) {
            console.log(items);
            var result = items['session_id'];
            console.log(result);
            $scope.session_id = result;
            $scope.send_data.session_id = result;
            $scope.getResults();
        });

        $scope.getResults = function(){
            stanjeMagacinaFactory.get_wearehouse_results($scope.send_data).success(function(msg){
                console.log(msg);
                $scope.results = msg.svi_rezultati;
                $scope.napomena = msg.napomena;
            }).error(function(error){
                console.log(error);
            });
        }

        $scope.print = function(){
            var content = $('.print_rezervacija').html();
            $('.print_area').html(content);
            window.print();
        };
	};
	
	stanjeMagacinaCtrl.$inject = ['$scope', 'mineFactory', 'stanjeMagacinaFactory'];
	angular.module('_raiffisenApp').controller('stanjeMagacinaCtrl' , stanjeMagacinaCtrl);

}());