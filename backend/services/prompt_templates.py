COMEDIAN_PROMPT_TEMPLATE = {
    "en": {
        "topical_with_context": (
            "IMPORTANT: Your response MUST be under 50 words. "
            "You are {name}, a {style} comedian. "
            "Here are some recent or funny moments about the topic '{topic}':\n{context}\n"
            "Your joke MUST be based almost entirely (at least 90%) on the context above. Reference or use the context as much as possible. "
            "Perform a short, funny bit about the topic. "
            "If you exceed 50 words, your response will be ignored. "
            "REMEMBER: DO NOT EXCEED 50 WORDS."
        ),
        "topical_without_context": (
            "IMPORTANT: Your response MUST be under 50 words. "
            "You are {name}, a {style} comedian. "
            "Perform a short, funny bit about the topic '{topic}'. "
            "If you exceed 50 words, your response will be ignored. "
            "REMEMBER: DO NOT EXCEED 50 WORDS."
        ),
        "roast": (
            "IMPORTANT: Your response MUST be under 30 words. "
            "You are {name}, a {style} comedian. Roast your fellow comedian with a witty, funny insult. "
            "If you exceed 30 words, your response will be ignored. "
            "REMEMBER: DO NOT EXCEED 30 WORDS."
        ),
    },
    "pl": {
        "topical_with_context": (
            "WAŻNE: Twoja odpowiedź NIE MOŻE przekroczyć 50 słów. "
            "Jesteś {name}, komikiem o stylu {style}. "
            "Oto kilka ostatnich lub zabawnych faktów na temat '{topic}':\n{context}\n"
            "Twój żart MUSI być niemal w całości (co najmniej w 90%) oparty na powyższym kontekście. Odnoś się do niego lub wykorzystuj go jak najwięcej. "
            "Wykonaj krótki, zabawny występ na ten temat. "
            "Jeśli przekroczysz 50 słów, twoja odpowiedź zostanie zignorowana. "
            "PAMIĘTAJ: NIE PRZEKRACZAJ 50 SŁÓW."
        ),
        "topical_without_context": (
            "WAŻNE: Twoja odpowiedź NIE MOŻE przekroczyć 50 słów. "
            "Jesteś {name}, komikiem o stylu {style}. "
            "Wykonaj krótki, zabawny występ na temat '{topic}'. "
            "Jeśli przekroczysz 50 słów, twoja odpowiedź zostanie zignorowana. "
            "PAMIĘTAJ: NIE PRZEKRACZAJ 50 SŁÓW."
        ),
        "roast": (
            "WAŻNE: Twoja odpowiedź NIE MOŻE przekroczyć 30 słów. "
            "Jesteś {name}, komikiem o stylu {style}. Zrób roast drugiego komika dowcipną, zabawną obelgą. "
            "Jeśli przekroczysz 30 słów, twoja odpowiedź zostanie zignorowana. "
            "PAMIĘTAJ: NIE PRZEKRACZAJ 30 SŁÓW."
        ),
    },
}

TOPIC_CONTEXT_PROMPT = {
    "en": (
        "List exactly 10 best-known, widely recognized, true anecdotes, interesting facts, or funny moments about the topic: '{topic}'. "
        "Return only the list, with no introductory or closing sentences. Each item should be short and specific. Base your answer only on facts, events, and situations that really happened or are widely known. Do not invent or make up information. Answer in English."
    ),
    "pl": (
        "Wypisz dokładnie 10 najsłynniejszych, powszechnie znanych, prawdziwych anegdot, ciekawostek lub śmiesznych momentów związanych z tematem: '{topic}'. "
        "Podaj wyłącznie listę, bez żadnych wstępnych ani końcowych zdań. Każdy punkt powinien być krótki i konkretny. Opieraj się wyłącznie na faktach, wydarzeniach i sytuacjach, które naprawdę miały miejsce lub są powszechnie znane. Nie wymyślaj informacji. Odpowiedź po polsku."
    ),
}

COMEDIANIFY_PROMPT = {
    "en": (
        "Rewrite the following text as if performed by a standup comedian on stage. "
        "Add stage directions and effects using these tags: [laughs], [laughter], [sighs], [gasps], [clears throat], —, ..., CAPITALIZATION for emphasis, and [{gender}] at the start. "
        "Only use the tags and effects listed above. Do not invent or add any other stage directions, tags, or effects. "
        "Make it sound lively and natural for a comedy club audience. "
        "Text: {text}"
    ),
    "pl": (
        "Przepisz poniższy tekst tak, jakby był wykonywany przez stand-upowego komika na scenie. "
        "Dodaj didaskalia i efekty sceniczne używając tych tagów: [laughs], [laughter], [sighs], [gasps], [clears throat], —, ..., DUŻE LITERY dla podkreślenia oraz [{gender}] na początku. "
        "Używaj wyłącznie powyższych tagów i efektów. Nie wymyślaj ani nie dodawaj innych didaskaliów, tagów ani efektów. "
        "Spraw, aby brzmiał żywo i naturalnie dla publiczności klubu komediowego. "
        "Tekst: {text}"
    ),
}

JUDGING_PROMPT = {
    "en": (
        "Given the following comedy duel between {comedian1_name} and {comedian2_name}, who was the funnier comedian?\n"
        "Respond in this format:\n"
        "{format_instructions}\n"
        "Chat history:\n{history_text}"
    ),
    "pl": (
        "Oceń pojedynek komików pomiędzy {comedian1_name} i {comedian2_name}.\n"
        "Kto był zabawniejszy? Odpowiedz w tym formacie:\n"
        "{format_instructions}\n"
        "Historia czatu:\n{history_text}\n"
        "Odpowiadaj wyłącznie po polsku."
    ),
}

RESPONSE_SCHEMA_DESCRIPTIONS = {
    "en": {
        "winner": "Name of the winning comedian",
        "summary": "One-sentence summary or justification for the winner",
    },
    "pl": {
        "winner": "Imię zwycięskiego komika",
        "summary": "Jednozdaniowe podsumowanie lub uzasadnienie wyboru zwycięzcy",
    },
}
