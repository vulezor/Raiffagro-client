(function(){
	var pregledPrijemMerkantilaController = function($scope, infoboxService, mineFactory, prijemMerkantilaPregledFactory, errorService, mainService){
	    $scope.search_data = {};
		$scope.get_search_good_type = {};
		$scope.get_search_good_name = {};
		$scope.get_search_good_client = {},
		$scope.total_result= {
			neto_total: 0.00,
			ponder_vlage: 0.00,
			ponder_primesa: 0.00,
			ponder_hektolitra: 0.00,
			ponder_loma: 0.00,
			ponder_defekta: 0.00,
			srps_total: 0.00,
			trosak_susenja_total: 0.00,
			trosak_susenja_total: 0.00,
			suvo_zrno_total: 0.00
		},
		$scope.session_id ='';
		$scope.link = ''
		$scope.autent = $scope.$parent.login_data;
		$scope.last_measurement = {}
		$scope.ifKukuruz = false;
		$scope.ifZitarice = false;
		
		
		//------------------------------------------------------------------------------------------------------
		console.log($scope.autent);
		chrome.storage.local.get('session_id', function (items) {
				var result = items['session_id'];
				
					$scope.search_data.session_id = result;
					$scope.session_id = result;
					$scope.getSearchGoodType()
				 mineFactory.testSession({'session_id':result}).success(function(msg){//testSession
					console.log(msg);
				}).error(function(error){
					console.log(error);
				});
			});
		//-------------------------------------------------------------------------------------------------------------
		
		$scope.hideInputItems = function(kultura){
			if(kultura==='kukuruz' || kultura === 'kukuruz tel-kel'){
				$scope.ifKukuruz = true;
				$scope.ifZitarice = false;
				$scope.ifSacma = true;
			} else if(kultura === 'psenica' || kultura === 'psenica tel-kel'){
				$scope.ifKukuruz = false;
				$scope.ifZitarice = true;
				$scope.ifSacma = true;
			} else if(kultura === 'jecam'){
				$scope.ifKukuruz = false;
				$scope.ifZitarice = true;
				$scope.ifSacma = true;
			}else if(kultura === 'sacma' || kultura === 'kukuruz tel-kel'){
				$scope.ifKukuruz = false;
				$scope.ifZitarice = false;
				$scope.ifSacma = false;
			}  else {
				$scope.ifKukuruz = false;
				$scope.ifZitarice = false;
			}
		}
		
		$scope.hideInputItems2 = function(kultura){
			if(kultura===1 || kultura === 11){
				$scope.ifKukuruz = true;
				$scope.ifZitarice = false;
				$scope.ifSacma = true;
			} else if(kultura === 2 || kultura === 16){
				$scope.ifKukuruz = false;
				$scope.ifZitarice = true;
				$scope.ifSacma = true;
			} else if(kultura === 5){
				$scope.ifKukuruz = false;
				$scope.ifZitarice = true;
				$scope.ifSacma = true;
			} else if(kultura === 13){
				$scope.ifKukuruz = false;
				$scope.ifZitarice = true;
				$scope.ifSacma = true;
			} else {
				$scope.ifKukuruz = false;
				$scope.ifZitarice = false;
			}
		}
		
		//-------------------------------------------------------------------------------------------------------------
		
		$.datepicker.setDefaults( $.datepicker.regional[ "sr-SR" ] );
		$('input[name="datum_od"], input[name="datum_do"]').datepicker({
			changeMonth: true, 
			changeYear: true, 
			dateFormat: 'dd.mm.yy',
			onClose:function(){
				var name = $(this).attr('name');
				$scope.search_data[name] = $(this).val();
				/**/
			}
		});
		
		$scope.resetPretraga = function(){ //session_id=87582f36f65bd99c137cc5a51b3e7c9a&type_of_goods_id=1&goods_id=94&client_id=1&datum_od=01.01.2016&datum_do=01.01.2016
			$scope.search_data.type_of_goods_id = '';
			$scope.search_data.goods_id = '';
			$scope.search_data.client_id = '';
			$scope.search_data.datum_od = '';
			$scope.search_data.datum_do = '';
			$scope.$broadcast('reset_search_table_prijem');
		}
		
		//-------------------------------------------------------------------------------------------------------------
		
		$scope.getSearchGoodType = function(){
			prijemMerkantilaPregledFactory.get_search_good_type($scope.search_data).success(function(msg){
				$('.ajax_load_visibility').css({'visibility':'visible'});
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					$('.ajax_load_visibility').css({'visibility':'hidden'});
					console.log(msg);
					$scope.get_search_good_type = msg;
				} else {
					//not loged in
					$scope.$parent.logoutUser();
				}	
			}).error(function(error){
				console.log(error);
			});
		};
		
		$scope.getSearchGoodName = function(){
			prijemMerkantilaPregledFactory.get_search_good_name($scope.search_data).success(function(msg){
				$('.ajax_load_visibility').css({'visibility':'visible'});
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					$('.ajax_load_visibility').css({'visibility':'hidden'});
					console.log(msg);
					$scope.get_search_good_name = msg;
				} else {
					//not loged in
					$scope.$parent.logoutUser();
				}	
			}).error(function(error){
				console.log(error);
			});
		}
		
		$scope.getGoodClient = function(){
			prijemMerkantilaPregledFactory.get_search_good_client($scope.search_data).success(function(msg){
				$('.ajax_load_visibility').css({'visibility':'visible'});
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					$('.ajax_load_visibility').css({'visibility':'hidden'});
					console.log(msg);
					$scope.get_search_good_client = msg;
				} else {
					//not loged in
					$scope.$parent.logoutUser();
				}	
			}).error(function(error){
				console.log(error);
			});
		}
		
		//-------------------------------------------------------------------------------------------------------------
		
		$scope.getSearchData = function(){
			if(!$scope.search_data.hasOwnProperty('type_of_goods_id') ||  $scope.search_data.type_of_goods_id===0 ||  $scope.search_data.type_of_goods_id===null || typeof $scope.search_data.type_of_goods_id === 'undefined'){
                errorService.error_msg($('select[name="type_of_goods_id"]'), "Morate izabrati tip merkantile !"); return false;
            }
			if(!$scope.search_data.hasOwnProperty('goods_id') ||  $scope.search_data.goods_id===0 ||  $scope.search_data.goods_id===null || typeof $scope.search_data.goods_id === 'undefined'){
                errorService.error_msg($('select[name="goods_id"]'), "Morate izabrati naziv merkantile !"); return false;
            }
			
			var link = '';
			for( var key in $scope.search_data){
				console.log(typeof $scope.search_data[key]);
				if($scope.search_data[key] !== '' && $scope.search_data[key] != null && $scope.search_data[key] != 'undefined'){ 
					
				 	link += key+'='+$scope.search_data[key]+'&';
				}	
			}
			$scope.link = link.slice(0, -1);
			console.log($scope.link);
			$scope.$broadcast('update_search_table');
			$scope.getTotalOfResult();
			$scope.hideInputItems2($scope.search_data.type_of_goods_id)
			
		}
		
		$scope.getTotalOfResult = function(){
			prijemMerkantilaPregledFactory.get_search_prijem_total($scope.search_data).success(function(msg){
				$('.ajax_load_visibility').css({'visibility':'visible'});
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					$('.ajax_load_visibility').css({'visibility':'hidden'});
					console.log(msg);
					$scope.total_result = msg;
				} else {
					//not loged in
					$scope.$parent.logoutUser();
				}	
			}).error(function(error){
				console.log(error);
			});
		}
		
		//----------------------------------------------------------------------------------------------------------------------------------
		
		$scope.print = function(){
			var content = $('.print_prijem').html();
			$('.print_area').html(content);
			window.print();
		}
		
		//----------------------------------------------------------------------------------------------------------------------------------
		
		$scope.getExcell = function(){
			//window.location.href = mainService.domainURL()+'pregled_prijema_merkantile_api/getExcell'+$scope.link;
			window.open(mainService.domainURL()+'pregled_prijema_merkantile_api/getExcell?'+$scope.link,'_blank');
		}
		
		
		
		
		
		
		
		
	};
	pregledPrijemMerkantilaController.$inject = ['$scope', 'infoboxService', 'mineFactory', 'prijemMerkantilaPregledFactory', 'errorService', 'mainService'];
    angular.module('_raiffisenApp').controller('pregledPrijemMerkantilaController', pregledPrijemMerkantilaController);
	
	//***************************************************************************************************************************************************************
	
	var pregledPrijemaTable = function( DTOptionsBuilder, DTColumnBuilder, usersFactory, $scope, $resource, $compile, mainService, prijemMerkantilaPregledFactory, errorService) {
        var vm = this;
        vm.printPrijemnica = printPrijemnica;
		vm.stornirajPrijemnicu =stornirajPrijemnicu;
       // vm.stateChange = stateChange;
        vm.rowNum = 0;
        $scope.$on("update_search_table", function(event) {
			vm.good_type = $scope.$parent.search_data.type_of_goods_id;
			if( vm.good_type === 3 || vm.good_type === 4 || vm.good_type === 12){
				uljariceColumns();
				window.setTimeout(function(){
					reloadData();
				}, '200');
			} else if(vm.good_type === 1){
				kukuruzColumns();
				window.setTimeout(function(){
					reloadData();
				}, '200');
			} else if(vm.good_type === 2 || vm.good_type === 5 || vm.good_type === 16){
				zitariceColumns();
				window.setTimeout(function(){
					reloadData();
				}, '200');
			}else if(vm.good_type === 13 || vm.good_type === 11){
				bezObracunaColumns();;
				window.setTimeout(function(){
					reloadData();
				}, '200');
			}
            
        });
		$scope.$on("reset_search_table_prijem", function(event) {
			//console.log($scope.$parent.link);
            resetData();
        });

        vm.reloadData = reloadData;
		vm.resetData = resetData;
		vm.uljariceColumns = uljariceColumns;
		vm.zitariceColumns = zitariceColumns;
		vm.kukuruzColumns = kukuruzColumns;
        vm.dtInstance = {};
        vm.prijemResult = {};
		vm.result=null;
		vm.good_type=null;
		chrome.storage.local.get('session_id', function (items) {  
			vm.result = items['session_id'];
			//reloadData();
		});
        vm.dtOptions = DTOptionsBuilder
            .fromSource(mainService.domainURL()+'pregled_prijema_merkantile_api/empty_load')
			//.withDataProp('data.inner')
            .withPaginationType('full_numbers')
            .withBootstrap()
            .withOption('createdRow', createdRow)
			.withOption('aaSorting', [0, 'desc'])
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
                    }
						
							]
            }).withLanguage({
                "sEmptyTable":     "<p>Nema raspoloživih podataka u tabeli</p>",
                "sInfo":           "Prikazujem _START_ do _END_ od totalno _TOTAL_ rezultata",
                "sInfoEmpty":      "Prikazujem 0 do 0 od totalno 0 redova",
                "sInfoFiltered":   "(Filtrirano od totalno _MAX_  rezultata)",
                "sInfoPostFix":    "",
                "sInfoThousands":  ",",
                "sLengthMenu":     "Prikazi _MENU_ rezultata",
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
				DTColumnBuilder.newColumn('document_br').withTitle('Doc.br').withOption('width', '60px')/*.renderWith(actionsEditUser)*/,
				DTColumnBuilder.newColumn('date').withTitle('Datum prijema').withOption('width', '80px'),
				DTColumnBuilder.newColumn('firm_name').withTitle('Firma/Gazdinstvo'),
				DTColumnBuilder.newColumn('goods_name').withTitle('Naziv robe'),
				DTColumnBuilder.newColumn('vozac').withTitle('Vozač'),
				DTColumnBuilder.newColumn('neto').withTitle('Neto').withClass('text-right').withOption('width','60px'),
				DTColumnBuilder.newColumn('vlaga').withTitle('Vlaga').withClass('text-right').withOption('width','45px'),
				DTColumnBuilder.newColumn('primese').withTitle('Primese').withClass('text-right').withOption('width','45px'),
				DTColumnBuilder.newColumn('hektolitar').withTitle('Hektolitar').withClass('text-right').withOption('width','45px').notVisible(),
				DTColumnBuilder.newColumn('lom').withTitle('Lom').withClass('text-right').withOption('width','45px'),
				DTColumnBuilder.newColumn('defekt').withTitle('Defekt').withClass('text-right').withOption('width','45px'),
				DTColumnBuilder.newColumn('srps').withTitle('Srps').withClass('text-right').withOption('width','60px'),
				DTColumnBuilder.newColumn('trosak_susenja').withTitle('Trosak Susenja').withClass('text-right').withOption('width','45px'),
				DTColumnBuilder.newColumn('suvo_zrno').withTitle('Suvo Zrno').withClass('text-right').withOption('width','60px'),
				DTColumnBuilder.newColumn(null).withTitle('Prijemnica').notSortable().withOption('width','60px').renderWith(actionsHtml).withClass('text-center')
        	];
		


        function reloadData() {
			console.log(vm.result);
            var resetPaging = false;
            vm.dtInstance.changeData(mainService.domainURL()+'pregled_prijema_merkantile_api/get_search_prijem/'+vm.result+'/?'+$scope.$parent.link);
        }
		
		 function resetData() {
            var resetPaging = false;
            vm.dtInstance.changeData(mainService.domainURL()+'pregled_prijema_merkantile_api/empty_load');
        }
		
		function uljariceColumns() {
			vm.dtColumns = [
				DTColumnBuilder.newColumn('document_br').withTitle('Doc.br').withOption('width', '60px')/*.renderWith(actionsEditUser)*/,
				DTColumnBuilder.newColumn('date').withTitle('Datum prijema').withOption('width', '80px'),
				DTColumnBuilder.newColumn('firm_name').withTitle('Firma/Gazdinstvo'),
				DTColumnBuilder.newColumn('goods_name').withTitle('Naziv robe'),
				DTColumnBuilder.newColumn('vozac').withTitle('Vozač'),
				DTColumnBuilder.newColumn('neto').withTitle('Neto').withClass('text-right').withOption('width','60px'),
				DTColumnBuilder.newColumn('vlaga').withTitle('Vlaga').withClass('text-right').withOption('width','45px'),
				DTColumnBuilder.newColumn('primese').withTitle('Primese').withClass('text-right').withOption('width','45px'),
				DTColumnBuilder.newColumn('hektolitar').withTitle('Hektolitar').withClass('text-right').withOption('width','45px').notVisible(),
				DTColumnBuilder.newColumn('lom').withTitle('Lom').withClass('text-right').withOption('width','45px').notVisible(),
				DTColumnBuilder.newColumn('defekt').withTitle('Defekt').withClass('text-right').withOption('width','45px').notVisible(),
				DTColumnBuilder.newColumn('srps').withTitle('Srps').withClass('text-right').withOption('width','60px'),
				DTColumnBuilder.newColumn('trosak_susenja').withTitle('Trosak Susenja').withClass('text-right').withOption('width','45px').notVisible(),
				DTColumnBuilder.newColumn('suvo_zrno').withTitle('Suvo Zrno').withClass('text-right').withOption('width','60px').notVisible(),
				DTColumnBuilder.newColumn(null).withTitle('Prijemnica').notSortable().withOption('width','60px').renderWith(actionsHtml).withClass('text-center')
			];
    	}
		
		function zitariceColumns() {
			vm.dtColumns = [
				DTColumnBuilder.newColumn('document_br').withTitle('Doc.br').withOption('width', '60px')/*.renderWith(actionsEditUser)*/,
				DTColumnBuilder.newColumn('date').withTitle('Datum prijema').withOption('width', '80px'),
				DTColumnBuilder.newColumn('firm_name').withTitle('Firma/Gazdinstvo'),
				DTColumnBuilder.newColumn('goods_name').withTitle('Naziv robe'),
				DTColumnBuilder.newColumn('vozac').withTitle('Vozač'),
				DTColumnBuilder.newColumn('neto').withTitle('Neto').withClass('text-right').withOption('width','60px'),
				DTColumnBuilder.newColumn('vlaga').withTitle('Vlaga').withClass('text-right').withOption('width','45px'),
				DTColumnBuilder.newColumn('primese').withTitle('Primese').withClass('text-right').withOption('width','45px'),
				DTColumnBuilder.newColumn('hektolitar').withTitle('Hektolitar').withClass('text-right').withOption('width','45px'),
				DTColumnBuilder.newColumn('lom').withTitle('Lom').withClass('text-right').withOption('width','45px').notVisible(),
				DTColumnBuilder.newColumn('defekt').withTitle('Defekt').withClass('text-right').withOption('width','45px').notVisible(),
				DTColumnBuilder.newColumn('srps').withTitle('Srps').withClass('text-right').withOption('width','60px'),
				DTColumnBuilder.newColumn('trosak_susenja').withTitle('Trosak Susenja').withClass('text-right').withOption('width','45px'),
				DTColumnBuilder.newColumn('suvo_zrno').withTitle('Suvo Zrno').withClass('text-right').withOption('width','60px'),
				DTColumnBuilder.newColumn(null).withTitle('Prijemnica').notSortable().withOption('width','60px').renderWith(actionsHtml).withClass('text-center')
			];
    	}
		
		function bezObracunaColumns() {
			vm.dtColumns = [
				DTColumnBuilder.newColumn('document_br').withTitle('Doc.br').withOption('width', '60px')/*.renderWith(actionsEditUser)*/,
				DTColumnBuilder.newColumn('date').withTitle('Datum prijema').withOption('width', '80px'),
				DTColumnBuilder.newColumn('firm_name').withTitle('Firma/Gazdinstvo'),
				DTColumnBuilder.newColumn('goods_name').withTitle('Naziv robe'),
				DTColumnBuilder.newColumn('vozac').withTitle('Vozač'),
				DTColumnBuilder.newColumn('neto').withTitle('Neto').withClass('text-right').withOption('width','60px'),
				DTColumnBuilder.newColumn('vlaga').withTitle('Vlaga').withClass('text-right').withOption('width','45px').notVisible(),
				DTColumnBuilder.newColumn('primese').withTitle('Primese').withClass('text-right').withOption('width','45px').notVisible(),
				DTColumnBuilder.newColumn('hektolitar').withTitle('Hektolitar').withClass('text-right').withOption('width','45px').notVisible(),
				DTColumnBuilder.newColumn('lom').withTitle('Lom').withClass('text-right').withOption('width','45px').notVisible(),
				DTColumnBuilder.newColumn('defekt').withTitle('Defekt').withClass('text-right').withOption('width','45px').notVisible(),
				DTColumnBuilder.newColumn('srps').withTitle('Srps').withClass('text-right').withOption('width','60px').notVisible(),
				DTColumnBuilder.newColumn('trosak_susenja').withTitle('Trosak Susenja').withClass('text-right').withOption('width','45px').notVisible(),
				DTColumnBuilder.newColumn('suvo_zrno').withTitle('Suvo Zrno').withClass('text-right').withOption('width','60px').notVisible(),
				DTColumnBuilder.newColumn(null).withTitle('Prijemnica').notSortable().withOption('width','60px').renderWith(actionsHtml).withClass('text-center')
			];
    	}
		
		
		function kukuruzColumns() {
			vm.dtColumns = [
				DTColumnBuilder.newColumn('document_br').withTitle('Doc.br').withOption('width', '60px')/*.renderWith(actionsEditUser)*/,
				DTColumnBuilder.newColumn('date').withTitle('Datum prijema').withOption('width', '80px'),
				DTColumnBuilder.newColumn('firm_name').withTitle('Firma/Gazdinstvo'),
				DTColumnBuilder.newColumn('goods_name').withTitle('Naziv robe'),
				DTColumnBuilder.newColumn('vozac').withTitle('Vozač'),
				DTColumnBuilder.newColumn('neto').withTitle('Neto').withClass('text-right').withOption('width','60px'),
				DTColumnBuilder.newColumn('vlaga').withTitle('Vlaga').withClass('text-right').withOption('width','45px'),
				DTColumnBuilder.newColumn('primese').withTitle('Primese').withClass('text-right').withOption('width','45px'),
				DTColumnBuilder.newColumn('hektolitar').withTitle('Hektolitar').withClass('text-right').withOption('width','45px').notVisible(),
				DTColumnBuilder.newColumn('lom').withTitle('Lom').withClass('text-right').withOption('width','45px'),
				DTColumnBuilder.newColumn('defekt').withTitle('Defekt').withClass('text-right').withOption('width','45px'),
				DTColumnBuilder.newColumn('srps').withTitle('Srps').withClass('text-right').withOption('width','60px'),
				DTColumnBuilder.newColumn('trosak_susenja').withTitle('Trosak Susenja').withClass('text-right').withOption('width','45px'),
				DTColumnBuilder.newColumn('suvo_zrno').withTitle('Suvo Zrno').withClass('text-right').withOption('width','60px'),
				DTColumnBuilder.newColumn(null).withTitle('Prijemnica').notSortable().withOption('width','60px').renderWith(actionsHtml).withClass('text-center')
			];
    	}

        function printPrijemnica(id){
            console.log(id);
			$scope.$parent.last_measurement = id;
			$scope.$parent.hideInputItems(id.goods_type);
			window.setTimeout(function(){$scope.print();}, '200');
			
			
        }
		function stornirajPrijemnicu(id){
            console.log(id);
			prijemMerkantilaPregledFactory.storniraj_dokument(id).success(function(msg){
				console.log(msg);
			}).error(function(){
				console.log(error);
			});
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function actionsHtml (data, type, full, meta) {
           vm.prijemResult[data.input_id] = data;
            return'  <i class="fa fa fa-file btn btn-primary btn-sm" style="margin-top:0px" title="Prijemnica" data-ng-click="prijemShowCase.printPrijemnica(prijemShowCase.prijemResult[' + data.input_id + '])"></i><!--<i class="fa fa fa-file btn btn-primary btn-sm" style="margin-top:0px" title="Prijemnica" data-ng-click="prijemShowCase.stornirajPrijemnicu(prijemShowCase.prijemResult[' + data.input_id + '])"></i>-->';
        }
    };
    pregledPrijemaTable.$inject = ['DTOptionsBuilder', 'DTColumnBuilder', 'usersFactory', '$scope', '$resource', '$compile', 'mainService', 'prijemMerkantilaPregledFactory', 'errorService'];
    angular.module('_raiffisenApp').controller('pregledPrijemaTable', pregledPrijemaTable);
}());