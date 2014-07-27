var app = app || {};

app.LibraryView = Backbone.View.extend({
  el: '#books',

  events: {
    'change input[type=file]': 'uploadImage',
    'click #add': 'addBook',
  },

  initialize: function(books) {
    this.collection = new app.Library(books);
    this.collection.fetch({reset: true});
    this.render();

    this.listenTo(this.collection, 'add', this.renderBook);
    this.listenTo(this.collection, 'reset', this.render);
  },

  // render library by rendering each book in its collection
  render: function() {
    this.collection.each(function(item) {
      this.renderBook(item);
    }, this );
  },

  // render a book by creating a BookView and appending the
  // element it renders to the library's element
  renderBook: function(item) {
    var bookView = new app.BookView({
      model: item
    });
    this.$el.append(bookView.render().el);
  },

  addBook: function(e) {
    e.preventDefault();
    var formData = new FormData();

    $('#addBook').children('input').each(function(i, el) {
      if (el.type === 'file') {
        formData.append(el.id, el.files[0]);
      } else if ($(el).val() !== '') {
        formData.append(el.id, $(el).val());
      }
    });
    var oOutput = document.getElementById("output");

    var oReq = new XMLHttpRequest();
    oReq.open("POST", "http://localhost:4000/api/books", true);
    oReq.onload = function(oEvent) {
      if (oReq.status == 200) {
        oOutput.innerHTML = "Uploaded!";
      } else {
        oOutput.innerHTML = "Error " + oReq.status + " occurred uploading your file.<br \/>";
      }
    };

    oReq.send(formData);
    this.collection.create(formData);
  },

  addBook2: function(e) {
    e.preventDefault();
    var formData = {};

    $('#addBook').children('input').each(function(i, el) {
      if ($(el).val() !== '') {
        formData[el.id] = $(el).val();
      }
    });
    formData.keywords = formData.keywords.split(',');
    formData.releaseDate = new Date(formData.releaseDate).getTime();
    //this.collection.add(new app.Book(formData));
    this.collection.create(formData);
  },

  uploadImage: function(e) {
    var file = e.target.files[0];
    if (!file.type.match(/image.*/)) return;
    console.log('uploadImage' + e);

    // Load image
    var reader = new FileReader();
    reader.onload = _.bind(function(readerEvent) {
      var image = new Image();
      image.onload = _.bind(this.imageOnComplete, image);
      image.src = readerEvent.target.result;
    }, this);
    reader.readAsDataURL(file);
   // event.target.value = '';
  },

  imageOnComplete: function(imageEvent) {
    // Add elemnt to page
    var imageElement = document.createElement('div');
    imageElement.classList.add('uploading');
    imageElement.innerHTML = '<span class="progress"><span></span></span>';
    var progressElement = imageElement.querySelector('span.progress span');
    progressElement.style.width = 0;
    document.querySelector('form').appendChild(imageElement);

    // Resize image
    var canvas = document.querySelector('#thumbnail');
    var width = 80, height = 106;
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(this, 0, 0, width, this.height * width / this.width);

    // Upload image
    var xhr = new XMLHttpRequest();
    if (xhr.upload) {

      // Update progress
      xhr.upload.addEventListener('progress', function(event) {
        var percent = parseInt(event.loaded / event.total * 100);
        progressElement.style.width = percent+'%';
      }, false);

      // File uploaded / failed
      xhr.onreadystatechange = function(event) {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {

            imageElement.classList.remove('uploading');
            imageElement.classList.add('uploaded');
            imageElement.style.backgroundImage = 'url('+xhr.responseText+')';

            console.log('Image uploaded: '+xhr.responseText);

          } else {
            imageElement.parentNode.removeChild(imageElement);
          }
        }
      }

      // Start upload
     // xhr.open('post', 'process.php', true);
      //xhr.send(canvas.toDataURL('image/jpeg'));

    }
  }
});