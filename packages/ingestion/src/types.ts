export interface ArchivePromptRecord {
  originalPromptId: string;
  timestamp: string | null;
  sessionId: string | null;
  workingDirectory: string | null;
  source: string | null;
  sha256: string | null;
  originalText: string;
  redactedText: string;
  contentHash: string;
  redactions: string[];
}

export interface ArchiveParseReport {
  sourceName: string;
  records: ArchivePromptRecord[];
  warnings: string[];
}
