### Generate Music with Detailed Response (Python)

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/music

This example shows how to generate music and retrieve detailed information, including the composition plan and song metadata, using `elevenlabs.music.compose_detailed`. It specifies a prompt and music length, then prints the JSON details and filename, noting that audio bytes are also available.

```python
track_details = elevenlabs.music.compose_detailed(
    prompt="Create an intense, fast-paced electronic track for a high-adrenaline video game scene. Use driving synth arpeggios, punchy drums, distorted bass, glitch effects, and aggressive rhythmic textures. The tempo should be fast, 130–150 bpm, with rising tension, quick transitions, and dynamic energy bursts.",
    music_length_ms=10000,
)

print(track_details.json)
print(track_details.filename)
# track_details.audio contains the audio bytes
```

--------------------------------

### Guide Assistant for Sequential Tool Calls in System Prompt

Source: https://elevenlabs.io/docs/agents-platform/customization/tools/server-tools

This `plaintext` example illustrates how to provide instructions for complex, sequential tool usage within an AI assistant's system prompt. It guides the assistant to first use `check_availability` before calling `schedule_meeting` to prevent scheduling conflicts, enhancing the logic and effectiveness of tool interactions.

```plaintext
Before scheduling a meeting with `schedule_meeting`, check the user's calendar for availability using check_availability to avoid conflicts.
```

--------------------------------

### Retrieve a Studio Project using ElevenLabs API (Multi-language)

Source: https://elevenlabs.io/docs/api-reference/studio/get-project

These examples illustrate how to fetch details for a specific Studio Project from the ElevenLabs API. Each snippet demonstrates making a GET request to the `/v1/studio/projects/{project_id}` endpoint, either using the official ElevenLabs SDKs (TypeScript, Python) or common HTTP client libraries (Go, Ruby, Java, PHP, C#, Swift). Most examples require an API key for authentication, which should be replaced with your actual 'xi-api-key'. The output typically includes the project's data.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.studio.projects.get("project_id", {});
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.studio.projects.get(
    project_id="project_id"
)
```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/studio/projects/project_id"

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

url = URI("https://api.elevenlabs.io/v1/studio/projects/project_id")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/studio/projects/project_id")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/studio/projects/project_id', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/studio/projects/project_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/studio/projects/project_id")! as URL,
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

### SDK Examples - Get RAG Index Overview

Source: https://elevenlabs.io/docs/api-reference/knowledge-base/rag-index-overview

Code examples demonstrating how to call the Get RAG Index Overview endpoint using various programming languages and SDKs including TypeScript, Python, Go, Ruby, Java, PHP, C#, and Swift.

```APIDOC
## SDK Implementation Examples

### TypeScript
```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.ragIndexOverview();
}
main();
```

### Python
```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.rag_index_overview()
```

### Go
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

### Ruby
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

### Java
```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/knowledge-base/rag-index")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

### PHP
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

### C#
```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/knowledge-base/rag-index");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

### Swift
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
```

--------------------------------

### Make Direct GET Request to Conversational AI Agent Testing Endpoint

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/list

These examples illustrate how to perform a direct HTTP GET request to the `/v1/convai/agent-testing` endpoint. Each example shows how to set the request URL, add the `xi-api-key` header, and execute the request using common HTTP client libraries or native functionalities in different programming languages. Replace 'xi-api-key' with your actual API key.

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

### List Conversational AI Tests using ElevenLabs SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/list

These examples demonstrate how to initialize the ElevenLabs client and list conversational AI tests using the official SDKs. They show how to set the environment URL and call the `conversationalAi.tests.list` method. Requires the respective ElevenLabs SDK installed.

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

### Convert audio to text using ElevenLabs Speech to Text API (Python, TypeScript)

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/speech-to-text/quickstart

Example code demonstrating how to use the ElevenLabs SDK to convert an audio file from a URL into text. It shows how to initialize the client, fetch audio data, and call the `speechToText.convert` method with various parameters like model ID, audio event tagging, language code, and diarization.

```python
# example.py
import os
from dotenv import load_dotenv
from io import BytesIO
import requests
from elevenlabs.client import ElevenLabs

load_dotenv()

elevenlabs = ElevenLabs(
  api_key=os.getenv("ELEVENLABS_API_KEY"),
)

audio_url = (
    "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3"
)
response = requests.get(audio_url)
audio_data = BytesIO(response.content)

transcription = elevenlabs.speech_to_text.convert(
    file=audio_data,
    model_id="scribe_v2", # Model to use
    tag_audio_events=True, # Tag audio events like laughter, applause, etc.
    language_code="eng", # Language of the audio file. If set to None, the model will detect the language automatically.
    diarize=True, # Whether to annotate who is speaking
)

print(transcription)
```

```typescript
// example.mts
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import "dotenv/config";

const elevenlabs = new ElevenLabsClient();

const response = await fetch(
  "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3"
);
const audioBlob = new Blob([await response.arrayBuffer()], { type: "audio/mp3" });

const transcription = await elevenlabs.speechToText.convert({
  file: audioBlob,
  modelId: "scribe_v2", // Model to use
  tagAudioEvents: true, // Tag audio events like laughter, applause, etc.
  languageCode: "eng", // Language of the audio file. If set to null, the model will detect the language automatically.
  diarize: true, // Whether to annotate who is speaking
});

console.log(transcription);
```

--------------------------------

### Handle Copyrighted Prompt Error and Get Suggestion (Python)

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/music

This snippet demonstrates how to handle a `bad_prompt` error when attempting to generate music with copyrighted material. It catches the exception, extracts a `prompt_suggestion` from the error body, and prints it, indicating how to use the suggestion for a valid generation.

```python
try:
    # This will result in a bad_prompt error
    track = elevenlabs.music.compose(
        prompt="A song that sounds like 'Bohemian Rhapsody'",
        music_length_ms=10000,
    )
except Exception as e:
    if e.body['detail']['status'] == 'bad_prompt':
        prompt_suggestion = e.body['detail']['data']['prompt_suggestion']
        print(prompt_suggestion) # Prints: An epic rock ballad with dramatic tempo changes, operatic harmonies, and a narrative structure that blends melancholy with bursts of theatrical intensity.

        # Use the prompt suggestion to generate the track instead
```

--------------------------------

### Install ElevenLabs SDK and Dependencies - TypeScript

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/dubbing

Install the ElevenLabs JavaScript SDK and dotenv library for Node.js. These packages enable TypeScript/JavaScript applications to access the Dubbing API and load environment configuration.

```bash
npm install @elevenlabs/elevenlabs-js
npm install dotenv
```

--------------------------------

### Get Default Voice Settings from ElevenLabs API

Source: https://elevenlabs.io/docs/api-reference/voices/settings/get-default

These code examples illustrate how to fetch the default voice settings from the ElevenLabs API. They demonstrate making a GET request to the `/v1/voices/settings/default` endpoint. For direct HTTP calls, an `xi-api-key` header is required for authentication. SDK examples abstract this authentication and provide a more convenient interface.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.voices.settings.getDefault();
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.voices.settings.get_default()
```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/voices/settings/default"

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

url = URI("https://api.elevenlabs.io/v1/voices/settings/default")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/voices/settings/default")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/voices/settings/default', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/voices/settings/default");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/voices/settings/default")! as URL,
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

### Python SDK Example

Source: https://elevenlabs.io/docs/api-reference/studio/add-chapter

Create a chapter using the ElevenLabs Python SDK. This example shows how to initialize the client and create a chapter with the specified project ID and name.

```APIDOC
## Python SDK Implementation

### Installation
```
pip install elevenlabs
```

### Usage
```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.studio.projects.chapters.create(
    project_id="project_id",
    name="Chapter 1"
)
```

### Parameters
- **project_id** (string) - The ID of the project
- **name** (string) - The name of the chapter to create

### Returns
The created chapter object
```

--------------------------------

### Go HTTP Example

Source: https://elevenlabs.io/docs/api-reference/studio/add-chapter

Create a chapter using native Go HTTP client. This example demonstrates making a POST request with proper headers and request body formatting.

```APIDOC
## Go HTTP Implementation

### Usage
```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {
	url := "https://api.elevenlabs.io/v1/studio/projects/project_id/chapters"

	payload := strings.NewReader("{\n  \"name\": \"Chapter 1\"\n}")

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

### Headers
- **xi-api-key** - Your ElevenLabs API key
- **Content-Type** - application/json
```

--------------------------------

### Get Source File URL - Go HTTP Client

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-source-file-url

Go example using the standard net/http package to make a GET request to the source file URL endpoint. Includes proper header setup with xi-api-key authentication and response body reading.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/source-file-url"

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

### Crafting System Prompts for Precise Agent Tool Invocation

Source: https://elevenlabs.io/docs/agents-platform/customization/tools/client-tools

These examples illustrate how to provide explicit instructions within an ElevenLabs agent's system prompt to guide its tool-calling behavior. They demonstrate how to specify conditions for when a tool should be used based on user queries and how to define sequential tool usage for complex workflows, enhancing the agent's accuracy and reliability in tool selection.

```plaintext
Use `check_order_status` when the user inquires about the status of their order, such as 'Where is my order?' or 'Has my order shipped yet?'.
```

```plaintext
Before scheduling a meeting with `schedule_meeting`, check the user's calendar for availability using check_availability to avoid conflicts.
```

--------------------------------

### Generate Music with Composition Plan (Python)

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/music

This snippet demonstrates how to generate music using a pre-defined `composition_plan` with the `elevenlabs.music.compose` method. It shows passing the plan directly to the method and then playing the resulting composition.

```python
composition = elevenlabs.music.compose(
    composition_plan=composition_plan,
)

play(composition)
```

--------------------------------

### Call ElevenLabs API to Convert Chapter

Source: https://elevenlabs.io/docs/api-reference/studio/convert-chapter

These code examples demonstrate how to programmatically call the ElevenLabs API to start the conversion of a specific chapter. They show how to initialize the client (where applicable), set the project and chapter IDs, and include the `xi-api-key` for authentication. The examples cover various SDKs and HTTP client libraries.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.studio.projects.chapters.convert("project_id", "chapter_id");
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.studio.projects.chapters.convert(
    project_id="project_id",
    chapter_id="chapter_id"
)
```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/studio/projects/project_id/chapters/chapter_id/convert"

	req, _ := http.NewRequest("POST", url, nil)

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

url = URI("https://api.elevenlabs.io/v1/studio/projects/project_id/chapters/chapter_id/convert")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/studio/projects/project_id/chapters/chapter_id/convert")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/studio/projects/project_id/chapters/chapter_id/convert', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/studio/projects/project_id/chapters/chapter_id/convert");
var request = new RestRequest(Method.POST);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/studio/projects/project_id/chapters/chapter_id/convert")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
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

### Retrieve ElevenLabs Conversation Signed URL using Various Programming Language SDKs

Source: https://elevenlabs.io/docs/api-reference/conversations/get-signed-url

These code examples demonstrate how to programmatically fetch a signed URL for an ElevenLabs conversational AI agent across multiple programming languages. Each example shows how to construct the GET request to `/v1/convai/conversation/get-signed-url`, typically passing an `agent_id` and an `xi-api-key`. The response provides the `signed_url` necessary to start an authorized conversation.

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

--------------------------------

### GET /api/agent-tests/{test_id}

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/get_explorer=true

Retrieves the detailed configuration and results for a specific agent test by its unique identifier. This endpoint provides comprehensive information about the test's setup, including success/failure conditions, example responses, and associated metadata.

```APIDOC
## GET /api/agent-tests/{test_id}

### Description
Retrieves the detailed configuration and results for a specific agent test by its ID. This endpoint provides comprehensive information about the test's setup, including success/failure conditions, example responses, and associated metadata.

### Method
GET

### Endpoint
/api/agent-tests/{test_id}

### Parameters
#### Path Parameters
- **test_id** (string) - Required - The unique identifier of the agent test.

#### Query Parameters
(None)

#### Request Body
(None)

### Request Example
(None)

### Response
#### Success Response (200)
- **chat_history** (list of objects) - A list of chat history objects associated with the test. Each object contains 15 properties (details not provided).
- **success_condition** (string) - A prompt that evaluates whether the agent's response is successful. Should return True or False.
- **success_examples** (list of objects) - A non-empty list of example responses that should be considered successful. Each object contains 2 properties (details not provided).
- **failure_examples** (list of objects) - A non-empty list of example responses that should be considered failures. Each object contains 2 properties (details not provided).
- **id** (string) - The unique identifier of the agent test.
- **name** (string) - The name of the agent test.
- **tool_call_parameters** (object or null) - How to evaluate the agent’s tool call (if any). If empty, the tool call is not evaluated. Contains 3 properties (details not provided).
- **dynamic_variables** (map from strings to nullable strings or doubles or integers or booleans or null) - Dynamic variables to replace in the agent config during testing. Supports 4 variants (details not provided).
- **type** (enum or null) - The type of the agent test. Allowed values: `llm`, `tool`.
- **from_conversation_metadata** (object or null) - Metadata of a conversation this test was created from (if applicable). Contains 4 properties (details not provided).

#### Response Example
```json
{
  "chat_history": [
    {
      "//": "15 properties"
    }
  ],
  "success_condition": "response contains 'success'",
  "success_examples": [
    {
      "//": "2 properties"
    }
  ],
  "failure_examples": [
    {
      "//": "2 properties"
    }
  ],
  "id": "test_abc123",
  "name": "Initial Agent Test",
  "tool_call_parameters": {
    "//": "3 properties"
  },
  "dynamic_variables": {
    "key1": "value1",
    "key2": 123,
    "key3": true
  },
  "type": "llm",
  "from_conversation_metadata": {
    "//": "4 properties"
  }
}
```

### Errors
#### Error Response (422)
- **description** (string) - Unprocessable Entity Error. This error typically indicates that the request could not be processed due to semantic errors in the request body or parameters.

#### Error Example (422)
```json
{
  "detail": "Unprocessable Entity"
}
```
```

--------------------------------

### Java HTTP Example

Source: https://elevenlabs.io/docs/api-reference/voices/pvc/samples/get-waveform

Example implementation using Unirest library to retrieve a voice sample waveform.

```APIDOC
## Java HTTP Implementation

### Code Example
```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/voices/pvc/voice_id/samples/sample_id/waveform")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

### Usage
Use the Unirest library to make a GET request with the xi-api-key header to retrieve the waveform data.
```

--------------------------------

### Handle bad_prompt Error with Prompt Suggestion - Python & TypeScript

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/music/quickstart

Demonstrates error handling when a music composition prompt contains copyrighted material. The API returns a bad_prompt error with a prompt_suggestion field containing an alternative prompt. This example shows how to catch the exception, extract the suggestion, and use it for music generation in both Python and TypeScript.

```python
try:
    # This will result in a bad_prompt error
    track = elevenlabs.music.compose(
        prompt="A song that sounds like 'Bohemian Rhapsody'",
        music_length_ms=10000,
    )
except Exception as e:
    if e.body['detail']['status'] == 'bad_prompt':
        prompt_suggestion = e.body['detail']['data']['prompt_suggestion']
        print(prompt_suggestion) # Prints: An epic rock ballad with dramatic tempo changes, operatic harmonies, and a narrative structure that blends melancholy with bursts of theatrical intensity.

        # Use the prompt suggestion to generate the track instead
```

```typescript
try {
  // This will result in a bad_prompt error
  const track = await elevenlabs.music.compose({
    prompt: "A song that sounds like 'Bohemian Rhapsody'",
    musicLengthMs: 10000,
  });
} catch (error) {
  if (error.body.detail.status === 'bad_prompt') {
    const promptSuggestion = error.body.detail.data.prompt_suggestion;
    console.log(promptSuggestion); // Logs: An epic rock ballad with dramatic tempo changes, operatic harmonies, and a narrative structure that blends melancholy with bursts of theatrical intensity.

    // Use the prompt suggestion to generate the track instead
  }
}
```

--------------------------------

### C# HTTP Example

Source: https://elevenlabs.io/docs/api-reference/voices/pvc/samples/get-waveform

Example implementation using RestSharp library to retrieve a voice sample waveform.

```APIDOC
## C# HTTP Implementation

### Code Example
```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/voices/pvc/voice_id/samples/sample_id/waveform");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

### Usage
Create a RestClient instance, configure a GET request with the xi-api-key header, and execute the request.
```

--------------------------------

### Create Composition Plan from Prompt - ElevenLabs Music API

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/music/quickstart

Generates a structured composition plan from a text prompt using the ElevenLabs API. The plan includes positive and negative global styles, section breakdowns with local styles, and duration specifications. Requires ElevenLabs API key from environment variables.

```python
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play
import os
from dotenv import load_dotenv
load_dotenv()

elevenlabs = ElevenLabs(
api_key=os.getenv("ELEVENLABS_API_KEY"),
)

composition_plan = elevenlabs.music.composition_plan.create(
    prompt="Create an intense, fast-paced electronic track for a high-adrenaline video game scene. Use driving synth arpeggios, punchy drums, distorted bass, glitch effects, and aggressive rhythmic textures. The tempo should be fast, 130–150 bpm, with rising tension, quick transitions, and dynamic energy bursts.",
    music_length_ms=10000,
)

print(composition_plan)
```

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import "dotenv/config";

const elevenlabs = new ElevenLabsClient();

const compositionPlan = await elevenlabs.music.compositionPlan.create({
  prompt: "Create an intense, fast-paced electronic track for a high-adrenaline video game scene. Use driving synth arpeggios, punchy drums, distorted bass, glitch effects, and aggressive rhythmic textures. The tempo should be fast, 130–150 bpm, with rising tension, quick transitions, and dynamic energy bursts.",
  musicLengthMs: 10000,
});

console.log(JSON.stringify(compositionPlan, null, 2));
```

--------------------------------

### Install ElevenLabs SDK Packages

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/speech-to-text/realtime/client-side-streaming

These commands provide instructions for installing the necessary ElevenLabs SDK packages using npm. Separate commands are provided for React applications, which require `@elevenlabs/react`, and general JavaScript applications, which use `@elevenlabs/client`.

```bash
npm install @elevenlabs/react @elevenlabs/elevenlabs-js
```

```bash
npm install @elevenlabs/client @elevenlabs/elevenlabs-js
```

--------------------------------

### Python SDK Example

Source: https://elevenlabs.io/docs/api-reference/voices/pvc/samples/get-waveform

Example implementation using the ElevenLabs Python SDK to retrieve a voice sample waveform.

```APIDOC
## Python SDK Implementation

### Code Example
```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.voices.pvc.samples.waveform.get(
    voice_id="voice_id",
    sample_id="sample_id"
)
```

### Usage
Create an ElevenLabs client instance and call the `voices.pvc.samples.waveform.get()` method with the voice ID and sample ID parameters.
```

--------------------------------

### Swift HTTP Example

Source: https://elevenlabs.io/docs/api-reference/voices/pvc/samples/get-waveform

Example implementation using Swift's URLSession to retrieve a voice sample waveform.

```APIDOC
## Swift HTTP Implementation

### Code Example
```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/voices/pvc/voice_id/samples/sample_id/waveform")! as URL,
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

### Usage
Create an NSMutableURLRequest with the endpoint URL, set the HTTP method to GET, add the xi-api-key header, and execute the request using URLSession.
```

--------------------------------

### List ElevenLabs Models using various SDKs and HTTP clients

Source: https://elevenlabs.io/docs/api-reference/models/list

These code examples illustrate how to programmatically retrieve a list of available speech synthesis models from the ElevenLabs API. Each example uses a different programming language and its common HTTP client or SDK to make a GET request to the `/v1/models` endpoint, often requiring an `xi-api-key` for authentication. The output typically includes the raw API response containing model details.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.models.list();
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.models.list()
```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/models"

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

url = URI("https://api.elevenlabs.io/v1/models")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/models")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/models', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/models");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/models")! as URL,
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

### List Project Snapshots across SDKs and Languages

Source: https://elevenlabs.io/docs/api-reference/studio/get-snapshots

These examples illustrate how to fetch a list of project snapshots from the ElevenLabs API. Each snippet demonstrates the process using a different programming language or SDK, highlighting common patterns for API interaction such as setting base URLs, adding headers (like the 'xi-api-key'), and making GET requests to the `/v1/studio/projects/{project_id}/snapshots` endpoint. Ensure you replace 'project_id' with an actual project identifier and 'xi-api-key' with your valid ElevenLabs API key.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.studio.projects.snapshots.list("project_id");
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.studio.projects.snapshots.list(
    project_id="project_id"
)
```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/studio/projects/project_id/snapshots"

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

url = URI("https://api.elevenlabs.io/v1/studio/projects/project_id/snapshots")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/studio/projects/project_id/snapshots")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/studio/projects/project_id/snapshots', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/studio/projects/project_id/snapshots");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/studio/projects/project_id/snapshots")! as URL,
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

### PHP HTTP Example

Source: https://elevenlabs.io/docs/api-reference/voices/pvc/samples/get-waveform

Example implementation using Guzzle HTTP client to retrieve a voice sample waveform.

```APIDOC
## PHP HTTP Implementation

### Code Example
```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/voices/pvc/voice_id/samples/sample_id/waveform', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

### Usage
Create a Guzzle HTTP client and make a GET request with the xi-api-key header to retrieve the waveform data.
```

--------------------------------

### Get Dependent Agents - API Response Example

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/get-dependent-agents_explorer=true

Example JSON response from the GET /v1/convai/tools/:tool_id/dependent-agents endpoint showing the structure of returned agent data including pagination cursors for fetching additional results.

```json
{
  "agents": [
    {
      "referenced_resource_ids": [
        "resource-9f8b7c6d5e4a3b2c1d0e"
      ],
      "id": "agent-123e4567-e89b-12d3-a456-426614174000",
      "name": "Customer Support Bot",
      "type": "available",
      "created_at_unix_secs": 1685600000,
      "access_level": "admin"
    }
  ],
  "has_more": true,
  "next_cursor": "cursor_eyJpZCI6IjEyMyIsIm9mZnNldCI6MzB9"
}
```

--------------------------------

### Go HTTP Example

Source: https://elevenlabs.io/docs/api-reference/voices/pvc/samples/get-waveform

Example implementation using Go's native HTTP client to retrieve a voice sample waveform.

```APIDOC
## Go HTTP Implementation

### Code Example
```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {
	url := "https://api.elevenlabs.io/v1/voices/pvc/voice_id/samples/sample_id/waveform"

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("xi-api-key", "xi-api-key")

	res, _ := http.DefaultClient.Do(req)
	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))
}
```

### Usage
Create a GET request to the endpoint, add the xi-api-key header, and execute the request using the default HTTP client.
```

--------------------------------

### Start Real-time Speech-to-Text Transcription via Microphone

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/speech-to-text/realtime/client-side-streaming

These code examples demonstrate how to initiate a real-time speech-to-text transcription session using a microphone. The React example utilizes the `useScribe` hook, while the plain JavaScript example uses the `Scribe` client, both connecting with a single-use token and handling partial and committed transcripts.

```typescript
import { useScribe } from "@elevenlabs/react";

function MyComponent() {
  const scribe = useScribe({
    modelId: "scribe_v2_realtime",
    onPartialTranscript: (data) => {
      console.log("Partial:", data.text);
    },
    onCommittedTranscript: (data) => {
      console.log("Committed:", data.text);
    },
    onCommittedTranscriptWithTimestamps: (data) => {
      console.log("Committed with timestamps:", data.text);
      console.log("Timestamps:", data.words);
    },
  });

  const handleStart = async () => {
    // Fetch a single use token from the server
    const token = await fetchTokenFromServer();

    await scribe.connect({
      token,
      microphone: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });
  };

  return (
    <div>
      <button onClick={handleStart} disabled={scribe.isConnected}>
        Start Recording
      </button>
      <button onClick={scribe.disconnect} disabled={!scribe.isConnected}>
        Stop
      </button>

      {scribe.partialTranscript && <p>Live: {scribe.partialTranscript}</p>}

      <div>
        {scribe.committedTranscripts.map((t) => (
          <p key={t.id}>{t.text}</p>
        ))}
      </div>
    </div>
  );
}
```

```typescript
// Client side
import { Scribe, RealtimeEvents } from "@elevenlabs/client";

// Ensure you have authentication headers set up
const response = await fetch("/scribe-token", yourAuthHeaders);
const { token } = await response.json();

const connection = Scribe.connect({
  token,
  modelId: "scribe_v2_realtime",
  includeTimestamps: true,
  microphone: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
});

// Set up event handlers

// Session started
connection.on(RealtimeEvents.SESSION_STARTED, () => {
  console.log("Session started");
});

// Partial transcripts (interim results), use this in your UI to show the live transcript
connection.on(RealtimeEvents.PARTIAL_TRANSCRIPT, (data) => {
  console.log("Partial:", data.text);
});

// Committed transcripts
connection.on(RealtimeEvents.COMMITTED_TRANSCRIPT, (data) => {
  console.log("Committed:", data.text);
});
```

--------------------------------

### Generate and play speech using ElevenLabs Text to Speech API

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/text-to-speech/quickstart

This code demonstrates how to use the ElevenLabs SDK to convert text into lifelike speech and play it. It initializes the client with an API key, specifies the text, voice, model, and output format, then plays the generated audio. This snippet is provided for both Python and TypeScript, showcasing the core Text to Speech functionality.

```python
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play
import os

load_dotenv()

elevenlabs = ElevenLabs(
  api_key=os.getenv("ELEVENLABS_API_KEY"),
)

audio = elevenlabs.text_to_speech.convert(
    text="The first move is what sets everything in motion.",
    voice_id="JBFqnCBsd6RMkjVDRZzb",
    model_id="eleven_multilingual_v2",
    output_format="mp3_44100_128",
)

play(audio)
```

```typescript
import { ElevenLabsClient, play } from '@elevenlabs/elevenlabs-js';
import { Readable } from 'stream';
import 'dotenv/config';

const elevenlabs = new ElevenLabsClient();
const audio = await elevenlabs.textToSpeech.convert('JBFqnCBsd6RMkjVDRZzb', {
  text: 'The first move is what sets everything in motion.',
  modelId: 'eleven_multilingual_v2',
  outputFormat: 'mp3_44100_128',
});

const reader = audio.getReader();
const stream = new Readable({
  async read() {
    const { done, value } = await reader.read();
    if (done) {
      this.push(null);
    } else {
      this.push(value);
    }
  },
});

await play(stream);
```

--------------------------------

### TypeScript SDK Example

Source: https://elevenlabs.io/docs/api-reference/voices/pvc/samples/get-waveform

Example implementation using the ElevenLabs TypeScript SDK to retrieve a voice sample waveform.

```APIDOC
## TypeScript SDK Implementation

### Code Example
```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.voices.pvc.samples.waveform.get("voice_id", "sample_id");
}
main();
```

### Usage
Initialize the ElevenLabs client with the API endpoint and call the `voices.pvc.samples.waveform.get()` method with the voice ID and sample ID parameters.
```

--------------------------------

### Create Studio Project - Go HTTP Client

Source: https://elevenlabs.io/docs/api-reference/studio/add-project

Creates a studio project using Go's native net/http package with multipart form data. Requires API key authentication via xi-api-key header and handles multipart payload encoding for project metadata and optional file uploads.

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/studio/projects"

	payload := strings.NewReader("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\nProject 1\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"default_title_voice_id\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"default_paragraph_voice_id\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"default_model_id\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_url\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_document\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"from_content_json\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"quality_preset\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"title\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"author\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"description\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"genres\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"target_audience\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"language\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"content_type\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"original_publication_date\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"mature_content\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"isbn_number\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"acx_volume_normalization\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"volume_normalization\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"pronunciation_dictionary_locators\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"callback_url\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"fiction\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"apply_text_normalization\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"auto_convert\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"auto_assign_voices\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"source_type\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"voice_settings\"\r\n\r\n\r\n-----011000010111000001101001--\r\n")

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

### Get RAG Index Overview using PHP Guzzle

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/rag-index-overview

PHP example using GuzzleHttp client to make a GET request. Configures the xi-api-key header and outputs the response body.

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

### Start Local Supabase Stack

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/text-to-speech/streaming-and-caching-with-supabase

Initialize and start the local Supabase development environment. This command sets up a local PostgreSQL database, authentication, and storage services required for local function development.

```bash
supabase start
```

--------------------------------

### Generate Music with Eleven Music API - Python

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/music

Create and compose music using the Eleven Music API by providing a detailed prompt and duration. The code initializes the ElevenLabs client with API credentials, sends a composition request, and saves the generated audio to an MP3 file in chunks.

```python
# example.py
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play
import os
from dotenv import load_dotenv
load_dotenv()

elevenlabs = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
)

track = elevenlabs.music.compose(
    prompt="Create an intense, fast-paced electronic track for a high-adrenaline video game scene. Use driving synth arpeggios, punchy drums, distorted bass, glitch effects, and aggressive rhythmic textures. The tempo should be fast, 130–150 bpm, with rising tension, quick transitions, and dynamic energy bursts.",
    music_length_ms=10000,
)

# Save the track to a file
with open("path/to/music.mp3", "wb") as f:
    for chunk in track:
        f.write(chunk)
```

--------------------------------

### Handle Bad Prompt Error with Copyrighted Material

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/music/quickstart

When a music composition prompt contains copyrighted material (band names, musician references, or copyrighted lyrics), the API returns a bad_prompt error with a suggested alternative prompt. This example demonstrates how to catch the error and use the provided prompt suggestion to generate the track instead.

```APIDOC
## POST /music/compose

### Description
Compose music based on a text prompt. If the prompt contains copyrighted material, the API returns a `bad_prompt` error with a suggested alternative prompt.

### Method
POST

### Endpoint
/music/compose

### Parameters
#### Request Body
- **prompt** (string) - Required - Text description of the music to generate. Must not contain copyrighted material such as band names, musician names, or copyrighted lyrics.
- **music_length_ms** (integer) - Required - Duration of the generated music in milliseconds.

### Request Example
```python
track = elevenlabs.music.compose(
    prompt="A song that sounds like 'Bohemian Rhapsody'",
    music_length_ms=10000,
)
```

### Response
#### Error Response - Bad Prompt (400)
- **status** (string) - Error status: `bad_prompt`
- **prompt_suggestion** (string) - Suggested alternative prompt without copyrighted material

#### Error Response Example
```json
{
  "detail": {
    "status": "bad_prompt",
    "data": {
      "prompt_suggestion": "An epic rock ballad with dramatic tempo changes, operatic harmonies, and a narrative structure that blends melancholy with bursts of theatrical intensity."
    }
  }
}
```

### Error Handling Example (Python)
```python
try:
    track = elevenlabs.music.compose(
        prompt="A song that sounds like 'Bohemian Rhapsody'",
        music_length_ms=10000,
    )
except Exception as e:
    if e.body['detail']['status'] == 'bad_prompt':
        prompt_suggestion = e.body['detail']['data']['prompt_suggestion']
        print(prompt_suggestion)
        # Use the prompt suggestion to generate the track instead
        track = elevenlabs.music.compose(
            prompt=prompt_suggestion,
            music_length_ms=10000,
        )
```

### Error Handling Example (TypeScript)
```typescript
try {
    const track = await elevenlabs.music.compose({
        prompt: "A song that sounds like 'Bohemian Rhapsody'",
        musicLengthMs: 10000,
    });
} catch (error) {
    if (error.body.detail.status === 'bad_prompt') {
        const promptSuggestion = error.body.detail.data.prompt_suggestion;
        console.log(promptSuggestion);
        // Use the prompt suggestion to generate the track instead
        const track = await elevenlabs.music.compose({
            prompt: promptSuggestion,
            musicLengthMs: 10000,
        });
    }
}
```
```

--------------------------------

### Ruby HTTP Example

Source: https://elevenlabs.io/docs/api-reference/voices/pvc/samples/get-waveform

Example implementation using Ruby's Net::HTTP library to retrieve a voice sample waveform.

```APIDOC
## Ruby HTTP Implementation

### Code Example
```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/voices/pvc/voice_id/samples/sample_id/waveform")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

### Usage
Create a URI object, establish an HTTPS connection, create a GET request with the xi-api-key header, and execute the request.
```

--------------------------------

### TypeScript SDK Example

Source: https://elevenlabs.io/docs/api-reference/studio/add-chapter

Create a chapter using the official ElevenLabs TypeScript SDK. This example demonstrates how to instantiate the client and call the create method with project and chapter details.

```APIDOC
## TypeScript SDK Implementation

### Installation
```
npm install @elevenlabs/elevenlabs-js
```

### Usage
```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.studio.projects.chapters.create("project_id", {
        name: "Chapter 1",
    });
}
main();
```

### Parameters
- **project_id** (string) - The ID of the project
- **name** (string) - The name of the chapter to create

### Returns
Promise resolving to the created chapter object
```

