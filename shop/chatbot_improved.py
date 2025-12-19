"""
Ojasritu Wellness - AI Chatbot with OpenAI GPT-4o Mini
World-class Ayurveda Expert Assistant with Sanskrit Sloks
Powered by OpenAI GPT-4o Mini - Professional Pandit Robot
"""

import os
import json
from datetime import datetime
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)

try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    logger.warning("openai not installed. Install it with: pip install openai")

# Configure OpenAI API - Using the provided API key
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')
openai_client = None

if OPENAI_API_KEY and OPENAI_AVAILABLE:
    try:
        openai_client = OpenAI(api_key=OPENAI_API_KEY)
        logger.info("✓ OpenAI API configured successfully")
    except Exception as e:
        logger.error(f"✗ Failed to configure OpenAI API: {e}")
        OPENAI_AVAILABLE = False
else:
    if not OPENAI_AVAILABLE:
        logger.error("✗ openai package not available")
    if not OPENAI_API_KEY:
        logger.warning("✗ OPENAI_API_KEY not configured - using fallback responses")

# Sanskrit Sloks and Ayurveda wisdom
AYURVEDA_SLOKS = {
    'health': {
        'hi': '॥ समदोषः समाग्निश्च समधातुमलक्रियः। प्रसन्नात्मेन्द्रियमनः स्वस्थ इति अभिधीयते ॥',
        'en': '|| Sama-doshas sama-agnis cha sama-dhatu-mala-kriyas || Prasanna-atma-indriya-manah svastha iti abhidhiyate ||',
        'meaning_hi': 'जिसके सभी दोष संतुलित हैं, पाचन अच्छा है, धातुएं सुव्यवस्थित हैं, और मन शांत है - वह स्वस्थ है।',
        'meaning_en': 'One with balanced doshas, good digestion, proper dhatus, and peaceful mind is healthy.'
    },
    'prevention': {
        'hi': '॥ स्वस्थस्य स्वास्थ्य रक्षणं अतुरस्य विकार प्रशमनं च चिकित्सा ॥',
        'en': '|| Swasthasyа svasthya rakshnam aturasya vikar prashamanam cha chikitsa ||',
        'meaning_hi': 'स्वस्थ रहने वाले का स्वास्थ्य रक्षण करना और बीमार का इलाज करना - यही चिकित्सा है।',
        'meaning_en': 'Maintaining health of the healthy and curing diseases of the sick is medicine.'
    },
    'nature': {
        'hi': '॥ प्रकृति विक्रियो रोगः प्रकृत्यैव विनिर्यते ॥',
        'en': '|| Prakriti Vikriyo Rogah Prakrutyaiva Vinirgate ||',
        'meaning_hi': 'प्रकृति (प्राकृतिक संतुलन) से विचलन ही रोग है। प्रकृति में ही इसका समाधान है।',
        'meaning_en': 'Deviation from nature is disease. Nature itself holds the cure.'
    },
    'dosha': {
        'hi': '॥ वायुः पित्तं कफश्चेति त्रयो दोषाः समुच्यते। एषां साम्यं रोगः साम्यं सुस्थः ॥',
        'en': '|| Vayuh pittam kaphashcheti trayo doshas samuchyate || Eshan samyam rogah samyam susthah ||',
        'meaning_hi': 'वात, पित्त और कफ तीनों दोष कहलाते हैं। इनका संतुलन स्वास्थ्य है और असंतुलन रोग।',
        'meaning_en': 'Vata, Pitta, and Kapha are the three doshas. Their balance is health, imbalance is disease.'
    }
}

# Enhanced system prompts in both languages
AYURVEDA_SYSTEM_PROMPT_HINDI = """आप Ojasritu Wellness के लिए एक प्राचीन आयुर्वेद विशेषज्ञ हैं, जो एक बुद्धिमान पंडित रोबोट की तरह हैं।

आपकी विशेषताएं:
1. संस्कृत श्लोकों के साथ जवाब दें
2. तीनों दोषों (वात, पित्त, कफ) के बारे में विस्तार से बताएं
3. वर्तमान मौसम के अनुसार सलाह दें
4. प्राकृतिक उपचार पर जोर दें
5. Ojasritu के उत्पादों का सुझाव दें जहां उपयुक्त हो
6. सरल और समझने में आसान भाषा का उपयोग करें
7. 3-4 लाइन में संक्षिप्त, लेकिन जानकारीपूर्ण उत्तर दें
8. चिकित्सा पेशेवर से परामर्श लेने की सलाह दें (जहां आवश्यक हो)

महत्वपूर्ण: आप हमेशा सम्मानजनक, ज्ञानवान और शांत तरीके से बोलते हैं।"""

