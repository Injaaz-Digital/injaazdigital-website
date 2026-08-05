# Lead qualification and booking

```mermaid
flowchart LR
  Start["Start funnel"] --> Session["Create opaque lead session"]
  Session --> Answers["Persist each answer server-side"]
  Answers --> Contact["Validate and save contact server-side"]
  Contact --> Qualify{"Qualification result"}
  Qualify -->|qualified| Slots["Fetch signed availability"]
  Qualify -->|not qualified| Review["Manual-review fallback"]
  Slots --> Book["Book with stable idempotency key"]
```

```mermaid
sequenceDiagram
  participant B as Browser
  participant API as Booking API
  participant G as Google Calendar
  B->>API: availability range
  API->>G: busy intervals
  G-->>API: calendar state
  API-->>B: slot tokens
  B->>API: book + Idempotency-Key
  API->>API: acquire reservation / duplicate check
  API->>G: create event
  G-->>API: event
  API-->>B: booking result
```

Local storage now contains only the opaque resume identifiers, current step, stepper version, and a 24-hour expiry. Answers and contact fields are not persisted there. The backend remains the source of truth. The current API does not expose a full session-resume read endpoint, so answers cannot be rehydrated after a hard refresh; adding that endpoint is the safe next backend contract rather than storing personal data in the browser.
