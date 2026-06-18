import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const CATEGORY_LABELS: Record<string, string> = {
  technology_ai:        "Technology & AI (artificial intelligence, machine learning, tech innovations)",
  programming:         "Programming (software development, coding, algorithms, computer science)",
  history:             "History (world events, civilizations, politics, wars, historical figures)",
  geography:           "Geography (countries, capitals, terrain, cultures, landmarks)",
  science_astronomy:   "Science & Astronomy (physics, chemistry, biology, space exploration)",
  business_economics:  "Business & Economics (finance, markets, entrepreneurship, economic theory)",
  sports:              "Sports (athletics, teams, rules, records, sporting events)",
  cinema_entertainment:"Cinema & Entertainment (movies, TV shows, actors, directors, entertainment industry)",
  english:             "English (grammar, vocabulary, literature, language structure)",
  logic_problem_solving:"Logic & Problem Solving (puzzles, syllogisms, sequences, analytical thinking)",
  culture_art:         "Culture & Art (painting, sculpture, music, cultural movements, art history)",
  general_knowledge:   "General Knowledge (trivia, facts, common knowledge across all domains)",
};

const DIFFICULTY_MAP: Record<number, string> = {
  1: "easy", 2: "easy", 3: "easy",
  4: "medium", 5: "medium", 6: "medium",
  7: "hard", 8: "hard",
  9: "very_hard", 10: "very_hard",
};

function levelToDifficulty(level: number): string {
  const clamped = Math.max(1, Math.min(10, Math.floor(level / 5) + 1));
  return DIFFICULTY_MAP[clamped] ?? "medium";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { categoryId, level = 1, count = 5 } = await req.json();

    if (!categoryId || !CATEGORY_LABELS[categoryId]) {
      return new Response(
        JSON.stringify({ error: "Invalid categoryId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const difficulty     = levelToDifficulty(level);
    const categoryLabel  = CATEGORY_LABELS[categoryId];
    const safeCount      = Math.min(10, Math.max(1, Number(count)));
    const openaiKey      = Deno.env.get("OPENAI_API_KEY");

    if (!openaiKey) {
      return new Response(
        JSON.stringify({ questions: [], fallback: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const systemPrompt = `You are an expert quiz question writer for Nexora, a competitive knowledge platform.
Generate exactly ${safeCount} multiple-choice questions in the category: ${categoryLabel}.
Difficulty level: ${difficulty}.

Rules:
- Each question must have exactly 4 answer options (A, B, C, D).
- Exactly one option must be correct.
- Wrong answers must be plausible, not obviously silly.
- For "easy": straightforward factual questions.
- For "medium": require deeper knowledge or reasoning.
- For "hard": specialist knowledge, nuance, or multi-step reasoning.
- For "very_hard": expert-level, edge cases, surprising facts.
- Vary question style: factual, conceptual, applied, comparative.
- Never repeat questions across the set.
- Provide a concise 1–2 sentence explanation for the correct answer.

Respond ONLY with valid JSON in this exact format:
{
  "questions": [
    {
      "text": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Short explanation of why this is correct.",
      "difficulty": "${difficulty}"
    }
  ]
}
The "correct" field is the 0-based index of the correct option in the options array.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate ${safeCount} ${difficulty} questions for: ${categoryLabel}` },
        ],
        temperature: 0.8,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI error:", errText);
      return new Response(
        JSON.stringify({ questions: [], fallback: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const aiData  = await response.json();
    const content = aiData.choices?.[0]?.message?.content;
    if (!content) {
      return new Response(
        JSON.stringify({ questions: [], fallback: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const parsed    = JSON.parse(content);
    const questions = parsed.questions ?? [];

    const valid = questions.filter((q: unknown) => {
      if (typeof q !== "object" || q === null) return false;
      const question = q as Record<string, unknown>;
      return (
        typeof question.text === "string" &&
        Array.isArray(question.options) &&
        question.options.length === 4 &&
        typeof question.correct === "number" &&
        question.correct >= 0 &&
        question.correct <= 3 &&
        typeof question.explanation === "string"
      );
    });

    return new Response(
      JSON.stringify({ questions: valid }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("generate-question error:", err);
    return new Response(
      JSON.stringify({ questions: [], fallback: true, error: String(err) }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