--------------------------------

### Go HTTP Example

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/test-invocations/get

Example of retrieving a test suite invocation using Go's native HTTP client.

```APIDOC
## Go HTTP Example

### Usage
```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {
	url := "https://api.elevenlabs.io/v1/convai/test-invocations/test_invocation_id"

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("xi-api-key", "xi-api-key")

	res, _ := http.DefaultClient.Do(req)
	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))
}
```
```

--------------------------------

### Download Pronunciation Dictionary Version using ElevenLabs SDKs and HTTP Clients

Source: https://elevenlabs.io/docs/api-reference/pronunciation-dictionaries/download

These code examples demonstrate how to download a pronunciation dictionary version using the ElevenLabs SDKs (TypeScript, Python) and various HTTP clients (Go, Ruby, Java, PHP, C#, Swift). Each example shows how to make a GET request to the API endpoint, passing the `dictionary_id`, `version_id`, and the `xi-api-key` for authentication.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.pronunciationDictionaries.download("dictionary_id", "version_id");
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.pronunciation_dictionaries.download(
    dictionary_id="dictionary_id",
    version_id="version_id"
)
```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/pronunciation-dictionaries/dictionary_id/version_id/download"

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

url = URI("https://api.elevenlabs.io/v1/pronunciation-dictionaries/dictionary_id/version_id/download")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/pronunciation-dictionaries/dictionary_id/version_id/download")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/pronunciation-dictionaries/dictionary_id/version_id/download', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/pronunciation-dictionaries/dictionary_id/version_id/download");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/pronunciation-dictionaries/dictionary_id/version_id/download")! as URL,
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

### Get Conversation Audio using RestSharp - C#

Source: https://elevenlabs.io/docs/api-reference/conversations/get-audio

C# example using RestSharp client library to make a GET request for conversation audio. Instantiates RestClient with endpoint URL, creates GET request, and adds xi-api-key header.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/conversations/conversation_id/audio");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

--------------------------------

### Create Studio Project - Ruby HTTP Client

Source: https://elevenlabs.io/docs/api-reference/studio/add-project

Sets up a Ruby HTTP POST request to create a studio project using Net::HTTP with SSL/TLS support. Requires xi-api-key authentication header and multipart form data content type configuration.

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/studio/projects")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["xi-api-key"] = 'xi-api-key'
request["Content-Type"] = 'multipart/form-data; boundary=---011000010111000001101001'
```

--------------------------------

### Example JSON Response for Get Resource API

Source: https://elevenlabs.io/docs/api-reference/workspace/resources/get_explorer=true

This JSON object illustrates the structure and content of a successful response from the Get Resource API endpoint. It includes details such as `resource_id`, `resource_type`, `creator_user_id`, access levels, and sharing options.

```json
{
  "resource_id": "4ZUqyldxf71HqUbcP2Lc",
  "resource_type": "voice",
  "creator_user_id": "5zavrE1kZXv2lFw9BKgEkf0B5Wqo",
  "anonymous_access_level_override": "viewer",
  "role_to_group_ids": {
    "admin": [
      "5zavrE1kZXv2lFw9BKgEkf0B5Wqo"
    ],
    "editor": [
      "8ruQDGM2R4w1mFbHI5aROCUjIpJZ"
    ],
    "viewer": []
  },
  "share_options": [
    {
      "name": "user@example.com",
      "id": "i2YYI6huwBmcgYydAXARmQJc3pmX",
      "type": "user"
    },
    {
      "name": "mygroup",
      "id": "x1AfvYKAmiqxCnbvZeNXHqqthJaC",
      "type": "group"
    }
  ]
}
```

--------------------------------

### Initialize and Start ElevenLabs Conversation Session (Swift)

Source: https://elevenlabs.io/docs/agents-platform/customization/personalization/overrides

This snippet illustrates how to configure and initiate a conversation session using the ElevenLabs SDK in Swift. It shows how to apply optional overrides for agent, TTS, and conversation settings, and then start the session with a configuration object and callbacks.

```swift
          agent: agentConfig, // Optional: override agent settings.
          tts: ttsConfig, // Optional: override TTS settings.
          conversation: conversationConfig // Optional: override conversation settings.
      )

      let config = ElevenLabsSDK.SessionConfig(
          agentId: "",
          overrides: overrides
      )

      let conversation = try await ElevenLabsSDK.Conversation.startSession(
        config: config,
        callbacks: callbacks
      )
```

--------------------------------

### Get RAG Index Overview using Java Unirest

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/rag-index-overview

Java example using Unirest HTTP client library to make a GET request. Includes the xi-api-key header and returns the response as a string.

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/knowledge-base/rag-index")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

--------------------------------

### Get Document Content - C# RestSharp Client

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-content

C# example using RestSharp library to execute a GET request with xi-api-key header authentication to retrieve document content.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/content");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

--------------------------------

### Get RAG Index Overview using Ruby Net::HTTP

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/rag-index-overview

Ruby example using Net::HTTP to make a GET request with SSL enabled. Sets the xi-api-key header and outputs the response body.

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

### Get Conversation Audio using HTTP Client - Go

Source: https://elevenlabs.io/docs/api-reference/conversations/get-audio

Go example using the net/http package to make a GET request to retrieve conversation audio. Constructs the request with xi-api-key header and reads the response body.

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

### Start Next.js Development Server (Bash)

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/upstash-redis

This command initiates the Next.js development server, making the application accessible locally. It is a prerequisite for local development and testing, allowing developers to view changes in real-time. This command typically runs on port 3000 by default.

```bash
pnpm dev
```

--------------------------------

### Get RAG Index Overview using C# RestSharp

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/rag-index-overview

C# example using RestSharp client library to make a GET request. Creates a RestClient instance, adds the xi-api-key header, and executes the request.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/knowledge-base/rag-index");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

--------------------------------

### Get RAG Index Overview using Swift URLSession

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/rag-index-overview

Swift example using Foundation's URLSession to make a GET request. Configures headers, creates an NSMutableURLRequest, and handles the response with error checking.

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

### Studio Project Content JSON Structure Example

Source: https://elevenlabs.io/docs/api-reference/studio/add-project

Example JSON structure for initializing a Studio project with content. Demonstrates the hierarchical organization of chapters and blocks with text-to-speech nodes, each containing voice IDs and text content for audio generation.

```json
[
  {
    "name": "Chapter A",
    "blocks": [
      {
        "sub_type": "p",
        "nodes": [
          {
            "voice_id": "6lCwbsX1yVjD49QmpkT0",
            "text": "A",
            "type": "tts_node"
          },
          {
            "voice_id": "6lCwbsX1yVjD49QmpkT1",
            "text": "B",
            "type": "tts_node"
          }
        ]
      },
      {
        "sub_type": "h1",
        "nodes": [
          {
            "voice_id": "6lCwbsX1yVjD49QmpkT0",
            "text": "C",
            "type": "tts_node"
          },
          {
            "voice_id": "6lCwbsX1yVjD49QmpkT1",
            "text": "D",
            "type": "tts_node"
          }
        ]
      }
    ]
  },
  {
    "name": "Chapter B",
    "blocks": [
      {
        "sub_type": "p",
        "nodes": [
          {
            "voice_id": "6lCwbsX1yVjD49QmpkT0",
            "text": "E",
            "type": "tts_node"
          },
          {
            "voice_id": "6lCwbsX1yVjD49QmpkT1",
            "text": "F",
            "type": "tts_node"
          }
        ]
      },
      {
        "sub_type": "h2",
        "nodes": [
          {
            "voice_id": "6lCwbsX1yVjD49QmpkT0",
            "text": "G",
            "type": "tts_node"
          },
          {
            "voice_id": "6lCwbsX1yVjD49QmpkT1",
            "text": "H",
            "type": "tts_node"
          }
        ]
      }
    ]
  }
]
```

--------------------------------

### Retrieve Agent Widget Configuration (ElevenLabs API)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/widget/get

These code examples illustrate how to fetch the widget configuration for a given conversational AI agent from the ElevenLabs API. The examples cover various programming languages, showing how to make a GET request to the `/v1/convai/agents/{agent_id}/widget` endpoint. Authentication typically requires an `xi-api-key` header, and the response contains the `GetAgentEmbedResponseModel`.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.agents.widget.get("agent_id", {});
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.agents.widget.get(
    agent_id="agent_id"
)
```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/agents/agent_id/widget"

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

url = URI("https://api.elevenlabs.io/v1/convai/agents/agent_id/widget")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/agents/agent_id/widget")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

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

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/agents/agent_id/widget");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/agents/agent_id/widget")! as URL,
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

### Install ElevenLabs SDK and Dotenv Library (Python, TypeScript)

Source: https://elevenlabs.io/docs/agents-platform/quickstart

These commands show how to install the necessary libraries for interacting with the ElevenLabs API and managing environment variables. For Python, `pip` is used to install `elevenlabs` and `python-dotenv`. For TypeScript, `npm` installs `@elevenlabs/elevenlabs-js` and `dotenv`.

```python
pip install elevenlabs
pip install python-dotenv
```

```typescript
npm install @elevenlabs/elevenlabs-js
npm install dotenv
```

--------------------------------

### Compose and save music track using Eleven Music API

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/music/quickstart

This code demonstrates how to use the ElevenLabs SDK to compose a music track based on a detailed text prompt. It initializes the client with an API key and saves the generated audio stream to an MP3 file.

```python
# example.py
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play
import os
from dotenv import load_dotenv
load_dotenv()

elevenlabs = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
)

track = elevenlabs.music.compose(
    prompt="Create an intense, fast-paced electronic track for a high-adrenaline video game scene. Use driving synth arpeggios, punchy drums, distorted bass, glitch effects, and aggressive rhythmic textures. The tempo should be fast, 130–150 bpm, with rising tension, quick transitions, and dynamic energy bursts.",
    music_length_ms=10000,
)

# Save the track to a file
with open("path/to/music.mp3", "wb") as f:
    for chunk in track:
        f.write(chunk)
```

```typescript
// example.mts
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { Readable } from "stream";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import "dotenv/config";

const elevenlabs = new ElevenLabsClient();

const track = await elevenlabs.music.compose({
  prompt: "Create an intense, fast-paced electronic track for a high-adrenaline video game scene. Use driving synth arpeggios, punchy drums, distorted bass, glitch effects, and aggressive rhythmic textures. The tempo should be fast, 130–150 bpm, with rising tension, quick transitions, and dynamic energy bursts.",
  musicLengthMs: 10000,
});

// Save the track to a file
await pipeline(Readable.from(track), createWriteStream("path/to/music.mp3"));
```

--------------------------------

### Get Conversation Audio using Unirest - Java

Source: https://elevenlabs.io/docs/api-reference/conversations/get-audio

Java example using Unirest HTTP client library to make a GET request for conversation audio. Adds xi-api-key header and returns response as string.

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/conversations/conversation_id/audio")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

--------------------------------

### Initialize a new Node.js project

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/text-to-speech/twilio

This command sequence creates a new directory for the project, navigates into it, and initializes a new Node.js project with default settings using `npm init -y`.

```bash
mkdir elevenlabs-twilio
cd elevenlabs-twilio
npm init -y
```

--------------------------------

### Get Document Content - Java Unirest Client

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-content

Java example using Unirest HTTP client library to make a GET request with xi-api-key header authentication. Returns response as string.

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/content")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

--------------------------------

### Configure ElevenLabs Conversational AI Agent with System Tools

Source: https://elevenlabs.io/docs/agents-platform/customization/tools/system-tools

Demonstrates how to initialize the ElevenLabs client and configure a conversational AI agent to use system tools like `end_call` and `language_detection`. This involves creating `PromptAgentInputToolsItem_System` instances and passing them to the agent's `prompt` configuration within `ConversationalConfig`.

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

### Ruby HTTP Example

Source: https://elevenlabs.io/docs/api-reference/studio/add-chapter

Create a chapter using Ruby's Net::HTTP library. This example shows how to construct and execute a POST request with proper authentication and content headers.

```APIDOC
## Ruby HTTP Implementation

### Usage
```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/studio/projects/project_id/chapters")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["xi-api-key"] = 'xi-api-key'
request["Content-Type"] = 'application/json'
request.body = "{\n  \"name\": \"Chapter 1\"\n}"

response = http.request(request)
puts response.read_body
```

### Headers
- **xi-api-key** - Your ElevenLabs API key
- **Content-Type** - application/json
```

--------------------------------

### Retrieve WebRTC Session Token for ElevenLabs Conversations

Source: https://elevenlabs.io/docs/api-reference/conversations/get-webrtc-token

These code examples demonstrate how to programmatically obtain a WebRTC session token from the ElevenLabs API. The token is crucial for initiating real-time conversational AI interactions. Each example shows how to make a GET request to the `/v1/convai/conversation/token` endpoint, typically requiring an `agent_id` and an `xi-api-key` for authentication.

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

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.conversations.get_webrtc_token(
    agent_id="agent_id"
)
```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=agent_id"

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

url = URI("https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=agent_id")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=agent_id")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

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

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=agent_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=agent_id")! as URL,
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

### List Conversational AI Conversations (Multi-language)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/list

These examples demonstrate how to retrieve a list of conversational AI conversations from the ElevenLabs platform. Implementations vary between using the official SDKs (TypeScript, Python) and making direct HTTP GET requests with common libraries (Go, Ruby, Java, PHP, C#, Swift). Most direct HTTP examples require an `xi-api-key` header for authentication.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.conversations.list({});
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.conversations.list()
```

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

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/conversations")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/conversations', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/conversations");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

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

### Get RAG Index Overview using Go HTTP Client

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/rag-index-overview

Go example using the net/http package to make a GET request to the RAG index endpoint. Includes setting the xi-api-key header and reading the response body.

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

### SDK Examples - Update Agent

Source: https://elevenlabs.io/docs/api-reference/agents/update

Code examples demonstrating how to update a conversational AI agent using various SDK implementations and HTTP clients across different programming languages.

```APIDOC
## SDK Code Examples

### TypeScript
```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.agents.update("agent_id", {});
}
main();
```

### Python
```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.agents.update(
    agent_id="agent_id"
)
```

### Go
```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {
	url := "https://api.elevenlabs.io/v1/convai/agents/agent_id"
	payload := strings.NewReader("{}")
	req, _ := http.NewRequest("PATCH", url, payload)
	req.Header.Add("xi-api-key", "xi-api-key")
	req.Header.Add("Content-Type", "application/json")
	res, _ := http.DefaultClient.Do(req)
	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)
	fmt.Println(res)
	fmt.Println(string(body))
}
```

### Ruby
```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/agents/agent_id")
http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true
request = Net::HTTP::Patch.new(url)
request["xi-api-key"] = 'xi-api-key'
request["Content-Type"] = 'application/json'
request.body = "{}"
response = http.request(request)
puts response.read_body
```

### Java
```java
HttpResponse<String> response = Unirest.patch("https://api.elevenlabs.io/v1/convai/agents/agent_id")
  .header("xi-api-key", "xi-api-key")
  .header("Content-Type", "application/json")
  .body("{}")
  .asString();
```

### PHP
```php
<?php
$client = new \GuzzleHttp\Client();
$response = $client->request('PATCH', 'https://api.elevenlabs.io/v1/convai/agents/agent_id', [
  'body' => '{}',
  'headers' => [
    'Content-Type' => 'application/json',
    'xi-api-key' => 'xi-api-key',
  ],
]);
echo $response->getBody();
```

### C#
```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/agents/agent_id");
var request = new RestRequest(Method.PATCH);
request.AddHeader("xi-api-key", "xi-api-key");
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

### Swift
```swift
import Foundation

let headers = [
  "xi-api-key": "xi-api-key",
  "Content-Type": "application/json"
]
let parameters = [] as [String : Any]
let postData = JSONSerialization.data(withJSONObject: parameters, options: [])
let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/agents/agent_id")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "PATCH"
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
```

--------------------------------

### Install ElevenLabs Node.js Library

Source: https://elevenlabs.io/docs/api-reference/introduction

Install the official Node.js library for the ElevenLabs API using npm package manager. Run this command in your Node.js project directory to add the library as a dependency.

```bash
npm install @elevenlabs/elevenlabs-js
```

--------------------------------

### Get WhatsApp Account using ElevenLabs API in Multiple Languages

Source: https://elevenlabs.io/docs/agents-platform/api-reference/whats-app/accounts/get

These code examples demonstrate how to retrieve a specific WhatsApp account from the ElevenLabs API using its `phone_number_id`. The examples cover various programming languages, showcasing both official SDKs (TypeScript, Python) and direct HTTP client implementations (Go, Ruby, Java, PHP, C#, Swift). All examples require an `xi-api-key` for authentication, typically passed in the request header.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.whatsappAccounts.get("phone_number_id");
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.whatsapp_accounts.get(
    phone_number_id="phone_number_id"
)
```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/whatsapp-accounts/phone_number_id"

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

url = URI("https://api.elevenlabs.io/v1/convai/whatsapp-accounts/phone_number_id")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/whatsapp-accounts/phone_number_id")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/whatsapp-accounts/phone_number_id', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/whatsapp-accounts/phone_number_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/whatsapp-accounts/phone_number_id")! as URL,
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

### Get Conversation Audio using HTTP Client - Ruby

Source: https://elevenlabs.io/docs/api-reference/conversations/get-audio

Ruby example using Net::HTTP to make a GET request for conversation audio. Creates URI, establishes HTTPS connection, and adds xi-api-key header to the request.

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

### Initiate and Monitor PVC Training Process (Python, TypeScript)

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/voices/professional-voice-cloning

This snippet shows how to initiate the training process for a private voice clone (PVC) and then continuously poll its fine-tuning status. It specifies the model to be used for training and provides an example of checking the progress until the training is complete or fails. The training duration depends on the length and number of provided samples.

```python
elevenlabs.voices.pvc.train(
    voice_id=voice.voice_id,
    # Specify the model the PVC should be trained on
    model_id="eleven_multilingual_v2"
)

# Poll the fine tuning status until it is complete or fails
# This example specifically checks for the eleven_multilingual_v2 model
while True:
    voice_details = elevenlabs.voices.get(voice_id=voice.voice_id)
    fine_tuning_state = None
    if voice_details.fine_tuning and voice_details.fine_tuning.state:
        fine_tuning_state = voice_details.fine_tuning.state.get("eleven_multilingual_v2")

    if fine_tuning_state:
        progress = None
        if voice_details.fine_tuning.progress and voice_details.fine_tuning.progress.get("eleven_multilingual_v2"):
            progress = voice_details.fine_tuning.progress.get("eleven_multilingual_v2")
        print(f"Fine tuning progress: {progress}")

        if fine_tuning_state == "fine_tuned" or fine_tuning_state == "failed":
            print("Fine tuning completed or failed")
            break
    # Wait for 5 seconds before polling again
    time.sleep(5)
```

```typescript
await elevenlabs.voices.pvc.train(voiceId, {
    // Specify the model the PVC should be trained on
    modelId: "eleven_multilingual_v2",
});

// Poll the fine tuning status until it is complete or fails
// This example specifically checks for the eleven_multilingual_v2 model
const interval = setInterval(async () => {
    const { fineTuning } = await elevenlabs.voices.get(voiceId);
    if (!fineTuning) return;

    console.log(`Fine tuning progress: ${fineTuning?.progress?.eleven_multilingual_v2}`);
```

--------------------------------

### Perform Speech-to-Text Conversion using ElevenLabs SDK

Source: https://elevenlabs.io/docs/api-reference/speech-to-text/convert

These examples demonstrate how to initialize the ElevenLabs client and perform a speech-to-text conversion. The client is configured with the ElevenLabs API environment, and a conversion request is made. Note that the Go and Ruby examples show a more detailed HTTP request construction for multipart form data, while TypeScript and Python use the SDK's higher-level abstraction.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.speechToText.convert({});
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.speech_to_text.convert()
```

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/speech-to-text"

	payload := strings.NewReader("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"model_id\"\r\n\r\nstring\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"file\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"language_code\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"tag_audio_events\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"num_speakers\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"timestamps_granularity\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"diarize\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"diarization_threshold\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"additional_formats\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"file_format\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"cloud_storage_url\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"webhook\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"webhook_id\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"temperature\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"seed\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"use_multi_channel\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"webhook_metadata\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"entity_detection\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"keyterms\"\r\n\r\n\r\n-----011000010111000001101001--\r\n")

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

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/speech-to-text")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["xi-api-key"] = 'xi-api-key'
request["Content-Type"] = 'multipart/form-data; boundary=---011000010111000001101001'
```

--------------------------------

### Generate Music from Composition Plan - ElevenLabs Music API

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/music/quickstart

Generates audio music by passing a previously created composition plan to the compose method. Either a composition_plan or prompt can be provided, but not both. Returns audio that can be played directly.

```python
# You can pass in composition_plan or prompt, but not both.
composition = elevenlabs.music.compose(
    composition_plan=composition_plan,
)

play(composition)
```

```typescript
// You can pass in compositionPlan or prompt, but not both.
const composition = await elevenlabs.music.compose({
    compositionPlan,
});

await play(composition);
```

--------------------------------

### Get Audio Native Settings - Go HTTP Client

Source: https://elevenlabs.io/docs/api-reference/audio-native/get-settings

Retrieves Audio Native project settings using Go's standard net/http package. Constructs a GET request to the settings endpoint, adds the xi-api-key header for authentication, and reads the response body. No external dependencies required.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/audio-native/project_id/settings"

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

### Dub Audio File Using ElevenLabs API - Python

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/dubbing

Create a Python script that loads an audio file, submits it to the ElevenLabs Dubbing API for Spanish translation, polls for completion status, and plays the dubbed audio. Requires API key from environment variable and handles asynchronous dubbing process with status polling.

```python
# example.py
import os
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play
import requests
from io import BytesIO
import time

load_dotenv()

elevenlabs = ElevenLabs(
  api_key=os.getenv("ELEVENLABS_API_KEY"),
)

target_lang = "es"  # Spanish

audio_url = (
    "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3"
)
response = requests.get(audio_url)

audio_data = BytesIO(response.content)
audio_data.name = "audio.mp3"

# Start dubbing
dubbed = elevenlabs.dubbing.create(
    file=audio_data, target_lang=target_lang
)

while True:
    status = elevenlabs.dubbing.get(dubbed.dubbing_id).status
    if status == "dubbed":
        dubbed_file = elevenlabs.dubbing.audio.get(dubbed.dubbing_id, target_lang)
        play(dubbed_file)
        break
    else:
        print("Audio is still being dubbed...")
        time.sleep(5)
```

--------------------------------

### Swift HTTP Example

Source: https://elevenlabs.io/docs/api-reference/studio/add-chapter

Create a chapter using Swift's URLSession. This example shows how to construct a POST request with proper headers and JSON serialization.

```APIDOC
## Swift HTTP Implementation

### Usage
```swift
import Foundation

let headers = [
  "xi-api-key": "xi-api-key",
  "Content-Type": "application/json"
]
let parameters = ["name": "Chapter 1"] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/studio/projects/project_id/chapters")! as URL,
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

### Headers
- **xi-api-key** - Your ElevenLabs API key
- **Content-Type** - application/json
```

--------------------------------

### Java HTTP Example

Source: https://elevenlabs.io/docs/api-reference/studio/add-chapter

Create a chapter using Unirest HTTP client for Java. This example demonstrates making a POST request with proper headers and JSON body.

```APIDOC
## Java HTTP Implementation

### Usage
```java
HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/studio/projects/project_id/chapters")
  .header("xi-api-key", "xi-api-key")
  .header("Content-Type", "application/json")
  .body("{\n  \"name\": \"Chapter 1\"\n}")
  .asString();
```

### Dependencies
- Unirest HTTP client library

### Headers
- **xi-api-key** - Your ElevenLabs API key
- **Content-Type** - application/json
```

--------------------------------

### Get Conversation Audio using URLSession - Swift

Source: https://elevenlabs.io/docs/api-reference/conversations/get-audio

Swift example using URLSession to make a GET request for conversation audio. Creates NSMutableURLRequest with headers, configures HTTP method, and executes data task with completion handler.

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/conversations/conversation_id/audio")! as URL,
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

### Install ElevenLabs CLI

Source: https://elevenlabs.io/docs/agents-platform/quickstart

Install the ElevenLabs command-line interface globally using npm. This tool enables agent creation, configuration, and deployment from the terminal.

```bash
npm install -g @elevenlabs/cli
```

--------------------------------

### Get Conversation Audio using Guzzle - PHP

Source: https://elevenlabs.io/docs/api-reference/conversations/get-audio

PHP example using Guzzle HTTP client to make a GET request for conversation audio. Creates client instance and sends request with xi-api-key header in options array.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/conversations/conversation_id/audio', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

--------------------------------

### POST /agents

Source: https://elevenlabs.io/docs/api-reference/knowledge-base/create-from-url_explorer=true

No description

--------------------------------

### Get Source File URL - Swift URLSession

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-source-file-url

Swift example using URLSession to make a GET request with xi-api-key authentication header. Includes error handling and HTTP response inspection with completion handler.

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/source-file-url")! as URL,
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

### POST /v1/music/composition-plan/create

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/music

Generate a detailed composition plan from a text prompt. A composition plan is a JSON object that describes the music structure in detail, including sections, styles, and timing. This plan can then be used to generate music with more granular control.

```APIDOC
## POST /v1/music/composition-plan/create

### Description
Generate a composition plan from a text prompt. This endpoint creates a structured JSON plan that describes the music composition in detail, including sections, positive/negative styles, and timing. The plan can be used to generate music with more control over the output.

### Method
POST

### Endpoint
/v1/music/composition-plan/create

### Parameters
#### Request Body
- **prompt** (string) - Required - Detailed description of the music to plan. Include style, tempo, instruments, mood, and any specific effects desired
- **music_length_ms** (integer) - Required - Total duration of the composition in milliseconds

### Request Example
```python
from elevenlabs.client import ElevenLabs
import os
from dotenv import load_dotenv

load_dotenv()

elevenlabs = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
)

composition_plan = elevenlabs.music.composition_plan.create(
    prompt="Create an intense, fast-paced electronic track for a high-adrenaline video game scene. Use driving synth arpeggios, punchy drums, distorted bass, glitch effects, and aggressive rhythmic textures. The tempo should be fast, 130–150 bpm, with rising tension, quick transitions, and dynamic energy bursts.",
    music_length_ms=10000,
)

print(composition_plan)
```

### Response
#### Success Response (200)
- **positiveGlobalStyles** (array of strings) - Global musical styles to emphasize throughout the composition
- **negativeGlobalStyles** (array of strings) - Global musical styles to avoid throughout the composition
- **sections** (array of objects) - Array of composition sections, each containing:
  - **sectionName** (string) - Name of the section (e.g., "Intro", "Peak Drop")
  - **positiveLocalStyles** (array of strings) - Styles to emphasize in this section
  - **negativeLocalStyles** (array of strings) - Styles to avoid in this section
  - **durationMs** (integer) - Duration of this section in milliseconds
  - **lines** (array) - Musical lines or elements for this section

### Response Example
```json
{
  "positiveGlobalStyles": [
    "electronic",
    "fast-paced",
    "driving synth arpeggios",
    "punchy drums",
    "distorted bass",
    "glitch effects",
    "aggressive rhythmic textures",
    "high adrenaline"
  ],
  "negativeGlobalStyles": [
    "acoustic",
    "slow",
    "minimalist",
    "ambient",
    "lo-fi"
  ],
  "sections": [
    {
      "sectionName": "Intro",
      "positiveLocalStyles": [
        "rising synth arpeggio",
        "glitch fx",
        "filtered noise sweep",
        "soft punchy kick building tension"
      ],
      "negativeLocalStyles": [
        "soft pads",
        "melodic vocals",
        "ambient textures"
      ],
      "durationMs": 3000,
      "lines": []
    },
    {
      "sectionName": "Peak Drop",
      "positiveLocalStyles": [
        "full punchy drums",
        "distorted bass stab",
        "aggressive rhythmic hits",
        "rapid arpeggio sequences"
      ],
      "negativeLocalStyles": [
        "smooth transitions",
        "clean bass",
        "slow buildup"
      ],
      "durationMs": 4000,
      "lines": []
    },
    {
      "sectionName": "Final Burst",
      "positiveLocalStyles": [
        "glitch stutter",
        "energy burst vox chopped sample",
        "quick transitions",
        "snare rolls"
      ],
      "negativeLocalStyles": [
        "long reverb tails",
        "fadeout",
        "gentle melodies"
      ],
      "durationMs": 3000,
      "lines": []
    }
  ]
}
```

### Notes
- Composition plans provide granular control over music generation
- Using a plan is optional but recommended for complex music
- Plans can be modified before being used to generate the final audio
```

--------------------------------

### Get Source File URL - Java HTTP Client

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-source-file-url

Java example using the Unirest HTTP client library to make a GET request with xi-api-key authentication header. Returns the response as a string.

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/source-file-url")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

--------------------------------

### Get Tool API Response Schema

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/get_explorer=true

Example JSON response from the GET tool endpoint containing tool configuration, access information, and usage statistics. Includes tool ID, type, name, creator details, and performance metrics.

```json
{
  "id": "tool_9f8b7c6d5e4a3b2c1d0e",
  "tool_config": {
    "type": "system",
    "name": "end_call",
    "description": "",
    "params": {
      "system_tool_type": "end_call"
    }
  },
  "access_info": {
    "is_creator": true,
    "creator_name": "John Doe",
    "creator_email": "john.doe@example.com",
    "role": "admin"
  },
  "usage_stats": {
    "avg_latency_secs": 1.1,
    "total_calls": 42
  }
}
```

--------------------------------

### Get Document Content - PHP Guzzle Client

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-content

PHP example using Guzzle HTTP client to send a GET request to the knowledge base endpoint. Includes xi-api-key header and outputs response body.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/content', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

--------------------------------

### POST /v1/studio/projects

Source: https://elevenlabs.io/docs/changelog

Create a new studio project with per-project voice configuration. Supports custom voice settings for granular control over voice parameters.

```APIDOC
## POST /v1/studio/projects

### Description
Create a new studio project with optional per-project voice configuration for granular voice control.

### Method
POST

### Endpoint
/v1/studio/projects

### Parameters
#### Request Body
- **name** (string) - Required - Project name
- **description** (string) - Optional - Project description
- **voice_settings** (array) - Optional - Array of voice configuration objects
  - **voice_id** (string) - Voice identifier
  - **stability** (number) - Voice stability (0-1)
  - **similarity** (number) - Voice similarity (0-1)
  - **style** (number) - Voice style (0-1)

### Request Example
{
  "name": "Marketing Campaign",
  "description": "Q1 marketing campaign audio",
  "voice_settings": [
    {
      "voice_id": "v1",
      "stability": 0.8,
      "similarity": 0.9,
      "style": 0.7
    }
  ]
}

### Response
#### Success Response (200)
- **project_id** (string) - Unique project identifier
- **name** (string) - Project name
- **voice_settings** (array) - Configured voice settings
- **created_at** (string) - Creation timestamp

