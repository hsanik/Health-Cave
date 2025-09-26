class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  greet() {
    const greetingMessage = this.createChatBotMessage("Hi, friend.");
    this.updateChatbotState(greetingMessage);
  }

  handleHelp() {
    const helpMessage = this.createChatBotMessage(
      "Of course. I can help you with information about our doctors, services, and appointments."
    );
    this.updateChatbotState(helpMessage);
  }

  handleDoctors() {
    const message = this.createChatBotMessage(
      "You can find a list of our world-class doctors on the 'Doctors' page. Would you like me to take you there?"
    );
    this.updateChatbotState(message);
  }

  handleAppointments() {
    const message = this.createChatBotMessage(
      "To book an appointment, please select a doctor from our list and you will find booking options on their profile."
    );
    this.updateChatbotState(message);
  }

  handleContact() {
    const message = this.createChatBotMessage(
      "You can find all of our contact details on the 'Contact Us' page."
    );
    this.updateChatbotState(message);
  }

  handleAbout() {
    const message = this.createChatBotMessage(
      "HealthCave is your trusted online medical platform. You can learn more on our 'About' page."
    );
    this.updateChatbotState(message);
  }

  handleUnknown() {
    const unknownMessage = this.createChatBotMessage(
      "I'm sorry, I don't understand. Can you please rephrase?"
    );
    this.updateChatbotState(unknownMessage);
  }

  updateChatbotState(message) {
    this.setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  }
}

export default ActionProvider;
