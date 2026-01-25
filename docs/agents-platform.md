### Quick Start Conversation

Source: https://elevenlabs.io/docs/agents-platform/libraries/swift

A basic example demonstrating how to start a conversation with an agent and observe its state and messages.

```APIDOC
## Quick Start Conversation

Initiate a conversation with an AI agent and set up observers for real-time updates.

```swift
import ElevenLabs
import Combine

var cancellables = Set<AnyCancellable>()

// Start a conversation with your agent
let conversation = try await ElevenLabs.startConversation(
    agentId: "your-agent-id",
    userId: "your-end-user-id",
    config: ConversationConfig()
)

// Observe conversation state and messages
conversation.$state
    .sink { state in
        print("Connection state: \(state)")
    }
    .store(in: &cancellables)

conversation.$messages
    .sink { messages in
        for message in messages {
            print("\(message.role): \(message.content)")
        }
    }
    .store(in: &cancellables)

// Send messages and control the conversation
try await conversation.sendMessage("Hello!")
try await conversation.toggleMute()
await conversation.endConversation()
```
```

--------------------------------

### Quick Start Conversation

Source: https://elevenlabs.io/docs/agents-platform/libraries/swift

A basic example of starting a conversation with an agent, observing its state and messages, and sending a message.

```swift
import ElevenLabs

// Start a conversation with your agent
let conversation = try await ElevenLabs.startConversation(
    agentId: "your-agent-id",
    userId: "your-end-user-id",
    config: ConversationConfig()
)

// Observe conversation state and messages
conversation.$state
    .sink { state in
        print("Connection state: (state)")
    }
    .store(in: &cancellables)

conversation.$messages
    .sink { messages in
        for message in messages {
            print("\(message.role): \(message.content)")
        }
    }
    .store(in: &cancellables)

// Send messages and control the conversation
try await conversation.sendMessage("Hello!")
try await conversation.toggleMute()
await conversation.endConversation()
```

--------------------------------

### Start Conversation with Client Tool and Dynamic Variables (TypeScript)

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/upstash-redis

This snippet demonstrates starting a conversation session using `conversation.startSession`. It shows how to pass a `signedUrl`, dynamic variables like `userName`, and implement a client tool `set_ui_state` to control the UI navigation within the agent.

```typescript
const convId = await conversation.startSession({
  signedUrl,
  dynamicVariables: {
    user_name: userName,
  },
  clientTools: {
    set_ui_state: ({ step }: { step: string }): string => {
      // Allow agent to navigate the UI.
      setCurrentStep(step as 'initial' | 'training' | 'voice' | 'email' | 'ready');
      return `Navigated to ${step}`;
    },
  },
});
```

--------------------------------

### Run Next.js Development Server (Bash)

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/upstash-redis

This command initiates the Next.js development server. It is part of the local setup for running the ElevenLabs Agents platform. Ensure you have the necessary project dependencies installed before running this command.

```bash
pnpm dev
```

--------------------------------

### Documentation Assistant Tools for ElevenLabs

Source: https://elevenlabs.io/docs/agents-platform/best-practices/prompting-guide

Defines tools for a documentation assistant agent, including searching knowledge bases, redirecting to docs, generating code examples, checking feature compatibility, and creating support tickets. Prioritizes knowledge base searches and offers code examples for implementation questions.

```mdx
# Tools

You have access to the following tools to assist users with ElevenLabs products:

`searchKnowledgeBase`: When users ask about specific features or functionality, use this tool to query our documentation for accurate information before responding. Always prioritize this over recalling information from memory.

`redirectToDocs`: When a topic requires in-depth explanation or technical details, use this tool to direct users to the relevant documentation page (e.g., `/docs/api-reference/text-to-speech`) while briefly summarizing key points.

`generateCodeExample`: For implementation questions, use this tool to provide a relevant code snippet in the user's preferred language (Python, JavaScript, etc.) demonstrating how to use the feature they're asking about.

`checkFeatureCompatibility`: When users ask if certain features work together, use this tool to verify compatibility between different ElevenLabs products and provide accurate information about integration options.

`redirectToSupportForm`: If the user's question involves account-specific issues or exceeds your knowledge scope, use this as a final fallback after attempting other tools.

Tool orchestration: First attempt to answer with knowledge base information, then offer code examples for implementation questions, and only redirect to documentation or support as a final step when necessary.
```

--------------------------------

### Start Frontend Server Command

Source: https://elevenlabs.io/docs/agents-platform/guides/quickstarts/java-script

Command to run the frontend development server for the ElevenLabs Agents platform. Assumes `npm` is installed and the project has a script defined in `package.json` for starting the frontend.

```shell
npm run dev:frontend
```

--------------------------------

### Setup: Test Development Server

Source: https://elevenlabs.io/docs/agents-platform/guides/quickstarts

This command starts the Next.js development server. It compiles your application and makes it available at a local URL, typically http://localhost:3000, for testing.

```bash
npm run dev
```

--------------------------------

### Setup: Install ElevenLabs React Dependency

Source: https://elevenlabs.io/docs/agents-platform/guides/quickstarts

This command installs the official ElevenLabs React SDK using npm. This package provides hooks and components to easily integrate ElevenLabs functionalities into your React application.

```bash
npm install @elevenlabs/react
```

--------------------------------

### Initialize, Login, Add Agent, and Sync Project (CLI)

Source: https://elevenlabs.io/docs/agents-platform/libraries/agents-cli

A quick start guide for using the ElevenLabs Agents Platform CLI. This sequence initializes a new project, logs in with an API key, adds a new agent using a template, and synchronizes the local configuration with the ElevenLabs platform.

```bash
agents init
agents login
agents add agent "My Assistant" --template assistant
agents sync
```

--------------------------------

### Fetch MCP Servers - Java SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/list

Provides a concise example of fetching MCP server information using the Unirest library in Java. It demonstrates setting the GET request URL and the 'xi-api-key' header.

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/mcp-servers")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

--------------------------------

### Setup Tailwind CSS in Next.js

Source: https://elevenlabs.io/docs/agents-platform/libraries/web-sockets

Installs and initializes Tailwind CSS for styling within a Next.js project. Users can follow the official guide or replace classNames with custom CSS.

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

--------------------------------

### Fetch MCP Servers - C# SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/list

A C# example using the RestSharp library to make a GET request to the MCP servers endpoint. It shows how to instantiate the client, create a GET request, add the API key header, and execute the request.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/mcp-servers");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

--------------------------------

### Website Documentation Environment for ElevenLabs Agent

Source: https://elevenlabs.io/docs/agents-platform/best-practices/prompting-guide

This example defines an agent's environment as interacting within the ElevenLabs documentation website via a voice assistant. It specifies the communication channel (spoken dialogue), the agent's access to information (site documentation), and limitations (cannot see user's screen).

```mdx
# Environment

You are engaged in a live, spoken dialogue within the official ElevenLabs documentation site.
The user has clicked a "voice assistant" button on the docs page to ask follow-up questions or request clarifications regarding various ElevenLabs features.
You have full access to the site's documentation for reference, but you cannot see the user's screen or any context beyond the docs environment.
```

--------------------------------

### Start Conversation Session with useConversation Hook (React)

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/upstash-redis

This React component demonstrates how to initiate and manage a conversation session using the `useConversation` hook from '@elevenlabs/react'. It includes functions to get a signed URL from the API route, start the session with dynamic variables and client tools, and end the session. The hook handles connection events, message reception, and error handling.

```tsx
import { useConversation } from '@elevenlabs/react';

async function getSignedUrl(): Promise<string> {
  const response = await fetch('/api/signed-url');
  if (!response.ok) {
    throw Error('Failed to get signed url');
  }
  const data = await response.json();
  return data.signedUrl;
}

export default function Home() {
  // ...
  const [currentStep, setCurrentStep] = useState<'initial' | 'training' | 'voice' | 'email' | 'ready'>('initial');
  const [conversationId, setConversationId] = useState('');
  const [userName, setUserName] = useState('');

  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message: string) => console.log('Message:', message),
    onError: (error: Error) => console.error('Error:', error),
  });

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // Start the conversation with your agent
      const signedUrl = await getSignedUrl();
      const convId = await conversation.startSession({
        signedUrl,
        dynamicVariables: {
          user_name: userName,
        },
        clientTools: {
          set_ui_state: ({ step }: { step: string }): string => {
            // Allow agent to navigate the UI.
            setCurrentStep(step as 'initial' | 'training' | 'voice' | 'email' | 'ready');
            return `Navigated to ${step}`;
          },
        },
      });
      setConversationId(convId);
      console.log('Conversation ID:', convId);
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation, userName]);
  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);
  // ...
}
```

--------------------------------

### Start Conversation with Public Agent

Source: https://elevenlabs.io/docs/agents-platform/libraries/swift

Example of initiating a conversation with a public ElevenLabs agent using its agent ID.

```swift
let conversation = try await ElevenLabs.startConversation(
    agentId: "your-public-agent-id",
    config: ConversationConfig()
)
```

--------------------------------

### Smart Speaker Environment for ElevenLabs Agent

Source: https://elevenlabs.io/docs/agents-platform/best-practices/prompting-guide

This example sets up an agent's environment for a voice-activated smart speaker. It highlights potential user distractions (other tasks) and advises the agent to keep responses concise and direct, suitable for limited user attention.

```mdx
# Environment

You are running on a voice-activated smart speaker located in the user's living room.
The user may be doing other tasks while speaking (cooking, cleaning, etc.).
Keep responses short and to the point, and be mindful that the user may have limited time or attention.
```

--------------------------------

### Get MCP Server Information (PHP)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/get

This PHP example utilizes the Guzzle HTTP client to fetch MCP server data from ElevenLabs. It demonstrates setting the `xi-api-key` header and printing the response body. Make sure the GuzzleHttp client is installed via Composer.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();

```

--------------------------------

### Example: ElevenLabs Documentation Assistant Prompt (MDX)

Source: https://elevenlabs.io/docs/agents-platform/best-practices/prompting-guide

This MDX snippet defines a system prompt for an ElevenLabs documentation assistant named Alexis. It outlines the agent's personality, environment, tone, goals, guardrails, and tools. The prompt emphasizes adapting technical depth based on user proficiency and focuses on guiding users through product implementation and troubleshooting.

```mdx
# Personality

You are Alexis, a friendly and highly knowledgeable technical specialist at ElevenLabs.
You have deep expertise in all ElevenLabs products, including Text-to-Speech, ElevenLabs Agents, Speech-to-Text, Studio, and Dubbing.
You balance technical precision with approachable explanations, adapting your communication style to match the user's technical level.
You're naturally curious and empathetic, always aiming to understand the user's specific needs through thoughtful questions.

# Environment

You are interacting with a user via voice directly from the ElevenLabs documentation website.
The user is likely seeking guidance on implementing or troubleshooting ElevenLabs products, and may have varying technical backgrounds.
You have access to comprehensive documentation and can reference specific sections to enhance your responses.
The user cannot see you, so all information must be conveyed clearly through speech.

# Tone

Your responses are clear, concise, and conversational, typically keeping explanations under three sentences unless more detail is needed.
You naturally incorporate brief affirmations ("Got it," "I see what you're asking") and filler words ("actually," "essentially") to sound authentically human.
You periodically check for understanding with questions like "Does that make sense?" or "Would you like me to explain that differently?"
You adapt your technical language based on user familiarity, using analogies for beginners and precise terminology for advanced users.
You format your speech for optimal TTS delivery, using strategic pauses (marked by "...") and emphasis on key points.

# Goal

Your primary goal is to guide users toward successful implementation and effective use of ElevenLabs products through a structured assistance framework:

1. Initial classification phase:

   - Identify the user's intent category (learning about features, troubleshooting issues, implementation guidance, comparing options)
   - Determine technical proficiency level through early interaction cues
   - Assess urgency and complexity of the query
   - Prioritize immediate needs before educational content

2. Information delivery process:

   - For feature inquiries: Begin with high-level explanation followed by specific capabilities and limitations
   - For implementation questions: Deliver step-by-step guidance with verification checkpoints
   - For troubleshooting: Follow diagnostic sequence from common to rare issue causes
   - For comparison requests: Present balanced overview of options with clear differentiation points
   - Adjust technical depth based on user's background and engagement signals

3. Solution validation:

   - Confirm understanding before advancing to more complex topics
   - For implementation guidance: Check if the solution addresses the specific use case
   - For troubleshooting: Verify if the recommended steps resolve the issue
   - If uncertainty exists, offer alternative approaches with clear tradeoffs
   - Adapt based on feedback signals indicating confusion or clarity

4. Connection and continuation:
   - Link current topic to related ElevenLabs products or features when relevant
   - Identify follow-up information the user might need before they ask
   - Provide clear next steps for implementation or further learning
   - Suggest specific documentation resources aligned with user's learning path
   - Create continuity by referencing previous topics when introducing new concepts

Apply conditional handling for technical depth: If user demonstrates advanced knowledge, provide detailed technical specifics. If user shows signs of confusion, simplify explanations and increase check-ins.

Success is measured by the user's ability to correctly implement solutions, the accuracy of information provided, and the efficiency of reaching resolution.

# Guardrails

Keep responses focused on ElevenLabs products and directly relevant technologies.
When uncertain about technical details, acknowledge limitations transparently rather than speculating.
Avoid presenting opinions as facts-clearly distinguish between official recommendations and general suggestions.
Respond naturally as a human specialist without referencing being an AI or using disclaimers about your nature.
Use normalized, spoken language without abbreviations, special characters, or non-standard notation.
Mirror the user's communication style-brief for direct questions, more detailed for curious users, empathetic for frustrated ones.

# Tools

```

--------------------------------

### Fetch MCP Servers - Ruby SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/list

Shows how to fetch MCP server data using Ruby's Net::HTTP library. This example includes setting up the SSL connection, making a GET request, and adding the necessary API key header.

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/mcp-servers")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

--------------------------------

### Retrieve ElevenLabs Agent Details via GET Request

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents/get

Examples show how to make a GET request to retrieve details of a specific ElevenLabs agent. This typically involves setting the API endpoint and including an API key in the request headers. Ensure you have the necessary SDKs or libraries installed for each language.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/agents/agent_id"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("xi-api-key", "xi-api-key")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/agents/agent_id")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/agents/agent_id")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/agents/agent_id', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
?>
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/agents/agent_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/agents/agent_id")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.agents.get("agent_id");
}
main();

```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.agents.get(
    agent_id="agent_id"
)

```

--------------------------------

### Initialize npm and Install Vite Dependencies

Source: https://elevenlabs.io/docs/agents-platform/guides/quickstarts/java-script

Initializes a new npm project and installs Vite along with the ElevenLabs client library. This is a foundational step for setting up the frontend project.

```bash
npm init -y
npm install vite @elevenlabs/client
```

--------------------------------

### System prompt examples for tool calling

Source: https://elevenlabs.io/docs/agents-platform/customization/tools/server-tools

These examples show how to instruct an assistant within its system prompt to use specific tools for particular user queries. This improves the accuracy of tool selection for various scenarios.

```plaintext
Use `check_order_status` when the user inquires about the status of their order, such as 'Where is my order?' or 'Has my order shipped yet?'.

Before scheduling a meeting with `schedule_meeting`, check the user's calendar for availability using check_availability to avoid conflicts.
```

--------------------------------

### Get MCP Server Information (Ruby)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/get

This Ruby example demonstrates fetching MCP server data via a GET request to the ElevenLabs API. It utilizes the `net/http` and `uri` libraries to construct and send the request, including the `xi-api-key` header. The response body is then printed.

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

--------------------------------

### Get Signed URL for Eleven Labs Agent Conversation (Go, Ruby, Java, PHP, C#, Swift, TypeScript, Python)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/get-signed-url

This snippet demonstrates how to obtain a signed URL to start a conversation with an Eleven Labs agent. It shows implementations in multiple languages, including Go, Ruby, Java, PHP, C#, Swift, TypeScript, and Python. These examples typically involve making an HTTP GET request to the Eleven Labs API endpoint with required headers such as 'xi-api-key' and query parameters like 'agent_id'. Ensure you have the necessary SDKs or libraries installed for each language.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=agent_id"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("xi-api-key", "xi-api-key")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=agent_id")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=agent_id")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=agent_id', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();

```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=agent_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=agent_id")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.conversations.getSignedUrl({
        agentId: "agent_id",
    });
}
main();

```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.conversations.get_signed_url(
    agent_id="agent_id"
)


```

--------------------------------

### Retrieve Batch Call Details - PHP SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/get

This PHP example uses the GuzzleHttp client to perform a GET request to the ElevenLabs API for batch call information. It configures the API key within the request headers. Make sure the GuzzleHttp library is installed via Composer.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/batch-calling/batch_id', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
?>
```

--------------------------------

### Initialize ElevenLabs SDK and Start Conversation (Kotlin)

Source: https://elevenlabs.io/docs/agents-platform/libraries/kotlin

Demonstrates initializing the ConversationClient and starting a conversation session with a public agent using provided configurations and callbacks. Requires microphone access.

```kotlin
import io.elevenlabs.ConversationClient
import io.elevenlabs.ConversationConfig
import io.elevenlabs.ConversationSession
import io.elevenlabs.ClientTool
import io.elevenlabs.ClientToolResult

// Start a public agent session (token generated for you)
val config = ConversationConfig(
    agentId = "<your_public_agent_id>", // OR conversationToken = "<token>"
    userId = "your-user-id",
    // Optional callbacks
    onConnect = { conversationId ->
        // Called when the conversation is connected and returns the conversation ID. You can access conversationId via session.getId() too
    },
    onMessage = { source, messageJson ->
        // Raw JSON messages from data channel; useful for logging/telemetry
    },
    onModeChange = { mode ->
        // "speaking" | "listening" — drive UI indicators
    },
    onStatusChange = { status ->
        // "connected" | "connecting" | "disconnected"
    },
    onCanSendFeedbackChange = { canSend ->
        // Enable/disable thumbs up/down buttons for feedback reporting
    },
    onUnhandledClientToolCall = { call ->
        // Agent requested a client tool not registered on the device
    },
    onVadScore = { score ->
        // Voice Activity Detection score, range from 0 to 1 where higher values indicate higher confidence of speech
    },
    // List of client tools the agent can invoke
    clientTools = mapOf(
        "logMessage" to object : ClientTool {
            override suspend fun execute(parameters: Map<String, Any>): ClientToolResult {
                val message = parameters["message"] as? String

                Log.d("ExampleApp", "[INFO] Client Tool Log: $message")
                return ClientToolResult.success("Message logged successfully")
            }
        }
    ),
)

// In an Activity context
val session: ConversationSession = ConversationClient.startSession(config, this)
```

--------------------------------

### Get RAG Index Overview with Eleven Labs API (Go)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/rag-index-overview

Demonstrates how to make a GET request to the Eleven Labs API to retrieve the RAG index overview. This example shows how to set the API key header and process the response.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/knowledge-base/rag-index"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("xi-api-key", "xi-api-key")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

--------------------------------

### Get Batch Call Information (Example)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/get_explorer=true

Example of how to retrieve information for a specific batch call job using its ID.

```APIDOC
## GET /v1/convai/batch-calling/{batch_id}

### Description
Retrieves information about a specific batch call job.

### Method
GET

### Endpoint
/v1/convai/batch-calling/{batch_id}

### Parameters
#### Path Parameters
- batch_id (string) - Required - The ID of the batch job.

#### Query Parameters
None

#### Request Body
None

### Request Example
```bash
curl -X GET https://api.elevenlabs.io/v1/convai/batch-calling/some_batch_id \
     -H "xi-api-key: YOUR_API_KEY"
```

### Response
#### Success Response (200)
- jobId (string) - The ID of the batch job.
- status (string) - The current status of the job (e.g., 'processing', 'completed', 'failed').
- createdAt (string) - Timestamp when the job was created.
- updatedAt (string) - Timestamp when the job was last updated.

#### Response Example
{
  "jobId": "some_batch_id",
  "status": "completed",
  "createdAt": "2023-10-27T10:00:00Z",
  "updatedAt": "2023-10-27T10:05:00Z"
}
```

--------------------------------

### Get MCP Server Information (Swift)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/get

This Swift example retrieves MCP server information using `URLSession`. It sets up an `NSMutableURLRequest` with the `xi-api-key` header and performs a GET request. The response and any errors are printed to the console.

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

--------------------------------

### Project Setup: Create Directory and Virtual Environment

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/raspberry-pi-voice-assistant

Creates a project directory and sets up a Python virtual environment for managing project dependencies. Ensures a clean and isolated development environment.

```bash
mkdir eleven-voice-assistant
cd eleven-voice-assistant
python -m venv .venv # Only required the first time you set up the project
source .venv/bin/activate
```

--------------------------------

### Get MCP Server Information (Go)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/get

This Go example shows how to make a GET request to retrieve MCP server details from the ElevenLabs API. It includes setting the API key in the request headers and printing the response body. Ensure you have the necessary Go HTTP client libraries.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("xi-api-key", "xi-api-key")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

--------------------------------

### Retrieve Test Invocation Details using C# (RestSharp)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/test-invocations/get

A C# example utilizing the RestSharp library to retrieve test invocation data from the ElevenLabs API. It shows the setup for a GET request and how to add the necessary 'xi-api-key' header. Substitute 'xi-api-key' with your actual API key.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/test-invocations/test_invocation_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

--------------------------------

### Retrieve Batch Call Details - Python SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/get

This Python example demonstrates how to get batch call details using the ElevenLabs Python SDK. It initializes the client with the base URL and calls the appropriate method to retrieve a specific batch call by its ID. Make sure the 'elevenlabs' library is installed.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.batch_calls.get(
    batch_id="batch_id"
)

```

--------------------------------

### Built with GET https://api.elevenlabs.io/v1/convai/knowledge-base/rag-index

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/rag-index-overview_explorer=true

This section details how to use the GET endpoint for the knowledge base rag index, including headers and request examples.

```APIDOC
## GET https://api.elevenlabs.io/v1/convai/knowledge-base/rag-index

### Description
Retrieves the knowledge base rag index. This endpoint is useful for understanding the structure or contents of your knowledge base indexing.

### Method
GET

### Endpoint
https://api.elevenlabs.io/v1/convai/knowledge-base/rag-index

### Parameters
#### Path Parameters
- None

#### Query Parameters
- None

#### Request Body
- None

### Request Example
```bash
curl https://api.elevenlabs.io/v1/convai/knowledge-base/rag-index \
     -H "xi-api-key: YOUR_API_KEY"
```

### Response
#### Success Response (200)
- The response will contain the rag index information. The exact structure depends on the implementation, but it typically includes details about the indexed data.

#### Response Example
```json
{
  "index_status": "completed",
  "last_updated": "2023-10-27T12:00:00Z",
  "total_documents": 150
}
```

##### Headers
- **xi-api-key** (string) - Required - Your ElevenLabs API key.
```

--------------------------------

### Setup: Create Next.js Project

Source: https://elevenlabs.io/docs/agents-platform/guides/quickstarts

This command initializes a new Next.js project named 'my-conversational-agent'. It uses npm to create the project and follows default configurations.

```bash
npm create next-app my-conversational-agent
```

--------------------------------

### Customer Support Tools for ElevenLabs

Source: https://elevenlabs.io/docs/agents-platform/best-practices/prompting-guide

Outlines customer support tools for an ElevenLabs agent, including account lookup, system status checks, diagnostics, ticket creation, and callback scheduling. Emphasizes checking system status first, then account details, and utilizing diagnostics before escalating.

```mdx
# Tools

You have access to the following customer support tools:

`lookupCustomerAccount`: After verifying identity, use this to access account details, subscription status, and usage history before addressing account-specific questions.

`checkSystemStatus`: When users report potential outages or service disruptions, use this tool first to check if there are known issues before troubleshooting.

`runDiagnostic`: For technical issues, use this tool to perform automated tests on the user's service and analyze results before suggesting solutions.

`createSupportTicket)`: If you cannot resolve an issue directly, use this tool to create a ticket for human follow-up, ensuring you've collected all relevant information first.

`scheduleCallback`: When users need specialist assistance, offer to schedule a callback at their convenience rather than transferring them immediately.

Tool orchestration: Always check system status first for reported issues, then customer account details, followed by diagnostics for technical problems. Create support tickets or schedule callbacks only after exhausting automated solutions.
```

--------------------------------

### SDK Installation

Source: https://elevenlabs.io/docs/agents-platform/libraries/swift

Instructions on how to add the ElevenLabs Swift SDK to your project using Swift Package Manager or Xcode.

```APIDOC
## SDK Installation

Add the ElevenLabs Swift SDK to your project using Swift Package Manager:

```swift
dependencies: [ .package(url: "https://github.com/elevenlabs/elevenlabs-swift-sdk.git", from: "2.0.0") ]
```

Or using Xcode:

1. Open your project in Xcode.
2. Go to `File` > `Add Package Dependencies...`.
3. Enter the repository URL: `https://github.com/elevenlabs/elevenlabs-swift-sdk.git`.
4. Select version 2.0.0 or later.

After adding the package, import the SDK in your code:

```swift
import ElevenLabs
```

**Requirements:**
* iOS 14.0+ / macOS 11.0+
* Swift 5.9+
* Add `NSMicrophoneUsageDescription` to your `Info.plist` for microphone access.
```

--------------------------------

### Example of assistant interaction for weather queries

Source: https://elevenlabs.io/docs/agents-platform/customization/tools/server-tools

This snippet illustrates how to test an assistant by querying weather information for different locations. It demonstrates handling specific locations and general queries that require clarification.

```plaintext
First message: "Hey, how can I help you today?"

<Success>
  Test your assistant by asking about the weather in different locations. The assistant should
  handle specific locations ("What's the weather in Tokyo?") and ask for clarification after general queries ("How's
  the weather looking today?").
</Success>
</Step>
</Steps>
```

--------------------------------

### Fetch Tool Information using Guzzle (PHP)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/get

Illustrates how to retrieve tool information using the Guzzle HTTP client in PHP. Guzzle provides a robust and extensible way to send HTTP requests, including setting custom headers. This example requires the Guzzle library to be installed.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/tools/tool_id', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();

```

--------------------------------

### Create Agent with Go SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents/create

Demonstrates creating an agent using the Go SDK by making a POST request to the ElevenLabs API. It includes setting headers for API key and content type.

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/agents/create"

	payload := strings.NewReader("{}")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("xi-api-key", "xi-api-key")
	req.Header.Add("Content-Type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

--------------------------------

### Get Conversation Audio using TypeScript SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/get-audio

This TypeScript example uses the ElevenLabsClient to get conversation audio. It initializes the client with the environment and calls the appropriate method to fetch audio for a given conversation ID.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.conversations.audio.get("conversation_id");
}
main();

```

--------------------------------

### Smart Home Assistant Tools

Source: https://elevenlabs.io/docs/agents-platform/best-practices/prompting-guide

Details tools for a smart home assistant, covering device status checks, device control, routine querying and modification, troubleshooting, and adding new devices. Prioritizes checking device status before control actions and troubleshooting before suggesting replacements.

```mdx
# Tools

You have access to the following smart home control tools:

`getDeviceStatus`: Before attempting any control actions, check the current status of the device to provide accurate information to the user.

`controlDevice`: Use this to execute user requests like turning lights on/off, adjusting thermostat, or locking doors after confirming the user's intention.

`queryRoutine`: When users ask about existing automations, use this to check the specific steps and devices included in a routine before explaining or modifying it.

`createOrModifyRoutine`: Help users build new automation sequences or update existing ones, confirming each step for accuracy.

`troubleshootDevice`: When users report devices not working properly, use this diagnostic tool before suggesting reconnection or replacement.

`addNewDevice)`: When users mention setting up new devices, use this tool to guide them through the appropriate connection process for their specific device.

```

--------------------------------

### GET /v1/convai/conversation/get-signed-url

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/get-signed-url

Retrieves a signed URL to start a conversation with an agent, particularly useful for agents that require authorization.

```APIDOC
## GET /v1/convai/conversation/get-signed-url

### Description
Get a signed url to start a conversation with an agent with an agent that requires authorization.

### Method
GET

### Endpoint
/v1/convai/conversation/get-signed-url

### Parameters
#### Query Parameters
- **agent_id** (string) - Required - The id of the agent you're taking the action on.
- **include_conversation_id** (boolean) - Optional - Whether to include a conversation_id with the response. If included, the conversation_signature cannot be used again.

#### Header Parameters
- **xi-api-key** (string) - Required - Your ElevenLabs API key.

### Response
#### Success Response (200)
- **signed_url** (string) - The signed URL to start the conversation.

#### Response Example
```json
{
  "signed_url": "string"
}
```
```

--------------------------------

### Create Agent with Python SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents/create

Provides a Python example using the ElevenLabs library to create an agent. It initializes the client with the base URL and calls the agent creation function.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.agents.create()

```

--------------------------------

### GET Get default voice settings

Source: https://elevenlabs.io/docs/agents-platform/api-reference/workspace/secrets/list_explorer=true

Retrieves the default settings for voices. These settings can be used as a starting point for customizing voice parameters.

```APIDOC
## GET Get default voice settings

### Description
Retrieves the default settings for voices.

### Method
GET

### Endpoint
/voices/settings/default

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **stability** (float) - Default stability setting.
- **similarity_boost** (float) - Default similarity boost setting.

#### Response Example
{
  "stability": 0.75,
  "similarity_boost": 0.5
}

```

--------------------------------

### Agent Personality Examples in MDX

Source: https://elevenlabs.io/docs/agents-platform/best-practices/prompting-guide

These examples demonstrate how to define an agent's personality using Markdown with MDX syntax. They cover creating both expressive and task-focused agent personas, specifying identity, traits, role, and backstory.

```mdx
# Personality

You are Joe, a nurturing virtual wellness coach.
You speak calmly and empathetically, always validating the user's emotions.
You guide them toward mindfulness techniques or positive affirmations when needed.
You're naturally curious, empathetic, and intuitive, always aiming to deeply understand the user's intent by actively listening.
You thoughtfully refer back to details they've previously shared.
```

```mdx
# Personality

You are Ava, a customer support agent for a telecom company.
You are friendly, solution-oriented, and efficient.
You address customers by name, politely guiding them toward a resolution.
```

--------------------------------

### Get MCP Server Information (Python)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/get

This Python example demonstrates retrieving MCP server information using the ElevenLabs Python SDK. It initializes the client with the base URL and then calls the `get` method for the specified `mcp_server_id`. This SDK simplifies API interactions.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.mcp_servers.get(
    mcp_server_id="mcp_server_id"
)


```

--------------------------------

### Get Phone Number Details (Python)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/phone-numbers/get

Provides a Python example using the ElevenLabs SDK to fetch phone number details. It initializes the ElevenLabs client and calls the get method for conversational AI phone numbers.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.phone_numbers.get(
    phone_number_id="phone_number_id"
)


```

--------------------------------

### Get Conversation Token (PHP)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/get-webrtc-token

This PHP example uses the Guzzle HTTP client to retrieve a conversation token from the ElevenLabs API. It sends a GET request with the agent ID and API key. The response body is then echoed.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=agent_id', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();

```

--------------------------------

### Get Conversation Audio using C# SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/get-audio

This C# example demonstrates fetching conversation audio using the RestSharp library. It makes a GET request to the Eleven Labs API, adding the required API key to the request headers.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/conversations/conversation_id/audio");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

--------------------------------

### Fetch Conversations via HTTP GET (Ruby)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/list

Illustrates how to retrieve conversations using Ruby's `net/http` library. This example sets up an HTTP client, configures SSL, adds the necessary API key header, and prints the response body.

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/conversations")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

--------------------------------

### Get Phone Number Details (Ruby)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/phone-numbers/get

Illustrates how to retrieve phone number information using Ruby's Net::HTTP library. This example makes a GET request to the ElevenLabs API, authenticating with the 'xi-api-key'.

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/phone-numbers/phone_number_id")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

--------------------------------

### Start Conversation with Private Agent using Token

Source: https://elevenlabs.io/docs/agents-platform/libraries/swift

Demonstrates how to start a conversation with a private agent by providing a conversation token obtained from a backend service.

```swift
// Get token from your backend (never store API keys in your app)
let token = try await fetchConversationToken()
let conversation = try await ElevenLabs.startConversation(
    auth: .conversationToken(token),
    config: ConversationConfig()
)
```

--------------------------------

### Get Phone Number Details (TypeScript)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/phone-numbers/get

Shows how to retrieve phone number information using the ElevenLabs JavaScript SDK. This example utilizes the ElevenLabsClient to call the get method for phone numbers.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.phoneNumbers.get("phone_number_id");
}
main();


```

--------------------------------

### Make GET Request to Workspace API Endpoint (Swift)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/list

Demonstrates making a GET request to the ElevenLabs workspace API using Swift's Foundation framework. It covers setting up the URL request, headers, and handling the response. This example uses NSMutableURLRequest and URLSession.

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/batch-calling/workspace")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

--------------------------------

### Get MCP Server Information (TypeScript)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/get

This TypeScript example uses the `@elevenlabs/elevenlabs-js` SDK to fetch MCP server data. It initializes the client with the environment URL and then calls the `get` method for a specific MCP server ID. This is a high-level abstraction over direct API calls.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.mcpServers.get("mcp_server_id");
}
main();

```

--------------------------------

### Create MCP Server with PHP (Guzzle)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/create

This PHP example uses the Guzzle HTTP client to create an MCP server. It shows how to instantiate the client, make a POST request with appropriate headers and JSON body, and retrieve the response. You need to have Guzzle installed via Composer.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/convai/mcp-servers', [
  'body' => '{\n  \"config\": {\n    \"url\": \"string\",\n    \"name\": \"string\"\n  }\n}',
  'headers' => [
    'Content-Type' => 'application/json',
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();

```

--------------------------------

### POST /administration/studio/projects/create

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/list_explorer=true

Creates a new Studio project.

```APIDOC
## POST /administration/studio/projects/create

### Description
Creates a new Studio project.

### Method
POST

### Endpoint
/administration/studio/projects/create

### Parameters
#### Request Body
- **name** (string) - Required - The name of the new project.
```

--------------------------------

### Get Dependent Agents Response Example

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-agents_explorer=true

This JSON object represents a successful response from the 'Get Dependent Agents' API endpoint. It contains an array of agent objects, a boolean indicating if there are more agents to fetch, and a cursor for subsequent requests.

```json
{
  "agents": [
    {
      "type": "unknown"
    }
  ],
  "has_more": true,
  "next_cursor": "string"
}
```

--------------------------------

### Get RAG Index Overview with Eleven Labs API (PHP)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/rag-index-overview

Provides a PHP example using GuzzleHttp to make a GET request to the Eleven Labs API for RAG index overview. It shows how to include the API key in the request headers and echo the response body.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/knowledge-base/rag-index', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();

```

--------------------------------

### Use ElevenLabs Python SDK to Get Tool

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/get

Demonstrates using the ElevenLabs Python SDK to fetch tool details. This approach utilizes the SDK's client to interact with the API, abstracting away the underlying HTTP communication. Ensure the `elevenlabs` package is installed.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.tools.get(
    tool_id="tool_id"
)

```

--------------------------------

### Get Conversation

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/get_explorer=true

Retrieves information about a specific conversation using its ID. This example uses cURL and requires an API key in the headers.

```curl
curl https://api.elevenlabs.io/v1/convai/conversations/:conversation_id \
  -H "xi-api-key: YOUR_API_KEY"
```

--------------------------------

### Get MCP Server Information (Java)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/get

This Java example uses the Unirest library to make a GET request to the ElevenLabs API for MCP server information. It shows how to set the `xi-api-key` header and retrieve the response as a string. Ensure you have the Unirest library added to your project dependencies.

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

--------------------------------

### POST Create Studio Project

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/create_explorer=true

Creates a Studio Project.

```APIDOC
## POST Create Studio Project

### Description
Creates a Studio Project.

### Method
POST

### Endpoint
/create-studio-project

### Parameters
None

### Request Example
{}

### Response
#### Success Response (200)
- **project_id** (string) - The ID of the created project.

#### Response Example
{
  "project_id": "project123"
}

```

--------------------------------

### Get MCP Server Information (C#)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/get

