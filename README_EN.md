# onlyoffice-editor-search-plugin

[English](README_EN.md) | [简体中文](README.md)

This is an OnlyOffice DocumentServer plugin that allows external applications (e.g., your frontend page) to search for specific content within the document, highlight (select) it, and automatically scroll to the position.

**Author**: wukai (wukai123123123@126.com)

## Features

- **External Control**: Frontend pages can send commands to the plugin via `docEditor.serviceCommand`.
- **Search & Select**: Upon receiving a keyword, the plugin searches the document and selects the first match (simulating a highlight effect).
- **Loop Search**: Sending the same keyword repeatedly will jump to and select the next match automatically.
- **Non-destructive**: Uses `Select` to mark content, ensuring no permanent changes or formatting are applied to the document.
- **Custom Error Message**: Supports displaying a custom error message when the search keyword is not found.

## Directory Structure

```
onlyoffice-editor-search-plugin/ (Project Root)
├── config.json      # Plugin configuration file
├── index.html       # Plugin entry page
├── code.js          # Core logic
├── translations/    # Localization files
├── resources/       # Resource files (icons)
├── LICENSE          # MIT License
├── README.md        # Chinese Documentation
└── README_EN.md     # English Documentation
```

## Installation

1. **Copy Plugin Files**:
   Copy the entire `onlyoffice-editor-search-plugin` folder to the OnlyOffice DocumentServer plugin directory.
   - Linux (Docker/Debian/Ubuntu): `/var/www/onlyoffice/documentserver/sdkjs-plugins/`
   - Windows: `%ProgramFiles%\ONLYOFFICE\DocumentServer\sdkjs-plugins\`

2. **Restart Service** (Optional):
   OnlyOffice usually detects new plugins automatically. If not, try restarting the OnlyOffice service or clearing your browser cache.

## Usage

In your frontend page where OnlyOffice is integrated, use the `docEditor` object to invoke the plugin.

```javascript
// Assuming docEditor is the initialized DocsAPI.DocEditor instance
// var docEditor = new DocsAPI.DocEditor("placeholder", config);

// Search Configuration
var searchConfig = {
    "keyword": "search term"       // Required: The content to search for
};

// Send command to the plugin
// Parameter 1: "editor-search-plugin" - The command ID listened by the plugin
// Parameter 2: JSON Object - Search configuration
docEditor.serviceCommand("editor-search-plugin", searchConfig);

// Listen for "not found" messages (Optional)
var onAppReady = function() {
    docEditor.attachEvent("onInfo", function(event) {
        // Check for messages sent by the plugin
        if (event && event.data && event.data.command === "onSearchNotFound") {
            console.log("Search not found:", event.data.data.keyword);
            // Implement your custom logic here, e.g., show a frontend alert
            // alert("Search term not found");
        }
    });
};
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
