const prisma = require('../config/prisma');



const buildEventsContext = (events) => {
  if (!events || events.length === 0) return 'No matching events found in our database for this specific query.';
  return events
    .map((event, index) => {
      const price = event.price ? `৳${Number(event.price).toLocaleString()}` : 'Free';
      return `${index + 1}. ${event.title} | ${event.date} | ${event.location} | ${price} | Category: ${event.category}`;
    })
    .join('\n');
};

const generateAssistantReply = async (message, events) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('API Key is not set in environment variables');
  }

  const prompt = `You are AuraPass Assistant, a helpful and intelligent AI assistant for the AuraPass Event Management platform.
  
Your goal is to assist users with their questions. While you specialize in events, you can answer ANY type of question the user asks (general knowledge, calculations, advice, etc.).

User's Question: "${message}"

Relevant Events from our database (if any):
${buildEventsContext(events)}

Instructions:
1. If the user is asking about events, use the "Relevant Events" list above to provide specific recommendations.
2. If the user is asking a general question unrelated to events, answer it accurately and helpfully like a general-purpose AI.
3. Keep your tone friendly, professional, and concise.
4. If you are recommending events, mention their key details like date, location, and price.
5. If no relevant events are found but the user asked about events, suggest they try searching for different categories or cities.

Answer:`;

  const modelsToTry = [
    'gemini-flash-latest',
    'gemini-pro-latest',
    'gemini-2.5-flash',
    'gemini-2.0-flash'
  ];

  for (const modelName of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (response.status === 404) {
        console.warn(`Model ${modelName} not found, trying next...`);
        continue;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Gemini API Error (${modelName}):`, errorData);
        throw new Error(`Gemini error: ${response.status}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
         console.error(`Empty response from Gemini (${modelName}):`, data);
         continue;
      }

      return text;
    } catch (error) {
      if (modelName === modelsToTry[modelsToTry.length - 1]) {
        console.error('All Gemini models failed:', error);
        throw error;
      }
      console.warn(`Attempt with ${modelName} failed, trying next...`);
    }
  }

  return "I'm sorry, I'm having trouble processing that right now. How else can I help you with events?";
};

const CATEGORY_KEYWORDS = [
  { key: 'concert', value: 'Concert' },
  { key: 'music', value: 'Concert' },
  { key: 'festival', value: 'Festival' },
  { key: 'food', value: 'Food & Drink' },
  { key: 'conference', value: 'Conference' },
  { key: 'tech', value: 'Conference' },
  { key: 'sports', value: 'Sports' },
  { key: 'theater', value: 'Theater' },
  { key: 'workshop', value: 'Workshop' },
  { key: 'seminar', value: 'Seminar' }
];

const LOCATION_KEYWORDS = [
  'dhaka', 'chittagong', 'sylhet', 'khulna', 'rajshahi', 'barishal', 'rangpur', 'comilla', 'gazipur'
];

const pickCategory = (text) => {
  const match = CATEGORY_KEYWORDS.find((item) => text.includes(item.key));
  return match ? match.value : null;
};

const pickLocation = (text) => LOCATION_KEYWORDS.find((loc) => text.includes(loc)) || null;

exports.chat = async (req, res) => {
  try {
    const message = `${req.body?.message || ''}`.trim();

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const text = message.toLowerCase();
    
    // Check if it's an event-related query
    const isEventQuery = 
      text.includes('event') || 
      text.includes('ticket') || 
      text.includes('show') || 
      text.includes('concert') || 
      text.includes('festival') ||
      CATEGORY_KEYWORDS.some(k => text.includes(k.key)) ||
      LOCATION_KEYWORDS.some(l => text.includes(l));

    let events = [];
    
    if (isEventQuery) {
      const wantsAll = text.includes('all list') || text.includes('all events') || text.includes('everything');
      const category = wantsAll ? null : pickCategory(text);
      const location = wantsAll ? null : pickLocation(text);

      const filters = [];
      
      if (category) {
        filters.push({ category });
      }

      if (location) {
        filters.push({
          location: {
            contains: location,
            mode: 'insensitive'
          }
        });
      }

      if (!category && !location && !wantsAll) {
        filters.push({
          OR: [
            { title: { contains: message, mode: 'insensitive' } },
            { description: { contains: message, mode: 'insensitive' } },
            { category: { contains: message, mode: 'insensitive' } }
          ]
        });
      }

      events = await prisma.event.findMany({
        where: filters.length > 0 ? { AND: filters } : {},
        orderBy: { date: 'asc' },
        take: wantsAll ? 10 : 5,
        select: {
          id: true,
          title: true,
          date: true,
          location: true,
          price: true,
          image: true,
          category: true
        }
      });
    }

    const reply = await generateAssistantReply(message, events);

    return res.json({
      success: true,
      data: {
        reply,
        events,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Chat controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get a response from the assistant.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

