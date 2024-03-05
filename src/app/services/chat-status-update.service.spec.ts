import { TestBed } from '@angular/core/testing';

import { ChatStatusUpdateService } from './chat-status-update.service';

describe('ChatStatusUpdateService', () => {
  let service: ChatStatusUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatStatusUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
