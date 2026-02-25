export const speak = (text: string, callback?: () => void) => {
  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = "id-ID";
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onend = () => {
    if (callback) callback();
  };

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};