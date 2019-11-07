import React from 'react';

import stream from '../stream';

describe('stream', () => {
  it('adds a doctype to the response', async () => {
    const app = <div>Hello stream</div>;

    const result = await streamResponse(stream(app));

    expect(result).toMatch(/<!DOCTYPE html>/);
    expect(result).toMatch(/Hello stream/);
  });
});

function streamResponse(stream: NodeJS.ReadableStream) {
  return new Promise<string>(resolve => {
    let response: string;

    stream.on('data', data => (response += data));
    stream.on('end', () => resolve(response));
  });
}
