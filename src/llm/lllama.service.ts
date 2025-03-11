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
      Analyze the following marathon training plan and provide feedback on its effectiveness for 36 year old runner that already did marathon in 3h20m and wants to go below 3h. What additional information should you get week by week to provide realtime adjustements as plan progresses?
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
