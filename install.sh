#!/bin/bash
# Calbot Installer
# Usage: curl -fsSL https://raw.githubusercontent.com/jordanearle/calbot/main/install.sh | bash
#
# Or run locally: ./install.sh

# Cal's colors
CAL_TEAL='\033[38;2;84;187;183m'
CAL_ORANGE='\033[38;2;241;152;0m'
GREEN='\033[0;32m'
RED='\033[0;31m'
DIM='\033[2m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Cal ASCII art
print_cal() {
    echo -e "${CAL_TEAL}"
    cat << 'EOF'
      _...._
    /       \
   /  o _ o
   (    \/  )
  )          (
(    -  -  -  )
(             )
 (            )
  [          ]
---/l\    /l\--------
  ----------------
     (  )
    ( __ _)
EOF
    echo -e "${NC}"
}

# Calbot ASCII text
print_calbot() {
    echo -e "${CAL_ORANGE}${BOLD}"
    cat << 'EOF'
▗▄▄▖ ▗▄▖ ▗▖   ▗▄▄▖  ▗▄▖▗▄▄▄▖
▐▌   ▐▌ ▐▌▐▌   ▐▌ ▐▌▐▌ ▐▌ █
▐▌   ▐▛▀▜▌▐▌   ▐▛▀▚▖▐▌ ▐▌ █
▝▚▄▄▖▐▌ ▐▌▐▙▄▄▖▐▙▄▞▘▝▚▄▞▘ █
EOF
    echo -e "${NC}"
    echo -e "${DIM}Birdie's friendly prototyping assistant${NC}"
    echo ""
}

# Cal says something
cal_say() {
    echo -e "${CAL_TEAL}(•ᴗ•) cal>${NC} $1"
}

cal_think() {
    echo -e "${CAL_TEAL}(•.•) cal>${NC} $1"
}

cal_success() {
    echo -e "${GREEN}(•ᴗ•) cal>${NC} $1"
}

cal_error() {
    echo -e "${RED}(•︵•) cal>${NC} $1"
}

# Check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Spinner function
spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf " ${CAL_TEAL}%c${NC}  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

# Step indicator
step_start() {
    echo -ne "${CAL_TEAL}◐${NC} $1..."
}

step_done() {
    echo -e "\r${GREEN}✓${NC} $1"
}

step_skip() {
    echo -e "\r${CAL_ORANGE}⊘${NC} $1 ${DIM}(already installed)${NC}"
}

step_fail() {
    echo -e "\r${RED}✗${NC} $1"
}

