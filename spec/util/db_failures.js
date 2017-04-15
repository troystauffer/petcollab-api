module.exports = {
  User: {
    findOrCreate: function() {
      return {
        spread: function(fn) { fn(null, false) }
      }
    },
    findOne: function() {
      return {
        then: function(fn) { fn(null) }
      }
    }
  },
  Role: {
    findOne: function() {
      return {
        then: function(fn) { fn(null) }
      }
    }
  },
  Event: {
    findById: function() {
      return {
        then: function(fn) { fn(null) }
      }
    }
  },
  Schedule: {
    findAll: function() {
      return {
        then: function(fn) { fn([]) }
      }
    },
    findById: function() {
      return {
        then: function(fn) { fn(null) }
      }
    }
  },
  ScheduleItem: {
    findAll: function() {
      return {
        then: function(fn) { fn([]) }
      }
    },
    findById: function() {
      return {
        then: function(fn) { fn(null) }
      }
    }
  }
}