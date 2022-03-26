(function(){
	var otpremaMerkantilaController = function($scope, $filter, $location, infoboxService, otpremaMerkantilaFactory, clientsFactory, mineFactory, errorService, mainService, $timeout){
		
		$scope.insert_data = {
			tara:0,
			bruto:0
		};
		$scope.second_insert_data = {
			bruto:0
		},
		$scope.goods_type = {};
		$scope.goods_name = {};
		$scope.clients = []; 
		$scope.first_measurement = [];
		$scope.show_clients = false;
		var result;
		$scope.session_id = null;
		$scope.showInput = $scope.showInput;
		$scope.last_measurement = {};
		$scope.insert_data.tara = 0;
		$scope.ifKukuruz = true;
		$scope.ifZitarice = true;
		$scope.second_measurement = false;
		$scope.proba= function(){
			console.log('nlasd');
		}
		
		/*$timeout(function(){
			$('.client-wrapper').outerHeight(600)
			var height_v = $('.client-wrapper').innerHeight() + 40;
			 console.log(height_v);
			$('.client_panel_body').css({"height":height_v+"px"});
		},'1000')*/
		
		
		
		$( ".second_measure_wrapper" ).draggable({ handle: ".second_measure_header" });
		$scope.enableDays = [];
		$scope.otpremaSearch = {};
		//---------------------------------------------------------------------------------------------------------
		
		$scope.enableDays = ["7-8-2013","1-12-2015","4-12-2015","9-12-2015","15-12-2015"];//in mysql date format like DATE_FORMAT(DATE(input_records.input_date),'%e-%c-%Y')*/

		 $scope.enableAllTheseDays = function(date) {
			var sdate = $.datepicker.formatDate( 'd-m-yy', date)
			
			if($.inArray(sdate, $scope.enableDays) != -1) {
				return [true,"","Zabeležena otprema"];
			}
			return [false,"","Nema beležene otpreme"];
		}
		
		
		//---------------------------------------------------------------------------------------------------------
		$scope.openSearchPanelState = true;
			$scope.gimeSearchPanel = function(){
			if($scope.openSearchPanelState === true){
				$scope.openSearchPanel();
				$scope.openSearchPanelState = false;	
			}else{
				$scope.closeSearchPanel();
				$scope.openSearchPanelState = true;	
			}		
		}
		
		
		$scope.openSearchPanel = function(){
			$('.otpremaSearch').find('.fa-cog').addClass('fa-spin');
			otpremaMerkantilaFactory.enableDays({'session_id':$scope.insert_data.session_id}).success(function(msg){
				$('.searchPanelOtprema').stop().animate({'margin-bottom':'0px'}, 800, 'easeInOutQuad', function(){
					setTimeout(function() { 
						$('.otpremaSearch').find('.fa-cog').removeClass('fa-spin');
					}, 800);
				});
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					$scope.enableDays = [];
					for(i=0;i<msg.length;i++){
						$scope.enableDays.push(msg[i].datum);
					}
					$.datepicker.setDefaults( $.datepicker.regional[ "sr-SR" ] );
					$('input[name="datumOtpreme"]').datepicker({
						changeMonth: true, 
						changeYear: true, 
						dateFormat: 'dd.mm.yy', 
						beforeShowDay: $scope.enableAllTheseDays
					});
					//console.log($scope.enableDays);
				} else {
					//not loged in
					$scope.$parent.logoutUser();
				}
			}).error(function(){
				console.log('error');
			});
		}
		
		$scope.closeSearchPanel = function(){
			$('.otpremaSearch').find('.fa-cog').addClass('fa-spin');
			$('.searchPanelOtprema').stop().animate({'margin-bottom':'-238px'}, 800, 'easeInOutQuad', function(){
					setTimeout(function() { 
						$('.otpremaSearch').find('.fa-cog').removeClass('fa-spin');
					}, 800);
				});
			console.log($scope.otpremaSearch);
		$('input[name="datumOtpreme"]').datepicker('destroy');
		}
		
		
		$scope.getSearchType = function(){
			$('.searchPanelHead').find('i').switchClass( "fa-search", "fa-cog fa-spin", 0, "easeInOutQuad" );
			$scope.otpremaSearch.session_id = $scope.insert_data.session_id;
			$scope.otpremaSearch.input_type={}
			$scope.otpremaSearch.goods_names = {};
			$scope.otpremaSearch.inputs = {};
			otpremaMerkantilaFactory.getSearchType($scope.otpremaSearch).success(function(msg){
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					console.log(msg);
					$scope.otpremaSearch.output_type = msg;
					$('.searchPanelHead').find('i').switchClass( "fa-cog fa-spin", "fa-search", 0, "easeInOutQuad" );
				} else {
				//not loged in
				$scope.$parent.logoutUser();
				}	
			}).error(function(error){
				console.log(error);
			});
		};
		
		
		
		
		$scope.getSearchMerkantilaName = function(){
			$('.searchPanelHead').find('i').switchClass( "fa-search", "fa-cog fa-spin", 0, "easeInOutQuad" );
			otpremaMerkantilaFactory.getSearchMerkantilaName($scope.otpremaSearch).success(function(msg){
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					console.log(msg);
					$scope.otpremaSearch.goods_names = msg;
					$('.searchPanelHead').find('i').switchClass( "fa-cog fa-spin", "fa-search", 0, "easeInOutQuad" );
				} else {
				//not loged in
				$scope.$parent.logoutUser();
				}	
			}).error(function(error){
				console.log(error);
			});
		};
		
		
		$scope.getSearchOtpremnica = function(){
			$('.searchPanelHead').find('i').switchClass( "fa-search", "fa-cog fa-spin", 0, "easeInOutQuad" );
			otpremaMerkantilaFactory.getSearchOtpremnica($scope.otpremaSearch).success(function(msg){
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					console.log(msg);
					$scope.otpremaSearch.outputs = msg;
					$('.searchPanelHead').find('i').switchClass( "fa-cog fa-spin", "fa-search", 0, "easeInOutQuad" );
				} else {
				//not loged in
				$scope.$parent.logoutUser();
				}	
			}).error(function(error){
				console.log(error);
			});
		};
		
		$scope.destroyPrijemPanel = function(){
			console.log($scope.prijemSearch);
		//$('input[name="datumPrijema"]').datepicker('destroy');
		};
		
		$scope.selectOdabranaOtprema = function(){
			$('.searchPanelHead').find('i').switchClass( "fa-search", "fa-cog fa-spin", 0, "easeInOutQuad" );
			otpremaMerkantilaFactory.selectOdabraniPrijem($scope.otpremaSearch).success(function(msg){
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					if(msg.length !== 0){
						$scope.last_measurement = msg[0];
						$scope.hideInputItems(msg[0].goods_type);
					}
					$('.searchPanelHead').find('i').switchClass( "fa-cog fa-spin", "fa-search", 0, "easeInOutQuad" );
				} else {
				//not loged in
				$scope.$parent.logoutUser();
				}	
			}).error(function(error){
				console.log(error);
			});
		};
		
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
		
		//----------------------------------------------------------------------------------------------------------
		
		$scope.selectLastMeasurement = function(){
			otpremaMerkantilaFactory.selectLastInput({'session_id':$scope.session_id}).success(function(msg){
				console.log(msg);
				if($.isEmptyObject(msg)===false){
					$scope.showInput = true;
					$scope.last_measurement = msg[0]; 
					$scope.hideInputItems($scope.last_measurement.goods_type);
				} else {
				 
				}
			}).error(function(error){
				console.log(error)
			});
		};
		
		$scope.hideInputItems = function(kultura){
			if(kultura==='kukuruz' || kultura === 'kukuruz tel-kel'){
				$scope.ifKukuruz = true;
				$scope.ifZitarice = false;
				$scope.last_measurement.neto2 = $scope.last_measurement.neto - $scope.last_measurement.kalo_rastur;
				$scope.last_measurement.neto2 = $scope.last_measurement.neto2.toFixed(2);
			} else if(kultura === 'psenica' || kultura === 'psenica tel-kel'){
				$scope.ifKukuruz = false;
				$scope.ifZitarice = true;
			} else if(kultura === 'jecam'){
				$scope.ifKukuruz = false;
				$scope.ifZitarice = true;
			} else if(kultura === 'sacma' || kultura === 'kukuruz tel-kel'){
				$scope.ifKukuruz = false;
				$scope.ifZitarice = false;
				$scope.ifSacma = false;
			} else {
				$scope.ifKukuruz = false;
				$scope.ifZitarice = false;
			}
		};
		
		//---------------------------------------------------------------------------------------------------------
		
		$scope.culture = {
			hektolitar:false,
			lom:false,
			defekt:false
		};
		
		//----------------------------------------------------------------------------------------------------------
		
		$scope.input_type = [
			{"key":"iskladistenje","label":"Iskladistenje"},
			{"key":"otprema","label":"Otprema"}
		];
		
		//---------------------------------------------------------------------------------------------------------
	   
		
		/*$( ".client-wrapper" ).draggable({ handle: ".client_panel_header" });*/
		
		//---------------------------------------------------------------------------------------------------------
		
		//set infobox messages
		infoboxService.set_infoBox();
		
		//---------------------------------------------------------------------------------------------------------
		$scope.getfirstMeasurement = function(){
			console.log($scope.insert_data.session_id);
			otpremaMerkantilaFactory.getfirstMeasurement({'session_id':$scope.insert_data.session_id}).success(function(msg){
				$scope.first_measurement = msg;
				console.log(msg);
			}).error(function(error){
					console.log(error);
			});
		};
		
		
		
		//---------------------------------------------------------------------------------------------------------
		otpremaMerkantilaFactory.getGoodsType().success(function(msg){
			$scope.goods_type = msg;
		}).error(function(error){
				console.log(error);
		});
		
		//---------------------------------------------------------------------------------------------------------
		
		$scope.selectGoodsName = function(obj){
		
			if(obj!=undefined){
				$scope.insert_data.type_of_goods_id = obj.type_of_goods_id;
			}
			otpremaMerkantilaFactory.getGoodsName($scope.insert_data.type_of_goods_id)
			.success(function(msg){
				$scope.goods_name = msg;
				/*if($scope.insert_data.type_of_goods_id===1){
						$scope.culture.hektolitar=false;
						$scope.culture.lom=true;
						$scope.culture.defekt=true;
				} else if($scope.insert_data.type_of_goods_id===2){
						$scope.culture.hektolitar=true;
						$scope.culture.lom=false;
						$scope.culture.defekt=false;
				} else if($scope.insert_data.type_of_goods_id===5){
						$scope.culture.hektolitar=true;
						$scope.culture.lom=false;
						$scope.culture.defekt=false;
				} else {
					$scope.culture.hektolitar=false;
					$scope.culture.lom=false;
					$scope.culture.defekt=false;
				}*/
			}).error(function(error){
				console.log(error);
			});
		}
		
		
		
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
		};
		
		//---------------------------------------------------------------------------------------------------------
		
		$scope.showClientPanel = function(){
			$scope.show_clients = !$scope.show_clients;
			
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
		
		//--------------------------------------------VAGA-------------------------------------------------
		
		$scope.connectionId;
		$scope.openConection = function(){
			//console.log($scope.$parent.login_data.scale_port);
			var bitrate = mainService.login_data.scale_type === 'm-3-488' ? 2400 : 9600
			 chrome.serial.connect(mainService.login_data.scale_port, {bitrate: bitrate}, function(info) {
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
		var arrPromenjive = [];
		
		//---------------------------------------------------------------------------------------------------------
		
		$scope.onReceiveCallback = function(info) {
			    
			var bufView = new Uint8Array(info.data);
			var encodedString = String.fromCharCode.apply(null, bufView);
			//console.log("encoded", encodedString)
			var str = decodeURIComponent(encodedString);
			if(!isNaN(str)){
				return;
			}
			
			if(mainService.login_data.scale_type === 'w2110'){
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
			}else if(mainService.login_data.scale_type === 'mx100'){
				str = str.replace(/[^\d.-]/g, '');
			    if(str!=='0'){
					str =  str.slice(0, -1);
				}
				if(str.length>0){
					measurement_unit= Number(str);
					$scope.$apply(function () { 
						$scope.wagaW ();
					});
				}
			}else if(mainService.login_data.scale_type === 'm-0-67'){
				if(str.trim().length>0){
					measurement_unit= str.replace(/[^\d.-]/g, '');
					measurement_unit= Number(measurement_unit)>0 && !isNaN(parseInt(measurement_unit)) ? parseInt(measurement_unit) : 0;
					$scope.$apply(function () { 
						$scope.insert_data.tara = measurement_unit;
						$scope.second_insert_data.bruto = measurement_unit;
					});
				}
			}else if(mainService.login_data.scale_type === 'm-3-488'){
				if(str.length>1){
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
					
					measurement_unit = m;
						$scope.$apply(function(){
							$scope.insert_data.tara = parseInt(m);
							$scope.second_insert_data.bruto = parseInt(m);
						}
					)
						
					last_received =  m;
				}
				
			}else if(mainService.login_data.scale_type === 'bmv-60'){
				var s = str.replace(/\D/g,'');
				if(s.length>0){
					measurement_unit = Number(s);
					$scope.$apply(function () { 
						$scope.insert_data.tara = measurement_unit;
						$scope.second_insert_data.bruto = measurement_unit;
					});
				}
			};			

		};
			
		//---------------------------------------------------------------------------------------------------------
		
		$scope.wagaW = function(){
			
			console.log("measurement_unit", measurement_unit)
            /*if(measurement_unit.indexOf('G') == -1 || measurement_unit.indexOf('M') == -1){*/
				if(mainService.login_data.scale_type === 'w2110'){
                    measurement_unit = measurement_unit.replace("*", "").trim();
                    measurement_unit = measurement_unit.replace("M", "").trim();
                    measurement_unit = measurement_unit.replace("G", "").trim();
                    if( measurement_unit !== "" ){
					   $scope.insert_data.tara = measurement_unit;
					   $scope.second_insert_data.bruto = measurement_unit;
					}
				} else if(mainService.login_data.scale_type === 'mx100'){
						$scope.insert_data.tara = measurement_unit;
						$scope.second_insert_data.bruto = measurement_unit;
				}
                   // 
			/*if(measurement_unit.indexOf('0G') == -1){
				if(measurement_unit.indexOf('0M') == -1){   
					if(measurement_unit != ""){
						if(measurement_unit != " "){
							if(measurement_unit.indexOf('G') == -1){
								if(measurement_unit.indexOf('M') == -1){
									if(last_received.length === measurement_unit.length){
										measurement_unit = measurement_unit.replace("*", "").trim()+'0';
										$scope.last_received = measurement_unit;
										$scope.insert_data.tara = measurement_unit;
										$scope.second_insert_data.bruto = measurement_unit;
										//console.log(measurement_unit);
									}else {
										last_received = measurement_unit;
										
									}
								}
						 }
					  }
					}
				}   
			 } */
		};
		
		//---------------------------------------------------------------------------------------------------------
		console.log(mainService.login_data);
		if(mainService.login_data.bruto_polje === "zakljucano"){
			
			$scope.openConection();
		} else{
			console.log('otkljucano')
			$('input[name="tara"]').removeAttr("readonly");
		}
		
		
		//------------------------------------------------/VAGA-------------------------------------------------------
		
		$scope.firstMeasurement = function(){
			 if(!$scope.insert_data.hasOwnProperty('tara') || $scope.insert_data.tara==="" || typeof $scope.insert_data.tara === 'undefined'){
                errorService.error_msg($('input[name="tara"]'), "Polje za unos tare je obavezno"); return false;
            }
            if(!$scope.insert_data.hasOwnProperty('type_of_goods_id') || $scope.insert_data.type_of_goods_id === "" || typeof $scope.insert_data.type_of_goods_id === 'undefined' || $scope.insert_data.type_of_goods_id === null) {
                errorService.error_msg($('select[name="type_of_goods_id"]'), "Morate odabrati vrstu robe"); return false;
            }
			if(!$scope.insert_data.hasOwnProperty('goods_id') || $scope.insert_data.goods_id === "" || typeof $scope.insert_data.goods_id === 'undefined' || $scope.insert_data.goods_id === null) {
                errorService.error_msg($('select[name="goods_id1"]'), "Morate odabrati naziv  robe"); return false;
            }
			if(!$scope.insert_data.hasOwnProperty('firm_name') || $scope.insert_data.firm_name==="" || typeof $scope.insert_data.firm_name === 'undefined'){
                errorService.error_msg($('input[name="firm_name"]'), "Polje za unos naziva kupca je obavezno"); return false;
            }
			if(!$scope.insert_data.hasOwnProperty('driver_name') || $scope.insert_data.driver_name==="" || typeof $scope.insert_data.driver_name === 'undefined'){
                errorService.error_msg($('input[name="driver_name"]'), "Polje za unos imena vozaca je obavezno"); return false;
            }
			if(!$scope.insert_data.hasOwnProperty('driver_reg') || $scope.insert_data.driver_reg==="" || typeof $scope.insert_data.driver_reg === 'undefined'){
                errorService.error_msg($('input[name="driver_reg"]'), "Morate upisati registarski broj vozila sa tablica"); return false;
            }
            if(!$scope.insert_data.hasOwnProperty('krajnje_mesto') || $scope.insert_data.krajnje_mesto==="" || typeof $scope.insert_data.krajnje_mesto === 'undefined'){
                errorService.error_msg($('input[name="krajnje_mesto"]'), "Morate upisati krajnje mesto otpreme"); return false;
            }
			
			 $('.ajax_load_visibility').css('visibility','visible');
			otpremaMerkantilaFactory.outputMerkantila($scope.insert_data).success(function(msg){ 
				 $('.ajax_load_visibility').css('visibility','hidden');
				console.log(msg); 
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					console.log('logedin');
					$scope.$broadcast('update_first_measure_table');
					$scope.insert_data ={};
					$scope.insert_data.session_id = $scope.session_id;
					console.log($scope.session_id);
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
		
		$scope.$on('$destroy', function() {
	  		// clean up stuff
			chrome.serial.disconnect($scope.connectionId, function(result) {
                console.log('Connection with id: ' + $scope.connectionId + ' closed');
            });
			$scope.closeSearchPanel();
			
		});
		
		//----------------------------------------------------------------------------------------------------------------------------------------------
		
		$scope.print = function(){
			var content = $('.print_prijem').html();
			$('.print_area').html(content);
			window.print();
		};
		
		$scope.secondMeasurementOtprema = function(){
			console.log($scope.second_insert_data);
			if(!$scope.second_insert_data.hasOwnProperty('bruto') || $scope.second_insert_data.bruto==="" || typeof $scope.second_insert_data.bruto === 'undefined'){
                errorService.error_msg($('input[name="bruto"]'), "Polje za unos vrednosti bruta!"); return false;
            }
			if($scope.second_insert_data.type_of_goods_id !=="13" && $scope.second_insert_data.type_of_goods_id !=="11"){
				if(!$scope.second_insert_data.hasOwnProperty('vlaga') || $scope.second_insert_data.vlaga==="" || typeof $scope.second_insert_data.vlaga === 'undefined'){
					errorService.error_msg($('input[name="vlaga"]'), "Polje za unos vrednosti vlage je obavezno!"); return false;
				}
				if(!$scope.second_insert_data.hasOwnProperty('primese') || $scope.second_insert_data.primese==="" || typeof $scope.second_insert_data.primese === 'undefined'){
					errorService.error_msg($('input[name="primese"]'), "Polje za unos vrednosti primesa je obavezno!"); return false;
				}
			}
			if($scope.second_insert_data.type_of_goods_id === "1"){
				if(!$scope.second_insert_data.hasOwnProperty('lom') || $scope.second_insert_data.lom==="" || typeof $scope.second_insert_data.lom === 'undefined'){
					errorService.error_msg($('input[name="lom"]'), "Polje za unos vrednosti loma je obavezno!"); return false;
				}
				if(!$scope.second_insert_data.hasOwnProperty('defekt') || $scope.second_insert_data.defekt==="" || typeof $scope.second_insert_data.defekt === 'undefined'){
					errorService.error_msg($('input[name="defekt"]'), "Polje za unos vrednosti defekta je obavezno!"); return false;
				}
			}	
			if($scope.second_insert_data.type_of_goods_id === "5" || $scope.second_insert_data.type_of_goods_id === "2"){
				if(!$scope.second_insert_data.hasOwnProperty('hektolitar') || $scope.second_insert_data.hektolitar==="" || typeof $scope.second_insert_data.hektolitar === 'undefined'){
					errorService.error_msg($('input[name="hektolitar"]'), "Polje za unos vrednosti hektolitra je obavezno!"); return false;
				}
			}
			$scope.second_insert_data.session_id = $scope.session_id;
			$scope.second_insert_data.good_name = $("#good_name option:selected").text();
			
			
			console.log($scope.second_insert_data);
			otpremaMerkantilaFactory.getSecondMeasurement($scope.second_insert_data).success(function(msg){
				console.log(msg);
				$scope.$broadcast('update_first_measure_table');
				$scope.second_measurement = false;
				$scope.second_insert_data ={};
				$scope.selectLastMeasurement();
			}).error(function(error){
				console.log(error)
			});	
		};
		
		//----------------------------------------------------------------------------------------------------------------------------------------------
		
		
	};
	
	otpremaMerkantilaController.$inject = ['$scope', '$filter', '$location', 'infoboxService', 'otpremaMerkantilaFactory', 'clientsFactory', 'mineFactory', 'errorService', 'mainService', '$timeout'];
    angular.module('_raiffisenApp').controller('otpremaMerkantilaController', otpremaMerkantilaController);
	
	
//*************************************************************************************************************************************************************************
	
	
	var otpremaLista = function( DTOptionsBuilder, DTColumnBuilder, usersFactory, $scope, $resource, $compile, mainService, otpremaMerkantilaFactory) {
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
            .fromSource(mainService.domainURL()+'otprema_merkantila_api/empty_result/')
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
				DTColumnBuilder.newColumn('tara').withTitle('bruto').withClass('text-right').withOption('width','70px'),
				DTColumnBuilder.newColumn(null).withTitle('Drugo Merenje').notSortable().withOption('width','50px').renderWith(actionsHtml).withClass('text-center')
        	];
		


        function reloadData() {
			console.log(vm.result);
            var resetPaging = false;
            vm.dtInstance.changeData(mainService.domainURL()+'otprema_merkantila_api/prvo_merenje_merkantila/'+vm.result+'/');
        }

        function secondMeasurement(id){
            console.log(id);
		
			/*console.log($scope.$parent.second_insert_data);*/
			$scope.$parent.second_insert_data = {};
			$scope.$parent.selectGoodsName(id);
			
			jQuery.extend($scope.$parent.second_insert_data,id);
			$scope.$parent.second_measurement = true;
			$scope.$parent.second_insert_data.napomena = id.napomena;
			console.log($scope.$parent.second_insert_data);
			/*if(id.type_of_goods_id==="1"){
						$scope.$parent.culture.hektolitar=false;
						$scope.$parent.culture.lom=true;
						$scope.$parent.culture.defekt=true;
				} else if(id.type_of_goods_id==="2"){
						$scope.$parent.culture.hektolitar=true;
						$scope.$parent.culture.lom=false;
						$scope.$parent.culture.defekt=false;
				} else if(id.type_of_goods_id==="5"){
						$scope.$parent.culture.hektolitar=true;
						$scope.$parent.culture.lom=false;
						$scope.$parent.culture.defekt=false;
				} else {
					$scope.$parent.culture.hektolitar=false;
					$scope.$parent.culture.lom=false;
					$scope.$parent.culture.defekt=false;
				}*/
			if(id.type_of_goods_id==="1" || id.type_of_goods_id==="11"){
						$scope.$parent.culture.hektolitar=false;
						$scope.$parent.culture.lom=true;
						$scope.$parent.culture.defekt=true;
						$scope.$parent.culture.vlaga=true;
						$scope.$parent.culture.primese=true;
				} else if(id.type_of_goods_id==="2" || id.type_of_goods_id==="16"){
						$scope.$parent.culture.hektolitar=true;
						$scope.$parent.culture.lom=false;
						$scope.$parent.culture.defekt=false;
						$scope.$parent.culture.vlaga=true;
						$scope.$parent.culture.primese=true;
				} else if(id.type_of_goods_id==="5"){
						$scope.$parent.culture.hektolitar=true;
						$scope.$parent.culture.lom=false;
						$scope.$parent.culture.defekt=false;
						$scope.$parent.culture.vlaga=true;
						$scope.$parent.culture.primese=true;
				} else if(id.type_of_goods_id==="13"  ){
						$scope.$parent.culture.hektolitar=false;
						$scope.$parent.culture.lom=false;
						$scope.$parent.culture.defekt=false;
						$scope.$parent.culture.vlaga=false;
						$scope.$parent.culture.primese=false;
				} else {
					$scope.$parent.culture.hektolitar=false;
					$scope.$parent.culture.lom=false;
					$scope.$parent.culture.defekt=false;
					$scope.$parent.culture.vlaga=true;
					$scope.$parent.culture.primese=true;
				}
			console.log($scope.$parent.culture);
			/*var data = {
				"input_id":id.input_id,
				"session_id": $scope.$parent.insert_data.session_id,
				"tara": $scope.$parent.insert_data.bruto
			}*/
			
			/*otpremaMerkantilaFactory.getSecondMeasurement(data).success(function(msg){
				console.log(msg);
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					console.log('logedin');
					
						vm.reloadData();
					 $scope.$parent.selectLastMeasurement();
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
           vm.measures[data.output_id] = data;
       	console.log(data);
            

            return'  <i class="fa fa fa-balance-scale btn btn-primary btn-sm" style="margin-top:0px" title="Prosledi na obračun" data-ng-click="userShowCase.secondMeasurement(userShowCase.measures[' + data.output_id + '])"></i>';
        }
    };
    otpremaLista.$inject = ['DTOptionsBuilder', 'DTColumnBuilder', 'usersFactory', '$scope', '$resource', '$compile', 'mainService', 'otpremaMerkantilaFactory'];
    angular.module('_raiffisenApp').controller('otpremaLista', otpremaLista);

	
	
	
	
}());









