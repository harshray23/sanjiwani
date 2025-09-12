import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function* streamToAsyncGenerator(stream: ReadableStream<any>) {
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8");
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield decoder.decode(value);
    }
  } finally {
    reader.releaseLock();
  }
}
