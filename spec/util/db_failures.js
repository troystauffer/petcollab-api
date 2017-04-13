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
  }
}