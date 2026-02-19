#!/bin/bash
# Calbot Installer
# Usage: curl -fsSL https://raw.githubusercontent.com/jordanearle/calbot/main/install.sh | bash
#
# Or run locally: ./install.sh
#
# Designed to work alongside the Birdie dev environment setup guide.
# Detects existing tools (NVM-managed Node, Cursor, etc.) and skips gracefully.

set -euo pipefail

# ─── Colors ───
CAL_TEAL='\033[38;2;84;187;183m'
CAL_ORANGE='\033[38;2;241;152;0m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
DIM='\033[2m'
BOLD='\033[1m'
NC='\033[0m'

# ─── Cal's personality ───
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

print_calbot() {
    echo -e "${CAL_ORANGE}${BOLD}"
    cat << 'EOF'
▗▄▄▖ ▗▄▖ ▗▖   ▗▄▄▖  ▗▄▖▗▄▄▄▖
▐▌   ▐▌ ▐▌▐▌   ▐▌ ▐▌▐▌ ▐▌ █
▐▌   ▐▛▀▜▌▐▌   ▐▛▀▚▖▐▌ ▐▌ █
▝▚▄▄▖▐▌ ▐▌▐▙▄▄▖▐▙▄▞▘▝▚▄▞▘ █
EOF
    echo -e "${NC}"
    echo -e "${DIM}Birdie's friendly prototyping assistant v1.2${NC}"
    echo ""
}

cal_say() {
    echo -e "${CAL_TEAL}(•${CAL_ORANGE}ᴗ${CAL_TEAL}•) cal>${NC} $1"
}

cal_think() {
    echo -e "${CAL_TEAL}(•${CAL_ORANGE}.${CAL_TEAL}•) cal>${NC} $1"
}

cal_success() {
    echo -e "${GREEN}(•${CAL_ORANGE}ᴗ${GREEN}•) cal>${NC} $1"
}

cal_warn() {
    echo -e "${YELLOW}(•${CAL_ORANGE}~${YELLOW}•) cal>${NC} $1"
}

cal_error() {
    echo -e "${RED}(•${CAL_ORANGE}︵${RED}•) cal>${NC} $1"
}

# ─── Helpers ───
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

step_done() {
    echo -e "  ${GREEN}✓${NC} $1"
}

step_skip() {
    echo -e "  ${CAL_ORANGE}⊘${NC} $1 ${DIM}(already installed)${NC}"
}

step_fail() {
    echo -e "  ${RED}✗${NC} $1"
}

step_info() {
    echo -e "  ${DIM}→ $1${NC}"
}

# ─── Pre-flight checks ───

check_macos() {
    if [[ "$OSTYPE" != "darwin"* ]]; then
        cal_error "Oops! Calbot is designed for macOS. You're running $OSTYPE"
        exit 1
    fi
}

