var app = app || {};

app.BookView = Backbone.View.extend({
  className: 'bookContainer',
  template: _.template($('#bookTemplate').html()),

  events: {
    'click .delete': 'deleteBook'
  },

  initialize: function() {
    this.listenTo(this.model, 'destroy', this.removeView);
  },

  render: function() {
    //this.el is what we defined in tagName. use $el to get access to jQuery html() function
    this.$el.html(this.template(this.model.attributes));

    return this;
  },

  deleteBook: function(e) {
    this.model.destroy();
  },

  removeView: function() {
    this.$el.remove(); //delete view
  }
});