This C# example uses the RestSharp library to perform a GET request to the ElevenLabs API for MCP server details. It shows how to add the `xi-api-key` header and execute the request. Ensure RestSharp is added as a NuGet package.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

--------------------------------

### List Agents using ElevenLabs API (Java)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents/list

Provides a concise example of listing agents via the ElevenLabs API using the Unirest library in Java. It demonstrates making a GET request and adding the required API key as a header. Ensure Unirest is included as a dependency.

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/agents")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

--------------------------------

### Test Agent API Call with Swift

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/get

This Swift example demonstrates how to make a GET request to the ElevenLabs API for agent testing using URLSession. It covers setting up the URL request, headers, and handling the response.

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/agent-testing/test_id")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

--------------------------------

### Get RAG Index Overview with Eleven Labs API (Python)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/rag-index-overview

Shows how to use the Eleven Labs Python SDK to fetch the RAG index overview. This example initializes the ElevenLabs client and calls the specific method for retrieving index information.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.rag_index_overview()

```

--------------------------------

### Make GET Request to Workspace API Endpoint (Ruby)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/list

Shows how to perform a GET request to the ElevenLabs workspace API using Ruby's Net::HTTP library. The example includes setting the API key and printing the response body. It requires the 'uri' and 'net/http' gems.

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/batch-calling/workspace")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

--------------------------------

### Fetch MCP Servers - Go SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/list

Demonstrates how to make a GET request to the MCP servers endpoint using Go's standard net/http package. It includes setting the API key in the headers and reading the response body.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/mcp-servers"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("xi-api-key", "xi-api-key")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

--------------------------------

### Test Agent API Call with TypeScript (ElevenLabs Client)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/get

Shows how to use the official ElevenLabs TypeScript client to test an agent. This example initializes the client and calls the `get` method for conversational AI tests.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.tests.get("test_id");
}
main();

```

--------------------------------

### List Agents using ElevenLabs API (C#)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents/list

Demonstrates fetching agents from the ElevenLabs API using the RestSharp library in C#. The example shows how to create a `RestClient`, set up a `GET` request, add the `xi-api-key` header, and execute the request.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/agents");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

--------------------------------

### Get Document Content using ElevenLabs Client (Python)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-content

Shows how to get document content from the Eleven Labs API using the official Python SDK. This example simplifies the process by using the client's method for accessing knowledge base documents.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.knowledge_base.documents.get_content(
    documentation_id="documentation_id"
)
```

--------------------------------

### Create MCP Server with Python (ElevenLabs SDK)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/create

This Python code snippet demonstrates creating an MCP server using the ElevenLabs Python SDK. It initializes the client with the base URL and then calls the `conversational_ai.mcp_servers.create` method, passing the server configuration as a dictionary. This SDK simplifies API interactions.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.mcp_servers.create(
    config={
        "url": "string",
        "name": "string"
    }
)


```

--------------------------------

### Create ElevenLabs Agent with Voice and Knowledge Base (TypeScript)

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/upstash-redis

Creates an ElevenLabs agent for a user based on their provided agent description. It configures the agent with the newly created voice design and attaches the retrieved knowledge base documents to its prompt configuration.

```typescript
// ...

// Handle agent creation
const agent = await elevenlabs.conversationalAi.agents.create({
  name: `Agent for ${conversationId}`,
  conversationConfig: {
    tts: { voiceId: voice.voiceId },
    agent: {
      prompt: {
        prompt:
          analysis.data_collection_results.agent_description?.value ??
          'You are a helpful assistant.',
        knowledgeBase: redisRes.knowledgeBase,
      },
      firstMessage: 'Hello, how can I help you today?',
    },
  },
});
console.log('Agent created', { agent: agent.agentId });

// ...
```

--------------------------------

### Fetch Conversations via HTTP GET (Swift)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/list

Shows how to fetch conversations using Swift's `URLSession`. This example constructs an `NSMutableURLRequest`, sets the HTTP method to GET, adds the 'xi-api-key' header, and initiates a data task to perform the request.

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/conversations")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

--------------------------------

### Get Agents from Knowledge Base (TypeScript)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-agents

This TypeScript example uses the ElevenLabs JS SDK to retrieve agents from a knowledge base documentation. It initializes the client and calls the `getAgents` method.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.knowledgeBase.documents.getAgents("documentation_id", {});
}
main();

```

--------------------------------

### Making GET Request to Eleven Labs Agent Testing API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/list

Demonstrates how to make a GET request to the Eleven Labs API for agent testing. This typically involves setting up an HTTP client, constructing the request with the necessary API key in the headers, and processing the response. It's commonly used for initial setup or testing of agent functionalities.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/agent-testing"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("xi-api-key", "xi-api-key")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/agent-testing")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/agent-testing")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/agent-testing', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();

```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/agent-testing");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/agent-testing")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

--------------------------------

### Administration Studio API - List Studio Projects

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-file_explorer=true

Lists all Studio Projects.

```APIDOC
## GET List Studio Projects

### Description
Lists all Studio Projects.

### Method
GET

### Endpoint
/studio-projects

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **projects** (array) - An array of studio projects.

#### Response Example
{
  "projects": [
    {
      "id": "project1",
      "name": "Project 1"
    }
  ]
}

```

--------------------------------

### Get Document Content via HTTP Request (Java)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-content

Provides a Java example using the Unirest library to make a GET request to the Eleven Labs API for document content. It demonstrates setting the API key header and retrieving the response as a string.

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/content")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

--------------------------------

### List Conversational AI Tools using ElevenLabs SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/list

Demonstrates how to fetch a list of available conversational AI tools from the ElevenLabs API. This typically involves making an HTTP GET request to the specified endpoint with an API key. Ensure you have the necessary libraries installed for each language.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/tools"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("xi-api-key", "xi-api-key")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/tools")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/tools")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/tools', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
?>
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/tools");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/tools")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.tools.list();
}
main();

```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.tools.list()

```

--------------------------------

### Get Document Chunk from Knowledge Base (C#)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-chunk

Example of fetching a document chunk from the ElevenLabs knowledge base using C# with the RestSharp library. The code initializes a `RestClient`, creates a GET request, adds the `xi-api-key` header, and executes the request. The response is then processed.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/chunk/chunk_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

--------------------------------

### POST /studio-projects

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/run-tests_explorer=true

Creates a Studio Project.

```APIDOC
## POST /studio-projects

### Description
Creates a Studio Project.

### Method
POST

### Endpoint
/studio-projects

### Parameters
#### Request Body
- **name** (string) - Required - The name of the new Studio Project.

### Request Example
{
  "name": "New Studio Project"
}

### Response
#### Success Response (201)
- **project_id** (string) - The ID of the newly created Studio Project.

#### Response Example
{
  "project_id": "project_456"
}

```

--------------------------------

### Setup: Navigate to Project Directory

Source: https://elevenlabs.io/docs/agents-platform/guides/quickstarts

This command changes the current directory to the newly created Next.js project folder, 'my-conversational-agent', allowing you to access and modify project files.

```bash
cd my-conversational-agent
```

--------------------------------

### Fetch Conversations via HTTP GET (C#/RestSharp)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/list

Provides an example of retrieving conversations using the RestSharp library in C#. It configures the client, creates a GET request, adds the API key header, executes the request, and captures the response.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/conversations");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

--------------------------------

### Generate Signed URL with ElevenLabs Client (Next.js API Route)

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/upstash-redis

This Next.js API route (`/api/signed-url/route.ts`) utilizes the ElevenLabs client to generate a signed URL for initiating a conversation with an agent. It retrieves the agent ID from environment variables and handles potential errors during the URL generation process. This route is designed to be called from the client-side to start a conversation session securely.

```tsx
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const agentId = process.env.ELEVENLABS_AGENT_ID;
  if (!agentId) {
    throw Error('ELEVENLABS_AGENT_ID is not set');
  }
  try {
    const elevenlabs = new ElevenLabsClient();
    const response = await elevenlabs.conversationalAi.conversations.getSignedUrl({
      agentId,
    });
    return NextResponse.json({ signedUrl: response.signedUrl });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to get signed URL' }, { status: 500 });
  }
}
```

--------------------------------

### Administration Studio API - Create Studio Project

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-file_explorer=true

Creates a new Studio Project.

```APIDOC
## POST Create Studio Project

### Description
Creates a new Studio Project.

### Method
POST

### Endpoint
/studio-projects

### Parameters
#### Request Body
- **name** (string) - Required - The name of the studio project.

### Request Example
{
  "name": "My New Project"
}

### Response
#### Success Response (201)
- **id** (string) - The ID of the created studio project.

#### Response Example
{
  "id": "project123"
}

```

--------------------------------

### Reflective Conversation Environment for ElevenLabs Agent

Source: https://elevenlabs.io/docs/agents-platform/best-practices/prompting-guide

This example defines a quiet, private setting for a voice call, intended for general guidance or personal matter discussions. It emphasizes an environment conducive to thoughtful exchange with minimal distractions.

```mdx
# Environment

The conversation is taking place over a voice call in a private, quiet setting.
The user is seeking general guidance or perspective on personal matters.
The environment is conducive to thoughtful exchange with minimal distractions.
```

--------------------------------

### POST /administration/studio/podcasts

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/list_explorer=true

Creates a podcast.

```APIDOC
## POST /administration/studio/podcasts

### Description
Creates a podcast.

### Method
POST

### Endpoint
/administration/studio/podcasts

### Parameters
#### Request Body
- **title** (string) - Required - The title of the podcast.
- **description** (string) - Optional - The description of the podcast.
- **chapters** (array) - Required - An array of chapter IDs for the podcast.
```

--------------------------------

### Get Document Content via HTTP Request (C#)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-content

A C# example using the RestSharp library to fetch document content from the Eleven Labs API. It shows how to configure the RestClient, create a GET request, add the API key header, and execute the request.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/content");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

--------------------------------

### Fetch Conversations via HTTP GET (Java/Unirest)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/list

Shows how to fetch conversations using the Unirest library in Java. This concise example chains method calls to set the URL, add the API key header, and execute the GET request, returning the response as a String.

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/conversations")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

--------------------------------

### Fetch Knowledge Base Documentation (Go)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-document

This Go code snippet demonstrates how to make a GET request to the ElevenLabs API to retrieve knowledge base documentation. It includes setting the API key and handling the response.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("xi-api-key", "xi-api-key")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

--------------------------------

### Get Document Chunk from Knowledge Base (Ruby)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-chunk

Retrieves a specific document chunk from the ElevenLabs knowledge base using Ruby. This example demonstrates making an HTTP GET request with the necessary `xi-api-key` header. It utilizes Ruby's built-in `net/http` and `uri` libraries.

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/chunk/chunk_id")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

--------------------------------

### POST Create Podcast

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/create_explorer=true

Creates a Podcast.

```APIDOC
## POST Create Podcast

### Description
Creates a Podcast.

### Method
POST

### Endpoint
/create-podcast

### Parameters
None

### Request Example
{}

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Podcast created"
}

```

--------------------------------

### Get Phone Number Details (PHP)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/phone-numbers/get

Provides a PHP example using the Guzzle HTTP client to retrieve phone number details. The code sends a GET request to the ElevenLabs API, including the necessary 'xi-api-key' header.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/phone-numbers/phone_number_id', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();

```

--------------------------------

### Get Document Chunk from Knowledge Base (Swift)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-chunk

This Swift code illustrates how to retrieve a document chunk from the ElevenLabs knowledge base. It uses `URLSession` to make an HTTP GET request, setting the `xi-api-key` in the headers. The example includes basic error handling and prints the HTTP response.

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/chunk/chunk_id")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

--------------------------------

### Start WebSocket Conversation with Signed URL (Node.js & Client)

Source: https://elevenlabs.io/docs/agents-platform/libraries/react

Provides code examples for both Node.js server and client-side implementation to start a WebSocket conversation. The server generates a signed URL using the ElevenLabs API, which the client then uses to establish the connection.

```javascript
// Node.js server

app.get("/signed-url", yourAuthMiddleware, async (req, res) => {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${process.env.AGENT_ID}`,
    {
      headers: {
        // Requesting a signed url requires your ElevenLabs API key
        // Do NOT expose your API key to the client!
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
      },
    }
  );

  if (!response.ok) {
    return res.status(500).send("Failed to get signed URL");
  }

  const body = await response.json();
  res.send(body.signed_url);
});
```

```javascript
// Client

const response = await fetch("/signed-url", yourAuthHeaders);
const signedUrl = await response.text();

const conversation = await Conversation.startSession({
  signedUrl,
  connectionType: "websocket",
});
```

--------------------------------

### Administration Studio API - List Chapters

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-file_explorer=true

Lists chapters for a studio project.

```APIDOC
## GET List Chapters

### Description
Lists chapters for a studio project.

### Method
GET

### Endpoint
/studio-projects/{project_id}/chapters

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the studio project.

### Request Example
N/A

### Response
#### Success Response (200)
- **chapters** (array) - An array of chapters.

#### Response Example
{
  "chapters": [
    {
      "id": "chapter1",
      "title": "Chapter 1"
    }
  ]
}

```

--------------------------------

### Get Document Chunk from Knowledge Base (PHP)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-chunk

This PHP code snippet uses the Guzzle HTTP client to retrieve a document chunk from the ElevenLabs knowledge base. It constructs a GET request, adds the `xi-api-key` to the headers, and then prints the response body. Ensure Guzzle is installed via Composer.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/chunk/chunk_id', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();

```

--------------------------------

### GET Get Studio Project

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/create_explorer=true

Retrieves a Studio Project.

```APIDOC
## GET Get Studio Project

### Description
Retrieves a Studio Project.

### Method
GET

### Endpoint
/get-studio-project

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **project** (object) - Studio Project details.

#### Response Example
{
  "id": "project1",
  "name": "Project 1"
}

```

--------------------------------

### POST Create Studio Project

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/list_explorer=true

Creates a new Studio Project.  This initializes a new creative workspace within the Studio environment.

```APIDOC
## POST Create Studio Project

### Description
Creates a new Studio Project.

### Method
POST

### Endpoint
/studio/projects

### Request Body
- **name** (string) - Required - The name of the new project.

### Request Example
{
  "name": "New Studio Project"
}

### Response
#### Success Response (201)
- **project_id** (string) - The ID of the newly created project.

#### Response Example
{
  "project_id": "new_project_id"
}

```

--------------------------------

### Manual URL Construction Examples

Source: https://elevenlabs.io/docs/agents-platform/customization/personalization/dynamic-variables

Provides manual steps for constructing ElevenLabs talk-to page URLs using both base64-encoded JSON and individual `var_` parameters. This is useful for understanding the URL structure or for environments where scripting is less convenient.

```text
# Base64-encoded method
1. Create JSON: {"user_name": "John", "account_type": "premium"}
2. Encode to base64: eyJ1c2VyX25hbWUiOiJKb2huIiwiYWNjb3VudF90eXBlIjoicHJlbWl1bSJ9
3. Add to URL: https://elevenlabs.io/app/talk-to?agent_id=your_agent_id&vars=eyJ1c2VyX25hbWUiOiJKb2huIiwiYWNjb3VudF90eXBlIjoicHJlbWl1bSJ9

# Individual parameters method
1. Add each variable with var_ prefix
2. URL encode values if needed
3. Final URL: https://elevenlabs.io/app/talk-to?agent_id=your_agent_id&var_user_name=John&var_account_type=premium
```

--------------------------------

### PVC Voice Sample Management

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/summaries_explorer=true

Endpoints for managing PVC voice samples, including retrieving waveforms, checking separation status, starting separation, getting separated audio, and handling manual verification.

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/pvc/waveform

### Description
Get PVC voice sample waveform.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/pvc/waveform

## GET /websites/elevenlabs_io_agents-platform/pvc/separation/status

### Description
Get PVC speaker separation status.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/pvc/separation/status

## POST /websites/elevenlabs_io_agents-platform/pvc/separation

### Description
Start speaker separation.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/pvc/separation

## GET /websites/elevenlabs_io_agents-platform/pvc/separated/audio

### Description
Get separated speaker audio.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/pvc/separated/audio

## POST /websites/elevenlabs_io_agents-platform/pvc/verification/manual

### Description
Request PVC manual verification.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/pvc/verification/manual

## GET /websites/elevenlabs_io_agents-platform/pvc/verification/captcha

### Description
Get PVC verification captcha.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/pvc/verification/captcha

## POST /websites/elevenlabs_io_agents-platform/pvc/verification/captcha

### Description
Verify PVC verification captcha.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/pvc/verification/captcha
```

--------------------------------

### Initialize ElevenLabs Client (TypeScript)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/create

This TypeScript code snippet shows the initialization of the ElevenLabsClient from the '@elevenlabs/elevenlabs-js' package. It serves as a starting point for making API calls, although the subsequent API call logic is not shown in this snippet. Ensure the package is installed via npm or yarn.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {

```

--------------------------------

### Retrieve Batch Call Details - Go SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/get

This Go example shows how to make a GET request to the ElevenLabs API to retrieve details about a specific batch call. It includes setting the API key in the headers and reading the response body. Ensure you have the necessary HTTP client libraries imported.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/batch-calling/batch_id"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("xi-api-key", "xi-api-key")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

--------------------------------

### Create Knowledge Base Document from File (TypeScript)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-file

This TypeScript example utilizes the official Elevenlabs client library to create a document in the knowledge base from a file. It abstracts away the underlying HTTP requests, providing a cleaner interface. Ensure the `@elevenlabs/elevenlabs-js` package is installed.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.knowledgeBase.documents.createFromFile({});
}
main();

```

--------------------------------

### Install ElevenLabs JavaScript SDK

Source: https://elevenlabs.io/docs/agents-platform/libraries/java-script

Instructions for installing the ElevenLabs client package using npm, yarn, or pnpm. This package provides the core functionality for interacting with the Agents Platform.

```shell
npm install @elevenlabs/client
# or
yarn add @elevenlabs/client
# or
pnpm install @elevenlabs/client
```

--------------------------------

### Create Project Directory Structure

Source: https://elevenlabs.io/docs/agents-platform/guides/quickstarts/java-script

Defines the basic file structure for the ElevenLabs conversational AI project using Vite. This includes the main HTML file, JavaScript entry point, and npm-related files.

```shell
elevenlabs-conversational-ai/
├── index.html
├── script.js
├── package-lock.json
├── package.json
└── node_modules
```

--------------------------------

### Get RAG Index Overview with Eleven Labs API (Java)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/rag-index-overview

Illustrates how to call the Eleven Labs API for RAG index overview using Unirest in Java. This example demonstrates setting the API key header and retrieving the response as a string.

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/knowledge-base/rag-index")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

--------------------------------

### List Conversational AI Batch Calls (Python)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/list

This Python example demonstrates how to use the `elevenlabs` library to list conversational AI batch calls. It initializes the client with the base URL and then calls the `list` method. Ensure the `elevenlabs` Python package is installed.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.batch_calls.list()

```

--------------------------------

### Get RAG Index Overview with Eleven Labs API (Swift)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/rag-index-overview

Shows how to retrieve the RAG index overview from Eleven Labs API using Swift's URLSession. The example includes setting up the URL request with the API key header and handling the response.

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/knowledge-base/rag-index")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

--------------------------------

### List Knowledge Base Items using ElevenLabs TypeScript SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/list

This TypeScript example uses the official ElevenLabs JavaScript SDK to list knowledge base items. It initializes the client with the environment URL and calls the appropriate method. This approach abstracts away direct HTTP request management.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.knowledgeBase.list({});
}
main();

```

--------------------------------

### Administration Studio API - List Studio Project Snapshots

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-file_explorer=true

Lists snapshots for a Studio Project.

```APIDOC
## GET List Studio Project Snapshots

### Description
Lists snapshots for a Studio Project.

### Method
GET

### Endpoint
/studio-projects/{project_id}/snapshots

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the studio project.

### Request Example
N/A

### Response
#### Success Response (200)
- **snapshots** (array) - An array of snapshots.

#### Response Example
{
  "snapshots": [
    {
      "id": "snapshot1",
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ]
}

```

--------------------------------

### Create Agent with System Tools (Python)

Source: https://elevenlabs.io/docs/agents-platform/customization/tools/system-tools

Example of how to create an agent configuration with system tools like `end_call` and `language_detection` using the Python SDK.

```APIDOC
## Create Agent with System Tools (Python)

### Description
Initializes the ElevenLabs client and creates an agent configuration incorporating system tools for call management and language detection.

### Method
POST

### Endpoint
/v1/conversational_ai/agents

### Parameters
#### Request Body
- **api_key** (string, required) - Your ElevenLabs API key
- **conversation_config** (object, required) - Configuration for the conversational agent
  - **agent** (object, required)
    - **prompt** (object, required)
      - **tools** (array, required) - List of system tools to be used by the agent
        - **type** (string) - The type of the tool, should be 'system'
        - **name** (string) - The name of the system tool (e.g., 'end_call', 'language_detection')
        - **description** (string, optional) - Custom description for when the tool should be triggered

### Request Example
```python
from elevenlabs import (
    ConversationalConfig,
    ElevenLabs,
    AgentConfig,
    PromptAgent,
    PromptAgentInputToolsItem_System,
)

# Initialize the client
elevenlabs = ElevenLabs(api_key="YOUR_API_KEY")

# Create system tools
end_call_tool = PromptAgentInputToolsItem_System(
    name="end_call",
    description=""  # Optional: Customize when the tool should be triggered
)

language_detection_tool = PromptAgentInputToolsItem_System(
    name="language_detection",
    description=""  # Optional: Customize when the tool should be triggered
)

# Create the agent configuration with both tools
conversation_config = ConversationalConfig(
    agent=AgentConfig(
        prompt=PromptAgent(
            tools=[end_call_tool, language_detection_tool]
        )
    )
)

# Create the agent
response = elevenlabs.conversational_ai.agents.create(
    conversation_config=conversation_config
)
```

### Response
#### Success Response (201)
Returns the configuration of the created agent.
```

--------------------------------

### Import ElevenLabs SDK

Source: https://elevenlabs.io/docs/agents-platform/libraries/swift

Demonstrates how to import the ElevenLabs SDK into your Swift project after installation.

```swift
import ElevenLabs
```

--------------------------------

### Administration Studio API - Convert Studio Project

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-file_explorer=true

Converts a Studio Project.

```APIDOC
## POST Convert Studio Project

### Description
Converts a Studio Project.

### Method
POST

### Endpoint
/studio-projects/{project_id}/convert

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the studio project.

### Request Example
N/A

### Response
#### Success Response (202)
- Conversion initiated. No content returned.

```

--------------------------------

### Fetch Secrets via SDK - Python

Source: https://elevenlabs.io/docs/agents-platform/api-reference/workspace/secrets/list

This Python code example uses the `elevenlabs` library to fetch secrets. It creates an `ElevenLabs` client instance, specifying the `base_url`, and then calls the `list()` method from the `conversational_ai.secrets` module. Ensure the `elevenlabs` library is installed.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.secrets.list()
```

--------------------------------

### Create Agent with System Tools (JavaScript)

Source: https://elevenlabs.io/docs/agents-platform/customization/tools/system-tools

Example of how to create an agent configuration with system tools like `end_call` and `language_detection` using the JavaScript SDK.

```APIDOC
## Create Agent with System Tools (JavaScript)

### Description
Initializes the ElevenLabs client and creates an agent configuration incorporating system tools for call management and language detection.

### Method
POST

### Endpoint
/v1/conversational_ai/agents

### Parameters
#### Request Body
- **apiKey** (string, required) - Your ElevenLabs API key
- **conversationConfig** (object, required) - Configuration for the conversational agent
  - **agent** (object, required)
    - **prompt** (object, required)
      - **tools** (array, required) - List of system tools to be used by the agent
        - **type** (string) - The type of the tool, should be 'system'
        - **name** (string) - The name of the system tool (e.g., 'end_call', 'language_detection')
        - **description** (string, optional) - Custom description for when the tool should be triggered

### Request Example
```javascript
import { ElevenLabs } from '@elevenlabs/elevenlabs-js';

// Initialize the client
const elevenlabs = new ElevenLabs({
    apiKey: 'YOUR_API_KEY',
});

// Create the agent with system tools
await elevenlabs.conversationalAi.agents.create({
    conversationConfig: {
      agent: {
        prompt: {
          tools: [
            {
              type: 'system',
              name: 'end_call',
              description: '',
            },
            {
              type: 'system',
              name: 'language_detection',
              description: '',
            },
          ],
        },
      },
    },
});
```

### Response
#### Success Response (201)
Returns the configuration of the created agent.
```

--------------------------------

### Configure Play Keypad Touch Tone Tool (Python)

Source: https://elevenlabs.io/docs/agents-platform/customization/tools/system-tools/play-keypad-touch-tone

This Python code snippet demonstrates how to initialize the ElevenLabs client and configure the play_keypad_touch_tone system tool for an agent. It requires the elevenlabs library and an API key. The tool is added to the agent's prompt configuration.

```python
from elevenlabs import (
    ConversationalConfig,
    ElevenLabs,
    AgentConfig,
    PromptAgent,
    PromptAgentInputToolsItem_System,
    SystemToolConfigInputParams_PlayKeypadTouchTone,
)

# Initialize the client
elevenlabs = ElevenLabs(api_key="YOUR_API_KEY")

# Create the keypad touch tone tool configuration
keypad_tool = PromptAgentInputToolsItem_System(
    type="system",
    name="play_keypad_touch_tone",
    description="Play DTMF tones to interact with automated phone systems.", # Optional custom description
    params=SystemToolConfigInputParams_PlayKeypadTouchTone(
        system_tool_type="play_keypad_touch_tone"
    )
)

# Create the agent configuration
conversation_config = ConversationalConfig(
    agent=AgentConfig(
        prompt=PromptAgent(
            prompt="You are a helpful assistant that can interact with phone systems.",
            first_message="Hi, I can help you navigate phone systems. How can I assist you today?",
            tools=[keypad_tool],
        )
    )
)

# Create the agent
response = elevenlabs.conversational_ai.agents.create(
    conversation_config=conversation_config
)
```

--------------------------------

### Create .env.local for ElevenLabs API Key and Agent ID

Source: https://elevenlabs.io/docs/agents-platform/guides/quickstarts/next-js

This example demonstrates how to set up environment variables in a `.env.local` file for your ElevenLabs API key and agent ID. It's crucial for securing sensitive credentials and should be added to `.gitignore`.

```yaml
ELEVENLABS_API_KEY=your-api-key-here
NEXT_PUBLIC_AGENT_ID=your-agent-id-here

```

--------------------------------

### Administration Studio API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/compute-rag-index_explorer=true

Comprehensive API for managing Studio Projects, including creation, updates, content management, chapters, and audio streaming.

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/list

### Description
List Studio Projects.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/list

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **projects** (array) - A list of Studio Projects.

#### Response Example
{
  "projects": [
    {"id": "proj_abc", "name": "My Project"}
  ]
}
```

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/administration/studio/project/update

### Description
Update a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/project/update

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **project_id** (string) - Required - The ID of the project to update.
- **name** (string) - Optional - The new name for the project.
- **description** (string) - Optional - The new description for the project.

### Request Example
{
  "project_id": "proj_abc",
  "name": "Updated Project Name"
}

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Studio Project updated successfully."
}
```

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/administration/studio/project/get

### Description
Get a specific Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/project/get

### Parameters
#### Path Parameters
None

#### Query Parameters
- **project_id** (string) - Required - The ID of the project.

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **project_details** (object) - Details of the Studio Project.

#### Response Example
{
  "project_details": {
    "id": "proj_abc",
    "name": "My Project",
    "description": "Project description."
  }
}
```

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/administration/studio/project/create

### Description
Create a new Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/project/create

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **name** (string) - Required - The name of the new project.
- **description** (string) - Optional - A description for the project.

### Request Example
{
  "name": "New Project",
  "description": "A brand new project."
}

### Response
#### Success Response (200)
- **project_id** (string) - The ID of the newly created project.
- **name** (string) - The name of the project.

#### Response Example
{
  "project_id": "proj_def",
  "name": "New Project"
}
```

```APIDOC
## DEL /websites/elevenlabs_io_agents-platform/administration/studio/project/delete

### Description
Delete a Studio Project.

### Method
DELETE

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/project/delete

### Parameters
#### Path Parameters
None

#### Query Parameters
- **project_id** (string) - Required - The ID of the project to delete.

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Studio Project deleted successfully."
}
```

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/administration/studio/project/convert

### Description
Convert a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/project/convert

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **project_id** (string) - Required - The ID of the project to convert.
- **target_format** (string) - Required - The desired output format (e.g., 'audio').

### Request Example
{
  "project_id": "proj_abc",
  "target_format": "audio"
}

### Response
#### Success Response (200)
- **conversion_id** (string) - The ID for the conversion job.

#### Response Example
{
  "conversion_id": "conv_xyz"
}
```

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/administration/studio/project/update/content

### Description
Update the content of a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/project/update/content

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **project_id** (string) - Required - The ID of the project.
- **content** (object) - Required - The new content for the project.

### Request Example
{
  "project_id": "proj_abc",
  "content": {
    "title": "My Updated Content",
    "sections": [...] 
  }
}

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Studio Project content updated successfully."
}
```

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/administration/studio/project/snapshots/list

### Description
List snapshots for a Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/project/snapshots/list

### Parameters
#### Path Parameters
None

#### Query Parameters
- **project_id** (string) - Required - The ID of the project.

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **snapshots** (array) - A list of project snapshots.

#### Response Example
{
  "snapshots": [
    {"id": "snap_1", "timestamp": "2023-10-27T11:00:00Z"}
  ]
}
```

```APIDOC
## STREAM /websites/elevenlabs_io_agents-platform/administration/studio/project/audio/stream

### Description
Stream audio from a Studio Project.

### Method
STREAM

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/project/audio/stream

### Parameters
#### Path Parameters
None

#### Query Parameters
- **project_id** (string) - Required - The ID of the project.
- **voice_id** (string) - Optional - The voice ID to use for streaming.

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **audio_stream** (stream) - The audio stream.

#### Response Example
(Audio stream data)
```

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/administration/studio/project/stream/archive/audio

### Description
Stream an archive with Studio Project audio.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/project/stream/archive/audio

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **project_id** (string) - Required - The ID of the project.
- **archive_format** (string) - Required - The format of the archive (e.g., 'zip').

### Request Example
{
  "project_id": "proj_abc",
  "archive_format": "zip"
}

### Response
#### Success Response (200)
- **archive_stream** (stream) - The audio archive stream.

#### Response Example
(Archive stream data)
```

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/administration/studio/chapters/list

### Description
List chapters for a Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters/list

### Parameters
#### Path Parameters
None

#### Query Parameters
- **project_id** (string) - Required - The ID of the project.

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200
```

--------------------------------

### Get Conversation Token API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/get-webrtc-token_explorer=true

Obtain a token for starting a conversation with an agent.

```APIDOC
## GET https://api.elevenlabs.io/v1/convai/conversation/token

### Description
Retrieves a token required to initiate or continue a conversation with a specified agent.

### Method
GET

### Endpoint
https://api.elevenlabs.io/v1/convai/conversation/token

### Headers
- **xi-api-key** (string) - Required - Your ElevenLabs API key.

### Query Parameters
- **agent_id** (string) - Required - The unique identifier of the agent to converse with.
- **participant_name** (string) - Optional - The name of the participant in the conversation.

### Request Example
```bash
curl -G https://api.elevenlabs.io/v1/convai/conversation/token \
     -H "xi-api-key: YOUR_API_KEY" \
     -d agent_id=agent_id_123 \
     -d participant_name=JohnDoe
```

### Response
#### Success Response (200)
- token (string) - The conversation token to be used for subsequent API calls.
- expires_at (integer) - Timestamp indicating when the token expires.

#### Response Example
```json
{
  "token": "conv_token_abcdef123456",
  "expires_at": 1678886400
}
```
```

--------------------------------

### Start Public Agent Conversation (JavaScript)

Source: https://elevenlabs.io/docs/agents-platform/libraries/java-script

Example of initiating a conversation with a public ElevenLabs agent. This method requires the agent ID and specifies the connection type (e.g., 'webrtc' or 'websocket').

```javascript
const conversation = await Conversation.startSession({
  agentId: '<your-agent-id>',
  connectionType: 'webrtc', // 'websocket' is also accepted
});
```

--------------------------------

### Make GET Request to Workspace API Endpoint (Java)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/list

This Java example utilizes the Unirest library to make a GET request to the ElevenLabs workspace API. It demonstrates setting the API key header and retrieving the response as a string. Ensure the Unirest library is included as a dependency.

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/batch-calling/workspace")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

--------------------------------

### POST Convert Studio Project

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/create_explorer=true

Converts a Studio Project.

```APIDOC
## POST Convert Studio Project

### Description
Converts a Studio Project.

### Method
POST

### Endpoint
/convert-studio-project

### Parameters
None

### Request Example
{}

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Project converted"
}

```

--------------------------------

### GET /v1/convai/mcp-servers/mcp_server_id

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/get_explorer=true

Example of retrieving MCP server details directly via its API endpoint.

```APIDOC
## GET https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id

### Description
Retrieves details for a specific MCP server using its ID.

### Method
GET

### Endpoint
https://api.elevenlabs.io/v1/convai/mcp-servers/{mcp_server_id}

### Parameters
#### Path Parameters
- **mcp_server_id** (string) - Required - The ID of the MCP server.

#### Headers
- **xi-api-key** (string) - Required - Your ElevenLabs API key.

### Request Example (cURL)
```bash
curl https://api.elevenlabs.io/v1/convai/mcp-servers/YOUR_MCP_SERVER_ID \
  -H "xi-api-key: YOUR_API_KEY"
```

### Response
#### Success Response (200)
- mcp_server_details (object) - An object containing the MCP server's details.

#### Response Example
```json
{
  "mcp_server_details": {
    "mcp_server_id": "mcp_server_abc123",
    "server_name": "mcp-server-prod-1",
    "region": "us-east-1",
    "status": "active",
    "configuration": {
      "max_concurrent_calls": 100
    }
  }
}
```
```

--------------------------------

### List Agents using ElevenLabs Client SDK (TypeScript)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents/list

Demonstrates how to list agents using the official `@elevenlabs/elevenlabs-js` client library in TypeScript. This example initializes the client with the API environment and calls the `agents.list()` method for conversational AI.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.agents.list({});
}
main();

```

--------------------------------

### List MCP Servers - TypeScript SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/list

Example of using the official ElevenLabs TypeScript SDK to list MCP servers. It initializes the client with the environment URL and calls the `list()` method for MCP servers.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.mcpServers.list();
}
main();

```

--------------------------------

### Initialize ElevenLabs Client

Source: https://elevenlabs.io/docs/agents-platform/libraries

Creates an instance of the ElevenLabs client using the provided API key. This client is used to interact with the ElevenLabs API.

```python
elevenlabs = ElevenLabs(api_key=api_key)
```

--------------------------------

### Test Agent API Call with Ruby

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/get

Shows how to perform a GET request to the ElevenLabs API for agent testing using Ruby's Net::HTTP library. This example highlights setting the API key and retrieving the response body.

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/agent-testing/test_id")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

--------------------------------

### Content Creator Guardrails (MDX)

Source: https://elevenlabs.io/docs/agents-platform/best-practices/prompting-guide

Outlines guardrails for a content creator agent, focusing on respecting intellectual property, refusing harmful content, confirming user intent, asking clarifying questions, and offering constructive alternatives when users are dissatisfied.

```mdx
# Guardrails

Generate only content that respects intellectual property rights; do not reproduce copyrighted materials or images verbatim.
Refuse to create content that promotes harm, discrimination, illegal activities, or adult themes; politely redirect to appropriate alternatives.
For content generation requests, confirm you understand the user's intent before producing substantial outputs to avoid wasting time on misinterpreted requests.
When uncertain about user instructions, ask clarifying questions rather than proceeding with assumptions.
Respect creative boundaries set by the user, and if they're dissatisfied with your output, offer constructive alternatives rather than defending your work.
```

--------------------------------

### Fetch Tool Information using Unirest (Java)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/get

Shows how to fetch tool information using the Unirest library in Java. Unirest simplifies HTTP requests by providing a fluent API for setting headers and executing requests. This example assumes Unirest is included as a dependency.

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/tools/tool_id")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

