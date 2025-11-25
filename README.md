# Moondream Node.js Client Library

Official Node.js client library for Moondream, a fast multi-function VLM. This client can target either [Moondream Cloud](https://moondream.ai/cloud) or [Moondream Station](https://moondream.ai/station).

## Capabilities

Moondream goes beyond the typical VLM "query" ability to include more visual functions:

| Method | Description |
|--------|-------------|
| `caption` | Generate descriptive captions for images |
| `query` | Ask questions about image content |
| `detect` | Find bounding boxes around objects in images |
| `point` | Identify the center location of specified objects |
| `segment` | Generate an SVG path segmentation mask for objects |

Try it out on [Moondream's playground](https://moondream.ai/playground).

## Installation

```bash
npm install moondream
```

## Quick Start

Choose how you want to run Moondream:

1. **Moondream Cloud** — Get an API key from the [cloud console](https://moondream.ai/c/cloud/api-keys)
2. **Moondream Station** — Run locally by installing [Moondream Station](https://moondream.ai/station)

```javascript
import { vl } from 'moondream';
import fs from 'fs';

// Initialize with Moondream Cloud
const model = new vl({ apiKey: '<your-api-key>' });

// Or initialize with a local Moondream Station
const model = new vl({ endpoint: 'http://localhost:2020/v1' });

// Load an image
const image = fs.readFileSync('path/to/image.jpg');

// Generate a caption
const caption = await model.caption({ image });
console.log('Caption:', caption.caption);

// Ask a question
const answer = await model.query({ image, question: "What's in this image?" });
console.log('Answer:', answer.answer);

// Stream the response
const stream = await model.caption({ image, stream: true });
for await (const chunk of stream.caption) {
  process.stdout.write(chunk);
}
```

## API Reference

### Constructor

```javascript
const model = new vl({ apiKey: '<your-api-key>' });           // Cloud
const model = new vl({ endpoint: 'http://localhost:2020/v1' }); // Local
```

### Methods

#### `caption({ image, length?, stream? })`

Generate a caption for an image.

**Parameters:**
- `image` — `Buffer` or `Base64EncodedImage`
- `length` — `"normal"`, `"short"`, or `"long"` (default: `"normal"`)
- `stream` — `boolean` (default: `false`)

**Returns:** `CaptionOutput` — `{ caption: string | AsyncGenerator }`

```javascript
const result = await model.caption({ image, length: 'short' });
console.log(result.caption);

// With streaming
const stream = await model.caption({ image, stream: true });
for await (const chunk of stream.caption) {
  process.stdout.write(chunk);
}
```

---

#### `query({ image?, question, stream? })`

Ask a question about an image.

**Parameters:**
- `image` — `Buffer` or `Base64EncodedImage` (optional)
- `question` — `string`
- `stream` — `boolean` (default: `false`)

**Returns:** `QueryOutput` — `{ answer: string | AsyncGenerator }`

```javascript
const result = await model.query({ image, question: "What's in this image?" });
console.log(result.answer);

// With streaming
const stream = await model.query({ image, question: "Describe this", stream: true });
for await (const chunk of stream.answer) {
  process.stdout.write(chunk);
}
```

---

#### `detect({ image, object })`

Detect specific objects in an image.

**Parameters:**
- `image` — `Buffer` or `Base64EncodedImage`
- `object` — `string`

**Returns:** `DetectOutput` — `{ objects: DetectedObject[] }`

```javascript
const result = await model.detect({ image, object: 'car' });
console.log(result.objects);
```

---

#### `point({ image, object })`

Get coordinates of specific objects in an image.

**Parameters:**
- `image` — `Buffer` or `Base64EncodedImage`
- `object` — `string`

**Returns:** `PointOutput` — `{ points: Point[] }`

```javascript
const result = await model.point({ image, object: 'person' });
console.log(result.points);
```

---

#### `segment({ image, object, spatialRefs?, stream? })`

Segment an object from an image and return an SVG path.

**Parameters:**
- `image` — `Buffer` or `Base64EncodedImage`
- `object` — `string`
- `spatialRefs` — `Array<[x, y] | [x1, y1, x2, y2]>` — optional spatial hints (normalized 0-1)
- `stream` — `boolean` (default: `false`)

**Returns:**
- Non-streaming: `SegmentOutput` — `{ path: string, bbox?: SegmentBbox }`
- Streaming: `SegmentStreamOutput` — `{ stream: AsyncGenerator<SegmentStreamChunk> }`

```javascript
const result = await model.segment({ image, object: 'cat' });
console.log(result.path);  // SVG path string
console.log(result.bbox);  // { x_min, y_min, x_max, y_max }

// With spatial hint (point)
const result = await model.segment({ image, object: 'cat', spatialRefs: [[0.5, 0.5]] });

// With streaming
const stream = await model.segment({ image, object: 'cat', stream: true });
for await (const update of stream.stream) {
  if (update.bbox && !update.completed) {
    console.log('Bbox:', update.bbox);  // Available immediately
  }
  if (update.chunk) {
    process.stdout.write(update.chunk);  // Coarse path chunks
  }
  if (update.completed) {
    console.log('Final path:', update.path);  // Refined path
  }
}
```

### Types

| Type | Description |
|------|-------------|
| `Buffer` | Raw binary image data |
| `Base64EncodedImage` | `{ imageUrl: string }` with base64-encoded image |
| `DetectedObject` | Bounding box with `x_min`, `y_min`, `x_max`, `y_max` |
| `Point` | Coordinates with `x`, `y` indicating object center |
| `SegmentBbox` | Bounding box with `x_min`, `y_min`, `x_max`, `y_max` |
| `SpatialRef` | `[x, y]` point or `[x1, y1, x2, y2]` bbox, normalized to [0, 1] |

## Links

- [Website](https://moondream.ai/)
- [Playground](https://moondream.ai/playground)
- [GitHub](https://github.com/vikhyat/moondream)
