/**
 * insightEngine.js
 * Nemotron-powered cognitive insight generation
 * Calls Nebius Token Factory with nvidia/Nemotron-3_5-Lightning
 * 
 * This module is an OPTIONAL enhancement layer.
 * The core logic (stateMachine, patternEngine, cognitiveMap) remains rule-based.
 */

const TOKEN_FACTORY_URL = '/api/tokenfactory/chat/completions';

const SYSTEM_PROMPT = `You are a warm, concise cognitive insight generator for neurodivergent individuals.
You receive structured data about someone's current cognitive state, patterns, and energy levels.
Explain what their state means in plain language, offer one actionable suggestion, and reframe any self-blame.

Rules:
- Speak TO the person, not about them
- Maximum 3 sentences of insight + 1 concrete next action
- If overwhelm/scattered: validate first, suggest second
- If flow/hyperfocus: celebrate briefly, warn about boundaries
- If dormant/recovering: normalize rest, no productivity pressure
- Never diagnose or use clinical jargon
- Honour that ND brains are different, not broken`;

/**
 * Builds a compact context summary from local state (no PII sent)
 */
export function buildInsightContext(cognitiveState, patterns, profile) {
  return {
    current_state: cognitiveState.current,
    energy: cognitiveState.energy,
    sensory_load: cognitiveState.sensory,
    recent_transitions: cognitiveState.history?.slice(-5).map(h => ({
      from: h.from,
      to: h.to,
      when: h.timestamp?.slice(0, 10),
    })) || [],
    detected_patterns: patterns?.patterns?.map(p => p.type) || [],
    warnings: patterns?.warnings || [],
    profile_type: profile?.primaryType || 'unknown',
  };
}

/**
 * Calls the Token Factory API via our proxy endpoint
 */
export async function generateInsight(context) {
  const response = await fetch(TOKEN_FACTORY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'nvidia/Nemotron-3_5-Lightning',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Here is my cognitive state data:\n${JSON.stringify(context, null, 2)}\n\nGive me my insight now.` },
      ],
      max_tokens: 300,
      temperature: 0.8,
      chat_template_kwargs: { enable_thinking: false },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Token Factory call failed: ${response.status} ${err}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || '';
  return cleanInsight(raw);
}

/**
 * Safety net: strips any residual thinking preamble from Nemotron responses.
 * Primary fix is chat_template_kwargs: { enable_thinking: false }.
 */
function cleanInsight(text) {
  if (!text) return 'No insight generated.';
  // If thinking is properly disabled, this just trims whitespace
  const trimmed = text.trim();
  // Emergency: if old-style thinking leaks through, strip it
  if (/^Here'?s a thinking process:/i.test(trimmed)) {
    const parts = trimmed.split(/\n\n+/);
    const answer = parts.filter(p => !/^(\d+\.|\*\*|Here'?s a thinking|- )/i.test(p.trim()));
    return answer.join('\n\n').trim() || trimmed;
  }
  return trimmed;
}