check_admin() {
    # Test if we currently have admin rights WITHOUT prompting for a password.
    # This avoids the lockout risk entirely — we never ask for the password ourselves.
    if sudo -n true 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Detect how Node was installed (NVM vs Homebrew vs system)
detect_node() {
    if command_exists node; then
        local node_path
        node_path="$(which node)"
        if [[ "$node_path" == *".nvm"* ]]; then
            echo "nvm"
        elif [[ "$node_path" == *"homebrew"* ]] || [[ "$node_path" == *"/opt/homebrew"* ]] || [[ "$node_path" == *"/usr/local"* ]]; then
            echo "brew"
        else
            echo "system"
        fi
    else
        echo "none"
    fi
}

# Detect which code editor is available
detect_editor() {
    if command_exists cursor; then
        echo "cursor"
    elif command_exists code; then
        echo "vscode"
    elif [ -d "/Applications/Cursor.app" ]; then
        echo "cursor"
    elif [ -d "/Applications/Visual Studio Code.app" ]; then
        echo "vscode"
    else
        echo "none"
    fi
}

# ─── Pre-flight scan ───
# Check everything FIRST, then only install what's actually missing.
# This means we know upfront whether admin rights are needed.

preflight_scan() {
    NEED_HOMEBREW=false
    NEED_NODE=false
    NEED_GIT=false
    NEED_EDITOR=false
    NEED_CLAUDE=false
    NEED_ADMIN=false

    NODE_SOURCE="$(detect_node)"
    EDITOR_TYPE="$(detect_editor)"

    if ! command_exists brew; then
        NEED_HOMEBREW=true
        NEED_ADMIN=true
    fi

    if [[ "$NODE_SOURCE" == "none" ]]; then
        NEED_NODE=true
        # Only needs admin if we also need to install Homebrew
        if ! command_exists brew; then
            NEED_ADMIN=true
        fi
    fi

    if ! command_exists git; then
        NEED_GIT=true
    fi

    if [[ "$EDITOR_TYPE" == "none" ]]; then
        NEED_EDITOR=true
    fi

    if ! command_exists claude; then
        NEED_CLAUDE=true
    fi
}

# ─── Installation steps ───

install_homebrew() {
    if $NEED_HOMEBREW; then
        echo ""
        cal_say "Installing Homebrew (this may take a few minutes)..."
        echo ""

        # Use NONINTERACTIVE to avoid Homebrew's own "press Enter" prompt,
        # but it will still need sudo — which we've already validated.
        NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" 2>&1

        if [ $? -eq 0 ]; then
            # Add Homebrew to PATH for this session
            eval "$(/opt/homebrew/bin/brew shellenv)" 2>/dev/null || eval "$(/usr/local/bin/brew shellenv)" 2>/dev/null
            step_done "Homebrew"
        else
            step_fail "Homebrew"
            cal_error "Homebrew installation failed. See https://brew.sh for manual install."
            exit 1
        fi
    else
        step_skip "Homebrew"
    fi
}

install_node() {
    case "$NODE_SOURCE" in
        nvm)
            local version
            version="$(node --version)"
            step_skip "Node.js ${DIM}($version via NVM)${NC}"
            ;;
        brew)
            local version
            version="$(node --version)"
            step_skip "Node.js ${DIM}($version via Homebrew)${NC}"
            ;;
        system)
            local version
            version="$(node --version)"
            step_skip "Node.js ${DIM}($version)${NC}"
            ;;
        none)
            # If NVM is installed but Node isn't active, suggest using NVM
            if [ -d "$HOME/.nvm" ]; then
                cal_warn "NVM is installed but no Node version is active."
                step_info "Run: nvm install --lts && nvm use"
                step_info "Then re-run this installer."
                NEED_NODE_MANUAL=true
            else
                # Fall back to Homebrew install
                cal_think "Installing Node.js via Homebrew..."
                brew install node > /dev/null 2>&1
                if [ $? -eq 0 ]; then
                    step_done "Node.js ${DIM}($(node --version))${NC}"
                else
                    step_fail "Node.js"
                    cal_error "Node.js installation failed."
                    exit 1
                fi
            fi
            ;;
    esac
}

install_git() {
    if $NEED_GIT; then
        brew install git > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            step_done "Git"
        else
            step_fail "Git"
        fi
    else
        step_skip "Git"
    fi
}

install_editor() {
    case "$EDITOR_TYPE" in
        cursor)
            step_skip "Code editor ${DIM}(Cursor)${NC}"
            ;;
        vscode)
            step_skip "Code editor ${DIM}(VS Code)${NC}"
            ;;
        none)
            cal_warn "No code editor detected."
            step_info "We recommend Cursor (https://cursor.com) or VS Code (https://code.visualstudio.com)"
            step_info "Install one when you're ready — it's not required for Calbot to work."
            ;;
    esac
}

install_claude_code() {
    if $NEED_CLAUDE; then
        cal_think "Installing Claude Code..."
        npm install -g @anthropic-ai/claude-code > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            step_done "Claude Code"
        else
            step_fail "Claude Code"
            cal_warn "Claude Code install failed. You can install it later with:"
            step_info "npm install -g @anthropic-ai/claude-code"
        fi
    else
        step_skip "Claude Code"
    fi
}

