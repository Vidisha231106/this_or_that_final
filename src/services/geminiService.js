import { db } from './firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import {createGame} from './debateService';

// Use environment variable or fallback to your key
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyCT33ONf8J1povWiKDGSigwPkg4lQr8ao8';

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;
const predefinedPasswords = [
  'logic101', 'rhetoric202', 'argument303', 'reason404', 'debate505',
  'clarity111', 'proof212', 'rebuttal313', 'ethos414', 'logos515',
  'pathos616', 'facts717', 'topic818', 'motion919', 'verdict121',
  'case232', 'point343', 'speaker454', 'panel565', 'forum676',
  'inquiry787', 'thesis898', 'axiom909', 'voice112', 'speech223',
  'dialogue334', 'discourse445', 'persuade556', 'evidence667', 'theory778',
  'analysis889', 'critical990', 'insight123', 'concept234', 'idea345',
  'query456', 'forum789', 'panel101', 'motion210', 'case321',
  'logic432', 'reason543', 'facts654', 'proof765', 'topic876',
  'ethos987', 'logos135', 'pathos246', 'clarity357', 'rebuttal468'
];
export const generateDebatePassword = async () => {
  // This function now just picks a random password from your list.
  const randomIndex = Math.floor(Math.random() * predefinedPasswords.length);
  return predefinedPasswords[randomIndex];
};

const generateFallbackPassword = () => {
  const debateWords = [
    'rhetoric', 'eloquence', 'debate', 'argument', 'logic', 'reason',
    'persuasion', 'discourse', 'dialogue', 'discussion', 'analysis',
    'critical', 'thinking', 'speaking', 'presentation', 'evidence'
  ];
  
  const randomWord = debateWords[Math.floor(Math.random() * debateWords.length)];
  const randomNumbers = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${randomWord}${randomNumbers}`;
};

// Create a room with Gemini-generated password (Legacy function)
export const createRoomWithGemini = async () => {
  try {
    const password = await generateDebatePassword();
    // Return the password as the room key for legacy compatibility
    return password.toUpperCase();
  } catch (error) {
    console.error('Error creating room with Gemini:', error);
    throw error;
  }

};

// Validate password format
export const validatePassword = (password) => {
  return password && password.length >= 6 && password.length <= 20;
};
export const getClassroomByPassword = async (password) => {
  try {
    const q = query(collection(db, 'classrooms'), where('password', '==', password));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error getting classroom by password:', error);
    throw error;
  }
};

// Create a new classroom with password
export const createClassroom = async (classroomData) => {
  try {
    // The password is now expected to be in classroomData from the component.
    // We no longer generate a new one here.
    if (!classroomData.password) {
      throw new Error('Password is required to create a classroom.');
    }

    const classroomRef = doc(collection(db, 'classrooms'));
    const classroom = {
      id: classroomRef.id,
      name: classroomData.name || 'Debate Classroom',
      password: classroomData.password, // Use the password from the input data
      adminName: classroomData.adminName || 'Teacher',
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    await setDoc(classroomRef, classroom);

    // This part remains the same
    return classroom;

  } catch (error) {
    console.error('Error creating classroom:', error);
    throw error;
  }
};
// Get classroom by password

// Get classroom by ID
export const getClassroomById = async (classroomId) => {
  try {
    const docRef = doc(db, 'classrooms', classroomId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting classroom by ID:', error);
    throw error;
  }
};

// Update classroom data
export const updateClassroom = async (classroomId, updates) => {
  try {
    const classroomRef = doc(db, 'classrooms', classroomId);
    await setDoc(classroomRef, {
      ...updates,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating classroom:', error);
    throw error;
  }
};

// Get all classrooms for an admin
export const getAdminClassrooms = async (adminName) => {
  try {
    const q = query(collection(db, 'classrooms'), where('adminName', '==', adminName));
    const querySnapshot = await getDocs(q);
    
    const classrooms = [];
    querySnapshot.forEach((doc) => {
      classrooms.push({ id: doc.id, ...doc.data() });
    });
    
    return classrooms;
  } catch (error) {
    console.error('Error getting admin classrooms:', error);
    throw error;
  }
};
const fallbackTopics = [
  "Should social media platforms be responsible for user-generated content?",
  "Are movie remakes ever better than the original?",
  "Is it acceptable to recline your seat on an airplane?",
  "Is artificial intelligence a threat to humanity?",
  "Streaming vs. Owning: Is it better to stream media (Netflix, Spotify) or own physical copies (Blu-rays, vinyl)?",
  "AI in Music: Should artists be allowed to use AI to create songs?",
];

export const generateDebateTopic = async () => {
  try {
    const prompt = `Generate a surprising and creative topic suitable for college students. You can keep it funny as well.
    Do not add any extra text, introduction, or quotation marks.
    No political or overly controversial topics. No topic to hurt the sentiments of any community.
    Keep it concise (under 100 characters). Topics focusing on light-hearted subjects like social mdeia, humour, pop culture, technology, movies, music, sports.
    Keep in mind this is an ice-breaker debate topic for college students.
    Mix these also in between "Should social media platforms be responsible for user-generated content?", 
    "Are movie remakes ever better than the original?", "Is it acceptable to recline your seat on an airplane?",
    "Is artificial intelligence a threat to humanity?", "Streaming vs. Owning: Is it better to stream media (Netflix, Spotify) or own physical copies (Blu-rays, vinyl)?",
    "AI in Music: Should artists be allowed to use AI to create songs?"`;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' ,
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 1.0,
          maxOutputTokens: 100,
        },
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedTopic = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!generatedTopic) {
      // If AI fails, pick a random topic from our fallback list
      return fallbackTopics[Math.floor(Math.random() * fallbackTopics.length)];
    }

    return generatedTopic;
  } catch (error) {
    console.error('Error generating topic with Gemini:', error);
    // On any error, return a fallback topic
    return fallbackTopics[Math.floor(Math.random() * fallbackTopics.length)];
  }
};