# Main installation
main() {
    clear

    # Show intro
    print_cal
    print_calbot
    echo ""
    cal_say "Hey there! Let's get you set up for prototyping!"
    echo ""
    sleep 1

    # Check macOS
    if [[ "$OSTYPE" != "darwin"* ]]; then
        cal_error "Oops! Calbot is designed for macOS. You're running $OSTYPE"
        exit 1
    fi

    cal_think "Checking what we need to install..."
    echo ""
    sleep 0.5

    # Step 1: Homebrew
    if command_exists brew; then
        step_skip "Homebrew"
    else
        echo ""
        cal_say "I need to install Homebrew first. You may need to enter your password."
        echo ""
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        if [ $? -eq 0 ]; then
            # Add Homebrew to PATH for this session
            eval "$(/opt/homebrew/bin/brew shellenv)" 2>/dev/null || eval "$(/usr/local/bin/brew shellenv)" 2>/dev/null
            step_done "Homebrew"
        else
            step_fail "Installing Homebrew"
            cal_error "Homebrew installation failed. Please install it manually from https://brew.sh"
            exit 1
        fi
    fi

    # Step 2: Node.js
    if command_exists node; then
        NODE_VERSION=$(node --version)
        step_skip "Node.js ${DIM}($NODE_VERSION)${NC}"
    else
        step_start "Installing Node.js"
        brew install node > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            step_done "Installing Node.js"
        else
            step_fail "Installing Node.js"
            cal_error "Node.js installation failed."
            exit 1
        fi
    fi

    # Step 3: Git (usually pre-installed on macOS but just in case)
    if command_exists git; then
        step_skip "Git"
    else
        step_start "Installing Git"
        brew install git > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            step_done "Installing Git"
        else
            step_fail "Installing Git"
        fi
    fi

    # Step 4: VS Code
    if command_exists code; then
        step_skip "VS Code"
    else
        step_start "Installing VS Code"
        brew install --cask visual-studio-code > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            step_done "Installing VS Code"
        else
            step_skip "VS Code ${DIM}(optional - install manually if needed)${NC}"
        fi
    fi

    # Step 5: Claude Code
    if command_exists claude; then
        step_skip "Claude Code"
    else
        step_start "Installing Claude Code"
        npm install -g @anthropic-ai/claude-code > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            step_done "Installing Claude Code"
        else
            step_fail "Installing Claude Code"
            cal_error "Claude Code installation failed. Try: npm install -g @anthropic-ai/claude-code"
        fi
    fi

    # Step 6: Create Developer folder
    DEVELOPER_DIR="$HOME/Developer"
    if [ -d "$DEVELOPER_DIR" ]; then
        step_skip "Developer folder"
    else
        step_start "Creating ~/Developer folder"
        mkdir -p "$DEVELOPER_DIR"
        step_done "Creating ~/Developer folder"
    fi

    # Step 7: Install Calbot
    step_start "Installing Calbot"

    # Check if running from within the repo (local dev) or remotely (curl install)
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" 2>/dev/null && pwd)"

    if [ -f "$SCRIPT_DIR/package.json" ]; then
        # Local development - link the package
        cd "$SCRIPT_DIR"
        npm install > /dev/null 2>&1
        npm run build > /dev/null 2>&1
        npm link > /dev/null 2>&1
        step_done "Installing Calbot ${DIM}(linked locally)${NC}"
    else
        # Remote install - clone and install
        CALBOT_REPO="https://github.com/jordanearle/calbot.git"
        CALBOT_DIR="$HOME/.calbot-cli"

        # Remove old installation if exists
        rm -rf "$CALBOT_DIR" 2>/dev/null

        # Clone the repo
        git clone --depth 1 "$CALBOT_REPO" "$CALBOT_DIR" > /dev/null 2>&1
        if [ $? -ne 0 ]; then
            step_fail "Installing Calbot"
            cal_error "Failed to download Calbot. Check your internet connection."
            exit 1
        fi

        # Install and link
        cd "$CALBOT_DIR"
        npm install > /dev/null 2>&1
        npm run build > /dev/null 2>&1
        npm link > /dev/null 2>&1

        if [ $? -eq 0 ]; then
            step_done "Installing Calbot"
        else
            step_fail "Installing Calbot"
            cal_error "Failed to install Calbot dependencies."
            exit 1
        fi
    fi

    echo ""
    echo ""
    cal_success "All done! Your dev environment is ready!"
    echo ""
    echo -e "${CAL_TEAL}╭────────────────────────────────────────────╮${NC}"
    echo -e "${CAL_TEAL}│${NC}  ${BOLD}What's next?${NC}                               ${CAL_TEAL}│${NC}"
    echo -e "${CAL_TEAL}│${NC}                                            ${CAL_TEAL}│${NC}"
    echo -e "${CAL_TEAL}│${NC}  1. Open a ${BOLD}new terminal${NC}                     ${CAL_TEAL}│${NC}"
    echo -e "${CAL_TEAL}│${NC}  2. Run ${CAL_ORANGE}calbot new my-prototype${NC}           ${CAL_TEAL}│${NC}"
    echo -e "${CAL_TEAL}│${NC}  3. Start building!                        ${CAL_TEAL}│${NC}"
    echo -e "${CAL_TEAL}│${NC}                                            ${CAL_TEAL}│${NC}"
    echo -e "${CAL_TEAL}╰────────────────────────────────────────────╯${NC}"
    echo ""
    cal_say "Happy prototyping! *chirp chirp*"
    echo ""
}

main "$@"
