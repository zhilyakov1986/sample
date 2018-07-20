# Training

```text
                                   /\
                              /\  //\\
                       /\    //\\///\\\        /\
                      //\\  ///\////\\\\  /\  //\\
         /\          /  ^ \/^ ^/^  ^  ^ \/^ \/  ^ \
        / ^\    /\  / ^   /  ^/ ^ ^ ^   ^\ ^/  ^^  \
       /^   \  / ^\/ ^ ^   ^ / ^  ^    ^  \/ ^   ^  \       *
      /  ^ ^ \/^  ^\ ^ ^ ^   ^  ^   ^   ____  ^   ^  \     /|\
     / ^ ^  ^ \ ^  _\___________________|  |_____^ ^  \   /||o\
    / ^^  ^ ^ ^\  /______________________________\ ^ ^ \ /|o|||\
   /  ^  ^^ ^ ^  /________________________________\  ^  /|||||o|\
  /^ ^  ^ ^^  ^    ||___|___||||||||||||___|__|||      /||o||||||\
 / ^   ^   ^    ^  ||___|___||||||||||||___|__|||          | |
/ ^ ^ ^  ^  ^  ^   ||||||||||||||||||||||||||||||oooooooooo| |ooooooo
ooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
```

# Init

Step 1: using a bash terminal, run the command yo breck:init (GitBash for Windows is not recommended, but the terminal within VS Code is)

```bash
    ### from your webapps folder (i.e. E:/Webapps/)
    yo breck:init
```

Step 2: load the project in Visual Studio, build the project and then push the SQL project to create the database locally (be sure to set IncludeDummyData to true)
Step 3: start your API (be sure you are in Debug configuration)
Step 4: using a bash terminal, run the npm start command.  This will install all npm packages, lint the project, and serve your frontend

```bash
    ### from your webapps project folder (i.e. E:/Webapps/YourProjectName/)
    npm start
```

Step 6: go to http://localhost:4200

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `yo breck` to provide a list of all available breck generator commands.

## Build

Run `npm build` to build the project. The build artifacts will be stored in the `dist/` directory. This will run the same build as production with AoT enabled.

## Further help

Reporting issues should be done at on our [ISSUE BOARD](https://gitlab.4miles.com/Engineering/Training/issues)
# sample
# sample
