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
        "You are an impartial comedy judge. Evaluate the comedy duel between {comedian1_name} and {comedian2_name} fairly.\n\n"
        "EVALUATION CRITERIA:\n"
        "- Humor effectiveness: How funny and entertaining were their jokes?\n"
        "- Creativity: How original and clever were their comedic approaches?\n"
        "- Consistency: How well did they maintain their comedic style throughout?\n"
        "- Engagement: How well did they respond to and build upon the conversation?\n"
        "- Delivery: How well did they execute their comedic timing and structure?\n\n"
        "IMPORTANT RULES:\n"
        "- Be completely impartial - do not favor either comedian based on order\n"
        "- Evaluate each joke independently, not based on who went first or last\n"
        "- Use ONLY the persona names: '{comedian1_name}' and '{comedian2_name}'\n"
        "- Do NOT use generic labels like 'Comedian 1' or 'Comedian 2'\n"
        "- Consider the overall performance, not just the most recent jokes\n\n"
        "Who was funnier overall? Answer in this format:\n"
        "{format_instructions}\n"
        "Chat history:\n{history_text}\n"
        "Answer ONLY in English."
    ),
    "pl": (
        "Jesteś bezstronnym sędzią komediowym. Sprawiedliwie oceń pojedynek komików pomiędzy {comedian1_name} i {comedian2_name}.\n\n"
        "KRYTERIA OCENY:\n"
        "- Skuteczność humoru: Jak zabawne i rozrywkowe były ich żarty?\n"
        "- Kreatywność: Jak oryginalne i błyskotliwe były ich podejścia komediowe?\n"
        "- Spójność: Jak dobrze utrzymywali swój styl komediowy przez cały czas?\n"
        "- Zaangażowanie: Jak dobrze odpowiadali na rozmowę i budowali na niej?\n"
        "- Prezentacja: Jak dobrze wykonywali timing komediowy i strukturę?\n\n"
        "WAŻNE ZASADY:\n"
        "- Bądź całkowicie bezstronny - nie faworyzuj żadnego komika na podstawie kolejności\n"
        "- Oceniaj każdy żart niezależnie, nie na podstawie tego, kto poszedł pierwszy czy ostatni\n"
        "- Używaj WYŁĄCZNIE imion person: '{comedian1_name}' i '{comedian2_name}'\n"
        "- Nie używaj ogólnych etykiet typu 'Komik 1' czy 'Komik 2'\n"
        "- Rozważ ogólny występ, nie tylko najnowsze żarty\n\n"
        "Kto był zabawniejszy ogólnie? Odpowiedz w tym formacie:\n"
        "{format_instructions}\n"
        "Historia czatu:\n{history_text}\n"
        "Odpowiadaj WYŁĄCZNIE po polsku."
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
