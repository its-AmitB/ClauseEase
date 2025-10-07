import tkinter as tk
from tkinter import messagebox
import pyttsx3
import threading

USERNAME = "amit badoni"
PASSWORD = "0000"

def speak_text(text):
    engine = pyttsx3.init()
    engine.setProperty('rate', 170)
    voices = engine.getProperty('voices')
    engine.setProperty('voice', voices[0].id)
    engine.say(text)
    engine.runAndWait()

def login():
    user = username_entry.get()
    pwd = password_entry.get()
    
    if user == USERNAME and pwd == PASSWORD:
        messagebox.showinfo("Login Success", f"Welcome, {user}!")
        threading.Thread(target=speak_text, args=(f"Welcome, {user}!",), daemon=True).start()
    else:
        messagebox.showerror("Login Failed", "Invalid username or password.")

root = tk.Tk()
root.title("Login Page")
root.geometry("300x200")
root.resizable(False, False)

tk.Label(root, text="Username").pack(pady=5)
username_entry = tk.Entry(root)
username_entry.pack(pady=5)

tk.Label(root, text="Password").pack(pady=5)
password_entry = tk.Entry(root, show="*")
password_entry.pack(pady=5)

tk.Button(root, text="Login", command=login).pack(pady=20)

root.mainloop()
