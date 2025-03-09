const synth = window.speechSynthesis;

export const speak = (textToSpeak: string) => {
  const currentVoice = synth
    .getVoices()
    .find((voice) => voice.name === 'Google US English');

  const utterThis = new SpeechSynthesisUtterance(textToSpeak);

  if (currentVoice) {
    utterThis.voice = currentVoice;
  }

  utterThis.rate = 0.8;

  synth.speak(utterThis);
};
