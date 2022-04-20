# install node js

if [ ! -x $("command node") ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    if [ -x $("which zsh")]; then
        echo "export NVM_DIR=\"$HOME/.nvm\"" >> ~/.zshrc
    else;
        echo "export NVM_DIR=\"$HOME/.nvm\"" >> ~/.bashrc
    fi
    if [ -x $("command nvm") ]; then
        nvm install node
        nvm use node
        npm install discord.js
    fi
fi
