// Chatbot Logic with Gen-Z Personality and Intent Detection using Supabase

const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Check authentication
async function checkAuth() {
    const accessToken = sessionStorage.getItem('access_token');

    if (!accessToken) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(accessToken);

        if (error || !user) {
            sessionStorage.clear();
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Auth check error:', error);
        sessionStorage.clear();
        window.location.href = 'login.html';
    }
}

checkAuth();

// Intent Detection - Improved with better keyword matching
function detectIntent(message) {
    const msg = message.toLowerCase().trim();

    // Free Classroom Intent
    const classroomKeywords = [
        'free class', 'empty room', 'classroom free', 'empty class',
        'free room', 'available room', 'available class', 'where can i sit',
        'where to study', 'free space', 'any room', 'vacant room',
        'show me rooms', 'find room', 'which room', 'study room',
        'class available', 'rooms free', 'empty classroom'
    ];

    // Library Intent
    const libraryKeywords = [
        'library', 'lib', 'seats', 'seat available', 'library full',
        'library empty', 'study in library', 'library occupancy',
        'library status', 'how many seats', 'library busy', 'library free',
        'can i study', 'library open', 'seats left'
    ];

    // Faculty Intent - More comprehensive
    const facultyKeywords = [
        'teacher', 'professor', 'faculty', 'sir', 'mam', 'madam',
        'dr.', 'dr ', 'cabin', 'where is', 'find teacher', 'contact',
        'prof', 'sharma', 'patel', 'kumar', 'singh', 'desai',
        'verma', 'mehta', 'nair', 'reddy', 'gupta',
        'find prof', 'locate', 'office', 'faculty location'
    ];

    if (classroomKeywords.some(kw => msg.includes(kw))) {
        return 'classroom';
    }

    if (libraryKeywords.some(kw => msg.includes(kw))) {
        return 'library';
    }

    if (facultyKeywords.some(kw => msg.includes(kw))) {
        return 'faculty';
    }

    return 'unknown';
}

// API Calls using Supabase
async function handleClassroomQuery() {
    try {
        const now = new Date();
        const currentTime = now.toTimeString().split(' ')[0]; // HH:MM:SS format
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });

        // Get all classrooms
        const { data: classrooms, error: classroomError } = await supabase
            .from('classrooms')
            .select('*')
            .eq('is_available', true);

        if (classroomError) {
            console.error('Classroom query error:', classroomError);
            return "Can't fetch classroom data right now. Error: " + classroomError.message;
        }

        if (!classrooms || classrooms.length === 0) {
            return "No classrooms found in the database.";
        }

        // Get all schedules for today
        const { data: schedules, error: scheduleError } = await supabase
            .from('schedules')
            .select('*')
            .eq('day_of_week', currentDay);

        if (scheduleError) {
            console.error('Schedule query error:', scheduleError);
        }

        // Find free classrooms (not in any current schedule)
        const busyClassroomIds = new Set();
        const availableUntil = {};

        if (schedules) {
            schedules.forEach(schedule => {
                const startTime = schedule.start_time;
                const endTime = schedule.end_time;

                // Check if current time is within this schedule
                if (currentTime >= startTime && currentTime <= endTime) {
                    busyClassroomIds.add(schedule.classroom_id);
                } else if (currentTime < startTime) {
                    // Classroom is free until this class starts
                    if (!availableUntil[schedule.classroom_id] || startTime < availableUntil[schedule.classroom_id]) {
                        availableUntil[schedule.classroom_id] = startTime;
                    }
                }
            });
        }

        const freeClassrooms = classrooms.filter(room => !busyClassroomIds.has(room.classroom_id));

        if (freeClassrooms.length === 0) {
            return "Everything's booked right now. Try again later.";
        }

        let responseText = `**Free Classrooms Right Now (${currentDay}):**\n\n`;
        freeClassrooms.forEach(room => {
            const until = availableUntil[room.classroom_id];
            const untilText = until ? ` - free till ${until.slice(0, 5)}` : ' - free for the rest of the day';
            responseText += `• **${room.room_number}** (${room.building}, capacity: ${room.capacity})${untilText}\n`;
        });

        return responseText;

    } catch (error) {
        console.error('Classroom API error:', error);
        return "Can't reach the database. Check your connection. Error: " + error.message;
    }
}

async function handleLibraryQuery() {
    try {
        // Get the latest library status
        const { data, error } = await supabase
            .from('library_status')
            .select('*')
            .order('last_updated', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            console.error('Library query error:', error);
            return "Library data unavailable right now.";
        }

        const occupancyPercentage = Math.round((data.occupied_seats / data.total_seats) * 100);
        const availableSeats = data.total_seats - data.occupied_seats;

        let message = '';
        if (occupancyPercentage >= 90) {
            message = 'Library is packed. Good luck finding a spot.';
        } else if (occupancyPercentage >= 70) {
            message = 'Library is pretty full, but you might get lucky.';
        } else if (occupancyPercentage >= 50) {
            message = 'Decent space available. Go grab a seat.';
        } else {
            message = 'Library is chill. Plenty of seats available.';
        }

        let responseText = `**Library Status:**\n\n`;
        responseText += `Total Seats: ${data.total_seats}\n`;
        responseText += `Available: ${availableSeats}\n`;
        responseText += `Occupancy: ${occupancyPercentage}%\n\n`;
        responseText += message;

        return responseText;

    } catch (error) {
        console.error('Library API error:', error);
        return "Can't reach the database. Check your connection.";
    }
}

