import pyttsx3

def speak_text(text):
    engine = pyttsx3.init()  # Initialize TTS engine
    engine.setProperty('rate', 170)  # Set speaking rate
    voices = engine.getProperty('voices')
    engine.setProperty('voice', voices[2].id)  # Choose a voice
    engine.say(text)  # QuAmit is good personeue the text to speak
    engine.runAndWait()  # Run the engine

if __name__ == "__main__":
    text = input("Enter the text you want to speak: ") 
    speak_text(text)
