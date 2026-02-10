# Git Repository Setup Guide

## For Team Lead (First Time Setup)

### 1. Initialize Git Repository
```bash
cd quickfix-project
git init
git add .
git commit -m "Initial commit: QuickFix E2E Project setup"
```

### 2. Create GitHub Repository
1. Go to https://github.com
2. Click "New Repository"
3. Name: `quickfix-e2e-project`
4. Description: "B.Tech 3-2 E2E Mini Project - Home Maintenance Service Platform"
5. Keep it Public (for faculty review)
6. Don't initialize with README (we already have one)
7. Click "Create Repository"

### 3. Connect Local to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/quickfix-e2e-project.git
git branch -M main
git push -u origin main
```

### 4. Add Team Members as Collaborators
1. Go to repository Settings
2. Click "Collaborators"
3. Add each team member's GitHub username
4. They'll receive email invitations

## For Team Members (Clone & Setup)

### 1. Clone Repository
```bash
git clone https://github.com/TEAM_LEAD_USERNAME/quickfix-e2e-project.git
cd quickfix-e2e-project
```

### 2. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### 3. Setup Database
```bash
cd backend
node setup-sqlite.js
```

## Daily Git Workflow

### Before Starting Work
```bash
git pull origin main
```

### After Making Changes
```bash
git status                                    # Check what changed
git add .                                     # Stage all changes
git commit -m "Module X: Description"        # Commit with message
git push origin main                          # Push to GitHub
```

## Commit Message Format

```
Module 1: Added user authentication
Module 2: Implemented dynamic pricing algorithm
Module 3: Added real-time tracking feature
Module 4: Created admin analytics dashboard
Fix: Resolved booking status update issue
Update: Enhanced UI with Serene Cool Tones design
```

## Important Git Commands

```bash
# Check repository status
git status

# View commit history
git log --oneline

# View changes before committing
git diff

# Undo uncommitted changes
git checkout -- filename

# Pull latest changes
git pull origin main

# Push your changes
git push origin main
```

## Before Each Review

### 1. Ensure Everything is Pushed
```bash
git status                    # Should show "nothing to commit"
git log --oneline -10         # Show last 10 commits
```

### 2. Verify Application Works
```bash
# Start backend
cd backend && node server.js

# Start frontend (new terminal)
cd frontend && npm start
```

### 3. Test All Features
- [ ] Login with all three roles
- [ ] Book a service (customer)
- [ ] Accept booking (provider)
- [ ] View analytics (admin)
- [ ] Real-time notifications working
- [ ] Dynamic pricing calculation

## Repository Structure for Faculty Review

```
quickfix-e2e-project/
├── README.md                  # Project documentation
├── GIT_SETUP.md              # This file
├── .gitignore                # Files to exclude
├── backend/
│   ├── server.js             # Main backend code
│   ├── database.sql          # Database schema
│   ├── setup-sqlite.js       # Database initialization
│   └── package.json          # Backend dependencies
└── frontend/
    ├── src/
    │   ├── pages/            # All page components
    │   ├── components/       # Reusable components
    │   ├── App.tsx           # Main app
    │   └── App.css           # Styling
    └── package.json          # Frontend dependencies
```

## Troubleshooting

### Issue: Push rejected
```bash
git pull origin main          # Pull latest changes first
git push origin main          # Then push
```

### Issue: Merge conflicts
```bash
# Open conflicted files, resolve manually
git add .
git commit -m "Resolved merge conflicts"
git push origin main
```

### Issue: Forgot to pull before making changes
```bash
git stash                     # Save your changes temporarily
git pull origin main          # Pull latest
git stash pop                 # Restore your changes
```

## Team Collaboration Tips

1. **Pull before starting work** - Always `git pull` before coding
2. **Commit frequently** - Small, meaningful commits
3. **Clear commit messages** - Describe what you changed
4. **Test before pushing** - Ensure code works
5. **Communicate** - Tell team when pushing major changes

## For Faculty Review Presentation

### Show Repository
1. Open GitHub repository in browser
2. Show commit history (demonstrates regular updates)
3. Show file structure (module-wise organization)
4. Show README documentation

### Show Git Commands
```bash
git log --oneline --graph --all    # Visual commit history
git log --author="YourName"        # Your contributions
```

---

**Remember**: This repository is mandatory and will be checked in every review!
