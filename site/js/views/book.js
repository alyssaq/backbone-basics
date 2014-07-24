var app = app || {};

app.BookView = Backbone.View.extend({
  className: 'bookContainer',
  template: _.template($('#bookTemplate').html()),

  events: {
    'click .delete': 'deleteBook'
  },

  render: function() {
    //this.el is what we defined in tagName. use $el to get access to jQuery html() function
    this.$el.html(this.template(this.model.attributes));

    return this;
  },

  deleteBook: function(e) {
    this.model.collection.remove(this.model);
    this.unbind(); //delete model
    this.$el.remove(); //delete view
  }
});