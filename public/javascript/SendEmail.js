/////// fux comments and make work for form
/////// firebase config order go over with Omar tonight
 

/* eslint no-console: 0 */
//Contact_form = {
//    'Email': "test@test.com", 
//    'First_name': "Test",
//    'Last_name':"test",
//    'Subject': "bruh",
//    'Inquiry': "tests"
//}
//formToDatabase();

//window.onbeforeunload = function(event)
//    {
//        return confirm("Confirm refresh");
//    };
function formToDatabase(){
   //window.alert(Contact_form.Subject.value);
  
    database.collection('Forms').doc(Contact_form.Email.value).get().then(function(doc) {
        if (doc.exists) {
            let existingSubjects = doc.data()["Subject"]; 
            let existingInquirys = doc.data()["Inquiry"];
            
           
                existingSubjects.push(Contact_form.Subject.value);
                existingInquirys.push(Contact_form.Inquiry.value);
                database.collection('Forms').doc(Contact_form.Email.value).set({
                    'Email': Contact_form.Email.value,
                    'First_name': Contact_form.First_name.value,
                    'Inquiry': existingInquirys,
                    'Last_name': Contact_form.Last_name.value,
                    'Subject': existingSubjects
                }).then(function () {
                     showSuccess();
                }).catch(function (error) {
                    showError(error);
                });  
            
        }else{
            database.collection('Forms').doc(Contact_form.Email.value).set({
                    'Email': Contact_form.Email.value,
                    'First_name': Contact_form.First_name.value,
                    'Inquiry':[Contact_form.Inquiry.value],
                    'Last_name': Contact_form.Last_name.value,
                    'Subject': [Contact_form.Subject.value]
            }).then(function () {
                 showSuccess();
            }).catch(function (error) {
                showError(error);
            }); 
             
        }
    }).catch(function(error) {
        showError(error);
    });
}

function showSuccess(Product){
    Swal.fire({
      title: "Success",
      text: "We will send you with updates regarding this issue.",
      icon: "success",
      confirmButtonText: "Close"
    })
}

function showError(error){
    Swal.fire({
      title: "Error",
      text: error,
      icon: "error",
      confirmButtonText: "Close"
    })
}