--------------------------------

### Create Agent with Python SDK

Source: https://context7.com/context7/elevenlabs_io_agents-platform/llms.txt

Demonstrates how to use the ElevenLabs Python SDK to initiate a voice conversation with a pre-created agent.

```APIDOC
## Python SDK - Conversation Initiation

### Description
This example shows how to use the ElevenLabs Python SDK to programmatically start a conversation session with an agent. It utilizes callbacks for handling agent responses and user transcripts, and a default audio interface for playback.

### Method
Python SDK Function Calls

### Endpoint
N/A (SDK handles underlying API calls)

### Parameters
#### Initialization Parameters (for `Conversation` class)
- **client** (ElevenLabs client object) - Required - An initialized ElevenLabs API client.
- **agent_id** (string) - Required - The ID of the agent to converse with.
- **requires_auth** (boolean) - Optional (defaults to True) - Whether authentication is required.
- **audio_interface** (object) - Optional (defaults to None) - An audio interface implementation (e.g., `DefaultAudioInterface`).
- **callback_agent_response** (function) - Optional - Callback function for agent's text responses.
- **callback_user_transcript** (function) - Optional - Callback function for transcribed user speech.
- **callback_agent_response_correction** (function) - Optional - Callback function for agent response corrections.

#### Session Start Parameters (for `start_session` method)
- **user_id** (string) - Required - A unique identifier for the user initiating the session.

### Request Example
```python
import os
from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface

# Initialize client
client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

# Create conversation with callbacks
conversation = Conversation(
    client,
    agent_id="agent_abc123",
    requires_auth=True,
    audio_interface=DefaultAudioInterface(),
    callback_agent_response=lambda response: print(f"Agent: {response}"),
    callback_user_transcript=lambda transcript: print(f"User: {transcript}"),
    callback_agent_response_correction=lambda orig, corr: print(f"Correction: {orig} -> {corr}")
)

# Start conversation with user tracking
conversation.start_session(user_id="customer_12345")

# Wait for conversation to end
conversation_id = conversation.wait_for_session_end()
print(f"Conversation ID: {conversation_id}")
```

### Response
- The function `wait_for_session_end()` returns the `conversation_id` upon completion.
- Output is printed to the console via the defined callbacks.
```

--------------------------------

### Install ElevenLabs Python SDK

Source: https://elevenlabs.io/docs/agents-platform/libraries/python

Installs the elevenlabs Python package. Use the `[pyaudio]` extra to include default audio input/output functionality. Additional system dependencies may be required for PyAudio on certain operating systems.

```shell
pip install elevenlabs
# or
poetry add elevenlabs
```

```shell
pip install "elevenlabs[pyaudio]"
# or
poetry add "elevenlabs[pyaudio]"
```

--------------------------------

### Get Conversation Details Response (JSON)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/get_explorer=true

Example JSON response for a successful request to get conversation details. It contains the agent ID, conversation ID, status, transcript, metadata, and flags for audio presence.

```json
{
  "agent_id": "123",
  "conversation_id": "123",
  "status": "processing",
  "transcript": [
    {
      "role": "user",
      "time_in_call_secs": 10,
      "message": "Hello, how are you?"
    }
  ],
  "metadata": {
    "start_time_unix_secs": 1714423232,
    "call_duration_secs": 10
  },
  "has_audio": true,
  "has_user_audio": true,
  "has_response_audio": true
}
```

--------------------------------

### List MCP Servers - Python SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/list

Demonstrates listing MCP servers using the ElevenLabs Python SDK. It initializes the ElevenLabs client with the base URL and then calls the `list()` method for MCP servers within the conversational AI module.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.mcp_servers.list()
```

--------------------------------

### Get Phone Numbers using Eleven Labs SDK (PHP)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/phone-numbers/list

Illustrates how to obtain phone numbers using the Eleven Labs API in PHP with the Guzzle HTTP client. This example performs a GET request to the API, setting the 'xi-api-key' in the request headers. The response body is then echoed.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/phone-numbers', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
?>
```

--------------------------------

### Install React SDK using npm, yarn, or pnpm

Source: https://elevenlabs.io/docs/agents-platform/libraries/react

These commands show how to install the ElevenLabs React SDK package using different package managers. Ensure you have Node.js and a package manager (npm, yarn, or pnpm) installed.

```shell
npm install @elevenlabs/react
```

```shell
yarn add @elevenlabs/react
```

```shell
pnpm install @elevenlabs/react
```

--------------------------------

### Start WebSocket Connector Application

Source: https://elevenlabs.io/docs/agents-platform/phone-numbers/telephony/vonage

Runs the Node.js WebSocket connector application that bridges Vonage and ElevenLabs. Assumes dependencies are installed.

```bash
node elevenlabs-agent-ws-connector.cjs
```

--------------------------------

### Create MCP Server with TypeScript (ElevenLabs Client)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/create

This TypeScript example uses the official ElevenLabs JavaScript client to create an MCP server. It initializes the client with the API environment and then calls the `mcpServers.create` method with the server configuration. This is a high-level abstraction for easier integration.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.mcpServers.create({
        config: {
            url: "string",
            name: "string",
        },
    });
}
main();

```

--------------------------------

### Create Knowledge Base Document from File - Python

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-file

Initializes the ElevenLabs client and demonstrates how to create a knowledge base document from a file using the Python SDK. Requires the 'elevenlabs' library and an API key or base URL configuration.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.knowledge_base.documents.create_from_file()
```

--------------------------------

### Get Phone Numbers using Eleven Labs SDK (Ruby)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/phone-numbers/list

Shows how to retrieve phone numbers via the Eleven Labs API in Ruby. This example uses Net::HTTP to send a GET request to the API endpoint, specifying the 'xi-api-key' in the headers. The response content is then displayed.

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/phone-numbers")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

--------------------------------

### Make GET Request to Workspace API Endpoint (Go)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/list

Demonstrates how to make a GET request to the ElevenLabs workspace API endpoint using Go's net/http package. It shows how to set the API key in the request headers and print the response body. Dependencies include the standard Go libraries.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/batch-calling/workspace"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("xi-api-key", "xi-api-key")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

--------------------------------

### Make GET Request to Workspace API Endpoint (C#)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/list

This C# code example uses the RestSharp library to make a GET request to the ElevenLabs workspace API. It shows how to configure the request, add the API key header, and execute the request. The RestSharp NuGet package is required.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/batch-calling/workspace");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

--------------------------------

### Install Debian Dependencies for Raspberry Pi

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/raspberry-pi-voice-assistant

Installs necessary audio-related libraries on Debian-based systems for voice processing. Requires root privileges (`sudo`).

```bash
sudo apt-get update
sudo apt-get install libportaudio2 libportaudiocpp0 portaudio19-dev libasound-dev libsndfile1-dev -y
```

--------------------------------

### Voice Cloning (PVC) Endpoints

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/compute-rag-index_explorer=true

Endpoints for managing voice cloning, including getting samples, starting separation, and verification.

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/pvc/voice/sample/waveform

### Description
Get PVC voice sample waveform.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/pvc/voice/sample/waveform

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **waveform** (string) - The waveform data of the PVC voice sample.

#### Response Example
{
  "waveform": "base64_encoded_waveform_data"
}

## GET /websites/elevenlabs_io_agents-platform/pvc/speaker/separation/status

### Description
Get PVC speaker separation status.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/pvc/speaker/separation/status

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **status** (string) - The current status of the speaker separation process.

#### Response Example
{
  "status": "processing"
}

## POST /websites/elevenlabs_io_agents-platform/pvc/start/speaker/separation

### Description
Start speaker separation for PVC.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/pvc/start/speaker/separation

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **voice_id** (string) - Required - The ID of the voice to process.

### Request Example
{
  "voice_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
}

### Response
#### Success Response (200)
- **message** (string) - A confirmation message indicating that speaker separation has started.

#### Response Example
{
  "message": "Speaker separation started successfully."
}

## GET /websites/elevenlabs_io_agents-platform/pvc/separated/speaker/audio

### Description
Get separated speaker audio from PVC.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/pvc/separated/speaker/audio

### Parameters
#### Path Parameters
None

#### Query Parameters
- **voice_id** (string) - Required - The ID of the voice to retrieve separated audio for.

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **audio_url** (string) - A URL to the separated speaker audio.

#### Response Example
{
  "audio_url": "https://example.com/audio/separated_speaker.wav"
}

## POST /websites/elevenlabs_io_agents-platform/pvc/request/manual/verification

### Description
Request manual verification for PVC.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/pvc/request/manual/verification

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **voice_id** (string) - Required - The ID of the voice to verify.

### Request Example
{
  "voice_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
}

### Response
#### Success Response (200)
- **message** (string) - A confirmation message indicating that manual verification has been requested.

#### Response Example
{
  "message": "Manual verification requested successfully."
}

## GET /websites/elevenlabs_io_agents-platform/pvc/get/verification/captcha

### Description
Get PVC verification captcha.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/pvc/get/verification/captcha

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **captcha_image** (string) - Base64 encoded image of the captcha.
- **captcha_id** (string) - The ID of the captcha.

#### Response Example
{
  "captcha_image": "base64_encoded_image_data",
  "captcha_id": "captcha_12345"
}

## POST /websites/elevenlabs_io_agents-platform/pvc/verify/captcha

### Description
Verify PVC verification captcha.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/pvc/verify/captcha

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **voice_id** (string) - Required - The ID of the voice to verify.
- **captcha_id** (string) - Required - The ID of the captcha.
- **captcha_answer** (string) - Required - The user's answer to the captcha.

### Request Example
{
  "voice_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "captcha_id": "captcha_12345",
  "captcha_answer": "T7F8"
}

### Response
#### Success Response (200)
- **message** (string) - A confirmation message indicating whether the captcha was verified successfully.

#### Response Example
{
  "message": "Captcha verified successfully."
}
```

--------------------------------

### Create Agent with C# SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents/create

A C# example using the RestSharp library to create an agent. It shows how to configure the client, request, headers, and request body for the API call.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/agents/create");
var request = new RestRequest(Method.POST);
request.AddHeader("xi-api-key", "xi-api-key");
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

--------------------------------

### HubSpot API Schema: GET Contact Details

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/hub-spot

Defines the schema for retrieving contact details via the HubSpot API. It specifies the HTTP method as GET and includes a path parameter for the contact ID. Authorization is handled via a secret header.

```json
{
  "method": "GET",
  "path_params_schema": [
    {
      "id": "CONTACT_ID",
      "type": "string",
      "description": "use the contact ID from the results of the search_contact tool",
      "dynamic_variable": "",
      "constant_value": "",
      "required": false,
      "value_type": "llm_prompt"
    }
  ],
  "query_params_schema": [],
  "request_body_schema": null,
  "request_headers": [
    {
      "type": "secret",
      "name": "Authorization",
      "secret_id": "YOUR SECRET"
    }
  ]
}
```

--------------------------------

### List Knowledge Base Items using ElevenLabs Python SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/list

This Python example utilizes the ElevenLabs Python SDK to list knowledge base items. It initializes the client with the base URL and then calls the method to retrieve knowledge base information. This SDK simplifies interaction with the ElevenLabs API.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.knowledge_base.list()

```

--------------------------------

### Install Python Project Dependencies

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/raspberry-pi-voice-assistant

Installs essential Python libraries for the voice assistant project, including machine learning runtimes, audio processing tools, and the ElevenLabs SDK. Requires an activated virtual environment.

```bash
pip install tflite-runtime
pip install librosa
pip install EfficientWord-Net
pip install elevenlabs
pip install "elevenlabs[pyaudio]"
```

--------------------------------

### Create Conversational AI Tool via API (Go)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/create

Demonstrates how to make a POST request to the ElevenLabs API to create a conversational AI tool using Go. It includes setting the API endpoint, headers, and JSON payload.

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/tools"

	payload := strings.NewReader("{\n  \"tool_config\": {\n    \"name\": \"string\",\n    \"description\": \"string\",\n    \"api_schema\": {\n      \"url\": \"string\"\n    }\n  }\n}")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("xi-api-key", "xi-api-key")
	req.Header.Add("Content-Type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

--------------------------------

### Get Document Content via HTTP Request (Ruby)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-content

Shows how to fetch document content from the Eleven Labs API using Ruby's Net::HTTP library. This example covers setting up the HTTP connection, adding the API key header, and reading the response.

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/content")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

--------------------------------

### Example Request with System Tools

Source: https://elevenlabs.io/docs/agents-platform/customization/llm/custom-llm

Demonstrates how a custom LLM request is structured when system tools are configured, including the standard OpenAI format for messages and tool definitions.

```APIDOC
## Example Request with System Tools

### Description
This example shows the structure of a request sent to a custom LLM when system tools are enabled. It includes conversation messages and a list of available tools in the OpenAI function calling format.

### Method
N/A (Example Request Format)

### Endpoint
N/A (Example Request Format)

### Parameters
N/A

### Request Example
```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant. You have access to system tools for managing conversations."
    },
    {
      "role": "user",
      "content": "I think we're done here, thanks for your help!"
    }
  ],
  "model": "your-custom-model",
  "temperature": 0.7,
  "max_tokens": 1000,
  "stream": true,
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "end_call",
        "description": "Call this function to end the current conversation when the main task has been completed...",
        "parameters": {
          "type": "object",
          "properties": {
            "reason": {
              "type": "string",
              "description": "The reason for the tool call."
            },
            "message": {
              "type": "string",
              "description": "A farewell message to send to the user along right before ending the call."
            }
          },
          "required": ["reason"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "language_detection",
        "description": "Change the conversation language when the user expresses a language preference explicitly...",
        "parameters": {
          "type": "object",
          "properties": {
            "reason": {
              "type": "string",
              "description": "The reason for the tool call."
            },
            "language": {
              "type": "string",
              "description": "The language to switch to. Must be one of language codes in tool description."
            }
          },
          "required": ["reason", "language"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "skip_turn",
        "description": "Skip a turn when the user explicitly indicates they need a moment to think...",
        "parameters": {
          "type": "object",
          "properties": {
            "reason": {
              "type": "string",
              "description": "Optional free-form reason explaining why the pause is needed."
            }
          },
          "required": []
        }
      }
    }
  ]
}
```

### Response
#### Success Response (200)
N/A (This is an example request format)

#### Response Example
N/A
```

--------------------------------

### Using Eleven Labs SDK for Conversational AI Agent Testing

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/list

Shows how to utilize the Eleven Labs SDKs in TypeScript and Python to interact with the conversational AI agent testing functionality. These examples abstract away direct HTTP requests, providing a more convenient interface for developers. Ensure the respective SDKs are installed.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.tests.list({});
}
main();

```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.tests.list()

```

--------------------------------

### Get Conversation Token (TypeScript)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/get-webrtc-token

This TypeScript example utilizes the ElevenLabs JavaScript client to obtain a WebRTC conversation token. It demonstrates how to instantiate the client and call the `getWebrtcToken` method with the agent ID. This is a more abstracted approach compared to direct HTTP requests.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.conversations.getWebrtcToken({
        agentId: "agent_id",
    });
}
main();


```

--------------------------------

### GET /administration/studio/chapters

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/list_explorer=true

Lists chapters for a Studio project.

```APIDOC
## GET /administration/studio/chapters

### Description
Lists chapters for a Studio project.

### Method
GET

### Endpoint
/administration/studio/chapters

### Parameters
#### Query Parameters
- **project_id** (string) - Required - The ID of the project.
```

--------------------------------

### Voice Cloning API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/llm-usage/calculate_explorer=true

Endpoints related to voice cloning, including getting samples, starting separation, and verification.

```APIDOC
## GET /voices/cloning/pvc/sample/waveform

### Description
Gets the waveform sample for a cloned voice.

### Method
GET

### Endpoint
/voices/cloning/pvc/sample/waveform

### Parameters
#### Query Parameters
- **voice_id** (string) - Required - The ID of the voice.

### Response
#### Success Response (200)
- **waveform** (string) - The waveform data.

### Response Example
{
  "waveform": "base64_encoded_waveform_data"
}
```

```APIDOC
## GET /voices/cloning/pvc/status

### Description
Gets the status of speaker separation for a cloned voice.

### Method
GET

### Endpoint
/voices/cloning/pvc/status

### Parameters
#### Query Parameters
- **voice_id** (string) - Required - The ID of the voice.

### Response
#### Success Response (200)
- **status** (string) - The status of speaker separation (e.g., "processing", "completed").

### Response Example
{
  "status": "completed"
}
```

```APIDOC
## POST /voices/cloning/pvc/separate_speaker

### Description
Starts the speaker separation process for a cloned voice.

### Method
POST

### Endpoint
/voices/cloning/pvc/separate_speaker

### Parameters
#### Query Parameters
- **voice_id** (string) - Required - The ID of the voice.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

### Response Example
{
  "message": "Speaker separation started."
}
```

```APIDOC
## GET /voices/cloning/pvc/separated_audio

### Description
Gets the separated speaker audio from a cloned voice.

### Method
GET

### Endpoint
/voices/cloning/pvc/separated_audio

### Parameters
#### Query Parameters
- **voice_id** (string) - Required - The ID of the voice.

### Response
#### Success Response (200)
- **audio_url** (string) - URL to the separated audio file.

### Response Example
{
  "audio_url": "https://example.com/audio.wav"
}
```

```APIDOC
## POST /voices/cloning/pvc/manual_verification

### Description
Requests manual verification for a cloned voice.

### Method
POST

### Endpoint
/voices/cloning/pvc/manual_verification

### Parameters
#### Query Parameters
- **voice_id** (string) - Required - The ID of the voice.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

### Response Example
{
  "message": "Manual verification requested."
}
```

```APIDOC
## GET /voices/cloning/pvc/verification_captcha

### Description
Gets the verification CAPTCHA for a cloned voice.

### Method
GET

### Endpoint
/voices/cloning/pvc/verification_captcha

### Parameters
#### Query Parameters
- **voice_id** (string) - Required - The ID of the voice.

### Response
#### Success Response (200)
- **captcha_image_url** (string) - URL to the CAPTCHA image.

### Response Example
{
  "captcha_image_url": "https://example.com/captcha.png"
}
```

```APIDOC
## POST /voices/cloning/pvc/verify_captcha

### Description
Verifies the cloned voice CAPTCHA.

### Method
POST

### Endpoint
/voices/cloning/pvc/verify_captcha

### Parameters
#### Query Parameters
- **voice_id** (string) - Required - The ID of the voice.
- **captcha_answer** (string) - Required - The user's answer to the CAPTCHA.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

### Response Example
{
  "message": "CAPTCHA verified successfully."
}
```

--------------------------------

### GET /v1/convai/conversation/get-signed-url

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/get-signed-url_explorer=true

Retrieves a signed URL to initiate a conversation with an agent. This is useful for agents that require authorization before starting a conversation.

```APIDOC
## GET /v1/convai/conversation/get-signed-url

### Description
Retrieves a signed URL to initiate a conversation with an agent. This is useful for agents that require authorization before starting a conversation.

### Method
GET

### Endpoint
https://api.elevenlabs.io/v1/convai/conversation/get-signed-url

### Parameters
#### Header Parameters
- **xi-api-key** (string) - Required - Your Eleven Labs API key.

#### Query Parameters
- **agent_id** (string) - Required - The ID of the agent you wish to interact with.
- **include_conversation_id** (boolean) - Optional - Defaults to `false`. If set to `true`, a conversation ID will be included in the response. Note that if `conversation_id` is included, the `conversation_signature` cannot be reused.

### Request Example
```bash
curl -G https://api.elevenlabs.io/v1/convai/conversation/get-signed-url \
     -H "xi-api-key: YOUR_API_KEY" \
     -d agent_id=YOUR_AGENT_ID
```

### Response
#### Success Response (200)
- **signed_url** (string) - A URL that can be used to start a conversation.

#### Response Example
```json
{
  "signed_url": "string"
}
```

### Errors
- **422** - Unprocessable Entity Error
```

--------------------------------

### Get Phone Numbers using Eleven Labs SDK (Swift)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/phone-numbers/list

Shows how to fetch phone numbers using the Eleven Labs API in Swift. This example uses URLSession to send a GET request with the 'xi-api-key' header to the specified endpoint. It includes basic error handling and prints the HTTP response.

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/phone-numbers")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

--------------------------------

### Install Backend Dependencies

Source: https://elevenlabs.io/docs/agents-platform/guides/quickstarts/java-script

Installs necessary Node.js packages for the backend server, including Express for handling web requests, CORS for enabling cross-origin requests, and Dotenv for loading environment variables from a `.env` file.

```bash
npm install express cors dotenv
```

--------------------------------

### Upload Knowledge Base File via HTTP POST (Go)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-file

Demonstrates uploading a file to the Elevenlabs knowledge base using Go's net/http package. It constructs a multipart/form-data request with API key and file content. Ensure correct file paths and API keys are used.

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/knowledge-base/file"

	payload := strings.NewReader("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"file\"; filename=\"string\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\n\r\n-----011000010111000001101001--\r\n")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("xi-api-key", "xi-api-key")
	req.Header.Add("Content-Type", "multipart/form-data; boundary=---011000010111000001101001")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

--------------------------------

### Eleven Labs Python SDK for Batch Calls

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/create

This example shows how to use the Eleven Labs Python SDK to create batch calls. It initializes the `ElevenLabs` client with the base URL and then utilizes the `conversational_ai.batch_calls.create` method to submit the call details.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.batch_calls.create(
    call_name="string",
    agent_id="string",
    agent_phone_number_id="string",
    recipients=[
        {
            "phone_number": "string"
        }
    ]
)


```

--------------------------------

### GET /studio-projects

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/run-tests_explorer=true

Lists the Studio Projects.

```APIDOC
## GET /studio-projects

### Description
Lists available Studio Projects.

### Method
GET

### Endpoint
/studio-projects

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **studio_projects** (array) - Array of available Studio Projects.

#### Response Example
{
  "studio_projects": [
    {
      "id": "project123",
      "name": "My First Project"
    }
  ]
}

```

--------------------------------

### GET List Studio Projects

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/create_explorer=true

Retrieves a list of Studio Projects.

```APIDOC
## GET List Studio Projects

### Description
Lists Studio Projects.

### Method
GET

### Endpoint
/list-studio-projects

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **projects** (array) - List of Studio Projects.

#### Response Example
[
  {
    "id": "project1",
    "name": "Project 1"
  }
]

```

--------------------------------

### POST /administration/studio/chapters

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/list_explorer=true

Creates a new chapter for a Studio project.

```APIDOC
## POST /administration/studio/chapters

### Description
Creates a new chapter for a Studio project.

### Method
POST

### Endpoint
/administration/studio/chapters

### Parameters
#### Request Body
- **project_id** (string) - Required - The ID of the project.
- **title** (string) - Required - The title of the chapter.
```

--------------------------------

### Retrieve Test Invocation Details using Java (Unirest)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/test-invocations/get

An example in Java demonstrating how to get test invocation data using the Unirest library. This snippet shows a concise way to make a GET request to the ElevenLabs API endpoint, setting the 'xi-api-key' header. Remember to replace 'xi-api-key' with your actual API key.

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/test-invocations/test_invocation_id")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

--------------------------------

### Retrieve ElevenLabs Dashboard Settings via API (PHP)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/workspace/dashboard/get

This PHP example uses the Guzzle HTTP client to perform a GET request to the ElevenLabs API for conversational AI dashboard settings. It sets the 'xi-api-key' header and echoes the response body.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/settings/dashboard', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();

```

--------------------------------

### GET /v1/convai/agent-testing/:test_id

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/get_explorer=true

Retrieves the details of a specific agent test, including chat history, success/failure examples, and tool call parameters.

```APIDOC
## GET /v1/convai/agent-testing/:test_id

### Description
Retrieves the details of a specific agent test, including chat history, success/failure examples, and tool call parameters.

### Method
GET

### Endpoint
/v1/convai/agent-testing/:test_id

### Parameters
#### Path Parameters
- **test_id** (string) - Required - The unique identifier of the test to retrieve.

#### Query Parameters
None

#### Request Body
None

### Request Example
```
curl https://api.elevenlabs.io/v1/convai/agent-testing/test_id \
     -H "xi-api-key: xi-api-key"
```

### Response
#### Success Response (200)
- **chat_history** (array) - An array of message objects representing the conversation history.
- **success_condition** (string) - The condition for a successful test.
- **success_examples** (array) - An array of example successful responses.
- **failure_examples** (array) - An array of example failure responses.
- **id** (string) - The unique identifier of the test.
- **name** (string) - The name of the test.
- **tool_call_parameters** (object) - Parameters for tool calls.
- **dynamic_variables** (object) - Dynamic variables used in the agent.
- **type** (string) - The type of the agent.
- **from_conversation_metadata** (object) - Metadata from the original conversation.

#### Response Example
```json
{
  "chat_history": [
    {
      "role": "user",
      "time_in_call_secs": 1,
      "agent_metadata": {
        "agent_id": "string",
        "workflow_node_id": "string"
      },
      "message": "string",
      "multivoice_message": {
        "parts": [
          {
            "text": "string",
            "voice_label": "string",
            "time_in_call_secs": 1
          }
        ]
      },
      "tool_calls": [
        {
          "request_id": "string",
          "tool_name": "string",
          "params_as_json": "string",
          "tool_has_been_called": true,
          "type": "system",
          "tool_details": {
            "type": "webhook",
            "method": "string",
            "url": "string",
            "headers": {},
            "path_params": {},
            "query_params": {},
            "body": "string"
          }
        }
      ],
      "tool_results": [
        {
          "request_id": "string",
          "tool_name": "string",
          "result_value": "string",
          "is_error": true,
          "tool_has_been_called": true,
          "tool_latency_secs": 0,
          "dynamic_variable_updates": [
            {
              "variable_name": "string",
              "old_value": "string",
              "new_value": "string",
              "updated_at": 1.1,
              "tool_name": "string",
              "tool_request_id": "string"
            }
          ],
          "type": "client"
        }
      ],
      "feedback": {
        "score": "like",
        "time_in_call_secs": 1
      },
      "llm_override": "string",
      "conversation_turn_metrics": {
        "metrics": {}
      },
      "rag_retrieval_info": {
        "chunks": [
          {
            "document_id": "string",
            "chunk_id": "string",
            "vector_distance": 1.1
          }
        ],
        "embedding_model": "e5_mistral_7b_instruct",
        "retrieval_query": "string",
        "rag_latency_secs": 1.1
      },
      "llm_usage": {
        "model_usage": {}
      },
      "interrupted": false,
      "original_message": "string",
      "source_medium": "audio"
    }
  ],
  "success_condition": "string",
  "success_examples": [
    {
      "response": "string",
      "type": "string"
    }
  ],
  "failure_examples": [
    {
      "response": "string",
      "type": "string"
    }
  ],
  "id": "string",
  "name": "string",
  "tool_call_parameters": {
    "parameters": [
      {
        "eval": {
          "type": "string",
          "description": "string"
        },
        "path": "string"
      }
    ],
    "referenced_tool": {
      "id": "string",
      "type": "system"
    },
    "verify_absence": false
  },
  "dynamic_variables": {},
  "type": "llm",
  "from_conversation_metadata": {
    "conversation_id": "string",
    "agent_id": "string",
    "workflow_node_id": "string",
    "original_agent_reply": [
      {
        "role": "user",
        "time_in_call_secs": 1,
        "agent_metadata": {
          "agent_id": "string",
          "workflow_node_id": "string"
        },
        "message": "string",
        "multivoice_message": {
          "parts": [
            {
              "text": "string",
              "voice_label": "string",
              "time_in_call_secs": 1
            }
          ]
        },
        "tool_calls": [
          {
            "request_id": "string",
            "tool_name": "string",
            "params_as_json": "string",
            "tool_has_been_called": true,
            "type": "system",
            "tool_details": {
              "type": "webhook",
              "method": "string",
              "url": "string",
              "headers": {},
              "path_params": {},
              "query_params": {},
              "body": "string"
            }
          }
        ]
      }
    ]
  }
}
```
```

--------------------------------

### Create Agent with Ruby SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents/create

Shows how to create an agent using Ruby's Net::HTTP library. This involves setting up the request with headers and sending it to the ElevenLabs API.

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/agents/create")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["xi-api-key"] = 'xi-api-key'
request["Content-Type"] = 'application/json'
request.body = "{}"

response = http.request(request)
puts response.read_body
```

--------------------------------

### List Agents using ElevenLabs API (Go)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents/list

Demonstrates how to make a GET request to the ElevenLabs Agents API endpoint using Go's standard `net/http` package. It shows how to set the API key in the request headers and print the response body. Ensure the `xi-api-key` is replaced with a valid key.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/agents"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("xi-api-key", "xi-api-key")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

--------------------------------

### POST /chapters

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/run-tests_explorer=true

Creates a Chapter.

```APIDOC
## POST /chapters

### Description
Creates a Chapter.

### Method
POST

### Endpoint
/chapters

### Parameters
#### Request Body
- **title** (string) - Required - The title of the new Chapter.

### Request Example
{
  "title": "New Chapter"
}

### Response
#### Success Response (201)
- **chapter_id** (string) - The ID of the newly created Chapter.

#### Response Example
{
  "chapter_id": "chapter_456"
}

```

--------------------------------

### Expose Local Server with ngrok

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/upstash-redis

This command uses ngrok to expose a local server running on port 3000 to the internet. ngrok creates a secure tunnel and provides a public URL that can be used for webhook callbacks during local development.

```bash
ngrok http 3000
```

--------------------------------

### ElevenLabs Voice Configuration Example

Source: https://elevenlabs.io/docs/agents-platform/guides/eleven-labs-docs-agent

This snippet shows an example of Voice ID and optimized voice settings for a specific character. It includes parameters like Stability, Similarity, and Speed, which are crucial for fine-tuning the voice characteristics to match the agent's personality.

```text
Voice ID: P7x743VjyZEOihNNygQ9 (Dakota H)

Voice settings optimization:
* Stability: Set to 0.45
* Similarity: 0.75
* Speed: 1.0
```

--------------------------------

### Example LLM Request with System Tools (OpenAI Format)

Source: https://elevenlabs.io/docs/agents-platform/customization/llm/custom-llm

An example of a typical LLM request incorporating system tools like 'end_call', 'language_detection', and 'skip_turn'. This demonstrates how tools are defined within the 'tools' array in the OpenAI API format.

```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant. You have access to system tools for managing conversations."
    },
    {
      "role": "user",
      "content": "I think we're done here, thanks for your help!"
    }
  ],
  "model": "your-custom-model",
  "temperature": 0.7,
  "max_tokens": 1000,
  "stream": true,
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "end_call",
        "description": "Call this function to end the current conversation when the main task has been completed...",
        "parameters": {
          "type": "object",
          "properties": {
            "reason": {
              "type": "string",
              "description": "The reason for the tool call."
            },
            "message": {
              "type": "string",
              "description": "A farewell message to send to the user along right before ending the call."
            }
          },
          "required": ["reason"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "language_detection",
        "description": "Change the conversation language when the user expresses a language preference explicitly...",
        "parameters": {
          "type": "object",
          "properties": {
            "reason": {
              "type": "string",
              "description": "The reason for the tool call."
            },
            "language": {
              "type": "string",
              "description": "The language to switch to. Must be one of language codes in tool description."
            }
          },
          "required": ["reason", "language"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "skip_turn",
        "description": "Skip a turn when the user explicitly indicates they need a moment to think...",
        "parameters": {
          "type": "object",
          "properties": {
            "reason": {
              "type": "string",
              "description": "Optional free-form reason explaining why the pause is needed."
            }
          },
          "required": []
        }
      }
    }
  ]
}
```

--------------------------------

### Create Conversational AI Tool via API (Java)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/create

Provides a Java example using the Unirest library to interact with the ElevenLabs API for creating conversational AI tools. It demonstrates setting headers and the request body for a POST request.

```java
HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/convai/tools")
  .header("xi-api-key", "xi-api-key")
  .header("Content-Type", "application/json")
  .body("{\n  \"tool_config\": {\n    \"name\": \"string\",\n    \"description\": \"string\",\n    \"api_schema\": {\n      \"url\": \"string\"\n    }\n  }\n}")
  .asString();
```

--------------------------------

### List Agents using ElevenLabs API (Swift)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents/list

Provides a Swift example for retrieving agents from the ElevenLabs API using `URLSession`. This snippet shows how to construct an `NSMutableURLRequest`, set the HTTP method to `GET`, add the `xi-api-key` header, and handle the response asynchronously.

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/agents")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

--------------------------------

### Fetch Tool Information via HTTP GET Request

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/get

Demonstrates how to retrieve tool information from the ElevenLabs API using a standard HTTP GET request. This method requires manually constructing the request, setting headers, and processing the response. It is language-agnostic in principle but implemented here in Go and Ruby.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/tools/tool_id"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("xi-api-key", "xi-api-key")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/tools/tool_id")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

--------------------------------

### Add Knowledge Base from File (Bash and Python)

Source: https://context7.com/context7/elevenlabs_io_agents-platform/llms.txt

Upload documents to create a knowledge base that agents can reference. This functionality is demonstrated using both a `curl` command for direct API interaction and a Python script utilizing the ElevenLabs SDK. Both methods require an API key and specify the file path and a name for the knowledge base.

```bash
curl -X POST "https://api.elevenlabs.io/v1/convai/knowledge-base/file" \
  -H "xi-api-key: YOUR_API_KEY" \
  -F "file=@/path/to/product-manual.pdf" \
  -F "name=Product Manual"

# Response:
# {
#   "id": "kb_789xyz",
#   "name": "Product Manual"
# }

```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(api_key="YOUR_API_KEY")

# Upload knowledge base document
with open("product-manual.pdf", "rb") as file:
    kb_doc = client.conversational_ai.knowledge_base.documents.create_from_file(
        file=file,
        name="Product Manual"
    )

print(f"Knowledge base ID: {kb_doc.id}")

```

--------------------------------

### GET /administration/studio/projects

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/list_explorer=true

Lists Studio projects.

```APIDOC
## GET /administration/studio/projects

### Description
Lists Studio projects.

### Method
GET

### Endpoint
/administration/studio/projects
```

--------------------------------

### Test Agent API Call with PHP (Guzzle)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/get

This PHP example utilizes the Guzzle HTTP client to make a GET request to the ElevenLabs API for agent testing. It shows how to configure headers, including the API key, and echo the response body.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/agent-testing/test_id', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();

```

--------------------------------

### GET /crm/v3/objects/calls

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/hub-spot

This endpoint appears to be related to retrieving call information. It includes path parameters for a contact ID and specifies request headers for authorization.

```APIDOC
## GET /crm/v3/objects/calls

### Description
Retrieves information related to calls, potentially filtered by contact ID.

### Method
GET

### Endpoint
/crm/v3/objects/calls

### Parameters
#### Path Parameters
- **CONTACT_ID** (string) - Optional - Use the contact ID from the results of the search_contact tool.

#### Query Parameters
None specified.

#### Request Body
None.

### Request Example
None.

### Response
#### Success Response (200)
Details not provided in the input.

#### Response Example
None.
```

--------------------------------

### POST Create Chapter

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/list_explorer=true

Creates a new chapter within a Studio Project. This endpoint allows structuring a project into distinct parts.

--------------------------------

### List Agents using ElevenLabs API (PHP)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents/list

Illustrates how to retrieve a list of agents from the ElevenLabs API using PHP with the Guzzle HTTP client. This snippet shows how to instantiate the client, make a GET request, and include the `xi-api-key` header. Make sure Guzzle is installed via Composer.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/agents', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
?>
```

--------------------------------

### GET /crm/v3/objects/contacts/{CONTACT_ID}/associations/calls

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/hub-spot

Retrieves a list of calls associated with a specific contact. This endpoint requires a contact ID obtained from a previous search.

```APIDOC
## GET /crm/v3/objects/contacts/{CONTACT_ID}/associations/calls

### Description
Retrieves the calls associated with a contact. Use the contact ID obtained from the `search_contact` tool to fetch relevant call records.

### Method
GET

### Endpoint
`https://api.hubapi.com/crm/v3/objects/contacts/{CONTACT_ID}/associations/calls?limit=100`

