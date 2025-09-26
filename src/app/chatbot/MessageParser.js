class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      this.actionProvider.greet();
    } else if (lowerCaseMessage.includes("help")) {
      this.actionProvider.handleHelp();
    } else if (lowerCaseMessage.includes("doctor")) {
      this.actionProvider.handleDoctors();
    } else if (lowerCaseMessage.includes("appointment") || lowerCaseMessage.includes("book")) {
      this.actionProvider.handleAppointments();
    } else if (lowerCaseMessage.includes("contact") || lowerCaseMessage.includes("address") || lowerCaseMessage.includes("phone")) {
      this.actionProvider.handleContact();
    } else if (lowerCaseMessage.includes("about") || lowerCaseMessage.includes("service")) {
      this.actionProvider.handleAbout();
    } else {
      this.actionProvider.handleUnknown();
    }
  }
}

export default MessageParser;
