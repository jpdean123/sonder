var demoApp = angular.module('demoApp', ['ngRoute','google-maps'])
  .run(['$rootScope', function($scope, $location) {

       $scope.init = function() {
           $scope.currentUser = Parse.User.current();
           $scope.thisYear = new Date().getFullYear();
           $scope.company = "Court House Desings";
           console.log("root scope");
         };
       

          
         
       $scope.signUp =  function signUp(){
              var myusername = $('#username').val();
              var mypassword = $('#password').val();
              var myname = $('#name').val();
              var user = new Parse.User();

              user.set("username", myusername);
              user.set("password", mypassword);
              user.set("name", myname);

              user.signUp(null,{
                success: function(user) {
                  console.log("hey awesome the signup worked");
                  window.location = "#/mapview"; 
                  $scope.currentUser = user;
                  $scope.$apply();
                  setDefaultPrefs();

                },
                error: function(user,error){
                  alert("error: " + error.code + " " + error.message);
                }
              });

            };

            //set default preferences 
        function setDefaultPrefs(){
              var Preferences = Parse.Object.extend("Preferences");
              var preference = new Preferences();

              var preferenceInterval = 1800000; //30 minutes
              var user = Parse.User.current();

              preference.set("Time_Interval", preferenceInterval);
              preference.set("user", user);
            

              preference.save(null, {
                success: function () {
                  console.log("saved!");
                  $scope.$apply();
                },
                error: function (item, error){
                  console.log(error.message);
                }
              })
            };
 
        $scope.logOut = function(form) {
          Parse.User.logOut();
          $scope.currentUser = null;
          window.location = "#/"
        };
        

        $scope.logmeIn = function logmeIn(){
              var myusername = $('#myusername').val();
              var mypassword = $('#mypassword').val();

          Parse.User.logIn(myusername, mypassword,{
                success: function(user) {
                  $scope.currentUser = user;
                  $scope.$apply(); //notify AngularJS to sync currentUser
                  window.location = "#/mapview"; 
                },
                error: function(user,error){
                  alert("error: " + error.code + " " + error.message);
                }
              });

        };


}]);


// routes

demoApp.config(function ($routeProvider) {
  $routeProvider
    .when('/',
      {
        /*controller: 'FirstCtrl',*/
        templateUrl: './partials/landing.html'

      })
    .when('/mapview',
      {
        controller: 'mapviewCtrl',
        templateUrl: './partials/mapview.html'

      })
    .when('/topplaces', 
    {
      controller: 'topPlacesCtrl',
      templateUrl: './partials/topplaces.html'
    })
    .when('/addlocation',
    {
      controller: 'addlocation',
      templateUrl: './partials/addlocation.html'
    })
    .when('/login',
    {
      templateUrl: './partials/login.html'
      })
    .when('/landing',
    {
      templateUrl: './partials/landing.html'
      })
    .when('/userpage',
    {
      controller: 'userpageCtrl',
      templateUrl: './partials/userinfo.html'
      })
    .when('/test',
      {
        controller: 'testCtrl',
        templateUrl: './partials/test.html'

      })

    .otherwise({ redirectTo: '/' });

});


demoApp.directive("enter", function (){
    return function (scope, element, attrs) {
      element.bind("mouseenter", function (){
        element.addClass(attrs.enter);
      })
    }

})

demoApp.directive("enter", function (){
    return function (scope, element, attrs) {
      element.bind("mouseleave", function (){
        element.removeClass(attrs.enter);
      })
    }

})

// Controllers for the views
  

demoApp.controller('FirstCtrl', ['$scope', 'simpleFactory', function ($scope, simpleFactory) {
        
        $scope.people = [
          { name: 'Will', age: '30' },
          { name:'Jack', age:'26' },
          { name: 'Nadine', age: '21' },
          { name:'Zach', age:'28' }
        ];     
     

        $scope.addPerson = function () {

                  $scope.people.push(
                  {
                    name: $scope.newPerson.name,
                    age: $scope.newPerson.age
                  });
                };
        }]);

demoApp.filter('orderObjectBy', function (){
  return function(input, attribute) {
    if (!angular.isObject(input)) return input;

    var array = [];
    for(var objectKey in input) {
      array.push(input[objectKey]);
    };

    array.sort(function(a,b){
      a = parseInt(a[attribute]);
      b = parseInt(b[attribute]);
      return a-b;
    });
    return array;

  };

});


demoApp.controller('addlocation', ['$scope', function ($scope, $q) {
         $scope.init = function(){
          $scope.currentuser = Parse.User.current();
           console.log($scope.currentuser.get('name'));
           console.log("add location controller");
           $scope.getLocations();

        };

    



          $scope.addLocation = function addLocation(){
              var Locations = Parse.Object.extend("Locations");
              var location = new Locations();

              var locationName = $("#locationName").val();
              //lat and long come from map function below
              var locationLat = addLat;
              var locationLong = addLng;
              var user = Parse.User.current();

              location.set("Name", locationName);
              location.set("longitude", locationLong);
              location.set("latitude", locationLat);
              location.set("user", user);
            

              location.save(null, {
                success: function () {
                  console.log("saved!");
                  $scope.$apply();
                  $scope.getLocations();
                },
                error: function (item, error){
                  console.log(error.message);
                }
              })
            };


         $scope.getLocations = function getLocations() {
   
            var Locations = Parse.Object.extend("Locations");
            var query = new Parse.Query(Locations);

            query.descending("createdAt");
            query.limit(5);

            query.find({
              success: function(results) {
                 /*$(results).each(function(i,e){
                  var itemList = e.toJSON();*/
                  $scope.locations = results;
                  console.log(results);
                  $scope.$apply();

                  
                /* })*/

              },
              error: function(error){
                console.log(error.message);
              } 

            })


          };        

          $scope.reset = function (){
            $scope.entry.name = "";
            $scope.entry.long = "";
            $scope.entry.lat = "";
          }
            /*On page load*/
            
            $scope.init();

  //google maps controllers below

  google.maps.visualRefresh = true;

   $scope.map = {
    center: {
        latitude: 42.279798,
        longitude: -83.743354
    },
    zoom: 10,
    draggable: true,

    };

    $scope.annArbor = {
      coords: {
        latitude: 42.279798,
        longitude: -83.743354
        },
      options: { draggable: true },
      events: {
        dragend: function(marker, eventName, args) {
          
          addLat = marker.getPosition().lat();
          addLng = marker.getPosition().lng();

        }
      },

    };

       }]);


