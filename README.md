# Moondream NodeJS Client Library

Official Python client library for Moondream, the world's fastest multi-function VLM. This client can target either (the Moondream Cloud)[https://moondream.ai/cloud] or a (Moondream Server)[https://moondream.ai/server]. Both are free, though the cloud has a limits on the free tier.

## Features

- **caption**: Generate descriptive captions for images
- **query**: Ask questions about image content
- **detect**: Find bounding boxes around objects in images
- **point**: Identify the center location of specified objects in images

## Installation

Install the package using npm:

```bash
npm install moondream
```

Or using yarn:

```bash
yarn add moondream
```

## Quick Start

- Get your free API key from [console.moondream.ai](https://console.moondream.ai)

### Cloud

- Get your free API key from [the Moondream cloud console](https://moondream.ai/c/cloud/api-keys). The free tier currently supports 5,000 requests per day

```javascript
import { vl } from "moondream";
import fs from "fs";

// Initialize the client
const model = new vl({
  apiKey: "your-api-key",
});

// Read an image file
const image = fs.readFileSync("path/to/image.jpg");

// Basic usage examples
async function main() {
  // Generate a caption for the image
  const caption = await model.caption({
    image: image,
    length: "normal",
    stream: false
  });
  console.log("Caption:", caption);

  // Ask a question about the image
  const answer = await model.query({
    image: image,
    question: "What's in this image?",
    stream: false
  });
  console.log("Answer:", answer);

  // Stream the response
  const stream = await model.caption({
    image: image,
    length: "normal",
    stream: true
  });
  for await (const chunk of stream.caption) {
    process.stdout.write(chunk);
  }
}

main();
```

### Moondream Server (to run locally)

- Install and run [the Moondream server](https://mooondream.ai/moondream-server)
- Run the local server:
  ```bash
  ./moondream-server
- Set the `endpoint` parameter to the URL of the local server (the local server default is `http://localhost:2020`)

```javascript
const model = new vl({
  endpoint: "http://localhost:2020",
});

const image = fs.readFileSync("path/to/image.jpg");

// Basic usage examples
async function main() {
  // Generate a caption for the image
  const caption = await model.caption({
    image: image,
    length: "normal",
    stream: false
  });
  console.log("Caption:", caption);

  // Ask a question about the image
  const answer = await model.query({
    image: image,
    question: "What's in this image?",
    stream: false
  });
  console.log("Answer:", answer);

  // Stream the response
  const stream = await model.caption({
    image: image,
    length: "normal",
    stream: true
  });
  for await (const chunk of stream.caption) {
    process.stdout.write(chunk);
  }
}

main();
```

## API Reference

### Constructor

```javascript
// Cloud inference
const model = new vl({
  apiKey: "your-api-key",
});

// Local inference
const model = new vl({
  endpoint: "http://localhost:2020",
});
```

### Methods

#### caption({ image: Buffer | Base64EncodedImage, length?: string, stream?: boolean })

Generate a caption for an image.

```javascript
const result = await model.caption({
  image: image,
  length: "normal",
  stream: false
});

// Generate a caption with streaming (default: False)
const stream = await model.caption({
  image: image,
  length: "normal",
  stream: true
});
```

#### query({ image: Buffer | Base64EncodedImage, question: string, stream?: boolean })

Ask a question about an image.

```javascript
const result = await model.query({
  image: image,
  question: "What's in this image?",
  stream: false
});

// Ask a question with streaming (default: False)
const stream = await model.query({
  image: image,
  question: "What's in this image?",
  stream: true
});
```

#### detect({ image: Buffer | Base64EncodedImage, object: string })

Detect specific objects in an image.

```javascript
const result = await model.detect({
  image: image,
  object: "car"
});
```

#### point({ image: Buffer | Base64EncodedImage, object: string })

Get coordinates of specific objects in an image.

```javascript
const result = await model.point({
  image: image,
  object: "person"
});
```

#### encodeImage( image: Buffer | Base64EncodedImage ): Promise<Base64EncodedImage>

Encodes an image provided as a `Buffer` or a `Base64EncodedImage` into a Base64-encoded JPEG. If the image is already in Base64 format, the method returns it unchanged.

```javascript
const encodedImage = await model.encodeImage(imageBuffer);
```


### Image Types

- Buffer: Raw binary image data
- Base64EncodedImage: An object in the format `{ imageUrl: string }`, where `imageUrl` contains a Base64-encoded image

### Response Types

- CaptionOutput: `{ caption: string | AsyncGenerator }`
- QueryOutput: `{ answer: string | AsyncGenerator }`
- DetectOutput: `{ objects: Array<Object> }`
- PointOutput: `{ points: Array<Point> }`
- Region: Bounding box with coordinates (`x_min`, `y_min`, `x_max`, `y_max`)
- Point: Coordinates (`x`, `y`) indicating the object center

## Links

- [Website](https://moondream.ai/)
- [Try it out on the free playground](https://moondream.ai/playground)
- [GitHub](https://github.com/vikhyat/moondream)