async function handleFacultyQuery(message) {
    try {
        // Better name extraction - remove common words and extract names
        let searchName = message.toLowerCase()
            .replace(/where is|find|locate|search|show me|tell me about|contact/gi, '')
            .replace(/teacher|professor|faculty|sir|mam|madam|prof/gi, '')
            .replace(/dr\.?|dr\s/gi, '')
            .trim();

        // If no name found, try to extract any word that looks like a name
        if (!searchName || searchName.length < 2) {
            const words = message.split(' ');
            const possibleName = words.find(word =>
                word.length > 3 &&
                !['where', 'find', 'show', 'tell', 'about', 'the'].includes(word.toLowerCase())
            );
            searchName = possibleName || '';
        }

        if (!searchName || searchName.length < 2) {
            return "Give me a faculty name to search. Try: 'Where is Dr. Sharma?' or 'Find Professor Patel'";
        }

        console.log('Searching for faculty:', searchName);

        // Search faculty by name (case-insensitive)
        const { data, error } = await supabase
            .from('faculty')
            .select('*')
            .ilike('name', `%${searchName}%`);

        if (error) {
            console.error('Faculty query error:', error);
            return "Faculty search failed. Error: " + error.message;
        }

        if (!data || data.length === 0) {
            return `No faculty found matching "${searchName}". Try:\n• Dr. Sharma\n• Dr. Patel\n• Dr. Kumar\n• Dr. Singh\n• Prof. Desai`;
        }

        if (data.length > 1) {
            let responseText = `**Found ${data.length} faculty members:**\n\n`;
            data.forEach(faculty => {
                const status = faculty.is_available ? '✅ Available' : '❌ Busy';
                responseText += `• **${faculty.name}**\n  Cabin: ${faculty.cabin_number} | ${faculty.department}\n  Status: ${status}\n\n`;
            });
            return responseText;
        }

        const faculty = data[0];
        const status = faculty.is_available ? '✅ Available' : '❌ Busy';

        let responseText = `**${faculty.name}**\n\n`;
        responseText += `📍 Cabin: ${faculty.cabin_number}\n`;
        responseText += `🏛️ Department: ${faculty.department}\n`;
        responseText += `📊 Status: ${status}\n`;

        if (faculty.email) {
            responseText += `📧 Email: ${faculty.email}\n`;
        }

        responseText += `\n${faculty.is_available ? '✨ Faculty is available right now!' : '⏰ Faculty might be in class or a meeting. Try later!'}`;
        return responseText;

    } catch (error) {
        console.error('Faculty API error:', error);
        return "Can't reach the database. Error: " + error.message;
    }
}

// AI-powered response for general questions
async function handleAIQuery(message) {
    try {
        const response = await fetch('http://localhost:3000/api/chat/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        if (data.success && data.response) {
            return `🤖 **AI Assistant:**\n\n${data.response}`;
        }

        // If AI is not available, return default message
        return "I help with campus stuff: free classrooms, library status, and faculty locations. Ask me something specific!";

    } catch (error) {
        console.error('AI query error:', error);
        return "I help with campus stuff: free classrooms, library status, and faculty locations. Ask me something specific!";
    }
}

// Process user query
async function processQuery(message) {
    const intent = detectIntent(message);

    switch(intent) {
        case 'classroom':
            return await handleClassroomQuery();

        case 'library':
            return await handleLibraryQuery();

        case 'faculty':
            return await handleFacultyQuery(message);

        default:
            // Use AI for unknown queries
            return await handleAIQuery(message);
    }
}

// UI Functions
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    // Convert markdown-style formatting to HTML
    const formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');

    contentDiv.innerHTML = `<p>${formattedText}</p>`;
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typing-indicator';

    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';

    typingDiv.appendChild(indicator);
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Handle form submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const message = userInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, true);
    userInput.value = '';

    // Disable input while processing
    sendBtn.disabled = true;
    userInput.disabled = true;

    // Show typing indicator
    showTypingIndicator();

    try {
        // Process query
        const response = await processQuery(message);

        // Remove typing indicator
        removeTypingIndicator();

        // Add bot response
        addMessage(response, false);
    } catch (error) {
        removeTypingIndicator();
        addMessage("Oops. Something broke on my end. Try again?", false);
        console.error('Error:', error);
    } finally {
        // Re-enable input
        sendBtn.disabled = false;
        userInput.disabled = false;
        userInput.focus();
    }
});

// Auto-focus input on load
userInput.focus();
