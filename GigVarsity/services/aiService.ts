import Constants from 'expo-constants';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export async function askAI(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.warn('EXPO_PUBLIC_GEMINI_API_KEY not set in .env file');
    return 'AI features are not available. Please configure the API key.';
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return 'Sorry, I could not process that request. Please try again.';
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error('askAI error:', error);
    return 'Sorry, something went wrong. Please check your connection and try again.';
  }
}

export async function generateCoverLetter(
  jobTitle: string,
  jobDescription: string,
  studentName: string,
  studentSkills: string[]
): Promise<string> {
  const prompt = `Write a professional and concise cover letter for a 
  university student applying for this job:
  
  Job Title: ${jobTitle}
  Job Description: ${jobDescription}
  Student Name: ${studentName}
  Student Skills: ${studentSkills.join(', ')}
  
  The cover letter should be 3 short paragraphs, sound enthusiastic 
  but professional, acknowledge the student is still in school and 
  eager to learn, and highlight relevant skills. Do not add any 
  placeholders like [Company Name] — write it generically.`;

  return askAI(prompt);
}

export async function analyzeSkillMatch(
  jobSkills: string[],
  studentSkills: string[]
): Promise<string> {
  const prompt = `Compare these two skill sets and give a match analysis:
  
  Job requires: ${jobSkills.join(', ')}
  Student has: ${studentSkills.join(', ')}
  
  Respond in this exact format:
  Match: [percentage]%
  Matching skills: [list skills student has that match]
  Missing skills: [list skills student is missing]
  Tip: [one sentence advice for the student]`;

  return askAI(prompt);
}
