# Toddler Words

A free early-learning web app for little ones: tap the big card, hear the word, say it back, and the next word appears.

- **ABC**: English letters A to Z with a picture for each
- **あいう**: the 46 Japanese hiragana, each with a word and picture
- **123**: numbers 1 to 20 in English and Japanese, with things to count (ten-frames for 11 to 20)
- **Mine**: words a parent adds (hold the gear for 3 seconds)
- **Match**: a gentle flip-the-cards memory game with big **Pictures / Letters / Animals** mode chips. Matched pairs swoosh away, a wrong pair gets a gentle "No, no, no!", and clearing the board brings a fanfare, confetti and "You did it!" (all sounds synthesized with the Web Audio API)
- **Write**: trace letters (**ABC** / **abc**) and the 46 hiragana (**あいう**) with a finger or stylus in the correct stroke order. Numbered start dots, arrows and a "Show me" demo guide each stroke; a finished character gets confetti and "Great job!"

After your child says the word, the app cheers and moves to the next card by itself. Finish a whole deck for a big "Good Job Theo!" (change the name in Settings).

Works best in Chrome or Edge. Allow the microphone when asked. Built-in words use recorded clips; custom words use the device voice.

## Credits and licences
- Artwork and app code: original, © 2026 Stephen Hunter.
- Voices: built-in words play pre-recorded clips. English is Kokoro-82M `am_fenrir` (Apache-2.0). Japanese is VOICEVOX:春日部つむぎ. Parent-added words use the device voice, or Piper for English.
- Fallback English voice: Piper `en_US-bryce-medium` (default, American male tenor) and `en_US-norman-medium`, both by Bryce Beattie, public domain (https://brycebeattie.com/files/tts/). See `voices/*.MODEL_CARD.md`.
- Hiragana stroke data: derived from **KanjiVG** (http://kanjivg.tagaini.net), © Ulrich Apel, licensed **CC BY-SA 3.0** (https://creativecommons.org/licenses/by-sa/3.0/). The derived file `kana-strokes.js` is shared under the same licence.
- Latin letter stroke data (`latin-strokes.js`): original, Zaner-Bloser-style stroke order.
- Speech runtime: ONNX Runtime Web (MIT, © Microsoft) and piper-phonemize, which includes espeak-ng (GPL-3.0). See `NOTICE.md`.

## Draw

The Draw tab is a white page for finger or stylus drawing: 12 colours plus a white eraser, three brush sizes, Undo, Clear (hold the button for about a second) and Save (downloads a PNG). Tapping a colour says its name in English or Japanese, matching the current deck.