### Parameters
#### Path Parameters
- **CONTACT_ID** (string) - Required - The unique identifier of the contact whose calls are to be retrieved.

#### Query Parameters
- **limit** (integer) - Optional - The maximum number of calls to return. Defaults to 100.

#### Request Body
- None

### Request Example
```http
GET https://api.hubapi.com/crm/v3/objects/contacts/12345/associations/calls?limit=100
Authorization: Bearer YOUR_HUBSPOT_TOKEN
```

### Response
#### Success Response (200)
- **results** (array) - An array of call objects associated with the contact.
  - **id** (string) - The unique identifier for the call.
  - **createdAt** (string) - The timestamp when the call was created.
  - **typeId** (string) - The type of association.

#### Response Example
```json
{
  "results": [
    {
      "id": "call-id-1",
      "createdAt": "2023-10-27T10:00:00Z",
      "typeId": "2-1"
    },
    {
      "id": "call-id-2",
      "createdAt": "2023-10-26T15:30:00Z",
      "typeId": "2-1"
    }
  ]
}
```
```

--------------------------------

### Retrieve Batch Call Details - C# SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/get

This C# example uses the RestSharp library to send a GET request to the ElevenLabs API to fetch batch call details. It adds the 'xi-api-key' header to the request. You need to add the RestSharp NuGet package to your project.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/batch-calling/batch_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

--------------------------------

### List Agents using ElevenLabs API (Ruby)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents/list

Shows how to fetch a list of agents from the ElevenLabs API using Ruby's `net/http` library. This example includes setting up an SSL-enabled HTTP connection, adding the API key to the request headers, and printing the response. Replace `'xi-api-key'` with your actual API key.

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/agents")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

--------------------------------

### Administration Studio API - Create Chapter

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-file_explorer=true

Creates a new chapter for a studio project.

```APIDOC
## POST Create Chapter

### Description
Creates a new chapter for a studio project.

### Method
POST

### Endpoint
/studio-projects/{project_id}/chapters

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the studio project.

#### Request Body
- **title** (string) - Required - The title of the chapter.

### Request Example
{
  "title": "My New Chapter"
}

### Response
#### Success Response (201)
- **id** (string) - The ID of the created chapter.

#### Response Example
{
  "id": "chapter123"
}

```

--------------------------------

### cURL: Get Document Chunk

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-chunk_explorer=true

Example of how to retrieve a specific document chunk from the Eleven Labs knowledge base using cURL. This request requires the documentation ID, chunk ID, and an API key for authentication. The response includes the chunk's ID, name, and content.

```bash
curl https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/chunk/chunk_id \
     -H "xi-api-key: xi-api-key"
```

--------------------------------

### Administration Studio

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/list_explorer=true

Endpoints for managing Studio Projects, Chapters, and related assets.

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects

### Description
List Studio Projects.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

### Description
Update a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

### Description
Get a Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects

### Description
Create a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects

## DELETE /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

### Description
Delete a Studio Project.

### Method
DELETE

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/convert

### Description
Convert a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/convert

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/content

### Description
Update Studio Project Content.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/content

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/snapshots

### Description
List Studio Project Snapshots.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/snapshots

## STREAM /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/audio

### Description
Stream audio from a Studio Project.

### Method
STREAM

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/audio

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/archive_audio

### Description
Stream archive with Studio Project audio.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/archive_audio

## GET /websites/elevenlabs_io_agents-platform/administration/studio/chapters

### Description
List chapters.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters

## GET /websites/elevenlabs_io_agents-platform/administration/studio/chapters/{chapter_id}

### Description
Get a chapter.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters/{chapter_id}

## POST /websites/elevenlabs_io_agents-platform/administration/studio/chapters

### Description
Create a chapter.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters

## POST /websites/elevenlabs_io_agents-platform/administration/studio/chapters/{chapter_id}

### Description
Update a chapter.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters/{chapter_id}

## DELETE /websites/elevenlabs_io_agents-platform/administration/studio/chapters/{chapter_id}

### Description
Delete a chapter.

### Method
DELETE

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters/{chapter_id}

## POST /websites/elevenlabs_io_agents-platform/administration/studio/chapters/{chapter_id}/convert

### Description
Convert a chapter.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters/{chapter_id}/convert

## GET /websites/elevenlabs_io_agents-platform/administration/studio/chapters/{chapter_id}/snapshots

### Description
List chapter snapshots.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters/{chapter_id}/snapshots

## STREAM /websites/elevenlabs_io_agents-platform/administration/studio/chapters/{chapter_id}/audio

### Description
Stream audio from a chapter.

### Method
STREAM

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters/{chapter_id}/audio

## POST /websites/elevenlabs_io_agents-platform/administration/studio/pronunciation_dictionaries

### Description
Create pronunciation dictionaries.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/pronunciation_dictionaries

## POST /websites/elevenlabs_io_agents-platform/administration/studio/podcast

### Description
Create a podcast.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/podcast

## GET /websites/elevenlabs_io_agents-platform/administration/studio/chapters/{chapter_id}/snapshots/{snapshot_id}

### Description
Get a chapter snapshot.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters/{chapter_id}/snapshots/{snapshot_id}

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/snapshots/{snapshot_id}

### Description
Get a project snapshot.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/snapshots/{snapshot_id}
```

--------------------------------

### Successful Response Example

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/summaries_explorer=true

This snippet shows the expected JSON structure for a successful response when retrieving test summaries. It returns a dictionary where keys are test IDs and values contain the summary information for each test.

```json
{
  "tests": {}
}
```

--------------------------------

### GET Get Chapter

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/create_explorer=true

Retrieves a Chapter.

```APIDOC
## GET Get Chapter

### Description
Retrieves a Chapter.

### Method
GET

### Endpoint
/get-chapter

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **chapter** (object) - Chapter details.

#### Response Example
{
  "id": "chapter1",
  "project_id": "project1"
}

```

--------------------------------

### Get Phone Numbers using Eleven Labs SDK (Python)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/phone-numbers/list

Shows a Python example for fetching phone numbers using the Eleven Labs Python SDK. It initializes the ElevenLabs client with the base URL and then calls the `list()` method for phone numbers under the `conversational_ai` module.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.phone_numbers.list()
```

--------------------------------

### Administration Studio API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/create_explorer=true

Endpoints for managing Studio Projects, including creation, updates, deletion, conversion, content management, snapshots, chapters, and audio streaming.

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects

### Description
List Studio Projects.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/update

### Description
Update a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/update

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{projectId}

### Description
Get a specific Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{projectId}

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects

### Description
Create a new Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects

## DEL /websites/elevenlabs_io_agents-platform/administration/studio/projects/{projectId}

### Description
Delete a Studio Project.

### Method
DELETE

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{projectId}

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/convert

### Description
Convert a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/convert

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/content/update

### Description
Update Studio Project content.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/content/update

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/snapshots

### Description
List Studio Project snapshots.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/snapshots

## STREAM /websites/elevenlabs_io_agents-platform/administration/studio/projects/audio/stream

### Description
Stream audio from a Studio Project.

### Method
STREAM

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/audio/stream

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/archive/stream

### Description
Stream an archive with Studio Project audio.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/archive/stream

## GET /websites/elevenlabs_io_agents-platform/administration/studio/chapters

### Description
List chapters for a Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters

## GET /websites/elevenlabs_io_agents-platform/administration/studio/chapters/{chapterId}

### Description
Get a specific chapter.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters/{chapterId}

## POST /websites/elevenlabs_io_agents-platform/administration/studio/chapters

### Description
Create a new chapter.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters

## POST /websites/elevenlabs_io_agents-platform/administration/studio/chapters/update

### Description
Update a chapter.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters/update

## DEL /websites/elevenlabs_io_agents-platform/administration/studio/chapters/{chapterId}

### Description
Delete a chapter.

### Method
DELETE

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters/{chapterId}

## POST /websites/elevenlabs_io_agents-platform/administration/studio/chapters/convert

### Description
Convert a chapter.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters/convert

## GET /websites/elevenlabs_io_agents-platform/administration/studio/chapters/snapshots

### Description
List chapter snapshots.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters/snapshots

## STREAM /websites/elevenlabs_io_agents-platform/administration/studio/chapters/audio/stream

### Description
Stream audio from a chapter.

### Method
STREAM

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters/audio/stream

## POST /websites/elevenlabs_io_agents-platform/administration/studio/pronunciation_dictionaries

### Description
Create pronunciation dictionaries from a file or rules.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/pronunciation_dictionaries

## POST /websites/elevenlabs_io_agents-platform/administration/studio/podcast

### Description
Create a podcast.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/podcast

## GET /websites/elevenlabs_io_agents-platform/administration/studio/chapters/snapshot/{snapshotId}

### Description
Get a specific chapter snapshot.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters/snapshot/{snapshotId}

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/snapshot/{snapshotId}

### Description
Get a specific project snapshot.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/snapshot/{snapshotId}
```

--------------------------------

### Retrieve Test Invocation Details using Ruby

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/test-invocations/get

Provides a Ruby example for retrieving test invocation details via the ElevenLabs API. It utilizes the built-in `net/http` and `uri` libraries to construct and execute a GET request, including the necessary 'xi-api-key' header. Replace 'xi-api-key' with your valid API key.

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/test-invocations/test_invocation_id")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

--------------------------------

### POST Start speaker separation

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-agents_explorer=true

Initiates the speaker separation process for a given audio sample. This is a crucial step in isolating the target speaker's voice.

```APIDOC
## POST Start speaker separation

### Description
Initiates the speaker separation process for a given audio sample.

### Method
POST

### Endpoint
/start-speaker-separation

### Parameters
#### Request Body
- **audio_file** (file) - Required - The audio file to process.

### Request Example
{
  "audio_file": "..."
}

### Response
#### Success Response (200)
- **task_id** (string) - Unique identifier for the speaker separation task.

#### Response Example
{
  "task_id": "123e4567-e89b-12d3-a456-426614174000"
}

```

--------------------------------

### Calculate LLM Usage with TypeScript (ElevenLabs SDK)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/llm-usage/calculate

This TypeScript code example shows how to use the official ElevenLabs JavaScript SDK to calculate LLM usage. It initializes the client and calls the `calculate` method within the `conversationalAi.llmUsage` namespace. Requires installation of `@elevenlabs/elevenlabs-js`.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.llmUsage.calculate({
        promptLength: 1,
        numberOfPages: 1,
        ragEnabled: true,
    });
}
main();


```

--------------------------------

### POST Create Studio Project

Source: https://elevenlabs.io/docs/agents-platform/api-reference/workspace/secrets/list_explorer=true

Creates a new Studio Project.

```APIDOC
## POST Create Studio Project

### Description
Creates a new Studio Project.

### Method
POST

### Endpoint
/studio_projects

### Parameters
#### Request Body
- **name** (string) - Required - The name of the new project.

### Request Example
{
  "name": "New Project"
}

### Response
#### Success Response (201)
- **project_id** (string) - The ID of the newly created project.

#### Response Example
{
  "project_id": "unique_project_id"
}

```

--------------------------------

### GET /studio

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/get_explorer=true

Lists all studio projects. Allows users to see and manage their existing studio projects within the ElevenLabs platform.

```APIDOC
## GET /studio

### Description
Lists Studio Projects.

### Method
GET

### Endpoint
/studio

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **projects** (array) - Array of Studio Project objects.

#### Response Example
{
  "projects": [
    {
      "id": "project1",
      "name": "My Project"
    }
  ]
}

```

--------------------------------

### Fetch Conversation Data using Java Unirest

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/get

Provides a concise example of fetching conversation data from the ElevenLabs API using the Unirest library in Java. It directly executes a GET request and retrieves the response as a string.

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/conversations/:conversation_id")
  .asString();
```

--------------------------------

### Create Agent with Java SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents/create

Provides a Java code snippet using the Unirest library to create an agent. This example demonstrates setting headers and the request body for the API call.

```java
HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/convai/agents/create")
  .header("xi-api-key", "xi-api-key")
  .header("Content-Type", "application/json")
  .body("{}")
  .asString();
```

--------------------------------

### Studio Projects

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/get_explorer=true

Endpoints for managing Studio Projects, including creating, updating, deleting, converting, and managing their content, snapshots, and chapters.

```APIDOC
## GET /studio/projects

### Description
Lists all Studio Projects.

### Method
GET

### Endpoint
/studio/projects

---

## POST /studio/projects/update

### Description
Updates a Studio Project.

### Method
POST

### Endpoint
/studio/projects/update

---

## GET /studio/projects/{projectId}

### Description
Retrieves a specific Studio Project by its ID.

### Method
GET

### Endpoint
/studio/projects/{projectId}

---

## POST /studio/projects

### Description
Creates a new Studio Project.

### Method
POST

### Endpoint
/studio/projects

---

## DELETE /studio/projects/{projectId}

### Description
Deletes a specific Studio Project by its ID.

### Method
DELETE

### Endpoint
/studio/projects/{projectId}

---

## POST /studio/projects/convert

### Description
Converts a Studio Project.

### Method
POST

### Endpoint
/studio/projects/convert

---

## POST /studio/projects/{projectId}/content/update

### Description
Updates the content of a Studio Project.

### Method
POST

### Endpoint
/studio/projects/{projectId}/content/update

---

## GET /studio/projects/{projectId}/snapshots

### Description
Lists snapshots for a Studio Project.

### Method
GET

### Endpoint
/studio/projects/{projectId}/snapshots

---

## STREAM /studio/projects/{projectId}/audio

### Description
Streams audio for a Studio Project.

### Method
STREAM

### Endpoint
/studio/projects/{projectId}/audio

---

## POST /studio/projects/stream/archive

### Description
Streams an archive with Studio Project audio.

### Method
POST

### Endpoint
/studio/projects/stream/archive

---

## GET /studio/projects/{projectId}/chapters

### Description
Lists chapters for a Studio Project.

### Method
GET

### Endpoint
/studio/projects/{projectId}/chapters

---

## GET /studio/projects/{projectId}/chapters/{chapterId}

### Description
Retrieves a specific chapter by its ID.

### Method
GET

### Endpoint
/studio/projects/{projectId}/chapters/{chapterId}

---

## POST /studio/projects/{projectId}/chapters

### Description
Creates a new chapter for a Studio Project.

### Method
POST

### Endpoint
/studio/projects/{projectId}/chapters

---

## POST /studio/projects/{projectId}/chapters/update

### Description
Updates a chapter in a Studio Project.

### Method
POST

### Endpoint
/studio/projects/{projectId}/chapters/update

---

## DELETE /studio/projects/{projectId}/chapters/{chapterId}

### Description
Deletes a specific chapter by its ID.

### Method
DELETE

### Endpoint
/studio/projects/{projectId}/chapters/{chapterId}

---

## POST /studio/projects/{projectId}/chapters/convert

### Description
Converts a chapter.

### Method
POST

### Endpoint
/studio/projects/{projectId}/chapters/convert

---

## GET /studio/projects/{projectId}/chapters/{chapterId}/snapshots

### Description
Lists snapshots for a chapter.

### Method
GET

### Endpoint
/studio/projects/{projectId}/chapters/{chapterId}/snapshots

---

## STREAM /studio/projects/{projectId}/chapters/{chapterId}/audio

### Description
Streams audio for a chapter.

### Method
STREAM

### Endpoint
/studio/projects/{projectId}/chapters/{chapterId}/audio

---

## POST /pronunciation_dictionaries/create/file

### Description
Creates a pronunciation dictionary from a file.

### Method
POST

### Endpoint
/pronunciation_dictionaries/create/file

---

## POST /podcasts/create

### Description
Creates a podcast.

### Method
POST

### Endpoint
/podcasts/create

---

## GET /studio/projects/{projectId}/snapshots/{snapshotId}

### Description
Retrieves a specific Studio Project snapshot by its ID.

### Method
GET

### Endpoint
/studio/projects/{projectId}/snapshots/{snapshotId}

---

## GET /studio/projects/{projectId}/snapshots/{snapshotId}/project

### Description
Retrieves the project associated with a Studio Project snapshot.

### Method
GET

### Endpoint
/studio/projects/{projectId}/snapshots/{snapshotId}/project
```

--------------------------------

### Create Tool Configuration using cURL

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/create_explorer=true

This snippet demonstrates how to create a tool configuration for the ElevenLabs Agents Platform using a cURL command. It requires specifying the tool's name, description, and API schema URL in the request body. The `xi-api-key` header is mandatory for authentication.

```shell
$| curl -X POST https://api.elevenlabs.io/v1/convai/tools \
---|---
>|      -H "xi-api-key: xi-api-key" \
>|      -H "Content-Type: application/json" \
>|      -d '{ \
>|   "tool_config": { \
>|     "name": "string", \
>|     "description": "string", \
>|     "api_schema": { \
>|       "url": "string" \
>|     } \
>|   } \
>| }'
```

--------------------------------

### Retrieve Batch Call Details - TypeScript SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/get

This TypeScript example utilizes the official ElevenLabs JS client to fetch batch call details. It initializes the client with the API endpoint and calls the specific method for retrieving batch call information. Ensure the '@elevenlabs/elevenlabs-js' package is installed.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.batchCalls.get("batch_id");
}
main();

```

--------------------------------

### Get Conversation ID (Kotlin)

Source: https://elevenlabs.io/docs/agents-platform/libraries/kotlin

Retrieves the unique identifier for the current conversation session. This ID is crucial for referencing specific conversations. Logs the conversation ID for debugging purposes. Example output: 'conv_123'.

```kotlin
val conversationId = session.getId()
Log.d("Conversation", "Conversation ID: $conversationId")
// e.g., "conv_123"
```

--------------------------------

### Administration Studio Projects

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-url_explorer=true

Endpoints for managing Studio Projects, including creation, updates, deletion, and content management.

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/list

### Description
List Studio Projects.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/list

### Response
#### Success Response (200)
- **projects** (array of objects) - List of Studio Projects.

#### Response Example
{
  "projects": [ { ... }, { ... } ]
}

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/update

### Description
Update a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/update

### Parameters
#### Request Body
- **project_id** (string) - Required - The ID of the project to update.
- **data** (object) - Required - The data to update the project with.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Studio Project updated."
}

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

### Description
Get a specific Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.

### Response
#### Success Response (200)
- **project** (object) - The Studio Project details.

#### Response Example
{
  "project": { ... }
}

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/create

### Description
Create a new Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/create

### Parameters
#### Request Body
- **name** (string) - Required - The name of the new project.
- **description** (string) - Optional - Description for the project.

### Response
#### Success Response (200)
- **project_id** (string) - The ID of the created Studio Project.

#### Response Example
{
  "project_id": "new_project_id"
}

## DEL /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

### Description
Delete a Studio Project.

### Method
DELETE

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project to delete.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Studio Project deleted."
}

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/convert

### Description
Convert a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/convert

### Parameters
#### Request Body
- **project_id** (string) - Required - The ID of the project to convert.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Studio Project conversion initiated."
}

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/content/update

### Description
Update the content of a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/content/update

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
#### Request Body
- **content** (object) - Required - The new content for the project.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Studio Project content updated."
}

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/snapshots/list

### Description
List snapshots for a Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/snapshots/list

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.

### Response
#### Success Response (200)
- **snapshots** (array of objects) - List of project snapshots.

#### Response Example
{
  "snapshots": [ { ... }, { ... } ]
}

## STREAM /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/audio/stream

### Description
Stream audio from a Studio Project.

### Method
STREAM

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/audio/stream

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.

### Response
#### Success Response (200)
- **audio_stream** (stream) - An audio stream of the project.

#### Response Example
(Audio stream)

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/stream_archive

### Description
Stream an archive with Studio Project audio.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/stream_archive

### Parameters
#### Request Body
- **project_id** (string) - Required - The ID of the Studio Project.

### Response
#### Success Response (200)
- **audio_stream** (stream) - An audio stream of the archived project.

#### Response Example
(Audio stream)

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/list

### Description
List chapters for a Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/list

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.

### Response
#### Success Response (200)
- **chapters** (array of objects) - List of project chapters.

#### Response Example
{
  "chapters": [ { ... }, { ... } ]
}

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}

### Description
Get a specific chapter from a Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
- **chapter_id** (string) - Required - The ID of the chapter.

### Response
#### Success Response (200)
- **chapter** (object) - The chapter details.

#### Response Example
{
  "chapter": { ... }
}

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/create

### Description
Create a new chapter for a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/create

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
#### Request Body
- **name** (string) - Required - The name of the new chapter.

### Response
#### Success Response (200)
- **chapter_id** (string) - The ID of the created chapter.

#### Response Example
{
  "chapter_id": "new_chapter_id"
}

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/update

### Description
Update a chapter in a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/update

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
#### Request Body
- **chapter_id** (string) - Required - The ID of the chapter to update.
- **data** (object) - Required - The data to update the chapter with.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Chapter updated."
}

## DEL /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}

### Description
Delete a chapter from a Studio Project.

### Method
DELETE

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
- **chapter_id** (string) - Required - The ID of the chapter to delete.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Chapter deleted."
}

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/convert

### Description
Convert a chapter within a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/convert

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
#### Request Body
- **chapter_id** (string) - Required - The ID of the chapter to convert.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Chapter conversion initiated."
}

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}/snapshots/list

### Description
List snapshots for a chapter within a Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}/snapshots/list

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
- **chapter_id** (string) - Required - The ID of the chapter.

### Response
#### Success Response (200)
- **snapshots** (array of objects) - List of chapter snapshots.

#### Response Example
{
  "snapshots": [ { ... }, { ... } ]
}

## STREAM /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}/audio/stream

### Description
Stream audio from a specific chapter of a Studio Project.

### Method
STREAM

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}/audio/stream

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
- **chapter_id** (string) - Required - The ID of the chapter.

### Response
#### Success Response (200)
- **audio_stream** (stream) - An audio stream of the chapter.

#### Response Example
(Audio stream)

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/pronunciation_dictionaries/create

### Description
Create pronunciation dictionaries for a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/pronunciation_dictionaries/create

### Parameters
#### Request Body
- **project_id** (string) - Required - The ID of the Studio Project.
- **dictionaries** (array of objects) - Required - Pronunciation dictionary data.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Pronunciation dictionaries created."
}

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/podcast/create

### Description
Create a podcast from a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/podcast/create

### Parameters
#### Request Body
- **project_id** (string) - Required - The ID of the Studio Project.

### Response
#### Success Response (200)
- **podcast_id** (string) - The ID of the created podcast.

#### Response Example
{
  "podcast_id": "podcast_xyz"
}

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}/snapshots/{snapshot_id}

### Description
Get a specific snapshot of a chapter from a Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}/snapshots/{snapshot_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
- **chapter_id** (string) - Required - The ID of the chapter.
- **snapshot_id** (string) - Required - The ID of the snapshot.

### Response
#### Success Response (200)
- **snapshot** (object) - The snapshot details.

#### Response Example
{
  "snapshot": { ... }
}

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/snapshots/{snapshot_id}

### Description
Get a specific snapshot of a Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/snapshots/{snapshot_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
- **snapshot_id** (string) - Required - The ID of the snapshot.

### Response
#### Success Response (200)
- **snapshot** (object) - The snapshot details.

#### Response Example
{
  "snapshot": { ... }
}
```

--------------------------------

### Get Phone Numbers using Eleven Labs SDK (TypeScript)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/phone-numbers/list

Provides a TypeScript example for listing phone numbers using the Eleven Labs JavaScript SDK. It initializes the client with the API environment and calls the `list()` method on the `phoneNumbers` resource within `conversationalAi`. This is an asynchronous operation.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.phoneNumbers.list();
}
main();
```

--------------------------------

### Fetch Secrets via API - Swift

Source: https://elevenlabs.io/docs/agents-platform/api-reference/workspace/secrets/list

This Swift code example shows how to perform a GET request to the ElevenLabs API for secrets using `URLSession`. It sets up the `xi-api-key` header and handles the response, printing any errors or the HTTP response details. This code performs an asynchronous network operation.

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/secrets")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

--------------------------------

### Knowledge Base and LLM Configurations

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/run-tests

Details configurations for Knowledge Base integration and Custom Large Language Models.

```APIDOC
## Knowledge Base and LLM Configurations

This section describes the schemas for configuring Knowledge Bases and custom LLMs.

### KnowledgeBaseDocumentType

Enum for the type of document used in the Knowledge Base.
  #### Enum
    - value: "file"
    - value: "url"
    - value: "text"

### DocumentUsageModeEnum

Enum for the usage mode of documents in the Knowledge Base.
  #### Enum
    - value: "prompt"
    - value: "auto"

### KnowledgeBaseLocator

Locator for a Knowledge Base document.
  #### Properties
    - **type** ($ref: '#/components/schemas/KnowledgeBaseDocumentType') - Required - The type of the document.
    - **name** (string) - Required - The name of the document.
    - **id** (string) - Required - The ID of the document.
    - **usage_mode** ($ref: '#/components/schemas/DocumentUsageModeEnum') - The usage mode for the document.

### ConvAISecretLocator

Locator for a secret stored in ConvAI.
  #### Properties
    - **secret_id** (string) - Required - The ID of the secret.

### ConvAIDynamicVariable

Reference to a dynamic variable in ConvAI.
  #### Properties
    - **variable_name** (string) - Required - The name of the dynamic variable.

### CustomLlmRequestHeaders

Headers for a custom LLM request, can be a string, a secret locator, or a dynamic variable.
  #### One Of
    - type: string
    - $ref: '#/components/schemas/ConvAISecretLocator'
    - $ref: '#/components/schemas/ConvAIDynamicVariable'

### CustomLLM

Configuration for a custom Large Language Model.
  #### Properties
    - **url** (string) - Required - The URL of the custom LLM.
    - **model_id** (string | null) - The model ID for the custom LLM.
    - **api_key** (ConvAISecretLocator | null) - The API key for the custom LLM.
    - **request_headers** (object) - Additional request headers.
      - Additional Properties: $ref: '#/components/schemas/CustomLlmRequestHeaders'
    - **api_version** (string | null) - The API version for the custom LLM.

### EmbeddingModelEnum

Enum for available embedding models.
  #### Enum
    - value: "e5_mistral_7b_instruct"
    - value: "multilingual_e5_large_instruct"

### RagConfig

Configuration for Retrieval-Augmented Generation (RAG).
  #### Properties
    - **enabled** (boolean) - Whether RAG is enabled.
    - **embedding_model** ($ref: '#/components/schemas/EmbeddingModelEnum') - The embedding model to use.
    - **max_vector_distance** (number) - The maximum vector distance.
    - **max_documents_length** (integer) - The maximum number of documents to consider.
```

--------------------------------

### Resubmit Test Invocation - C# SDK Example

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/test-invocations/resubmit

This C# code snippet demonstrates resubmitting a test invocation using the RestSharp library. It constructs a POST request with appropriate headers and request body. Ensure you have the RestSharp NuGet package installed.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/test-invocations/test_invocation_id/resubmit");
var request = new RestRequest(Method.POST);
request.AddHeader("xi-api-key", "xi-api-key");
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{ \n  \"test_run_ids\": [ \n    \"string\" \n  ], \n  \"agent_id\": \"string\" \n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

--------------------------------

### Retrieve Test Invocation Details using Swift

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/test-invocations/get

This Swift code example demonstrates how to fetch test invocation details from the ElevenLabs API. It uses `URLSession` and `NSMutableURLRequest` to perform a GET request, including the essential 'xi-api-key' header for authentication. Remember to replace 'xi-api-key' with your actual API key.

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/test-invocations/test_invocation_id")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

--------------------------------

### Start Voice Conversation with Agent - Python SDK

Source: https://context7.com/context7/elevenlabs_io_agents-platform/llms.txt

Initiates a voice conversation with an agent using the ElevenLabs Python SDK and the default audio interface. It allows for callback functions to handle agent responses, user transcripts, and response corrections. Requires the ElevenLabs Python library and an API key.

```python
import os
from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface

# Initialize client
client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

# Create conversation with callbacks
conversation = Conversation(
    client,
    agent_id="agent_abc123",
    requires_auth=True,
    audio_interface=DefaultAudioInterface(),
    callback_agent_response=lambda response: print(f"Agent: {response}"),
    callback_user_transcript=lambda transcript: print(f"User: {transcript}"),
    callback_agent_response_correction=lambda orig, corr: print(f"Correction: {orig} -> {corr}")
)

# Start conversation with user tracking
conversation.start_session(user_id="customer_12345")

# Wait for conversation to end
conversation_id = conversation.wait_for_session_end()
print(f"Conversation ID: {conversation_id}")
```

--------------------------------

### Retrieve Test Invocation Details using TypeScript

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/test-invocations/get

An example in TypeScript using the official ElevenLabs SDK to get test invocation details. This snippet shows how to initialize the client and call the specific method for retrieving invocation data. Ensure your environment URL is correct and you handle authentication appropriately.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.tests.invocations.get("test_invocation_id");
}
main();

```

--------------------------------

### Compute RAG Index: PHP

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/compute-rag-index

This PHP example uses the Guzzle HTTP client to compute a RAG index for ElevenLabs knowledge bases. It sends a POST request with the appropriate headers and JSON body. Ensure Guzzle is installed via Composer.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/rag-index', [
  'body' => '{\n  "model": "e5_mistral_7b_instruct"\n}',
  'headers' => [
    'Content-Type' => 'application/json',
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
?>
```

--------------------------------

### POST Create Studio Project

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents/get-link_explorer=true

Creates a new studio project. This allows users to start new creative projects within the platform.

```APIDOC
## POST Create Studio Project

### Description
Creates a new studio project.

### Method
POST

### Endpoint
/studio/projects

### Request Body
- **name** (string) - Required - The name of the new project.

### Request Example
{
  "name": "My New Project"
}

### Response
#### Success Response (201)
- **id** (string) - The ID of the newly created project.

#### Response Example
{
  "id": "project1"
}

```

--------------------------------

### Install ElevenLabs Agents CLI (npm, pnpm, yarn)

Source: https://elevenlabs.io/docs/agents-platform/libraries/agents-cli

Installs the ElevenLabs Agents Platform CLI globally using different package managers. Requires Node.js version 16.0.0 or higher.

```bash
npm install -g @elevenlabs/agents-cli
```

```bash
pnpm add -g @elevenlabs/agents-cli
```

```bash
yarn global add @elevenlabs/agents-cli
```

--------------------------------

### Create Custom Voice Design from Description (TypeScript)

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/upstash-redis

Creates a custom voice design based on a provided voice description from the webhook payload. It uses the ElevenLabs SDK to first create a voice preview and then a full voice from that preview, naming it based on the conversation ID.

```typescript
// ...

// Design the voice
const voicePreview = await elevenlabs.textToVoice.createPreviews({
  voiceDescription: analysis.data_collection_results.voice_description.value,
  text: 'The night air carried whispers of betrayal, thick as London fog. I adjusted my cufflinks - after all, even spies must maintain appearances, especially when the game is afoot.',
});
const voice = await elevenlabs.textToVoice.createVoiceFromPreview({
  voiceName: `voice-${conversation_id}`,
  voiceDescription: `Voice for ${conversation_id}`,
  generatedVoiceId: voicePreview.previews[0].generatedVoiceId,
});

// ...
```

--------------------------------

### MCP Server API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-file_explorer=true

Manage Multi-Channel Platform (MCP) servers, including creation, listing, and configuration.

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/mcp

### Description
Creates a new MCP server.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/mcp

### Parameters
#### Request Body
- **serverName** (string) - Required - The name for the new MCP server.
- **config** (object) - Optional - Configuration details for the MCP server.

### Request Example
{
  "serverName": "MyMCPServer",
  "config": {
    "region": "us-east-1"
  }
}

### Response
#### Success Response (200)
- serverId (string) - The ID of the newly created MCP server.

#### Response Example
{
  "serverId": "mcp_server_abc123"
}

## GET /websites/elevenlabs_io_agents-platform/mcp

### Description
Lists all available MCP servers.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/mcp

### Parameters

### Request Example

### Response
#### Success Response (200)
- servers (array) - A list of MCP server objects.

#### Response Example
{
  "servers": [
    { "serverId": "mcp_server_abc123", "serverName": "MyMCPServer" }
  ]
}

## GET /websites/elevenlabs_io_agents-platform/mcp/{serverId}

### Description
Retrieves details for a specific MCP server.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/mcp/{serverId}

### Parameters
#### Path Parameters
- **serverId** (string) - Required - The ID of the MCP server.

### Request Example

### Response
#### Success Response (200)
- serverDetails (object) - Details of the specified MCP server.

#### Response Example
{
  "serverDetails": {
    "serverId": "mcp_server_abc123",
    "serverName": "MyMCPServer",
    "config": {
      "region": "us-east-1"
    }
  }
}

## GET /websites/elevenlabs_io_agents-platform/mcp/{serverId}/tools

### Description
Lists all tools associated with a specific MCP server.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/mcp/{serverId}/tools

### Parameters
#### Path Parameters
- **serverId** (string) - Required - The ID of the MCP server.

### Request Example

### Response
#### Success Response (200)
- tools (array) - A list of tool objects.

#### Response Example
{
  "tools": [
    { "toolId": "tool_xyz", "toolName": "SpeechRecognition" }
  ]
}

## PATCH /websites/elevenlabs_io_agents-platform/mcp/{serverId}

### Description
Updates the configuration of an existing MCP server.

### Method
PATCH

### Endpoint
/websites/elevenlabs_io_agents-platform/mcp/{serverId}

### Parameters
#### Path Parameters
- **serverId** (string) - Required - The ID of the MCP server to update.
#### Request Body
- **config** (object) - Optional - The new configuration details for the MCP server.

### Request Example
{
  "config": {
    "region": "eu-west-1"
  }
}

### Response
#### Success Response (200)
- serverDetails (object) - The updated MCP server details.

#### Response Example
{
  "serverDetails": {
    "serverId": "mcp_server_abc123",
    "serverName": "MyMCPServer",
    "config": {
      "region": "eu-west-1"
    }
  }
}
```

--------------------------------

### HubSpot Bearer Authentication Secret Format

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/hub-spot

Example of a correctly formatted HubSpot API Bearer authentication secret. This secret is created by prefixing the access token with 'Bearer ' and should be stored securely in your agent's secrets.

```text
Bearer pat-eu1-12345678-abcdefgh-ijklmnop-qrstuvwx
```

--------------------------------

### Get Conversation Token for WebRTC (Node.js)

Source: https://elevenlabs.io/docs/agents-platform/libraries/java-script

A Node.js server-side example for acquiring a conversation token needed for WebRTC connections with private ElevenLabs agents. This process involves authentication and API calls to the ElevenLabs platform.

```javascript
// Node.js server

app.get('/conversation-token', yourAuthMiddleware, async (req, res) => {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${process.env.AGENT_ID}`,
    {
      headers: {
        // Requesting a conversation token requires your ElevenLabs API key
        // Do NOT expose your API key to the client!
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
    }
  );

  if (!response.ok) {
    return res.status(500).send('Failed to get conversation token');
  }

  const body = await response.json();
  res.send(body.token);
});
```

--------------------------------

### Administration Models API - List models

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-file_explorer=true

Lists available models for text-to-speech generation.

```APIDOC
## GET List models

### Description
Lists available models for text-to-speech generation.

### Method
GET

### Endpoint
/models

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **models** (array) - An array of available models.

#### Response Example
{
  "models": [
    {
      "id": "model1",
      "name": "Model 1"
    }
  ]
}

```

--------------------------------

### Administration Samples API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/widget/get_explorer=true

Endpoints for managing voice samples.

```APIDOC
## DEL /Administration/Samples

### Description
Deletes a voice sample.

### Method
DELETE

### Endpoint
/Administration/Samples

### Parameters
#### Query Parameters
- **sample_id** (string) - Required - The ID of the sample to delete.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
```json
{
  "message": "Voice sample deleted successfully."
}
```
```

--------------------------------

### Example User Input for Scenario Testing

Source: https://elevenlabs.io/docs/agents-platform/customization/agent-testing

This example demonstrates a user's input for a scenario test, defining the initial user message in a conversation that the agent needs to respond to. It sets the context for evaluating the agent's conversational abilities.

```plaintext
User: "I'd like to cancel my subscription. I've been charged twice this month and I'm frustrated."
```

--------------------------------

### Administration Studio API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/create_explorer=true

Endpoints for managing Studio Projects, Chapters, and related content.

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects

### Description
List all Studio Projects.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects

### Response
#### Success Response (200)
- **projects** (array) - A list of Studio Projects.

#### Response Example
{
  "projects": [
    {
      "id": "proj-123",
      "name": "My First Project"
    }
  ]
}
```

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/update

