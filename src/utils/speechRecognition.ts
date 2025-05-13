

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
  private interimTranscript: string = '';

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
      this.interimTranscript = '';
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
      
      // Combine all final transcripts and any remaining interim transcript to get the complete text
      let finalText = this.finalTranscripts.join(' ').trim();
      
      // Include interim transcript in the final text if there's any
      if (this.interimTranscript) {
        finalText = finalText ? `${finalText} ${this.interimTranscript}` : this.interimTranscript;
      }
      
      return { text: finalText || this.text, elapsedTime };
    }
    return { text: this.text, elapsedTime: 0 };
  }

  // Calculate words per minute - improved word counting
  public calculateWPM(text: string, elapsedTimeInSeconds: number): number {
    if (!text || elapsedTimeInSeconds <= 0) return 0;
    
    // Enhanced word counting: 
    // 1. Normalize spaces
    // 2. Split on whitespace and filter empty strings
    // 3. Count non-punctuation items as words
    const normalizedText = text.trim().replace(/\s+/g, ' ');
    const words = normalizedText.split(' ').filter(word => word.length > 0);
    const wordCount = words.length;
    
    console.log(`Text: "${text}"`);
    console.log(`Word count: ${wordCount}`);
    console.log(`Time elapsed: ${elapsedTimeInSeconds} seconds`);
    
    const minutes = elapsedTimeInSeconds / 60;
    
    // Calculate WPM and ensure it's at least 1 if there are words
    const wpm = wordCount > 0 ? Math.round(wordCount / minutes) : 0;
    console.log(`WPM calculated: ${wpm}`);
    
    return wpm;
  }

  // Handle speech recognition results
  private handleResult(event: SpeechRecognitionEvent): void {
    this.interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
        this.finalTranscripts.push(transcript.trim());
      } else {
        this.interimTranscript += transcript;
      }
    }

    // Update the full text for display
    if (finalTranscript) {
      this.text = this.finalTranscripts.join(' ').trim();
    }
    
    // Call the callback with the current text plus any interim results
    if (this.onTextUpdateCallback) {
      const currentText = this.text + (this.interimTranscript ? ' ' + this.interimTranscript : '');
      this.onTextUpdateCallback(currentText);
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

