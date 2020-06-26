(function(){
	var usluznoMerenjeController = function($scope, errorService, usluznoMerenjeFactory, mineFactory, clientsFactory, $filter){
		$scope.insert_data = {};
		$scope.vaga = 0;
		$scope.clients =[];
		$scope.show_clients = false;
		$scope.measurement_status = true;
		//------------------------------------------------------------------------------------------------------
		
		chrome.storage.local.get('session_id', function (items) {
				result = items['session_id'];
				
					$scope.insert_data.session_id = result;
					$scope.session_id = result;
				
				 mineFactory.testSession({'session_id':result}).success(function(msg){//testSession
					console.log(msg);
					// $scope.getfirstMeasurement();
					   $scope.selectLastMeasurement();
				}).error(function(error){
					console.log(error);
				});
			});
		
		
		$scope.selectLastMeasurement = function(){
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
		}
		
		//--------------------------------------------VAGA-------------------------------------------------
		
		$scope.connectionId;
		$scope.openConection = function(){
			//console.log($scope.$parent.login_data.scale_port);
			var bitrate = $scope.$parent.login_data.scale_type === 'm-3-488' ? 2400 : 9600
			 chrome.serial.connect($scope.$parent.login_data.scale_port, {bitrate: bitrate}, function(info) {
				$scope.$apply(function () { 
                $scope.connectionId = info.connectionId;
                console.log('Connection opened with id: ' + $scope.connectionId + ', Bitrate: ' + info.bitrate);
                chrome.serial.onReceive.addListener($scope.onReceiveCallback);
     
				});
			});
		};
		
		//---------------------------------------------------------------------------------------------------------
		
		var measurement_unit = '';
		var last_received = 0;
		
		//---------------------------------------------------------------------------------------------------------
		
		$scope.onReceiveCallback = function(info) {
			    
				var bufView = new Uint8Array(info.data);
				var encodedString = String.fromCharCode.apply(null, bufView);
				var str = decodeURIComponent(encodedString);
                var bufView = new Uint8Array(info.data);
			var encodedString = String.fromCharCode.apply(null, bufView);
			var str = decodeURIComponent(encodedString);

			if($scope.$parent.login_data.scale_type === 'w2110'){
				if (str.charAt(str.length-1) === '\n') {
				stringReceived = str.substring(0, str.length-1);
				onLineReceived(stringReceived);
				
				measurement_unit = '';
					
				} else {
				
					measurement_unit = str;
					
				}
				$scope.$apply(function () { 
					
						$scope.wagaW ();
					
				});
			} else if($scope.$parent.login_data.scale_type === 'mx100'){
				if(str.trim().length>0){
					console.log("string", str)
					measurement_unit= str.replace(/[^\d.-]/g, '');
					console.log("string replace", measurement_unit);
					measurement_unit= measurement_unit.substring(0, measurement_unit.length - 1);
					//console.log("string replace1", measurement_unit);
					//console.log("string replace2", measurement_unit.trim().length);
					measurement_unit= Number(measurement_unit)>0 && !isNaN(parseInt(measurement_unit)) ? parseInt(measurement_unit) : 0;
					$scope.$apply(function () { 
						
						$scope.wagaW ();
					
					});
				}
			}else if($scope.$parent.login_data.scale_type === 'm-3-488'){
				var m = 0;
				var p = str.split("P+");
				if(p[1]){
					m = p[1];
				}
				var t = str.split("T+");
				if(t[1]){
					m = t[1];
				}
				var et = str.split("@+");
				if(et[1]){
					m = et[1];
				}
				
				if(m){
					measurement_unit = parseInt(m);
					$scope.vaga = measurement_unit;
				}
			};	
				//console.log($scope.measurement_unit);
		};
			
		//---------------------------------------------------------------------------------------------------------
		
		$scope.wagaW = function(){
			if($scope.$parent.login_data.scale_type === 'w2110'){
                    measurement_unit = measurement_unit.replace("*", "").trim();
                    measurement_unit = measurement_unit.replace("M", "").trim();
                    measurement_unit = measurement_unit.replace("G", "").trim();
                    if( measurement_unit !== "" ){
					  // console.log(measurement_unit);
                       $scope.vaga = measurement_unit;
					}
				} else if($scope.$parent.login_data.scale_type === 'mx100'){
					$scope.vaga  = measurement_unit;
			}
		};
		
		//---------------------------------------------------------------------------------------------------------
		
		if($scope.$parent.login_data.bruto_polje === "zakljucano"){
			console.log('zakljucano')
			$scope.openConection();
		} else{
			console.log('otkljucano')
			$('input[name="vaga"]').removeAttr("readonly");
		}
		
		
		//------------------------------------------------/VAGA-------------------------------------------------------
		
		$scope.firstMeasurement = function(){
			
			if(!$scope.insert_data.hasOwnProperty('good_name') || $scope.insert_data.good_name==="" || typeof $scope.insert_data.good_name === 'undefined'){
                errorService.error_msg($('input[name="good_name"]'), "Morate upisati naziv robe koja se meri!"); return false;
            }
			if(!$scope.insert_data.hasOwnProperty('firm_name') || $scope.insert_data.firm_name==="" || typeof $scope.insert_data.firm_name === 'undefined'){
                errorService.error_msg($('input[name="firm_name"]'), "Morate selektovati lice koje vrsi usluzno merenje!"); return false;
            }
			if(!$scope.insert_data.hasOwnProperty('vozac') || $scope.insert_data.vozac==="" || typeof $scope.insert_data.vozac === 'undefined'){
                errorService.error_msg($('input[name="vozac"]'), "Morate upisati ime vozaca!"); return false;
            }
			if(!$scope.insert_data.hasOwnProperty('registracija') || $scope.insert_data.registracija==="" || typeof $scope.insert_data.registracija === 'undefined'){
                errorService.error_msg($('input[name="registracija"]'), "Morate upisati registarski broj vozila!"); return false;
            }
			
			
			
			$scope.checkMeasurementStatus();
			console.log($scope.insert_data);
			 $('.ajax_load_visibility').css('visibility','visible');
			usluznoMerenjeFactory.first_measurement($scope.insert_data).success(function(msg){
				 $('.ajax_load_visibility').css('visibility','hidden');
				console.log(msg); 
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					console.log('logedin');
					$scope.insert_data ={};
					$scope.insert_data.session_id = $scope.session_id;
					console.log($scope.session_id);
					$scope.$broadcast('update_first_measure_table_usluzno');
				} else {
					console.log('not logedin');
					$scope.$parent.logoutUser();
				}
			}).error(function(error){
				console.log(error);
			});
			
			//console.log($scope.insert_data);
		};
		
		//----------------------------------------------------------------------------------------------------------------------------------------------
		
		$scope.getClient = function(){
			if(jQuery.isEmptyObject($scope.clients) === true){
				$('.get_client').find('i').switchClass( "fa-user-plus", "fa-cog fa-spin", 0, "easeInOutQuad" );
				clientsFactory.getClients()
				.success(function(msg){
					$scope.clients = msg;
					$('.get_client').find('i').switchClass( "fa-cog fa-spin", "fa-user-plus", 0, "easeInOutQuad" );
					$scope.showClientPanel();
				}).error(function(){
					console.log(error);
				});
			} else {
				$scope.showClientPanel();
			}
		};
		
		//---------------------------------------------------------------------------------------------------------
		
		$scope.setClient = function(id){
			 var result = $filter('filter')($scope.clients , {client_id:id})[0];
			$scope.insert_data.client_id = result.client_id;
			$scope.insert_data.firm_name = result.firm_name;
			$scope.insert_data.client_name = result.client_name;
			$scope.insert_data.client_id = result.client_id;
			$scope.showClientPanel();
			console.log(result)
		};
		
		//----------------------------------------------------------------------------------------------------------------------------------------------
		
		$scope.showClientPanel = function(){
			$scope.show_clients = !$scope.show_clients;
		};
		
		//----------------------------------------------------------------------------------------------------------------------------------------------
		
		$scope.checkMeasurementStatus = function(){
			if($scope.measurement_status){
				$('input[name="vaga"]').attr("placeholer", "Bruto tezina")
				.parent().find('i').attr("data-boxinfo","Bruto tezina");
				$scope.insert_data.bruto = $scope.vaga;
				$scope.insert_data.tara = 0;
			} else {
				$('input[name="vaga"]').attr("placeholer", "Tara tezina")
				.parent().find('i').attr("data-boxinfo","Tara tezina");
				$scope.insert_data.bruto = 0;
				$scope.insert_data.tara = $scope.vaga;
			}
		};
		
		//---------------------------------------------------------------------------------------------------------
		
		$scope.changeMeasurementStatus = function(){
			$scope.measurement_status = !$scope.measurement_status;
		};
		
		//----------------------------------------------------------------------------------------------------------------------------------------------
		
		$scope.$on('$destroy', function() {
	  		// clean up stuff
			chrome.serial.disconnect($scope.connectionId, function(result) {
                console.log('Connection with id: ' + $scope.connectionId + ' closed');
            });
		});
		
		//----------------------------------------------------------------------------------------------------------------------------------------------
		
		$scope.print = function(){
			var content = $('.print_prijem').html();
			$('.print_area').html(content);
			window.print();
		};
		
	};
	
	usluznoMerenjeController.$inject = ['$scope', 'errorService', 'usluznoMerenjeFactory', 'mineFactory', 'clientsFactory', '$filter'];
	angular.module('_raiffisenApp').controller('usluznoMerenjeController', usluznoMerenjeController);
	
	
	
	
	
	
	var usluznoList = function( DTOptionsBuilder, DTColumnBuilder, usersFactory, $scope, $resource, $compile, mainService, usluznoMerenjeFactory) {
        var vm = this;
        vm.secondMeasurement = secondMeasurement;
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
				DTColumnBuilder.newColumn(null).withTitle('Drugo Merenje').notSortable().withOption('width','50px').renderWith(actionsHtml).withClass('text-center')
        	];
		


        function reloadData() {
			console.log(vm.result);
            var resetPaging = false;
            vm.dtInstance.changeData(mainService.domainURL()+'usluzno_merenje_api/prvo_merenje/'+vm.result+'/');
        }

        function secondMeasurement(id){
            /*console.log(id);
			console.log($scope.$parent.insert_data);*/
			
			var data = {
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
			})
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function actionsHtml (data, type, full, meta) {
           vm.measures[data.usluzno_id] = data;
            return' <i class="fa fa fa-balance-scale btn btn-primary btn-sm" style="margin-top:0px" title="Prosledi na drugo merenje" data-ng-click="userShowCase.secondMeasurement(userShowCase.measures[' + data.usluzno_id + '])"></i>';
        }
    };
    usluznoList.$inject = ['DTOptionsBuilder', 'DTColumnBuilder', 'usersFactory', '$scope', '$resource', '$compile', 'mainService', 'usluznoMerenjeFactory'];
    angular.module('_raiffisenApp').controller('usluznoList', usluznoList);
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}());