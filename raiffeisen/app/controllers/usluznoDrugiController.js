(function(){
	var usluznoDrugiController = function($scope, mineFactory, usluznoDrugiFactory, json_to_cvs, $filter){
		$scope.clients = [];
		$scope.session_id = '';
		$scope.sort_column = 'usluzno_id';
  		$scope.reverse = true;
		
		//------------------------------------------------------------------------------------------------------
		
		chrome.storage.local.get('session_id', function (items) {
				result = items['session_id'];
				
					$scope.session_id = result;
				
				 mineFactory.testSession({'session_id':result}).success(function(msg){//testSession
					console.log(msg);
					// $scope.getfirstMeasurement();
					   $scope.getUsluznoClients();
				}).error(function(error){
					console.log(error);
				});
			});
		
		//------------------------------------------------------------------------------------------------------
		
		$scope.getUsluznoClients = function(){
			usluznoDrugiFactory.getUsluznoList($scope.session_id).success(function(msg){
				console.log(msg);
				$scope.clients = msg;
			}).error(function(error){
				console.log(error);
			});
		};
		
		//------------------------------------------------------------------------------------------------------
		
		$scope.order = function(sort_column) {
    		$scope.reverse = ($scope.sort_column === sort_column) ? !$scope.reverse : false;
    		$scope.sort_column = sort_column;
  		};
		
		//------------------------------------------------------------------------------------------------------
		
		$scope.getPrijemnica = function(input_id){
			console.log(input_id);
		}
		
		$scope.generateFilter = function(){
			var obj =  $filter('filter')($scope.clients, $scope.search).length;
			
		}
		$scope.generateXLS = function(){
			var obj = $filter('filter')($scope.clients, $scope.search_clients);
			/*for(var i=0; i<obj.length;i++){
				delete obj[i].$$hashKey;
				delete obj[i].datum_izlaza;
			}*/
			 json_to_cvs.convert(obj, 'generate xml', true);
		}
		
		$scope.print = function(){
			var obj = $filter('filter')($scope.clients, $scope.search_clients);
			var template = '<table class="print_table_usluzno" width="100%" cellpadding="4" cellspacing="4">'+
			'<thead><tr>'+
				'<th>Br</th>'+
				'<th>Datum</th>'+
				'<th>Magacin</th>'+
				'<th>Naziv Firme</th>'+
				'<th>Roba</th>'+
				'<th>Vozač</th>'+
				'<th>Reg</th>'+
				'<th>Tara</th>'+
				'<th>Bruto</th>'+
				'<th>Neto</th>'+
			'</tr></thead>'+
			'<tbody>';
			for (var i=0; i<obj.length;i++){
				
				template +='<tr>'+
					'<td>'+obj[i].br_prijemnice+'</td>'+
					'<td>'+obj[i].datum+'</td>'+
					'<td>'+obj[i].magacin+'</td>'+
					'<td>'+obj[i].naziv_firme+'</td>'+
					'<td>'+obj[i].roba_za_merenje+'</td>'+
					'<td>'+obj[i].vozac+'</td>'+
					'<td>'+obj[i].registracija_vozila+'</td>'+
					'<td>'+obj[i].tara+'</td>'+
					'<td>'+obj[i].bruto+'</td>'+
					'<td>'+obj[i].neto+'</td>'+
					'</tr>';
			}	
			  template += '</tbody>';
			$('.print_area').html(template);
			window.print();
			
		}
		
		$scope.$watch('generateFilter()', function(newValue, oldValue){
			console.log(oldValue+', '+newValue);			  
		});
	};
	usluznoDrugiController.$inject = ['$scope', 'mineFactory', 'usluznoDrugiFactory', 'json_to_cvs', '$filter'];
	angular.module('_raiffisenApp').controller('usluznoDrugiController',usluznoDrugiController);
}())