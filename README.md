# Toddler Words

A free early-learning web app for little ones: press the big button, hear the word, say it back, and the next word appears.

- **ABC**: English letters A to Z with a picture for each
- **あいう**: the 46 Japanese hiragana, each with a word and picture
- **123**: numbers 1 to 10 in English and Japanese, with things to count
- **Mine**: words a parent adds (hold the gear for 3 seconds)
- **Match**: a gentle flip-the-cards memory game with big **Pictures / Letters / Animals** mode chips. Matched pairs swoosh away, a wrong pair gets a gentle "No, no, no!", and clearing the board brings a fanfare, confetti and "You did it!" (all sounds synthesized with the Web Audio API)

Works best in Chrome or Edge. Allow the microphone when asked. Edge gives a male Japanese voice.

## Credits and licences
- Artwork and app code: original, © 2026 Stephen Hunter.
- English voice: Piper `en_GB-northern_english_male-medium` (CC BY-SA 4.0). See `voices/*.MODEL_CARD.md`.
- Speech runtime: ONNX Runtime Web (MIT, © Microsoft) and piper-phonemize, which includes espeak-ng (GPL-3.0). See `NOTICE.md`.
