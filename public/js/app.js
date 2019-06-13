// Reusable Ajax request
const request = (options, cb) => {
  $.ajax(options)
    .done(response => cb(response))
    .fail(err => console.log(`Error: ${err}`))
    .always(() => console.log('Request completed.'));
};

// Creating one quote element with ES6 string templating
const createQuote = quoteObj => {
  console.log(quoteObj);
  return `<div class="card">
  <div class="card-header" id="${quoteObj._id}">
    <h5 class="mb-0">
      <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#${
        quoteObj._id
      }" aria-expanded="true" aria-controls="${quoteObj._id}">
        ${quoteObj.quote}
      </button>
      <div>
        <form class='quote-update-frm'>
          <input type='text' name='editquote' class='edit-quote'>
          <input type='submit' class='btn-small btn-primary' value='Update'>
        </form>
      </div>
    </h5>

    <span>
      <form class='quote-edit-frm'><input type="submit" class="btn btn-secondary btn-sm" value="Edit"></form>
      <form class='quote-delete-frm'><input type="submit" class="btn btn-secondary btn-sm" value="Delete"></form>
    </span>

  </div>
</div>`;
};

// Loop through the array of quotes and add each element to the page
const renderQuotes = quotes => {
  $.each(quotes, (index, quote) => {
    $('#quote-list').prepend(createQuote(quote));
  });
};

// Getting all the quotes through an ajax request and calling renderQuotes
const loadQuotes = () => {
  const reqOptions = {
    url: '/quotes',
    method: 'get',
    dataType: 'json',
  };

  request(reqOptions, function(response) {
    console.log(response);
    renderQuotes(response);
  });
};

$(document).ready(function() {
  // submit event on the form. Creating an Ajax Post request to send the data to the server
  $('#add-quote-frm').on('submit', function(event) {
    event.preventDefault();
    const quoteContent = $(this)
      .find('input[name=quote]')
      .val();
    const reqOptions = {
      url: '/quotes',
      method: 'POST',
      data: { quoteContent },
    };

    request(reqOptions, quote => {
      renderQuotes([quote]);
    });
  });

  // Event handler for the edit button
  $('#quote-list').on('click', '.quote-edit-frm', function(event) {
    event.preventDefault();
    const $cardHeader = $(this).closest('.card-header');
    const id = $cardHeader.attr('id');

    const $quoteContainer = $cardHeader.find('button');
    const content = $quoteContainer.text().trim();

    $quoteContainer.css('visibility', 'hidden');

    const $updateFrm = $cardHeader.find('.quote-update-frm');
    $updateFrm.css('visibility', 'visible');
    const $editBox = $cardHeader.find('.edit-quote');
    $editBox.attr('value', content);
  });

  $('#quote-list').on('submit', '.quote-update-frm', function(event) {
    event.preventDefault();

    const id = $(this)
      .closest('.card-header')
      .attr('id');

    const quoteContent = $(this)
      .find('.edit-quote')
      .val();

    const reqOptions = {
      url: `/quotes/${id}`,
      method: 'PUT',
      data: { quoteContent },
    };

    request(reqOptions, function(response) {
      console.log(response);
      $quoteContainer = $(event.target)
        .closest('.card-header')
        .find('button');
      $quoteContainer.css('visibility', 'visible');
      $quoteContainer.text(response);
      $(event.target).css('visibility', 'hidden');
    });
  });

  // Event handler for the delete
  $('#quote-list').on('click', '.quote-delete-frm', function(event) {
    event.preventDefault();

    const id = $(this)
      .closest('.card-header')
      .attr('id')
      .trim();
    console.log(id);

    const $cardEl = $(this).closest('.card');

    const reqOptions = {
      url: `/quotes/${id}`,
      method: 'DELETE',
    };

    request(reqOptions, result => {
      console.log(result);
      $cardEl.remove();
    });
  });

  loadQuotes();
}); // document ready
