import { vl, MoondreamVLConfig } from '../moondream';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { Base64EncodedImage, CaptionRequest, DetectRequest, PointRequest, QueryRequest } from '../types';

dotenv.config();

const apiKey = process.env.MOONDREAM_API_KEY;
if (!apiKey) {
    throw new Error('MOONDREAM_API_KEY environment variable is required');
}

describe('MoondreamClient Integration Tests', () => {
    let localClient: vl;
    let cloudClient: vl;
    let imageBuffer: Base64EncodedImage;

    beforeAll(async () => {
        // Create two clients with different apiURLs: one for localhost and one for cloud
        localClient = new vl({apiKey: apiKey, apiUrl: "http://localhost:8000"});
        cloudClient = new vl({apiKey: apiKey});
        // Load test image and convert to base64
        const rawBuffer = await fs.readFile(path.join(__dirname, '../../assets/how-to-be-a-people-person-1662995088.jpg'));
        imageBuffer = {
            imageUrl: `data:image/jpeg;base64,${rawBuffer.toString('base64')}`
        };
    });

    // Helper for handling streaming caption responses
    async function getCaptionResult(client: vl, request: CaptionRequest): Promise<string> {
        const result = await client.caption(request);
        if (typeof result.caption === 'string') {
            return result.caption;
        } else {
            const chunks: string[] = [];
            for await (const chunk of result.caption) {
                chunks.push(chunk);
            }
            return chunks.join('');
        }
    }

    // Helper for handling streaming query responses
    async function getQueryResult(client: vl, request: QueryRequest): Promise<string> {
        const result = await client.query(request);
        if (typeof result.answer === 'string') {
            return result.answer;
        } else {
            const chunks: string[] = [];
            for await (const chunk of result.answer) {
                chunks.push(chunk);
            }
            return chunks.join('');
        }
    }

    describe('caption', () => {
        it('should get a caption for a real image (local)', async () => {
            const request: CaptionRequest = {
                image: imageBuffer,
                length: 'normal',
                stream: false
            };
            const result = await localClient.caption(request);
            expect(result.caption).toBeDefined();
            expect(typeof result.caption).toBe('string');
            console.log('Local Caption:', result.caption);
        }, 100000);

        it('should get a caption for a real image (cloud)', async () => {
            const request: CaptionRequest = {
                image: imageBuffer,
                length: 'normal',
                stream: false
            };
            const result = await cloudClient.caption(request);
            expect(result.caption).toBeDefined();
            expect(typeof result.caption).toBe('string');
            console.log('Cloud Caption:', result.caption);
        }, 100000);

        it('should have matching captions for local and cloud', async () => {
            const request: CaptionRequest = {
                image: imageBuffer,
                length: 'normal',
                stream: false
            };
            const localResult = await localClient.caption(request);
            const cloudResult = await cloudClient.caption(request);
            expect(cloudResult.caption).toEqual(localResult.caption);
        }, 100000);

        it('should stream captions for a real image (local)', async () => {
            const request: CaptionRequest = {
                image: imageBuffer,
                length: 'short',
                stream: true
            };
            const result = await localClient.caption(request);
            if (typeof result.caption === 'string') {
                expect(result.caption).toBeTruthy();
                console.log('Local Caption (non-streamed):', result.caption);
            } else {
                const chunks: string[] = [];
                for await (const chunk of result.caption) {
                    chunks.push(chunk);
                }
                const finalCaption = chunks.join('');
                expect(finalCaption).toBeTruthy();
                expect(chunks.length).toBeGreaterThan(0);
                console.log('Local Streamed caption:', finalCaption);
            }
        }, 100000);

        it('should stream captions for a real image (cloud)', async () => {
            const request: CaptionRequest = {
                image: imageBuffer,
                length: 'short',
                stream: true
            };
            const result = await cloudClient.caption(request);
            if (typeof result.caption === 'string') {
                expect(result.caption).toBeTruthy();
                console.log('Cloud Caption (non-streamed):', result.caption);
            } else {
                const chunks: string[] = [];
                for await (const chunk of result.caption) {
                    chunks.push(chunk);
                }
                const finalCaption = chunks.join('');
                expect(finalCaption).toBeTruthy();
                expect(chunks.length).toBeGreaterThan(0);
                console.log('Cloud Streamed caption:', finalCaption);
            }
        }, 100000);

        it('should have matching streamed captions for local and cloud', async () => {
            const request: CaptionRequest = {
                image: imageBuffer,
                length: 'short',
                stream: true
            };
            const localCaption = await getCaptionResult(localClient, request);
            const cloudCaption = await getCaptionResult(cloudClient, request);
            expect(cloudCaption).toEqual(localCaption);
        }, 100000);
    });

    describe('caption-no-stream', () => {
        it('should get a caption for a real image (local)', async () => {
            const request: CaptionRequest = {
                image: imageBuffer,
                length: 'short',
                stream: false
            };
            const result = await localClient.caption(request);
            expect(result.caption).toBeDefined();
            expect(typeof result.caption).toBe('string');
            console.log('Local Caption:', result.caption);
            expect((result.caption as string).length).toBeGreaterThan(0);
        }, 100000);

        it('should get a caption for a real image (cloud)', async () => {
            const request: CaptionRequest = {
                image: imageBuffer,
                length: 'short',
                stream: false
            };
            const result = await cloudClient.caption(request);
            expect(result.caption).toBeDefined();
            expect(typeof result.caption).toBe('string');
            console.log('Cloud Caption:', result.caption);
            expect((result.caption as string).length).toBeGreaterThan(0);
        }, 100000);

        it('should have matching captions for local and cloud (no stream)', async () => {
            const request: CaptionRequest = {
                image: imageBuffer,
                length: 'short',
                stream: false
            };
            const localResult = await localClient.caption(request);
            const cloudResult = await cloudClient.caption(request);
            expect(cloudResult.caption).toEqual(localResult.caption);
        }, 100000);
    });

    describe('query', () => {
        it('should answer questions about a real image (local)', async () => {
            const question = "What colors are present in this image?";
            const request: QueryRequest = {
                image: imageBuffer,
                question: question,
                stream: false
            };
            const result = await localClient.query(request);
            expect(result.answer).toBeDefined();
            expect(typeof result.answer).toBe('string');
            console.log('Local Question:', question);
            console.log('Local Answer:', result.answer);
        }, 100000);

        it('should answer questions about a real image (cloud)', async () => {
            const question = "What colors are present in this image?";
            const request: QueryRequest = {
                image: imageBuffer,
                question: question,
                stream: false
            };
            const result = await cloudClient.query(request);
            expect(result.answer).toBeDefined();
            expect(typeof result.answer).toBe('string');
            console.log('Cloud Question:', question);
            console.log('Cloud Answer:', result.answer);
        }, 100000);

        it('should have matching query answers for local and cloud', async () => {
            const question = "What colors are present in this image?";
            const request: QueryRequest = {
                image: imageBuffer,
                question: question,
                stream: false
            };
            const localResult = await localClient.query(request);
            const cloudResult = await cloudClient.query(request);
            expect(cloudResult.answer).toEqual(localResult.answer);
        }, 100000);

        it('should stream answers about a real image (local)', async () => {
            const question = "What is the character doing?";
            const request: QueryRequest = {
                image: imageBuffer,
                question: question,
                stream: true
            };
            const result = await localClient.query(request);
            if (typeof result.answer === 'string') {
                expect(result.answer).toBeTruthy();
                console.log('Local Question:', question);
                console.log('Local Answer (non-streamed):', result.answer);
            } else {
                const chunks: string[] = [];
                for await (const chunk of result.answer) {
                    chunks.push(chunk);
                }
                const finalAnswer = chunks.join('');
                expect(finalAnswer).toBeTruthy();
                expect(chunks.length).toBeGreaterThan(0);
                console.log('Local Question:', question);
                console.log('Local Streamed answer:', finalAnswer);
            }
        }, 100000);

        it('should stream answers about a real image (cloud)', async () => {
            const question = "What is the character doing?";
            const request: QueryRequest = {
                image: imageBuffer,
                question: question,
                stream: true
            };
            const result = await cloudClient.query(request);
            if (typeof result.answer === 'string') {
                expect(result.answer).toBeTruthy();
                console.log('Cloud Question:', question);
                console.log('Cloud Answer (non-streamed):', result.answer);
            } else {
                const chunks: string[] = [];
                for await (const chunk of result.answer) {
                    chunks.push(chunk);
                }
                const finalAnswer = chunks.join('');
                expect(finalAnswer).toBeTruthy();
                expect(chunks.length).toBeGreaterThan(0);
                console.log('Cloud Question:', question);
                console.log('Cloud Streamed answer:', finalAnswer);
            }
        }, 100000);

        it('should have matching streamed query answers for local and cloud', async () => {
            const question = "What is the character doing?";
            const request: QueryRequest = {
                image: imageBuffer,
                question: question,
                stream: true
            };
            const localAnswer = await getQueryResult(localClient, request);
            const cloudAnswer = await getQueryResult(cloudClient, request);
            expect(cloudAnswer).toEqual(localAnswer);
        }, 100000);
    });

    describe('query-no-stream', () => {
        it('should answer questions about a real image (local)', async () => {
            const question = "What colors are present in this image?";
            const request: QueryRequest = {
                image: imageBuffer,
                question: question,
                stream: false
            };
            const result = await localClient.query(request);
            expect(result.answer).toBeDefined();
            expect(typeof result.answer).toBe('string');
            console.log('Local Answer:', result.answer);
        }, 100000);

        it('should answer questions about a real image (cloud)', async () => {
            const question = "What colors are present in this image?";
            const request: QueryRequest = {
                image: imageBuffer,
                question: question,
                stream: false
            };
            const result = await cloudClient.query(request);
            expect(result.answer).toBeDefined();
            expect(typeof result.answer).toBe('string');
            console.log('Cloud Answer:', result.answer);
        }, 100000);

        it('should have matching query answers for local and cloud (no stream)', async () => {
            const question = "What colors are present in this image?";
            const request: QueryRequest = {
                image: imageBuffer,
                question: question,
                stream: false
            };
            const localResult = await localClient.query(request);
            const cloudResult = await cloudClient.query(request);
            expect(cloudResult.answer).toEqual(localResult.answer);
        }, 100000);
    });

    describe('detect', () => {
        it('should detect objects in a real image (local)', async () => {
            const objectToDetect = "face";
            const request: DetectRequest = {
                image: imageBuffer,
                object: objectToDetect,
            };
            const result = await localClient.detect(request);
            expect(result.objects).toBeDefined();
            expect(Array.isArray(result.objects)).toBe(true);
            console.log('Local Detected objects:', result.objects);
        }, 100000);
    
        it('should detect objects in a real image (cloud)', async () => {
            const objectToDetect = "face";
            const request: DetectRequest = {
                image: imageBuffer,
                object: objectToDetect,
            };
            const result = await cloudClient.detect(request);
            expect(result.objects).toBeDefined();
            expect(Array.isArray(result.objects)).toBe(true);
            console.log('Cloud Detected objects:', result.objects);
        }, 100000);
    
        it('should have matching detected objects for local and cloud', async () => {
            const objectToDetect = "face";
            const request: DetectRequest = {
                image: imageBuffer,
                object: objectToDetect,
            };
            const localResult = await localClient.detect(request);
            const cloudResult = await cloudClient.detect(request);
            expect(cloudResult.objects.length).toEqual(localResult.objects.length);
            localResult.objects.forEach((localObj, index) => {
                const cloudObj = cloudResult.objects[index];
                // If the detected object has location properties, compare them with tolerance.
                if (
                    localObj.x_min !== undefined &&
                    localObj.x_max !== undefined &&
                    localObj.y_min !== undefined &&
                    localObj.y_max !== undefined
                ) {
                    expect(cloudObj.x_min).toBeCloseTo(localObj.x_min, 5);
                    expect(cloudObj.x_max).toBeCloseTo(localObj.x_max, 5);
                    expect(cloudObj.y_min).toBeCloseTo(localObj.y_min, 5);
                    expect(cloudObj.y_max).toBeCloseTo(localObj.y_max, 5);
                } else {
                    // Fallback if location props are missing.
                    expect(cloudObj).toEqual(localObj);
                }
            });
        }, 100000);
    });
    
    describe('point', () => {
        it('should point to objects in a real image (local)', async () => {
            const objectToPoint = "face";
            const request: PointRequest = {
                image: imageBuffer,
                object: objectToPoint,
            };
            const result = await localClient.point(request);
            expect(result.points).toBeDefined();
            expect(Array.isArray(result.points)).toBe(true);
            result.points.forEach(point => {
                expect(point).toHaveProperty('x');
                expect(point).toHaveProperty('y');
                expect(typeof point.x).toBe('number');
                expect(typeof point.y).toBe('number');
            });
            console.log('Local Pointed locations:', result.points);
        }, 100000);
    
        it('should point to objects in a real image (cloud)', async () => {
            const objectToPoint = "face";
            const request: PointRequest = {
                image: imageBuffer,
                object: objectToPoint,
            };
            const result = await cloudClient.point(request);
            expect(result.points).toBeDefined();
            expect(Array.isArray(result.points)).toBe(true);
            result.points.forEach(point => {
                expect(point).toHaveProperty('x');
                expect(point).toHaveProperty('y');
                expect(typeof point.x).toBe('number');
                expect(typeof point.y).toBe('number');
            });
            console.log('Cloud Pointed locations:', result.points);
        }, 100000);
    
        it('should have matching pointed locations for local and cloud', async () => {
            const objectToPoint = "face";
            const request: PointRequest = {
                image: imageBuffer,
                object: objectToPoint,
            };
            const localResult = await localClient.point(request);
            const cloudResult = await cloudClient.point(request);
            expect(cloudResult.points.length).toEqual(localResult.points.length);
            localResult.points.forEach((localPoint, index) => {
                const cloudPoint = cloudResult.points[index];
                expect(cloudPoint.x).toBeCloseTo(localPoint.x, 5);
                expect(cloudPoint.y).toBeCloseTo(localPoint.y, 5);
            });
        }, 100000);
    });
});