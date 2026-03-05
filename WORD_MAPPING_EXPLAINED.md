# Word-to-Word Mapping Explanation

## How the System Counts Words

### Source: Annapoorna Stotram Example

#### Original Lyrics (from `lyrics_transliteration.json`)
```
Line 1: "नित्यानन्दकरी वराभयकरी सौन्दर्यरत्नाकरी"
Line 2: "निर्धूताखिलघोरपावनकरी प्रत्यक्षमाहेश्वरी"
```

#### Word Extraction Process

**Step 1:** Split each line by spaces
```
Line 1: ["नित्यानन्दकरी", "वराभयकरी", "सौन्दर्यरत्नाकरी"]
Line 2: ["निर्धूताखिलघोरपावनकरी", "प्रत्यक्षमाहेश्वरी"]
```

**Step 2:** Filter out symbols, punctuation, and numbers
- Removes: ॥, ।, verse markers (॥१॥), parentheses, etc.
- Keeps: Only meaningful words

**Step 3:** Assign sequential indices
```
Index 0: नित्यानन्दकरी
Index 1: वराभयकरी
Index 2: सौन्दर्यरत्नाकरी
Index 3: निर्धूताखिलघोरपावनकरी
Index 4: प्रत्यक्षमाहेश्वरी
...
```

#### Word-to-Word Translation Mapping

In the `wordtoword_translation.json` file (Hindi):

```json
{
  "lines": [
    "नित्य आनंद देने वाली",           // Index 0 → Translation of "नित्यानन्दकरी"
    "वरदान और अभय देने वाली",          // Index 1 → Translation of "वराभयकरी"
    "सौंदर्य रूपी रत्न प्रदान करने वाली", // Index 2 → Translation of "सौन्दर्यरत्नाकरी"
    "सभी भयंकर पापों को दूर कर पवित्र करने वाली", // Index 3 → Translation of "निर्धूताखिलघोरपावनकरी"
    "प्रत्यक्ष महेश्वरी",              // Index 4 → Translation of "प्रत्यक्षमाहेश्वरी"
    ...
  ]
}
```

## Key Points

1. **Compound Words**: Sanskrit words are often compound words (e.g., "नित्यानन्दकरी" = "नित्य" + "आनंद" + "करी")

2. **Translation Breakdown**: The word-to-word translation breaks down these compound words into their constituent meanings:
   - `नित्यानन्दकरी` → "नित्य आनंद देने वाली" (giver of eternal bliss)
   - `वराभयकरी` → "वरदान और अभय देने वाली" (giver of boons and fearlessness)

3. **One-to-One Mapping**: Each word in the original lyrics has exactly ONE corresponding entry in the translation array

4. **Array Index = Word Index**: The position in the `lines` array must match the sequential word index

## Why Validation is Important

If the `wordtoword_translation.json` file has:
- **Fewer entries**: Some words won't have translations (hover will show nothing)
- **More entries**: Extra translations that don't correspond to any word
- **Wrong order**: Words will show incorrect meanings when hovered

## Example Issue

If Hindi translation has 142 entries but the lyrics have 145 words:
- Words #142, #143, #144 will have no translation
- Hovering over these words will show "undefined" or nothing