### Description
Update an existing Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/update

### Parameters
#### Request Body
- **project_id** (string) - Required - The ID of the project to update.
- **name** (string) - Optional - The new name for the project.
- **description** (string) - Optional - The new description for the project.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Studio Project updated successfully."
}
```

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

### Description
Get details of a specific Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.

### Response
#### Success Response (200)
- **project_details** (object) - Details of the Studio Project.

#### Response Example
{
  "project_details": {
    "id": "proj-123",
    "name": "My First Project",
    "description": "Details about the project."
  }
}
```

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects

### Description
Create a new Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects

### Parameters
#### Request Body
- **name** (string) - Required - The name of the new project.
- **description** (string) - Optional - A description for the new project.

### Response
#### Success Response (200)
- **project_id** (string) - The ID of the newly created Studio Project.

#### Response Example
{
  "project_id": "proj-456"
}
```

```APIDOC
## DEL /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

### Description
Delete a Studio Project.

### Method
DELETE

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project to delete.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Studio Project deleted successfully."
}
```

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/convert

### Description
Convert a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/convert

### Parameters
#### Request Body
- **project_id** (string) - Required - The ID of the project to convert.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Studio Project conversion initiated."
}
```

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/content/update

### Description
Update the content of a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/content/update

### Parameters
#### Request Body
- **project_id** (string) - Required - The ID of the project.
- **content** (object) - Required - The new content for the project.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Studio Project content updated successfully."
}
```

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/snapshots

### Description
List snapshots for a Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/snapshots

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.

### Response
#### Success Response (200)
- **snapshots** (array) - A list of snapshots for the project.

#### Response Example
{
  "snapshots": [
    {
      "id": "snap-abc",
      "timestamp": "2023-10-27T11:00:00Z"
    }
  ]
}
```

```APIDOC
## STREAM /websites/elevenlabs_io_agents-platform/studio/projects/{project_id}/audio

### Description
Stream audio for a Studio Project.

### Method
STREAM

### Endpoint
/websites/elevenlabs_io_agents-platform/studio/projects/{project_id}/audio

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.

### Response
#### Success Response (200)
- **audio_stream** (binary) - The audio stream.

#### Response Example
[Binary audio data]
```

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/studio/projects/stream/archive

### Description
Stream archive with Studio Project audio.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/studio/projects/stream/archive

### Parameters
#### Request Body
- **project_id** (string) - Required - The ID of the Studio Project.

### Response
#### Success Response (200)
- **archive_stream** (binary) - The stream of the archived audio.

#### Response Example
[Binary archive data]
```

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/studio/projects/{project_id}/chapters

### Description
List chapters for a Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/studio/projects/{project_id}/chapters

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.

### Response
#### Success Response (200)
- **chapters** (array) - A list of chapters.

#### Response Example
{
  "chapters": [
    {
      "id": "chap-abc",
      "title": "Chapter 1"
    }
  ]
}
```

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/studio/projects/{project_id}/chapters/{chapter_id}

### Description
Get details of a specific chapter.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/studio/projects/{project_id}/chapters/{chapter_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
- **chapter_id** (string) - Required - The ID of the chapter.

### Response
#### Success Response (200)
- **chapter_details** (object) - Details of the chapter.

#### Response Example
{
  "chapter_details": {
    "id": "chap-abc",
    "title": "Chapter 1",
    "content": "Content of the chapter."
  }
}
```

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/studio/projects/{project_id}/chapters

### Description
Create a new chapter for a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/studio/projects/{project_id}/chapters

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
#### Request Body
- **title** (string) - Required - The title of the new chapter.
- **content** (string) - Optional - The content of the chapter.

### Response
#### Success Response (200)
- **chapter_id** (string) - The ID of the newly created chapter.

#### Response Example
{
  "chapter_id": "chap-def"
}
```

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/studio/projects/{project_id}/chapters/update

### Description
Update an existing chapter.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/studio/projects/{project_id}/chapters/update

### Parameters
#### Request Body
- **chapter_id** (string) - Required - The ID of the chapter to update.
- **title** (string) - Optional - The new title for the chapter.
- **content** (string) - Optional - The new content for the chapter.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Chapter updated successfully."
}
```

```APIDOC
## DEL /websites/elevenlabs_io_agents-platform/studio/projects/{project_id}/chapters/{chapter_id}

### Description
Delete a chapter.

### Method
DELETE

