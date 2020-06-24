(function(){
	var usluznoMerenjePregledController = function($scope, $timeout, usluznoMerenjePregledFactory, mineFactory){
		$scope.session_id = '';
		$scope.last_measurement = {};
		
	
		//------------------------------------------------------------------------------------------------------
		
		chrome.storage.local.get('session_id', function (items) {
				result = items['session_id'];
				
					$scope.insert_data.session_id = result;
					$scope.session_id = result;
				
				 mineFactory.testSession({'session_id':result}).success(function(msg){//testSession
					console.log(msg);
					// $scope.getfirstMeasurement();
					  $scope.$broadcast('table_usluzno');
				}).error(function(error){
					console.log(error);
				});
			});
		
	/*	$scope.selectLastMeasurement = function(){
			usluznoMerenjeFactory.selectLastInput({'session_id':$scope.session_id}).success(function(msg){
				console.log(msg);
				if($.isEmptyObject(msg)===false){
					$scope.showInput = true;
					$scope.last_measurement = msg[0]; 
				} else {
				 
				}
			}).error(function(error){
				console.log(error)
			});
		}*/
		
		$scope.print = function(){
			$timeout(function(){
				var content = $('.print_prijem').html();
				console.log($scope.last_measurement)
			$('.print_area').html(content);
			window.print();
			}, 400);
			
		};
		
		
	};
	
	usluznoMerenjePregledController.$inject = ['$scope', '$timeout', 'usluznoMerenjePregledFactory', 'mineFactory'];
	angular.module('_raiffisenApp').controller('usluznoMerenjePregledController', usluznoMerenjePregledController);
	
	
	var usluznoListPregled = function( DTOptionsBuilder, DTColumnBuilder, usersFactory, $scope, $resource, $compile, mainService, usluznoMerenjeFactory) {
        var vm = this;
        vm.prijemnicaViuw = prijemnicaViuw;
        vm.rowNum = 0;
		
        $scope.$on("update_first_measure_table_usluzno", function(event) {
            reloadData();
        });

        vm.reloadData = reloadData;
        vm.dtInstance = {};
        vm.measures = {};
		vm.result=null;
		
		chrome.storage.local.get('session_id', function (items) {  
			vm.result = items['session_id'];
			reloadData();
		});
		
        vm.dtOptions = DTOptionsBuilder
            .fromSource(mainService.domainURL()+'user_api/get_users')
            .withPaginationType('full_numbers')
            .withBootstrap()
            .withOption('createdRow', createdRow)
			.withOption('aaSorting', [2, 'asc'])
            .withColumnFilter({
                sPlaceHolder: "head:before",
                aoColumns: [{
                    type: 'number'
                }, 
				{
                    type: 'text',
                    bRegex: true,
                    bSmart: true
                },
                    {
                        type: 'text',
                        bRegex: true,
                        bSmart: true
                    },
                    {
                        type: 'text',
                        bRegex: true,
                        bSmart: true
                    },
                    {
                        type: 'text',
                        bRegex: true,
                        bSmart: true
                    },
                    {
                        type: 'text',
                        bRegex: true,
                        bSmart: true
                    },
						
                    {
                        type: 'text',
                        bRegex: true,
                        bSmart: true
                    },
                    {
                        type: 'text',
                        bRegex: true,
                        bSmart: true
                    },{
                        type: 'text',
                        bRegex: true,
                        bSmart: true
                    }]
            }).withLanguage({
                "sEmptyTable":     "<p>Nema raspoloživih podataka u tabeli</p>",
                "sInfo":           "Prikazujem _START_ do _END_ od totalno _TOTAL_ rezultata",
                "sInfoEmpty":      "Prikazujem 0 do 0 od totalno 0 redova",
                "sInfoFiltered":   "(Filtrirano od totalno _MAX_  rezultata)",
                "sInfoPostFix":    "",
                "sInfoThousands":  ",",
                "sLengthMenu":     "Prikazujem _MENU_ rezultate",
                "sLoadingRecords": "<i class='fa fa-cog fa-spin fa-3x load_new_place.ng-hide'></i> Load data...",
                "sLoadingPromise": "<i class='fa fa-cog fa-spin fa-3x load_new_place.ng-hide'></i> Load data...",
                "sProcessing":     "Procesuiram...",
                "sSearch":         "Traži:",
                "sZeroRecords":    "Nema podataka koji se poklapaju",
                "oPaginate": {
                    "sFirst":    "Prva",
                    "sLast":     "Zadnja",
                    "sNext":     "Sledeća",
                    "sPrevious": "Prethodna"
                },
                "oAria": {
                    "sSortAscending":  ": activate to sort column ascending",
                    "sSortDescending": ": activate to sort column descending"
                }
            });
			
			vm.dtColumns = [
				DTColumnBuilder.newColumn('usluzno_id').withTitle('Doc.br').withOption('width', '5%'),
				DTColumnBuilder.newColumn('datum').withTitle('Datum prijema'),
				DTColumnBuilder.newColumn('firm_name').withTitle('Naziv firme'),
				DTColumnBuilder.newColumn('good_name').withTitle('Naziv robe'),
				DTColumnBuilder.newColumn('vozac').withTitle('Vozač'),
				DTColumnBuilder.newColumn('reg_vozila').withTitle('registracija'),
				DTColumnBuilder.newColumn('tara').withTitle('Tara').withClass('text-right').withOption('width','100px'),
				DTColumnBuilder.newColumn('bruto').withTitle('Bruto').withClass('text-right').withOption('width','100px'),
				DTColumnBuilder.newColumn('neto').withTitle('Neto').withClass('text-right').withOption('width','100px'),
				DTColumnBuilder.newColumn(null).withTitle('Prijemnica').notSortable().withOption('width','50px').renderWith(actionsHtml).withClass('text-center')
        	];
		


        function reloadData() {
			console.log(vm.result);
            var resetPaging = false;
            vm.dtInstance.changeData(mainService.domainURL()+'usluzno_merenje_api/get_prijemnice/'+vm.result+'/');
        }

        function prijemnicaViuw(id){
            console.log(id);
			$scope.$parent.last_measurement = id;
			console.log($scope.$parent.last_measurement);
			$scope.$parent.print();
			/*var data = {
				"usluzno_id":id.usluzno_id,
				"session_id": $scope.$parent.insert_data.session_id,
				"vaga": $scope.$parent.vaga
			}
			
			usluznoMerenjeFactory.second_measurement(data).success(function(msg){
				console.log(msg);
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					console.log('logedin');
					
						vm.reloadData();
					 $scope.$parent.selectLastMeasurement();
					$scope.$parent.insert_data.bruto = 0;
				} else {
					console.log('not logedin');
					$scope.$parent.logoutUser();
				}
			}).error(function(error){
				console.log(error);
			})*/
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function actionsHtml (data, type, full, meta) {
			
           vm.measures[data.usluzno_id] = data;
            return' <i class="fa fa fa-file-o btn btn-primary btn-sm" style="margin-top:0px" title="Štampaj prijemnicu" data-ng-click="userShowCase.prijemnicaViuw(userShowCase.measures[' + data.usluzno_id + '])"></i>';
        }
    };
    usluznoListPregled.$inject = ['DTOptionsBuilder', 'DTColumnBuilder', 'usersFactory', '$scope', '$resource', '$compile', 'mainService', 'usluznoMerenjeFactory'];
    angular.module('_raiffisenApp').controller('usluznoListPregled', usluznoListPregled);
	
	
	
}());