/**
 * Used for storing message in database
 *  and creating message for a user in app
 * @param {String} title message title
 * @param {String} message message/ data from message
 */
async function createMessage(title, message) {
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
            addMessage(theMessage.title, theMessage.message);
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
/**
 * This message pulls the users messages from firestore and displays them on message page
 */
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

      const messageTop = document.createElement("div");
      messageTop.innerText = "Messages:";
      messageTop.classList.add("message-top");
      messageContainer.prepend(messageTop);

      for (let message of messages) {
        const messageRow = document.createElement("div");
        messageRow.classList.add("row");
        messageContainer.prepend(messageRow);
        messageContainer.prepend(messageTop);

        let newMessage = document.createElement("div");
        newMessage.innerHTML = `${message.title} :  ${message.message}`;
        newMessage.classList.add("new-message"); //col-lg-12 col-md-12 col-sm-12 new-message
        messageRow.prepend(newMessage);
      }
    });
  });
}

function addMessage(title, message) {
  const messageContainer = document.getElementById("message-container");
  const messageTop = document.querySelector(".message-top");
  const messageRow = document.createElement("div");
  messageRow.classList.add("row");
  messageRow.classList.add("flex-row-reverse");
  messageContainer.prepend(messageRow);
  messageContainer.prepend(messageTop);

  let newMessage = document.createElement("div");
  newMessage.innerHTML = `${title} :  ${message}`;
  newMessage.classList.add("new-message"); //col-lg-12 col-md-12 col-sm-12 new-message
  messageRow.prepend(newMessage);
}
