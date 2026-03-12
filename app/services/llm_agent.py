from langchain_openai import AzureChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
import os
from dotenv import load_dotenv
import re

load_dotenv()

# Azure Config
AZURE_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_DEPLOYMENT = os.getenv("AZURE_OPENAI_MODEL_NAME")
AZURE_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION")

# Initialize LLM
llm = AzureChatOpenAI(
    azure_endpoint=AZURE_ENDPOINT,
    openai_api_key=AZURE_API_KEY,
    deployment_name=AZURE_DEPLOYMENT,
    openai_api_version=AZURE_API_VERSION,
    max_tokens=2000,
    streaming=False
)

# ENHANCED SYSTEM PROMPT - Language-Aware
SYSTEM_PROMPT = """You are Dr. AgriBot, a friendly farming advisor for Pakistani farmers.

YOUR PERSONALITY:
- Helpful and polite
- Expert in agriculture only
- Bilingual: English AND Urdu (not Roman Urdu/Hinglish)
- Keep responses clear but friendly

CRITICAL LANGUAGE RULE:
🔴 DETECT the user's language from their message
🔴 If user writes in ENGLISH → Reply in PURE ENGLISH
🔴 If user writes in URDU → Reply in PURE URDU (اردو script)
🔴 NEVER mix languages
🔴 NEVER use Roman Urdu (like "lagao", "paani", "khad")

RESPONSE GUIDELINES:

1. **GREETINGS & SMALL TALK:**
   
   **If in English:**
   - "hello/hi/hey" → "Hello! I'm Dr. AgriBot, your farming advisor. I can help with soil analysis, fertilizer recommendations, and crop care. How can I assist you? 🌾"
   - "bye/thanks" → "Goodbye! Feel free to ask if you need more help. Happy farming! 🌾"
   - "how are you" → "I'm doing great, thank you! Tell me about your farm, and I'll help you. 🌾"
   
   **If in Urdu:**
   - "ہیلو/السلام علیکم" → "السلام علیکم! میں ڈاکٹر ایگری بوٹ ہوں، آپ کا زرعی مشیر۔ میں مٹی کے تجزیے، کھاد کی سفارشات اور فصلوں کی دیکھ بھال میں مدد کر سکتا ہوں۔ کیسے مدد کروں? 🌾"
   - "اللہ حافظ/شکریہ" → "اللہ حافظ! اگر مزید مدد چاہیے تو ضرور پوچھیں۔ خوش کسانی! 🌾"
   - "کیسے ہو" → "میں بالکل ٹھیک ہوں، شکریہ! اپنے کھیت کے بارے میں بتائیں، میں مدد کروں گا۔ 🌾"

2. **OFF-TOPIC / OUT OF CONTEXT:**
   
   **If in English:**
   "I apologize, but I can only help with farming and agriculture. 🌾
   
   You can ask me about:
   • What fertilizer do I need?
   • When should I water my crops?
   • How is my soil analysis?
   • Crop care tips"
   
   **If in Urdu:**
   "معافی چاہتا ہوں، میں صرف زرعی اور کاشتکاری کے بارے میں مدد کر سکتا ہوں۔ 🌾
   
   آپ مجھ سے یہ پوچھ سکتے ہیں:
   • کس کھاد کی ضرورت ہے؟
   • کب پانی دینا چاہیے؟
   • میری مٹی کا تجزیہ کیسا ہے؟
   • فصلوں کی دیکھ بھال کی تجاویز"

3. **FARMING QUESTIONS:**
   
   **English Response Format (8-12 lines):**
   ```
   📊 SOIL STATUS:
   • Nitrogen: [value] mg/kg - [Status explanation]
   • Phosphorus: [value] mg/kg - [Status explanation]
   • Potassium: [value] mg/kg - [Status explanation]
   • pH Level: [value] - [Status with impact]
   
   📦 FERTILIZER NEEDED:
   • [Fertilizer name]: [X] kg for [Y] acres
     Reason: [Why needed in 1 line]
   
   💧 WATERING SCHEDULE:
   • Humidity [X]% - [Watering frequency]
   • Best time: [When to water]
   
   ⏰ IMPORTANT:
   • [1 key immediate action]
   ```
   
   **Urdu Response Format (8-12 lines):**
   ```
   📊 مٹی کی حالت:
   • نائٹروجن: [value] mg/kg - [حالت کی وضاحت]
   • فاسفورس: [value] mg/kg - [حالت کی وضاحت]
   • پوٹاشیم: [value] mg/kg - [حالت کی وضاحت]
   • پی ایچ لیول: [value] - [اثر کے ساتھ حالت]
   
   📦 کھاد کی ضرورت:
   • [کھاد کا نام]: [X] کلوگرام [Y] ایکڑ کے لیے
     وجہ: [ایک لائن میں کیوں ضروری ہے]
   
   💧 پانی کا شیڈول:
   • نمی [X]% ہے - [پانی دینے کی تعداد]
   • بہترین وقت: [کب پانی دیں]
   
   ⏰ اہم:
   • [فوری ایک کارروائی]
   ```

4. **SENSOR ERRORS:**
   
   **English:**
   ```
   ⚠️ SENSOR PROBLEM DETECTED!
   
   Your sensors are showing all zeros - this is incorrect.
   
   🔧 IMMEDIATE ACTIONS:
   1. Check sensor wiring
   2. Restart the device
   3. Wait 5 minutes and try again
   
   ❌ Cannot provide accurate fertilizer advice until sensors are fixed.
   Please fix sensors and message again! 🙏
   ```
   
   **Urdu:**
   ```
   ⚠️ سینسر میں خرابی!
   
   آپ کے سینسر تمام صفر دکھا رہے ہیں - یہ غلط ہے۔
   
   🔧 فوری اقدامات:
   1. سینسر کی وائرنگ چیک کریں
   2. ڈیوائس کو آف/آن کریں
   3. 5 منٹ انتظار کریں اور دوبارہ کوشش کریں
   
   ❌ جب تک سینسر ٹھیک نہ ہوں، درست کھاد کی سفارش نہیں دے سکتا۔
   سینسر ٹھیک کرنے کے بعد دوبارہ پیغام کریں! 🙏
   ```

5. **LANGUAGE DETECTION TIPS:**
   - Check for Urdu Unicode characters (U+0600 to U+06FF)
   - If message has Urdu characters → Reply in Urdu
   - If message is pure English/Latin → Reply in English
   - Default to English if ambiguous

6. **FORMATTING:**
   - Use appropriate emojis: ✅❌⚠️💧📦🌾😊
   - Keep each point clear and concise
   - Give specific numbers and quantities
   - Explain WHY along with WHAT

Remember: Match the user's language EXACTLY - pure English or pure Urdu, never mixed."""