create_developer_folder() {
    local dev_dir="$HOME/Developer"
    if [ -d "$dev_dir" ]; then
        step_skip "~/Developer folder"
    else
        mkdir -p "$dev_dir"
        step_done "~/Developer folder"
    fi
}

install_calbot() {
    cal_think "Installing Calbot..."

    # Check if running from within the repo (local dev) or remotely (curl install)
    local script_dir
    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" 2>/dev/null && pwd)"

    if [ -f "$script_dir/package.json" ]; then
        # Local development — link the package
        cd "$script_dir"
        npm install > /dev/null 2>&1
        npm run build > /dev/null 2>&1
        npm link > /dev/null 2>&1
        step_done "Calbot ${DIM}(linked locally)${NC}"
    else
        # Remote install — clone and install
        local calbot_repo="https://github.com/jordanearle/calbot.git"
        local calbot_dir="$HOME/.calbot-cli"

        # Clean previous install
        rm -rf "$calbot_dir" 2>/dev/null

        git clone --depth 1 "$calbot_repo" "$calbot_dir" > /dev/null 2>&1
        if [ $? -ne 0 ]; then
            step_fail "Calbot"
            cal_error "Failed to download Calbot. Check your internet connection."
            exit 1
        fi

        cd "$calbot_dir"
        npm install > /dev/null 2>&1
        npm run build > /dev/null 2>&1
        npm link > /dev/null 2>&1

        if [ $? -eq 0 ]; then
            step_done "Calbot"
        else
            step_fail "Calbot"
            cal_error "Failed to install Calbot dependencies."
            exit 1
        fi
    fi
}

# ─── Main ───

main() {
    clear

    print_cal
    print_calbot

    # Gate: macOS only
    check_macos

    cal_say "Hey there! Let's get you set up for prototyping!"
    echo ""
    sleep 0.5

    # ── Phase 1: Scan ──
    cal_think "Checking what's already installed..."
    echo ""
    sleep 0.3

    preflight_scan

    # ── Phase 2: Admin check (only if something actually needs it) ──
    if $NEED_ADMIN; then
        if check_admin; then
            step_done "Admin access"
        else
            echo ""
            cal_warn "Some tools need admin rights to install (Homebrew, etc.)."
            echo ""
            echo -e "  ${BOLD}Before continuing:${NC}"
            echo -e "  1. Open ${BOLD}Request Privileges${NC} on your Mac"
            echo -e "  2. Grant yourself admin access"
            echo -e "  3. Come back here and press Enter"
            echo ""
            echo -e "  ${DIM}This avoids password prompts that can lock your account${NC}"
            echo -e "  ${DIM}if entered incorrectly. Admin lasts 30 minutes.${NC}"
            echo ""
            read -r -p "  Press Enter when you have admin access (or Ctrl+C to cancel)..."
            echo ""

            # Verify admin works now
            if check_admin; then
                step_done "Admin access"
            else
                # One more shot — sometimes there's a short delay
                cal_think "Verifying admin access..."
                sleep 2
                if check_admin; then
                    step_done "Admin access"
                else
                    cal_error "Still no admin access detected."
                    echo ""
                    echo -e "  ${DIM}Make sure Request Privileges is active, then try again.${NC}"
                    echo -e "  ${DIM}If it keeps failing, ask IT for help.${NC}"
                    echo ""
                    exit 1
                fi
            fi
        fi
    else
        step_done "Admin access ${DIM}(not needed — everything's installed)${NC}"
    fi

    # ── Phase 3: Install ──
    echo ""
    cal_say "Installing tools..."
    echo ""

    install_homebrew
    install_node
    install_git
    install_editor
    create_developer_folder

    # These need Node/npm to be working
    if command_exists node && command_exists npm; then
        install_claude_code
        install_calbot
    else
        echo ""
        cal_warn "Node.js isn't available yet, so I can't install Claude Code or Calbot."
        step_info "If you're using NVM, run: nvm install --lts && nvm use"
        step_info "Then re-run this installer."
    fi

    # ── Phase 4: Done ──
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