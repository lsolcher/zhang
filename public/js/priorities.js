(function() {
  var app = angular.module("zhang-app", []).controller('prioController', function($scope) {
    // new value entered
    $scope.currentPriority = '';
    // list of displayed priorities
    $scope.priorities = [];

    $scope.getNewPrioId = function() {
      return $scope.possiblePriorities.length += $scope.priorities.length
    }

    // options for select box (replace this with actual options)
    $scope.possiblePriorities = [
      new SimplePrio(0, 'keine Schlauchräume'),
      new SimplePrio(1, 'Blabla'),
      new ExamplePrio(2, 'Beispiel 1 (ausklappbar sobald das ausklappen funzt)'),
      new Example2Prio(3, 'Beispiel Prio mit Button'),
      new DayTimePrio(4, 'Frühstmögliche Zeit'),
      new DayTimePrio(5, 'Spätestmögliche Zeit')
    ];

    $scope.addPriorityToDom = function(prioElement) {
      var li = $('<li></li>').addClass('priority-entry').attr('data-id', prioElement.id)
      li.append($('<div></div>').addClass('priority-label').html(prioElement.getLabel()))
      li.append($('<div></div>').addClass('priority-delete').html('x'))
      li.append($('<div></div>').addClass('priority-conent').append(prioElement.getContent()))
      $('#priority-list').append(li)
    }

    // add initial priorities to list
    for(var i in $scope.priorities) {
      $scope.addPriorityToDom($scope.priorities[i])
    }

    $scope.selectedPrio = null
    $scope.$watch('selectedPrio', function(newValue, oldValue) {
      if(newValue == null) return
      $scope.priorities.push(jQuery.extend(true, {}, newValue)) // deep copy
      $scope.addPriorityToDom(newValue)
      newValue.id = $scope.getNewPrioId()
    })

    $scope.addPriority = function(event) {
      console.log(event)
    }

  });

  // parent of all Priority Objects
  var AbstractPrio = function() {
    this.content = this.getContent()
  }

  AbstractPrio.prototype.getLabel = function() {
    return "Priorität"
  }
  /*
   * This returns the content of the constraint if it has extra content
   */
  AbstractPrio.prototype.getContent = function() {
    return false
  }

  /*
   * implementation of a priority without content but its label
   */
  var SimplePrio = function(id, label) {
    this.id = id
     this.label = label
  }
  // do this for right
  SimplePrio.prototype = new AbstractPrio()
  SimplePrio.prototype.constructor = SimplePrio

  SimplePrio.prototype.getLabel = function() {
    return this.label
  }
  // no need to override getContent, because it doesnt have content


  /*
   * Example Implementation of a prio with content
   */
  var ExamplePrio = function(id, label) {
   this.id = id
   this.label = label
   this.content = this.getContent()
  }
  // do this for right
  ExamplePrio.prototype = new AbstractPrio()
  ExamplePrio.prototype.constructor = SimplePrio

  ExamplePrio.prototype.getLabel = function() {
    return this.label
  }

  ExamplePrio.prototype.getContent = function() {
     var out = $('<div></div>').addClass('somecontent')
     out.html('Example Content')
     return out
  }

  /*
   * Example Implementation of a prio with content
   */
  var Example2Prio = function(id, label) {
   this.id = id
   this.label = label
   this.content = this.getContent()
   this.value = 0
  }
  // do this for right
  Example2Prio.prototype = new AbstractPrio()
  Example2Prio.prototype.constructor = Example2Prio

  Example2Prio.prototype.getLabel = function() {
    return this.label
  }

  Example2Prio.prototype.getContent = function() {
     var out = $('<div></div>').addClass('somecontent')
     var button = $('<button>Klick mich!</button>')
     button.click(function(event) {
       // access the scope
       var scope = angular.element($('.raumsonderwuensche').get(0)).scope()
       for(var i in scope.priorities) {
         // find the right entity by id
         if(scope.priorities[i].id != $(event.target).parents('.priority-entry').attr('data-id')) continue
         // change some value
         scope.priorities[i].setValue(scope.priorities[i].value+1)
         console.log('That entities value', scope.priorities[i].value)
         break
       }
     })
     out.append(button)
     out.append('<span>'+this.value+'</span>')
     return out
  }
  // Example for changing the value and the dom at the same time
  Example2Prio.prototype.setValue = function(value) {
    this.value = value
    $('.priority-entry[data-id='+this.id+'] span').html(this.value)
  }



  // real implementations go here ...

  var DayTimePrio = function(id, label) {
   this.id = id
   this.label = label
   this.content = this.getContent()
  }
  // do this for right
  DayTimePrio.prototype = new AbstractPrio()
  DayTimePrio.prototype.constructor = DayTimePrio

  DayTimePrio.prototype.getLabel = function() {
    return this.label
  }

  DayTimePrio.prototype.getContent = function() {
     var out = $('<div></div>').addClass('somecontent')

     var days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag']
     var times = [
       '9:45',
       '10:30',
       '11:30',
       '12:30',
       '13:30',
       '14:30',
       '15:30'
     ]

    //  var daySelect = $('<select></select>').addClass('someselectclass')
    //  for(var i in days) {
    //    daySelect.append($('<option></option>').val(i).html(days[i]))
    //  }
    //  out.append(daySelect)
     //


    var c = $('<div></div>').addClass('weekchooser')

    for(var i in days) {
      var d = $('<div></div>').addClass('day selected').html(days[i]).attr('data-id', i)
      c.append(d)
      d.click(function(event) {
        $(event.target).toggleClass('selected')
      })
    }
    out.append(c)

    var timeSelect = $('<select></select>').addClass('someselectclass')
    for(var i in times) {
      timeSelect.append($('<option></option>').val(i).html(times[i]))
    }
    out.append(timeSelect)




     return out
  }

})();