def detect_language(text: str) -> str:
    """Detect if text is in Urdu or English"""
    # Check for Urdu Unicode range
    urdu_pattern = re.compile(r'[\u0600-\u06FF]')
    
    if urdu_pattern.search(text):
        return "urdu"
    else:
        return "english"


def get_agricultural_advice(
    user_message: str,
    sensor_data: dict,
    land_size: float = 1.0,
    session_id: str = "default"
) -> dict:
    """Get agricultural advice from AI"""
    
    # Detect language
    detected_language = detect_language(user_message)
    
    # Greeting/Farewell detection
    greetings_en = ['hello', 'hi', 'hey', 'good morning', 'good evening']
    greetings_ur = ['ہیلو', 'السلام علیکم', 'سلام', 'صبح بخیر', 'شام بخیر']
    
    farewells_en = ['bye', 'goodbye', 'thank you', 'thanks', 'ok bye']
    farewells_ur = ['اللہ حافظ', 'خدا حافظ', 'شکریہ', 'بائے']
    
    casual_en = ['how are you', 'how r u', 'whats up']
    casual_ur = ['کیسے ہو', 'کیا حال', 'ٹھیک ہو']
    
    user_lower = user_message.lower().strip()
    
    # Handle greetings
    if detected_language == "urdu":
        if any(greet in user_message for greet in greetings_ur):
            return {
                "response": "السلام علیکم! 🌾\n\nمیں ڈاکٹر ایگری بوٹ ہوں، آپ کا زرعی مشیر۔\n\nآپ مجھ سے یہ پوچھ سکتے ہیں:\n• کس کھاد کی ضرورت ہے؟\n• کب پانی دینا چاہیے؟\n• میری مٹی کا تجزیہ کیسا ہے؟\n• فصلوں کی دیکھ بھال کی تجاویز\n\nبتائیں، کیسے مدد کروں؟ 😊",
                "session_id": session_id,
                "sensor_data_used": None,
                "recommendations": {
                    "type": "greeting",
                    "language": "urdu",
                    "nitrogen_status": "N/A",
                    "phosphorus_status": "N/A",
                    "potassium_status": "N/A",
                    "ph_status": "N/A",
                    "land_size": land_size,
                    "context_flags": []
                }
            }
        
        if any(farewell in user_message for farewell in farewells_ur):
            return {
                "response": "اللہ حافظ! 🌾\n\nاگر مزید مدد چاہیے تو ضرور پوچھیں۔\n\nخوش کسانی! 😊",
                "session_id": session_id,
                "sensor_data_used": None,
                "recommendations": {
                    "type": "farewell",
                    "language": "urdu",
                    "nitrogen_status": "N/A",
                    "phosphorus_status": "N/A",
                    "potassium_status": "N/A",
                    "ph_status": "N/A",
                    "land_size": land_size,
                    "context_flags": []
                }
            }
        
        if any(casual in user_message for casual in casual_ur):
            return {
                "response": "میں بالکل ٹھیک ہوں، شکریہ! 😊\n\nاپنے کھیت یا فصل کے بارے میں بتائیں۔\nمیں آپ کی مدد کے لیے حاضر ہوں! 🌾",
                "session_id": session_id,
                "sensor_data_used": None,
                "recommendations": {
                    "type": "casual",
                    "language": "urdu",
                    "nitrogen_status": "N/A",
                    "phosphorus_status": "N/A",
                    "potassium_status": "N/A",
                    "ph_status": "N/A",
                    "land_size": land_size,
                    "context_flags": []
                }
            }
    
    else:  # English
        if any(greet in user_lower for greet in greetings_en):
            return {
                "response": "Hello! 🌾\n\nI'm Dr. AgriBot, your farming advisor.\n\nYou can ask me about:\n• What fertilizer do I need?\n• When should I water my crops?\n• How is my soil analysis?\n• Crop care tips\n\nHow can I help you? 😊",
                "session_id": session_id,
                "sensor_data_used": None,
                "recommendations": {
                    "type": "greeting",
                    "language": "english",
                    "nitrogen_status": "N/A",
                    "phosphorus_status": "N/A",
                    "potassium_status": "N/A",
                    "ph_status": "N/A",
                    "land_size": land_size,
                    "context_flags": []
                }
            }
        
        if any(farewell in user_lower for farewell in farewells_en):
            return {
                "response": "Goodbye! 🌾\n\nFeel free to ask if you need more help.\n\nHappy farming! 😊",
                "session_id": session_id,
                "sensor_data_used": None,
                "recommendations": {
                    "type": "farewell",
                    "language": "english",
                    "nitrogen_status": "N/A",
                    "phosphorus_status": "N/A",
                    "potassium_status": "N/A",
                    "ph_status": "N/A",
                    "land_size": land_size,
                    "context_flags": []
                }
            }
        
        if any(casual in user_lower for casual in casual_en):
            return {
                "response": "I'm doing great, thank you! 😊\n\nTell me about your farm or crops.\nI'm here to help! 🌾",
                "session_id": session_id,
                "sensor_data_used": None,
                "recommendations": {
                    "type": "casual",
                    "language": "english",
                    "nitrogen_status": "N/A",
                    "phosphorus_status": "N/A",
                    "potassium_status": "N/A",
                    "ph_status": "N/A",
                    "land_size": land_size,
                    "context_flags": []
                }
            }
    
    # Get sensor data
    n = sensor_data.get('nitrogen', 0)
    p = sensor_data.get('phosphorus', 0)
    k = sensor_data.get('potassium', 0)
    ph = sensor_data.get('ph', 7.0)
    temp = sensor_data.get('temperature', 0)
    humidity = sensor_data.get('humidity', 0)
    ec = sensor_data.get('ec', 0)
    
    # Status
    n_status = "Low" if n < 200 else "High" if n > 400 else "Good"
    p_status = "Low" if p < 15 else "High" if p > 30 else "Good"
    k_status = "Low" if k < 150 else "High" if k > 280 else "Good"
    ph_status = "Acidic" if ph < 6.0 else "Alkaline" if ph > 7.5 else "Good"
    
    # Context flags
    context_flags = []
    
    if n == 0 and p == 0 and k == 0 and ph == 0 and ec == 0:
        context_flags.append("SENSOR_ERROR")
    if humidity < 35:
        context_flags.append("LOW_HUMIDITY")
    if humidity > 80:
        context_flags.append("HIGH_HUMIDITY")
    if ph < 5.5:
        context_flags.append("CRITICAL_LOW_pH")
    if ph > 8.0:
        context_flags.append("CRITICAL_HIGH_pH")
    
    # Build context message with language instruction
    detailed_message = f"""DETECTED LANGUAGE: {detected_language.upper()}

⚠️ CRITICAL: You MUST reply in {detected_language.upper()} language only!
- If English → Use PURE ENGLISH
- If Urdu → Use PURE URDU (اردو script), NOT Roman Urdu

FARMER'S QUESTION: "{user_message}"

CURRENT SOIL DATA:
• Nitrogen (N): {n} mg/kg - Status: {n_status}
• Phosphorus (P): {p} mg/kg - Status: {p_status}
• Potassium (K): {k} mg/kg - Status: {k_status}
• pH Level: {ph} - Status: {ph_status}
• Temperature: {temp}°C
• Humidity: {humidity}%
• EC: {ec} µS/cm

FARM SIZE: {land_size} acres

CONTEXT ALERTS:
{chr(10).join('• ' + flag for flag in context_flags) if context_flags else '• No critical issues'}

INSTRUCTIONS:
1. Respond in {detected_language.upper()} language ONLY
2. Check if question is about farming/agriculture
3. If NOT farming → politely decline and redirect
4. Response length: 8-15 lines for detailed questions, 3-5 for simple ones
5. Explain WHY along with WHAT
6. Give specific kg amounts for {land_size} acres
7. Include emojis for clarity
8. Be helpful and professional

Answer now in {detected_language.upper()}:"""
    
    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=detailed_message)
    ]
    
    try:
        response = llm.invoke(messages)
        
        ai_response = None
        
        if hasattr(response, 'content') and response.content:
            ai_response = response.content
        else:
            print(f"⚠️ Empty response")
            
            # Fallback based on language
            if detected_language == "urdu":
                ai_response = f"""📊 مٹی کی حالت:

✅ نائٹروجن: {n} mg/kg - {n_status}
{"   ضرورت: 50 کلوگرام یوریا " + str(land_size) + " ایکڑ کے لیے" if n < 200 else "   اچھی سطح ہے"}

✅ فاسفورس: {p} mg/kg - {p_status}
{"   ضرورت: 30 کلوگرام ڈی اے پی " + str(land_size) + " ایکڑ کے لیے" if p < 15 else "   اچھی سطح ہے"}

✅ پوٹاشیم: {k} mg/kg - {k_status}
{"   ضرورت: 40 کلوگرام ایم او پی " + str(land_size) + " ایکڑ کے لیے" if k < 150 else "   اچھی سطح ہے"}

💧 پانی: {"نمی کم ہے - روزانہ پانی دیں" if humidity < 35 else "ہر 2-3 دن بعد پانی دیں"}

⏰ بہترین وقت: صبح 8-10 بجے یا شام 5-7 بجے"""
            else:
                ai_response = f"""📊 SOIL STATUS:

✅ Nitrogen: {n} mg/kg - {n_status}
{"   Needed: 50 kg Urea for " + str(land_size) + " acres" if n < 200 else "   Good level, maintain it"}

✅ Phosphorus: {p} mg/kg - {p_status}
{"   Needed: 30 kg DAP for " + str(land_size) + " acres" if p < 15 else "   Good level"}

✅ Potassium: {k} mg/kg - {k_status}
{"   Needed: 40 kg MOP for " + str(land_size) + " acres" if k < 150 else "   Good level"}

💧 WATERING: {"Humidity is low - water daily" if humidity < 35 else "Water every 2-3 days"}

⏰ Best time: Morning 8-10 AM or evening 5-7 PM"""
        
    except Exception as e:
        print(f"LLM Error: {str(e)}")
        import traceback
        traceback.print_exc()
        
        if detected_language == "urdu":
            ai_response = "⚠️ ابھی AI سروس میں مسئلہ ہے۔\nکچھ دیر میں دوبارہ کوشش کریں! 🙏"
        else:
            ai_response = "⚠️ AI service is temporarily unavailable.\nPlease try again in a moment! 🙏"
    
    return {
        "response": ai_response,
        "session_id": session_id,
        "sensor_data_used": sensor_data,
        "recommendations": {
            "language": detected_language,
            "nitrogen_status": n_status,
            "phosphorus_status": p_status,
            "potassium_status": k_status,
            "ph_status": ph_status,
            "land_size": land_size,
            "context_flags": context_flags
        }
    }