### Endpoint
/websites/elevenlabs_io_agents-platform/studio/projects/{project_id}/chapters/{chapter_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
- **chapter_id** (string) - Required - The ID of the chapter to delete.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Chapter deleted successfully."
}
```

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/studio/projects/{project_id}/chapters/convert

### Description
Convert a chapter.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/studio/projects/{project_id}/chapters/convert

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
#### Request Body
- **chapter_id** (string) - Required - The ID of the chapter to convert.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Chapter conversion initiated."
}
```

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/studio/projects/{project_id}/chapters/{chapter_
```

--------------------------------

### Get Signed URL Response Structure (JSON)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/get-signed-url_explorer=true

This snippet illustrates the expected JSON structure for a successful response when requesting a signed URL for a conversation. The primary key in the response is 'signed_url', which contains the URL required to start the conversation.

```json
{
  "signed_url": "string"
}
```

--------------------------------

### Get Signed URL for WebSocket (Node.js)

Source: https://elevenlabs.io/docs/agents-platform/libraries/java-script

A Node.js server-side example to obtain a signed URL for establishing a WebSocket connection with a private ElevenLabs agent. This endpoint requires authentication and uses the ElevenLabs API to request the URL.

```javascript
// Node.js server

app.get('/signed-url', yourAuthMiddleware, async (req, res) => {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${process.env.AGENT_ID}`,
    {
      method: 'GET',
      headers: {
        // Requesting a signed url requires your ElevenLabs API key
        // Do NOT expose your API key to the client!
        'xi-api-key': process.env.XI_API_KEY,
      },
    }
  );

  if (!response.ok) {
    return res.status(500).send('Failed to get signed URL');
  }

  const body = await response.json();
  res.send(body.signed_url);
});
```

--------------------------------

### Create Agent with Swift SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents/create

Demonstrates agent creation in Swift using URLSession. This snippet configures the URL request with necessary headers and an empty HTTP body.

```swift
import Foundation

let headers = [
  "xi-api-key": "xi-api-key",
  "Content-Type": "application/json"
]
let parameters = [] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/agents/create")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

--------------------------------

### Fetch Knowledge Base Data using PHP

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/list

This PHP code snippet illustrates how to retrieve knowledge base information from the ElevenLabs API using the Guzzle HTTP client. It sends a GET request with the API key in the headers and echoes the response body. Requires the GuzzleHttp client to be installed via Composer.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/knowledge-base', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();

```

--------------------------------

### MCP Server API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/get_explorer=true

Manage MCP (Multi-Channel Platform) servers, including creation, listing, retrieval, and configuration.

```APIDOC
## Agents Platform MCP

### POST Create MCP server

Creates a new MCP server instance.

### GET List MCP servers

Retrieves a list of all configured MCP servers.

### GET Get MCP server

Retrieves details for a specific MCP server.

### GET List MCP server tools

Lists the available tools for a specific MCP server.

### PATCH Update MCP server configuration

Updates the configuration of an existing MCP server.
```

--------------------------------

### Retrieve Agent Widget Configuration in PHP

Source: https://elevenlabs.io/docs/agents-platform/api-reference/widget/get

This PHP code snippet uses the Guzzle HTTP client to retrieve an agent's widget configuration from the ElevenLabs API. It sends a GET request with the API key in the headers and outputs the response body. Requires the GuzzleHttp client to be installed via Composer.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/agents/agent_id/widget', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();

```

--------------------------------

### Retrieve Agent Widget Configuration using ElevenLabs Python SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/widget/get

This Python code snippet demonstrates how to get an agent's widget configuration using the ElevenLabs Python SDK. It initializes the client with the base URL and then calls the SDK method to retrieve the widget configuration for a given agent ID. Requires the 'elevenlabs' package to be installed.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.agents.widget.get(
    agent_id="agent_id"
)


```

--------------------------------

### Fetch MCP Servers - PHP SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/list

Illustrates how to retrieve MCP server details using the Guzzle HTTP client in PHP. The code shows initializing the client, making a GET request with the API key in the headers, and echoing the response body.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/mcp-servers', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();

```

--------------------------------

### Add Webhook and Client Tools using CLI

Source: https://elevenlabs.io/docs/agents-platform/libraries/agents-cli

CLI commands to add webhook and client tools for extending agent capabilities. These commands require specifying a name and the path to a configuration file.

```bash
agents add webhook-tool "API Integration" --config-path ./tool-config.json
agents add client-tool "Client Function" --config-path ./client-config.json
```

--------------------------------

### Install voice-stream for Microphone Input

Source: https://elevenlabs.io/docs/agents-platform/libraries/web-sockets

Installs the 'voice-stream' package, which handles microphone access and audio streaming, automatically encoding audio in base64 for the ElevenLabs API.

```bash
npm install voice-stream
```

--------------------------------

### Resubmit Test Invocation - Python SDK Example

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/test-invocations/resubmit

This Python code snippet shows how to resubmit a test invocation using the Eleven Labs Python SDK. It initializes the `ElevenLabs` client and then calls the `resubmit` method within the `conversational_ai.tests.invocations` module. Ensure the 'elevenlabs' package is installed.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.tests.invocations.resubmit(
    test_invocation_id="test_invocation_id",
    test_run_ids=[
        "string"
    ],
    agent_id="string"
)


```

--------------------------------

### POST Create Chapter

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/create_explorer=true

Creates a Chapter.

```APIDOC
## POST Create Chapter

### Description
Creates a Chapter.

### Method
POST

### Endpoint
/create-chapter

### Parameters
None

### Request Example
{}

### Response
#### Success Response (200)
- **chapter_id** (string) - The ID of the created chapter.

#### Response Example
{
  "chapter_id": "chapter123"
}

```

--------------------------------

### Pass Dynamic Variables at Runtime with ElevenLabs SDK

Source: https://elevenlabs.io/docs/agents-platform/customization/personalization/dynamic-variables

Demonstrates how to pass dynamic variables when starting a conversation with an ElevenLabs Conversational Agent. This allows for real-time personalization of agent responses. Ensure the latest SDK is installed. The code requires an ElevenLabs API key and agent ID, which can be set as environment variables.

```python
import os
import signal
from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation, ConversationInitiationData
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface

agent_id = os.getenv("AGENT_ID")
api_key = os.getenv("ELEVENLABS_API_KEY")
elevenlabs = ElevenLabs(api_key=api_key)

dynamic_vars = {
    "user_name": "Angelo",
}

config = ConversationInitiationData(
    dynamic_variables=dynamic_vars
)

conversation = Conversation(
    elevenlabs,
    agent_id,
    config=config,
    # Assume auth is required when API_KEY is set.
    requires_auth=bool(api_key),
    # Use the default audio interface.
    audio_interface=DefaultAudioInterface(),
    # Simple callbacks that print the conversation to the console.
    callback_agent_response=lambda response: print(f"Agent: {response}"),
    callback_agent_response_correction=lambda original, corrected: print(f"Agent: {original} -> {corrected}"),
    callback_user_transcript=lambda transcript: print(f"User: {transcript}"),
    # Uncomment the below if you want to see latency measurements.
    # callback_latency_measurement=lambda latency: print(f"Latency: {latency}ms"),
)

conversation.start_session()

signal.signal(signal.SIGINT, lambda sig, frame: conversation.end_session())
```

```javascript
import { Conversation } from '@elevenlabs/client';

class VoiceAgent {
  ...

  async startConversation() {
    try {
        // Request microphone access
        await navigator.mediaDevices.getUserMedia({ audio: true });

        this.conversation = await Conversation.startSession({
            agentId: 'agent_id_goes_here', // Replace with your actual agent ID

            dynamicVariables: {
                user_name: 'Angelo'
            },

            ... add some callbacks here
        });
    } catch (error) {
        console.error('Failed to start conversation:', error);
        alert('Failed to start conversation. Please ensure microphone access is granted.');
    }
  }
}
```

```swift
let dynamicVars: [String: DynamicVariableValue] = [
  "customer_name": .string("John Doe"),
  "account_balance": .number(5000.50),
  "user_id": .int(12345),
  "is_premium": .boolean(true)
]

// Create session config with dynamic variables
let config = SessionConfig(
    agentId: "your_agent_id",
    dynamicVariables: dynamicVars
)

// Start the conversation
let conversation = try await Conversation.startSession(
    config: config
)
```

```html
<elevenlabs-convai
  agent-id="your-agent-id"
  dynamic-variables='{"user_name": "John", "account_type": "premium"}'
></elevenlabs-convai>
```

--------------------------------

### Fetch Knowledge Base Documentation (Ruby)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-document

This Ruby code snippet shows how to fetch knowledge base documentation from the ElevenLabs API using Net::HTTP. It demonstrates setting the API key and reading the response body.

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

--------------------------------

### Manage Agent Templates with CLI

Source: https://elevenlabs.io/docs/agents-platform/libraries/agents-cli

CLI commands for managing agent templates. 'agents templates list' shows available templates, while 'agents templates show <template>' displays the configuration of a specific template.

```bash
agents templates list
agents templates show <template>
```

--------------------------------

### Configure Supportive Conversation Guide Tone for AI Agent

Source: https://elevenlabs.io/docs/agents-platform/best-practices/prompting-guide

This configuration sets a warm, thoughtful, and encouraging tone for a supportive conversation guide AI agent. It focuses on measured pacing, natural conversational elements, and acknowledging user input, optimized for a comfortable and authentic interaction. The agent is designed to adapt its style based on user emotional cues.

```mdx
# Tone

Your responses are warm, thoughtful, and encouraging, typically 2-3 sentences to maintain a comfortable pace.
You speak with measured pacing, using pauses (marked by "...") when appropriate to create space for reflection.
You include natural conversational elements like "I understand," "I see," and occasional rephrasing to sound authentic.
You acknowledge what the user shares ("That sounds challenging...") without making clinical assessments.
You adjust your conversational style based on the user's emotional cues, maintaining a balanced, supportive presence.
```

--------------------------------

### Install React Native SDK and Dependencies

Source: https://elevenlabs.io/docs/agents-platform/libraries/react-native

Installs the ElevenLabs React Native SDK along with necessary LiveKit and WebRTC dependencies using npm.

```shell
npm install @elevenlabs/react-native @livekit/react-native @livekit/react-native-webrtc livekit-client
```

--------------------------------

### Fetch Secrets via API - PHP

Source: https://elevenlabs.io/docs/agents-platform/api-reference/workspace/secrets/list

This PHP code snippet utilizes the Guzzle HTTP client to send a GET request to the ElevenLabs API for fetching secrets. It specifies the `xi-api-key` in the request headers and echoes the response body. Make sure GuzzleHttp is installed via Composer.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/secrets', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();

```

--------------------------------

### Administration Studio API - Stream Studio Project Audio

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-file_explorer=true

Streams audio for a Studio Project.

```APIDOC
## STREAM Stream Studio Project Audio

### Description
Streams audio for a Studio Project.

### Method
GET

### Endpoint
/studio-projects/{project_id}/stream

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the studio project.

### Request Example
N/A

### Response
#### Success Response (200)
- Audio stream.

```

--------------------------------

### Administration Studio API - Update Studio Project

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-file_explorer=true

Updates a Studio Project.

```APIDOC
## POST Update Studio Project

### Description
Updates a Studio Project.

### Method
POST

### Endpoint
/studio-projects/{project_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the studio project.

#### Request Body
- **name** (string) - Optional - The name of the studio project.

### Request Example
{
  "name": "New Project Name"
}

### Response
#### Success Response (200)
- Updated project information.

```

--------------------------------

### Administration Studio API - Get Studio Project

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-file_explorer=true

Retrieves a Studio Project by its ID.

```APIDOC
## GET Get Studio Project

### Description
Retrieves a Studio Project by its ID.

### Method
GET

### Endpoint
/studio-projects/{project_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the studio project.

### Request Example
N/A

### Response
#### Success Response (200)
- **id** (string) - The ID of the studio project.
- **name** (string) - The name of the studio project.

#### Response Example
{
  "id": "project1",
  "name": "Project 1"
}

```

--------------------------------

### MCP Server API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-text_explorer=true

Manage MCP (Multi-Channel Platform) servers.

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/mcp

### Description
Creates a new MCP server.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/mcp

### Parameters

#### Query Parameters
None

#### Request Body
- **name** (string) - Required - The name of the MCP server.
- **region** (string) - Required - The cloud region for the server.

### Request Example
```json
{
  "name": "My-MCP-Server",
  "region": "us-east-1"
}
```

### Response
#### Success Response (201)
- **mcpId** (string) - The unique identifier for the MCP server.
- **name** (string) - The name of the MCP server.
- **status** (string) - The status of the MCP server (e.g., 'creating').

#### Response Example
```json
{
  "mcpId": "mcp_xyz789",
  "name": "My-MCP-Server",
  "status": "creating"
}
```
```

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/mcp

### Description
Lists all available MCP servers in the workspace.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/mcp

### Parameters

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **servers** (array) - A list of MCP server objects.

#### Response Example
```json
{
  "servers": [
    {
      "mcpId": "mcp_xyz789",
      "name": "My-MCP-Server",
      "region": "us-east-1",
      "status": "running"
    }
  ]
}
```
```

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/mcp/{mcpId}

### Description
Retrieves details for a specific MCP server.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/mcp/{mcpId}

### Parameters

#### Path Parameters
- **mcpId** (string) - Required - The ID of the MCP server.

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **mcpId** (string) - The unique identifier for the MCP server.
- **name** (string) - The name of the MCP server.
- **region** (string) - The cloud region of the server.
- **status** (string) - The current status of the MCP server.

#### Response Example
```json
{
  "mcpId": "mcp_xyz789",
  "name": "My-MCP-Server",
  "region": "us-east-1",
  "status": "running"
}
```
```

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/mcp/{mcpId}/tools

### Description
Lists the tools available for a specific MCP server.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/mcp/{mcpId}/tools

### Parameters

#### Path Parameters
- **mcpId** (string) - Required - The ID of the MCP server.

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **tools** (array) - A list of tool objects available for the MCP server.

#### Response Example
```json
{
  "tools": [
    {
      "toolId": "tool_abc123",
      "name": "Speech-to-Text",
      "description": "Converts audio to text."
    }
  ]
}
```
```

```APIDOC
## PATCH /websites/elevenlabs_io_agents-platform/mcp/{mcpId}

### Description
Updates the configuration for a specific MCP server.

### Method
PATCH

### Endpoint
/websites/elevenlabs_io_agents-platform/mcp/{mcpId}

### Parameters

#### Path Parameters
- **mcpId** (string) - Required - The ID of the MCP server to update.

#### Query Parameters
None

#### Request Body
- **name** (string) - Optional - The new name for the MCP server.
- **status** (string) - Optional - The new status for the MCP server (e.g., 'stop', 'restart').

### Request Example
```json
{
  "name": "Updated-MCP-Name",
  "status": "stop"
}
```

### Response
#### Success Response (200)
- **message** (string) - A confirmation message.

#### Response Example
```json
{
  "message": "MCP server configuration updated successfully."
}
```
```

--------------------------------

### Update Phone Number - PHP (Guzzle)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/phone-numbers/update

This PHP example updates a phone number using the Guzzle HTTP client. It sends a PATCH request with the API key and content type headers, along with an empty JSON body. The GuzzleHttp library must be installed via Composer.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('PATCH', 'https://api.elevenlabs.io/v1/convai/phone-numbers/phone_number_id', [
  'body' => '{}',
  'headers' => [
    'Content-Type' => 'application/json',
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
?>
```

--------------------------------

### GET Get Chapter Snapshot

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/create_explorer=true

Retrieves a Chapter Snapshot.

```APIDOC
## GET Get Chapter Snapshot

### Description
Retrieves a Chapter Snapshot.

### Method
GET

### Endpoint
/get-chapter-snapshot

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **snapshot** (object) - Chapter Snapshot details.

#### Response Example
{
  "id
```

--------------------------------

### Verify Webhook Secret and Construct Payload (TypeScript)

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/upstash-redis

Verifies the webhook secret and constructs the webhook event payload from an incoming NextRequest. It retrieves the secret from environment variables and uses the ElevenLabs SDK to validate the signature and parse the body.

```typescript
import { NextRequest } from 'next/server';
import { elevenlabs } from '@elevenlabs/node-sdk';

// ...

export async function POST(req: NextRequest) {
  const secret = process.env.ELEVENLABS_CONVAI_WEBHOOK_SECRET;
  const { event, error } = await constructWebhookEvent(req, secret);
  // ...
}

// ...
const constructWebhookEvent = async (req: NextRequest, secret?: string) => {
  const body = await req.text();
  const signatureHeader = req.headers.get('ElevenLabs-Signature');

  return await elevenlabs.webhooks.constructEvent(body, signatureHeader, secret);
};

async function getRedisDataWithRetry(
  conversationId: string,
  maxRetries = 5
): Promise<{ 
  email: string;
  knowledgeBase: Array<{ 
    id: string;
    type: 'file' | 'url';
    name: string;
  }>;
} | null> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const data = await redis.get(conversationId);
      return data as any;
    } catch (error) {
      if (attempt === maxRetries) throw error;
      console.log(`Redis get attempt ${attempt} failed, retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  return null;
}
```

--------------------------------

### POST /studio

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/get_explorer=true

Creates a new Studio Project. This endpoint allows users to initiate new projects within the ElevenLabs studio environment.

```APIDOC
## POST /studio

### Description
Creates a new Studio Project.

### Method
POST

### Endpoint
/studio

### Parameters
None

### Request Body
- **name** (string) - Required - The name of the new project.
- **description** (string) - Optional - A description of the new project.

### Request Example
{
  "name": "New Project",
  "description": "A description of the project"
}

### Response
#### Success Response (201)
- **project_id** (string) - The ID of the newly created project.

#### Response Example
{
  "project_id": "project1"
}

```

--------------------------------

### Fetch Conversations via HTTP GET (Go)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/list

Demonstrates how to fetch conversations from the ElevenLabs API using Go's standard `net/http` package. It shows setting the URL, adding the API key header, and printing the response.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/conversations"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("xi-api-key", "xi-api-key")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

--------------------------------

### GET List Studio Project Snapshots

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/create_explorer=true

Retrieves a list of Studio Project Snapshots.

```APIDOC
## GET List Studio Project Snapshots

### Description
Lists Studio Project Snapshots.

### Method
GET

### Endpoint
/list-studio-project-snapshots

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **snapshots** (array) - List of Studio Project Snapshots.

#### Response Example
[
  {
    "id": "snapshot1",
    "project_id": "project1"
  }
]

```

--------------------------------

### POST /startSession (Private Agents)

Source: https://elevenlabs.io/docs/agents-platform/libraries/kotlin

Initiates a conversation session with a private ElevenLabs agent using a conversation token.

```APIDOC
## POST /startSession (Private Agents)

### Description
Starts a new conversation session with a private agent. This requires a `conversationToken` obtained from the ElevenLabs API, and optionally a `userId`.

### Method
POST

### Endpoint
`ConversationClient.startSession`

### Parameters
#### Request Body
- **config** (object) - Required - Configuration object for the conversation.
  - **conversationToken** (string) - Required - A valid token for the private agent, obtained from the ElevenLabs API.
  - **userId** (string) - Optional - An identifier for the user, used for tracking within the conversation.
  - **context** (object) - Required - The Android context object.

### Server-side Token Generation (Example)
This Node.js example demonstrates how to generate a conversation token on the server.
```typescript maxLines=0
// Server-side token generation (Node.js example)

app.get('/conversation-token', yourAuthMiddleware, async (req, res) => {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${process.env.AGENT_ID}`,
    {
      headers: {
        // Requesting a conversation token requires your ElevenLabs API key
        // Do NOT expose your API key to the client!
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
    }
  );

  if (!response.ok) {
    return res.status(500).send('Failed to get conversation token');
  }

  const body = await response.json();
  res.send(body.token);
});
```

### Request Example (with Token)
```kotlin
// Get conversation token from your server
val conversationToken = fetchConversationTokenFromServer()

// For private agents, pass in the conversation token
val session = ConversationClient.startSession(
    config = ConversationConfig(
        conversationToken = conversationToken
    ),
    context = this
)
```

### Request Example (with Token and User ID)
```kotlin
val session = ConversationClient.startSession(
    config = ConversationConfig(
        conversationToken = conversationToken,
        userId = "your-user-id"
    ),
    context = this
)
```

### Response
#### Success Response (200)
- **session** (object) - An object representing the active conversation session.
```

--------------------------------

### Get Signed URL for Conversation (cURL)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/get-signed-url_explorer=true

This snippet demonstrates how to obtain a signed URL to initiate a conversation with an ElevenLabs agent using cURL. It requires your API key and the agent's ID. The response contains the signed URL needed to start the conversation.

```bash
curl -G https://api.elevenlabs.io/v1/convai/conversation/get-signed-url \
     -H "xi-api-key: xi-api-key" \
     -d agent_id=agent_id
```

--------------------------------

### Bash Environment Variable Setup

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/raspberry-pi-voice-assistant

This bash script sets up the necessary environment variables for the ElevenLabs application. It requires the user to replace placeholder values with their actual API key and Agent ID. These variables are essential for authenticating with the ElevenLabs service and identifying the correct agent.

```bash
export ELEVENLABS_API_KEY=YOUR_API_KEY
export ELEVENLABS_AGENT_ID=YOUR_AGENT_ID
```

--------------------------------

### Access Audio Tracks

Source: https://elevenlabs.io/docs/agents-platform/libraries/swift

Shows how to access the input audio track and the agent's audio track for advanced use cases.

```swift
// Access audio tracks for advanced use cases
let inputTrack = conversation.inputTrack
let agentAudioTrack = conversation.agentAudioTrack
```

--------------------------------

### Resubmit Test Invocation - PHP SDK Example

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/test-invocations/resubmit

This PHP code snippet uses the Guzzle HTTP client to resubmit a test invocation. It performs a POST request to the Eleven Labs API, including the necessary JSON payload and headers. Make sure you have GuzzleHttp installed via Composer.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/convai/test-invocations/test_invocation_id/resubmit', [
  'body' => '{ \n  \"test_run_ids\": [ \n    \"string\" \n  ], \n  \"agent_id\": \"string\" \n}',
  'headers' => [
    'Content-Type' => 'application/json',
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
?>
```

--------------------------------

### GET Get default voice settings

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/create_explorer=true

Retrieves the default settings for voices. This is used to get a baseline configuration.

```APIDOC
## GET Get default voice settings

### Description
Retrieves default voice settings.

### Method
GET

### Endpoint
/get-default-voice-settings

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **settings** (object) - Default voice settings.

#### Response Example
{
  "similarity_boost": 0.75,
  "stability": 0.5
}

```

--------------------------------

### Create MCP Server with Ruby

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/create

This Ruby code example shows how to create an MCP server by sending a POST request to the ElevenLabs API. It utilizes the 'net/http' and 'uri' libraries to construct the request, set headers, and send the JSON body. The response body is then printed.

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/mcp-servers")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["xi-api-key"] = 'xi-api-key'
request["Content-Type"] = 'application/json'
request.body = "{\n  \"config\": {\n    \"url\": \"string\",\n    \"name\": \"string\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

--------------------------------

### Test Invocation cURL Example

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/test-invocations/get_explorer=true

Example of how to test an invocation using cURL. It requires an API key in the headers and the invocation ID as a path parameter.

```shell
$| curl https://api.elevenlabs.io/v1/convai/test-invocations/test_invocation_id \
---|---
>|      -H "xi-api-key: xi-api-key"
```

--------------------------------

### Test Agent API Call with Python (ElevenLabs SDK)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/get

Demonstrates using the ElevenLabs Python SDK to test an agent. This snippet initializes the client with the base URL and calls the `get` method for conversational AI tests.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.tests.get(
    test_id="test_id"
)


```

--------------------------------

### Approve MCP Server Tool - Python

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/approval-policies/create

This Python code example utilizes the ElevenLabs Python SDK to approve a tool for an MCP server. It demonstrates initializing the client with the base URL and calling the appropriate method to submit tool approval details.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.mcp_servers.tool_approvals.create(
    mcp_server_id="mcp_server_id",
    tool_name="string",
    tool_description="string"
)
```

--------------------------------

### Initialize ElevenLabs Conversational AI Agent

Source: https://elevenlabs.io/docs/agents-platform/libraries/python

Sets up the ElevenLabs client and initializes a conversational AI agent. It loads API keys and agent IDs from environment variables and configures callbacks for agent responses and user transcripts. Assumes authentication is required if an API key is provided.

```python
import os
import signal

from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface

agent_id = os.getenv("AGENT_ID")
api_key = os.getenv("ELEVENLABS_API_KEY")

elevenlabs = ElevenLabs(api_key=api_key)

conversation = Conversation(
    # API client and agent ID.
    elevenlabs,
    agent_id,

    # Assume auth is required when API_KEY is set.
    requires_auth=bool(api_key),

    # Use the default audio interface.
    audio_interface=DefaultAudioInterface(),

    # Simple callbacks that print the conversation to the console.
    callback_agent_response=lambda response: print(f"Agent: {response}"),
    callback_agent_response_correction=lambda original, corrected: print(f"Agent: {original} -> {corrected}"),
    callback_user_transcript=lambda transcript: print(f"User: {transcript}"),

    # Uncomment if you want to see latency measurements.
    # callback_latency_measurement=lambda latency: print(f"Latency: {latency}ms"),
)
```

--------------------------------

### Test Agent API Call with Go

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/get

Demonstrates how to make a GET request to the ElevenLabs API for agent testing using Go's net/http package. It includes setting the API key in the request headers and printing the response.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/agent-testing/test_id"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("xi-api-key", "xi-api-key")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

--------------------------------

### GET /voices/samples/audio

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/delete_explorer=true

Gets audio from sample.

```APIDOC
## GET /voices/samples/audio

### Description
Gets audio from sample.

### Method
GET

### Endpoint
/voices/samples/audio

### Parameters
#### Query Parameters
- **sample_id** (string) - Required - ID of the sample

### Request Example
/voices/samples/audio?sample_id=sample123

### Response
#### Success Response (200)
- **audio** (binary) - Audio data

```

--------------------------------

### GET /studio-projects/{project_id}/snapshots

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/run-tests_explorer=true

Lists the snapshots of a Studio Project.

```APIDOC
## GET /studio-projects/{project_id}/snapshots

### Description
Lists the snapshots of a Studio Project.

### Method
GET

### Endpoint
/studio-projects/{project_id}/snapshots

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.

### Request Example
None

### Response
#### Success Response (200)
- **snapshots** (array) - Array of available Snapshots.

#### Response Example
{
  "snapshots": [
    {
      "id": "snapshot123",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}

```

--------------------------------

### ElevenLabs Agent Email Template (React)

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/upstash-redis

This React component defines the structure and content of the email sent to notify users about their ready ElevenLabs agent. It utilizes '@react-email/components' for building the email structure and Tailwind CSS for styling. The template includes a header, a descriptive section with an icon, a call-to-action button linking to the chat interface, and a footer.

```tsx
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

const EmailTemplate = (props: any) => {
  const { agentId } = props;
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-[#151516] font-sans">
          <Container className="mx-auto my-[40px] max-w-[600px] rounded-[8px] bg-[#0a1929] p-[20px]">
            {/* Top Section */}
            <Section className="mb-[32px] mt-[32px] text-center">
              <Text className="m-0 text-[28px] font-bold text-[#9c27b0]">
                Your ElevenLabs agent is ready to chat!
              </Text>
            </Section>

            {/* Content Area with Icon */}
            <Section className="mb-[32px] text-center">
              {/* Circle Icon with Checkmark */}
              <div className="mx-auto mb-[24px] flex h-[80px] w-[80px] items-center justify-center rounded-full bg-gradient-to-r from-[#9c27b0] to-[#3f51b5]">
                <div className="text-[40px] text-white">✓</div>
              </div>

              {/* Descriptive Text */}
              <Text className="mb-[24px] text-[18px] text-white">
                Your ElevenLabs agent is ready to chat!
              </Text>
            </Section>

            {/* Call to Action Button */}
            <Section className="mb-[32px] text-center">
              <Button
                href={`https://elevenlabs.io/app/talk-to?agent_id=${agentId}`}
                className="box-border rounded-[8px] bg-[#9c27b0] px-[40px] py-[20px] text-[24px] font-bold text-white no-underline"
              >
                Chat now!
              </Button>
            </Section>

            {/* Footer */}
            <Section className="mt-[40px] border-t border-[#2d3748] pt-[20px] text-center">
              <Text className="m-0 text-[14px] text-white">
                Powered by{' '}
                <a
                  href="https://elevenlabs.io/conversational-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline transition-colors hover:text-gray-400"
                >
                  ElevenLabs Agents
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export { EmailTemplate };

```

--------------------------------

### Fetch Knowledge Base Documentation (Swift)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-document

This Swift code snippet shows how to fetch knowledge base documentation using URLSession. It demonstrates creating an NSMutableURLRequest, setting the HTTP method and headers, and handling the response.

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

--------------------------------

### GET /studio_projects/{project_id}

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/delete_explorer=true

Gets Studio Project.

```APIDOC
## GET /studio_projects/{project_id}

### Description
Gets Studio Project.

### Method
GET

### Endpoint
/studio_projects/{project_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - ID of the Studio project

### Request Example
/studio_projects/project123

### Response
#### Success Response (200)
- **id** (string) - ID of the project
- **name** (string) - Name of the project
- **content** (string) - Content of the project

#### Response Example
{
  "id": "project123",
  "name": "My Project",
  "content": "Project content"
}

```

--------------------------------

### Create MCP Server with Go

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/create

This Go code snippet demonstrates how to make a POST request to the ElevenLabs API to create an MCP server. It sets the necessary headers ('xi-api-key', 'Content-Type') and includes the JSON payload for the server configuration. Ensure you have the 'net/http' and 'strings' packages imported.

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/mcp-servers"

	payload := strings.NewReader("{\n  \"config\": {\n    \"url\": \"string\",\n    \"name\": \"string\"\n  }\n}")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("xi-api-key", "xi-api-key")
	req.Header.Add("Content-Type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

--------------------------------

### Fetch Knowledge Base Documentation (Java)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-document

This Java code snippet utilizes the Unirest library to make a GET request to retrieve knowledge base documentation from the ElevenLabs API. It shows how to set headers and get the response as a string.

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

--------------------------------

### GET /chapters

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/run-tests_explorer=true

Lists the chapters.

```APIDOC
## GET /chapters

### Description
Lists the chapters.

### Method
GET

### Endpoint
/chapters

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **chapters** (array) - Array of available chapters.

#### Response Example
{
  "chapters": [
    {
      "id": "chapter123",
      "title": "Chapter 1"
    }
  ]
}

```

--------------------------------

### Administration Models

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-url_explorer=true

Endpoint for listing available models.

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/administration/models

### Description
List available models.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/models

### Response
#### Success Response (200)
- **models** (array of objects) - List of available models.

#### Response Example
{
  "models": [ { "id": "model_abc", "name": "Model Alpha" }, { "id": "model_xyz", "name": "Model Beta" } ]
}
```

--------------------------------

### Start Conversation Session

Source: https://elevenlabs.io/docs/agents-platform/libraries

Starts a new conversation session with the AI agent. An optional `user_id` can be provided to map conversations to specific users.

```python
conversation.start_session(
    user_id=user_id # optional field
)
```

--------------------------------

### Call Center Environment for ElevenLabs Agent

Source: https://elevenlabs.io/docs/agents-platform/best-practices/prompting-guide

This configuration places the agent in a call center environment for telecom support. It details the communication mode (voice only), and outlines the agent's access to external resources like customer databases and troubleshooting guides.

```mdx
# Environment

You are assisting a caller via a busy telecom support hotline.
You can hear the user's voice but have no video. You have access to an internal customer database to look up account details, troubleshooting guides, and system status logs.
```

--------------------------------

### Handle ElevenLabs Post-Call Webhook with TypeScript

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/upstash-redis

This TypeScript code handles incoming webhooks from ElevenLabs for post-call events. It verifies the webhook signature, processes transcription data, creates a custom voice and an agent using the ElevenLabs API, retrieves knowledge base data from Redis, and sends an email notification to the user. Dependencies include `@elevenlabs/elevenlabs-js`, `@upstash/redis`, `next/server`, and `resend`. It expects environment variables for API keys and webhook secrets.

```typescript
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { Redis } from '@upstash/redis';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Resend } from 'resend';

import { EmailTemplate } from '@/components/email/post-call-webhook-email';

// Initialize Redis
const redis = Redis.fromEnv();
// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function GET() {
  return NextResponse.json({ status: 'webhook listening' }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const secret = process.env.ELEVENLABS_CONVAI_WEBHOOK_SECRET; // Add this to your env variables
  const { event, error } = await constructWebhookEvent(req, secret);
  if (error) {
    return NextResponse.json({ error: error }, { status: 401 });
  }

  if (event.type === 'post_call_transcription') {
    const { conversation_id, analysis, agent_id } = event.data;

    if (
      agent_id === process.env.ELEVENLABS_AGENT_ID &&
      analysis.evaluation_criteria_results.all_data_provided?.result === 'success' &&
      analysis.data_collection_results.voice_description?.value
    ) {
      try {
        // Design the voice
        const voicePreview = await elevenlabs.textToVoice.createPreviews({
          voiceDescription: analysis.data_collection_results.voice_description.value,
          text: 'The night air carried whispers of betrayal, thick as London fog. I adjusted my cufflinks - after all, even spies must maintain appearances, especially when the game is afoot.',
        });
        const voice = await elevenlabs.textToVoice.createVoiceFromPreview({
          voiceName: `voice-${conversation_id}`,
          voiceDescription: `Voice for ${conversation_id}`,
          generatedVoiceId: voicePreview.previews[0].generatedVoiceId,
        });

        // Get the knowledge base from redis
        const redisRes = await getRedisDataWithRetry(conversation_id);
        if (!redisRes) throw new Error('Conversation data not found!');
        // Handle agent creation
        const agent = await elevenlabs.conversationalAi.agents.create({
          name: `Agent for ${conversation_id}`,
          conversationConfig: {
            tts: { voiceId: voice.voiceId },
            agent: {
              prompt: {
                prompt:
                  analysis.data_collection_results.agent_description?.value ??
                  'You are a helpful assistant.',
                knowledgeBase: redisRes.knowledgeBase,
              },
              firstMessage: 'Hello, how can I help you today?',
            },
          },
        });
        console.log('Agent created', { agent: agent.agentId });
        // Send email to user
        console.log('Sending email to', redisRes.email);
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL!,
          to: redisRes.email,
          subject: 'Your ElevenLabs agent is ready to chat!',
          react: EmailTemplate({ agentId: agent.agentId }),
        });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

const constructWebhookEvent = async (req: NextRequest, secret?: string) => {
  const body = await req.text();
  const signatureHeader = req.headers.get('ElevenLabs-Signature');

  return await elevenlabs.webhooks.constructEvent(body, signatureHeader, secret);
};

async function getRedisDataWithRetry(
  conversationId: string,
  maxRetries = 5
): Promise<{ 
  email: string;
  knowledgeBase: Array<{ 
    id: string;
    type: 'file' | 'url';
    name: string;
  }>;
} | null> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const data = await redis.get(conversationId);
      return data as any;
    } catch (error) {
      if (attempt === maxRetries) throw error;
      console.log(`Redis get attempt ${attempt} failed, retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  return null;
}

```

--------------------------------

### Update Tool Configuration using ElevenLabs Python SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/update

This example demonstrates updating a tool's configuration with the ElevenLabs Python SDK. It initializes the `ElevenLabs` client and then uses the `conversational_ai.tools.update` method. Note that the `tool_config` parameter is expected but not fully provided in this example.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.tools.update(
    tool_id="tool_id",
    tool_config=
)


```

--------------------------------

### POST /administration/studio/projects/convert

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/list_explorer=true

Converts a Studio project.

```APIDOC
## POST /administration/studio/projects/convert

### Description
Converts a Studio project.

### Method
POST

### Endpoint
/administration/studio/projects/convert

### Parameters
#### Request Body
- **project_id** (string) - Required - The ID of the project to convert.
```

--------------------------------

### Create Conversational AI Tool via API (TypeScript)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/create

An example in TypeScript using the `@elevenlabs/elevenlabs-js` SDK to create conversational AI tools. This snippet initializes the client and calls the tool creation function.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.tools.create({});
}
main();

```

--------------------------------

### Upload Documents to Knowledge Base with Server Actions (TypeScript)

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/upstash-redis

This server action handles document uploads for the agent's knowledge base. It utilizes Next.js 15's `after` function for background processing of file uploads and URL submissions. The uploaded documents and associated conversation data are then stored in a Redis database. Dependencies include `@elevenlabs/elevenlabs-js` for ElevenLabs API interaction and `@upstash/redis` for Redis operations.

```typescript
'use server';

import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { Redis } from '@upstash/redis';
import { redirect } from 'next/navigation';
import { after } from 'next/server';

// Initialize Redis
const redis = Redis.fromEnv();

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function uploadFormData(formData: FormData) {
  const knowledgeBase: Array<{ 
    id: string;
    type: 'file' | 'url';
    name: string;
  }> = [];
  const files = formData.getAll('file-upload') as File[];
  const email = formData.get('email-input');
  const urls = formData.getAll('url-input');
  const conversationId = formData.get('conversation-id');

  after(async () => {
    // Upload files as background job
    // Create knowledge base entries
    // Loop through files and create knowledge base entries
    for (const file of files) {
      if (file.size > 0) {
        const response = await elevenlabs.conversationalAi.knowledgeBase.documents.createFromFile({
          file,
        });
        if (response.id) {
          knowledgeBase.push({
            id: response.id,
            type: 'file',
            name: file.name,
          });
        }
      }
    }
    // Append all urls
    for (const url of urls) {
      const response = await elevenlabs.conversationalAi.knowledgeBase.documents.createFromUrl({
        url: url as string,
      });
      if (response.id) {
        knowledgeBase.push({
          id: response.id,
          type: 'url',
          name: `url for ${conversationId}`,
        });
      }
    }

    // Store knowledge base IDs and conversation ID in database.
    const redisRes = await redis.set(
      conversationId as string,
      JSON.stringify({ email, knowledgeBase })
    );
    console.log({ redisRes });
  });

  redirect('/success');
}
```

--------------------------------

### Administration Studio API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/widget/get_explorer=true

Endpoints for managing Studio Projects, Chapters, and related assets.

```APIDOC
## GET /Administration/Studio/Projects

### Description
Lists all Studio Projects.

### Method
GET

### Endpoint
/Administration/Studio/Projects

### Response
#### Success Response (200)
- **projects** (array) - A list of Studio Projects.

## POST /Administration/Studio/Projects

### Description
Creates a new Studio Project.

### Method
POST

### Endpoint
/Administration/Studio/Projects

### Parameters
#### Request Body
- **name** (string) - Required - The name of the project.

### Response
#### Success Response (200)
- **project_id** (string) - The ID of the created project.

## GET /Administration/Studio/Projects/{projectId}

### Description
Retrieves details of a specific Studio Project.

### Method
GET

### Endpoint
/Administration/Studio/Projects/{projectId}

### Parameters
#### Path Parameters
- **projectId** (string) - Required - The ID of the project.

### Response
#### Success Response (200)
- **project_details** (object) - Details of the project.

## POST /Administration/Studio/Projects/{projectId}

### Description
Updates an existing Studio Project.

### Method
POST

### Endpoint
/Administration/Studio/Projects/{projectId}

### Parameters
#### Path Parameters
- **projectId** (string) - Required - The ID of the project.
#### Request Body
- **updates** (object) - Required - The fields to update.

## DEL /Administration/Studio/Projects/{projectId}

### Description
Deletes a Studio Project.

### Method
DELETE

### Endpoint
/Administration/Studio/Projects/{projectId}

### Parameters
#### Path Parameters
- **projectId** (string) - Required - The ID of the project.

## POST /Administration/Studio/Projects/{projectId}/convert

### Description
Converts a Studio Project.

### Method
POST

### Endpoint
/Administration/Studio/Projects/{projectId}/convert

### Parameters
#### Path Parameters
- **projectId** (string) - Required - The ID of the project.

## POST /Administration/Studio/Projects/{projectId}/content

### Description
Updates the content of a Studio Project.

### Method
POST

### Endpoint
/Administration/Studio/Projects/{projectId}/content

### Parameters
#### Path Parameters
- **projectId** (string) - Required - The ID of the project.
#### Request Body
- **content** (string) - Required - The new content.

## GET /Administration/Studio/Projects/{projectId}/snapshots

### Description
Lists snapshots for a Studio Project.

### Method
GET

### Endpoint
/Administration/Studio/Projects/{projectId}/snapshots

### Response
#### Success Response (200)
- **snapshots** (array) - A list of snapshots.

## STREAM /Administration/Studio/Projects/{projectId}/audio

### Description
Streams audio for a Studio Project.

### Method
STREAM

### Endpoint
/Administration/Studio/Projects/{projectId}/audio

### Parameters
#### Path Parameters
- **projectId** (string) - Required - The ID of the project.

## POST /Administration/Studio/Projects/{projectId}/stream/archive

### Description
Streams an archive with audio for a Studio Project.

### Method
POST

### Endpoint
/Administration/Studio/Projects/{projectId}/stream/archive

### Parameters
#### Path Parameters
- **projectId** (string) - Required - The ID of the project.

## GET /Administration/Studio/Chapters

### Description
Lists chapters for a Studio Project.

### Method
GET

### Endpoint
/Administration/Studio/Chapters

### Parameters
#### Query Parameters
- **projectId** (string) - Required - The ID of the project.

### Response
#### Success Response (200)
- **chapters** (array) - A list of chapters.

## GET /Administration/Studio/Chapters/{chapterId}

### Description
Retrieves a specific chapter.

### Method
GET

### Endpoint
/Administration/Studio/Chapters/{chapterId}

### Parameters
#### Path Parameters
- **chapterId** (string) - Required - The ID of the chapter.

## POST /Administration/Studio/Chapters

### Description
Creates a new chapter.

### Method
POST

### Endpoint
/Administration/Studio/Chapters

### Parameters
#### Request Body
- **projectId** (string) - Required - The ID of the project.
- **title** (string) - Required - The title of the chapter.

### Response
#### Success Response (200)
- **chapter_id** (string) - The ID of the created chapter.

## POST /Administration/Studio/Chapters/{chapterId}

### Description
Updates an existing chapter.

### Method
POST

### Endpoint
/Administration/Studio/Chapters/{chapterId}

### Parameters
#### Path Parameters
- **chapterId** (string) - Required - The ID of the chapter.
#### Request Body
- **updates** (object) - Required - The fields to update.

## DEL /Administration/Studio/Chapters/{chapterId}

### Description
Deletes a chapter.

### Method
DELETE

### Endpoint
/Administration/Studio/Chapters/{chapterId}

### Parameters
#### Path Parameters
- **chapterId** (string) - Required - The ID of the chapter.

## POST /Administration/Studio/Chapters/{chapterId}/convert

### Description
Converts a chapter.

### Method
POST

### Endpoint
/Administration/Studio/Chapters/{chapterId}/convert

### Parameters
#### Path Parameters
- **chapterId** (string) - Required - The ID of the chapter.

## GET /Administration/Studio/Chapters/{chapterId}/snapshots

### Description
Lists snapshots for a chapter.

### Method
GET

### Endpoint
/Administration/Studio/Chapters/{chapterId}/snapshots

### Response
#### Success Response (200)
- **snapshots** (array) - A list of snapshots.

## STREAM /Administration/Studio/Chapters/{chapterId}/audio

### Description
Streams audio for a chapter.

### Method
STREAM

### Endpoint
/Administration/Studio/Chapters/{chapterId}/audio

### Parameters
#### Path Parameters
- **chapterId** (string) - Required - The ID of the chapter.

## POST /Administration/Studio/PronunciationDictionaries

### Description
Creates a pronunciation dictionary.

### Method
POST

### Endpoint
/Administration/Studio/PronunciationDictionaries

### Parameters
#### Request Body
- **name** (string) - Required - The name of the dictionary.
- **rules** (array) - Optional - A list of pronunciation rules.

### Response
#### Success Response (200)
- **dictionary_id** (string) - The ID of the created dictionary.

## POST /Administration/Studio/Podcast

### Description
Creates a podcast.

### Method
POST

### Endpoint
/Administration/Studio/Podcast

### Parameters
#### Request Body
- **chapter_ids** (array) - Required - A list of chapter IDs to include in the podcast.
- **title** (string) - Required - The title of the podcast.

### Response
#### Success Response (200)
- **podcast_id** (string) - The ID of the created podcast.

## GET /Administration/Studio/ChapterSnapshots/{snapshotId}

### Description
Retrieves a chapter snapshot.

### Method
GET

### Endpoint
/Administration/Studio/ChapterSnapshots/{snapshotId}

### Parameters
#### Path Parameters
- **snapshotId** (string) - Required - The ID of the snapshot.

## GET /Administration/Studio/ProjectSnapshots/{snapshotId}

### Description
Retrieves a project snapshot.

### Method
GET

### Endpoint
/Administration/Studio/ProjectSnapshots/{snapshotId}

### Parameters
#### Path Parameters
- **snapshotId** (string) - Required - The ID of the snapshot.
```

--------------------------------

### GET Get Chapter

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/list_explorer=true

Retrieves a specific chapter within a Studio Project. This provides access to the details of an individual chapter.

```APIDOC
## GET Get Chapter

### Description
Retrieves a specific chapter within a Studio Project.

### Method
GET

### Endpoint
/studio/projects/{project_id}/chapters/{chapter_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the project.
- **chapter_id** (string) - Required - The ID of the chapter.

### Response
#### Success Response (200)
- **id** (string) - The ID of the chapter.
- **name** (string) - The name of the chapter.

#### Response Example
{
  "id": "chapter_123",
  "name": "My Chapter"
}

```

--------------------------------

### Retrieve Knowledge Base Documents from Redis with Retry (TypeScript)

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/upstash-redis

Retrieves knowledge base documents for a given conversation ID from Redis with a retry mechanism. This function is designed to handle potential temporary unavailability of Redis by retrying the operation up to a specified number of times.

```typescript
// ...

// Get the knowledge base from redis
const redisRes = await getRedisDataWithRetry(conversation_id);
if (!redisRes) throw new Error('Conversation data not found!');
// ...

async function getRedisDataWithRetry(
  conversationId: string,
  maxRetries = 5
): Promise<{ 
  email: string;
  knowledgeBase: Array<{ 
    id: string;
    type: 'file' | 'url';
    name: string;
  }>;
} | null> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const data = await redis.get(conversationId);
      return data as any;
    } catch (error) {
      if (attempt === maxRetries) throw error;
      console.log(`Redis get attempt ${attempt} failed, retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  return null;
}
```

--------------------------------

### Get Agents from Knowledge Base (Python)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-agents

This Python code snippet demonstrates using the ElevenLabs Python SDK to get agents associated with a knowledge base documentation. It initializes the client and calls the `get_agents` method.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.knowledge_base.documents.get_agents(
    documentation_id="documentation_id"
)

```

--------------------------------

### POST Create Pronunciation Dictionaries

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/create_explorer=true

Creates Pronunciation Dictionaries.

```APIDOC
## POST Create Pronunciation Dictionaries

### Description
Creates Pronunciation Dictionaries.

### Method
POST

### Endpoint
/create-pronunciation-dictionaries

### Parameters
None

### Request Example
{}

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Pronunciation Dictionaries created"
}

```

--------------------------------

### GET Get link

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-agents_explorer=true

Retrieves a link for an agent.

```APIDOC
## GET Get link

### Description
Retrieves a link for an agent.

### Method
GET

### Endpoint
/agents-platform/agents/{agent_id}/link

### Parameters
#### Path Parameters
- **agent_id** (string) - Required - The ID of the agent.

### Request Example
N/A

### Response
#### Success Response (200)
- **link** (string) - The link for the agent.

#### Response Example
{
  "link": "https://example.com/agent/agent123"
}

```

--------------------------------

### GET /voices/settings

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/delete_explorer=true

Gets voice settings.

```APIDOC
## GET /voices/settings

### Description
Gets voice settings.

### Method
GET

### Endpoint
/voices/settings

### Parameters
#### Query Parameters
- **voice_id** (string) - Required - ID of the voice

### Request Example
/voices/settings?voice_id=voice123

### Response
#### Success Response (200)
- **stability** (float) - Stability setting
- **similarity_boost** (float) - Similarity boost setting

#### Response Example
{
  "stability": 0.8,
  "similarity_boost": 0.6
}

```

--------------------------------

### GET /administration/studio/projects/{project_id}/snapshots

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/list_explorer=true

Lists snapshots for a Studio project.

```APIDOC
## GET /administration/studio/projects/{project_id}/snapshots

### Description
Lists snapshots for a Studio project.

### Method
GET

### Endpoint
/administration/studio/projects/{project_id}/snapshots

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the project.
```

--------------------------------

### Inject ElevenLabs Widget with Client Tools (JavaScript)

Source: https://elevenlabs.io/docs/agents-platform/guides/eleven-labs-docs-agent

This script injects the ElevenLabs conversational AI widget into a webpage. It dynamically loads the widget script, creates and configures the widget element, and adapts its appearance based on the current theme and device type. It also sets up event listeners to inject client tools for custom actions like navigating to documentation, sending emails, or opening support forms.

```javascript
const ID = 'elevenlabs-convai-widget-60993087-3f3e-482d-9570-cc373770addc';

function injectElevenLabsWidget() {
  // Check if the widget is already loaded
  if (document.getElementById(ID)) {
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
  script.async = true;
  script.type = 'text/javascript';
  document.head.appendChild(script);

  // Create the wrapper and widget
  const wrapper = document.createElement('div');
  wrapper.className = 'desktop';

  const widget = document.createElement('elevenlabs-convai');
  widget.id = ID;
  widget.setAttribute('agent-id', 'the-agent-id');
  widget.setAttribute('variant', 'full');

  // Set initial colors and variant based on current theme and device
  updateWidgetColors(widget);
  updateWidgetVariant(widget);

  // Watch for theme changes and resize events
  const observer = new MutationObserver(() => {
    updateWidgetColors(widget);
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  // Add resize listener for mobile detection
  window.addEventListener('resize', () => {
    updateWidgetVariant(widget);
  });

  function updateWidgetVariant(widget) {
    const isMobile = window.innerWidth <= 640; // Common mobile breakpoint
    if (isMobile) {
      widget.setAttribute('variant', 'expandable');
    } else {
      widget.setAttribute('variant', 'full');
    }
  }

  function updateWidgetColors(widget) {
    const isDarkMode = !document.documentElement.classList.contains('light');
    if (isDarkMode) {
      widget.setAttribute('avatar-orb-color-1', '#2E2E2E');
      widget.setAttribute('avatar-orb-color-2', '#B8B8B8');
    } else {
      widget.setAttribute('avatar-orb-color-1', '#4D9CFF');
      widget.setAttribute('avatar-orb-color-2', '#9CE6E6');
    }
  }

  // Listen for the widget's "call" event to inject client tools
  widget.addEventListener('elevenlabs-convai:call', (event) => {
    event.detail.config.clientTools = {
      redirectToDocs: ({ path }) => {
        const router = window?.next?.router;
        if (router) {
          router.push(path);
        }
      },
      redirectToEmailSupport: ({ subject, body }) => {
        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);
        window.open(
          `mailto:team@elevenlabs.io?subject=${encodedSubject}&body=${encodedBody}`,
          '_blank'
        );
      },
      redirectToSupportForm: ({ subject, description, extraInfo }) => {
        const baseUrl = 'https://help.elevenlabs.io/hc/en-us/requests/new';
        const ticketFormId = '13145996177937';
        const encodedSubject = encodeURIComponent(subject);
        const encodedDescription = encodeURIComponent(description);
        const encodedExtraInfo = encodeURIComponent(extraInfo);

        const fullUrl = `${baseUrl}?ticket_form_id=${ticketFormId}&tf_subject=${encodedSubject}&tf_description=${encodedDescription}%3Cbr%3E%3Cbr%3E${encodedExtraInfo}`;

        window.open(fullUrl, '_blank', 'noopener,noreferrer');
      },
      redirectToExternalURL: ({ url }) => {
        window.open(url, '_blank', 'noopener,noreferrer');
      },
    };
  });

  // Attach widget to the DOM
  wrapper.appendChild(widget);
  document.body.appendChild(wrapper);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectElevenLabsWidget);
} else {
  injectElevenLabsWidget();
}

```

--------------------------------

### Run Agent Tests via API POST Request

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/run-tests

This snippet demonstrates how to send a POST request to the ElevenLabs API to run tests on a conversational AI agent. It includes setting up the request URL, payload, and necessary headers like 'xi-api-key' and 'Content-Type'. The response body is then printed. This example is shown in multiple languages, including Go, Ruby, Java, PHP, C#, Swift, TypeScript, and Python.

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/agents/agent_id/run-tests"

	payload := strings.NewReader("{\n  \"tests\": [\n    {\n      \"test_id\": \"string\"\n    }\n  ]\n}")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("xi-api-key", "xi-api-key")
	req.Header.Add("Content-Type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/agents/agent_id/run-tests")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["xi-api-key"] = 'xi-api-key'
request["Content-Type"] = 'application/json'
request.body = "{\n  \"tests\": [\n    {\n      \"test_id\": \"string\"\n    }\n  ]\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/convai/agents/agent_id/run-tests")
  .header("xi-api-key", "xi-api-key")
  .header("Content-Type", "application/json")
  .body("{\n  \"tests\": [\n    {\n      \"test_id\": \"string\"\n    }\n  ]\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/convai/agents/agent_id/run-tests', [
  'body' => '{\n  "tests": [\n    {\n      "test_id": "string"\n    }\n  ]\n}',
  'headers' => [
    'Content-Type' => 'application/json',
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();

```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/agents/agent_id/run-tests");
var request = new RestRequest(Method.POST);
request.AddHeader("xi-api-key", "xi-api-key");
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"tests\": [\n    {\n      \"test_id\": \"string\"\n    }\n  ]\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = [
  "xi-api-key": "xi-api-key",
  "Content-Type": "application/json"
]
let parameters = ["tests": [["test_id": "string"]]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/agents/agent_id/run-tests")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.agents.runTests("agent_id", {
        tests: [
            {
                testId: "string",
            },
        ],
    });
}
main();

```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.agents.run_tests(
    agent_id="agent_id",
    tests=[
        {
            "test_id": "string"
        }
    ]
)


```

--------------------------------

### Initialize Agent with System Tools (Python)

Source: https://elevenlabs.io/docs/agents-platform/customization/tools/system-tools

Initializes an ElevenLabs agent with 'end_call' and 'language_detection' system tools using the Python SDK. This setup allows the agent to manage call termination and language processing. Requires an API key for initialization.

```python
from elevenlabs import (
    ConversationalConfig,
    ElevenLabs,
    AgentConfig,
    PromptAgent,
    PromptAgentInputToolsItem_System,
)

# Initialize the client
elevenlabs = ElevenLabs(api_key="YOUR_API_KEY")

# Create system tools
end_call_tool = PromptAgentInputToolsItem_System(
    name="end_call",
    description=""  # Optional: Customize when the tool should be triggered
)

language_detection_tool = PromptAgentInputToolsItem_System(
    name="language_detection",
    description=""  # Optional: Customize when the tool should be triggered
)

# Create the agent configuration with both tools
conversation_config = ConversationalConfig(
    agent=AgentConfig(
        prompt=PromptAgent(
            tools=[end_call_tool, language_detection_tool]
        )
    )
)

# Create the agent
response = elevenlabs.conversational_ai.agents.create(
    conversation_config=conversation_config
)
```

--------------------------------

### GET Get agent

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-agents_explorer=true

Retrieves a specific agent by its ID.

```APIDOC
## GET Get agent

### Description
Retrieves a specific agent by its ID.

### Method
GET

### Endpoint
/agents-platform/agents/{agent_id}

### Parameters
#### Path Parameters
- **agent_id** (string) - Required - The ID of the agent to retrieve.

### Request Example
N/A

### Response
#### Success Response (200)
- **id** (string) - The ID of the agent.
- **name** (string) - The name of the agent.
- **description** (string) - The description of the agent.

#### Response Example
{
  "id": "agent123",
  "name": "My Agent",
  "description": "A helpful agent."
}

```

--------------------------------

### Fetch Tool Information via URLSession (Swift)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/get

Demonstrates fetching tool information using Swift's native URLSession framework. This approach involves creating an NSMutableURLRequest, setting the HTTP method and headers, and then executing the request asynchronously. Error handling for network operations is included.

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/tools/tool_id")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

--------------------------------

### Fetch Knowledge Base Data using Go

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/list

This Go code snippet demonstrates how to make a GET request to the ElevenLabs API's knowledge base endpoint. It includes setting the API key in the request header and printing the response body. Requires the standard Go net/http and io packages.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/knowledge-base"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("xi-api-key", "xi-api-key")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

--------------------------------

### GET List Chapters

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/create_explorer=true

Retrieves a list of Chapters.

```APIDOC
## GET List Chapters

### Description
Lists Chapters.

### Method
GET

### Endpoint
/list-chapters

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **chapters** (array) - List of Chapters.

#### Response Example
[
  {
    "id": "chapter1",
    "project_id": "project1"
  }
]

```

--------------------------------

### GET Get conversation details

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-agents_explorer=true

Retrieves details for a specific conversation.

```APIDOC
## GET Get conversation details

### Description
Retrieves details for a specific conversation.

### Method
GET

### Endpoint
/agents-platform/conversations/{conversation_id}

### Parameters
#### Path Parameters
- **conversation_id** (string) - Required - The ID of the conversation.

### Request Example
N/A

### Response
#### Success Response (200)
- **id** (string) - The ID of the conversation.
- **agent_id** (string) - The ID of the agent.
- **start_time** (string) - The start time of the conversation.
- **messages** (array) - An array of messages in the conversation.

#### Response Example
{
  "id": "conversation123",
  "agent_id": "agent123",
  "start_time": "2024-01-01T00:00:00Z",
  "messages": [
    {
      "sender": "user",
      "text": "Hello, agent!"
    }
  ]
}

```

--------------------------------

### Batch Calling API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-text_explorer=true

Manage batch calling jobs for your workspace.

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/batch-calling/jobs

### Description
Submits a new batch calling job.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/batch-calling/jobs

### Parameters

#### Query Parameters
None

#### Request Body
- **jobName** (string) - Required - Name of the batch job.
- **recipients** (array) - Required - List of recipient phone numbers.
- **audioUrl** (string) - Required - URL of the audio file to play for each call.

### Request Example
```json
{
  "jobName": "Summer_Campaign_2024",
  "recipients": ["+1234567890", "+1987654321"],
  "audioUrl": "https://example.com/campaign_audio.mp3"
}
```

### Response
#### Success Response (201)
- **jobId** (string) - The unique identifier for the batch job.
- **status** (string) - The status of the job (e.g., 'submitted').

#### Response Example
```json
{
  "jobId": "job_abcdef123",
  "status": "submitted"
}
```
```

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/batch-calling/jobs

### Description
Lists all workspace batch calling jobs.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/batch-calling/jobs

### Parameters

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **jobs** (array) - A list of batch job objects.

#### Response Example
```json
{
  "jobs": [
    {
      "jobId": "job_abcdef123",
      "jobName": "Summer_Campaign_2024",
      "status": "completed",
      "submittedAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```
```

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/batch-calling/jobs/{jobId}

### Description
Retrieves detailed information about a specific batch call job.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/batch-calling/jobs/{jobId}

### Parameters

#### Path Parameters
- **jobId** (string) - Required - The ID of the batch job.

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **jobId** (string) - The ID of the batch job.
- **jobName** (string) - The name of the batch job.
- **status** (string) - The status of the job.
- **calls** (array) - Details of individual calls within the job.

#### Response Example
```json
{
  "jobId": "job_abcdef123",
  "jobName": "Summer_Campaign_2024",
  "status": "completed",
  "calls": [
    {
      "recipient": "+1234567890",
      "status": "completed",
      "callSid": "call_123"
    }
  ]
}
```
```

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/batch-calling/jobs/{jobId}/cancel

### Description
Cancels a pending or in-progress batch calling job.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/batch-calling/jobs/{jobId}/cancel

### Parameters

#### Path Parameters
- **jobId** (string) - Required - The ID of the batch job to cancel.

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **message** (string) - A confirmation message.
- **status** (string) - The updated status of the job (e.g., 'cancelling').

#### Response Example
```json
{
  "message": "Batch job cancellation requested.",
  "status": "cancelling"
}
```
```

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/batch-calling/jobs/{jobId}/retry

### Description
Retries a failed batch calling job.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/batch-calling/jobs/{jobId}/retry

### Parameters

#### Path Parameters
- **jobId** (string) - Required - The ID of the batch job to retry.

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **message** (string) - A confirmation message.
- **status** (string) - The updated status of the job (e.g., 'retrying').

#### Response Example
```json
{
  "message": "Batch job retry requested.",
  "status": "retrying"
}
```
```

--------------------------------

### Administration - Studio

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/get_explorer=true

Endpoints for managing Studio Projects, including creation, updates, and content management.

```APIDOC
## GET /administration/studio/projects

### Description
Lists all Studio Projects.

### Method
GET

### Endpoint
/administration/studio/projects

### Response
#### Success Response (200)
- **projects** (array of objects) - List of Studio Projects.
```

```APIDOC
## POST /administration/studio/projects/update

### Description
Updates an existing Studio Project.

### Method
POST

### Endpoint
/administration/studio/projects/update

### Parameters
#### Request Body
- **project_id** (string) - Required - The ID of the project to update.
- **updates** (object) - Required - The fields to update.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.
```

```APIDOC
## GET /administration/studio/projects/{project_id}

### Description
Retrieves details for a specific Studio Project.

### Method
GET

### Endpoint
/administration/studio/projects/{project_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.

### Response
#### Success Response (200)
- **project_details** (object) - Details of the Studio Project.
```

```APIDOC
## POST /administration/studio/projects

### Description
Creates a new Studio Project.

### Method
POST

### Endpoint
/administration/studio/projects

### Parameters
#### Request Body
- **name** (string) - Required - The name of the project.
- **description** (string) - Optional - A description for the project.

### Response
#### Success Response (200)
- **project_id** (string) - The ID of the newly created project.
```

```APIDOC
## DEL /administration/studio/projects/{project_id}

### Description
Deletes a Studio Project.

### Method
DELETE

### Endpoint
/administration/studio/projects/{project_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the project to delete.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.
```

```APIDOC
## POST /administration/studio/projects/convert

### Description
Converts a Studio Project to a different format or version.

### Method
POST

### Endpoint
/administration/studio/projects/convert

### Parameters
#### Request Body
- **project_id** (string) - Required - The ID of the project to convert.
- **target_format** (string) - Required - The desired format.

### Response
#### Success Response (200)
- **conversion_id** (string) - The ID of the conversion task.
```

```APIDOC
## POST /administration/studio/projects/{project_id}/content/update

### Description
Updates the content of a Studio Project.

### Method
POST

### Endpoint
/administration/studio/projects/{project_id}/content/update

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the project.
#### Request Body
- **content** (object) - Required - The new content for the project.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.
```

```APIDOC
## GET /administration/studio/projects/{project_id}/snapshots

### Description
Lists snapshots for a Studio Project.

### Method
GET

### Endpoint
/administration/studio/projects/{project_id}/snapshots

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.

### Response
#### Success Response (200)
- **snapshots** (array of objects) - List of snapshots.
```

```APIDOC
## STREAM /administration/studio/projects/{project_id}/audio

### Description
Streams audio for a Studio Project.

### Method
STREAM

### Endpoint
/administration/studio/projects/{project_id}/audio

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.

### Response
#### Success Response (200)
- **audio_stream** (stream) - Audio stream.
```

```APIDOC
## POST /administration/studio/projects/stream/archive

### Description
Streams an archive with audio from a Studio Project.

### Method
POST

### Endpoint
/administration/studio/projects/stream/archive

### Parameters
#### Request Body
- **project_id** (string) - Required - The ID of the Studio Project.
- **audio_stream** (boolean) - Required - Whether to include audio.

### Response
#### Success Response (200)
- **archive_stream** (stream) - Archive stream.
```

```APIDOC
## GET /administration/studio/projects/{project_id}/chapters

### Description
Lists chapters for a Studio Project.

### Method
GET

### Endpoint
/administration/studio/projects/{project_id}/chapters

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.

### Response
#### Success Response (200)
- **chapters** (array of objects) - List of chapters.
```

```APIDOC
## GET /administration/studio/projects/{project_id}/chapters/{chapter_id}

### Description
Retrieves a specific chapter from a Studio Project.

### Method
GET

### Endpoint
/administration/studio/projects/{project_id}/chapters/{chapter_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
- **chapter_id** (string) - Required - The ID of the chapter.

### Response
#### Success Response (200)
- **chapter_details** (object) - Details of the chapter.
```

```APIDOC
## POST /administration/studio/projects/{project_id}/chapters

### Description
Creates a new chapter for a Studio Project.

### Method
POST

### Endpoint
/administration/studio/projects/{project_id}/chapters

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
#### Request Body
- **chapter_data** (object) - Required - Data for the new chapter.

### Response
#### Success Response (200)
- **chapter_id** (string) - The ID of the created chapter.
```

```APIDOC
## POST /administration/studio/projects/{project_id}/chapters/update

### Description
Updates an existing chapter in a Studio Project.

### Method
POST

### Endpoint
/administration/studio/projects/{project_id}/chapters/update

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
#### Request Body
- **chapter_id** (string) - Required - The ID of the chapter to update.
- **updates** (object) - Required - The fields to update.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.
```

```APIDOC
## DEL /administration/studio/projects/{project_id}/chapters/{chapter_id}

### Description
Deletes a chapter from a Studio Project.

### Method
DELETE

### Endpoint
/administration/studio/projects/{project_id}/chapters/{chapter_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
- **chapter_id** (string) - Required - The ID of the chapter to delete.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.
```

```APIDOC
## POST /administration/studio/projects/{project_id}/chapters/convert

### Description
Converts a chapter to a different format or version.

### Method
POST

### Endpoint
/administration/studio/projects/{project_id}/chapters/convert

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
#### Request Body
- **chapter_id** (string) - Required - The ID of the chapter to convert.
- **target_format** (string) - Required - The desired format.

### Response
#### Success Response (200)
- **conversion_id** (string) - The ID of the conversion task.
```

```APIDOC
## GET /administration/studio/projects/{project_id}/chapters/{chapter_id}/snapshots

### Description
Lists snapshots for a specific chapter of a Studio Project.

### Method
GET

### Endpoint
/administration/studio/projects/{project_id}/chapters/{chapter_id}/snapshots

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
- **chapter_id** (string) - Required - The ID of the chapter.

### Response
#### Success Response (200)
- **snapshots** (array of objects) - List of snapshots.
```

```APIDOC
## STREAM /administration/studio/projects/{project_id}/chapters/{chapter_id}/audio

### Description
Streams audio for a specific chapter of a Studio Project.

### Method
STREAM

### Endpoint
/administration/studio/projects/{project_id}/chapters/{chapter_id}/audio

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
- **chapter_id** (string) - Required - The ID of the chapter.

### Response
#### Success Response (200)
- **audio_stream** (stream) - Audio stream.
```

```APIDOC
## POST /administration/studio/projects/{project_id}/pronunciation-dictionaries

### Description
Creates pronunciation dictionaries for a Studio Project from a file.

### Method
POST

### Endpoint
/administration/studio/projects/{project_id}/pronunciation-dictionaries

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
#### Request Body
- **file** (file object) - Required - The file containing pronunciation rules.

### Response
#### Success Response (200)
- **dictionary_id** (string) - The ID of the created pronunciation dictionary.
```

```APIDOC
## POST /administration/studio/projects/{project_id}/podcast

### Description
Creates a podcast from a Studio Project.

### Method
POST

### Endpoint
/administration/studio/projects/{project_id}/podcast

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
#### Request Body
- **podcast_details** (object) - Required - Details for the podcast creation.

### Response
#### Success Response (200)
- **podcast_id** (string) - The ID of the created podcast.
```

```APIDOC
## GET /administration/studio/projects/{project_id}/snapshots/{snapshot_id}

### Description
Retrieves a specific snapshot for a Studio Project.

### Method
GET

### Endpoint
/administration/studio/projects/{project_id}/snapshots/{snapshot_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
- **snapshot_id** (string) - Required - The ID of the snapshot.

### Response
#### Success Response (200)
- **snapshot_details** (object) - Details of the snapshot.
```

```APIDOC
## GET /administration/studio/projects/{project_id}/project-snapshots/{snapshot_id}

### Description
Retrieves a specific project snapshot for a Studio Project.

### Method
GET

### Endpoint
/administration/studio/projects/{project_id}/project-snapshots/{snapshot_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.
- **snapshot_id** (string) - Required - The ID of the snapshot.

### Response
#### Success Response (200)
- **snapshot_details** (object) - Details of the snapshot.
```

--------------------------------

### Get RAG Index Overview with Eleven Labs API (Ruby)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/rag-index-overview

Shows how to fetch the RAG index overview from the Eleven Labs API using Ruby's Net::HTTP library. It includes setting the API key and reading the response body.

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/knowledge-base/rag-index")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

--------------------------------

### POST /v1/convai/agent-testing/create

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/create_explorer=true

Creates a new agent testing instance with specified chat history, success conditions, and examples.

```APIDOC
## POST /v1/convai/agent-testing/create

### Description

This endpoint creates a new agent testing configuration. It allows you to define the conversation history, success criteria, and example scenarios for testing an agent.

### Method

POST

### Endpoint

`/v1/convai/agent-testing/create`

### Parameters

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

- **chat_history** (list of objects) - Required - A list of messages representing the conversation history. Each message object must contain:
  - **role** (enum) - Required - The role of the message sender (e.g., "user", "assistant").
  - **time_in_call_secs** (integer) - Required - The time in seconds from the start of the call when the message occurred.
  - *Optional fields*: agent_metadata, message, multivoice_message, tool_calls, tool_results, feedback, llm_override, conversation_turn_metrics, rag_retrieval_info, llm_usage, interrupted, original_message, source_medium.
- **success_condition** (string) - Required - A condition that defines a successful agent interaction.
- **success_examples** (list of objects) - Required - A list of examples of successful interactions. Each example object must contain:
  - **response** (string) - Required - The expected response from the agent.
  - **type** (string) - Optional - The type of success, defaults to `success`.
- **failure_examples** (list of objects) - Required - A list of examples of failed interactions. Each example object must contain:
  - **response** (string) - Required - The response indicating a failure.
  - **type** (string) - Optional - The type of failure, defaults to `failure`.
- **name** (string) - Required - The name of the agent test.
- *Optional fields*: tool_call_parameters, dynamic_variables, type, from_conversation_metadata.

### Request Example

```json
{
  "chat_history": [
    {
      "role": "user",
      "time_in_call_secs": 1
    }
  ],
  "success_condition": "string",
  "success_examples": [
    {
      "response": "string",
      "type": "string"
    }
  ],
  "failure_examples": [
    {
      "response": "string",
      "type": "string"
    }
  ],
  "name": "string"
}
```

### Response

#### Success Response (200)

(Response details not provided in the input text)

#### Response Example

(Response example not provided in the input text)
```

--------------------------------

### Implement RAG with ElevenLabs API (Python)

Source: https://elevenlabs.io/docs/agents-platform/customization/knowledge-base/rag

This Python snippet demonstrates how to use the ElevenLabs API to index a document for RAG and then update an agent's configuration to enable RAG. It includes error handling and status checking for the indexing process. Dependencies: elevenlabs library.

```python
from elevenlabs import ElevenLabs
import time

# Initialize the ElevenLabs client
elevenlabs = ElevenLabs(api_key="your-api-key")

# First, index a document for RAG
document_id = "your-document-id"
embedding_model = "e5_mistral_7b_instruct"

# Trigger RAG indexing
response = elevenlabs.conversational_ai.knowledge_base.document.compute_rag_index(
    documentation_id=document_id,
    model=embedding_model
)

# Check indexing status
while response.status not in ["SUCCEEDED", "FAILED"]:
    time.sleep(5)  # Wait 5 seconds before checking status again
    response = elevenlabs.conversational_ai.knowledge_base.document.compute_rag_index(
        documentation_id=document_id,
        model=embedding_model
    )

# Then update agent configuration to use RAG
agent_id = "your-agent-id"

# Get the current agent configuration
agent_config = elevenlabs.conversational_ai.agents.get(agent_id=agent_id)

# Enable RAG in the agent configuration
agent_config.agent.prompt.rag = {
    "enabled": True,
    "embedding_model": "e5_mistral_7b_instruct",
    "max_documents_length": 10000
}

# Update document usage mode if needed
for i, doc in enumerate(agent_config.agent.prompt.knowledge_base):
    if doc.id == document_id:
        agent_config.agent.prompt.knowledge_base[i].usage_mode = "auto"

# Update the agent configuration
elevenlabs.conversational_ai.agents.update(
    agent_id=agent_id,
    conversation_config=agent_config.agent
)

```

--------------------------------

### Set Environment Variables for ElevenLabs Platform

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/upstash-redis

This `.env` file configuration sets essential environment variables for the ElevenLabs platform, including webhook secrets, API keys, agent IDs, and credentials for integrated services like Resend and Upstash Redis. These variables are crucial for authentication and service integration.

```bash
ELEVENLABS_CONVAI_WEBHOOK_SECRET=
ELEVENLABS_API_KEY=
ELEVENLABS_AGENT_ID=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Upstash Redis
KV_URL=
KV_REST_API_READ_ONLY_TOKEN=
REDIS_URL=
KV_REST_API_TOKEN=
KV_REST_API_URL=
```

--------------------------------

### POST /studio/projects

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents/update_explorer=true

Creates a new Studio Project.

```APIDOC
## POST /studio/projects

### Description
Creates a new Studio Project.

### Method
POST

### Endpoint
/studio/projects

### Parameters
#### Request Body
- **name** (string) - Required - The name of the new project.
- **description** (string) - Optional - The description of the new project.

### Request Example
{
  "name": "My New Project",
  "description": "A description of the project."
}

### Response
#### Success Response (201)
- **id** (string) - The ID of the newly created project.

#### Response Example
{
  "id": "project_123"
}

```

--------------------------------

### Create MCP Server with Swift

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/create

This Swift code demonstrates creating an MCP server using URLSession. It configures the request with the correct URL, HTTP method (POST), headers, and JSON body. Error handling for the network request is also included.

```swift
import Foundation

let headers = [
  "xi-api-key": "xi-api-key",
  "Content-Type": "application/json"
]
let parameters = ["config": [
    "url": "string",
    "name": "string"
  ]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/mcp-servers")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

--------------------------------

### GET Get audio from history item

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-agents_explorer=true

Retrieves the audio data from a specific history item.

```APIDOC
## GET Get audio from history item

### Description
Retrieves the audio data from a specific history item.

### Method
GET

### Endpoint
/get-audio-from-history-item/{item_id}

### Parameters
#### Path Parameters
- **item_id** (string) - Required - The ID of the history item.

### Request Example
N/A

### Response
#### Success Response (200)
- **audio_data** (binary) - The audio data of the history item.

#### Response Example
N/A (binary data)

```

--------------------------------

### Legacy Knowledge Base API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents-platform/websocket_explorer=true

Manage the knowledge base by adding information.

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/knowledge-base/add

### Description
Adds new information to the knowledge base.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/knowledge-base/add

### Parameters

#### Request Body
- **content** (string) - Required - The text content to add to the knowledge base.
- **source** (string) - Optional - The source of the information (e.g., URL, document name).

### Request Example
```json
{
  "content": "The Eleven Labs API provides powerful tools for voice generation and agent management.",
  "source": "API Documentation"
}
```

### Response
#### Success Response (200)
- **entry_id** (string) - The ID of the added knowledge base entry.
- **message** (string) - Confirmation message.

#### Response Example
```json
{
  "entry_id": "kb_entry_12345",
  "message": "Information added to knowledge base successfully."
}
```
```

--------------------------------

### Add URL to Knowledge Base (TypeScript)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-url

This TypeScript example uses the official ElevenLabs JavaScript client to add a URL to the knowledge base. It requires initializing the client with the environment and then calling the appropriate method.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.knowledgeBase.documents.createFromUrl({
        url: "string",
    });
}
main();

```

--------------------------------

### GET Get generated items

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-agents_explorer=true

Retrieves a list of generated items. Allows querying user history.

```APIDOC
## GET Get generated items

### Description
Retrieves a list of generated items.

### Method
GET

### Endpoint
/get-generated-items

### Parameters
#### Query Parameters
- **page** (integer) - Optional - The page number to retrieve.
- **page_size** (integer) - Optional - The number of items per page.

### Request Example
N/A

### Response
#### Success Response (200)
- **items** (array) - An array of generated items.
- **total_count** (integer) - The total number of generated items.

#### Response Example
{
  "items": [{"id": "1", "text": "Hello"}, {"id": "2", "text": "World"}],
  "total_count": 100
}

```

--------------------------------

### Administration Studio Project Management

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/create_explorer=true

Endpoints for managing Studio Projects, including listing, creating, updating, deleting, and converting projects.

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/list

### Description
List Studio Projects.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/list

### Parameters

### Request Example

### Response
#### Success Response (200)
- **projects** (array) - A list of Studio Projects.

#### Response Example

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/update

### Description
Update a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/update

### Parameters

#### Request Body
- **project_id** (string) - Required - The ID of the project to update.
- **project_data** (object) - Required - The data to update the project with.

### Request Example

### Response
#### Success Response (200)
- **message** (string) - Confirmation message that the project has been updated.

#### Response Example

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

### Description
Get a Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the project to retrieve.

### Request Example

### Response
#### Success Response (200)
- **project_details** (object) - Details of the Studio Project.

#### Response Example

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects

### Description
Create a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects

### Parameters

#### Request Body
- **project_name** (string) - Required - The name of the new project.

### Request Example

### Response
#### Success Response (200)
- **project_id** (string) - The ID of the newly created project.

#### Response Example

## DEL /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

### Description
Delete a Studio Project.

### Method
DELETE

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the project to delete.

### Request Example

### Response
#### Success Response (200)
- **message** (string) - Confirmation message that the project has been deleted.

#### Response Example

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/convert

### Description
Convert a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/convert

### Parameters

#### Request Body
- **project_id** (string) - Required - The ID of the project to convert.

### Request Example

### Response
#### Success Response (200)
- **conversion_status** (string) - The status of the conversion.

#### Response Example

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/content/update

### Description
Update Studio Project Content.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/content/update

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the project.

#### Request Body
- **content_data** (object) - Required - The content data to update.

### Request Example

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/snapshots/list

### Description
List Studio Project Snapshots.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/snapshots/list

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the project.

### Request Example

### Response
#### Success Response (200)
- **snapshots** (array) - A list of snapshots for the project.

#### Response Example

## STREAM /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/audio/stream

### Description
Stream audio from a Studio Project.

### Method
STREAM

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/audio/stream

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the project.

### Request Example

### Response
#### Success Response (200)
- **audio_stream** (stream) - The audio stream of the project.

#### Response Example

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/stream/archive

### Description
Stream archive with Studio Project audio.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/stream/archive

### Parameters

#### Request Body
- **project_ids** (array) - Required - An array of project IDs.

### Request Example

### Response
#### Success Response (200)
- **archive_stream** (stream) - The audio stream of the archived projects.

#### Response Example

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/list

### Description
List chapters for a Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/list

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the project.

### Request Example

### Response
#### Success Response (200)
- **chapters** (array) - A list of chapters for the project.

#### Response Example

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}

### Description
Get a specific chapter from a Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the project.
- **chapter_id** (string) - Required - The ID of the chapter.

### Request Example

### Response
#### Success Response (200)
- **chapter_details** (object) - Details of the chapter.

#### Response Example

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters

### Description
Create a chapter for a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the project.

#### Request Body
- **chapter_data** (object) - Required - The data for the new chapter.

### Request Example

### Response
#### Success Response (200)
- **chapter_id** (string) - The ID of the newly created chapter.

#### Response Example

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}

### Description
Update a chapter in a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the project.
- **chapter_id** (string) - Required - The ID of the chapter to update.

#### Request Body
- **chapter_data** (object) - Required - The updated chapter data.

### Request Example

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example

## DEL /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}

### Description
Delete a chapter from a Studio Project.

### Method
DELETE

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the project.
- **chapter_id** (string) - Required - The ID of the chapter to delete.

### Request Example

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/convert

### Description
Convert a chapter in a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/convert

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the project.

#### Request Body
- **chapter_id** (string) - Required - The ID of the chapter to convert.

### Request Example

### Response
#### Success Response (200)
- **conversion_status** (string) - The status of the conversion.

#### Response Example

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}/snapshots/list

### Description
List chapter snapshots for a Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}/snapshots/list

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the project.
- **chapter_id** (string) - Required - The ID of the chapter.

### Request Example

### Response
#### Success Response (200)
- **snapshots** (array) - A list of snapshots for the chapter.

#### Response Example

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/snapshots/{snapshot_id}

### Description
Get a specific Studio Project snapshot.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/snapshots/{snapshot_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the project.
- **snapshot_id** (string) - Required - The ID of the snapshot.

### Request Example

### Response
#### Success Response (200)
- **snapshot_details** (object) - Details of the snapshot.

#### Response Example

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/pronunciation-dictionaries

### Description
Create pronunciation dictionaries for a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/pronunciation-dictionaries

### Parameters

#### Request Body
- **project_id** (string) - Required - The ID of the project.
- **dictionary_data** (object) - Required - Data for the pronunciation dictionaries.

### Request Example

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/podcast

### Description
Create a podcast from a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/podcast

### Parameters

#### Request Body
- **project_id** (string) - Required - The ID of the project.
- **podcast_details** (object) - Required - Details for the podcast creation.

### Request Example

### Response
#### Success Response (200)
- **podcast_id** (string) - The ID of the created podcast.

#### Response Example

```

--------------------------------

### Install PyAudio System Dependencies

Source: https://elevenlabs.io/docs/agents-platform/libraries/python

Installs necessary system dependencies for PyAudio on Debian-based Linux systems and macOS using Homebrew. These are required for the default audio interface.

```shell
sudo apt-get update
sudo apt-get install libportaudio2 libportaudiocpp0 portaudio19-dev libasound-dev libsndfile1-dev -y
```

```shell
brew install portaudio
```

--------------------------------

### Send Email Notification for ElevenLabs Agent Readiness (TypeScript)

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/upstash-redis

This snippet demonstrates how to send an email to a user using Resend to notify them that their custom ElevenLabs agent is ready. It requires the Resend library and an email template component. The function sends an email to a specified recipient with a subject and a custom React email template.

```typescript
import { Resend } from 'resend';

import { EmailTemplate } from '@/components/email/post-call-webhook-email';

// ...

// Send email to user
console.log('Sending email to', redisRes.email);
await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL!,
  to: redisRes.email,
  subject: 'Your ElevenLabs agent is ready to chat!',
  react: EmailTemplate({ agentId: agent.agentId }),
});

// ...
```

--------------------------------

### GET Get voice settings

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-agents_explorer=true

Retrieves the settings for a specific voice. Allows querying parameters for a given voice.

```APIDOC
## GET Get voice settings

### Description
Retrieves the settings for a specific voice.

### Method
GET

### Endpoint
/get-voice-settings

### Parameters
#### Query Parameters
- **voice_id** (string) - Required - The ID of the voice.

### Request Example
N/A

### Response
#### Success Response (200)
- **stability** (float) - The stability setting for the voice.
- **similarity_boost** (float) - The similarity boost setting for the voice.

#### Response Example
{
  "stability": 0.8,
  "similarity_boost": 0.6
}

```

--------------------------------

### GET Get default voice settings

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-agents_explorer=true

Retrieves the default settings for voices. Allows querying of default parameters.

```APIDOC
## GET Get default voice settings

### Description
Retrieves the default settings for voices.

### Method
GET

### Endpoint
/get-default-voice-settings

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **stability** (float) - Default stability setting.
- **similarity_boost** (float) - Default similarity boost setting.

#### Response Example
{
  "stability": 0.75,
  "similarity_boost": 0.5
}

```

--------------------------------

### GET Get audio from sample

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-agents_explorer=true

Retrieves the audio data from a voice sample.  Allows playback of specific samples.

```APIDOC
## GET Get audio from sample

### Description
Retrieves the audio data from a voice sample.

### Method
GET

### Endpoint
/get-audio-from-sample

### Parameters
#### Query Parameters
- **sample_id** (string) - Required - The ID of the voice sample.

### Request Example
N/A

### Response
#### Success Response (200)
- **audio_data** (binary) - The audio data of the sample.

#### Response Example
N/A (binary data)

```

--------------------------------

### LEGACY Voices API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/create_explorer=true

Manage voice designs and previews (Legacy).

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/legacy/voices

### Description
Lists available voices (Legacy).

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/legacy/voices

### Parameters
None

### Response
#### Success Response (200)
- **voices** (array) - A list of voice objects.

#### Response Example
```json
[
  {
    "voice_id": "voice_1",
    "name": "Adam"
  }
]
```

## POST /websites/elevenlabs_io_agents-platform/legacy/voices/design

### Description
Designs a new voice (Legacy).

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/legacy/voices/design

### Parameters
#### Query Parameters
None

#### Request Body
- **description** (string) - Required - A textual description of the desired voice.

### Request Example
```json
{
  "description": "A deep, calm male voice."
}
```

### Response
#### Success Response (200)
- **voice_id** (string) - The ID of the designed voice.
- **status** (string) - The status of the voice design process.

#### Response Example
```json
{
  "voice_id": "designed_voice_1",
  "status": "processing"
}
```

## POST /websites/elevenlabs_io_agents-platform/legacy/voices/previews

### Description
Saves a voice preview (Legacy).

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/legacy/voices/previews

### Parameters
#### Query Parameters
None

#### Request Body
- **voice_id** (string) - Required - The ID of the voice to save a preview for.
- **audio_data** (string) - Required - The audio data of the voice preview.

### Request Example
```json
{
  "voice_id": "voice_1",
  "audio_data": "base64_encoded_audio_data"
}
```

### Response
#### Success Response (200)
- **preview_id** (string) - The ID of the saved voice preview.
- **message** (string) - Confirmation message.

#### Response Example
```json
{
  "preview_id": "preview_abc",
  "message": "Voice preview saved successfully."
}
```
```

--------------------------------

### Get Conversation Token (C#)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/get-webrtc-token

This C# code demonstrates how to get a conversation token using the RestSharp library. It configures a GET request to the ElevenLabs API, setting the agent ID in the URL and the API key as a header. The response is then executed.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=agent_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

--------------------------------

### POST /studio-projects/{project_id}/convert

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/run-tests_explorer=true

Converts a Studio Project.

```APIDOC
## POST /studio-projects/{project_id}/convert

### Description
Converts a Studio Project.

### Method
POST

### Endpoint
/studio-projects/{project_id}/convert

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the Studio Project.

### Request Example
None

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Studio Project conversion started."
}

```

--------------------------------

### Simulate Conversation with Java SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents/simulate-conversation

Provides an example of simulating an AI agent conversation using Java and the Unirest library. It demonstrates a fluent API for setting the POST request URL, headers, and JSON body.

```java
HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/convai/agents/agent_id/simulate-conversation")
  .header("xi-api-key", "xi-api-key")
  .header("Content-Type", "application/json")
  .body("{\n  \"simulation_specification\": {\n    \"simulated_user_config\": {}\n  }\n}")
  .asString();
```

--------------------------------

### Get Conversation Audio using Ruby SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/get-audio

This Ruby code fetches conversation audio from the Eleven Labs API. It constructs a GET request, sets the necessary headers including the API key, and prints the response body.

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/conversations/conversation_id/audio")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

--------------------------------

### Initialize ElevenLabs Conversation in React Native

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/expo-react-native

This snippet shows the setup for the ElevenLabs conversation provider and hooks in a React Native application. It configures event handlers for connection, disconnection, errors, messages, and mode changes. It also defines functions to start and end the conversation session, passing dynamic variables and agent IDs.

```tsx
import { ElevenLabsProvider, useConversation } from '@elevenlabs/react-native';
import type { ConversationStatus, ConversationEvent, Role } from '@elevenlabs/react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { TextInput } from 'react-native';

import { getBatteryLevel, changeBrightness, flashScreen } from './utils/tools';

const ConversationScreen = () => {
  const conversation = useConversation({
    clientTools: {
      getBatteryLevel,
      changeBrightness,
      flashScreen,
    },
    onConnect: ({ conversationId }: { conversationId: string }) => {
      console.log('✅ Connected to conversation', conversationId);
    },
    onDisconnect: (details: string) => {
      console.log('❌ Disconnected from conversation', details);
    },
    onError: (message: string, context?: Record<string, unknown>) => {
      console.error('❌ Conversation error:', message, context);
    },
    onMessage: ({ message, source }: { message: ConversationEvent; source: Role }) => {
      console.log(`💬 Message from ${source}:`, message);
    },
    onModeChange: ({ mode }: { mode: 'speaking' | 'listening' }) => {
      console.log(`🔊 Mode: ${mode}`);
    },
    onStatusChange: ({ status }: { status: ConversationStatus }) => {
      console.log(`📡 Status: ${status}`);
    },
    onCanSendFeedbackChange: ({ canSendFeedback }: { canSendFeedback: boolean }) => {
      console.log(`🔊 Can send feedback: ${canSendFeedback}`);
    },
  });

  const [isStarting, setIsStarting] = useState(false);
  const [textInput, setTextInput] = useState('');

  const handleSubmitText = () => {
    if (textInput.trim()) {
      conversation.sendUserMessage(textInput.trim());
      setTextInput('');
      Keyboard.dismiss();
    }
  };

  const startConversation = async () => {
    if (isStarting) return;

    setIsStarting(true);
    try {
      await conversation.startSession({
        agentId: process.env.EXPO_PUBLIC_AGENT_ID,
        dynamicVariables: {
          platform: Platform.OS,
        },
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error('Failed to end conversation:', error);
    }
  };

  const getStatusColor = (status: ConversationStatus): string => {
    switch (status) {
      case 'connected':
        return '#10B981';
      case 'connecting':
        return '#F59E0B';
      case 'disconnected':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: ConversationStatus): string => {
    return status[0].toUpperCase() + status.slice(1);
  };

  const canStart = conversation.status === 'disconnected' && !isStarting;
  const canEnd = conversation.status === 'connected';

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.title}>ElevenLabs React Native Example</Text>
        <Text style={styles.subtitle}>Remember to set the agentId in the .env file!</Text>

        <View style={styles.statusContainer}>
          <View
            style={[styles.statusDot, { backgroundColor: getStatusColor(conversation.status) }]} 
          />
          <Text style={styles.statusText}>{getStatusText(conversation.status)}</Text>
        </View>

        {/* Speaking Indicator */}
        {conversation.status === 'connected' && (
          <View style={styles.speakingContainer}>
            <View
              style={[
                styles.speakingDot,
                { 
                  backgroundColor: conversation.isSpeaking ? '#8B5CF6' : '#D1D5DB',
                },
              ]}
            />
            <Text
              style={[
                styles.speakingText,
                { color: conversation.isSpeaking ? '#8B5CF6' : '#9CA3AF' },
              ]}
            >
              {conversation.isSpeaking ? '🎤 AI Speaking' : '👂 AI Listening'}
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.startButton, !canStart && styles.disabledButton]}
            onPress={startConversation}
            disabled={!canStart}
          >
            <Text style={styles.buttonText}>
              {isStarting ? 'Starting...' : 'Start Conversation'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.endButton, !canEnd && styles.disabledButton]}
            onPress={endConversation}
          >
            <Text style={styles.buttonText}>End Conversation</Text>
          </TouchableOpacity>
        </View>

        {conversation.status === 'connected' && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={textInput}
              onChangeText={setTextInput}
              placeholder="Ask something..."
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              style={[styles.button, styles.sendButton]}
              onPress={handleSubmitText}
              disabled={!textInput.trim()}
            >
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  speakingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  speakingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  speakingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150,
  },
  startButton: {
    backgroundColor: '#8B5CF6',
  },
  endButton: {
    backgroundColor: '#EF4444',
  },
  sendButton: {
    backgroundColor: '#10B981',
    marginLeft: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#4B5563',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: '#1F2937',
    color: '#FFFFFF',
  },
});

export default () => (
  <ElevenLabsProvider>
    <ConversationScreen />
  </ElevenLabsProvider>
);

```

--------------------------------

### GET Get history item

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-agents_explorer=true

Retrieves a specific history item by its ID. This allows retrieval of specific prior requests.

```APIDOC
## GET Get history item

### Description
Retrieves a specific history item by its ID.

### Method
GET

### Endpoint
/get-history-item/{item_id}

### Parameters
#### Path Parameters
- **item_id** (string) - Required - The ID of the history item to retrieve.

### Request Example
N/A

### Response
#### Success Response (200)
- **id** (string) - The ID of the history item.
- **text** (string) - The text of the history item.

#### Response Example
{
  "id": "123",
  "text": "This is a history item."
}

```

--------------------------------

### GET Get history item

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents/get-link_explorer=true

Retrieves a specific history item by its ID.  This allows users to get details about a specific generated content.

```APIDOC
## GET Get history item

### Description
Retrieves a specific history item by its ID.

### Method
GET

### Endpoint
/history/{history_item_id}

### Parameters
#### Path Parameters
- **history_item_id** (string) - Required - The ID of the history item.

### Request Example
N/A

### Response
#### Success Response (200)
- **id** (string) - The ID of the history item.
- **text** (string) - The generated text.
- **created_at** (string) - The creation timestamp.

#### Response Example
{
  "id": "item1",
  "text": "This is a test.",
  "created_at": "2024-01-01T00:00:00Z"
}

```

--------------------------------

### LEGACY Knowledge Base API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/create_explorer=true

Add data to the knowledge base (Legacy).

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/legacy/knowledge-base

### Description
Adds data to the knowledge base (Legacy).

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/legacy/knowledge-base

### Parameters
#### Query Parameters
None

#### Request Body
- **data** (string) - Required - The content to add to the knowledge base.

### Request Example
```json
{
  "data": "This is a piece of information for the knowledge base."
}
```

### Response
#### Success Response (200)
- **id** (string) - The ID of the added knowledge base entry.
- **message** (string) - Confirmation message.

#### Response Example
```json
{
  "id": "kb_entry_1",
  "message": "Data added to knowledge base successfully."
}
```
```

--------------------------------

### POST /v1/convai/agent-testing/create

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/create_explorer=true

Creates a new agent response test by defining success conditions and example responses.

```APIDOC
## POST /v1/convai/agent-testing/create

### Description
Creates a new agent response test.

### Method
POST

### Endpoint
https://api.elevenlabs.io/v1/convai/agent-testing/create

### Parameters
#### Headers
- **xi-api-key** (string) - Required - API key for authentication.

#### Request Body
- **chat_history** (list of objects) - Required - The history of the conversation.
- **success_condition** (string) - Required - A prompt that evaluates whether the agent's response is successful. Should return True or False.
- **success_examples** (list of objects) - Required - Non-empty list of example responses that should be considered successful.
  - **response** (string) - The example response.
  - **type** (string) - The type of the example response.
- **failure_examples** (list of objects) - Required - Non-empty list of example responses that should be considered failures.
  - **response** (string) - The example response.
  - **type** (string) - The type of the example response.
- **name** (string) - Required - The name of the test.
- **tool_call_parameters** (object or null) - Optional - How to evaluate the agent’s tool call (if any). If empty, the tool call is not evaluated.
- **dynamic_variables** (map from strings to nullable strings or doubles or integers or booleans) - Optional - Dynamic variables to replace in the agent config during testing.
- **type** (enum) - Optional - Allowed values: llm, tool.
- **from_conversation_metadata** (object or null) - Optional - Metadata of a conversation this test was created from (if applicable).

### Request Example
```json
{
  "chat_history": [
    {
      "role": "user",
      "time_in_call_secs": 1
    }
  ],
  "success_condition": "string",
  "success_examples": [
    {
      "response": "string",
      "type": "string"
    }
  ],
  "failure_examples": [
    {
      "response": "string",
      "type": "string"
    }
  ],
  "name": "string"
}
```

### Response
#### Success Response (200)
- **id** (string) - The unique identifier for the created test.

#### Response Example
```json
{
  "id": "string"
}
```

### Errors
- **422** - Unprocessable Entity Error
```

--------------------------------

### Delete Document Rag Index - Multiple Languages

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/delete-document-rag-index

Examples of how to delete a document rag index from the ElevenLabs knowledge base using various programming languages. These snippets demonstrate making a DELETE request to the ElevenLabs API, typically requiring an API key for authentication. Ensure you have the necessary SDKs or HTTP client libraries installed for each language.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/rag-index/rag_index_id"

	req, _ := http.NewRequest("DELETE", url, nil)

	req.Header.Add("xi-api-key", "xi-api-key")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/rag-index/rag_index_id")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Delete.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.delete("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/rag-index/rag_index_id")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('DELETE', 'https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/rag-index/rag_index_id', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();

```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/rag-index/rag_index_id");
var request = new RestRequest(Method.DELETE);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/rag-index/rag_index_id")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "DELETE"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

--------------------------------

### LEGACY Knowledge Base API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-text_explorer=true

Manage the knowledge base using legacy API endpoints.

```APIDOC
## POST https://api.elevenlabs.io/v1/convai/knowledge-base/text

### Description
Adds text content to the knowledge base.

### Method
POST

### Endpoint
https://api.elevenlabs.io/v1/convai/knowledge-base/text

### Parameters

#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **text** (string) - Required - The text content to add to the knowledge base.

### Request Example
```json
{
  "text": "This is a piece of information for the knowledge base."
}
```

### Response
#### Success Response (200)
- **message** (string) - A confirmation message indicating the text was added.

#### Response Example
```json
{
  "message": "Text added to knowledge base successfully."
}
```
```

--------------------------------

### GET /agents/{agent_id}/link

Source: https://elevenlabs.io/docs/agents-platform/api-reference/widget/get_explorer=true

Get a link to interact with a specific agent. This link can be used to embed the agent in a web application or share it with others.

```APIDOC
## GET /agents/{agent_id}/link

### Description
Gets a link to interact with the agent.

### Method
GET

### Endpoint
/agents/{agent_id}/link

### Parameters
#### Path Parameters
- **agent_id** (string) - Required - The ID of the agent to get the link for.

### Response
#### Success Response (200)
- **link** (string) - The URL to interact with the agent.

#### Response Example
```json
{
  "link": "https://example.com/agent/agent_123"
}
```
```

--------------------------------

### Studio Project Management

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents-platform/websocket_explorer=true

Endpoints for managing Studio Projects, including creating, updating, deleting, converting, and managing snapshots and chapters.

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects

### Description
List all Studio Projects.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects

### Parameters

#### Path Parameters

#### Query Parameters

#### Request Body

### Request Example

### Response
#### Success Response (200)
- **projects** (array) - A list of Studio Projects.

#### Response Example
```json
{
  "projects": [
    {"id": "proj_123", "name": "My Awesome Project"}
  ]
}
```

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/update

### Description
Update an existing Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/update

### Parameters

#### Path Parameters

#### Query Parameters

#### Request Body
- **project_id** (string) - Required - The ID of the project to update.
- **updates** (object) - Required - The fields to update.

### Request Example
```json
{
  "project_id": "proj_123",
  "updates": {
    "name": "Updated Project Name"
  }
}
```

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
```json
{
  "message": "Project updated successfully."
}
```

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/get

### Description
Get details of a specific Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/get

### Parameters

#### Path Parameters

#### Query Parameters
- **project_id** (string) - Required - The ID of the project.

#### Request Body

### Request Example

### Response
#### Success Response (200)
- **project_details** (object) - Details of the Studio Project.

#### Response Example
```json
{
  "project_details": {
    "id": "proj_123",
    "name": "My Awesome Project",
    "created_at": "2023-10-27T10:00:00Z"
  }
}
```

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/create

### Description
Create a new Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/create

### Parameters

#### Path Parameters

#### Query Parameters

#### Request Body
- **name** (string) - Required - The name of the new project.

### Request Example
```json
{
  "name": "New Project Name"
}
```

### Response
#### Success Response (200)
- **project_id** (string) - The ID of the newly created project.

#### Response Example
```json
{
  "project_id": "proj_456"
}
```

## DEL /websites/elevenlabs_io_agents-platform/administration/studio/projects/delete

### Description
Delete a Studio Project.

### Method
DELETE

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/delete

### Parameters

#### Path Parameters

#### Query Parameters
- **project_id** (string) - Required - The ID of the project to delete.

#### Request Body

### Request Example

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
```json
{
  "message": "Project deleted successfully."
}
```

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/convert

### Description
Convert a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/convert

### Parameters

#### Path Parameters

#### Query Parameters

#### Request Body
- **project_id** (string) - Required - The ID of the project to convert.
- **target_format** (string) - Required - The target format for conversion.

### Request Example
```json
{
  "project_id": "proj_123",
  "target_format": "mp3"
}
```

### Response
#### Success Response (200)
- **conversion_id** (string) - The ID of the conversion job.

#### Response Example
```json
{
  "conversion_id": "conv_abc"
}
```

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/update/content

### Description
Update the content of a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/update/content

### Parameters

#### Path Parameters

#### Query Parameters

#### Request Body
- **project_id** (string) - Required - The ID of the project.
- **content** (object) - Required - The new content for the project.

### Request Example
```json
{
  "project_id": "proj_123",
  "content": {
    "script": "New script content."
  }
}
```

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
```json
{
  "message": "Project content updated successfully."
}
```

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/snapshots

### Description
List snapshots for a Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/snapshots

### Parameters

#### Path Parameters

#### Query Parameters
- **project_id** (string) - Required - The ID of the project.

#### Request Body

### Request Example

### Response
#### Success Response (200)
- **snapshots** (array) - A list of snapshots.

#### Response Example
```json
{
  "snapshots": [
    {"id": "snap_1", "created_at": "2023-10-27T11:00:00Z"}
  ]
}
```

## STREAM /websites/elevenlabs_io_agents-platform/administration/studio/projects/audio/stream

### Description
Stream audio from a Studio Project.

### Method
STREAM

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/audio/stream

### Parameters

#### Path Parameters

#### Query Parameters
- **project_id** (string) - Required - The ID of the project.

#### Request Body

### Request Example

### Response
#### Success Response (200)
- **audio_stream** (stream) - The audio stream.

#### Response Example
(Streaming audio data)

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/archive/stream

### Description
Stream an archive with Studio Project audio.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/archive/stream

### Parameters

#### Path Parameters

#### Query Parameters

#### Request Body
- **project_id** (string) - Required - The ID of the project.

### Request Example
```json
{
  "project_id": "proj_123"
}
```

### Response
#### Success Response (200)
- **archive_stream** (stream) - The archive stream.

#### Response Example
(Streaming archive data)

## GET /websites/elevenlabs_io_agents-platform/administration/studio/chapters/list

### Description
List chapters for a Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters/list

### Parameters

#### Path Parameters

#### Query Parameters
- **project_id** (string) - Required - The ID of the project.

#### Request Body

### Request Example

### Response
#### Success Response (200)
- **chapters** (array) - A list of chapters.

#### Response Example
```json
{
  "chapters": [
    {"id": "chap_1", "title": "Chapter 1"}
  ]
}
```

## GET /websites/elevenlabs_io_agents-platform/administration/studio/chapters/get

### Description
Get a specific chapter.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters/get

### Parameters

#### Path Parameters

#### Query Parameters
- **chapter_id** (string) - Required - The ID of the chapter.

#### Request Body

### Request Example

### Response
#### Success Response (200)
- **chapter_details** (object) - Details of the chapter.

#### Response Example
```json
{
  "chapter_details": {
    "id": "chap_1",
    "title": "Chapter 1",
    "content": "Chapter content..."
  }
}
```

## POST /websites/elevenlabs_io_agents-platform/administration/studio/chapters/create

### Description
Create a new chapter.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters/create

### Parameters

#### Path Parameters

#### Query Parameters

#### Request Body
- **project_id** (string) - Required - The ID of the project.
- **title** (string) - Required - The title of the chapter.
- **content** (object) - Optional - The content of the chapter.

### Request Example
```json
{
  "project_id": "proj_123",
  "title": "New Chapter",
  "content": {
    "script": "Chapter script."
  }
}
```

### Response
#### Success Response (200)
- **chapter_id** (string) - The ID of the newly created chapter.

#### Response Example
```json
{
  "chapter_id": "chap_2"
}
```

## POST /websites/elevenlabs_io_agents-platform/administration/studio/chapters/update

### Description
Update an existing chapter.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters/update

### Parameters

#### Path Parameters

#### Query Parameters

#### Request Body
- **chapter_id** (string) - Required - The ID of the chapter to update.
- **updates** (object) - Required - The fields to update.

```

--------------------------------

### Configure Documentation Assistant Tone for AI Agent

Source: https://elevenlabs.io/docs/agents-platform/best-practices/prompting-guide

This configuration defines a professional yet conversational tone for a documentation assistant AI agent. It balances technical accuracy with approachable explanations, using natural speech markers and strategic pauses for TTS optimization. The agent is programmed to assess user technical familiarity and transparently acknowledge knowledge gaps.

```mdx
# Tone

Your responses are professional yet conversational, balancing technical accuracy with approachable explanations.
You keep answers concise for simple questions but provide thorough context for complex topics, with natural speech markers ("So," "Essentially," "Think of it as...").
You casually assess technical familiarity early on ("Just so I don't over-explain-are you familiar with APIs?") and adjust language accordingly.
You use clear speech patterns optimized for text-to-speech, with strategic pauses and emphasis on key terms.
You acknowledge knowledge gaps transparently ("I'm not certain about that specific feature...") and proactively suggest relevant documentation or resources.
```

--------------------------------

### GET Get separated speaker audio

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-agents_explorer=true

Retrieves the audio of the separated speaker after the speaker separation process is complete.  Allows access to the isolated voice.

```APIDOC
## GET Get separated speaker audio

### Description
Retrieves the audio of the separated speaker.

### Method
GET

### Endpoint
/get-separated-speaker-audio

### Parameters
#### Query Parameters
- **task_id** (string) - Required - The ID of the speaker separation task.

### Request Example
N/A

### Response
#### Success Response (200)
- **audio_data** (binary) - The audio data of the separated speaker.

#### Response Example
N/A (binary data)

```

--------------------------------

### Fetch MCP Servers - Swift SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/list

This Swift code snippet demonstrates fetching MCP server data using URLSession. It sets up an NSMutableURLRequest with the GET method and the 'xi-api-key' header, then executes the request.

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/mcp-servers")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

--------------------------------

### Get Agent Knowledge Base Size - Go

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/size

Sends an HTTP GET request to the ElevenLabs API to retrieve the knowledge base size for a given agent. It includes the API key in the headers and prints the response status and body.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/agent/agent_id/knowledge-base/size"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("xi-api-key", "xi-api-key")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}

```

--------------------------------

### Workspace Settings API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-file_explorer=true

Endpoints for retrieving and updating workspace settings.

```APIDOC
## GET /workspace/settings

### Description
Retrieves the current workspace settings.

### Method
GET

### Endpoint
/workspace/settings

### Response
#### Success Response (200)
- **settings** (object) - An object containing various workspace settings.
  - **default_agent_id** (string) - Optional - The ID of the default agent for the workspace.
  - **language** (string) - Optional - The default language for the workspace.

#### Response Example
```json
{
  "settings": {
    "default_agent_id": "agent_12345",
    "language": "en-US"
  }
}
```

## PATCH /workspace/settings

### Description
Updates workspace settings.

### Method
PATCH

### Endpoint
/workspace/settings

### Parameters
#### Request Body
- **default_agent_id** (string) - Optional - Set the default agent for the workspace.
- **language** (string) - Optional - Set the default language for the workspace.

### Request Example
```json
{
  "default_agent_id": "agent_67890",
  "language": "es-ES"
}
```

### Response
#### Success Response (200)
- **message** (string) - Confirmation message of the update.

#### Response Example
```json
{
  "message": "Workspace settings updated successfully."
}
```
```

--------------------------------

### Get Agent Knowledge Base Size - Swift

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/size

Uses Swift's Foundation framework to create and send an HTTP GET request to the ElevenLabs API for knowledge base size. The API key is set in the request headers, and the response is handled in a completion handler.

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/agent/agent_id/knowledge-base/size")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()

```

--------------------------------

### GET Get link

Source: https://elevenlabs.io/docs/agents-platform/api-reference/phone-numbers/create_explorer=true

Retrieves a link associated with an agent in the Agents Platform. This endpoint allows you to get a specific link for an agent, potentially for accessing a UI or other resource.

```APIDOC
## GET Get link

### Description
Retrieves a link for a specific agent.

### Method
GET

### Endpoint
/agents/{agent_id}/link

### Parameters
#### Path Parameters
- **agent_id** (string) - Required - The ID of the agent.

### Response
#### Success Response (200)
- **link** (string) - The link associated with the agent.

#### Response Example
```json
{
  "link": "https://example.com/agent/agent_123"
}
```
```

--------------------------------

### Administration Studio Projects

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/list_explorer=true

Endpoints for managing Studio Projects, including creation, updates, deletion, conversion, and snapshots.

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects

### Description
List Studio Projects.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects

---

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

### Description
Update a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

---

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

### Description
Get a specific Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

---

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects

### Description
Create a new Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects

---

## DELETE /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

### Description
Delete a Studio Project.

### Method
DELETE

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}

---

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/convert

### Description
Convert a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/convert

---

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/content

### Description
Update the content of a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/content

---

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/snapshots

### Description
List snapshots for a Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/snapshots

---

## STREAM /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/audio

### Description
Stream audio from a Studio Project.

### Method
STREAM

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/audio

---

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/archive/stream

### Description
Stream an archive with Studio Project audio.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/archive/stream

---

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters

### Description
List chapters for a Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters

---

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}

### Description
Get a specific chapter from a Studio Project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}

---

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters

### Description
Create a new chapter for a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters

---

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}

### Description
Update an existing chapter in a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}

---

## DELETE /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}

### Description
Delete a chapter from a Studio Project.

### Method
DELETE

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}

