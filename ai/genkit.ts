import { genkit } from 'genkit';
import { ollama } from 'genkitx-ollama';

export const ai = genkit({
  plugins: [
    ollama({
      models: [{ name: 'llama3' }], // Specifies the locally running Llama-3 model
      serverAddress: 'http://127.0.0.1:11434', // Default local Ollama server address
    })
  ],
  model: 'ollama/llama3',
});