#### Response Example
{
  "project_id": "proj_abc123",
  "name": "Marketing Campaign",
  "voice_settings": [
    {"voice_id": "v1", "stability": 0.8, "similarity": 0.9, "style": 0.7}
  ],
  "created_at": "2024-01-15T10:30:00Z"
}
```

--------------------------------

### Get Document Content - Ruby HTTP Client

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-content

Ruby example using Net::HTTP to send a GET request to retrieve document content. Sets up HTTPS connection and includes xi-api-key authentication header.

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

### Find Similar Voices via Direct HTTP POST Request

Source: https://elevenlabs.io/docs/api-reference/voices/find-similar-voices

These examples illustrate how to directly make an HTTP POST request to the Eleven Labs `/v1/similar-voices` endpoint. They demonstrate setting the `xi-api-key` header and constructing a `multipart/form-data` body, which typically includes an `audio_file`, `similarity_threshold`, and `top_k` parameters. Each example uses standard HTTP client libraries for its respective language.

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/similar-voices"

	payload := strings.NewReader("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"audio_file\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"similarity_threshold\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"top_k\"\r\n\r\n\r\n-----011000010111000001101001--\r\n")

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

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/similar-voices")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["xi-api-key"] = 'xi-api-key'
request["Content-Type"] = 'multipart/form-data; boundary=---011000010111000001101001'
request.body = "-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"audio_file\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"similarity_threshold\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"top_k\"\r\n\r\n\r\n-----011000010111000001101001--\r\n"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/similar-voices")
  .header("xi-api-key", "xi-api-key")
  .header("Content-Type", "multipart/form-data; boundary=---011000010111000001101001")
  .body("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"audio_file\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"similarity_threshold\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"top_k\"\r\n\r\n\r\n-----011000010111000001101001--\r\n")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/similar-voices', [
  'multipart' => [
    [
        'name' => 'audio_file',
        'filename' => '<file1>',
        'contents' => null
    ]
  ],
  'headers' => [
    'xi-api-key' => 'xi-api-key'
  ]
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/similar-voices");
var request = new RestRequest(Method.POST);
request.AddHeader("xi-api-key", "xi-api-key");
request.AddParameter("multipart/form-data; boundary=---011000010111000001101001", "-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"audio_file\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"similarity_threshold\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"top_k\"\r\n\r\n\r\n-----011000010111000001101001--\r\n", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = [
  "xi-api-key": "xi-api-key",
  "Content-Type": "multipart/form-data; boundary=---011000010111000001101001"
]
let parameters = [
  [
    "name": "audio_file",
    "fileName": "<file1>"
  ],
  [
    "name": "similarity_threshold",
    "value": ""
  ],
  [
    "name": "top_k",
    "value": ""
  ]
]

let boundary = "---011000010111000001101001"

var body = ""
var error: NSError? = nil
for param in parameters {
  let paramName = param["name"]!
  body += "--\(boundary)\r\n"
  body += "Content-Disposition:form-data; name=\"\(paramName)\""
  if let filename = param["fileName"] {
    // Note: 'content-type' is missing in the original Swift example's 'parameters' array for file uploads.
    // A placeholder 'contentType' is used here, but it would need to be properly defined.
    let contentType = param["content-type"] ?? "application/octet-stream"
    // The original example attempts to read from a file path, which is not fully provided.
    // For a complete example, 'fileContent' would be the actual data of the audio file.
    let fileContent = "" // Placeholder for actual file content
    if (error != nil) {
      print(error as Any)
    }
    body += "; filename=\"\(filename)\"\r\n"
    body += "Content-Type: \(contentType)\r\n\r\n"
    body += fileContent
  } else if let paramValue = param["value"] {
    body += "\r\n\r\n\(paramValue)"
  }
}
// The original Swift example is incomplete and does not show how to create and send the URLRequest.
// This snippet only covers the body construction based on the provided partial code.
```

--------------------------------

### PHP HTTP Example

Source: https://elevenlabs.io/docs/api-reference/studio/add-chapter

Create a chapter using PHP's Guzzle HTTP client. This example shows how to make a POST request with proper authentication and JSON content.

```APIDOC
## PHP HTTP Implementation

### Usage
```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/studio/projects/project_id/chapters', [
  'body' => '{
  "name": "Chapter 1"
}',
  'headers' => [
    'Content-Type' => 'application/json',
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

### Dependencies
- Guzzle HTTP client

### Headers
- **xi-api-key** - Your ElevenLabs API key
- **Content-Type** - application/json
```

--------------------------------

### List Dubbing Projects using ElevenLabs API

Source: https://elevenlabs.io/docs/api-reference/dubbing/list

These code examples demonstrate how to fetch a list of dubbing projects from the ElevenLabs API. They typically involve making a GET request to the `/v1/dubbing` endpoint and often require an API key for authentication. The output is a response body containing the dubbing project data.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.dubbing.list({});
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.dubbing.list()
```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/dubbing"

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

url = URI("https://api.elevenlabs.io/v1/dubbing")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/dubbing")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/dubbing', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/dubbing");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/dubbing")! as URL,
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

### Generate Composition Plan from Prompt - Python

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/music

Create a detailed composition plan from a text prompt using the Eleven Music API. The composition plan is a structured JSON object that breaks down the music generation into sections with specific styles, allowing for more granular control over the final output.

```python
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play
import os
from dotenv import load_dotenv
load_dotenv()

elevenlabs = ElevenLabs(
api_key=os.getenv("ELEVENLABS_API_KEY"),
)

composition_plan = elevenlabs.music.composition_plan.create(
    prompt="Create an intense, fast-paced electronic track for a high-adrenaline video game scene. Use driving synth arpeggios, punchy drums, distorted bass, glitch effects, and aggressive rhythmic textures. The tempo should be fast, 130–150 bpm, with rising tension, quick transitions, and dynamic energy bursts.",
    music_length_ms=10000,
)

print(composition_plan)
```

--------------------------------

### Generate Music with Detailed Metadata - ElevenLabs Music API

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/music/quickstart

Generates music and retrieves detailed information including the composition plan and song metadata. Returns track details with JSON metadata containing composition plan and lyrics (if applicable), filename, and audio bytes. Useful for accessing full composition information alongside the generated audio.

```python
track_details = elevenlabs.music.compose_detailed(
    prompt="Create an intense, fast-paced electronic track for a high-adrenaline video game scene. Use driving synth arpeggios, punchy drums, distorted bass, glitch effects, and aggressive rhythmic textures. The tempo should be fast, 130–150 bpm, with rising tension, quick transitions, and dynamic energy bursts.",
    music_length_ms=10000,
)

print(track_details.json) # json contains composition_plan and song_metadata. The composition plan will include lyrics (if applicable)
print(track_details.filename)
# track_details.audio contains the audio bytes
```

```typescript
const trackDetails = await elevenlabs.music.composeDetailed({
  prompt: 'Create an intense, fast-paced electronic track for a high-adrenaline video game scene. Use driving synth arpeggios, punchy drums, distorted bass, glitch effects, and aggressive rhythmic textures. The tempo should be fast, 30–150 bpm, with rising tension, quick transitions, and dynamic energy bursts.',
  musicLengthMs: 10000,
});

console.log(JSON.stringify(trackDetails.json, null, 2)); // json contains composition_plan and song_metadata. The composition plan will include lyrics (if applicable)
console.log(trackDetails.filename);
// trackDetails.audio contains the audio bytes
```

--------------------------------

### Get Agents from Knowledge Base - PHP HTTP Request

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-agents

Fetches agents using Guzzle HTTP client for PHP. Creates a GET request with XI-API-Key header and outputs the response body. Requires Guzzle library to be installed.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/dependent-agents', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

--------------------------------

### Create Knowledge Base Document from URL - Go

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-url

Make a POST request to the ElevenLabs knowledge base endpoint using Go's net/http package. Requires setting the xi-api-key header and providing the URL in JSON payload format.

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/knowledge-base/url"

	payload := strings.NewReader("{\n  \"url\": \"https://www.elevenlabs.io/docs/knowledge-base-integration\"\n}")

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

### Swift HTTP Example

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/test-invocations/get

Example of retrieving a test suite invocation using Swift's URLSession.

```APIDOC
## Swift HTTP Example

### Usage
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
```

--------------------------------

### Access ElevenLabs Conversational AI Batch Calling Workspace

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/list

These examples illustrate how to access or list resources related to the ElevenLabs Conversational AI Batch Calling workspace. The TypeScript and Python examples utilize the official SDKs to call a 'list' method, while other languages demonstrate direct HTTP GET requests to the `/v1/convai/batch-calling/workspace` endpoint. All direct HTTP requests require an 'xi-api-key' header for authentication.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.batchCalls.list({});
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.batch_calls.list()
```

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

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/batch-calling/workspace")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/batch-calling/workspace', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/batch-calling/workspace");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

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

### Create Dubbing Task using ElevenLabs API

Source: https://elevenlabs.io/docs/api-reference/dubbing/create

These examples illustrate how to initiate a dubbing task through the ElevenLabs API. The SDK examples (TypeScript, Python) show client initialization and a direct method call, while the raw HTTP examples (Go, Ruby) demonstrate constructing and sending a multipart/form-data request to the `/v1/dubbing` endpoint. Note that the provided Ruby snippet is incomplete and only sets up the request without sending it or handling the response.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.dubbing.create({});
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.dubbing.create()
```

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/dubbing"

	payload := strings.NewReader("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"file\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"csv_file\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"foreground_audio_file\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"background_audio_file\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"source_url\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"source_lang\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"target_lang\"\r\n\r\nstring\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"target_accent\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"num_speakers\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"watermark\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"start_time\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"end_time\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"highest_resolution\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"drop_background_audio\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"use_profanity_filter\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"dubbing_studio\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"disable_voice_cloning\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"mode\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"csv_fps\"\r\n\r\n\r\n-----011000010111000001101001--\r\n")
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

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/dubbing")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["xi-api-key"] = 'xi-api-key'
request["Content-Type"] = 'multipart/form-data; boundary=---011000010111000001101001'
```

--------------------------------

### Python SDK Example

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/test-invocations/get

Example of retrieving a test suite invocation using the ElevenLabs Python SDK.

```APIDOC
## Python SDK Example

### Usage
```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.tests.invocations.get(
    test_invocation_id="test_invocation_id"
)
```
```

--------------------------------

### Get Document Content - Swift URLSession

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-content

Swift example using URLSession to make a GET request with xi-api-key header. Creates mutable URL request with protocol cache policy and executes data task with completion handler.

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/content")! as URL,
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

### Start and Manage Conversation in Swift

Source: https://elevenlabs.io/docs/agents-platform/libraries/swift

Initialize a conversation with an agent, observe state and message changes using reactive publishers, and send messages or control conversation flow. The example demonstrates subscribing to connection state and messages, then sending user input and managing conversation lifecycle.

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

--------------------------------

### Get Document Content - Go HTTP Client

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-content

Go example using the standard net/http package to make a GET request to the knowledge base content endpoint. Includes xi-api-key header authentication and reads the response body.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/content"

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

### Create Music Composition Plan - Go HTTP Client

Source: https://elevenlabs.io/docs/api-reference/music/create-composition-plan

Make a POST request to the ElevenLabs music plan endpoint using Go's native HTTP package. Requires setting the xi-api-key header for authentication and Content-Type header for JSON payload. Reads and prints the response body.

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/music/plan"

	payload := strings.NewReader("{\n  \"prompt\": \"string\"\n}")

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

### Get Source File URL - C# REST Client

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-source-file-url

C# example using the RestSharp library to execute a GET request to retrieve the signed source file URL. Includes xi-api-key header configuration and response handling.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/source-file-url");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

--------------------------------

### Track Generation Costs with Response Headers

Source: https://elevenlabs.io/docs/api-reference/introduction

Access generation metadata including character costs from API response headers. This example demonstrates how to retrieve raw response headers containing character count and request ID information from text-to-speech conversion requests.

```python
from elevenlabs.client import ElevenLabs

client = ElevenLabs(api_key="your_api_key")

# Get raw response with headers
response = client.text_to_speech.with_raw_response.convert(
    text="Hello, world!",
    voice_id="voice_id"
)

# Access character cost from headers
char_cost = response.headers.get("x-character-count")
request_id = response.headers.get("request-id")
audio_data = response.data
```

```typescript
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

const client = new ElevenLabsClient({ apiKey: 'your_api_key' });

// Get raw response with headers
const { data, rawResponse } = await client.textToSpeech
  .convert('voice_id', {
    text: 'Hello, world!',
    modelId: 'eleven_multilingual_v2',
  })
  .withRawResponse();

// Access character cost from headers
const charCost = rawResponse.headers.get('x-character-count');
const requestId = rawResponse.headers.get('request-id');
const audioData = data;
```

--------------------------------

### Get Source File URL - PHP HTTP Client

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-source-file-url

PHP example using the GuzzleHttp client library to send a GET request to the source file URL endpoint with proper authentication headers. Outputs the response body.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/source-file-url', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

--------------------------------

### GET /v1/convai/conversation/token

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/get-webrtc-token_explorer=true

Retrieves a WebRTC session token for establishing real-time communication with an ElevenLabs conversational AI agent. This token is required to initiate a WebRTC connection and must be obtained before starting a conversation session.

```APIDOC
## GET /v1/convai/conversation/token

### Description
Get a WebRTC session token for real-time communication with a conversational AI agent.

### Method
GET

### Endpoint
https://api.elevenlabs.io/v1/convai/conversation/token

### Parameters
#### Headers
- **xi-api-key** (string) - Required - Your ElevenLabs API key for authentication

#### Query Parameters
- **agent_id** (string) - Required - The ID of the agent you're taking the action on
- **participant_name** (string or null) - Optional - Custom participant name. If not provided, user ID will be used

### Request Example
```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.conversations.get_webrtc_token(
    agent_id="agent_id"
)
```

### Response
#### Success Response (200 - Retrieved)
- **token** (string) - JWT token for WebRTC session authentication

#### Response Example
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNjgwMDAwMDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

#### Error Response (422 - Unprocessable Entity)
Returned when the request parameters are invalid or malformed.
```

--------------------------------

### Create Voice Previews with ElevenLabs Go HTTP Client

Source: https://elevenlabs.io/docs/api-reference/legacy/voices/create-previews

Implements a POST request to the ElevenLabs create-previews endpoint using Go's native net/http package. Constructs the JSON payload with voice description, sets required headers including the API key, and handles the HTTP response.

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/text-to-voice/create-previews"

	payload := strings.NewReader("{\n  \"voice_description\": \"A sassy squeaky mouse with a playful and energetic tone, perfect for animated characters or children's stories.\"\n}")

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

### Execute sound effects generation script

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/sound-effects

Run the generated sound effects script from the command line. Use python for Python scripts or npx tsx for TypeScript files to execute and play the generated audio.

```python
python example.py
```

```typescript
npx tsx example.mts
```

--------------------------------

### Get Source File URL - Ruby HTTP Client

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-source-file-url

Ruby example using the Net::HTTP library to send a GET request to retrieve the signed source file URL. Includes HTTPS configuration and xi-api-key header authentication.

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/source-file-url")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

--------------------------------

### Initialize npm and Install Dependencies - Bash

Source: https://elevenlabs.io/docs/agents-platform/guides/quickstarts/java-script

Set up a new npm project and install required packages including Vite and the ElevenLabs client library. Initializes package.json and adds necessary dependencies for the web application.

```bash
npm init -y
npm install vite @elevenlabs/client
```

--------------------------------

### GET /v1/convai/conversation/get-signed-url

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/get-signed-url_explorer=true

Retrieves a signed URL to start a conversation with an agent that requires authorization. The signed URL contains authentication credentials and can be used to initiate a conversation session with the specified agent.

```APIDOC
## GET /v1/convai/conversation/get-signed-url

### Description
Get a signed URL to start a conversation with an agent that requires authorization. The returned signed URL contains authentication credentials and can be used to initiate a secure conversation session.

### Method
GET

### Endpoint
https://api.elevenlabs.io/v1/convai/conversation/get-signed-url

### Parameters
#### Headers
- **xi-api-key** (string) - Required - Your ElevenLabs API key for authentication

#### Query Parameters
- **agent_id** (string) - Required - The ID of the agent you're taking the action on
- **include_conversation_id** (boolean) - Optional - Defaults to `false`. Whether to include a conversation_id with the response. If included, the conversation_signature cannot be used again

### Request Example
```bash
curl -G https://api.elevenlabs.io/v1/convai/conversation/get-signed-url \
  -H "xi-api-key: xi-api-key" \
  -d agent_id=agent_id
```

### Response
#### Success Response (200)
- **signed_url** (string) - The signed URL to start a conversation with the agent. This URL contains authentication credentials and can be used to initiate a conversation session

#### Response Example
```json
{
  "signed_url": "https://convai.elevenlabs.io/conversation/start?agent_id=21m00Tcm4TlvDq8ikWAM&signature=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
}
```

#### Error Response (422)
- **Status**: 422 Unprocessable Entity Error
- **Description**: Returned when the request parameters are invalid or malformed
```

--------------------------------

### Handle Bad Composition Plan Error

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/music/quickstart

When generating a composition plan with styles that contain copyrighted material, the API returns a `bad_composition_plan` error with a suggested alternative composition plan. This error handling pattern is similar to the bad_prompt error but applies to composition plans instead of individual prompts.

```APIDOC
## POST /music/composition-plan

### Description
Generate a composition plan for music creation. If the composition plan contains copyrighted material in its styles or references, the API returns a `bad_composition_plan` error with a suggested alternative composition plan.

### Method
POST

### Endpoint
/music/composition-plan

### Parameters
#### Request Body
- **styles** (array of strings) - Required - Musical styles for the composition. Must not reference copyrighted material such as specific artists, bands, or trademarked compositions.
- **additional_params** (object) - Optional - Additional parameters for composition planning.

### Response
#### Error Response - Bad Composition Plan (400)
- **status** (string) - Error status: `bad_composition_plan`
- **composition_plan_suggestion** (object) - Suggested alternative composition plan without copyrighted material

#### Error Response Example
```json
{
  "detail": {
    "status": "bad_composition_plan",
    "data": {
      "composition_plan_suggestion": {
        "styles": ["epic rock", "dramatic ballad", "operatic elements"]
      }
    }
  }
}
```

### Notes
- If the composition plan or prompt contains harmful material, no suggested alternative will be returned.
- Always validate that your styles and descriptions do not reference specific copyrighted works or artists.
```

--------------------------------

### Retrieve Conversational AI Knowledge Base Document

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-document

These code examples demonstrate how to fetch a specific document from the ElevenLabs Conversational AI knowledge base. The TypeScript and Python examples utilize the official ElevenLabs SDKs, while other languages show direct HTTP GET requests to the API endpoint. All methods require a `documentation_id` and an `xi-api-key` for authentication, returning the document's content.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.knowledgeBase.documents.get("documentation_id", {});
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.knowledge_base.documents.get(
    documentation_id="documentation_id"
)
```

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

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

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

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

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

### Example Successful Response for Get WhatsApp Account API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/whats-app/accounts/get_explorer=true

This JSON object illustrates a typical successful response from the ElevenLabs "Get WhatsApp account" API endpoint. It includes key identifiers like `business_account_id`, `phone_number_id`, and associated names, along with contact number and agent details.

```json
{
  "business_account_id": "ba_9f8e7d6c5b4a3210",
  "phone_number_id": "pn_1234567890abcdef",
  "business_account_name": "Acme Corp WhatsApp Business",
  "phone_number_name": "Support Line",
  "phone_number": "+14155552671",
  "assigned_agent_name": "Jane Doe",
  "assigned_agent_id": "agent_42b7c9d8e1f23456"
}
```

--------------------------------

### Retrieve Character Usage Metrics in TypeScript

Source: https://elevenlabs.io/docs/api-reference/usage/get_explorer=true

This TypeScript example demonstrates how to fetch character usage statistics using the ElevenLabs JavaScript client library. It initializes the client with the API environment and then calls the `get` method on the `usage` service to retrieve the metrics.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.usage.get({});
}
main();
```

--------------------------------

### Create Knowledge Base Document via HTTP POST - Go

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-text

Make a direct HTTP POST request to the ElevenLabs knowledge base endpoint using Go's net/http package. Requires manual header configuration including API key authentication and JSON payload formatting.

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/knowledge-base/text"

	payload := strings.NewReader("{\n  \"text\": \"ElevenLabs API provides advanced text-to-speech capabilities, allowing developers to integrate realistic voice synthesis into their applications.\"\n}")

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

### API Endpoint and Example Response for PVC Voice Sample Audio Retrieval

Source: https://elevenlabs.io/docs/api-reference/voices/pvc/samples/get-audio_explorer=true

This section outlines the HTTP GET endpoint for retrieving PVC voice sample audio and provides an example of a successful JSON response. The endpoint requires `voice_id` and `sample_id` as path parameters to identify the specific sample. The response includes the audio encoded in base64, along with metadata such as voice ID, sample ID, media type, and duration.

```HTTP
GET https://api.elevenlabs.io/v1/voices/pvc/:voice_id/samples/:sample_id/audio
```

```JSON
{
  "audio_base_64": "audio_base_64",
  "voice_id": "DCwhRBWXzGAHq8TQ4Fs18",
  "sample_id": "DCwhRBWXzGAHq8TQ4Fs18",
  "media_type": "audio/mpeg",
  "duration_secs": 5
}
```

--------------------------------

### Get WebRTC Conversation Token with ElevenLabs Python SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/get-webrtc-token_explorer=true

This Python example demonstrates how to retrieve a WebRTC conversation token from the ElevenLabs API. It initializes the `ElevenLabs` client with the base URL and then calls the `get_webrtc_token` method, requiring an `agent_id`. The API returns a JSON object containing the `token` for real-time communication, as shown in the example response: `{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNjgwMDAwMDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"}`.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.conversations.get_webrtc_token(
    agent_id="agent_id"
)
```

--------------------------------

### Get Source File URL - Python SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-source-file-url

Python SDK example using the ElevenLabs client library to fetch a signed URL for a knowledge base document. Requires the elevenlabs package and a valid documentation_id parameter.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.knowledge_base.documents.get_source_file_url(
    documentation_id="documentation_id"
)
```

--------------------------------

### Start Next.js Development Server with npm

Source: https://elevenlabs.io/docs/agents-platform/guides/quickstarts/next-js

This command starts the Next.js development server, typically accessible via a local URL. It allows developers to preview and test their application in a browser during development, with hot-reloading capabilities.

```shell
npm run dev
```

--------------------------------

### Get Signed URL - JSON Response

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/get-signed-url_explorer=true

Successful response containing a signed URL that can be used to start a conversation with the specified agent. The URL includes the agent ID and a JWT signature for authorization.

```json
{
  "signed_url": "https://convai.elevenlabs.io/conversation/start?agent_id=21m00Tcm4TlvDq8ikWAM&signature=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
}
```

--------------------------------

### Install ElevenLabs Python Library

Source: https://elevenlabs.io/docs/api-reference/introduction

Install the official Python bindings for the ElevenLabs API using pip package manager. This is the recommended way to interact with the ElevenLabs API from Python applications.

```bash
pip install elevenlabs
```

--------------------------------

### Retrieve Documentation Chunk via Direct HTTP Request

Source: https://elevenlabs.io/docs/api-reference/knowledge-base/get-chunk

These examples show how to make a direct HTTP GET request to retrieve a specific documentation chunk from the ElevenLabs knowledge base. They construct the URL, set the `xi-api-key` header, and execute the request to fetch the chunk details.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/chunk/chunk_id"

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

url = URI("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/chunk/chunk_id")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/chunk/chunk_id")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

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

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/chunk/chunk_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

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

### Retrieve MCP Server Tool Configuration from ElevenLabs API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/tool-configuration/get

These examples demonstrate how to retrieve a specific tool configuration for an MCP server from the ElevenLabs API. They perform a GET request to the `/v1/convai/mcp-servers/{mcp_server_id}/tool-configs/{tool_name}` endpoint, often requiring an API key for authentication. The examples cover various programming languages using both dedicated SDKs and generic HTTP client libraries.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.mcpServers.toolConfigs.get("mcp_server_id", "tool_name");
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.mcp_servers.tool_configs.get(
    mcp_server_id="mcp_server_id",
    tool_name="tool_name"
)
```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id/tool-configs/tool_name"

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

url = URI("https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id/tool-configs/tool_name")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id/tool-configs/tool_name")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id/tool-configs/tool_name', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id/tool-configs/tool_name");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id/tool-configs/tool_name")! as URL,
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

### POST /v1/studio/podcasts

Source: https://elevenlabs.io/docs/api-reference/studio/create-podcast

Create a new podcast project in ElevenLabs Studio. This endpoint accepts podcast configuration parameters including model ID, podcast mode, source content, quality settings, and optional metadata like intro/outro text and callback URLs for conversion status notifications.

```APIDOC
## POST /v1/studio/podcasts

### Description
Create a new podcast project with customizable generation parameters including podcast type, quality, duration, and optional intro/outro content.

### Method
POST

### Endpoint
/v1/studio/podcasts

### Request Body
- **model_id** (string) - Required - The ID of the model to be used for this Studio project. Query GET /v1/models to list all available models.
- **mode** (string) - Required - The type of podcast to generate. Can be 'conversation' (interaction between two voices) or 'bulletin' (monologue).
- **source** (object) - Required - The source content for the Podcast.
- **quality_preset** (string) - Required - Output quality of the generated audio. Options: 'standard' (128kbps, 44.1kHz), 'high' (192kbps, 44.1kHz with improvements), 'ultra' (192kbps, 44.1kHz with highest improvements), 'ultra lossless' (705.6kbps, 44.1kHz, fully lossless).
- **duration_scale** (string) - Required - Duration of the generated podcast. Options: 'short' (< 3 minutes), 'default' (3-7 minutes), 'long' (> 7 minutes).
- **language** (string | null) - Optional - Two-letter language code (ISO 639-1).
- **intro** (string | null) - Optional - Intro text to be added at the beginning of the podcast.
- **outro** (string | null) - Optional - Outro text to be added at the end of the podcast.
- **instructions_prompt** (string | null) - Optional - Additional instructions to adjust the podcast's style and tone.
- **highlights** (array | null) - Optional - Brief summary or highlights (10-70 characters) providing key points or themes.
- **callback_url** (string | null) - Optional - URL that will be called when the Studio project conversion completes with status updates.

### Request Example
{
  "model_id": "eleven_monolingual_v1",
  "mode": "conversation",
  "source": {
    "type": "text",
    "content": "Your podcast content here"
  },
  "quality_preset": "high",
  "duration_scale": "default",
  "language": "en",
  "intro": "Welcome to our podcast",
  "outro": "Thanks for listening",
  "instructions_prompt": "Make it engaging and conversational",
  "highlights": ["Key topic 1", "Key topic 2"],
  "callback_url": "https://example.com/callback"
}

### Response
#### Success Response (200)
- **project_id** (string) - The unique identifier for the created podcast project.
- **request_id** (string) - The unique request identifier.
- **conversion_status** (string) - Initial conversion status.

#### Response Example
{
  "project_id": "21m00Tcm4TlvDq8ikWAM",
  "request_id": "1234567890",
  "conversion_status": "processing"
}

### Callback Notifications
When a callback_url is provided, the following webhook messages will be sent:

#### Project Conversion Success
{
  "type": "project_conversion_status",
  "event_timestamp": 1234567890,
  "data": {
    "request_id": "1234567890",
    "project_id": "21m00Tcm4TlvDq8ikWAM",
    "conversion_status": "success",
    "project_snapshot_id": "22m00Tcm4TlvDq8ikMAT",
    "error_details": null
  }
}

#### Project Conversion Error
{
  "type": "project_conversion_status",
  "event_timestamp": 1234567890,
  "data": {
    "request_id": "1234567890",
    "project_id": "21m00Tcm4TlvDq8ikWAM",
    "conversion_status": "error",
    "project_snapshot_id": null,
    "error_details": "Error details if conversion failed"
  }
}

#### Chapter Conversion Success
{
  "type": "chapter_conversion_status",
  "event_timestamp": 1234567890,
  "data": {
    "request_id": "1234567890",
    "project_id": "21m00Tcm4TlvDq8ikWAM",
    "chapter_id": "22m00Tcm4TlvDq8ikMAT",
    "conversion_status": "success",
    "chapter_snapshot_id": "23m00Tcm4TlvDq8ikMAV",
    "error_details": null
  }
}

#### Chapter Conversion Error
{
  "type": "chapter_conversion_status",
  "event_timestamp": 1234567890,
  "data": {
    "request_id": "1234567890",
    "project_id": "21m00Tcm4TlvDq8ikWAM",
    "chapter_id": "22m00Tcm4TlvDq8ikMAT",
    "conversion_status": "error",
    "chapter_snapshot_id": null,
    "error_details": "Error details if conversion failed"
  }
}
```

--------------------------------

### Get RAG Index Overview using Python SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/rag-index-overview

Python SDK example using the ElevenLabs client to retrieve RAG index overview. Instantiates the client with the API base URL and calls the rag_index_overview method on the conversational_ai module.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.rag_index_overview()
```

--------------------------------

### Get Dubbing Transcript - Go HTTP Client

Source: https://elevenlabs.io/docs/api-reference/legacy/dubbing/get-transcript-for-dub

Makes a GET request to the ElevenLabs dubbing transcript endpoint using Go's native net/http package. Includes proper header setup with API key authentication and response body reading. Demonstrates error handling and output of both response metadata and body content.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/dubbing/dubbing_id/transcript/language_code"

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

### Retrieve Speech History using ElevenLabs API

Source: https://elevenlabs.io/docs/api-reference/history/list

These examples illustrate how to fetch a list of speech history items from the ElevenLabs platform. The process generally involves making a GET request to the `/v1/history` endpoint, authenticating with an `xi-api-key` header, and parsing the response. Some examples use official SDKs, while others use standard HTTP client libraries.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.history.list({});
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.history.list()
```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/history"

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

url = URI("https://api.elevenlabs.io/v1/history")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/history")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/history', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/history");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/history")! as URL,
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

### Retrieve Conversation Audio using ElevenLabs SDKs and HTTP Clients

Source: https://elevenlabs.io/docs/agents-platform/api-reference/conversations/get-audio

These code examples demonstrate how to fetch the audio recording of a conversation using the ElevenLabs SDKs for TypeScript and Python, and direct HTTP requests in Go, Ruby, Java, PHP, C#, and Swift. All examples target the `/v1/convai/conversations/{conversation_id}/audio` endpoint and require an `xi-api-key` for authentication.

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

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.conversations.audio.get(
    conversation_id="conversation_id"
)
```

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

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/conversations/conversation_id/audio")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/conversations/conversation_id/audio', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/conversations/conversation_id/audio");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/conversations/conversation_id/audio")! as URL,
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

### Install Backend Dependencies for Authentication Server

Source: https://elevenlabs.io/docs/agents-platform/guides/quickstarts/java-script

This command installs the necessary Node.js packages for setting up a backend server. `express` is used for creating the web server, `cors` for handling cross-origin requests, and `dotenv` for loading environment variables from a `.env` file.

```bash
npm install express cors dotenv
```

--------------------------------

### Get Conversation Audio using ElevenLabs SDK - TypeScript

Source: https://elevenlabs.io/docs/api-reference/conversations/get-audio

TypeScript SDK example using the ElevenLabsClient to retrieve conversation audio. Initializes client with API environment URL and calls the conversationalAi.conversations.audio.get() method with conversation_id parameter.

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

### POST /audio-native/projects - Create Audio Native Project

Source: https://elevenlabs.io/docs/api-reference/audio-native/create

Creates a new Audio Native project with configurable text normalization and pronunciation dictionary settings. Returns project ID, conversion status, and an HTML snippet for embedding the Audio Native player.

```APIDOC
## POST /audio-native/projects

### Description
Creates a new Audio Native project with text normalization and pronunciation dictionary configuration options.

### Method
POST

### Endpoint
/audio-native/projects

### Parameters

#### Request Body
- **name** (string) - Required - The name of the Audio Native project
- **apply_text_normalization** (string) - Optional - Controls text normalization mode. Allowed values: 'auto', 'on', 'off', 'apply_english'
- **pronunciation_dictionary_locators** (array of strings) - Optional - A list of pronunciation dictionary locators encoded as JSON strings. Each locator contains pronunciation_dictionary_id and version_id

### Request Example
```json
{
  "name": "My Audio Project",
  "apply_text_normalization": "auto",
  "pronunciation_dictionary_locators": [
    "{\"pronunciation_dictionary_id\":\"Vmd4Zor6fplcA7WrINey\",\"version_id\":\"hRPaxjlTdR7wFMhV4w0b\"}",
    "{\"pronunciation_dictionary_id\":\"JzWtcGQMJ6bnlWwyMo7e\",\"version_id\":\"lbmwxiLu4q6txYxgdZqn\"}"
  ]
}
```

### Response

#### Success Response (200)
- **project_id** (string) - The unique identifier of the created Audio Native project
- **converting** (boolean) - Indicates whether the project is currently being converted
- **html_snippet** (string) - The HTML snippet code to embed the Audio Native player in your website

#### Response Example
```json
{
  "project_id": "proj_abc123xyz",
  "converting": true,
  "html_snippet": "<script src=\"https://elevenlabs.io/audio-native.js\" data-project-id=\"proj_abc123xyz\"></script>"
}
```

### Text Normalization Modes

- **auto** - Automatically decides whether to apply text normalization (e.g., spelling out numbers)
- **on** - Always applies text normalization to the input text
- **off** - Skips text normalization entirely
- **apply_english** - Same as 'on' but assumes the text is in English

### Pronunciation Dictionary Configuration

Multiple pronunciation dictionaries can be applied by providing multiple locators. Each locator must be a JSON-encoded string containing:
- **pronunciation_dictionary_id** (string) - The ID of the pronunciation dictionary
- **version_id** (string) - The version ID of the pronunciation dictionary
```

--------------------------------

### SDK Examples - SIP Trunk Outbound Call

Source: https://elevenlabs.io/docs/agents-platform/api-reference/sip-trunk/outbound-call

