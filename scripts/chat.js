// Chat Widget
class ChatWidget {
    constructor() {
        this.isOpen = false;
        this.createWidget();
        this.addEventListeners();
    }

    createWidget() {
        // Create chat button
        const chatButton = document.createElement('div');
        chatButton.className = 'chat-button';
        chatButton.innerHTML = '<i class="fas fa-comments"></i>';
        document.body.appendChild(chatButton);

        // Create chat window
        const chatWindow = document.createElement('div');
        chatWindow.className = 'chat-window';
        chatWindow.innerHTML = `
            <div class="chat-header">
                <h3>Chat with Us</h3>
                <button class="close-chat"><i class="fas fa-times"></i></button>
            </div>
            <div class="chat-messages">
                <div class="message bot">
                    <p>💡 Want your own responsive chatbot? This is just one of the interactive features we can add to your website! Try it out and see how it can enhance your user experience.</p>
                </div>
            </div>
            <div class="chat-input">
                <input type="text" placeholder="Type your message..." maxlength="200">
                <button class="send-message"><i class="fas fa-paper-plane"></i></button>
            </div>
        `;
        document.body.appendChild(chatWindow);
    }

    addEventListeners() {
        const chatButton = document.querySelector('.chat-button');
        const chatWindow = document.querySelector('.chat-window');
        const closeButton = document.querySelector('.close-chat');
        const sendButton = document.querySelector('.send-message');
        const input = document.querySelector('.chat-input input');

        chatButton.addEventListener('click', () => this.toggleChat());
        closeButton.addEventListener('click', () => this.toggleChat());

        // Send message on button click
        sendButton.addEventListener('click', () => this.sendMessage());

        // Send message on Enter key
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    toggleChat() {
        const chatWindow = document.querySelector('.chat-window');
        const chatButton = document.querySelector('.chat-button');
        
        this.isOpen = !this.isOpen;
        chatWindow.classList.toggle('active');
        chatButton.classList.toggle('active');
    }

    sendMessage() {
        const input = document.querySelector('.chat-input input');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage(message, 'user');
            input.value = '';
            
            // Simulate bot response after a short delay
            setTimeout(() => {
                this.addBotResponse(message);
            }, 1000);
        }
    }

    addMessage(message, type) {
        const messagesContainer = document.querySelector('.chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.innerHTML = `<p>${message}</p>`;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addBotResponse(userMessage) {
        // Enhanced response system with keyword arrays
        const responses = {
            greeting: {
                keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
                response: 'Hello! How can I help you today?'
            },
            help: {
                keywords: ['help', 'assist', 'support', 'what can you do', 'how can you help', 'what do you do'],
                response: 'I can help you with information about our web development services, pricing, or scheduling a consultation. What would you like to know?'
            },
            pricing: {
                keywords: ['price', 'pricing', 'cost', 'how much', 'fee', 'rates', 'budget', 'expensive', 'cheap', 'affordable'],
                response: 'Our pricing varies based on project requirements. Would you like to schedule a free consultation to discuss your needs?'
            },
            contact: {
                keywords: ['contact', 'email', 'phone', 'call', 'reach', 'get in touch', 'message', 'text', 'whatsapp'],
                response: 'You can reach us at codyjwebstudio@gmail.com or call us at +44 7378 776 848.'
            },
            services: {
                keywords: ['service', 'services', 'what do you offer', 'offer', 'website', 'web design', 'development', 'seo', 'maintenance', 'brand', 'identity'],
                response: 'We offer web design, mobile-first development, SEO optimization, monthly maintenance plans, and brand identity design. Which service interests you?'
            },
            booking: {
                keywords: ['book', 'booking', 'schedule', 'appointment', 'consultation', 'meeting', 'calendar', 'availability', 'when', 'time'],
                response: 'You can schedule a consultation through our booking system. Would you like me to open the booking form for you?'
            },
            portfolio: {
                keywords: ['portfolio', 'work', 'projects', 'examples', 'show me', 'see', 'previous', 'past', 'samples'],
                response: 'You can view our portfolio of work on our website. Would you like me to show you some examples of our recent projects?'
            },
            location: {
                keywords: ['where', 'location', 'based', 'area', 'region', 'country', 'city', 'remote', 'online'],
                response: 'We work remotely with clients worldwide, but our main office is in the UK. We can work with you regardless of your location!'
            },
            timeline: {
                keywords: ['how long', 'timeline', 'duration', 'time', 'quick', 'fast', 'when', 'deadline', 'schedule'],
                response: 'Project timelines vary based on scope and complexity. During our consultation, we can provide a detailed timeline for your specific project.'
            }
        };

        // Convert user message to lowercase for matching
        const lowerMessage = userMessage.toLowerCase();
        let response = "I'm not sure I understand. Could you please rephrase that? I can help with information about our services, pricing, or how to contact us.";

        // Check for keywords in the message
        for (let category in responses) {
            if (responses[category].keywords.some(keyword => lowerMessage.includes(keyword))) {
                response = responses[category].response;
                break;
            }
        }

        this.addMessage(response, 'bot');
    }
}

// Initialize chat widget when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChatWidget();
});

// Function to open chat widget from capability card
function openChatWidget() {
    const chatButton = document.querySelector('.chat-button');
    const chatWindow = document.querySelector('.chat-window');
    
    if (chatButton && chatWindow) {
        chatButton.classList.add('active');
        chatWindow.classList.add('active');
    }
} 