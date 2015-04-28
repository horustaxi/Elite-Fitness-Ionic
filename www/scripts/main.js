$count = 0;
$isMale=false;
$exc = 2;

window.localStorage['isMale'] = false;
window.localStorage['exc'] = 2;

angular.module('ionicApp', ['ionic'])
	
	.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('eventmenu', {
      url: "/event",
      abstract: true,
      templateUrl: "templates/event-menu.html"
    })

    .state('eventmenu.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html"
        }
      }
    })
    .state('eventmenu.checkin', {
      url: "/check-in",
      views: {
        'menuContent' :{
          templateUrl: "templates/check-in.html",
          controller: "CheckinCtrl"
        }
      }
    })
	
	.state('eventmenu.test', {
      url: "/test",
      views: {
        'menuContent' :{
          templateUrl: "templates/test.html",
          controller: "CheckinCtrl"
        }
      }
    })
	.state('eventmenu.calculator', {
      url: "/calculator",
      views: {
        'menuContent' :{
          templateUrl: "templates/calculator.html",
          controller: "CheckinCtrl1"
        }
      }
    })

  .state('intro', {
    url: '/',
    templateUrl: 'templates/intro.html',
    controller: 'IntroCtrl'
  })

  .state('event-menu', {
    url: '/event-menu',
    templateUrl: 'templates/event-menu.html',
    controller: 'MainCtrl'
  });

  $urlRouterProvider.otherwise("/");
})

.controller('CheckinCtrl', function($scope, $ionicModal) {
  $scope.showForm = true;
  
  $scope.shirtSizes = [
    { text: 'Large', value: 'L' },
    { text: 'Medium', value: 'M' },
    { text: 'Small', value: 'S' }
  ];
  
  $scope.attendee = {};
  $scope.submit = function() {
    if(!$scope.attendee.firstname) {
      alert('Info required');
      return;
    }
    $scope.showForm = false;
    $scope.attendees.push($scope.attendee);
  };
})

.controller('CheckinCtrl1', function($scope, $ionicModal,$window) {

$scope.ni_toggle = $window.localStorage.getItem('ni_toggle') === 'true';
    $scope.updateLocalStorage = function() {
        $window.localStorage.setItem('ni_toggle', $scope.ni_toggle);
        $count++;
        if($count %= 2){
          window.localStorage['isMale'] = true;    
        }else{
          window.localStorage['isMale'] = false;
        }
    };


  $ionicModal.fromTemplateUrl('templates/mylongform.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

  $scope.openModal = function(){

    $scope.$on("$ionicView.beforeEnter", function(){

  });
    $weight = weight.value;
    $height = height.value;
    $gender = gender.value;
    $age = age.value;
    $exc = exc.value;
    
    //window.alert($gender);

    var isMale = window.localStorage['isMale'];

    console.log(isMale);
    console.log($exc);


    $BMR = 10 * $weight + 6.25 * $height - 5 * $age;

    if(isMale === 'false'){
      $BMR -= 161;
    }
    if(isMale === 'true'){
      $BMR += 5;
    }

    $maintenanceWeight = $BMR;

    switch($exc){
      case '1':
        $maintenanceWeight *= 1.2;
        break;
      case '2':
        $maintenanceWeight *= 1.375;
        break;
      case '3':
        $maintenanceWeight *= 1.55;
        break;
      case '4':
        $maintenanceWeight *= 1.725;
        break;
      case '5':
        $maintenanceWeight *= 1.9;
        break;
    }
    //window.alert($BMR);
    $scope.modal.show();
    document.getElementById('span1').innerHTML = 'Your BMR is <b>' + Math.round($BMR) +"</b> Cals/day "
    + "<br /> You need <b>"+ Math.round($maintenanceWeight)+"</b> Cal/day to maintain your weight.";
    window.localStorage['storedMaintenance'] = Math.round($maintenanceWeight);

    document.getElementById('Maintain').innerHTML = window.localStorage['storedMaintenance']+" Cal/day";
  }
  $scope.closeModal = function(){
    $scope.modal.hide();
  }
})

.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate) {
 
  // Called to navigate to the event-menu app
  $scope.startApp = function() {
    $state.go('event-menu');
  };
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
})

.controller('MainCtrl', function($scope, $state) {
  $scope.toIntro = function(){
    $state.go('intro');
  }
});