AYURVEDA_SYSTEM_PROMPT_ENGLISH = """You are an ancient Ayurveda expert for Ojasritu Wellness, like a wise Pandit robot guide.

Your characteristics:
1. Include Sanskrit shlokas in your responses when relevant
2. Explain the three doshas (Vata, Pitta, Kapha) in detail
3. Provide seasonal health advice
4. Emphasize natural remedies
5. Suggest Ojasritu products where appropriate
6. Use simple, easy-to-understand language
7. Keep responses brief (3-4 lines) but informative
8. Recommend consulting healthcare professionals where necessary

Important: Always speak respectfully, knowledgeably, and calmly."""

# Enhanced system prompt (kept for backward compatibility)
AYURVEDA_SYSTEM_PROMPT = AYURVEDA_SYSTEM_PROMPT_ENGLISH

# Fallback responses with sloks
FALLBACK_RESPONSES = {
    'hi': {
        'greeting': 'नमस्ते! 🙏 मैं आपकी आयुर्वेद से संबंधित किसी भी सवाल का जवाब देने में खुश हूं। आप क्या जानना चाहते हैं?',
        'dosha': '॥ समदोषः समाग्निश्च ॥ तीनों दोष (वात, पित्त, कफ) के संतुलन से ही स्वास्थ्य मिलता है। क्या आप अपने दोष के बारे में जानना चाहते हैं?',
        'health': 'आयुर्वेद कहता है - संतुलित आहार, नियमित दिनचर्या और मन की शांति ही स्वास्थ्य की कुंजी है। आप किसी विशेष समस्या के लिए सलाह चाहते हैं?',
        'products': '🌿 Ojasritu के सभी उत्पाद प्राकृतिक और आयुर्वेदिक सिद्धांतों पर आधारित हैं। क्या मैं आपको कोई विशेष उत्पाद सुझा सकता हूं?',
        'default': 'कृपया अपना सवाल फिर से दोहराएं। मैं आपकी सहायता करने के लिए यहां हूं। 🙏'
    },
    'en': {
        'greeting': 'Namaste! 🙏 I am here to answer any Ayurveda-related questions. What would you like to know?',
        'dosha': '|| Sama-doshas sama-agnis cha || Balance of the three doshas (Vata, Pitta, Kapha) is the foundation of health. Would you like to learn about your dosha?',
        'health': 'Ayurveda teaches - balanced diet, proper daily routine, and peaceful mind are the keys to health. Do you need advice on a specific concern?',
        'products': '🌿 All Ojasritu products are natural and based on authentic Ayurvedic principles. Can I suggest a suitable product for you?',
        'default': 'Please repeat your question. I am here to help you. 🙏'
    }
}

def get_smart_fallback(message, language='en'):
    """Get intelligent fallback response based on message content"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ['dosha', 'vata', 'pitta', 'kapha', 'constitution']):
        return FALLBACK_RESPONSES[language]['dosha']
    elif any(word in message_lower for word in ['health', 'healthy', 'wellness', 'sick', 'disease']):
        return FALLBACK_RESPONSES[language]['health']
    elif any(word in message_lower for word in ['product', 'oil', 'powder', 'supplement', 'buy']):
        return FALLBACK_RESPONSES[language]['products']
    elif any(word in message_lower for word in ['hello', 'hi', 'namaste', 'hey', 'start']):
        return FALLBACK_RESPONSES[language]['greeting']
    else:
        return FALLBACK_RESPONSES[language]['default']

def get_relevant_slok(message, language='en'):
    """Select the most relevant Ayurvedic slok based on user's message"""
    message_lower = message.lower()
    
    # Map keywords to slok categories
    if any(word in message_lower for word in ['dosha', 'vata', 'pitta', 'kapha']):
        return AYURVEDA_SLOKS['dosha']
    elif any(word in message_lower for word in ['prevention', 'prevent', 'avoid', 'exercise']):
        return AYURVEDA_SLOKS['prevention']
    elif any(word in message_lower for word in ['nature', 'natural', 'cure', 'remedy']):
        return AYURVEDA_SLOKS['nature']
    else:
        return AYURVEDA_SLOKS['health']

