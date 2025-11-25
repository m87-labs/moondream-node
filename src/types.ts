/**
 * Base interface for encoded images
 */
export interface Base64EncodedImage {
  imageUrl: string;
}

/**
 * Length options for caption generation
 */
export type Length = "normal" | "short" | "long";

/**
 * Settings for controlling the model's generation behavior
 */
export interface SamplingSettings {
  maxTokens?: number;
}

/**
 * Base request interface with common properties
 */
export interface BaseRequest {
  variant?: string;
  settings?: SamplingSettings;
}

/**
 * Request structure for image caption requests
 */
export interface CaptionRequest extends BaseRequest {
  image: Buffer | Base64EncodedImage;
  length?: Length;
  stream?: boolean;
}
/**
 * Response structure for image caption requests
 */
export interface CaptionOutput {
  caption: string | AsyncGenerator<string, void, unknown>;
}

/**
 * Request structure for image query requests
 */
export interface QueryRequest extends BaseRequest {
  image?: Buffer | Base64EncodedImage;
  question: string;
  reasoning?: boolean;
  stream?: boolean;
}
/**
 * Reasoning grounding structure
 */
export interface ReasoningGrounding {
  start_idx: number;
  end_idx: number;
  points: [number, number][];
}

/**
 * Reasoning structure
 */
export interface Reasoning {
  text: string;
  grounding: ReasoningGrounding[];
}

/**
 * Response structure for image query requests
 */
export interface QueryOutput {
  answer: string | AsyncGenerator<string, void, unknown>;
  reasoning?: Reasoning;
}

/**
 * Request structure for object detection requests
 */
export interface DetectRequest extends BaseRequest {
  image: Buffer | Base64EncodedImage;
  object: string;
}
/**
 * Response structure for object detection requests
 */
export interface DetectOutput {
  objects: DetectedObject[];
}

/**
 * Object detection result
 */
export interface DetectedObject {
  x_min: number;
  y_min: number;
  x_max: number;
  y_max: number;
}

/**
 * Response structure for object detection requests
 */
export interface DetectOutput {
  objects: DetectedObject[];
}

/**
 * Error response from the API
 */
export interface ApiError {
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

/**
 * Configuration options for the client
 */
export interface ClientConfig {
  apiKey: string;
  endpoint?: string;
  timeout?: number;
  retries?: number;
}

/**
 * API response for streaming requests
 */
export interface StreamResponse {
  chunk?: string;
  completed?: boolean;
  error?: string;
}

/**
 * Options for image processing
 */
export interface ImageProcessingOptions {
  maxSize?: number;
  quality?: number;
  format?: "jpeg" | "png" | "gif";
}

/**
 * Common response type for all API endpoints
 */
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp?: string;
  requestId?: string;
};

/**
 * Pointing request structure
 */
export interface PointRequest extends BaseRequest {
  image: Buffer | Base64EncodedImage;
  object: string;
}
/**
 * Point coordinates for object location
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Response structure for point requests
 */
export interface PointOutput {
  points: Point[];
}

/**
 * Spatial reference for segmentation - either a point [x, y] or bbox [x1, y1, x2, y2]
 * Values are normalized to [0, 1]
 */
export type SpatialRef = [number, number] | [number, number, number, number];

/**
 * Request structure for segmentation requests
 */
export interface SegmentRequest extends BaseRequest {
  image: Buffer | Base64EncodedImage;
  object: string;
  spatialRefs?: SpatialRef[];
  stream?: boolean;
}

/**
 * Bounding box for segmentation result
 */
export interface SegmentBbox {
  x_min: number;
  y_min: number;
  x_max: number;
  y_max: number;
}

/**
 * Response structure for non-streaming segmentation requests
 */
export interface SegmentOutput {
  path: string;
  bbox?: SegmentBbox;
}

/**
 * Streaming update for segmentation
 */
export interface SegmentStreamChunk {
  bbox?: SegmentBbox;
  chunk?: string;
  path?: string;
  completed?: boolean;
}

/**
 * Response structure for streaming segmentation requests
 */
export interface SegmentStreamOutput {
  stream: AsyncGenerator<SegmentStreamChunk, void, unknown>;
}