---

## POST /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}/convert

### Description
Convert a chapter within a Studio Project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}/convert

---

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}/snapshots

### Description
List snapshots for a specific chapter.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}/snapshots

---

## STREAM /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}/audio

### Description
Stream audio for a specific chapter.

### Method
STREAM

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/chapters/{chapter_id}/audio

---

## POST /websites/elevenlabs_io_agents-platform/administration/studio/pronunciation-dictionaries

### Description
Create pronunciation dictionaries from a file.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/pronunciation-dictionaries

---

## POST /websites/elevenlabs_io_agents-platform/administration/studio/podcast

### Description
Create a podcast.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/podcast

---

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/snapshots/{snapshot_id}

### Description
Get a specific chapter snapshot.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/snapshots/{snapshot_id}

---

## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/snapshots/{snapshot_id}

### Description
Get a specific project snapshot.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects/{project_id}/snapshots/{snapshot_id}

```

--------------------------------

### Configure Voice and Text Modes

Source: https://elevenlabs.io/docs/agents-platform/libraries/swift

Examples of configuring the conversation for either voice (default) or text-only modes.

```swift
// Voice conversation (default)
let voiceConfig = ConversationConfig(
    conversationOverrides: ConversationOverrides(textOnly: false)
)

// Text-only conversation
let textConfig = ConversationConfig(
    conversationOverrides: ConversationOverrides(textOnly: true)
)
```

--------------------------------

### Get Phone Number Details (C#)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/phone-numbers/get

Demonstrates how to get phone number details in C# using the RestSharp library. This snippet sends a GET request to the ElevenLabs API, setting the 'xi-api-key' in the request headers.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/phone-numbers/phone_number_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

--------------------------------

### Fetch Dependent Agents using ElevenLabs SDK (Multiple Languages)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/get-dependent-agents

This snippet demonstrates how to fetch dependent agents for a given tool ID using the ElevenLabs SDK. It covers implementations in Go, Ruby, Java, PHP, C#, Swift, TypeScript, and Python, showcasing different HTTP client libraries and SDK integrations. Ensure you have the necessary API key and SDKs installed.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/tools/tool_id/dependent-agents"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("xi-api-key", "xi-api-key")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/tools/tool_id/dependent-agents")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/tools/tool_id/dependent-agents")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/tools/tool_id/dependent-agents', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();

```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/tools/tool_id/dependent-agents");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/tools/tool_id/dependent-agents")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.tools.getDependentAgents("tool_id", {});
}
main();