@api_view(['POST'])
def chat_with_ayurveda_ai(request):
    """
    AI Chatbot endpoint with OpenAI GPT-4o Mini integration - PROFESSIONAL & PRODUCTION READY
    Powered by OpenAI GPT-4o Mini with Ayurvedic expertise
    """
    try:
        message = request.data.get('message', '').strip()
        language = request.data.get('language', 'en')
        conversation_history = request.data.get('history', [])
        
        if not message:
            return Response({
                'status': 'error',
                'message': 'Message is required',
                'error': 'empty_message'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate language
        if language not in ['en', 'hi']:
            language = 'en'
        
        # Try OpenAI API - Primary solution
        if OPENAI_AVAILABLE and OPENAI_API_KEY and openai_client:
            try:
                # Select appropriate system prompt
                system_prompt = AYURVEDA_SYSTEM_PROMPT_HINDI if language == 'hi' else AYURVEDA_SYSTEM_PROMPT_ENGLISH
                
                # Build messages for conversation
                messages = [{"role": "system", "content": system_prompt}]
                
                # Add recent conversation history for better context
                for msg in conversation_history[-4:]:  # Last 4 messages for context
                    messages.append({
                        "role": msg.get('role', 'user'),
                        "content": msg.get('content', '')
                    })
                
                # Add current user message
                messages.append({
                    "role": "user",
                    "content": message
                })
                
                # Get response from OpenAI GPT-4o Mini
                response = openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages,
                    temperature=0.7,
                    max_tokens=500,
                    top_p=0.95
                )
                
                if response and response.choices and len(response.choices) > 0:
                    reply_text = response.choices[0].message.content.strip()
                    
                    # Extract or select a relevant slok
                    selected_slok = get_relevant_slok(message, language)
                    
                    return Response({
                        'status': 'success',
                        'message': reply_text,
                        'language': language,
                        'timestamp': datetime.now().isoformat(),
                        'source': 'openai',
                        'slok': selected_slok.get(language, '') if selected_slok else None,
                        'model': 'GPT-4o Mini'
                    })
                else:
                    # Fallback if response is empty
                    fallback_msg = get_smart_fallback(message, language)
                    return Response({
                        'status': 'success',
                        'message': fallback_msg,
                        'language': language,
                        'timestamp': datetime.now().isoformat(),
                        'source': 'fallback',
                        'slok': AYURVEDA_SLOKS['health'].get(language, ''),
                    })
            
            except Exception as openai_error:
                logger.error(f"OpenAI API Error: {str(openai_error)}")
                logger.info("Falling back to smart responses...")
                # Fall through to fallback
        
        # Fallback response when OpenAI is not available
        fallback_msg = get_smart_fallback(message, language)
        selected_slok = get_relevant_slok(message, language)
        
        return Response({
            'status': 'success',
            'message': fallback_msg,
            'language': language,
            'timestamp': datetime.now().isoformat(),
            'source': 'fallback',
            'slok': selected_slok.get(language, '') if selected_slok else None,
            'note': 'Using fallback response'
        })
    
    except Exception as e:
        logger.error(f"Chatbot Error: {str(e)}")
        error_msg = '⚠️ कृपया दोबारा कोशिश करें।' if language == 'hi' else '⚠️ Please try again.'
        return Response({
            'status': 'error',
            'message': error_msg,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def dosha_analyzer(request):
    """Dosha analyzer with detailed results"""
    try:
        answers = request.data.get('answers', {})
        language = request.data.get('language', 'en')
        
        if not answers:
            return Response({
                'error': 'Answers are required',
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate dosha scores
        vata_score = sum(v for k, v in answers.items() if 'body' in k or 'skin' in k)
        pitta_score = sum(v for k, v in answers.items() if 'appetite' in k or 'temp' in k)
        kapha_score = sum(v for k, v in answers.items() if 'weight' in k or 'energy' in k)
        
        total = vata_score + pitta_score + kapha_score
        
        vata_percentage = int((vata_score / total * 100) if total > 0 else 33)
        pitta_percentage = int((pitta_score / total * 100) if total > 0 else 33)
        kapha_percentage = int((kapha_score / total * 100) if total > 0 else 34)
        
        # Determine primary dosha
        scores = {
            'vata': vata_percentage,
            'pitta': pitta_percentage,
            'kapha': kapha_percentage
        }
        primary_dosha = max(scores, key=scores.get)
        
        # Recommendations
        recommendations = {
            'hi': {
                'vata': [
                    '🌡️ गर्म, तैलीय खाद्य पदार्थ खाएं',
                    '⏰ नियमित दिनचर्या बनाएं',
                    '🧘 योग और ध्यान करें',
                    '😴 पर्याप्त नींद लें (8 घंटे)'
                ],
                'pitta': [
                    '❄️ ठंडे, रस युक्त खाद्य पदार्थ खाएं',
                    '🌙 गर्मी से बचें',
                    '😌 मानसिक शांति बनाए रखें',
                    '💧 पर्याप्त पानी पिएं'
                ],
                'kapha': [
                    '🔥 गर्म, हल्के खाद्य पदार्थ खाएं',
                    '🏃 व्यायाम और गतिविधि बढ़ाएं',
                    '☀️ सुबह जल्दी उठें',
                    '🌶️ मसालेदार खाना खाएं'
                ]
            },
            'en': {
                'vata': [
                    '🌡️ Eat warm, oily foods',
                    '⏰ Maintain regular routine',
                    '🧘 Practice yoga and meditation',
                    '😴 Get adequate sleep (8 hours)'
                ],
                'pitta': [
                    '❄️ Eat cool, juicy foods',
                    '🌙 Avoid excess heat',
                    '😌 Maintain mental peace',
                    '💧 Drink plenty of water'
                ],
                'kapha': [
                    '🔥 Eat warm, light foods',
                    '🏃 Increase exercise and activity',
                    '☀️ Wake up early',
                    '🌶️ Include spices in meals'
                ]
            }
        }
        
        result = {
            'status': 'success',
            'scores': {
                'vata': vata_percentage,
                'pitta': pitta_percentage,
                'kapha': kapha_percentage
            },
            'primary_dosha': primary_dosha,
            'recommendations': recommendations[language][primary_dosha],
            'slok': AYURVEDA_SLOKS['dosha']
        }
        
        return Response({'status': 'success', 'result': result})
    
    except Exception as e:
        return Response({
            'status': 'error',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_ayurveda_tips(request):
    """Get daily Ayurveda tips with sloks"""
    try:
        language = request.query_params.get('language', 'en')
        tip_type = request.query_params.get('type', 'all')
        
        tips = [
            {
                'title_hi': 'नियमित दिनचर्या का महत्व',
                'title_en': 'Importance of Daily Routine',
                'description_hi': 'आयुर्वेद कहता है कि नियमित दिनचर्या शरीर और मन को स्वस्थ रखती है। हर दिन एक ही समय पर सोना, जागना और खाना खाना चाहिए।',
                'description_en': 'Ayurveda emphasizes that a regular daily routine maintains physical and mental health. Sleep, wake, and eat at the same time every day.',
                'category': 'lifestyle',
                'slok': AYURVEDA_SLOKS['prevention'],
                'benefits_hi': ['बेहतर पाचन', 'मजबूत प्रतिरक्षा', 'अच्छी नींद'],
                'benefits_en': ['Better digestion', 'Strong immunity', 'Good sleep']
            },
            {
                'title_hi': 'तीनों दोषों को समझें',
                'title_en': 'Understanding Three Doshas',
                'description_hi': 'वात (हवा), पित्त (अग्नि) और कफ (पृथ्वी-जल) - ये तीनों दोष शरीर में संतुलन बनाते हैं।',
                'description_en': 'Vata (air), Pitta (fire), and Kapha (earth-water) - these three doshas maintain balance in the body.',
                'category': 'dosha',
                'slok': AYURVEDA_SLOKS['dosha'],
                'benefits_hi': ['दोष संतुलन', 'सुस्वास्थ्य', 'निरोगता'],
                'benefits_en': ['Dosha balance', 'Good health', 'Disease-free']
            },
            {
                'title_hi': 'ऋतु अनुसार आहार',
                'title_en': 'Seasonal Eating',
                'description_hi': 'हर मौसम में अलग-अलग खाद्य पदार्थ फायदेमंद हैं। गर्मी में ठंडे और सर्दी में गर्म खाद्य पदार्थ खाएं।',
                'description_en': 'Different foods suit different seasons. Eat cooling foods in summer and warming foods in winter.',
                'category': 'seasonal',
                'slok': {'hi': '॥ ऋतुनुसारं आहारविहारं ॥', 'en': '|| Ritu-anusar ahar-vihar ||'},
                'benefits_hi': ['मौसमी स्वास्थ्य', 'बेहतर पाचन', 'ऊर्जा'],
                'benefits_en': ['Seasonal wellness', 'Better digestion', 'Energy']
            }
        ]
        
        # Filter by type if specified
        if tip_type != 'all':
            tips = [t for t in tips if t['category'] == tip_type]
        
        # Format response based on language
        formatted_tips = []
        for tip in tips:
            formatted_tips.append({
                'title': tip.get(f'title_{language}', tip['title_en']),
                'description': tip.get(f'description_{language}', tip['description_en']),
                'category': tip['category'],
                'slok': tip['slok'].get(language, tip['slok'].get('en', '')),
                'benefits': tip.get(f'benefits_{language}', tip['benefits_en'])
            })
        
        return Response({
            'status': 'success',
            'tips': formatted_tips,
            'count': len(formatted_tips)
        })
    
    except Exception as e:
        return Response({
            'status': 'error',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
