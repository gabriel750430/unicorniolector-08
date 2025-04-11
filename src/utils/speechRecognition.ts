
// Type definition for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

// Speech Recognition class
class SpeechRecognitionService {
  private recognition: any; // SpeechRecognition
  private isListening: boolean = false;
  private startTime: number = 0;
  private text: string = '';
  private onTextUpdateCallback: ((text: string) => void) | null = null;
  private finalTranscripts: string[] = [];

  constructor() {
    // Initialize SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'es-MX'; // Spanish (Mexico)
      
      // Set up event handlers
      this.recognition.onresult = this.handleResult.bind(this);
      this.recognition.onerror = this.handleError.bind(this);
      this.recognition.onend = this.handleEnd.bind(this);
    } else {
      console.error('Speech recognition not supported in this browser');
    }
  }

  // Start listening
  public start(onTextUpdate: (text: string) => void): boolean {
    if (!this.recognition) {
      console.error('Speech recognition not available');
      return false;
    }

    try {
      this.isListening = true;
      this.startTime = Date.now();
      this.text = '';
      this.finalTranscripts = [];
      this.onTextUpdateCallback = onTextUpdate;
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      return false;
    }
  }

  // Stop listening
  public stop(): { text: string; elapsedTime: number } {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      this.recognition.stop();
      const elapsedTime = (Date.now() - this.startTime) / 1000; // time in seconds
      
      // Combine all final transcripts to get the complete text
      const finalText = this.finalTranscripts.join(' ').trim();
      return { text: finalText || this.text, elapsedTime };
    }
    return { text: this.text, elapsedTime: 0 };
  }

  // Calculate words per minute
  public calculateWPM(text: string, elapsedTimeInSeconds: number): number {
    if (!text || elapsedTimeInSeconds <= 0) return 0;
    
    // Count words by splitting on whitespace and filtering out empty strings
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const minutes = elapsedTimeInSeconds / 60;
    
    // Return rounded WPM, ensure it's at least 1 if there are words
    return wordCount > 0 ? Math.max(1, Math.round(wordCount / minutes)) : 0;
  }

  // Handle speech recognition results
  private handleResult(event: SpeechRecognitionEvent): void {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
        this.finalTranscripts.push(transcript.trim());
      } else {
        interimTranscript += transcript;
      }
    }

    // Update the full text for display
    if (finalTranscript) {
      this.text = this.finalTranscripts.join(' ').trim();
    }
    
    // Call the callback with the current text plus any interim results
    if (this.onTextUpdateCallback) {
      this.onTextUpdateCallback(this.text + ' ' + interimTranscript);
    }
  }

  // Handle speech recognition errors
  private handleError(event: any): void {
    console.error('Speech recognition error:', event.error);
    
    if (this.isListening) {
      this.restart();
    }
  }

  // Handle speech recognition end
  private handleEnd(): void {
    // If still supposed to be listening, restart
    if (this.isListening) {
      this.restart();
    }
  }

  // Restart speech recognition
  private restart(): void {
    try {
      this.recognition.start();
    } catch (error) {
      console.error('Error restarting speech recognition:', error);
      this.isListening = false;
    }
  }

  // Check if speech recognition is supported
  public isSupported(): boolean {
    return !!window.SpeechRecognition || !!window.webkitSpeechRecognition;
  }
}

// Create a singleton instance
const speechRecognition = new SpeechRecognitionService();
export default speechRecognition;
