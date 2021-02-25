/**
 * Used for storing message in database
 *  and creating message for a user in app
 * @param {String} title message title
 * @param {String} message message/ data from message
 */
function createMessage(title, message) {
  firebase.auth().onAuthStateChanged(function (user) {
    const userPath = database
      .collection("Users")
      .doc("Companies")
      .collection("Users")
      .doc(user.uid);
    const theMessage = {
      title: title,
      message: message,
    };
    userPath.get().then((doc) => {
      if (doc.exists) {
        if (doc.data().messages) {
          const originalMessage = doc.data().messages;
          if (
            !originalMessage.some(
              (message) =>
                message.message === theMessage.message &&
                message.title === theMessage.title
            )
          ) {
            originalMessage.push(theMessage);
            userPath.update({ messages: originalMessage });
          }
        } else {
          userPath.update({ messages: [theMessage] });
        }
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    });
  });
}
// module.exports = createMessage;

function getMessage() {
  firebase.auth().onAuthStateChanged(function (user) {
    const userPath = database
      .collection("Users")
      .doc("Companies")
      .collection("Users")
      .doc(user.uid);
    userPath.get().then((doc) => {
      console.log(doc.data());
      const messages = doc.data().messages;
      const messageContainer = document.getElementById("message-container");
      for (let message of messages) {
        const messageRow = document.createElement("div");
        messageRow.classList.add("row");
        messageContainer.appendChild(messageRow);

        let newMessage = document.createElement("div");
        newMessage.innerHTML = `${message.title} :  ${message.message}`;
        newMessage.classList.add("new-message"); //col-lg-12 col-md-12 col-sm-12 new-message
        messageRow.appendChild(newMessage);
      }
    });
  });
}