Code examples demonstrating how to make outbound calls using the ElevenLabs SDK across multiple programming languages including TypeScript, Python, Go, Ruby, Java, PHP, C#, and Swift.

```APIDOC
## SDK Implementation Examples

### TypeScript
```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.sipTrunk.outboundCall({
        agentId: "agent_12345",
        agentPhoneNumberId: "phone_num_67890",
        toNumber: "+14155552671",
    });
}
main();
```

### Python
```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.sip_trunk.outbound_call(
    agent_id="agent_12345",
    agent_phone_number_id="phone_num_67890",
    to_number="+14155552671"
)
```

### Go
```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {
	url := "https://api.elevenlabs.io/v1/convai/sip-trunk/outbound-call"
	payload := strings.NewReader("{\n  \"agent_id\": \"agent_12345\",\n  \"agent_phone_number_id\": \"phone_num_67890\",\n  \"to_number\": \"+14155552671\"\n}")
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

### Ruby
```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/sip-trunk/outbound-call")
http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true
request = Net::HTTP::Post.new(url)
request["xi-api-key"] = 'xi-api-key'
request["Content-Type"] = 'application/json'
request.body = "{\n  \"agent_id\": \"agent_12345\",\n  \"agent_phone_number_id\": \"phone_num_67890\",\n  \"to_number\": \"+14155552671\"\n}"
response = http.request(request)
puts response.read_body
```

### Java
```java
HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/convai/sip-trunk/outbound-call")
  .header("xi-api-key", "xi-api-key")
  .header("Content-Type", "application/json")
  .body("{\n  \"agent_id\": \"agent_12345\",\n  \"agent_phone_number_id\": \"phone_num_67890\",\n  \"to_number\": \"+14155552671\"\n}")
  .asString();
```

### PHP
```php
<?php
$client = new \GuzzleHttp\Client();
$response = $client->request('POST', 'https://api.elevenlabs.io/v1/convai/sip-trunk/outbound-call', [
  'body' => '{
  "agent_id": "agent_12345",
  "agent_phone_number_id": "phone_num_67890",
  "to_number": "+14155552671"
}',
  'headers' => [
    'Content-Type' => 'application/json',
    'xi-api-key' => 'xi-api-key',
  ],
]);
echo $response->getBody();
```

### C#
```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/sip-trunk/outbound-call");
var request = new RestRequest(Method.POST);
request.AddHeader("xi-api-key", "xi-api-key");
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"agent_id\": \"agent_12345\",\n  \"agent_phone_number_id\": \"phone_num_67890\",\n  \"to_number\": \"+14155552671\"\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

### Swift
```swift
import Foundation

let headers = [
  "xi-api-key": "xi-api-key",
  "Content-Type": "application/json"
]
let parameters = [
  "agent_id": "agent_12345",
  "agent_phone_number_id": "phone_num_67890",
  "to_number": "+14155552671"
] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])
let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/sip-trunk/outbound-call")! as URL,
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
```

--------------------------------

### GET /v1/models

Source: https://elevenlabs.io/docs/api-reference/authentication

Retrieve a list of available models from the ElevenLabs API. This example demonstrates how to include your API key in a `curl` request.

```APIDOC
## GET /v1/models

### Description
Retrieve a list of available models from the ElevenLabs API. This endpoint requires authentication using an API key.

### Method
GET

### Endpoint
/v1/models

### Parameters
#### Path Parameters
- No path parameters.

#### Query Parameters
- No query parameters.

#### Request Body
- No request body.

### Request Example
```bash
curl 'https://api.elevenlabs.io/v1/models' \
  -H 'Content-Type: application/json' \
  -H 'xi-api-key: $ELEVENLABS_API_KEY'
```

### Response
#### Success Response (200)
- The response will be a JSON array of model objects, each containing details like `model_id`, `name`, `can_do_text_to_speech`, etc.

#### Response Example
```json
[
  {
    "model_id": "string",
    "name": "string",
    "can_do_text_to_speech": true,
    "can_do_voice_conversion": true,
    "can_do_speech_to_speech": true,
    "can_do_text_to_text": false,
    "can_do_english_only": false,
    "can_use_style": true,
    "can_use_speaker_boost": true,
    "supported_language_ids": [
      "string"
    ]
  }
]
```
```

--------------------------------

### Example JSON Response for RAG Index Overview API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/rag-index-overview_explorer=true

This JSON snippet provides an example of a successful response from the RAG index overview API. It details the total used and maximum bytes for the knowledge base, along with a list of models and their individual used byte counts.

```json
{
  "total_used_bytes": 524288000,
  "total_max_bytes": 1073741824,
  "models": [
    {
      "model": "e5_mistral_7b_instruct",
      "used_bytes": 314572800
    },
    {
      "model": "multilingual_e5_large_instruct",
      "used_bytes": 209715200
    }
  ]
}
```

--------------------------------

### Example LLM Request with System Tools

Source: https://elevenlabs.io/docs/agents-platform/customization/llm/custom-llm

Complete example of an OpenAI-formatted request sent to a custom LLM with system tools configured. Demonstrates message structure, model parameters, and tool definitions including end_call, language_detection, and skip_turn tools with their parameters and descriptions.

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

### Example JSON Response for Service Accounts Retrieval

Source: https://elevenlabs.io/docs/api-reference/service-accounts/list_explorer=true

This JSON object represents a successful response from the '/v1/service-accounts' endpoint. It details the structure of service accounts, their names, associated API keys, and permissions, providing a clear example of the data returned by the API.

```json
{
  "service-accounts": [
    {
      "service_account_user_id": "svcacc_9f8b7c6d5e4a3b2c1d0e",
      "name": "Audio Processing Service",
      "api-keys": [
        {
          "name": "Primary API Key",
          "hint": "Key for audio synthesis",
          "key_id": "key_1234abcd5678efgh9012",
          "service_account_user_id": "svcacc_9f8b7c6d5e4a3b2c1d0e",
          "created_at_unix": 1688006400,
          "is_disabled": false,
          "permissions": [
            "text_to_speech",
            "voices_read",
            "models_read"
          ],
          "character_limit": 1000000,
          "character_count": 250000
        }
      ],
      "created_at_unix": 1688006400
    }
  ]
}
```

--------------------------------

### POST /v1/studio/projects - Create Studio Project

Source: https://elevenlabs.io/docs/api-reference/studio/add-project

Creates a new Studio project with optional configuration for text normalization, voice assignment, and auto-conversion settings. Supports specifying whether content is fiction and configuring voice settings for the project.

```APIDOC
## POST /v1/studio/projects

### Description
Creates a new ElevenLabs Studio project with configurable conversion and voice settings. Allows specification of content type, text normalization behavior, and optional automatic voice assignment.

### Method
POST

### Endpoint
/v1/studio/projects

### Request Body Parameters
- **fiction** (boolean | null) - Optional - Whether the content of this Studio project is fiction
- **apply_text_normalization** (string | null) - Optional - Text normalization mode: 'auto', 'on', 'apply_english', or 'off'
  - 'auto': System automatically decides whether to apply text normalization
  - 'on': Text normalization always applied
  - 'apply_english': Same as 'on' but assumes English text
  - 'off': Text normalization skipped
- **auto_convert** (boolean) - Optional - Whether to automatically convert the Studio project to audio (default: false)
- **auto_assign_voices** (boolean | null) - Optional - [Alpha Feature] Whether to automatically assign voices to phrases (default: false)
- **source_type** (string | null) - Optional - The type of Studio project to create
- **voice_settings** (array of strings) - Optional - Array of voice configuration settings

### Request Example
```json
{
  "fiction": true,
  "apply_text_normalization": "auto",
  "auto_convert": false,
  "auto_assign_voices": false,
  "source_type": "document",
  "voice_settings": []
}
```

### Response
#### Success Response (201)
- **project_id** (string) - Unique identifier for the created project
- **created_at** (integer) - Unix timestamp of project creation
- **status** (string) - Current project status

#### Response Example
```json
{
  "project_id": "21m00Tcm4TlvDq8ikWAM",
  "created_at": 1234567890,
  "status": "created"
}
```
```

--------------------------------

### Installation - Python

Source: https://elevenlabs.io/docs/api-reference

Install the official ElevenLabs Python bindings to interact with the API. This package provides convenient methods for text-to-speech conversion and other API operations.

```APIDOC
## Installation - Python

### Description
Install the official ElevenLabs Python client library for easy API integration.

### Installation Command
```bash
pip install elevenlabs
```

### Usage
Once installed, import and initialize the client with your API key:

```python
from elevenlabs.client import ElevenLabs

client = ElevenLabs(api_key="your_api_key")
```

### Features
- Official Python bindings for ElevenLabs API
- Support for text-to-speech conversion
- Access to response headers and metadata
- Easy integration with Python projects
```

--------------------------------

### Retrieve Document RAG Indexes via Direct HTTP GET Request

Source: https://elevenlabs.io/docs/api-reference/knowledge-base/get-rag-index

These examples illustrate how to make direct HTTP GET requests to the Eleven Labs API to retrieve RAG (Retrieval Augmented Generation) indexes for a document. They construct the URL, add the `xi-api-key` header for authentication, and process the API response.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/rag-index"

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

url = URI("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/rag-index")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/rag-index")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/rag-index', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/rag-index");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/knowledge-base/documentation_id/rag-index")! as URL,
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

### POST /v1/studio/projects

Source: https://elevenlabs.io/docs/api-reference/studio/add-project

Creates a new Studio project with optional initialization from a URL, document, or JSON content. Allows configuration of default voices for titles and paragraphs, model selection, and audio quality settings.

```APIDOC
## POST /v1/studio/projects

### Description
Creates a new Studio project. The project can be initialized as blank, from a document file, or from a URL. Supports customization of default voices and audio quality settings.

### Method
POST

### Endpoint
/v1/studio/projects

### Parameters
#### Header Parameters
- **xi-api-key** (string) - Required - API key for authentication

#### Request Body (multipart/form-data)
- **name** (string) - Required - The name of the Studio project, used for identification only
- **default_title_voice_id** (string or null) - Optional - The voice_id that corresponds to the default voice used for new titles
- **default_paragraph_voice_id** (string or null) - Optional - The voice_id that corresponds to the default voice used for new paragraphs
- **default_model_id** (string or null) - Optional - The ID of the model to be used for this Studio project. Query GET /v1/models to list all available models
- **from_url** (string or null) - Optional - A URL from which content will be extracted to initialize the Studio project. If set, 'from_document' and 'from_content_json' must be null
- **from_document** (binary) - Optional - An .epub, .pdf, .txt or similar file to initialize the Studio project with its content. If set, 'from_url' and 'from_content_json' must be null
- **from_content_json** (string) - Optional - JSON content to initialize the Studio project. If set, 'from_url' and 'from_document' must be null. If none of these three are provided, the project initializes as blank
- **quality_preset** (string) - Optional - Output quality of the generated audio. Default: "standard". Options: "standard" (128kbps, 44.1kHz), "high" (192kbps, 44.1kHz with improvements), "ultra" (192kbps, 44.1kHz with highest improvements)

### Request Example
```
POST /v1/studio/projects HTTP/1.1
Host: api.elevenlabs.io
xi-api-key: your-api-key
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="name"

My Studio Project
--boundary
Content-Disposition: form-data; name="default_title_voice_id"

6lCwbsX1yVjD49QmpkT0
--boundary
Content-Disposition: form-data; name="default_paragraph_voice_id"

6lCwbsX1yVjD49QmpkT1
--boundary
Content-Disposition: form-data; name="default_model_id"

model-id-123
--boundary
Content-Disposition: form-data; name="quality_preset"

high
--boundary--
```

### Response
#### Success Response (200)
- **AddProjectResponseModel** (object) - The created Studio project object with project details and configuration

#### Error Response (422)
- **Validation Error** - Request validation failed. Check that all required fields are properly formatted and that mutually exclusive fields (from_url, from_document, from_content_json) are not simultaneously provided

### Response Example
```json
{
  "project_id": "project-123",
  "name": "My Studio Project",
  "default_title_voice_id": "6lCwbsX1yVjD49QmpkT0",
  "default_paragraph_voice_id": "6lCwbsX1yVjD49QmpkT1",
  "default_model_id": "model-id-123",
  "quality_preset": "high",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Notes
- If neither 'from_url', 'from_document', nor 'from_content_json' are provided, the Studio project will be initialized as blank
- Only one of 'from_url', 'from_document', or 'from_content_json' can be provided at a time
- The from_content_json parameter accepts a structured array of chapters with blocks containing text-to-speech nodes with voice assignments
```

--------------------------------

### SDK Implementation - Python

Source: https://elevenlabs.io/docs/api-reference/knowledge-base/create-from-file

Upload a document to the Knowledge Base using the ElevenLabs Python SDK. This example shows how to initialize the client and create a document from a file.

```APIDOC
## Python SDK - Create Document from File

### Description
Use the ElevenLabs Python SDK to upload a document to your Conversational AI Knowledge Base.

### Installation
```
pip install elevenlabs
```

### Implementation
```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.knowledge_base.documents.create_from_file()
```

### Parameters
- **base_url** (string) - Optional - API base URL (defaults to production)
- **file** (file-like object) - Required - The document file to upload

### Response
Returns a document object containing the document ID and metadata.
```

--------------------------------

### Example Successful JSON Response for Get Pronunciation Dictionary

Source: https://elevenlabs.io/docs/api-reference/pronunciation-dictionaries/get_explorer=true

This JSON snippet illustrates the typical structure of a successful response when retrieving a pronunciation dictionary. It includes key identifiers like `id` and `latest_version_id`, along with metadata such as `name`, `creation_time_unix`, and an optional `description`.

```json
{
  "id": "5xM3yVvZQKV0EfqQpLrJ",
  "latest_version_id": "5xM3yVvZQKV0EfqQpLr2",
  "latest_version_rules_num": 2,
  "name": "My Dictionary",
  "permission_on_resource": "admin",
  "created_by": "ar6633Es2kUjFXBdR1iVc9ztsXl1",
  "creation_time_unix": 1714156800,
  "description": "This is a test dictionary"
}
```

--------------------------------

### Get Conversational AI Agent Details using ElevenLabs API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/agents/get

These examples demonstrate how to retrieve the details of a specific conversational AI agent from the ElevenLabs API. Each snippet shows how to make a GET request to the `/v1/convai/agents/{agent_id}` endpoint, typically requiring an API key for authentication. The output will be the agent's configuration and status.

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

--------------------------------

### CSV Examples for Transcription Data with Various Time Formats

Source: https://elevenlabs.io/docs/creative-platform/products/dubbing/dubbing-studio

These CSV examples demonstrate how to structure data for transcription and translation, including speaker, start time, end time, transcription, and translation fields. Different time formats are presented: decimal seconds, `hours:minutes:seconds:frame`, and `hours:minutes:seconds,milliseconds`. This allows for flexibility based on the system's time parsing requirements.

```csv
speaker,start_time,end_time,transcription,translation
Adam,"0.10000","1.15000","Hello, how are you?","Hola, ¿cómo estás?"
Adam,"1.50000","3.50000","I'm fine, thank you.","Estoy bien, gracias."
```

```csv
speaker,start_time,end_time,transcription,translation
Adam,"0:00:01:01","0:00:05:01","Hello, how are you?","Hola, ¿cómo estás?"
Adam,"0:00:06:01","0:00:10:01","I'm fine, thank you.","Estoy bien, gracias."
```

```csv
speaker,start_time,end_time,transcription,translation
Adam,"0:00:01,000","0:00:05,000","Hello, how are you?","Hola, ¿cómo estás?"
Adam,"0:00:06,000","0:00:10,000","I'm fine, thank you.","Estoy bien, gracias."
```

--------------------------------

### Stream Music from Prompt - Python

Source: https://elevenlabs.io/docs/api-reference/music/stream_explorer=true

Initialize an ElevenLabs client and stream a composed song using the music.stream() method. This example demonstrates basic client setup with the ElevenLabs API base URL. The method streams audio data in the specified format without requiring explicit parameters in this minimal example.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.music.stream()
```

--------------------------------

### Get Conversational AI Settings using ElevenLabs API SDKs

Source: https://elevenlabs.io/docs/agents-platform/api-reference/workspace/get

These examples illustrate how to retrieve the current conversational AI settings from the ElevenLabs API. Each snippet uses a different programming language or SDK to make a GET request to the '/v1/convai/settings' endpoint. An API key is typically required for authentication, passed either during client initialization or as a header.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.settings.get();
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.settings.get()
```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/settings"

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

url = URI("https://api.elevenlabs.io/v1/convai/settings")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/settings")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/settings', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/settings");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/settings")! as URL,
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

### Retrieve Conversational AI Batch Call via REST API with HTTP Clients

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/get

These examples illustrate how to make a direct GET request to the ElevenLabs Conversational AI batch calling REST API endpoint using various HTTP client libraries. Each example shows how to construct the request URL, set the `xi-api-key` header for authentication, and retrieve the response body. The input is a `batch_id` embedded in the URL, and the output is the API response containing batch call data.

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

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/batch-calling/batch_id")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/batch-calling/batch_id")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/batch-calling/batch_id', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/batch-calling/batch_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/batch-calling/batch_id")! as URL,
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

### Get WhatsApp Account using ElevenLabs SDK - TypeScript

Source: https://elevenlabs.io/docs/api-reference/whats-app/accounts/get

TypeScript SDK example using the ElevenLabs client library to retrieve WhatsApp account details. Initializes the client with the API base URL and calls the conversationalAi.whatsappAccounts.get() method with the phone_number_id parameter.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.whatsappAccounts.get("phone_number_id");
}
main();
```

--------------------------------

### POST /api/studio/projects

Source: https://elevenlabs.io/docs/changelog/2025/12/8

Create a new Studio project with per-project voice configuration. This endpoint now supports voice_settings parameter for project-level voice customization.

```APIDOC
## POST /api/studio/projects

### Description
Create a new Studio project with support for per-project voice configuration. Voice settings can now be overridden at the project level.

### Method
POST

### Endpoint
/api/studio/projects

### Parameters
#### Request Body
- **name** (string) - Required - Project name
- **description** (string) - Optional - Project description
- **voice_settings** (object) - Optional - Per-project voice configuration
  - **voice_id** (string) - Voice ID to use for project
  - **voice_stability** (number) - Voice stability override
  - **voice_similarity** (number) - Voice similarity override
  - **voice_style** (number) - Voice style override

### Request Example
{
  "name": "My Audio Project",
  "description": "A professional audio project",
  "voice_settings": {
    "voice_id": "voice_123",
    "voice_stability": 0.8,
    "voice_similarity": 0.9,
    "voice_style": 0.7
  }
}

### Response
#### Success Response (201)
- **project_id** (string) - Newly created project ID
- **name** (string) - Project name
- **voice_settings** (object) - Applied voice settings
- **created_at** (string) - Project creation timestamp

#### Response Example
{
  "project_id": "proj_abc123",
  "name": "My Audio Project",
  "voice_settings": {
    "voice_id": "voice_123",
    "voice_stability": 0.8,
    "voice_similarity": 0.9,
    "voice_style": 0.7
  },
  "created_at": "2025-12-08T10:30:00Z"
}
```

--------------------------------

### Java HTTP Example

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/test-invocations/get

Example of retrieving a test suite invocation using Java's Unirest library.

```APIDOC
## Java HTTP Example

### Usage
```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/test-invocations/test_invocation_id")
  .header("xi-api-key", "xi-api-key")
  .asString();
```
```

--------------------------------

### PHP HTTP Example

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/test-invocations/get

Example of retrieving a test suite invocation using PHP's Guzzle HTTP client.

```APIDOC
## PHP HTTP Example

### Usage
```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/test-invocations/test_invocation_id', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```
```

--------------------------------

### Example Successful Response for Get Chapter Snapshot API

Source: https://elevenlabs.io/docs/api-reference/studio/get-chapter-snapshot_explorer=true

This JSON object illustrates a successful response from the ElevenLabs API when retrieving a chapter snapshot. It contains key details such as the `chapter_snapshot_id`, `project_id`, `chapter_id`, `created_at_unix` timestamp, `name` of the snapshot, and an empty array for `character_alignments`.

```JSON
{
  "chapter_snapshot_id": "aw1NgEzBg83R7vgmiJt1",
  "project_id": "aw1NgEzBg83R7vgmiJt2",
  "chapter_id": "aw1NgEzBg83R7vgmiJt3",
  "created_at_unix": 1714204800,
  "name": "My Chapter Snapshot",
  "character_alignments": []
}
```

--------------------------------

### Delete Voice - Python SDK Example

Source: https://elevenlabs.io/docs/api-reference/voices/delete

Python implementation using the ElevenLabs SDK to delete a voice. Shows client setup and voice deletion method call.

```APIDOC
## Python SDK Example

### Code
```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.voices.delete(
    voice_id="voice_id"
)
```

### Usage
1. Import the ElevenLabs client
2. Initialize with the API base URL
3. Call the `voices.delete()` method with the voice_id parameter
```

--------------------------------

### Create Voice Previews with ElevenLabs Java HTTP Client

Source: https://elevenlabs.io/docs/api-reference/legacy/voices/create-previews

Implements the create-previews API call using Unirest, a lightweight Java HTTP client library. Sets the API key and content-type headers, includes the voice description in the JSON request body, and returns the response as a string.

```java
HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/text-to-voice/create-previews")
  .header("xi-api-key", "xi-api-key")
  .header("Content-Type", "application/json")
  .body("{\n  \"voice_description\": \"A sassy squeaky mouse with a playful and energetic tone, perfect for animated characters or children's stories.\"\n}")
  .asString();
```

--------------------------------

### Execute Dubbing Script - TypeScript

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/dubbing

Run the TypeScript dubbing script using tsx from the command line. This executes the example.mts file which performs the complete dubbing workflow.

```bash
npx tsx example.mts
```

--------------------------------

### Create Studio Project with Multipart Form Data - PHP

Source: https://elevenlabs.io/docs/api-reference/studio/add-project

Uses GuzzleHttp client to send a multipart POST request to create a studio project. Demonstrates how to structure multipart form fields including text fields (name) and file uploads (from_document). Requires xi-api-key header for authentication.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/studio/projects', [
  'multipart' => [
    [
        'name' => 'name',
        'contents' => 'Project 1'
    ],
    [
        'name' => 'from_document',
        'filename' => '<file1>',
        'contents' => null
    ]
  ],
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

--------------------------------

### Configure Agent System Prompt for Pre-Speech Acknowledgment

Source: https://elevenlabs.io/docs/agents-platform/customization/tools/tool-configuration/tool-call-sounds

This system prompt guides the agent to verbally acknowledge user requests before executing a tool. It ensures a natural conversational flow by having the agent speak, for example, 'Let me check that for you...', before invoking a tool, which is crucial for the 'With Pre-speech' sound behavior to trigger correctly.

```plaintext
When users request information, first acknowledge their request before using tools.
For example: "Let me check that for you..." then call the appropriate tool.
```

--------------------------------

### Get Document Content - Python SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-content

Python SDK example using the ElevenLabs client to fetch document content. Creates client instance with base URL and calls get_content method on the knowledge base documents resource.

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

### Get Document Content - TypeScript SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-content

TypeScript SDK example using the ElevenLabs client library to retrieve document content from the knowledge base. Initializes client with API environment and calls getContent method with documentation_id parameter.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.knowledgeBase.documents.getContent("documentation_id");
}
main();
```

--------------------------------

### Create and Navigate to Project Directory

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/raspberry-pi-voice-assistant

These commands create a new directory named `eleven-voice-assistant` for the project and then change the current working directory into it. This establishes the project's root folder where all subsequent files and virtual environments will be created.

```bash
mkdir eleven-voice-assistant
cd eleven-voice-assistant
```

--------------------------------

### Create Conversational AI MCP Server Tool Configuration

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/tool-configuration/create

These examples demonstrate how to create a new tool configuration for a specific Managed Conversational AI (MCP) server. They show how to send a POST request to the `/v1/convai/mcp-servers/{mcp_server_id}/tool-configs` endpoint, providing the `mcp_server_id` and the `tool_name` in the request body. The examples cover both SDK-based and direct HTTP client implementations across various languages.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.mcpServers.toolConfigs.create("mcp_server_id", {
        toolName: "weather_forecast_tool",
    });
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.mcp_servers.tool_configs.create(
    mcp_server_id="mcp_server_id",
    tool_name="weather_forecast_tool"
)
```

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id/tool-configs"

	payload := strings.NewReader("{\n  \"tool_name\": \"weather_forecast_tool\"\n}")

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

url = URI("https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id/tool-configs")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["xi-api-key"] = 'xi-api-key'
request["Content-Type"] = 'application/json'
request.body = "{\n  \"tool_name\": \"weather_forecast_tool\"\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id/tool-configs")
  .header("xi-api-key", "xi-api-key")
  .header("Content-Type", "application/json")
  .body("{\n  \"tool_name\": \"weather_forecast_tool\"\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id/tool-configs', [
  'body' => '{
  "tool_name": "weather_forecast_tool"
}',
  'headers' => [
    'Content-Type' => 'application/json',
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id/tool-configs");
var request = new RestRequest(Method.POST);
request.AddHeader("xi-api-key", "xi-api-key");
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"tool_name\": \"weather_forecast_tool\"\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = [
  "xi-api-key": "xi-api-key",
  "Content-Type": "application/json"
]
let parameters = ["tool_name": "weather_forecast_tool"] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id/tool-configs")! as URL,
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

### Serve Supabase Functions Locally

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/text-to-speech/streaming-and-caching-with-supabase

Start the Supabase functions server in development mode to test the text-to-speech function locally. This command enables hot-reloading and displays function logs for debugging.

```bash
supabase functions serve
```

--------------------------------

### Initialize ElevenLabs Client and Stream Music - TypeScript

Source: https://elevenlabs.io/docs/api-reference/music/stream

Creates an ElevenLabs client instance configured with the API environment URL and calls the music stream endpoint. Requires the @elevenlabs/elevenlabs-js package and uses async/await for asynchronous operations.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.music.stream({});
}
main();
```

--------------------------------

### POST /projects

Source: https://elevenlabs.io/docs/api-reference/studio/add-project

Creates a new audio project with comprehensive configuration options. This endpoint accepts multipart form data including project metadata, voice settings, content sources, and audio processing parameters. Supports multiple content input methods and provides callback functionality for tracking project status.

```APIDOC
## POST /projects

### Description
Creates a new audio project with metadata, voice configuration, and content processing settings. Supports multiple content sources and advanced audio normalization options.

### Method
POST

### Endpoint
/projects

### Parameters
#### Form Data Parameters
- **name** (string) - Required - Project name (e.g., "Project 1")
- **default_title_voice_id** (string) - Optional - Voice ID for title narration
- **default_paragraph_voice_id** (string) - Optional - Voice ID for paragraph narration
- **default_model_id** (string) - Optional - Default text-to-speech model ID
- **from_url** (string) - Optional - URL source for project content
- **from_document** (file) - Optional - Document file upload (application/octet-stream)
- **from_content_json** (string) - Optional - JSON formatted content
- **quality_preset** (string) - Optional - Audio quality preset setting
- **title** (string) - Optional - Project title metadata
- **author** (string) - Optional - Content author name
- **description** (string) - Optional - Project description
- **genres** (string) - Optional - Content genres
- **target_audience** (string) - Optional - Target audience specification
- **language** (string) - Optional - Content language code
- **content_type** (string) - Optional - Type of content (e.g., book, article)
- **original_publication_date** (string) - Optional - Original publication date
- **mature_content** (boolean) - Optional - Indicates if content contains mature material
- **isbn_number** (string) - Optional - ISBN number for published works
- **acx_volume_normalization** (boolean) - Optional - ACX volume normalization flag
- **volume_normalization** (boolean) - Optional - Enable volume normalization
- **pronunciation_dictionary_locators** (string) - Optional - Custom pronunciation dictionary references
- **callback_url** (string) - Optional - Webhook URL for project status updates
- **fiction** (boolean) - Optional - Indicates if content is fiction
- **apply_text_normalization** (boolean) - Optional - Enable text normalization
- **auto_convert** (boolean) - Optional - Enable automatic content conversion
- **auto_assign_voices** (boolean) - Optional - Automatically assign voices to content
- **source_type** (string) - Optional - Type of content source
- **voice_settings** (string) - Optional - Custom voice configuration settings

### Headers
- **xi-api-key** (string) - Required - ElevenLabs API key for authentication
- **Content-Type** (string) - Required - multipart/form-data with boundary specification

### Request Example
```
POST /projects HTTP/1.1
Host: api.elevenlabs.io
xi-api-key: your-api-key
Content-Type: multipart/form-data; boundary=---011000010111000001101001

-----011000010111000001101001
Content-Disposition: form-data; name="name"

Project 1
-----011000010111000001101001
Content-Disposition: form-data; name="title"

My Audio Project
-----011000010111000001101001
Content-Disposition: form-data; name="author"

John Doe
-----011000010111000001101001
Content-Disposition: form-data; name="language"

en
-----011000010111000001101001
Content-Disposition: form-data; name="auto_assign_voices"

