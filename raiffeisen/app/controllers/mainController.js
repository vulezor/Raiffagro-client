/*function cookieinfo(){
    chrome.cookies.getAll({},function (cookie){
        console.log(cookie.length);
        for(i=0;i<cookie.length;i++){
            console.log(JSON.stringify(cookie[i]));
        }
    });
    chrome.cookies.getAllCookieStores(function (cookiestores){
        for(i=0;i<cookiestores.length;i++){
            console.log(JSON.stringify(cookiestores[i]));
        }
    });
    chrome.cookies.set({"name":"Sample1","url":"http://developer.chrome.com/extensions/cookies.html","value":"Dummy Data"},function (cookie){
        console.log(JSON.stringify(cookie));
        console.log(chrome.extension.lastError);
        console.log(chrome.runtime.lastError);
    });
    chrome.cookies.onChanged.addListener(function (changeInfo){
        console.log(JSON.stringify(changeInfo));
    });
}
window.onload=cookieinfo;*/

(function(){
    	
		
    var mainController = function($scope, $cookies, $interval, $cookieStore, $timeout, mainService, $location, mineFactory, infoboxService){
        $scope.menuOpen = false;
        $scope.headerFixed = true;
        $scope.asideFixed = false;
		$scope.hideLogin = false;
		$scope.hideApp = true;
		$scope.autent = {};
		$scope.login_data = {}
		$scope.session_id = null;
		$scope.dispozicija_panel = false;
		
		$scope.disposition_view = false;
		$scope.d_data = [];
		
		infoboxService.set_infoBox();
		 //-------------------------------------------------------------------------------------------
		
		$scope.loginUser = function(){
			$(".ajax_load_visibility").css("visibility", "visible");
			mineFactory.loginUser($scope.autent).success(function(msg){
				$(".ajax_load_visibility").css("visibility", "hidden");
				console.log(msg)
				if(msg.success != 0){
					
					chrome.storage.local.remove('session_id', function(){});
					var dataObj = {}; //create emty object 
					dataObj['session_id'] = msg.session_id; // add item to empty object
					$scope.session_id = msg.session_id;
					$scope.getDispozicije();
					$interval(function(){ $scope.getDispozicije(); }, 60000);
					chrome.storage.local.set(dataObj, function() { /*...*/ }); // set item into local storage
					$scope.login_data = msg.login_data;
					mainService.login_data  = msg.login_data;
					$scope.hideLogin = true;
					chrome.storage.local.get('session_id', function (items) {
						var results = items['session_id']; console.log(results); 
						
						
						mineFactory.testSession({'session_id':results}).success(function(msg2){
							console.log(msg2);
						}).error(function(error){
							console.log(error);
						});
					});
				} else {
					chrome.storage.local.remove('session_id', function(){
    					console.log('Item deleted!');		
				    });
				}
			}).error(function(error){
				console.log(error);
			});
		}
		
		//-------------------------------------------------------------------------------------------
		
		$scope.logoutUser = function(){
					$scope.autent = {}; //reset login form
					$scope.login_data = {};//delete login data
					$scope.hideLogin = false;//show login form
				    chrome.storage.local.remove('session_id', function(){
    					console.log('Item deleted!');	
						$location.path('/');
						chrome.storage.local.get('session_id', function (items) {
							var results = items['session_id']; console.log(results); 
							mineFactory.testSession({'session_id':results}).success(function(msg2){
								console.log(msg2);
							}).error(function(error){
								console.log(error);
							});
						});
				    });
		}
		
        //-------------------------------------------------------------------------------------------
        /**
         * Open close menu action
         */
        $scope.openMenu = function(){
            $scope.menuOpen = $scope.menuOpen===true ? false : true;
            if($scope.menuOpen){
                $('.menu_a').off('mouseenter mouseleave', '>li');
                $timeout(function(){
                    mainService.submenuBaction();
                    $('.active').next().slideDown( "fast");
                },500);
            } else {
                $('.menu_b').off('mouseup', '>li>a');
                $timeout(function(){mainService.submenuAaction();},500);
            }

        };

        //-------------------------------------------------------------------------------------------

        $scope.show = function(){
            alert($scope.windowHeight+', '+$scope.windowWidth);
        };

        //-------------------------------------------------------------------------------------------
        /**
         * set ngClass name active
         * expect param string or object
         */
        $scope.menuClass = function(page) {
            var current = $location.path().substring(1);
            current = current.split('/');
			//console.log(current);
            if (current instanceof Array){
                current = current[0];
            } else {
                current = current;
            }
             //console.log(typeof page+', '+page+', '+current);
            if(typeof page === 'object'){
               for(var i=0; i<page.length; i++){
				  var pg = page[i].split("/");
                   if(pg[0] === current){
					  // console.log(page[i]+', '+current);
                       return "active";
					   break;
                   };
               }
            }else {
               return page === current ? "active" : "";
            }
        };

        //-------------------------------------------------------------------------------------------
        /**
         * Initiation
         */
        var init = function(){
            if($scope.menuOpen===false){
                $timeout(function(){mainService.submenuAaction();},500);
            }else {
                $timeout(function(){mainService.submenuBaction();},500);
            }
        };

        init();
		$(".login_wrapper").animate({'width':'420px','margin-left':'-220px','margin-top':'-82px','height':'163px','opacity':1}, 400, 'easeOutCubic');
		$("#login_form section label").delay("400").animate({'margin-left':'0px','opacity':1}, 400, 'easeOutCubic');
	/**	mineFactory.getPlaces().success(function(msg){
			console.log(msg);
			
		}).error(function(error){
            console.log(error);
        });*/
		
		
		
		$scope.badge_num = 0;
		$scope.getDispozicije = function(){
			mineFactory.getDisposition({'session_id':$scope.session_id}).success(function(msg){
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					$scope.badge_num = msg.length;
					$scope.disposition = msg;
				} else {
					//not loged in
					$scope.logoutUser();
				}	
			}).error(function(error){
				console.log(error);
			})
		};
		
		$scope.setPanel = function(){
			$scope.dispozicija_panel = !$scope.dispozicija_panel;
		};
		
		$scope.dispositionViuwer = function(){
			$scope.disposition_view = !$scope.disposition_view;
		};
		
		$scope.viewDisposition = function(dispozicija_id){
			mineFactory.viuwDisposition({'session_id':$scope.session_id, 'dispozicija_id':dispozicija_id}).success(function(msg){
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					$scope.d_data = msg;
				    $scope.dispositionViuwer()
				} else {
					//not loged in
					$scope.logoutUser();
				}	
			}).error(function(error){
				console.log(error);
			})
		};
		
		$scope.changeVozilo = function($event, ime_vozaca, reg_table, vozilo_id){
			var obj = {
				'ime_vozaca':ime_vozaca,
				'reg_table':reg_table,
				'vozilo_id':vozilo_id,
				'session_id':$scope.session_id
			}
			//console.log(obj);
			$($event.currentTarget).html('Izmeni <i class="fa fa-cog fa-spin"></i>');
			mineFactory.changeVozilo(obj).success(function(msg){
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					 $($event.currentTarget).html('Izmeni')
				} else {
					//not loged in
					$scope.logoutUser();
				}	
			}).error(function(error){
				console.log(error);
			})	
		};
		
		$scope.changeQuantity = function($event, kolicina, lot, stavka_id){
			var obj = {
				'lot':lot,
				'kolicina':kolicina,
				'stavka_id':stavka_id,
				'session_id':$scope.session_id
			}
			$($event.currentTarget).html('Izmeni <i class="fa fa-cog fa-spin"></i>');
			mineFactory.changeKolicinu(obj).success(function(msg){
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					 $($event.currentTarget).html('Izmeni')
				} else {
					//not loged in
					$scope.logoutUser();
				}	
			}).error(function(error){
				console.log(error);
			})	
		};
		
		$scope.realizacijaStavkeDispozicije  = function(vozilo){
			
			var obj = {
				'vozilo_id':vozilo.vozilo_id,
				'end_point':vozilo.krajnja_mesta,
				'session_id':$scope.session_id
			} 
			mineFactory.realizacijaStavkeDispozicije(obj).success(function(msg){
				if(msg.logedIn !== 0 && msg.hasOwnProperty('logedIn')===false){
					 vozilo.realizovano = "y";
					$scope.getDispozicije();
				} else {
					//not loged in
					$scope.logoutUser();
				}	
			}).error(function(error){
				console.log(error);
			})	
		};
		
		
		$scope.d_print = function(){
            var content = $('.dispozicija_b').html();
            $('.print_area').html(content);
            window.print();
        };
		
		
    };
    mainController.$inject = ['$scope', '$cookies','$interval' , '$cookieStore', '$timeout', 'mainService', '$location', 'mineFactory', 'infoboxService'];
    angular.module('_raiffisenApp')
        .controller('mainController', mainController);


	//-------------------------------------------------------------------------------------------


}());