# ============== INTERACTIVE TERMINAL MODE ==============
if __name__ == "__main__":
    print("\n" + "="*80)
    print("🤖 DR. AGRIBOT - BILINGUAL VERSION (English/Urdu)")
    print("="*80 + "\n")
    
    print("Test Mode: Type questions in English or Urdu (type 'exit' to quit)\n")
    print("Examples:")
    print("  English: What fertilizer should I use?")
    print("  Urdu: کس کھاد کی ضرورت ہے؟\n")
    
    default_sensor = {
        "nitrogen": 180,
        "phosphorus": 20,
        "potassium": 140,
        "ph": 6.5,
        "temperature": 25,
        "humidity": 45,
        "ec": 1000
    }
    
    while True:
        try:
            question = input("\n❓ Your Question: ").strip()
            
            if question.lower() in ['exit', 'quit', 'q']:
                print("\n👋 Goodbye! / اللہ حافظ!\n")
                break
            
            if not question:
                continue
            
            lang = detect_language(question)
            print(f"\n🔍 Detected: {lang.upper()}")
            print("⏳ Dr. AgriBot thinking...\n")
            
            result = get_agricultural_advice(
                user_message=question,
                sensor_data=default_sensor,
                land_size=2.5
            )
            
            print("✅ RESPONSE:")
            print("-"*80)
            print(result['response'])
            print("-"*80)
            
        except KeyboardInterrupt:
            print("\n\n⚠️ Cancelled\n")
            break
        except Exception as e:
            print(f"\n❌ Error: {str(e)}\n")
    
    print("="*80 + "\n")








# new code as well with optional parameters