true
-----011000010111000001101001--
```

### Response
#### Success Response (200 OK)
- **project_id** (string) - Unique identifier for the created project
- **name** (string) - Project name
- **status** (string) - Current project status
- **created_at** (string) - Project creation timestamp

#### Response Example
```json
{
  "project_id": "proj_abc123xyz",
  "name": "Project 1",
  "status": "processing",
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### Error Response (400 Bad Request)
- **error** (string) - Error message describing validation failure
- **details** (string) - Additional error details

#### Error Response (401 Unauthorized)
- **error** (string) - Authentication failed or invalid API key
```

--------------------------------

### Get RAG Index Overview using TypeScript SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/rag-index-overview

TypeScript SDK example using the ElevenLabsClient to call the ragIndexOverview method. Requires the @elevenlabs/elevenlabs-js package and returns RAG index information including total bytes and embedding model details.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.ragIndexOverview();
}
main();
```

--------------------------------

### Delete Voice - Swift HTTP Example

Source: https://elevenlabs.io/docs/api-reference/voices/delete

Swift implementation using URLSession to delete a voice. Shows NSMutableURLRequest setup with DELETE method and authentication header.

```APIDOC
## Swift HTTP Example

### Code
```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/voices/voice_id")! as URL,
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

### Usage
1. Set up headers dictionary with xi-api-key
2. Create NSMutableURLRequest with the endpoint URL
3. Set httpMethod to DELETE
4. Assign headers to the request
5. Create a data task with URLSession.shared
6. Handle response or error in the completion handler
7. Resume the data task to execute the request
```

--------------------------------

### Create Knowledge Base Document from URL - Ruby

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-url

Use Ruby's Net::HTTP library to send a POST request to the ElevenLabs API with SSL enabled. Include the xi-api-key header and JSON body containing the document URL.

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/knowledge-base/url")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["xi-api-key"] = 'xi-api-key'
request["Content-Type"] = 'application/json'
request.body = "{\n  \"url\": \"https://www.elevenlabs.io/docs/knowledge-base-integration\"\n}"

response = http.request(request)
puts response.read_body
```

--------------------------------

### Retrieve MCP Server Details from ElevenLabs API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/get

These code examples illustrate how to fetch the details of a specific MCP server from the ElevenLabs API. Depending on the language, this can be done using an official SDK or by making a direct GET request to the `/v1/convai/mcp-servers/{mcp_server_id}` endpoint. Authentication typically involves an `xi-api-key` header or client initialization.

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

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.mcp_servers.get(
    mcp_server_id="mcp_server_id"
)
```

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

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

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

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

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

### Install ElevenLabs React SDK

Source: https://elevenlabs.io/docs/agents-platform/libraries/react

Instructions for installing the ElevenLabs React SDK package using different package managers.

```shell
npm install @elevenlabs/react
# or
yarn add @elevenlabs/react
# or
pnpm install @elevenlabs/react
```

--------------------------------

### GET /agents/platform/workspace/settings

Source: https://elevenlabs.io/docs/api-reference/studio/create-podcast_explorer=true

Retrieves workspace settings for the platform.

```APIDOC
## GET /agents/platform/workspace/settings

### Description
Retrieves workspace settings for the platform.

### Method
GET

### Endpoint
/agents/platform/workspace/settings

### Parameters
#### Path Parameters
(None)

#### Query Parameters
(None)

#### Request Body
(None)

### Request Example
(None)

### Response
#### Success Response (200)
(No details provided)

#### Response Example
(No details provided)
```

--------------------------------

### Retrieve Resource Metadata using ElevenLabsClient in TypeScript

Source: https://elevenlabs.io/docs/api-reference/workspace/resources/get_explorer=true

This TypeScript example demonstrates how to fetch resource metadata using the `@elevenlabs/elevenlabs-js` client library. It initializes the client with the API environment and calls the `workspace.resources.get` method, specifying the `resource_id` and `resourceType`.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.workspace.resources.get("resource_id", {
        resourceType: "voice",
    });
}
main();
```

--------------------------------

### Fetch Conversational AI Test Summaries from ElevenLabs API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/summaries

These code examples illustrate how to retrieve summaries for specific conversational AI tests from the ElevenLabs API. Each example sends a POST request with a list of `test_ids` to the `/v1/convai/agent-testing/summaries` endpoint. An API key is required for authentication, typically passed in the `xi-api-key` header.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.tests.summaries({
        testIds: [
            "test_id_1",
            "test_id_2",
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

client.conversational_ai.tests.summaries(
    test_ids=[
        "test_id_1",
        "test_id_2"
    ]
)
```

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/agent-testing/summaries"

	payload := strings.NewReader("{\n  \"test_ids\": [\n    \"test_id_1\",\n    \"test_id_2\"\n  ]\n}")

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

url = URI("https://api.elevenlabs.io/v1/convai/agent-testing/summaries")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["xi-api-key"] = 'xi-api-key'
request["Content-Type"] = 'application/json'
request.body = "{\n  \"test_ids\": [\n    \"test_id_1\",\n    \"test_id_2\"\n  ]\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/convai/agent-testing/summaries")
  .header("xi-api-key", "xi-api-key")
  .header("Content-Type", "application/json")
  .body("{\n  \"test_ids\": [\n    \"test_id_1\",\n    \"test_id_2\"\n  ]\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/convai/agent-testing/summaries', [
  'body' => '{
  "test_ids": [
    "test_id_1",
    "test_id_2"
  ]
}',
  'headers' => [
    'Content-Type' => 'application/json',
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/agent-testing/summaries");
var request = new RestRequest(Method.POST);
request.AddHeader("xi-api-key", "xi-api-key");
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"test_ids\": [\n    \"test_id_1\",\n    \"test_id_2\"\n  ]\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = [
  "xi-api-key": "xi-api-key",
  "Content-Type": "application/json"
]
let parameters = ["test_ids": ["test_id_1", "test_id_2"]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/agent-testing/summaries")! as URL,
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

### Dubbed Transcript Response Structure - JSON

Source: https://elevenlabs.io/docs/api-reference/legacy/dubbing/get-transcript-for-dub_explorer=true

Example response structure from the Get Dubbed Transcript endpoint showing the hierarchical organization of transcript data. Includes language specification, utterances with speaker identification, word-level timing, and character-level granularity for precise synchronization.

```json
{
  "language": "en",
  "utterances": [
    {
      "text": "Hello, welcome to our dubbing service.",
      "speaker_id": "speaker_1",
      "start_s": 0,
      "end_s": 3.5,
      "words": [
        {
          "text": "Hello",
          "word_type": "word",
          "start_s": 0,
          "end_s": 0.5,
          "characters": [
            {
              "text": "H",
              "start_s": 0,
              "end_s": 0.1
            },
            {
              "text": "e",
              "start_s": 0.1,
              "end_s": 0.2
            },
            {
              "text": "l",
              "start_s": 0.2,
              "end_s": 0.3
            },
            {
              "text": "l",
              "start_s": 0.3,
              "end_s": 0.4
            },
            {
              "text": "o",
              "start_s": 0.4,
              "end_s": 0.5
            }
          ]
        },
        {
          "text": ",",
          "word_type": "punctuation",
          "start_s": 0.5,
          "end_s": 0.55,
          "characters": [
            {
              "text": ",",
              "start_s": 0.5,
              "end_s": 0.55
            }
          ]
        }
      ]
    }
  ]
}
```

--------------------------------

### Start Conversation Session with Client Tools and Dynamic Variables

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/upstash-redis

Initializes a conversation session by passing a signed URL, dynamic variables (like user name), and client tool implementations. The `set_ui_state` client tool enables the agent to navigate between different UI states (initial, training, voice, email, ready) and returns a confirmation message.

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

### Get Conversational AI Agent Test using ElevenLabs Python SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/get_explorer=true

This Python example demonstrates how to use the `elevenlabs` SDK to fetch a conversational AI agent test. It initializes the client with the ElevenLabs API base URL and then calls the `conversational_ai.tests.get` method, passing the required `test_id` to retrieve the test details.

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

### C# HTTP Example

Source: https://elevenlabs.io/docs/api-reference/studio/add-chapter

Create a chapter using RestSharp HTTP client for C#. This example demonstrates constructing a POST request with proper headers and request body.

```APIDOC
## C# HTTP Implementation

### Usage
```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/studio/projects/project_id/chapters");
var request = new RestRequest(Method.POST);
request.AddHeader("xi-api-key", "xi-api-key");
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"name\": \"Chapter 1\"\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

### Dependencies
- RestSharp HTTP client

### Headers
- **xi-api-key** - Your ElevenLabs API key
- **Content-Type** - application/json
```

--------------------------------

### Fetch Conversational AI Test Summaries (Multi-language)

Source: https://elevenlabs.io/docs/api-reference/tests/summaries

These examples demonstrate how to retrieve summaries for specific conversational AI tests. The input is a list of `test_ids` in a JSON payload, and the output is the API response containing the summaries. Some examples utilize official SDKs for ElevenLabs, while others show direct HTTP POST requests with appropriate headers (e.g., `xi-api-key`, `Content-Type`).

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.tests.summaries({
        testIds: [
            "test_id_1",
            "test_id_2",
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

client.conversational_ai.tests.summaries(
    test_ids=[
        "test_id_1",
        "test_id_2"
    ]
)
```

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/agent-testing/summaries"

	payload := strings.NewReader("{\n  \"test_ids\": [\n    \"test_id_1\",\n    \"test_id_2\"\n  ]\n}")

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

url = URI("https://api.elevenlabs.io/v1/convai/agent-testing/summaries")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["xi-api-key"] = 'xi-api-key'
request["Content-Type"] = 'application/json'
request.body = "{\n  \"test_ids\": [\n    \"test_id_1\",\n    \"test_id_2\"\n  ]\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/convai/agent-testing/summaries")
  .header("xi-api-key", "xi-api-key")
  .header("Content-Type", "application/json")
  .body("{\n  \"test_ids\": [\n    \"test_id_1\",\n    \"test_id_2\"\n  ]\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/convai/agent-testing/summaries', [
  'body' => '{\n  "test_ids": [\n    "test_id_1",\n    "test_id_2"\n  ]\n}',
  'headers' => [
    'Content-Type' => 'application/json',
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/agent-testing/summaries");
var request = new RestRequest(Method.POST);
request.AddHeader("xi-api-key", "xi-api-key");
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"test_ids\": [\n    \"test_id_1\",\n    \"test_id_2\"\n  ]\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = [
  "xi-api-key": "xi-api-key",
  "Content-Type": "application/json"
]
let parameters = ["test_ids": ["test_id_1", "test_id_2"]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/agent-testing/summaries")! as URL,
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

### Example Successful JSON Response for Get Test Summaries API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/summaries_explorer=true

This JSON object illustrates a successful response from the `/v1/convai/agent-testing/summaries` API endpoint. It contains a top-level `tests` object, which is expected to hold a dictionary mapping the requested test IDs to their corresponding summary data.

```json
{
  "tests": {}
}
```

--------------------------------

### Perform Forced Alignment with Audio and Text - Python

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/forced-alignment

Create a forced alignment request by loading an audio file from a URL and providing text to align. The API returns a transcription with exact timestamps for each word in the audio. Requires ElevenLabs API key set as environment variable.

```python
# example.py
import os
from io import BytesIO
from elevenlabs.client import ElevenLabs
import requests
from dotenv import load_dotenv

load_dotenv()

elevenlabs = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
)

audio_url = (
    "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3"
)
response = requests.get(audio_url)
audio_data = BytesIO(response.content)

# Perform the text-to-speech conversion
transcription = elevenlabs.forced_alignment.create(
    file=audio_data,
    text="With a soft and whispery American accent, I'm the ideal choice for creating ASMR content, meditative guides, or adding an intimate feel to your narrative projects."
)

print(transcription)
```

--------------------------------

### Start a Conversation Session in JavaScript

Source: https://elevenlabs.io/docs/agents-platform/libraries/java-script

Initializes and returns a `Conversation` instance, establishing a session. This method can throw an error if the session cannot be established, for example, due to microphone access denial or connection failure. Optional `inputDeviceId` or `outputDeviceId` can be provided at startup.

```js
const conversation = await Conversation.startSession({
  agentId: '<your-agent-id>',
  // Optionally specify input/output devices at session start
  inputDeviceId: 'your-input-device-id',
  outputDeviceId: 'your-output-device-id'
});
```

--------------------------------

### Example Successful Response for PVC Voice Sample Waveform

Source: https://elevenlabs.io/docs/api-reference/voices/pvc/samples/get-waveform_explorer=true

Provides an example of the JSON structure returned by the API upon successful retrieval of a PVC voice sample's visual waveform. It includes the `sample_id` and a `visual_waveform` array of floating-point numbers representing the waveform data.

```JSON
{
  "sample_id": "DCwhRBWXzGAHq8TQ4Fs18",
  "visual_waveform": [
    0.1,
    0.2,
    0.3,
    0.4,
    0.5
  ]
}
```

--------------------------------

### Example Widget Configuration API Response

Source: https://elevenlabs.io/docs/agents-platform/api-reference/widget/get_explorer=true

This JSON object illustrates the structure of a successful response from the 'Get widget' API endpoint. It includes the `agent_id` and a `widget_config` object detailing various settings such as language, supported overrides, and initial messages. This example helps understand the data format returned by the API.

```JSON
{
  "agent_id": "string",
  "widget_config": {
    "language": "en",
    "supported_language_overrides": [
      "es",
      "fr"
    ],
    "language_presets": {},
    "text_only": false,
    "supports_text_only": true,
    "first_message": "Hello! How can I help you today?",
    "use_rtc": false
  }
}
```

--------------------------------

### POST /v1/music/compose

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/music

Generate music from a text prompt using the Eleven Music API. This endpoint creates audio tracks based on detailed descriptions of the desired music style, tempo, and instrumentation. The response is streamed as audio data that can be saved to a file.

```APIDOC
## POST /v1/music/compose

### Description
Generate music from a text prompt. This endpoint accepts a detailed description of the music you want to create and returns the generated audio as a stream.

### Method
POST

### Endpoint
/v1/music/compose

### Parameters
#### Request Body
- **prompt** (string) - Required - Detailed description of the music to generate. Include style, tempo, instruments, mood, and any specific effects desired
- **music_length_ms** (integer) - Required - Duration of the generated music in milliseconds

### Request Example
```python
from elevenlabs.client import ElevenLabs
import os
from dotenv import load_dotenv

load_dotenv()

elevenlabs = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
)

track = elevenlabs.music.compose(
    prompt="Create an intense, fast-paced electronic track for a high-adrenaline video game scene. Use driving synth arpeggios, punchy drums, distorted bass, glitch effects, and aggressive rhythmic textures. The tempo should be fast, 130–150 bpm, with rising tension, quick transitions, and dynamic energy bursts.",
    music_length_ms=10000,
)

# Save the track to a file
with open("path/to/music.mp3", "wb") as f:
    for chunk in track:
        f.write(chunk)
```

### Response
#### Success Response (200)
- **audio_stream** (binary) - The generated music as an MP3 audio stream

### Notes
- The Eleven Music API is only available to paid users
- API key must be set as an environment variable or passed directly to the SDK
- Response is streamed and should be written to a file in chunks
```

--------------------------------

### Example JSON Response for Get Convai Workspace Settings

Source: https://elevenlabs.io/docs/api-reference/workspace/get_explorer=true

This JSON object illustrates a successful response when retrieving the conversational AI settings for a workspace. It includes configurations for conversation initiation webhooks, general webhooks (e.g., for transcripts), MCP server usage, RAG retention period, and the default LiveKit stack. This provides a clear example of the data structure returned by the API.

```json
{
  "conversation_initiation_client_data_webhook": {
    "url": "https://example.com/webhook",
    "request_headers": {
      "Content-Type": "application/json"
    }
  },
  "webhooks": {
    "post_call_webhook_id": "string",
    "events": [
      "transcript"
    ],
    "send_audio": true
  },
  "can_use_mcp_servers": false,
  "rag_retention_period_days": 10,
  "default_livekit_stack": "standard"
}
```

--------------------------------

### RAG Index Response Schema - JSON

Source: https://elevenlabs.io/docs/api-reference/knowledge-base/get-rag-index_explorer=true

Example response structure from the Get RAG Index endpoint showing the indexes array with individual index objects containing id, model, status, progress percentage, and document model index usage information.

```json
{
  "indexes": [
    {
      "id": "docidx_9f8b7c6d5a4e3f2b1c0d",
      "model": "e5_mistral_7b_instruct",
      "status": "succeeded",
      "progress_percentage": 100,
      "document_model_index_usage": {
        "used_bytes": 5242880
      }
    }
  ]
}
```

--------------------------------

### POST /v1/studio/projects

Source: https://elevenlabs.io/docs/api-reference/studio/add-project

Creates a new studio project with specified configuration. This endpoint accepts multipart form data to support file uploads, voice settings, and comprehensive project metadata. Projects can be created from various content sources including URLs, documents, or JSON content.

```APIDOC
## POST /v1/studio/projects

### Description
Creates a new studio project in ElevenLabs with customizable voice settings, content sources, and metadata. Supports multiple content input methods including file uploads, URLs, and JSON content.

### Method
POST

### Endpoint
https://api.elevenlabs.io/v1/studio/projects

### Parameters

#### Request Body (multipart/form-data)
- **name** (string) - Required - Project name
- **default_title_voice_id** (string) - Optional - Voice ID for title narration
- **default_paragraph_voice_id** (string) - Optional - Voice ID for paragraph narration
- **default_model_id** (string) - Optional - Default text-to-speech model ID
- **from_url** (string) - Optional - URL source for project content
- **from_document** (file) - Optional - Document file for project content (multipart file upload)
- **from_content_json** (string) - Optional - JSON formatted content
- **quality_preset** (string) - Optional - Quality preset for audio generation
- **title** (string) - Optional - Project title metadata
- **author** (string) - Optional - Content author name
- **description** (string) - Optional - Project description
- **genres** (string) - Optional - Content genres
- **target_audience** (string) - Optional - Target audience specification
- **language** (string) - Optional - Content language
- **content_type** (string) - Optional - Type of content
- **original_publication_date** (string) - Optional - Original publication date
- **mature_content** (boolean) - Optional - Indicates if content contains mature material
- **isbn_number** (string) - Optional - ISBN number if applicable
- **acx_volume_normalization** (boolean) - Optional - ACX volume normalization setting
- **volume_normalization** (boolean) - Optional - Enable volume normalization
- **pronunciation_dictionary_locators** (string) - Optional - Pronunciation dictionary references
- **callback_url** (string) - Optional - Webhook URL for project completion notifications
- **fiction** (boolean) - Optional - Indicates if content is fiction
- **apply_text_normalization** (boolean) - Optional - Apply text normalization rules
- **auto_convert** (boolean) - Optional - Automatically convert content format
- **auto_assign_voices** (boolean) - Optional - Automatically assign voices to content
- **source_type** (string) - Optional - Type of content source
- **voice_settings** (object) - Optional - Custom voice configuration settings

#### Headers
- **xi-api-key** (string) - Required - ElevenLabs API key for authentication
- **Content-Type** (string) - multipart/form-data

### Request Example
```
POST /v1/studio/projects HTTP/1.1
Host: api.elevenlabs.io
xi-api-key: your-api-key
Content-Type: multipart/form-data; boundary=----011000010111000001101001

------011000010111000001101001
Content-Disposition: form-data; name="name"

Project 1
------011000010111000001101001
Content-Disposition: form-data; name="default_title_voice_id"


------011000010111000001101001
Content-Disposition: form-data; name="from_document"; filename="document.pdf"
Content-Type: application/octet-stream

[binary file content]
------011000010111000001101001--
```

### Response

#### Success Response (200 OK)
- **project_id** (string) - Unique identifier for the created project
- **name** (string) - Project name
- **status** (string) - Current project status
- **created_at** (string) - Project creation timestamp

#### Response Example
```json
{
  "project_id": "proj_abc123xyz",
  "name": "Project 1",
  "status": "created",
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### Error Responses
- **400 Bad Request** - Invalid parameters or malformed request
- **401 Unauthorized** - Missing or invalid API key
- **422 Unprocessable Entity** - Validation error in request data
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Server-side error
```

--------------------------------

### Initialize Realtime Connection with Manual Audio Chunking - Python

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/speech-to-text/realtime/server-side-streaming

Establishes a realtime speech-to-text connection using ElevenLabs Python SDK with manual commit strategy and timestamp inclusion. Configures PCM audio format at 16kHz sample rate and sets up event handlers for session lifecycle management.

```python
connection = await elevenlabs.speech_to_text.realtime.connect(RealtimeAudioOptions(
    model_id="scribe_v2_realtime",
    audio_format=AudioFormat.PCM_16000,
    sample_rate=16000,
    commit_strategy=CommitStrategy.MANUAL,
    include_timestamps=True,
))
```

--------------------------------

### Python SDK Example - PVC Voice Verification

Source: https://elevenlabs.io/docs/api-reference/voices/pvc/verification/request

Example implementation using the ElevenLabs Python SDK to request voice verification. Shows client initialization with base URL and the voices.pvc.verification.request method.

```APIDOC
## Python SDK Implementation

### Description
Implement voice verification requests using the official ElevenLabs Python SDK.

### Code Example
```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.voices.pvc.verification.request(
    voice_id="voice_id"
)
```

### Configuration
- **base_url** - API endpoint URL
- **voice_id** - The ID of the voice to verify
```

--------------------------------

### Get Source File URL - TypeScript SDK

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-source-file-url

TypeScript SDK example using the ElevenLabs client library to retrieve a signed URL for downloading a knowledge base document source file. Requires the @elevenlabs/elevenlabs-js package and a valid documentation_id parameter.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.knowledgeBase.documents.getSourceFileUrl("documentation_id");
}
main();
```

--------------------------------

### Initiate Asynchronous Multichannel Transcription with Webhooks (Python)

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/speech-to-text/batch/multichannel-transcription

This Python example shows how to start an asynchronous multichannel transcription using webhooks for result delivery. It utilizes the `convert_async` method and sets `webhook=True` to enable webhook notifications for the transcription task, returning the task ID.

```python
from elevenlabs import ElevenLabs

elevenlabs = ElevenLabs(api_key="YOUR_API_KEY")

async def transcribe_multichannel_with_webhook(audio_file_path):
    with open(audio_file_path, 'rb') as audio_file:
        result = await elevenlabs.speech_to_text.convert_async(
            file=audio_file,
            model_id='scribe_v2',
            use_multi_channel=True,
            diarize=False,
            webhook=True  # Enable webhook delivery
        )

    print(f"Transcription started with task ID: {result.task_id}")
    return result.task_id
```

--------------------------------

### Ruby HTTP Example

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/test-invocations/get

Example of retrieving a test suite invocation using Ruby's Net::HTTP library.

```APIDOC
## Ruby HTTP Example

### Usage
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
```

--------------------------------

### Get a Project Snapshot from ElevenLabs API

Source: https://elevenlabs.io/docs/api-reference/studio/get-project-snapshot

These examples demonstrate how to retrieve a specific project snapshot from the ElevenLabs API. They cover both SDK-based and direct HTTP client approaches, requiring a project ID, snapshot ID, and an API key for authentication (where applicable). The output is the snapshot data, typically in JSON format.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.studio.projects.snapshots.get("project_id", "project_snapshot_id");
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.studio.projects.snapshots.get(
    project_id="project_id",
    project_snapshot_id="project_snapshot_id"
)
```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/studio/projects/project_id/snapshots/project_snapshot_id"

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

url = URI("https://api.elevenlabs.io/v1/studio/projects/project_id/snapshots/project_snapshot_id")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/studio/projects/project_id/snapshots/project_snapshot_id")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/studio/projects/project_id/snapshots/project_snapshot_id', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/studio/projects/project_id/snapshots/project_snapshot_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/studio/projects/project_id/snapshots/project_snapshot_id")! as URL,
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

### Delete Voice - C# HTTP Example

Source: https://elevenlabs.io/docs/api-reference/voices/delete

C# implementation using RestSharp library to delete a voice. Demonstrates RestClient setup with DELETE method and authentication header.

```APIDOC
## C# HTTP Example

### Code
```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/voices/voice_id");
var request = new RestRequest(Method.DELETE);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

### Usage
1. Create a RestClient with the voice endpoint URL
2. Create a RestRequest with DELETE method
3. Add the xi-api-key header
4. Execute the request and receive the response
```

--------------------------------

### Create Studio Project with RestSharp - C#

Source: https://elevenlabs.io/docs/api-reference/studio/add-project

Initializes a RestSharp client to make a POST request to the ElevenLabs studio projects endpoint. Sets up authentication using the xi-api-key header. This snippet shows the initial setup for a multipart request in C#.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/studio/projects");
var request = new RestRequest(Method.POST);
request.AddHeader("xi-api-key", "xi-api-key");
```

--------------------------------

### TypeScript SDK Example

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/test-invocations/get

Example of retrieving a test suite invocation using the ElevenLabs TypeScript SDK.

```APIDOC
## TypeScript SDK Example

### Usage
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
```

--------------------------------

### GET /v2/slots

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/cal-com

This tool checks if a particular time slot is available in the calendar by querying the Cal.com API for available time slots based on specified start, end times, and event type.

```APIDOC
## GET /v2/slots

### Description
This tool checks if a particular time slot is available in the calendar by querying the Cal.com API for available time slots based on specified start, end times, and event type.

### Method
GET

### Endpoint
/v2/slots

### Parameters
#### Headers
- **Authorization** (string) - Required - Bearer token for authentication. Prepend your Cal.com API key with 'Bearer '.
- **cal-api-version** (string) - Required - API version, e.g., '2024-09-04'.

#### Query Parameters
- **start** (string) - Required - Start date/time (UTC) from which to fetch slots, e.g. '2024-08-13T09:00:00Z'.
- **end** (string) - Required - End date/time (UTC) until which to fetch slots, e.g. '2024-08-13T17:00:00Z'.
- **eventTypeId** (string) - Required - The ID of the event type that is booked. If 15 minutes, return abc. If 30 minutes, return def. If 60 minutes, return xyz.

### Request Example
```json
{
  "headers": {
    "Authorization": "Bearer YOUR_API_KEY",
    "cal-api-version": "2024-09-04"
  },
  "query_parameters": {
    "start": "2024-08-13T09:00:00Z",
    "end": "2024-08-13T17:00:00Z",
    "eventTypeId": "abc"
  }
}
```

### Response
#### Success Response (200)
- **slots** (array) - An array of available time slots. (Details on array structure not provided in source text)

#### Response Example
```json
{
  "message": "Response structure not provided in source text."
}
```
```

--------------------------------

### Basic Usage of ElevenLabs Audio Native React Component (TypeScript/TSX)

Source: https://elevenlabs.io/docs/creative-platform/audio-tools/audio-native/react

This example demonstrates how to integrate the `ElevenLabsAudioNative` component into a React page. It shows the minimal setup required, importing the component and passing the essential `publicUserId` prop to render the player.

```tsx
import { ElevenLabsAudioNative } from './path/to/ElevenLabsAudioNative';

export default function Page() {
  return (
    <div>
      <h1>Your Page Title</h1>

      // Insert the public user ID from the embed code snippet
      <ElevenLabsAudioNative publicUserId="<your-public-user-id>" />

      <p>Your page content...</p>
    </div>
  );
}
```

--------------------------------

### Install Python Libraries for Hotword Detection and ElevenLabs Integration

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/raspberry-pi-voice-assistant

These commands install the necessary Python packages for the voice assistant. Key libraries include `tflite-runtime` for efficient machine learning inference, `librosa` for audio analysis, `EfficientWord-Net` for hotword detection, and `elevenlabs` with `pyaudio` support for ElevenLabs API interaction and audio input/output.

```bash
pip install tflite-runtime
pip install librosa
pip install EfficientWord-Net
pip install elevenlabs
pip install "elevenlabs[pyaudio]"
```

--------------------------------

### Retrieve Live Conversation Count using ElevenLabs SDKs

Source: https://elevenlabs.io/docs/agents-platform/api-reference/analytics/get

These code examples demonstrate how to fetch the live count of ongoing conversations using the ElevenLabs SDKs and direct HTTP requests in various programming languages. Each example initializes the client or constructs an HTTP request to the `/v1/convai/analytics/live-count` endpoint. An API key is typically required for authentication, often configured during client initialization or as a header.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.analytics.liveCount.get({});
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.analytics.live_count.get()
```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/analytics/live-count"

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

url = URI("https://api.elevenlabs.io/v1/convai/analytics/live-count")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/analytics/live-count")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/analytics/live-count', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/analytics/live-count");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/analytics/live-count")! as URL,
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

### List Conversational AI Test Invocations across multiple languages

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/test-invocations/list

These examples demonstrate how to retrieve a list of conversational AI test invocations for a specific agent ID. The TypeScript and Python examples utilize the ElevenLabs SDK, while other languages show direct HTTP GET requests to the API endpoint. An `agentId` or `agent_id` parameter is required for the request, and an API key (`xi-api-key`) is needed for direct HTTP calls.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.tests.invocations.list({
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

client.conversational_ai.tests.invocations.list(
    agent_id="agent_id"
)
```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/test-invocations?agent_id=agent_id"

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

url = URI("https://api.elevenlabs.io/v1/convai/test-invocations?agent_id=agent_id")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/test-invocations?agent_id=agent_id")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/test-invocations?agent_id=agent_id', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/test-invocations?agent_id=agent_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/test-invocations?agent_id=agent_id")! as URL,
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

### Delete Voice - Ruby HTTP Example

Source: https://elevenlabs.io/docs/api-reference/voices/delete

Ruby implementation using Net::HTTP library to delete a voice. Shows HTTPS request setup with DELETE method and authentication.

```APIDOC
## Ruby HTTP Example

### Code
```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/voices/voice_id")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Delete.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

### Usage
1. Parse the endpoint URL
2. Create an HTTP connection with SSL enabled
3. Create a DELETE request object
4. Set the xi-api-key header
5. Execute the request and output the response
```

--------------------------------

### Convert ElevenLabs Studio Project using Go HTTP Client

Source: https://elevenlabs.io/docs/api-reference/studio/convert-project

This Go code snippet shows how to manually make an HTTP POST request to convert an ElevenLabs Studio project. It constructs the URL, adds the `xi-api-key` header, and then executes the request using the default HTTP client, printing the response status and body.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/studio/projects/project_id/convert"

	req, _ := http.NewRequest("POST", url, nil)

	req.Header.Add("xi-api-key", "xi-api-key")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

--------------------------------

### Create Podcast with Conversation Mode using ElevenLabs API

Source: https://elevenlabs.io/docs/api-reference/studio/create-podcast

These examples illustrate how to create a podcast via the ElevenLabs API, specifically configuring it for a conversation mode. It requires a model ID, host and guest voice IDs, and a source URL for the content. The examples cover both SDK usage (TypeScript, Python) and direct HTTP requests (Go, Ruby, Java, PHP, C#, Swift).

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.studio.createPodcast({
        modelId: "eleven_multilingual_v2",
        mode: {
            type: "conversation",
            conversation: {
                hostVoiceId: "6lCwbsX1yVjD49QmpkTR",
                guestVoiceId: "bYTqZQo3Jz7LQtmGTgwi",
            },
        },
        source: {
            type: "url",
        },
    });
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.studio.create_podcast(
    model_id="eleven_multilingual_v2",
    mode={
        "type": "conversation",
        "conversation": {
            "host_voice_id": "6lCwbsX1yVjD49QmpkTR",
            "guest_voice_id": "bYTqZQo3Jz7LQtmGTgwi"
        }
    },
    source={
        "type": "url"
    }
)
```

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/studio/podcasts"

	payload := strings.NewReader("{\n  \"model_id\": \"eleven_multilingual_v2\",\n  \"mode\": {\n    \"type\": \"conversation\",\n    \"conversation\": {\n      \"host_voice_id\": \"6lCwbsX1yVjD49QmpkTR\",\n      \"guest_voice_id\": \"bYTqZQo3Jz7LQtmGTgwi\"\n    }\n  },\n  \"source\": {\n    \"type\": \"url\",\n    \"url\": \"https://en.wikipedia.org/wiki/Cognitive_science\"\n  }}")

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

url = URI("https://api.elevenlabs.io/v1/studio/podcasts")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["xi-api-key"] = 'xi-api-key'
request["Content-Type"] = 'application/json'
request.body = "{\n  \"model_id\": \"eleven_multilingual_v2\",\n  \"mode\": {\n    \"type\": \"conversation\",\n    \"conversation\": {\n      \"host_voice_id\": \"6lCwbsX1yVjD49QmpkTR\",\n      \"guest_voice_id\": \"bYTqZQo3Jz7LQtmGTgwi\"\n    }\n  },\n  \"source\": {\n    \"type\": \"url\",\n    \"url\": \"https://en.wikipedia.org/wiki/Cognitive_science\"\n  }}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/studio/podcasts")
  .header("xi-api-key", "xi-api-key")
  .header("Content-Type", "application/json")
  .body("{\n  \"model_id\": \"eleven_multilingual_v2\",\n  \"mode\": {\n    \"type\": \"conversation\",\n    \"conversation\": {\n      \"host_voice_id\": \"6lCwbsX1yVjD49QmpkTR\",\n      \"guest_voice_id\": \"bYTqZQo3Jz7LQtmGTgwi\"\n    }\n  },\n  \"source\": {\n    \"type\": \"url\",\n    \"url\": \"https://en.wikipedia.org/wiki/Cognitive_science\"\n  }}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/studio/podcasts', [
  'body' => '{
  "model_id": "eleven_multilingual_v2",
  "mode": {
    "type": "conversation",
    "conversation": {
      "host_voice_id": "6lCwbsX1yVjD49QmpkTR",
      "guest_voice_id": "bYTqZQo3Jz7LQtmGTgwi"
    }
  },
  "source": {
    "type": "url",
    "url": "https://en.wikipedia.org/wiki/Cognitive_science"
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/studio/podcasts");
var request = new RestRequest(Method.POST);
request.AddHeader("xi-api-key", "xi-api-key");
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"model_id\": \"eleven_multilingual_v2\",\n  \"mode\": {\n    \"type\": \"conversation\",\n    \"conversation\": {\n      \"host_voice_id\": \"6lCwbsX1yVjD49QmpkTR\",\n      \"guest_voice_id\": \"bYTqZQo3Jz7LQtmGTgwi\"\n    }\n  },\n  \"source\": {\n    \"type\": \"url\",\n    \"url\": \"https://en.wikipedia.org/wiki/Cognitive_science\"\n  }}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = [
  "xi-api-key": "xi-api-key",
  "Content-Type": "application/json"
]
let parameters = [
  "model_id": "eleven_multilingual_v2",
  "mode": [
    "type": "conversation",
    "conversation": [
      "host_voice_id": "6lCwbsX1yVjD49QmpkTR",
      "guest_voice_id": "bYTqZQo3Jz7LQtmGTgwi"
    ]
  ],
  "source": [
    "type": "url",
    "url": "https://en.wikipedia.org/wiki/Cognitive_science"
  ]
] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])
```

--------------------------------

### Retrieve Documentation Chunk using ElevenLabs SDKs

Source: https://elevenlabs.io/docs/api-reference/knowledge-base/get-chunk

These examples demonstrate how to fetch a specific documentation chunk from the ElevenLabs knowledge base using the official SDKs for various programming languages. They initialize the client and call the appropriate method with `documentation_id` and `chunk_id`.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.knowledgeBase.documents.chunk.get("documentation_id", "chunk_id");
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.knowledge_base.documents.chunk.get(
    documentation_id="documentation_id",
    chunk_id="chunk_id"
)
```

--------------------------------

### Python SDK - Create Agent Avatar

Source: https://elevenlabs.io/docs/agents-platform/api-reference/widget/create

Python SDK example showing how to create an avatar configuration for a conversational AI agent using the ElevenLabs Python client.

```APIDOC
## Python SDK Example

### Description
Demonstrates how to use the ElevenLabs Python SDK to create an avatar configuration for a conversational AI agent.

### Installation
```bash
pip install elevenlabs
```

### Usage
```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.agents.widget.avatar.create(
    agent_id="agent_id"
)
```

### Parameters
- **agent_id** (string) - The unique identifier of the agent

### Notes
- Ensure your API key is set in the ELEVENLABS_API_KEY environment variable
- The client automatically handles authentication and request formatting
```

--------------------------------

### GET /v1/agents/platform-workspace-settings

Source: https://elevenlabs.io/docs/api-reference/dubbing/get_explorer=true

Retrieves workspace settings.

```APIDOC
## GET /v1/agents/platform-workspace-settings\n\n### Description\nRetrieves workspace settings.\n\n### Method\nGET\n\n### Endpoint\n/v1/agents/platform-workspace-settings\n\n### Parameters\n#### Path Parameters\n\n#### Query Parameters\n\n#### Request Body\n\n### Request Example\n{}\n\n### Response\n#### Success Response (200)\n\n#### Response Example\n{}
```

--------------------------------

### Perform Voice Isolation using ElevenLabs API in Python and TypeScript

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/voice-isolator

This code demonstrates how to use the ElevenLabs SDK to perform voice isolation on an audio file from a URL. It fetches the audio, sends it to the `audioIsolation.convert` endpoint, and plays the processed stream through your speakers.

```python
# example.py
import os
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play
import requests
from io import BytesIO

load_dotenv()

elevenlabs = ElevenLabs(
  api_key=os.getenv("ELEVENLABS_API_KEY"),
)

audio_url = "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/fin.mp3"
response = requests.get(audio_url)
audio_data = BytesIO(response.content)

audio_stream = elevenlabs.audio_isolation.convert(audio=audio_data)

play(audio_stream)
```

```typescript
// example.mts
import { ElevenLabsClient, play } from "@elevenlabs/elevenlabs-js";
import "dotenv/config";

const elevenlabs = new ElevenLabsClient();

const audioUrl =
  "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/fin.mp3";
const response = await fetch(audioUrl);
const audioBlob = new Blob([await response.arrayBuffer()], {
  type: "audio/mp3",
});

const audioStream = await elevenlabs.audioIsolation.convert({
  audio: audioBlob,
});

await play(audioStream);
```

--------------------------------

### Create Music Composition Plan - Java HTTP Client

Source: https://elevenlabs.io/docs/api-reference/music/create-composition-plan

Make a POST request to the ElevenLabs music plan endpoint using the Unirest HTTP client library for Java. Sets the xi-api-key header for authentication and sends a JSON body with the prompt parameter.

```java
HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/music/plan")
  .header("xi-api-key", "xi-api-key")
  .header("Content-Type", "application/json")
  .body("{\n  \"prompt\": \"string\"\n}")
  .asString();
```

--------------------------------

### Installation - Node.js

Source: https://elevenlabs.io/docs/api-reference

Install the official ElevenLabs Node.js library to interact with the API from JavaScript/TypeScript projects. Provides convenient methods for API operations.

```APIDOC
## Installation - Node.js

### Description
Install the official ElevenLabs Node.js client library for JavaScript/TypeScript projects.

### Installation Command
```bash
npm install @elevenlabs/elevenlabs-js
```

### Features
- Official Node.js bindings for ElevenLabs API
- Support for text-to-speech conversion
- TypeScript support
- Easy integration with Node.js and browser projects
```

--------------------------------

### Configure Agent Prompt Tools in ElevenLabs API

Source: https://elevenlabs.io/docs/agents-platform/customization/tools/agent-tools-deprecation

These examples demonstrate the two distinct methods for defining tools within an agent's prompt configuration in the ElevenLabs API. The first example uses the deprecated `prompt.tools` array, while the second illustrates the recommended approach with `prompt.tool_ids` for custom tools and `built_in_tools` for system functionalities. It is critical to use either `prompt.tool_ids` (and `built_in_tools`) or `prompt.tools`, but never both in a single request, as this will result in an error.

```json
{
  "conversation_config": {
    "agent": {
      "prompt": {
        "tools": [
          {
            "type": "client", 
            "name": "open_url",
            "description": "Open a provided URL in the user's browser."
          },
          {
            "type": "system",
            "name": "end_call", 
            "description": "",
            "response_timeout_secs": 20,
            "params": {
              "system_tool_type": "end_call"
            }
          }
        ]
      }
    }
  }
}
```

```json
{
  "conversation_config": {
    "agent": {
      "prompt": {
        "tool_ids": ["tool_123456789abcdef0"],
        "built_in_tools": {
          "end_call": {
            "name": "end_call",
            "description": "",
            "response_timeout_secs": 20,
            "type": "system",
            "params": {
              "system_tool_type": "end_call"
            }
          },
          "language_detection": null,
          "transfer_to_agent": null,
          "transfer_to_number": null,
          "skip_turn": null
        }
      }
    }
  }
}
```

--------------------------------

### POST /voices/create-previews

Source: https://elevenlabs.io/docs/changelog/2025/11/21

Create voice previews for testing. Generates sample audio for specified voices to help with voice selection.

```APIDOC
## POST /voices/create-previews

### Description
Create voice previews for testing.

### Method
POST

### Endpoint
/voices/create-previews

### Request Body
- **voice_ids** (array) - Required - Array of voice IDs to preview
- **text** (string) - Optional - Text to use for preview

### Response
#### Success Response (200)
- **previews** (array) - Array of preview objects with voice_id and preview_url

### Notes
- Request schema updated (backward compatible)
```

--------------------------------

### Retrieve Knowledge Base Document Summaries

Source: https://elevenlabs.io/docs/api-reference/knowledge-base/get-summaries

This snippet demonstrates how to fetch summaries for specified documents from the ElevenLabs conversational AI knowledge base. It illustrates making a GET request to the `/v1/convai/knowledge-base/summaries` endpoint, passing `document_ids` as a query parameter and including an `xi-api-key` header for authentication. The examples showcase both SDK usage and direct HTTP requests across various programming languages.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.knowledgeBase.documents.summaries.get({
        documentIds: [
            "string"
        ]
    });
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.knowledge_base.documents.summaries.get(
    document_ids=[
        "string"
    ]
)
```

```go
package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/knowledge-base/summaries?document_ids=%5B%22string%22%5D"

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

url = URI("https://api.elevenlabs.io/v1/convai/knowledge-base/summaries?document_ids=%5B%22string%22%5D")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/knowledge-base/summaries?document_ids=%5B%22string%22%5D")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/knowledge-base/summaries?document_ids=%5B%22string%22%5D', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/knowledge-base/summaries?document_ids=%5B%22string%22%5D");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/knowledge-base/summaries?document_ids=%5B%22string%22%5D")! as URL,
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