demoApp.controller('userpageCtrl', ['$scope', function ($scope, $q) {
         $scope.init = function(){
          $scope.currentuser = Parse.User.current();
           console.log($scope.currentuser.get('name'));
           console.log("Userpage userpageCtrl");
           $scope.getUserPrefs();
            };


         $scope.getUserPrefs = function getUserPrefs() {
            //pull preferences object from Parse.com
            var Preferences = Parse.Object.extend("Preferences");
            var query = new Parse.Query(Preferences);
        
            query.equalTo("user", $scope.currentuser);

            query.find({
                    success: function(results) {
                        $scope.userprefs = results;
                        console.log($scope.userprefs);

                    },
                    error: function(error){
                      console.log(error.message);
                    } 

            })

          };  

       }]);


demoApp.controller('topPlacesCtrl', ['$scope', function ($scope, $q) {
         $scope.init = function(){
          $scope.currentuser = Parse.User.current();
           console.log($scope.currentuser.get('name'));
           $scope.getUserLocations();

        };


         $scope.getUserLocations = function getUserLocations() {
            
            var Locations = Parse.Object.extend("Locations");
            var query = new Parse.Query(Locations);
        
            query.descending("createdAt");
            query.equalTo("user", $scope.currentuser);

            query.find({
              success: function(results) {
                 /*$(results).each(function(i,e){
                  var itemList = e.toJSON();*/
                  $scope.locations = results;
                  console.log(results);
                  $scope.$apply();

                  
                /* })*/

              },
              error: function(error){
                console.log(error.message);
              } 

            })


          };        

          $scope.reset = function (){
            $scope.entry.name = "";
            $scope.entry.long = "";
            $scope.entry.lat = "";
          }
            /*On page load*/
            
             $scope.init();
             $scope.startQ = 5;
             $scope.startLat = 42.279798;
             $scope.startLong = -83.743354;
        


       }]);




demoApp.controller('mapviewCtrl', ['$scope', function ($scope) {

    $scope.init = function(){
          $scope.currentuser = Parse.User.current();
           console.log($scope.currentuser.get('name'));
           $scope.getUserLocations();
           console.log("init function")

        };
       

      

    $scope.getUserLocations = function getUserLocations() {
            
            var Locations = Parse.Object.extend("Locations");
            var query = new Parse.Query(Locations);
        
            query.descending("createdAt");
            query.equalTo("user", $scope.currentuser);

            query.find({
              success: function(results) {
                console.log(results);
                $scope.testMarkers;
                $scope.$apply();
               return results;
              },
              error: function(error){
                console.log(error.message);
              } 

            });

          }; 
        
          

            /*On page load*/


  
//Google Maps Section below

    google.maps.visualRefresh = true;
   
   $scope.map = {
          center: {
                  latitude: 42.279798,
                  longitude: -83.743354
                  },
          zoom: 10,
          draggable: true

        };


      var testLocations = [
        {latitude: '42.11111111', longitude: '-83.777777', name: 'Item 1'},
        {latitude: '43.11111111', longitude: '-84.777777', name: 'Item 2'},
        {latitude: '41.11111111', longitude: '-82.777777', name: 'Item 3'}

      ];

      /*$scope.testMarkers = testLocations;*/


}]);


demoApp.controller('NavbarCtrl', ['$scope','$location', function ($scope, $location) {
    
        
$scope.isActive = function (route){
        return route === $location.path();
       };

      $scope.isLoggedIn = function () {
        return Parse.User.current();
      }      
       }]);



demoApp.filter('withinRange', function() {
    return function(locations) {
      var range = $("#range_input").val();
      var centerLat = $("#centerlatitude").val();
      var centerLong = $("#centerlongitude").val();

      var filtered = [];
      angular.forEach(locations, function(location) {
      var pointLat = location.get('latitude');
      var pointLong = location.get('longitude');
      var sideA = Math.abs(centerLat-pointLat);
      var sideB = Math.abs(centerLong-pointLong);
      var hypot = Math.sqrt(Math.pow(sideA,2) + Math.pow(sideB,2));

        if( hypot <= range) {
          filtered.push(location);
        }
      });
      console.log(filtered);
      return filtered;
    };
});  






//below is the test controller for the testing page

demoApp.controller('testCtrl', ['$scope', function ($scope) {    //<-- please note the first '$scope'
  
   $scope.people = [
          { name: 'Will', age: '30' },
          { name:'Jack', age:'26' },
          { name: 'Nadine', age: '21' },
          { name:'Zach', age:'28' }
        ];  
  

}]);



