import pdf from 'pdf-parse';
import { cleanText } from './utils.js';

export async function extractTextFromPdf(buffer) {
  const data = await pdf(buffer);
  const text = (data && data.text) ? data.text : '';
  return cleanText(text);
}
