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
