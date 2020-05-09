//Listen for form submit
document.getElementById('Contact_form').addEventListener('submit', submitForm);

function submitForm(e)
{
  e.preventDefault();
    formToDatabase();
}