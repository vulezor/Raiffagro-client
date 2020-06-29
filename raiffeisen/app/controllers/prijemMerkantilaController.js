(function(){
	var prijemMerkantilaController = function($scope, $filter, $location, infoboxService, prijemMerkantilaFactory, clientsFactory, mineFactory, mainService, errorService){
		
		$scope.insert_data = {
			bruto:0
		};
		$scope.goods_type = {};
		$scope.goods_name = {};
		$scope.clients = []; 
		$scope.first_measurement = [];
		$scope.show_clients = false;
		var result;
		$scope.session_id = null;
		$scope.showInput = $scope.showInput;
		$scope.last_measurement = {};
		$scope.insert_data.bruto = 0;
		$scope.ifKukuruz = true;
		$scope.ifZitarice = true;
		$scope.ifSacma = true;
		
		
		$scope.enableDays = [];
		$scope.prijemSearch = {};
		
		/*var height_v = $('.client-wrapper').innerHeight() + 40;
		console.log(height_v);
		$('.client_panel_body').css({"height":height_v+"px"});*/
		/*$( ".client-wrapper" ).draggable({ handle: ".client_panel_header" });*/
		//---------------------------------------------------------------------------------------------------------
		
		/*$scope.enableDays = ["7-8-2013","1-12-2015","4-12-2015","9-12-2015","15-12-2015"];//in mysql date format like DATE_FORMAT(DATE(input_records.input_date),'%e-%c-%Y')*/

		 $scope.enableAllTheseDays = function(date) {
			var sdate = $.datepicker.formatDate( 'd-m-yy', date)
			
			if($.inArray(sdate, $scope.enableDays) != -1) {
				return [true,"","Zabeležen prijem"];
			}
			return [false,"","Nema beleženog prijema"];
		};
		
		
		//---------------------------------------------------------------------------------------------------------
		$scope.openSearchPanelState = true;
			$scope.gimePrijemPanel = function(){
			if($scope.openSearchPanelState === true){
				$scope.openSearchPanel();
				$scope.openSearchPanelState = false;	
			}else{
				$scope.closePrijemPanel();
				$scope.openSearchPanelState = true;	
			}		
		};
		
		
		$scope.openSearchPanel = function(){
			$('.prijemSearch').find('.fa-cog').addClass('fa-spin');
			prijemMerkantilaFactory.enableDays({'session_id':$scope.insert_data.session_id}).success(function(msg){
				$('.searchPanelPrijem').stop().animate({'margin-bottom':'0px'}, 800, 'easeInOutQuad', function(){
					setTimeout(function() { 
						$('.prijemSearch').find('.fa-cog').removeClass('fa-spin');
					}, 800);
				});
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					$scope.enableDays = [];
					for(i=0;i<msg.length;i++){
						$scope.enableDays.push(msg[i].datum);
					}
					$.datepicker.setDefaults( $.datepicker.regional[ "sr-SR" ] );
					$('input[name="datumPrijema"]').datepicker({
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
		};
		
		$scope.closePrijemPanel = function(){
			$('.prijemSearch').find('.fa-cog').addClass('fa-spin');
			$('.searchPanelPrijem').animate({'margin-bottom':'-238px'}, 800, 'easeInOutQuad', function(){
					setTimeout(function() { 
						$('.prijemSearch').find('.fa-cog').removeClass('fa-spin');
					}, 800);
				});
			console.log($scope.prijemSearch);
		$('input[name="datumPrijema"]').datepicker('destroy');
		};
		
		
		$scope.getSearchType = function(){
			$('.searchPanelHead').find('i').switchClass( "fa-search", "fa-cog fa-spin", 0, "easeInOutQuad" );
			$scope.prijemSearch.session_id = $scope.insert_data.session_id;
			$scope.prijemSearch.input_type={}
			$scope.prijemSearch.goods_names = {};
			$scope.prijemSearch.inputs = {};
			prijemMerkantilaFactory.getSearchType($scope.prijemSearch).success(function(msg){
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					console.log(msg);
					$scope.prijemSearch.input_type = msg;
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
			prijemMerkantilaFactory.getSearchMerkantilaName($scope.prijemSearch).success(function(msg){
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					console.log(msg);
					$scope.prijemSearch.goods_names = msg;
					$('.searchPanelHead').find('i').switchClass( "fa-cog fa-spin", "fa-search", 0, "easeInOutQuad" );
				} else {
				//not loged in
				$scope.$parent.logoutUser();
				}	
			}).error(function(error){
				console.log(error);
			});
		};
		
		
		$scope.getSearchPrijemnica = function(){
			$('.searchPanelHead').find('i').switchClass( "fa-search", "fa-cog fa-spin", 0, "easeInOutQuad" );
			prijemMerkantilaFactory.getSearchPrijemnica($scope.prijemSearch).success(function(msg){
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					console.log(msg);
					$scope.prijemSearch.inputs = msg;
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
		
		$scope.selectOdabraniPrijem = function(){
			$('.searchPanelHead').find('i').switchClass( "fa-search", "fa-cog fa-spin", 0, "easeInOutQuad" );
			prijemMerkantilaFactory.selectOdabraniPrijem($scope.prijemSearch).success(function(msg){
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
			prijemMerkantilaFactory.selectLastInput({'session_id':$scope.session_id}).success(function(msg){
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
			if(kultura==='kukuruz'  || kultura === 'kukuruz tel-kel'){
				$scope.ifKukuruz = true;
				$scope.ifZitarice = false;
				$scope.ifSacma = true;
				$scope.last_measurement.neto2 = $scope.last_measurement.neto - $scope.last_measurement.kalo_rastur;
				$scope.last_measurement.neto2 = $scope.last_measurement.neto2.toFixed(2);
			} else if(kultura === 'psenica' || kultura === 'psenica tel-kel'){
				$scope.ifKukuruz = false;
				$scope.ifZitarice = true;
				$scope.ifSacma = true;
			} else if(kultura === 'jecam'){
				$scope.ifKukuruz = false;
				$scope.ifZitarice = true;
				$scope.ifSacma = true;
			} else if(kultura === 'sacma'){
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
			{"key":"uskladistenje","label":"uskladistenje"},
			{"key":"prijem","label":"prijem"}
		];
		
		//---------------------------------------------------------------------------------------------------------
	
		
		
		//---------------------------------------------------------------------------------------------------------
		
		//set infobox messages
		infoboxService.set_infoBox();
		
		//---------------------------------------------------------------------------------------------------------
		$scope.getfirstMeasurement = function(){
			console.log($scope.insert_data.session_id);
			prijemMerkantilaFactory.getfirstMeasurement({'session_id':$scope.insert_data.session_id}).success(function(msg){
				$scope.first_measurement = msg;
				console.log(msg);
			}).error(function(error){
					console.log(error);
			});
		};
		
		
		
		//---------------------------------------------------------------------------------------------------------
		prijemMerkantilaFactory.getGoodsType().success(function(msg){
			$scope.goods_type = msg;
		}).error(function(error){
				console.log(error);
		});
		
		//---------------------------------------------------------------------------------------------------------
		
		$scope.selectGoodsName = function(){
			prijemMerkantilaFactory.getGoodsName($scope.insert_data.type_of_goods_id)
			.success(function(msg){
				$scope.goods_name = msg;
				if($scope.insert_data.type_of_goods_id===1 || $scope.insert_data.type_of_goods_id===11){
						$scope.culture.hektolitar=false;
						$scope.culture.lom=true;
						$scope.culture.defekt=true;
						$scope.culture.vlaga=true;
						$scope.culture.primese=true;
						$scope.culture.uljnost=false;
				} else if($scope.insert_data.type_of_goods_id===2 || $scope.insert_data.type_of_goods_id===16){
						$scope.culture.hektolitar=true;
						$scope.culture.lom=false;
						$scope.culture.defekt=false;
						$scope.culture.vlaga=true;
						$scope.culture.primese=true;
						$scope.culture.uljnost=false;
				} else if($scope.insert_data.type_of_goods_id===5){
						$scope.culture.hektolitar=true;
						$scope.culture.lom=false;
						$scope.culture.defekt=false;
						$scope.culture.vlaga=true;
						$scope.culture.primese=true;
						$scope.culture.uljnost=false;
				} else if($scope.insert_data.type_of_goods_id===13){
						$scope.culture.hektolitar=false;
						$scope.culture.lom=false;
						$scope.culture.defekt=false;
						$scope.culture.vlaga=false;
						$scope.culture.primese=false;
						$scope.culture.uljnost=false;
			    } else if($scope.insert_data.type_of_goods_id===12 || $scope.insert_data.type_of_goods_id===17){
					$scope.culture.hektolitar=false;
					$scope.culture.lom=false;
					$scope.culture.defekt=false;
					$scope.culture.vlaga=true;
					$scope.culture.primese=true;
					$scope.culture.uljnost=true;
				
				} else {
					$scope.culture.hektolitar=false;
					$scope.culture.lom=false;
					$scope.culture.defekt=false;
					$scope.culture.vlaga=true;
					$scope.culture.primese=true;
					$scope.culture.uljnost=false;
				}
			}).error(function(error){
				console.log(error);
			});
		};
		
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
		
		//---------------------------------------------------------------------------------------------------------
		
		$scope.showClientPanel = function(){
			$scope.show_clients = !$scope.show_clients;
		}
		
		//---------------------------------------------------------------------------------------------------------
		
		$scope.setClient = function(id){
			 var result = $filter('filter')($scope.clients , {client_id:id})[0];
			$scope.insert_data.client_id = result.client_id;
			$scope.insert_data.firm_name = result.firm_name;
			$scope.insert_data.client_name = result.client_name;
			$scope.insert_data.client_id = result.client_id;
			$scope.showClientPanel();
			console.log(result)
		}
		
		//--------------------------------------------VAGA-------------------------------------------------
		
		$scope.connectionId;
		$scope.openConection = function(){
		
				var bitrate = mainService.login_data.scale_type === 'm-3-488' ? 2400 : 9600
				chrome.serial.connect(mainService.login_data.scale_port, {bitrate: bitrate}, function(info) {
				   $scope.$apply(function () { 
						$scope.connectionId = info.connectionId;
						console.log('Connection opened with id: ' + $scope.connectionId + ', Bitrate: ' + info.bitrate);
						chrome.serial.onReceive.addListener($scope.onReceiveCallback);
				   });
			   });
		
		}
		
		//---------------------------------------------------------------------------------------------------------
		
		// var measurement_unit = '';
		// var last_received = 0;
		
		//---------------------------------------------------------------------------------------------------------
		var measurement_unit = 0;
		var last_received = 0;
		
		//---------------------------------------------------------------------------------------------------------
		
		$scope.onReceiveCallback = function(info) {
			    
			var bufView = new Uint8Array(info.data);
			var encodedString = String.fromCharCode.apply(null, bufView);
			var str = decodeURIComponent(encodedString);

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
				if(str.trim().length>0){
					console.log("string", str)
					measurement_unit= str.replace(/[^\d.-]/g, '');
					console.log("string replace", measurement_unit);
					measurement_unit= measurement_unit.substring(0, measurement_unit.length - 1);
					measurement_unit= Number(measurement_unit)>0 && !isNaN(parseInt(measurement_unit)) ? parseInt(measurement_unit) : 0;
					$scope.$apply(function () { 
						
						$scope.wagaW ();
					
					});
				}
			}else if(mainService.login_data.scale_type === 'm-0-67'){
				if(str.trim().length>0){
					console.log("string", str)
					measurement_unit= str.replace(/[^\d.-]/g, '');
					measurement_unit= Number(measurement_unit)>0 && !isNaN(parseInt(measurement_unit)) ? parseInt(measurement_unit) : 0;
					$scope.$apply(function () { 
						$scope.insert_data.bruto = measurement_unit;
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
						measurement_unit = parseInt(m);
						$scope.$apply(function(){
							$scope.insert_data.bruto = measurement_unit;
						})
						last_received =  m;
				}
			};	
		};
			
		//---------------------------------------------------------------------------------------------------------
		
		$scope.wagaW = function(){
				if(mainService.login_data.scale_type === 'w2110'){
                    measurement_unit = measurement_unit.replace("*", "").trim();
                    measurement_unit = measurement_unit.replace("M", "").trim();
                    measurement_unit = measurement_unit.replace("G", "").trim();
                    if( measurement_unit !== "" ){
					   $scope.insert_data.bruto = measurement_unit;
					  $scope.second_insert_data.bruto  = measurement_unit;
					}
				} else if(mainService.login_data.scale_type === 'mx100'){
						$scope.insert_data.bruto = measurement_unit;
				}
		}
		
		//---------------------------------------------------------------------------------------------------------
		
		if(mainService.login_data.bruto_polje === "zakljucano"){
			console.log('zakljucano')
			$scope.openConection();
		} else{
			console.log('otkljucano')
			$('input[name="bruto"]').removeAttr("readonly");
		}
		
		
		//------------------------------------------------/VAGA-------------------------------------------------------
		
		$scope.firstMeasurement = function(){
			
			
			if(!$scope.insert_data.hasOwnProperty('input_type') ||  $scope.insert_data.input_type===0 ||  $scope.insert_data.input_type===null || typeof $scope.insert_data.input_type === 'undefined'){
                errorService.error_msg($('select[name="input_type"]'), "Morate izabrati tip prijema!"); return false;
            }
			if(!$scope.insert_data.hasOwnProperty('type_of_goods_id') ||  $scope.insert_data.type_of_goods_id===0 ||  $scope.insert_data.type_of_goods_id===null || typeof $scope.insert_data.type_of_goods_id === 'undefined'){
                errorService.error_msg($('select[name="type_of_goods_id"]'), "Morate izabrati tip merkantilne robe!"); return false;
            }
			if(!$scope.insert_data.hasOwnProperty('goods_id') ||  $scope.insert_data.goods_id===0 ||  $scope.insert_data.goods_id===null || typeof $scope.insert_data.goods_id === 'undefined'){
                errorService.error_msg($('select[name="goods_id1"]'), "Morate izabrati naziv merkantilne robe!"); return false;
            }
			if(!$scope.insert_data.hasOwnProperty('firm_name') || $scope.insert_data.firm_name==="" || typeof $scope.insert_data.firm_name === 'undefined'){
                errorService.error_msg($('input[name="firm_name"]'), "Morate selektovati dobavljača!"); return false;
            }
			if(!$scope.insert_data.hasOwnProperty('driver_name') || $scope.insert_data.driver_name==="" || typeof $scope.insert_data.driver_name === 'undefined'){
                errorService.error_msg($('input[name="driver_name"]'), "Morate upisati ime i prezime vozača!"); return false;
            }
			if(!$scope.insert_data.hasOwnProperty('driver_reg') || $scope.insert_data.driver_reg==="" || typeof $scope.insert_data.driver_reg === 'undefined'){
                errorService.error_msg($('input[name="driver_reg"]'), "Morate upisati registraciju vozila!"); return false;
            }
			if(!$scope.insert_data.hasOwnProperty('bruto') || $scope.insert_data.bruto==="" || typeof $scope.insert_data.bruto === 'undefined'){
                errorService.error_msg($('input[name="bruto"]'), "Morate uneti vrednost bruta!"); return false;
            }
			if($scope.insert_data.type_of_goods_id !==13 && $scope.insert_data.type_of_goods_id !==11){
				if(!$scope.insert_data.hasOwnProperty('vlaga') || $scope.insert_data.vlaga==="" || typeof $scope.insert_data.vlaga === 'undefined'){
					errorService.error_msg($('input[name="vlaga"]'), "Morate uneti vrednost vlage!"); return false;
				}
				if(!$scope.insert_data.hasOwnProperty('primese') || $scope.insert_data.primese==="" || typeof $scope.insert_data.primese === 'undefined'){
					errorService.error_msg($('input[name="primese"]'), "Morate uneti vrednost primesa!"); return false;
				}
			}	
			if($scope.insert_data.type_of_goods_id===2 || $scope.insert_data.type_of_goods_id===5){
                if(!$scope.insert_data.hasOwnProperty('hektolitar') || $scope.insert_data.hektolitar==="" || typeof $scope.insert_data.hektolitar === 'undefined'){
                	errorService.error_msg($('input[name="hektolitar"]'), "Morate uneti vrednost hektolitra!"); return false;
            	}
            }
			if($scope.insert_data.type_of_goods_id===1){
                if(!$scope.insert_data.hasOwnProperty('lom') || $scope.insert_data.lom==="" || typeof $scope.insert_data.lom === 'undefined'){
                	errorService.error_msg($('input[name="lom"]'), "Morate uneti vrednost loma!"); return false;
            	}
				if(!$scope.insert_data.hasOwnProperty('defekt') || $scope.insert_data.defekt==="" || typeof $scope.insert_data.defekt === 'undefined'){
                	errorService.error_msg($('input[name="defekt"]'), "Morate uneti vrednost defekta!"); return false;
            	}
            }
			
			
			
			
			 $('.ajax_load_visibility').css('visibility','visible');
			prijemMerkantilaFactory.insertMerkantila($scope.insert_data).success(function(msg){//testSession
				 $('.ajax_load_visibility').css('visibility','hidden');
				console.log(msg); 
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					console.log('logedin');
					$scope.$broadcast('update_first_measure_table_merkantila');
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
		}
		
		//----------------------------------------------------------------------------------------------------------------------------------------------
		
		
		
		$scope.$on('$destroy', function() {
	  		// clean up stuff
			$scope.closePrijemPanel();
			chrome.serial.disconnect($scope.connectionId, function(result) {
                console.log('Connection with id: ' + $scope.connectionId + ' closed');
            });
		});
		
		//----------------------------------------------------------------------------------------------------------------------------------------------
		
		$scope.print = function(){
			var content = $('.print_prijem').html();
			$('.print_area').html(content);
			window.print();
		}
	}
	
	prijemMerkantilaController.$inject = ['$scope', '$filter', '$location', 'infoboxService', 'prijemMerkantilaFactory', 'clientsFactory', 'mineFactory', 'mainService', 'errorService'];
    angular.module('_raiffisenApp').controller('prijemMerkantilaController', prijemMerkantilaController);
	
	
	
	
	var measurementList = function( DTOptionsBuilder, DTColumnBuilder, usersFactory, $scope, $resource, $compile, mainService, prijemMerkantilaFactory) {
        var vm = this;
        vm.secondMeasurement = secondMeasurement;
       // vm.stateChange = stateChange;
        vm.rowNum = 0;
        $scope.$on("update_first_measure_table_merkantila", function(event) {
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
				DTColumnBuilder.newColumn('vlaga').withTitle('Vlaga').withClass('text-right').withOption('width','50px'),
				DTColumnBuilder.newColumn('primese').withTitle('Primese').withClass('text-right').withOption('width','50px'),
				DTColumnBuilder.newColumn('hektolitar').withTitle('Hektolitar').withClass('text-right').withOption('width','50px'),
				DTColumnBuilder.newColumn('lom').withTitle('Lom').withClass('text-right').withOption('width','50px'),
				DTColumnBuilder.newColumn('defekt').withTitle('Defekt').withClass('text-right').withOption('width','50px'),
				DTColumnBuilder.newColumn(null).withTitle('Merenje').notSortable().withOption('width','50px').renderWith(actionsHtml).withClass('text-center')
        	];
		


        function reloadData() {
			console.log(vm.result);
            var resetPaging = false;
            vm.dtInstance.changeData(mainService.domainURL()+'prijem_merkantila_api/prvo_merenje_merkantila/'+vm.result+'/');
        }

        function secondMeasurement(id){
            console.log(id);
			console.log($scope.$parent.insert_data);
			
			var data = {
				"input_id":id.input_id,
				"session_id": $scope.$parent.insert_data.session_id,
				"tara": $scope.$parent.insert_data.bruto
			}
			
			prijemMerkantilaFactory.getSecondMeasurement(data).success(function(msg){
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
       
            

            return'  <i class="fa fa fa-balance-scale btn btn-primary btn-sm" style="margin-top:0px" title="Prosledi na obračun" data-ng-click="userShowCase.secondMeasurement(userShowCase.measures[' + data.input_id + '])"></i>';
        }
    };
    measurementList.$inject = ['DTOptionsBuilder', 'DTColumnBuilder', 'usersFactory', '$scope', '$resource', '$compile', 'mainService', 'prijemMerkantilaFactory'];
    angular.module('_raiffisenApp').controller('measurementList', measurementList);

	
	
	
	
}());









