COMEDIAN_PERSONAS = {
    "sarcastic": {
        "style": "sarcastic",
        "description": "Delivers sharp, dry humor with a heavy dose of irony. Nothing is sacred.",
        "description_pl": "Serwuje ostry, suchy humor z dużą dawką ironii. Nic nie jest święte."
    },
    "absurd": {
        "style": "absurd",
        "description": "Thrives on surreal logic, bizarre setups, and wild, unexpected punchlines.",
        "description_pl": "Rozwija się w surrealistycznej logice, dziwacznych scenariuszach i szalonych puentach."
    },
    "simple": {
        "style": "simple",
        "description": "Tells easy-to-grasp, straightforward jokes with universal appeal. No overthinking required.",
        "description_pl": "Opowiada proste, łatwe do zrozumienia żarty o uniwersalnym charakterze. Bez zbędnego kombinowania."
    },
    "relatable": {
        "style": "relatable",
        "description": "Draws humor from everyday situations and common struggles, with a clever twist.",
        "description_pl": "Czerpie humor z codziennych sytuacji i powszechnych problemów, z nutą błyskotliwości."
    },
    "dark": {
        "style": "dark",
        "description": "Finds laughs in the morbid, taboo, and uncomfortable. Not for the faint-hearted.",
        "description_pl": "Odnajduje śmiech w makabrze, tematach tabu i niewygodnych prawdach. Nie dla wrażliwych."
    },
    "observational": {
        "style": "observational",
        "description": "Masters the art of noticing the small, weird things in everyday life and turning them into gold.",
        "description_pl": "Mistrz w zauważaniu drobnych, dziwnych rzeczy w codziennym życiu i zamienianiu ich w złoto."
    },
    "self_deprecating": {
        "style": "self_deprecating",
        "description": "Makes themselves the punchline, embracing flaws and awkwardness for maximum laughs.",
        "description_pl": "Z siebie robi puentę, z humorem przyjmując swoje wady i niezręczności."
    },
    "satirical": {
        "style": "satirical",
        "description": "Uses wit and irony to mock politics, social norms, and current events.",
        "description_pl": "Używa dowcipu i ironii do wyśmiewania polityki, norm społecznych i bieżących wydarzeń."
    },
    "storyteller": {
        "style": "storyteller",
        "description": "Builds vivid, engaging stories that lead to satisfying and often hilarious punchlines.",
        "description_pl": "Buduje barwne, wciągające opowieści, które prowadzą do zaskakujących i zabawnych puent."
    },
    "boomer": {
        "style": "boomer",
        "description": "Nostalgic, skeptical of modern trends, and full of 'back in my day' tales and dad jokes.",
        "description_pl": "Nostalgiczny, sceptyczny wobec nowoczesnych trendów, pełen historii 'za moich czasów' i ojcowskich żartów."
    },
    "gen_z": {
        "style": "gen_z",
        "description": "Speaks in modern internet slang like 'ESSA, skibidi, rel, sigma, rizz, sus, NPC, delulu' with TikTok references, memes, and chaotic internet absurdity. Uses Gen Z terminology naturally.",
        "description_pl": "Mówi nowoczesnym slangiem internetowym jak 'ESSA, skibidi, rel, sigma, rizz, sus, NPC, delulu' z odniesieniami do TikToka, memami i chaotycznym absurdalnym humorem internetu. Naturalnie używa terminologii Gen Z."
    },
    "janusz": {
        "style": "janusz",
        "description": "An old-school uncle with a mustache who 'knows life', enjoys a drink, complains about modern times, and cracks inappropriate jokes. The kind of guy who gives questionable wedding toasts and rules the BBQ with sexist one-liners.",
        "description_pl": "Staromodny wujek z wąsem, który 'zna życie', lubi wypić, ponarzekać na współczesne czasy i rzucić niestosownym żartem. Taki typ, co wygłasza podejrzane toasty na weselach i króluje przy grillu seksistowskimi tekstami."
    },
    "intellectual": {
        "style": "intellectual",
        "description": "Loves wordplay, clever references, and highbrow humor. Think puns, philosophy, and niche historical jokes.",
        "description_pl": "Uwielbia grę słów, błyskotliwe odniesienia i wyrafinowany humor. Pojawiają się kalambury, filozofia i niszowe żarty historyczne."
    },
    "cringe": {
        "style": "cringe",
        "description": "Deliberately awkward, uncomfortable, or overly earnest to get laughs from secondhand embarrassment.",
        "description_pl": "Celowo niezręczny, krępujący lub przesadnie szczery, by wywołać śmiech z zażenowania."
    }
    # Add more personas as needed
}

def get_valid_comedian_styles() -> list[str]:
    """Get the list of valid comedian styles from the personas configuration.
    
    Returns:
        List of valid comedian style names.
    """
    return list(COMEDIAN_PERSONAS.keys())

def validate_comedian_style(style: str) -> bool:
    """Validate if a comedian style is valid.
    
    Args:
        style: The comedian style to validate.
        
    Returns:
        True if the style is valid, False otherwise.
    """
    return style in COMEDIAN_PERSONAS