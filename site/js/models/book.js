var app = app || {};

app.Book = Backbone.Model.extend({
  idAttribute: '_id',

  defaults: {
    coverImage: 'img/placeholder.png',
    title: 'No title',
    author: 'Unknown',
    releaseDate: new Date().toISOString(),
    keywords: 'None'
  }
});