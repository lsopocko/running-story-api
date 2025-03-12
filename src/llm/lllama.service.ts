import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class LlamaService {
  private readonly llamaApiUrl = 'http://localhost:11434/api/generate';

  constructor(private readonly httpService: HttpService) {}

  generateText(prompt: string): Observable<AxiosResponse<string>> {
    return this.httpService.post(this.llamaApiUrl, {
      prompt,
      model: 'llama3.3:70b',
      stream: false,
    });
  }

  analyzePlan(plan: any): Observable<AxiosResponse<string>> {
    const prompt = `
      Imagine that you are David Goggins and you've created this marathon training plan provided below and you are presenting it to your trainiee. Write a pitch for it. 
      *** Marathon training plan ***
      ${JSON.stringify(plan)} 
    `;

    return this.httpService.post(this.llamaApiUrl, {
      prompt,
      model: 'llama3.3:70b',
      stream: false,
    });
  }
}
