var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function($window) {
  return $window._; // assumes underscore has already been loaded on the page
}]);

var _raiffisenApp = angular.module('_raiffisenApp', ['ngRoute', 'underscore','ngSanitize', 'ngAnimate', 'ngResource', 'ngMessages', 'datatables', 'datatables.bootstrap', 'datatables.columnfilter', 'datatables.tabletools', 'datatables.buttons', 'datatables.colvis', 'ngCookies']);

(function(){
    angular.module('_raiffisenApp')
        .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider){
            $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
            $routeProvider
				.when('/ulaz_robe/ulaz_merkantila', {
                    templateUrl: 'app/view/prijem_merkantila.html',
                    controller: 'prijemMerkantilaController'
                })
				.when('/izlaz_robe/merkantila', {
                    templateUrl: 'app/view/otprema/otprema_merkantila.html',
                    controller: 'otpremaMerkantilaController'
                })
				.when('/ulaz_robe/ulaz_repromaterijal', {
                    templateUrl: 'app/view/prijem_repromaterijal.html',
                    controller: 'prijemRepromaterijalController'
                })
				.when('/izlaz_robe/repromaterijal', {
                    templateUrl: 'app/view/otprema_repromaterijal.html',
                    controller: 'otpremaRepromaterijalController'
                })
				.when('/pregled/pregled_prijema_merkantila', {
                    templateUrl: 'app/view/pregled/pregled_prijema_merkantila.html',
                    controller: 'pregledPrijemMerkantilaController'
                })
				.when('/pregled/pregled_otpreme_merkantila', {
                    templateUrl: 'app/view/pregled/pregled_otpreme_merkantila.html',
                    controller: 'pregledOtpremaMerkantilaController'
                })
				.when('/pregled/pregled_prijema_repromaterijal', {
                    templateUrl: 'app/view/pregled/pregled_prijema_repromaterijal.html',
                    controller: 'pregledPrijemRepromaterijalController'
                })
				.when('/pregled/pregled_otpreme_repromaterijal', {
                    templateUrl: 'app/view/pregled/pregled_otpreme_repromaterijal.html',
                    controller: 'pregledOtpremaRepromaterijalController'
                })
				.when('/dobavljaci_kupci', {
                    templateUrl: 'app/view/dobavljaci_kupci.html',
                    controller: 'clientController'
                })
				.when('/usluzno_merenje', {
                    templateUrl: 'app/view/usluzno_merenje.html',
                    controller: 'usluznoMerenjeController'
                })
				.when('/usluzno_pregled', {
                    templateUrl: 'app/view/usluzno_pregled.html',
                    controller: '()'
                })
				.when('/usluzno_drugi', {
                    templateUrl: 'app/view/usluzno_drugi.html',
                    controller: 'usluznoDrugiController'
                })
				.when('/stanje_magacina_repromaerijal', {
                    templateUrl: 'app/view/stanje_magacina_repromaerijal.html',
                    controller: 'stanjeMagacinaCtrl'
                })
                .otherwise({
                    redirectTo:'/',
                    templateUrl:'app/view/dashboard.html'
                });
        }]);
}());