### GET /agents/platform/workspace/dashboard/settings

Source: https://elevenlabs.io/docs/api-reference/studio/create-podcast_explorer=true

Retrieves dashboard settings for the workspace.

```APIDOC
## GET /agents/platform/workspace/dashboard/settings

### Description
Retrieves dashboard settings for the workspace.

### Method
GET

### Endpoint
/agents/platform/workspace/dashboard/settings

### Parameters
#### Path Parameters
(None)

#### Query Parameters
(None)

#### Request Body
(None)

### Request Example
(None)

### Response
#### Success Response (200)
(No details provided)

#### Response Example
(No details provided)
```

--------------------------------

### POST /v1/studio/podcasts

Source: https://elevenlabs.io/docs/api-reference/studio/create-podcast

This endpoint allows you to create and automatically convert a podcast project. Currently, ElevenLabs covers the LLM cost, but you will be charged for audio generation. Future updates will introduce charges for both LLM and audio generation costs.

```APIDOC
## POST /v1/studio/podcasts

### Description
Create and auto-convert a podcast project. Currently, the LLM cost is covered by us but you will still be charged for the audio generation. In the future, you will be charged for both the LLM and audio generation costs.

### Method
POST

### Endpoint
/v1/studio/podcasts

### Parameters
#### Path Parameters
(None)

#### Query Parameters
(None)

#### Request Body
(Details not provided in the input text, but `Content-Type: application/json` is specified)

### Request Example
{
  "//": "Request body details are not provided in the input text."
}

### Response
#### Success Response (200)
(Details not provided in the input text)

#### Response Example
{
  "//": "Response body details are not provided in the input text."
}
```

--------------------------------

### Retrieve Dependent Agents for a Tool ID

Source: https://elevenlabs.io/docs/api-reference/tools/get-dependent-agents

These examples demonstrate how to fetch the dependent agents associated with a specific tool ID from the ElevenLabs conversational AI API. Various programming languages and SDKs are used to perform an HTTP GET request to the `/v1/convai/tools/{tool_id}/dependent-agents` endpoint, typically requiring an API key for authentication.

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

--------------------------------

### Retrieve History Item - Go HTTP Client

Source: https://elevenlabs.io/docs/api-reference/history/get

Makes a GET request to the ElevenLabs history endpoint using Go's standard net/http package. Includes proper header setup with xi-api-key authentication and response body reading. Requires Go 1.11 or later.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/history/history_item_id"

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

### Initialize ElevenLabs CLI project

Source: https://elevenlabs.io/docs/agents-platform/operate/cli

Create a new ElevenLabs project structure with configuration directories and registry files. This command sets up the foundational directory layout for managing agents, tools, and tests.

```bash
elevenlabs agents init
```

--------------------------------

### Create ElevenLabs Agent via CLI

Source: https://elevenlabs.io/docs/agents-platform/quickstart

Create a new agent using the assistant template through the CLI. This initializes a new agent with predefined configurations that can be customized.

```bash
elevenlabs agents add "My Assistant" --template assistant
```

--------------------------------

### Voice Settings Response Schema - JSON

Source: https://elevenlabs.io/docs/api-reference/voices/settings/get_explorer=true

Example JSON response from the GET voice settings endpoint containing voice configuration parameters. Includes stability (0.85), speaker boost flag (true), similarity boost (0.9), style (0.2), and speed (1.05) values that control voice behavior and characteristics.

```json
{
  "stability": 0.85,
  "use_speaker_boost": true,
  "similarity_boost": 0.9,
  "style": 0.2,
  "speed": 1.05
}
```

--------------------------------

### Retrieve Conversational AI Tool using ElevenLabs API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/get

These code examples demonstrate how to fetch details for a specific Conversational AI Tool from the ElevenLabs API. They cover both the official SDKs (TypeScript, Python) and direct HTTP client implementations in various languages (Go, Ruby, Java, PHP, C#, Swift). The examples typically require an API key for authentication, which should replace the placeholder 'xi-api-key'.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.tools.get("tool_id");
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.tools.get(
    tool_id="tool_id"
)
```

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

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/tools/tool_id")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

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

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/tools/tool_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

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

### Create MCP Server Tool Approval for ElevenLabs Conversational AI

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/approval-policies/create

These examples demonstrate how to create a tool approval for a specific MCP (Multi-Channel Platform) server within the ElevenLabs Conversational AI API. This involves sending a POST request to the `/v1/convai/mcp-servers/{mcp_server_id}/tool-approvals` endpoint, providing the tool's name and description in the request body. SDK-based examples simplify client initialization, while direct HTTP examples show how to construct the request manually, including `xi-api-key` and `Content-Type` headers. The `mcp_server_id` placeholder should be replaced with an actual server ID.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.mcpServers.toolApprovals.create("mcp_server_id", {
        toolName: "WeatherForecast",
        toolDescription: "Provides real-time weather updates and forecasts based on location.",
    });
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.mcp_servers.tool_approvals.create(
    mcp_server_id="mcp_server_id",
    tool_name="WeatherForecast",
    tool_description="Provides real-time weather updates and forecasts based on location."
)
```

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id/tool-approvals"

	payload := strings.NewReader("{\n  \"tool_name\": \"WeatherForecast\",\n  \"tool_description\": \"Provides real-time weather updates and forecasts based on location.\"\n}")

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

url = URI("https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id/tool-approvals")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["xi-api-key"] = 'xi-api-key'
request["Content-Type"] = 'application/json'
request.body = "{\n  \"tool_name\": \"WeatherForecast\",\n  \"tool_description\": \"Provides real-time weather updates and forecasts based on location.\"\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id/tool-approvals")
  .header("xi-api-key", "xi-api-key")
  .header("Content-Type", "application/json")
  .body("{\n  \"tool_name\": \"WeatherForecast\",\n  \"tool_description\": \"Provides real-time weather updates and forecasts based on location.\"\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id/tool-approvals', [
  'body' => '{\n  "tool_name": "WeatherForecast",\n  "tool_description": "Provides real-time weather updates and forecasts based on location."\n}',
  'headers' => [
    'Content-Type' => 'application/json',
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id/tool-approvals");
var request = new RestRequest(Method.POST);
request.AddHeader("xi-api-key", "xi-api-key");
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"tool_name\": \"WeatherForecast\",\n  \"tool_description\": \"Provides real-time weather updates and forecasts based on location.\"\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = [
  "xi-api-key": "xi-api-key",
  "Content-Type": "application/json"
]
let parameters = [
  "tool_name": "WeatherForecast",
  "tool_description": "Provides real-time weather updates and forecasts based on location."
] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/mcp-servers/mcp_server_id/tool-approvals")! as URL,
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

### List Studio Projects - ElevenLabs Python SDK

Source: https://elevenlabs.io/docs/api-reference/studio/get-projects

Creates an ElevenLabs client instance with the base URL and calls the studio projects list method. Uses the official Python SDK with synchronous execution. Requires the elevenlabs package.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.studio.projects.list()
```

--------------------------------

### Create Instant Voice Clone - Python and TypeScript

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/voices/instant-voice-cloning

Create an Instant Voice Clone by uploading audio files to the ElevenLabs API. The function accepts a voice name and one or more audio files; more files improve clone quality. Returns a voice ID for the created clone.

```python
# example.py
import os
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from io import BytesIO

load_dotenv()

elevenlabs = ElevenLabs(
  api_key=os.getenv("ELEVENLABS_API_KEY"),
)

voice = elevenlabs.voices.ivc.create(
    name="My Voice Clone",
    # Replace with the paths to your audio files.
    # The more files you add, the better the clone will be.
    files=[BytesIO(open("/path/to/your/audio/file.mp3", "rb").read())]
)

print(voice.voice_id)
```

```typescript
// example.mts
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import "dotenv/config";
import fs from "node:fs";

const elevenlabs = new ElevenLabsClient();

const voice = await elevenlabs.voices.ivc.create({
    name: "My Voice Clone",
    // Replace with the paths to your audio files.
    // The more files you add, the better the clone will be.
    files: [
        fs.createReadStream(
            "/path/to/your/audio/file.mp3",
        ),
    ],
});

console.log(voice.voiceId);
```

--------------------------------

### Install ElevenLabs Python SDK with PyAudio extra

Source: https://elevenlabs.io/docs/agents-platform/libraries/python

Installs the `elevenlabs` Python package along with the `pyaudio` extra, which provides default audio input/output capabilities. This is necessary for using the `DefaultAudioInterface` in conversational AI applications.

```shell
pip install "elevenlabs[pyaudio]"
# or
poetry add "elevenlabs[pyaudio]"
```

--------------------------------

### POST /docs/api-reference/mcp/create, GET /docs/api-reference/mcp/get

Source: https://elevenlabs.io/docs/changelog/2025/10/27

These MCP server endpoints now include an `execution_mode` field for controlling tool execution timing, with a default of `immediate`.

```APIDOC
## POST /docs/api-reference/mcp/create, GET /docs/api-reference/mcp/get

### Description
Creates a new MCP server or retrieves an existing one, now including the `execution_mode` field for tool execution timing control.

### Method
POST, GET

### Endpoint
/docs/api-reference/mcp/create
/docs/api-reference/mcp/get

### Parameters
#### Path Parameters
(None for create, mcp_server_id for get)

#### Query Parameters
(None)

#### Request Body
- **execution_mode** (string) - Optional - Tool execution timing control. Default: `immediate`. Allowed values: `immediate`, `post_tool_speech`, `async`.

### Request Example
{
  "name": "New MCP Server",
  "execution_mode": "immediate"
}

### Response
#### Success Response (200)
- **id** (string) - Unique identifier for the MCP server.
- **name** (string) - Name of the MCP server.
- **execution_mode** (string) - The configured tool execution mode.

#### Response Example
{
  "id": "mcp_456",
  "name": "New MCP Server",
  "execution_mode": "immediate"
}
```

--------------------------------

### Retrieve Agent at Branch Tip (Python, JavaScript)

Source: https://elevenlabs.io/docs/agents-platform/operate/versioning

This example shows how to retrieve the latest state of an agent from a specific branch. This is useful for accessing the most current version of an agent within a development branch. You provide the `agent_id` and the `branch_id` to get the agent at the tip of that branch.

```python
agent = client.conversational_ai.agents.get(
    agent_id="your-agent-id",
    branch_id="agtbrch_xxxx"
)
```

```javascript
const agent = await client.conversationalAi.agents.get('your-agent-id', {
  branchId: 'agtbrch_xxxx',
});
```

--------------------------------

### List WhatsApp Accounts - Go HTTP Request

Source: https://elevenlabs.io/docs/agents-platform/api-reference/whats-app/accounts/list

Go example using the net/http package to make a GET request to the WhatsApp accounts endpoint. Includes xi-api-key header authentication and response body reading.

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/whatsapp-accounts"

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

### Search User Groups using ElevenLabs Python SDK

Source: https://elevenlabs.io/docs/api-reference/workspace/groups/search

This Python code illustrates how to search for user groups using the `elevenlabs` SDK. It initializes the client with the base URL and then invokes the `workspace.groups.search` method, providing the necessary `name` parameter. This example requires the `elevenlabs` package to be installed.

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.workspace.groups.search(
    name="name"
)
```

--------------------------------

### List WhatsApp Accounts - Java Unirest

Source: https://elevenlabs.io/docs/agents-platform/api-reference/whats-app/accounts/list

Java example using Unirest library to make a GET request to the WhatsApp accounts endpoint with xi-api-key header authentication.

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/whatsapp-accounts")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

--------------------------------

### Convert voice using Voice Changer API in Python

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/voice-changer

Transform an audio file's voice using the ElevenLabs Voice Changer API in Python. Loads the API key from environment variables, fetches audio from a URL, and converts it using the specified voice ID and model, then plays the result.

```python
# example.py
import os
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play
import requests
from io import BytesIO

load_dotenv()

elevenlabs = ElevenLabs(
  api_key=os.getenv("ELEVENLABS_API_KEY"),
)
voice_id = "JBFqnCBsd6RMkjVDRZzb"

audio_url = (
    "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3"
)
response = requests.get(audio_url)
audio_data = BytesIO(response.content)

audio_stream = elevenlabs.speech_to_speech.convert(
    voice_id=voice_id,
    audio=audio_data,
    model_id="eleven_multilingual_sts_v2",
    output_format="mp3_44100_128",
)

play(audio_stream)
```

--------------------------------

### POST /forced-alignment/create

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/forced-alignment

This endpoint allows you to align a given text with an audio file, returning a transcript with exact timestamps for each word. It's useful for tasks like creating synchronized subtitles or analyzing speech timing.

```APIDOC
## POST /forced-alignment/create

### Description
Aligns a provided text with an audio file, generating a transcript that includes precise timestamps for each word. This is useful for tasks like creating synchronized subtitles or analyzing speech timing.

### Method
POST

### Endpoint
`/forced-alignment/create`

### Parameters
#### Path Parameters
(None)

#### Query Parameters
(None)

#### Request Body
(Content-Type: multipart/form-data)
- **file** (file/binary) - Required - The audio file to be aligned.
- **text** (string) - Required - The text content to align with the audio.

### Request Example
```json
{
  "file": "<binary audio data>",
  "text": "With a soft and whispery American accent, I'm the ideal choice for creating ASMR content, meditative guides, or adding an intimate feel to your narrative projects."
}
```

### Response
#### Success Response (200)
- **words** (array of objects) - An array of objects, each representing a word with its start and end timestamps.
    - **word** (string) - The transcribed word.
    - **start** (number) - The start time of the word in seconds.
    - **end** (number) - The end time of the word in seconds.

#### Response Example
```json
{
  "words": [
    {
      "word": "With",
      "start": 0.12,
      "end": 0.34
    },
    {
      "word": "a",
      "start": 0.35,
      "end": 0.41
    },
    {
      "word": "soft",
      "start": 0.45,
      "end": 0.78
    },
    {
      "word": "and",
      "start": 0.81,
      "end": 0.95
    },
    {
      "word": "whispery",
      "start": 1.01,
      "end": 1.55
    },
    {
      "word": "American",
      "start": 1.60,
      "end": 2.10
    },
    {
      "word": "accent,",
      "start": 2.15,
      "end": 2.65
    },
    {
      "word": "I'm",
      "start": 2.70,
      "end": 2.90
    },
    {
      "word": "the",
      "start": 2.95,
      "end": 3.05
    },
    {
      "word": "ideal",
      "start": 3.10,
      "end": 3.45
    },
    {
      "word": "choice",
      "start": 3.50,
      "end": 3.85
    },
    {
      "word": "for",
      "start": 3.90,
      "end": 4.05
    },
    {
      "word": "creating",
      "start": 4.10,
      "end": 4.55
    },
    {
      "word": "ASMR",
      "start": 4.60,
      "end": 5.05
    },
    {
      "word": "content,",
      "start": 5.10,
      "end": 5.60
    },
    {
      "word": "meditative",
      "start": 5.65,
      "end": 6.25
    },
    {
      "word": "guides,",
      "start": 6.30,
      "end": 6.75
    },
    {
      "word": "or",
      "start": 6.80,
      "end": 6.95
    },
    {
      "word": "adding",
      "start": 7.00,
      "end": 7.35
    },
    {
      "word": "an",
      "start": 7.40,
      "end": 7.50
    },
    {
      "word": "intimate",
      "start": 7.55,
      "end": 8.05
    },
    {
      "word": "feel",
      "start": 8.10,
      "end": 8.35
    },
    {
      "word": "to",
      "start": 8.40,
      "end": 8.50
    },
    {
      "word": "your",
      "start": 8.55,
      "end": 8.75
    },
    {
      "word": "narrative",
      "start": 8.80,
      "end": 9.25
    },
    {
      "word": "projects.",
      "start": 9.30,
      "end": 9.80
    }
  ]
}
```
```

--------------------------------

### POST /v1/studio/projects

Source: https://elevenlabs.io/docs/api-reference/studio/add-project

Creates a new Studio project that can be initialized as blank, from a document, or from a URL. This endpoint accepts multipart/form-data to support file uploads for document-based project creation.

```APIDOC
## POST /v1/studio/projects

### Description
Creates a new Studio project. Projects can be initialized in multiple ways: as a blank project, from an uploaded document, or from a URL source.

### Method
POST

### Endpoint
https://api.elevenlabs.io/v1/studio/projects

### Content-Type
multipart/form-data

### Parameters
#### Request Body
- **project_name** (string) - Required - Name for the new Studio project
- **initialization_type** (string) - Required - Type of initialization: "blank", "document", or "url"
- **document** (file) - Optional - Document file for document-based project initialization
- **url** (string) - Optional - URL source for URL-based project initialization

### Request Example
```
POST /v1/studio/projects HTTP/1.1
Host: api.elevenlabs.io
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="project_name"

My Studio Project
------WebKitFormBoundary
Content-Disposition: form-data; name="initialization_type"

blank
------WebKitFormBoundary--
```

### Response
#### Success Response (200 OK)
- **project_id** (string) - Unique identifier for the created project
- **project_name** (string) - Name of the created project
- **initialization_type** (string) - Type of initialization used
- **created_at** (string) - ISO 8601 timestamp of project creation
- **status** (string) - Current status of the project

#### Response Example
```json
{
  "project_id": "proj_abc123xyz",
  "project_name": "My Studio Project",
  "initialization_type": "blank",
  "created_at": "2024-01-15T10:30:00Z",
  "status": "active"
}
```

### Reference
https://elevenlabs.io/docs/api-reference/studio/add-project
```

--------------------------------

### Example JSON Response for Get Dubbing Resource API

Source: https://elevenlabs.io/docs/api-reference/dubbing/resources/get-resource_explorer=true

This JSON object illustrates the detailed structure of the data returned by the ElevenLabs API when successfully retrieving a dubbing resource. It includes key identifiers, versioning, language information, and comprehensive media references for input, background, foreground, speaker tracks, and individual speaker segments, along with their associated dubs and subtitles.

```json
{
  "id": "dubbing_1234567890abcdef",
  "version": 2,
  "source_language": "en",
  "target_languages": [
    "es",
    "fr"
  ],
  "input": {
    "src": "original_video.mp4",
    "content_type": "video/mp4",
    "bucket_name": "elevenlabs-dubbing-assets",
    "random_path_slug": "a1b2c3d4e5f6",
    "duration_secs": 125.7,
    "is_audio": false,
    "url": "https://cdn.elevenlabs.io/assets/a1b2c3d4e5f6/original_video.mp4"
  },
  "background": {
    "src": "background_music.mp3",
    "content_type": "audio/mpeg",
    "bucket_name": "elevenlabs-dubbing-assets",
    "random_path_slug": "f6e5d4c3b2a1",
    "duration_secs": 125.7,
    "is_audio": true,
    "url": "https://cdn.elevenlabs.io/assets/f6e5d4c3b2a1/background_music.mp3"
  },
  "foreground": {
    "src": "voice_over_track.wav",
    "content_type": "audio/wav",
    "bucket_name": "elevenlabs-dubbing-assets",
    "random_path_slug": "1234abcd5678",
    "duration_secs": 125.7,
    "is_audio": true,
    "url": "https://cdn.elevenlabs.io/assets/1234abcd5678/voice_over_track.wav"
  },
  "speaker_tracks": {
    "speaker_1": {
      "id": "speaker_1",
      "media_ref": {
        "src": "speaker1_audio.wav",
        "content_type": "audio/wav",
        "bucket_name": "elevenlabs-dubbing-assets",
        "random_path_slug": "speaker1slug123",
        "duration_secs": 60.5,
        "is_audio": true,
        "url": "https://cdn.elevenlabs.io/assets/speaker1slug123/speaker1_audio.wav"
      },
      "speaker_name": "John Doe",
      "voices": {
        "default": "en_us_male_01"
      },
      "segments": [
        "segment_1",
        "segment_2"
      ]
    },
    "speaker_2": {
      "id": "speaker_2",
      "media_ref": {
        "src": "speaker2_audio.wav",
        "content_type": "audio/wav",
        "bucket_name": "elevenlabs-dubbing-assets",
        "random_path_slug": "speaker2slug456",
        "duration_secs": 65.2,
        "is_audio": true,
        "url": "https://cdn.elevenlabs.io/assets/speaker2slug456/speaker2_audio.wav"
      },
      "speaker_name": "Jane Smith",
      "voices": {
        "default": "en_us_female_02"
      },
      "segments": [
        "segment_3"
      ]
    }
  },
  "speaker_segments": {
    "segment_1": {
      "id": "segment_1",
      "start_time": 0,
      "end_time": 30,
      "text": "Hello, welcome to our presentation.",
      "subtitles": [
        {
          "start_time": 0,
          "end_time": 15,
          "lines": [
            "Hello, welcome",
            "to our presentation."
          ]
        }
      ],
      "dubs": {
        "es": {
          "start_time": 0,
          "end_time": 30,
          "text": "Hola, bienvenidos a nuestra presentación.",
          "subtitles": [
            {
              "start_time": 0,
              "end_time": 15,
              "lines": [
                "Hola, bienvenidos",
                "a nuestra presentación."
              ]
            }
          ],
          "audio_stale": false,
          "media_ref": {
            "src": "segment1_es.wav",
            "content_type": "audio/wav",
            "bucket_name": "elevenlabs-dubbing-assets",
            "random_path_slug": "seg1es1234",
            "duration_secs": 30,
            "is_audio": true,
            "url": "https://cdn.elevenlabs.io/assets/seg1es1234/segment1_es.wav"
          }
        }
      }
    },
    "segment_2": {
      "id": "segment_2",
      "start_time": 30,
      "end_time": 60.5,
      "text": "Today we will discuss the new features.",
      "subtitles": [
        {
          "start_time": 30,
          "end_time": 60.5,
          "lines": [
            "Today we will",
            "discuss the new features."
          ]
        }
      ],
      "dubs": {}
    }
  }
}
```

--------------------------------

### POST /v1/music/plan

Source: https://elevenlabs.io/docs/api-reference/music/create-composition-plan

Create a composition plan for music generation. Usage of this endpoint does not cost any credits but is subject to rate limiting depending on your tier.

```APIDOC
## POST /v1/music/plan

### Description
Create a composition plan for music generation. Usage of this endpoint does not cost any credits but is subject to rate limiting depending on your tier.

### Method
POST

### Endpoint
/v1/music/plan

### Parameters
#### Path Parameters
(None)

#### Query Parameters
(None)

#### Request Body
The request body is of type `application/json` but no specific fields are detailed in the provided documentation.

### Request Example
{}

### Response
#### Success Response (200)
No specific response fields are detailed in the provided documentation.

#### Response Example
{}
```

--------------------------------

### GET /agents/platform/widget

Source: https://elevenlabs.io/docs/api-reference/studio/create-podcast_explorer=true

Retrieves information about a platform widget.

```APIDOC
## GET /agents/platform/widget

### Description
Retrieves information about a platform widget.

### Method
GET

### Endpoint
/agents/platform/widget

### Parameters
#### Path Parameters
(None)

#### Query Parameters
(None)

#### Request Body
(None)

### Request Example
(None)

### Response
#### Success Response (200)
(No details provided)

#### Response Example
(No details provided)
```

--------------------------------

### Retrieve Conversational AI Dashboard Settings (Multi-language)

Source: https://elevenlabs.io/docs/agents-platform/api-reference/workspace/dashboard/get

These examples illustrate how to fetch the conversational AI dashboard settings from the ElevenLabs API. They demonstrate making a GET request to the `/v1/convai/settings/dashboard` endpoint, often requiring an `xi-api-key` header for authentication. The code snippets cover various programming languages and their respective HTTP client libraries or SDKs.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.dashboard.settings.get();
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.dashboard.settings.get()
```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/settings/dashboard"

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

url = URI("https://api.elevenlabs.io/v1/convai/settings/dashboard")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/settings/dashboard")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

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

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/settings/dashboard");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/settings/dashboard")! as URL,
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

### Create Audio Native Project with cURL

Source: https://elevenlabs.io/docs/api-reference/audio-native/create_explorer=true

This cURL command demonstrates how to send a POST request to the `/v1/audio-native` endpoint to create a new Audio Native project. It requires an `xi-api-key` header for authentication and uses `multipart/form-data` to send the project `name` and an optional `file`. A successful response returns a JSON object containing the `project_id`, `converting` status, and an `html_snippet` for embedding the player, for example: {"project_id": "JBFqnCBsd6RMkjVDRZzb", "converting": false, "html_snippet": "<div id='audio-native-player'></div>"}.

```curl
curl -X POST https://api.elevenlabs.io/v1/audio-native \
     -H "xi-api-key: xi-api-key" \
     -H "Content-Type: multipart/form-data" \
     -F name="string" \
     -F file=@<file1>
```

--------------------------------

### Example Successful Response for Knowledge Base Summaries

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-summaries_explorer=true

This JSON object illustrates a successful response when retrieving knowledge base summaries. It returns a dictionary where keys are document IDs and values are detailed summary objects, including status, metadata, access info, and dependent agents.

```json
{
  "21m00Tcm4TlvDq8ikWAM": {
    "status": "success",
    "data": {
      "id": "21m00Tcm4TlvDq8ikWAM",
      "name": "Company Website Terms of Service",
      "metadata": {
        "created_at_unix_secs": 1672531200,
        "last_updated_at_unix_secs": 1680307200,
        "size_bytes": 20480
      },
      "supported_usages": [
        "prompt",
        "auto"
      ],
      "access_info": {
        "is_creator": true,
        "creator_name": "Alice Johnson",
        "creator_email": "alice.johnson@company.com",
        "role": "admin"
      },
      "folder_parent_id": "f12345abcde67890",
      "folder_path": [
        {
          "id": "root"
        },
        {
          "id": "f12345abcde67890"
        }
      ],
      "dependent_agents": [
        {
          "id": "agent_001",
          "name": "Customer Support Bot",
          "type": "available",
          "created_at_unix_secs": 1675000000,
          "access_level": "editor",
          "referenced_resource_ids": [
            "21m00Tcm4TlvDq8ikWAM"
          ]
        }
      ],
      "type": "url",
      "url": "https://company.com/terms-of-service"
    }
  },
  "31n11Udm5UmwEr9jkXBN": {
    "status": "success",
    "data": {
      "id": "31n11Udm5UmwEr9jkXBN",
      "name": "Product User Guide",
      "metadata": {
        "created_at_unix_secs": 1669852800,
        "last_updated_at_unix_secs": 1682899200,
        "size_bytes": 512000
      },
      "supported_usages": [
        "prompt"
      ],
      "access_info": {
        "is_creator": false,
        "creator_name": "Bob Smith",
        "creator_email": "bob.smith@company.com",
        "role": "viewer"
      },
      "folder_parent_id": null,
      "folder_path": [],
      "dependent_agents": [],
      "type": "file"
    }
  }
}
```

--------------------------------

### Install core Node.js dependencies for Twilio and ElevenLabs

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/text-to-speech/twilio

This command installs the necessary production dependencies for the project, including the ElevenLabs JavaScript SDK, Express for the web server, Express-WS for WebSocket support, and the Twilio Node.js library.

```bash
npm install @elevenlabs/elevenlabs-js express express-ws twilio
```

--------------------------------

### Dub Audio File Using ElevenLabs API - TypeScript

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/dubbing

Create a TypeScript script that fetches an audio file, submits it to the ElevenLabs Dubbing API for Spanish translation, polls for completion status, and plays the dubbed audio. Uses async/await pattern and handles the asynchronous dubbing workflow with status checks.

```typescript
// example.mts
import { ElevenLabsClient, play } from "@elevenlabs/elevenlabs-js";
import "dotenv/config";

const elevenlabs = new ElevenLabsClient();

const targetLang = "es"; // spanish
const sourceAudio = await fetch(
  "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3"
);
const audioBlob = new Blob([await sourceAudio.arrayBuffer()], {
  type: "audio/mp3",
});

// Start dubbing
const dubbed = await elevenlabs.dubbing.create({
  file: audioBlob,
  targetLang: targetLang,
});

while (true) {
  const { status } = await elevenlabs.dubbing.get(
    dubbed.dubbingId
  );
  if (status === "dubbed") {
    const dubbedFile = await elevenlabs.dubbing.audio.get(
      dubbed.dubbingId,
      targetLang
    );
    await play(dubbedFile);
    break;
  } else {
    console.log("Audio is still being dubbed...");
  }

  // Wait 5 seconds between checks
  await new Promise((resolve) => setTimeout(resolve, 5000));
}
```

--------------------------------

### Retrieve Dubbed Audio using ElevenLabs SDKs and HTTP Clients

Source: https://elevenlabs.io/docs/api-reference/dubbing/audio/get

These code examples demonstrate how to programmatically fetch dubbed audio from the ElevenLabs API. They utilize various SDKs and HTTP client libraries to make a GET request to the specified endpoint, passing the dubbing ID, language code, and an API key. The response typically contains the streamed audio or video file.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.dubbing.audio.get("dubbing_id", "language_code");
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.dubbing.audio.get(
    dubbing_id="dubbing_id",
    language_code="language_code"
)
```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/dubbing/dubbing_id/audio/language_code"

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

url = URI("https://api.elevenlabs.io/v1/dubbing/dubbing_id/audio/language_code")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/dubbing/dubbing_id/audio/language_code")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/dubbing/dubbing_id/audio/language_code', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/dubbing/dubbing_id/audio/language_code");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/dubbing/dubbing_id/audio/language_code")! as URL,
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

