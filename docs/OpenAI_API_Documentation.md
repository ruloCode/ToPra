### Install OpenAI SDK across Multiple Languages

Source: https://platform.openai.com/docs/quickstart_api-mode=chat

This section provides instructions for installing the official OpenAI SDK or client libraries for various programming languages. These installations are prerequisites for making API calls to the OpenAI service.

```JavaScript
npm install openai
```

```Python
pip install openai
```

```C#
dotnet add package OpenAI
```

```Java
<dependency>
  <groupId>com.openai</groupId>
  <artifactId>openai-java</artifactId>
  <version>4.0.0</version>
</dependency>
```

```Go
import (
  "github.com/openai/openai-go" // imported as openai
)
```

--------------------------------

### Test Basic API Request - Go

Source: https://platform.openai.com/docs/libraries

Create and execute a simple API request using the OpenAI SDK in Go. This example demonstrates client initialization with API key, parameter setup with union types, and calling the Responses API with error handling.

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/option"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient(
		option.WithAPIKey("My API Key"), // or set OPENAI_API_KEY in your env
	)

	resp, err := client.Responses.New(context.TODO(), openai.ResponseNewParams{
		Model: "gpt-5-nano",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Say this is a test")},
	})
	if err != nil {
		panic(err.Error())
	}

	fmt.Println(resp.OutputText())
}
```

--------------------------------

### Multi-turn Image Generation Workflow Example

Source: https://platform.openai.com/docs/guides/image-generation_api=responses&gallery=open&galleryItem=paper-sculpture-city

Complete example demonstrating how to perform multi-turn image generation, starting with an initial image request and then refining it in a follow-up turn using the previous response ID.

```APIDOC
## Multi-turn Image Generation Workflow

### Description
This workflow demonstrates the complete process of generating an image and then refining it in a follow-up turn by referencing the previous response.

### Step 1: Initial Image Generation Request
Generate an initial image based on a prompt.

### Request
```javascript
const response = await openai.responses.create({
  model: "gpt-5",
  input: "Generate an image of gray tabby cat hugging an otter with an orange scarf",
  tools: [{type: "image_generation"}]
});
```

### Step 2: Extract and Save Generated Image
Filter the response output to get image data and save it to a file.

### Request
```javascript
const imageData = response.output
  .filter((output) => output.type === "image_generation_call")
  .map((output) => output.result);

if (imageData.length > 0) {
  const imageBase64 = imageData[0];
  const fs = await import("fs");
  fs.writeFileSync("cat_and_otter.png", Buffer.from(imageBase64, "base64"));
}
```

### Step 3: Follow-up Request Using Previous Response ID
Refine the image by referencing the previous response.

### Request
```javascript
const response_followup = await openai.responses.create({
  model: "gpt-5",
  previous_response_id: response.id,
  input: "Now make it look realistic",
  tools: [{type: "image_generation"}]
});
```

### Step 4: Extract and Save Refined Image
Process the follow-up response similarly to extract the refined image.

### Request
```javascript
const imageData_followup = response_followup.output
  .filter((output) => output.type === "image_generation_call")
  .map((output) => output.result);

if (imageData_followup.length > 0) {
  const imageBase64 = imageData_followup[0];
  const fs = await import("fs");
  fs.writeFileSync("cat_and_otter_realistic.png", Buffer.from(imageBase64, "base64"));
}
```

### Key Parameters
- **previous_response_id**: Links the follow-up request to the initial response, maintaining conversation context
- **input**: Updated prompt for refining the image
- **tools**: Must include `{type: "image_generation"}` for image capabilities
```

--------------------------------

### Make a basic OpenAI API call to generate text

Source: https://platform.openai.com/docs/quickstart

These examples demonstrate how to make a basic API request to the OpenAI `responses` endpoint across various programming languages. Each code block initializes an OpenAI client, configures a model and input prompt, and retrieves the generated text output.

```JavaScript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
    model: "gpt-5-nano",
    input: "Write a one-sentence bedtime story about a unicorn."
});

console.log(response.output_text);
```

```Python
from openai import OpenAI
client = OpenAI()

response = client.responses.create(
    model="gpt-5-nano",
    input="Write a one-sentence bedtime story about a unicorn."
)

print(response.output_text)
```

```C#
using System;
using System.Threading.Tasks;
using OpenAI;

class Program
{
    static async Task Main()
    {
        var client = new OpenAIClient(
            Environment.GetEnvironmentVariable("OPENAI_API_KEY")
        );

        var response = await client.Responses.CreateAsync(new ResponseCreateRequest
        {
            Model = "gpt-5-nano",
            Input = "Say 'this is a test.'"
        });

        Console.WriteLine($"[ASSISTANT]: {response.OutputText()}");
    }
}
```

```Java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;

public class Main {
    public static void main(String[] args) {
        OpenAIClient client = OpenAIOkHttpClient.fromEnv();

        ResponseCreateParams params = ResponseCreateParams.builder()
                .input("Say this is a test")
                .model("gpt-5-nano")
                .build();

        Response response = client.responses().create(params);
        System.out.println(response.outputText());
    }
}
```

```Go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/option"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient(
		option.WithAPIKey("My API Key"), // or set OPENAI_API_KEY in your env
	)

	resp, err := client.Responses.New(context.TODO(), openai.ResponseNewParams{
		Model: "gpt-5-nano",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Say this is a test")},
	})
	if err != nil {
		panic(err.Error())
	}

	fmt.Println(resp.OutputText())
}
```

--------------------------------

### Client SDK Examples - JavaScript

Source: https://platform.openai.com/docs/guides/latest-model_gallery=open&galleryItem=esports-tournament-landing-page

JavaScript/Node.js SDK examples for creating responses with reasoning effort and verbosity parameters using the OpenAI client library.

```APIDOC
## JavaScript Client Library Examples

### Reasoning Effort Example
```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.1",
  input: "How much gold would it take to coat the Statue of Liberty in a 1mm layer?",
  reasoning: {
    effort: "none"
  }
});

console.log(response);
```

### Verbosity Control Example
```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5",
  input: "What is the answer to the ultimate question of life, the universe, and everything?",
  text: {
    verbosity: "low"
  }
});

console.log(response);
```

### Configuration Options
- **model**: Specify the GPT model version ("gpt-5.1", "gpt-5", "gpt-5.2")
- **input**: Your prompt or question
- **reasoning.effort**: Set to "none", "medium", or "high"
- **text.verbosity**: Set to "low", "medium", or "high"

### Installation
```bash
npm install openai
```
```

--------------------------------

### Client SDK Examples - Python

Source: https://platform.openai.com/docs/guides/latest-model_gallery=open&galleryItem=esports-tournament-landing-page

Python SDK examples for creating responses with reasoning effort and verbosity parameters using the OpenAI client library.

```APIDOC
## Python Client Library Examples

### Reasoning Effort Example
```python
from openai import OpenAI
client = OpenAI()

response = client.responses.create(
    model="gpt-5.1",
    input="How much gold would it take to coat the Statue of Liberty in a 1mm layer?",
    reasoning={
        "effort": "none"
    }
)

print(response)
```

### Verbosity Control Example
```python
from openai import OpenAI
client = OpenAI()

response = client.responses.create(
    model="gpt-5",
    input="What is the answer to the ultimate question of life, the universe, and everything?",
    text={
        "verbosity": "low"
    }
)

print(response)
```

### Configuration Options
- **model**: Specify the GPT model version ("gpt-5.1", "gpt-5", "gpt-5.2")
- **input**: Your prompt or question
- **reasoning**: Dictionary with "effort" key set to "none", "medium", or "high"
- **text**: Dictionary with "verbosity" key set to "low", "medium", or "high"

### Installation
```bash
pip install openai
```
```

--------------------------------

### Video Download Implementation Examples

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=coloring

Complete code examples demonstrating how to poll video generation status and download completed videos in JavaScript and Python, including progress tracking and error handling.

```APIDOC
## Video Download - JavaScript Implementation

### Description
Complete example showing video creation, status polling with progress tracking, and MP4 file download in Node.js.

### Code Example
```javascript
import OpenAI from 'openai';

const openai = new OpenAI();

let video = await openai.videos.create({
    model: 'sora-2',
    prompt: "A video of the words 'Thank you' in sparkling letters",
});

console.log('Video generation started: ', video);
let progress = video.progress ?? 0;

while (video.status === 'in_progress' || video.status === 'queued') {
    video = await openai.videos.retrieve(video.id);
    progress = video.progress ?? 0;

    // Display progress bar
    const barLength = 30;
    const filledLength = Math.floor((progress / 100) * barLength);
    const bar = '='.repeat(filledLength) + '-'.repeat(barLength - filledLength);
    const statusText = video.status === 'queued' ? 'Queued' : 'Processing';

    process.stdout.write(`${statusText}: [${bar}] ${progress.toFixed(1)}%`);

    await new Promise((resolve) => setTimeout(resolve, 2000));
}

process.stdout.write('\n');

if (video.status === 'failed') {
    console.error('Video generation failed');
    return;
}

console.log('Video generation completed: ', video);
console.log('Downloading video content...');

const content = await openai.videos.downloadContent(video.id);
const body = content.arrayBuffer();
const buffer = Buffer.from(await body);

require('fs').writeFileSync('video.mp4', buffer);
console.log('Wrote video.mp4');
```

### Key Features
- Automatic status polling with 2-second intervals
- Real-time progress bar display
- Error handling for failed jobs
- Direct file write to disk after download
```

--------------------------------

### Add Starter Prompts to ChatKit Start Screen

Source: https://platform.openai.com/docs/guides/chatkit-themes

Define suggested prompt ideas that appear when users start a new conversation. Each prompt includes a name, the actual prompt text, and an icon to guide user interactions.

```typescript
const options: Partial<ChatKitOptions> = {
  startScreen: {
    greeting: "What can I help you build today?",
    prompts: [
      { 
        name: "Check on the status of a ticket", 
        prompt: "Can you help me check on the status of a ticket?", 
        icon: "search"
      },
      { 
        name: "Create Ticket", 
        prompt: "Can you help me create a new support ticket?", 
        icon: "write"
      },
    ],
  },
};
```

--------------------------------

### Create OpenAI Response with Function Tool in C#

Source: https://platform.openai.com/docs/quickstart

Initialize an OpenAI response client with a custom function tool for weather queries. The example demonstrates tool definition with strict mode enabled, function parameters validation, and response creation with user input. Requires OPENAI_API_KEY environment variable and uses System.Text.Json for serialization.

```csharp
using System.Text.Json;
using OpenAI.Responses;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
OpenAIResponseClient client = new(model: "gpt-5", apiKey: key);

ResponseCreationOptions options = new();
options.Tools.Add(ResponseTool.CreateFunctionTool(
        functionName: "get_weather",
        functionDescription: "Get current temperature for a given location.",
        functionParameters: BinaryData.FromObjectAsJson(new
        {
            type = "object",
            properties = new
            {
                location = new
                {
                    type = "string",
                    description = "City and country e.g. Bogotá, Colombia"
                }
            },
            required = new[] { "location" },
            additionalProperties = false
        }),
        strictModeEnabled: true
    )
);

OpenAIResponse response = (OpenAIResponse)client.CreateResponse([
    ResponseItem.CreateUserMessageItem([
        ResponseContentPart.CreateInputTextPart("What is the weather like in Paris today?")
    ])
], options);

Console.WriteLine(JsonSerializer.Serialize(response.OutputItems[0]));
```

--------------------------------

### Create Language Triage Agent with OpenAI Agents SDK

Source: https://platform.openai.com/docs/quickstart

This example illustrates how to build a language triage agent using the OpenAI Agents SDK. It defines multiple specialized agents (e.g., Spanish, English) and a main triage agent configured to handoff requests to the appropriate sub-agent based on the input language. This allows for dynamic routing and processing of user requests, requiring the `@openai/agents` or `agents` library.

```javascript
import { Agent, run } from '@openai/agents';

const spanishAgent = new Agent({
    name: 'Spanish agent',
    instructions: 'You only speak Spanish.',
});

const englishAgent = new Agent({
    name: 'English agent',
    instructions: 'You only speak English',
});

const triageAgent = new Agent({
    name: 'Triage agent',
    instructions:
        'Handoff to the appropriate agent based on the language of the request.',
    handoffs: [spanishAgent, englishAgent],
});

const result = await run(triageAgent, 'Hola, ¿cómo estás?');
console.log(result.finalOutput);
```

```python
from agents import Agent, Runner
import asyncio

spanish_agent = Agent(
    name="Spanish agent",
    instructions="You only speak Spanish.",
)

english_agent = Agent(
    name="English agent",
    instructions="You only speak English",
)

triage_agent = Agent(
    name="Triage agent",
    instructions="Handoff to the appropriate agent based on the language of the request.",
    handoffs=[spanish_agent, english_agent],
)


async def main():
    result = await Runner.run(triage_agent, input="Hola, ¿cómo estás?")
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())
```

--------------------------------

### Upload PDF from URL and Summarize with OpenAI (C#)

Source: https://platform.openai.com/docs/quickstart

This C# example demonstrates how to upload a PDF file directly from a URL to OpenAI using a stream and then use the uploaded file's ID to prompt a GPT model for a summary of its key points. It showcases streaming a file from an HTTP source and integrating it into an OpenAI model request.

```csharp
using OpenAI.Files;
using OpenAI.Responses;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
OpenAIResponseClient client = new(model: "gpt-5", apiKey: key);

using HttpClient http = new();
using Stream stream = await http.GetStreamAsync("https://www.berkshirehathaway.com/letters/2024ltr.pdf");
OpenAIFileClient files = new(key);
OpenAIFile file = files.UploadFile(stream, "2024ltr.pdf", FileUploadPurpose.UserData);

OpenAIResponse response = (OpenAIResponse)client.CreateResponse([
    ResponseItem.CreateUserMessageItem([
        ResponseContentPart.CreateInputTextPart("Analyze the letter and provide a summary of the key points."),
        ResponseContentPart.CreateInputFilePart(file.Id),
    ]),
]);

Console.WriteLine(response.GetOutputText());
```

--------------------------------

### Download Video Content - Python Example

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=Upside-Down-City

Complete Python example demonstrating video creation, status polling with progress visualization, and downloading the generated MP4 file using the OpenAI Python SDK.

```APIDOC
## Python: Complete Video Generation & Download Workflow

### Description
Full example showing how to create a video, monitor progress with status updates, and download the final MP4 file.

### Code Example

```python
from openai import OpenAI
import sys
import time

openai = OpenAI()

video = openai.videos.create(
    model="sora-2",
    prompt="A video of a cool cat on a motorcycle in the night",
)

print("Video generation started:", video)

progress = getattr(video, "progress", 0)
bar_length = 30

while video.status in ("in_progress", "queued"):
    # Refresh status
    video = openai.videos.retrieve(video.id)
    progress = getattr(video, "progress", 0)

    filled_length = int((progress / 100) * bar_length)
    bar = "=" * filled_length + "-" * (bar_length - filled_length)
    status_text = "Queued" if video.status == "queued" else "Processing"

    sys.stdout.write(f"\r{status_text}: [{bar}] {progress:.1f}%")
    sys.stdout.flush()
    time.sleep(2)

# Move to next line after progress loop
sys.stdout.write("\n")

if video.status == "failed":
    message = getattr(
        getattr(video, "error", None), "message", "Video generation failed"
    )
    print(message)
    return

print("Video generation completed:", video)
print("Downloading video content...")

content = openai.videos.download_content(video.id, variant="video")
content.write_to_file("video.mp4")

print("Wrote video.mp4")
```

### Workflow Steps
1. Create video with specified prompt
2. Poll status every 2 seconds until completion
3. Display progress bar with current percentage
4. Check for failed status with error handling
5. Download content using `download_content()` method
6. Write binary data to file using `write_to_file()`
```

--------------------------------

### Hono Web Server Application Setup

Source: https://platform.openai.com/docs/guides/predicted-outputs

Creates a basic Hono web server with static file serving and API routes. Includes a GET endpoint at '/api' returning 'Hello Hono!' and serves static files from a built UI directory on port 3000. Used as an example for demonstrating Predicted Outputs positioning.

```javascript
import { serveStatic } from "@hono/node-server/serve-static";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/api", (c) => {
  return c.text("Hello Hono!");
});

// You will need to build the client code first `pnpm run ui:build`
app.use(
  "/*",
  serveStatic({
    rewriteRequestPath: (path) => `./dist${path}`,
  })
);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
```

--------------------------------

### Download Video Content - JavaScript Example

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=Upside-Down-City

Complete JavaScript example demonstrating video creation, status polling with progress tracking, and downloading the generated MP4 file using the OpenAI SDK.

```APIDOC
## JavaScript: Complete Video Generation & Download Workflow

### Description
Full example showing how to create a video, monitor progress, and download the final MP4 file.

### Code Example

```javascript
import OpenAI from 'openai';

const openai = new OpenAI();

let video = await openai.videos.create({
    model: 'sora-2',
    prompt: "A video of the words 'Thank you' in sparkling letters",
});

console.log('Video generation started: ', video);
let progress = video.progress ?? 0;

while (video.status === 'in_progress' || video.status === 'queued') {
    video = await openai.videos.retrieve(video.id);
    progress = video.progress ?? 0;

    // Display progress bar
    const barLength = 30;
    const filledLength = Math.floor((progress / 100) * barLength);
    const bar = '='.repeat(filledLength) + '-'.repeat(barLength - filledLength);
    const statusText = video.status === 'queued' ? 'Queued' : 'Processing';

    process.stdout.write(`${statusText}: [${bar}] ${progress.toFixed(1)}%`);

    await new Promise((resolve) => setTimeout(resolve, 2000));
}

// Clear the progress line and show completion
process.stdout.write('\n');

if (video.status === 'failed') {
    console.error('Video generation failed');
    return;
}

console.log('Video generation completed: ', video);
console.log('Downloading video content...');

const content = await openai.videos.downloadContent(video.id);
const body = content.arrayBuffer();
const buffer = Buffer.from(await body);

require('fs').writeFileSync('video.mp4', buffer);
console.log('Wrote video.mp4');
```

### Workflow Steps
1. Create video with specified prompt
2. Poll status every 2 seconds until completion
3. Display ASCII progress bar during generation
4. Check for failed status
5. Download content using `downloadContent()` method
6. Write binary data to file
```

--------------------------------

### Send Audio to OpenAI GPT-Audio Model

Source: https://platform.openai.com/docs/guides/audio_api-mode=chat

This demonstrates how to send audio data, along with a text prompt, to the OpenAI GPT-Audio model for processing. Examples include fetching and base64 encoding an audio file in Python, and constructing the corresponding API request using both Python and cURL. It assumes the `openai` and `requests` libraries are installed for the Python example and a valid OpenAI API key for both.

```python
url = "https://cdn.openai.com/API/docs/audio/alloy.wav"
response = requests.get(url)
response.raise_for_status()
wav_data = response.content
encoded_string = base64.b64encode(wav_data).decode('utf-8')

completion = client.chat.completions.create(
    model="gpt-audio",
    modalities=["text", "audio"],
    audio={"voice": "alloy", "format": "wav"},
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "What is in this recording?"
                },
                {
                    "type": "input_audio",
                    "input_audio": {
                        "data": encoded_string,
                        "format": "wav"
                    }
                }
            ]
        }
    ]
)

print(completion.choices[0].message)
```

```bash
curl "https://api.openai.com/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
      "model": "gpt-audio",
      "modalities": ["text", "audio"],
      "audio": { "voice": "alloy", "format": "wav" },
      "messages": [
        {
          "role": "user",
          "content": [
            { "type": "text", "text": "What is in this recording?" },
            {
              "type": "input_audio",
              "input_audio": {
                "data": "<base64 bytes here>",
                "format": "wav"
              }
            }
          ]
        }
      ]
    }'
```

--------------------------------

### List OpenAI Sora Videos (cURL)

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=chameleon

These cURL commands demonstrate how to retrieve a list of your generated videos from the OpenAI Sora API. The first example shows a default `GET` request. The second example illustrates how to use query parameters like `limit`, `after`, and `order` for pagination and sorting the video list.

```bash
curl "https://api.openai.com/v1/videos" \
  -H "Authorization: Bearer $OPENAI_API_KEY" | jq .
```

```bash
curl "https://api.openai.com/v1/videos?limit=20&after=video_123&order=asc" \
  -H "Authorization: Bearer $OPENAI_API_KEY" | jq .
```

--------------------------------

### List OpenAI Assistants (cURL, Python, Node.js)

Source: https://platform.openai.com/docs/api-reference/assistants/modifyAssistant

This snippet demonstrates how to retrieve a list of all available OpenAI assistants. It uses the GET /v1/assistants endpoint, allowing pagination and ordering. The examples show how to authenticate with an API key and specify the API version.

```curl
curl "https://api.openai.com/v1/assistants?order=desc&limit=20" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
```

```python
from openai import OpenAI
client = OpenAI()

my_assistants = client.beta.assistants.list(
    order="desc",
    limit="20",
)
print(my_assistants.data)
```

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const myAssistants = await openai.beta.assistants.list({
    order: "desc",
    limit: "20",
  });

  console.log(myAssistants.data);
}

main();
```

--------------------------------

### Install OpenAI Agents SDK with npm

Source: https://platform.openai.com/docs/guides/voice-agents

Install the OpenAI Agents package from npm to get started with building voice agents in TypeScript. This package includes Realtime Agents for speech-to-speech voice agent development with built-in transport method selection (WebRTC for browser, WebSocket for server-side).

```bash
npm install @openai/agents
```

--------------------------------

### Analyze File from URL using OpenAI API

Source: https://platform.openai.com/docs/quickstart_api-mode=responses

This snippet shows how to send a file URL (e.g., a PDF document) to an OpenAI model (gpt-5) for analysis, such as summarizing key points from a document. Examples are provided for cURL, JavaScript, and Python, illustrating how to construct the API request with a user role, text prompt, and the file URL.

```curl
curl "https://api.openai.com/v1/responses" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-5",
        "input": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": "Analyze the letter and provide a summary of the key points."
                    },
                    {
                        "type": "input_file",
                        "file_url": "https://www.berkshirehathaway.com/letters/2024ltr.pdf"
                    }
                ]
            }
        ]
    }'
```

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
    model: "gpt-5",
    input: [
        {
            role: "user",
            content: [
                {
                    type: "input_text",
                    text: "Analyze the letter and provide a summary of the key points.",
                },
                {
                    type: "input_file",
                    file_url: "https://www.berkshirehathaway.com/letters/2024ltr.pdf",
                },
            ],
        },
    ],
});

console.log(response.output_text);
```

```python
from openai import OpenAI
client = OpenAI()

response = client.responses.create(
    model="gpt-5",
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": "Analyze the letter and provide a summary of the key points.",
                },
                {
                    "type": "input_file",
                    "file_url": "https://www.berkshirehathaway.com/letters/2024ltr.pdf",
                },
            ],
        },
    ]
)

print(response.output_text)
```

--------------------------------

### Code Interpreter with Containers - Quick Reference

Source: https://platform.openai.com/docs/guides/tools-code-interpreter

Quick reference guide showing Python and JavaScript examples for creating containers and executing code with the Code Interpreter API.

```APIDOC
## Code Interpreter with Containers - Implementation Examples

### Python Implementation
```python
from openai import OpenAI
client = OpenAI()

# Step 1: Create a container
container = client.containers.create(
    name="test-container",
    memory_limit="4g"
)

# Step 2: Execute code in the container
response = client.responses.create(
    model="gpt-4.1",
    tools=[
        {
            "type": "code_interpreter",
            "container": container.id
        }
    ],
    tool_choice="required",
    input="use the python tool to calculate what is 4 * 3.82. and then find its square root and then find the square root of that result"
)

# Step 3: Display results
print(response.output_text)
```

### JavaScript Implementation
```javascript
import OpenAI from "openai";
const client = new OpenAI();

// Step 1: Create a container
const container = await client.containers.create({
    name: "test-container",
    memory_limit: "4g"
});

// Step 2: Execute code in the container
const resp = await client.responses.create({
    model: "gpt-4.1",
    tools: [
        {
            type: "code_interpreter",
            container: container.id
        }
    ],
    tool_choice: "required",
    input: "use the python tool to calculate what is 4 * 3.82. and then find its square root and then find the square root of that result"
});

// Step 3: Display results
console.log(resp.output_text);
```

### Memory Limit Options
- **1g** - Default, suitable for lightweight operations
- **4g** - Recommended for most use cases
- **16g** - For resource-intensive computations
- **64g** - For large-scale data processing

### Container Lifecycle
1. Create container with specified memory limit
2. Use container.id in responses API calls
3. Container automatically expires after 20 minutes of inactivity
4. Container activity (any operation) refreshes the expiration timer
5. Expired containers cannot be reactivated; create a new one instead
```

--------------------------------

### Multi-turn Image Generation - Implementation Example

Source: https://platform.openai.com/docs/guides/image-generation_gallery=open&galleryItem=floorplan

Complete example demonstrating how to use the Responses API for multi-turn image generation, including initial image creation and follow-up refinement with prompt iteration.

```APIDOC
## Multi-turn Image Generation Implementation

### Overview
This example demonstrates a complete multi-turn image generation workflow using the Responses API, showing how to generate an initial image and then refine it in a follow-up turn.

### Python Example

```python
from openai import OpenAI
import base64

client = OpenAI()

# Step 1: Initial image generation
response = client.responses.create(
    model="gpt-5",
    input="Generate an image of gray tabby cat hugging an otter with an orange scarf",
    tools=[{"type": "image_generation"}],
)

# Step 2: Extract and save the generated image
image_data = [
    output.result
    for output in response.output
    if output.type == "image_generation_call"
]

if image_data:
    image_base64 = image_data[0]
    with open("cat_and_otter.png", "wb") as f:
        f.write(base64.b64decode(image_base64))

# Step 3: Follow-up request using previous_response_id for refinement
response_fwup = client.responses.create(
    model="gpt-5",
    previous_response_id=response.id,
    input="Now make it look realistic",
    tools=[{"type": "image_generation"}],
)

# Step 4: Extract and save the refined image
image_data_fwup = [
    output.result
    for output in response_fwup.output
    if output.type == "image_generation_call"
]

if image_data_fwup:
    image_base64 = image_data_fwup[0]
    with open("cat_and_otter_realistic.png", "wb") as f:
        f.write(base64.b64decode(image_base64))
```

### JavaScript Example

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

// Step 1: Initial image generation
const response = await openai.responses.create({
  model: "gpt-5",
  input: "Generate an image of gray tabby cat hugging an otter with an orange scarf",
  tools: [{type: "image_generation"}],
});

// Step 2: Extract and save the generated image
const imageData = response.output
  .filter((output) => output.type === "image_generation_call")
  .map((output) => output.result);

if (imageData.length > 0) {
  const imageBase64 = imageData[0];
  const fs = await import("fs");
  fs.writeFileSync("cat_and_otter.png", Buffer.from(imageBase64, "base64"));
}

// Step 3: Follow-up request using previous_response_id for refinement
const response_fwup = await openai.responses.create({
  model: "gpt-5",
  previous_response_id: response.id,
  input: "Now make it look realistic",
  tools: [{type: "image_generation"}],
});

// Step 4: Extract and save the refined image
const imageData_fwup = response_fwup.output
  .filter((output) => output.type === "image_generation_call")
  .map((output) => output.result);

if (imageData_fwup.length > 0) {
  const imageBase64 = imageData_fwup[0];
  const fs = await import("fs");
  fs.writeFileSync(
    "cat_and_otter_realistic.png",
    Buffer.from(imageBase64, "base64")
  );
}
```

### Key Points
- Use `previous_response_id` to maintain conversation context across turns
- Filter output by `type === "image_generation_call"` to extract generated images
- Image results are base64-encoded and must be decoded before saving
- Each turn can include new instructions to refine or modify the output
```

--------------------------------

### GPT-5.2 Model Migration Guide

Source: https://platform.openai.com/docs/guides/latest-model_gallery=open&galleryItem=event-count-down

Comprehensive guide for migrating from other OpenAI models to GPT-5.2. Includes model-specific recommendations for reasoning levels and prompting strategies to optimize performance during the transition.

```APIDOC
## GPT-5.2 Model Migration

### Description
Migration guidance for transitioning from previous OpenAI models (GPT-5.1, o3, gpt-4.1, etc.) to GPT-5.2, with model-specific recommendations for reasoning levels and prompting strategies.

### Migration Recommendations

#### From gpt-5.1
- **Target Model**: `gpt-5.2` with default settings
- **Notes**: Designed as a drop-in replacement with minimal changes required

#### From o3
- **Target Model**: `gpt-5.2` with `medium` or `high` reasoning
- **Strategy**: Start with `medium` reasoning and prompt tuning, then increase to `high` if needed

#### From gpt-4.1
- **Target Model**: `gpt-5.2` with `none` reasoning
- **Strategy**: Begin with `none` reasoning level and tune prompts; increase if better performance is needed

#### From o4-mini or gpt-4.1-mini
- **Target Model**: `gpt-5-mini` with prompt tuning
- **Notes**: Excellent replacement option

#### From gpt-4.1-nano
- **Target Model**: `gpt-5-nano` with prompt tuning
- **Notes**: Excellent replacement option

### Key Recommendations
- Use the Responses API for improved intelligence and performance
- Employ the prompt optimizer to automatically update prompts based on best practices
- Experiment with different reasoning levels and prompting strategies
- Leverage the Responses API's ability to pass previous turn's Chain-of-Thought (CoT) to reduce reasoning tokens, improve cache hit rates, and decrease latency
```

--------------------------------

### Install OpenAI SDK with Maven - Java

Source: https://platform.openai.com/docs/libraries

Install the OpenAI API helper for Java (currently in beta) using Maven dependency configuration. Add this dependency to your project's pom.xml file.

```xml
<dependency>
  <groupId>com.openai</groupId>
  <artifactId>openai-java</artifactId>
  <version>4.0.0</version>
</dependency>
```

--------------------------------

### Customize Start Screen Text and Placeholder in ChatKit

Source: https://platform.openai.com/docs/guides/chatkit-themes

Customize the composer placeholder text and start screen greeting to guide users on what to ask or input. This helps set expectations and provides context for new conversations.

```typescript
const options: Partial<ChatKitOptions> = {
  composer: {
    placeholder: "Ask anything about your data…",
  },
  startScreen: {
    greeting: "Welcome to FeedbackBot!",
  },
};
```

--------------------------------

### Create, Track Progress, and Download Video MP4 (SDKs & cURL)

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=indie-cafe-rainy-window

These examples demonstrate how to initiate a video generation request using the OpenAI API, continuously monitor its status with a progress bar, and then download the final MP4 video file. The JavaScript and Python SDK examples show a full workflow including creation, polling, and download, while the cURL command provides a direct method for downloading the content.

```javascript
import OpenAI from 'openai';

const openai = new OpenAI();

let video = await openai.videos.create({
    model: 'sora-2',
    prompt: "A video of the words 'Thank you' in sparkling letters",
});

console.log('Video generation started: ', video);
let progress = video.progress ?? 0;

while (video.status === 'in_progress' || video.status === 'queued') {
    video = await openai.videos.retrieve(video.id);
    progress = video.progress ?? 0;

    // Display progress bar
    const barLength = 30;
    const filledLength = Math.floor((progress / 100) * barLength);
    // Simple ASCII progress visualization for terminal output
    const bar = '='.repeat(filledLength) + '-'.repeat(barLength - filledLength);
    const statusText = video.status === 'queued' ? 'Queued' : 'Processing';

    process.stdout.write(`${statusText}: [${bar}] ${progress.toFixed(1)}%`);

    await new Promise((resolve) => setTimeout(resolve, 2000));
}

// Clear the progress line and show completion
process.stdout.write('\n');

if (video.status === 'failed') {
    console.error('Video generation failed');
    return;
}

console.log('Video generation completed: ', video);

console.log('Downloading video content...');

const content = await openai.videos.downloadContent(video.id);

const body = content.arrayBuffer();
const buffer = Buffer.from(await body);

require('fs').writeFileSync('video.mp4', buffer);

console.log('Wrote video.mp4');
```

```python
from openai import OpenAI
import sys
import time


openai = OpenAI()

video = openai.videos.create(
    model="sora-2",
    prompt="A video of a cool cat on a motorcycle in the night",
)

print("Video generation started:", video)

progress = getattr(video, "progress", 0)
bar_length = 30

while video.status in ("in_progress", "queued"):
    # Refresh status
    video = openai.videos.retrieve(video.id)
    progress = getattr(video, "progress", 0)

    filled_length = int((progress / 100) * bar_length)
    bar = "=" * filled_length + "-" * (bar_length - filled_length)
    status_text = "Queued" if video.status == "queued" else "Processing"

    sys.stdout.write(f"\n{status_text}: [{bar}] {progress:.1f}%")
    sys.stdout.flush()
    time.sleep(2)

# Move to next line after progress loop
sys.stdout.write("\n")

if video.status == "failed":
    message = getattr(
        getattr(video, "error", None), "message", "Video generation failed"
    )
    print(message)
    return

print("Video generation completed:", video)
print("Downloading video content...")

content = openai.videos.download_content(video.id, variant="video")
content.write_to_file("video.mp4")

print("Wrote video.mp4")
```

```bash
curl -L "https://api.openai.com/v1/videos/video_abc123/content" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  --output video.mp4
```

--------------------------------

### Define Developer Message for Code Generation with Markdown and XML

Source: https://platform.openai.com/docs/guides/prompt-engineering

This example illustrates how to structure a 'developer' message for a coding assistant using Markdown headers for distinct sections (Identity, Instructions, Examples) and XML tags for example input/output. It guides the model on JavaScript variable naming conventions (snake_case, 'var' keyword) and response formatting.

```prompt_format
# Identity

You are coding assistant that helps enforce the use of snake case
variables in JavaScript code, and writing code that will run in
Internet Explorer version 6.

# Instructions

* When defining variables, use snake case names (e.g. my_variable)
  instead of camel case names (e.g. myVariable).
* To support old browsers, declare variables using the older
  "var" keyword.
* Do not give responses with Markdown formatting, just return
  the code as requested.

# Examples

<user_query>
How do I declare a string variable for a first name?
</user_query>

<assistant_response>
var first_name = "Anna";
</assistant_response>
```

--------------------------------

### Multi-turn Image Generation - Python Example

Source: https://platform.openai.com/docs/guides/image-generation_api=responses&gallery=open&galleryItem=floorplan

Complete Python example demonstrating how to generate an image, save it to a file, and create follow-up requests using the Responses API for iterative image refinement.

```APIDOC
## Multi-turn Image Generation Workflow - Python

### Description
This example shows the Python implementation for multi-turn image generation: creating an initial image generation request and saving the base64-encoded result to a PNG file.

### Initial Request
```python
from openai import OpenAI
import base64

client = OpenAI()

response = client.responses.create(
    model="gpt-5",
    input="Generate an image of gray tabby cat hugging an otter with an orange scarf",
    tools=[{"type": "image_generation"}]
)

image_data = [
    output.result
    for output in response.output
    if output.type == "image_generation_call"
]

if image_data:
    image_base64 = image_data[0]
    with open("cat_and_otter.png", "wb") as f:
        f.write(base64.b64decode(image_base64))
```

### Follow-up Request Pattern
```python
response_fwup = client.responses.create(
    model="gpt-5",
    previous_response_id=response.id,
    input="Now make it look realistic",
    tools=[{"type": "image_generation"}]
)

image_data_fwup = [
    output.result
    for output in response_fwup.output
    if output.type == "image_generation_call"
]

if image_data_fwup:
    image_base64 = image_data_fwup[0]
    with open("cat_and_otter_realistic.png", "wb") as f:
        f.write(base64.b64decode(image_base64))
```

### Key Points
- Use list comprehension to filter image_generation_call outputs
- Base64 data is decoded using base64.b64decode()
- File is written in binary mode ("wb") to preserve PNG format
- Use previous_response_id from initial response for multi-turn conversation
```

--------------------------------

### Migration: Move Chats to Conversations and Responses

Source: https://platform.openai.com/docs/assistants

Second step of API migration. This guide demonstrates how to backfill existing threads into the new conversation and response model with code examples for data transformation.

```APIDOC
## Step 2: Move User Chats to Conversations and Responses

### Description
Migrate user threads from the Assistants API to conversations in the Responses API. New user chats should be created directly as conversations.

### Migration Strategy
- Route new user threads to conversations and responses API
- Backfill existing threads as necessary
- No automated migration tool provided; manual conversion recommended

### Backfilling Existing Threads

Retrieve all messages from an existing thread and convert them to conversation format:

```python
thread_id = "thread_EIpHrTAVe0OzoLQg3TXfvrkG"
messages = []

# Step 1: Retrieve all messages from thread
for page in openai.beta.threads.messages.list(thread_id=thread_id, order="asc").iter_pages():
    messages += page.data

# Step 2: Convert messages to conversation format
items = []
for m in messages:
    item = {"role": m.role}
    item_content = []

    for content in m.content:
        match content.type:
            case "text":
                item_content_type = "input_text" if m.role == "user" else "output_text"
                item_content += [{"type": item_content_type, "text": content.text.value}]
            case "image_url":
                item_content += [
                    {
                        "type": "input_image",
                        "image_url": content.image_url.url,
                        "detail": content.image_url.detail
                    }
                ]

    item.update({"content": item_content})
    items.append(item)

# Step 3: Create conversation with converted items
conversation = openai.conversations.create(items=items)
```

### Content Type Mapping
- **User text messages**: Convert to `"input_text"` type
- **Assistant text messages**: Convert to `"output_text"` type
- **Images**: Convert to `"input_image"` type with URL and detail

### Post-Migration
- New user interactions should use the conversations and responses API
- Backfilled conversations maintain message history
- Update application code to use new API endpoints
```

--------------------------------

### Define and Call a Function Tool (OpenAI API)

Source: https://platform.openai.com/docs/quickstart_api-mode=responses

These examples demonstrate how to define a custom function tool, such as 'get_weather', and instruct the OpenAI model to use it. The function schema, including parameter types and descriptions, is provided to the API. This enables the model to respond by suggesting a call to the defined function based on the user's input.

```C#
using System.Text.Json;
using OpenAI.Responses;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
OpenAIResponseClient client = new(model: "gpt-5", apiKey: key);

ResponseCreationOptions options = new();
options.Tools.Add(ResponseTool.CreateFunctionTool(
        functionName: "get_weather",
        functionDescription: "Get current temperature for a given location.",
        functionParameters: BinaryData.FromObjectAsJson(new
        {
            type = "object",
            properties = new
            {
                location = new
                {                   
                    type = "string",
                    description = "City and country e.g. Bogotá, Colombia"
                }
            },
            required = new[] { "location" },
            additionalProperties = false
        }),
        strictModeEnabled: true
    )
);

OpenAIResponse response = (OpenAIResponse)client.CreateResponse([
    ResponseItem.CreateUserMessageItem([
        ResponseContentPart.CreateInputTextPart("What is the weather like in Paris today?")
    ])
], options);

Console.WriteLine(JsonSerializer.Serialize(response.OutputItems[0]));
```

```cURL
curl -X POST https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5",
    "input": [
      {"role": "user", "content": "What is the weather like in Paris today?"}
    ],
    "tools": [
      {
        "type": "function",
        "name": "get_weather",
        "description": "Get current temperature for a given location.",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "City and country e.g. Bogotá, Colombia"
            }
          },
          "required": ["location"],
          "additionalProperties": false
        },
        "strict": true
      }
    ]
  }'
```

--------------------------------

### Call Remote MCP Server with C# SDK

Source: https://platform.openai.com/docs/quickstart_api-mode=chat

Initialize OpenAI response client and add MCP tool with server configuration and approval policy. Creates a response with user message and retrieves output text.

```C#
using OpenAI.Responses;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
OpenAIResponseClient client = new(model: "gpt-5", apiKey: key);

ResponseCreationOptions options = new();
options.Tools.Add(ResponseTool.CreateMcpTool(
    serverLabel: "dmcp",
    serverUri: new Uri("https://dmcp-server.deno.dev/sse"),
    toolCallApprovalPolicy: new McpToolCallApprovalPolicy(GlobalMcpToolCallApprovalPolicy.NeverRequireApproval)
));

OpenAIResponse response = (OpenAIResponse)client.CreateResponse([
    ResponseItem.CreateUserMessageItem([
        ResponseContentPart.CreateInputTextPart("Roll 2d4+1")
    ])
], options);

Console.WriteLine(response.GetOutputText());
```

--------------------------------

### Dockerfile: Install desktop environment and VNC server

Source: https://platform.openai.com/docs/guides/tools-computer-use

Installs Xfce desktop environment, x11vnc, Xvfb, xdotool, and ImageMagick. Removes screen lockers and power managers. Requires root privileges during build phase for package installation.

```dockerfile
RUN apt-get update && apt-get install -y \
    xfce4 \
    xfce4-goodies \
    x11vnc \
    xvfb \
    xdotool \
    imagemagick \
    x11-apps \
    sudo \
    software-properties-common \
    imagemagick \
  && apt-get remove -y light-locker xfce4-screensaver xfce4-power-manager || true \
  && apt-get clean && rm -rf /var/lib/apt/lists/*
```

--------------------------------

### Download Video Content Examples

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=indie-cafe-rainy-window

Code examples demonstrating how to retrieve completed video files using JavaScript and Python SDKs, including polling for job completion and downloading the MP4 file.

```APIDOC
## JavaScript Example

### Poll for Completion and Download
```javascript
import OpenAI from 'openai';

const openai = new OpenAI();

let video = await openai.videos.create({
    model: 'sora-2',
    prompt: "A video of the words 'Thank you' in sparkling letters",
});

console.log('Video generation started: ', video);
let progress = video.progress ?? 0;

while (video.status === 'in_progress' || video.status === 'queued') {
    video = await openai.videos.retrieve(video.id);
    progress = video.progress ?? 0;

    // Display progress bar
    const barLength = 30;
    const filledLength = Math.floor((progress / 100) * barLength);
    const bar = '='.repeat(filledLength) + '-'.repeat(barLength - filledLength);
    const statusText = video.status === 'queued' ? 'Queued' : 'Processing';

    process.stdout.write(`${statusText}: [${bar}] ${progress.toFixed(1)}%`);

    await new Promise((resolve) => setTimeout(resolve, 2000));
}

process.stdout.write('\n');

if (video.status === 'failed') {
    console.error('Video generation failed');
    return;
}

console.log('Video generation completed: ', video);
console.log('Downloading video content...');

const content = await openai.videos.downloadContent(video.id);
const body = content.arrayBuffer();
const buffer = Buffer.from(await body);

require('fs').writeFileSync('video.mp4', buffer);
console.log('Wrote video.mp4');
```

## Python Example

### Poll for Completion and Download
```python
from openai import OpenAI
import sys
import time

openai = OpenAI()

video = openai.videos.create(
    model="sora-2",
    prompt="A video of a cool cat on a motorcycle in the night",
)

print("Video generation started:", video)

progress = getattr(video, "progress", 0)
bar_length = 30

while video.status in ("in_progress", "queued"):
    video = openai.videos.retrieve(video.id)
    progress = getattr(video, "progress", 0)

    filled_length = int((progress / 100) * bar_length)
    bar = "=" * filled_length + "-" * (bar_length - filled_length)
    status_text = "Queued" if video.status == "queued" else "Processing"

    sys.stdout.write(f"\r{status_text}: [{bar}] {progress:.1f}%")
    sys.stdout.flush()
    time.sleep(2)

sys.stdout.write("\n")

if video.status == "failed":
    message = getattr(
        getattr(video, "error", None), "message", "Video generation failed"
    )
    print(message)
    return

print("Video generation completed:", video)
print("Downloading video content...")

content = openai.videos.download_content(video.id, variant="video")
content.write_to_file("video.mp4")

print("Wrote video.mp4")
```
```

--------------------------------

### List OpenAI Assistants

Source: https://platform.openai.com/docs/api-reference/assistants/deleteAssistant

This snippet demonstrates how to list all available OpenAI Assistant objects. It provides examples using cURL for direct API calls, Python with the OpenAI client library, and Node.js with the OpenAI client library. The examples filter by 'desc' order and a limit of 20 assistants.

```curl
curl "https://api.openai.com/v1/assistants?order=desc&limit=20" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
```

```python
from openai import OpenAI
client = OpenAI()

my_assistants = client.beta.assistants.list(
    order="desc",
    limit="20",
)
print(my_assistants.data)
```

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const myAssistants = await openai.beta.assistants.list({
    order: "desc",
    limit: "20"
  });

  console.log(myAssistants.data);
}

main();
```

--------------------------------

### Install OpenAI SDK with .NET CLI - C#

Source: https://platform.openai.com/docs/libraries

Install the officially supported OpenAI API client for C# using the .NET CLI from NuGet. This package is provided in collaboration with Microsoft.

```bash
dotnet add package OpenAI
```

--------------------------------

### GET /response.mcp_call.in_progress

Source: https://platform.openai.com/docs/api-reference/realtime-beta-server-events/conversation/item/deleted

Returned when an MCP tool call has started and is in progress.

```APIDOC
## Object: response.mcp_call.in_progress

### Description
Returned when an MCP tool call has started and is in progress.

### Fields
- **event_id** (string) - The unique ID of the server event.
- **item_id** (string) - The ID of the MCP tool call item.
- **output_index** (integer) - The index of the output item in the response.
- **type** (string) - The event type, must be `response.mcp_call.in_progress`.

### Example
{
  "event_id": "event_6301",
  "type": "response.mcp_call.in_progress",
  "output_index": 0,
  "item_id": "mcp_call_001"
}
```

--------------------------------

### Video Download Implementation - Python

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=coloring

Complete Python example showing video creation, status polling with progress visualization, and MP4 file download using the OpenAI Python client.

```APIDOC
## Video Download - Python Implementation

### Description
Complete example demonstrating video creation, status polling with progress tracking, and MP4 file download in Python.

### Code Example
```python
from openai import OpenAI
import sys
import time

openai = OpenAI()

video = openai.videos.create(
    model="sora-2",
    prompt="A video of a cool cat on a motorcycle in the night",
)

print("Video generation started:", video)

progress = getattr(video, "progress", 0)
bar_length = 30

while video.status in ("in_progress", "queued"):
    # Refresh status
    video = openai.videos.retrieve(video.id)
    progress = getattr(video, "progress", 0)

    filled_length = int((progress / 100) * bar_length)
    bar = "=" * filled_length + "-" * (bar_length - filled_length)
    status_text = "Queued" if video.status == "queued" else "Processing"

    sys.stdout.write(f"\r{status_text}: [{bar}] {progress:.1f}%")
    sys.stdout.flush()
    time.sleep(2)

# Move to next line after progress loop
sys.stdout.write("\n")

if video.status == "failed":
    message = getattr(
        getattr(video, "error", None), "message", "Video generation failed"
    )
    print(message)
    return

print("Video generation completed:", video)
print("Downloading video content...")

content = openai.videos.download_content(video.id, variant="video")
content.write_to_file("video.mp4")

print("Wrote video.mp4")
```

### Key Features
- Automatic status polling with 2-second intervals
- Real-time progress bar with carriage return for overwriting output
- Proper error handling with message extraction
- File writing using the OpenAI client's built-in method
```

--------------------------------

### Upload Local File and Query OpenAI Model

Source: https://platform.openai.com/docs/quickstart

These examples demonstrate how to upload a local file to the OpenAI API for 'user_data' purposes and subsequently incorporate that file into a model's input for response generation. The file's ID is referenced in the model request to enable the AI to process its content, answering specific questions about the document.

```shell
curl https://api.openai.com/v1/files \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F purpose="user_data" \
    -F file="@draconomicon.pdf"

curl "https://api.openai.com/v1/responses" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-5",
        "input": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_file",
                        "file_id": "file-6F2ksmvXxt4VdoqmHRw6kL"
                    },
                    {
                        "type": "input_text",
                        "text": "What is the first dragon in the book?"
                    }
                ]
            }
        ]
    }'
```

```javascript
import fs from "fs";
import OpenAI from "openai";
const client = new OpenAI();

const file = await client.files.create({
    file: fs.createReadStream("draconomicon.pdf"),
    purpose: "user_data",
});

const response = await client.responses.create({
    model: "gpt-5",
    input: [
        {
            role: "user",
            content: [
                {
                    type: "input_file",
                    file_id: file.id,
                },
                {
                    type: "input_text",
                    text: "What is the first dragon in the book?",
                },
            ],
        },
    ],
});

console.log(response.output_text);
```

```python
from openai import OpenAI
client = OpenAI()

file = client.files.create(
    file=open("draconomicon.pdf", "rb"),
    purpose="user_data"
)

response = client.responses.create(
    model="gpt-5",
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_file",
                    "file_id": file.id,
                },
                {
                    "type": "input_text",
                    "text": "What is the first dragon in the book?",
                },
            ]
        }
    ]
)

print(response.output_text)
```

```csharp
using OpenAI.Files;
using OpenAI.Responses;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
OpenAIResponseClient client = new(model: "gpt-5", apiKey: key);

OpenAIFileClient files = new(key);
OpenAIFile file = files.UploadFile("draconomicon.pdf", FileUploadPurpose.UserData);

OpenAIResponse response = (OpenAIResponse)client.CreateResponse([
    ResponseItem.CreateUserMessageItem([
        ResponseContentPart.CreateInputFilePart(file.Id),
        ResponseContentPart.CreateInputTextPart("What is the first dragon in the book?"),
    ]),
]);

Console.WriteLine(response.GetOutputText());
```

--------------------------------

### Dockerfile: Start virtual display, VNC server, and Xfce desktop

Source: https://platform.openai.com/docs/guides/tools-computer-use

Exposes port 5900 for VNC connections and starts Xvfb virtual display, x11vnc server with authentication, and Xfce desktop manager in the background. Uses tail to keep container running.

```dockerfile
EXPOSE 5900
CMD ["/bin/sh", "-c", "\
    Xvfb :99 -screen 0 1280x800x24 >/dev/null 2>&1 & \
    x11vnc -display :99 -forever -rfbauth /home/myuser/.vncpass -listen 0.0.0.0 -rfbport 5900 >/dev/null 2>&1 & \
    export DISPLAY=:99 && \
    startxfce4 >/dev/null 2>&1 & \
    sleep 2 && echo 'Container running!' && \
    tail -f /dev/null "]
```

--------------------------------

### GET /events/response.mcp_call.in_progress

Source: https://platform.openai.com/docs/api-reference/realtime-beta-server-events/response/mcp_call_arguments/done

Event indicating that an MCP tool call has started and is in progress.

```APIDOC
## GET /events/response.mcp_call.in_progress

### Description
Returned when an MCP tool call has started and is in progress.

### Method
GET

### Endpoint
/events/response.mcp_call.in_progress

### Parameters
#### Path Parameters

#### Query Parameters

#### Request Body

### Request Example


### Response
#### Success Response (200)
- **event_id** (string) - The unique ID of the server event.
- **item_id** (string) - The ID of the MCP tool call item.
- **output_index** (integer) - The index of the output item in the response.
- **type** (string) - The event type, must be `response.mcp_call.in_progress`.

#### Response Example
{
  "event_id": "event_6301",
  "type": "response.mcp_call.in_progress",
  "output_index": 0,
  "item_id": "mcp_call_001"
}
```

--------------------------------

### Create OpenAI Evaluation Run for News Categorization

Source: https://platform.openai.com/docs/api-reference/evals/getRunOutputItem

These examples demonstrate how to create an evaluation run (EvalRun) using the OpenAI API across different programming languages and tools. The evaluation is configured for a completions task using the `gpt-4o-mini` model, with a detailed templated prompt designed to categorize news headlines into specific topics. Each example targets the same evaluation ID and provides a consistent setup for testing model performance on this classification task.

```bash
curl https://api.openai.com/v1/evals/eval_67e579652b548190aaa83ada4b125f47/runs \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"gpt-4o-mini","data_source":{"type":"completions","input_messages":{"type":"template","template":[{"role":"developer","content":"Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output**: \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n"} , {"role":"user","content":"{{item.input}}"}]} ,"sampling_params":{"temperature":1,"max_completions_tokens":2048,"top_p":1,"seed":42},"model":"gpt-4o-mini","source":{"type":"file_content","content":[{"item":{"input":"Tech Company Launches Advanced Artificial Intelligence Platform","ground_truth":"Technology"}}]}}'
```

```python
from openai import OpenAI
client = OpenAI()

run = client.evals.runs.create(
  "eval_67e579652b548190aaa83ada4b125f47",
  name="gpt-4o-mini",
  data_source={
    "type": "completions",
    "input_messages": {
      "type": "template",
      "template": [
        {
          "role": "developer",
          "content": "Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output**: \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n"
        },
        {
          "role": "user",
          "content": "{{item.input}}"
        }
      ]
    },
    "sampling_params": {
      "temperature": 1,
      "max_completions_tokens": 2048,
      "top_p": 1,
      "seed": 42
    },
    "model": "gpt-4o-mini",
    "source": {
      "type": "file_content",
      "content": [
        {
          "item": {
            "input": "Tech Company Launches Advanced Artificial Intelligence Platform",
            "ground_truth": "Technology"
          }
        }
      ]
    }
  }
)
print(run)
```

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const run = await openai.evals.runs.create(
  "eval_67e579652b548190aaa83ada4b125f47",
  {
    name: "gpt-4o-mini",
    data_source: {
      type: "completions",
      input_messages: {

```

--------------------------------

### JSON Example: OpenAI Get Vector Stores Usage API Response

Source: https://platform.openai.com/docs/api-reference/usage/audio_speeches

This JSON response illustrates the typical output when querying the `Get Vector Stores Usage` API. It contains a paginated list of `bucket` objects, each with a `start_time`, `end_time`, and an array of `results` detailing `usage_bytes` per `project_id` for the specified time bucket.

```json
{
    "object": "page",
    "data": [
        {
            "object": "bucket",
            "start_time": 1730419200,
            "end_time": 1730505600,
            "results": [
                {
                    "object": "organization.usage.vector_stores.result",
                    "usage_bytes": 1024,
                    "project_id": null
                }
            ]
        }
    ],
    "has_more": false,
    "next_page": null
}
```

--------------------------------

### JSONL Example for AI Training Data with Tool Calls

Source: https://platform.openai.com/docs/guides/supervised-fine-tuning

This JSONL example illustrates how to structure AI training data for models that utilize tool calls. Each line represents a complete chat completion interaction where the model is configured to call a `get_current_weather` function, passing location and format arguments. It also includes the full definition of the `get_current_weather` tool.

```jsonl
{"messages":[{"role":"user","content":"What is the weather in San Francisco?"},{"role":"assistant","tool_calls":[{"id":"call_id","type":"function","function":{"name":"get_current_weather","arguments":"{\"location\": \"San Francisco, USA\", \"format\": \"celsius\"}"}}]}],"parallel_tool_calls":false,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and country, eg. San Francisco, USA"},"format":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location","format"]}}}]}
{"messages":[{"role":"user","content":"What is the weather in Minneapolis?"},{"role":"assistant","tool_calls":[{"id":"call_id","type":"function","function":{"name":"get_current_weather","arguments":"{\"location\": \"Minneapolis, USA\", \"format\": \"celsius\"}"}}]}],"parallel_tool_calls":false,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and country, eg. Minneapolis, USA"},"format":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location","format"]}}}]}
{"messages":[{"role":"user","content":"What is the weather in San Diego?"},{"role":"assistant","tool_calls":[{"id":"call_id","type":"function","function":{"name":"get_current_weather","arguments":"{\"location\": \"San Diego, USA\", \"format\": \"celsius\"}"}}]}],"parallel_tool_calls":false,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and country, eg. San Diego, USA"},"format":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location","format"]}}}]}
{"messages":[{"role":"user","content":"What is the weather in Memphis?"},{"role":"assistant","tool_calls":[{"id":"call_id","type":"function","function":{"name":"get_current_weather","arguments":"{\"location\": \"Memphis, USA\", \"format\": \"celsius\"}"}}]}],"parallel_tool_calls":false,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and country, eg. Memphis, USA"},"format":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location","format"]}}}]}
{"messages":[{"role":"user","content":"What is the weather in Atlanta?"},{"role":"assistant","tool_calls":[{"id":"call_id","type":"function","function":{"name":"get_current_weather","arguments":"{\"location\": \"Atlanta, USA\", \"format\": \"celsius\"}"}}]}],"parallel_tool_calls":false,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and country, eg. Atlanta, USA"},"format":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location","format"]}}}]}
{"messages":[{"role":"user","content":"What is the weather in Sunnyvale?"},{"role":"assistant","tool_calls":[{"id":"call_id","type":"function","function":{"name":"get_current_weather","arguments":"{\"location\": \"Sunnyvale, USA\", \"format\": \"celsius\"}"}}]}],"parallel_tool_calls":false,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and country, eg. Sunnyvale, USA"},"format":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location","format"]}}}]}
{"messages":[{"role":"user","content":"What is the weather in Chicago?"},{"role":"assistant","tool_calls":[{"id":"call_id","type":"function","function":{"name":"get_current_weather","arguments":"{\"location\": \"Chicago, USA\", \"format\": \"celsius\"}"}}]}],"parallel_tool_calls":false,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and country, eg. Chicago, USA"},"format":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location","format"]}}}]}
```

--------------------------------

### Upload File and Query with Python

Source: https://platform.openai.com/docs/quickstart_api-mode=responses

Shows how to upload a file and query it using the OpenAI Python SDK. The code opens a PDF file, uploads it with user_data purpose, and creates a response request that combines file content with a text question.

```python
from openai import OpenAI
client = OpenAI()

file = client.files.create(
    file=open("draconomicon.pdf", "rb"),
    purpose="user_data"
)

response = client.responses.create(
    model="gpt-5",
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_file",
                    "file_id": file.id,
                },
                {
                    "type": "input_text",
                    "text": "What is the first dragon in the book?",
                },
            ]
        }
    ]
)

print(response.output_text)
```

--------------------------------

### Create OpenAI EvalRun for Text Categorization using curl, Python, and Node.js

Source: https://platform.openai.com/docs/api-reference/evals/get

These code snippets demonstrate how to create an EvalRun for an OpenAI model (gpt-4o-mini) to categorize news headlines. The evaluation setup includes a detailed 'developer' role prompt with steps, output format, and examples, along with a user input template and sampling parameters. An example input item is also provided for evaluation.

```curl
curl https://api.openai.com/v1/evals/eval_67e579652b548190aaa83ada4b125f47/runs \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"gpt-4o-mini","data_source":{"type":"completions","input_messages":{"type":"template","template":[{"role":"developer","content":"Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output**: \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n"} , {"role":"user","content":"{{item.input}}"}]} ,"sampling_params":{"temperature":1,"max_completions_tokens":2048,"top_p":1,"seed":42},"model":"gpt-4o-mini","source":{"type":"file_content","content":[{"item":{"input":"Tech Company Launches Advanced Artificial Intelligence Platform","ground_truth":"Technology"}}]}}'
```

```python
from openai import OpenAI
client = OpenAI()

run = client.evals.runs.create(
  "eval_67e579652b548190aaa83ada4b125f47",
  name="gpt-4o-mini",
  data_source={
    "type": "completions",
    "input_messages": {
      "type": "template",
      "template": [
        {
          "role": "developer",
          "content": "Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output": \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output": \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n"
        },
        {
          "role": "user",
          "content": "{{item.input}}"
        }
      ]
    },
    "sampling_params": {
      "temperature": 1,
      "max_completions_tokens": 2048,
      "top_p": 1,
      "seed": 42
    },
    "model": "gpt-4o-mini",
    "source": {
      "type": "file_content",
      "content": [
        {
          "item": {
            "input": "Tech Company Launches Advanced Artificial Intelligence Platform",
            "ground_truth": "Technology"
          }
        }
      ]
    }
  }
)
print(run)
```

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const run = await openai.evals.runs.create(
  "eval_67e579652b548190aaa83ada4b125f47",
  {
    name: "gpt-4o-mini",
    data_source: {
      type: "completions",
      input_messages: {

```

--------------------------------

### Create OpenAI Eval Run for Model Evaluation

Source: https://platform.openai.com/docs/api-reference/evals/object

This code demonstrates how to create an evaluation run for an OpenAI model. It configures an `EvalRun` to evaluate the `gpt-4o-mini` model using a completions data source. The evaluation setup includes a templated prompt for categorizing news headlines into predefined topics and specifies sampling parameters and an input data source with an example item.

```curl
curl https://api.openai.com/v1/evals/eval_67e579652b548190aaa83ada4b125f47/runs \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"gpt-4o-mini","data_source":{"type":"completions","input_messages":{"type":"template","template":[{"role":"developer","content":"Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output**: \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n"} , {"role":"user","content":"{{item.input}}"}]} ,"sampling_params":{"temperature":1,"max_completions_tokens":2048,"top_p":1,"seed":42},"model":"gpt-4o-mini","source":{"type":"file_content","content":[{"item":{"input":"Tech Company Launches Advanced Artificial Intelligence Platform","ground_truth":"Technology"}}]}}'
```

```python
from openai import OpenAI
client = OpenAI()

run = client.evals.runs.create(
  "eval_67e579652b548190aaa83ada4b125f47",
  name="gpt-4o-mini",
  data_source={
    "type": "completions",
    "input_messages": {
      "type": "template",
      "template": [
        {
          "role": "developer",
          "content": "Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output": \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output": \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output": \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n"
        },
        {
          "role": "user",
          "content": "{{item.input}}"
        }
      ]
    },
    "sampling_params": {
      "temperature": 1,
      "max_completions_tokens": 2048,
      "top_p": 1,
      "seed": 42
    },
    "model": "gpt-4o-mini",
    "source": {
      "type": "file_content",
      "content": [
        {
          "item": {
            "input": "Tech Company Launches Advanced Artificial Intelligence Platform",
            "ground_truth": "Technology"
          }
        }
      ]
    }
  }
)
print(run)
```

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const run = await openai.evals.runs.create(
  "eval_67e579652b548190aaa83ada4b125f47",
  {
    name: "gpt-4o-mini",
    data_source: {
      type: "completions",
      input_messages: {
```

--------------------------------

### Create OpenAI EvalRun with Prompt Template and Data Source

Source: https://platform.openai.com/docs/api-reference/evals/cancelRun

These snippets illustrate how to initiate an EvalRun through the OpenAI API. An EvalRun is configured with a specific model (`gpt-4o-mini`), a data source defining input messages (using a `developer` role template for categorization instructions), and sampling parameters. This setup allows for evaluating the model's performance on given tasks, such as classifying news headlines into predefined categories based on provided examples and rules.

```bash
curl https://api.openai.com/v1/evals/eval_67e579652b548190aaa83ada4b125f47/runs \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"gpt-4o-mini","data_source":{"type":"completions","input_messages":{"type":"template","template":[{"role":"developer","content":"Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output**: \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n"} , {"role":"user","content":"{{item.input}}"}]} ,"sampling_params":{"temperature":1,"max_completions_tokens":2048,"top_p":1,"seed":42},"model":"gpt-4o-mini","source":{"type":"file_content","content":[{"item":{"input":"Tech Company Launches Advanced Artificial Intelligence Platform","ground_truth":"Technology"}}]}}}'
```

```python
from openai import OpenAI
client = OpenAI()

run = client.evals.runs.create(
  "eval_67e579652b548190aaa83ada4b125f47",
  name="gpt-4o-mini",
  data_source={
    "type": "completions",
    "input_messages": {
      "type": "template",
      "template": [
        {
          "role": "developer",
          "content": "Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output**: \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n"
        },
        {
          "role": "user",
          "content": "{{item.input}}"
        }
      ]
    },
    "sampling_params": {
      "temperature": 1,
      "max_completions_tokens": 2048,
      "top_p": 1,
      "seed": 42
    },
    "model": "gpt-4o-mini",
    "source": {
      "type": "file_content",
      "content": [
        {
          "item": {
            "input": "Tech Company Launches Advanced Artificial Intelligence Platform",
            "ground_truth": "Technology"
          }
        }
      ]
    }
  }
)
print(run)
```

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const run = await openai.evals.runs.create(
  "eval_67e579652b548190aaa83ada4b125f47",
  {
    name: "gpt-4o-mini",
    data_source: {
      type: "completions",
      input_messages: {

```

--------------------------------

### Flex Processing - Python SDK Example

Source: https://platform.openai.com/docs/guides/flex-processing

Implementation example showing how to create a flex processing request using the OpenAI Python SDK with proper timeout configuration.

```APIDOC
## Python SDK - Flex Processing Request

### Description
Demonstrates how to initialize the OpenAI Python client with increased timeout and make a flex processing request.

### Code Example
```python
from openai import OpenAI

client = OpenAI(
    timeout=900.0  # Increase default timeout to 15 minutes
)

response = client.with_options(timeout=900.0).responses.create(
    model="o3",
    instructions="List and describe all the metaphors used in this book.",
    input="<very long text of book here>",
    service_tier="flex"
)

print(response.output_text)
```

### Key Parameters
- **timeout** (float) - Set to 900.0 seconds (15 minutes) to accommodate flex processing delays
- **service_tier** (string) - Set to "flex" to enable cost-optimized processing
```

--------------------------------

### Retrieve Specific OpenAI Chat Completion by ID

Source: https://platform.openai.com/docs/api-reference/chat/get

These examples demonstrate how to retrieve a specific OpenAI Chat Completion object using its unique identifier. The cURL command performs a direct HTTP GET request, while the Python SDK example uses the `client.chat.completions.retrieve()` method. Both methods require an OpenAI API key for authentication.

```curl
curl https://api.openai.com/v1/chat/completions/chatcmpl-abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"
```

```python
from openai import OpenAI
client = OpenAI()

completions = client.chat.completions.list()
first_id = completions[0].id
first_completion = client.chat.completions.retrieve(completion_id=first_id)
print(first_completion)
```

--------------------------------

### POST /v1/files

Source: https://platform.openai.com/docs/quickstart_api-mode=chat

Uploads a file to OpenAI. Files can be used for various purposes, such as providing context for language models or fine-tuning.

```APIDOC
## POST /v1/files

### Description
Uploads a file to OpenAI. Files can be used for various purposes, such as providing context for language models or fine-tuning.

### Method
POST

### Endpoint
/v1/files

### Parameters
#### Path Parameters
(None)

#### Query Parameters
(None)

#### Request Body
- **file** (file) - Required - The file to upload.
- **purpose** (string) - Required - The intended purpose of the file. E.g., "user_data".

### Request Example
```bash
curl https://api.openai.com/v1/files \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F purpose="user_data" \
    -F file="@draconomicon.pdf"
```

### Response
#### Success Response (200)
- **id** (string) - A unique ID for the file.
- **object** (string) - The type of object, typically "file".
- **bytes** (integer) - The size of the file in bytes.
- **created_at** (integer) - The Unix timestamp (in seconds) for when the file was created.
- **filename** (string) - The name of the file.
- **purpose** (string) - The purpose of the file.

#### Response Example
```json
{
  "id": "file-6F2ksmvXxt4VdoqmHRw6kL",
  "object": "file",
  "bytes": 148721,
  "created_at": 1677659556,
  "filename": "draconomicon.pdf",
  "purpose": "user_data"
}
```
```

--------------------------------

### Create OpenAI Response with C#

Source: https://platform.openai.com/docs/overview

Use the OpenAI C# client library to generate a response from the GPT-5.2 model. The API key is retrieved from environment variables and used to initialize the OpenAIResponseClient. The CreateResponse method is called with the input prompt and the output text is printed to the console.

```csharp
using OpenAI.Responses;

string apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
var client = new OpenAIResponseClient(model: "gpt-5.2", apiKey: apiKey);

OpenAIResponse response = client.CreateResponse(
    "Write a short bedtime story about a unicorn."
);

Console.WriteLine(response.GetOutputText());
```

--------------------------------

### Create Vector Store with Initial Files - Python/JavaScript

Source: https://platform.openai.com/docs/assistants/tools/file-search

Creates a new vector store with an initial set of files in a single API call. The operation initializes a vector store named 'Product Documentation' with up to 5 file IDs. Returns a vector store object that can be used for subsequent file operations.

```python
vector_store = client.vector_stores.create(
  name="Product Documentation",
  file_ids=['file_1', 'file_2', 'file_3', 'file_4', 'file_5']
)
```

```javascript
const vectorStore = await openai.vectorStores.create({
  name: "Product Documentation",
  file_ids: ['file_1', 'file_2', 'file_3', 'file_4', 'file_5']
});
```

--------------------------------

### Retrieve OpenAI Model Response by ID (HTTP GET)

Source: https://platform.openai.com/docs/api-reference/responses/input-items

This section outlines how to retrieve a previously generated OpenAI model response using its unique ID via an HTTP GET request. It details the required path parameter for the response ID and optional query parameters such as `include`, `include_obfuscation`, `starting_after`, and `stream` to customize the retrieval behavior. A cURL example is provided.

```curl
curl -X GET https://api.openai.com/v1/responses/{response_id} \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

--------------------------------

### Test Basic API Request - Java

Source: https://platform.openai.com/docs/libraries

Create and execute a simple API request using the OpenAI SDK in Java. This example demonstrates client initialization from environment variables, parameter building, and calling the Responses API.

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;

public class Main {
    public static void main(String[] args) {
        OpenAIClient client = OpenAIOkHttpClient.fromEnv();

        ResponseCreateParams params = ResponseCreateParams.builder()
                .input("Say this is a test")
                .model("gpt-5-nano")
                .build();

        Response response = client.responses().create(params);
        System.out.println(response.outputText());
    }
}
```

--------------------------------

### Mask Requirements and Alpha Channel Setup

Source: https://platform.openai.com/docs/guides/image-generation_gallery=open&galleryItem=3d-city

Instructions for preparing mask images for the OpenAI Image API. Masks must match the input image format and size (under 50MB) and include an alpha channel. This example demonstrates how to programmatically add an alpha channel to a black and white mask using Python PIL.

```APIDOC
## Image Mask Preparation

### Description
Prepare mask images with alpha channels for image editing operations. The mask and input image must be identical in format and size, with maximum file size of 50MB.

### Mask Requirements
- **Format**: Must match the input image format
- **Size**: Must match the input image size
- **File Size**: Must be less than 50MB
- **Alpha Channel**: Required - the mask image must contain an alpha channel

### Adding Alpha Channel to Black and White Mask (Python)

#### Process
1. Load your black and white mask as a grayscale image
2. Convert it to RGBA format to create space for alpha channel
3. Use the mask itself to fill the alpha channel
4. Convert the mask into bytes
5. Save the resulting file

#### Code Example
```python
from PIL import Image
from io import BytesIO

# 1. Load your black & white mask as a grayscale image
mask = Image.open(img_path_mask).convert("L")

# 2. Convert it to RGBA so it has space for an alpha channel
mask_rgba = mask.convert("RGBA")

# 3. Then use the mask itself to fill that alpha channel
mask_rgba.putalpha(mask)

# 4. Convert the mask into bytes
buf = BytesIO()
mask_rgba.save(buf, format="PNG")
mask_bytes = buf.getvalue()

# 5. Save the resulting file
img_path_mask_alpha = "mask_alpha.png"
with open(img_path_mask_alpha, "wb") as f:
    f.write(mask_bytes)
```
```

--------------------------------

### Create and Run Assistant with Thread - JavaScript

Source: https://platform.openai.com/docs/api-reference/runs/listRuns

Creates a thread with initial messages and starts a run using the OpenAI JavaScript/Node.js client. Uses async/await syntax and the createAndRun method to initialize the assistant with the specified configuration.

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const run = await openai.beta.threads.createAndRun({
    assistant_id: "asst_abc123",
    thread: {
      messages: [
        { role: "user", content: "Explain deep learning to a 5 year old." },
      ],
    },
  });

  console.log(run);
}

main();
```

--------------------------------

### POST /v1/responses

Source: https://platform.openai.com/docs/quickstart_api-mode=chat

Generates a model response based on a given input, which can include both text and previously uploaded files. This is analogous to a chat completion request.

```APIDOC
## POST /v1/responses

### Description
Generates a model response based on a given input, which can include both text and previously uploaded files. This is analogous to a chat completion request.

### Method
POST

### Endpoint
/v1/responses

### Parameters
#### Path Parameters
(None)

#### Query Parameters
(None)

#### Request Body
- **model** (string) - Required - The ID of the model to use for the response (e.g., "gpt-5").
- **input** (array) - Required - A list of input items for the model. Each item represents a message/turn in a conversation.
  - **input[].role** (string) - Required - The role of the author of this message (e.g., "user").
  - **input[].content** (array) - Required - An array of content parts, which can be text or file references.
    - **input[].content[].type** (string) - Required - The type of the content part (e.g., "input_file", "input_text").
    - **input[].content[].file_id** (string) - Required (if type is "input_file") - The ID of a previously uploaded file.
    - **input[].content[].text** (string) - Required (if type is "input_text") - The text content of the message.

### Request Example
```json
{
    "model": "gpt-5",
    "input": [
        {
            "role": "user",
            "content": [
                {
                    "type": "input_file",
                    "file_id": "file-6F2ksmvXxt4VdoqmHRw6kL"
                },
                {
                    "type": "input_text",
                    "text": "What is the first dragon in the book?"
                }
            ]
        }
    ]
}
```

### Response
#### Success Response (200)
- **id** (string) - A unique ID for the response.
- **object** (string) - The type of object, typically "response".
- **created_at** (integer) - The Unix timestamp (in seconds) for when the response was created.
- **model** (string) - The model used to generate the response.
- **output_text** (string) - The generated text output from the model.

#### Response Example
```json
{
  "id": "rsp-123abc...",
  "object": "response",
  "created_at": 1677659600,
  "model": "gpt-5",
  "output_text": "The first dragon mentioned in the Draconomicon is the Red Dragon."
}
```
```

--------------------------------

### Analyze Image from URL using OpenAI API

Source: https://platform.openai.com/docs/quickstart_api-mode=responses

This snippet demonstrates how to send an image URL to an OpenAI model (gpt-5) for analysis. It includes examples in JavaScript, cURL, Python, and C# for making API requests to classify visual elements or extract information. The model receives a user role with both text and an image URL as content.

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
    model: "gpt-5",
    input: [
        {
            role: "user",
            content: [
                {
                    type: "input_text",
                    text: "What is in this image?",
                },
                {
                    type: "input_image",
                    image_url: "https://openai-documentation.vercel.app/images/cat_and_otter.png",
                },
            ],
        },
    ],
});

console.log(response.output_text);
```

```curl
curl "https://api.openai.com/v1/responses" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-5",
        "input": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": "What is in this image?"
                    },
                    {
                        "type": "input_image",
                        "image_url": "https://openai-documentation.vercel.app/images/cat_and_otter.png"
                    }
                ]
            }
        ]
    }'
```

```python
from openai import OpenAI
client = OpenAI()

response = client.responses.create(
    model="gpt-5",
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": "What teams are playing in this image?",
                },
                {
                    "type": "input_image",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/3/3b/LeBron_James_Layup_%28Cleveland_vs_Brooklyn_2018%29.jpg"
                }
            ]
        }
    ]
)

print(response.output_text)
```

```csharp
using OpenAI.Responses;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
OpenAIResponseClient client = new(model: "gpt-5", apiKey: key);

OpenAIResponse response = (OpenAIResponse)client.CreateResponse([
    ResponseItem.CreateUserMessageItem([
        ResponseContentPart.CreateInputTextPart("What is in this image?"),
        ResponseContentPart.CreateInputImagePart(new Uri("https://openai-documentation.vercel.app/images/cat_and_otter.png")),
    ]),
]);

Console.WriteLine(response.GetOutputText());
```

--------------------------------

### Test Basic API Request - C#

Source: https://platform.openai.com/docs/libraries

Create and execute a simple API request using the OpenAI SDK in C#. This example demonstrates async/await pattern, client initialization with API key from environment variables, and making a Responses API call.

```csharp
using System;
using System.Threading.Tasks;
using OpenAI;

class Program
{
    static async Task Main()
    {
        var client = new OpenAIClient(
            Environment.GetEnvironmentVariable("OPENAI_API_KEY")
        );

        var response = await client.Responses.CreateAsync(new ResponseCreateRequest
        {
            Model = "gpt-5-nano",
            Input = "Say 'this is a test.'"
        });

        Console.WriteLine($"[ASSISTANT]: {response.OutputText()}");
    }
}
```

--------------------------------

### Categorize News Headlines Prompt (OpenAI)

Source: https://platform.openai.com/docs/api-reference/evals/get

This prompt guides an OpenAI model to categorize news headlines into predefined topics like Technology, Markets, World, Business, or Sports. It includes detailed steps, output format instructions, and examples for clarity. The model used is 'gpt-4o-mini'.

```json
{
  "input": "Sports League Announces Revised Schedule for Upcoming Season",
  "ground_truth": "Sports"
}
{
  "input_messages": {
    "type": "template",
    "template": [
      {
        "type": "message",
        "role": "developer",
        "content": {
          "type": "input_text",
          "text": "Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output**: \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n"
        }
      },
      {
        "type": "message",
        "role": "user",
        "content": {
          "type": "input_text",
          "text": "{{item.input}}"
        }
      }
    ]
  },
  "model": "gpt-4o-mini",
  "sampling_params": {
    "seed": 42,
    "temperature": 1.0,
    "top_p": 1.0,
    "max_completions_tokens": 2048
  }
}
```

--------------------------------

### Audio File Splitting Guide

Source: https://platform.openai.com/docs/guides/speech-to-text

Guidance for handling audio files larger than 25 MB by splitting them into smaller chunks while preserving context. Includes example using PyDub library for programmatic audio splitting.

```APIDOC
## Handling Longer Audio Inputs

### Overview
The Transcriptions API has a maximum file size limit of 25 MB. Audio files exceeding this limit must be split into smaller chunks for processing.

### Best Practices
- Avoid splitting audio mid-sentence to preserve context and maintain transcription accuracy
- Use compressed audio formats (e.g., MP3, OGG) to reduce file size
- Process chunks sequentially or in parallel, then concatenate results

### File Size Limit
- **Maximum file size**: 25 MB per request
- **Supported formats**: MP3, WAV, M4A, FLAC, PCM, OGG

### Example: Splitting Audio with PyDub

#### Installation
```bash
pip install pydub
```

#### Python Implementation
```python
from pydub import AudioSegment

# Load audio file
song = AudioSegment.from_mp3("good_morning.mp3")

# PyDub handles time in milliseconds
ten_minutes = 10 * 60 * 1000

# Extract first 10 minutes
first_10_minutes = song[:ten_minutes]

# Export split audio
first_10_minutes.export("good_morning_10.mp3", format="mp3")
```

### Notes
- OpenAI makes no guarantees about the usability or security of third-party software like PyDub
- For optimal results, split large files into 5-15 minute chunks
- Ensure split points occur during natural pauses or silence when possible
```

--------------------------------

### Video Generation Workflow - Python Example

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=90s-TV-Ad

Complete workflow demonstrating video creation, progress monitoring with visual feedback, completion handling, and MP4 file download using the OpenAI Python SDK.

```APIDOC
## Video Generation Workflow - Python

### Description
End-to-end example of creating a video, monitoring progress with ASCII progress bar, and downloading the completed MP4 file using Python.

### Code Example

```python
from openai import OpenAI
import sys
import time

openai = OpenAI()

# Step 1: Create video generation job
video = openai.videos.create(
    model="sora-2",
    prompt="A video of a cool cat on a motorcycle in the night",
)

print("Video generation started:", video)

progress = getattr(video, "progress", 0)
bar_length = 30

# Step 2: Poll for completion with progress tracking
while video.status in ("in_progress", "queued"):
    # Refresh status
    video = openai.videos.retrieve(video.id)
    progress = getattr(video, "progress", 0)

    filled_length = int((progress / 100) * bar_length)
    bar = "=" * filled_length + "-" * (bar_length - filled_length)
    status_text = "Queued" if video.status == "queued" else "Processing"

    sys.stdout.write(f"\r{status_text}: [{bar}] {progress:.1f}%")
    sys.stdout.flush()
    time.sleep(2)

# Move to next line after progress loop
sys.stdout.write("\n")

# Step 3: Check for errors
if video.status == "failed":
    message = getattr(
        getattr(video, "error", None), "message", "Video generation failed"
    )
    print(message)
    return

print("Video generation completed:", video)

# Step 4: Download video content
print("Downloading video content...")

content = openai.videos.download_content(video.id, variant="video")
content.write_to_file("video.mp4")

print("Wrote video.mp4")
```

### Key Steps
1. Create video job with model and prompt
2. Retrieve status and progress in a loop with visual feedback
3. Handle error states
4. Download completed video content using download_content method
5. Write file to local storage

### Progress Monitoring
The example uses an ASCII progress bar that updates every 2 seconds, providing visual feedback during video generation.
```

--------------------------------

### Install OpenAI SDK with npm - JavaScript

Source: https://platform.openai.com/docs/libraries

Install the official OpenAI SDK for TypeScript and JavaScript using npm package manager. This is the first step for setting up the OpenAI API in Node.js, Deno, or Bun environments.

```bash
npm install openai
```

--------------------------------

### Run Object Response Example

Source: https://platform.openai.com/docs/assistants

Represents a completed run object from the Assistants API. This object contains execution details including status, token usage, model information, and execution timestamps. It serves as a reference for understanding the structure of run responses before migration.

```APIDOC
## Run Object Response

### Description
Represents a thread run object from the Assistants API containing execution details, status information, and token usage statistics.

### Response Fields
- **id** (string) - Unique identifier for the run object
- **assistant_id** (string) - ID of the associated assistant
- **cancelled_at** (timestamp | null) - Timestamp when run was cancelled, if applicable
- **completed_at** (timestamp) - Timestamp when run completed
- **created_at** (timestamp) - Timestamp when run was created
- **expires_at** (timestamp | null) - Timestamp when run expires
- **failed_at** (timestamp | null) - Timestamp when run failed, if applicable
- **incomplete_details** (object | null) - Details about incomplete run
- **instructions** (string | null) - Custom instructions for the run
- **last_error** (string | null) - Last error message, if any
- **max_completion_tokens** (integer | null) - Maximum completion tokens
- **max_prompt_tokens** (integer | null) - Maximum prompt tokens
- **metadata** (object) - Custom metadata key-value pairs
- **model** (string) - Model identifier (e.g., "gpt-4.1")
- **object** (string) - Object type identifier
- **parallel_tool_calls** (boolean) - Whether parallel tool calls are enabled
- **required_action** (object | null) - Required action details
- **response_format** (string) - Response format type
- **started_at** (timestamp) - Timestamp when run started
- **status** (string) - Current status (e.g., "completed")
- **thread_id** (string) - ID of associated thread
- **tool_choice** (string) - Tool choice strategy
- **tools** (array) - Array of tools available to the run
- **truncation_strategy** (object) - Strategy for handling truncation
- **usage** (object) - Token usage statistics
  - **completion_tokens** (integer) - Tokens used for completion
  - **prompt_tokens** (integer) - Tokens used for prompt
  - **total_tokens** (integer) - Total tokens used
- **temperature** (float) - Temperature parameter for model
- **top_p** (float) - Top-p parameter for model

### Response Example
```json
{
  "id": "run_FKIpcs5ECSwuCmehBqsqkORj",
  "assistant_id": "asst_8fVY45hU3IM6creFkVi5MBKB",
  "completed_at": 1752857327,
  "created_at": 1752857322,
  "model": "gpt-4.1",
  "object": "thread.run",
  "status": "completed",
  "thread_id": "thread_CrXtCzcyEQbkAcXuNmVSKFs1",
  "usage": {
    "completion_tokens": 130,
    "prompt_tokens": 34,
    "total_tokens": 164
  }
}
```
```

--------------------------------

### POST /v1/assistants

Source: https://platform.openai.com/docs/api-reference/assistants/listAssistants

Create an assistant with a model and instructions. This endpoint initializes a new assistant that can be configured with custom system instructions, tools, and model parameters to perform specific tasks.

```APIDOC
## POST /v1/assistants

### Description
Create an assistant with a model and instructions. The assistant can be configured with custom system instructions, tools, metadata, and model parameters.

### Method
POST

### Endpoint
https://api.openai.com/v1/assistants

### Request Body Parameters

#### Required Parameters
- **model** (string) - Required - ID of the model to use. You can use the List models API to see all available models. See Model overview for descriptions.

#### Optional Parameters
- **name** (string) - Optional - The name of the assistant. Maximum length: 256 characters.
- **description** (string) - Optional - The description of the assistant. Maximum length: 512 characters.
- **instructions** (string) - Optional - The system instructions that the assistant uses. Maximum length: 256,000 characters.
- **temperature** (number) - Optional - Defaults to 1. What sampling temperature to use, between 0 and 2. Higher values like 0.8 make output more random, lower values like 0.2 make it more focused and deterministic.
- **top_p** (number) - Optional - Defaults to 1. Nucleus sampling where the model considers tokens with top_p probability mass. 0.1 means only tokens in top 10% probability mass are considered.
- **reasoning_effort** (string) - Optional - Defaults to medium. Constrains effort on reasoning for reasoning models. Supported values: `none`, `minimal`, `low`, `medium`, `high`, `xhigh`.
- **response_format** ("auto" or object) - Optional - Specifies the format that the model must output. Compatible with GPT-4o, GPT-4 Turbo, and GPT-3.5 Turbo models since `gpt-3.5-turbo-1106`. Supports `{ "type": "json_schema", "json_schema": {...} }` for Structured Outputs or `{ "type": "json_object" }` for JSON mode.
- **tools** (array) - Optional - Defaults to []. A list of tools enabled on the assistant. Maximum 128 tools per assistant. Tool types: `code_interpreter`, `file_search`, or `function`.
- **tool_resources** (object) - Optional - A set of resources used by the assistant's tools. Resource types are specific to the tool type (e.g., file IDs for code_interpreter, vector store IDs for file_search).
- **metadata** (map) - Optional - Set of 16 key-value pairs that can be attached to an object. Keys are strings with maximum length 64 characters. Values are strings with maximum length 512 characters.

### Request Example
```json
{
  "model": "gpt-4o",
  "name": "Math Tutor",
  "description": "An assistant that helps with mathematics",
  "instructions": "You are a helpful mathematics tutor. Provide clear explanations and step-by-step solutions.",
  "temperature": 0.7,
  "tools": [{"type": "code_interpreter"}],
  "metadata": {"version": "1.0", "subject": "mathematics"}
}
```

### Response

#### Success Response (200 OK)
Returns an assistant object with the following fields:
- **id** (string) - The unique identifier of the assistant
- **object** (string) - The object type, always "assistant"
- **created_at** (integer) - Unix timestamp of when the assistant was created
- **name** (string) - The name of the assistant
- **description** (string) - The description of the assistant
- **model** (string) - The model ID used by the assistant
- **instructions** (string) - The system instructions for the assistant
- **tools** (array) - Array of tools enabled on the assistant
- **metadata** (object) - Key-value pairs attached to the assistant
- **temperature** (number) - The temperature setting for the assistant
- **top_p** (number) - The top_p setting for the assistant
- **response_format** (object) - The response format configuration
- **reasoning_effort** (string) - The reasoning effort level

#### Response Example
```json
{
  "id": "asst_abc123",
  "object": "assistant",
  "created_at": 1699009709,
  "name": "Math Tutor",
  "description": "An assistant that helps with mathematics",
  "model": "gpt-4o",
  "instructions": "You are a helpful mathematics tutor. Provide clear explanations and step-by-step solutions.",
  "tools": [{"type": "code_interpreter"}],
  "metadata": {"version": "1.0", "subject": "mathematics"},
  "temperature": 0.7,
  "top_p": 1,
  "response_format": "auto",
  "reasoning_effort": "medium"
}
```
```

--------------------------------

### POST /v1/responses - Analyze Images and Files

Source: https://platform.openai.com/docs/quickstart_api-mode=chat

This endpoint allows users to send image or file URLs to an OpenAI model for analysis. The model processes the provided input and returns a textual response, enabling capabilities like content classification, text extraction, or visual element detection.

```APIDOC
## POST /v1/responses

### Description
This endpoint allows users to send image or file URLs to an OpenAI model for analysis, text extraction, content classification, or visual element detection. The model processes the provided input and returns a textual response.

### Method
POST

### Endpoint
/v1/responses

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **model** (string) - Required - The ID of the model to use for the analysis (e.g., "gpt-5").
- **input** (array of objects) - Required - A list of messages comprising the conversation. Each object represents a message.
    - **input[].role** (string) - Required - The role of the author of this message (e.g., "user").
    - **input[].content** (array of objects) - Required - An array of content parts, which can be text, image URLs, or file URLs.
        - **input[].content[].type** (string) - Required - The type of the content part. Can be "input_text", "input_image", or "input_file".
        - **input[].content[].text** (string) - Required (if `type` is "input_text") - The text content to be sent to the model.
        - **input[].content[].image_url** (string) - Required (if `type` is "input_image") - The URL of the image to be analyzed.
        - **input[].content[].file_url** (string) - Required (if `type` is "input_file") - The URL of the file (e.g., PDF) to be analyzed.

### Request Example
```json
{
  "model": "gpt-5",
  "input": [
    {
      "role": "user",
      "content": [
        {
          "type": "input_text",
          "text": "What is in this image?"
        },
        {
          "type": "input_image",
          "image_url": "https://openai-documentation.vercel.app/images/cat_and_otter.png"
        }
      ]
    }
  ]
}
```

### Response
#### Success Response (200)
- **output_text** (string) - The generated text response from the model, containing the analysis or summary.

#### Response Example
```json
{
  "output_text": "The image shows a cat and an otter playing together."
}
```
```

--------------------------------

### WebSocket Connection - Node.js (ws module)

Source: https://platform.openai.com/docs/guides/realtime-websocket

Establish a WebSocket connection to the OpenAI Realtime API using the ws module in Node.js. This example demonstrates basic connection setup with Bearer token authentication and message handling.

```APIDOC
## WebSocket Connection - Node.js

### Description
Connect to the OpenAI Realtime API using the ws module for Node.js with Bearer token authentication.

### Protocol
WebSocket Secure (wss://)

### Endpoint
wss://api.openai.com/v1/realtime?model=gpt-realtime

### Authentication
- **Authorization Header** (Required) - Bearer token using your OpenAI API key
  - Format: `Authorization: Bearer YOUR_OPENAI_API_KEY`

### Connection Setup
```javascript
import WebSocket from "ws";

const url = "wss://api.openai.com/v1/realtime?model=gpt-realtime";
const ws = new WebSocket(url, {
  headers: {
    Authorization: "Bearer " + process.env.OPENAI_API_KEY,
  },
});

ws.on("open", function open() {
  console.log("Connected to server.");
});

ws.on("message", function incoming(message) {
  console.log(JSON.parse(message.toString()));
});
```

### Events
- **open** - Triggered when WebSocket connection is successfully established
- **message** - Triggered when server sends a message; data is JSON-serialized text

### Usage Notes
- Recommended for server-to-server applications
- Use standard API key for backend connections
- For browser/mobile clients, WebRTC is recommended instead
```

--------------------------------

### Headline Classification Examples

Source: https://platform.openai.com/docs/api-reference/evals/list

Five practical examples demonstrating the headline categorization system with input headlines and their corresponding category outputs. Shows proper classification across all five categories with real-world news examples.

```text
Example 1:
Input: "Apple Unveils New iPhone Model, Featuring Advanced AI Features"
Output: "Technology"

Example 2:
Input: "Global Stocks Mixed as Investors Await Central Bank Decisions"
Output: "Markets"

Example 3:
Input: "War in Ukraine: Latest Updates on Negotiation Status"
Output: "World"

Example 4:
Input: "Microsoft in Talks to Acquire Gaming Company for $2 Billion"
Output: "Business"

Example 5:
Input: "Manchester United Secures Win in Premier League Football Match"
Output: "Sports"
```

--------------------------------

### Define LLM Prompt for News Headline Categorization

Source: https://platform.openai.com/docs/api-reference/evals/getRuns

This snippet provides a JSON configuration for an LLM prompt, instructing it to categorize news headlines into specific topics. It details the categorization steps, expected output format, and includes several examples to guide the model's behavior for accurate classification.

```json
{
  "type": "template",
  "template": [
    {
      "type": "message",
      "role": "developer",
      "content": {
        "type": "input_text",
        "text": "Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output**: \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n"
      }
    },
    {
      "type": "message",
      "role": "user",
      "content": {
        "type": "input_text",
        "text": "{{item.input}}"
      }
    }
  ]
}
```

--------------------------------

### Lark CFG Simple Expression Parser

Source: https://platform.openai.com/docs/guides/function-calling

Example of a context-free grammar using Lark syntax for parsing mathematical expressions. Demonstrates best practices for rule composition with discrete tokens (terminals for numbers and operators, rules for combining them). Shows how to structure grammar to guide the lexer and parser correctly.

```lark
start: expr
NUMBER: /[0-9]+/
PLUS: "+"
MINUS: "-"
expr: term (("+"|\"-\") term)*
term: NUMBER
```

--------------------------------

### Perform Multi-Turn Image Generation using Image Call ID

Source: https://platform.openai.com/docs/guides/image-generation_gallery=open&galleryItem=construction-crew

This example demonstrates a complete multi-turn image generation workflow. It starts by generating an initial image, extracts the specific image generation call ID from the response, and then uses this ID in a follow-up request to apply further modifications (e.g., making the image more realistic). The generated image data is decoded and saved to a PNG file.

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5",
  input:
    "Generate an image of gray tabby cat hugging an otter with an orange scarf",
  tools: [{ type: "image_generation" }],
});

const imageGenerationCalls = response.output.filter(
  (output) => output.type === "image_generation_call"
);

const imageData = imageGenerationCalls.map((output) => output.result);

if (imageData.length > 0) {
  const imageBase64 = imageData[0];
  const fs = await import("fs");
  fs.writeFileSync("cat_and_otter.png", Buffer.from(imageBase64, "base64"));
}

// Follow up

const response_fwup = await openai.responses.create({
  model: "gpt-5",
  input: [
    {
      role: "user",
      content: [{ type: "input_text", text: "Now make it look realistic" }],
    },
    {
      type: "image_generation_call",
      id: imageGenerationCalls[0].id,
    },
  ],
  tools: [{ type: "image_generation" }],
});

const imageData_fwup = response_fwup.output
  .filter((output) => output.type === "image_generation_call")
  .map((output) => output.result);

if (imageData_fwup.length > 0) {
  const imageBase64 = imageData_fwup[0];
  const fs = await import("fs");
  fs.writeFileSync(
    "cat_and_otter_realistic.png",
    Buffer.from(imageBase64, "base64")
  );
}
```

```python
import openai
import base64

response = openai.responses.create(
    model="gpt-5",
    input="Generate an image of gray tabby cat hugging an otter with an orange scarf",
    tools=[{"type": "image_generation"}]
)

image_generation_calls = [
    output
    for output in response.output
    if output.type == "image_generation_call"
]

image_data = [output.result for output in image_generation_calls]

if image_data:
    image_base64 = image_data[0]

    with open("cat_and_otter.png", "wb") as f:
        f.write(base64.b64decode(image_base64))


# Follow up

response_fwup = openai.responses.create(
    model="gpt-5",
    input=[
        {
            "role": "user",
            "content": [{"type": "input_text", "text": "Now make it look realistic"}]
        },
        {
            "type": "image_generation_call",
            "id": image_generation_calls[0].id,
        },
    ],
    tools=[{"type": "image_generation"}]
)

image_data_fwup = [
    output.result
    for output in response_fwup.output
    if output.type == "image_generation_call"
]

if image_data_fwup:
    image_base64 = image_data_fwup[0]
    with open("cat_and_otter_realistic.png", "wb") as f:
        f.write(base64.b64decode(image_base64))
```

--------------------------------

### Get Fine-Tuned Model Checkpoint Permissions (curl)

Source: https://platform.openai.com/docs/api-reference/fine-tuning/checkpoint-object

This `curl` example demonstrates how to retrieve a list of permissions for a specific fine-tuned model checkpoint. It requires the `fine_tuned_model_checkpoint` ID as a path parameter and an `Authorization` header with a Bearer token.

```curl
curl https://api.openai.com/v1/fine_tuning/checkpoints/ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd/permissions \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

--------------------------------

### Example JSON Structure for Project User Object

Source: https://platform.openai.com/docs/api-reference/project-users/retrieve

This JSON example illustrates the complete structure of a project user object, showing typical values for its fields such as "object", "id", "name", "email", "role", and "added_at".

```json
{
    "object": "organization.project.user",
    "id": "user_abc",
    "name": "First Last",
    "email": "user@example.com",
    "role": "owner",
    "added_at": 1711471533
}
```

--------------------------------

### JSON Example for Code Interpreter Call In Progress Event

Source: https://platform.openai.com/docs/api-reference/responses-streaming/response/code_interpreter_call/completed

Emitted when a code interpreter call is in progress. This event provides a unique `item_id` for the call, the `output_index` for the response, a `sequence_number` for ordering, and its specific `type`. It indicates the start of a code interpreter execution.

```json
{
  "type": "response.code_interpreter_call.in_progress",
  "output_index": 0,
  "item_id": "ci_12345",
  "sequence_number": 1
}
```

--------------------------------

### List OpenAI Fine-Tuning Job Events

Source: https://platform.openai.com/docs/api-reference/fine-tuning/list-checkpoints

Get status updates and events for a specific fine-tuning job using its ID. This endpoint allows pagination with `after` and `limit` parameters to retrieve a filtered list of events. Examples are provided for `curl`, Python, and Node.js.

```curl
curl https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123/events \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

```python
from openai import OpenAI
client = OpenAI()

client.fine_tuning.jobs.list_events(
  fine_tuning_job_id="ftjob-abc123",
  limit=2
)
```

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const list = await openai.fineTuning.list_events(id="ftjob-abc123", limit=2);

  for await (const fineTune of list) {
    console.log(fineTune);
  }
}

main();
```

--------------------------------

### Export OpenAI API Key as Environment Variable (macOS/Linux & Windows)

Source: https://platform.openai.com/docs/quickstart_api-mode=chat

This snippet demonstrates how to export your OpenAI API key as an environment variable on macOS/Linux using the `export` command or on Windows using `setx`. This allows OpenAI SDKs to automatically read the key for authentication. Replace `your_api_key_here` with your actual API key.

```bash
export OPENAI_API_KEY="your_api_key_here"
```

```powershell
setx OPENAI_API_KEY "your_api_key_here"
```

--------------------------------

### Flex Processing - JavaScript SDK Example

Source: https://platform.openai.com/docs/guides/flex-processing

Implementation example showing how to create a flex processing request using the OpenAI JavaScript SDK with proper timeout configuration.

```APIDOC
## JavaScript/Node.js SDK - Flex Processing Request

### Description
Demonstrates how to initialize the OpenAI JavaScript client with increased timeout and make a flex processing request.

### Code Example
```javascript
import OpenAI from "openai";

const client = new OpenAI({
    timeout: 15 * 1000 * 60  // Increase default timeout to 15 minutes
});

const response = await client.responses.create({
    model: "o3",
    instructions: "List and describe all the metaphors used in this book.",
    input: "<very long text of book here>",
    service_tier: "flex"
}, { timeout: 15 * 1000 * 60 });

console.log(response.output_text);
```

### Key Parameters
- **timeout** (number) - Set to 15 * 1000 * 60 milliseconds (15 minutes) to accommodate flex processing delays
- **service_tier** (string) - Set to "flex" to enable cost-optimized processing
```

--------------------------------

### Configure Session Tools with Function Definition

Source: https://platform.openai.com/docs/guides/realtime-function-calling

Configures callable functions at the session level using session.update event. This example defines a generate_horoscope function that accepts an astrological sign parameter with enum validation. The description fields guide the model in deciding whether and when to call the function.

```json
{
    "type": "session.update",
    "session": {
        "tools": [
            {
                "type": "function",
                "name": "generate_horoscope",
                "description": "Give today's horoscope for an astrological sign.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "sign": {
                            "type": "string",
                            "description": "The sign for the horoscope.",
                            "enum": [
                                "Aries",
                                "Taurus",
                                "Gemini",
                                "Cancer",
                                "Leo",
                                "Virgo",
                                "Libra",
                                "Scorpio",
                                "Sagittarius",
                                "Capricorn",
                                "Aquarius",
                                "Pisces"
                            ]
                        }
                    },
                    "required": ["sign"]
                }
            }
        ],
        "tool_choice": "auto"
    }
}
```

--------------------------------

### Video Generation Workflow - JavaScript Example

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=90s-TV-Ad

Complete workflow demonstrating video creation, progress monitoring, completion handling, and MP4 file download using the OpenAI JavaScript SDK.

```APIDOC
## Video Generation Workflow - JavaScript

### Description
End-to-end example of creating a video, monitoring progress, and downloading the completed MP4 file.

### Code Example

```javascript
import OpenAI from 'openai';

const openai = new OpenAI();

// Step 1: Create video generation job
let video = await openai.videos.create({
    model: 'sora-2',
    prompt: "A video of the words 'Thank you' in sparkling letters",
});

console.log('Video generation started: ', video);
let progress = video.progress ?? 0;

// Step 2: Poll for completion with progress tracking
while (video.status === 'in_progress' || video.status === 'queued') {
    video = await openai.videos.retrieve(video.id);
    progress = video.progress ?? 0;

    // Display progress bar
    const barLength = 30;
    const filledLength = Math.floor((progress / 100) * barLength);
    const bar = '='.repeat(filledLength) + '-'.repeat(barLength - filledLength);
    const statusText = video.status === 'queued' ? 'Queued' : 'Processing';

    process.stdout.write(`${statusText}: [${bar}] ${progress.toFixed(1)}%`);

    await new Promise((resolve) => setTimeout(resolve, 2000));
}

// Clear the progress line
process.stdout.write('\n');

// Step 3: Check for errors
if (video.status === 'failed') {
    console.error('Video generation failed');
    return;
}

console.log('Video generation completed: ', video);

// Step 4: Download video content
console.log('Downloading video content...');

const content = await openai.videos.downloadContent(video.id);
const body = content.arrayBuffer();
const buffer = Buffer.from(await body);

require('fs').writeFileSync('video.mp4', buffer);
console.log('Wrote video.mp4');
```

### Key Steps
1. Create video job with model and prompt
2. Retrieve status and progress in a loop
3. Check for failure status
4. Download completed video content
5. Save to filesystem
```

--------------------------------

### POST /responses - Web Search Tool

Source: https://platform.openai.com/docs/quickstart

Create a response using the web search tool to give the model access to current web information. This allows the model to search the internet and incorporate real-time data into its responses.

```APIDOC
## POST /responses

### Description
Create a response with web search capability enabled. The model can search the web and use current information to answer user queries.

### Method
POST

### Endpoint
https://api.openai.com/v1/responses

### Request Body
- **model** (string) - Required - The model to use for generating responses (e.g., "gpt-5")
- **tools** (array) - Required - Array of tools to attach to the model
  - **type** (string) - Required - Tool type: "web_search"
- **input** (string) - Required - The user query or input text

### Request Example
```json
{
  "model": "gpt-5",
  "tools": [
    {
      "type": "web_search"
    }
  ],
  "input": "What was a positive news story from today?"
}
```

### Response
#### Success Response (200)
- **output_text** (string) - The model's response incorporating web search results

#### Response Example
```json
{
  "output_text": "Based on today's news..."
}
```
```

--------------------------------

### Retrieve Single Organization User with cURL

Source: https://platform.openai.com/docs/api-reference/users/modify

Fetches details for a single user by their 'user_id' from the organization. This cURL example performs a GET request, requiring an 'Authorization: Bearer' token and 'Content-Type' header. The API returns the matching User object.

```bash
curl https://api.openai.com/v1/organization/users/user_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
```

--------------------------------

### Utilize a Managed Custom Process (MCP) Tool (OpenAI API)

Source: https://platform.openai.com/docs/quickstart_api-mode=responses

These examples demonstrate how to integrate and use a Managed Custom Process (MCP) tool with the OpenAI API. An MCP tool allows the model to interact with external services, such as a Dungeons and Dragons dice rolling server. The tool's configuration, including its label, description, URL, and approval policy, is provided to the API, allowing the model to trigger it based on user input.

```cURL
curl https://api.openai.com/v1/responses \ 
-H "Content-Type: application/json" \ 
-H "Authorization: Bearer $OPENAI_API_KEY" \ 
-d '{
  "model": "gpt-5",
    "tools": [
      {
        "type": "mcp",
        "server_label": "dmcp",
        "server_description": "A Dungeons and Dragons MCP server to assist with dice rolling.",
        "server_url": "https://dmcp-server.deno.dev/sse",
        "require_approval": "never"
      }
    ],
    "input": "Roll 2d4+1"
  }'
```

```JavaScript
import OpenAI from "openai";
const client = new OpenAI();

const resp = await client.responses.create({
  model: "gpt-5",
  tools: [
    {
      type: "mcp",
      server_label: "dmcp",
      server_description: "A Dungeons and Dragons MCP server to assist with dice rolling.",
      server_url: "https://dmcp-server.deno.dev/sse",
      require_approval: "never",
    },
  ],
  input: "Roll 2d4+1",
});

console.log(resp.output_text);
```

```Python
from openai import OpenAI

client = OpenAI()

resp = client.responses.create(
    model="gpt-5",
    tools=[
        {
            "type": "mcp",
            "server_label": "dmcp",
            "server_description": "A Dungeons and Dragons MCP server to assist with dice rolling.",
            "server_url": "https://dmcp-server.deno.dev/sse",
            "require_approval": "never",
        },
    ],
    input="Roll 2d4+1",
)

print(resp.output_text)
```

```C#
using OpenAI.Responses;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
OpenAIResponseClient client = new(model: "gpt-5", apiKey: key);

ResponseCreationOptions options = new();
options.Tools.Add(ResponseTool.CreateMcpTool(
    serverLabel: "dmcp",
    serverUri: new Uri("https://dmcp-server.deno.dev/sse"),
    toolCallApprovalPolicy: new McpToolCallApprovalPolicy(GlobalMcpToolCallApprovalPolicy.NeverRequireApproval)
));

OpenAIResponse response = (OpenAIResponse)client.CreateResponse([
    ResponseItem.CreateUserMessageItem([
        ResponseContentPart.CreateInputTextPart("Roll 2d4+1")
    ])
], options);

Console.WriteLine(response.GetOutputText());
```

--------------------------------

### Initializing OpenAI Client and Defining Research Guidelines (JavaScript)

Source: https://platform.openai.com/docs/guides/deep-research

This JavaScript snippet initializes the OpenAI client and defines a comprehensive `instructions` string. This string serves as a meta-instruction set, guiding the AI on how to generate instructions for a *human researcher* to perform a task, emphasizing specificity, handling unstated dimensions, avoiding assumptions, and incorporating tables when appropriate. This setup ensures consistent and detailed instruction generation.

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const instructions = `
You will be given a research task by a user. Your job is to produce a set of
instructions for a researcher that will complete the task. Do NOT complete the
task yourself, just provide instructions on how to complete it.

GUIDELINES:
1. **Maximize Specificity and Detail**
- Include all known user preferences and explicitly list key attributes or
  dimensions to consider.
- It is of utmost importance that all details from the user are included in
  the instructions.

2. **Fill in Unstated But Necessary Dimensions as Open-Ended**
- If certain attributes are essential for a meaningful output but the user
  has not provided them, explicitly state that they are open-ended or default
  to no specific constraint.

3. **Avoid Unwarranted Assumptions**
- If the user has not provided a particular detail, do not invent one.
- Instead, state the lack of specification and guide the researcher to treat
  it as flexible or accept all possible options.

4. **Use the First Person**
- Phrase the request from the perspective of the user.

5. **Tables**
- If you determine that including a table will help illustrate, organize, or
  enhance the information in the research output, you must explicitly request
  that the researcher provide them.

Examples:
- Product Comparison (Consumer): When comparing different smartphone models,
  request a table listing each model's features, price, and consumer ratings
  side-by-side.
- Project Tracking (Work): When outlining project deliverables, create a table
  showing tasks, deadlines, responsible team members, and status updates.
`
```

--------------------------------

### Create OpenAI Thread Object (Deprecated Assistants API)

Source: https://platform.openai.com/docs/assistants/migration

Demonstrates how to create a new thread object using the deprecated OpenAI Assistants API. Threads were used to store a collection of messages server-side. This example initializes a thread with a user message and metadata.

```python
thread = openai.beta.threads.create(
  messages=[{"role": "user", "content": "what are the 5 Ds of dodgeball?"}],
  metadata={"user_id": "peter_le_fleur"},
)
```

--------------------------------

### POST /videos - Create a Video

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=mushroom-network

Start a render job by sending a text prompt and required parameters to create a video. The prompt defines the creative look, subjects, camera movement, lighting, and motion, while parameters control resolution and length.

```APIDOC
## POST /videos

### Description
Start a video generation render job with a text prompt and configuration parameters. Returns a video object with a unique ID and initial status.

### Method
POST

### Endpoint
https://api.openai.com/v1/videos

### Parameters
#### Request Body
- **model** (string) - Required - The model to use for video generation (e.g., "sora-2", "sora-2-pro")
- **prompt** (string) - Required - Text description defining subjects, camera movement, lighting, and motion
- **size** (string) - Optional - Video resolution (e.g., "1280x720", "1920x1080")
- **seconds** (string) - Optional - Video length in seconds (e.g., "8")

### Request Example (JavaScript)
```javascript
import OpenAI from 'openai';

const openai = new OpenAI();

let video = await openai.videos.create({
    model: 'sora-2',
    prompt: "A video of the words 'Thank you' in sparkling letters",
});

console.log('Video generation started: ', video);
```

### Request Example (Python)
```python
from openai import OpenAI

openai = OpenAI()

video = openai.videos.create(
    model="sora-2",
    prompt="A video of a cool cat on a motorcycle in the night",
)

print("Video generation started:", video)
```

### Request Example (cURL)
```bash
curl -X POST "https://api.openai.com/v1/videos" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F prompt="Wide tracking shot of a teal coupe driving through a desert highway, heat ripples visible, hard sun overhead." \
  -F model="sora-2-pro" \
  -F size="1280x720" \
  -F seconds="8"
```

### Response
#### Success Response (200)
- **id** (string) - Unique identifier for the video job
- **object** (string) - Type identifier ("video")
- **created_at** (integer) - Unix timestamp of creation
- **status** (string) - Initial job status ("queued" or "in_progress")
- **model** (string) - Model used for generation
- **progress** (integer) - Progress percentage (0 initially)
- **seconds** (string) - Video duration in seconds
- **size** (string) - Video resolution

#### Response Example
```json
{
  "id": "video_68d7512d07848190b3e45da0ecbebcde004da08e1e0678d5",
  "object": "video",
  "created_at": 1758941485,
  "status": "queued",
  "model": "sora-2-pro",
  "progress": 0,
  "seconds": "8",
  "size": "1280x720"
}
```
```

--------------------------------

### Start Playwright Browser Instance - Python

Source: https://platform.openai.com/docs/guides/tools-computer-use

Launches a sandboxed Chromium browser instance using Playwright in Python. Configures security settings by disabling extensions and file system access, sets viewport dimensions, navigates to a URL, and waits before closing. Prerequisites: Python and Playwright SDK installed via pip.

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=False,
        chromium_sandbox=True,
        env={},
        args=[
            "--disable-extensions",
            "--disable-file-system"
        ]
    )
    page = browser.new_page()
    page.set_viewport_size({"width": 1024, "height": 768})
    page.goto("https://bing.com")

    page.wait_for_timeout(10000)
```

--------------------------------

### Create and Poll OpenAI Run Object (Deprecated Assistants API)

Source: https://platform.openai.com/docs/assistants/migration

Shows how to create a run object and poll its status using the deprecated OpenAI Assistants API. Runs were asynchronous processes executed against threads. This example demonstrates initializing a run and repeatedly checking its status until completion.

```python
thread_id = "thread_CrXtCzcyEQbkAcXuNmVSKFs1"
assistant_id = "asst_8fVY45hU3IM6creFkVi5MBKB"

run = openai.beta.threads.runs.create(thread_id=thread_id, assistant_id=assistant.id)

while run.status in ("queued", "in_progress"):
  time.sleep(1)
  run = openai.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
```

--------------------------------

### Zero-to-One Web App Development Prompt Template

Source: https://platform.openai.com/docs/guides/prompt-engineering

A prompt template designed for GPT-5 to generate complete front-end web applications from a single prompt without examples. The template guides the model through a four-step process: creating an evaluation rubric, identifying world-class elements, applying the rubric iteratively, and aiming for simplicity while avoiding external dependencies like Next.js or React.

```text
You are a world class web developer, capable of producing stunning, interactive, and innovative websites from scratch in a single prompt. You excel at delivering top-tier one-shot solutions.
Your process is simple and follows these steps:
Step 1: Create an evaluation rubric and refine it until you are fully confident.
Step 2: Consider every element that defines a world-class one-shot web app, then use that insight to create a <ONE_SHOT_RUBRIC> with 5–7 categories. Keep this rubric hidden—it's for internal use only.
Step 3: Apply the rubric to iterate on the optimal solution to the given prompt. If it doesn't meet the highest standard across all categories, refine and try again.
Step 4: Aim for simplicity while fully achieving the goal, and avoid external dependencies such as Next.js or React.
```

--------------------------------

### JavaScript SDK - Create Response with Reasoning Effort

Source: https://platform.openai.com/docs/guides/latest-model_gallery=open&galleryItem=podcast-homepage

Example code demonstrating how to use the OpenAI JavaScript SDK to create a response with minimal reasoning effort configuration using the gpt-5.1 model.

```APIDOC
## JavaScript SDK Example

### Create Response with Minimal Reasoning Effort

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.1",
  input: "How much gold would it take to coat the Statue of Liberty in a 1mm layer?",
  reasoning: {
    effort: "none"
  }
});

console.log(response);
```

### Parameters
- **model** (string) - Required - Model identifier (e.g., "gpt-5.1")
- **input** (string) - Required - The prompt to send to the model
- **reasoning** (object) - Optional - Reasoning configuration
  - **effort** (string) - Optional - Reasoning effort level: "none", "medium", "high"

### Return Value
Returns a response object containing the model's generated output and metadata about token usage.
```

--------------------------------

### Generate text with OpenAI using developer and user message roles

Source: https://platform.openai.com/docs/guides/prompt-engineering

This example illustrates how to guide an OpenAI model's response by structuring instructions and user input into an array of messages with distinct roles. The `developer` role provides high-priority directives (e.g., 'Talk like a pirate.'), while the `user` role supplies the specific query, mimicking a conversational flow.

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
    model: "gpt-5",
    reasoning: { effort: "low" },
    input: [
        {
            role: "developer",
            content: "Talk like a pirate."
        },
        {
            role: "user",
            content: "Are semicolons optional in JavaScript?",
        },
    ],
});

console.log(response.output_text);
```

```python
from openai import OpenAI
client = OpenAI()

response = client.responses.create(
    model="gpt-5",
    reasoning={"effort": "low"},
    input=[
        {
            "role": "developer",
            "content": "Talk like a pirate."
        },
        {
            "role": "user",
            "content": "Are semicolons optional in JavaScript?"
        }
    ]
)

print(response.output_text)
```

```curl
curl "https://api.openai.com/v1/responses" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-5",
        "reasoning": {"effort": "low"},
        "input": [
            {
                "role": "developer",
                "content": "Talk like a pirate."
            },
            {
                "role": "user",
                "content": "Are semicolons optional in JavaScript?"
            }
        ]
    }'
```

--------------------------------

### JSON Example: Response Reasoning Summary Part Added Event

Source: https://platform.openai.com/docs/api-reference/responses-streaming/response/file_search_call

This JSON object represents an event emitted when a new reasoning summary part is initialized. It includes identifiers like 'item_id', 'output_index', 'summary_index', and a 'part' object with its type and an empty text field, signaling the start of a new summary part.

```json
{
  "type": "response.reasoning_summary_part.added",
  "item_id": "rs_6806bfca0b2481918a5748308061a2600d3ce51bdffd5476",
  "output_index": 0,
  "summary_index": 0,
  "part": {
    "type": "summary_text",
    "text": ""
  },
  "sequence_number": 1
}
```

--------------------------------

### Start Playwright Browser Instance - JavaScript

Source: https://platform.openai.com/docs/guides/tools-computer-use

Launches a sandboxed Chromium browser instance using Playwright in JavaScript. Configures security settings by disabling extensions and file system access, sets viewport size, navigates to a URL, and waits before closing. Prerequisites: Node.js and Playwright SDK installed via npm.

```javascript
import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: false,
  chromiumSandbox: true,
  env: {},
  args: ["--disable-extensions", "--disable-file-system"],
});
const page = await browser.newPage();
await page.setViewportSize({ width: 1024, height: 768 });
await page.goto("https://bing.com");

await page.waitForTimeout(10000);

browser.close();
```

--------------------------------

### Install OpenAI SDK with pip - Python

Source: https://platform.openai.com/docs/libraries

Install the official OpenAI SDK for Python using the pip package manager. This is the first step for setting up the OpenAI API in Python environments.

```bash
pip install openai
```

--------------------------------

### List Project Group Role Assignments with OpenAI API (curl)

Source: https://platform.openai.com/docs/api-reference/role-assignments/objects/user

This example shows how to retrieve a list of project roles assigned to a specific group within a project. It sends a GET request with `project_id` and `group_id` path parameters and supports pagination. Authentication is done via `OPENAI_ADMIN_KEY`.

```curl
curl https://api.openai.com/v1/projects/proj_abc123/groups/group_01J1F8ABCDXYZ/roles \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
```

```json
{
    "object": "list",
    "data": [
        {
            "id": "role_01J1F8PROJ",
            "name": "API Project Key Manager",
            "permissions": [
                "api.organization.projects.api_keys.read",
                "api.organization.projects.api_keys.write"
            ],
            "resource_type": "api.project",
            "predefined_role": false,
            "description": "Allows managing API keys for the project",
            "created_at": 1711471533,
            "updated_at": 1711472599,
            "created_by": "user_abc123",
            "created_by_user_obj": {
                "id": "user_abc123",
                "name": "Ada Lovelace",
                "email": "ada@example.com"
            },
            "metadata": {}
        }
    ],
    "has_more": false,
    "next": null
}
```

--------------------------------

### Create OpenAI Chat Completion Request

Source: https://platform.openai.com/docs/api-reference/chat/create

These code examples demonstrate how to send a request to the OpenAI chat completions API using various programming languages and cURL. Each example specifies the model and a list of messages to generate an AI response. The JavaScript example also shows how to enable storing the completion.

```curl
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.2",
    "messages": [
      {
        "role": "developer",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "Hello!"
      }
    ]
  }'
```

```python
from openai import OpenAI
client = OpenAI()

completion = client.chat.completions.create(
  model="gpt-5.2",
  messages=[
    {"role": "developer", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"}
  ]
)

print(completion.choices[0].message)
```

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "developer", content: "You are a helpful assistant." }],
    model: "gpt-5.2",
    store: true,
  });

  console.log(completion.choices[0]);
}

main();
```

```csharp
using System;
using System.Collections.Generic;

using OpenAI.Chat;

ChatClient client = new(
    model: "gpt-4.1",
    apiKey: Environment.GetEnvironmentVariable("OPENAI_API_KEY")
);

List<ChatMessage> messages =
[
    new SystemChatMessage("You are a helpful assistant."),
    new UserChatMessage("Hello!")
];

ChatCompletion completion = client.CompleteChat(messages);

Console.WriteLine(completion.Content[0].Text);
```

--------------------------------

### POST /responses - File Search Tool

Source: https://platform.openai.com/docs/quickstart

Create a response with file search capability to search through your custom documents and vector stores. This enables semantic search across uploaded files and knowledge bases.

```APIDOC
## POST /responses

### Description
Create a response with file search capability enabled. The model can search through specified vector stores to find relevant information from your documents.

### Method
POST

### Endpoint
https://api.openai.com/v1/responses

### Request Body
- **model** (string) - Required - The model to use for generating responses (e.g., "gpt-4.1")
- **input** (string) - Required - The user query or search question
- **tools** (array) - Required - Array of tools to attach to the model
  - **type** (string) - Required - Tool type: "file_search"
  - **vector_store_ids** (array) - Required - Array of vector store IDs to search

### Request Example
```json
{
  "model": "gpt-4.1",
  "input": "What is deep research by OpenAI?",
  "tools": [
    {
      "type": "file_search",
      "vector_store_ids": ["<vector_store_id>"]
    }
  ]
}
```

### Response
#### Success Response (200)
- **id** (string) - Response ID
- **output** (array) - Array of response content objects
- **model** (string) - The model used for the response

#### Response Example
```json
{
  "id": "response_123",
  "output": ["Response content with file search results"],
  "model": "gpt-4.1"
}
```
```

--------------------------------

### Create response with minimal reasoning effort using GPT-5.1

Source: https://platform.openai.com/docs/guides/gpt-5

Make an API request to OpenAI with the reasoning effort parameter set to 'none' for lower-latency interactions. This example demonstrates setting minimal reasoning effort when calling the responses endpoint with a complex reasoning question.

```bash
curl --request POST \
  --url https://api.openai.com/v1/responses \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header 'Content-type: application/json' \
  --data '{
        "model": "gpt-5.1",
        "input": "How much gold would it take to coat the Statue of Liberty in a 1mm layer?",
        "reasoning": {
                "effort": "none"
        }
}'
```

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.1",
  input: "How much gold would it take to coat the Statue of Liberty in a 1mm layer?",
  reasoning: {
    effort: "none"
  }
});

console.log(response);
```

```python
from openai import OpenAI
client = OpenAI()

response = client.responses.create(
    model="gpt-5.1",
    input="How much gold would it take to coat the Statue of Liberty in a 1mm layer?",
    reasoning={
        "effort": "none"
    }
)

print(response)
```

--------------------------------

### JavaScript Implementation - Multi-turn Image Generation

Source: https://platform.openai.com/docs/guides/image-generation_api=responses&gallery=open&galleryItem=colorize

Complete JavaScript example demonstrating how to generate an initial image and then refine it in a follow-up turn using the previous response ID.

```APIDOC
## JavaScript Implementation Example

### Initial Image Generation
```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5",
  input: "Generate an image of gray tabby cat hugging an otter with an orange scarf",
  tools: [{ type: "image_generation" }],
});

const imageData = response.output
  .filter((output) => output.type === "image_generation_call")
  .map((output) => output.result);

if (imageData.length > 0) {
  const imageBase64 = imageData[0];
  const fs = await import("fs");
  fs.writeFileSync("cat_and_otter.png", Buffer.from(imageBase64, "base64"));
}
```

### Follow-up Refinement (Multi-turn)
```javascript
const response_fwup = await openai.responses.create({
  model: "gpt-5",
  previous_response_id: response.id,
  input: "Now make it look realistic",
  tools: [{ type: "image_generation" }],
});

const imageData_fwup = response_fwup.output
  .filter((output) => output.type === "image_generation_call")
  .map((output) => output.result);

if (imageData_fwup.length > 0) {
  const imageBase64 = imageData_fwup[0];
  const fs = await import("fs");
  fs.writeFileSync(
    "cat_and_otter_realistic.png",
    Buffer.from(imageBase64, "base64")
  );
}
```

### Key Steps
1. Create initial response with image generation tool enabled
2. Filter output to find image_generation_call type results
3. Extract base64 image data and save to file
4. For follow-up, use the `previous_response_id` from first response
5. Process follow-up response the same way to get refined image
```

--------------------------------

### Markdown Prompt for News Headline Categorization

Source: https://platform.openai.com/docs/api-reference/evals/getRuns

This detailed Markdown prompt guides an OpenAI model to categorize news headlines into specific topics. It outlines a four-step analysis process, specifies the single-word output format with illustrative examples, and provides notes for resolving ambiguity by prioritizing the most dominant theme and using keywords for classification.

```markdown
Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n
```

--------------------------------

### Call Remote MCP Server with Python SDK

Source: https://platform.openai.com/docs/quickstart_api-mode=chat

Use the OpenAI Python SDK to interact with a remote MCP server. Configures MCP tool with server details and processes the response output.

```Python
from openai import OpenAI

client = OpenAI()

resp = client.responses.create(
    model="gpt-5",
    tools=[
        {
            "type": "mcp",
            "server_label": "dmcp",
            "server_description": "A Dungeons and Dragons MCP server to assist with dice rolling.",
            "server_url": "https://dmcp-server.deno.dev/sse",
            "require_approval": "never",
        },
    ],
    input="Roll 2d4+1",
)

print(resp.output_text)
```

--------------------------------

### Python Implementation - Multi-turn Image Generation

Source: https://platform.openai.com/docs/guides/image-generation_api=responses&gallery=open&galleryItem=colorize

Complete Python example showing how to generate images and refine them across multiple turns using the OpenAI Python client library.

```APIDOC
## Python Implementation Example

### Initial Image Generation
```python
from openai import OpenAI
import base64

client = OpenAI()

response = client.responses.create(
    model="gpt-5",
    input="Generate an image of gray tabby cat hugging an otter with an orange scarf",
    tools=[{"type": "image_generation"}],
)

image_data = [
    output.result
    for output in response.output
    if output.type == "image_generation_call"
]

if image_data:
    image_base64 = image_data[0]
    with open("cat_and_otter.png", "wb") as f:
        f.write(base64.b64decode(image_base64))
```

### Follow-up Refinement (Multi-turn)
```python
response_fwup = client.responses.create(
    model="gpt-5",
    previous_response_id=response.id,
    input="Now make it look realistic",
    tools=[{"type": "image_generation"}],
)

image_data_fwup = [
    output.result
    for output in response_fwup.output
    if output.type == "image_generation_call"
]

if image_data_fwup:
    image_base64 = image_data_fwup[0]
    with open("cat_and_otter_realistic.png", "wb") as f:
        f.write(base64.b64decode(image_base64))
```

### Key Steps
1. Initialize OpenAI client
2. Create initial response with image_generation tool
3. Filter output list to find image_generation_call entries
4. Decode base64 image data and save to PNG file
5. For refinement, pass `previous_response_id` to create multi-turn conversation
6. Repeat filtering and saving process for refined image
```

--------------------------------

### Retrieve Fine-tuned Model Checkpoint Permissions (cURL)

Source: https://platform.openai.com/docs/api-reference/fine-tuning/preference-input

This example demonstrates how to retrieve a list of permissions for a specific fine-tuned model checkpoint using a GET request. It supports pagination parameters like `after`, `limit`, and `order`, and requires an OpenAI API key for authorization. The response provides a list of permission objects including their ID and associated project ID.

```curl
curl https://api.openai.com/v1/fine_tuning/checkpoints/ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd/permissions \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

```json
{
  "object": "list",
  "data": [
    {
      "object": "checkpoint.permission",
      "id": "cp_zc4Q7MP6XxulcVzj4MZdwsAB",
      "created_at": 1721764867,
      "project_id": "proj_abGMw1llN8IrBb6SvvY5A1iH"
    },
    {
      "object": "checkpoint.permission",
      "id": "cp_enQCFmOTGj3syEpYVhBRLTSy",
      "created_at": 1721764800,
      "project_id": "proj_iqGMw1llN8IrBb6SvvY5A1oF"
    }
  ],
  "first_id": "cp_zc4Q7MP6XxulcVzj4MZdwsAB",
  "last_id": "cp_enQCFmOTGj3syEpYVhBRLTSy",
  "has_more": false
}
```

--------------------------------

### API Selection Guide and Customization Options

Source: https://platform.openai.com/docs/guides/image-generation_gallery=open&galleryItem=game-design

Guide for choosing between the Image API and Responses API based on your use case, along with available customization options for image output including quality, size, format, compression, and transparency settings.

```APIDOC
# API Selection Guide and Output Customization

## Choosing the Right API

### Use the Image API When:
- You only need to generate or edit a single image from one prompt
- You want the simplest, most direct approach to image generation
- You're building simple image generation features without conversation flow
- You need fast, straightforward API responses

**Best for**: One-shot image generation tasks, simple editing workflows, batch image processing

### Use the Responses API When:
- You want to build conversational, editable image experiences with GPT Image
- You need multi-turn image editing with iterative refinements
- You're building interactive applications with chat-based interfaces
- You want to maintain context across multiple image generation and editing steps
- You need to accept image File IDs as inputs

**Best for**: Interactive image editing tools, conversational AI applications, complex creative workflows, multi-step image refinement

## Output Customization Options

Both APIs allow you to customize image output through the following parameters:

### Quality Settings
- **quality** parameter controls the fidelity and detail level
- Options: "standard", "high"
- Higher quality produces more detailed images but may increase processing time
- Default: "standard"

**Example:**
```json
{
  "prompt": "Generate an image",
  "quality": "high"
}
```

### Size Options
- **size** parameter controls output dimensions
- Common options: "1024x1024", "1024x1536", "512x512"
- Square formats (1024x1024) generally process faster
- Rectangular formats (1024x1536) useful for posters and portrait-oriented content
- Different models support different size options

**Example:**
```json
{
  "prompt": "Generate a poster image",
  "size": "1024x1536"
}
```

### Format Options
- **format** parameter specifies output image format
- Options: "url", "b64_json"
- "url" - Returns publicly accessible URL (expires after 1 hour)
- "b64_json" - Returns base64 encoded image data for direct embedding

**Example:**
```json
{
  "prompt": "Generate an image",
  "format": "b64_json"
}
```

### Compression Settings
- Control file size and processing efficiency
- Available through quality and format parameters
- Lower quality and URL format generally result in smaller file sizes

### Transparent Backgrounds
- **background** parameter enables transparent backgrounds
- Supported models: gpt-image-1.5, gpt-image-1
- Useful for product images and design assets
- Output format must support transparency (PNG)

**Example:**
```json
{
  "prompt": "A sneaker design made of recycled plastic bags",
  "background": "transparent"
}
```

## Complete Customization Example

### Image API with Full Customization
```json
{
  "prompt": "Design a sneaker reimagined as if made from concrete. Be creative with shapes and materials.",
  "model": "gpt-image-1.5",
  "quality": "high",
  "size": "1024x1024",
  "format": "b64_json",
  "background": "transparent",
  "style": "professional design concept"
}
```

### Responses API with Customization
```json
{
  "model": "gpt-4-turbo",
  "messages": [
    {
      "role": "user",
      "content": "Design a sneaker made from inflatable air balloons. Be creative!"
    }
  ],
  "tools": [
    {
      "type": "image_generation",
      "parameters": {
        "quality": "high",
        "size": "1024x1024",
        "format": "url",
        "background": "transparent"
      }
    }
  ]
}
```

## Rate Limiting and Quotas

### Image API Rate Limits
- Default: 50 images per minute for paid users
- Varies based on account tier and usage patterns
- Returns 429 status code when limit exceeded

### Responses API Rate Limits
- Subject to underlying model rate limits
- Tool calls count toward model token quotas
- Implement exponential backoff for retry logic

### Best Practices
- Implement retry logic with exponential backoff
- Cache generated images when possible
- Monitor usage and adjust batch sizes accordingly
- Use appropriate size and quality settings based on requirements
```

--------------------------------

### News Headline Classification Prompt Template

Source: https://platform.openai.com/docs/api-reference/evals/createRun

A prompt template for classifying news headlines into predefined categories (Technology, Markets, World, Business, or Sports). The template includes step-by-step instructions, output format specifications, and example classifications to guide the AI model in making accurate categorizations based on headline content analysis.

```text
Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.

# Steps

1. Analyze the content of the news headline to understand its primary focus.
2. Extract the subject matter, identifying any key indicators or keywords.
3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.
4. Ensure only one category is selected per headline.

# Output Format

Respond with the chosen category as a single word. For instance: "Technology", "Markets", "World", "Business", or "Sports".

# Examples

**Input**: "Apple Unveils New iPhone Model, Featuring Advanced AI Features"
**Output**: "Technology"

**Input**: "Global Stocks Mixed as Investors Await Central Bank Decisions"
**Output**: "Markets"

**Input**: "War in Ukraine: Latest Updates on Negotiation Status"
**Output**: "World"

**Input**: "Microsoft in Talks to Acquire Gaming Company for $2 Billion"
**Output**: "Business"

**Input**: "Manchester United Secures Win in Premier League Football Match"
**Output**: "Sports"

# Notes

- If the headline appears to fit into more than one category, choose the most dominant theme.
- Keywords or phrases such as "stocks", "company acquisition", "match", or technological brands can be good indicators for classification.
```

--------------------------------

### Handle User Chat Messages with OpenAI APIs (Python)

Source: https://platform.openai.com/docs/assistants/whats-new

These Python code snippets demonstrate how to process incoming user messages in a chat application using either the OpenAI Assistants API or the Responses API. Each example shows the core logic for sending user input, waiting for AI processing, and retrieving the generated response from the respective OpenAI service.

```python
thread = openai.threads.create()

@app.post("/messages")
async def message(message: Message):
    openai.beta.threads.messages.create(
        role="user",
        content=message.content
    )

    run = openai.beta.threads.runs.create(
        assistant_id=os.getenv("ASSISTANT_ID"),
        thread_id=thread.id
    )
    while run.status in ("queued", "in_progress"):
        await asyncio.sleep(1)
        run = openai.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)

    messages = openai.beta.threads.messages.list(
        order="desc", limit=1, thread_id=thread.id
    )

    return { "content": messages[-1].content }
```

```python
conversation = openai.conversations.create()

@app.post("/messages")
async def message(message: Message):
    response = openai.responses.create(
        prompt={ "id": os.getenv("PROMPT_ID") },
        input=[{ "role": "user", "content": message.content }]
    )

    return { "content": response.output_text }
```

--------------------------------

### Calling OpenAI API to Generate Instructions (Python)

Source: https://platform.openai.com/docs/guides/deep-research

This Python snippet demonstrates how to interact with an OpenAI model using the `client.responses.create` method. It passes a user's `input_text` and a predefined `instructions` string to guide the model's response, then prints the generated output. This is an example of using the model to create instructions for a research task rather than performing the task directly.

```python
input_text = "Research surfboards for me. I'm interested in ..."

response = client.responses.create(
    model="gpt-4.1",
    input=input_text,
    instructions=instructions,
)

print(response.output_text)
```

--------------------------------

### POST /v1/responses - Create Response with MCP Server Tools

Source: https://platform.openai.com/docs/quickstart

Creates an OpenAI response with Model Context Protocol (MCP) server integration. This endpoint enables the model to interact with external MCP servers to access specialized functionality and data sources. The example shows integration with a Dungeons and Dragons MCP server for dice rolling.

```APIDOC
## POST /v1/responses

### Description
Creates a response from the OpenAI API with support for Model Context Protocol (MCP) servers. The model can interact with remote MCP servers to access specialized tools and data.

### Method
POST

### Endpoint
https://api.openai.com/v1/responses

### Parameters

#### Request Headers
- **Authorization** (string) - Required - Bearer token for authentication: `Bearer $OPENAI_API_KEY`
- **Content-Type** (string) - Required - Must be `application/json`

#### Request Body
- **model** (string) - Required - Model identifier, e.g., "gpt-5"
- **input** (string) - Required - User input/prompt
- **tools** (array) - Required - Array of tool definitions
- **tools[].type** (string) - Required - Must be "mcp" for MCP server tools
- **tools[].server_label** (string) - Required - Label identifier for the MCP server
- **tools[].server_description** (string) - Required - Description of the MCP server capabilities
- **tools[].server_url** (string) - Required - SSE endpoint URL of the MCP server
- **tools[].require_approval** (string) - Optional - Approval policy: "never", "always", or "on_use" (default: "on_use")

### Request Example
```json
{
  "model": "gpt-5",
  "tools": [
    {
      "type": "mcp",
      "server_label": "dmcp",
      "server_description": "A Dungeons and Dragons MCP server to assist with dice rolling.",
      "server_url": "https://dmcp-server.deno.dev/sse",
      "require_approval": "never"
    }
  ],
  "input": "Roll 2d4+1"
}
```

### Response

#### Success Response (200)
- **id** (string) - Unique identifier for the response
- **object** (string) - Object type identifier
- **created** (integer) - Unix timestamp of response creation
- **model** (string) - Model used for the response
- **output_text** (string) - Text output from the model

#### Response Example
```json
{
  "id": "resp_456",
  "object": "response",
  "created": 1234567890,
  "model": "gpt-5",
  "output_text": "I rolled 2d4+1 for you: [3, 2] + 1 = 6"
}
```

### JavaScript Example
```javascript
import OpenAI from "openai";
const client = new OpenAI();

const resp = await client.responses.create({
  model: "gpt-5",
  tools: [
    {
      type: "mcp",
      server_label: "dmcp",
      server_description: "A Dungeons and Dragons MCP server to assist with dice rolling.",
      server_url: "https://dmcp-server.deno.dev/sse",
      require_approval: "never",
    },
  ],
  input: "Roll 2d4+1",
});

console.log(resp.output_text);
```

### Python Example
```python
from openai import OpenAI

client = OpenAI()

resp = client.responses.create(
    model="gpt-5",
    tools=[
        {
            "type": "mcp",
            "server_label": "dmcp",
            "server_description": "A Dungeons and Dragons MCP server to assist with dice rolling.",
            "server_url": "https://dmcp-server.deno.dev/sse",
            "require_approval": "never",
        },
    ],
    input="Roll 2d4+1",
)

print(resp.output_text)
```

### C# Example
```csharp
using OpenAI.Responses;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
OpenAIResponseClient client = new(model: "gpt-5", apiKey: key);

ResponseCreationOptions options = new();
options.Tools.Add(ResponseTool.CreateMcpTool(
    serverLabel: "dmcp",
    serverUri: new Uri("https://dmcp-server.deno.dev/sse"),
    toolCallApprovalPolicy: new McpToolCallApprovalPolicy(GlobalMcpToolCallApprovalPolicy.NeverRequireApproval)
));

OpenAIResponse response = (OpenAIResponse)client.CreateResponse([
    ResponseItem.CreateUserMessageItem([
        ResponseContentPart.CreateInputTextPart("Roll 2d4+1")
    ])
], options);

Console.WriteLine(response.GetOutputText());
```
```

--------------------------------

### Upload File and Query with cURL

Source: https://platform.openai.com/docs/quickstart_api-mode=responses

Shows how to upload a file to OpenAI API using cURL and then create a response request using the uploaded file ID. This demonstrates the REST API approach with Bearer token authentication and multipart form data for file upload.

```shell
curl https://api.openai.com/v1/files \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F purpose="user_data" \
    -F file="@draconomicon.pdf"

curl "https://api.openai.com/v1/responses" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-5",
        "input": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_file",
                        "file_id": "file-6F2ksmvXxt4VdoqmHRw6kL"
                    },
                    {
                        "type": "input_text",
                        "text": "What is the first dragon in the book?"
                    }
                ]
            }
        ]
    }'
```

--------------------------------

### API Selection Guide

Source: https://platform.openai.com/docs/guides/image-generation_gallery=open&galleryItem=cosmic-ballet

This guide helps you choose between the Image API and Responses API based on your specific use case and requirements. Consider the complexity of your workflow and whether you need conversational interactions.

```APIDOC
## API Selection Guide

### Use Image API When:
- You only need to generate a single image from one prompt
- You need simple one-time image editing or variation
- Your workflow doesn't require conversational context
- You want straightforward, direct image manipulation

### Use Responses API When:
- You want to build conversational, editable image experiences
- You need to iteratively refine images through multiple steps
- Your application involves multi-turn user interactions
- You need to maintain context across multiple image generations
- You want to accept image File IDs as inputs

### Shared Customization Options
Both APIs support the following output customizations:
- Quality adjustment
- Size modification
- Format selection
- Compression settings
- Transparent background enablement
```

--------------------------------

### C# - Create Response with Google Calendar

Source: https://platform.openai.com/docs/guides/tools-remote-mcp

Example implementation using the OpenAI .NET SDK to create a response with Google Calendar connector authorization.

```APIDOC
## C# / .NET Implementation

### Description
Use the OpenAI .NET SDK to create a response with an authorized Google Calendar connector.

### Code Example
```csharp
using OpenAI.Responses;

string authToken = Environment.GetEnvironmentVariable("GOOGLE_CALENDAR_OAUTH_ACCESS_TOKEN")!;
string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
OpenAIResponseClient client = new(model: "gpt-5", apiKey: key);

ResponseCreationOptions options = new();
options.Tools.Add(ResponseTool.CreateMcpTool(
    serverLabel: "google_calendar",
    connectorId: McpToolConnectorId.GoogleCalendar,
    authorizationToken: authToken,
    toolCallApprovalPolicy: new McpToolCallApprovalPolicy(GlobalMcpToolCallApprovalPolicy.NeverRequireApproval)
));

OpenAIResponse response = (OpenAIResponse)client.CreateResponse([
    ResponseItem.CreateUserMessageItem([
        ResponseContentPart.CreateInputTextPart("What's on my Google Calendar for today?")
    ])
], options);

Console.WriteLine(response.GetOutputText());
```

### Required Namespaces
- **OpenAI.Responses** - OpenAI SDK namespace

### Configuration
- **GOOGLE_CALENDAR_OAUTH_ACCESS_TOKEN** - Environment variable for OAuth token
- **OPENAI_API_KEY** - Environment variable for API key

### Parameters
- **model** (string) - Model to use ("gpt-5")
- **serverLabel** (string) - Connector server label
- **connectorId** (McpToolConnectorId) - Connector type identifier
- **authorizationToken** (string) - OAuth access token
- **toolCallApprovalPolicy** (McpToolCallApprovalPolicy) - Approval configuration

### Output
- **response.GetOutputText()** (string) - Response text output
```

--------------------------------

### Create OpenAI Conversation Object (Responses API)

Source: https://platform.openai.com/docs/assistants/migration

Shows how to create a new conversation object using the new OpenAI Responses API. Conversations are a more flexible replacement for threads, capable of storing various items like messages, tool calls, and outputs. This example initiates a conversation with a user message and metadata.

```python
conversation = openai.conversations.create(
  items=[{"role": "user", "content": "what are the 5 Ds of dodgeball?"}],
  metadata={"user_id": "peter_le_fleur"},
)
```

--------------------------------

### Create OpenAI Response with Python

Source: https://platform.openai.com/docs/overview

Use the OpenAI Python client library to generate a text response from the GPT-5.2 model. The client is instantiated with default configuration and the responses.create() method is called with the model and input parameters. Outputs the result to the console.

```python
from openai import OpenAI
client = OpenAI()

response = client.responses.create(
    model="gpt-5.2",
    input="Write a short bedtime story about a unicorn."
)

print(response.output_text)
```

--------------------------------

### Create OpenAI Eval Run for News Headline Categorization

Source: https://platform.openai.com/docs/api-reference/evals/create

These code examples demonstrate how to create an OpenAI evaluation run for a news headline categorization task. They configure the `gpt-4o-mini` model with a detailed prompt template that guides the model to classify headlines into specific topics (Technology, Markets, World, Business, Sports). The evaluation uses a completions data source with defined input messages and sampling parameters.

```curl
curl https://api.openai.com/v1/evals/eval_67e579652b548190aaa83ada4b125f47/runs \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"gpt-4o-mini","data_source":{"type":"completions","input_messages":{"type":"template","template":[{"role":"developer","content":"Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output**: \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n"} , {"role":"user","content":"{{item.input}}"}]} ,"sampling_params":{"temperature":1,"max_completions_tokens":2048,"top_p":1,"seed":42},"model":"gpt-4o-mini","source":{"type":"file_content","content":[{"item":{"input":"Tech Company Launches Advanced Artificial Intelligence Platform","ground_truth":"Technology"}}]}}'
```

```python
from openai import OpenAI
client = OpenAI()

run = client.evals.runs.create(
  "eval_67e579652b548190aaa83ada4b125f47",
  name="gpt-4o-mini",
  data_source={
    "type": "completions",
    "input_messages": {
      "type": "template",
      "template": [
        {
          "role": "developer",
          "content": "Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output**: \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n"
        },
        {
          "role": "user",
          "content": "{{item.input}}"
        }
      ]
    },
    "sampling_params": {
      "temperature": 1,
      "max_completions_tokens": 2048,
      "top_p": 1,
      "seed": 42
    },
    "model": "gpt-4o-mini",
    "source": {
      "type": "file_content",
      "content": [
        {
          "item": {
            "input": "Tech Company Launches Advanced Artificial Intelligence Platform",
            "ground_truth": "Technology"
          }
        }
      ]
    }
  }
)
print(run)
```

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const run = await openai.evals.runs.create(
  "eval_67e579652b548190aaa83ada4b125f47",
  {
    name: "gpt-4o-mini",
    data_source: {
      type: "completions",
      input_messages: {
```

--------------------------------

### Retrieve Specific Batch Details from OpenAI API

Source: https://platform.openai.com/docs/api-reference/batch/object

This example illustrates how to retrieve the current status and details of a specific batch by its unique ID. A GET request is sent to the OpenAI API with the `batch_id` as a path parameter. The response provides comprehensive information about the batch's progress, status, and associated file IDs.

```curl
curl https://api.openai.com/v1/batches/batch_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
```

```python
from openai import OpenAI
client = OpenAI()

client.batches.retrieve("batch_abc123")
```

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const batch = await openai.batches.retrieve("batch_abc123");

  console.log(batch);
}

main();
```

--------------------------------

### LLM Instructions for Handling Unclear Audio Input

Source: https://platform.openai.com/docs/guides/realtime-models-prompting

This comprehensive set of instructions guides an LLM on how to manage and respond when user audio input is unclear, ambiguous, or noisy. It includes rules for language consistency, default language, and provides sample clarification phrases to prompt the user for repetition.

```Prompt
## Unclear audio
- Always respond in the same language the user is speaking in, if intelligible.
- Default to English if the input language is unclear.
- Only respond to clear audio or text.
- If the user's audio is not clear (e.g., ambiguous input/background noise/silent/unintelligible) or if you did not fully hear or understand the user, ask for clarification using {preferred_language} phrases.

Sample clarification phrases (parameterize with {preferred_language}):

- “Sorry, I didn’t catch that—could you say it again?”
- “There’s some background noise. Please repeat the last part.”
- “I only heard part of that. What did you say after ___?”
```

--------------------------------

### OpenAI API: Example Run Object JSON Response

Source: https://platform.openai.com/docs/assistants/overview

This JSON snippet illustrates the structure of a Run object returned by the OpenAI API. It includes fields such as `id`, `status`, `created_at`, `completed_at`, `model`, `thread_id`, and `usage` details. This object represents the lifecycle and outcome of an assistant's execution.

```json
{
"id": "run_FKIpcs5ECSwuCmehBqsqkORj",
"assistant_id": "asst_8fVY45hU3IM6creFkVi5MBKB",
"cancelled_at": null,
"completed_at": 1752857327,
"created_at": 1752857322,
"expires_at": null,
"failed_at": null,
"incomplete_details": null,
"instructions": null,
"last_error": null,
"max_completion_tokens": null,
"max_prompt_tokens": null,
"metadata": {},
"model": "gpt-4.1",
"object": "thread.run",
"parallel_tool_calls": true,
"required_action": null,
"response_format": "auto",
"started_at": 1752857324,
"status": "completed",
"thread_id": "thread_CrXtCzcyEQbkAcXuNmVSKFs1",
"tool_choice": "auto",
"tools": [],
"truncation_strategy": {
  "type": "auto",
  "last_messages": null
},
"usage": {
  "completion_tokens": 130,
  "prompt_tokens": 34,
  "total_tokens": 164,
  "prompt_token_details": {
    "cached_tokens": 0
  },
  "completion_tokens_details": {
    "reasoning_tokens": 0
  }
},
"temperature": 1.0,
"top_p": 1.0,
"tool_resources": {},
"reasoning_effort": null
}
```

--------------------------------

### Few-Shot Prompt for Icelandic Sentence Correction with GPT-4

Source: https://platform.openai.com/docs/guides/optimizing-llm-accuracy

This structured prompt provides a few-shot learning example for a GPT model to correct Icelandic sentences. It includes a system instruction defining the task, followed by three pairs of incorrect and corrected Icelandic sentences, and a placeholder for a new user input. This approach aims to guide the model's output style and accuracy by demonstrating desired behavior.

```Prompt
SYSTEM
The following sentences contain Icelandic sentences which may include errors. Please correct these errors using as few word changes as possible. # Examples
USER
"Stofnendurnir séu margir og eru fulltrúar hennar frá Englandi, Grikklandi, Rússlandi, Svíþjóð og fleiri löndum Evrópu."
ASSISTANT
"Hann segir að stofnendur leynireglunnar séu margir og að fulltrúar hennar séu frá Englandi, Grikklandi, Rússlandi, Svíþjóð og fleiri löndum Evrópu."
USER
"Helsta fæða bjúgorma eru hægfara lífverur sem eru á sama búsvæði og bjúgormarnir, oft smærri ormar eins og burstormar (fræðiheiti: Polychatete)."
ASSISTANT
"Helsta fæða bjúgorma eru hægfara lífverur sem eru á sama búsvæði og bjúgormarnir, oft smærri ormar eins og burstaormar (fræðiheiti: Polychatete)."
USER
"Sörvistölur eru nær hálsi og skartgripir kvenna á brjótsti."
ASSISTANT
"Sörvistölur eru nær hálsi og skartgripir kvenna á brjósti."
USER
[input user query here]
```

--------------------------------

### Retrieve Organization Admin API Key by ID (cURL)

Source: https://platform.openai.com/docs/api-reference/admin-api-keys/object

This cURL example shows how to retrieve detailed information for a specific organization Admin API key. It uses a GET request to the endpoint, providing the `key_id` in the URL path. An authenticated Admin API key is required, and the response contains the AdminApiKey object with its details.

```curl
curl https://api.openai.com/v1/organization/admin_api_keys/key_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
```

--------------------------------

### Call Remote MCP Server with OpenAI SDK

Source: https://platform.openai.com/docs/quickstart_api-mode=chat

Use the OpenAI JavaScript SDK to connect to a remote MCP server for specialized operations. Creates a response with MCP tool configuration and outputs the response text.

```JavaScript
import OpenAI from "openai";
const client = new OpenAI();

const resp = await client.responses.create({
  model: "gpt-5",
  tools: [
    {
      type: "mcp",
      server_label: "dmcp",
      server_description: "A Dungeons and Dragons MCP server to assist with dice rolling.",
      server_url: "https://dmcp-server.deno.dev/sse",
      require_approval: "never",
    },
  ],
  input: "Roll 2d4+1",
});

console.log(resp.output_text);
```

--------------------------------

### Create OpenAI EvalRun with Custom Prompt

Source: https://platform.openai.com/docs/api-reference/evals/deleteRun

These examples demonstrate how to create an OpenAI EvalRun, configuring it to categorize news headlines into predefined topics. The run specifies a 'gpt-4o-mini' model, a detailed 'developer' prompt template for categorization rules and examples, and an initial dataset for evaluation. The 'data_source' is set for completions with specific 'sampling_params' and 'file_content'.

```curl
curl https://api.openai.com/v1/evals/eval_67e579652b548190aaa83ada4b125f47/runs \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"gpt-4o-mini","data_source":{"type":"completions","input_messages":{"type":"template","template":[{"role":"developer","content":"Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output**: \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n"} , {"role":"user","content":"{{item.input}}"}]} ,"sampling_params":{"temperature":1,"max_completions_tokens":2048,"top_p":1,"seed":42},"model":"gpt-4o-mini","source":{"type":"file_content","content":[{"item":{"input":"Tech Company Launches Advanced Artificial Intelligence Platform","ground_truth":"Technology"}}]}}}'
```

```python
from openai import OpenAI
client = OpenAI()

run = client.evals.runs.create(
  "eval_67e579652b548190aaa83ada4b125f47",
  name="gpt-4o-mini",
  data_source={
    "type": "completions",
    "input_messages": {
      "type": "template",
      "template": [
        {
          "role": "developer",
          "content": "Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output**: \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n"
        },
        {
          "role": "user",
          "content": "{{item.input}}"
        }
      ]
    },
    "sampling_params": {
      "temperature": 1,
      "max_completions_tokens": 2048,
      "top_p": 1,
      "seed": 42
    },
    "model": "gpt-4o-mini",
    "source": {
      "type": "file_content",
      "content": [
        {
          "item": {
            "input": "Tech Company Launches Advanced Artificial Intelligence Platform",
            "ground_truth": "Technology"
          }
        }
      ]
    }
  }
)
print(run)
```

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const run = await openai.evals.runs.create(
  "eval_67e579652b548190aaa83ada4b125f47",
  {
    name: "gpt-4o-mini",
    data_source: {
      type: "completions",
      input_messages: {
```

--------------------------------

### OpenAI API: Example Response Object JSON Structure

Source: https://platform.openai.com/docs/assistants/overview

This JSON snippet demonstrates the structure of a Response object from the OpenAI API, detailing the output of a conversation. It contains the `id`, `created_at`, `conversation` details, `model`, and the `output` array which holds the actual assistant messages, including text content and usage statistics.

```json
{
"id": "resp_687a7b53036c819baad6012d58b39bcb074adcd9e24850fc",
"created_at": 1752857427,
"conversation": {
  "id": "conv_689667905b048191b4740501625afd940c7533ace33a2dab"
},
"error": null,
"incomplete_details": null,
"instructions": null,
"metadata": {},
"model": "gpt-4.1-2025-04-14",
"object": "response",
"output": [
  {
    "id": "msg_687a7b542948819ba79e77e14791ef83074adcd9e24850fc",
    "content": [
      {
        "annotations": [],
        "text": "The \"5 Ds of Dodgeball\" are a humorous set of rules made famous by the 2004 comedy film **\"Dodgeball: A True Underdog Story.\"** In the movie, dodgeball coach Patches O’Houlihan teaches these basics to his team. The **5 Ds** are:\n\n1. **Dodge**\n2. **Duck**\n3. **Dip**\n4. **Dive**\n5. **Dodge** (yes, dodge is listed twice for emphasis!)\n\nIn summary:  \n> **“If you can dodge a wrench, you can dodge a ball!”**\n\nThese 5 Ds are not official competitive rules, but have become a fun and memorable pop culture reference for the sport of dodgeball.",
        "type": "output_text",
        "logprobs": []
      }
    ],
    "role": "assistant",
    "status": "completed",
    "type": "message"
  }
],
"parallel_tool_calls": true,
"temperature": 1.0,
"tool_choice": "auto",
"tools": [],
"top_p": 1.0,
"background": false,
"max_output_tokens": null,
"previous_response_id": null,
"reasoning": {
  "effort": null,
  "generate_summary": null,
  "summary": null
},
"service_tier": "scale",
"status": "completed",
"text": {
  "format": {
    "type": "text"
  }
},
"truncation": "disabled",
"usage": {
  "input_tokens": 17,
  "input_tokens_details": {
    "cached_tokens": 0
  },
  "output_tokens": 150,
  "output_tokens_details": {
    "reasoning_tokens": 0
  },
  "total_tokens": 167
},
"user": null,
"max_tool_calls": null,
"store": true,
"top_logprobs": 0
}
```

--------------------------------

### Test Basic API Request - Python

Source: https://platform.openai.com/docs/libraries

Create and execute a simple API request using the OpenAI SDK in Python. This example demonstrates how to initialize the client, call the Responses API with a model and input, and print the output.

```python
from openai import OpenAI
client = OpenAI()

response = client.responses.create(
    model="gpt-5-nano",
    input="Write a one-sentence bedtime story about a unicorn."
)

print(response.output_text)
```

--------------------------------

### POST /v1/assistants

Source: https://platform.openai.com/docs/api-reference/assistants

Create an assistant with a model and instructions.

```APIDOC
## POST /v1/assistants\n\n### Description\nCreate an assistant with a model and instructions.\n\n### Method\nPOST\n\n### Endpoint\nhttps://api.openai.com/v1/assistants\n\n### Parameters\n#### Request Body\n- **model** (string) - Required - ID of the model to use. You can use the List models API to see all of your available models, or see our Model overview for descriptions of them.\n- **description** (string) - Optional - The description of the assistant. The maximum length is 512 characters.\n- **instructions** (string) - Optional - The system instructions that the assistant uses. The maximum length is 256,000 characters.\n- **metadata** (map) - Optional - Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format, and querying for objects via API or the dashboard. Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters.\n- **name** (string) - Optional - The name of the assistant. The maximum length is 256 characters.\n- **reasoning_effort** (string) - Optional - Defaults to medium - Constrains effort on reasoning for reasoning models. Currently supported values are `none`, `minimal`, `low`, `medium`, `high`, and `xhigh`. Reducing reasoning effort can result in faster responses and fewer tokens used on reasoning in a response.\n    - `gpt-5.1` defaults to `none`, which does not perform reasoning. The supported reasoning values for `gpt-5.1` are `none`, `low`, `medium`, and `high`. Tool calls are supported for all reasoning values in gpt-5.1.\n    - All models before `gpt-5.1` default to `medium` reasoning effort, and do not support `none`.\n    - The `gpt-5-pro` model defaults to (and only supports) `high` reasoning effort.\n    - `xhigh` is supported for all models after `gpt-5.1-codex-max`.\n- **response_format** ("auto" or object) - Optional - Specifies the format that the model must output. Compatible with GPT-4o, GPT-4 Turbo, and all GPT-3.5 Turbo models since `gpt-3.5-turbo-1106`. Setting to `{ \"type\": \"json_schema\", \"json_schema\": {...} }` enables Structured Outputs which ensures the model will match your supplied JSON schema. Learn more in the Structured Outputs guide. Setting to `{ \"type\": \"json_object\" }` enables JSON mode, which ensures the message the model generates is valid JSON. **Important:** when using JSON mode, you **must** also instruct the model to produce JSON yourself via a system or user message. Without this, the model may generate an unending stream of whitespace until the generation reaches the token limit, resulting in a long-running and seemingly "stuck" request. Also note that the message content may be partially cut off if `finish_reason=\"length\"`, which indicates the generation exceeded `max_tokens` or the conversation exceeded the max context length.\n- **temperature** (number) - Optional - Defaults to 1 - What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.\n- **tool_resources** (object) - Optional - A set of resources that are used by the assistant's tools. The resources are specific to the type of tool. For example, the `code_interpreter` tool requires a list of file IDs, while the `file_search` tool requires a list of vector store IDs.\n- **tools** (array) - Optional - Defaults to [] - A list of tool enabled on the assistant. There can be a maximum of 128 tools per assistant. Tools can be of types `code_interpreter`, `file_search`, or `function`.\n- **top_p** (number) - Optional - Defaults to 1 - An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both.
```

--------------------------------

### Example: Eval Run Output Item Object

Source: https://platform.openai.com/docs/api-reference/evals/getRun

An example JSON payload representing a typical evaluation run output item, showcasing its structure and data as returned by an API.

```APIDOC
## Example: Retrieve Eval Run Output Item

### Description
This provides a concrete example of the `eval.run.output_item` object, demonstrating its typical fields and their values after an evaluation run. This object would be returned by an API call to retrieve a specific output item.

### Method
GET (Corresponding to the conceptual GET endpoint)

### Endpoint
/eval/runs/{run_id}/output_items/{id} (Example assumes retrieval)

### Response
#### Success Response (200)
(Structure defined in the schema documentation)

#### Response Example
```json
{
  "object": "eval.run.output_item",
  "id": "outputitem_67abd55eb6548190bb580745d5644a33",
  "run_id": "evalrun_67abd54d60ec8190832b46859da808f7",
  "eval_id": "eval_67abd54d9b0081909a86353f6fb9317a",
  "created_at": 1739314509,
  "status": "pass",
  "datasource_item_id": 137,
  "datasource_item": {
      "teacher": "To grade essays, I only check for style, content, and grammar.",
      "student": "I am a student who is trying to write the best essay."
  },
  "results": [
    {
      "name": "String Check Grader",
      "type": "string-check-grader",
      "score": 1.0,
      "passed": true
    }
  ],
  "sample": {
    "input": [
      {
        "role": "system",
        "content": "You are an evaluator bot..."
      },
      {
        "role": "user",
        "content": "You are assessing..."
      }
    ],
    "output": [
      {
        "role": "assistant",
        "content": "The rubric is not clear nor concise."
      }
    ],
    "finish_reason": "stop",
    "model": "gpt-4o-2024-08-06",
    "usage": {
      "total_tokens": 521,
      "completion_tokens": 2,
      "prompt_tokens": 519,
      "cached_tokens": 0
    },
    "error": null,
    "temperature": 1.0,
    "max_completion_tokens": 2048,
    "top_p": 1.0,
    "seed": 42
  }
}
```
```

--------------------------------

### POST /v1/assistants

Source: https://platform.openai.com/docs/api-reference/assistants/getAssistant

Create a new assistant with specified model, instructions, and optional tools. This endpoint allows you to configure an assistant with system instructions, attach tools, set response formats, and customize sampling parameters for model behavior.

```APIDOC
## POST /v1/assistants

### Description
Create an assistant with a model and instructions. The assistant can be configured with tools, custom instructions, and various sampling parameters.

### Method
POST

### Endpoint
https://api.openai.com/v1/assistants

### Request Body Parameters

#### Required Parameters
- **model** (string) - ID of the model to use. You can use the List models API to see all available models, or see the Model overview for descriptions.

#### Optional Parameters
- **name** (string) - The name of the assistant. Maximum length is 256 characters.
- **description** (string) - The description of the assistant. Maximum length is 512 characters.
- **instructions** (string) - The system instructions that the assistant uses. Maximum length is 256,000 characters.
- **temperature** (number) - What sampling temperature to use, between 0 and 2. Default: 1. Higher values (e.g., 0.8) make output more random; lower values (e.g., 0.2) make it more focused and deterministic.
- **top_p** (number) - Nucleus sampling parameter where the model considers results of tokens with top_p probability mass. Default: 1. Generally recommended to alter this or temperature, but not both.
- **reasoning_effort** (string) - Constrains effort on reasoning for reasoning models. Default: medium. Supported values: none, minimal, low, medium, high, xhigh. Reduces reasoning effort for faster responses and fewer tokens.
- **response_format** (string or object) - Specifies the format that the model must output. Options: "auto", {"type": "json_object"}, or {"type": "json_schema", "json_schema": {...}}. Compatible with GPT-4o, GPT-4 Turbo, and GPT-3.5 Turbo models.
- **tools** (array) - A list of tools enabled on the assistant. Maximum of 128 tools per assistant. Tool types: code_interpreter, file_search, or function. Default: [].
- **tool_resources** (object) - A set of resources used by the assistant's tools. Resource types are specific to tool type.
- **metadata** (map) - Set of 16 key-value pairs that can be attached to an object. Keys: strings with maximum length of 64 characters. Values: strings with maximum length of 512 characters.

### Request Example
```json
{
  "model": "gpt-4o",
  "name": "Math Tutor",
  "description": "A helpful math tutor assistant",
  "instructions": "You are a helpful math tutor. Help students understand mathematical concepts and solve problems.",
  "tools": [{"type": "code_interpreter"}],
  "temperature": 0.7,
  "top_p": 0.9,
  "response_format": {"type": "json_object"},
  "metadata": {
    "subject": "mathematics",
    "level": "intermediate"
  }
}
```

### Response

#### Success Response (200)
- **id** (string) - The unique identifier of the created assistant.
- **object** (string) - Object type identifier.
- **created_at** (integer) - Unix timestamp of when the assistant was created.
- **model** (string) - The model ID associated with the assistant.
- **name** (string) - The name of the assistant.
- **description** (string) - The description of the assistant.
- **instructions** (string) - The system instructions for the assistant.
- **tools** (array) - The list of tools enabled on the assistant.
- **tool_resources** (object) - Resources used by the assistant's tools.
- **metadata** (object) - Custom metadata attached to the assistant.
- **temperature** (number) - The temperature setting used for sampling.
- **top_p** (number) - The top_p setting used for nucleus sampling.
- **reasoning_effort** (string) - The reasoning effort level configured.
- **response_format** (string or object) - The response format configuration.

#### Response Example
```json
{
  "id": "asst_1234567890",
  "object": "assistant",
  "created_at": 1704067200,
  "model": "gpt-4o",
  "name": "Math Tutor",
  "description": "A helpful math tutor assistant",
  "instructions": "You are a helpful math tutor. Help students understand mathematical concepts and solve problems.",
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "tool_resources": null,
  "metadata": {
    "subject": "mathematics",
    "level": "intermediate"
  },
  "temperature": 0.7,
  "top_p": 0.9,
  "reasoning_effort": "medium",
  "response_format": {
    "type": "json_object"
  }
}
```
```

--------------------------------

### POST /v1/responses - Create Response with Remote MCP Server

Source: https://platform.openai.com/docs/quickstart_api-mode=responses

Create a response that integrates with remote Model Context Protocol (MCP) servers. This endpoint enables the model to call external MCP servers for enhanced functionality, such as specialized domain services. The example shows integration with a Dungeons and Dragons MCP server for dice rolling.

```APIDOC
## POST /v1/responses

### Description
Creates a response using the OpenAI Responses API with remote MCP (Model Context Protocol) server integration. This allows the model to invoke capabilities from external MCP servers.

### Method
POST

### Endpoint
https://api.openai.com/v1/responses

### Parameters
#### Request Body
- **model** (string) - Required - The model to use (e.g., "gpt-5")
- **input** (string) - Required - The user input or prompt
- **tools** (array) - Optional - Array of MCP tool definitions

#### MCP Tool Object Properties
- **type** (string) - Required - Type of tool: "mcp"
- **server_label** (string) - Required - Label for the MCP server
- **server_description** (string) - Required - Description of server capabilities
- **server_url** (string) - Required - URL of the MCP server (SSE endpoint)
- **require_approval** (string) - Optional - Approval policy ("never", "always", or "manual")

### Request Example
```
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5",
    "tools": [
      {
        "type": "mcp",
        "server_label": "dmcp",
        "server_description": "A Dungeons and Dragons MCP server to assist with dice rolling.",
        "server_url": "https://dmcp-server.deno.dev/sse",
        "require_approval": "never"
      }
    ],
    "input": "Roll 2d4+1"
  }'
```

### Response
#### Success Response (200)
- **output_text** (string) - Text output from the model
- **model** (string) - Model used for generation
- **usage** (object) - Token usage information

### JavaScript Example
```javascript
import OpenAI from "openai";
const client = new OpenAI();

const resp = await client.responses.create({
  model: "gpt-5",
  tools: [
    {
      type: "mcp",
      server_label: "dmcp",
      server_description: "A Dungeons and Dragons MCP server to assist with dice rolling.",
      server_url: "https://dmcp-server.deno.dev/sse",
      require_approval: "never",
    },
  ],
  input: "Roll 2d4+1",
});

console.log(resp.output_text);
```

### Python Example
```python
from openai import OpenAI

client = OpenAI()

resp = client.responses.create(
    model="gpt-5",
    tools=[
        {
            "type": "mcp",
            "server_label": "dmcp",
            "server_description": "A Dungeons and Dragons MCP server to assist with dice rolling.",
            "server_url": "https://dmcp-server.deno.dev/sse",
            "require_approval": "never",
        },
    ],
    input="Roll 2d4+1",
)

print(resp.output_text)
```

### C# Example
```csharp
using OpenAI.Responses;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
OpenAIResponseClient client = new(model: "gpt-5", apiKey: key);

ResponseCreationOptions options = new();
options.Tools.Add(ResponseTool.CreateMcpTool(
    serverLabel: "dmcp",
    serverUri: new Uri("https://dmcp-server.deno.dev/sse"),
    toolCallApprovalPolicy: new McpToolCallApprovalPolicy(GlobalMcpToolCallApprovalPolicy.NeverRequireApproval)
));

OpenAIResponse response = (OpenAIResponse)client.CreateResponse([
    ResponseItem.CreateUserMessageItem([
        ResponseContentPart.CreateInputTextPart("Roll 2d4+1")
    ])
], options);

Console.WriteLine(response.GetOutputText());
```
```

--------------------------------

### Configure OpenAI Evaluation with Prompt Template and Sampling Parameters

Source: https://platform.openai.com/docs/api-reference/evals/createRun

Sets up an evaluation configuration for GPT-4o-mini model with a multi-role prompt template for news headline classification. Includes developer instructions, user input placeholder, sampling parameters (temperature, max tokens, top_p, seed), and test data source with ground truth labels. This configuration demonstrates how to structure prompt engineering with system roles and evaluation metrics.

```javascript
type: "template",
template: [
  {
    role: "developer",
    content: "Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"\n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"\n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"\n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"\n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"\n**Output**: \"Sports\"\n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification."
  },
  {
    role: "user",
    content: "{{item.input}}"
  }
],
sampling_params: {
  temperature: 1,
  max_completions_tokens: 2048,
  top_p: 1,
  seed: 42
},
model: "gpt-4o-mini",
source: {
  type: "file_content",
  content: [
    {
      item: {
        input: "Tech Company Launches Advanced Artificial Intelligence Platform",
        ground_truth: "Technology"
      }
    }
  ]
}
```

--------------------------------

### Generate Audio Transcription with Prompt using OpenAI API

Source: https://platform.openai.com/docs/guides/speech-to-text

This code demonstrates how to generate an audio transcription using the OpenAI API, providing a textual prompt to guide the model and improve the accuracy and contextual relevance of the output. It showcases examples in JavaScript, Python, and cURL for interacting with the `/v1/audio/transcriptions` endpoint, specifying the input audio file, the transcription model (e.g., gpt-4o-transcribe), the desired response format, and a descriptive prompt for context.

```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

const transcription = await openai.audio.transcriptions.create({
  file: fs.createReadStream("/path/to/file/speech.mp3"),
  model: "gpt-4o-transcribe",
  response_format: "text",
  prompt:"The following conversation is a lecture about the recent developments around OpenAI, GPT-4.5 and the future of AI.",
});

console.log(transcription.text);
```

```python
from openai import OpenAI

client = OpenAI()
audio_file = open("/path/to/file/speech.mp3", "rb")

transcription = client.audio.transcriptions.create(
  model="gpt-4o-transcribe",
  file=audio_file,
  response_format="text",
  prompt="The following conversation is a lecture about the recent developments around OpenAI, GPT-4.5 and the future of AI."
)

print(transcription.text)
```

```curl
curl --request POST \
  --url https://api.openai.com/v1/audio/transcriptions \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header 'Content-Type: multipart/form-data' \
  --form file=@/path/to/file/speech.mp3 \
  --form model=gpt-4o-transcribe \
  --form prompt="The following conversation is a lecture about the recent developments around OpenAI, GPT-4.5 and the future of AI."
```

--------------------------------

### Create OpenAI Response with JavaScript

Source: https://platform.openai.com/docs/overview

Use the OpenAI JavaScript client library to create a response from the GPT-5.2 model. The client is initialized with default configuration and sends a request with the specified model and input prompt. Returns a response object containing the model's output text.

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.2",
  input: "Write a short bedtime story about a unicorn.",
});

console.log(response.output_text);
```

--------------------------------

### POST /videos - Start a video render job

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=fox-walk

Initiate the creation of a video from a text prompt and specified parameters like size and duration. The API returns a job ID and initial status.

```APIDOC
## POST /videos

### Description
Starts a video generation job based on a text prompt and configurable parameters.

### Method
POST

### Endpoint
/v1/videos

### Parameters
#### Request Body (multipart/form-data)
- **prompt** (string) - Required - The text prompt describing the desired video content, creative style, camera, lighting, and motion.
- **model** (string) - Required - The video generation model to use (e.g., 'sora-2', 'sora-2-pro').
- **size** (string) - Optional - The desired resolution of the video (e.g., '1280x720').
- **seconds** (string) - Optional - The desired length of the video in seconds (e.g., '8').

### Request Example
```bash
curl -X POST "https://api.openai.com/v1/videos" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F prompt="Wide tracking shot of a teal coupe driving through a desert highway, heat ripples visible, hard sun overhead." \
  -F model="sora-2-pro" \
  -F size="1280x720" \
  -F seconds="8"
```

### Response
#### Success Response (200)
- **id** (string) - A unique identifier for the video generation job.
- **object** (string) - The object type, typically 'video'.
- **created_at** (integer) - Timestamp of when the job was created.
- **status** (string) - The current status of the job ('queued', 'in_progress').
- **model** (string) - The model used for generation.
- **progress** (integer) - The current progress percentage (0 at start).
- **seconds** (string) - The requested video length.
- **size** (string) - The requested video resolution.

#### Response Example
```json
{
  "id": "video_68d7512d07848190b3e45da0ecbebcde004da08e1e0678d5",
  "object": "video",
  "created_at": 1758941485,
  "status": "queued",
  "model": "sora-2-pro",
  "progress": 0,
  "seconds": "8",
  "size": "1280x720"
}
```
```

--------------------------------

### POST /v1/assistants

Source: https://platform.openai.com/docs/api-reference/assistants/modifyAssistant

Create an assistant with a model and instructions. This endpoint allows you to define various properties for your assistant, including its name, description, system instructions, and tools.

```APIDOC
## POST /v1/assistants

### Description
Create an assistant with a model and instructions.

### Method
POST

### Endpoint
/v1/assistants

### Parameters
#### Path Parameters
_None_

#### Query Parameters
_None_

#### Request Body
- **model** (string) - Required - ID of the model to use. You can use the List models API to see all of your available models, or see our Model overview for descriptions of them.
- **description** (string) - Optional - The description of the assistant. The maximum length is 512 characters.
- **instructions** (string) - Optional - The system instructions that the assistant uses. The maximum length is 256,000 characters.
- **metadata** (map) - Optional - Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format, and querying for objects via API or the dashboard. Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters.
- **name** (string) - Optional - The name of the assistant. The maximum length is 256 characters.
- **reasoning_effort** (string) - Optional - Defaults to `medium`. Constrains effort on reasoning for reasoning models. Currently supported values are `none`, `minimal`, `low`, `medium`, `high`, and `xhigh`.
- **response_format** ("auto" or object) - Optional - Specifies the format that the model must output. Compatible with GPT-4o, GPT-4 Turbo, and all GPT-3.5 Turbo models since `gpt-3.5-turbo-1106`.
- **temperature** (number) - Optional - Defaults to `1`. What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
- **tool_resources** (object) - Optional - A set of resources that are used by the assistant's tools. The resources are specific to the type of tool.
- **tools** (array) - Optional - Defaults to `[]`. A list of tool enabled on the assistant. There can be a maximum of 128 tools per assistant. Tools can be of types `code_interpreter`, `file_search`, or `function`.
- **top_p** (number) - Optional - Defaults to `1`. An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass.

### Request Example
```json
{
  "model": "gpt-4o",
  "name": "Math Tutor Assistant",
  "description": "An assistant that helps with math problems.",
  "instructions": "You are a friendly math tutor. Explain concepts clearly and provide step-by-step solutions.",
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "temperature": 0.7
}
```

### Response
#### Success Response (200)
_Response structure not provided in the input text._

#### Response Example
_Response example not provided in the input text._
```

--------------------------------

### POST /videos - Create a Video

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=90s-TV-Ad

Start a video render job by sending a text prompt and parameters like model, size, and duration. The API returns a unique video ID and initial status. Video generation typically takes several minutes depending on the model, API load, and resolution.

```APIDOC
## POST /videos

### Description
Start a render job to generate a video from a text prompt using the Sora-2 model. The prompt defines creative elements like subjects, camera work, lighting, and motion.

### Method
POST

### Endpoint
https://api.openai.com/v1/videos

### Parameters
#### Request Body
- **prompt** (string) - Required - Text description of the video to generate, including shot type, subject, action, setting, and lighting
- **model** (string) - Required - The model to use for video generation (e.g., "sora-2", "sora-2-pro")
- **size** (string) - Optional - Video resolution as "WIDTHxHEIGHT" (e.g., "1280x720")
- **seconds** (integer) - Optional - Duration of the video in seconds

### Request Examples

**JavaScript:**
```javascript
import OpenAI from 'openai';

const openai = new OpenAI();

let video = await openai.videos.create({
    model: 'sora-2',
    prompt: "A video of the words 'Thank you' in sparkling letters",
});

console.log('Video generation started: ', video);
```

**Python:**
```python
from openai import OpenAI

openai = OpenAI()

video = openai.videos.create(
    model="sora-2",
    prompt="A video of a cool cat on a motorcycle in the night",
)

print("Video generation started:", video)
```

**cURL:**
```bash
curl -X POST "https://api.openai.com/v1/videos" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F prompt="Wide tracking shot of a teal coupe driving through a desert highway, heat ripples visible, hard sun overhead." \
  -F model="sora-2-pro" \
  -F size="1280x720" \
  -F seconds="8"
```

### Response
#### Success Response (200)
- **id** (string) - Unique identifier for the video render job
- **object** (string) - Object type, always "video"
- **created_at** (integer) - Unix timestamp of when the job was created
- **status** (string) - Current job status: "queued", "in_progress", "completed", or "failed"
- **model** (string) - The model used for generation
- **progress** (integer) - Progress percentage (0-100) if available
- **seconds** (string) - Duration of the video in seconds
- **size** (string) - Resolution of the video

#### Response Example
```json
{
  "id": "video_68d7512d07848190b3e45da0ecbebcde004da08e1e0678d5",
  "object": "video",
  "created_at": 1758941485,
  "status": "queued",
  "model": "sora-2-pro",
  "progress": 0,
  "seconds": "8",
  "size": "1280x720"
}
```

### Notes
- Video generation may take several minutes depending on model, API load, and resolution
- Content must be suitable for audiences under 18
- Copyrighted characters, music, and real people cannot be generated
- Input images with human faces are currently rejected
```

--------------------------------

### POST /videos

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=Sleeping-Otters

Starts a new video render job from a natural language prompt, with optional reference inputs or a remix ID. This is an asynchronous process.

```APIDOC
## POST /videos

### Description
Initiates the generation of a new video. The API returns a job object with an ID and initial status. Video rendering is asynchronous, requiring subsequent polling or webhooks for completion status.

### Method
POST

### Endpoint
/videos

### Parameters
#### Request Body
- **prompt** (string) - Required - The natural language description or instruction for the video content.
- **model** (string) - Optional - The Sora model to use for generation (e.g., `sora-2` for speed, `sora-2-pro` for quality). Defaults to `sora-2`.
- **size** (string) - Optional - The desired resolution of the video (e.g., `1792x1024`).
- **duration** (string) - Optional - The desired length of the video (e.g., `8s`).
- **reference_inputs** (array of strings) - Optional - A list of video or image IDs to use as reference for style or content.
- **remix_id** (string) - Optional - The ID of an existing video to remix.

### Request Example
```json
{
  "prompt": "A peaceful, cinematic scene of two sea otters floating side by side on calm, sunlit water. They hold hands together gently as they drift, their fur glistening with droplets that sparkle in the golden light.",
  "model": "sora-2-pro",
  "size": "1792x1024",
  "duration": "8s"
}
```

### Response
#### Success Response (202 Accepted)
- **id** (string) - The unique identifier for the asynchronous video render job.
- **status** (string) - The initial status of the job (e.g., "pending", "processing").
- **created_at** (string) - ISO 8601 timestamp when the job was created.

#### Response Example
```json
{
  "id": "job_abc123def456",
  "status": "pending",
  "created_at": "2023-10-27T10:00:00Z"
}
```
```

--------------------------------

### Migrate from Threads to Conversations: Conversational Object Response Structure

Source: https://platform.openai.com/docs/assistants/overview

These JSON examples demonstrate the structural differences in API responses when creating conversational objects. The deprecated Assistants API's `thread` response includes `tool_resources`, whereas the new Responses API's `conversation` response offers a cleaner and more generalized structure.

```json
{
"id": "thread_CrXtCzcyEQbkAcXuNmVSKFs1",
"object": "thread",
"created_at": 1752855924,
"metadata": {
  "user_id": "peter_le_fleur"
},
"tool_resources": {}
}
```

```json
{
"id": "conv_68542dc602388199a30af27d040cefd4087a04b576bfeb24",
"object": "conversation",
"created_at": 1752855924,
"metadata": {
	"user_id": "peter_le_fleur"
}
}
```

--------------------------------

### Retrieve Code Interpreter Session Usage via cURL

Source: https://platform.openai.com/docs/api-reference/usage/audio_transcriptions_object

Demonstrates how to fetch paginated and time-bucketed code interpreter session usage data for an organization using a cURL request. This example queries for sessions starting at a specific Unix timestamp and limits the results to one entry. Authentication is handled via an 'Authorization' header with a Bearer token, and the content type is set to JSON.

```curl
curl "https://api.openai.com/v1/organization/usage/code_interpreter_sessions?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"
```

```json
{
    "object": "page",
    "data": [
        {
            "object": "bucket",
            "start_time": 1730419200,
            "end_time": 1730505600,
            "results": [
                {
                    "object": "organization.usage.code_interpreter_sessions.result",
                    "num_sessions": 1,
                    "project_id": null
                }
            ]
        }
    ],
    "has_more": false,
    "next_page": null
}
```

--------------------------------

### Upload Local File and Query with C#

Source: https://platform.openai.com/docs/quickstart_api-mode=responses

Demonstrates uploading a local file from disk and using it in a model response with C#. The code uploads a PDF file with UserData purpose and then creates a response combining the file with a text query.

```csharp
using OpenAI.Files;
using OpenAI.Responses;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
OpenAIResponseClient client = new(model: "gpt-5", apiKey: key);

OpenAIFileClient files = new(key);
OpenAIFile file = files.UploadFile("draconomicon.pdf", FileUploadPurpose.UserData);

OpenAIResponse response = (OpenAIResponse)client.CreateResponse([
    ResponseItem.CreateUserMessageItem([
        ResponseContentPart.CreateInputFilePart(file.Id),
        ResponseContentPart.CreateInputTextPart("What is the first dragon in the book?"),
    ]),
]);

Console.WriteLine(response.GetOutputText());
```

--------------------------------

### Test Basic API Request - JavaScript

Source: https://platform.openai.com/docs/libraries

Create and execute a simple API request using the OpenAI SDK in JavaScript. This example demonstrates how to initialize the client, call the Responses API with a model and input, and retrieve the output.

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
    model: "gpt-5-nano",
    input: "Write a one-sentence bedtime story about a unicorn."
});

console.log(response.output_text);
```

--------------------------------

### Eval Object JSON Structure

Source: https://platform.openai.com/docs/api-reference/evals/run-object

A complete JSON example of an Eval object containing all properties including object type identifier, unique ID, data source configuration with custom schema, testing criteria array with string check grader, evaluation name, creation timestamp, and metadata key-value pairs. This represents a full evaluation setup for external data testing.

```json
{
  "object": "eval",
  "id": "eval_67abd54d9b0081909a86353f6fb9317a",
  "data_source_config": {
    "type": "custom",
    "item_schema": {
      "type": "object",
      "properties": {
        "label": {"type": "string"}
      },
      "required": ["label"]
    },
    "include_sample_schema": true
  },
  "testing_criteria": [
    {
      "name": "My string check grader",
      "type": "string_check",
      "input": "{{sample.output_text}}",
      "reference": "{{item.label}}",
      "operation": "eq"
    }
  ],
  "name": "External Data Eval",
  "created_at": 1739314509,
  "metadata": {
    "test": "synthetics"
  }
}
```

--------------------------------

### Call OpenAI API with minimal reasoning effort - Python

Source: https://platform.openai.com/docs/guides/latest-model_gallery=open&galleryItem=holiday-card-for-kids-5.2

Initializes the OpenAI Python client and creates a response using the gpt-5.1 model with reasoning effort set to 'none'. Shows how to structure the API call with the input prompt and reasoning configuration using the Python SDK.

```python
from openai import OpenAI
client = OpenAI()

response = client.responses.create(
    model="gpt-5.1",
    input="How much gold would it take to coat the Statue of Liberty in a 1mm layer?",
    reasoning={
        "effort": "none"
    }
)

print(response)
```

--------------------------------

### POST /videos - Create a Video

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=indie-cafe-rainy-window

Start a video generation job by submitting a text prompt and required parameters. The prompt defines the creative direction including subjects, camera movement, lighting, and motion. Parameters like size and seconds control the video's resolution and length.

```APIDOC
## POST /videos

### Description
Initiates a video generation job. Submit a text prompt describing the desired video content along with model and optional parameters for resolution and duration. The API returns immediately with a job ID and initial status.

### Method
POST

### Endpoint
https://api.openai.com/v1/videos

### Parameters
#### Request Body
- **prompt** (string) - Required - Text description of the video to generate. Should specify shot type, subject, action, setting, and lighting for best results.
- **model** (string) - Required - The model to use for video generation (e.g., "sora-2", "sora-2-pro")
- **size** (string) - Optional - Video resolution (e.g., "1280x720"). Controls output quality and processing time.
- **seconds** (string) - Optional - Duration of the video in seconds (e.g., "8"). Controls video length.

### Request Example
```javascript
import OpenAI from 'openai';

const openai = new OpenAI();

let video = await openai.videos.create({
    model: 'sora-2',
    prompt: "A video of the words 'Thank you' in sparkling letters",
});

console.log('Video generation started: ', video);
```

### Response
#### Success Response (200)
- **id** (string) - Unique identifier for the video generation job
- **object** (string) - Type of object ("video")
- **created_at** (integer) - Unix timestamp when the job was created
- **status** (string) - Current job status ("queued", "in_progress", "completed", or "failed")
- **model** (string) - The model used for generation
- **progress** (integer) - Progress percentage (0-100) if available
- **seconds** (string) - Duration of the generated video
- **size** (string) - Resolution of the generated video

#### Response Example
```json
{
  "id": "video_68d7512d07848190b3e45da0ecbebcde004da08e1e0678d5",
  "object": "video",
  "created_at": 1758941485,
  "status": "queued",
  "model": "sora-2-pro",
  "progress": 0,
  "seconds": "8",
  "size": "1280x720"
}
```

### Guardrails and Content Restrictions
- Only content suitable for audiences under 18 is permitted
- Copyrighted characters and music will be rejected
- Real people and public figures cannot be generated
- Images with human faces are currently rejected

### Prompting Best Practices
For optimal results, include specific details in your prompt:
- Shot type (wide shot, close-up, tracking shot)
- Subject and action
- Setting and environment
- Lighting conditions and time of day

Example: "Wide shot of a child flying a red kite in a grassy park, golden hour sunlight, camera slowly pans upward."
```

--------------------------------

### POST /v1/videos (Generate Video with Image Reference)

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=90s-TV-Ad

Generates a new video from a text prompt, using an input image as the first frame to guide the generation and preserve specific visual elements. The input image must match the target video's resolution.

```APIDOC
## POST /v1/videos

### Description
Generates a new video from a text prompt, using an input image as the first frame to guide the generation and preserve specific visual elements. The input image must match the target video's resolution (`size`) and supported file formats are `image/jpeg`, `image/png`, and `image/webp`.

### Method
POST

### Endpoint
/v1/videos

### Parameters
#### Request Body
- **prompt** (string) - Required - The text prompt describing the desired content of the video.
- **model** (string) - Required - The video generation model to use (e.g., "sora-2-pro").
- **size** (string) - Required - The target resolution of the output video (e.g., "1280x720").
- **seconds** (integer) - Required - The duration of the video in seconds.
- **input_reference** (file) - Optional - An image file to use as the first frame of the video. Must match the `size` parameter and be one of the supported image formats.

### Request Example
```bash
curl -X POST "https://api.openai.com/v1/videos" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F prompt="She turns around and smiles, then slowly walks out of the frame." \
  -F model="sora-2-pro" \
  -F size="1280x720" \
  -F seconds="8" \
  -F input_reference="@sample_720p.jpeg;type=image/jpeg"
```

### Response
#### Success Response (200)
Returns a video object or job ID representing the video generation task. The exact structure is not detailed in the provided text, but typically includes an ID, status, and potentially a URL to the generated video upon completion.

#### Response Example
```json
{
  "id": "video_job_abc123",
  "object": "video_job",
  "status": "pending",
  "created_at": 1678886400,
  "model": "sora-2-pro"
}
```
```

--------------------------------

### Python: Start OpenAI MCP Server with FastMCP

Source: https://platform.openai.com/docs/mcp

This Python `main` function initializes and starts an MCP server using the FastMCP framework. It first verifies the presence of the `OPENAI_API_KEY` and `VECTOR_STORE_ID` environment variables, then creates and runs the server on `0.0.0.0:8000` using Server-Sent Events (SSE) transport. It includes basic error handling for graceful shutdown or unexpected exceptions during server operation.

```python
def main():
    """Main function to start the MCP server."""
    # Verify OpenAI client is initialized
    if not openai_client:
        logger.error(
            "OpenAI API key not found. Please set OPENAI_API_KEY environment variable."
        )
        raise ValueError("OpenAI API key is required")

    logger.info(f"Using vector store: {VECTOR_STORE_ID}")

    # Create the MCP server
    server = create_server()

    # Configure and start the server
    logger.info("Starting MCP server on 0.0.0.0:8000")
    logger.info("Server will be accessible via SSE transport")

    try:
        # Use FastMCP's built-in run method with SSE transport
        server.run(transport="sse", host="0.0.0.0", port=8000)
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server error: {e}")
        raise


if __name__ == "__main__":
    main()
```

--------------------------------

### Flex Processing - cURL Example

Source: https://platform.openai.com/docs/guides/flex-processing

Raw HTTP request example using cURL to create a flex processing request via the OpenAI API.

```APIDOC
## cURL - Flex Processing Request

### Description
Raw HTTP request example for creating a flex processing response.

### Code Example
```bash
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "o3",
    "instructions": "List and describe all the metaphors used in this book.",
    "input": "<very long text of book here>",
    "service_tier": "flex"
  }'
```

### Headers
- **Authorization** (string) - Bearer token with your OpenAI API key
- **Content-Type** (string) - application/json

### Request Body
- **model** (string) - The model identifier (e.g., "o3")
- **instructions** (string) - Task instructions
- **input** (string) - Input content to process
- **service_tier** (string) - Set to "flex" for cost-optimized processing
```

--------------------------------

### Create and Configure FastMCP Server with Tools

Source: https://platform.openai.com/docs/mcp

This function initializes the FastMCP server and registers the 'search' and 'fetch' tools. It sets up the server's name and integrates the predefined server instructions, creating a foundational structure for handling requests and executing tool-based operations.

```python
def create_server():
    """Create and configure the MCP server with search and fetch tools."""

    # Initialize the FastMCP server
    mcp = FastMCP(name="Sample MCP Server",
                  instructions=server_instructions)
```

--------------------------------

### Generate OpenAI Prompt for Python Project Planning (JS/Python)

Source: https://platform.openai.com/docs/guides/reasoning_api-mode=responses

This example illustrates how to formulate a prompt for an OpenAI o-series model to create a multi-step plan for a Python application. The prompt requests a directory structure and full code for a Q&A database application that handles user questions, retrieves answers, and stores new question/answer pairs. The JavaScript and Python code demonstrates how to send this comprehensive planning request to the OpenAI API, with reasoning expected only at the beginning and end of the output.

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const prompt = `\nI want to build a Python app that takes user questions and looks \nthem up in a database where they are mapped to answers. If there \nis close match, it retrieves the matched answer. If there isn't, \nit asks the user to provide an answer and stores the \nquestion/answer pair in the database. Make a plan for the directory \nstructure you'll need, then return each file in full. Only supply \nyour reasoning at the beginning and end, not throughout the code.\n`.trim();

const response = await openai.responses.create({
    model: "gpt-5",
    input: [
        {
            role: "user",
            content: prompt,
        },
    ],
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

prompt = """\nI want to build a Python app that takes user questions and looks \nthem up in a database where they are mapped to answers. If there \nis close match, it retrieves the matched answer. If there isn't, \nit asks the user to provide an answer and stores the \nquestion/answer pair in the database. Make a plan for the directory \nstructure you'll need, then return each file in full. Only supply \nyour reasoning at the beginning and end, not throughout the code.\n"""

response = client.responses.create(
    model="gpt-5",
    input=[
        {
            "role": "user",
            "content": prompt,
        }
    ]
)

print(response.output_text)
```

--------------------------------

### Retrieve OpenAI Completions Usage with cURL

Source: https://platform.openai.com/docs/api-reference/usage/code_interpreter_sessions

This cURL snippet demonstrates how to retrieve detailed completions usage data for an organization using the OpenAI Usage API. It performs a GET request to the `/v1/organization/usage/completions` endpoint. Authentication is handled via the `Authorization` header using an OpenAI admin key. The example includes query parameters such as `start_time` and `limit` to define the data range.

```bash
curl \"https://api.openai.com/v1/organization/usage/completions?start_time=1730419200&limit=1\" \\
-H \"Authorization: Bearer $OPENAI_ADMIN_KEY\" \\
-H \"Content-Type: application/json\"
```

--------------------------------

### GET /videos

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=Upside-Down-City

Enumerate your video generation jobs with pagination. This is useful for building history, dashboards, or for housekeeping tasks.

```APIDOC
## GET /videos

### Description
Retrieves a paginated list of all video generation jobs associated with the authenticated user, allowing for filtering and ordering.

### Method
GET

### Endpoint
/videos

### Parameters
#### Path Parameters
(None)

#### Query Parameters
- **limit** (integer) - Optional - A limit on the number of objects to be returned. Default is 20; maximum is 100.
- **after** (string) - Optional - A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with `obj_foo`, your subsequent call can include `after=obj_foo` in order to fetch the next page of the list.
- **before** (string) - Optional - A cursor for use in pagination. `before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with `obj_bar`, your subsequent call can include `before=obj_bar` in order to fetch the previous page of the list.

#### Request Body
(None)

### Request Example
(None)

### Response
#### Success Response (200 OK)
- **data** (array of objects) - A list of video job objects.
  - **id** (string) - The unique identifier of the video generation job.
  - **status** (string) - The current status of the job.
  - **model** (string) - The Sora model used.
  - **prompt** (string) - The original prompt provided.
  - **created_at** (string) - Timestamp of job creation.
- **has_more** (boolean) - A boolean that indicates whether there are more elements in the list.

#### Response Example
{
  "data": [
    {
      "id": "job_xyz123",
      "status": "completed",
      "model": "sora-2",
      "prompt": "A peaceful, cinematic scene...",
      "created_at": "2024-03-15T10:00:00Z"
    },
    {
      "id": "job_abc456",
      "status": "failed",
      "model": "sora-2-pro",
      "prompt": "Indie café by a rainy window...",
      "created_at": "2024-03-14T09:30:00Z"
    }
  ],
  "has_more": true
}
```

--------------------------------

### File Upload and Processing - Multiple Language Examples

Source: https://platform.openai.com/docs/guides/pdf-files

Examples demonstrating how to work with PDF file inputs across different programming languages (JavaScript, Python, and C#). Shows how to create responses with PDF files using language-specific OpenAI SDKs.

```APIDOC
## PDF File Input Processing Examples

### JavaScript/Node.js Example
```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
    model: "gpt-5",
    input: [
        {
            role: "user",
            content: [
                {
                    type: "input_text",
                    text: "Analyze the letter and provide a summary of the key points.",
                },
                {
                    type: "input_file",
                    file_url: "https://www.berkshirehathaway.com/letters/2024ltr.pdf",
                },
            ],
        },
    ],
});

console.log(response.output_text);
```

### Python Example
```python
from openai import OpenAI
client = OpenAI()

response = client.responses.create(
    model="gpt-5",
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": "Analyze the letter and provide a summary of the key points.",
                },
                {
                    "type": "input_file",
                    "file_url": "https://www.berkshirehathaway.com/letters/2024ltr.pdf",
                },
            ],
        },
    ]
)

print(response.output_text)
```

### C# Example
```csharp
using OpenAI.Files;
using OpenAI.Responses;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
OpenAIResponseClient client = new(model: "gpt-5", apiKey: key);

using HttpClient http = new();
using Stream stream = await http.GetStreamAsync("https://www.berkshirehathaway.com/letters/2024ltr.pdf");
OpenAIFileClient files = new(key);
OpenAIFile file = files.UploadFile(stream, "2024ltr.pdf", FileUploadPurpose.UserData);

OpenAIResponse response = (OpenAIResponse)client.CreateResponse([
    ResponseItem.CreateUserMessageItem([
        ResponseContentPart.CreateInputTextPart("Analyze the letter and provide a summary of the key points."),
        ResponseContentPart.CreateInputFilePart(file.Id),
    ]),
]);

Console.WriteLine(response.GetOutputText());
```

### Implementation Notes
- The API processes both extracted text and images from each PDF page
- Diagrams and visual elements are preserved for model analysis
- Use external URLs for direct file linking or upload files to /v1/files endpoint first
- All examples use model "gpt-5" with vision capabilities
```

--------------------------------

### Define Voice Agent Conversation States (JSON)

Source: https://platform.openai.com/docs/guides/voice-agents

This JSON array defines a sequence of conversational states for a voice agent, guiding it through a user verification process. Each state specifies an ID, a description of its purpose, instructions for the agent's behavior, example phrases, and conditions for transitioning to the next state, such as collecting and confirming user details before transferring to another agent.

```json
[
  {
    "id": "1_greeting",
    "description": "Greet the caller and explain the verification process.",
    "instructions": [
      "Greet the caller warmly.",
      "Inform them about the need to collect personal information for their record."
    ],
    "examples": [
      "Good morning, this is the front desk administrator. I will assist you in verifying your details.",
      "Let us proceed with the verification. May I kindly have your first name? Please spell it out letter by letter for clarity."
    ],
    "transitions": [{
      "next_step": "2_get_first_name",
      "condition": "After greeting is complete."
    }]
  },
  {
    "id": "2_get_first_name",
    "description": "Ask for and confirm the caller's first name.",
    "instructions": [
      "Request: 'Could you please provide your first name?'",
      "Spell it out letter-by-letter back to the caller to confirm."
    ],
    "examples": [
      "May I have your first name, please?",
      "You spelled that as J-A-N-E, is that correct?"
    ],
    "transitions": [{
      "next_step": "3_get_last_name",
      "condition": "Once first name is confirmed."
    }]
  },
  {
    "id": "3_get_last_name",
    "description": "Ask for and confirm the caller's last name.",
    "instructions": [
      "Request: 'Thank you. Could you please provide your last name?'",
      "Spell it out letter-by-letter back to the caller to confirm."
    ],
    "examples": [
      "And your last name, please?",
      "Let me confirm: D-O-E, is that correct?"
    ],
    "transitions": [{
      "next_step": "4_next_steps",
      "condition": "Once last name is confirmed."
    }]
  },
  {
    "id": "4_next_steps",
    "description": "Attempt to verify the caller's information and proceed with next steps.",
    "instructions": [
      "Inform the caller that you will now attempt to verify their information.",
      "Call the 'authenticateUser' function with the provided details.",
      "Once verification is complete, transfer the caller to the tourGuide agent for further assistance."
    ],
    "examples": [
      "Thank you for providing your details. I will now verify your information.",
      "Attempting to authenticate your information now.",
      "I'll transfer you to our agent who can give you an overview of our facilities. Just to help demonstrate different agent personalities, she's instructed to act a little crabby."
    ],
    "transitions": [{
      "next_step": "transferAgents",
      "condition": "Once verification is complete, transfer to tourGuide agent."
    }]
  }
]
```

--------------------------------

### Download MP4 Video with Progress Monitoring - Python

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=Sleeping-Otters

Creates a video using Sora model with status polling and progress display. Downloads completed MP4 to local file using Python OpenAI client. Includes error handling for failed generations and 2-second polling intervals.

```python
from openai import OpenAI
import sys
import time

openai = OpenAI()

video = openai.videos.create(
    model="sora-2",
    prompt="A video of a cool cat on a motorcycle in the night",
)

print("Video generation started:", video)

progress = getattr(video, "progress", 0)
bar_length = 30

while video.status in ("in_progress", "queued"):
    video = openai.videos.retrieve(video.id)
    progress = getattr(video, "progress", 0)

    filled_length = int((progress / 100) * bar_length)
    bar = "=" * filled_length + "-" * (bar_length - filled_length)
    status_text = "Queued" if video.status == "queued" else "Processing"

    sys.stdout.write(f"\r{status_text}: [{bar}] {progress:.1f}%")
    sys.stdout.flush()
    time.sleep(2)

sys.stdout.write("\n")

if video.status == "failed":
    message = getattr(
        getattr(video, "error", None), "message", "Video generation failed"
    )
    print(message)
    return

print("Video generation completed:", video)
print("Downloading video content...")

content = openai.videos.download_content(video.id, variant="video")
content.write_to_file("video.mp4")

print("Wrote video.mp4")
```

--------------------------------

### JSON: Define AI Model Prompt for News Headline Categorization

Source: https://platform.openai.com/docs/api-reference/evals/getRun

This JSON snippet defines a structured prompt template for an AI model. It instructs the model to categorize news headlines into predefined topics (Technology, Markets, World, Business, Sports) by providing steps, an output format, and concrete examples to guide its response. The prompt is designed for use within a system that feeds 'item.input' as the headline to be categorized.

```json
{
  "input_messages": {
    "type": "template",
    "template": [
      {
        "type": "message",
        "role": "developer",
        "content": {
          "type": "input_text",
          "text": "Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output**: \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n"
        }
      },
      {
        "type": "message",
        "role": "user",
        "content": {
          "type": "input_text",
          "text": "{{item.input}}"
        }
      }
    ]
  },
  "model": "gpt-4o-mini",
  "sampling_params": {
    "seed": 42,
    "temperature": 1.0,
    "top_p": 1.0,
    "max_completions_tokens": 2048
  }
}
```

--------------------------------

### Ineffective Paragraph-Based Instructions for LLMs

Source: https://platform.openai.com/docs/guides/realtime-models-prompting

This example illustrates a less effective method of providing instructions to a real-time LLM using a dense, multi-sentence paragraph. Such an approach can be harder for models to parse and follow compared to more structured formats like bullet points, potentially leading to inconsistent behavior.

```Prompt
When you can’t clearly hear the user, don’t proceed. If there’s background noise or you only caught part of the sentence, pause and ask them politely to repeat themselves in their preferred language, and make sure you keep the conversation in the same language as the user.
```

--------------------------------

### POST /responses.create (Image Generation with Transparency)

Source: https://platform.openai.com/docs/guides/image-generation_api=responses&gallery=open&galleryItem=chocolate

This endpoint demonstrates how to generate an image with a transparent background using the `responses.create` method, leveraging the `image_generation` tool. It's supported by modern GPT models like `gpt-4o` and newer.

```APIDOC
## POST /responses.create (Image Generation with Transparency)\n\n### Description\nThis endpoint generates an image with a transparent background using the `responses.create` method, leveraging the `image_generation` tool. Ensure your chosen model supports the image generation tool.\n\n### Method\nPOST\n\n### Endpoint\nConceptual API method call: `openai.responses.create`\n\n### Parameters\n#### Request Body\n- **model** (string) - Required - The ID of the model to use (e.g., "gpt-5", "gpt-4o").\n- **input** (string) - Required - The prompt text for the image generation.\n- **tools** (array of objects) - Required - A list of tools to use.\n  - **type** (string) - Required - Must be "image_generation".\n  - **background** (string) - Optional - Set to "transparent" to enable a transparent background. Only supported with `png` and `webp` output formats.\n  - **quality** (string) - Optional - Image quality. "medium" or "high" are recommended for best transparency results.\n\n### Request Example\n```json\n{\n  "model": "gpt-5",\n  "input": "Draw a 2D pixel art style sprite sheet of a tabby gray cat",\n  "tools": [\n    {\n      "type": "image_generation",\n      "background": "transparent",\n      "quality": "high"\n    }\n  ]\n}\n```\n\n### Response\n#### Success Response (200)\n- **output** (array of objects) - Contains the results of the tool calls.\n  - **type** (string) - Type of the output, e.g., "image_generation_call".\n  - **result** (string) - Base64 encoded image data if `type` is "image_generation_call".\n\n#### Response Example\n```json\n{\n  "output": [\n    {\n      "type": "image_generation_call",\n      "result": "iVBORw0KGgoAAAANSUhEUgAAA..." \n    }\n  ]\n}\n```
```

--------------------------------

### Query Vector Stores Usage - cURL API Request

Source: https://platform.openai.com/docs/api-reference/usage/images

Retrieves vector stores usage details for an organization with specified time range and optional filtering parameters. Uses bearer token authentication and supports pagination with cursor-based navigation. The request example queries vector stores usage starting from Unix timestamp 1730419200 with a limit of 1 result.

```bash
curl "https://api.openai.com/v1/organization/usage/vector_stores?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"
```

--------------------------------

### Count OpenAI API Input Tokens Across Languages

Source: https://platform.openai.com/docs/api-reference/responses/compact

These examples demonstrate how to programmatically count input tokens for a specific model and input text using the OpenAI API across various programming languages and cURL. Each example shows client initialization (where applicable), setting model and input parameters, and executing the API call to retrieve the token count.

```bash
curl -X POST https://api.openai.com/v1/responses/input_tokens \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{ \
      "model": "gpt-5",\
      "input": "Tell me a joke."
    }'
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.inputTokens.count({
  model: "gpt-5",
  input: "Tell me a joke.",
});

console.log(response.input_tokens);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.input_tokens.count(
    model="gpt-5",
    input="Tell me a joke."
)
print(response.input_tokens)
```

```go
package main

import (
  "context"
  "fmt"

  "github.com/openai/openai-go"
  "github.com/openai/openai-go/responses"
)

func main() {
  client := openai.NewClient()
  response, err := client.Responses.InputTokens.Count(context.TODO(), responses.InputTokenCountParams{
    Model: "gpt-5",
    Input: "Tell me a joke.",
  })
  if err != nil {
    panic(err.Error())
  }
  fmt.Printf("%+v\n", response.InputTokens)
}
```

```java
package com.openai.example;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.inputtokens.InputTokenCountParams;
import com.openai.models.responses.inputtokens.InputTokenCountResponse;

public final class Main {
    private Main() {}

    public static void main(String[] args) {
        OpenAIClient client = OpenAIOkHttpClient.fromEnv();

        InputTokenCountParams params = InputTokenCountParams.builder()
            .model("gpt-5")
            .input("Tell me a joke.")
            .build();

        InputTokenCountResponse response = client.responses().inputTokens().count(params);
    }
}
```

```ruby
require "openai"

openai = OpenAI::Client.new

response = openai.responses.input_tokens.count(model: "gpt-5", input: "Tell me a joke.")

puts(response)
```

--------------------------------

### Create Eval Run - OpenAI Python SDK

Source: https://platform.openai.com/docs/guides/evals

Initializes OpenAI Python client and creates an evaluation run with templated prompt configuration. Specifies data source as file reference and model type, then processes all rows asynchronously. Returns run object with execution status and metadata.

```python
from openai import OpenAI
client = OpenAI()

run = client.evals.runs.create(
    "YOUR_EVAL_ID",
    name="Categorization text run",
    data_source={
        "type": "responses",
        "model": "gpt-4.1",
        "input_messages": {
            "type": "template",
            "template": [
                {"role": "developer", "content": "You are an expert in categorizing IT support tickets. Given the support ticket below, categorize the request into one of 'Hardware', 'Software', or 'Other'. Respond with only one of those words."},
                {"role": "user", "content": "{{ item.ticket_text }}"},
            ],
        },
        "source": {"type": "file_id", "id": "YOUR_FILE_ID"},
    },
)

print(run)
```

--------------------------------

### Example JSON Response for Listing Eval Runs

Source: https://platform.openai.com/docs/api-reference/evals/getRuns

This is an example JSON response returned by the OpenAI API when listing evaluation runs. It shows the structure of the `EvalRun` objects, including details like status, model, usage, and data source information.

```json
{
  "object": "list",
  "data": [
    {
      "object": "eval.run",
      "id": "evalrun_67e0c7d31560819090d60c0780591042",
      "eval_id": "eval_67e0c726d560819083f19a957c4c640b",
      "report_url": "https://platform.openai.com/evaluations/eval_67e0c726d560819083f19a957c4c640b",
      "status": "completed",
      "model": "o3-mini",
      "name": "bulk_with_negative_examples_o3-mini",
      "created_at": 1742784467,
      "result_counts": {
        "total": 1,
        "errored": 0,
        "failed": 0,
        "passed": 1
      },
      "per_model_usage": [
        {
          "model_name": "o3-mini",
          "invocation_count": 1,
          "prompt_tokens": 563,
          "completion_tokens": 874,
          "total_tokens": 1437,
          "cached_tokens": 0
        }
      ],
      "per_testing_criteria_results": [
        {
          "testing_criteria": "Push Notification Summary Grader-1808cd0b-eeec-4e0b-a519-337e79f4f5d1",
          "passed": 1,
          "failed": 0
        }
      ],
      "data_source": {
        "type": "completions",
        "source": {
          "type": "file_content",
          "content": [
            {
              "item": {
                "notifications": "\n- New message from Sarah: \"Can you call me later?\"\n- Your package has been delivered!\n- Flash sale: 20% off electronics for the next 2 hours!\n"
              }
            }
          ]
        },
        "input_messages": {
          "type": "template",
          "template": [
            {
              "type": "message",
              "role": "developer",
              "content": {
                "type": "input_text",
                "text": "\n\n\n\nYou are a helpful assistant that takes in an array of push notifications and returns a collapsed summary of them.\nThe push notification will be provided as follows:\n<push_notifications>\n...notificationlist...\n</push_notifications>\n\nYou should return just the summary and nothing else.\n\n\nYou should return a summary that is concise and snappy.\n\n\nHere is an example of a good summary:\n<push_notifications>\n- Traffic alert: Accident reported on Main Street.- Package out for delivery: Expected by 5 PM.- New friend suggestion: Connect with Emma.\n</push_notifications>\n<summary>\nTraffic alert, package expected by 5pm, suggestion for new friend (Emily).\n</summary>\n\n\nHere is an example of a bad summary:\n<push_notifications>\n- Traffic alert: Accident reported on Main Street.- Package out for delivery: Expected by 5 PM.- New friend suggestion: Connect with Emma.\n</push_notifications>\n<summary>\nTraffic alert reported on main street. You have a package that will arrive by 5pm, Emily is a new friend suggested for you.\n</summary>\n"
              }
            },
            {
              "type": "message",
              "role": "user",
              "content": {
                "type": "input_text",
                "text": "<push_notifications>{{item.notifications}}</push_notifications>"
              }
            }
          ]
        },
        "model": "o3-mini",
        "sampling_params": null
      },
      "error": null,
      "metadata": {}
    }
  ],
  "first_id": "evalrun_67e0c7d31560819090d60c0780591042",
  "last_id": "evalrun_67e0c7d31560819090d60c0780591042",
  "has_more": true
}
```

--------------------------------

### Python - Create Response with Google Calendar

Source: https://platform.openai.com/docs/guides/tools-remote-mcp

Example implementation using the OpenAI Python SDK to create a response with Google Calendar connector authorization.

```APIDOC
## Python Implementation

### Description
Use the OpenAI Python SDK to create a response with an authorized Google Calendar connector.

### Code Example
```python
from openai import OpenAI

client = OpenAI()

resp = client.responses.create(
    model="gpt-5",
    tools=[
        {
            "type": "mcp",
            "server_label": "google_calendar",
            "connector_id": "connector_googlecalendar",
            "authorization": "ya29.A0AS3H6...",
            "require_approval": "never",
        },
    ],
    input="What's on my Google Calendar for today?",
)

print(resp.output_text)
```

### Required Imports
- **openai.OpenAI** - OpenAI client

### Parameters
- **model** (string) - Model to use ("gpt-5")
- **tools** (list) - Tool configuration list
- **input** (string) - User query

### Output
- **resp.output_text** (string) - Response text output
```

--------------------------------

### Call OpenAI API with minimal reasoning effort - JavaScript

Source: https://platform.openai.com/docs/guides/latest-model_gallery=open&galleryItem=holiday-card-for-kids-5.2

Initializes the OpenAI client and creates a response using the gpt-5.1 model with reasoning effort set to 'none'. Demonstrates how to structure the request with the input prompt and reasoning parameters using the JavaScript/TypeScript SDK.

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.1",
  input: "How much gold would it take to coat the Statue of Liberty in a 1mm layer?",
  reasoning: {
    effort: "none"
  }
});

console.log(response);
```

--------------------------------

### POST /videos - Create Video

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=chameleon

Start a new video render job from a text prompt, with optional reference inputs or a remix ID. This endpoint initiates an asynchronous job that returns a job object with an ID and initial status for tracking.

```APIDOC
## POST /videos

### Description
Creates a new video generation job from a natural language prompt. Supports optional reference images or remix IDs to influence the output style and content.

### Method
POST

### Endpoint
/videos

### Request Body
- **prompt** (string) - Required - Natural language description of the video to generate
- **model** (string) - Required - Model variant: `sora-2` for speed or `sora-2-pro` for production quality
- **duration** (integer) - Optional - Video duration in seconds
- **reference_image** (string) - Optional - Base64 encoded image or image URL for style reference
- **remix_id** (string) - Optional - ID of existing video to remix or extend

### Request Example
{
  "prompt": "A peaceful, cinematic scene of two sea otters floating side by side on calm, sunlit water",
  "model": "sora-2-pro",
  "duration": 8
}

### Response
#### Success Response (200)
- **id** (string) - Unique identifier for the video job
- **status** (string) - Initial job status (typically 'processing')
- **created_at** (string) - ISO 8601 timestamp of job creation
- **prompt** (string) - The submitted prompt
- **model** (string) - Model used for generation

#### Response Example
{
  "id": "vid_abc123xyz",
  "status": "processing",
  "created_at": "2024-01-15T10:30:00Z",
  "prompt": "A peaceful, cinematic scene of two sea otters floating side by side on calm, sunlit water",
  "model": "sora-2-pro"
}
```

--------------------------------

### Edit image with OpenAI API high fidelity (Node.js, Python)

Source: https://platform.openai.com/docs/guides/image-generation_api=responses&gallery=open&galleryItem=rooftop-garden

These examples show how to use the OpenAI Image API to edit an image by overlaying a logo onto a base image with a specific prompt and high input fidelity. The API call takes two image files as input streams and returns a base64-encoded image, which is then decoded and saved as a PNG file locally. Ensure OpenAI SDKs are installed and authenticated.

```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();
const prompt = "Add the logo to the woman's top, as if stamped into the fabric.";
const result = await openai.images.edit({
  model: "gpt-image-1",
  image: [
    fs.createReadStream("woman.jpg"),
    fs.createReadStream("logo.png")
  ],
  prompt,
  input_fidelity: "high"
});

// Save the image to a file
const image_base64 = result.data[0].b64_json;
const image_bytes = Buffer.from(image_base64, "base64");
fs.writeFileSync("woman_with_logo.png", image_bytes);
```

```python
from openai import OpenAI
import base64

client = OpenAI()

result = client.images.edit(
    model="gpt-image-1",
    image=[open("woman.jpg", "rb"), open("logo.png", "rb")],
    prompt="Add the logo to the woman's top, as if stamped into the fabric.",
    input_fidelity="high"
)

image_base64 = result.data[0].b64_json
image_bytes = base64.b64decode(image_base64)

# Save the image to a file
with open("woman_with_logo.png", "wb") as f:
    f.write(image_bytes);
```

--------------------------------

### Python SDK - Create Response with Verbosity Control

Source: https://platform.openai.com/docs/guides/latest-model_gallery=open&galleryItem=podcast-homepage

Example code demonstrating how to use the OpenAI Python SDK to create a response with verbosity control settings, useful for managing output conciseness and token usage.

```APIDOC
## Python SDK Example

### Create Response with Verbosity Control

```python
from openai import OpenAI
client = OpenAI()

response = client.responses.create(
    model="gpt-5",
    input="What is the answer to the ultimate question of life, the universe, and everything?",
    text={
        "verbosity": "low"
    }
)

print(response)
```

### Parameters
- **model** (string) - Required - Model identifier (e.g., "gpt-5", "gpt-5.2")
- **input** (string) - Required - The prompt to send to the model
- **text** (dict) - Optional - Text output configuration
  - **verbosity** (string) - Optional - Verbosity level: "low", "medium", "high"

### Return Value
Returns a response object containing the model's generated output with the specified verbosity level applied.
```

--------------------------------

### GET /v1/organization/usage/embeddings

Source: https://platform.openai.com/docs/api-reference/usage/vector_stores_object

Get embeddings usage details for the organization.

```APIDOC
## GET /v1/organization/usage/embeddings

### Description
Get embeddings usage details for the organization.

### Method
GET

### Endpoint
/v1/organization/usage/embeddings

### Parameters
#### Query Parameters
- **start_time** (integer) - Required - Start time (Unix seconds) of the query time range, inclusive.
- **api_key_ids** (array) - Optional - Return only usage for these API keys.
- **bucket_width** (string) - Optional - Defaults to 1d - Width of each time bucket in response. Currently `1m`, `1h` and `1d` are supported, default to `1d`.
- **end_time** (integer) - Optional - End time (Unix seconds) of the query time range, exclusive.
- **group_by** (array) - Optional - Group the usage data by the specified fields. Support fields include `project_id`, `user_id`, `api_key_id`, `model` or any combination of them.
- **limit** (integer) - Optional - Specifies the number of buckets to return.
  * `bucket_width=1d`: default: 7, max: 31
  * `bucket_width=1h`: default: 24, max: 168
  * `bucket_width=1m`: default: 60, max: 1440
- **models** (array) - Optional - Return only usage for these models.
- **page** (string) - Optional - A cursor for use in pagination. Corresponding to the `next_page` field from the previous response.
- **project_ids** (array) - Optional - Return only usage for these projects.
- **user_ids** (array) - Optional - Return only usage for these users.

### Request Example
```bash
curl "https://api.openai.com/v1/organization/usage/embeddings?start_time=1730419200&limit=1" \\
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \\
-H "Content-Type: application/json"
```

### Response
A list of paginated, time bucketed Embeddings usage objects.

#### Success Response (200)
- **object** (string) - Description: "page"
- **data** (array) - Description: A list of bucket objects, each containing usage results for a specific time period.
- **has_more** (boolean) - Description: Indicates if there are more pages of results available.
- **next_page** (string) - Description: A cursor for fetching the next page of results. Null if no more pages.

#### Response Example
```json
{
    "object": "page",
    "data": [
        {
            "object": "bucket",
            "start_time": 1730419200,
            "end_time": 1730505600,
            "results": [
                {
                    "object": "organization.usage.embeddings.result",
                    "input_tokens": 16,
                    "num_model_requests": 2,
                    "project_id": null,
                    "user_id": null,
                    "api_key_id": null,
                    "model": null
                }
            ]
        }
    ],
    "has_more": false,
    "next_page": null
}
```
```

--------------------------------

### GET /videos/{video_id}/content - Supporting Assets

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=Upside-Down-City

Download lightweight supporting assets for completed videos, including thumbnails (WebP) and spritesheets (JPG). Use the `variant` query parameter to specify the asset type needed for previews, scrubbers, or catalog displays.

```APIDOC
## GET /videos/{video_id}/content - Supporting Assets

### Description
Download lightweight supporting assets (thumbnail or spritesheet) for completed videos. These assets are useful for previews, video scrubbers, or catalog displays.

### Method
GET

### Endpoint
```
https://api.openai.com/v1/videos/{video_id}/content?variant={variant_type}
```

### Parameters

#### Path Parameters
- **video_id** (string) - Required - The ID of the video (e.g., "video_abc123")

#### Query Parameters
- **variant** (string) - Optional - Type of asset to download:
  - `video` (default) - MP4 video file
  - `thumbnail` - WebP image for preview
  - `spritesheet` - JPG image showing keyframes

### Request Headers
- **Authorization** (string) - Required - Bearer token: `Bearer $OPENAI_API_KEY`

### Response

#### Success Response (200)
Binary image data

#### Response Headers (by variant)
- **thumbnail**: Content-Type: image/webp
- **spritesheet**: Content-Type: image/jpeg

### cURL Examples

#### Download Thumbnail
```bash
curl -L "https://api.openai.com/v1/videos/video_abc123/content?variant=thumbnail" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  --output thumbnail.webp
```

#### Download Spritesheet
```bash
curl -L "https://api.openai.com/v1/videos/video_abc123/content?variant=spritesheet" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  --output spritesheet.jpg
```

### Asset Types
- **Thumbnail** - Single WebP image for video preview in galleries or player UI
- **Spritesheet** - JPG image containing keyframes for video scrubber previews

### Important Notes
- Download URLs expire 1 hour after video generation
- Assets are lightweight and suitable for web display
- Spritesheets are particularly useful for implementing hover previews in video players
```

--------------------------------

### POST /v1/assistants

Source: https://platform.openai.com/docs/api-reference/assistants/createAssistant

Creates a new assistant with specified configuration, including tools like code interpreter. The assistant can be configured with instructions, a name, tools, and a model selection. Returns an assistant object with a unique ID.

```APIDOC
## POST /v1/assistants

### Description
Creates a new assistant that can use tools and follow instructions. This endpoint allows you to configure an AI assistant with specific capabilities like code interpretation.

### Method
POST

### Endpoint
https://api.openai.com/v1/assistants

### Request Headers
- **Content-Type** (string) - Required - application/json
- **Authorization** (string) - Required - Bearer $OPENAI_API_KEY
- **OpenAI-Beta** (string) - Required - assistants=v2

### Request Body
- **instructions** (string) - Required - System instructions for the assistant behavior
- **name** (string) - Required - The name of the assistant
- **tools** (array) - Required - Array of tools the assistant can use (e.g., {"type": "code_interpreter"})
- **model** (string) - Required - The model to use (e.g., "gpt-4o")
- **description** (string) - Optional - Description of the assistant
- **metadata** (object) - Optional - Custom metadata for the assistant
- **temperature** (number) - Optional - Sampling temperature between 0 and 2
- **top_p** (number) - Optional - Nucleus sampling parameter
- **response_format** (string) - Optional - Format for responses (e.g., "auto")

### Request Example
```
curl "https://api.openai.com/v1/assistants" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -H "OpenAI-Beta: assistants=v2" \\
  -d '{
    "instructions": "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
    "name": "Math Tutor",
    "tools": [{"type": "code_interpreter"}],
    "model": "gpt-4o"
  }'
```

### Response
#### Success Response (200 OK)
- **id** (string) - Unique identifier for the assistant
- **object** (string) - Object type ("assistant")
- **created_at** (integer) - Unix timestamp of creation
- **name** (string) - Name of the assistant
- **description** (string) - Description of the assistant
- **model** (string) - Model used by the assistant
- **instructions** (string) - System instructions
- **tools** (array) - Array of enabled tools
- **metadata** (object) - Custom metadata
- **temperature** (number) - Sampling temperature
- **top_p** (number) - Nucleus sampling parameter
- **response_format** (string) - Response format configuration

#### Response Example
```
{
  "id": "asst_abc123",
  "object": "assistant",
  "created_at": 1698984975,
  "name": "Math Tutor",
  "description": null,
  "model": "gpt-4o",
  "instructions": "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "metadata": {},
  "top_p": 1.0,
  "temperature": 1.0,
  "response_format": "auto"
}
```
```

--------------------------------

### GET /v1/organization/usage/embeddings

Source: https://platform.openai.com/docs/api-reference/usage/embeddings_object

Get embeddings usage details for the organization over a specified time range.

```APIDOC
## GET /v1/organization/usage/embeddings

### Description
Get embeddings usage details for the organization.

### Method
GET

### Endpoint
/v1/organization/usage/embeddings

### Parameters
#### Path Parameters
(None)

#### Query Parameters
- **start_time** (integer) - Required - Start time (Unix seconds) of the query time range, inclusive.
- **api_key_ids** (array) - Optional - Return only usage for these API keys.
- **bucket_width** (string) - Optional - Defaults to `1d`. Width of each time bucket in response. Currently `1m`, `1h` and `1d` are supported.
- **end_time** (integer) - Optional - End time (Unix seconds) of the query time range, exclusive.
- **group_by** (array) - Optional - Group the usage data by the specified fields. Supported fields include `project_id`, `user_id`, `api_key_id`, `model` or any combination of them.
- **limit** (integer) - Optional - Specifies the number of buckets to return. Default values vary based on `bucket_width`: `1d`: 7 (max: 31); `1h`: 24 (max: 168); `1m`: 60 (max: 1440).
- **models** (array) - Optional - Return only usage for these models.
- **page** (string) - Optional - A cursor for use in pagination. Corresponding to the `next_page` field from the previous response.
- **project_ids** (array) - Optional - Return only usage for these projects.
- **user_ids** (array) - Optional - Return only usage for these users.

#### Request Body
(None)

### Request Example
```
curl "https://api.openai.com/v1/organization/usage/embeddings?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"
```

### Response
#### Success Response (200)
A list of paginated, time bucketed Embeddings usage objects.
- **object** (string) - The type of object, typically "page".
- **data** (array) - A list of usage buckets.
  - **object** (string) - The type of object, typically "bucket".
  - **start_time** (integer) - The start time (Unix seconds) of the usage bucket.
  - **end_time** (integer) - The end time (Unix seconds) of the usage bucket.
  - **results** (array) - A list of embeddings usage results within the bucket.
    - **object** (string) - The type of object, typically "organization.usage.embeddings.result".
    - **input_tokens** (integer) - The aggregated number of input tokens used.
    - **num_model_requests** (integer) - The count of requests made to the model.
    - **project_id** (string, nullable) - The project ID if grouped by `project_id`.
    - **user_id** (string, nullable) - The user ID if grouped by `user_id`.
    - **api_key_id** (string, nullable) - The API key ID if grouped by `api_key_id`.
    - **model** (string, nullable) - The model name if grouped by `model`.
- **has_more** (boolean) - Indicates if there are more pages of results.
- **next_page** (string, nullable) - A cursor for the next page of results, if `has_more` is true.

#### Response Example
```
{
    "object": "page",
    "data": [
        {
            "object": "bucket",
            "start_time": 1730419200,
            "end_time": 1730505600,
            "results": [
                {
                    "object": "organization.usage.embeddings.result",
                    "input_tokens": 16,
                    "num_model_requests": 2,
                    "project_id": null,
                    "user_id": null,
                    "api_key_id": null,
                    "model": null
                }
            ]
        }
    ],
    "has_more": false,
    "next_page": null
}
```
```

--------------------------------

### Push-to-Talk Configuration Overview

Source: https://platform.openai.com/docs/guides/realtime-mcp

General overview of push-to-talk implementation considerations and differences between WebSocket and WebRTC approaches for the Realtime API.

```APIDOC
## Push-to-Talk Overview

### Description
Push-to-talk is an alternative to voice activity detection (VAD) for controlling when audio input is sent to the model. It provides user control, avoids VAD failures, and creates responsive interactions.

### Key Concepts

#### Default Behavior (VAD Enabled)
- Voice activity detection automatically triggers model responses
- Model responds when speech is detected

#### Push-to-Talk Behavior
- VAD is disabled (`turn_detection: null`)
- Application controls when audio is submitted
- User typically holds button/key to capture audio
- Release triggers model response

### Advantages
- **User Control**: Explicit control over when responses are triggered
- **No VAD Failures**: Avoids voice activity detection errors
- **Responsive**: No waiting for VAD timeout detection
- **Snappy UX**: Immediate feedback on button release

### Connection Type Differences

#### WebSocket Connections
- All events sent in same channel
- Unified event ordering
- Simpler event handling

#### WebRTC Connections
- Separate channels for audio and control events
- Explicit buffer management required
- More granular control over audio streams

### Common Configuration
```
Session Update Event:
{
  "type": "session.update",
  "session": {
    "turn_detection": null
  }
}
```

### Use Cases
- Mobile applications
- Walkie-talkie style interfaces
- Applications requiring explicit user control
- Scenarios with unreliable VAD performance
```

--------------------------------

### POST /videos

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=Space-Race

Starts a new video generation job based on a text prompt and specified parameters like video size and duration.

```APIDOC
## POST /videos

### Description
Starts a new video generation job. The prompt defines the creative look and feel, while parameters control resolution and length.

### Method
POST

### Endpoint
/v1/videos

### Parameters
#### Request Body
- **prompt** (string) - Required - The text prompt defining the video content (e.g., subjects, camera, lighting, motion).
- **model** (string) - Required - The model to use for video generation (e.g., "sora-2", "sora-2-pro").
- **size** (string) - Optional - The resolution of the video (e.g., "1280x720").
- **seconds** (string) - Optional - The duration of the video in seconds (e.g., "8").

### Request Example
```bash
curl -X POST "https://api.openai.com/v1/videos" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F prompt="Wide tracking shot of a teal coupe driving through a desert highway, heat ripples visible, hard sun overhead." \
  -F model="sora-2-pro" \
  -F size="1280x720" \
  -F seconds="8"
```

### Response
#### Success Response (200)
- **id** (string) - Unique identifier for the video generation job.
- **object** (string) - Type of object, usually "video".
- **created_at** (integer) - Timestamp of when the job was created.
- **status** (string) - Initial status of the job (e.g., "queued", "in_progress").
- **model** (string) - The model used for generation.
- **progress** (integer) - Current progress percentage (0-100), typically 0 at creation.
- **seconds** (string) - The requested duration of the video.
- **size** (string) - The requested resolution of the video.

#### Response Example
```json
{
  "id": "video_68d7512d07848190b3e45da0ecbebcde004da08e1e0678d5",
  "object": "video",
  "created_at": 1758941485,
  "status": "queued",
  "model": "sora-2-pro",
  "progress": 0,
  "seconds": "8",
  "size": "1280x720"
}
```
```

--------------------------------

### Example Vector Stores Usage Object (JSON)

Source: https://platform.openai.com/docs/api-reference/usage/audio_speeches_object

This JSON object provides a detailed example of an aggregated vector stores usage result. It shows the total `usage_bytes` and the `project_id` associated with that usage, typically when data is grouped by project.

```json
{
    "object": "organization.usage.vector_stores.result",
    "usage_bytes": 1024,
    "project_id": "proj_abc"
}
```

--------------------------------

### GET /v1/organization/admin_api_keys/{key_id}

Source: https://platform.openai.com/docs/api-reference/admin-api-keys/listget

Get details for a specific organization API key by its ID.

```APIDOC
## GET /v1/organization/admin_api_keys/{key_id}

### Description
Get details for a specific organization API key by its ID.

### Method
GET

### Endpoint
https://api.openai.com/v1/organization/admin_api_keys/{key_id}

### Parameters
#### Path Parameters
- **key_id** (string) - Required - The ID of the admin API key to retrieve.

#### Query Parameters
(None)

#### Request Body
(None)

### Request Example
```
curl https://api.openai.com/v1/organization/admin_api_keys/key_abc \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json"
```

### Response
#### Success Response (200)
The requested AdminApiKey object.

#### Response Example
```
{
  "object": "organization.admin_api_key",
  "id": "key_abc",
  "name": "Main Admin Key",
  "redacted_value": "sk-admin...xyz",
  "created_at": 1711471533,
  "last_used_at": 1711471534,
  "owner": {
    "type": "user",
    "object": "organization.user",
    "id": "user_123",
    "name": "John Doe",
    "created_at": 1711471533,
    "role": "owner"
  }
}
```
```

--------------------------------

### POST /v1/assistants

Source: https://platform.openai.com/docs/api-reference/assistants/deleteAssistant

Create a new assistant with specified instructions, model, and tools. This endpoint returns an assistant object that can be used for conversations and task execution. The example demonstrates creating a math tutor assistant with code interpreter capabilities.

```APIDOC
## POST /v1/assistants

### Description
Create a new assistant with custom instructions, model selection, and tools configuration. Returns an assistant object that can be used for conversations.

### Method
POST

### Endpoint
https://api.openai.com/v1/assistants

### Headers
- **Content-Type** (string) - Required - application/json
- **Authorization** (string) - Required - Bearer $OPENAI_API_KEY
- **OpenAI-Beta** (string) - Required - assistants=v2

### Request Body
- **name** (string) - Required - The name of the assistant
- **instructions** (string) - Required - System instructions for the assistant behavior
- **model** (string) - Required - The model to use (e.g., gpt-4o)
- **tools** (array) - Required - Array of tools available to the assistant
- **tools[].type** (string) - Required - Type of tool (e.g., code_interpreter)

### Request Example
```json
{
  "instructions": "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
  "name": "Math Tutor",
  "tools": [{"type": "code_interpreter"}],
  "model": "gpt-4o"
}
```

### Response
#### Success Response (200)
- **id** (string) - The unique identifier for the assistant
- **object** (string) - The object type (always "assistant")
- **created_at** (integer) - Unix timestamp of creation
- **name** (string) - The name of the assistant
- **description** (string) - Optional description of the assistant
- **model** (string) - The model used by the assistant
- **instructions** (string) - The system instructions for the assistant
- **tools** (array) - Array of tools configured for the assistant
- **metadata** (object) - Additional metadata
- **top_p** (number) - Top-p sampling parameter
- **temperature** (number) - Temperature parameter for response generation
- **response_format** (string) - Response format setting

#### Response Example
```json
{
  "id": "asst_abc123",
  "object": "assistant",
  "created_at": 1698984975,
  "name": "Math Tutor",
  "description": null,
  "model": "gpt-4o",
  "instructions": "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "metadata": {},
  "top_p": 1.0,
  "temperature": 1.0,
  "response_format": "auto"
}
```
```

--------------------------------

### POST /v1/responses - Create Response with File Input

Source: https://platform.openai.com/docs/quickstart

Create a response from the model using uploaded files as input. Combine file inputs with text prompts to analyze documents and extract information. The model processes both the file content and the accompanying text query.

```APIDOC
## POST /v1/responses

### Description
Create a response using the specified model with file and text inputs. The model analyzes the file content based on your prompt.

### Method
POST

### Endpoint
https://api.openai.com/v1/responses

### Headers
- **Authorization** (string) - Required - Bearer token for authentication
- **Content-Type** (string) - Required - application/json

### Request Body
- **model** (string) - Required - Model identifier, e.g., "gpt-5"
- **input** (array) - Required - Array of input messages with content
  - **role** (string) - Required - Role of the message sender, e.g., "user"
  - **content** (array) - Required - Array of content parts
    - **type** (string) - Required - Type of content: "input_text" or "input_file"
    - **text** (string) - Required if type is "input_text" - Text content of the message
    - **file_id** (string) - Required if type is "input_file" - ID of the uploaded file

### Request Example
```json
{
  "model": "gpt-5",
  "input": [
    {
      "role": "user",
      "content": [
        {
          "type": "input_file",
          "file_id": "file-6F2ksmvXxt4VdoqmHRw6kL"
        },
        {
          "type": "input_text",
          "text": "What is the first dragon in the book?"
        }
      ]
    }
  ]
}
```

### Response
#### Success Response (200)
- **id** (string) - Unique identifier for the response
- **model** (string) - Model used for generating the response
- **output_text** (string) - The generated response text
- **usage** (object) - Token usage information
  - **prompt_tokens** (integer) - Number of tokens in the prompt
  - **completion_tokens** (integer) - Number of tokens in the completion

#### Response Example
```json
{
  "id": "response-abc123",
  "model": "gpt-5",
  "output_text": "The first dragon mentioned in the book is Alduin, a powerful black dragon...",
  "usage": {
    "prompt_tokens": 1250,
    "completion_tokens": 150
  }
}
```
```

--------------------------------

### List Eval Run Output Items with OpenAI SDKs

Source: https://platform.openai.com/docs/api-reference/evals/getRunOutputItem

These examples demonstrate how to programmatically retrieve a list of EvalRunOutputItem objects using the OpenAI Python and Node.js client libraries. Both examples initialize the client and then call the `evals.runs.output_items.list` method, passing the evaluation group ID and run ID as arguments. The results are then printed to the console.

```python
from openai import OpenAI
client = OpenAI()

output_items = client.evals.runs.output_items.list(
  "egroup_67abd54d9b0081909a86353f6fb9317a",
  "erun_67abd54d60ec8190832b46859da808f7"
)
print(output_items)
```

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const outputItems = await openai.evals.runs.outputItems.list(
  "egroup_67abd54d9b0081909a86353f6fb9317a",
  "erun_67abd54d60ec8190832b46859da808f7"
);
console.log(outputItems);
```

--------------------------------

### POST /videos

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=chameleon

Start a new video rendering job by providing a text prompt and video parameters. The response includes a unique job ID and initial status.

```APIDOC
## POST /videos

### Description
Start a new video rendering job by providing a text prompt and video parameters. The prompt defines the creative look and feel (subjects, camera, lighting, motion), while parameters like `size` and `seconds` control the video's resolution and length.

### Method
POST

### Endpoint
/v1/videos

### Parameters
#### Request Body (multipart/form-data)
- **prompt** (string) - Required - The text prompt defining the creative look and feel for the video.
- **model** (string) - Required - The model to use for video generation (e.g., "sora-2", "sora-2-pro").
- **size** (string) - Optional - The desired resolution of the video (e.g., "1280x720").
- **seconds** (string) - Optional - The desired length of the video in seconds.

### Request Example
```curl
curl -X POST "https://api.openai.com/v1/videos" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F prompt="Wide tracking shot of a teal coupe driving through a desert highway, heat ripples visible, hard sun overhead." \
  -F model="sora-2-pro" \
  -F size="1280x720" \
  -F seconds="8" \
```

### Response
#### Success Response (200)
- **id** (string) - Unique identifier for the video job.
- **object** (string) - Type of object, typically "video".
- **created_at** (integer) - Unix timestamp when the job was created.
- **status** (string) - Current status of the video job (e.g., `queued`, `in_progress`).
- **model** (string) - The model used for generation.
- **progress** (integer) - Current progress percentage (0-100). Only available for `in_progress` status.
- **seconds** (string) - Requested video length.
- **size** (string) - Requested video resolution.

#### Response Example
```json
{
  "id": "video_68d7512d07848190b3e45da0ecbebcde004da08e1e0678d5",
  "object": "video",
  "created_at": 1758941485,
  "status": "queued",
  "model": "sora-2-pro",
  "progress": 0,
  "seconds": "8",
  "size": "1280x720"
}
```
```

--------------------------------

### Call OpenAI Responses API with Shell Tool

Source: https://platform.openai.com/docs/guides/tools-shell

These examples demonstrate how to initiate a request to the OpenAI Responses API, explicitly including the 'shell' tool. They specify the shell environment and an input prompt, showcasing the API call in both Python and JavaScript using their respective client libraries.

```python
from openai import OpenAI
client = OpenAI()

response = client.responses.create(
    model="gpt-5.1",
    instructions="The local bash shell environment is on Mac.",
    input="find me the largest pdf file in ~/Documents",
    tools=[{"type": "shell"}],
)
print(response)
```

```javascript
const client = new OpenAI();

const response = await client.responses.create({
    model: "gpt-5.1",
    instructions: "The local bash shell environment is on Mac.",
    input: "find me the largest pdf file in ~/Documents",
    tools: [{"type": "shell"}],
});

console.log(response);
```

--------------------------------

### Perform Multi-Turn Image Generation with OpenAI Responses API

Source: https://platform.openai.com/docs/guides/image-generation_api=responses&gallery=open&galleryItem=ceramic-mug

This snippet demonstrates how to perform multi-turn image generation using the OpenAI Responses API. The Node.js example shows both initiating an image generation and then refining it in a subsequent turn by utilizing the `previous_response_id`. The Python example illustrates the initial image generation step. Both examples save the generated Base64 encoded image data to PNG files.

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5",
  input:
    "Generate an image of gray tabby cat hugging an otter with an orange scarf",
  tools: [{ type: "image_generation" }],
});

const imageData = response.output
  .filter((output) => output.type === "image_generation_call")
  .map((output) => output.result);

if (imageData.length > 0) {
  const imageBase64 = imageData[0];
  const fs = await import("fs");
  fs.writeFileSync("cat_and_otter.png", Buffer.from(imageBase64, "base64"));
}

// Follow up

const response_fwup = await openai.responses.create({
  model: "gpt-5",
  previous_response_id: response.id,
  input: "Now make it look realistic",
  tools: [{ type: "image_generation" }],
});

const imageData_fwup = response_fwup.output
  .filter((output) => output.type === "image_generation_call")
  .map((output) => output.result);

if (imageData_fwup.length > 0) {
  const imageBase64 = imageData_fwup[0];
  const fs = await import("fs");
  fs.writeFileSync(
    "cat_and_otter_realistic.png",
    Buffer.from(imageBase64, "base64")
  );
}
```

```python
from openai import OpenAI
import base64

client = OpenAI()

response = client.responses.create(
    model="gpt-5",
    input="Generate an image of gray tabby cat hugging an otter with an orange scarf",
    tools=[{"type": "image_generation"}],
)

image_data = [
    output.result
    for output in response.output
    if output.type == "image_generation_call"
]

if image_data:
    image_base64 = image_data[0]

    with open("cat_and_otter.png", "wb") as f:
        f.write(base64.b64decode(image_base64))

```

--------------------------------

### Content Guidelines and Prompting Best Practices

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=mushroom-network

Learn about API content restrictions, guardrails, and effective prompting techniques to ensure successful video generation. Includes recommendations for describing shot type, subject, action, setting, and lighting.

```APIDOC
## Content Restrictions and Guidelines

### Guardrails and Restrictions
The API enforces the following content restrictions:

- **Age Appropriateness** - Only content suitable for audiences under 18 (a setting to bypass this restriction will be available in the future)
- **Copyright Protection** - Copyrighted characters and copyrighted music will be rejected
- **Real People** - Real people, including public figures, cannot be generated
- **Face Detection** - Input images with faces of humans are currently rejected

Make sure prompts, reference images, and transcripts respect these rules to avoid failed generations.

### Effective Prompting
For best results, describe the following elements in your prompt:

1. **Shot Type** - Wide shot, close-up, tracking shot, etc.
2. **Subject** - What or who is in the video
3. **Action** - What is happening or moving
4. **Setting** - Location and environment
5. **Lighting** - Light quality and direction

### Prompt Examples

**Example 1 - Landscape Scene**
```
Wide shot of a child flying a red kite in a grassy park, golden hour sunlight, camera slowly pans upward.
```

**Example 2 - Close-up Scene**
```
Close-up of a steaming coffee cup on a wooden table, morning light through blinds, soft depth of field.
```

**Example 3 - Motion Scene**
```
Wide tracking shot of a teal coupe driving through a desert highway, heat ripples visible, hard sun overhead.
```

This level of specificity helps the model produce consistent results without inventing unwanted details.

### Performance Considerations

- **Generation Time** - A single render may take several minutes depending on model, API load, and resolution
- **Polling Strategy** - Poll at reasonable intervals (every 10-20 seconds) and use exponential backoff if necessary
- **User Feedback** - Provide feedback to users that the job is still in progress during long operations
- **Webhook Alternative** - Consider using webhooks for notifications instead of continuous polling
```

--------------------------------

### Generate Initial Image with OpenAI Responses API in Python

Source: https://platform.openai.com/docs/guides/image-generation_api=responses&gallery=open&galleryItem=abstract-orbit

This Python example demonstrates the initial step of image generation using the OpenAI Responses API. It sends a text prompt to generate an image, extracts the base64 encoded image data from the API response, and saves it as a PNG file. This can serve as the first turn in a multi-turn image generation conversation.

```python
from openai import OpenAI
import base64

client = OpenAI()

response = client.responses.create(
    model="gpt-5",
    input="Generate an image of gray tabby cat hugging an otter with an orange scarf",
    tools=[{"type": "image_generation"}],
)

image_data = [
    output.result
    for output in response.output
    if output.type == "image_generation_call"
]

if image_data:
    image_base64 = image_data[0]

    with open("cat_and_otter.png", "wb") as f:
        f.write(base64.b64decode(image_base64))

```

--------------------------------

### GET /videos/{video_id} - Get Video Status

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=coloring

Retrieves the current status and details of a specific video generation job using its unique ID.

```APIDOC
## GET /videos/{video_id}

### Description
Retrieve the current state of a render job and monitor its progress until it transitions to `completed` or `failed`.

### Method
GET

### Endpoint
/videos/{video_id}

### Parameters
#### Path Parameters
- **video_id** (string) - Required - The unique identifier of the video generation job.

### Request Example
(No request body for GET)

### Response
#### Success Response (200)
- **id** (string) - The unique identifier for the video generation job.
- **status** (string) - The current status of the job (e.g., "processing", "completed", "failed").
- **created_at** (string) - Timestamp when the job was created.
- **completed_at** (string) - Timestamp when the job was completed (if applicable).
- **model** (string) - The model used for generation.
- **output_url** (string) - URL to the generated video content (only available when `status` is "completed").
- **error** (object) - Details of the error if the job `status` is "failed".

#### Response Example
```json
{
  "id": "vid_abc123def456",
  "status": "completed",
  "created_at": "2023-10-27T10:00:00Z",
  "completed_at": "2023-10-27T10:05:30Z",
  "model": "sora-2",
  "output_url": "https://openai.com/sora/videos/vid_abc123def456.mp4"
}
```
```

--------------------------------

### List Evaluation Runs - Python

Source: https://platform.openai.com/docs/api-reference/evals/create

Python SDK example for listing evaluation runs using the OpenAI client library. Demonstrates how to retrieve and print run data.

```APIDOC
## List Evaluation Runs - Python

### Description
Python code example for listing evaluation runs using the OpenAI SDK.

### Code Example
```python
from openai import OpenAI

client = OpenAI()

runs = client.evals.runs.list("egroup_67abd54d9b0081909a86353f6fb9317a")
print(runs)
```

### Usage
1. Import the OpenAI client
2. Initialize the client (uses OPENAI_API_KEY environment variable by default)
3. Call `client.evals.runs.list()` with the evaluation group ID
4. The response contains a list of EvalRun objects

### Returns
A list object containing EvalRun objects with status, results, and metrics.
```

--------------------------------

### GET /v1/organization/usage/audio_speeches

Source: https://platform.openai.com/docs/api-reference/usage/costs

Get audio speeches usage details for the organization, allowing for time-based aggregation and filtering.

```APIDOC
## GET /v1/organization/usage/audio_speeches

### Description
Get audio speeches usage details for the organization.

### Method
GET

### Endpoint
/v1/organization/usage/audio_speeches

### Parameters
#### Query Parameters
- **start_time** (integer) - Required - Start time (Unix seconds) of the query time range, inclusive.
- **api_key_ids** (array) - Optional - Return only usage for these API keys.
- **bucket_width** (string) - Optional - Defaults to `1d`. Width of each time bucket in response. Currently `1m`, `1h` and `1d` are supported.
- **end_time** (integer) - Optional - End time (Unix seconds) of the query time range, exclusive.
- **group_by** (array) - Optional - Group the usage data by the specified fields. Supported fields include `project_id`, `user_id`, `api_key_id`, `model` or any combination of them.
- **limit** (integer) - Optional - Specifies the number of buckets to return. `bucket_width=1d`: default: 7, max: 31; `bucket_width=1h`: default: 24, max: 168; `bucket_width=1m`: default: 60, max: 1440.
- **models** (array) - Optional - Return only usage for these models.
- **page** (string) - Optional - A cursor for use in pagination. Corresponding to the `next_page` field from the previous response.
- **project_ids** (array) - Optional - Return only usage for these projects.
- **user_ids** (array) - Optional - Return only usage for these users.

### Response
#### Success Response (200)
A list of paginated, time-bucketed audio speeches usage objects, similar in structure to the image usage response.
```

--------------------------------

### POST /v1/responses - Web Search Tool

Source: https://platform.openai.com/docs/quickstart_api-mode=responses

Create a response using the web search tool to give the model access to current web information. This endpoint allows the model to search the internet and incorporate real-time data into its responses.

```APIDOC
## POST /v1/responses

### Description
Create a response with web search capability enabled. This allows the model to search the web and access current information to answer user queries.

### Method
POST

### Endpoint
/v1/responses

### Request Body
- **model** (string) - Required - The model to use (e.g., "gpt-5")
- **tools** (array) - Required - Array of tools to attach to the model
  - **type** (string) - Required - Tool type: "web_search"
- **input** (string) - Required - The user query or prompt

### Request Example
```json
{
  "model": "gpt-5",
  "tools": [
    {"type": "web_search"}
  ],
  "input": "What was a positive news story from today?"
}
```

### Response
#### Success Response (200)
- **output_text** (string) - The model's response incorporating web search results

### cURL Example
```bash
curl "https://api.openai.com/v1/responses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5",
    "tools": [{"type": "web_search"}],
    "input": "what was a positive news story from today?"
  }'
```
```

--------------------------------

### GET /v1/evals/{eval_id}/runs/{run_id}/output_items

Source: https://platform.openai.com/docs/api-reference/evals/getRun

Get a list of output items for an evaluation run. This endpoint supports pagination, filtering, and sorting.

```APIDOC
## GET /v1/evals/{eval_id}/runs/{run_id}/output_items

### Description
Get a list of output items for an evaluation run.

### Method
GET

### Endpoint
/v1/evals/{eval_id}/runs/{run_id}/output_items

### Parameters
#### Path Parameters
- **eval_id** (string) - Required - The ID of the evaluation to retrieve runs for.
- **run_id** (string) - Required - The ID of the run to retrieve output items for.

#### Query Parameters
- **after** (string) - Optional - Identifier for the last output item from the previous pagination request.
- **limit** (integer) - Optional - Defaults to 20 - Number of output items to retrieve.
- **order** (string) - Optional - Defaults to asc - Sort order for output items by timestamp. Use `asc` for ascending order or `desc` for descending order.
- **status** (string) - Optional - Filter output items by status. Use `failed` to filter by failed output items or `pass` to filter by passed output items.

### Response
#### Success Response (200)
A paginated list of EvalRunOutputItem objects.

#### Response Example
```json
{
  "object": "list",
  "data": [
    {
      "object": "eval.run.output_item",
      "id": "outputitem_67e5796c28e081909917bf79f6e6214d",
      "created_at": 1743092076,
      "run_id": "evalrun_67abd54d60ec8190832b46859da808f7",
      "eval_id": "eval_67abd54d9b0081909a86353f6fb9317a",
      "status": "pass",
      "datasource_item_id": 5,
      "datasource_item": {
        "input": "Stock Markets Rally After Positive Economic Data Released",
        "ground_truth": "Markets"
      },
      "results": [
        {
          "name": "String check-a2486074-d803-4445-b431-ad2262e85d47",
          "sample": null,
          "passed": true,
          "score": 1.0
        }
      ],
      "sample": {
        "input": [
          {
            "role": "developer",
            "content": "..."
          }
        ],
        "output": [
          {
            "role": "assistant",
            "content": "Markets"
          }
        ],
        "finish_reason": "stop",
        "model": "gpt-4o-mini-2024-07-18",
        "usage": {
          "total_tokens": 325,
          "completion_tokens": 2,
          "prompt_tokens": 323,
          "cached_tokens": 0
        }
      }
    }
  ],
  "first_id": "outputitem_...",
  "last_id": "outputitem_...",
  "has_next_page": false
}
```
```

--------------------------------

### GET /v1/organization/certificates/{certificate_id}

Source: https://platform.openai.com/docs/api-reference/certificates/getCertificate

Retrieves details for a specific certificate that has been uploaded to the organization. You can get a certificate regardless of whether it is active or not.

```APIDOC
## GET /v1/organization/certificates/{certificate_id}

### Description
Retrieves details for a specific certificate that has been uploaded to the organization. You can get a certificate regardless of whether it is active or not.

### Method
GET

### Endpoint
/v1/organization/certificates/{certificate_id}

### Parameters
#### Path Parameters
- **certificate_id** (string) - Required - Unique ID of the certificate to retrieve.

#### Query Parameters
- **include** (array) - Optional - A list of additional fields to include in the response. Currently the only supported value is `content` to fetch the PEM content of the certificate.

### Request Example
(No specific request body for GET)

### Response
#### Success Response (200)
- **object** (string) - Type of object, typically "certificate"
- **id** (string) - Unique ID of the certificate
- **name** (string) - Name of the certificate
- **created_at** (integer) - Unix timestamp when the certificate was created
- **certificate_details** (object) - Details about the certificate's validity
  - **valid_at** (integer) - Unix timestamp when the certificate becomes valid
  - **expires_at** (integer) - Unix timestamp when the certificate expires
  - **content** (string) - The PEM content of the certificate (included if `include[]=content` was requested)

#### Response Example
{
  "object": "certificate",
  "id": "cert_abc",
  "name": "My Example Certificate",
  "created_at": 1234567,
  "certificate_details": {
    "valid_at": 1234567,
    "expires_at": 12345678,
    "content": "-----BEGIN CERTIFICATE-----MIIDeT...-----END CERTIFICATE-----"
  }
}
```

--------------------------------

### Create OpenAI Assistant with Code Interpreter - JavaScript

Source: https://platform.openai.com/docs/api-reference/assistants

Uses OpenAI JavaScript SDK to asynchronously create a new assistant with code interpreter tools. Initializes OpenAI client, defines assistant configuration, and logs the response. Requires async/await context.

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const myAssistant = await openai.beta.assistants.create({
    instructions:
      "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
    name: "Math Tutor",
    tools: [{ type: "code_interpreter" }],
    model: "gpt-4o",
  });

  console.log(myAssistant);
}

main();
```

--------------------------------

### GET /v1/evals/{eval_id}/runs

Source: https://platform.openai.com/docs/api-reference/evals/create

Get a list of runs for a specific evaluation. Retrieve paginated run results with optional filtering by status and sorting options.

```APIDOC
## GET /v1/evals/{eval_id}/runs

### Description
Get a list of runs for an evaluation. Retrieve paginated results of evaluation runs with optional status filtering and sorting.

### Method
GET

### Endpoint
https://api.openai.com/v1/evals/{eval_id}/runs

### Parameters
#### Path Parameters
- **eval_id** (string) - Required - The ID of the evaluation to retrieve runs for.

#### Query Parameters
- **after** (string) - Optional - Identifier for the last run from the previous pagination request.
- **limit** (integer) - Optional - Number of runs to retrieve. Defaults to 20.
- **order** (string) - Optional - Sort order for runs by timestamp. Use `asc` for ascending order or `desc` for descending order. Defaults to `asc`.
- **status** (string) - Optional - Filter runs by status. One of `queued`, `in_progress`, `failed`, `completed`, or `canceled`.

### Response
#### Success Response (200)
A list of runs for the specified evaluation matching the query parameters and filters.

#### Response Fields
- **object** (string) - The object type, will be "list".
- **data** (array) - Array of run objects.
- **first_id** (string) - The ID of the first run in the response.
- **last_id** (string) - The ID of the last run in the response.
- **has_more** (boolean) - Indicates if there are more runs available for pagination.
```

--------------------------------

### GET /v1/evals/{eval_id}/runs

Source: https://platform.openai.com/docs/api-reference/evals/run-output-item-object

Get a list of runs for a specific evaluation with support for pagination, sorting, and status filtering. Returns all runs associated with the evaluation ID.

```APIDOC
## GET /v1/evals/{eval_id}/runs

### Description
Get a list of runs for an evaluation with support for pagination, sorting, and status filtering.

### Method
GET

### Endpoint
https://api.openai.com/v1/evals/{eval_id}/runs

### Parameters
#### Path Parameters
- **eval_id** (string) - Required - The ID of the evaluation to retrieve runs for.

#### Query Parameters
- **after** (string) - Optional - Identifier for the last run from the previous pagination request.
- **limit** (integer) - Optional - Defaults to 20. Number of runs to retrieve.
- **order** (string) - Optional - Defaults to asc. Sort order for runs by timestamp. Use `asc` for ascending order or `desc` for descending order.
- **status** (string) - Optional - Filter runs by status. One of `queued`, `in_progress`, `failed`, `completed`, or `canceled`.

### Response
#### Success Response (200)
- **object** (string) - Type of object, always "list"
- **data** (array) - Array of run objects for the specified evaluation
- **first_id** (string) - ID of the first run in the list
- **last_id** (string) - ID of the last run in the list
- **has_more** (boolean) - Whether there are more runs available
```

--------------------------------

### POST /v1/responses - File Search Tool

Source: https://platform.openai.com/docs/quickstart_api-mode=responses

Create a response using the file search tool to search through uploaded files and vector stores. This enables the model to retrieve information from your documents and knowledge bases.

```APIDOC
## POST /v1/responses

### Description
Create a response with file search capability enabled. This allows the model to search through files in a vector store and retrieve relevant information from your documents.

### Method
POST

### Endpoint
/v1/responses

### Request Body
- **model** (string) - Required - The model to use (e.g., "gpt-4.1")
- **input** (string) - Required - The user query or prompt
- **tools** (array) - Required - Array of tools to attach to the model
  - **type** (string) - Required - Tool type: "file_search"
  - **vector_store_ids** (array) - Required - Array of vector store IDs to search within

### Request Example
```json
{
  "model": "gpt-4.1",
  "input": "What is deep research by OpenAI?",
  "tools": [
    {
      "type": "file_search",
      "vector_store_ids": ["<vector_store_id>"]
    }
  ]
}
```

### Response
#### Success Response (200)
- **output** (string) - The model's response with information retrieved from file search

### Authentication
- **Authorization** (header) - Bearer token with your OpenAI API key
```

--------------------------------

### Pricing and Cost Estimation

Source: https://platform.openai.com/docs/guides/image-generation_api=responses&gallery=open&galleryItem=colorize

Guide for understanding pricing models and calculating total costs for image generation requests. Combines token consumption with per-token pricing to determine final costs.

```APIDOC
## Image Generation Pricing

### Description
Pricing information for image generation services. Costs are calculated based on token consumption for both input and output, with different rates for text and image tokens.

### Pricing Components

#### Text Token Pricing
- **Rate**: Per text token (refer to pricing page for current rates)
- **Applied To**: Prompt text input
- **Calculation**: Number of text tokens in prompt × text token price

#### Image Token Pricing
- **Rate**: Per image token (refer to pricing page for current rates)
- **Applied To**: Input images (when editing) and output images
- **Calculation**: Number of image tokens × image token price

### Cost Calculation Breakdown

```
Total Cost = 
  (Prompt Text Tokens × Text Token Price) +
  (Input Image Tokens × Image Token Price) +
  (Output Image Tokens × Image Token Price)
```

### Factors Affecting Cost

1. **Image Dimensions**
   - Square (1024×1024): Lowest token cost
   - Portrait (1024×1536): Medium token cost
   - Landscape (1536×1024): Medium token cost

2. **Quality Settings**
   - Low: Base token cost (272-408 tokens)
   - Medium: 4× base cost (1056-1584 tokens)
   - High: 15× base cost (4160-6240 tokens)

3. **Input Fidelity**
   - Standard input: Lower token consumption
   - High input fidelity: Increased input token count

4. **Image Operations**
   - Generation only: Output tokens only
   - Image editing: Input + output tokens
   - Partial/streaming: +100 tokens per partial image

### Cost Optimization Tips

- Use **Low quality** for draft/testing purposes
- Use **square dimensions** to minimize token cost
- Avoid **high input fidelity** unless necessary
- Batch requests when possible

### Additional Resources

Refer to the [pricing page](https://openai.com/pricing) for:
- Current rates per text token
- Current rates per image token
- Volume discount information
- Billing details
```

--------------------------------

### Example JSON Response for Listing OpenAI Chat Completions

Source: https://platform.openai.com/docs/api-reference/chat/message-list

This is an example JSON response received when listing chat completions from the OpenAI API. It provides a list object containing individual `chat.completion` entries, each detailing ID, model, creation timestamp, usage statistics, and the assistant's generated message content.

```json
{
  "object": "list",
  "data": [
    {
      "object": "chat.completion",
      "id": "chatcmpl-AyPNinnUqUDYo9SAdA52NobMflmj2",
      "model": "gpt-4.1-2025-04-14",
      "created": 1738960610,
      "request_id": "req_ded8ab984ec4bf840f37566c1011c417",
      "tool_choice": null,
      "usage": {
        "total_tokens": 31,
        "completion_tokens": 18,
        "prompt_tokens": 13
      },
      "seed": 4944116822809979520,
      "top_p": 1.0,
      "temperature": 1.0,
      "presence_penalty": 0.0,
      "frequency_penalty": 0.0,
      "system_fingerprint": "fp_50cad350e4",
      "input_user": null,
      "service_tier": "default",
      "tools": null,
      "metadata": {},
      "choices": [
        {
          "index": 0,
          "message": {
            "content": "Mind of circuits hum,  \nLearning patterns in silence—  \nFuture's quiet spark.",
            "role": "assistant",
            "tool_calls": null,
            "function_call": null
          },
          "finish_reason": "stop",
          "logprobs": null
        }
      ],
      "response_format": null
    }
  ],
  "first_id": "chatcmpl-AyPNinnUqUDYo9SAdA52NobMflmj2",
  "last_id": "chatcmpl-AyPNinnUqUDYo9SAdA52NobMflmj2",
  "has_more": false
}
```

--------------------------------

### Example Eval Run Object Structure (JSON)

Source: https://platform.openai.com/docs/api-reference/evals/getRunOutputItem

This JSON object provides a concrete example of the 'eval.run' object's structure and typical values. It illustrates how an evaluation run's metadata, status, model, and data source are represented, including input-ground truth pairs for a completions-type evaluation.

```json
{
  "object": "eval.run",
  "id": "evalrun_67e57965b480819094274e3a32235e4c",
  "eval_id": "eval_67e579652b548190aaa83ada4b125f47",
  "report_url": "https://platform.openai.com/evaluations/eval_67e579652b548190aaa83ada4b125f47?run_id=evalrun_67e57965b480819094274e3a32235e4c",
  "status": "queued",
  "model": "gpt-4o-mini",
  "name": "gpt-4o-mini",
  "created_at": 1743092069,
  "result_counts": {
    "total": 0,
    "errored": 0,
    "failed": 0,
    "passed": 0
  },
  "per_model_usage": null,
  "per_testing_criteria_results": null,
  "data_source": {
    "type": "completions",
    "source": {
      "type": "file_content",
      "content": [
        {
          "item": {
            "input": "Tech Company Launches Advanced Artificial Intelligence Platform",
            "ground_truth": "Technology"
          }
        },
        {
          "item": {
            "input": "Central Bank Increases Interest Rates Amid Inflation Concerns",
            "ground_truth": "Markets"
          }
        },
        {
          "item": {
            "input": "International Summit Addresses Climate Change Strategies",
            "ground_truth": "World"
          }
        },
        {
          "item": {
            "input": "Major Retailer Reports Record-Breaking Holiday Sales",
            "ground_truth": "Business"
          }
        },
        {
          "item": {
            "input": "National Team Qualifies for World Championship Finals",
            "ground_truth": "Sports"
          }
        },
        {
          "item": {
            "input": "Stock Markets Rally After Positive Economic Data Released",
            "ground_truth": "Markets"
          }
        },
        {
          "item": {
            "input": "Global Manufacturer Announces Merger with Competitor",
            "ground_truth": "Business"
          }
        },
        {
          "item": {
            "input": "Breakthrough in Renewable Energy Technology Unveiled",
            "ground_truth": "Technology"
          }
        },
        {
          "item": {
            "input": "World Leaders Sign Historic Climate Agreement",
            "ground_truth": "World"
          }
        },
        {
          "item": {
            "input": "Professional Athlete Sets New Record in Championship Event",
            "ground_truth": "Sports"
          }
        },
        {
          "item": {
            "input": "Financial Institutions Adapt to New Regulatory Requirements",
            "ground_truth": "Business"
          }
        },
        {
          "item": {
            "input": "Tech Conference Showcases Advances in Artificial Intelligence",
            "ground_truth": "Technology"
          }
        },
        {
          "item": {
            "input": "Global Markets Respond to Oil Price Fluctuations",
            "ground_truth": "Markets"
          }
        },
        {
          "item": {
            "input": "International Cooperation Strengthened Through New Treaty",
            "ground_truth": "World"
          }
        }
      ]
    }
}
```

--------------------------------

### Code Examples - Delete Thread

Source: https://platform.openai.com/docs/api-reference/threads/object

Implementation examples for deleting a thread using official OpenAI client libraries in Python and JavaScript/Node.js.

```APIDOC
## Delete Thread - Code Examples

### Python
```python
from openai import OpenAI

client = OpenAI()

response = client.beta.threads.delete("thread_abc123")
print(response)
```

### JavaScript/Node.js
```javascript
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const response = await openai.beta.threads.delete("thread_abc123");
  console.log(response);
}

main();
```
```

--------------------------------

### POST /v1/videos (Generate Video with Image Reference)

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=Sleeping-Otters

This endpoint allows you to generate a new video using a text prompt and an optional input image reference. The input image acts as the first frame of the video, helping to preserve the look of specific assets or environments.

```APIDOC
## POST /v1/videos

### Description
Generates a new video from a text prompt, optionally using an input image as the first frame to guide the generation.

### Method
POST

### Endpoint
/v1/videos

### Parameters
#### Request Body
- **prompt** (string) - Required - The text prompt describing the desired video content.
- **model** (string) - Required - The model to use for video generation (e.g., `sora-2-pro`).
- **size** (string) - Required - The resolution of the target video (e.g., `1280x720`). The input reference image must match this resolution.
- **seconds** (integer) - Required - The duration of the video in seconds.
- **input_reference** (file) - Optional - An image file to use as the first frame of the video. Supported formats: `image/jpeg`, `image/png`, and `image/webp`.

### Request Example
```json
{
  "prompt": "She turns around and smiles, then slowly walks out of the frame.",
  "model": "sora-2-pro",
  "size": "1280x720",
  "seconds": 8,
  "input_reference": "file (e.g., @sample_720p.jpeg;type=image/jpeg)"
}
```

### Response
#### Success Response (200)
- **id** (string) - The ID of the generated video.
- **status** (string) - The current status of the video generation (e.g., "processing", "completed").
- **created_at** (integer) - Unix timestamp when the video generation job was created.

#### Response Example
```json
{
  "id": "video_abc123",
  "status": "processing",
  "created_at": 1678886400
}
```
```

--------------------------------

### Dockerfile: Add Firefox ESR and set as default browser

Source: https://platform.openai.com/docs/guides/tools-computer-use

Adds Mozilla Team PPA, installs Firefox ESR from the repository, and sets it as the default web browser. Cleans up package lists after installation.

```dockerfile
RUN add-apt-repository ppa:mozillateam/ppa \
  && apt-get update \
  && apt-get install -y --no-install-recommends firefox-esr \
  && update-alternatives --set x-www-browser /usr/bin/firefox-esr \
  && apt-get clean && rm -rf /var/lib/apt/lists/*
```

--------------------------------

### Create and Run Assistant with Thread - cURL

Source: https://platform.openai.com/docs/api-reference/runs/listRuns

Creates a new thread with initial messages and immediately starts a run with the specified assistant. This endpoint requires the OpenAI API key and Assistants v2 beta header. Returns a run object containing status, timestamps, and configuration details.

```bash
curl https://api.openai.com/v1/threads/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
      "assistant_id": "asst_abc123",
      "thread": {
        "messages": [
          {"role": "user", "content": "Explain deep learning to a 5 year old."}
        ]
      }
    }'
```

--------------------------------

### OpenAI Run Object JSON Schema Example

Source: https://platform.openai.com/docs/api-reference/runs/createRun

Complete JSON representation of a Run object showing all key properties including execution IDs, timestamps, status, model configuration, tools array, and metadata. This example demonstrates a completed run with file search and code interpreter tools enabled.

```json
{
  "id": "run_abc123",
  "object": "thread.run",
  "created_at": 1698107661,
  "assistant_id": "asst_abc123",
  "thread_id": "thread_abc123",
  "status": "completed",
  "started_at": 1699073476,
  "expires_at": null,
  "cancelled_at": null,
  "failed_at": null,
  "completed_at": 1699073498,
  "last_error": null,
  "model": "gpt-4o",
  "instructions": null,
  "tools": [{"type": "file_search"}, {"type": "code_interpreter"}]
}
```

--------------------------------

### Implement a Basic Shell Command Executor

Source: https://platform.openai.com/docs/guides/tools-shell

These examples provide basic implementations of a `ShellExecutor` class in Python and JavaScript. They demonstrate how to execute shell commands, capture their output (stdout, stderr), handle timeouts, and return execution results. These executors are designed to process commands received from the OpenAI API, but users are strongly advised to implement robust sandboxing and security checks.

```python
@dataclass
class CmdResult:
    stdout: str
    stderr: str
    exit_code: int | None
    timed_out: bool

class ShellExecutor:
    def __init__(self, default_timeout: float = 60):
        self.default_timeout = default_timeout

    def run(self, cmd: str, timeout: float | None = None) -> CmdResult:
        t = timeout or self.default_timeout
        p = subprocess.Popen(
            cmd,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        try:
            out, err = p.communicate(timeout=t)
            return CmdResult(out, err, p.returncode, False)
        except subprocess.TimeoutExpired:
            p.kill()
            out, err = p.communicate()
            return CmdResult(out, err, p.returncode, True)
```

```javascript
import { exec } from "node:child_process/promises";

class ShellExecutor {
    constructor(defaultTimeoutMs = 60_000) {
        this.defaultTimeoutMs = defaultTimeoutMs;
    }

    async run(cmd, timeoutMs) {
        const timeout = timeoutMs ?? this.defaultTimeoutMs;

        try {
            const { stdout, stderr } = await exec(cmd, { timeout });
            return { stdout, stderr, exitCode: 0, timedOut: false };
        } catch (error) {
            const timedOut = Boolean(error?.killed) && error?.signal === "SIGTERM";
            const exitCode = timedOut ? null : error?.code ?? null;
            return {
                stdout: error?.stdout ?? "",
                stderr: error?.stderr ?? String(error),
                exitCode,
                timedOut,
            };
        }
    }
}
```

--------------------------------

### GET /videos/{video_id} - Get Video Status

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=indie-cafe-rainy-window

Retrieves the current state and progress of a video generation job. Use this endpoint to poll for completion or monitor job status transitions.

```APIDOC
## GET /videos/{video_id}

### Description
Retrrieves the current status and metadata of a video generation job. The status field indicates whether the job is pending, processing, completed, or failed. Poll this endpoint to track progress or determine when the video is ready for download.

### Method
GET

### Endpoint
/videos/{video_id}

### Path Parameters
- **video_id** (string) - Required - The unique identifier of the video job returned from POST /videos

### Response
#### Success Response (200)
- **id** (string) - Unique identifier for the video job
- **status** (string) - Current job status: "pending", "processing", "completed", or "failed"
- **created_at** (string) - ISO 8601 timestamp of job creation
- **completed_at** (string) - ISO 8601 timestamp when job finished (null if not completed)
- **model** (string) - Model variant used for generation
- **error** (string) - Error message if status is "failed" (null otherwise)

#### Response Example
```json
{
  "id": "video_abc123xyz",
  "status": "completed",
  "created_at": "2024-01-15T10:30:00Z",
  "completed_at": "2024-01-15T10:45:30Z",
  "model": "sora-2-pro",
  "error": null
}
```
```

--------------------------------

### GET /videos/{video_id} - Get Video Status

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=fox-walk

Retrieve the current state of a render job and monitor its progress. Use this endpoint to poll for completion or check if a video is ready for download.

```APIDOC
## GET /videos/{video_id}

### Description
Retrieve the current state of a render job and monitor its progress. Poll this endpoint until status transitions to `completed`.

### Method
GET

### Endpoint
/videos/{video_id}

### Parameters
#### Path Parameters
- **video_id** (string) - Required - The unique identifier of the video job

### Response
#### Success Response (200)
- **id** (string) - Unique identifier for the video job
- **object** (string) - Resource type, always `video`
- **status** (string) - Current job status: `pending`, `processing`, or `completed`
- **created_at** (integer) - Unix timestamp of job creation
- **completed_at** (integer) - Unix timestamp when job completed (null if not finished)
- **model** (string) - Model used for generation
- **prompt** (string) - The prompt used to generate the video
- **duration** (integer) - Video duration in seconds

### Response Example
{
  "id": "video-abc123def456",
  "object": "video",
  "status": "completed",
  "created_at": 1704067200,
  "completed_at": 1704067320,
  "model": "sora-2-pro",
  "prompt": "A peaceful, cinematic scene of two sea otters floating side by side on calm, sunlit water",
  "duration": 8
}
```

--------------------------------

### Create Evaluation Run with Python OpenAI Client

Source: https://platform.openai.com/docs/api-reference/evals/delete

Use the official OpenAI Python client library to create an evaluation run programmatically. This example instantiates the client, calls the evals.runs.create method with evaluation configuration including a system prompt for headline classification, sampling parameters, and test data.

```python
from openai import OpenAI
client = OpenAI()

run = client.evals.runs.create(
  "eval_67e579652b548190aaa83ada4b125f47",
  name="gpt-4o-mini",
  data_source={
    "type": "completions",
    "input_messages": {
      "type": "template",
      "template": [
        {
          "role": "developer",
          "content": "Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output**: \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n"
        },
        {
          "role": "user",
          "content": "{{item.input}}"
        }
      ]
    },
    "sampling_params": {
      "temperature": 1,
      "max_completions_tokens": 2048,
      "top_p": 1,
      "seed": 42
    },
    "model": "gpt-4o-mini",
    "source": {
      "type": "file_content",
      "content": [
        {
          "item": {
            "input": "Tech Company Launches Advanced Artificial Intelligence Platform",
            "ground_truth": "Technology"
          }
        }
      ]
    }
  }
)
print(run)
```

--------------------------------

### GET /videos/{video_id} - Get Video Status

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=Space-Race

Retrieves the current state and progress of a video render job. Use this endpoint to poll for job completion or monitor rendering progress.

```APIDOC
## GET /videos/{video_id}

### Description
Retrieve the current status and metadata of a video render job. Polling this endpoint allows you to track job progress until completion.

### Method
GET

### Endpoint
/videos/{video_id}

### Parameters
#### Path Parameters
- **video_id** (string) - Required - The unique video job identifier returned from POST /videos

### Response
#### Success Response (200)
- **id** (string) - Video job identifier
- **status** (string) - Current job status: "processing", "completed", or "failed"
- **created_at** (string) - ISO 8601 timestamp of job creation
- **completed_at** (string) - ISO 8601 timestamp when job finished (null if not completed)
- **duration** (number) - Generated video duration in seconds
- **resolution** (object) - Video dimensions (width, height)

#### Response Example
{
  "id": "vid_12345abcde",
  "status": "completed",
  "created_at": "2024-01-15T10:30:00Z",
  "completed_at": "2024-01-15T10:45:30Z",
  "duration": 8,
  "resolution": {
    "width": 1792,
    "height": 1024
  }
}
```

--------------------------------

### POST /videos - Create a Video

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=zebra-chase

Start a video generation job by submitting a text prompt and required parameters. The prompt describes the creative vision including subjects, camera movements, lighting, and motion. Returns a video object with a unique ID and initial status.

```APIDOC
## POST /videos

### Description
Start a new video render job with a text prompt and generation parameters. The API accepts the model name, creative prompt, and optional video dimensions and duration.

### Method
POST

### Endpoint
https://api.openai.com/v1/videos

### Parameters
#### Request Body
- **model** (string) - Required - The video generation model to use (e.g., "sora-2", "sora-2-pro")
- **prompt** (string) - Required - A detailed text description of the video content, including shot type, subject, action, setting, and lighting
- **size** (string) - Optional - Video resolution in format "WIDTHxHEIGHT" (e.g., "1280x720")
- **seconds** (integer) - Optional - Duration of the video in seconds (e.g., 8)

### Request Example

**JavaScript:**
```javascript
import OpenAI from 'openai';

const openai = new OpenAI();

let video = await openai.videos.create({
    model: 'sora-2',
    prompt: "A video of the words 'Thank you' in sparkling letters",
});

console.log('Video generation started: ', video);
```

**Python:**
```python
from openai import OpenAI

openai = OpenAI()

video = openai.videos.create(
    model="sora-2",
    prompt="A video of a cool cat on a motorcycle in the night",
)

print("Video generation started:", video)
```

**cURL:**
```bash
curl -X POST "https://api.openai.com/v1/videos" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F prompt="Wide tracking shot of a teal coupe driving through a desert highway, heat ripples visible, hard sun overhead." \
  -F model="sora-2-pro" \
  -F size="1280x720" \
  -F seconds="8"
```

### Response
#### Success Response (200)
- **id** (string) - Unique identifier for the video generation job
- **object** (string) - Type of object ("video")
- **created_at** (integer) - Unix timestamp when the job was created
- **status** (string) - Current job status: "queued", "in_progress", "completed", or "failed"
- **model** (string) - The model used for generation
- **progress** (integer) - Progress percentage (0-100) if available
- **seconds** (string) - Duration of the video in seconds
- **size** (string) - Resolution of the video

#### Response Example
```json
{
  "id": "video_68d7512d07848190b3e45da0ecbebcde004da08e1e0678d5",
  "object": "video",
  "created_at": 1758941485,
  "status": "queued",
  "model": "sora-2-pro",
  "progress": 0,
  "seconds": "8",
  "size": "1280x720"
}
```

### Notes
- Video generation may take several minutes depending on model, API load, and resolution
- Use the returned video ID to poll for status updates or receive webhook notifications
- Prompts should include shot type, subject, action, setting, and lighting for best results
```

--------------------------------

### GET /v1/organization/usage/completions

Source: https://platform.openai.com/docs/api-reference/usage/audio_speeches

Get completions usage details for the organization, providing granular usage data based on various filtering and grouping options.

```APIDOC
## GET /v1/organization/usage/completions

### Description
Get completions usage details for the organization.

### Method
GET

### Endpoint
/v1/organization/usage/completions

### Parameters
#### Path Parameters
_None_

#### Query Parameters
- **start_time** (integer) - Required - Start time (Unix seconds) of the query time range, inclusive.
- **api_key_ids** (array) - Optional - Return only usage for these API keys.
- **batch** (boolean) - Optional - If `true`, return batch jobs only. If `false`, return non-batch jobs only. By default, return both.
- **bucket_width** (string) - Optional - Defaults to 1d. Width of each time bucket in response. Currently `1m`, `1h` and `1d` are supported, default to `1d`.
- **end_time** (integer) - Optional - End time (Unix seconds) of the query time range, exclusive.
- **group_by** (array) - Optional - Group the usage data by the specified fields. Support fields include `project_id`, `user_id`, `api_key_id`, `model`, `batch`, `service_tier` or any combination of them.
- **limit** (integer) - Optional - Specifies the number of buckets to return. For `bucket_width=1d`: default: 7, max: 31. For `bucket_width=1h`: default: 24, max: 168. For `bucket_width=1m`: default: 60, max: 1440.
- **models** (array) - Optional - Return only usage for these models.
- **page** (string) - Optional - A cursor for use in pagination. Corresponding to the `next_page` field from the previous response.
- **project_ids** (array) - Optional - Return only usage for these projects.
- **user_ids** (array) - Optional - Return only usage for these users.

#### Request Body
_None_

### Request Example
```bash
curl "https://api.openai.com/v1/organization/usage/completions?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"
```

### Response
A list of paginated, time bucketed Completions usage objects.

#### Success Response (200)
- **object** (string) - The object type, typically "page".
- **data** (array) - An array of time-bucketed usage data.
  - **object** (string) - The object type, typically "bucket".
  - **start_time** (integer) - Start time of the bucket in Unix seconds.
  - **end_time** (integer) - End time of the bucket in Unix seconds.
  - **results** (array) - An array of detailed usage results for the bucket.
    - **object** (string) - The object type, typically "organization.usage.completions.result".
    - **input_tokens** (integer) - Number of input tokens used.
    - **output_tokens** (integer) - Number of output tokens used.
    - **input_cached_tokens** (integer) - Number of cached input tokens used.
    - **input_audio_tokens** (integer) - Number of input audio tokens used.
    - **output_audio_tokens** (integer) - Number of output audio tokens used.
    - **num_model_requests** (integer) - Number of model requests made.
    - **project_id** (string/null) - The project ID associated with the usage.
    - **user_id** (string/null) - The user ID associated with the usage.
    - **api_key_id** (string/null) - The API key ID associated with the usage.
    - **model** (string/null) - The model used for the completions.
    - **batch** (boolean/null) - Indicates if the usage was part of a batch job.
    - **service_tier** (string/null) - The service tier associated with the usage.
- **has_more** (boolean) - Indicates if there are more pages of data.
- **next_page** (string) - A cursor for the next page of results, if `has_more` is true.

#### Response Example
```json
{
    "object": "page",
    "data": [
        {
            "object": "bucket",
            "start_time": 1730419200,
            "end_time": 1730505600,
            "results": [
                {
                    "object": "organization.usage.completions.result",
                    "input_tokens": 1000,
                    "output_tokens": 500,
                    "input_cached_tokens": 800,
                    "input_audio_tokens": 0,
                    "output_audio_tokens": 0,
                    "num_model_requests": 5,
                    "project_id": null,
                    "user_id": null,
                    "api_key_id": null,
                    "model": null,
                    "batch": null,
                    "service_tier": null
                }
            ]
        }
    ],
    "has_more": true,
    "next_page": "page_AAAAAGdGxdEiJdKOAAAAAGcqsYA="
}
```
```

--------------------------------

### Define Server Instructions for MCP (Multi-Component Protocol)

Source: https://platform.openai.com/docs/mcp

This string defines the operational instructions for the MCP server, guiding its behavior and informing users about its capabilities. It specifies that the server provides search and document retrieval via 'search' and 'fetch' tools, emphasizing their use for finding relevant documents and retrieving their complete content with citations.

```python
server_instructions = """
This MCP server provides search and document retrieval capabilities
for chat and deep research connectors. Use the search tool to find relevant documents
based on keywords, then use the fetch tool to retrieve complete
document content with citations.
"""
```

--------------------------------

### GET /v1/evals/{eval_id}/runs

Source: https://platform.openai.com/docs/api-reference/evals/createRun

Get a list of runs for a specific evaluation. This endpoint retrieves paginated run results for an evaluation with options to filter by status and customize sorting order.

```APIDOC
## GET /v1/evals/{eval_id}/runs

### Description
Get a list of runs for an evaluation. Returns a paginated list of runs associated with the specified evaluation ID, with support for status filtering and custom sorting.

### Method
GET

### Endpoint
https://api.openai.com/v1/evals/{eval_id}/runs

### Parameters
#### Path Parameters
- **eval_id** (string) - Required - The ID of the evaluation to retrieve runs for.

#### Query Parameters
- **after** (string) - Optional - Identifier for the last run from the previous pagination request.
- **limit** (integer) - Optional - Defaults to 20. Number of runs to retrieve.
- **order** (string) - Optional - Defaults to asc. Sort order for runs by timestamp. Use `asc` for ascending order or `desc` for descending order.
- **status** (string) - Optional - Filter runs by status. One of: `queued`, `in_progress`, `failed`, `completed`, `canceled`.

### Request Example
```bash
curl https://api.openai.com/v1/evals/{eval_id}/runs?limit=20 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"
```

### Response
#### Success Response (200)
- **object** (string) - Object type identifier ("list")
- **data** (array) - Array of run objects for the evaluation
- **first_id** (string) - ID of the first run in the list
- **last_id** (string) - ID of the last run in the list
- **has_more** (boolean) - Indicates if there are more results available
```

--------------------------------

### POST /videos

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=Cozy-Coffee-Shop-Interior

Start a video generation job by submitting a text prompt and configuration parameters. The API returns a unique video ID and initial status. Video generation is asynchronous and may take several minutes depending on model, API load, and resolution.

```APIDOC
## POST /videos

### Description
Start a new video render job by submitting a creative text prompt and configuration parameters. The prompt defines the visual elements including subjects, camera work, lighting, and motion. The endpoint returns immediately with a job ID and initial status.

### Method
POST

### Endpoint
https://api.openai.com/v1/videos

### Parameters
#### Request Body
- **prompt** (string) - Required - Detailed description of the video content including shot type, subject, action, setting, and lighting
- **model** (string) - Required - Model identifier (e.g., "sora-2", "sora-2-pro")
- **size** (string) - Optional - Video resolution in format WIDTHxHEIGHT (e.g., "1280x720")
- **seconds** (string) - Optional - Video duration in seconds (e.g., "8")

### Request Example
```javascript
import OpenAI from 'openai';

const openai = new OpenAI();

let video = await openai.videos.create({
    model: 'sora-2',
    prompt: "A video of the words 'Thank you' in sparkling letters",
});

console.log('Video generation started: ', video);
```

```python
from openai import OpenAI

openai = OpenAI()

video = openai.videos.create(
    model="sora-2",
    prompt="A video of a cool cat on a motorcycle in the night",
)

print("Video generation started:", video)
```

```bash
curl -X POST "https://api.openai.com/v1/videos" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F prompt="Wide tracking shot of a teal coupe driving through a desert highway, heat ripples visible, hard sun overhead." \
  -F model="sora-2-pro" \
  -F size="1280x720" \
  -F seconds="8"
```

### Response
#### Success Response (200)
- **id** (string) - Unique identifier for the video generation job
- **object** (string) - Object type identifier ("video")
- **created_at** (integer) - Unix timestamp of job creation
- **status** (string) - Initial status of the job ("queued", "in_progress", "completed", "failed")
- **model** (string) - Model used for generation
- **progress** (integer) - Progress percentage (0-100)
- **seconds** (string) - Video duration in seconds
- **size** (string) - Video resolution

#### Response Example
```json
{
  "id": "video_68d7512d07848190b3e45da0ecbebcde004da08e1e0678d5",
  "object": "video",
  "created_at": 1758941485,
  "status": "queued",
  "model": "sora-2-pro",
  "progress": 0,
  "seconds": "8",
  "size": "1280x720"
}
```

### Content Restrictions
- Only content suitable for audiences under 18
- Copyrighted characters and music will be rejected
- Real people and public figures cannot be generated
- Input images with human faces are currently rejected

### Prompting Tips
For best results, include: shot type, subject, action, setting, and lighting.
- "Wide shot of a child flying a red kite in a grassy park, golden hour sunlight, camera slowly pans upward."
- "Close-up of a steaming coffee cup on a wooden table, morning light through blinds, soft depth of field."
```

--------------------------------

### Example JSON for OpenAI Chat Completion List Object

Source: https://platform.openai.com/docs/api-reference/chat/get

This JSON example illustrates the structure of a chat completion list object returned by the OpenAI API. It contains an array of individual `chat.completion` objects, along with pagination metadata such as `first_id`, `last_id`, and `has_more` indicating additional results.

```json
{
  "object": "list",
  "data": [
    {
      "object": "chat.completion",
      "id": "chatcmpl-AyPNinnUqUDYo9SAdA52NobMflmj2",
      "model": "gpt-4o-2024-08-06",
      "created": 1738960610,
      "request_id": "req_ded8ab984ec4bf840f37566c1011c417",
      "tool_choice": null,
      "usage": {
        "total_tokens": 31,
        "completion_tokens": 18,
        "prompt_tokens": 13
      },
      "seed": 4944116822809979520,
      "top_p": 1.0,
      "temperature": 1.0,
      "presence_penalty": 0.0,
      "frequency_penalty": 0.0,
      "system_fingerprint": "fp_50cad350e4",
      "input_user": null,
      "service_tier": "default",
      "tools": null,
      "metadata": {},
      "choices": [
        {
          "index": 0,
          "message": {
            "content": "Mind of circuits hum,  \nLearning patterns in silence—  \nFuture's quiet spark.",
            "role": "assistant",
            "tool_calls": null,
            "function_call": null
          },
          "finish_reason": "stop",
          "logprobs": null
        }
      ],
      "response_format": null
    }
  ],
  "first_id": "chatcmpl-AyPNinnUqUDYo9SAdA52NobMflmj2",
  "last_id": "chatcmpl-AyPNinnUqUDYo9SAdA52NobMflmj2",
  "has_more": false
}
```

--------------------------------

### List Evaluations using OpenAI API (curl, Python, Node.js)

Source: https://platform.openai.com/docs/api-reference/evals/run-object

This snippet demonstrates how to retrieve a list of evaluations from the OpenAI API. It provides examples for making a direct HTTP request using `curl`, and using the official `openai` client libraries for Python and Node.js. All examples show how to include authorization and apply a `limit` filter to the results.

```curl
curl https://api.openai.com/v1/evals?limit=1 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"
```

```python
from openai import OpenAI
client = OpenAI()

evals = client.evals.list(limit=1)
print(evals)
```

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const evals = await openai.evals.list({ limit: 1 });
console.log(evals);
```

--------------------------------

### Create and Run Assistant with Thread - Python

Source: https://platform.openai.com/docs/api-reference/runs/listRuns

Creates a new thread with messages and starts a run using the OpenAI Python client library. The assistant processes the user message and returns a run object with execution details. Requires the openai package and valid API key configuration.

```python
from openai import OpenAI
client = OpenAI()

run = client.beta.threads.create_and_run(
  assistant_id="asst_abc123",
  thread={
    "messages": [
      {"role": "user", "content": "Explain deep learning to a 5 year old."}
    ]
  }
)

print(run)
```

--------------------------------

### POST /chat/completions - Sampling and Tool Parameters

Source: https://platform.openai.com/docs/api-reference/chat/list

Control model sampling behavior, tool usage, and token probability outputs. Configure temperature, top_p, top_logprobs, and tool selection for dynamic model behavior.

```APIDOC
## POST /chat/completions

### Description
Configures sampling parameters, tool selection, and token probability outputs for controlling model generation behavior and function calling.

### Method
POST

### Endpoint
/chat/completions

### Request Body Parameters

#### temperature
- **temperature** (number) - Optional, defaults to 1 - Sampling temperature between 0 and 2. Higher values (0.8) increase randomness; lower values (0.2) increase focus and determinism. Recommended to alter this or `top_p`, but not both.

#### top_p
- **top_p** (number) - Optional, defaults to 1 - Nucleus sampling parameter for controlling diversity via cumulative probability

#### top_logprobs
- **top_logprobs** (integer) - Optional - Integer between 0 and 20 specifying number of most likely tokens to return at each position with associated log probability

#### tool_choice
- **tool_choice** (string or object) - Optional - Controls which tool is called by model
  - `none` - Model generates message without calling tools (default when no tools present)
  - `auto` - Model can pick between generating message or calling tools (default if tools present)
  - `required` - Model must call one or more tools
  - Object format: `{"type": "function", "function": {"name": "my_function"}}` - Forces model to call specific tool

#### tools
- **tools** (array) - Optional - List of tools model may call (custom tools or function tools)

### Request Example
```json
{
  "model": "gpt-4",
  "messages": [{"role": "user", "content": "What's the weather?"}],
  "temperature": 0.7,
  "top_p": 0.9,
  "top_logprobs": 5,
  "tool_choice": "auto",
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "Get weather information",
        "parameters": {"type": "object", "properties": {"location": {"type": "string"}}}
      }
    }
  ]
}
```

### Response
#### Success Response (200)
- **choices** (array) - Completion choices with generated content
  - **message** (object) - Assistant message with role and content
  - **tool_calls** (array) - Tools called by model (if any)
  - **logprobs** (object) - Log probabilities when top_logprobs specified

#### Response Example
```json
{
  "id": "chatcmpl-789",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "gpt-4",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": null,
        "tool_calls": [
          {
            "id": "call_123",
            "type": "function",
            "function": {"name": "get_weather", "arguments": "{\"location\": \"New York\"}"},
            "logprobs": {"content": [{"token": "tool_call", "logprob": -0.5}]}
          }
        ]
      },
      "finish_reason": "tool_calls"
    }
  ],
  "usage": {"prompt_tokens": 50, "completion_tokens": 30, "total_tokens": 80}
}
```
```

--------------------------------

### Install OpenAI Agents SDK for Voice Support

Source: https://platform.openai.com/docs/guides/voice-agents_voice-agent-architecture=chained

This command installs the OpenAI Agents SDK for Python, specifically including the necessary dependencies to enable voice agent functionalities like `VoicePipeline`. It allows developers to integrate voice capabilities into their existing agentic workflows.

```shell
pip install openai-agents[voice]
```

--------------------------------

### Upload File and Query with JavaScript

Source: https://platform.openai.com/docs/quickstart_api-mode=responses

Demonstrates file upload and model querying using the OpenAI JavaScript SDK. The code creates a file stream, uploads it with user_data purpose, and then sends a response request combining the file ID with a text query.

```javascript
import fs from "fs";
import OpenAI from "openai";
const client = new OpenAI();

const file = await client.files.create({
    file: fs.createReadStream("draconomicon.pdf"),
    purpose: "user_data",
});

const response = await client.responses.create({
    model: "gpt-5",
    input: [
        {
            role: "user",
            content: [
                {
                    type: "input_file",
                    file_id: file.id,
                },
                {
                    type: "input_text",
                    text: "What is the first dragon in the book?",
                },
            ],
        },
    ],
});

console.log(response.output_text);
```

--------------------------------

### WebRTC Audio Configuration

Source: https://platform.openai.com/docs/guides/realtime-conversations

Basic setup for handling audio with WebRTC by creating a peer connection, configuring remote audio playback from the model, and adding local microphone input for user audio.

```APIDOC
## WebRTC Audio Configuration

### Description
Configures bidirectional audio handling for WebRTC connections to the Realtime API. Enables receiving model audio output as a remote media stream and collecting user audio input from microphone devices.

### Setup Steps

#### Create Peer Connection
Initialize an RTCPeerConnection to establish the WebRTC session.

#### Configure Remote Audio Output
- Create an audio element with autoplay enabled
- Set the `ontrack` handler to receive remote audio streams from the model
- Assign incoming stream to the audio element's srcObject

#### Configure Local Audio Input
- Request user media with audio capture using `getUserMedia()`
- Add the audio track from the media stream to the peer connection
- Audio is automatically sent to the model once the track is added

### Code Example
```javascript
// Create a peer connection
const pc = new RTCPeerConnection();

// Set up to play remote audio from the model
const audioEl = document.createElement("audio");
audioEl.autoplay = true;
pc.ontrack = (e) => (audioEl.srcObject = e.streams[0]);

// Add local audio track for microphone input in the browser
const ms = await navigator.mediaDevices.getUserMedia({
    audio: true,
});
pc.addTrack(ms.getTracks()[0]);
```

### Audio Stream Control
Browser MediaStream APIs enable additional control:
- Mute and unmute microphones
- Select specific input devices
- Manage audio device switching
- Control audio levels and processing
```

--------------------------------

### GET /videos

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=Sleeping-Otters

Enumerates all video render jobs associated with the authenticated user or account, with support for pagination.

```APIDOC
## GET /videos

### Description
Retrieves a paginated list of video generation jobs, useful for displaying user history, populating dashboards, or performing housekeeping tasks.

### Method
GET

### Endpoint
/videos

### Parameters
#### Query Parameters
- **limit** (integer) - Optional - The maximum number of video jobs to return per page. Default is implementation-defined (e.g., 20).
- **after** (string) - Optional - A cursor for pagination, specifying the video ID after which to start fetching the next set of results.
- **status** (string) - Optional - Filters the list of videos by their current status (e.g., "completed", "pending", "failed").

### Request Example
*(No request body for this GET endpoint)*

### Response
#### Success Response (200 OK)
- **data** (array of objects) - A list of video job objects, each containing:
  - **id** (string) - Unique identifier for the video job.
  - **status** (string) - Current status of the job.
  - **created_at** (string) - ISO 8601 timestamp of creation.
  - **prompt** (string) - The original prompt used to generate the video.
- **has_more** (boolean) - Indicates if there are more results available to fetch.
- **next_cursor** (string) - The cursor value to use in the `after` parameter for the next paginated request.

#### Response Example
```json
{
  "data": [
    {
      "id": "job_abc123def456",
      "status": "completed",
      "created_at": "2023-10-27T10:00:00Z",
      "prompt": "A peaceful, cinematic scene..."
    },
    {
      "id": "job_xyz789uvw012",
      "status": "processing",
      "created_at": "2023-10-27T11:30:00Z",
      "prompt": "Indie café by a rainy window..."
    }
  ],
  "has_more": true,
  "next_cursor": "job_xyz789uvw012"
}
```
```

--------------------------------

### Initialize MCP Server with FastMCP and OpenAI

Source: https://platform.openai.com/docs/mcp

Sets up a Model Context Protocol server using FastMCP framework with OpenAI integration. Configures logging, imports necessary dependencies, and initializes environment variables for API credentials and vector store identification. This is the foundational setup for creating an MCP server that can be deployed on platforms like Replit.

```python
"""
Sample MCP Server for ChatGPT Integration

This server implements the Model Context Protocol (MCP) with search and fetch
capabilities designed to work with ChatGPT's chat and deep research features.
"""

import logging
import os
from typing import Dict, List, Any

from fastmcp import FastMCP
from openai import OpenAI

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# OpenAI configuration
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
VECTOR_STORE_ID = os.environ.get("VECTOR_STORE_ID", "")
```

--------------------------------

### API Models and Selection Guide

Source: https://platform.openai.com/docs/guides/image-generation_gallery=open&galleryItem=robot-toy

Overview of available image generation models and guidance on choosing the appropriate API and model for your use case.

```APIDOC
## Image Generation Models and API Selection

### Available Models

#### GPT Image Models
- **gpt-image-1.5** - Latest GPT Image model with advanced capabilities
  - Available for: Image API (Generations, Edits)
  - Quality: `standard`, `high`
  - Sizes: `1024x1024`, `1024x1536`, `1792x1024`
  - Coming soon: Responses API support

- **gpt-image-1** - Standard GPT Image model
  - Available for: Image API (Generations, Edits), Responses API
  - Quality: `standard`, `high`
  - Sizes: `1024x1024`, `1024x1536`, `1792x1024`

- **gpt-image-1-mini** - Lightweight GPT Image model
  - Available for: Image API (Generations, Edits), Responses API
  - Quality: `standard`, `high`
  - Sizes: `1024x1024`, `1024x1536`, `1792x1024`

#### DALL·E Models
- **dall-e-3** - Latest DALL·E model
  - Available for: Image API (Generations, Edits)
  - Quality: `standard`, `high`
  - Sizes: `1024x1024`, `1024x1536`, `1792x1024`

- **dall-e-2** - DALL·E 2 with variation support
  - Available for: Image API (Generations, Edits, Variations)
  - Quality: `standard`, `high`
  - Sizes: `1024x1024`, `1024x1536`, `1792x1024`

### API Selection Guide

#### Use Image API When:
- You need to generate or edit a single image from one prompt
- You want straightforward, stateless image generation
- Your use case doesn't require conversational context
- You're working with standard request-response flows

#### Use Responses API When:
- You want to build conversational, editable image experiences
- You need multi-turn editing with iterative refinement
- You want to accept image File IDs as input instead of bytes
- You're building complex workflows requiring context persistence
- You want to integrate image generation as part of larger conversations

### Customization Options
Both APIs support:
- **Quality**: `standard` or `high` (high quality produces more detailed images)
- **Size**: `1024x1024`, `1024x1536`, or `1792x1024`
- **Format**: `url` (default) or `b64_json` for base64 encoded output
- **Compression**: Control output file size and format
- **Transparent Backgrounds**: Enable alpha channel support (when available)
```

--------------------------------

### POST /videos - Create video

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=Cozy-Coffee-Shop-Interior

Start a new asynchronous video rendering job from a natural language prompt, with optional reference inputs, remix ID, or specific model parameters. Returns a job object with an ID and initial status.

```APIDOC
## POST /videos

### Description
Initiate a new video rendering job by providing a prompt, and optionally reference inputs or a remix ID. This is an asynchronous process that returns a job ID to track progress.

### Method
POST

### Endpoint
/videos

### Parameters
#### Request Body
- **prompt** (string) - Required - The natural language text prompt describing the desired video content.
- **model** (string) - Optional - The Sora model to use for generation. Defaults to `sora-2` for speed; use `sora-2-pro` for higher quality output.
- **size** (string) - Optional - Desired video resolution in 'WxH' format (e.g., '1792x1024').
- **duration** (string) - Optional - Desired video duration in seconds (e.g., '8s').
- **reference_inputs** (array of objects) - Optional - A list of references (e.g., image or video URLs) to guide the generation.
- **remix_id** (string) - Optional - An ID of an existing video to use as a base for remixing.

### Request Example
```json
{
  "prompt": "A peaceful, cinematic scene of two sea otters floating side by side on calm, sunlit water. They hold hands together gently as they drift, their fur glistening with droplets that sparkle in the golden light.",
  "model": "sora-2",
  "size": "1792x1024",
  "duration": "8s"
}
```

### Response
#### Success Response (202 Accepted)
- **id** (string) - The unique identifier for the video rendering job.
- **status** (string) - The initial status of the job (e.g., "pending", "processing").
- **created_at** (timestamp) - The timestamp when the job was created.

#### Response Example
```json
{
  "id": "job_123abc456def",
  "status": "pending",
  "created_at": "2023-10-27T10:00:00Z"
}
```
```

--------------------------------

### POST /v1/threads/runs

Source: https://platform.openai.com/docs/api-reference/runs/createThreadAndRun

Creates a new thread and initiates a run with an Assistant in a single request. This is a convenient way to start a new conversation and execute an Assistant immediately.

```APIDOC
## POST /v1/threads/runs

### Description
Creates a new thread and initiates a run with an Assistant in a single request.

### Method
POST

### Endpoint
/v1/threads/runs

### Parameters
#### Request Body
- **assistant_id** (string) - Required - The ID of the Assistant to use for the run.
- **temperature** (number or null) - Optional - Defaults to 1.0. An alternative to sampling with `top_p`.
- **top_p** (number or null) - Optional - Defaults to 1.0. An alternative to sampling with `temperature`, where the model considers the results of the tokens with `top_p` probability mass.
- **truncation_strategy** (object or null) - Optional - Controls for how a thread will be truncated prior to the run. Use this to control the initial context window of the run.
- *Additional parameters for thread creation (e.g., initial messages, metadata) are likely available but not specified in the provided text.*

### Response
#### Success Response (200)
- **id** (string) - The ID of the run.
- **object** (string) - The object type, which is always `thread.run`.
- **created_at** (integer) - The Unix timestamp (in seconds) for when the run was created.
- **assistant_id** (string) - The ID of the Assistant used for this run.
- **thread_id** (string) - The ID of the thread this run belongs to.
- **status** (string) - The status of the run (e.g., `queued`, `in_progress`, `completed`, `failed`, `cancelled`, `expired`).
- **started_at** (integer or null) - The Unix timestamp (in seconds) for when the run was started.
- **expires_at** (integer or null) - The Unix timestamp (in seconds) for when the run will expire.
- **cancelled_at** (integer or null) - The Unix timestamp (in seconds) for when the run was cancelled.
- **failed_at** (integer or null) - The Unix timestamp (in seconds) for when the run failed.
- **completed_at** (integer or null) - The Unix timestamp (in seconds) for when the run completed.
- **last_error** (object or null) - The last error object, if any, encountered during the run.
- **model** (string) - The model used for the run.
- **instructions** (string or null) - The instructions used for the run.
- **incomplete_details** (object or null) - Details about why the run is incomplete.
- **tools** (array) - A list of tools used in the run.
  - **type** (string) - The type of the tool (e.g., `code_interpreter`).
- **metadata** (object) - Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format.
- **usage** (object or null) - Usage statistics related to the run.
- **temperature** (number or null) - The temperature parameter used for the run.
- **top_p** (number or null) - The top_p parameter used for the run.
- **max_prompt_tokens** (integer or null) - The maximum number of prompt tokens that can be used.
- **max_completion_tokens** (integer or null) - The maximum number of completion tokens that can be used.
- **truncation_strategy** (object) - The truncation strategy used for the run.
  - **type** (string) - The type of truncation strategy.
  - **last_messages** (integer or null) - The number of last messages considered for truncation.
- **response_format** (string) - The response format used for the run.
- **tool_choice** (string) - The tool choice strategy used for the run.
- **parallel_tool_calls** (boolean) - Whether parallel tool calls are enabled.
```

--------------------------------

### Create OpenAI Assistant with Code Interpreter - Python

Source: https://platform.openai.com/docs/api-reference/assistants

Uses OpenAI Python SDK to create a new assistant with code interpreter capability. Initializes OpenAI client and defines assistant properties including instructions, name, tools, and model. Outputs the created assistant object.

```python
from openai import OpenAI
client = OpenAI()

my_assistant = client.beta.assistants.create(
    instructions="You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
    name="Math Tutor",
    tools=[{"type": "code_interpreter"}],
    model="gpt-4o",
)
print(my_assistant)
```

--------------------------------

### POST /videos

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=Upside-Down-City

Start a new asynchronous video generation job from a natural language prompt, with optional parameters for model selection, video dimensions, duration, and remixing an existing video.

```APIDOC
## POST /videos

### Description
Initiates an asynchronous video generation task. The API returns a job ID which can be used to track the video's progress and eventually download the finished MP4 file.

### Method
POST

### Endpoint
/videos

### Parameters
#### Path Parameters
(None)

#### Query Parameters
(None)

#### Request Body
- **prompt** (string) - Required - The natural language description for the desired video content.
- **model** (string) - Optional - The Sora model to use for generation. Options: `sora-2` (default, fast iteration) or `sora-2-pro` (higher quality). 
- **size** (string) - Optional - The desired resolution of the video (e.g., "1792x1024").
- **duration** (integer) - Optional - The desired length of the video in seconds.
- **remix_id** (string) - Optional - An ID of an existing video to use as a base for remixing.
- **reference_inputs** (array of strings) - Optional - A list of IDs for reference inputs (e.g., images or other videos) to guide generation.

### Request Example
{
  "prompt": "A peaceful, cinematic scene of two sea otters floating side by side on calm, sunlit water. They hold hands together gently as they drift, their fur glistening with droplets that sparkle in the golden light.",
  "model": "sora-2",
  "size": "1792x1024",
  "duration": 8
}

### Response
#### Success Response (202 Accepted)
- **id** (string) - The unique identifier of the newly created video generation job.
- **status** (string) - The initial status of the job (e.g., "pending", "processing").
- **created_at** (string) - The timestamp when the job was created.

#### Response Example
{
  "id": "job_xyz123",
  "status": "pending",
  "created_at": "2024-03-15T10:00:00Z"
}
```

--------------------------------

### JavaScript/TypeScript Implementation - Multi-turn Image Generation

Source: https://platform.openai.com/docs/guides/image-generation_api=responses&gallery=open&galleryItem=icons

Complete example showing how to implement multi-turn image generation in JavaScript/TypeScript using the OpenAI SDK. Demonstrates initial image generation and follow-up iterations using previous_response_id.

```APIDOC
## JavaScript/TypeScript Example

### Initial Image Generation and Follow-up Iteration

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

// Initial image generation
const response = await openai.responses.create({
  model: "gpt-5",
  input: "Generate an image of gray tabby cat hugging an otter with an orange scarf",
  tools: [{type: "image_generation"}]
});

// Extract image data from response
const imageData = response.output
  .filter((output) => output.type === "image_generation_call")
  .map((output) => output.result);

// Save the generated image
if (imageData.length > 0) {
  const imageBase64 = imageData[0];
  const fs = await import("fs");
  fs.writeFileSync("cat_and_otter.png", Buffer.from(imageBase64, "base64"));
}

// Follow-up: Refine the image using previous_response_id
const response_fwup = await openai.responses.create({
  model: "gpt-5",
  previous_response_id: response.id,
  input: "Now make it look realistic",
  tools: [{type: "image_generation"}]
});

// Extract and save the refined image
const imageData_fwup = response_fwup.output
  .filter((output) => output.type === "image_generation_call")
  .map((output) => output.result);

if (imageData_fwup.length > 0) {
  const imageBase64 = imageData_fwup[0];
  const fs = await import("fs");
  fs.writeFileSync(
    "cat_and_otter_realistic.png",
    Buffer.from(imageBase64, "base64")
  );
}
```

### Key Implementation Details
- Use `previous_response_id` from the initial response to continue the conversation
- Filter output array to extract image_generation_call results
- Image data is returned as base64-encoded strings
- Convert base64 to binary and save to file using Buffer
- Each follow-up maintains context from previous turns for coherent iterations
```

--------------------------------

### GET /videos/{video_id} - Get Video Status

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=chameleon

Retrieve the current state and progress of a video generation job. Poll this endpoint to monitor job completion or use webhooks for automatic notifications.

```APIDOC
## GET /videos/{video_id}

### Description
Retrieves the current status of a video generation job. Use this endpoint to poll for job completion or track rendering progress.

### Method
GET

### Endpoint
/videos/{video_id}

### Path Parameters
- **video_id** (string) - Required - Unique identifier of the video job returned from POST /videos

### Response
#### Success Response (200)
- **id** (string) - Unique identifier for the video job
- **status** (string) - Current job status: 'processing', 'completed', or 'failed'
- **created_at** (string) - ISO 8601 timestamp of job creation
- **completed_at** (string) - ISO 8601 timestamp when job finished (null if not completed)
- **prompt** (string) - The original prompt
- **model** (string) - Model used for generation
- **error** (string) - Error message if status is 'failed'

#### Response Example
{
  "id": "vid_abc123xyz",
  "status": "completed",
  "created_at": "2024-01-15T10:30:00Z",
  "completed_at": "2024-01-15T10:45:30Z",
  "prompt": "A peaceful, cinematic scene of two sea otters",
  "model": "sora-2-pro",
  "error": null
}
```

--------------------------------

### GET /v1/organization/usage/embeddings

Source: https://platform.openai.com/docs/api-reference/usage/audio_transcriptions_object

Get embeddings usage details for the organization. This endpoint allows querying usage data filtered by time, API keys, models, projects, and users, grouped into time buckets.

```APIDOC
## GET /v1/organization/usage/embeddings

### Description
Get embeddings usage details for the organization.

### Method
GET

### Endpoint
/v1/organization/usage/embeddings

### Parameters
#### Path Parameters
(None)

#### Query Parameters
- **start_time** (integer) - Required - Start time (Unix seconds) of the query time range, inclusive.
- **api_key_ids** (array) - Optional - Return only usage for these API keys.
- **bucket_width** (string) - Optional - Defaults to `1d`. Width of each time bucket in response. Currently `1m`, `1h` and `1d` are supported.
- **end_time** (integer) - Optional - End time (Unix seconds) of the query time range, exclusive.
- **group_by** (array) - Optional - Group the usage data by the specified fields. Support fields include `project_id`, `user_id`, `api_key_id`, `model` or any combination of them.
- **limit** (integer) - Optional - Specifies the number of buckets to return. Defaults depend on `bucket_width`: `1d` (default: 7, max: 31), `1h` (default: 24, max: 168), `1m` (default: 60, max: 1440).
- **models** (array) - Optional - Return only usage for these models.
- **page** (string) - Optional - A cursor for use in pagination. Corresponding to the `next_page` field from the previous response.
- **project_ids** (array) - Optional - Return only usage for these projects.
- **user_ids** (array) - Optional - Return only usage for these users.

#### Request Body
(None)

### Request Example
```
curl "https://api.openai.com/v1/organization/usage/embeddings?start_time=1730419200&limit=1" \
-H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
-H "Content-Type: application/json"
```

### Response
A list of paginated, time bucketed Embeddings usage objects.

#### Success Response (200)
- **object** (string) - Always "page".
- **data** (array) - An array of bucket objects.
  - **object** (string) - Always "bucket".
  - **start_time** (integer) - The start time of the usage bucket.
  - **end_time** (integer) - The end time of the usage bucket.
  - **results** (array) - An array of embeddings usage result objects.
    - **object** (string) - Always "organization.usage.embeddings.result".
    - **input_tokens** (integer) - The aggregated number of input tokens used.
    - **num_model_requests** (integer) - The count of requests made to the model.
    - **project_id** (string, nullable) - The project ID if grouped by `project_id`.
    - **user_id** (string, nullable) - The user ID if grouped by `user_id`.
    - **api_key_id** (string, nullable) - The API key ID if grouped by `api_key_id`.
    - **model** (string, nullable) - The model name if grouped by `model`.
- **has_more** (boolean) - Indicates if there are more pages of results.
- **next_page** (string, nullable) - A cursor for the next page of results, if `has_more` is true.

#### Response Example
```json
{
    "object": "page",
    "data": [
        {
            "object": "bucket",
            "start_time": 1730419200,
            "end_time": 1730505600,
            "results": [
                {
                    "object": "organization.usage.embeddings.result",
                    "input_tokens": 16,
                    "num_model_requests": 2,
                    "project_id": null,
                    "user_id": null,
                    "api_key_id": null,
                    "model": null
                }
            ]
        }
    ],
    "has_more": false,
    "next_page": null
}
```
```

--------------------------------

### Configure OpenAI Evaluation Run with Sampling Parameters

Source: https://platform.openai.com/docs/api-reference/evals/getRun

Sets up an evaluation run for OpenAI's GPT-4o-mini model with specified sampling parameters including temperature, top_p, seed, and maximum completion tokens. This configuration object defines how the model will generate responses during evaluation.

```json
{
  "model": "gpt-4o-mini",
  "sampling_params": {
    "seed": 42,
    "temperature": 1.0,
    "top_p": 1.0,
    "max_completions_tokens": 2048
  },
  "error": null,
  "metadata": {}
}
```

--------------------------------

### Image Generation Configuration - Transparency Settings

Source: https://platform.openai.com/docs/guides/image-generation_api=responses&gallery=open&galleryItem=ceramic-mug

Configuration guide for enabling transparent backgrounds in image generation. Transparency is supported with PNG and WebP formats and requires specific model versions and quality settings.

```APIDOC
## Image Generation Configuration

### Transparency Support

#### Supported Models
- `gpt-image-1.5`
- `gpt-image-1`
- `gpt-image-1-mini`

#### Configuration Parameters
- **background** (string) - Set to `"transparent"` to enable transparent backgrounds
- **quality** (string) - Recommended values for transparency:
  - `"medium"` - Good transparency support
  - `"high"` - Best transparency support (recommended)
  - `"low"` - Transparency may not render optimally

#### Supported Output Formats
- `png` - Recommended for transparency
- `webp` - Also supports transparency
- `jpeg` - Does not support transparency

### Content Moderation Configuration

#### Moderation Parameter
Control content filtering strictness with the `moderation` parameter:

- **auto** (default) - Standard filtering that limits potentially age-inappropriate content
- **low** - Less restrictive filtering

#### Request Example with Moderation
```json
{
  "model": "gpt-image-1",
  "prompt": "Your image prompt",
  "background": "transparent",
  "quality": "high",
  "moderation": "auto"
}
```

### Best Practices

1. **For Optimal Transparency:**
   - Use quality set to "medium" or "high"
   - Use PNG or WebP output format
   - Specify `background: "transparent"`

2. **Model Compatibility:**
   - Verify your model supports image generation via the model detail page
   - When using Responses API, ensure model is `gpt-4o` or newer

3. **Performance Considerations:**
   - Complex prompts may take up to 2 minutes to process
   - Allow adequate timeout for image generation requests

### Limitations

- **Latency:** Complex prompts may take up to 2 minutes to process
- **Text Rendering:** Precise text placement and clarity may be imperfect
- **Consistency:** Visual consistency for recurring characters or brand elements may vary across generations
- **Composition Control:** Precise element placement in structured layouts may be challenging
- **Content Filtering:** All prompts and generated images are filtered according to content policy
```

--------------------------------

### OpenAI SDK: Initial Image Generation

Source: https://platform.openai.com/docs/guides/image-generation_gallery=open&galleryItem=ceramic-mug

This section describes how to make an initial call to the OpenAI API using `client.responses.create` to generate an image from a textual prompt. The generated image data is returned as base64.

```APIDOC
## SDK Method: client.responses.create

### Description
Generates an initial image based on a provided text prompt using the specified model and tools.

### Method
SDK Method Call

### Endpoint
`client.responses.create` (SDK method)

### Parameters
#### Request Body (Parameters for `client.responses.create`)
- **model** (string) - Required - The identifier of the AI model to use for image generation (e.g., "gpt-5").
- **input** (string) - Required - The textual prompt describing the image to be generated.
- **tools** (array of objects) - Required - A list of tools to be used. For image generation, it should contain `{"type": "image_generation"}`.

### Request Example
```json
{
  "model": "gpt-5",
  "input": "Generate an image of gray tabby cat hugging an otter with an orange scarf",
  "tools": [
    {
      "type": "image_generation"
    }
  ]
}
```

### Response
#### Success Response (SDK Object Structure)
- **output** (array of objects) - Contains results from the model's operations.
  - **type** (string) - The type of output, e.g., "image_generation_call".
  - **result** (string) - Base64 encoded image data if `type` is "image_generation_call".
  - **id** (string) - Unique identifier for the image generation call.

#### Response Example (Simplified Output Extraction)
```json
{
  "output": [
    {
      "type": "image_generation_call",
      "result": "<base64_encoded_image_data>",
      "id": "call_id_123"
    }
  ]
}
```
```

--------------------------------

### GET /files/{file_id}

Source: https://platform.openai.com/docs/assistants/tools/file-search

Retrieves file metadata including filename. Used to get the names of files referenced in file citations from message annotations.

```APIDOC
## GET /files/{file_id}

### Description
Retrieves metadata for a specific file, including its filename. Commonly used to resolve file citations in message annotations.

### Method
GET

### Endpoint
/files/{file_id}

### Parameters
#### Path Parameters
- **file_id** (string) - Required - The ID of the file to retrieve

### Request Example
```python
cited_file = client.files.retrieve(file_citation.file_id)
```

### Response
#### Success Response (200)
- **id** (string) - The file ID
- **filename** (string) - The name of the file
- **bytes** (integer) - The size of the file in bytes
- **created_at** (integer) - Unix timestamp when file was created

#### Response Example
```json
{
  "id": "file_456",
  "filename": "aapl-10k.pdf",
  "bytes": 2048576,
  "created_at": 1699564801
}
```
```

--------------------------------

### Retrieve an OpenAI EvalRun Object

Source: https://platform.openai.com/docs/api-reference/evals/delete

This set of examples demonstrates how to retrieve a specific OpenAI EvalRun object using its unique identifier, along with the corresponding evaluation ID. Examples are provided for cURL, Python, and JavaScript, showing how to authenticate and make the necessary API calls to fetch detailed run information.

```curl
curl https://api.openai.com/v1/evals/eval_67abd54d9b0081909a86353f6fb9317a/runs/evalrun_67abd54d60ec8190832b46859da808f7 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"
```

```python
from openai import OpenAI
client = OpenAI()

run = client.evals.runs.retrieve(
  "eval_67abd54d9b0081909a86353f6fb9317a",
  "evalrun_67abd54d60ec8190832b46859da808f7"
)
print(run)
```

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const run = await openai.evals.runs.retrieve(
  "evalrun_67abd54d60ec8190832b46859da808f7",
  { eval_id: "eval_67abd54d9b0081909a86353f6fb9317a" }
);
console.log(run);
```

--------------------------------

### Structuring LLM System Prompts with Labeled Sections

Source: https://platform.openai.com/docs/guides/realtime-models-prompting

This snippet demonstrates how to organize a system prompt using clear, labeled sections (e.g., Role & Objective, Personality & Tone, Instructions/Rules) to enhance the model's understanding of context and maintain consistency across interactions. This structured format also aids in iteration and modification.

```Prompt
# Role & Objective        — who you are and what “success” means
# Personality & Tone      — the voice and style to maintain
# Context                 — retrieved context, relevant info
# Reference Pronunciations — phonetic guides for tricky words
# Tools                   — names, usage rules, and preambles
# Instructions / Rules    — do’s, don’ts, and approach
# Conversation Flow       — states, goals, and transitions
# Safety & Escalation     — fallback and handoff logic
```

--------------------------------

### GET /v1/evals/{eval_id}/runs/{run_id}

Source: https://platform.openai.com/docs/api-reference/evals

Retrieves a specific evaluation run by its unique identifier. This allows you to get detailed information about a single eval run, including its status, results, and associated data.

```APIDOC
## GET /v1/evals/{eval_id}/runs/{run_id}

### Description
Retrieves a specific evaluation run by its unique identifier. This allows you to get detailed information about a single eval run, including its status, results, and associated data.

### Method
GET

### Endpoint
/v1/evals/{eval_id}/runs/{run_id}

### Parameters
#### Path Parameters
- **eval_id** (string) - Required - The ID of the evaluation that the run belongs to.
- **run_id** (string) - Required - The ID of the specific run to retrieve.

### Response
#### Success Response (200)
- **object** (string) - The type of the object, always 'eval.run'.
- **id** (string) - The unique identifier for the eval run.
- **eval_id** (string) - The ID of the evaluation this run belongs to.
- **report_url** (string) - URL to the evaluation report.
- **status** (string) - Current status of the eval run (e.g., 'completed').
- **model** (string) - The model used for the evaluation.
- **name** (string) - Name of the eval run.
- **created_at** (integer) - Timestamp of creation.
- **result_counts** (object) - Summary of results.
  - **total** (integer) - Total number of results.
  - **errored** (integer) - Number of errored results.
  - **failed** (integer) - Number of failed results.
  - **passed** (integer) - Number of passed results.
- **per_model_usage** (array) - Usage statistics per model.
  - **model_name** (string) - Name of the model.
  - **invocation_count** (integer) - Number of invocations.
  - **prompt_tokens** (integer) - Tokens used for prompts.
  - **completion_tokens** (integer) - Tokens used for completions.
  - **total_tokens** (integer) - Total tokens used.
  - **cached_tokens** (integer) - Cached tokens used.
- **per_testing_criteria_results** (array) - Results per testing criteria.
  - **testing_criteria** (string) - Name of the testing criteria.
  - **passed** (integer) - Number of passed tests for this criteria.
  - **failed** (integer) - Number of failed tests for this criteria.
- **data_source** (object) - Details about the data source used for the evaluation.
- **error** (string | null) - Any error message, if applicable.
- **metadata** (object) - Additional metadata.

#### Response Example
```json
{
  "object": "eval.run",
  "id": "evalrun_67e0c7d31560819090d60c0780591042",
  "eval_id": "eval_67e0c726d560819083f19a957c4c640b",
  "report_url": "https://platform.openai.com/evaluations/eval_67e0c726d560819083f19a957c4c640b",
  "status": "completed",
  "model": "o3-mini",
  "name": "bulk_with_negative_examples_o3-mini",
  "created_at": 1742784467,
  "result_counts": {
    "total": 1,
    "errored": 0,
    "failed": 0,
    "passed": 1
  },
  "per_model_usage": [
    {
      "model_name": "o3-mini",
      "invocation_count": 1,
      "prompt_tokens": 563,
      "completion_tokens": 874,
      "total_tokens": 1437,
      "cached_tokens": 0
    }
  ],
  "per_testing_criteria_results": [
    {
      "testing_criteria": "Push Notification Summary Grader-1808cd0b-eeec-4e0b-a519-337e79f4f5d1",
      "passed": 1,
      "failed": 0
    }
  ],
  "data_source": {
    "type": "completions",
    "source": {
      "type": "file_content",
      "content": [
        {
          "item": {
            "notifications": "\n- New message from Sarah: \"Can you call me later?\"\n- Your package has been delivered!\n- Flash sale: 20% off electronics for the next 2 hours!\n"
          }
        }
      ]
    },
    "input_messages": {
      "type": "template",
      "template": [
        {
          "type": "message",
          "role": "developer",
          "content": {
            "type": "input_text",
            "text": "\n\n\n\nYou are a helpful assistant that takes in an array of push notifications and returns a collapsed summary of them.\nThe push notification will be provided as follows:\n<push_notifications>\n...notificationlist...\n</push_notifications>\n\nYou should return just the summary and nothing else.\n\n\nYou should return a summary that is concise and snappy.\n\n\nHere is an example of a good summary:\n<push_notifications>\n- Traffic alert: Accident reported on Main Street.- Package out for delivery: Expected by 5 PM.- New friend suggestion: Connect with Emma.\n</push_notifications>\n<summary>\nTraffic alert, package expected by 5pm, suggestion for new friend (Emily).\n</summary>\n\n\nHere is an example of a bad summary:\n<push_notifications>\n- Traffic alert: Accident reported on Main Street.- Package out for delivery: Expected by 5 PM.- New friend suggestion: Connect with Emma.\n</push_notifications>\n<summary>\nTraffic alert reported on main street. You have a package that will arrive by 5pm, Emily is a new friend suggested for you.\n</summary>\n"
          }
        },
        {
          "type": "message",
          "role": "user",
          "content": {
            "type": "input_text",
            "text": "<push_notifications>{{item.notifications}}</push_notifications>"
          }
        }
      ]
    },
    "model": "o3-mini",
    "sampling_params": null
  },
  "error": null,
  "metadata": {}
}
```
```

--------------------------------

### Region Attribute Filter Example

Source: https://platform.openai.com/docs/guides/retrieval

Filter search results by region using an equality comparison filter. This example restricts results to files with the 'us' region attribute.

```json
{
  "type": "eq",
  "key": "region",
  "value": "us"
}
```

--------------------------------

### Download MP4 Video with Progress Monitoring - JavaScript

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=Sleeping-Otters

Creates a video using Sora model, polls status with progress tracking, and downloads the completed MP4 file to disk. Displays ASCII progress bar in terminal. Handles both queued and in-progress states with 2-second polling intervals.

```javascript
import OpenAI from 'openai';

const openai = new OpenAI();

let video = await openai.videos.create({
    model: 'sora-2',
    prompt: "A video of the words 'Thank you' in sparkling letters",
});

console.log('Video generation started: ', video);
let progress = video.progress ?? 0;

while (video.status === 'in_progress' || video.status === 'queued') {
    video = await openai.videos.retrieve(video.id);
    progress = video.progress ?? 0;

    const barLength = 30;
    const filledLength = Math.floor((progress / 100) * barLength);
    const bar = '='.repeat(filledLength) + '-'.repeat(barLength - filledLength);
    const statusText = video.status === 'queued' ? 'Queued' : 'Processing';

    process.stdout.write(`${statusText}: [${bar}] ${progress.toFixed(1)}%`);

    await new Promise((resolve) => setTimeout(resolve, 2000));
}

process.stdout.write('\n');

if (video.status === 'failed') {
    console.error('Video generation failed');
    return;
}

console.log('Video generation completed: ', video);
console.log('Downloading video content...');

const content = await openai.videos.downloadContent(video.id);
const body = content.arrayBuffer();
const buffer = Buffer.from(await body);

require('fs').writeFileSync('video.mp4', buffer);
console.log('Wrote video.mp4');
```

--------------------------------

### Python SDK - Create Response with Grammar Tool

Source: https://platform.openai.com/docs/guides/function-calling_api-mode=responses

Python implementation example using the OpenAI SDK to create a constrained response with a custom Lark CFG grammar tool. Demonstrates instantiation, grammar definition, tool configuration, and response handling.

```APIDOC
## Python SDK Implementation

### Description
Python code example for using the OpenAI Responses API with custom Lark CFG grammar constraints.

### Installation
```
pip install openai
```

### Usage Example
```python
from openai import OpenAI

# Initialize the client
client = OpenAI()

# Define Lark CFG grammar for mathematical expressions
grammar = """
start: expr
expr: term (SP ADD SP term)* -> add
| term
term: factor (SP MUL SP factor)* -> mul
| factor
factor: INT
SP: " "
ADD: "+"
MUL: "*"
%import common.INT
"""

# Create response with custom grammar tool
response = client.responses.create(
    model="gpt-5",
    input="Use the math_exp tool to add four plus four.",
    tools=[
        {
            "type": "custom",
            "name": "math_exp",
            "description": "Creates valid mathematical expressions",
            "format": {
                "type": "grammar",
                "syntax": "lark",
                "definition": grammar,
            },
        }
    ]
)

# Process response
print(response.output)

# Response output will contain tool calls with grammar-validated input:
# [
#     {
#         "id": "rs_6890ed2b6374819dbbff5353e6664ef103f4db9848be4829",
#         "type": "reasoning",
#         "content": [],
#         "summary": []
#     },
#     {
#         "id": "ctc_6890ed2f32e8819daa62bef772b8c15503f4db9848be4829",
#         "type": "custom_tool_call",
#         "status": "completed",
#         "call_id": "call_pmlLjmvG33KJdyVdC4MVdk5N",
#         "input": "4 + 4",
#         "name": "math_exp"
#     }
# ]
```
```

--------------------------------

### POST /assistants - Create or Update Assistant

Source: https://platform.openai.com/docs/api-reference/assistants/modifyAssistant

Create a new assistant or update an existing assistant with custom instructions, model configuration, tools, and behavior parameters. This endpoint allows you to configure the assistant's name, description, system instructions, model, reasoning effort, response format, sampling temperature, and available tools.

```APIDOC
## POST /assistants

### Description
Create a new assistant or update an existing assistant with configuration parameters including model selection, instructions, tools, and response formatting.

### Method
POST

### Endpoint
/assistants

### Request Body Parameters

#### name
- **Type**: string
- **Required**: Optional
- **Max Length**: 256 characters
- **Description**: The name of the assistant.

#### description
- **Type**: string
- **Required**: Optional
- **Max Length**: 512 characters
- **Description**: The description of the assistant.

#### instructions
- **Type**: string
- **Required**: Optional
- **Max Length**: 256,000 characters
- **Description**: The system instructions that the assistant uses.

#### model
- **Type**: string
- **Required**: Optional
- **Description**: ID of the model to use. You can use the List models API to see all available models.

#### temperature
- **Type**: number
- **Required**: Optional
- **Default**: 1
- **Range**: 0 to 2
- **Description**: What sampling temperature to use. Higher values (e.g., 0.8) make output more random, while lower values (e.g., 0.2) make it more focused and deterministic.

#### top_p
- **Type**: number
- **Required**: Optional
- **Default**: 1
- **Range**: 0 to 1
- **Description**: Nucleus sampling parameter. 0.1 means only tokens comprising the top 10% probability mass are considered. Recommended to alter this or temperature but not both.

#### reasoning_effort
- **Type**: string
- **Required**: Optional
- **Default**: medium
- **Possible Values**: none, minimal, low, medium, high, xhigh
- **Description**: Constrains effort on reasoning for reasoning models. Reducing reasoning effort can result in faster responses and fewer tokens used. Model-specific constraints apply: gpt-5.1 defaults to none; gpt-5-pro defaults to and only supports high; xhigh is supported for models after gpt-5.1-codex-max.

#### response_format
- **Type**: "auto" or object
- **Required**: Optional
- **Description**: Specifies the format that the model must output. Compatible with GPT-4o, GPT-4 Turbo, and GPT-3.5 Turbo models. Set to {"type": "json_schema", "json_schema": {...}} for Structured Outputs or {"type": "json_object"} for JSON mode. When using JSON mode, you must instruct the model to produce JSON via a system or user message.

#### tools
- **Type**: array
- **Required**: Optional
- **Default**: []
- **Max Count**: 128 tools per assistant
- **Possible Tool Types**: code_interpreter, file_search, function
- **Description**: A list of tools enabled on the assistant.

#### tool_resources
- **Type**: object
- **Required**: Optional
- **Description**: A set of resources used by the assistant's tools. Resources are specific to tool type. For example, code_interpreter requires file IDs, while file_search requires vector store IDs.

#### metadata
- **Type**: map (key-value pairs)
- **Required**: Optional
- **Max Pairs**: 16
- **Max Key Length**: 64 characters
- **Max Value Length**: 512 characters
- **Description**: Set of key-value pairs that can be attached to an object for storing additional information in structured format and querying via API or dashboard.

### Request Example
```json
{
  "name": "Math Tutor",
  "description": "An assistant that helps with mathematics",
  "instructions": "You are a helpful math tutor. Provide step-by-step solutions.",
  "model": "gpt-4o",
  "temperature": 0.7,
  "top_p": 0.9,
  "reasoning_effort": "medium",
  "response_format": "auto",
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "metadata": {
    "version": "1.0",
    "department": "Education"
  }
}
```

### Response
#### Success Response (200 OK)
- **id** (string) - The unique identifier of the assistant
- **object** (string) - The object type (always "assistant")
- **created_at** (integer) - Unix timestamp of creation
- **name** (string) - The assistant name
- **description** (string) - The assistant description
- **instructions** (string) - The system instructions
- **model** (string) - The model ID
- **tools** (array) - List of enabled tools
- **metadata** (object) - Custom metadata key-value pairs

#### Response Example
```json
{
  "id": "asst_abc123",
  "object": "assistant",
  "created_at": 1699009403,
  "name": "Math Tutor",
  "description": "An assistant that helps with mathematics",
  "instructions": "You are a helpful math tutor. Provide step-by-step solutions.",
  "model": "gpt-4o",
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "metadata": {
    "version": "1.0",
    "department": "Education"
  }
}
```
```

--------------------------------

### GET /videos - List Videos

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=coloring

Enumerates a list of your video generation jobs, with support for pagination to browse through your history.

```APIDOC
## GET /videos

### Description
Enumerate your videos with pagination, useful for displaying history, dashboards, or housekeeping tasks.

### Method
GET

### Endpoint
/videos

### Parameters
#### Query Parameters
- **limit** (integer) - Optional - A limit on the number of objects to be returned. Default is 20, maximum is 100.
- **offset** (integer) - Optional - A cursor for use in pagination. This is the ID of the object after which to start fetching. (Note: Actual API might use `starting_after` or `ending_before`)

### Request Example
(No request body for GET)

### Response
#### Success Response (200)
- **data** (array) - A list of video job objects.
  - **id** (string) - The unique identifier for the video generation job.
  - **status** (string) - The current status of the job.
  - **created_at** (string) - Timestamp when the job was created.
  - **model** (string) - The model used for generation.
  - **output_url** (string) - URL to the generated video content (if completed).
- **has_more** (boolean) - Indicates if there are more videos to retrieve.

#### Response Example
```json
{
  "data": [
    {
      "id": "vid_abc123def456",
      "status": "completed",
      "created_at": "2023-10-27T10:00:00Z",
      "model": "sora-2",
      "output_url": "https://openai.com/sora/videos/vid_abc123def456.mp4"
    },
    {
      "id": "vid_ghi789jkl012",
      "status": "processing",
      "created_at": "2023-10-27T09:30:00Z",
      "model": "sora-2-pro"
    }
  ],
  "has_more": true
}
```
```

--------------------------------

### POST /videos

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=90s-TV-Ad

Starts a new video rendering job from a text prompt, with optional parameters for model, dimensions, duration, or referencing existing content for remixing. This is an asynchronous process, returning a job ID for status tracking.

```APIDOC
## POST /videos

### Description
Starts a new video rendering job from a text prompt, with optional parameters for model, dimensions, duration, or referencing existing content for remixing. This is an asynchronous process, returning a job ID for status tracking.

### Method
POST

### Endpoint
/videos

### Parameters
#### Request Body
- **prompt** (string) - Required - The natural language description for the video.
- **model** (string) - Optional - The Sora model to use for generation. Defaults to `sora-2`. Accepted values: `sora-2`, `sora-2-pro`.
- **size** (string) - Optional - The desired dimensions of the video (e.g., `1792x1024`).
- **duration** (string) - Optional - The desired duration of the video (e.g., `8s`).
- **remix_id** (string) - Optional - The ID of an existing video to use as a basis for remixing.
- **reference_inputs** (array) - Optional - An array of reference inputs (e.g., image IDs, video IDs) to guide the generation.

### Request Example
```json
{
  "prompt": "A peaceful, cinematic scene of two sea otters floating side by side on calm, sunlit water. They hold hands together gently as they drift, their fur glistening with droplets that sparkle in the golden light. The camera lingers close, capturing soft ripples and the subtle rise and fall of their breathing. Reflections of the sky shimmer across the surface—hues of blue and amber blending like watercolor. The moment feels tender and intimate, a quiet portrait of love and trust in nature’s still embrace",
  "model": "sora-2-pro",
  "size": "1792x1024",
  "duration": "8s"
}
```

### Response
#### Success Response (202 Accepted)
- **id** (string) - The unique identifier for the video rendering job.
- **status** (string) - The initial status of the job (e.g., `pending`, `processing`).
- **created_at** (string) - Timestamp indicating when the job was created (ISO 8601 format).
- **model** (string) - The Sora model specified for the job.

#### Response Example
```json
{
  "id": "job_abc123def456",
  "status": "pending",
  "created_at": "2023-10-27T10:00:00Z",
  "model": "sora-2-pro"
}
```
```

--------------------------------

### GET /videos/{video_id} - Get Video Status

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=maui

Retrieve the current state and progress of a video render job. Use this endpoint to poll for job completion or monitor the status of an asynchronous video generation process.

```APIDOC
## GET /videos/{video_id}

### Description
Fetches the current status and metadata of a video generation job. Poll this endpoint to monitor progress or determine when a job has completed and is ready for download.

### Method
GET

### Endpoint
/videos/{video_id}

### Path Parameters
- **video_id** (string) - Required - The unique identifier of the video job returned from POST /videos

### Response
#### Success Response (200)
- **id** (string) - Unique identifier for the video job
- **status** (string) - Current job status ("processing", "completed", "failed")
- **created_at** (timestamp) - Job creation time
- **completed_at** (timestamp) - Completion time (null if not completed)
- **prompt** (string) - The prompt used for generation
- **model** (string) - The model variant used
- **duration** (integer) - Video duration in seconds (when completed)
- **size** (string) - Video dimensions (e.g., "1792x1024") (when completed)

#### Response Example
{
  "id": "vid_abc123def456",
  "status": "completed",
  "created_at": "2024-01-15T10:30:00Z",
  "completed_at": "2024-01-15T10:35:45Z",
  "prompt": "A peaceful, cinematic scene of two sea otters floating side by side on calm, sunlit water...",
  "model": "sora-2-pro",
  "duration": 8,
  "size": "1792x1024"
}
```

--------------------------------

### Define and Use Custom Web Search Tool with OpenAI Chat Completions API

Source: https://platform.openai.com/docs/guides/migrate-to-responses

This snippet illustrates how to define a custom `web_search` tool and integrate it with the OpenAI Chat Completions API. It includes implementations in JavaScript and Python for the tool's backend logic (querying an example search API) and configuring the tool definition within the Chat Completions request's `functions` array. A cURL example for the underlying search API is also provided.

```javascript
async function web_search(query) {
    const fetch = (await import('node-fetch')).default;
    const res = await fetch(`https://api.example.com/search?q=${query}`);
    const data = await res.json();
    return data.results;
}

const completion = await client.chat.completions.create({
  model: 'gpt-5',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Who is the current president of France?' }
  ],
  functions: [
    {
      name: 'web_search',
      description: 'Search the web for information',
      parameters: {
        type: 'object',
        properties: { query: { type: 'string' } },
        required: ['query']
      }
    }
  ]
});
```

```python
import requests

def web_search(query):
    r = requests.get(f"https://api.example.com/search?q={query}")
    return r.json().get("results", [])

completion = client.chat.completions.create(
    model="gpt-5",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who is the current president of France?"}
    ],
    functions=[
        {
            "name": "web_search",
            "description": "Search the web for information",
            "parameters": {
                "type": "object",
                "properties": {"query": {"type": "string"}},
                "required": ["query"]
            }
        }
    ]
)
```

```curl
curl https://api.example.com/search \
  -G \
  --data-urlencode "q=your+search+term" \
  --data-urlencode "key=$SEARCH_API_KEY"
```

--------------------------------

### GET /videos/{video_id} - Get video status

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=Cozy-Coffee-Shop-Interior

Retrieve the current state and progress of a specific video rendering job using its unique ID. This endpoint can be polled or used with webhooks to monitor job completion.

```APIDOC
## GET /videos/{video_id}

### Description
Retrieve the current status and progress of a specific video rendering job identified by its unique ID. This endpoint can be polled to monitor job completion or confirm final state.

### Method
GET

### Endpoint
/videos/{video_id}

### Parameters
#### Path Parameters
- **video_id** (string) - Required - The unique identifier of the video rendering job.

### Response
#### Success Response (200 OK)
- **id** (string) - The unique identifier for the video rendering job.
- **status** (string) - The current status of the job (e.g., "pending", "processing", "completed", "failed").
- **progress** (number) - Optional - A percentage (0-100) indicating the job's progress, if available.
- **result_url** (string) - Optional - The URL to the final video content, available once status is "completed".
- **error_message** (string) - Optional - A description of the error if the job failed.

#### Response Example
```json
{
  "id": "job_123abc456def",
  "status": "processing",
  "progress": 75
}
```

```json
{
  "id": "job_123abc456def",
  "status": "completed",
  "result_url": "https://api.openai.com/videos/job_123abc456def/content"
}
```
```

--------------------------------

### Generate and Download OpenAI Video (JavaScript, Python)

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=coloring

These code snippets demonstrate how to programmatically initiate a video generation request using the OpenAI API, monitor its progress asynchronously, and then download the final MP4 content once the generation is complete. They showcase usage of the respective OpenAI client libraries to create videos, track their lifecycle, and persist the output to local storage.

```javascript
import OpenAI from 'openai';

const openai = new OpenAI();

let video = await openai.videos.create({
    model: 'sora-2',
    prompt: "A video of the words 'Thank you' in sparkling letters",
});

console.log('Video generation started: ', video);
let progress = video.progress ?? 0;

while (video.status === 'in_progress' || video.status === 'queued') {
    video = await openai.videos.retrieve(video.id);
    progress = video.progress ?? 0;

    // Display progress bar
    const barLength = 30;
    const filledLength = Math.floor((progress / 100) * barLength);
    // Simple ASCII progress visualization for terminal output
    const bar = '='.repeat(filledLength) + '-'.repeat(barLength - filledLength);
    const statusText = video.status === 'queued' ? 'Queued' : 'Processing';

    process.stdout.write(`${statusText}: [${bar}] ${progress.toFixed(1)}%`);

    await new Promise((resolve) => setTimeout(resolve, 2000));
}

// Clear the progress line and show completion
process.stdout.write('\n');

if (video.status === 'failed') {
    console.error('Video generation failed');
    return;
}

console.log('Video generation completed: ', video);

console.log('Downloading video content...');

const content = await openai.videos.downloadContent(video.id);

const body = content.arrayBuffer();
const buffer = Buffer.from(await body);

require('fs').writeFileSync('video.mp4', buffer);

console.log('Wrote video.mp4');
```

```python
from openai import OpenAI
import sys
import time


openai = OpenAI()

video = openai.videos.create(
    model="sora-2",
    prompt="A video of a cool cat on a motorcycle in the night",
)

print("Video generation started:", video)

progress = getattr(video, "progress", 0)
bar_length = 30

while video.status in ("in_progress", "queued"):
    # Refresh status
    video = openai.videos.retrieve(video.id)
    progress = getattr(video, "progress", 0)

    filled_length = int((progress / 100) * bar_length)
    bar = "=" * filled_length + "-" * (bar_length - filled_length)
    status_text = "Queued" if video.status == "queued" else "Processing"

    sys.stdout.write(f"\n{status_text}: [{bar}] {progress:.1f}%")
    sys.stdout.flush()
    time.sleep(2)

# Move to next line after progress loop
sys.stdout.write("\n")

if video.status == "failed":
    message = getattr(
        getattr(video, "error", None), "message", "Video generation failed"
    )
    print(message)
    return

print("Video generation completed:", video)
print("Downloading video content...")

content = openai.videos.download_content(video.id, variant="video")
content.write_to_file("video.mp4")

print("Wrote video.mp4")
```

--------------------------------

### Example Output of OpenAI Moderation API for Image Input

Source: https://platform.openai.com/docs/guides/moderation

This JSON snippet presents a full example of the output received from the OpenAI moderation API after processing an image input. It showcases the `flagged` status, detailed `categories` (e.g., violence), `category_scores`, and `category_applied_input_types`, providing a clear understanding of the moderation results for a given input.

```json
{
  "id": "modr-970d409ef3bef3b70c73d8232df86e7d",
  "model": "omni-moderation-latest",
  "results": [
    {
      "flagged": true,
      "categories": {
        "sexual": false,
        "sexual/minors": false,
        "harassment": false,
        "harassment/threatening": false,
        "hate": false,
        "hate/threatening": false,
        "illicit": false,
        "illicit/violent": false,
        "self-harm": false,
        "self-harm/intent": false,
        "self-harm/instructions": false,
        "violence": true,
        "violence/graphic": false
      },
      "category_scores": {
        "sexual": 2.34135824776394e-7,
        "sexual/minors": 1.6346470245419304e-7,
        "harassment": 0.0011643905680426018,
        "harassment/threatening": 0.0022121340080906377,
        "hate": 3.1999824407395835e-7,
        "hate/threatening": 2.4923252458203563e-7,
        "illicit": 0.0005227032493135171,
        "illicit/violent": 3.682979260160596e-7,
        "self-harm": 0.0011175734280627694,
        "self-harm/intent": 0.0006264858507989037,
        "self-harm/instructions": 7.368592981140821e-8,
        "violence": 0.8599265510337075,
        "violence/graphic": 0.37701736389561064
      },
      "category_applied_input_types": {
        "sexual": [
          "image"
        ],
        "sexual/minors": [],
        "harassment": [],
        "harassment/threatening": [],
        "hate": [],
        "hate/threatening": [],
        "illicit": [],
        "illicit/violent": [],
        "self-harm": [
          "image"
        ],
        "self-harm/intent": [
          "image"
        ],
        "self-harm/instructions": [
          "image"
        ],
        "violence": [
          "image"
        ],
        "violence/graphic": [
          "image"
        ]
      }
    }
  ]
}
```

--------------------------------

### POST /videos - Create Video

Source: https://platform.openai.com/docs/guides/video-generation_gallery=open&galleryItem=maui

Start a new video render job from a text prompt, with optional reference inputs or a remix ID. This endpoint initiates an asynchronous video generation process and returns a job object with an ID and initial status.

```APIDOC
## POST /videos

### Description
Initiates a new video generation job. Accepts a text prompt and optional parameters for model selection, reference images, or remix operations. Returns immediately with a job ID for status tracking.

### Method
POST

### Endpoint
/videos

### Request Body
- **prompt** (string) - Required - Natural language description of the video to generate
- **model** (string) - Optional - Model variant: "sora-2" (default, fast) or "sora-2-pro" (production-quality)
- **reference_image** (string/file) - Optional - Base image for video generation
- **remix_id** (string) - Optional - ID of existing video to remix or extend

### Request Example
{
  "prompt": "A peaceful, cinematic scene of two sea otters floating side by side on calm, sunlit water. They hold hands together gently as they drift, their fur glistening with droplets that sparkle in the golden light.",
  "model": "sora-2-pro",
  "reference_image": null,
  "remix_id": null
}

### Response
#### Success Response (201)
- **id** (string) - Unique identifier for the video job
- **status** (string) - Initial job status (e.g., "processing")
- **created_at** (timestamp) - Job creation time
- **prompt** (string) - The prompt used for generation
- **model** (string) - The model variant used

#### Response Example
{
  "id": "vid_abc123def456",
  "status": "processing",
  "created_at": "2024-01-15T10:30:00Z",
  "prompt": "A peaceful, cinematic scene of two sea otters floating side by side on calm, sunlit water...",
  "model": "sora-2-pro"
}
```