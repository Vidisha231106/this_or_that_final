# This or That 🎤

## Real-time Classroom Debate Platform

A modern, interactive debate application designed for educational environments. Built with Next.js and Firebase, featuring real-time team management, automated student assignment, and live voting capabilities.



## 📚 Project History

This project has evolved through multiple versions:

- **Version 1**: [SIP-this-or-that](https://github.com/VivaanHooda/SIP-this-or-that) - Initial implementation
- **Version 2**: [this_or_that_version2](https://github.com/Vidisha231106/this_or_that_version2) - Enhanced features
- **Current Version**: Complete rewrite with modern architecture and real-time capabilities


## ✨ Features

### 🎯 Core Functionality
- **Real-time Debates**: Live, interactive debate sessions with instant feedback
- **Automated Team Assignment**: Students are automatically balanced between Team A and Team B
- **Live Timer System**: Countdown timers for debate rounds with admin controls
- **Voting System**: Students can vote on arguments and team performance
- **Multi-Game Support**: Create and manage multiple breakout debate games simultaneously

### 👥 Role-Based Access
- **Student Interface**: Join sessions, participate in debates, cast votes
- **Volunteer/Admin Dashboard**: Manage sessions, control debates, monitor participation
- **Real-time Synchronization**: All participants see updates instantly

### 🔐 Security & Management
- **Password-Protected Sessions**: Secure classroom access with unique passwords
- **Student Registration**: Name and phone number verification
- **Session Management**: Create, monitor, and control multiple debate sessions

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/this-or-that-debate.git
   cd this-or-that-debate
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Copy your Firebase configuration
   - Update `src/services/firebase.js` with your config

4. **Set up environment variables**
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 📱 How to Use

### For Students
1. Navigate to the app homepage
2. Click "Join as Student"
3. Enter the session password provided by your volunteer
4. Register with your name and phone number
5. Get automatically assigned to a team
6. Participate in debates and cast votes

### For Volunteers/Admins
1. Click "Login as Volunteer"
2. Enter admin credentials (access codes available from core committee)
3. Create a new classroom session
4. Share the generated password with students
5. Create and manage breakout debate games
6. Control timers, topics, and monitor participation

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Homepage
├── components/
│   ├── admin/             # Admin/Volunteer components
│   │   ├── AdminDashboard.jsx
│   │   ├── ClassroomSetup.jsx
│   │   └── CreateGameModal.jsx
│   ├── common/            # Shared components
│   │   ├── AppShell.jsx
│   │   ├── Header.jsx
│   │   └── LandingPage.jsx
│   └── spectator/         # Student components
│       ├── SpectatorView.jsx
│       ├── StudentRegistration.jsx
│       ├── TimerDisplay.jsx
│       └── VotePanel.jsx
├── context/
│   └── DebateContext.jsx  # Global state management
├── services/
│   ├── debateService.js   # Firestore operations
│   ├── firebase.js        # Firebase configuration
│   └── geminiService.js   # AI-powered features
└── styles/               # CSS modules and global styles
```

## 🎨 UI/UX Features

### Modern Dark Theme
- Glassmorphism design with backdrop blur effects
- Smooth animations and transitions
- Responsive design for all devices
- Blue accent color scheme with neon highlights

### Real-time Updates
- Live team rosters
- Instant vote counting
- Dynamic timer synchronization
- Real-time debate status updates

### Accessibility
- Keyboard navigation support
- High contrast mode compatibility
- Screen reader friendly
- Mobile-optimized touch targets

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library with latest hooks
- **CSS Modules** - Scoped styling
- **Lucide React** - Modern icon library

### Backend
- **Firebase Firestore** - Real-time database
- **Firebase Functions** - Serverless backend
- **Google Gemini AI** - Topic generation and content enhancement

### Development
- **ESLint** - Code linting
- **Modern CSS** - Grid, Flexbox, and CSS Variables
- **Responsive Design** - Mobile-first approach

## 📊 Database Schema

### Collections Structure
```
classrooms/
├── {classroomId}/
│   ├── name: string
│   ├── password: string
│   ├── adminName: string
│   ├── activeGameId: string
│   └── games/
│       └── {gameId}/
│           ├── gameName: string
│           ├── topic: string
│           ├── status: "waiting" | "live" | "finished"
│           ├── votes: { switch: number }
│           ├── timer: number
│           └── players: { teamA: [], teamB: [] }

teams/
└── {classroomId}/
    ├── teamA: Student[]
    └── teamB: Student[]

students/
└── {classroomId}_{phoneNumber}/
    ├── name: string
    ├── phoneNumber: string
    ├── assignedTeam: "A" | "B"
    └── joinedAt: string
```

## 🔧 Configuration

### Firebase Setup
1. Create Firestore Database
2. Set up security rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true; // Adjust for production
       }
     }
   }
   ```

### Environment Variables
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

## 🚢 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically on push

### Manual Deployment
```bash
npm run build
npm run start
```

## 🤝 Contributing

We welcome contributions! Whether you're fixing bugs, adding features, or improving the app, your help is appreciated.

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/this-or-that-debate.git
   cd this-or-that-debate
   ```

3. **Create a new branch**:
   ```bash
   git checkout -b your-feature-name
   ```

4. **Make your changes** and test locally:
   ```bash
   npm run dev
   npm run build
   ```

5. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add your feature description"
   git push origin your-feature-name
   ```

6. **Create a Pull Request** on GitHub

### Development Guidelines

- Follow existing code patterns
- Test on both desktop and mobile
- Test both student and admin workflows
- Keep components simple and focused
- Maintain the dark theme design

### What We Need Help With

- 🐛 **Bug fixes** - Report issues or submit fixes
- ✨ **New features** - Enhance functionality
- 🎨 **UI improvements** - Better design and accessibility
- 📚 **Documentation** - Improve guides and comments
- ⚡ **Performance** - Optimize loading and Firebase queries

### Getting Help

- Open a GitHub Issue for questions
- Check existing Issues and Discussions
- Contact maintainers if needed

Thank you for contributing! 🎉

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Contributors**: All developers who helped improve this project : [Shashwati Rao](https://github.com/shash-2106), [Vivaan Hooda](https://github.com/VivaanHooda), [Vidisha Dewan](https://github.com/Vidisha231106), [Snehal Reddy Thadigotla](https://github.com/A5CENSION-SRT)
- **Coding Club RVCE** - Project initiative and support

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Contact any of the contributors

---

<p align="center">
  <strong>Built with ❤️ for educational excellence</strong><br>
  <em>Empowering students through interactive learning</em>
</p>