### Create Knowledge Base Document from URL - TypeScript/JavaScript

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/create-from-url

Initialize an ElevenLabs client and create a knowledge base document by providing a URL. The client automatically handles authentication and API communication. Requires the @elevenlabs/elevenlabs-js SDK package.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.knowledgeBase.documents.createFromUrl({
        url: "https://www.elevenlabs.io/docs/knowledge-base-integration",
    });
}
main();
```

--------------------------------

### Pass Dynamic Variables at Runtime - JavaScript

Source: https://elevenlabs.io/docs/agents-platform/customization/personalization/dynamic-variables

Start an ElevenLabs Conversational Agent session in JavaScript with dynamic variables. This example shows requesting microphone access and initializing a conversation with user_name variable using the Conversation API.

```javascript
import { Conversation } from '@elevenlabs/client';

class VoiceAgent {
  async startConversation() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      this.conversation = await Conversation.startSession({
        agentId: 'agent_id_goes_here',
        dynamicVariables: {
          user_name: 'Angelo'
        }
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
      alert('Failed to start conversation. Please ensure microphone access is granted.');
    }
  }
}
```

--------------------------------

### GET /v1/convai/agent-testing/{test_id}

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/get

Retrieves a specific unit test configuration for conversational AI agent testing. Returns comprehensive test details including chat history, success conditions, example responses, and tool call evaluation parameters.

```APIDOC
## GET /v1/convai/agent-testing/{test_id}

### Description
Retrieve a specific unit test for conversational AI agents. This endpoint returns the complete test configuration including conversation history, success/failure criteria, and dynamic variables.

### Method
GET

### Endpoint
/v1/convai/agent-testing/{test_id}

### Parameters
#### Path Parameters
- **test_id** (string) - Required - The unique identifier of the unit test to retrieve

#### Headers
- **xi-api-key** (string) - Required - ElevenLabs API key for authentication

### Request Example
```
GET /v1/convai/agent-testing/test_id HTTP/1.1
Host: api.elevenlabs.io
xi-api-key: xi-api-key
```

### Response
#### Success Response (200)
- **chat_history** (array) - Conversation history transcript items
- **success_condition** (string) - Prompt that evaluates if agent response is successful (returns True or False)
- **success_examples** (array) - Non-empty list of example responses considered successful
- **failure_examples** (array) - Non-empty list of example responses considered failures
- **tool_call_parameters** (object or null) - How to evaluate agent's tool call (if any)
- **dynamic_variables** (object) - Dynamic variables to replace in agent config during testing
- **type** (string) - Unit test type classification
- **from_conversation_metadata** (object or null) - Metadata of conversation this test was created from
- **id** (string) - Unique test identifier
- **name** (string) - Test name

#### Response Example
```json
{
  "id": "test_id",
  "name": "Test Name",
  "chat_history": [],
  "success_condition": "Evaluate if response is appropriate",
  "success_examples": [],
  "failure_examples": [],
  "tool_call_parameters": null,
  "dynamic_variables": {},
  "type": "unit_test",
  "from_conversation_metadata": null
}
```

### SDK Examples

#### TypeScript
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

#### Python
```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.tests.get(
    test_id="test_id"
)
```

#### Go
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

#### Ruby
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

#### Java
```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/agent-testing/test_id")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

#### PHP
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

#### C#
```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/agent-testing/test_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

#### Swift
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
```

--------------------------------

### GET /studio/projects/{project_id}

Source: https://elevenlabs.io/docs/changelog/2025/11/21

Get details about a studio project. Returns project metadata, chapters, assets, and voice information. Added support for image assets and base voices.

```APIDOC
## GET /studio/projects/{project_id}

### Description
Get details about a studio project.

### Method
GET

### Endpoint
/studio/projects/{project_id}

### Path Parameters
- **project_id** (string) - Required - The unique identifier of the project

### Response
#### Success Response (200)
- **project_id** (string) - Project identifier
- **name** (string) - Project name
- **description** (string) - Project description
- **chapters** (array) - Array of chapter objects
- **assets** (array) - Array of asset objects (including images)
- **base_voices** (array) - Array of base voice
```

--------------------------------

### Create Music Composition Plan - TypeScript/JavaScript SDK

Source: https://elevenlabs.io/docs/api-reference/music/create-composition-plan

Initialize the ElevenLabs client and create a music composition plan using the TypeScript SDK. Requires a prompt string parameter and supports optional source composition plan and model ID configuration. The client connects to the ElevenLabs API endpoint.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.music.compositionPlan.create({
        prompt: "string",
    });
}
main();
```

--------------------------------

### GET /agents

Source: https://elevenlabs.io/docs/api-reference/studio/create-podcast_explorer=true

Lists all agents in the account with their basic information and status.

```APIDOC
## GET /agents

### Description
List all agents in the account.

### Method
GET

### Endpoint
/agents

### Parameters
#### Query Parameters
- **page** (integer) - Optional - Pagination page number
- **limit** (integer) - Optional - Items per page

### Response
#### Success Response (200)
- **agents** (array) - Array of agent objects
  - **agent_id** (string) - Agent identifier
  - **name** (string) - Agent name
  - **status** (string) - Agent status
  - **created_at** (timestamp) - Creation timestamp
```

--------------------------------

### Start Frontend Development Server

Source: https://elevenlabs.io/docs/agents-platform/guides/quickstarts/java-script

This command is used to start the frontend development server for the application. It's typically configured in the project's `package.json` file to run a development script, such as one provided by a framework like Vite.

```shell
npm run dev:frontend
```

--------------------------------

### POST /api-reference/studio/add-project

Source: https://elevenlabs.io/docs/changelog/2025/12/8

Adds an optional `voice_settings` parameter for per-project voice configuration to the add project endpoint.

```APIDOC
## POST /api-reference/studio/add-project

### Description
Adds an optional `voice_settings` parameter for per-project voice configuration to the add project endpoint.

### Method
POST

### Endpoint
/api-reference/studio/add-project

### Parameters
#### Request Body
- **voice_settings** (array) - Optional - Per-project voice configuration JSON.

### Request Example
{
  "example": "request body"
}

### Response
#### Success Response (200)
- **project_id** (string) - The ID of the newly added project.

#### Response Example
{
  "example": "response body"
}
```

--------------------------------

### GET /agents/PlatformWhatsAppAccounts/Get WhatsApp account

Source: https://elevenlabs.io/docs/api-reference/mcp/get_explorer=true

Gets a WhatsApp account.

```APIDOC
## GET /agents/PlatformWhatsAppAccounts/Get WhatsApp account

### Description
Retrieves a specific WhatsApp account.

### Method
GET

### Endpoint
/agents/PlatformWhatsAppAccounts/Get WhatsApp account

### Parameters
#### Path Parameters
- **account_id** (string) - Required - The ID of the account.

#### Headers
- **xi-api-key** (string) - Required - Your API key.

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- **Account Details** (object) - The details of the WhatsApp account.

#### Response Example
```json
{
  "example": ""
}
```
```

--------------------------------

### Stream Audio from URL using ElevenLabs Python SDK

Source: https://elevenlabs.io/docs/developer-guides/cookbooks/speech-to-text/server-side-streaming

This Python example demonstrates how to connect to the ElevenLabs Realtime Speech to Text API and transcribe an audio stream directly from a URL. It sets up event handlers for partial, committed, and timestamped transcripts, as well as error handling, using `asyncio` for asynchronous operations. This functionality requires `ffmpeg` to be installed on your system.

```python
from dotenv import load_dotenv
import os
import asyncio
from elevenlabs import ElevenLabs, RealtimeEvents, RealtimeUrlOptions

load_dotenv()

async def main():
    elevenlabs = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

    # Create an event to signal when to stop
    stop_event = asyncio.Event()

    # Connect to a streaming audio URL
    connection = await elevenlabs.speech_to_text.realtime.connect(RealtimeUrlOptions(
        model_id="scribe_v2_realtime",
        url="https://npr-ice.streamguys1.com/live.mp3",
        include_timestamps=True,
    ))

    # Set up event handlers
    def on_session_started(data):
        print(f"Session started: {data}")

    def on_partial_transcript(data):
        print(f"Partial: {data.get('text', '')}")

    def on_committed_transcript(data):
        print(f"Committed: {data.get('text', '')}")

    # Committed transcripts with word-level timestamps. Only received when include_timestamps is set to True.
    def on_committed_transcript_with_timestamps(data):
        print(f"Committed with timestamps: {data.get('words', '')}")

    # Errors - will catch all errors, both server and websocket specific errors
    def on_error(error):
        print(f"Error: {error}")
        # Signal to stop on error
        stop_event.set()

    def on_close():
        print("Connection closed")

    # Register event handlers
    connection.on(RealtimeEvents.SESSION_STARTED, on_session_started)
    connection.on(RealtimeEvents.PARTIAL_TRANSCRIPT, on_partial_transcript)
    connection.on(RealtimeEvents.COMMITTED_TRANSCRIPT, on_committed_transcript)
    connection.on(RealtimeEvents.COMMITTED_TRANSCRIPT_WITH_TIMESTAMPS, on_committed_transcript_with_timestamps)
    connection.on(RealtimeEvents.ERROR, on_error)
    connection.on(RealtimeEvents.CLOSE, on_close)

    print("Transcribing audio stream... (Press Ctrl+C to stop)")

    try:
        # Wait until error occurs or connection closes
        await stop_event.wait()
    except KeyboardInterrupt:
        print("\nStopping transcription...")
    finally:
        await connection.close()

if __name__ == "__main__":
    asyncio.run(main())
```

--------------------------------

### POST /v1/studio/projects

Source: https://elevenlabs.io/docs/api-reference/studio/add-project

Create a new studio project with optional voice settings overrides and configuration parameters. Supports multipart form data submission with project metadata, target audience, content type, and voice customization options.

```APIDOC
## POST /v1/studio/projects

### Description
Create a new studio project with optional voice settings overrides and project configuration.

### Method
POST

### Endpoint
/v1/studio/projects

### Parameters

#### Request Body (Multipart Form Data)
- **name** (string) - Required - The name of the project
- **target_audience** (string) - Optional - Target audience for the project. Enum: children, young adult, adult, all ages
- **fiction** (string) - Optional - Content type. Enum: fiction, non-fiction
- **source_type** (string) - Optional - Source material type. Enum: blank, book, article, genfm, video, screenplay
- **apply_text_normalization** (string) - Optional - Text normalization setting. Enum: auto, on, off, apply_english
- **voice_settings_overrides** (array of strings) - Optional - Voice settings overrides encoded as JSON strings

### Request Example
```json
{
  "name": "My Project",
  "target_audience": "adult",
  "fiction": "fiction",
  "source_type": "book",
  "apply_text_normalization": "auto",
  "voice_settings_overrides": ["{\"voice_id\": \"21m00Tcm4TlvDq8ikWAM\", \"stability\": 0.7, \"similarity_boost\": 0.8, \"style\": 0.5, \"speed\": 1.0, \"use_speaker_boost\": true}"]
}
```

### Response

#### Success Response (200)
- **creation_progress** (number) - The progress of the project creation (0-1)
- **status** (string) - Status of project creation. Enum: pending, creating, finished, failed
- **type** (string) - Type of creation action. Enum: blank, generate_podcast, auto_assign_voices
- **target_audience** (string) - Target audience. Enum: children, young adult, adult, all ages
- **fiction** (string) - Content type. Enum: fiction, non-fiction
- **source_type** (string) - Source type. Enum: blank, book, article, genfm, video, screenplay
- **access_level** (string) - User access level. Enum: admin, editor, commenter, viewer
- **state** (string) - Project state. Enum: creating, default, converting, in_queue

#### Response Example
```json
{
  "creation_progress": 0.5,
  "status": "creating",
  "type": "blank",
  "target_audience": "adult",
  "fiction": "fiction",
  "source_type": "book",
  "access_level": "admin",
  "state": "creating"
}
```
```

--------------------------------

### List WhatsApp Accounts - Swift URLSession

Source: https://elevenlabs.io/docs/agents-platform/api-reference/whats-app/accounts/list

Swift example using URLSession to make a GET request to the WhatsApp accounts endpoint. Configures headers, HTTP method, and handles the asynchronous response.

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/convai/whatsapp-accounts")! as URL,
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

### GET /v1/studio/projects/{project_id}

Source: https://elevenlabs.io/docs/api-reference/studio/get-project

Returns information about a specific Studio project. This endpoint returns more detailed information about a project than `GET /v1/studio`.

```APIDOC
## GET /v1/studio/projects/{project_id}

### Description
Returns information about a specific Studio project. This endpoint returns more detailed information about a project than `GET /v1/studio`.

### Method
GET

### Endpoint
/v1/studio/projects/{project_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The ID of the project to be used. You can use the [List projects](/docs/api-reference/studio/get-projects) endpoint to list all the available projects.

#### Query Parameters
- **share_id** (string/null) - Optional - The share ID of the project

#### Header Parameters
- **xi-api-key** (string) - Required - Your API key for authentication.

#### Request Body
(None)

### Request Example
{}

### Response
#### Success Response (200)
- **ProjectExtendedResponseModel** (object) - Detailed information about the Studio project.

#### Response Example
{}
```

--------------------------------

### List WhatsApp Accounts - C# RestSharp

Source: https://elevenlabs.io/docs/agents-platform/api-reference/whats-app/accounts/list

C# example using RestSharp library to make a GET request to the WhatsApp accounts endpoint. Configures the client URL and adds the xi-api-key header.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/whatsapp-accounts");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

--------------------------------

### List WhatsApp Accounts - PHP Guzzle

Source: https://elevenlabs.io/docs/agents-platform/api-reference/whats-app/accounts/list

PHP example using Guzzle HTTP client to make a GET request to the WhatsApp accounts endpoint. Includes xi-api-key header in the request options.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/whatsapp-accounts', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

--------------------------------

### LLM Prompt Template for Text-to-Speech Normalization

Source: https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices

A comprehensive prompt template for normalizing text output into a format suitable for text-to-speech conversion. This prompt instructs the LLM to expand numbers, symbols, and abbreviations with detailed examples covering monetary values, phone numbers, dates, times, URLs, and special characters. Use this as a starting point and customize based on specific requirements.

```text
Convert the output text into a format suitable for text-to-speech. Ensure that numbers, symbols, and abbreviations are expanded for clarity when read aloud. Expand all abbreviations to their full spoken forms.

Example input and output:

"$42.50" → "forty-two dollars and fifty cents"
"£1,001.32" → "one thousand and one pounds and thirty-two pence"
"1234" → "one thousand two hundred thirty-four"
"3.14" → "three point one four"
"555-555-5555" → "five five five, five five five, five five five five"
"2nd" → "second"
"XIV" → "fourteen" - unless it's a title, then it's "the fourteenth"
"3.5" → "three point five"
"⅔" → "two-thirds"
"Dr." → "Doctor"
"Ave." → "Avenue"
"St." → "Street" (but saints like "St. Patrick" should remain)
"Ctrl + Z" → "control z"
"100km" → "one hundred kilometers"
"100%" → "one hundred percent"
"elevenlabs.io/docs" → "eleven labs dot io slash docs"
"2024-01-01" → "January first, two-thousand twenty-four"
"123 Main St, Anytown, USA" → "one two three Main Street, Anytown, United States of America"
"14:30" → "two thirty PM"
"01/02/2023" → "January second, two-thousand twenty-three" or "the first of February, two-thousand twenty-three", depending on locale of the user
```

--------------------------------

### List WhatsApp Accounts - Ruby HTTP Request

Source: https://elevenlabs.io/docs/agents-platform/api-reference/whats-app/accounts/list

Ruby example using Net::HTTP to make a GET request to the WhatsApp accounts endpoint. Configures SSL and sets the xi-api-key header for authentication.

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/convai/whatsapp-accounts")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

--------------------------------

### Retrieve a Conversational AI Agent Test by ID

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/get

This snippet demonstrates how to fetch a specific conversational AI agent test using its unique identifier. The examples cover direct HTTP GET requests and SDK usage across multiple programming languages, typically requiring an API key for authentication.

```typescript
import { ElevenLabsClient } = "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.conversationalAi.tests.get("test_id");
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.tests.get(
    test_id="test_id"
)
```

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

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/agent-testing/test_id")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

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

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/agent-testing/test_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

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

### Upload Content to ElevenLabs Audio Native Project via HTTP POST

Source: https://elevenlabs.io/docs/api-reference/audio-native/update

These examples illustrate how to upload content to an ElevenLabs audio-native project using direct HTTP POST requests with `multipart/form-data`. They show how to construct the request body, set necessary headers like `xi-api-key` and `Content-Type`, and send the request using various programming languages. The `project_id` and file content should be replaced with actual values.

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/audio-native/project_id/content"

	payload := strings.NewReader("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"file\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"auto_convert\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"auto_publish\"\r\n\r\n\r\n-----011000010111000001101001--\r\n")

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

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/audio-native/project_id/content")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["xi-api-key"] = 'xi-api-key'
request["Content-Type"] = 'multipart/form-data; boundary=---011000010111000001101001'
request.body = "-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"file\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"auto_convert\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"auto_publish\"\r\n\r\n\r\n-----011000010111000001101001--\r\n"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/audio-native/project_id/content")
  .header("xi-api-key", "xi-api-key")
  .header("Content-Type", "multipart/form-data; boundary=---011000010111000001101001")
  .body("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"file\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"auto_convert\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"auto_publish\"\r\n\r\n\r\n-----011000010111000001101001--\r\n")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.elevenlabs.io/v1/audio-native/project_id/content', [
  'multipart' => [
    [
        'name' => 'file',
        'filename' => '<file1>',
        'contents' => null
    ]
  ],
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/audio-native/project_id/content");
var request = new RestRequest(Method.POST);
request.AddHeader("xi-api-key", "xi-api-key");
request.AddParameter("multipart/form-data; boundary=---011000010111000001101001", "-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"file\"; filename=\"<file1>\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"auto_convert\"\r\n\r\n\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"auto_publish\"\r\n\r\n\r\n-----011000010111000001101001--\r\n", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = [
  "xi-api-key": "xi-api-key",
  "Content-Type": "multipart/form-data; boundary=---011000010111000001101001"
]
let parameters = [
  [
    "name": "file",
    "fileName": "<file1>"
  ],
  [
    "name": "auto_convert",
    "value": ""
  ],
  [
    "name": "auto_publish",
    "value": ""
  ]
]

let boundary = "---011000010111000001101001"

var body = ""
var error: NSError? = nil
for param in parameters {
  let paramName = param["name"]!
  body += "--\(boundary)\r\n"
  body += "Content-Disposition:form-data; name=\"\(paramName)\""
  if let filename = param["fileName"] {
    // Note: 'content-type' is missing in the original Swift snippet's 'parameters' array for file.
    // Assuming a default or placeholder for demonstration.
    let contentType = "application/octet-stream" // Placeholder, adjust as needed
    // The original snippet attempts to read from a file, which is not fully provided.
    // For a complete example, 'fileContent' would need to be loaded from '<file1>'.
    let fileContent = "" // Replace with actual file content
    
    body += "; filename=\"\(filename)\"\r\n"
    body += "Content-Type: \(contentType)\r\n\r\n"
    body += fileContent
  } else if let paramValue = param["value"] {
    body += "\r\n\r\n\(paramValue)"
  }
}

// The Swift snippet provided is incomplete for sending the request.
// It only constructs the body. A full example would involve URLSession.
// Example of how to complete the request (not part of original snippet):
/*
let url = URL(string: "https://api.elevenlabs.io/v1/audio-native/project_id/content")!
var request = URLRequest(url: url)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = (body + "--\(boundary)--\r\n").data(using: .utf8)

let task = URLSession.shared.dataTask(with: request) { data, response, error in
  if let error = error { print(error); return }
  guard let data = data else { return }
  print(String(data: data, encoding: .utf8) ?? "")
}
task.resume()
*/
```

--------------------------------

### Initialize ElevenLabs Conversation Session (Kotlin, Node.js/TypeScript)

Source: https://elevenlabs.io/docs/agents-platform/libraries/kotlin

This snippet demonstrates various ways to initiate a conversation session with an ElevenLabs agent. It includes examples for connecting to public agents using an `agentId`, generating a `conversationToken` for private agents on the server-side, and then using that token to start a private session on the client. An optional `userId` can also be provided for identification.

```kotlin
val session = ConversationClient.startSession(
    config = ConversationConfig(
        agentId = "your-agent-id"
    ),
    context = this
)
```

```typescript
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

```kotlin
val session = ConversationClient.startSession(
    config = ConversationConfig(
        agentId = "your-agent-id",
        userId = "your-user-id"
    ),
    context = this
)
```

--------------------------------

### GET Unit Test Response Model

Source: https://elevenlabs.io/docs/api-reference/tests/update

Retrieves a unit test response model containing chat history, success conditions, failure examples, and tool call evaluation parameters. This endpoint returns comprehensive test configuration data used to validate agent responses.

```APIDOC
## GET /unit-tests/{id}

### Description
Retrieve a unit test response model by ID. Returns the complete test configuration including chat history, success/failure conditions, and evaluation parameters.

### Method
GET

### Endpoint
/unit-tests/{id}

### Parameters
#### Path Parameters
- **id** (string) - Required - The unique identifier of the unit test

### Response
#### Success Response (200)
- **chat_history** (array) - Required - Array of conversation history transcript items
- **success_condition** (string) - Required - A prompt that evaluates whether the agent's response is successful. Should return True or False
- **success_examples** (array) - Required - Non-empty list of example responses that should be considered successful
- **failure_examples** (array) - Required - Non-empty list of example responses that should be considered failures
- **tool_call_parameters** (object) - Optional - How to evaluate the agent's tool call (if any). If empty, the tool call is not evaluated
- **dynamic_variables** (object) - Optional - Dynamic variables to replace in the agent config during testing
- **type** (string) - Optional - The type of unit test
- **from_conversation_metadata** (object) - Optional - Metadata of a conversation this test was created from (if applicable)
- **id** (string) - Required - The unique identifier of the test
- **name** (string) - Required - The name of the unit test

### Response Example
{
  "id": "test-123",
  "name": "Agent Response Validation",
  "chat_history": [],
  "success_condition": "response contains greeting",
  "success_examples": [
    {
      "response": "Hello, how can I help?"
    }
  ],
  "failure_examples": [
    {
      "response": "Error occurred"
    }
  ],
  "tool_call_parameters": null,
  "dynamic_variables": {},
  "type": "conversation",
  "from_conversation_metadata": null
}
```

--------------------------------

### Create Studio Project - TypeScript ElevenLabs SDK

Source: https://elevenlabs.io/docs/api-reference/studio/add-project

Initializes an ElevenLabs client for TypeScript and creates a new studio project. Requires the @elevenlabs/elevenlabs-js package and API environment configuration. Returns a project creation response from the ElevenLabs API.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.studio.projects.create({});
}
main();
```

--------------------------------

### Python SDK Example - Update Pronunciation Dictionary

Source: https://elevenlabs.io/docs/api-reference/pronunciation-dictionaries/update_explorer=true

Python code example demonstrating how to update a pronunciation dictionary using the ElevenLabs SDK client.

```APIDOC
## Python SDK Example

### Description
Example of updating a pronunciation dictionary using the ElevenLabs Python SDK.

### Code Example
```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.pronunciation_dictionaries.update(
    pronunciation_dictionary_id="pronunciation_dictionary_id"
)
```

### Usage
This example initializes the ElevenLabs client and calls the update method on the pronunciation_dictionaries resource with the dictionary ID to update.
```

--------------------------------

### Initiate ElevenLabs Studio Project Creation Request in Java (Unirest)

Source: https://elevenlabs.io/docs/api-reference/studio/add-project

This Java code snippet, using the Unirest library, shows how to begin constructing an HTTP POST request to the ElevenLabs Studio Projects API. It sets the API key and specifies the Content-Type header as multipart/form-data with a defined boundary. Note that this snippet is incomplete and would require additional code to add the multipart body fields and execute the request.

```java
HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/studio/projects")
  .header("xi-api-key", "xi-api-key")
  .header("Content-Type", "multipart/form-data; boundary=---011000010111000001101001")
```

--------------------------------

### C# HTTP Example

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/test-invocations/get

Example of retrieving a test suite invocation using C#'s RestSharp library.

```APIDOC
## C# HTTP Example

### Usage
```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/test-invocations/test_invocation_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```
```

--------------------------------

### WSS /agents/websocket

Source: https://elevenlabs.io/docs/api-reference/knowledge-base/create-from-url_explorer=true

Establishes a WebSocket connection for agent-related real-time communication.

```APIDOC
## WSS /agents/websocket

### Description
Establishes a WebSocket connection for agent-related real-time communication.

### Method
WSS

### Endpoint
/agents/websocket

### Parameters
#### Path Parameters

#### Query Parameters

#### Request Body

### Request Example
{}

### Response
#### Success Response (200)

#### Response Example
{}
```

--------------------------------

### Search User Groups using ElevenLabs TypeScript SDK

Source: https://elevenlabs.io/docs/api-reference/workspace/groups/search

This TypeScript code demonstrates how to search for user groups using the `@elevenlabs/elevenlabs-js` SDK. It initializes the client with the API base URL and then calls the `workspace.groups.search` method, passing the required `name` parameter. This example assumes the SDK is installed and configured.

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.workspace.groups.search({
        name: "name",
    });
}
main();
```

--------------------------------

### Upload Audio Sample Files for Voice Training

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/voices/professional-voice-cloning

Upload multiple audio/video files to train the Professional Voice Clone. Files are read from disk and passed to the SDK for processing. More files result in better voice clones.

```python
# Define the list of file paths explicitly
# Replace with the paths to your audio and/or video files.
# The more files you add, the better the clone will be.
sample_file_paths = [
    "/path/to/your/first_sample.mp3",
    "/path/to/your/second_sample.wav",
    "relative/path/to/another_sample.mp4"
]

samples = None

files_to_upload = []
# Use ExitStack to manage multiple open files
with ExitStack() as stack:
    for filepath in sample_file_paths:
        # Open each file and add it to the stack
        audio_file = stack.enter_context(open(filepath, "rb"))
        filename = os.path.basename(filepath)

        # Create a File object for the SDK
        files_to_upload.append(
            BytesIO(audio_file.read())
        )

    samples = elevenlabs.voices.pvc.samples.create(
        voice_id=voice.voice_id,
        files=files_to_upload # Pass the list of File objects
    )
```

```typescript
const samples = await elevenlabs.voices.pvc.samples.create(voice.voiceId, {
    // Replace with the paths to your audio and/or video files.
    // The more files you add, the better the clone will be.
    files: [fs.createReadStream("/path/to/your/audio/file.mp3")],
})
```

--------------------------------

### Get Audio Native Settings - PHP Guzzle HTTP Client

Source: https://elevenlabs.io/docs/api-reference/audio-native/get-settings

Retrieves Audio Native project settings using the Guzzle HTTP client library for PHP. Creates a client instance, performs a GET request with xi-api-key header, and outputs the response body. Requires guzzlehttp/guzzle package.

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/audio-native/project_id/settings', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

--------------------------------

### Configure ElevenLabs Agent System Prompt with Dynamic Variable

Source: https://elevenlabs.io/docs/agents-platform/guides/integrations/expo-react-native

This text snippet provides an example of a system prompt for an ElevenLabs agent, which includes a dynamic variable and instructions for tool usage. The `{{platform}}` variable personalizes the prompt, while the text explicitly informs the agent about its available tools (`getBatteryLevel`, `changeBrightness`) and when to use them, guiding its behavior.

```text
You are a helpful assistant running on {{platform}}. You have access to certain tools that allow you to check the user device battery level and change the display brightness. Use these tools if the user asks about them. Otherwise, just answer the question.
```

--------------------------------

### Search User Groups with C# RestClient

Source: https://elevenlabs.io/docs/api-reference/workspace/groups/search

This C# code uses the RestSharp library (represented by `RestClient`) to perform a GET request to search for user groups. It constructs the request, adds the `xi-api-key` header, and executes it. This example requires the RestSharp NuGet package.

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/workspace/groups/search?name=name");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

--------------------------------

### POST /v1/studio/podcasts

Source: https://elevenlabs.io/docs/api-reference/studio/create-podcast

Create and auto-convert a podcast project with support for conversation or bulletin modes. The endpoint accepts text or URL sources and provides customizable audio quality presets. Currently, LLM costs are covered by ElevenLabs, but you will be charged for audio generation.

