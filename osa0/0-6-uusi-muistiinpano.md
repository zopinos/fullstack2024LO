sequenceDiagram
    participant browser
    participant server
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa

    Note right of browser: Payload: {content: "heei mooi", date: "2024-01-08T09:52:27.444Z"}

    activate server
    server-->>browser: {"message":"note created"}
    deactivate server