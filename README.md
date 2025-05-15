# Moondream NodeJS Client Library

Official NodeJS client library for Moondream, a fast multi-function VLM. This client can target either the [Moondream Cloud](https://moondream.ai/cloud) or a [Moondream Station](https://moondream.ai/station). Both are free, though the cloud has a limits on the free tier.

## Capabilities
Moondream goes beyond the typical VLM "query" ability to include more visual functions. These include:

- **caption**: Generate descriptive captions for images
- **query**: Ask questions about image content
- **detect**: Find bounding boxes around objects in images
- **point**: Identify the center location of specified objects in images

You can try this out anytime on [Moondream's playground](https://moondream.ai/playground).

## Installation

Install the package using npm:

```bash
npm install moondream
```

## Quick Start

Choose how you want to run it:

1. **Moondream Cloud**: (with 5,000 free requests/day): get a free API key from [the Moondream cloud console](https://moondream.ai/c/cloud/api-keys).
2. **Moondream Server**: Run it locally by installing and running [the Moondream server](https://moondream.ai/moondream-server).

Once you've done at least *one* of these, try running this code:

```javascript
import { vl } from "moondream";
import fs from "fs";

// For Moondream Cloud
const model = new vl({
  apiKey: "<your-api-key>",
});

// ...or a local Moondream Server
const model = new vl({
  endpoint: "http://localhost:2020/v1",
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

## API Reference

### Constructor

```javascript
// Cloud inference
const model = new vl({
  apiKey: "your-api-key",
});

// Local inference
const model = new vl({
  endpoint: "http://localhost:2020/v1",
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
