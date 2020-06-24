(function(){

	var usluznoClientList = function(){
		return{
			restricted:'E',
			replace:'true',
			/*controller:function($scope){
				$scope.prijemnica = function(input_id){
					console.log(input_id);
				}
			},*/
			//require:'^usluznoClientList',
			templateUrl:'app/templates/usluznoClientList.html',
			scope:{
				usluznoClient:"=",
				getPrijemnica:"&"
			},
			link:function(scope, elem, attr, controller){
				
			}
			
		}
	};
	usluznoClientList.$inject = [];
	angular.module('_raiffisenApp').directive('usluznoClientList',usluznoClientList);
	
}());