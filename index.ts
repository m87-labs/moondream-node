// index.ts
import { vl } from './src/moondream';
import fs from 'fs';
import path from 'path';

async function main() {
  // Change these as needed: use your API key or local URL.
  const model = new vl({
    apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlfaWQiOiI3MDI4ODY0Yy01ZmJkLTQ4ZDItYmUyMC0wNjcxOTQwNmRiMTQiLCJpYXQiOjE3NDM5NzkwODF9.1HoCbUW9mGYbrSdM_0iKo8DxXe7xVF1dplKKtlRoasU', // For cloud inference, or omit if using local inference.
    // apiUrl: 'http://localhost:3475', // Uncomment if running a local server.
  });

  // Provide the path to an image file that exists on your machine.
  const imagePath = "/Users/ethanreid/Documents/Professional/jobs/m87/dev/md-node-client/assets/how-to-be-a-people-person-1662995088.jpg" //path.join(__dirname, '/Users/ethanreid/Documents/Professional/jobs/m87/dev/md-node-client/assets/how-to-be-a-people-person-1662995088.jpg');
  const image = fs.readFileSync(imagePath);

  try {
    const result = await model.caption({
      image,
      length: 'normal',
      stream: false
    });
    console.log("Caption:", result.caption);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();