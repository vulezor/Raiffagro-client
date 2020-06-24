(function(){

angular.module('app').directive('gridScreen', function($http){
    return{
        restrict:'E',
        controller:function($scope){
            //cols, editor
            this.setEditor = function(editor){
              //  $scope.cols.unshift(editor);
            };
            this.setColumns = function(cols){
                $scope.cols = cols;
            }
        },
        link:function(scope, element, attributes){
            $http.get(attributes.resource).success(function(msg){
                scope.rows = msg.data;
                scope.$broadcast('ready-to-render', scope.rows, scope.cols);
            });
            console.log('gridScreen linked')
        }
    }
});
angular.module('app').directive('gridColumns', function(){
    return{
        restrict:'E',
        require:['^gridScreen', 'gridColumns'],
        controller:function($scope){
            var columns = [];
            this.addColumn = function(col){
                columns.push(col);
            };
            this.getColumns = function(){
                return columns;
            }
        },
        link:function(scope, element, attributes, controllers){
            var gridScreenController = controllers[0],
                gridColumnsController = controllers[1];
            gridScreenController.setColumns(gridColumnsController.getColumns())
            console.log('gridColumns linked')
        }
    }
});
angular.module('app').directive('gridColumn', function(){
    return{
        restrict:'E',
        require:'^gridColumns',
        link:function(scope, element, attributes, gridColumnsControler){
            gridColumnsControler.addColumn({
                 title:attributes.title,
                 field:attributes.field
            });
            console.log('gridColumn linked')
        }
    }
});
angular.module('app').directive('grid', function(){
    return{
        restrict:'E',
        templateUrl:'app/templates/table.html',
        replace:true,
        controller:function($scope){
            $scope.$on('ready-to-render', function(e, rows, cols){
                $scope.rows = rows;
                $scope.cols = cols;
            });
            console.log('grid linked')
        }
    }
});
angular.module('app').directive('rowEditor', function(){
    return{
        restrict:'A',
        require:'^gridScreen',
        link:function(scope, element, attributes, grinScreenController){
            grinScreenController.setEditor({
                title:"Edit",
                field:""
            });
            console.log('rowEditor linked')
        }
    }
});

angular.module('app').directive('editorInitializer', function($compile, $templateCache){
   return{
       restrict:'E',
       templateUrl:'app/templates/editor-initializer.html',
       replace:true,
       controller:function($scope){
           $scope.edit = function(row){
               console.log(row);
               $scope.$broadcast('editor', row);
           }
       },
       link:function(scope, element, attributes){
            scope.$on('editor', function(e, row){
                var editor = $compile($templateCache.get('app/templates/editor.html'))(scope);
                if($(element).parents('tr').next().hasClass('editor-row')){
                    $('.editor-row').remove();
                }else{
                    $(editor).insertAfter($(element).parents("tr"));
                }
            });
       }
   }
});

}());