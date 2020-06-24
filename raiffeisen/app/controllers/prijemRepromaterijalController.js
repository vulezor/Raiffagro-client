(function(){
	var prijemRepromaterijalController = function($scope, _, $filter, $location, infoboxService, prijemRepromaterijalFactory, clientsFactory, mineFactory, errorService, errorService_second){
		$scope.insert_data = {};
		$scope.insert_data.bruto = 0;
		$scope.insert_data.measurement_unit= 'KG';
		$scope.insert_data.vaga = false;
		$scope.goods_type = {};
		$scope.goods_name = {};
		$scope.clients = []; 
		$scope.show_clients = false;
		$scope.show_goods = false;
		$scope.session_id = null;
		$scope.ifMereno = false;
		$scope.goods_total = [];
		$scope.goods_ordered= [];
		$scope.last_measurement = {};
		$scope.sel_good_type= null;
		$scope.goods_name = null;
		
		//------------------------------------------------------------------------------------------------------
		
		$scope.order_good_type = [
			{type_name:'Hemija',id:6},
			{type_name:'Djubrivo',id:9},
			{type_name:'Seme',id:7},
			{type_name:'Razna roba',id:15}
		];
		
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
			
		prijemRepromaterijalFactory.get_lotovi().then(function(response){
                console.log("lotovi", response.data);
                $scope.lotovi = response.data;
            
        }, function(error){
            console.log(error)
        });

		//---------------------------------------------------------------------------------------------------------
		prijemRepromaterijalFactory.getGoodsType().success(function(msg){
			$scope.goods_type = msg;
		}).error(function(error){
				console.log(error);
		});
		
		
		//---------------------------------------------------------------------------------------------------------
		$scope.getfirstMeasurement = function(){
			console.log($scope.insert_data.session_id);
			prijemRepromaterijalFactory.getfirstMeasurement({'session_id':$scope.insert_data.session_id}).success(function(msg){
				$scope.first_measurement = msg;
				console.log(msg);
			}).error(function(error){
					console.log(error);
			});
		}
		
		//---------------------------------------------------------------------------------------------------------
		$scope.getObjects = function (obj, key, val) {
			var objects = [];
			for (var i in obj) {
				if (!obj.hasOwnProperty(i)) continue;
				if (typeof obj[i] == 'object') {
					objects = objects.concat($scope.getObjects(obj[i], key, val));
				} else if (i == key && obj[key] == val) {
					objects.push(obj);
				}
			}
			return objects;
		}
		//---------------------------------------------------------------------------------------------------------
		
		$scope.selectGoodsName = function(){
			console.log('potvrdio');
			prijemRepromaterijalFactory.getGoodsName($scope.insert_data.type_of_goods_id)
			.success(function(msg){
				console.log(msg);
				$scope.goods_name = msg;
			}).error(function(error){
				console.log(error);
			});
		}
		
		//---------------------------------------------------------------------------------------------------------------------
		
		/*$scope.findMeasurementUnit = function() {
		   	var data = $scope.getObjects($scope.goods_name, 'goods_id', $scope.insert_data.goods_id); 
			console.log(data[0].measurement_unit);
			$scope.insert_data.measurement_unit = data[0].measurement_unit;
			
		}*/
		
		//---------------------------------------------------------------------------------------------------------
		
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
		}
		//----------------------------------------------------------------------------------------------------------------------------
		
		$scope.showClientPanel = function(){
			$scope.show_clients = !$scope.show_clients;
		}
		
		
		//----------------------------------------------------------------------------------------------------------------------------
		var height = window.screen.availHeight - 300;
		$('.goods-wrapper').height(height);
		var height_half = $('.goods-wrapper').height() / 2;
		$('.goods-wrapper').css({'top':'50%', 'margin-top':'-'+height_half+'px'});
		$('.goods_body').height(height - 53);
		$( ".goods-wrapper" ).draggable({ handle: ".goods_head" });
		$scope.getGoods = function(){
			$('.get_goods').find('i').switchClass( "fa-shopping-basket", "fa-cog fa-spin", 0, "easeInOutQuad" );
			if(jQuery.isEmptyObject($scope.goods_total) === true){
				prijemRepromaterijalFactory.get_all_goods()
				.success(function(msg){
					console.log(msg);
					$scope.goods_total = msg;
					$('.get_goods').find('i').switchClass( "fa-cog fa-spin", "fa-shopping-basket", 0, "easeInOutQuad" );
					$scope.showGoodsPanel();
				}).error(function(error){
					console.log(error);
				});	
			} else {
				$('.get_goods').find('i').switchClass( "fa-cog fa-spin", "fa-shopping-basket", 0, "easeInOutQuad" );
				$scope.showGoodsPanel();
			}
		}
		
		//---------------------------------------------------------------------------------------------------------
	
		
		$scope.showGoodsPanel = function(){
			$scope.show_goods = !$scope.show_goods;
		}
		
		//---------------------------------------------------------------------------------------------------------
		
		$scope.orderGoods = function(element){
			console.log(element);
			var arr = 
				{
					goods_id:element.goods_id,
					sort_of_goods_id: element.sort_of_goods_id,
					type_of_goods_id: element.type_of_goods_id,
					quantity:0,
					goods_name:element.goods_name,
					measurement_unit: element.measurement_unit
				}
		
			obj = _.filter($scope.goods_ordered, function(item) { return item.goods_id == element.goods_id });
		
			if( obj.length == 0 || arr.type_of_goods_id==7){
				$scope.goods_ordered.push(arr);
			} else {
				console.log('postoji');
			};
		}
		
		 $('input[name="datum"]').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd.mm.yy',
            onClose:function(){
                var name = $(this).attr('name');
                $scope.insert_data[name] = $(this).val();
            }
        });
		
		$scope.deleteFromOrder = function(obj){
			var myarr = $scope.goods_ordered, arr;
			arr = _.without(myarr, _.findWhere(myarr, {goods_id: obj.goods_id}));
			$scope.goods_ordered = arr;
			console.log(arr);
			//arr = _.without(arr, _.findWhere(arr, {id: 3}));
		}
		
		//----------------------------------------------------------------------------------------------------------------------------
		
		$scope.setClient = function(id){
			 var result = $filter('filter')($scope.clients , {client_id:id})[0];
			$scope.insert_data.client_id = result.client_id;
			$scope.insert_data.firm_name = result.firm_name;
			$scope.insert_data.client_name = result.client_name;
			$scope.insert_data.client_id = result.client_id;
			$scope.showClientPanel();
			console.log(result)
		}
		
		
		//----------------------------------------------------------------------------------------------------------------------
		
		$scope.firstMeasurement = function(){
			console.log($scope.insert_data); 
			console.log($scope.goods_ordered);  
			if(!$scope.insert_data.hasOwnProperty('otpremnica_prodavca') ||  $scope.insert_data.otpremnica===0 ||  $scope.insert_data.otpremnica_prodavca===null || typeof $scope.insert_data.otpremnica_prodavca === 'undefined'){
                errorService.error_msg($('input[name="otpremnica_prodavca"]'), "Morate upisati otpremnicu prodavca!"); return false;
            }
			if($scope.insert_data.vaga===true){
				if(!$scope.insert_data.hasOwnProperty('bruto') ||  $scope.insert_data.bruto===0 ||  $scope.insert_data.bruto===null || typeof $scope.insert_data.bruto === 'undefined'){
					errorService.error_msg($('input[name="bruto"]'), "Bruto / Količina je obavezno polje!"); return false;
				}
				if(!$scope.insert_data.hasOwnProperty('type_of_goods_id') ||  $scope.insert_data.type_of_goods_id===0 ||  $scope.insert_data.type_of_goods_id===null || typeof $scope.insert_data.type_of_goods_id === 'undefined'){
					errorService.error_msg($('select[name="type_of_goods_id"]'), "Morate izabrati tip robe!"); return false;
				}
			
				if(!$scope.insert_data.hasOwnProperty('goods_id') ||  $scope.insert_data.goods_id===0 ||  $scope.insert_data.goods_id===null || typeof $scope.insert_data.goods_id === 'undefined'){
					errorService.error_msg($('input[name="goods_id"]'), "Morate izabrati naziv robe!"); return false;
				}
			}
			if(!$scope.insert_data.hasOwnProperty('firm_name') ||  $scope.insert_data.firm_name===0 ||  $scope.insert_data.firm_name===null || typeof $scope.insert_data.firm_name === 'undefined'){
                errorService.error_msg($('input[name="firm_name"]'), "Morate izabrati dobavljača!"); return false;
            }
			if(!$scope.insert_data.hasOwnProperty('driver_name') ||  $scope.insert_data.driver_name===0 ||  $scope.insert_data.driver_name===null || typeof $scope.insert_data.driver_name === 'undefined'){
                errorService.error_msg($('input[name="driver_name"]'), "Morate upisati ime vozača!"); return false;
            }
			if(!$scope.insert_data.hasOwnProperty('driver_reg') ||  $scope.insert_data.driver_reg===0 ||  $scope.insert_data.driver_reg===null || typeof $scope.insert_data.driver_reg === 'undefined'){
                errorService.error_msg($('input[name="driver_reg"]'), "Morate upisati registarski broj vozila !"); return false;
            }
			
			if($scope.insert_data.vaga===false){
				if($scope.goods_ordered.length !== 0 ){
					console.log($scope.checkOrderSet());
					if($scope.checkOrderSet() !== false){
						$scope.insert_data.orders = $scope.goods_ordered; 
						$scope.setResult();
					}	
				} else {
					errorService_second.error_msg($('.send_good_body'), "Morate dodati makar jedan proizvod da bi ste potvrdili ulaz robe!"); return false;
				}	
			
			} else {
				console.log($scope.insert_data.orders);
				$scope.setResult();
			}
			
		}
		
		//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		
		$scope.checkOrderSet = function(){
			var status = true;
			$.each($scope.goods_ordered, function(i, item){
				if(item.quantity <= 0){
					errorService_second.error_msg($('.send_good_body'), "proizvodu "+item.goods_name+" niste dodelili kolicinu!"); status=false; return false;	
				}
			});
			return status;
		}
		
		//--------------------------------------------------------------------------------------------------------------------------------------------------------------
		
		$scope.setResult = function(){
			prijemRepromaterijalFactory.insertRepromaterijal($scope.insert_data).success(function(msg){
					if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
						console.log('logedin'); 
						var vaga = $scope.insert_data.vaga
						if($scope.insert_data.vaga === false){
							$scope.insert_data = {};           //resetuje insert_data
							$scope.goods_ordered = [];         //resetuje goods_ordered
							$scope.insert_data.vaga = vaga;
							$scope.insert_data.session_id = $scope.session_id;
							$scope.selectLastMeasurement();
						} else {
							$scope.insert_data = {};           //resetuje insert_data
							$scope.goods_ordered = [];         //resetuje goods_ordered
							$scope.insert_data.vaga = vaga;
							$scope.insert_data.session_id = $scope.session_id;
							$scope.selectLastMeasurement();
							$scope.$broadcast('update_first_measure_table');
						}	
					} else {
						console.log('not logedin');
						$scope.$parent.logoutUser();
					}
				}).error(function(error){
					console.log(error);
				});
		}
		
		
		//--------------------------------------------VAGA-------------------------------------------------
		
		$scope.connectionId;
		$scope.openConection = function(){
			//console.log($scope.$parent.login_data.scale_port);
			 chrome.serial.connect($scope.$parent.login_data.scale_port, {bitrate: 9600}, function(info) {
				$scope.$apply(function () { 
                $scope.connectionId = info.connectionId;
               // console.log('Connection opened with id: ' + $scope.connectionId + ', Bitrate: ' + info.bitrate);
                chrome.serial.onReceive.addListener($scope.onReceiveCallback);
     
				});
			});
		}
		
		//---------------------------------------------------------------------------------------------------------
		
		var measurement_unit = '';
		var last_received = 0;
		
		//---------------------------------------------------------------------------------------------------------
		
		$scope.onReceiveCallback = function(info) {
			    
				var bufView = new Uint8Array(info.data);
				var encodedString = String.fromCharCode.apply(null, bufView);
				var str = decodeURIComponent(encodedString);
				if (str.charAt(str.length-1) === '\n') {
				  stringReceived = str.substring(0, str.length-1);
				  onLineReceived(stringReceived);
				  
				 measurement_unit = '';
					
				} else {
				 
					measurement_unit = str;
					
				}
				$scope.$apply(function () { 
					if($scope.$parent.login_data.scale_type === 'w2110'){
						$scope.wagaW ();
					};	
				});
				//console.log($scope.measurement_unit);
		};
			
		//---------------------------------------------------------------------------------------------------------
		
		$scope.wagaW = function(){
            measurement_unit = measurement_unit.replace("*", "").trim();
            measurement_unit = measurement_unit.replace("M", "").trim();
            measurement_unit = measurement_unit.replace("G", "").trim();
            if( measurement_unit !== "" ){
               $scope.insert_data.bruto = measurement_unit;
            }
			/*if(measurement_unit.indexOf('0G') == -1){
				if(measurement_unit.indexOf('0M') == -1){   
					if(measurement_unit != ""){
						if(measurement_unit != " "){
							if(measurement_unit.indexOf('G') == -1){
								if(measurement_unit.indexOf('M') == -1){
									if(last_received.length === measurement_unit.length){
										measurement_unit = measurement_unit.replace("*", "").trim()+'0';
										$scope.last_received = measurement_unit;
										$scope.insert_data.bruto = measurement_unit;
									}else {
										last_received = measurement_unit;
										
									}
								}
						 }
					  }
					}
				}   
			 } */
		}
		
		//---------------------------------------------------------------------------------------------------------
		$scope.setVaga = function(){
			if($scope.insert_data.vaga === true){
				$scope.openConection();
				$('input[name="bruto"]').attr('readonly', true);
				
			} else {
				$('input[name="bruto"]').attr('readonly', false);
				$scope.insert_data.bruto = 0;
				chrome.serial.disconnect($scope.connectionId, function(result) {
                	console.log('Connection with id: ' + $scope.connectionId + ' closed');
            	});
			}
		}
		/*if($scope.$parent.login_data.bruto_polje === "zakljucano"){
			console.log('zakljucano')
			$scope.openConection();
		} else{
			console.log('otkljucano')
			$('input[name="bruto"]').removeAttr("readonly");
		}*/
		
		
		//------------------------------------------------/VAGA-------------------------------------------------------
		
		
		//----------------------------------------------------------------------------------------------------------
		
		$scope.selectLastMeasurement = function(){
			prijemRepromaterijalFactory.selectLastInput({'session_id':$scope.session_id}).success(function(msg){
				console.log(msg);
				if($.isEmptyObject(msg)===false){
					$scope.showInput = true;
					$scope.last_measurement = msg; 
					if(msg.inputs[0].bruto === "0.000"){
						$scope.ifMereno = true;
					
					} else {
						$scope.ifMereno = false;
					}
				} else {
				 
				}
			}).error(function(error){
				console.log(error)
			});
		}
		
		
		$scope.$on('$destroy', function() {
	  		// clean up stuff
			//$scope.closePrijemPanel();
			chrome.serial.disconnect($scope.connectionId, function(result) {
                console.log('Connection with id: ' + $scope.connectionId + ' closed');
            });
		});
		
		$scope.print = function(){
			var content = $('.print_prijem').html();
			$('.print_area').html(content);
			window.print();
		}
	}
	
	prijemRepromaterijalController.$inject = ['$scope', '_','$filter', '$location', 'infoboxService', 'prijemRepromaterijalFactory', 'clientsFactory', 'mineFactory', 'errorService', 'errorService_second'];
	angular.module('_raiffisenApp').controller('prijemRepromaterijalController', prijemRepromaterijalController);
	
	
	
	

	
	
	var measurementListRepromaterijal = function( DTOptionsBuilder, DTColumnBuilder, usersFactory, $scope, $resource, $compile, mainService, prijemRepromaterijalFactory) {
        var vm = this;
        vm.secondMeasurement = secondMeasurement;
       // vm.stateChange = stateChange;
        vm.rowNum = 0;
        $scope.$on("update_first_measure_table", function(event) {
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
                }, {
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
				DTColumnBuilder.newColumn('document_br').withTitle('Doc.br').withOption('width', '5%')/*.renderWith(actionsEditUser)*/,
				DTColumnBuilder.newColumn('date').withTitle('Datum prijema'),
				DTColumnBuilder.newColumn('firm_name').withTitle('Firma/Gazdinstvo'),
				DTColumnBuilder.newColumn('goods_name').withTitle('Naziv robe'),
				DTColumnBuilder.newColumn('driver_name').withTitle('Vozač'),
				DTColumnBuilder.newColumn('vehicle_registration').withTitle('registracija'),
				DTColumnBuilder.newColumn('bruto').withTitle('Bruto').withClass('text-right').withOption('width','70px'),
				DTColumnBuilder.newColumn(null).withTitle('Merenje').notSortable().withOption('width','50px').renderWith(actionsHtml).withClass('text-center')
        	];
		


        function reloadData() {
			console.log(vm.result);
            var resetPaging = false;
            vm.dtInstance.changeData(mainService.domainURL()+'prijem_repromaterijal_api/prvo_merenje_repromaterijal/'+vm.result+'/');
        }

        function secondMeasurement(id){
            /*console.log(id);
			console.log($scope.$parent.insert_data);*/
			
			var data = {
				"input_id":id.input_id,
				"session_id": $scope.$parent.insert_data.session_id,
				"tara": $scope.$parent.insert_data.bruto
			}
		
			prijemRepromaterijalFactory.getSecondMeasurement(data).success(function(msg){
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
           vm.measures[data.input_id] = data;
       
            

            return'  <i class="fa fa fa-balance-scale btn btn-primary btn-sm" style="margin-top:0px" title="Prosledi na obračun" data-ng-click="repromaterijalShowCase.secondMeasurement(repromaterijalShowCase.measures[' + data.input_id + '])"></i>';
        }
    };
    measurementListRepromaterijal.$inject = ['DTOptionsBuilder', 'DTColumnBuilder', 'usersFactory', '$scope', '$resource', '$compile', 'mainService', 'prijemRepromaterijalFactory'];
    angular.module('_raiffisenApp').controller('measurementListRepromaterijal', measurementListRepromaterijal);

	
	
}());