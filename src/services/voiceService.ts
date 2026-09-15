export function speakAnswer(text: string, language: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  const languageMap: Record<string, string> = {
    English: 'en-IN',
    Tamil: 'ta-IN',
    Hindi: 'hi-IN',
    Telugu: 'te-IN',
    Kannada: 'kn-IN',
  };

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = languageMap[language] ?? 'en-IN';
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
  return true;
}
