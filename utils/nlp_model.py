# backend/utils/nlp_model.py

import re
import torch
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    MarianTokenizer,
    MarianMTModel,
)

# ============================================================
# DEVICE SELECTION (M3-Pro Optimized)
# ============================================================

# For Qwen models, MPS is usable and faster than CPU.
# But translation models run more safely on CPU.

USE_MPS = False

if USE_MPS and torch.backends.mps.is_available():
    print("⚡ Using Apple MPS (GPU Accelerator)")
    device = torch.device("mps")
else:
    print("⚠️ MPS not available — using CPU")
    device = torch.device("cpu")

# ============================================================
# MAIN CHAT MODEL (Qwen 1.5B Instruct)
# ============================================================

BASE_MODEL_ID = "Qwen/Qwen2.5-1.5B-Instruct"

print(f"🔄 Loading base NLM model: {BASE_MODEL_ID}")

base_tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL_ID)
base_model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL_ID,
    torch_dtype=torch.float32,  # Safe on MPS/CPU
)
base_model.to(device).eval()

# ============================================================
# TRANSLATION MODELS (MarianMT) — Lazy Loaded
# ============================================================

TRANSLATION_MODEL_IDS = {
    "hindi": "Helsinki-NLP/opus-mt-en-hi",
    "marathi": "Helsinki-NLP/opus-mt-en-mr",
    "tamil": "Helsinki-NLP/opus-mt-en-ta",
    "telugu": "Helsinki-NLP/opus-mt-en-te",
}

translation_models = {}  # cache per-language


def load_translation_model(lang: str):
    """Load MarianMT model for a language only once (cached)."""
    lang = lang.lower().strip()

    model_name = TRANSLATION_MODEL_IDS.get(lang)
    if not model_name:
        return None

    if lang not in translation_models:
        print(f"🌐 Loading translation model for {lang}: {model_name}")
        tok = MarianTokenizer.from_pretrained(model_name)
        mod = MarianMTModel.from_pretrained(model_name).to("cpu")  # safer on CPU
        translation_models[lang] = (tok, mod)

    return translation_models[lang]


# ============================================================
# QWEN NLM GENERATION (Stable + Clean)
# ============================================================

def generate_nlm_reply(prompt: str, max_tokens: int = 200) -> str:
    """
    Stable deterministic generation for Qwen.
    Cleans output and extracts correct <|assistant|> text.
    """
    try:
        inputs = base_tokenizer(
            prompt,
            return_tensors="pt",
            truncation=True,
        ).to(device)

        with torch.no_grad():
            output_ids = base_model.generate(
                **inputs,
                max_new_tokens=max_tokens,
                do_sample=False,  # deterministic (no junk)
                eos_token_id=base_tokenizer.eos_token_id,
                pad_token_id=base_tokenizer.eos_token_id,
            )

        # FULL decode
        text = base_tokenizer.decode(output_ids[0], skip_special_tokens=True)

        # Extract final answer after <|assistant|>
        if "<|assistant|>" in text:
            cleaned = text.split("<|assistant|>", 1)[1].strip()
        else:
            cleaned = text.strip()

        # Strip off any trailing fake dialogue turns like "Human:" / "User:" / "Assistant:"
        split = re.split(r"(?:Human|User|Assistant|System)\s*[:：]", cleaned)
        cleaned = split[0].strip()

        return cleaned or "I’m sorry — I couldn’t generate a response just now."

    except Exception as e:
        print("❌ Qwen generation error:", e)
        return "I’m sorry — I couldn’t generate a response just now."


# ============================================================
# TRANSLATION WRAPPER (English → Target)
# ============================================================

def translate_text(phrase: str, target_lang: str) -> str:
    """
    Uses MarianMT dedicated translation models.
    Much more accurate than forcing Qwen to translate.
    """
    if not target_lang:
        return "Please specify a target language (e.g., Hindi, Marathi)."

    lang = target_lang.lower().strip()
    model_data = load_translation_model(lang)

    if not model_data:
        return f"Sorry, translation to '{target_lang}' is not supported yet."

    tok, mod = model_data

    try:
        batch = tok([phrase], return_tensors="pt", truncation=True)
        with torch.no_grad():
            generated = mod.generate(
                **batch,
                max_new_tokens=80,
            )
        out = tok.batch_decode(generated, skip_special_tokens=True)[0]
        return out.strip()
    except Exception as e:
        print("❌ Translation error:", e)
        return "Translation failed. Please try again."