```APIDOC
## POST /v1/studio/podcasts

### Description
Create and auto-convert a podcast project. Currently, the LLM cost is covered by ElevenLabs but you will still be charged for the audio generation. In the future, you will be charged for both the LLM and audio generation costs.

### Method
POST

### Endpoint
/v1/studio/podcasts

### Parameters

#### Headers
- **xi-api-key** (string) - Required - Your API key for authentication
- **safety-identifier** (string) - Optional - Used for moderation. Your workspace must be allowlisted to use this feature.

#### Request Body
- **mode** (object) - Required - Podcast mode configuration (conversation or bulletin)
  - **type** (string) - Required - Enum: "conversation" or "bulletin"
  - **conversation** (object) - Required if type is "conversation"
    - **host_voice_id** (string) - Required - The ID of the host voice
    - **guest_voice_id** (string) - Required - The ID of the guest voice
  - **bulletin** (object) - Required if type is "bulletin"
    - **host_voice_id** (string) - Required - The ID of the host voice
- **source** (object or array) - Required - Content source for the podcast
  - Single source object:
    - **type** (string) - Required - Enum: "text" or "url"
    - **text** (string) - Required if type is "text" - The text to create the podcast from
    - **url** (string) - Required if type is "url" - The URL to create the podcast from
  - Array of sources: Array of text or URL source objects
- **quality_preset** (string) - Optional - Audio quality preset. Enum: "standard", "high", "highest", "ultra", "ultra_lossless". Default: "standard"
- **duration_scale** (string) - Optional - Duration scale for the podcast. Enum: "short", "default", "long". Default: "default"
- **apply_text_normalization** (string) - Optional - Text normalization setting. Enum: "auto", "on", "off"

### Request Example
```json
{
  "mode": {
    "type": "conversation",
    "conversation": {
      "host_voice_id": "voice_id_1",
      "guest_voice_id": "voice_id_2"
    }
  },
  "source": {
    "type": "text",
    "text": "Your podcast content here"
  },
  "quality_preset": "high",
  "duration_scale": "default",
  "apply_text_normalization": "auto"
}
```

### Response

#### Success Response (200)
- **PodcastProjectResponseModel** (object) - The created podcast project

#### Response Example
```json
{
  "project_id": "podcast_project_123",
  "status": "processing",
  "mode": "conversation",
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### Error Response (422)
- **Validation Error** - Request validation failed. Check that all required fields are provided and have valid values.
```

--------------------------------

### Example Character Usage Metrics JSON Response

Source: https://elevenlabs.io/docs/api-reference/usage/get_explorer=true

This JSON snippet illustrates the typical structure of a successful response from the character usage metrics API. It includes a 'time' array with Unix timestamps and a 'usage' object detailing aggregated usage values.

```json
{
  "time": [
    1738252091000,
    1739404800000
  ],
  "usage": {
    "All": [
      49,
      1053
    ]
  }
}
```

--------------------------------

### List Models API Response - JSON

Source: https://elevenlabs.io/docs/api-reference/models/list_explorer=true

Example JSON response from the GET /v1/models endpoint showing the structure of model objects returned by the API. Each model object contains metadata about capabilities, supported languages, character limits, and cost factors.

```json
[
  {
    "model_id": "eleven_multilingual_v2",
    "name": "Eleven Multilingual v2",
    "can_be_finetuned": true,
    "can_do_text_to_speech": true,
    "can_do_voice_conversion": true,
    "can_use_style": true,
    "can_use_speaker_boost": true,
    "serves_pro_voices": true,
    "token_cost_factor": 1.1,
    "description": "Our state-of-the-art multilingual speech synthesis model, capable of generating life-like speech in 29 languages.",
    "requires_alpha_access": true,
    "max_characters_request_free_user": 2500,
    "max_characters_request_subscribed_user": 10000,
    "maximum_text_length_per_request": 1000000,
    "languages": [
      {
        "language_id": "en",
        "name": "English"
      }
    ],
    "model_rates": {
      "character_cost_multiplier": 1
    },
    "concurrency_group": "standard_eleven_multilingual_v2"
  }
]
```

--------------------------------

### Client Method startSession

Source: https://elevenlabs.io/docs/agents-platform/libraries/kotlin

Initiates a WebRTC connection with an ElevenLabs Agent, enabling real-time voice communication. This method is called from the client-side SDK and supports both public and private agents.

```APIDOC
## Client Method startSession

### Description
This method establishes the WebRTC connection and prepares the client to communicate with the ElevenLabs Agents agent. It requires either an `agentId` for public agents or a `conversationToken` for private agents.

### Method
Client Method

### Endpoint
startSession

### Parameters
#### Request Body (representing method arguments)
- **agentId** (string) - Optional (Required if `conversationToken` is not provided) - The ID of the public agent to connect to.
- **conversationToken** (string) - Optional (Required if `agentId` is not provided) - The conversation token obtained from the server-side API for private agents.
- **userId** (string) - Optional - An optional customer identifier for the user, included in conversation initiation data.

### Request Example
```json
{
  "agentId": "your-public-agent-id",
  "userId": "your-customer-identifier"
}
```
OR
```json
{
  "conversationToken": "your_conversation_token",
  "userId": "another-customer-identifier"
}
```

### Response
#### Success Response (200)
- **session** (object) - An object representing the active conversation session.

#### Response Example
No explicit JSON response body. The method returns a session object for further interaction.
```

--------------------------------

### GET /v1/agents/platform-widget

Source: https://elevenlabs.io/docs/api-reference/dubbing/get_explorer=true

Retrieves a specific widget.

```APIDOC
## GET /v1/agents/platform-widget\n\n### Description\nRetrieves a specific widget.\n\n### Method\nGET\n\n### Endpoint\n/v1/agents/platform-widget\n\n### Parameters\n#### Path Parameters\n\n#### Query Parameters\n\n#### Request Body\n\n### Request Example\n{}\n\n### Response\n#### Success Response (200)\n\n#### Response Example\n{}
```

--------------------------------

### Compose detailed music with HTTP POST request - Go

Source: https://elevenlabs.io/docs/api-reference/music/compose-detailed

Construct and execute an HTTP POST request to the ElevenLabs music detailed endpoint using Go's net/http package. Includes JSON payload with prompt and music duration, and reads the response body.

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/music/detailed"

	payload := strings.NewReader("{\n  \"prompt\": \"A prompt for music generation\",\n  \"music_length_ms\": 10000\n}")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("Content-Type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

--------------------------------

### Dashboard Settings Response - JSON

Source: https://elevenlabs.io/docs/agents-platform/api-reference/workspace/dashboard/get_explorer=true

Example JSON response from the dashboard settings endpoint containing an array of chart objects with their names and types. The response includes configuration for dashboard visualizations such as call success rate metrics.

```json
{
  "charts": [
    {
      "name": "Overall Call Success Rate",
      "type": "call_success"
    }
  ]
}
```

--------------------------------

### Tool Execution Modes Reference

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tools/update

Reference guide for the three execution modes available for both webhook and client tools, explaining when each mode should be used and its behavior.

```APIDOC
## Tool Execution Modes

### Description
Execution modes determine when and how tools execute relative to agent speech and conversation flow.

### Execution Mode Options

#### immediate
- **Behavior**: Tool executes immediately when requested by the LLM
- **Use Case**: Quick operations that don't require agent speech first
- **Blocking**: Conversation waits for tool completion
- **Best For**: Real-time data fetching, quick lookups

#### post_tool_speech
- **Behavior**: Tool waits for the agent to finish speaking before executing
- **Use Case**: Operations that should occur after agent provides context
- **Blocking**: Conversation waits for both speech and tool completion
- **Best For**: Actions that need user acknowledgment through agent speech

#### async
- **Behavior**: Tool runs in the background without blocking conversation
- **Use Case**: Long-running operations that shouldn't pause the conversation
- **Blocking**: Conversation continues immediately
- **Best For**: Long-running operations, background tasks, non-critical operations

### Configuration Example
```json
{
  "execution_mode": "async",
  "response_timeout_secs": 60
}
```
```

--------------------------------

### Retrieve a Conversational AI Test Invocation from ElevenLabs API

Source: https://elevenlabs.io/docs/agents-platform/api-reference/tests/test-invocations/get

These examples demonstrate how to fetch details for a specific conversational AI test invocation from the ElevenLabs API. They cover both SDK-based approaches (TypeScript, Python) and direct HTTP GET requests using various programming languages (Go, Ruby, Java, PHP, C#, Swift). The API endpoint requires a `test_invocation_id` and, for direct HTTP calls, an `xi-api-key` header for authentication.

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

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.conversational_ai.tests.invocations.get(
    test_invocation_id="test_invocation_id"
)
```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/convai/test-invocations/test_invocation_id"

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

url = URI("https://api.elevenlabs.io/v1/convai/test-invocations/test_invocation_id")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/convai/test-invocations/test_invocation_id")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/convai/test-invocations/test_invocation_id', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/convai/test-invocations/test_invocation_id");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

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

### GET /agents/PlatformBatch Calling/Get batch call information

Source: https://elevenlabs.io/docs/api-reference/mcp/get_explorer=true

Gets batch call information.

```APIDOC
## GET /agents/PlatformBatch Calling/Get batch call information

### Description
Retrieves information about a specific batch call job.

### Method
GET

### Endpoint
/agents/PlatformBatch Calling/Get batch call information

### Parameters
#### Path Parameters
- **job_id** (string) - Required - The ID of the job.

#### Headers
- **xi-api-key** (string) - Required - Your API key.

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- **Job Details** (object) - The details of the batch call job.

#### Response Example
```json
{
  "example": ""
}
```
```

--------------------------------

### Retrieve Conversational AI Batch Call using ElevenLabs SDKs

Source: https://elevenlabs.io/docs/agents-platform/api-reference/batch-calling/get

These examples demonstrate how to fetch a specific batch call's details from the ElevenLabs Conversational AI API using the official SDKs for TypeScript and Python. They require initializing the client with the API base URL and then calling the `get` method on the `conversationalAi.batchCalls` object, passing the `batch_id` as an argument. The output will be the batch call object.

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

### Example JSON Response for Dependent Agents

Source: https://elevenlabs.io/docs/agents-platform/api-reference/knowledge-base/get-agents_explorer=true

This JSON object illustrates the structure of a successful response when retrieving dependent agents. It includes a list of `agents` with details like `id`, `name`, and `access_level`, along with pagination information such as `has_more` and `next_cursor`.

```json
{
  "agents": [
    {
      "referenced_resource_ids": [
        "doc_9f8b7c6a2d3e4f1a"
      ],
      "id": "agent_4a7d9e2b1c3f4d5e",
      "name": "Customer Support Bot",
      "type": "available",
      "created_at_unix_secs": 1685606400,
      "access_level": "editor"
    }
  ],
  "has_more": false,
  "next_cursor": "eyJwYWdlIjoxfQ=="
}
```

--------------------------------

### POST /voices/pvc/{voice_id}/samples/add

Source: https://elevenlabs.io/docs/api-reference/studio/create-podcast_explorer=true

Adds audio samples to a Professional Voice Clone for training and improvement.

```APIDOC
## POST /voices/pvc/{voice_id}/samples/add

### Description
Add audio samples to a Professional Voice Clone.

### Method
POST

### Endpoint
/voices/pvc/{voice_id}/samples/add

### Parameters
#### Path Parameters
- **voice_id** (string) - Required - PVC voice identifier

#### Request Body
- **samples** (array) - Required - Array of audio file uploads
- **labels** (object) - Optional - Sample metadata and labels

### Response
#### Success Response (200)
- **samples_added** (integer) - Number of samples added
- **total_samples** (integer) - Total samples for this voice
```

--------------------------------

### PVC Speaker Separation Status Response - JSON

Source: https://elevenlabs.io/docs/api-reference/voices/pvc/samples/get-speaker-separation-status_explorer=true

Example response from the speaker separation status endpoint containing voice_id, sample_id, and current status of the separation process. Status values include: not_started, pending, completed, or failed.

```json
{
  "voice_id": "DCwhRBWXzGAHq8TQ4Fs18",
  "sample_id": "DCwhRBWXzGAHq8TQ4Fs18",
  "status": "not_started"
}
```

--------------------------------

### GET /v1/agents/mcp-servers/{server_id}

Source: https://elevenlabs.io/docs/changelog

Get MCP server configuration. Returns tool_config_overrides, request_headers, and tool call sound settings.

```APIDOC
## GET /v1/agents/mcp-servers/{server_id}

### Description
Retrieve MCP server configuration including tool overrides, request headers, and tool call sound settings.

### Method
GET

### Endpoint
/v1/agents/mcp-servers/{server_id}

### Parameters
#### Path Parameters
- **server_id** (string) - Required - MCP server identifier

### Response
#### Success Response (200)
- **server_id** (string) - Unique MCP server identifier
- **name** (string) - Server name
- **url** (string) - Server URL
- **tool_config_overrides** (object) - Per-tool configuration customization
- **request_headers** (object) - Custom request headers
- **tool_call_sound** (string) - Tool call sound setting
- **tool_call_sound_behavior** (string) - Tool call sound behavior
- **created_at** (string) - ISO 8601 timestamp of creation
- **updated_at** (string) - ISO 8601 timestamp of last update

#### Response Example
{
  "server_id": "mcp_xyz123",
  "name": "My MCP Server",
  "url": "https://mcp.example.com",
  "tool_config_overrides": {
    "tool_1": {"timeout": 30}
  },
  "request_headers": {
    "Authorization": "Bearer token"
  },
  "tool_call_sound": "beep",
  "tool_call_sound_behavior": "play_once",
  "created_at": "2025-10-27T10:30:00Z",
  "updated_at": "2025-10-27T10:35:00Z"
}
```

--------------------------------

### Initialize Supabase Project with CLI

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/speech-to-text/batch/telegram-bot

Initialize a new Supabase project locally using the Supabase CLI. This command sets up the project structure and configuration files needed for local development.

```bash
supabase init
```

--------------------------------

### Example JSON Response for Listing MCP Servers

Source: https://elevenlabs.io/docs/agents-platform/api-reference/mcp/list_explorer=true

This JSON object illustrates a successful response from the `GET /v1/convai/mcp-servers` endpoint. It returns an array of `mcp_servers`, each containing its unique ID, detailed configuration settings (like URL, name, approval policies, transport, headers), metadata (creation time, owner), access information, and a list of dependent agents.

```json
{
  "mcp_servers": [
    {
      "id": "mcp-server-1234abcd",
      "config": {
        "url": "https://api.mcpserver.example.com/v1/tools",
        "name": "Primary MCP Server",
        "approval_policy": "require_approval_per_tool",
        "tool_approval_hashes": [
          {
            "tool_name": "weather_forecast",
            "tool_hash": "a3f5c9d8e7b6f4a1c2d3e4f56789abcd1234567890abcdef1234567890abcdef",
            "approval_policy": "requires_approval"
          }
        ],
        "transport": "SSE",
        "secret_token": {
          "secret_id": "workspace_secret_9876"
        },
        "request_headers": {
          "Authorization": "Bearer {{token}}",
          "X-Custom-Header": "custom-value"
        },
        "description": "Handles all primary tool executions for conversational AI.",
        "force_pre_tool_speech": true,
        "disable_interruptions": false,
        "tool_call_sound": "elevator2",
        "tool_call_sound_behavior": "auto",
        "execution_mode": "post_tool_speech",
        "tool_config_overrides": [
          {
            "tool_name": "weather_forecast",
            "force_pre_tool_speech": false,
            "disable_interruptions": true,
            "tool_call_sound": "typing",
            "tool_call_sound_behavior": "always",
            "execution_mode": "immediate",
            "assignments": [
              {
                "dynamic_variable": "forecast_summary",
                "value_path": "data.weather.summary",
                "source": "response"
              }
            ]
          }
        ],
        "disable_compression": false
      },
      "metadata": {
        "created_at": 1684990000,
        "owner_user_id": "user-4321dcba"
      },
      "access_info": {
        "is_creator": true,
        "creator_name": "Alice Johnson",
        "creator_email": "alice.johnson@elevenlabs.io",
        "role": "admin"
      },
      "dependent_agents": [
        {
          "referenced_resource_ids": [
            "agent-5678efgh"
          ],
          "id": "agent-1234abcd",
          "name": "WeatherBot",
          "type": "available",
          "created_at_unix_secs": 1685000000,
          "access_level": "editor"
        }
      ]
    }
  ]
}
```

--------------------------------

### Configure ElevenLabs API Headers and Parameters in Swift

Source: https://elevenlabs.io/docs/api-reference/speech-to-text/convert

Sets up HTTP headers with API key authentication and multipart form-data boundary, then defines an array of parameters for the speech-to-text request including model ID, audio file, language code, diarization settings, and webhook configuration. This establishes the foundation for the API request with all required and optional fields.

```swift
import Foundation

let headers = [
  "xi-api-key": "xi-api-key",
  "Content-Type": "multipart/form-data; boundary=---011000010111000001101001"
]
let parameters = [
  [
    "name": "model_id",
    "value": "string"
  ],
  [
    "name": "file",
    "fileName": "<file1>"
  ],
  [
    "name": "language_code",
    "value": 
  ],
  [
    "name": "tag_audio_events",
    "value": 
  ],
  [
    "name": "num_speakers",
    "value": 
  ],
  [
    "name": "timestamps_granularity",
    "value": 
  ],
  [
    "name": "diarize",
    "value": 
  ],
  [
    "name": "diarization_threshold",
    "value": 
  ],
  [
    "name": "additional_formats",
    "value": 
  ],
  [
    "name": "file_format",
    "value": 
  ],
  [
    "name": "cloud_storage_url",
    "value": 
  ],
  [
    "name": "webhook",
    "value": 
  ],
  [
    "name": "webhook_id",
    "value": 
  ],
  [
    "name": "temperature",
    "value": 
  ],
  [
    "name": "seed",
    "value": 
  ],
  [
    "name": "use_multi_channel",
    "value": 
  ],
  [
    "name": "webhook_metadata",
    "value": 
  ],
  [
    "name": "entity_detection",
    "value": 
  ],
  [
    "name": "keyterms",
    "value": 
  ]
]
```

--------------------------------

### Send Speaker Separation Request with Java Unirest

Source: https://elevenlabs.io/docs/api-reference/voices/pvc/samples/separate-speakers

This Java code illustrates how to send a POST request to the speaker separation endpoint using the Unirest HTTP client library. It specifies the API URL, adds the `xi-api-key` header, and executes the request to get the string response.

```java
HttpResponse<String> response = Unirest.post("https://api.elevenlabs.io/v1/voices/pvc/voice_id/samples/sample_id/separate-speakers")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

--------------------------------

### Retrieve Audio from History Item using ElevenLabs API

Source: https://elevenlabs.io/docs/api-reference/history/get-audio

This collection of code examples demonstrates how to fetch the audio content of a specific history item from the ElevenLabs API. It includes the OpenAPI specification for the endpoint and client implementations in TypeScript, Python, Go, Ruby, Java, PHP, C#, and Swift, typically requiring an API key for authentication.

```yaml
openapi: 3.1.1
info:
  title: Get audio from history item
  version: endpoint_history.get_audio
paths:
  /v1/history/{history_item_id}/audio:
    get:
      operationId: get-audio
      summary: Get audio from history item
      description: Returns the audio of an history item.
      tags:
        - - subpackage_history
      parameters:
        - name: history_item_id
          in: path
          description: >-
            ID of the history item to be used. You can use the [Get generated
            items](/docs/api-reference/history/list) endpoint to retrieve a list
            of history items.
          required: true
          schema:
            type: string
        - name: xi-api-key
          in: header
          required: true
          schema:
            type: string
      responses:
        '200':
          description: The audio file of the history item.
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
        '422':
          description: Validation Error
          content: {}
```

```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    await client.history.getAudio("history_item_id");
}
main();
```

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(
    base_url="https://api.elevenlabs.io"
)

client.history.get_audio(
    history_item_id="history_item_id"
)
```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/history/history_item_id/audio"

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

url = URI("https://api.elevenlabs.io/v1/history/history_item_id/audio")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["xi-api-key"] = 'xi-api-key'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/history/history_item_id/audio")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.elevenlabs.io/v1/history/history_item_id/audio', [
  'headers' => [
    'xi-api-key' => 'xi-api-key',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.elevenlabs.io/v1/history/history_item_id/audio");
var request = new RestRequest(Method.GET);
request.AddHeader("xi-api-key", "xi-api-key");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["xi-api-key": "xi-api-key"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.elevenlabs.io/v1/history/history_item_id/audio")! as URL,
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

### GET /dubbing

Source: https://elevenlabs.io/docs/api-reference/studio/create-podcast_explorer=true

Lists all dubbing projects with their current status and metadata.

```APIDOC
## GET /dubbing

### Description
List all dubbing projects.

### Method
GET

### Endpoint
/dubbing

### Parameters
#### Query Parameters
- **page** (integer) - Optional - Pagination page number
- **limit** (integer) - Optional - Items per page
- **status** (string) - Optional - Filter by status

### Response
#### Success Response (200)
- **dubs** (array) - Array of dubbing projects
  - **dub_id** (string) - Dubbing project identifier
  - **title** (string) - Project title
  - **status** (string) - Current status
  - **created_at** (timestamp) - Creation timestamp
```

--------------------------------

### Define Tool Usage in System Prompt for Order Status

Source: https://elevenlabs.io/docs/agents-platform/customization/tools/server-tools

This `plaintext` example demonstrates how to instruct an AI assistant to use a specific tool, `check_order_status`, for user inquiries related to order status. It provides clear examples of user phrases that should trigger this tool, improving the assistant's tool-calling accuracy.

```plaintext
Use `check_order_status` when the user inquires about the status of their order, such as 'Where is my order?' or 'Has my order shipped yet?'.
```

--------------------------------

### Compose Music via HTTP POST Request - Go

Source: https://elevenlabs.io/docs/api-reference/music/compose

Make a POST request to the ElevenLabs music composition endpoint using Go's net/http package. Requires setting the xi-api-key header and Content-Type header with JSON payload. Reads and prints the response body containing the generated music.

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.elevenlabs.io/v1/music"

	payload := strings.NewReader("{\n  \"prompt\": \"A relaxing acoustic guitar melody with soft piano accompaniment, evoking a peaceful sunset on the beach.\",\n  \"music_length_ms\": 180000,\n  \"model_id\": \"music_v1\",\n  \"force_instrumental\": true,\n  \"respect_sections_durations\": true,\n  \"store_for_inpainting\": false,\n  \"sign_with_c2pa\": false\n}")

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

### Install ElevenLabs and Dotenv SDKs (Python)

Source: https://elevenlabs.io/docs/developer-guides/cookbooks/speech-to-text/server-side-streaming

Install the ElevenLabs SDK for real-time speech-to-text functionality and the `python-dotenv` library to load API keys from environment variables. These are necessary dependencies for interacting with the ElevenLabs API and managing credentials securely.

```python
pip install elevenlabs
pip install python-dotenv
```

--------------------------------

### SDK Implementation - TypeScript

Source: https://elevenlabs.io/docs/api-reference/knowledge-base/create-from-file

Upload a document to the Knowledge Base using the ElevenLabs TypeScript SDK. This example demonstrates how to use the official SDK client to create a document from a file.

```APIDOC
## TypeScript SDK - Create Document from File

### Description
Use the ElevenLabs TypeScript SDK to upload a document to your Conversational AI Knowledge Base.

### Installation
```
npm install @elevenlabs/elevenlabs-js
```

### Implementation
```typescript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    
    await client.conversationalAi.knowledgeBase.documents.createFromFile({
        // file parameter with your document
    });
}

main();
```

### Parameters
- **environment** (string) - Optional - API base URL (defaults to production)
- **file** (File) - Required - The document file to upload

### Response
Returns a promise that resolves with the uploaded document details including document ID and metadata.
```

--------------------------------

### POST /studio/projects - Create Studio Project

Source: https://elevenlabs.io/docs/api-reference/studio/add-project

Creates a new Studio project with optional metadata, audio quality settings, and audiobook compliance features. Supports multipart form data submission with comprehensive project configuration including title, author, genres, language, and audio processing options.

```APIDOC
## POST /studio/projects

### Description
Creates a new Studio project with comprehensive metadata and audio configuration options. Supports audiobook-compliant audio processing, pronunciation dictionaries, and optional callback notifications.

### Method
POST

### Endpoint
/studio/projects

### Request Body (Multipart Form Data)

#### Project Metadata
- **title** (string, nullable) - Optional - An optional name of the Studio project, added as metadata to the mp3 file on Studio project or chapter download.
- **author** (string, nullable) - Optional - An optional name of the author of the Studio project, added as metadata to the mp3 file on Studio project or chapter download.
- **description** (string, nullable) - Optional - An optional description of the Studio project.
- **genres** (array of strings) - Optional - An optional list of genres associated with the Studio project.
- **target_audience** (string or null) - Optional - An optional target audience of the Studio project.
- **language** (string, nullable) - Optional - An optional language of the Studio project. Two-letter language code (ISO 639-1).
- **content_type** (string, nullable) - Optional - An optional content type of the Studio project.
- **original_publication_date** (string, nullable) - Optional - An optional original publication date of the Studio project, in the format YYYY-MM-DD or YYYY.
- **isbn_number** (string, nullable) - Optional - An optional ISBN number of the Studio project, added as metadata to the mp3 file on Studio project or chapter download.
- **mature_content** (boolean, nullable) - Optional - Default: false - An optional specification of whether this Studio project contains mature content.

#### Audio Quality and Processing
- **acx_volume_normalization** (boolean) - Optional - Default: false - [Deprecated] When the Studio project is downloaded, should the returned audio have postprocessing to make it compliant with audiobook normalized volume requirements.
- **volume_normalization** (boolean) - Optional - Default: false - When the Studio project is downloaded, should the returned audio have postprocessing to make it compliant with audiobook normalized volume requirements.

#### Advanced Features
- **pronunciation_dictionary_locators** (array of JSON strings) - Optional - A list of pronunciation dictionary locators (pronunciation_dictionary_id, version_id) encoded as JSON strings for pronunciation dictionaries to be applied to the text. Multiple dictionaries can be specified using multiple form entries.
- **callback_url** (string, nullable) - Optional - An optional callback URL for project completion notifications.

### Request Example
```
curl -X POST https://api.elevenlabs.io/studio/projects \
  -H "Content-Type: multipart/form-data" \
  -F "title=My Audiobook" \
  -F "author=John Doe" \
  -F "description=A professional audiobook project" \
  -F "genres=Fiction" \
  -F "genres=Drama" \
  -F "language=en" \
  -F "isbn_number=978-3-16-148410-0" \
  -F "volume_normalization=true" \
  -F "pronunciation_dictionary_locators={\"pronunciation_dictionary_id\":\"Vmd4Zor6fplcA7WrINey\",\"version_id\":\"hRPaxjlTdR7wFMhV4w0b\"}" \
  -F "callback_url=https://example.com/callback"
```

### Response

#### Success Response (201 Created)
- **project_id** (string) - The unique identifier of the created Studio project.
- **title** (string) - The title of the Studio project.
- **author** (string) - The author of the Studio project.
- **status** (string) - The current status of the Studio project.

#### Response Example
```json
{
  "project_id": "proj_abc123xyz",
  "title": "My Audiobook",
  "author": "John Doe",
  "description": "A professional audiobook project",
  "genres": ["Fiction", "Drama"],
  "language": "en",
  "isbn_number": "978-3-16-148410-0",
  "volume_normalization": true,
  "status": "created",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Audio Quality Options
- **Ultra Lossless** - 705.6kbps with 44.1kHz sample rate and highest improvements in a fully lossless format.

### Notes
- The `acx_volume_normalization` parameter is deprecated; use `volume_normalization` instead.
- Multiple pronunciation dictionaries can be applied by specifying multiple `pronunciation_dictionary_locators` form entries.
- All metadata fields are optional and will be added to the mp3 file metadata on download.
- Language codes should follow ISO 639-1 standard (e.g., 'en' for English, 'es' for Spanish).
```

--------------------------------

### Search User Groups with Java Unirest HTTP Client

Source: https://elevenlabs.io/docs/api-reference/workspace/groups/search

This Java example uses the Unirest library to make a GET request to the ElevenLabs API for searching user groups. It sets the `xi-api-key` header and retrieves the response as a string. Unirest simplifies HTTP request handling in Java.

```java
HttpResponse<String> response = Unirest.get("https://api.elevenlabs.io/v1/workspace/groups/search?name=name")
  .header("xi-api-key", "xi-api-key")
  .asString();
```

--------------------------------

### GET /agents/PlatformWorkspaceSettings/Get settings

Source: https://elevenlabs.io/docs/api-reference/mcp/get_explorer=true

Retrieves workspace settings.

```APIDOC
## GET /agents/PlatformWorkspaceSettings/Get settings

### Description
Retrieves the settings for a specific workspace.

### Method
GET

### Endpoint
/agents/PlatformWorkspaceSettings/Get settings

### Parameters
#### Path Parameters
- **workspace_id** (string) - Required - The ID of the workspace.

#### Headers
- **xi-api-key** (string) - Required - Your API key.

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- **Settings** (object) - The workspace settings.

#### Response Example
```json
{
  "example": ""
}
```
```

--------------------------------

### Create Voice Previews with ElevenLabs Ruby HTTP Client

Source: https://elevenlabs.io/docs/api-reference/legacy/voices/create-previews

Uses Ruby's Net::HTTP library to make a POST request to the ElevenLabs create-previews endpoint. Configures SSL, sets authentication and content-type headers, and sends the voice description JSON payload.

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.elevenlabs.io/v1/text-to-voice/create-previews")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["xi-api-key"] = 'xi-api-key'
request["Content-Type"] = 'application/json'
request.body = "{\n  \"voice_description\": \"A sassy squeaky mouse with a playful and energetic tone, perfect for animated characters or children's stories.\"\n}"

response = http.request(request)
puts response.read_body
```

--------------------------------

### GET /agents/PlatformWhatsAppAccounts/List WhatsApp accounts

Source: https://elevenlabs.io/docs/api-reference/mcp/get_explorer=true

Lists WhatsApp accounts.

```APIDOC
## GET /agents/PlatformWhatsAppAccounts/List WhatsApp accounts

### Description
Lists all WhatsApp accounts.

### Method
GET

### Endpoint
/agents/PlatformWhatsAppAccounts/List WhatsApp accounts

### Parameters
#### Headers
- **xi-api-key** (string) - Required - Your API key.

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- **Account List** (array) - A list of WhatsApp accounts.

#### Response Example
```json
{
  "example": ""
}
```
```

--------------------------------

### Example JSON Response for Live Conversation Count

Source: https://elevenlabs.io/docs/api-reference/analytics/get_explorer=true

This JSON snippet illustrates the expected successful response body when querying the live conversation count endpoint. It contains a single field, `count`, which represents the total number of active ongoing conversations.

```json
{
  "count": 42
}
```

--------------------------------

### GET /api/v1/project-snapshot

Source: https://elevenlabs.io/docs/api-reference/knowledge-base/create-from-url_explorer=true

Retrieves a snapshot of the current project's status and details.

```APIDOC
## GET /api/v1/project-snapshot

### Description
Retrieves a snapshot of the current project's status and details.

### Method
GET

### Endpoint
/api/v1/project-snapshot

### Parameters
#### Path Parameters

#### Query Parameters

#### Request Body

### Request Example
{}

### Response
#### Success Response (200)
- **status** (string) - The status of the project snapshot.

#### Response Example
{
  "status": "success",
  "data": {
    "project_id": "proj_abc123",
    "name": "My Awesome Project",
    "created_at": "2023-10-27T10:00:00Z"
  }
}
```

--------------------------------

### GET /v1/studio/projects/{project_id}

Source: https://elevenlabs.io/docs/changelog

Retrieve studio project details with enhanced asset management. Projects now include image assets and base voices information.

```APIDOC
## GET /v1/studio/projects/{project_id}

### Description
Retrieve detailed information about a studio project including assets and voices.

### Method
GET

### Endpoint
/v1/studio/projects/{project_id}

### Parameters
#### Path Parameters
- **project_id** (string) - Required - The unique identifier of the project

### Response
#### Success Response (200)
- **project_id** (string) - Project identifier
- **name** (string) - Project name
- **assets** (array) - Array of project assets (includes ProjectImageResponseModel)
- **base_voices** (array) - Array of base voices used in project
- **chapters** (array) - Project chapters with voice_ids

#### Response Example
{
  "project_id": "proj_123",
  "name": "My Project",
  "assets": [
    {
      "asset_id": "img_123",
      "type": "image",
      "url": "https://example.com/image.jpg"
    }
  ],
  "base_voices": ["21m00Tcm4TlvDq8ikWAM"],
  "chapters": [
    {
      "chapter_id": "ch_1",
      "title": "Chapter 1",
      "voice_ids": ["21m00Tcm4TlvDq8ikWAM"]
    }
  ]
}
```

--------------------------------

### Perform Forced Alignment with Audio and Text - TypeScript

Source: https://elevenlabs.io/docs/developers/guides/cookbooks/forced-alignment

Create a forced alignment request using TypeScript by fetching an audio file and providing text to align. The API returns a transcript with exact timestamps for each word. Requires ElevenLabs API key from environment variables.

```typescript
// example.ts
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import "dotenv/config";
const elevenlabs = new ElevenLabsClient();

const response = await fetch(
    "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3"
);
const audioBlob = new Blob([await response.arrayBuffer()], { type: "audio/mp3" });

const transcript = await elevenlabs.forcedAlignment.create({
    file: audioBlob,
    text: "With a soft and whispery American accent, I'm the ideal choice for creating ASMR content, meditative guides, or adding an intimate feel to your narrative projects."
})

console.log(transcript);
```