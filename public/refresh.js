$(function() {
  $('#categorySelect').on('change', (event) => {
    let id = $('#categorySelect').val();
    window.location.href = window.location.href.replace( /[\?#].*|$/, `?category=${id}` );
  });
});