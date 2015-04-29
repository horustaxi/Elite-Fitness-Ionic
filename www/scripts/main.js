

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
    

    document.getElementById('Maintain').innerHTML = window.localStorage['storedMaintenance']+" Cal/day";
  }
  $scope.closeModal = function(){
    window.localStorage['storedMaintenance'] = Math.round($maintenanceWeight);
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



.controller('MainCtrl',function($scope, $ionicPopup, $timeout, $state) {

  $scope.toIntro = function(){
    $state.go('intro');
  }

 // Triggered on a button click, or some other target
 $scope.showPopup = function() {
   $scope.data = {}

   // An elaborate, custom popup
   var myPopup = $ionicPopup.show({
     template: '<input type="tel" ng-model="data.num">',
     title: 'Enter Gain/Loss Amount',
     subTitle: 'Please use decimals & integers only',
     scope: $scope,
     buttons: [
       { text: 'Exit' ,type: 'button-light'},
       { text: 'Loss',type: 'button-assertive',onTap: function(e) {
           if (!$scope.data.num) {
             //don't allow the user to close unless he enters 
             e.preventDefault();
           } else {
             $gains = window.localStorage['storedMaintenance'];
             var gains = $gains + ((data.num.value * -3500) / 7);
             window.localStorage['targetCals'] = gains;
             document.getElementById('Target').innerHTML = window.localStorage['targetCals'] + ' Cal/day';
             return gains;
           }
         }
        },

       {
         text: '<b>Gain</b>',
         type: 'button-balanced',
         onTap: function(e) {
           if (!$scope.data.num) {
             //don't allow the user to close unless he enters 
             e.preventDefault();
           } else {
             return $scope.data.num;
           }
         }
       },
     ]
   });
   myPopup.then(function(res) {
     console.log('Tapped!', res);
   });
  };
   // A confirm dialog
   $scope.showConfirm = function() {
    $gainTwo = window.localStorage['storedMaintenance'];
    var gain = parseInt($gainTwo) + 2000;
    window.localStorage['targetCals'] = gain;
     var confirmPopup = $ionicPopup.confirm({
       title: '',
       template: 'Gain 2kg per week? <br/> Your Daily Caloric Target will be set to '+ gain
       + 'Cal/week'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
         document.getElementById('Target').innerHTML = window.localStorage['targetCals'] + ' Cal/day';
       } else {
         console.log('You are not sure');
       }
     });
   };



   $scope.showGain15 = function() {
    $gainTwo = window.localStorage['storedMaintenance'];
    var gain = parseInt($gainTwo) + 1500;
    window.localStorage['targetCals'] = gain;
     var confirmPopup = $ionicPopup.confirm({
       title: '',
       template: 'Gain 1.5kg per week? <br/> Your Daily Caloric Target will be set to '+ gain
       + 'Cal/week'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
         document.getElementById('Target').innerHTML = window.localStorage['targetCals'] + ' Cal/day';
       } else {
         console.log('You are not sure');
       }
     });
   };

   $scope.showGain1 = function() {
    $gainTwo = window.localStorage['storedMaintenance'];
    var gain = parseInt($gainTwo) + 1000;
    window.localStorage['targetCals'] = gain;
     var confirmPopup = $ionicPopup.confirm({
       title: '',
       template: 'Gain 1kg per week? <br/> Your Daily Caloric Target will be set to '+ gain
       + 'Cal/week'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
         document.getElementById('Target').innerHTML = window.localStorage['targetCals'] + ' Cal/day';
       } else {
         console.log('You are not sure');
       }
     });
   };


   $scope.showGain05 = function() {
    $gainTwo = window.localStorage['storedMaintenance'];
    var gain = parseInt($gainTwo) + 500;
    window.localStorage['targetCals'] = gain;
     var confirmPopup = $ionicPopup.confirm({
       title: '',
       template: 'Gain 0.5kg per week? <br/> Your Daily Caloric Target will be set to '+ gain
       + 'Cal/week'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
         document.getElementById('Target').innerHTML = window.localStorage['targetCals'] + ' Cal/day';
       } else {
         console.log('You are not sure');
       }
     });
   };

   $scope.showMaintain = function() {
    $gainTwo = window.localStorage['storedMaintenance'];
    var gain = parseInt($gainTwo);
    window.localStorage['targetCals'] = gain;
     var confirmPopup = $ionicPopup.confirm({
       title: '',
       template: 'Maintain Caloric Intake? <br/> Your Daily Caloric Target will be set to '+ gain
       + 'Cal/week'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
         document.getElementById('Target').innerHTML = window.localStorage['targetCals'] + ' Cal/day';
       } else {
         console.log('You are not sure');
       }
     });
   };

   $scope.showLoss05 = function() {
    $gainTwo = window.localStorage['storedMaintenance'];
    var gain = parseInt($gainTwo) - 500;
    window.localStorage['targetCals'] = gain;
     var confirmPopup = $ionicPopup.confirm({
       title: '',
       template: 'Loose 0.5kg per week? <br/> Your Daily Caloric Target will be set to '+ gain
       + 'Cal/week'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
         document.getElementById('Target').innerHTML = window.localStorage['targetCals'] + ' Cal/day';
       } else {
         console.log('You are not sure');
       }
     });
   };

   $scope.showLoss1 = function() {
    $gainTwo = window.localStorage['storedMaintenance'];
    var gain = parseInt($gainTwo) - 1000;
    window.localStorage['targetCals'] = gain;
     var confirmPopup = $ionicPopup.confirm({
       title: '',
       template: 'Loose 1kg per week? <br/> Your Daily Caloric Target will be set to '+ gain
       + 'Cal/week'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
         document.getElementById('Target').innerHTML = window.localStorage['targetCals'] + ' Cal/day';
       } else {
         console.log('You are not sure');
       }
     });
   };

   $scope.showLoss15 = function() {
    $gainTwo = window.localStorage['storedMaintenance'];
    var gain = parseInt($gainTwo) - 1500;
    window.localStorage['targetCals'] = gain;
     var confirmPopup = $ionicPopup.confirm({
       title: '',
       template: 'Loose 1.5kg per week? <br/> Your Daily Caloric Target will be set to '+ gain
       + 'Cal/week'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
         document.getElementById('Target').innerHTML = window.localStorage['targetCals'] + ' Cal/day';
       } else {
         console.log('You are not sure');
       }
     });
   };

   $scope.showLoss2 = function() {
    $gainTwo = window.localStorage['storedMaintenance'];
    var gain = parseInt($gainTwo) - 2000;
    window.localStorage['targetCals'] = gain;
     var confirmPopup = $ionicPopup.confirm({
       title: '',
       template: 'Loose 2kg per week? <br/> Your Daily Caloric Target will be set to '+ gain
       + 'Cal/week'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
         document.getElementById('Target').innerHTML = window.localStorage['targetCals'] + ' Cal/day';
       } else {
         console.log('You are not sure');
       }
     });
   };



   // An alert dialog
   $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Don\'t eat that!',
       template: 'It might taste good'
     });
     alertPopup.then(function(res) {
       console.log('Thank you for not eating my delicious ice cream cone');
     });
   };
});