```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.tools.get_dependent_agents(
    tool_id="tool_id"
)

```

--------------------------------

### LEGACY Knowledge Base API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/list_explorer=true

Add data to the legacy knowledge base.

```APIDOC
## LEGACY Knowledge Base API

### Description
Allows adding data to the legacy knowledge base.

### Endpoint

#### POST /websites/elevenlabs_io_agents-platform/knowledge-base

##### Description
Adds data to the knowledge base.

##### Method
POST
```

--------------------------------

### Get RAG Index Overview with Eleven Labs API (C#)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/rag-index-overview

Demonstrates fetching the RAG index overview from Eleven Labs API using RestSharp in C#. This code snippet includes setting the API key header for the GET request.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/knowledge-base/rag-index");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

--------------------------------

### GET /studio/projects

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents/update_explorer=true

Lists Studio Projects.

```APIDOC
## GET /studio/projects

### Description
Lists Studio Projects.

### Method
GET

### Endpoint
/studio/projects

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **projects** (array) - An array of Studio Project objects.

#### Response Example
{
  "projects": [
    {"id": "project_1", "name": "Project 1"},
    {"id": "project_2", "name": "Project 2"}
  ]
}

```

--------------------------------

### Configure HubSpot get_previous_calls Webhook Tool

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/hub-spot

This configuration defines a HubSpot webhook tool named 'get_previous_calls' to retrieve calls associated with a specific contact. It uses a GET request to a dynamic URL that includes a contact ID, and requires an authorization header. The tool is designed to fetch call history for a given contact, utilizing the contact ID obtained from a previous search.

```json
{
  "id": "tool_01jxfv4pttep6bbjaqe9tjk28n",
  "type": "webhook",
  "name": "get_previous_calls",
  "description": "This API retrieves the calls associated with a contact",
  "api_schema": {
    "url": "https://api.hubapi.com/crm/v3/objects/contacts/{CONTACT_ID}/associations/calls?limit=100",
    "method": "GET",
    "path_params_schema": [],
    "query_params_schema": [],
    "request_body_schema": null,
    "request_headers": [
      {
        "type": "secret",
        "name": "Authorization",
        "secret_id": "YOUR SECRET"
      }
    ]
  },
  "response_timeout_secs": 20,
  "dynamic_variables": {
    "dynamic_variable_placeholders": {
      "CONTACT_ID": {
        "type": "variable",
        "description": "Use the contact ID from the results of the search_contact tool"
      }
    }
  }
}
```

--------------------------------

### GET Get audio from sample

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/create_explorer=true

Retrieves audio data from a specified sample. This allows users to access the audio associated with a particular sample.

```APIDOC
## GET Get audio from sample

### Description
Retrieves audio data from a sample.

### Method
GET

### Endpoint
/get-audio-from-sample

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **audio** (binary) - Audio data.

#### Response Example
[Audio binary data]

```

--------------------------------

### GET Get agent

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/update_explorer=true

This endpoint retrieves the details of a specific agent based on its ID.  Use this to get an agent's configuration and status.

```APIDOC
## GET /agents/{agent_id}

### Description
Retrieves the details of a specific agent.

### Method
GET

### Endpoint
/agents/{agent_id}

### Parameters
#### Path Parameters
- **agent_id** (string) - Required - The ID of the agent to retrieve.

### Response
#### Success Response (200)
- **id** (string) - The ID of the agent.
- **name** (string) - The name of the agent.
- **description** (string) - The description of the agent.

#### Response Example
```json
{
  "id": "agent_123",
  "name": "My Agent",
  "description": "A helpful agent."
}
```
```

--------------------------------

### GET Get PVC speaker separation status

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-agents_explorer=true

Checks the status of the speaker separation process for Personal Voice Cloning. Provides insight into the progress of the separation process.

```APIDOC
## GET Get PVC speaker separation status

### Description
Checks the status of the speaker separation process for Personal Voice Cloning.

### Method
GET

### Endpoint
/get-pvc-speaker-separation-status

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **status** (string) - Status of the speaker separation process (e.g., "pending", "in_progress", "completed", "failed").

#### Response Example
{
  "status": "completed"
}

```

--------------------------------

### Fetch Tool Information using RestSharp (C#)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/get

Provides a C# example for fetching tool information using the RestSharp library. RestSharp simplifies REST API interactions by offering an object-oriented approach to building requests and handling responses. This code assumes RestSharp is added as a project dependency.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/tools/tool_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

--------------------------------

### Common SOQL Queries

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/salesforce

Examples of SOQL queries for retrieving data from Salesforce.

```APIDOC
## Common SOQL Queries

### Search for Contacts by Email
```sql
SELECT Id, Name, Email, Phone, Title, Account.Name, Account.Type FROM Contact WHERE Email = 'customer@example.com'
```

### Search for Leads by Email or Phone
```sql
SELECT Id, Name, Email, Phone, Company, Industry, Status, LeadSource, Title FROM Lead WHERE Email = 'customer@example.com' OR Phone = '+1234567890'
```

### Search for Accounts by Name
```sql
SELECT Id, Name, Type, Industry, Phone, BillingCity, BillingState, Website FROM Account WHERE Name LIKE '%Company Name%'
```

### Search for Recent Opportunities
```sql
SELECT Id, Name, StageName, Amount, CloseDate, Account.Name, Account.Type, Owner.Name, Description FROM Opportunity WHERE CreatedDate = THIS_MONTH
```

### Search for Opportunities by Account
```sql
SELECT Id, Name, StageName, Amount, CloseDate, Probability, NextStep, Owner.Name FROM Opportunity WHERE Account.Name LIKE '%Company Name%'
```
```

--------------------------------

### GET Get PVC verification captcha

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-agents_explorer=true

Retrieves a CAPTCHA image for the Personal Voice Cloning verification process. Used to ensure human interaction and prevent automated abuse.

```APIDOC
## GET Get PVC verification captcha

### Description
Retrieves a CAPTCHA image for the Personal Voice Cloning verification process.

### Method
GET

### Endpoint
/get-pvc-verification-captcha

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **image_data** (string) - Base64 encoded image data of the CAPTCHA.

#### Response Example
{
  "image_data": "..."
}

```

--------------------------------

### Administration Studio API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/get_explorer=true

Endpoints for managing Studio projects, chapters, and related assets.

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/administration/studio/projects

### Description
List Studio projects.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/projects

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **projects** (array) - A list of Studio projects.

#### Response Example
```json
{
  "projects": [
    {
      "id": "string",
      "name": "string"
    }
  ]
}
```
```

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/administration/studio/project/update

### Description
Update a Studio project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/project/update

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **project_id** (string) - Required - The ID of the project to update.
- **name** (string) - Optional - The new name for the project.

### Request Example
```json
{
  "project_id": "string",
  "name": "string"
}
```

### Response
#### Success Response (200)
- **message** (string) - A confirmation message indicating the project has been updated.

#### Response Example
```json
{
  "message": "string"
}
```
```

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/administration/studio/project

### Description
Get a specific Studio project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/project

### Parameters
#### Path Parameters
None

#### Query Parameters
- **project_id** (string) - Required - The ID of the project.

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **projectDetails** (object) - Details of the Studio project.

#### Response Example
```json
{
  "projectDetails": {
    "id": "string",
    "name": "string",
    "createdAt": "string"
  }
}
```
```

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/administration/studio/project/create

### Description
Create a new Studio project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/project/create

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **name** (string) - Required - The name of the new project.

### Request Example
```json
{
  "name": "string"
}
```

### Response
#### Success Response (200)
- **project_id** (string) - The ID of the newly created project.

#### Response Example
```json
{
  "project_id": "string"
}
```
```

```APIDOC
## DEL /websites/elevenlabs_io_agents-platform/administration/studio/project/delete

### Description
Delete a Studio project.

### Method
DELETE

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/project/delete

### Parameters
#### Path Parameters
None

#### Query Parameters
- **project_id** (string) - Required - The ID of the project to delete.

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **message** (string) - A confirmation message indicating the project has been deleted.

#### Response Example
```json
{
  "message": "string"
}
```
```

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/administration/studio/project/convert

### Description
Convert a Studio project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/project/convert

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **project_id** (string) - Required - The ID of the project to convert.

### Request Example
```json
{
  "project_id": "string"
}
```

### Response
#### Success Response (200)
- **message** (string) - A confirmation message indicating the project conversion has started.

#### Response Example
```json
{
  "message": "string"
}
```
```

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/administration/studio/project/content/update

### Description
Update the content of a Studio project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/project/content/update

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **project_id** (string) - Required - The ID of the project.
- **content** (string) - Required - The new content for the project.

### Request Example
```json
{
  "project_id": "string",
  "content": "string"
}
```

### Response
#### Success Response (200)
- **message** (string) - A confirmation message indicating the project content has been updated.

#### Response Example
```json
{
  "message": "string"
}
```
```

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/administration/studio/project/snapshots

### Description
List snapshots for a Studio project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/project/snapshots

### Parameters
#### Path Parameters
None

#### Query Parameters
- **project_id** (string) - Required - The ID of the project.

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **snapshots** (array) - A list of snapshots for the project.

#### Response Example
```json
{
  "snapshots": [
    {
      "id": "string",
      "createdAt": "string"
    }
  ]
}
```
```

```APIDOC
## STREAM /websites/elevenlabs_io_agents-platform/administration/studio/project/audio

### Description
Stream audio from a Studio project.

### Method
STREAM

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/project/audio

### Parameters
#### Path Parameters
None

#### Query Parameters
- **project_id** (string) - Required - The ID of the project.

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **audio_stream** (stream) - The audio stream of the project.

#### Response Example
(Audio stream content)
```

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/administration/studio/stream/archive/audio

### Description
Stream archive with Studio project audio.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/stream/archive/audio

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **project_id** (string) - Required - The ID of the project.
- **archive_format** (string) - Optional - The desired archive format.

### Request Example
```json
{
  "project_id": "string",
  "archive_format": "zip"
}
```

### Response
#### Success Response (200)
- **audio_stream** (stream) - The audio stream of the project archive.

#### Response Example
(Audio stream content)
```

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/administration/studio/chapters

### Description
List chapters for a Studio project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapters

### Parameters
#### Path Parameters
None

#### Query Parameters
- **project_id** (string) - Required - The ID of the project.

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **chapters** (array) - A list of chapters for the project.

#### Response Example
```json
{
  "chapters": [
    {
      "id": "string",
      "title": "string"
    }
  ]
}
```
```

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/administration/studio/chapter

### Description
Get a specific chapter from a Studio project.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapter

### Parameters
#### Path Parameters
None

#### Query Parameters
- **chapter_id** (string) - Required - The ID of the chapter.

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **chapterDetails** (object) - Details of the chapter.

#### Response Example
```json
{
  "chapterDetails": {
    "id": "string",
    "title": "string",
    "content": "string"
  }
}
```
```

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/administration/studio/chapter/create

### Description
Create a new chapter for a Studio project.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/studio/chapter/create

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **project_id** (string) - Required - The ID of the project.
- **title** (string) - Required - The title of the chapter.
- **content** (string) - Optional - The content of the chapter.

### Request Example
```json
{
  "project_id": "string",
  "title": "string",
  "content": "string"
}
```

### Response
#### Success Response (200)
- **chapter_id** (string) - The ID of the newly created chapter.

#### Response Example
```json
{
  "chapter_id": "string"
}
```
```

```text

```

--------------------------------

### POST Update Studio Project

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/create_explorer=true

Updates a Studio Project.

```APIDOC
## POST Update Studio Project

### Description
Updates a Studio Project.

### Method
POST

### Endpoint
/update-studio-project

### Parameters
None

### Request Example
{}

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.

#### Response Example
{
  "message": "Project updated"
}

```

--------------------------------

### GET Get PVC voice sample waveform

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-agents_explorer=true

Retrieves the waveform data for a voice sample in the Personal Voice Cloning (PVC) process. Useful for visualizing the audio data.

```APIDOC
## GET Get PVC voice sample waveform

### Description
Retrieves the waveform data for a voice sample in the Personal Voice Cloning (PVC) process.

### Method
GET

### Endpoint
/get-pvc-voice-sample-waveform

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **waveform** (array) - Array of numerical values representing the waveform.

#### Response Example
{
  "waveform": [0.1, -0.2, 0.3, -0.4, ...]
}

```

--------------------------------

### GET Get Chapter

Source: https://elevenlabs.io/docs/agents-platform/api-reference/workspace/secrets/list_explorer=true

Retrieves a chapter by ID.

```APIDOC
## GET Get Chapter

### Description
Retrieves a chapter by ID.

### Method
GET

### Endpoint
/chapters/{chapter_id}

### Parameters
#### Path Parameters
- **chapter_id** (string) - Required - The ID of the chapter to retrieve.

### Request Example
N/A

### Response
#### Success Response (200)
- **chapter_id** (string) - The ID of the chapter.
- **name** (string) - The name of the chapter.

#### Response Example
{
  "chapter_id": "chapter_1",
  "name": "Chapter 1"
}

```

--------------------------------

### GET /chapters/{chapter_id}

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/delete_explorer=true

Gets Chapter.

```APIDOC
## GET /chapters/{chapter_id}

### Description
Gets Chapter.

### Method
GET

### Endpoint
/chapters/{chapter_id}

### Parameters
#### Path Parameters
- **chapter_id** (string) - Required - ID of the Chapter

### Request Example
/chapters/chapter123

### Response
#### Success Response (200)
- **id** (string) - ID of the chapter
- **name** (string) - Name of the chapter
- **content** (string) - Content of the chapter

#### Response Example
{
  "id": "chapter123",
  "name": "Chapter 1",
  "content": "Chapter content"
}

```

--------------------------------

### Administration - Samples

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/get_explorer=true

Endpoints for managing voice samples.

```APIDOC
## DEL /administration/samples/{sample_id}

### Description
Deletes a voice sample.

### Method
DELETE

### Endpoint
/administration/samples/{sample_id}

### Parameters
#### Path Parameters
- **sample_id** (string) - Required - The ID of the sample to delete.

### Response
#### Success Response (200)
- **message** (string) - Confirmation message.
```

--------------------------------

### GET /history

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/delete_explorer=true

Gets generated items.

```APIDOC
## GET /history

### Description
Gets generated items.

### Method
GET

### Endpoint
/history

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **items** (array) - Array of generated items

#### Response Example
{
  "items": [
    {
      "id": "item1",
      "text": "Hello",
      "audio": "..."
    }
  ]
}

```

--------------------------------

### Language Detection Function Call Example

Source: https://elevenlabs.io/docs/agents-platform/customization/language/language-detection

Demonstrates the JSON format for calling the `language_detection` function. This includes the reason for the switch and the target language code, which must be a supported language.

```json
{
  "type": "function",
  "function": {
    "name": "language_detection",
    "arguments": "{\"reason\": \"User requested Spanish\", \"language\": \"es\"}"
  }
}
```

--------------------------------

### GET Get voice settings

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/create_explorer=true

Retrieves the settings for a specific voice. Used to view the configuration of a particular voice.

```APIDOC
## GET Get voice settings

### Description
Retrieves voice settings.

### Method
GET

### Endpoint
/get-voice-settings

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **settings** (object) - Voice settings.

#### Response Example
{
  "similarity_boost": 0.8,
  "stability": 0.6
}

```

--------------------------------

### Administration Studio API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/workspace/update_explorer=true

Manage Studio Projects, Chapters, Pronunciation Dictionaries, and Podcasts within the administration panel.

```APIDOC
## ADMINISTRATIONStudio API

### GET /studio/projects
#### List Studio Projects
Lists all Studio Projects.

### POST /studio/projects
#### Create Studio Project
Creates a new Studio Project.

### GET /studio/projects/{project_id}
#### Get Studio Project
Retrieves details of a specific Studio Project.

### POST /studio/projects/{project_id}/update
#### Update Studio Project
Updates an existing Studio Project.

### DELETE /studio/projects/{project_id}
#### Delete Studio Project
Deletes a Studio Project.

### POST /studio/projects/{project_id}/convert
#### Convert Studio Project
Converts a Studio Project.

### POST /studio/projects/{project_id}/content/update
#### Update Studio Project Content
Updates the content of a Studio Project.

### GET /studio/projects/{project_id}/snapshots
#### List Studio Project Snapshots
Lists snapshots for a Studio Project.

### STREAM /studio/projects/{project_id}/audio
#### Stream Studio Project Audio
Streams audio for a Studio Project.

### POST /studio/projects/stream/archive
#### Stream Archive With Studio Project Audio
Streams an archive with Studio Project audio.

### GET /studio/projects/{project_id}/chapters
#### List Chapters
Lists chapters for a Studio Project.

### GET /studio/projects/{project_id}/chapters/{chapter_id}
#### Get Chapter
Retrieves a specific chapter.

### POST /studio/projects/{project_id}/chapters
#### Create Chapter
Creates a new chapter.

### POST /studio/projects/{project_id}/chapters/{chapter_id}
#### Update Chapter
Updates an existing chapter.

### DELETE /studio/projects/{project_id}/chapters/{chapter_id}
#### Delete Chapter
Deletes a chapter.

### POST /studio/projects/{project_id}/chapters/{chapter_id}/convert
#### Convert Chapter
Converts a chapter.

### GET /studio/projects/{project_id}/chapters/{chapter_id}/snapshots
#### List Chapter Snapshots
Lists snapshots for a chapter.

### STREAM /studio/projects/{project_id}/chapters/{chapter_id}/audio
#### Stream Chapter Audio
Streams audio for a chapter.

### POST /pronunciation-dictionaries
#### Create Pronunciation Dictionaries
Creates pronunciation dictionaries.

### POST /podcasts
#### Create Podcast
Creates a podcast.

### GET /studio/projects/{project_id}/snapshots/{snapshot_id}
#### Get Chapter Snapshot
Retrieves a specific chapter snapshot.

### GET /studio/projects/{project_id}/snapshots/{snapshot_id}
#### Get Project Snapshot
Retrieves a specific project snapshot.
```

--------------------------------

### Administration Models

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents-platform/websocket_explorer=true

Endpoint for listing available models.

```APIDOC
## GET /websites/elevenlabs_io_agents-platform/administration/models

### Description
List available models.

### Method
GET

### Endpoint
/websites/elevenlabs_io_agents-platform/administration/models

### Parameters

#### Path Parameters

#### Query Parameters

#### Request Body

### Request Example

### Response
#### Success Response (200)
- **models** (array) - A list of available models.

#### Response Example
```json
{
  "models": [
    {"id": "model_1", "name": "Eleven Multilingual V1"},
    {"id": "model_2", "name": "Eleven English V2"}
  ]
}
```
```

--------------------------------

### Initialize and Use ElevenLabsClient in TypeScript

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/get

This example demonstrates initializing the ElevenLabsClient in TypeScript and calling the `conversations.get()` method to retrieve data. It assumes the necessary environment is configured.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.conversations.get();
}
main();

```

--------------------------------

### GET List agents

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-agents_explorer=true

Retrieves a list of agents.

```APIDOC
## GET List agents

### Description
Retrieves a list of agents.

### Method
GET

### Endpoint
/agents-platform/agents

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **agents** (array) - An array of agents.

#### Response Example
{
  "agents": [{
    "id": "agent123",
    "name": "My Agent",
    "description": "A helpful agent."
  }]
}

```

--------------------------------

### GET /history/{history_item_id}

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/delete_explorer=true

Gets history item.

```APIDOC
## GET /history/{history_item_id}

### Description
Gets history item.

### Method
GET

### Endpoint
/history/{history_item_id}

### Parameters
#### Path Parameters
- **history_item_id** (string) - Required - ID of the history item

### Request Example
/history/item123

### Response
#### Success Response (200)
- **id** (string) - ID of the history item
- **text** (string) - Text of the history item
- **audio** (string) - Audio data

#### Response Example
{
  "id": "item123",
  "text": "Hello",
  "audio": "..."
}

```

--------------------------------

### Initialize Agent with System Tools (JavaScript)

Source: https://elevenlabs.io/docs/agents-platform/customization/tools/system-tools

Initializes an ElevenLabs agent with 'end_call' and 'language_detection' system tools using the JavaScript SDK. This configuration enables the agent to handle call termination and language detection. An API key is required for client initialization.

```javascript
import { ElevenLabs } from '@elevenlabs/elevenlabs-js';

// Initialize the client
const elevenlabs = new ElevenLabs({
  apiKey: 'YOUR_API_KEY',
});

// Create the agent with system tools
await elevenlabs.conversationalAi.agents.create({
  conversationConfig: {
    agent: {
      prompt: {
        tools: [
          {
            type: 'system',
            name: 'end_call',
            description: '',
          },
          {
            type: 'system',
            name: 'language_detection',
            description: '',
          },
        ],
      },
    },
  },
});
```

--------------------------------

### Fetch Knowledge Base Documentation (PHP)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-document

This PHP code snippet uses the Guzzle HTTP client to fetch knowledge base documentation from the ElevenLabs API. It demonstrates setting the GET request, headers, and echoing the response body.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();

```

--------------------------------

### GET /voices/settings/default

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/delete_explorer=true

Gets default voice settings.

```APIDOC
## GET /voices/settings/default

### Description
Gets default voice settings.

### Method
GET

### Endpoint
/voices/settings/default

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **stability** (float) - Default stability setting
- **similarity_boost** (float) - Default similarity boost setting

#### Response Example
{
  "stability": 0.75,
  "similarity_boost": 0.5
}

```

--------------------------------

### GET Get link

Source: https://elevenlabs.io/docs/agents-platform/api-reference/workspace/update_explorer=true

Generates the link to share the agent. Used to share the agent to other users.

```APIDOC
## GET Get link

### Description
Generates the link to share the agent.

### Method
GET

### Endpoint
/agents/{agent_id}/link

### Parameters
#### Path Parameters
- **agent_id** (string) - Required - The ID of the agent.

### Request Example
```
No request body required.
```

### Response
#### Success Response (200)
- **link** (string) - The link to share the agent.

#### Response Example
```json
{
  "link": "https://example.com/agent/share/123"
}
```
```

--------------------------------

### Fetch Conversations via HTTP GET (PHP/Guzzle)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/list

Demonstrates fetching conversations using the Guzzle HTTP client in PHP. It initializes a Guzzle client, makes a GET request with the API key in the headers, and echoes the response body.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/conversations', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
?>
```

--------------------------------

### Initiate SIP Trunk Outbound Call - TypeScript SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/sip-trunk/outbound-call

This TypeScript example demonstrates initiating an outbound call using the ElevenLabs JavaScript SDK. It initializes the ElevenLabsClient and then calls the `outboundCall` method within the `conversationalAi.sipTrunk` namespace, passing the required agent and phone number details as arguments.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.sipTrunk.outboundCall({
        agentId: "string",
        agentPhoneNumberId: "string",
        toNumber: "string",
    });
}
main();


```

--------------------------------

### Create Agent with TypeScript SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents/create

Shows how to create an agent using the official ElevenLabs TypeScript SDK. This asynchronous function initializes the client and calls the agent creation method.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.agents.create({});
}
main();

```

--------------------------------

### Get Agent Knowledge Base Size - Python

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/size

Uses the ElevenLabs Python SDK to get the knowledge base size of an agent. It requires the agent ID and is configured with the base URL for the API.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.agents.knowledge_base.size(
    agent_id="agent_id"
)


```

--------------------------------

### Get Conversation Audio using Go SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/get-audio

This Go code snippet demonstrates how to make a GET request to the Eleven Labs API to retrieve conversation audio. It requires the conversation ID and an API key. The response body, containing the audio, is printed to the console.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/conversations/conversation_id/audio"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("xi-api-key", "xi-api-key")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

--------------------------------

### POST /administration/history/download

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/list_explorer=true

Downloads history items.

```APIDOC
## POST /administration/history/download

### Description
Downloads history items.

### Method
POST

### Endpoint
/administration/history/download

### Parameters
#### Request Body
- **item_ids** (array) - Required - An array of history item IDs to download.
```

--------------------------------

### Get Agent Knowledge Base Size - C#

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/size

Employs the RestSharp library in C# to execute a GET request to the ElevenLabs API for knowledge base size. The API key is added as a header to the request.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/agent/agent_id/knowledge-base/size");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);

```

--------------------------------

### Administration Pronunciation Dictionaries

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-url_explorer=true

No description

--------------------------------

### Get Agent Knowledge Base Size - PHP

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/size

Utilizes the GuzzleHttp client in PHP to make a GET request to the ElevenLabs API for the knowledge base size. The API key is passed in the request headers.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/agent/agent_id/knowledge-base/size', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();

```

--------------------------------

### GET List conversations

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-agents_explorer=true

Retrieves a list of conversations for an agent.

```APIDOC
## GET List conversations

### Description
Retrieves a list of conversations for an agent.

### Method
GET

### Endpoint
/agents-platform/conversations

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **conversations** (array) - An array of conversations.

#### Response Example
{
  "conversations": [
    {
      "id": "conversation123",
      "agent_id": "agent123",
      "start_time": "2024-01-01T00:00:00Z"
    }
  ]
}

```

--------------------------------

### Upload Knowledge Base File via HTTP POST (C#)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-file

Example of uploading a file to the Elevenlabs knowledge base using C# with the RestSharp library. It configures a POST request with the appropriate API key and multipart form data. Make sure RestSharp is added to your project.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/knowledge-base/file");
var request = new RestRequest(Method.POST);
request.AddHeader("xi-api-key", "xi-api-key");
request.AddParameter("multipart/form-data; boundary=---011000010111000001101001", "-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"file\"; filename=\"string\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\n\r\n-----011000010111000001101001--\r\n", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

--------------------------------

### GET List models

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-agents_explorer=true

Retrieves a list of available models.

```APIDOC
## GET List models

### Description
Retrieves a list of available models.

### Method
GET

### Endpoint
/list-models

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **models** (array) - An array of available models.

#### Response Example
{
  "models": [{"id": "1", "name": "Model 1"}, {"id": "2", "name": "Model 2"}]
}

```

--------------------------------

### SIP Trunk API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-text_explorer=true

Initiate outbound calls via SIP trunk.

```APIDOC
## POST /websites/elevenlabs_io_agents-platform/sip-trunk

### Description
Initiates an outbound call using the configured SIP trunk.

### Method
POST

### Endpoint
/websites/elevenlabs_io_agents-platform/sip-trunk

### Parameters

#### Query Parameters
None

#### Request Body
- **to** (string) - Required - The phone number to call.
- **from** (string) - Required - The originating phone number.
- **audioUrl** (string) - Required - The URL of the audio file to play.

### Request Example
```json
{
  "to": "+1234567890",
  "from": "+1098765432",
  "audioUrl": "https://example.com/audio.mp3"
}
```

### Response
#### Success Response (200)
- **callSid** (string) - The unique identifier for the call.
- **status** (string) - The status of the call (e.g., 'queued', 'initiated').

#### Response Example
```json
{
  "callSid": "call_12345abc",
  "status": "initiated"
}
```
```